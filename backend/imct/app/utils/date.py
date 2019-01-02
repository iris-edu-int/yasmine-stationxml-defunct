from datetime import datetime, timedelta

from tzlocal import get_localzone
import pytz


def get_now_utc():
    return datetime.utcnow().replace(tzinfo=pytz.utc)


def strptime_utc(value, dt_format):
    return datetime.strptime(value, dt_format).replace(tzinfo=pytz.utc)


def strptime(value, dt_format):
    return datetime.strptime(value, dt_format)


def parse_duration(duration):
    '''Returns duration in seconds'''
    fractions = duration.split(":")
    fractions_len = len(fractions)
    seconds = 0
    for i in range(fractions_len):
        seconds += int(fractions[i]) * 60**(2 - i)
    return timedelta(seconds=seconds)


def datetime_to_utc(datetime_in):
    '''Convert date to UTC time'''
    if datetime_in.tzinfo is None:
        return get_localzone().localize(datetime_in).astimezone(pytz.UTC)
    else:
        return datetime_in.astimezone(pytz.UTC)
