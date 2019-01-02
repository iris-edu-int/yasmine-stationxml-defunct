import io
import os
import shutil
import zipfile

import requests

from imct.app.settings import NRL_URL, NRL_ROOT, MEDIA_ROOT
from imct.app.utils.facade import HandlerMixin
import tempfile
import re
import pickle


class SyncNrl(HandlerMixin):

    def __init__(self, *_, **__):
        self.etag_file = os.path.join(NRL_ROOT, 'etag.txt')
        self.etag_new = None
        super(SyncNrl, self).__init__(*_, **__)

    def check_is_new(self):
        h = requests.head(NRL_URL, allow_redirects=True)
        header = h.headers
        self.etag_new = header.get('etag')
        if os.path.exists(self.etag_file):
            with open(self.etag_file, 'rt') as f:
                etag_loaded = f.read()
                if self.etag_new == etag_loaded:
                    return False
        return True

    def run(self):
        if self.check_is_new():
            r = requests.get(NRL_URL)
            z = zipfile.ZipFile(io.BytesIO(r.content))
            tmp_dir = tempfile.mkdtemp(dir=MEDIA_ROOT)
            z.extractall(tmp_dir)
            shutil.rmtree(NRL_ROOT)
            os.rename(tmp_dir, NRL_ROOT)
            with open(self.etag_file, 'wt') as f:
                f.write(self.etag_new)
            self.application.nrl = None
        # to cache
        GetNrlSensors(self.application)
        GetNrlDataloggers(self.application)


class GetSensor(HandlerMixin):
    def __init__(self, sensor_keys, *_, **__):
        self.sensor_keys = sensor_keys
        super(GetSensor, self).__init__(*_, **__)

    def run(self):
        sensor = self.nrl.sensors
        for key in self.sensor_keys:
            sensor = sensor[key]
        return sensor


class GetDataloger(HandlerMixin):
    def __init__(self, datalogger_keys, *_, **__):
        self.datalogger_keys = datalogger_keys
        super(GetDataloger, self).__init__(*_, **__)

    def run(self):
        datalogger = self.nrl.dataloggers
        for key in self.datalogger_keys:
            datalogger = datalogger[key]
        return datalogger


class GetSensorRawResponse(GetSensor):

    def run(self):
        return self.nrl._read_resp(super(GetSensorRawResponse, self).run()[1])


class GetDatalogerRawResponse(GetDataloger):

    def run(self):
        return self.nrl._read_resp(super(GetDatalogerRawResponse, self).run()[1])


class GetResponse(HandlerMixin):
    def __init__(self, sensor_keys, datalogger_keys, *_, **__):
        self.sensor_keys = sensor_keys
        self.datalogger_keys = datalogger_keys
        super(GetResponse, self).__init__(*_, **__)

    def run(self):
        return self.nrl.get_response(sensor_keys=self.sensor_keys, datalogger_keys=self.datalogger_keys)


class BaseEquipment(HandlerMixin):
    CAHCHE_FILE = None

    def get_level_info(self, level):
        data = []
        if not isinstance(level, tuple):
            try:
                for level_key in level.keys():
                    child = level[level_key]
                    if not isinstance(child, tuple):
                        data.append({
                            'text': level._question,
                            'key': level_key,
                            'leaf': False,
                            'children': self.get_level_info(level[level_key])
                        })
                    else:
                        data.append({
                            'key': level_key,
                            'text': child[0],
                            'leaf': True
                        })
            except:  # @IgnorePep8
                pass
        return data

    def get_equipment(self, equipment, msg):
        try:
            cache_file = os.path.join(NRL_ROOT, self.CAHCHE_FILE)
            if not os.path.exists(cache_file):
                data = self.get_level_info(equipment)
                with open(cache_file, 'wb') as outfile:
                    outfile.write(pickle.dumps(data))
            else:
                with open(cache_file, 'rb') as outfile:
                    data = pickle.loads(outfile.read())
            return data
        except FileNotFoundError:
            return [{'text': '%s (synchronizing)' % msg if self.sync_nrl_started else msg}]


class GetNrlSensors(BaseEquipment):
    CAHCHE_FILE = 'sensors.json'

    def __init__(self, *_, **__):
        super(GetNrlSensors, self).__init__(*_, **__)

    def run(self):
        return self.get_equipment(self.application.nrl.sensors, 'No sensors')


class GetNrlDataloggers(BaseEquipment):
    CAHCHE_FILE = 'dataloggers.json'

    def __init__(self, *_, **__):
        super(GetNrlDataloggers, self).__init__(*_, **__)

    def run(self):
        return self.get_equipment(self.application.nrl.dataloggers, 'No dataloggers')


class GuessChannelCode(HandlerMixin):
    def __init__(self, *_, **__):
        super(GuessChannelCode, self).__init__(*_, **__)

    def band_code(self, sample_rate, short_period=False):
        """
            Lookup 1-char band_code from sample_rate
            Provides a check on simply grabbing the code from the
                appropriate NRL RESP file
        """

        L = 1
        V = 0.1
        U = 0.01

        if sample_rate >= 1000:
            band_code = 'F' if not short_period else 'G'
        elif sample_rate >= 250:
            band_code = 'C' if not short_period else 'D'
        elif sample_rate >= 80:
            band_code = 'H' if not short_period else 'E'
        elif sample_rate >= 10:
            band_code = 'B' if not short_period else 'S'
        elif sample_rate > 1:
            band_code = 'M'
        elif sample_rate > (0.9 * L) and sample_rate < (1.1 * L):
            band_code = 'L'
        elif sample_rate > (0.9 * V) and sample_rate < (1.1 * V):
            band_code = 'V'
        elif sample_rate > (0.9 * U) and sample_rate < (1.1 * U):
            band_code = 'U'
        elif sample_rate >= 0.0001 and sample_rate < 0.001:
            band_code = 'R'
        elif sample_rate >= 0.00001 and sample_rate < 0.0001:
            band_code = 'T'
        elif sample_rate < 0.00001:
            band_code = 'Q'
        else:
            band_code = None  # Unknown
            print("Unknown sample_rate:%s" % sample_rate)

        return band_code

    def is_single_channel(self, sensor_code):
        """
        if True --> we might want to restrict the # of chans
            that can be created from this sensor to 1.
        This could be use, for example, if user requests 3 channels from
            a sensor (e.g., BDF = microphone) that we know to be only 1 channel.
        """
        # Infrasound/Microphones and Indiv.Channel Sensors (e.g., STS-1 Horizontal) are single_channel
        single_channel_sensors = ['BDF', 'BHE']
        if sensor_code in single_channel_sensors:
            return True
        else:
            return False

    def combine_channel_codes(self, sensor_code, datalogger_code):
        """
            Use input B052F04 Channel code from NRL sensor + datalogger blockettes
                to deduce combined channel code (to be created by IMCT wizard)

            [2018-09-06]
            Here is the entire set of sensor chan codes in the NRL:
    {'BHZ', 'SLZ', 'BJZ', 'BNZ', 'BDF', 'SHZ', 'BHE'}
            And here is the set of datalogger_chan codes
    {'BHZ', 'SLZ', 'GLZ', 'LHZ', 'HHZ', 'CHZ', 'VHZ', 'LLZ', 'UHZ', 'MLZ', 'DLZ', 'SHZ', 'GHZ', 'ELZ', 'FHZ', 'DHZ', 'MHZ'}

        """
        chan_code = None

        if sensor_code[0] == 'S':         # Short-period sensor
            if datalogger_code[0] == 'H':  # High sample rate rules
                chan_code = 'E' + sensor_code[1:3]
            elif datalogger_code[0] in ['C', 'D']:
                chan_code = 'D' + sensor_code[1:3]
            elif datalogger_code[0] in ['F', 'G']:
                chan_code = 'G' + sensor_code[1:3]
            else:                         # Normal sample rate (e.g., <= 80 sps)
                chan_code = sensor_code
        else:                             # Everything else
            chan_code = datalogger_code[0] + sensor_code[1:3]

        return chan_code

    def read_channel_code_from_NRL(self, resp_keys, nrl_dataloggers_or_sensors):
        """
            given the NRL sensor or datalogger keys, find the RESP file and scan it for field B052F04
        """

        response = nrl_dataloggers_or_sensors

        for key in resp_keys:
            response = response[key]
        resp_file = response[1]

        chan = None
        with open(resp_file) as f:
            for line in f:
                # B052F04     Channel:     CHZ
                if line[0:7] == "B052F04":
                    chan = line.split()[2]
                    break

        return chan

    def run(self, sensors_keys, dataloger_keys):

        sensor_code = self.read_channel_code_from_NRL(sensors_keys, self.nrl.sensors)
        datalog_code = self.read_channel_code_from_NRL(dataloger_keys, self.nrl.dataloggers)

        datalogger = GetDataloger(dataloger_keys, self.application).run()
        if datalogger:
            sample_rate_ptr = re.search('([0-9]*\.?[0-9]+)\s+sps', datalogger[0])
            if sample_rate_ptr and sample_rate_ptr[1]:
                sample_rate = float(sample_rate_ptr[1])

        chan_code = self.combine_channel_codes(sensor_code, datalog_code)
        band_char = self.band_code(sample_rate, True if sensor_code[0] == 'S' else False)
        return chan_code, band_char
