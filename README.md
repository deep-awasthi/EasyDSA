# Python EasyDSA
A Data structure collection package written in Python which helps developers in implementing fast and efficient algorithms.


## Package
The Pypi [EasyDSA](https://github.com/mad-skull/EasyDSA.git) package can be found [here](https://github.com/mad-skull/EasyDSA.git)

## Getting Started (More Will Be Added Soon)
The datastructure_collection has three data structure classes :

* 1. [BinarySearchTree](https://github.com/mad-skull/EasyDSA.git)

* 2. [HashMap](https://github.com/mad-skull/EasyDSA.git)

* 3. [LinkedList](https://github.com/mad-skull/EasyDSA.git)

I Look forward to add more datastructures and algorithms in the future.

## Installation

Run the following to install package :

```bash
pip install EasyDSA
```
## Usage

[Example](https://github.com/mad-skull/EasyDSA/blob/master/tests/datastructure_example.py)

To use this package :

```python
from EasyDSA import BinarySearchTree

from EasyDSA import HashMap

from EasyDSA import LinkedList
```

## Binary Search Tree
The Binary Search Tree operations and the time complexities are shown in the table below:

| Operation                 | Best Case     |  Worst Case   |  
| -------------             |:-------------:|:-------------:|
| tree = BinarySearchTree() | O(1)          | O(1)          |
|                           |               |               |
| tree.add(key, value)      | O(logN)       | O(N)          | 
| tree.remove(key)          | O(logN)       | O(N)          |
| tree.valueOf(key)         | O(logN)       | O(N)          |
| tree.isEmpty()            | O(1)          | O(1)          |
| tree.minValue()           | O(logN)       | O(N)          |
| tree.maxValue()           | O(logN)       | O(N)          |
| n = len(tree)             | O(1)          | O(1)          |
| x in tree                 | O(logN)       | O(N)          |
| traversal                 | O(N)          | O(N)          |

As seen from the table above the Binary Search Tree has an advantage over a Linear List in terms of its searching mechanism the tree will be to somewhat sorted where the left elements of a node are less that the elements of a right node, thus giving it a Best case runtime of O(logN) as compared to a List search of O(N).
The Worst Case of a Binary Search Tree O(N) occurs when the elements of the tree are ordered linearly ie (elements are inserted with increasing order)
* **NB** The add,remove,minValue,maxValue and __contains__ ie "in", valueOf operators uses the search mechanism to locate the target.

The Worst Case of a BinarySearchTree can however be improved by implementing a **Balanced Search Tree** with datastructures like **(AVL trees, splay trees, and red-black trees)**  which i however shall add in the future.

### Example BinarySearchTree
```python

#import the BinarySearchTree Class
from EasyDSA import BinarySearchTree

#Instantiate BinarySearchTree object
tree = BinarySearchTree()

tree.add(1,"Orange")
tree.add(4,"Banana")
tree.add(7,"Apple")
tree.add(2,"Tomato")


for i in tree:
    print(i) #Prints the sorted List of tuples contaiing the key, value pairs

tree.remove(4) #this removes the Banana node from the tree
print(len(tree)) #this returns a length of 3 since the Banana node was removed

```
## Hash Map
The [HashMap](https://pypi.org/project/EasyDSA/) is the most commonly used data structure in solving  big data and maping problems. In most datastructure collection ,searching is the most important operation, and as such we need to do it fast and efficiently. Unilike most datastructures like Lists, Trees which are based on on key comparison when searching for a target, the [Hashmap]() uses a concept of **hashing** the keys upon searching which run in constant time O(1) to locate an index of a specific key.
I have used the concept of **double hashing** in implemnenting the hashing algorithm and **closed hashing/open addressing** for **Probing** . The hashing algorithm is as follows:
```python
'''
    def _double_hashing(self,k):
        double hashing reduces clusters primary and secondary thus reducing collisions
        Find the next slot by probing
        slot = (position + i ) % M  whrere i = 1,2,3 .. M-1 ; position = index position index to which the key was originally mapped by the hash
        function DOUBLE HASHING IS AS FOLLOWS:
        slot = (position + i ∗ hp(key)) % M
        hp(key) = 1 + key % P         P = constant  < M
        pass
    '''

```
Double hashing reduces primary and secondary clusture thus reducing collisions.

The table below shows the operations and time complexities of a [HashMap](https://pypi.org/project/EasyDSA/)

| Operation                | Best Case     |  Worst Case   |  
| -------------            |:-------------:|:-------------:|
| map = HashMap()          | O(1)          | O(1)          |
|                          |               |               |
| map.add(key, value)      | O(1)          | O(N)          | 
| map.remove(key)          | O(1)          | O(N)          |
| map[key] = value         | O(1)          | O(N)          |
| map.get(key)             | O(1)          | O(N)          |
| map.isEmpty()            | O(1)          | O(1)          |
| n = len(map)             | O(1)          | O(1)          |
| x in map                 | O(1)          | O(N)          |
| traversal                | O(N)          | O(N)          |

As noted from the table above a [HashMap](https://pypi.org/project/EasyDSA/) one one of the strongest data structure in implementing a map, as the fundamental core oprations ie **__getitem__**,
**__setitem__**,**__deltitem__**, runs at constant time at Best Case. The Hash Map worst case run-time can always be enhanced by implementing **SortedTableMap** which improves the Worst Case O(N) to O(logN), which i hope to add the datastructure in the future.


### Example HashMap
```python
hash = HashMap()

hash.add('man',34)
hash.add('person',23)
hash.add('women',674)
hash.add('camera',5)
hash.add('tv',89)

for i in hash:
    print('{}: {}'.format(i.key,i.value)) #prints the key value paris

print(len(hash)) #returns length 5

print(hash.remove('tv'))
print(hash.remove('women'))
print(hash.remove('man'))
hash['women'] = 566

for i in hash:
    print('{}: {}'.format(i.key,i.value))
print(len(hash)) #returns lenth 3 
print(hash.get('women')) # returns 566

```

## Linked List
One might ask why implement a  [LinkedList](https://pypi.org/project/EasyDSA/) datastructure if we already have a list in Python. Insertions and Deletions operation in a List requires items to be shifted to make a room or close the gap. This howver can be time consuming especially for large data. The add operator in a Linked List requires O(1) time where as the Pyhton List requires O(N)

The table below shows the operations and time complexities of a [LinkedList](https://pypi.org/project/EasyDSA/)

| Operation                | Pyhton List   |  Linked List  |  
| -------------            |:-------------:|:-------------:|
| linked = LinkedList()    | O(1)          | O(1)          |
|                          |               |               |
| linked.add(value)        | NA            | O(1)          |
| linked.append(value)     | O(N)          | O(N)          |  
| linked.remove(value)     | O(1)          | O(N)          |
| linked.isEmpty()         | O(1)          | O(1)          |
| n = len(map)             | O(1)          | O(1)          |
| x in linked              | O(N)          | O(N)          |
| traversal                | O(N)          | O(N)          |

### Example Linked List

```python
linked  = LinkedList()

for _ in range(10):
    linked.add(_)
linked.add(5)
linked.remove(5)
linked.append(55)
linked.append(56)
linked.append(7)
linked.add(59)
linked.append(79)
print('List Length: ',len(linked))
linked.remove(0)
print(linked)
print('List Length: ',len(linked))

for i in linked:
    print(i) #Prints the values in the Linked List

print(77 in linked) #Returns False 77 is not in Linked

```

### Pull Requests
I Welcome and i encourage all Pull Requests. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Created and Maintained by
* Author: [Deep Awasthi](https://github.com/mad-skull) :
* Email:  [da.madskull@gmail.com]

### License
```
MIT License

Copyright (c) 2021 Deep Awasthi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


```
