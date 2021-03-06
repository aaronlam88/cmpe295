# system
import sys
# get config to connect to database
import json
import mysql.connector
# use this to save data, so we don't have to keep getting data from database
import pickle
# for deepcopy
import copy
import time
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class GetData:
    """This class provide functions to get data so we can test out diffirent ML algorithm"""
    _data = None
    _features = None
    _featuresDiff = None
    _symbols = None
    _map = {'date': 0, 'open': 1, 'high': 2, 'low': 3, 'close': 4, 'adjClose': 5, 'volume': 6}

    def __init__(self, dataCount=1002):
        self._dataCount = dataCount
        if self._data == None:
            self._data = self._getData()

    def _getData(self):
        data = None
        try:
            logger.debug('Trying to load data')
            data_save = open('data.save', 'rb')
            data = pickle.load(data_save)
            data_save.close
        except Exception:
            logger.debug('Getting data from database')

            configData = json.load(open('../../ignore/db_config.json'))

            config = {
                'user': configData['username'],
                'password': configData['password'],
                'host': configData['host'],
                'database': configData['database'],
                'raise_on_warnings': True,
                'buffered': True
            }
            cnx = mysql.connector.connect(**config)
            cursor = cnx.cursor()

            # data column |Date|Open|High|Low|Close|CloseAdj|Volumn|

            # first try to get all the tables we have in our database
            allTables = []
            query = """SELECT Symbol FROM 4update ORDER BY Symbol;"""
            cursor.execute(query)

            try:
                result = cursor.fetchall()
                for row in result:
                    allTables.append(row[0])
            except Exception:
                logger.error('Unable to fecth data: ', exc_info=True)

            # get learn date
            data = {}
            for table in allTables:
                data[table] = []
                query = """SELECT * FROM `%s` ORDER BY Date DESC LIMIT %s;""" % (
                    table, self._dataCount)
                cursor.execute(query)
                try:
                    # just printing something so we know it's working
                    print('          ', end='\r', file=sys.stderr)
                    print(table, end='\r', file=sys.stderr)
                    # save result
                    result = cursor.fetchall()
                    for row in result:
                        temp = []
                        temp.append(row[0].strftime("%Y%m%d"))
                        temp.extend(row[1:])
                        data[table].append(temp)
                except Exception:
                    logger.error('Unable to fectch row', exc_info=True)

            # save all the data we get to local storage
            data_save = open('data.save', 'wb')
            pickle.dump(data, data_save)
            data_save.close
            logger.debug('          ', end='\r')
            logger.debug('\n[DONE] get data: ' + str(len(data)))

            # since we get all the data, we can close the cursor now
            cursor.close()
        finally:
            logger.info('DONE')
            return data

    def getAllFeatures(self, *args):
        """
        return features to be used with labels, use the original value
        Should work as follow
        Table A:
            2017-12-30, 5.1, 5.2, 5.3, 5.4, 5.5, 12345
            2017-12-31, 6.1, 6.2, 6.3, 6.4, 6.5, 23456
        Table B:
            2017-12-30, 1.1, 1.2, 1.3, 1.4, 1.5, 34567
            2017-12-31, 2.1, 2.2, 2.3, 2.4, 2.5, 45678
        feature = [ [5.1, 5.2, 5.3, 5.4, 5.5, 12345, 1.1, 1.2, 1.3, 1.4, 1.5, 34567], [6.1, 6.2, 6.3, 6.4, 6.5, 23456, 2.1, 2.2, 2.3, 2.4, 2.5, 45678] ]
        """
        features = []
        for i in range(0, self._dataCount):
            features.append([])
            for symbol in self._data.keys():
                if(len(args) == 0):
                    for value in self._data[symbol][i]:
                        features[i].append(value)
                else:
                    temp = []
                    for arg in args:
                        temp.append(self._data[symbol][i][self._map.get(arg)])
                    features[i].append(temp)
        features.reverse()
        features.pop()
        return features

    def getAllFeaturesDiff(self):
        """
        return featuresDiff to be used with labelsDiff, use the diff between 2 days
        Should work as follow
        Table A:
            2017-12-30, 5.1, 5.2, 5.3, 5.4, 5.5, 12345
            2017-12-31, 6.1, 6.2, 6.3, 6.4, 6.5, 23456
        Table B:
            [0] 2017-12-29, 1.1, 1.2, 1.3, 1.4, 1.5, 34567
            [1] 2017-12-30, 1.1, 1.2, 1.3, 1.4, 1.5, 34567
            [2] 2017-12-31, 2.1, 2.2, 2.3, 2.4, 2.5, 45678
                        A[1] - A[0]              B[1] - B[0]
        feature = [ [1, 1, 1, 1, 1, 11111, 1, 1, 1, 1, 1, 11111] ]
        """
        featuresDiff = []
        for i in range (self._dataCount-1, 1, -1):
            temp = []
            for symbol in self._data.keys():
                for j in range (0, 6):
                    temp.append(float(self._data[symbol][i][j]) - float(self._data[symbol][i-1][j]))
            featuresDiff.append(temp)
        return featuresDiff

    def getSymbolFeaturesDiff(self, symbol):
        features = []
        for i in range (self._dataCount-1, 1, -1):
            temp = []
            for j in range (0, 6):
                temp.append(float(self._data[symbol][i][j]) - float(self._data[symbol][i-1][j]))
            features.append(temp)
        return features

    def getSymbolFeatures(self, symbol):
        """
        return a single features[] for a stock symbol
        """
        features = []
        for i in range (self._dataCount-1, -1, -1):
            features.append(self._data[symbol][i])
        return features

    def getAllSymbols(self):
        """
        return all stock symbols that we cached locally
        """
        symbols = []
        for key in self._data.keys():
            symbols.append(key)
        return symbols
    
    def getAllSymbolsSinceIndex(self, index):
        """
        return all stock symbols that cached locally since index 'index'
        """
        AllSymbols = self.getAllSymbols()
        symbols = []
        for i in range(index, len(AllSymbols)-1, 1):
            symbols.append(AllSymbols[i])
        return symbols


    def getSymbolCLFLabels(self, symbol, field=0):
        """
        return a single (Normal) Classifier labels[] for a stock symbol
        """
        labels = []
        for i in range (self._dataCount-1, 0, -1):
            if self._data[symbol][i][field] > self._data[symbol][i-1][field]:
                labels.append(1)
            else:
                labels.append(0)
        return labels

    def getSymbolCLFLabelsDiff(self, symbol, field=0):
        """
        return a single (Diff) Classifier labels[] for a stock symbol, this labels[] can be used with featureDiff
        """
        labels = []
        for i in range (self._dataCount-2, 0, -1):
            if self._data[symbol][i][field] > self._data[symbol][i-1][field]:
                labels.append(1)
            else:
                labels.append(0)
        return labels

    # the oldest data is at the very first index
    def getSymbolFeaturesWithoutDate(self, symbol):
        """
        return a single features[] for a stock symbol
        """
        features = []
        for i in range (self._dataCount-1, 0, -1):
            features.append(self._data[symbol][i][1:5])
        return features

    def getSymbolClosePrice(self, symbol, date):
        """
        return the date and close prices for a stock symbol
        """
        query = """SELECT close FROM `%s` WHERE Date='%s';""" % (
                    symbol, date)

        config = {
                'user': "cmpe295",
                'password': "cmpe295.sjsu.2018",
                'host': "stockdatabase.cxswepygqy9j.us-west-1.rds.amazonaws.com",
                'database': "StockDatabase",
                'raise_on_warnings': True,
                'buffered': True
            }
        cnx = mysql.connector.connect(**config)
        cursor = cnx.cursor()
        cursor.execute(query)

        try:
            result = cursor.fetchall()
        except Exception:
            logger.error('Unable to get close price of given date: ', exc_info=True)

        return result
        
        


