import unittest

from EasyDSA import HashMap

class TestHashMap(unittest.TestCase):
    def test_empty_map(self):
        map = HashMap()
        self.assertEqual(len(map), 0)
        self.assertTrue(map.isEmpty())
    
    def test_insert(self):
        map = HashMap()
        for i in range(100):
            map.add(i,i)
        self.assertEqual(len(map), 100)
        map[56] = "book"
        map['man'] = 'John'
        self.assertEqual(map.get(56), "book")
        self.assertEqual(map[56], "book")
        self.assertEqual(len(map), 101)

    def test_remove(self):
        map = HashMap()
        map.add(1,"fuse")
        map.add(3,"jell")
        map[2] = 'room'
        map.remove(3)
        with self.assertRaises(KeyError):
            map.get(3)
    
    def test_setitem(self):
        map  = HashMap()
        map.add(1,"fuse")
        map.add(3,"jell")
        map[2] = 'room'
        map[3] = "book"
        self.assertEqual(map.get(3), "book")

    def test_contains(self):
        map  = HashMap()
        map.add(1,"fuse")
        map.add(3,"jell")
        map[2] = 'room'
        self.assertTrue(3 in map)


if __name__ == '__main__':
    unittest.main()