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

class SaveTop5:
    """This class provide functions to save top 5 stocks and bottom 5 stocks to our prediction database"""

    def saveMultipleData(self, date, symbol, rate, rank):
        try:
            logger.debug('Saving data to database')
            config = {
                'user': "cmpe295",
                'password': "cmpe295.sjsu.2018",
                'host': "stockdatabase.cxswepygqy9j.us-west-1.rds.amazonaws.com",
                'database': "PredictionDatabase",
                'raise_on_warnings': False,
                'buffered': True
            }
            cnx = mysql.connector.connect(**config)
            cursor = cnx.cursor()

            # data column |Date|Symbol|Rate|Rank|

            # check if table exist. if not, create a new one

            logger.debug("""Create a new table TOP5""")
            query = """CREATE TABLE IF NOT EXISTS `TOP5` (`Date` DATETIME NOT NULL,
                    `Symbol` TEXT NOT NULL, `Rate` DOUBLE NOT NULL, `Rank` INTEGER NOT NULL, PRIMARY KEY (`Date`, `Rank`));"""
            logger.debug(query)
            cursor.execute(query)
            cnx.commit()

            # insert the data to the table
            sql_insert_query = """ INSERT INTO `TOP5`  (Date, Symbol, Rate, Rank) values(%s, %s, %s, %s)
                               ON DUPLICATE KEY UPDATE Symbol= VALUES(symbol), Rate=VALUES(Rate) """
                               
            logger.debug(sql_insert_query)
            records_to_insert = [tuple((date, symbol, rate, rank))]

            #used executemany to insert many rows
            logger.debug(records_to_insert)
            result  = cursor.executemany(sql_insert_query, records_to_insert)
            logger.debug(result)
            cnx.commit()
            cursor.close()
        except Exception:
            logger.error('Unable to fecth data: ', exc_info=True)



