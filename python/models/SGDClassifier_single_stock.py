from sklearn.linear_model import SGDClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

import os
import sys

# get_data_block_start
from get_data import GetData
from save_data import SaveData

getData = GetData()
saveData = SaveData()

accuracy = {}

symbols = getData.getAllSymbols()

for symbol in symbols:
    accuracy[symbol] = []
     
    # we just predict up/down of close price #
    result = getData.getSymbolCLFLabels(symbol, 4)
    features = getData.getSymbolFeaturesWithoutDate(symbol)
    allFeatures = getData.getSymbolFeatures(symbol)
    dates = []

    for feature in allFeatures:
        dates.append(feature[0])

    # create train and test data set #
    X_train = features[0:900]
    y_train = result[1:901]
    X_test = features[901:998]
    y_test = result[902:999]
        
    # create classifier
    my_classifier = SGDClassifier(loss="log", penalty="elasticnet") 

    # train the classifier
    my_classifier.fit(X_train, y_train)

    # do prediction
    predictions = my_classifier.predict(X_test)

    accuracy[symbol].append(str(round(accuracy_score(y_test, predictions)*100, 2))+'%')

    # print the result
    print("[INFO] %s: %3.2f%%" %
        (symbol, accuracy_score(y_test, predictions)*100), file=sys.stderr)
   
    # save the results to db
    for i in range(999, 900, -1):
        res = my_classifier.predict([features[i]])
        save_date = dates[i][0:4] + "-" + dates[i][4:6] + "-" + dates[i][6:8]
        saveData.saveMultipleData(symbol, "SGDLinear", [tuple((save_date, str(res[0])))])



