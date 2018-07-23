import sys
sys.path.insert(0, '../ultilities')
from MySQLConnector import MySQLConnector

connector =  MySQLConnector()
connect = connector.connect
cursor = connect.cursor()

table = 'AAP'
end_date = '2018-02-08' 
start_date = '2018-02-01'

query ="""SELECT * FROM %s WHERE Date >= %%s and Date <= %%s;""" % (table)
cursor.execute(query,(start_date, end_date))

for rows in cursor:
    print(rows)