from imct.app.enums.xml_node import XmlNodeEnum
from imct.app.enums.configs import NetworkCfgEnum, StationCfgEnum,\
    ChannelCfgEnum


class ConfigDict(object):

    def __init__(self, config_list):
        self.configs = self.map_config(config_list)

    def get(self, group, var=None):
        group_confg = self.configs.get(group)
        if var is not None:
            if group_confg:
                return group_confg.get(var)
            else:
                return None
        else:
            return group_confg

    def map_config(self, configs):
        config_dict = {}
        for c in configs:
            if c.group not in config_dict:
                config_dict[c.group] = {}
            config_dict[c.group][c.name] = c.value_obj
        return config_dict

    def get_cfg_by_node_id(self, node_id):
        if node_id == XmlNodeEnum.NETWORK:
            return self.get(*NetworkCfgEnum.CODE), self.get(*NetworkCfgEnum.NUM_STATIONS), XmlNodeEnum.STATION, self.get(*NetworkCfgEnum.REQUIRED_FIELDS)
        elif node_id == XmlNodeEnum.STATION:
            return self.get(*StationCfgEnum.CODE), self.get(*StationCfgEnum.NUM_CHANNELS), XmlNodeEnum.CHANNEL, self.get(*StationCfgEnum.REQUIRED_FIELDS)
        elif node_id == XmlNodeEnum.CHANNEL:
            return self.get(*ChannelCfgEnum.CODE), 0, None, self.get(*ChannelCfgEnum.REQUIRED_FIELDS)
