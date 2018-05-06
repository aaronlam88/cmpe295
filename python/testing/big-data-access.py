# get config to connect to database
import json
import mysql.connector

import sys
import pprint

data = json.load(open('../../ignore/db_config.json'))

config = {
  'user': data['username'],
  'password': data['password'],
  'host': data['host'],
  'database': data['database'],
  'raise_on_warnings': True,
  'buffered': True
}

cnx = mysql.connector.connect(**config)
cursor = cnx.cursor()

# first try to get all the tables we have in our database
allTable = []
query ="""SELECT Symbol FROM 4update ORDER BY Symbol;"""
cursor.execute(query)

try:
    result = cursor.fetchall()
    for row in result:        
        allTable.append(row[0])
except:
    print('Error: unable to fecth data')

# then get all data in our database, will need at least 510MB of memory!
database = {}
count = 0
for table in allTable:
    count = count + 1
    if count > 5:
        break
    database[table] = []
    query="""SELECT * FROM `%s` ORDER BY Date;""" % table
    cursor.execute(query)
    try:
        result = cursor.fetchall()
        count = cursor.rowcount
        for row in result:
            tempRow = {}
            tempRow['Date'] = row[0].strftime('%Y-%m-%d')
            tempRow['Close_Open'] = row[4] - row[1]
            tempRow['Close_High'] = row[4] - row[2]
            tempRow['Close_Low'] = row[4] - row[3]
            tempRow['Close_Adj'] = row[4] - row[5]
            tempRow['Volume'] = row[6]
            database[table].append(tempRow)
    except:
        print('Error: something wrong')
# send we get all the data, we can close the cursor now
cursor.close()

pp = pprint.PrettyPrinter(indent=4)
pp.pprint(database)