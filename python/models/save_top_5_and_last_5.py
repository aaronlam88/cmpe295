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

class SaveRank:
    """This class provide functions to save top 5 stocks and bottom 5 stocks to our prediction database"""
    _config = None

    def __init__(self) :
        self._config = {
                'user': "cmpe295",
                'password': "cmpe295.sjsu.2018",
                'host': "stockdatabase.cxswepygqy9j.us-west-1.rds.amazonaws.com",
                'database': "PredictionDatabase",
                'raise_on_warnings': False,
                'buffered': True
            }

    def saveTop5AndBottom5(self, date, symbol, rate, rank, difference, table):
        records_to_insert = [tuple((date, symbol, rate, rank, difference))] 
          
        table_name = None

        if table == "top5":
            table_name = "TOP5"
        elif table == "bottom5":
            table_name = "BOTTOM5"
        else:
            logger.error('not a valid table name ', exc_info=True)

        # check if table exist. if not, create a new one #
        # data column |Date|Symbol|Rate|Rank|
        query = """CREATE TABLE IF NOT EXISTS `""" + table_name + """` (`Date` DATETIME NOT NULL,
                `Symbol` TEXT NOT NULL, `Rate` DOUBLE NOT NULL, `Rank` INTEGER NOT NULL, `Difference` DOUBLE NOT NULL, PRIMARY KEY (`Date`, `Rank`));"""

        # insert the data to the table #
        sql_insert_query = """ INSERT INTO `""" + table_name + """`  (Date, Symbol, Rate, Rank, Difference) values(%s, %s, %s, %s, %s)
                           ON DUPLICATE KEY UPDATE Symbol= VALUES(Symbol), Rate=VALUES(Rate), Difference=VALUES(Difference) """
        
        self.saveMultipleData(records_to_insert, query, sql_insert_query)

    def saveMultipleData(self, records_to_insert, query, sql_insert_query):
        try:
            logger.debug('Saving data to database')
            cnx = mysql.connector.connect(**self._config)
            cursor = cnx.cursor()

            cursor.execute(query)
            cnx.commit()
        
            #used executemany to insert many rows
            logger.debug(records_to_insert)
            result  = cursor.executemany(sql_insert_query, records_to_insert)
            logger.debug(result)
            cnx.commit()
            cursor.close()
        except Exception:
            logger.error('Unable to fecth data: ', exc_info=True)



