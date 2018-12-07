# system
import sys
# get config to connect to database
import json
import mysql.connector
# use this to save data, so we don't have to keep getting data from database
import pickle
# for deepcopy
import copy

from get_data import GetData

import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class GetPredictionData:
    """This class provide functions to get data so we can test out diffirent ML algorithm"""
    _data = None
    _features = None
    _featuresDiff = None
    _symbols = None
    _config = None
    _map = {'Date': 0, 'DTree': 1, 'SVM': 2, 'SGDLinear': 3, 'SGDRegression': 4, 'LASSORegression': 5}

    def __init__(self, dataCount=100):
        self._dataCount = dataCount
        if self._data == None:
            self._data = self._getPredictionData()

        if self._config == None:
            self._config = {
                'user': "cmpe295",
                'password': "cmpe295.sjsu.2018",
                'host': "stockdatabase.cxswepygqy9j.us-west-1.rds.amazonaws.com",
                'database': "PredictionDatabase",
                'raise_on_warnings': True,
                'buffered': True
            }

    def _getPredictionData(self):
        data = None
        try:
            logger.debug('Trying to load prediction data')
            data_save = open('prediction_data.save', 'rb')
            data = pickle.load(data_save)
            data_save.close
        except Exception:
            logger.debug('Getting data from prediction database')

            cnx = mysql.connector.connect(**self._config)
            cursor = cnx.cursor()

            # data column |Date|DTree|SVM|SGDLinear|SGDRegression|LASSORegression|

            # first try to get all the tables we have in our database
            
            allTables = GetData().getAllSymbols()
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
            data_save = open('prediction_data.save', 'wb')
            pickle.dump(data, data_save)
            data_save.close
            logger.debug('          ', end='\r')
            logger.debug('\n[DONE] get data: ' + str(len(data)))

            # since we get all the data, we can close the cursor now
            cursor.close()
        finally:
            logger.info('DONE')
            return data

    def getSymbolPredictionData(self, symbol, date):
        """
        return a single features[] for a stock symbol
        """
        prediction_data = []
        for i in range (self._dataCount-1, 0, -1):
            prediction_data.append(self._data[symbol][i])
        return prediction_data

    def getAllDates(self):
        """
        return all the dates that has prediction data
        """
        query = """SELECT `Date` FROM `AMZN` ORDER BY `Date` DESC LIMIT 30;""" 
        cnx = mysql.connector.connect(**self._config)
        cursor = cnx.cursor()
        cursor.execute(query)

        try:
            result = cursor.fetchall()
        except Exception:
            logger.error('Unable to get all the dates: ', exc_info=True)

        return result

    def getSymbolsPredictionClosePrice(self, symbol, date):
        """
        return the prediction close price of the stock
        """
        query = """SELECT LASSORegression FROM `%s` WHERE Date='%s';""" % (
                    symbol, date)
        cnx = mysql.connector.connect(**self._config)
        cursor = cnx.cursor()
        cursor.execute(query)

        try:
            result = cursor.fetchall()
        except Exception:
            logger.error('Unable to get all the dates: ', exc_info=True)

        return result


        
