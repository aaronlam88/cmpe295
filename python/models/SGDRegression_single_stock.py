from sklearn.metrics import accuracy_score
from sklearn.metrics import mean_absolute_error
from sklearn.cross_validation import train_test_split
from sklearn.cross_validation import cross_val_score
from sklearn.linear_model import SGDRegressor

import os
import sys
import numpy as np

# save accuracy score
results = open(os.path.basename(__file__)+'.csv', 'w')

# get_data_block_start
from get_data import GetData

getData = GetData()

accuracy = {}
meanSquaredError = {}

symbols = getData.getAllSymbols()


# Situation 1: Use current day's 'open' 'low' 'hign' price to predict current day's 'close' price #
# Result: hign algorithm accuracy, some stocks are extremly unaccurare #

for symbol in symbols:

    # data column: Open|High|Low|Close|Adj_Close
    allFeatures = getData.getSymbolFeaturesWithoutDate(symbol)

    accuracy[symbol] = []
    meanSquaredError[symbol] = []

    result = []
    features = []

    for feature in allFeatures:
        result.append(feature[3])
        features.append([feature[0], feature[1], feature[2]])

    # create train and test data set #
    X_train, X_test, y_train, y_test = train_test_split(features, result, test_size=.15)

    reg = SGDRegressor(max_iter=100000, loss='squared_loss', penalty='l2', shuffle=False, tol=1e-3, eta0=0.0001).fit(X_train, y_train)
    
    # predict data #
    y_pred = reg.predict(X_test)
   
    # accuracy score: returns the coefficient of determination R^2 of the prediction
    # The best possible score is 1.0 and it can be negative (because the model can be arbitrarily worse)
    accuracy[symbol].append(str(round(reg.score(X_test, y_test)*100, 2))+'%')

    # The square of the difference between the original values and the predicted values
    # It gives us the measure of how far the predictions were from the actual output
    meanSquaredError[symbol].append(str(round(mean_absolute_error(y_test, y_pred)))+'%')
    
    print("[INFO] %s: %3.2f%%" %
            (symbol, round(reg.score(X_test, y_test)*100, 2)), file=sys.stderr)
    
    print(symbol + ', ' + '(score accuracy)' + ', '.join(accuracy[symbol]), file=results)
    print(symbol + ', ' + '(mean squared error)' + ', '.join(meanSquaredError[symbol]), file=results) 