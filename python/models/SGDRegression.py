from sklearn.metrics import accuracy_score
from sklearn.metrics import mean_absolute_error

from sklearn.linear_model import SGDRegressor

import os
import sys
import numpy as np

import time
from datetime import datetime, date, time, timedelta

# get_data_block_start
from get_data import GetData
from save_data import SaveData

getData = GetData()
saveData = SaveData()

symbols = getData.getAllSymbols()

reg = SGDRegressor(
        max_iter=1e6, 
        loss='huber', 
        penalty='l2', 
        fit_intercept=False,
        shuffle=False, 
        tol=1e-4, 
        eta0=1e-4,
        average=True,
        warm_start=True)

# Situation 2: Use yesterday's 'open' 'low' 'hign' price to predict current day's 'close' price #
# Result: Still high accracy, some stocks are extremly unaccurare

for symbol in symbols:

    # data column: Date|Open|High|Low|Close|Adj_Close
    allFeatures = getData.getSymbolFeatures(symbol)

    result = []
    features = []
    dates = []

    for feature in allFeatures:
        result.append(feature[4])
        features.append(feature[1:3])
        dates.append(feature[0])

    # create train and test data set #
    high = len(features)
    mid = high - 100
    low = 0
    X_train = features[low:mid]
    y_train = result[low+1:mid+1]
    X_test = features[mid+1:high-1]
    y_test = result[mid+2:high]
    dates = dates[mid+2:high]

    reg.fit(X_train, y_train)

    # predict data #
    y_pred = reg.predict(X_test)

    print("[INFO] %s: %3.2f%%" % (symbol, round(reg.score(X_test, y_test)*100, 2)), file=sys.stderr)

    # save last 100 days' prediction data
    sql_data = []
    for i in range (0, len(y_pred)):
        save_date = dates[i][0:4] + "-" + dates[i][4:6] + "-" + dates[i][6:8]
        sql_data.append((save_date, str(y_pred[i])))

    saveData.saveMultipleData(symbol, "SGDRegression", sql_data)

    # Predict the next day
    today = datetime.strptime(dates[len(dates)-1], '%Y%m%d')
    next_day = today + timedelta(days= 7-today.weekday() if today.weekday()>3 else 1)
    next_day = next_day.strftime('%Y-%m-%d')
    next_price = str(reg.predict([features[len(features)-1]])[0])
    saveData.saveMultipleData(symbol, "SGDRegression", [tuple((next_day, next_price))])
    print(next_day + ": " + next_price)
