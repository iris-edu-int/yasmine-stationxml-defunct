from _collections import OrderedDict
from datetime import datetime
from itertools import groupby

from sqlalchemy.orm import joinedload
from sqlalchemy.sql.expression import or_

from yasmine.app.enums.xml_node import XmlNodeAttrEnum, XmlNodeEnum
from yasmine.app.handlers.base import AsyncThreadMixin, BaseHandler
from yasmine.app.models import XmlNodeAttrModel, XmlNodeAttrValModel, XmlNodeInstModel
from yasmine.app.utils.date import strptime
from yasmine.app.settings import DATE_FORMAT_SYSTEM


class XmlTemplateHandler(AsyncThreadMixin, BaseHandler):

    def async_get(self, node_id, **__):
        node_insts = self.db.query(XmlNodeInstModel)\
            .options(joinedload(XmlNodeInstModel.node))\
            .filter(XmlNodeInstModel.node_id == node_id, XmlNodeInstModel.xml_id == None, XmlNodeInstModel.parent_id == None).all()  # @IgnorePep8

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
                'parentId': node_id,
                'description': description,
                'latitude': latitude,
                'longitude': longitude,
                'site': site.name if site else '',
                'sensor': sensor.description if sensor else '',
                'sample_rate': sample_rate
            })

        data = sorted(all_nodes, key=lambda r: r['name'].upper())

        for i in range(len(data)):
            data[i]['index'] = i + 1

        code, _, _, _ = self.config.get_cfg_by_node_id(int(node_id))

        data.insert(0, {
            'id': 0,
            'code': code,
            'name': code,
            'parentId': None,
            'description': 'Create new (default)'
        })
        return data

    def clone_node(self, node_inst, epoch, parent):
        # clone node
        clone_obj = node_inst.__class__()
        clone_obj.xml_id = None
        clone_obj.node_id = node_inst.node_id
        clone_obj.parent = parent
        # clone attribute values
        for node_attr_val in node_inst.attr_vals:
            if node_attr_val.attr.name not in [XmlNodeAttrEnum.START_DATE, XmlNodeAttrEnum.END_DATE]:
                clone_node_attr_val = XmlNodeAttrValModel()
                clone_node_attr_val.attr_id = node_attr_val.attr_id
                clone_node_attr_val.node_inst = clone_obj
                clone_node_attr_val.value = node_attr_val.value
                clone_obj.attr_vals.append(clone_node_attr_val)

        # repeat for children
        for child in node_inst.children.filter(XmlNodeInstModel.start_date <= epoch, or_(XmlNodeInstModel.end_date.is_(None), XmlNodeInstModel.end_date > epoch)):
            self.clone_node(child, epoch, clone_obj)
        return clone_obj

    def async_post(self, *_, **__):
        node_inst_id = self.get_arguments('node_inst_id')
        epoch = self.get_argument('epoch')

        if epoch:
            epoch = strptime(epoch,  DATE_FORMAT_SYSTEM)
        else:
            epoch = datetime.utcnow()

        with self.db.begin():
            node_inst = self.db.query(XmlNodeInstModel).get(node_inst_id)
            self.db.add(self.clone_node(node_inst, epoch, None))
        return {'success': True}

    def async_delete(self, node_id, **__):
        with self.db.begin():
            self.db.query(XmlNodeInstModel).filter(XmlNodeInstModel.xml_id == None, XmlNodeInstModel.id == node_id, XmlNodeInstModel.parent_id == None).delete()  # @IgnorePep8
        return {'success': True}
