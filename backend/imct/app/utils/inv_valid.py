from imct.app.enums.xml_error import XmlErrorEnum
from imct.app.utils.facade import HandlerMixin
from imct.app.enums.xml_node import XmlNodeEnum, XmlNodeAttrEnum
from datetime import datetime, date
from imct.app.utils.date import strptime
from imct.app.settings import DATE_FORMAT_SYSTEM


class ValidateBase(object):
    MESSSAGE_BASE = "Value error"


class ValueRequired(ValidateBase):
    MESSSAGE = "Attribute '%s' required."

    def __init__(self, attr_name, critical=True):
        self.attr_name = attr_name
        self.critical = critical

    def validate(self, value):
        try:
            if self.is_empty(value):
                return ValueRequired.MESSSAGE % self.attr_name
            else:
                return True
        except Exception:
            return self.MESSSAGE_BASE

    def is_empty(self, value):
        if self.is_simple(value):
            return self.is_simple_empty(value)
        elif isinstance(value, list):
            return self.is_array_empty(value)
        elif isinstance(value, dict):
            return self.is_dict_empty(value)
        elif isinstance(value, object):
            return self.is_object_empty(value)
        return False

    def is_simple(self, value):
        if value is None or isinstance(value, str) or isinstance(value, float) or isinstance(value, int) or isinstance(value, datetime) or isinstance(value, date):
            return True
        return False

    def is_simple_empty(self, value):
        if value is None or (isinstance(value, str) and value.strip() == ""):
            return True
        else:
            return False

    def is_array_empty(self, values):
        for val in values:
            if not self.is_empty(val):
                return False
        return True

    def is_dict_empty(self, value):
        for _, v in value.items():
            if not self.is_empty(v):
                return False
        return True

    def is_object_empty(self, value):
        return self.is_dict_empty(value.__dict__)


class ValueLength(ValidateBase):
    MESSSAGE_MIN = "Attribute '%s' contains less than %s characters."
    MESSSAGE_MAX = "Attribute '%s' contains more than %s characters."

    def __init__(self, attr_name, min_length, max_length, critical=True):
        self.attr_name = attr_name
        self.min_val = min_length
        self.max_val = max_length
        self.critical = critical

    def validate(self, value):
        if ValueRequired(self.attr_name).validate(value) is True:
            try:
                if len(str(value)) < self.min_val:
                    return ValueLength.MESSSAGE_MIN % (self.attr_name, self.min_val)
                if len(str(value)) > self.max_val:
                    return ValueLength.MESSSAGE_MAX % (self.attr_name, self.max_val)
            except Exception:
                return self.MESSSAGE_BASE
        return True


class ValueWithinRange(ValidateBase):
    MESSSAGE_MIN = "Attribute '%s' is less than %s."
    MESSSAGE_MAX = "Attribute '%s' is greater or equal than %s."

    def __init__(self, attr_name, min_val, max_val, critical=True):
        self.attr_name = attr_name
        self.min_val = min_val
        self.max_val = max_val
        self.critical = critical

    def validate(self, value):
        if ValueRequired(self.attr_name).validate(value) is True:
            try:
                if float(value) < self.min_val:
                    return ValueWithinRange.MESSSAGE_MIN % (self.attr_name, self.min_val)
                if float(value) >= self.max_val:
                    return ValueWithinRange.MESSSAGE_MAX % (self.attr_name, self.max_val)
            except Exception:
                return self.MESSSAGE_BASE
        return True


class UTCDateRequired(ValidateBase):
    MESSSAGE_MAX = "The '%s' should be equal or before UTC now time."
    WRONG_FORMAT = "Wrong date format"

    def __init__(self, attr_name, critical=True):
        self.attr_name = attr_name
        self.critical = critical

    def validate(self, value):
        if ValueRequired(self.attr_name).validate(value) is True:
            if isinstance(value, str):
                try:
                    value = strptime(value,  DATE_FORMAT_SYSTEM)
                except Exception:
                    return UTCDateRequired.WRONG_FORMAT
            if value > datetime.utcnow():
                return UTCDateRequired.MESSSAGE_MAX % self.attr_name
        return True


class ValueDipRange(ValidateBase):
    MESSSAGE_MIN = "Attribute '%s' is less than %s."
    MESSSAGE_MAX = "Attribute '%s' is greater than %s."

    def __init__(self, attr_name, min_val, max_val, critical=True):
        self.attr_name = attr_name
        self.min_val = min_val
        self.max_val = max_val
        self.critical = critical

    def validate(self, value):
        if ValueRequired(self.attr_name).validate(value) is True:
            try:
                if value < self.min_val:
                    return ValueWithinRange.MESSSAGE_MIN % (self.attr_name, self.min_val)
                if value > self.max_val:
                    return ValueWithinRange.MESSSAGE_MAX % (self.attr_name, self.max_val)
            except Exception:
                return self.MESSSAGE_BASE
        return True


VALIDATION_RULES = {
    XmlNodeEnum.NETWORK: {
        XmlNodeAttrEnum.CODE: [ValueRequired(XmlNodeAttrEnum.CODE, True), ValueLength(XmlNodeAttrEnum.CODE, 2, 2, True)],
        XmlNodeAttrEnum.ALT_CODE: [ValueRequired(XmlNodeAttrEnum.ALT_CODE, False), ValueLength(XmlNodeAttrEnum.ALT_CODE, 2, 2, True)],
        XmlNodeAttrEnum.HISTORICAL_CODE: [ValueRequired(XmlNodeAttrEnum.HISTORICAL_CODE, False), ValueLength(XmlNodeAttrEnum.HISTORICAL_CODE, 2, 2, True)],
        XmlNodeAttrEnum.START_DATE: [ValueRequired(XmlNodeAttrEnum.START_DATE, True), UTCDateRequired(XmlNodeAttrEnum.START_DATE, True)],
        XmlNodeAttrEnum.END_DATE: [ValueRequired(XmlNodeAttrEnum.END_DATE, False)],
        XmlNodeAttrEnum.COMMENTS: [ValueRequired(XmlNodeAttrEnum.COMMENTS, False)],
        XmlNodeAttrEnum.DESCRIPTION: [ValueRequired(XmlNodeAttrEnum.DESCRIPTION, False)],
        XmlNodeAttrEnum.RESTRICTED_STATUS: [ValueRequired(XmlNodeAttrEnum.RESTRICTED_STATUS, False)]
    },
    XmlNodeEnum.STATION: {
        XmlNodeAttrEnum.CODE: [ValueRequired(XmlNodeAttrEnum.CODE, True), ValueLength(XmlNodeAttrEnum.CODE, 3, 5, True)],
        XmlNodeAttrEnum.ALT_CODE: [ValueRequired(XmlNodeAttrEnum.ALT_CODE, False), ValueLength(XmlNodeAttrEnum.ALT_CODE, 3, 5, True)],
        XmlNodeAttrEnum.HISTORICAL_CODE: [ValueRequired(XmlNodeAttrEnum.HISTORICAL_CODE, False), ValueLength(XmlNodeAttrEnum.HISTORICAL_CODE, 3, 5, True)],
        XmlNodeAttrEnum.START_DATE: [ValueRequired(XmlNodeAttrEnum.START_DATE, True), UTCDateRequired(XmlNodeAttrEnum.START_DATE, True)],
        XmlNodeAttrEnum.END_DATE: [ValueRequired(XmlNodeAttrEnum.END_DATE, False)],
        XmlNodeAttrEnum.COMMENTS: [ValueRequired(XmlNodeAttrEnum.COMMENTS, False)],
        XmlNodeAttrEnum.DESCRIPTION: [ValueRequired(XmlNodeAttrEnum.DESCRIPTION, False)],
        XmlNodeAttrEnum.RESTRICTED_STATUS: [ValueRequired(XmlNodeAttrEnum.RESTRICTED_STATUS, False)],
        XmlNodeAttrEnum.TERMINATION_DATE: [ValueRequired(XmlNodeAttrEnum.TERMINATION_DATE, False)],
        XmlNodeAttrEnum.CREATION_DATE: [ValueRequired(XmlNodeAttrEnum.CREATION_DATE, True)],
        XmlNodeAttrEnum.SITE: [ValueRequired(XmlNodeAttrEnum.SITE, True)],
        XmlNodeAttrEnum.LATITUDE: [ValueRequired(XmlNodeAttrEnum.LATITUDE, True), ValueWithinRange(XmlNodeAttrEnum.LATITUDE, -90, 90, True)],
        XmlNodeAttrEnum.LONGITUDE: [ValueRequired(XmlNodeAttrEnum.LONGITUDE, True), ValueWithinRange(XmlNodeAttrEnum.LONGITUDE, -180, 180, True)],
        XmlNodeAttrEnum.ELEVATION: [ValueRequired(XmlNodeAttrEnum.ELEVATION, False)],
        XmlNodeAttrEnum.VAULT: [ValueRequired(XmlNodeAttrEnum.VAULT, False)],
        XmlNodeAttrEnum.GEOLOGY: [ValueRequired(XmlNodeAttrEnum.GEOLOGY, False)],
        XmlNodeAttrEnum.OPERATORS: [ValueRequired(XmlNodeAttrEnum.OPERATORS, False)]
    },
    XmlNodeEnum.CHANNEL: {
        XmlNodeAttrEnum.CODE: [ValueRequired(XmlNodeAttrEnum.CODE, True), ValueLength(XmlNodeAttrEnum.CODE, 0, 13, True)],
        XmlNodeAttrEnum.LOCATION_CODE: [ValueRequired(XmlNodeAttrEnum.LOCATION_CODE, False), ValueLength(XmlNodeAttrEnum.LOCATION_CODE, 0, 12, True)],
        XmlNodeAttrEnum.ALT_CODE: [ValueRequired(XmlNodeAttrEnum.ALT_CODE, False), ValueLength(XmlNodeAttrEnum.ALT_CODE, 0, 13, False)],
        XmlNodeAttrEnum.HISTORICAL_CODE: [ValueRequired(XmlNodeAttrEnum.HISTORICAL_CODE, False), ValueLength(XmlNodeAttrEnum.HISTORICAL_CODE, 0, 13, False)],
        XmlNodeAttrEnum.START_DATE: [ValueRequired(XmlNodeAttrEnum.START_DATE, True), UTCDateRequired(XmlNodeAttrEnum.START_DATE, True)],
        XmlNodeAttrEnum.END_DATE: [ValueRequired(XmlNodeAttrEnum.END_DATE, False)],
        XmlNodeAttrEnum.COMMENTS: [ValueRequired(XmlNodeAttrEnum.COMMENTS, False)],
        XmlNodeAttrEnum.DESCRIPTION: [ValueRequired(XmlNodeAttrEnum.DESCRIPTION, False)],
        XmlNodeAttrEnum.RESTRICTED_STATUS: [ValueRequired(XmlNodeAttrEnum.RESTRICTED_STATUS, False)],
        XmlNodeAttrEnum.LATITUDE: [ValueRequired(XmlNodeAttrEnum.LATITUDE, True), ValueWithinRange(XmlNodeAttrEnum.LATITUDE, -90, 90, True)],
        XmlNodeAttrEnum.LONGITUDE: [ValueRequired(XmlNodeAttrEnum.LONGITUDE, True), ValueWithinRange(XmlNodeAttrEnum.LONGITUDE, -180, 180, True)],
        XmlNodeAttrEnum.ELEVATION: [ValueRequired(XmlNodeAttrEnum.ELEVATION, True)],
        XmlNodeAttrEnum.DEPTH: [ValueRequired(XmlNodeAttrEnum.DEPTH, True)],
        XmlNodeAttrEnum.AZIMUTH: [ValueRequired(XmlNodeAttrEnum.AZIMUTH, False), ValueWithinRange(XmlNodeAttrEnum.AZIMUTH, 0, 360, True)],
        XmlNodeAttrEnum.DIP: [ValueRequired(XmlNodeAttrEnum.DIP, False), ValueDipRange(XmlNodeAttrEnum.DIP, -90, 90, True)],
        XmlNodeAttrEnum.TYPES: [ValueRequired(XmlNodeAttrEnum.TYPES, False)],
        XmlNodeAttrEnum.EXTERNAL_REFERENCES: [ValueRequired(XmlNodeAttrEnum.EXTERNAL_REFERENCES, False)],
        XmlNodeAttrEnum.SAMPLE_RATE: [ValueRequired(XmlNodeAttrEnum.SAMPLE_RATE, False)],
        XmlNodeAttrEnum.SAMPLE_RATE_RATIO_NUMBER_SAMPLES: [ValueRequired(XmlNodeAttrEnum.SAMPLE_RATE_RATIO_NUMBER_SAMPLES, False)],
        XmlNodeAttrEnum.SAMPLE_RATE_RATIO_NUMBER_SECONDS: [ValueRequired(XmlNodeAttrEnum.SAMPLE_RATE_RATIO_NUMBER_SECONDS, False)],
        XmlNodeAttrEnum.STORAGE_FORMAT: [ValueRequired(XmlNodeAttrEnum.STORAGE_FORMAT, False)],
        XmlNodeAttrEnum.CLOCK_DRIFT_IN_SECONDS_PER_SAMPLE: [ValueRequired(XmlNodeAttrEnum.CLOCK_DRIFT_IN_SECONDS_PER_SAMPLE, False)],
        XmlNodeAttrEnum.CALIBRATION_UNITS: [ValueRequired(XmlNodeAttrEnum.CALIBRATION_UNITS, False)],
        XmlNodeAttrEnum.CALIBRATION_UNITS_DESCRIPTION: [ValueRequired(XmlNodeAttrEnum.CALIBRATION_UNITS_DESCRIPTION, False)],
        XmlNodeAttrEnum.SENSOR: [ValueRequired(XmlNodeAttrEnum.SENSOR, False)],
        XmlNodeAttrEnum.PRE_AMPLIFIER: [ValueRequired(XmlNodeAttrEnum.PRE_AMPLIFIER, False)],
        XmlNodeAttrEnum.DATA_LOGGER: [ValueRequired(XmlNodeAttrEnum.DATA_LOGGER, False)],
        XmlNodeAttrEnum.EQUIPMENT: [ValueRequired(XmlNodeAttrEnum.EQUIPMENT, False)],
        XmlNodeAttrEnum.RESPONSE: [ValueRequired(XmlNodeAttrEnum.RESPONSE, False)]
    }
}


class ValidateInventory(HandlerMixin):

    def __init__(self, inv, application=None, critical_only=True, *_, **__):
        self.inv = inv
        self.critical_only = critical_only
        super(ValidateInventory, self).__init__(application)

    def get_first_start_last_end_dates(self, station_or_channel_list):
        newlist = sorted(station_or_channel_list, key=lambda x: x.start_date, reverse=False)
        earliest_start = newlist[0].start_date
        newlist = sorted(station_or_channel_list, key=lambda x: x.end_date, reverse=True)
        latest_end = newlist[0].end_date
        return(earliest_start, latest_end)

    def validate_level(self, obj, level, prefix):
        level_rules = VALIDATION_RULES.get(level, [])
        errors = []

        for _, rules in level_rules.items():
            for rule in rules:
                if (self.critical_only and rule.critical) or not self.critical_only:
                    res = rule.validate(getattr(obj, rule.attr_name))
                    if res is not True:
                        errors.append("%s: %s" % (prefix, res))
        return errors

    def validate_network(self, network, prefix):
        errors = self.validate_level(network, XmlNodeEnum.NETWORK, prefix)
        if not self.critical_only:
            if network.start_date:
                (earliest_start_date, latest_end_date) = self.get_first_start_last_end_dates(network.stations)
                if earliest_start_date < network.start_date:
                    errors.append("%s:" % (prefix, XmlErrorEnum.ERROR_105b))
                if network.end_date is not None:
                    # if network.start_date.timestamp >= network.end_date.timestamp:
                    if network.start_date >= network.end_date:
                        errors.append("%s:" % (prefix, XmlErrorEnum.ERROR_105))
                    if latest_end_date > network.end_date:
                        errors.append("%s:" % (prefix, XmlErrorEnum.ERROR_105c))

            nstations = len(network.stations)
            if nstations:
                stations_dict = {}
                # Count occurrence of each station.code
                for station in network.stations:
                    if station.code in stations_dict:
                        stations_dict[station.code] += 1
                    else:
                        stations_dict[station.code] = 1

                # If station.code occurs more than once, make sure epochs don't overlap
                for key in stations_dict.keys():
                    if stations_dict[key] > 1:
                        sorted_list = []
                        for station in network.stations:
                            if station.code == key:
                                sorted_list.append(station)

                        # Sort epochs chronologically by start_date and test consecutive epochs for overlap
                        sorted_list.sort(key=lambda x: x.start_date, reverse=False)
                        for i, station in enumerate(sorted_list):
                            if i > 0:
                                epoch1 = sorted_list[i - 1]
                                epoch2 = station
                                overlap = False
                                # epoch1 start_date <= epoch2 start_date guaranteed from sort
                                if epoch1.start_date == epoch2.start_date:
                                    overlap = True
                                # epoch1 better be closed
                                elif epoch1.end_date is None:
                                    overlap = True
                                # epoch1 close must precede epoch2 start
                                elif epoch1.end_date > epoch2.start_date:
                                    overlap = True
                                if overlap:
                                    errors.append("%s:" % (prefix, XmlErrorEnum.ERROR_152))
        return errors

    def validate_station(self, station, prefix):
        errors = self.validate_level(station, XmlNodeEnum.STATION, prefix)

        if not self.critical_only:
            if station.end_date is not None and station.start_date is not None:
                if station.start_date >= station.end_date:
                    errors.append("%s:" % (prefix, XmlErrorEnum.ERROR_205))

            nchannels = len(station.channels)
            if nchannels:
                for channel in station.channels:
                    if channel.start_date is None:
                        errors.append("Channel %s.%s has empty start_date --> Can't sort/test epochs!" % (channel.location_code, channel.code))
                channel_dict = {}
                # Count occurrence of each channel.code.join(location_code)
                for channel in station.channels:
                    chan_key = "%s.%s" % (channel.location_code, channel.code)
                    if chan_key in channel_dict:
                        channel_dict[chan_key] += 1
                    else:
                        channel_dict[chan_key] = 1
                # If channel key occurs more than once, make sure epochs don't overlap
                for key in channel_dict.keys():
                    if channel_dict[key] > 1:
                        sorted_list = []
                        for channel in station.channels:
                            chan_key = "%s.%s" % (channel.location_code, channel.code)
                            if chan_key == key:
                                sorted_list.append(channel)

                        # Sort epochs chronologically by start_date and test consecutive epochs for overlap
                        sorted_list.sort(key=lambda x: x.start_date, reverse=False)
                        for i, channel in enumerate(sorted_list):
                            if i > 0:
                                epoch1 = sorted_list[i - 1]
                                epoch2 = channel
                                overlap = False
                                # epoch1 start_date <= epoch2 start_date guaranteed from sort
                                if epoch1.start_date == epoch2.start_date:
                                    overlap = True
                                # epoch1 better be closed
                                elif epoch1.end_date is None:
                                    overlap = True
                                # epoch1 close must precede epoch2 start
                                elif epoch1.end_date > epoch2.start_date:
                                    overlap = True
                                if overlap:
                                    errors.append("%s:" % (prefix, XmlErrorEnum.ERROR_252))
        return errors

    def validate_channel(self, channel, prefix):
        errors = self.validate_level(channel, XmlNodeEnum.CHANNEL, prefix)

        if not self.critical_only:
            if channel.end_date is not None and channel.start_date is not None:
                if channel.start_date >= channel.end_date:
                    errors.append("%s:" % (prefix, XmlErrorEnum.ERROR_305))

        return errors

    def check_levele_is_active(self, level, utc_now):
        return level.end_date is None or level.end_date > utc_now

    def run(self):
        errors = []
        utc_now = datetime.utcnow()
        for network in self.inv.networks:
            if self.check_levele_is_active(network, utc_now):
                network_prefix = network.code if network.code else "undefined"
                errors.extend(self.validate_network(network, network_prefix))
                for station in network.stations:
                    if self.check_levele_is_active(station, utc_now):
                        station_prefix = '%s/%s' % (network_prefix, station.code if station.code else "undefined")
                        errors.extend(self.validate_station(station, station_prefix))
                        for channel in station.channels:
                            if self.check_levele_is_active(channel, utc_now):
                                channel_prefix = '%s/%s' % (station_prefix, channel.code if channel.code else "undefined")
                                errors.extend(self.validate_channel(channel, channel_prefix))
        return errors
