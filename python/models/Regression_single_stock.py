from sklearn import svm
from sklearn.svm import SVR

import os

# save accuracy score
results = open(os.path.basename(__file__)+'.csv', 'w')

# get_data_block_start
from get_data import GetData

getData = GetData()

accuracy = {}

features = getData.getSymbolFeaturesWithoutDate('AMZN')

closePrice = []

for feature in features:
    closePrice.append(feature[3])

X = features[0:900]
y = closePrice[1:901]

svr_rbf = SVR(kernel='rbf', C=1e3, gamma=0.1)
svr_lin = SVR(kernel='linear', C=1e3)
svr_poly = SVR(kernel='poly', C=1e3, degree=2)

y_rbf = svr_rbf.fit(X, y).predict(features[901:999])
print('y_rbf')
print(y_rbf)
y_lin = svr_lin.fit(X, y).predict(features[901:999])
print('y_lin')
print(y_lin)
y_poly = svr_poly.fit(X, y).predict(features[901:999])
print('y_poly')
print(y_poly)
