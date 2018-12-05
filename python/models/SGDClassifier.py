from sklearn.linear_model import SGDClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

import os
import sys

import time
from datetime import datetime, date, time, timedelta

# get_data_block_start
from get_data import GetData
from save_data import SaveData

getData = GetData()
saveData = SaveData()

symbols = getData.getAllSymbols()

for symbol in symbols:     
    # we just predict up/down of close price #
    result = getData.getSymbolCLFLabels(symbol, 4)
    features = getData.getSymbolFeaturesWithoutDate(symbol)
    allFeatures = getData.getSymbolFeatures(symbol)
    dates = []

    for feature in allFeatures:
        dates.append(feature[0])

    # create train and test data set #
    high = len(features)
    mid = high - 100
    low = 0
    X_train = features[low:mid]
    y_train = result[low:mid]
    X_test = features[mid+1:]
    y_test = result[mid+1:]
    dates = dates[mid+2:]
        
    # create classifier
    my_classifier = SGDClassifier(loss="log", penalty="elasticnet") 

    # train the classifier
    my_classifier.fit(X_train, y_train)

    # do prediction
    predictions = my_classifier.predict(X_test)

    # print the result
    print("[INFO] %s: %3.2f%%" % (symbol, accuracy_score(y_test, predictions)*100), file=sys.stderr)
   
    # save last 100 days' prediction data
    sql_data = []
    for i in range(0, len(predictions)):
        save_date = dates[i][0:4] + "-" + dates[i][4:6] + "-" + dates[i][6:8]
        sql_data.append((save_date, str(predictions[i])))

    saveData.saveMultipleData(symbol, "SGDLinear", sql_data)

    # Predict the next day
    today = datetime.strptime(dates[len(dates)-1], '%Y%m%d')
    next_day = today + timedelta(days= 7-today.weekday() if today.weekday()>3 else 1)
    next_day = next_day.strftime('%Y-%m-%d')
    next_price = str(my_classifier.predict([features[len(features)-1]])[0])
    saveData.saveMultipleData(symbol, "SGDLinear", [tuple((next_day, next_price))])
    print(next_day + ": " + next_price)



