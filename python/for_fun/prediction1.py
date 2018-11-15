import os
import sys

if len(sys.argv) == 1:
    print(sys.argv[0] + ' ' + '[ DTree | SGD | SVM ]')
    sys.exit()

import csv
data = []
with open("DownloadAllNumbers.txt") as tsv:
    for line in csv.reader(tsv, dialect="excel-tab"):
        items = []
        for i in range (2, 8):  
            items.append(int(line[i]))
        data.append(items)

features = []
for i in range(1, len(data)):
    features.append(data[i])
features.reverse()

labels = []
for i in range(0, len(data)-1):
    labels.append(data[i][5])
labels.reverse()

# create classifier
my_classifier = None
classifier = sys.argv[1]
if classifier == 'DTree':
    from sklearn import tree
    my_classifier = tree.DecisionTreeClassifier()

if classifier == 'SGD':
    from sklearn.linear_model import SGDClassifier
    # max hinge+elasticnet
    my_classifier = SGDClassifier(loss="log", penalty="elasticnet", max_iter=20)

if classifier == 'SVM':
    from sklearn import svm
    my_classifier = svm.SVC()

if classifier == 'LOG':
    from sklearn.linear_model import LogisticRegression
    my_classifier = LogisticRegression()


from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

########################
# now the real MA work #
########################
# create train and test data set
X_test, X_train, y_test,  y_train = train_test_split(
    features, labels, test_size=.01)

# train the classifier
my_classifier.fit(X_train, y_train)
# do prediction
predictions = my_classifier.predict(X_test)

# print the result
print("[INFO] %3.2f%%" %
      (accuracy_score(y_test, predictions)*100), file=sys.stderr)

