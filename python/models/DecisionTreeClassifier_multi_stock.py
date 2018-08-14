from get_data import GetData
from sklearn import tree
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

import copy
import sys

getData = GetData()

# use this to save the results
results = open('DecisionTreeClassifier-multi-stock-result.csv', 'w')

fields = ['Open', 'High', 'Low', 'Close', 'Adj_Close']
accuracy = {}

# building features
features = getData.getAllFeatures()

symbols = getData.getAllSymbols()

for symbol in symbols:
    accuracy[symbol] = []

    for field in range(1, 5):
        labels = getData.getSymbolCLFLabels(symbol, field)
            
        ########################
        # now the real MA work #
        ########################
        # create train and test data set
        X_test, X_train, y_test,  y_train = train_test_split(
            features, labels, test_size=.5)
        # create classifier
        my_classifier = tree.DecisionTreeClassifier()

        # train the classifier
        my_classifier.fit(X_train, y_train)
        # do prediction
        predictions = my_classifier.predict(X_test)

        accuracy[symbol].append(str(round(accuracy_score(y_test, predictions)*100, 2))+'%')

        # print the result
        print("[INFO] %s: %3.2f%%" %
            (symbol, accuracy_score(y_test, predictions)*100), file=sys.stderr)

# print to file
for symbol in accuracy:
    print(symbol + ', ' + ', '.join(accuracy[symbol]), file=results)
    