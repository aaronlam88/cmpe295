from sklearn import tree
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
# get_data_block_end

for symbol in symbols:     
    # we just predict up/down of close price #
    result = getData.getSymbolCLFLabels(symbol, 4)
    features = getData.getSymbolFeatures(symbol)
    dates = []

    for feature in features:
        dates.append(feature[0])

    # create train and test data set #
    high = len(features)
    mid = high - 100
    low = 0
    X_train = features[low:mid]
    y_train = result[low:mid]
    X_test = features[mid+1:high-1]
    y_test = result[mid+1:high]
    dates = dates[mid+2:high]
        
    # create classifier
    my_classifier = tree.DecisionTreeClassifier()

    # train the classifier
    my_classifier.fit(X_train, y_train)
    # do prediction
    predictions = my_classifier.predict(X_test)

    # print the result
    print("[INFO] %s: %3.2f%%" %(symbol, accuracy_score(y_test, predictions)*100), file=sys.stderr)

    # save last 100 days' prediction data
    sql_data = []
    for i in range(0, len(predictions)):
        save_date = dates[i][0:4] + "-" + dates[i][4:6] + "-" + dates[i][6:8]
        sql_data.append((save_date, str(predictions[i])))

    saveData.saveMultipleData(symbol, "DTree", sql_data)

    # Predict the next day
    today = datetime.strptime(dates[len(dates)-1], '%Y%m%d')
    next_day = today + timedelta(days= 7-today.weekday() if today.weekday()>3 else 1)
    next_day = next_day.strftime('%Y-%m-%d')
    next_price = str(my_classifier.predict([features[len(features)-1]])[0])
    saveData.saveMultipleData(symbol, "DTree", [tuple((next_day, next_price))])
    print(next_day + ": " + next_price)

