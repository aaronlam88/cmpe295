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
allTables = []
query = """SELECT Symbol FROM 4update ORDER BY Symbol;"""
cursor.execute(query)

try:
    result = cursor.fetchall()
    for row in result:
        allTables.append(row[0])
except:
    print('Error: unable to fecth data')

# # get test data
# testData = {}
# for table in allTables:
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
dateCount = 0
first = True
# get learn date
learnData = {}
for table in allTables:
    learnData[table] = []
    query = """SELECT * FROM `%s` WHERE Date <= "2017-12-12" ORDER BY Date DESC LIMIT 1000;""" % table
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
            # tempRow.append(1 if row[4] - row[1] > 0 else 0)  # Close_Open
            # tempRow.append(1 if row[4] - row[2] > 0 else 0) # Close_High
            # tempRow.append(1 if row[4] - row[3] > 0 else 0) # Close_Low
            tempRow.append(1 if row[4] - row[5] > 0 else 0) # Close_Adj
            learnData[table].append(tempRow)
            if first:
                dateCount = dateCount + 1
        first = False
    except:
        print('Error: something wrong')
print('          ', end='\r', file=sys.stderr)
print('\n [DONE] get learnData: ' + str(len(learnData)), file=sys.stderr)

# send we get all the data, we can close the cursor now
cursor.close()

# building features
features = []
for i in range(0, dateCount):
    features.append([])
    for table in allTables:
        features[i] = features[i] + learnData.get(table)[i]

print('\n [DONE] get features: ' +
      str(sys.getsizeof(features)), file=sys.stderr)

# building labels
index = allTables.index('AAPL')  # get Facebook label
labels = []
for data in features:
    labels.append(data[index])

print('\n [DONE] get labels', file=sys.stderr)

# do ML work here
# since we want to use yesterday feature to predict today value,
# remove the first data point in labels, and last data point in
features.pop()
labels.pop(0)

from sklearn.cross_validation import train_test_split
X_train, X_test, y_train, y_test = train_test_split(
    features, labels, test_size=.2)
clf = tree.DecisionTreeClassifier()
clf = clf.fit(features, labels)

from sklearn import tree
my_classifier = tree.DecisionTreeClassifier()
my_classifier.fit(X_train, y_train)
predictions = my_classifier.predict(X_test)

from sklearn.metrics import accuracy_score
print(accuracy_score(y_test, predictions))
