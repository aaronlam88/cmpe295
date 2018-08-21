from sklearn import tree
features = [[140.1, 1.1], [130.1, 1.1], [150.1, 0.1], [170.1, 0.1]]
labels = [0, 0, 1, 1]
clf = tree.DecisionTreeClassifier()
clf = clf.fit(features, labels)
print(clf.predict([[150, 0]]))