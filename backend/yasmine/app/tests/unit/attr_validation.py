import unittest

from yasmine.app.utils.inv_valid import ValueRequired, ValueLength,\
    ValueWithinRange


class AttrValidationTests(unittest.TestCase):
    def test_required_attr(self):

        self.assertIsNot(ValueRequired('attr1').validate(None), True, 'Values is valid.')
        self.assertIsNot(ValueRequired('attr1').validate(''), True, 'Values is valid.')
        self.assertIsNot(ValueRequired('attr1').validate({}), True, 'Values is valid.')
        self.assertIsNot(ValueRequired('attr1').validate([]), True, 'Values is valid.')
        self.assertIsNot(ValueRequired('attr1').validate([[{'aa': ''}]]), True, 'Values is invalid.')
        self.assertIsNot(ValueRequired('attr1').validate([[{'aa': None}]]), True, 'Values is invalid.')
        self.assertIsNot(ValueRequired('attr1').validate([[{}]]), True, 'Values is invalid.')

        self.assertTrue(ValueRequired('attr1').validate([[{'aa': 'ss'}]]), 'Values is valid.')
        self.assertTrue(ValueRequired('attr1').validate('test'), 'Values is invalid.')
        self.assertTrue(ValueRequired('attr1').validate(0), 'Values is invalid.')
        self.assertTrue(ValueRequired('attr1').validate(0.0), 'Values is invalid.')
        self.assertTrue(ValueRequired('attr1').validate(1), 'Values is invalid.')
        self.assertTrue(ValueRequired('attr1').validate(1.1), 'Values is invalid.')

    def test_length_attr(self):
        self.assertIsNot(ValueLength('attr1', 3, 5).validate(12), True, 'Values is valid.')
        self.assertIsNot(ValueLength('attr1', 3, 5).validate(122345), True, 'Values is valid.')
        self.assertIsNot(ValueLength('attr1', 3, 5).validate(123.123), True, 'Values is valid.')
        self.assertIsNot(ValueLength('attr1', 3, 5).validate('12'), True, 'Values is valid.')
        self.assertIsNot(ValueLength('attr1', 3, 5).validate('123456'), True, 'Values is valid.')
        self.assertTrue(ValueLength('attr1', 3, 5).validate('123'), 'Values is invalid.')
        self.assertTrue(ValueLength('attr1', 3, 5).validate('12345'), 'Values is invalid.')
        self.assertTrue(ValueLength('attr1', 3, 5).validate(123), 'Values is invalid.')
        self.assertTrue(ValueLength('attr1', 3, 5).validate(123.1), 'Values is invalid.')

    def test_range_attr(self):
        self.assertIsNot(ValueWithinRange('attr1', -90, 90).validate(-91), True, 'Values is valid.')
        self.assertIsNot(ValueWithinRange('attr1', -90, 90).validate(90), True, 'Values is valid.')
        self.assertTrue(ValueWithinRange('attr1', -90, 90).validate(-90), 'Values is invalid.')
        self.assertTrue(ValueWithinRange('attr1', -90, 90).validate(50), 'Values is invalid.')
        self.assertTrue(ValueWithinRange('attr1', -90, 90).validate(89), 'Values is invalid.')
