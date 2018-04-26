# get config to connect to database
import json

data = json.load(open('../../ignore/db_config.json'))

import mysql.connector

from sklearn import tree


config = {
  'user': data['username'],
  'password': data['password'],
  'host': data['host'],
  'database': data['database'],
  'raise_on_warnings': True,
}

cnx = mysql.connector.connect(**config)
cursor = cnx.cursor()

googl = []
appl = []
amzn = []
fb = []

query = ("SELECT * FROM StockDatabase.AAPL WHERE Date >= %s and Date <= %s;")
stocks = ['SP500.AAPL', 'SP500.GOOGL', 'SP500.AMZN', 'SP500.FB']
start_date = '2017-01-01' 
end_date = '2018-01-01'

cursor.execute(query, (start_date, end_date))
try:
    results = cursor.fetchall()
    
    for row in results:
        Date = row[0]
        Open = row[1]
        High = row[2]
        Low = row[3]
        Close = row[4]
        Volumn = row[5]
        appl.append(Close - Open)
except:
    print('Error: unable to fecth data')


query = ("SELECT * FROM StockDatabase.GOOGL WHERE Date >= %s and Date <= %s;")
try:
    cursor.execute(query, (start_date, end_date))
    results = cursor.fetchall()
    
    for row in results:
        Date = row[0]
        Open = row[1]
        High = row[2]
        Low = row[3]
        Close = row[4]
        Volumn = row[5]
        googl.append(Close - Open)
except:
    print('Error: unable to fecth data')

query = ("SELECT * FROM StockDatabase.AMZN WHERE Date >= %s and Date <= %s;")

try:
    cursor.execute(query, (start_date, end_date))
    results = cursor.fetchall()
    
    for row in results:
        Date = row[0]
        Open = row[1]
        High = row[2]
        Low = row[3]
        Close = row[4]
        Volumn = row[5]
        amzn.append(Close - Open)
except:
    print('Error: unable to fecth data')


query = ("SELECT * FROM StockDatabase.FB WHERE Date >= %s and Date <= %s;")

try:
    cursor.execute(query, (start_date, end_date))
    results = cursor.fetchall()
    
    for row in results:
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



stocks = list(zip(appl, googl, amzn))

clf = tree.DecisionTreeClassifier()


stocks_a = stocks[0:200]
fb_a = fb[1:201]
stocks_b = stocks[201:230]
fb_b = fb[202:231]

clf = clf.fit(stocks_a, fb_a)

count = 0

for idx, val in enumerate(stocks_b):

    if fb_b[idx] == clf.predict([val]):
        count = count + 1

print(count/len(fb_b))


cnx.close()
