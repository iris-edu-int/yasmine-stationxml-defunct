# -*- coding: utf-8 -*-
from datetime import datetime, date
import json

from jsonpickle.unpickler import Unpickler
from obspy.core.utcdatetime import UTCDateTime
import jsonpickle
import obspy

from yasmine.app.settings import DATE_FORMAT_SYSTEM
from yasmine.app.utils.date import strptime
import jsonpickle.ext.numpy as jsonpickle_numpy


jsonpickle_numpy.register_handlers()


class JSONEncoder(json.JSONEncoder):

    ''' Class to encode JSON format send to frontend.'''

    def encode_date(self, date):
        return date.strftime(DATE_FORMAT_SYSTEM)

    def encode_complex_obj(self, obj):
        for attr, value in obj.__dict__.items():
            if isinstance(value, UTCDateTime) or isinstance(value, datetime) or isinstance(value, date):
                setattr(obj, attr, self.encode_date(value))
            elif isinstance(value, list) and "_date" in attr:
                res = []
                for v in value:
                    res.append(self.encode_date(v))
                setattr(obj, attr, res)
        return json.loads(jsonpickle.dumps(obj, make_refs=False))

    def default(self, obj):
        # to format date
        if isinstance(obj, datetime) or isinstance(obj, date):
            encoded_object = self.encode_date(obj)
        elif isinstance(obj, UTCDateTime):
            encoded_object = self.encode_date(obj.datetime)
        elif obspy.__name__ in getattr(obj, '__module__', ''):
            encoded_object = self.encode_complex_obj(obj)
        else:
            encoded_object = json.JSONEncoder.default(self, obj)
        return encoded_object


class JSONDecoder(json.JSONDecoder):

    ''' Class to decode JSON format received from frontend.'''

    def decode_date(self, value):
        if isinstance(value, list):
            res = []
            for v in value:
                res.append(strptime(v,  DATE_FORMAT_SYSTEM))
            return res
        if value and value != '':
            return strptime(value,  DATE_FORMAT_SYSTEM)
        else:
            return None

    def decode_complex_obj(self, pairs):
        res_dict = {}
        for k, v in pairs:
            if "_date" in k or "_time" in k:
                v = self.decode_date(v)
            res_dict[k] = v
        context = Unpickler()
        res = context.restore(res_dict, reset=True)

        return res

    def decode_simple_obj(self, pairs):
        obj = {}
        for key, value in pairs:
            if isinstance(value, str) and key in ['created_at', 'updated_at', 'start_date']:
                try:
                    obj[key] = self.decode_date(value)
                except ValueError:
                    obj[key] = value
            else:
                obj[key] = value
        return obj

    def __init__(self, *args, **kwargs):

        def decode_hook(pairs):
            """Load with dates"""
            obj = None
            if 'py/object' in [x[0] for x in pairs]:
                obj = self.decode_complex_obj(pairs)
            else:
                obj = self.decode_simple_obj(pairs)
            return obj

        kwargs['object_pairs_hook'] = decode_hook
        super(JSONDecoder, self).__init__(*args, **kwargs)

    def decode(self, s):
        obj = super(JSONDecoder, self).decode(s)
        # to handle id returned like minus value from from end for the new records
        if isinstance(obj, dict):
            for key in obj:
                value = obj.get(key)
                if 'id' in key and (value == '' or value == '-1' or value < 0):
                    obj[key] = None

        return obj


def json_load(data, cls=JSONDecoder):
    return json.loads(data, cls=cls)


def json_dump(data, cls=JSONEncoder):
    return json.dumps(data, cls=cls)
