from datetime import datetime
import os
import unittest

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.abstract_event_listener import AbstractEventListener
from selenium.webdriver.support.event_firing_webdriver import EventFiringWebDriver
from selenium.webdriver.support.wait import WebDriverWait

from imct.app.settings import TORNADO_PORT, TMP_ROOT


class ScreenshotListener(AbstractEventListener):
    def on_exception(self, _, driver):
        screenshot_name = os.path.join(TMP_ROOT, "exception__%s.png" % (datetime.now().strftime('%Y_%m_%d__%H_%M_%S')))
        driver.get_screenshot_as_file(screenshot_name)
        print("Screenshot saved as '%s'" % screenshot_name)


class SeletiounTestMixin(unittest.TestCase):

    BASE_EXT_QUERIES = {
        'app-main': "Ext.ComponentQuery.query('app-main')",
        'error_msg': "Ext.ComponentQuery.query('messagebox[title=Error]{isVisible()}')",
        'confirm_msg': "Ext.ComponentQuery.query('messagebox:visible')",
        'cofirm_msg_btn': "Ext.ComponentQuery.query('messagebox:visible button[text=Yes]')[0]",
        'is_masked': "Ext.getBody().isMasked()"
    }

    def setUp(self):
        options = webdriver.ChromeOptions()
        options.add_argument('headless')
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        self.driver = EventFiringWebDriver(webdriver.Chrome(chrome_options=options), ScreenshotListener())
        self.driver.set_page_load_timeout(10)
        self.driver.set_script_timeout(10)
        self.driver.maximize_window()
        self.driver.get(self.get_host())
        self.wait_content_is_ready()

    def wait_content_is_ready(self):
        self.wait_js("document.readyState=='complete' && window.Ext != undefined && window.Ext.ComponentQuery != undefined && {app-main}.length>0 && {app-main}[0].rendered"
                     .format(**self.BASE_EXT_QUERIES),
                     'View is not rendered!')

    def wait_js(self, query, error, timeout=20, silent=False):
        try:
            WebDriverWait(self.driver, timeout).until(lambda _: self.driver.execute_script("return %s" % query), error)
        except TimeoutException as e:
            if not silent:
                self.driver._listener.on_exception(e, self.driver.wrapped_driver)
                raise e

    def wait_while_load_mask(self, silent=False):
        self.wait_js("!Ext.getBody().isMasked()", 'Loading takes too much time.', silent=silent)

    def click_by_id(self, dom_id):
        element = self.driver.find_element_by_id(dom_id)
        builder = ActionChains(self.driver)
        builder.move_to_element(element).click(element).perform()

    def click_component(self, query):
        cmp_id = self.driver.execute_script("return %s.id" % query)
        self.driver.find_element_by_id(cmp_id).click()

    def get_host(self):
        return "http://127.0.0.1:%s" % TORNADO_PORT

    def open_page(self, relative_url):
        self.driver.get("%s/%s" % (self.get_host(), relative_url))
        self.wait_content_is_ready()

    def refresh_page(self):
        self.driver.get(self.driver.current_url)
        self.wait_content_is_ready()

    def tearDown(self):
        self.driver.close()
        self.driver.quit()
