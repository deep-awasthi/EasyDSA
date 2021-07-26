'''
Why linked Lists over array or general Lists
-Linked List Insertion O(1)
-Lists Insrtion is O(n) since the if shifting of elements in inserions and deletion
when rehashing or resizing the List
'''

class _Node:
    def __init__(self,data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self._head = None
        self._tail = None
        self._count = 0
        
    
    '''
    ADDING A NODE TO LINKED LIST WILL IMPREMENT:
    1. ADD PREPANDING add at the begining of the list
    2. APPENDING add at the end of the list
    '''
    def add(self,data):
        new_node = _Node(data)
        new_node.next = self._head #point wherever head is pointing to
        self._head = new_node #set head not to the first node
        self._count += 1
    
    def append(self,data):
        new_node = _Node(data)
        if self._head is None:
            self._head = new_node
        else:
            try:
                self._tail.next = new_node
            except:
                '''
                 add method was used so there is no tail so need to iterrate to the last node and add tail
                '''
                current_node = self._head
                prev_node = None
                while current_node is not None:
                    prev_node = current_node
                    current_node = current_node.next
                self._tail = prev_node
                self._tail.next = new_node
                
        self._tail = new_node
        self._count +=1
    
    def _search_unordered_node(self,target):
        current_node = self._head
        while current_node is not None and current_node.data != target:
            current_node  = current_node.next
        if current_node is not None:
            if current_node.data == target:
                return True
        return False
        
    def remove(self,target):
        if self._tail is not None:
            #means there items were appended by the append() method
            current_node = self._head
            prev_node = None
            while current_node is not None and current_node.data != target:
                prev_node = current_node
                current_node  = current_node.next
            
            assert current_node is not None, "The item is not in the List"
            self._count -=1
            if current_node is self._head:
                self._head = current_node.next
            else:
                prev_node.next = current_node.next
            if current_node is self._tail:
                self._tail = prev_node
        else:
            #means no items appendded at the end of list. the add() methood was used instead
            current_node = self._head
            prev_node = None
            while current_node is not None and current_node.data != target:
                prev_node = current_node
                current_node = current_node.next
                
            # The item has to be in the list to remove it.
            assert current_node is not None, "The item is not in the List"
            #to unlink node
            self._count -=1
            if current_node is self._head:
                self._head = current_node.next
            else:
                prev_node.next = current_node.next
        
    
    def _print(self,current_node):
        if self._head is None:
            return "Empty List"
        else:
            while current_node is not None:
                print(current_node.data)
                current_node = current_node.next


    def __iter__(self):
        current_node = self._head
        while current_node is not None:
            yield current_node.data
            current_node = current_node.next
    
    def isEmpty(self):
        if self._count == 0:
            return True
        return False
    
    def __contains__(self,target_node):
        return self._search_unordered_node(target_node)

    
    
    '''def __next__(self):
        current_node  = self._head
        if current_node is None:
            raise StopIteration
        else:
            item = current_node.data
            current_node = current_node.next
            return item
    '''

    def __len__(self):
        return self._count
    
    def __repr__(self):
        self._print(self._head)
        return 'Linked List'

if __name__ == "__main__":
    pass

