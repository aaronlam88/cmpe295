from sklearn.metrics import accuracy_score
from sklearn.metrics import mean_absolute_error
from sklearn.cross_validation import train_test_split
from sklearn.cross_validation import cross_val_score
from sklearn.linear_model import SGDRegressor

import os
import sys
import numpy as np

# save accuracy score
results = open(os.path.basename('SGDRegression_Score')+'.csv', 'w')

# get_data_block_start
from get_data import GetData

getData = GetData()

fields = ['Open', 'High', 'Low', 'Close', 'Adj_Close']
accuracy = {}

symbols = getData.getAllSymbols()

for symbol in symbols:
    accuracy[symbol] = []
    allFeatures = getData.getSymbolFeaturesWithoutDate(symbol)
    result = []
    features = []

    for feature in allFeatures:
        result.append(feature[3])
        features.append([feature[0], feature[3]])

    # create train and test data set
    X_train, X_test, y_train, y_test = train_test_split(features, result, test_size=.15)

    reg = SGDRegressor(max_iter=100000, loss='squared_loss', penalty='l2', shuffle=False, tol=1e-3, eta0=0.0001).fit(X_train, y_train)
    
    # test train split #
    y_pred = reg.predict(X_test)
   
    accuracy[symbol].append(str(round(reg.score(X_test, y_test)*100, 2))+'%')
    
    print("[INFO] %s: %3.2f%%" %
            (symbol, round(reg.score(X_test, y_test)*100, 2)), file=sys.stderr)

    print(symbol + ', ' + ', '.join(accuracy[symbol]), file=results) 