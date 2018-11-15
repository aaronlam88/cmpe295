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

class SaveData:
    """This class provide functions to save data to our prediction database"""

    # def saveData(self, table, date, value):
    #     try:
    #         logger.debug('Saving data to database')
    #         config = {
    #             'user': "cmpe295",
    #             'password': "cmpe295.sjsu.2018",
    #             'host': "stockdatabase.cxswepygqy9j.us-west-1.rds.amazonaws.com",
    #             'database': "PredictionDatabase",
    #             'raise_on_warnings': True,
    #             'buffered': True
    #         }
    #         cnx = mysql.connector.connect(**config)
    #         cursor = cnx.cursor()
    #
    #         # data column |Date|Value|
    #
    #         # check if table exist. if not, create a new one
    #         if not self.checkTableExists(cnx, table):
    #             logger.debug("""Create a new table %s""" % (table))
    #             query = """CREATE TABLE IF NOT EXISTS `%s` (`Date` DATETIME NOT NULL, `Value` DOUBLE NULL, PRIMARY KEY (`Date`));""" % (table)
    #             cursor.execute(query)
    #
    #         # insert the data to the table
    #         query = """INSERT INTO `%s` (Date, Value) VALUES (%s, %s);""" % (table, date, value)
    #         print(query)
    #         cursor.execute(query)
    #         cnx.commit()
    #         cursor.close()
    #     except Exception:
    #         logger.error('Unable to fecth data: ', exc_info=True)


    def saveMultipleData(self, table, algo, records_to_insert):
        try:
            logger.debug('Saving data to database')
            config = {
                'user': "cmpe295",
                'password': "cmpe295.sjsu.2018",
                'host': "stockdatabase.cxswepygqy9j.us-west-1.rds.amazonaws.com",
                'database': "PredictionDatabase",
                'raise_on_warnings': True,

            }
            cnx = mysql.connector.connect(**config)
            cursor = cnx.cursor(prepared=True)

            # data column |Date|DTree|SVM|SGDLinear|SGDRegression

            # check if table exist. if not, create a new one
            if not self.checkTableExists(cnx, table):
                logger.debug("""Create a new table %s""" % (table))
                query = """CREATE TABLE IF NOT EXISTS `%s` (`Date` DATETIME NOT NULL,
                    `DTree` DOUBLE NULL, `SVM` DOUBLE NULL, `SGDLinear` DOUBLE NULL,
                    `SGDRegression` DOUBLE NULL, PRIMARY KEY (`Date`));""" % (table)
                cursor.execute(query)

            # insert the data to the table
            sql_insert_query = """ INSERT INTO """ + table + """ (Date, """ + algo + """) values(%s,%s) ON DUPLICATE KEY UPDATE """ + algo + """=%s"""

            #used executemany to insert many rows
            result  = cursor.executemany(sql_insert_query, records_to_insert)
            cnx.commit()
            cursor.close()
        except Exception:
            logger.error('Unable to fecth data: ', exc_info=True)


    def checkTableExists(self, dbcon, tablename):
        cursor = dbcon.cursor()
        stmt = "SHOW TABLES LIKE '%s' "% ('%'+str(tablename)+'%')
        cursor.execute(stmt)
        result = cursor.fetchone()
        return result
