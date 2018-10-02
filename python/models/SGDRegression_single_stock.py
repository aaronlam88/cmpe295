from sklearn import linear_model
from sklearn.metrics import accuracy_score
from sklearn.cross_validation import train_test_split
from sklearn.cross_validation import cross_val_score

import os
import sys
import numpy as np

# save accuracy score
results = open(os.path.basename(__file__)+'.csv', 'w')

# get_data_block_start
from get_data import GetData

getData = GetData()

fields = ['Open', 'High', 'Low', 'Close', 'Adj_Close']
accuracy = {}

features = getData.getAllFeatures()
symbols = getData.getAllSymbols()

for symbol in symbols:
    accuracy[symbol] = []

    for field in range(1, 5):
        labels = getData.getSymbolCLFLabels(symbol, field)

        # create train and test data set
        X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size = 0.25, random_state = 4)
 
        reg = linear_model.SGDRegressor(max_iter=1000, tol=None)
        reg.fit(X_train, y_train)

        # test train split #
        predictionData = np.array(X_test, np.float64)
        y_pred = reg.predict(predictionData)
        y_predict = np.array(y_pred, np.int8)
        accuracy[symbol].append(str(round(accuracy_score(y_test, y_predict)*100, 2))+'%')
        
        print("[INFO] %s: %3.2f%%" %
            (symbol, accuracy_score(y_test, y_predict)*100), file=sys.stderr)

    print(symbol + ', ' + ', '.join(accuracy[symbol]), file=results)   