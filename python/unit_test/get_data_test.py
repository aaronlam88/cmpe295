import sys
sys.path.insert(0, '../models')
from get_data import GetData
# from python.ultilities.get_data import GetData
import unittest
import csv

class TestGetData(unittest.TestCase):
    def test_getAllFeatures1(self):
        getData = GetData()
        features = getData.getAllFeatures()
        self.assertIsNotNone(features)
        self.assertEqual(len(features), 1000)

    def test_getAllFeatures2(self):
        getData = GetData(101)
        features = getData.getAllFeatures()
        self.assertIsNotNone(features)
        self.assertEqual(len(features), 100)

if __name__ == '__main__':
    unittest.main()