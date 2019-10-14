## Data and Visual Analytics - Homework 4
## Georgia Institute of Technology
## Applying ML algorithms to detect seizure

import numpy as np
import pandas as pd
import time

from sklearn.model_selection import cross_val_score, GridSearchCV, cross_validate, train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.svm import SVC
from sklearn.linear_model import LinearRegression
from sklearn.neural_network import MLPClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, normalize

######################################### Reading and Splitting the Data ###############################################
# XXX
# TODO: Read in all the data. Replace the 'xxx' with the path to the data set.
# XXX
data = pd.read_csv('seizure_dataset.csv')

# Separate out the x_data and y_data.
x_data = data.loc[:, data.columns != "y"]
y_data = data.loc[:, "y"]

# The random state to use while splitting the data.
random_state = 100

# XXX
# TODO: Split 70% of the data into training and 30% into test sets. Call them x_train, x_test, y_train and y_test.
# Use the train_test_split method in sklearn with the paramater 'shuffle' set to true and the 'random_state' set to 100.
# XXX
x_train, x_test, y_train, y_test = train_test_split(x_data, y_data, test_size = 0.3, shuffle = True, random_state = random_state)

# ############################################### Linear Regression ###################################################
# XXX
# TODO: Create a LinearRegression classifier and train it.
# XXX
linreg = LinearRegression().fit(x_train, y_train)

# XXX
# TODO: Test its accuracy (on the training set) using the accuracy_score method.
# TODO: Test its accuracy (on the testing set) using the accuracy_score method.
# Note: Use y_predict.round() to get 1 or 0 as the output.
# XXX
y_train_predict = linreg.predict(x_train).round()
y_test_predict = linreg.predict(x_test).round()

print("Train Accuracy : {0}".format(accuracy_score(y_train, y_train_predict)))
print("Test Accuracy: {0}".format(accuracy_score(y_test, y_test_predict)))

# ############################################### Multi Layer Perceptron #################################################
# XXX
# TODO: Create an MLPClassifier and train it.
# XXX
mlp = MLPClassifier(random_state=random_state).fit(x_train, y_train)

# XXX
# TODO: Test its accuracy on the training set using the accuracy_score method.
# TODO: Test its accuracy on the test set using the accuracy_score method.
# XXX
y_train_predict = mlp.predict(x_train)
y_test_predict = mlp.predict(x_test)

print("Train Accuracy : {0}".format(accuracy_score(y_train, y_train_predict)))
print("Test Accuracy: {0}".format(accuracy_score(y_test, y_test_predict)))




# ############################################### Random Forest Classifier ##############################################
# XXX
# TODO: Create a RandomForestClassifier and train it.
# XXX
rf = RandomForestClassifier(random_state=random_state).fit(x_train, y_train)


# XXX
# TODO: Test its accuracy on the training set using the accuracy_score method.
# TODO: Test its accuracy on the test set using the accuracy_score method.
# XXX
y_train_predict = rf.predict(x_train)
y_test_predict = rf.predict(x_test)

print("Train Accuracy : {0}".format(accuracy_score(y_train, y_train_predict)))
print("Test Accuracy: {0}".format(accuracy_score(y_test, y_test_predict)))

# XXX
# TODO: Tune the hyper-parameters 'n_estimators' and 'max_depth'.
#       Print the best params, using .best_params_, and print the best score, using .best_score_.
# XXX
rf_tuned_params = {'n_estimators': [22, 26, 30], 'max_depth': [18, 26, 34]}
rf_grid = GridSearchCV(RandomForestClassifier(random_state=random_state), param_grid= rf_tuned_params, cv=10).fit(x_train, y_train)

# Best params
print(rf_grid.best_params_)

# Best score
print(rf_grid.best_score_)

# Accuracy on Test Data using best parameters
best_rf = RandomForestClassifier(n_estimators=rf_grid.best_params_['n_estimators'], max_depth= rf_grid.best_params_['max_depth'], random_state=random_state).fit(x_train, y_train)

y_test_predict = best_rf.predict(x_test)

print("Best Test Accuracy: {0}".format(accuracy_score(y_test, y_test_predict)))


# ############################################ Support Vector Machine ###################################################
# XXX
# TODO: Pre-process the data to standardize or normalize it, otherwise the grid search will take much longer
# TODO: Create a SVC classifier and train it.
# XXX
scalar = StandardScaler().fit(x_train)
x_train_std = scalar.transform(x_train)
x_test_std = scalar.transform(x_test)

svm = SVC(random_state=random_state).fit(x_train_std, y_train)

# XXX
# TODO: Test its accuracy on the training set using the accuracy_score method.
# TODO: Test its accuracy on the test set using the accuracy_score method.
# XXX
y_train_predict = svm.predict(x_train_std)
y_test_predict = svm.predict(x_test_std)

print("Train Accuracy : {0}".format(accuracy_score(y_train, y_train_predict)))
print("Test Accuracy: {0}".format(accuracy_score(y_test, y_test_predict)))

# XXX
# TODO: Tune the hyper-parameters 'C' and 'kernel' (use rbf and linear).
#       Print the best params, using .best_params_, and print the best score, using .best_score_.
# XXX
svm_tuned_params = {'C': [0.1, 1.0, 10.0], 'kernel': ['rbf', 'linear']}
svm_grid = GridSearchCV(SVC(random_state=random_state), param_grid= svm_tuned_params, cv=10).fit(x_train_std, y_train)

# Best params
print(svm_grid.best_params_)

# Best score
print(svm_grid.best_score_)

# Accuracy on Test Data using best parameters
best_svm = SVC(C=svm_grid.best_params_['C'], kernel= svm_grid.best_params_['kernel'], random_state=random_state).fit(x_train_std, y_train)

y_test_predict = best_svm.predict(x_test_std)

print("Best Test Accuracy: {0}".format(accuracy_score(y_test, y_test_predict)))

## Reporting mean_train_score, mean_test_score, mean_fit_time for SVM and RandomForest (for including in last section of report)
print(svm_grid.cv_results_['mean_train_score'][np.argmax(svm_grid.cv_results_['mean_test_score'])])
print(svm_grid.cv_results_['mean_test_score'][np.argmax(svm_grid.cv_results_['mean_test_score'])])
print(svm_grid.cv_results_['mean_fit_time'][np.argmax(svm_grid.cv_results_['mean_test_score'])])

print(rf_grid.cv_results_['mean_train_score'][np.argmax(rf_grid.cv_results_['mean_test_score'])])
print(rf_grid.cv_results_['mean_test_score'][np.argmax(rf_grid.cv_results_['mean_test_score'])])
print(rf_grid.cv_results_['mean_fit_time'][np.argmax(rf_grid.cv_results_['mean_test_score'])])
