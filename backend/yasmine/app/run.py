# -*- coding: utf-8 -*-
from _datetime import timedelta
from datetime import datetime
from logging.config import dictConfig
import logging

from apscheduler.schedulers.tornado import TornadoScheduler
from apscheduler.triggers.combining import OrTrigger
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.date import DateTrigger
import tornado.web

from yasmine.app.handlers import common, config, wizard
from yasmine.app.handlers import xml_bldr, xml_list, xml_nrl, xml_tpl
from yasmine.app.handlers.base import ErrorHandler
from yasmine.app.settings import TORNADO_SETTINGS, TORNADO_PORT, TORNADO_HOST, LOGGING_CONFIG, LOGGING_CONSOLE_CONFIG, NRL_CRON
from yasmine.app.utils.facade import ProcessMixin
from yasmine.app.utils.nrl_io import SyncNrl


logger = logging.getLogger("tornado.application")


class Application(tornado.web.Application, ProcessMixin):

    def __init__(self, debug=False):
        TORNADO_SETTINGS['debug'] = debug
        if debug:
            LOGGING_CONSOLE_CONFIG['level'] = logging.DEBUG
        dictConfig(LOGGING_CONFIG)

        tornado.web.Application.__init__(self, [
            (r"/", common.HomeHandler),

            (r"/api/xml/(?P<db_id>[\d\_]+)?/*", xml_list.XmlGridHandler),
            (r"/api/xml/ie/(?P<db_id>[\d\_]+)?", xml_list.XmlImpExpHandler),

            (r"/api/xml/validate/(?P<xml_id>[\d\_]+)?/", xml_bldr.XmlValidationHandler),
            (r"/api/xml/tree/(?P<xml_id>[\d\_]+)/(?P<node_id>[\d\_]+)?", xml_bldr.XmlNodeHandler),
            (r"/api/xml/attr/(?P<db_id>[\d\_]+)?", xml_bldr.XmlNodeAttrHandler),
            (r"/api/xml/attr/available/(?P<node_id>[\d\_]+)/?", xml_bldr.XmlNodeAvailableAttrHandler),
            (r"/api/xml/attr/validate/", xml_bldr.XmlNodeAttrValidateHandler),
            (r"/api/xml/epoch/(?P<xml_id>[\d\_]+)/*", xml_bldr.XmlEpochHandler),

            (r"/api/xml/template/(?P<node_id>[\d\_]+)?/*", xml_tpl.XmlTemplateHandler),

            (r"/api/nrl/sensors/(?P<key>[^/]+)?", xml_nrl.XmlNrlSensorsHandler),
            (r"/api/nrl/sensor/response/", xml_nrl.XmlNrlSensorRespHandler),
            (r"/api/nrl/dataloggers/(?P<key>[^/]+)?", xml_nrl.XmlDataloggersHandler),
            (r"/api/nrl/datalogger/response/", xml_nrl.XmlDataloggerRespHandler),
            (r"/api/nrl/channel/response/preview/", xml_nrl.XmlChannelRespHandler),

            (r"/api/wizard/channel/(?P<station_node_id>[\d\_]+)?/*", wizard.CreateChannelHandler),
            (r"/api/wizard/guess/code/", wizard.CreateGuessCodeHandler),

            (r"/api/help/(?P<key>[\w\_]+)?/*", common.HelpHandler, None, 'HelpHandler'),

            (r"/api/cfg/(?P<db_id>[\d\_]+)?/*", config.ConfigHandler),
            (r"/api/attr/(?P<node_id>[\d\_]+)?/*", config.AttributeHandler),
        ],  default_handler_class=ErrorHandler, **TORNADO_SETTINGS)

        self.scheduler = TornadoScheduler()
        self.scheduler.start()
        # start sync nrl job
        trigger = OrTrigger([
            DateTrigger(run_date=datetime.now() + timedelta(seconds=10)),
            CronTrigger(**NRL_CRON)
        ])

        self.nrl_sync_job = self.scheduler.add_job(self.sync_nrl, trigger)

        ProcessMixin.__init__(self)

    def sync_nrl(self):
        self.sync_nrl_started = True
        try:
            SyncNrl(self).run()
        except:  # @IgnorePep8
            self.sync_nrl_started = False


def runserver(debug, host=TORNADO_HOST, port=TORNADO_PORT):
    print("Running yasmine server...")
    app = Application(debug)
    app.listen(port=port, address=host)
    fhost = 'localhost' if len(host) == 0 else host
    print(f'Connect to http://{fhost}:{port:d}/')
    try:
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        tornado.ioloop.IOLoop.instance().stop()
