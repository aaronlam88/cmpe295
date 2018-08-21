from sklearn.kernel_approximation import RBFSampler
from sklearn.linear_model import SGDClassifier

from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

import os
import sys

# save accuracy score
results = open(os.path.basename(__file__)+'.csv', 'w')

# get_data_block_start
from get_data import GetData

getData = GetData()

fields = ['Open', 'High', 'Low', 'Close', 'Adj_Close']
accuracy = {}

features = getData.getAllFeatures()
symbols = getData.getAllSymbols()
# get_data_block_end

for symbol in symbols:
    accuracy[symbol] = []

    for field in range(1, 5):
        labels = getData.getSymbolCLFLabels(symbol, field)

        ########################
        # now the real MA work #
        ########################
        # create train and test data set
        # X_test, X_train, y_test,  y_train = train_test_split(
        #     features, labels, test_size=.5)
        
        # create classifier
        rbf_feature = RBFSampler(gamma=1, random_state=1)
        X_features = rbf_feature.fit_transform(features)
        my_classifier = SGDClassifier()

        # train the classifier
        my_classifier.fit(features, labels)
        # do prediction
        predictions = my_classifier.score(features, labels)

        accuracy[symbol].append(str(predictions*100, 2)+'%')

        # print the result
        print("[INFO] %s: %3.2f%%" %
            (symbol, predictions*100), file=sys.stderr)
    print(symbol + ', ' + ', '.join(accuracy[symbol]), file=results)    
    