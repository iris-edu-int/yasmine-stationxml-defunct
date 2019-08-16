import unittest

from yasmine.app.tests.common.wgui import SeletiounTestMixin
from yasmine.app.tests.common import check_web_app_is_down
from _collections import OrderedDict
from yasmine.app.utils.ujson import json_dump


@unittest.skipIf(check_web_app_is_down(), "Application is down")
class SettingsTest(SeletiounTestMixin):

    EXT_QUERIES = {
        'settings_list':   "Ext.ComponentQuery.query('settings-list')",
        'settings_form':   "Ext.ComponentQuery.query('settings-list')[0].form",
        'settings_save_btn': "Ext.ComponentQuery.query('settings-list button')[0]"
    }

    TEST_DATA = {
        "general__date_format_long": "Y-m-d H:i:s",
        "general__date_format_short": "Y-m-d H",
        "network__code": "NE1",
        "network__num_stations": '6',
        "station__code": "HH1",
        "station__num_channels": '1',
        "station__required_fields": ["code"],
        "channel__code": "HH", "channel__required_fields": ["code", "start_date"],
        "network__required_fields": ["code", "start_date", "end_date"],
        "general__source": "yasmine XML builder1",
        "general__module": "yasmine1",
        "general__uri": "http://yasmine.org1",
        "station__spread_to_channels": True
    }

    def test_update_settings(self):
        # open page and check the panel
        self.open_page("#settings")
        self.wait_js("{settings_list}.length>0".format(**self.EXT_QUERIES), 'There is no settings panel!')
        self.wait_js("!{is_masked}".format(**self.BASE_EXT_QUERIES), 'Masked!', silent=True)
        # get old values and update new
        old_values = self.driver.execute_script("return {settings_form}.getValues();".format(**self.EXT_QUERIES))
        self.driver.execute_script("{settings_form}.setValues({test_data});".format(test_data=json_dump(self.TEST_DATA), **self.EXT_QUERIES))
        self.click_component("{settings_save_btn}".format(**self.EXT_QUERIES))
        # refresh page and check values are saved
        self.open_page("#settings")
        self.wait_js("!{is_masked}".format(**self.BASE_EXT_QUERIES), 'Masked!', silent=True)
        new_value = self.driver.execute_script("return {settings_form}.getValues();".format(**self.EXT_QUERIES))
        self.assertEqual(OrderedDict(sorted(self.TEST_DATA.items())), OrderedDict(sorted(new_value.items())), 'Values are not equal.')
        # reset values to original
        self.driver.execute_script("{settings_form}.setValues({test_data});".format(test_data=json_dump(old_values), **self.EXT_QUERIES))
        self.click_component("{settings_save_btn}".format(**self.EXT_QUERIES))


if __name__ == "__main__":
    unittest.main()
