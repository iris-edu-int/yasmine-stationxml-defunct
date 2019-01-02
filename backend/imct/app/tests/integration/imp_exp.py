import os
import unittest

from imct.app.utils.imp_exp import ImportStationXml, ExportStationXml
from imct.app.utils.facade import DbMixin
from imct.app.models.inventory import XmlModel


class ImportExportStationXmlt(unittest.TestCase, DbMixin):
    FILES_FOLDER = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'data')

    def __init__(self, *args, **kwargs):
        super(ImportExportStationXmlt, self).__init__(*args, **kwargs)
        DbMixin.__init__(self, *args, **kwargs)

    def test_import_export_1(self):
        with open(os.path.join(self.FILES_FOLDER, 'station_from_obspy.xml'), 'rb') as f:
            content = f.read()
            xml_model = ImportStationXml('blabla', f, self).run()
            self.assertIsNotNone(xml_model, 'Unable to parse xml')
            _, generated_content = ExportStationXml(xml_model.id, self).run()
            self.assertEqual(content, generated_content.getvalue(), 'XMLs are different')

    def test_import_export_2(self):
        with open(os.path.join(self.FILES_FOLDER, 'NE.xml'), 'rb') as f:
            content = f.read()
            xml_model = ImportStationXml('blabla', f, self).run()
            self.assertIsNotNone(xml_model, 'Unable to parse xml')
            _, generated_content = ExportStationXml(xml_model.id, self).run()
            self.assertEqual(content, generated_content.getvalue(), 'XMLs are different')

    def tearDown(self):
        with self.db.begin():
            self.db.query(XmlModel).delete()


if __name__ == "__main__":
    unittest.main()
