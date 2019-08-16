import io
import os

from yasmine.app.handlers.base import ExtJsHandler, AsyncThreadMixin, BaseHandler
from yasmine.app.models import XmlModel
from yasmine.app.utils.imp_exp import ImportStationXml, ExportStationXml


class XmlGridHandler(ExtJsHandler):
    model = XmlModel


class XmlImpExpHandler(AsyncThreadMixin, BaseHandler):
    def async_post(self, *_, **__):
        body = self.request.files['xml-path'][0]['body']
        filename = self.request.files['xml-path'][0]['filename']
        name = self.get_argument('name') or os.path.splitext(filename)[0]
        ImportStationXml(name, io.BytesIO(body), self).run()
        return {'success': True}

    def get(self, db_id, *_, **__):

        file_name, file_data = ExportStationXml(db_id, self).run()
        self.write_file_data(file_name, file_data.getvalue())
