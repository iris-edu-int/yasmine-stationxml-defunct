import re

from obspy.core.inventory.util import Equipment

from yasmine.app.enums.xml_node import XmlNodeAttrEnum
from yasmine.app.models.inventory import XmlNodeAttrModel, XmlNodeAttrValModel
from yasmine.app.utils.nrl_io import GetDataloger, GetSensor, GetResponse


class EquipmentMixin(object):

    def recreate_attr(self, node_inst, attr_name):
        attr_id = self.db.query(XmlNodeAttrModel).filter(XmlNodeAttrModel.name == attr_name).first().id
        if node_inst.id:
            self.db.query(XmlNodeAttrValModel)\
                .filter(XmlNodeAttrValModel.attr_id == attr_id)\
                .filter(XmlNodeAttrValModel.node_inst_id == node_inst.id)\
                .delete()
        # create new attr
        return XmlNodeAttrValModel(node_inst=node_inst, attr_id=attr_id)

    def manage_equipment(self, node_inst, sensor_keys, dataloger_keys, response_attr=None):

        sensor_attr = None
        datalogger_attr = None
        sample_rate_attr = None
        datalogger = None

        if sensor_keys and len(sensor_keys) > 0:
            sensor_attr = self.recreate_attr(node_inst, XmlNodeAttrEnum.SENSOR)
            sensor_attr.value_obj = Equipment(manufacturer=sensor_keys[0], model=', '.join(sensor_keys[1: -1]), description=GetSensor(sensor_keys, self.application).run()[0])

        if dataloger_keys and len(dataloger_keys) > 0:
            datalogger_attr = self.recreate_attr(node_inst, XmlNodeAttrEnum.DATA_LOGGER)
            datalogger = GetDataloger(dataloger_keys, self.application).run()
            datalogger_attr.value_obj = Equipment(manufacturer=dataloger_keys[0], model=', '.join(dataloger_keys[1: -1]), description=datalogger[0])

        if datalogger:
            sample_rate = re.search('([0-9]*\.?[0-9]+)\s+sps', datalogger[0])
            if sample_rate and sample_rate[1]:
                sample_rate_attr = self.recreate_attr(node_inst, XmlNodeAttrEnum.SAMPLE_RATE)
                sample_rate_attr.value_obj = sample_rate[1]

        if sensor_keys and len(sensor_keys) > 0 and dataloger_keys and len(dataloger_keys) > 0:
            response_attr = response_attr or self.recreate_attr(node_inst, XmlNodeAttrEnum.RESPONSE)
            response_attr.value_obj = GetResponse(sensor_keys, dataloger_keys, self.application).run()

        return sensor_attr, datalogger_attr, sample_rate_attr, response_attr
