from os import path
import unittest

from obspy.core.inventory.inventory import read_inventory

from yasmine.app.utils.inv_valid import ValidateInventory


class ValidateInventoryTests(unittest.TestCase):
    FILES_FOLDER = path.join(path.dirname(path.realpath(__file__)), 'data')

    def test_import_export_1(self):
        inv = read_inventory(path.join(self.FILES_FOLDER, 'station_from_obspy.xml'))
        errors = ValidateInventory(inv, self, True).run()
        self.assertEqual(len(errors), 2, 'Number of errors is different')
