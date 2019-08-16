import os
import unittest

from yasmine.app.settings import NRL_ROOT
from yasmine.app.utils.facade import NrlMixin
from yasmine.app.utils.nrl_io import SyncNrl, GetResponse, GetSensorRawResponse, GetDatalogerRawResponse
from yasmine.app.utils.ujson import json_dump, json_load


class NrlIoTest(unittest.TestCase, NrlMixin):

    def __init__(self, *args, **kwargs):
        unittest.TestCase.__init__(self, *args, **kwargs)
        NrlMixin.__init__(self, *args, **kwargs)

    def test_1_sync_nrl_and_get_res(self):
        SyncNrl(self).run()
        self.assertTrue(len(os.listdir(NRL_ROOT)) > 0, "NRL is not synchronized")
        res = GetResponse(['Streckeisen', 'STS-1', '360 seconds'], ['REF TEK', 'RT 130 & 130-SMA', '1', '40'], self).run()
        self.assertIsNot(res, "No response")

        tmp = json_dump(res)
        json_load(tmp)

    def test_2_sync_nrl_and_get_sensor_resp(self):
        SyncNrl(self).run()
        self.assertTrue(len(os.listdir(NRL_ROOT)) > 0, "NRL is not synchronized")
        res = GetSensorRawResponse(['Streckeisen', 'STS-1', '360 seconds'], self).run()
        self.assertIsNotNone(res, "No response")

    def test_3_sync_nrl_and_get_dataloger_resp(self):
        SyncNrl(self).run()
        self.assertTrue(len(os.listdir(NRL_ROOT)) > 0, "NRL is not synchronized")
        res = GetDatalogerRawResponse(['REF TEK', 'RT 130 & 130-SMA', '1', '40'], self).run()
        self.assertIsNotNone(res, "No response")

    def test_4_sync_nrl_and_get_res(self):
        SyncNrl(self).run()
        self.assertTrue(len(os.listdir(NRL_ROOT)) > 0, "NRL is not synchronized")
        res = GetResponse(['Kinemetrics', 'Episensor (ES-T, ES-U, ES-U2, DS-DH, SBEPI)', '+/- 2.5V Single-ended', '0.25g'], ['REF TEK', 'RT 130 & 130-SMA', '1', '100'], self).run()
        self.assertIsNotNone(res, "No response")
