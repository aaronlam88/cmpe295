# system
import sys
# get config to connect to database
import json
import mysql.connector
# use this to save data, so we don't have to keep getting data from database
import pickle
# for deepcopy
import copy

import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class GetData:
    _data = None
    _features = None
    _featuresDiff = None
    _symbols = None
    
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

    def getAllFeatures(self):
        if self._features == None:
            features = []
            for i in range(0, self._dataCount):
                features.append([])
                for symbol in self._data.keys():
                    for value in self._data[symbol][i]:
                        features[i].append(value)
            features.reverse()
            features.pop()
            self._features = features
        return self._features
    
    def getAllFeaturesDiff(self):
        if self._featuresDiff == None:
            featuresDiff = []
            for i in range (1, self._dataCount):
                featuresDiff.append([])
                for symbol in self._data.keys():
                    for j in range (0, 6):
                        featuresDiff[i-1].append(float(self._data[symbol][i][j]) - float(self._data[symbol][i-1][j]))
            featuresDiff.pop()
            featuresDiff.reverse()
            self._featuresDiff = featuresDiff
        return self._featuresDiff

    def getAllSymbols(self):
        if self._symbols == None:
            symbols = []
            for key in self._data.keys():
                symbols.append(key)
            self._symbols = symbols
        return self._symbols
    
    def getSymbolFeatures(self, symbol):
        features = copy.deepcopy(self._data[symbol])
        features.reverse()
        features.pop()
        return features
    
    def getSymbolCLFLabels(self, symbol, field=0):
        labels = []
        for i in range (1, self._dataCount):
            if self._data[symbol][i][field] > self._data[symbol][i-1][field]:
                labels.append(1)
            else:
                labels.append(0)
        labels.reverse()
        return labels

    def getSymbolCLFLabelsDiff(self, symbol, field=0):
        labels = self.getSymbolCLFLabels(symbol, field)
        labels.pop()
        return labels
