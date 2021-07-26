from collections.abc import MutableMapping
class MapBase(MutableMapping):
    '''
    Abstract base class that includes private _Item
    Allowing for a Composition deign patter to prompt us to add our own functionality
    '''
    class _Item:
        __slots__ = '_key', '_value'

        def __init__(self,k,v):
            self._key = k
            self._value  = v
        
        def __eq__(self,other):
            return self._key == other._key

        def __ne__(self, other):
            return not (self == other)
        
        def __lt__(self, other):
            return self._key < other._key
            
class _MapEntry:
    def __init__(self,key,value):
        self.key = key
        self.value = value

class HashMap(MapBase):
    _INITIAL_SIZE = 7
    _EMPTY = _MapEntry(None,None)
   
    def __init__(self):
        self._size = self._INITIAL_SIZE
        self._table = [None] * self._size
        self._count = 0 #counting entries in the Map
        self._maxCount = len(self._table) - len(self._table) // 3
        '''self._load_factor = 0
        if self._count > 0:
            self._load_factor = len(self._table)/self._count
        '''
    
    def _hash(self,key):
        #return abs(hash(key)) % len(self._table) 
        hash = 0 
        for c in str(key):
            hash += ord(c)
        return  hash % len(self._table)

    def _hash2(self,key):
        #return 1 + abs( hash(key) ) % (len(self._table) - 2)
        hash = 0 
        for c in str(key):
            hash += ord(c)
        return 1 + hash % (len(self._table) - 2)

    def _double_hashing(self,slot,step):
        #print('Double Hashing')
        return (slot + step) % len(self._table)
 
    def _find_slot(self,key, isInsert):
        slot = self._hash(key)
        step = self._hash2(key)
        #Probbing for the key Linear Probing
        while self._table[slot] is not None:
            #When Inserting
            if isInsert and (self._table[slot] is None or self._table[slot] is self._EMPTY):
                #print('Inserting on Empty Location--------------------------------------------------------------------------------')     
                return slot
            #When Searching
            elif not isInsert and (self._table[slot] is not self._EMPTY and self._table[slot].key == key ):
                #print('If keys are the same just override the data')
                #print(self._table[slot].key)
                #print('The key is',key)
                return slot
            #When Probing find the next available slot
            else :
                #print('Probing...')
                #print('Searching for slot for key {}'.format(key))
                #return self._double_hashing(slot,step)
                return self._recursive_slot_search(slot,step,key,isInsert)
                
        return slot
    
    def _recursive_slot_search(self, slot,step,key,isInsert):
        try:
            double_hash_slot = self._double_hashing(slot,step)
            #print('Dobule hash slot found is',double_hash_slot)
            #print(self._table[double_hash_slot].key)
            #print(self._table[double_hash_slot] is not None)
            if self._table[double_hash_slot] is not None:
                '''
                means the key already exists so override data or return this slot when deleting
                if key == list(self._table[double_hash_slot])[0]:
                '''
                if key == self._table[double_hash_slot].key:
                    return double_hash_slot
                #print('Continue Searching... slot found is {} with key {}'.format(double_hash_slot, self._table[double_hash_slot].key))
                return self._recursive_slot_search(double_hash_slot,step,key,isInsert)
            else:
                return double_hash_slot
        except:
            #print('Out of index')
            if isInsert:
                #means its a _rehash so would have to restart the probing
                return self._recursive_slot_search(0,step,key,isInsert)
            pass

    def __contains__(self,key):
        slot = self._find_slot(key,False)
        if self._table[slot] is not None:
            if self._table[slot].key == key:
                return True
        return False
    
    def add(self,key, value):
        slot =  self._hash(key)  #Linear Hashing
        if self._table[slot] is None:
            #print('The prev slot is {} for key {}'.format(slot,key))
            self._table[slot] = _MapEntry(key,value)
            self._count+=1
            if self._count == self._maxCount:
                self._rehash()
            return True
        elif self._table[slot] is not None:
            #Prob for the next prob
            #print('The next slot is {} for key  {} '.format(slot,key))
            #before finding next slot we need to to check if keys are the same 
            #if key in self:
            if key == self._table[slot].key:
                #means override already exists
                #print('Overriding')
                self._table[slot] = _MapEntry(key,value)
            else:
                slot = self._find_slot(key,True)
                #print('Slot Found is {} for key {} '.format(slot,key))
                self._table[slot] = _MapEntry(key,value)
                self._count+=1
                if self._count == self._maxCount:
                    self._rehash()
            #if self._load_factor > 0.5:
            #    self._rehash()
            return True

    def remove(self,key):
        return self.__delitem__(key)
    
    def get(self,key):
        return self.__getitem__(key)
    
    def isEmpty(self):
        for i in self._table:
            if i is not None:
                return False
        return True
    
    #Rebuidling the HashTable
    def _rehash(self):
        original_table = self._table
        newSize = len(self._table) * 2 + 1 #keep it prime
        self._table = [None] * newSize
        self._count = 0
        self._maxCount = newSize -newSize // 3

        #Add keys from original table to new hash table
        for data in original_table:
            if data is not None and data is not self._EMPTY:
                slot = self._find_slot(data.key, True)
                #print('Rehashed slot is {} for key {} for slot {}'.format(slot,data.key,slot))
                #print('Key Value pair {}, {}'.format(data.key,data.value))
                self._table[slot] = _MapEntry(data.key,data.value) #assigning the key value pair
                self._count += 1
        
        #print(self._table)

    def __getitem__(self,key):
        slot = self._find_slot(key,False)
        if self._table[slot] is not None:
            if self._table[slot].key == key:
                #print('The value items is {}'.format(self._table[slot].value))
                return self._table[slot].value
        raise KeyError('Error: Undefined Index' + repr(key))

    def __setitem__(self,key,value):
        self.add(key,value)

    def __delitem__(self,key):
        slot =  self._find_slot(key,False)
        if self._table[slot] is None:
            raise KeyError( 'Key Error'+ repr(key))
        slot = self._find_slot(key,False)
        if self._table[slot] is not None:
            if self._table[slot].key == key:
                self._table[slot] = None
                self._count -=1
                return True
        raise KeyError( 'Key Error'+ repr(key))

    def __len__(self):
        '''
            THIS IS O(1) constant
        '''
        #return self._count
        #this has O(N)
        table = [ i for i in self._table if i is not None]
        return len(table)


    def __lt__(self, other):
            return self._count < other._count

    #Generator that yield the values for __next__ use
    '''
    A normal function to return a sequence will create the entire sequence in memory before returning the result.
    This is an overkill, if the number of items in the sequence is very large.
    Generator implementation of such sequences is memory friendly and is preferred since it only produces one item at a time.
    '''
    def __iter__(self):
        for i in self._table:
            if i is not None:
                yield i
        
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
    #for debugging purposes only
    def __repr__(self):
        table = [ i.value for i in self._table if i is not None]
        return 'MapTable: {}'.format(table)
        
    


if __name__ == '__main__':
    pass

    



    

  
    
    

   