from util import entropy, information_gain, partition_classes
import numpy as np 
import ast

class DecisionTree(object):
    def __init__(self):
        # Initializing the tree as an empty dictionary or list, as preferred
        #self.tree = []
        self.tree = {}
        pass

    def learn(self, X, y):
        # TODO: Train the decision tree (self.tree) using the the sample X and labels y
        # You will have to make use of the functions in utils.py to train the tree
        
        # One possible way of implementing the tree:
        #    Each node in self.tree could be in the form of a dictionary:
        #       https://docs.python.org/2/library/stdtypes.html#mapping-types-dict
        #    For example, a non-leaf node with two children can have a 'left' key and  a 
        #    'right' key. You can add more keys which might help in classification
        #    (eg. split attribute and split value)
        if (len(y) == 0):
            self.tree['type'] = 'empty'
            return
        
        cnt = np.unique(y, return_counts=True)[1]
        if len(cnt) == 1:
            self.tree['type'] = 'leaf'
            self.tree['y'] = np.argmax(cnt)
            return
        
        max_gain = 0
        max_gain_attr = 0
        max_gain_index = 0
        
        for i in range(len(X[0])):
            if isinstance(X[0][i], str):
                cat = list(set([x[i] for x in X]))
                for j in cat:
                    xl, xr, yl, yr = partition_classes(X, y, i, j)
                    temp_gain = information_gain(y, [yl, yr])
                    if temp_gain > max_gain:
                        max_gain = temp_gain
                        max_gain_attr = j
                        max_gain_index = i
            else:
                cat = [x[i] for x in X]
                cat_mean = sum(cat)/len(cat)
                xl, xr, yl, yr = partition_classes(X, y, i, cat_mean)
                temp_gain = information_gain(y, [yl, yr])
                if temp_gain > max_gain:
                    max_gain = temp_gain
                    max_gain_attr = cat_mean
                    max_gain_index = i
                            
        Xl, Xr, yl, yr = partition_classes(X, y, max_gain_index, max_gain_attr)
        
        left_subtree = DecisionTree()
        right_subtree = DecisionTree()
        left_subtree.learn(Xl, yl)
        right_subtree.learn(Xr, yr)
        self.tree['type'] = 'node'
        self.tree['left'] = left_subtree
        self.tree['right'] = right_subtree
        self.tree['split_attr'] = max_gain_index
        self.tree['split_val'] = max_gain_attr

        pass


    def classify(self, record):
        # TODO: classify the record using self.tree and return the predicted label
        if self.tree['type'] == 'empty':
            return 0
        elif self.tree['type'] == 'leaf':
            return self.tree['y']
        else:
            if isinstance(record[self.tree['split_attr']], str):
                if record[self.tree['split_attr']] == self.tree['split_val']:
                    return self.tree['left'].classify(record)
                else:
                    return self.tree['right'].classify(record)
            else:
                if record[self.tree['split_attr']] <= self.tree['split_val']:
                    return self.tree['left'].classify(record)
                else:
                    return self.tree['right'].classify(record)
        pass
