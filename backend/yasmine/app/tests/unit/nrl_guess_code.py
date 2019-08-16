import unittest

from yasmine.app.utils.facade import NrlMixin
from yasmine.app.utils.nrl_io import GuessChannelCode, SyncNrl


class NrlGuessTest(unittest.TestCase, NrlMixin):

    def __init__(self, *args, **kwargs):
        unittest.TestCase.__init__(self, *args, **kwargs)
        NrlMixin.__init__(self, *args, **kwargs)
        SyncNrl(self).run()

    def test_1(self):
        '''
            Combine Hyperion infrasound mic with Kinemetrics Rock sampled at high rate (250 sps)
        '''
        sensor_keys = ['Hyperion', 'IFS-4000']
        datalog_keys = ['Kinemetrics', 'Rock Family (Basalt, Granite, Dolomite, Obsidian)', '16', '10', 'Non-causal', '250']

        chan_code, band_char = GuessChannelCode(self).run(sensor_keys, datalog_keys)
        self.assertEqual(chan_code[0], band_char, 'Channel code and band code are not equal.')

    def test_2(self):
        '''
            Combine Geo_Space/OYO low-gain short-period with Kinemetrics Rock sampled at high rate (250 sps)
        '''
        sensor_keys = ['Geo Space/OYO', 'OMNI-2400', 'none']
        datalog_keys = ['Kinemetrics', 'Rock Family (Basalt, Granite, Dolomite, Obsidian)', '16', '10', 'Non-causal', '250']

        chan_code, band_char = GuessChannelCode(self).run(sensor_keys, datalog_keys)
        self.assertEqual(chan_code[0], band_char, 'Channel code and band code are not equal.')

    def test_3(self):
        '''
            Combine STS-1 broadband with Quanterra Q330HRS sampled at .01, ...., 100 sps
        '''
        sensor_keys = ['Streckeisen', 'STS-1', '360 seconds']
        datalog_keys = ['Quanterra', 'Q330HRS', '1', '0.01', 'LINEAR AT ALL SPS', 'VLP389/ULP379']
        chan_code, band_char = GuessChannelCode(self).run(sensor_keys, datalog_keys)
        self.assertEqual(chan_code[0], band_char, 'Channel code and band code are not equal.')

        datalog_keys = ['Quanterra', 'Q330HRS', '1', '1', 'LINEAR AT ALL SPS']
        chan_code, band_char = GuessChannelCode(self).run(sensor_keys, datalog_keys)
        self.assertEqual(chan_code[0], band_char, 'Channel code and band code are not equal.')

        datalog_keys = ['Quanterra', 'Q330HRS', '1', '20', 'LINEAR AT ALL SPS']
        chan_code, band_char = GuessChannelCode(self).run(sensor_keys, datalog_keys)
        self.assertEqual(chan_code[0], band_char, 'Channel code and band code are not equal.')

        datalog_keys = ['Quanterra', 'Q330HRS', '1', '100', 'LINEAR AT ALL SPS']
        chan_code, band_char = GuessChannelCode(self).run(sensor_keys, datalog_keys)
        self.assertEqual(chan_code[0], band_char, 'Channel code and band code are not equal.')

    def test_4(self):
        '''
            Channel naming wizard returns empty channel code
        '''
        sensor_keys = ['Chaparral Physics', '50A', 'High: 2 V/Pa']
        datalog_keys = ['REF TEK', 'RT 130 & 130-SMA', '1', '40']

        chan_code, band_char = GuessChannelCode(self).run(sensor_keys, datalog_keys)
        self.assertEqual(chan_code[0], band_char, 'Channel code and band code are not equal.')
