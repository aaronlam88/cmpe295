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

    def saveMultipleData(self, table, algo, records_to_insert):
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

            # data column |Date|DTree|SVM|SGDLinear|SGDRegression|LASSORegression

            # check if table exist. if not, create a new one

            logger.debug("""Create a new table %s""" % (table))
            query = """CREATE TABLE IF NOT EXISTS `%s` (`Date` DATETIME NOT NULL,
                `DTree` DOUBLE NULL, `SVM` DOUBLE NULL, `SGDLinear` DOUBLE NULL,
                `SGDRegression` DOUBLE NULL, `LASSORegression` DOUBLE NULL, PRIMARY KEY (`Date`));""" % (table)
            cursor.execute(query)
            cnx.commit()

            # insert the data to the table
            sql_insert_query = """ INSERT INTO `""" + table + """` (Date, """ + algo + """) values(%s,%s) ON DUPLICATE KEY UPDATE """ + algo + """=Values(""" + algo + """)"""

            #used executemany to insert many rows
            print(records_to_insert)
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
