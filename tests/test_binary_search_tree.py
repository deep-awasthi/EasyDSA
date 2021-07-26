import unittest

from EasyDSA import BinarySearchTree

class TestBinarySearchTree(unittest.TestCase):
    def test_empty_tree(self):
        tree = BinarySearchTree()
        self.assertEqual(len(tree), 0)
        self.assertTrue(tree.isEmpty())
    
    def test_max__min_valaue(self):
        tree = BinarySearchTree()
        for i in range(100):
            tree.add(i,i)
        self.assertEqual(tree.maxValue(),99)
        self.assertEqual(tree.minValue(),0)
    
    def test_insert(self):
        tree = BinarySearchTree()
        for i in range(100):
            tree.add(i,i)
        
        self.assertEqual(len(tree), 100)
        self.assertEqual(tree.valueOf(5), 5)
        tree[56] = "book"
        self.assertEqual(tree.valueOf(56), "book")
        self.assertEqual(tree[56], "book")

    def test_remove(self):
        tree = BinarySearchTree()
        tree.add(1,"fuse")
        tree.add(3,"jell")
        tree[2] = 'room'
        tree.remove(3)
        with self.assertRaises(KeyError):
            tree.valueOf(3)
    
    def test_contains(self):
        tree  = BinarySearchTree()
        tree.add(1,"fuse")
        tree.add(3,"jell")
        tree[2] = 'room'
        self.assertTrue(3 in tree)


if __name__ == '__main__':
    unittest.main()