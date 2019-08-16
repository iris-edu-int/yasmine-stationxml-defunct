class GeneralCfgEnum(object):
    GROUP_ID = 'general'
    SOURCE = (GROUP_ID, 'source')
    MODULE = (GROUP_ID, 'module')
    URI = (GROUP_ID, 'uri')
    DATE_FORMAT_LONG = (GROUP_ID, 'date_format_long')
    DATE_FORMAT_SHORT = (GROUP_ID, 'date_format_short')


class NetworkCfgEnum(object):
    GROUP_ID = 'network'
    CODE = (GROUP_ID, 'code')
    NUM_STATIONS = (GROUP_ID, 'num_stations')
    REQUIRED_FIELDS = (GROUP_ID, 'required_fields')


class StationCfgEnum(object):
    GROUP_ID = 'station'
    CODE = (GROUP_ID, 'code')
    NUM_CHANNELS = (GROUP_ID, 'num_channels')
    REQUIRED_FIELDS = (GROUP_ID, 'required_fields')


class ChannelCfgEnum(object):
    GROUP_ID = 'channel'
    CODE = (GROUP_ID, 'code')
    REQUIRED_FIELDS = (GROUP_ID, 'required_fields')
