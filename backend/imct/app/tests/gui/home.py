import unittest

from imct.app.tests.common.wgui import SeletiounTestMixin
from imct.app.tests.common import check_web_app_is_down


@unittest.skipIf(check_web_app_is_down(), "Application is down")
class HomeTest(SeletiounTestMixin):

    EXT_QUERIES = {
        'xmlList':          "Ext.ComponentQuery.query('xml-list')"
    }

    def test_home_page(self):
        self.assertTrue(self.driver.execute_script("return {xmlList}.length>0".format(**self.EXT_QUERIES)), 'There is no xml list panel!')


if __name__ == "__main__":
    unittest.main()
