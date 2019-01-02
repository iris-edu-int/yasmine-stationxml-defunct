
class XmlNodeEnum(object):
    NETWORK = 1
    STATION = 2
    CHANNEL = 3


class XmlNodeAttrEnum(object):
    CODE = 'code'
    ALT_CODE = 'alternate_code'
    HISTORICAL_CODE = 'historical_code'
    START_DATE = 'start_date'
    DESCRIPTION = 'description'
    LOCATION_CODE = 'location_code'
    START_DATE = 'start_date'
    END_DATE = 'end_date'
    LATITUDE = 'latitude'
    LONGITUDE = 'longitude'
    DEPTH = 'depth'
    AZIMUTH = 'azimuth'
    DIP = 'dip'
    SAMPLE_RATE = 'sample_rate'
    COMMENTS = 'comments'
    DESCRIPTION = 'description'
    ELEVATION = 'elevation'
    EXTERNAL_REFERENCES = 'external_references'
    RESTRICTED_STATUS = 'restricted_status'
    TERMINATION_DATE = 'termination_date'
    CREATION_DATE = 'creation_date'
    SITE = 'site'
    ELEVATION = 'elevation'
    VAULT = 'vault'
    GEOLOGY = 'geology'
    OPERATORS = 'operators'
    TOTAL_NUMBER_OF_CHANNELS = 'total_number_of_channels'
    SELECTED_NUMBER_OF_CHANNELS = 'selected_number_of_channels'
    TYPES = 'types'
    SAMPLE_RATE_RATIO_NUMBER_SAMPLES = 'sample_rate_ratio_number_samples'
    SAMPLE_RATE_RATIO_NUMBER_SECONDS = 'sample_rate_ratio_number_seconds'
    STORAGE_FORMAT = 'storage_format'
    CLOCK_DRIFT_IN_SECONDS_PER_SAMPLE = 'clock_drift_in_seconds_per_sample'
    CALIBRATION_UNITS = 'calibration_units'
    CALIBRATION_UNITS_DESCRIPTION = 'calibration_units_description'
    SENSOR = 'sensor'
    PRE_AMPLIFIER = 'pre_amplifier'
    DATA_LOGGER = 'data_logger'
    EQUIPMENT = 'equipment'
    RESPONSE = 'response'


class XmlNodeAttrWindetsEnum(object):
    FLOAT = 'imct-float-field'
    INT = 'imct-int-field'
    LATITUDE = 'imct-latitude-field'
    LONGITUDE = 'imct-longitude-field'
    DATE = 'imct-date-field'
    SITE = 'imct-site-field'
