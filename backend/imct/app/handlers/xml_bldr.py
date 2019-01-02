from _collections import OrderedDict
from datetime import datetime
from itertools import groupby

from obspy.core.inventory.channel import Channel
from obspy.core.inventory.util import Latitude, Longitude, Site
from obspy.core.utcdatetime import UTCDateTime
from sqlalchemy import func
from sqlalchemy.orm import joinedload
from sqlalchemy.sql.expression import or_
from tornado.web import HTTPError

from imct.app.enums.xml_node import XmlNodeEnum, XmlNodeAttrEnum, XmlNodeAttrWindetsEnum
from imct.app.handlers.base import ExtJsHandler, BaseHandler, AsyncThreadMixin
from imct.app.handlers.equipment import EquipmentMixin
from imct.app.models import XmlModel
from imct.app.models import XmlNodeInstModel, XmlNodeAttrValModel, XmlNodeAttrModel, XmlNodeAttrRelationModel
from imct.app.settings import DATE_FORMAT_SYSTEM
from imct.app.utils.date import strptime
from imct.app.utils.imp_exp import ConvertToInventory
from imct.app.utils.inv_valid import ValidateInventory, VALIDATION_RULES
from imct.app.utils.ujson import json_load
from sqlalchemy.orm.util import aliased


class XmlValidationHandler(AsyncThreadMixin, BaseHandler):
    def async_get(self, xml_id, *_, **__):
        try:
            inv = ConvertToInventory(xml_id, self).run()
        except HTTPError as e:
            raise
        except Exception as e:
            raise HTTPError(reason="Unable to build XML: '%s'" % str(e))
        errors = ValidateInventory(inv, self).run()
        return errors


class XmlEpochHandler(AsyncThreadMixin, BaseHandler):
    def async_get(self, xml_id, *_, **__):
        dates = self.db.query(XmlNodeInstModel.start_date)\
            .filter(XmlNodeInstModel.xml_id == xml_id)\
            .distinct()\
            .order_by(XmlNodeInstModel.start_date.desc())\
            .all()
        return list(map(lambda x: {'date': x[0]}, dates))

    def close_end_dates(self, node_inst, utc_now):
        node_inst.end_date = utc_now
        end_date_attrs = node_inst.attr_vals\
            .join(XmlNodeAttrValModel.attr)\
            .options(joinedload(XmlNodeAttrValModel.attr))\
            .filter(XmlNodeAttrModel.name == XmlNodeAttrEnum.END_DATE).all()

        if end_date_attrs and len(end_date_attrs) > 0:
            end_date_attrs[0].value_obj = UTCDateTime(utc_now)

        for child in node_inst.children.filter(or_(XmlNodeInstModel.end_date.is_(None), XmlNodeInstModel.end_date > utc_now)):
            self.close_end_dates(child, utc_now)

    def clone_node(self, node_inst, parent, utc_now):
        # clone node
        clone_obj = node_inst.__class__()
        clone_obj.start_date = utc_now
        clone_obj.xml_id = node_inst.xml_id
        clone_obj.node_id = node_inst.node_id
        clone_obj.parent = parent
        clone_obj.code = node_inst.code
        # clone attribute values
        for node_attr_val in node_inst.attr_vals.join(XmlNodeAttrValModel.attr)\
                .options(joinedload(XmlNodeAttrValModel.attr))\
                .filter(XmlNodeAttrModel.name != XmlNodeAttrEnum.END_DATE):
            clone_node_attr_val = XmlNodeAttrValModel()
            clone_node_attr_val.attr_id = node_attr_val.attr_id
            clone_node_attr_val.node_inst = clone_obj
            if node_attr_val.attr.name == XmlNodeAttrEnum.START_DATE:
                clone_node_attr_val.value_obj = UTCDateTime(utc_now)
            else:
                clone_node_attr_val.value = node_attr_val.value
            clone_obj.attr_vals.append(clone_node_attr_val)
        # repeat for children
        for child in node_inst.children.filter(or_(XmlNodeInstModel.end_date.is_(None), XmlNodeInstModel.end_date > utc_now)):
            self.clone_node(child, clone_obj, utc_now)

        return clone_obj

    def async_post(self, *_, **__):
        node_inst_id = int(self.get_argument('node_inst_id'))
        with self.db.begin():
            node_inst = self.db.query(XmlNodeInstModel).get(node_inst_id)
            utc_now = datetime.utcnow().replace(microsecond=0)
            if not node_inst.end_date or node_inst.end_date > utc_now:
                clonned = self.clone_node(node_inst, node_inst.parent, utc_now)
                self.db.add(clonned)
                self.close_end_dates(node_inst, utc_now)
            self.db.query(XmlModel).filter(XmlModel.id == node_inst.xml_id).update({'updated_at': datetime.utcnow()})
        return {'success': True}


class XmlNodeHandler(AsyncThreadMixin, BaseHandler):

    def get_info_by_node(self, xml_id, node_id):

        filters = self.request_params.get('filter', None)
        start_date = datetime.utcnow()

        if filters and len(filters) > 0:
            value = filters[0].get('value', None)
            if value:
                start_date = strptime(value,  DATE_FORMAT_SYSTEM)
        if node_id == '0':
            node_insts = self.db.query(XmlNodeInstModel)\
                .join(XmlNodeInstModel.node)\
                .options(joinedload(XmlNodeInstModel.node))\
                .filter(XmlNodeInstModel.xml_id == xml_id)\
                .filter(XmlNodeInstModel.parent_id.is_(None))\
                .filter(XmlNodeInstModel.start_date <= start_date)\
                .filter(or_(XmlNodeInstModel.end_date.is_(None), XmlNodeInstModel.end_date > start_date)).all()
        else:
            parent = self.db.query(XmlNodeInstModel).get(int(node_id))
            parentName = aliased(XmlNodeInstModel)
            node_insts = self.db.query(XmlNodeInstModel)\
                .join(XmlNodeInstModel.node)\
                .join(parentName, XmlNodeInstModel.parent)\
                .options(joinedload(XmlNodeInstModel.node))\
                .options(joinedload(XmlNodeInstModel.parent))\
                .filter(XmlNodeInstModel.xml_id == xml_id)\
                .filter(parentName.code == parent.code)\
                .filter(XmlNodeInstModel.start_date <= start_date)\
                .filter(or_(XmlNodeInstModel.end_date.is_(None), XmlNodeInstModel.end_date > start_date)).all()

        node_inst_ids = [o.id for o in node_insts]

        code_attrs = self.db.query(XmlNodeAttrValModel)\
            .join(XmlNodeAttrValModel.attr)\
            .options(joinedload(XmlNodeAttrValModel.attr).joinedload(XmlNodeAttrModel.widget))\
            .filter(XmlNodeAttrValModel.node_inst_id.in_(node_inst_ids))\
            .filter(XmlNodeAttrModel.name.in_([XmlNodeAttrEnum.DESCRIPTION,
                                               XmlNodeAttrEnum.CODE,
                                               XmlNodeAttrEnum.LOCATION_CODE,
                                               XmlNodeAttrEnum.LATITUDE,
                                               XmlNodeAttrEnum.LONGITUDE,
                                               XmlNodeAttrEnum.SITE,
                                               XmlNodeAttrEnum.SENSOR,
                                               XmlNodeAttrEnum.SAMPLE_RATE]))\
            .order_by(XmlNodeAttrValModel.node_inst_id)\
            .all()

        children_count_by_id = dict(self.db.query(XmlNodeInstModel.parent_id, func.count(XmlNodeInstModel.id))
                                    .filter(XmlNodeInstModel.parent_id.in_(node_inst_ids))
                                    .group_by(XmlNodeInstModel.parent_id)
                                    .all())

        attrs_by_inst_id = OrderedDict((k, list(v)) for k, v in groupby(code_attrs, lambda r: r.node_inst_id))

        all_nodes = []

        for node_inst in node_insts:
            attrs = {}
            if node_inst.id in attrs_by_inst_id:
                for attr_inst in attrs_by_inst_id[node_inst.id]:
                    attrs[attr_inst.attr.name] = attr_inst.value_obj

            code = attrs.get(XmlNodeAttrEnum.CODE, 'UKN')
            location_code = attrs.get(XmlNodeAttrEnum.LOCATION_CODE, None)
            description = attrs.get(XmlNodeAttrEnum.DESCRIPTION, '')
            latitude = attrs.get(XmlNodeAttrEnum.LATITUDE, '')
            longitude = attrs.get(XmlNodeAttrEnum.LONGITUDE, '')
            site = attrs.get(XmlNodeAttrEnum.SITE, '')
            sensor = attrs.get(XmlNodeAttrEnum.SENSOR, '')
            sample_rate = attrs.get(XmlNodeAttrEnum.SAMPLE_RATE, '')

            all_nodes.append({
                'id': node_inst.id,
                'code': code,
                'name': "%s.%s" % (location_code if location_code else "--", code) if node_inst.node_id == XmlNodeEnum.CHANNEL else code,
                'start': node_inst.start_date,
                'location_code': location_code,
                'end': node_inst.end_date,
                'latitude': latitude,
                'longitude': longitude,
                'sample_rate': sample_rate,
                'site': site.name if site else '',
                'sensor': sensor.description if sensor else '',
                'parentId': node_id,
                'leaf': node_inst.node_id == XmlNodeEnum.CHANNEL,
                'nodeType': node_inst.node.id,
                'description': description,
                'has_children': node_inst.id in children_count_by_id
            })
        data = sorted(all_nodes, key=lambda r: r['name'].upper())

        last_location_code = 0
        for i in range(len(data)):
            record = data[i]
            record['index'] = i + 1
            record['last'] = True if last_location_code != record['location_code'] and record['nodeType'] != XmlNodeEnum.NETWORK else False
            last_location_code = record['location_code']

        return data

    def async_get(self, xml_id, node_id, *_, **__):
        data = self.get_info_by_node(xml_id, node_id)
        # if node_id == '0' and len(data) == 1:
        #    data[0]['children'] = self.get_info_by_node(xml_id, data[0]['id'])
        #    data[0]['expanded'] = True
        return data

    def clone_node(self, node_inst, xml_id, parent, utc_now):
        # clone node
        clone_obj = node_inst.__class__()
        clone_obj.start_date = utc_now
        clone_obj.xml_id = xml_id
        clone_obj.node_id = node_inst.node_id
        clone_obj.parent = parent
        # clone attribute values
        for node_attr_val in node_inst.attr_vals.join(XmlNodeAttrValModel.attr)\
                .options(joinedload(XmlNodeAttrValModel.attr))\
                .filter(XmlNodeAttrModel.name != XmlNodeAttrEnum.END_DATE):
            clone_node_attr_val = XmlNodeAttrValModel()
            clone_node_attr_val.attr_id = node_attr_val.attr_id
            clone_node_attr_val.node_inst = clone_obj
            if node_attr_val.attr.name == XmlNodeAttrEnum.START_DATE:
                clone_node_attr_val.value_obj = UTCDateTime(utc_now)
            else:
                clone_node_attr_val.value = node_attr_val.value
            clone_obj.attr_vals.append(clone_node_attr_val)
        # repeat for children
        for child in node_inst.children.filter(or_(XmlNodeInstModel.end_date.is_(None), XmlNodeInstModel.end_date > utc_now)):
            self.clone_node(child, xml_id, clone_obj, utc_now)

        self.db.add(XmlNodeAttrValModel(
            node_inst=node_inst,
            attr=self.db.query(XmlNodeAttrModel).filter(XmlNodeAttrModel.name == XmlNodeAttrEnum.START_DATE).first(),
            value_obj=UTCDateTime(utc_now)
        ))

        return clone_obj

    def create_default_node_inst(self, xml_id, node_id, parent, utc_now, index=None):
        code, num_children, child_node_id, required_attrs = self.config.get_cfg_by_node_id(int(node_id))

        required_attrs.extend([XmlNodeAttrEnum.CODE, XmlNodeAttrEnum.START_DATE])

        node_inst = XmlNodeInstModel(xml_id=xml_id, code=code)
        node_inst.start_date = utc_now
        node_inst.node_id = node_id

        code = code + str(index) if index is not None else code

        for required_attr in set(required_attrs):

            attr = self.db.query(XmlNodeAttrModel).filter(XmlNodeAttrModel.name == required_attr).first()

            if required_attr == XmlNodeAttrEnum.CODE:
                val = code
            elif required_attr == XmlNodeAttrEnum.START_DATE:
                val = UTCDateTime(utc_now)
            else:
                if attr.widget.name in [XmlNodeAttrWindetsEnum.FLOAT, XmlNodeAttrWindetsEnum.INT]:
                    val = 0
                elif attr.widget.name in [XmlNodeAttrWindetsEnum.LATITUDE]:
                    val = Latitude(0)
                elif attr.widget.name in [XmlNodeAttrWindetsEnum.LONGITUDE]:
                    val = Longitude(0)
                elif attr.widget.name in [XmlNodeAttrWindetsEnum.DATE]:
                    val = UTCDateTime(0)
                elif attr.widget.name in [XmlNodeAttrWindetsEnum.SITE]:
                    val = Site('')
                else:
                    val = ''
                Channel
            self.db.add(XmlNodeAttrValModel(
                node_inst=node_inst,
                attr=attr,
                value_obj=val
            ))

        node_inst.parent = parent

        if num_children:
            for i in range(num_children):
                self.create_default_node_inst(xml_id, child_node_id, node_inst, utc_now, i)

        return node_inst

    def async_post(self, xml_id, *_, **__):
        params = self.request_params
        with self.db.begin():

            node_inst_id = params.get('node_inst_id', None)
            parent_id = params['parentId']
            node_id = params['nodeType']
            parent = self.db.query(XmlNodeInstModel).get(parent_id) if parent_id else None

            utc_now = datetime.utcnow().replace(microsecond=0)
            if int(node_inst_id) == 0:
                node_inst = self.create_default_node_inst(xml_id, node_id, parent, utc_now)
            else:
                tpl = self.db.query(XmlNodeInstModel).get(node_inst_id)
                node_inst = self.clone_node(tpl, xml_id, parent, utc_now)

            self.db.query(XmlModel).filter(XmlModel.id == xml_id).update({'updated_at': datetime.utcnow()})

            self.db.add(node_inst)

        return {'success': True, 'data': node_inst.id}

    def async_delete(self, xml_id, node_id, *_, **__):
        with self.db.begin():
            self.db.query(XmlNodeInstModel).filter(XmlNodeInstModel.xml_id == xml_id, XmlNodeInstModel.id == node_id).delete()
            self.db.query(XmlModel).filter(XmlModel.id == xml_id).update({'updated_at': datetime.utcnow()})
        return {'success': True}


class XmlNodeAttrHandler(EquipmentMixin, ExtJsHandler):
    model = XmlNodeAttrValModel
    send_total_count = False

    def get_data_query(self):
        return self.db.query(XmlNodeAttrValModel)\
            .join(XmlNodeAttrValModel.attr)\
            .join(XmlNodeAttrModel.widget)\
            .options(joinedload(XmlNodeAttrValModel.attr).joinedload(XmlNodeAttrModel.widget))\
            .options(joinedload(XmlNodeAttrValModel.node_inst))

    def determine_fields(self, *_, **__):
        return ['id', 'attr_name', 'attr_class', 'value_obj', 'attr_id', 'node_inst_id', 'attr_index', 'node_id']

    def serialize(self, q_object, fields):
        resp = super(XmlNodeAttrHandler, self).serialize(q_object, fields)

        if q_object.attr.name == 'response':
            resp['value_obj'] = str(resp['value_obj'])

        _, _, _, required = self.application.config.get_cfg_by_node_id(q_object.node_inst.node_id)
        resp['required'] = q_object.attr_name in required

        return resp

    def create_obj(self):
        obj = XmlNodeAttrValModel()

        obj.node_inst = self.db.query(XmlNodeInstModel).get(self.request_params['node_inst_id'])
        obj.attr = self.db.query(XmlNodeAttrModel).get(self.request_params['attr_id'])

        self.update_obj(obj)

        return obj

    def spread_value_to_channels(self, obj):
        if obj.node_inst.node_id == XmlNodeEnum.STATION:
            spread_to_channels = json_load(self.get_argument('spread_to_channels', 'null'))
            if spread_to_channels and spread_to_channels is True:
                for to_update in self.db.query(XmlNodeAttrValModel)\
                    .join(XmlNodeAttrValModel.node_inst)\
                    .filter(XmlNodeAttrValModel.attr_id == obj.attr.id, XmlNodeInstModel.parent_id == obj.node_inst.id)\
                        .all():
                    to_update.value_obj = obj.value_obj
                    if obj.attr.name in [XmlNodeAttrEnum.START_DATE, XmlNodeAttrEnum.END_DATE]:
                        setattr(to_update.node_inst, obj.attr.name, obj.value_obj.datetime)

    def update_obj(self, obj):
        value = self.request_params['value_obj']
        if obj.attr.name in [XmlNodeAttrEnum.START_DATE, XmlNodeAttrEnum.END_DATE]:
            py_date = strptime(value,  DATE_FORMAT_SYSTEM)
            value = UTCDateTime(py_date)
            setattr(obj.node_inst, obj.attr.name, py_date)
            obj.value_obj = value
            self.spread_value_to_channels(obj)
        elif obj.attr.name in [XmlNodeAttrEnum.CODE]:
            obj.node_inst.code = value
            obj.value_obj = value
        elif obj.attr.name == 'response':
            sensor_keys = value['sensorKeys']
            dataloger_keys = value['dataloggerKeys']
            for attr in self.manage_equipment(obj.node_inst, sensor_keys, dataloger_keys, obj):
                if attr is not None:
                    self.db.add(attr)
        else:
            obj.value_obj = value
            self.spread_value_to_channels(obj)

        self.db.query(XmlModel).filter(XmlModel.id == obj.node_inst.xml_id).update({'updated_at': datetime.utcnow()})

    def async_delete(self, db_id, **__):
        xml_id = self.db.query(XmlNodeAttrValModel).get(db_id).node_inst.xml_id
        XmlNodeAttrValModel
        ret = super(XmlNodeAttrHandler, self).async_delete(db_id)
        self.db.query(XmlModel).filter(XmlModel.id == xml_id).update({'updated_at': datetime.utcnow()})
        return ret


class XmlNodeAvailableAttrHandler(AsyncThreadMixin, BaseHandler):

    def serialize_attr(self, attr):
        return {
            'id': attr.id,
            'name': attr.name,
            'class': attr.widget.name
        }

    def async_get(self, node_id, *_, **__):

        data = []

        node_inst = self.db.query(XmlNodeInstModel).get(node_id)

        set_attrs = self.db.query(XmlNodeAttrValModel.attr_id)\
            .filter(XmlNodeAttrValModel.node_inst_id == node_inst.id)

        node_attrs = self.db.query(XmlNodeAttrRelationModel)\
            .join(XmlNodeAttrRelationModel.attr)\
            .join(XmlNodeAttrModel.widget)\
            .options(joinedload(XmlNodeAttrRelationModel.attr).joinedload(XmlNodeAttrModel.widget))\
            .filter(XmlNodeAttrRelationModel.node_id == node_inst.node_id)\
            .filter(XmlNodeAttrModel.id.notin_(set_attrs))\
            .all()

        for node_attr in node_attrs:
            data.append(self.serialize_attr(node_attr.attr))

        return data


class XmlNodeAttrValidateHandler(AsyncThreadMixin, BaseHandler):
    def async_post(self, *_, **__):
        params = self.request_params
        node_id = params['node_id']
        attr_name = params['attr_name']
        value = params.get('value', None)
        only_critical = params.get('only_critical', False)

        rules = VALIDATION_RULES.get(node_id, {}).get(attr_name, [])
        messages = []
        for rule in rules:
            if not only_critical or rule.critical:
                res = rule.validate(value)
                if res is not True:
                    messages.append(res)
        return {'success': len(messages) == 0, 'message': messages}
