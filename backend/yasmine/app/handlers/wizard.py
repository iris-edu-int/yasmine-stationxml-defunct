from yasmine.app.handlers.base import AsyncThreadMixin, BaseHandler
from yasmine.app.enums.xml_node import XmlNodeAttrEnum, XmlNodeEnum
from datetime import datetime
from yasmine.app.models.inventory import XmlNodeAttrModel, XmlNodeAttrValModel, XmlNodeModel, XmlNodeInstModel
from sqlalchemy.orm import joinedload
from yasmine.app.handlers.equipment import EquipmentMixin
from yasmine.app.utils.nrl_io import GuessChannelCode


class CreateGuessCodeHandler(AsyncThreadMixin, BaseHandler):
    def async_post(self, *_, **__):
        params = self.request_params
        sensor_keys = params.get('sensorKeys')
        dataloger_keys = params.get('dataloggerKeys')
        chan_code, _ = GuessChannelCode(self.application).run(sensor_keys, dataloger_keys)
        return chan_code


class CreateChannelHandler(AsyncThreadMixin, EquipmentMixin, BaseHandler):
    def async_get(self, station_node_id, **__):

        parents_attr_vals = self.db.query(XmlNodeAttrValModel)\
            .join(XmlNodeAttrValModel.attr)\
            .options(joinedload(XmlNodeAttrValModel.attr))\
            .filter(XmlNodeAttrValModel.node_inst_id == station_node_id)\
            .filter(XmlNodeAttrModel.name.in_([XmlNodeAttrEnum.LATITUDE,
                                               XmlNodeAttrEnum.LONGITUDE,
                                               XmlNodeAttrEnum.ELEVATION]))\
            .all()

        attr_by_name = {}
        for attr_val in parents_attr_vals:
            attr_by_name[attr_val.attr.name] = attr_val.value_obj

        data = {
            'id': station_node_id,
            '%s1' % XmlNodeAttrEnum.CODE: '',
            '%s2' % XmlNodeAttrEnum.CODE: '',
            '%s3' % XmlNodeAttrEnum.CODE: '',
            XmlNodeAttrEnum.LATITUDE: attr_by_name.get(XmlNodeAttrEnum.LATITUDE, ''),
            XmlNodeAttrEnum.LONGITUDE: attr_by_name.get(XmlNodeAttrEnum.LONGITUDE, ''),
            XmlNodeAttrEnum.ELEVATION: attr_by_name.get(XmlNodeAttrEnum.ELEVATION, ''),
            XmlNodeAttrEnum.START_DATE: datetime.utcnow(),
            XmlNodeAttrEnum.DEPTH: 0,
            '%s1' % XmlNodeAttrEnum.DIP: 0,
            '%s2' % XmlNodeAttrEnum.DIP: 0,
            '%s3' % XmlNodeAttrEnum.DIP: 0,
            '%s1' % XmlNodeAttrEnum.AZIMUTH: 0,
            '%s2' % XmlNodeAttrEnum.AZIMUTH: 0,
            '%s3' % XmlNodeAttrEnum.AZIMUTH: 0
        }
        return data

    def create_attr(self, node_inst, attr_name, value=None):
        if value is None:
            value = self.request_params.get(attr_name, None)
        if len(str(value)) > 0:
            attr = self.db.query(XmlNodeAttrModel).filter(XmlNodeAttrModel.name == attr_name).first()
            node_inst.attr_vals.append(XmlNodeAttrValModel(attr=attr, value_obj=value))

    def create_channel(self, parent, channel_node, sensor_keys, dataloger_keys, code, dip, azimuth, start_date):

        inst = XmlNodeInstModel(parent=parent, node=channel_node, xml_id=parent.xml_id, code=code, start_date=start_date)
        self.create_attr(inst, XmlNodeAttrEnum.CODE, code)
        self.create_attr(inst, XmlNodeAttrEnum.LOCATION_CODE)
        self.create_attr(inst, XmlNodeAttrEnum.LATITUDE)
        self.create_attr(inst, XmlNodeAttrEnum.LONGITUDE)
        self.create_attr(inst, XmlNodeAttrEnum.ELEVATION)
        self.create_attr(inst, XmlNodeAttrEnum.START_DATE)
        self.create_attr(inst, XmlNodeAttrEnum.DEPTH)
        self.create_attr(inst, XmlNodeAttrEnum.AZIMUTH, azimuth)
        self.create_attr(inst, XmlNodeAttrEnum.DIP, dip)

        for attr in self.manage_equipment(inst, sensor_keys, dataloger_keys):
            if attr is not None:
                inst.attr_vals.append(attr)

        self.db.add(inst)

    def async_put(self, station_node_id, **__):
        params = self.request_params
        channel_node = self.db.query(XmlNodeModel).get(XmlNodeEnum.CHANNEL)

        with self.db.begin():
            sensor_keys = params.get('sensorKeys')
            dataloger_keys = params.get('dataloggerKeys')
            start_date = params.get(XmlNodeAttrEnum.START_DATE)
            parent = self.db.query(XmlNodeInstModel).get(station_node_id)

            for i in range(1, 4):
                code = params.get('%s%s' % (XmlNodeAttrEnum.CODE, i), None)
                if code and len(code) > 0:
                    dip = params.get('%s%s' % (XmlNodeAttrEnum.DIP, i), None)
                    azimuth = params.get('%s%s' % (XmlNodeAttrEnum.AZIMUTH, i), None)
                    self.create_channel(parent, channel_node, sensor_keys, dataloger_keys, code, dip, azimuth, start_date)

        return {'success': True}
