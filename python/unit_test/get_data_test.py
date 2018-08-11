import sys
sys.path.insert(0, '../ultilities')
from get_data import GetData
import unittest
import csv

class TestGetData(unittest.TestCase):
    def test_getData(self):
        data = GetData.getData(GetData, 'GOOG', '2012-01-02', '2012-01-03')
        self.assertIsNotNone(data)
        for row in data:
            self.assertEqual(row, ['[{"Date":"2012-01-03"', 'Open:324.360352', 'High:331.916199', 'Low:324.077179', 'Close:330.555054', 'Adj Close:330.555054', 'Volume:7400800}]'])


if __name__ == '__main__':
    unittest.main()