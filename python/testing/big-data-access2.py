# system
import sys

# get config to connect to database
import json
import mysql.connector

# use this to save data, so we don't have to keep getting data from database
import pickle

dateCount = 1000

try:
    print('Trying to load data', file=sys.stderr)
    data = pickle.load(open('data.save', 'rb'))
except Exception as e:
    print(e)
    print('Unable to load data, getting data from database', file=sys.stderr)

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
    except:
        print('Error: unable to fecth data', file=sys.stderr)

    # get learn date
    data = {}
    for table in allTables:
        data[table] = []
        query = """SELECT * FROM `%s` ORDER BY Date DESC LIMIT %s;""" % (
            table, dateCount)
        cursor.execute(query)
        try:
            # just printing something so we know it's working
            print('          ', end='\r', file=sys.stderr)
            print(table, end='\r', file=sys.stderr)
            # save result
            result = cursor.fetchall()
            i = 0
            for row in result:
                tempRow = []
                tempRow.append(1 if row[2] - row[1] > 0 else 0)  # High_Open
                tempRow.append(1 if row[3] - row[1] > 0 else 0)  # Low_Open
                tempRow.append(1 if row[4] - row[1] > 0 else 0)  # Close_Open
                tempRow.append(1 if row[5] - row[1] > 0 else 0)  # Adj_Open
                data[table].append(tempRow)
        except:
            print('Error: something wrong')
    print('          ', end='\r', file=sys.stderr)
    print('\n[DONE] get data: ' + str(len(data)), file=sys.stderr)

    # send we get all the data, we can close the cursor now
    cursor.close()

    pickle.dump(data, open("data.save", "wb"))

##########################
# Data processing for ML #
##########################
# build allTables array
allTables = []
for key in data.keys():
    if not key.startswith('^'):
        allTables.append(key)

# building features
features = []
for i in range(0, dateCount):
    features.append([])
    for table in data.keys():
        features[i] = features[i] + data.get(table)[i]
print('[DONE] get features', file=sys.stderr)

# build allLabels dict
allLabels = {}
for i in range(0, len(allTables)):
    allLabels[allTables[i]] = []
    for data in features:
        allLabels[allTables[i]].append(data[i])
print('[DONE] get allLabels', file=sys.stderr)

# remove the last date data for features
features.pop()

########################
# now the real MA work #
########################
from sklearn import tree
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

# use this to save the results
results = open('results.txt', 'w')

for table in allTables:
    # build the labels for current table
    labels = allLabels[table]
    # remove the first date data for labels
    labels.pop(0)
    # create train and test data set
    X_train, X_test, y_train, y_test = train_test_split(
        features, labels, test_size=.5)
    # create classifier
    my_classifier = tree.DecisionTreeClassifier()
    # train the classifier
    my_classifier.fit(X_train, y_train)
    # do prediction
    predictions = my_classifier.predict(X_test)
    # print the result
    print("%s: %3.2f%%" %
          (table, accuracy_score(y_test, predictions)*100), file=sys.stderr)
    # print to file
    print("%s: %3.2f%%" %
          (table, accuracy_score(y_test, predictions)*100), file=results)
