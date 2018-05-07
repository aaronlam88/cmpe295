# get config to connect to database
import json
import mysql.connector

import sys

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

# get test data
testData = {}
for table in allTable:
    testData[table] = []
    query="""SELECT * FROM `%s` WHERE Date >= "2017-01-01" AND Date <= "2018-01-01" ORDER BY Date;""" % table
    cursor.execute(query)
    try:
        result = cursor.fetchall()
        for row in result:
            tempRow = {}
            tempRow['Date'] = row[0].strftime('%Y-%m-%d')
            tempRow['Close_Open'] = row[4] - row[1]
            tempRow['Close_High'] = row[4] - row[2]
            tempRow['Close_Low'] = row[4] - row[3]
            tempRow['Close_Adj'] = row[4] - row[5]
            tempRow['Volume'] = row[6]
            testData[table].append(tempRow)
    except:
        print('Error: something wrong')

# get learn date
learnData = {}
for table in allTable:
    learnData[table] = []
    query="""SELECT * FROM `%s` WHERE Date >= "2013-01-01" AND Date <= "2017-01-01" ORDER BY Date;""" % table
    cursor.execute(query)
    try:
        result = cursor.fetchall()
        for row in result:
            tempRow = {}
            tempRow['Date'] = row[0].strftime('%Y-%m-%d')
            tempRow['Close_Open'] = row[4] - row[1]
            tempRow['Close_High'] = row[4] - row[2]
            tempRow['Close_Low'] = row[4] - row[3]
            tempRow['Close_Adj'] = row[4] - row[5]
            tempRow['Volume'] = row[6]
            learnData[table].append(tempRow)
    except:
        print('Error: something wrong')

# send we get all the data, we can close the cursor now
cursor.close()

print(testData)
print(learnData)