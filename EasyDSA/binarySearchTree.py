class _Node:
    def __init__(self,key,value):
        self.key = key
        self.value = value
        self.left_child = None
        self.right_child = None

class BinarySearchTree:
    def __init__(self):
        self._root = None
        self._count = 0
        self._iter_stack = []

    def add(self,key,value):
        if self._root is None:
            self._root =  _Node(key,value)
            self._count += 1
            return True
        else:
            return self._recursive_insert(key,value, self._root)
    
    def _recursive_insert(self,key,value,current_node):
        if key == current_node.key:
            current_node.value = value
            #print('Key already in the tree')
            return True
        elif key < current_node.key:
            if current_node.left_child is None:
                current_node.left_child = _Node(key,value)
                self._count += 1
            else:
                self._recursive_insert(key,value,current_node.left_child)
        else:
            if current_node.right_child is None:
                current_node.right_child = _Node(key,value)
                self._count += 1
            else:
                self._recursive_insert(key,value,current_node.right_child)



    def valueOf(self,key):
        if self._root == None:
            raise KeyError('No key',repr(key))
        return self._recursive_search(key, self._root)
    
    def _recursive_search(self,key,current_node):
        if key == current_node.key:
            #print('Key Found {} with value {}'.format(key,current_node.value))
            return current_node.value
        elif key < current_node.key and current_node.left_child is not None:
            return self._recursive_search(key,current_node.left_child)
            
        elif key > current_node.key and current_node.right_child is not None:
            return self._recursive_search(key, current_node.right_child)
        else:
            raise KeyError('No key',repr(key))


    #perfoming deletion we need to encompas three cases
    '''
    1. Removing a Leaf Node
    2. Removing Interiror node with a single child
    3. Removing Interior node with 2 children
    '''
    def remove(self,key):
        if self._root == None:
            return KeyError('Empty Tree')
        else:
            self._root = self._recursive_remove(key,self._root)
            self._count -= 1
    
    def _recursive_remove(self,key,current_node):
        if current_node is None:
            return current_node
        elif key < current_node.key and current_node.left_child is not None:
            current_node.left_child = self._recursive_remove(key,current_node.left_child)
            return current_node
        elif key > current_node.key and current_node.right_child is not None:
            current_node.right_child = self._recursive_remove(key,current_node.right_child)
            return current_node
        elif key == current_node.key:
            #print('Key to be removed foind is: ',key)
            '''
            if Node is Leaf
            '''
            if current_node.left_child is None and current_node.right_child is None:
                #print('Removing Leaf Node',current_node)
                return None
            elif current_node.left_child is None or current_node.right_child is None:
                if current_node.left_child is not None:
                    return current_node.left_child
                else:
                    return current_node.right_child
            else:
                #print('Has two children---------------')
                successor = self._bstMinimumSuccessor(current_node.right_child)
                current_node.key = successor.key
                current_node.value = successor.value
                current_node.right_child = self._recursive_remove(successor.key,current_node.right_child)
                return current_node
        else:
            raise KeyError('No Key',repr(key))

    def isEmpty(self):
        return self._root is None
    
    def minValue(self):
        if self._root is None:
            raise KeyError('Tree is empty')
        else:
            return self._bstMinimum_recursive(self._root)

    def maxValue(self):
        if self._root is None:
            raise KeyError('Tree is empty')
        else:
            return self._bstMaximum_recursive(self._root)
    
    def _bstMinimum_recursive(self,current_node):
        if current_node.left_child is not None:
            return self._bstMinimum_recursive(current_node.left_child)
        return current_node.key
    
    def _bstMinimumSuccessor(self,current_node):
        if current_node is None:
            return None
        elif current_node.left_child is None:
            return current_node
        else:
            return self._bstMinimumSuccessor(current_node.left_child)
        
    def _bstMaximum_recursive(self,current_node):
        if current_node.right_child is not None:
            return self._bstMaximum_recursive(current_node.right_child)
        return current_node.key

    #In order traversal of the tree root left_child right_child The output should be sorted after
    def _print(self,current_node):
        if current_node is not None:
            self._print(current_node.left_child)
            print(current_node.value)
            self._print(current_node.right_child)
    
    def __contains__(self,key):
        if self._root is not None:
            try:
                '''
                Since there is a raise Key error in _recursive_seach()
                '''
                found_key = self._recursive_search(key,self._root)
                return True
            except:
                return False
        return False
    
    def __getitem__(self,key):
        return self.valueOf(key)
    
    def __setitem__(self,key,value):
        return self.add(key,value)
        
    def __len__(self):
        return self._count

    
    def __iter__(self):
        self._iter(self._root)
        if len(self._iter_stack) != 0:
            for i in self._iter_stack:
                yield i
    
    
    def _iter(self,current_node):
        if current_node is not None:
            self._iter(current_node.left_child)
            self._iter_stack.append((current_node.key, current_node.value))
            self._iter(current_node.right_child)
      
    def __repr__(self):
        if self._root is not None:
            self._print(self._root)
            return 'Binary Search Tree'
        else:
            return 'Tree is Empty!!'


if __name__ == '__main__':

    pass

            

    
    




        