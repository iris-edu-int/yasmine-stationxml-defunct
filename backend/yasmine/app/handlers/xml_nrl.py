from yasmine.app.handlers.base import AsyncThreadMixin, BaseHandler
from yasmine.app.utils.nrl_io import GetNrlSensors, GetNrlDataloggers,\
    GetDatalogerRawResponse, GetSensorRawResponse, GetResponse


class XmlNrlSensorsHandler(AsyncThreadMixin, BaseHandler):
    def async_get(self, *_, **__):
        return GetNrlSensors(self.application).run()


class XmlDataloggersHandler(AsyncThreadMixin, BaseHandler):
    def async_get(self, *_, **__):
        return GetNrlDataloggers(self.application).run()


class XmlDataloggerRespHandler(AsyncThreadMixin, BaseHandler):
    def async_get(self, *_, **__):
        return GetDatalogerRawResponse(self.get_arguments('keys'), self.application).run()


class XmlNrlSensorRespHandler(AsyncThreadMixin, BaseHandler):
    def async_get(self, *_, **__):
        return GetSensorRawResponse(self.get_arguments('keys'), self.application).run()


class XmlChannelRespHandler(AsyncThreadMixin, BaseHandler):
    def async_get(self, *_, **__):
        resp = GetResponse(self.get_arguments('sensorKeys'), self.get_arguments('dataloggerKeys'), self.application).run()
        return str(resp)
