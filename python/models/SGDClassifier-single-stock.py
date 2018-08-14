# system
import sys

# get config to connect to database
import json
import mysql.connector

# use this to save data, so we don't have to keep getting data from database
import pickle

dataCount = 1000

try:
    print('[INFO] Trying to load data', file=sys.stderr)
    data = pickle.load(open('data.save', 'rb'))
except Exception as e:
    print('[ERROR] Unable to load data, getting data from database', file=sys.stderr)
    print(e, file=sys.stderr)

    configData = json.load(open('../../ignore/db_config.json'))
    config = {
        'user': configData['username'],
        'password': configData['password'],
        'host': configData['host'],
        'database': configData['database'],
        'raise_on_warnings': True,
        'buffered': True
    }
    cnx = mysql.connector.connect(**config)
    cursor = cnx.cursor()

    # data column |Date|Open|High|Low|Close|CloseAdj|Volumn|

    # first try to get all the tables we have in our database
    allTables = []
    query = """SELECT Symbol FROM 4update ORDER BY Symbol;"""
    cursor.execute(query)

    try:
        result = cursor.fetchall()
        for row in result:
            allTables.append(row[0])
    except Exception as e:
        print('[ERROR] unable to fecth data', file=sys.stderr)
        print(e, file=sys.stderr)

    # get learn date
    data = {}
    for table in allTables:
        data[table] = []
        query = """SELECT * FROM `%s` ORDER BY Date DESC LIMIT %s;""" % (
            table, dataCount)
        cursor.execute(query)
        try:
            # just printing something so we know it's working
            print('          ', end='\r', file=sys.stderr)
            print(table, end='\r', file=sys.stderr)
            # save result
            result = cursor.fetchall()
            i = 0
            for row in result:
                temp = []
                temp.append(row[0].strftime("%Y%m%d"))
                temp.extend(row[1:])
                data[table].append(temp)
        except:
            print('[ERROR] Something wrong', file=sys.stderr)
            print(e, file=sys.stderr)

    print('          ', end='\r', file=sys.stderr)
    print('\n[DONE] get data: ' + str(len(data)), file=sys.stderr)

    # since we get all the data, we can close the cursor now
    cursor.close()
    # save all the data we get to local storage
    pickle.dump(data, open("data.save", "wb"))

from sklearn.linear_model import SGDClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

import copy

# use this to save the results
results = open('SGDClassifier-single-stock-result.csv', 'w')

fields = ['Open', 'High', 'Low', 'Close', 'Adj_Close']
accuracy = {}

for symbol in data:
    accuracy[symbol] = []
    data[symbol].reverse()
    ##########################
    # Data processing for ML #
    ##########################
    # need to do deepcopy because python will do shallow copy for array/list
    features = copy.deepcopy(data[symbol])
    features.reverse()
    features.pop()

    for field in range(1, 5):
        print('Making prediction for symbol: ' + symbol + ' on field: ' + fields[field-1])
        labels = []
        for i in range(1, dataCount):
            if data[symbol][i][field] > data[symbol][i-1][field]:
                labels.append(1)
            else:
                labels.append(0)
        labels.reverse()

        ########################
        # now the real MA work #
        ########################
        # create train and test data set
        X_test, X_train, y_test,  y_train = train_test_split(
            features, labels, test_size=.5)
        # create classifier
        # max hinge+elasticnet
        my_classifier = SGDClassifier(loss="log", penalty="elasticnet") 

        # train the classifier
        my_classifier.fit(X_train, y_train)
        # do prediction
        predictions = my_classifier.predict(X_test)

        accuracy[symbol].append(str(round(accuracy_score(y_test, predictions)*100, 2))+'%')

        # print the result
        print("[INFO] %s: %3.2f%%" %
            (symbol, accuracy_score(y_test, predictions)*100), file=sys.stderr)

for k in accuracy:
    print(k + ', ' + ', '.join(accuracy[k]), file=results)
    