import os
import sys

if len(sys.argv) == 1:
    print(sys.argv[0] + ' ' + '[ DTree | SGD | SVM ]')
    sys.exit()

# create classifier
my_classifier = None
classifier = sys.argv[1]
if classifier == 'DTree':
    from sklearn import tree
    my_classifier = tree.DecisionTreeClassifier()

if classifier == 'SGD':
    from sklearn.linear_model import SGDClassifier
    # max hinge+elasticnet
    my_classifier = SGDClassifier(loss="log", penalty="elasticnet")

if classifier == 'SVM':
    from sklearn import svm
    my_classifier = svm.SVC()

from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

# save accuracy score
results = open(os.path.basename(__file__)+'.csv', 'w')

# get_data_block_start
from get_data import GetData

getData = GetData()

fields = ['Open', 'High', 'Low', 'Close', 'Adj_Close']
accuracy = {}

if len(sys.argv) == 3:
    features = getData.getAllFeaturesDiff()
else:
    features = getData.getAllFeatures()
symbols = getData.getAllSymbols()
# get_data_block_end

for symbol in symbols:
    accuracy[symbol] = []

    for field in range(1, 5):
        if len(sys.argv) == 3:
            labels = getData.getSymbolCLFLabelsDiff(symbol, field)
        else:
            labels = getData.getSymbolCLFLabels(symbol, field)

        ########################
        # now the real MA work #
        ########################
        # create train and test data set
        X_test, X_train, y_test,  y_train = train_test_split(
            features, labels, test_size=.5)

        # train the classifier
        my_classifier.fit(X_train, y_train)
        # do prediction
        predictions = my_classifier.predict(X_test)

        accuracy[symbol].append(str(round(accuracy_score(y_test, predictions)*100, 2))+'%')

        # print the result
        print("[INFO] %s: %3.2f%%" %
            (symbol, accuracy_score(y_test, predictions)*100), file=sys.stderr)
    print(symbol + ', ' + ', '.join(accuracy[symbol]), file=results)    
    