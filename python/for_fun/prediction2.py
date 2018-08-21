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


from sklearn.model_selection import train_test_split
# create train and test data set
X_test, X_train, y_test,  y_train = train_test_split(
    features, labels, test_size=.01)


from sklearn.model_selection import ParameterGrid
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
import parfit.parfit as pf
grid = {
    'C': [1e-7, 1e-6, 1e-5, 1e-4, 1e-3, 1e-2, 1e-1, 1e0],
    'penalty': ['l2'],
    'n_jobs': [-1]
}
paramGrid = ParameterGrid(grid)
bestModel, bestScore, allModels, allScores = pf.bestFit(LogisticRegression, paramGrid,
           X_train, y_train, X_test, y_test, 
           metric = roc_auc_score, bestScore='max',
           scoreLabel = "AUC")
print(bestModel, bestScore)