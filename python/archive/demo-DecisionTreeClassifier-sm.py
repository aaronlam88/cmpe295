# get config to connect to database
import json

data = json.load(open('../../ignore/db_config.json'))

import mysql.connector

from sklearn import tree

################################################
# Connect to database and generate the cursor #
################################################
config = {
  'user': data['username'],
  'password': data['password'],
  'host': data['host'],
  'database': data['database'],
  'raise_on_warnings': True,
}

cnx = mysql.connector.connect(**config)
cursor = cnx.cursor()

################################################
# Get data from data database #
################################################
# tables stores some stock labels. We will use them to predict a specific stock
tables = ['StockDatabase.AAPL', 'StockDatabase.GOOGL', 'StockDatabase.AMZN']

# set up start date and end date. Collect stock data between these two dates
start_date = '2016-01-01'
end_date = '2018-01-01'

results = []
index = 0

# use for loop to get the data of the stocks in tables
# the result will be saved in results array
for table in tables:
    query ="""SELECT * FROM %s WHERE Date >= %%s and Date <= %%s;""" % (table)
    tmp = []
    try:
        cursor.execute(query,(start_date, end_date))
        result = cursor.fetchall()

        for row in result:
            Date = row[0]
            Open = row[1]
            High = row[2]
            Low = row[3]
            Close = row[4]
            Volumn = row[5]

            tmp.append(Close - Open)
    except:
        print('Error: unable to fecth data')

    results.append(tmp)
    index = index + 1


fb = []
# use for loop to get the data of the stock we want to predict. Here we select fb
# the result will be saved in fb array
query = ("SELECT * FROM StockDatabase.FB WHERE Date >= %s and Date <= %s;")

try:
    cursor.execute(query, (start_date, end_date))
    result = cursor.fetchall()

    for row in result:
        Date = row[0]
        Open = row[1]
        High = row[2]
        Low = row[3]
        Close = row[4]
        Volumn = row[5]
        if Close > Open:
            fb.append(1)
        else:
            fb.append(2)
except:
    print('Error: unable to fecth data')

stocks = list(zip(*results))

# generate classifier using decision tree algorithm
clf = tree.DecisionTreeClassifier()


stocks_a = stocks[0:400]
fb_a = fb[1:401]
stocks_b = stocks[401:430]
fb_b = fb[402:431]

# train the model
clf = clf.fit(stocks_a, fb_a)

count = 0

# check the accuracy
for idx, val in enumerate(stocks_b):

    if fb_b[idx] == clf.predict([val]):
        count = count + 1

print(count/len(fb_b))


cnx.close()
