# get config to connect to database
import json
import mysql.connector

# config = {
#   'user': data['username'],
#   'password': data['password'],
#   'host': data['host'],
#   'database': data['database'],
#   'raise_on_warnings': True,
# }

# cnx = mysql.connector.connect(**config)
# cursor = cnx.cursor()

# table = 'AAP'
# end_date = '2018-02-08' 
# start_date = '2018-02-01'

# query ="""SELECT * FROM %s WHERE Date >= %%s and Date <= %%s;""" % (table)
# cursor.execute(query,(start_date, end_date))


# for rows in cursor:
#     print(rows)

# cnx.close()

class MySQLConnector(object):
    class __MySQLConnector:
        def __init__(self):
            data = json.load(open('../../ignore/db_config.json'))
            config = {
                'user': data['username'],
                'password': data['password'],
                'host': data['host'],
                'database': data['database'],
                'raise_on_warnings': True,
            }
            self.connect = mysql.connector.connect(**config)
            self.val = None
    instance = None
    def __new__(cls): # __new__ always a classmethod
        if not MySQLConnector.instance:
            MySQLConnector.instance = MySQLConnector.__MySQLConnector()
        return MySQLConnector.instance