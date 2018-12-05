from sklearn.metrics import accuracy_score
from sklearn.metrics import mean_absolute_error
from sklearn.cross_validation import train_test_split
from sklearn.cross_validation import cross_val_score
from sklearn import linear_model

import os
import sys

import time
from datetime import datetime, date, time, timedelta

# get_data_block_start
from get_data import GetData
from save_data import SaveData

getData = GetData()
saveData = SaveData()

accuracy = {}
meanSquaredError = {}

symbols = getData.getAllSymbols()

reg = linear_model.Lasso(
        alpha=0.1,
        fit_intercept=False,
        normalize=True,
        precompute=True,
        copy_X=False,
        max_iter=10000000,
        tol=0.000001,
        warm_start=True,
        positive=False,
        random_state=None,
        selection='random'
)

for symbol in symbols:

    # data column: Date|Open|High|Low|Close|Adj_Close
    allFeatures = getData.getSymbolFeatures(symbol)

    accuracy[symbol] = []
    meanSquaredError[symbol] = []

    result = []
    features = []
    dates = []

    for feature in allFeatures:
        result.append(feature[4])
        features.append(feature[1:])
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

    # print the result
    print("[INFO] %s: %3.2f%%" % (symbol, round(reg.score(X_test, y_test)*100, 2)), file=sys.stderr)

    # save last 100 days' prediction data
    sql_data = []
    for i in range (0, len(y_pred)):
        save_date = dates[i][0:4] + "-" + dates[i][4:6] + "-" + dates[i][6:8]
        sql_data.append((save_date, str(y_pred[i])))

    saveData.saveMultipleData(symbol, "LASSORegression", sql_data)

    # Predict the next day
    today = datetime.strptime(dates[len(dates)-1], '%Y%m%d')
    next_day = today + timedelta(days= 7-today.weekday() if today.weekday()>3 else 1)
    next_day = next_day.strftime('%Y-%m-%d')
    next_price = str(reg.predict([features[len(features)-1]])[0])
    saveData.saveMultipleData(symbol, "LASSORegression", [tuple((next_day, next_price))])
    print(next_day + ": " + next_price)

