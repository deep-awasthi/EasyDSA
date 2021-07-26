import unittest

from EasyDSA import LinkedList

class TestLinkedList(unittest.TestCase):
    def test_empty_linked(self):
        linked = LinkedList()
        self.assertEqual(len(linked), 0)
        self.assertTrue(linked.isEmpty())
    
    def test_add(self):
        linked = LinkedList()
        for _ in range(10):
            '''
            add() method is O(1) run time
            append() method is O(N) run-time
            '''
            linked.add(_)
        linked.remove(5)
        linked.append(55)
        linked.append(56)
        linked.append(7)
        linked.add(59)
        linked.append(79)
        with self.assertRaises(AssertionError):
            linked.remove(5)
    
    def test_append(self):
        linked = LinkedList()
        linked.append(55)
        linked.append(56)
        linked.append(7)
        linked.remove(56)
        with self.assertRaises(AssertionError):
            linked.remove(56)

    def test_remove(self):
        linked = LinkedList()
        linked.append(55)
        linked.append(56)
        linked.append(7)
        linked.remove(56)
        with self.assertRaises(AssertionError):
            linked.remove(56)
    
    def test_contains(self):
        linked = LinkedList()
        linked.append(55)
        linked.append(56)
        linked.append(7)
        linked.remove(56)
        self.assertFalse(56 in linked)


if __name__ == '__main__':
    unittest.main()