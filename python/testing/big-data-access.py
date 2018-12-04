# system
import sys

# sklearn
from sklearn import tree

# get config to connect to database
import json
import mysql.connector

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

# data column |Date|Open|High|Low|Close|CloseAdj|Volumn|

# first try to get all the tables we have in our database
allTable = []
query = """SELECT Symbol FROM 4update ORDER BY Symbol;"""
cursor.execute(query)

try:
    result = cursor.fetchall()
    for row in result:
        allTable.append(row[0])
except:
    print('Error: unable to fecth data')

# # get test data
# testData = {}
# for table in allTable:
#     testData[table] = []
#     query="""SELECT * FROM `%s` WHERE Date >= "2017-01-01" AND Date <= "2018-01-01" ORDER BY Date;""" % table
#     cursor.execute(query)
#     try:
#         sys.stdout.flush()
#         sys.stdout.write('\r' + table)
#         result = cursor.fetchall()
#         for row in result:
#             tempRow = {}
#             tempRow['Date'] = row[0].strftime('%Y-%m-%d')
#             tempRow['Close_Open'] = row[4] - row[1]
#             tempRow['Close_High'] = row[4] - row[2]
#             tempRow['Close_Low'] = row[4] - row[3]
#             tempRow['Close_Adj'] = row[4] - row[5]
#             tempRow['Volume'] = row[6]
#             testData[table].append(tempRow)
#     except:
#         print('Error: something wrong')
# print('\nDone get testData: ' + str(len(testData)))

# get learn date
learnData = {}
for table in allTable:
    learnData[table] = []
    query = """SELECT * FROM `%s` WHERE Date >= "2013-01-01" AND Date <= "2017-01-01" ORDER BY Date;""" % table
    cursor.execute(query)
    try:
        # just printing something so we know it's working
        sys.stdout.flush()
        sys.stdout.write('\r' + table)
        # save result
        result = cursor.fetchall()
        i = 0
        for row in result:
            tempRow = {}
            tempRow['Date'] = row[0].strftime('%Y-%m-%d')
            tempRow['Close_Open'] = 1 if row[4] - row[1] > 0 else 0
            tempRow['Close_High'] = 1 if row[4] - row[2] > 0 else 0
            tempRow['Close_Low'] = 1 if row[4] - row[3] > 0 else 0
            tempRow['Close_Adj'] = 1 if row[4] - row[5] > 0 else 0
            learnData[table].append(tempRow)
    except:
        print('Error: something wrong')

print('\nDone get learnData: ' + str(len(learnData)))

# send we get all the data, we can close the cursor now
cursor.close()

print(learnData)