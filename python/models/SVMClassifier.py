
from sklearn import svm
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

import os
import sys

# save accuracy score
results = open(os.path.basename(__file__)+'.csv', 'w')

# get_data_block_start
from get_data import GetData
from save_data import SaveData

getData = GetData()
saveData = SaveData()

fields = ['Open', 'High', 'Low', 'Close', 'Adj_Close']
accuracy = {}

symbols = getData.getAllSymbols()
# get_data_block_end

for symbol in symbols:
    accuracy[symbol] = []
     
    # we just predict up/down of close price #
    result = getData.getSymbolCLFLabels(symbol, 4)
    features = getData.getSymbolFeatures(symbol)
    dates = []

    for feature in features:
        dates.append(feature[0])

    # create train and test data set #
    X_train = features[0:900]
    y_train = result[1:901]
    X_test = features[901:998]
    y_test = result[902:999]
        
    # create classifier
    my_classifier = svm.SVC()

    # train the classifier
    my_classifier.fit(X_train, y_train)
    # do prediction
    predictions = my_classifier.predict(X_test)

    accuracy[symbol].append(str(round(accuracy_score(y_test, predictions)*100, 2))+'%')

    # print the result
    print("[INFO] %s: %3.2f%%" %
        (symbol, accuracy_score(y_test, predictions)*100), file=sys.stderr)
   
    for i in range(1000, 900, -1):
        res = my_classifier.predict([features[i]])
        save_date = dates[i][0:4] + "-" + dates[i][4:6] + "-" + dates[i][6:8]
        saveData.saveMultipleData(symbol, "SVM", [tuple((save_date, str(res[0])))])



