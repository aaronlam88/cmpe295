# get config to connect to database
import json
import mysql.connector

import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class SaveData:
    """This class provide functions to save data to our prediction database"""
    count = 0
    max = 100 * 1000
    cnx = None
    cursor = None

    def __init__(self):
        configData = json.load(open('../../ignore/db_config.json'))

        config = {
            'user': configData['username'],
            'password': configData['password'],
            'host': configData['host'],
            'database': 'PredictionDatabase',
            'raise_on_warnings': True,
            'buffered': True
        }

        try:
            self.cnx = mysql.connector.connect(**config)
            self.cursor = self.cnx.cursor()
        except Exception:
            logger.error('Unable to connect to database: ', exc_info=True)

    def saveMultipleData(self, table, algo, records_to_insert):
        try:
            # data column |Date|DTree|SVM|SGDLinear|SGDRegression|LASSORegression

            # check if table exist. if not, create a new one
            # query = """CREATE TABLE IF NOT EXISTS `%s` (`Date` DATETIME NOT NULL,
            #     `DTree` DOUBLE NULL, `SVM` DOUBLE NULL, `SGDLinear` DOUBLE NULL,
            #     `SGDRegression` DOUBLE NULL, `LASSORegression` DOUBLE NULL, PRIMARY KEY (`Date`));""" % (table)
            # self.cursor.execute(query)
            # self.cnx.commit()

            # insert the data to the table
            sql_insert_query = """ INSERT INTO `""" + table + """` (Date, """ + algo + """) values(%s,%s) ON DUPLICATE KEY UPDATE """ + algo + """=Values(""" + algo + """)"""

            #used executemany to insert many rows
            self.cursor.executemany(sql_insert_query, records_to_insert)
            self.cnx.commit()
        except Exception:
            logger.error('Unable to SAVE data: ', exc_info=True)

    def __del__(self):
        self.cursor.close()
        self.cnx.close()
