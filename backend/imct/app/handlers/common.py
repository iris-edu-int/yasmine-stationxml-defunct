# -*- coding: utf-8 -*-
import os

from tornado.template import Loader

from imct.app.handlers.base import AsyncThreadMixin, BaseHandler
from imct.app.settings import TEMPLATES_DIR


class HomeHandler(BaseHandler):

    SUPPORTED_METHODS = ['POST', 'GET']

    def get(self):
        self.render("index.html")


class HelpHandler(AsyncThreadMixin, BaseHandler):

    SUPPORTED_METHODS = ['POST', 'GET']

    def async_get(self, key, *_, **__):
        loader = Loader(os.path.join(TEMPLATES_DIR, 'help'))
        return {'key': key, 'content': loader.load("%s.html" % key).generate().decode("utf-8")}
