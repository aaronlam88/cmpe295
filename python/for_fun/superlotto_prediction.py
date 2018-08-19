import csv
import copy
import sys

data = []
i = 0
with open("DownloadAllNumbers.txt") as tsv:
    for line in csv.reader(tsv, dialect="excel-tab"):
        data.append(line[2: 9])

features = []
for i in range(1, len(data)):
    features.append([])
    features.append(data[i])

labels = []
for i in range(0, len(data)-1):
    labels.append(data[i][5])

from sklearn import tree
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

# for i in range (1, len(features)):
#     print(features[i], end='->')
#     print(labels[i])

########################
# now the real MA work #
########################
# create train and test data set
X_test, X_train, y_test,  y_train = train_test_split(
    features, labels, test_size=.5)

# create classifier
my_classifier = tree.DecisionTreeClassifier()

# train the classifier
my_classifier.fit(X_train, y_train)
# do prediction
predictions = my_classifier.predict(X_test)

# print the result
print("[INFO] %3.2f%%" %
      (accuracy_score(y_test, predictions)*100), file=sys.stderr)
