// EasyDSA Code Snippet Database
const DSACodeSnippets = {
    arrays: {
        title: "Arrays",
        difficulty: "Easy",
        timeComplexity: "Access: O(1) | Search: O(N) | Insert/Delete: O(N)",
        spaceComplexity: "O(N)",
        description: "An Array is a collection of items stored at contiguous memory locations. Elements can be accessed directly using their index, which is highly efficient. However, resizing requires allocating a new block of memory, and insertions/deletions require shifting elements.",
        javaCode: `public class ArrayOperations {
    // Inserts an element at a specific index in the array
    public int[] insert(int[] arr, int size, int element, int index) {
        if (index < 0 || index > size) return arr;
        int[] newArr = new int[arr.length + 1];
        
        // Copy elements before the target index
        for (int i = 0; i < index; i++) {
            newArr[i] = arr[i];
        }
        
        // Place the new element at the target index
        newArr[index] = element;
        
        // Shift remaining elements to the right
        for (int i = index; i < size; i++) {
            newArr[i + 1] = arr[i];
        }
        return newArr;
    }

    // Deletes the element located at a specific index
    public int[] delete(int[] arr, int size, int index) {
        if (index < 0 || index >= size) return arr;
        int[] newArr = new int[arr.length - 1];
        
        // Copy elements before target index
        for (int i = 0; i < index; i++) {
            newArr[i] = arr[i];
        }
        
        // Shift remaining elements to the left, bypassing the deleted index
        for (int i = index + 1; i < size; i++) {
            newArr[i - 1] = arr[i];
        }
        return newArr;
    }

    // Performs Linear Search to find a target value in the array
    public int search(int[] arr, int size, int target) {
        for (int i = 0; i < size; i++) {
            // Return index if element is found
            if (arr[i] == target) return i; 
        }
        return -1; // Return -1 if target does not exist
    }
}`
    },
    stack: {
        title: "Stack",
        difficulty: "Easy",
        timeComplexity: "Push: O(1) | Pop: O(1) | Top/Peek: O(1)",
        spaceComplexity: "O(N)",
        description: "A Stack is a linear data structure that follows the Last In First Out (LIFO) principle. Elements are added (pushed) and removed (popped) from the same end, called the 'top'. Useful for reversing elements, parenthesis matching, and recursion handling.",
        javaCode: `public class Stack {
    private int maxSize;
    private int[] stackArray;
    private int top;

    // Constructor to initialize stack properties
    public Stack(int size) {
        this.maxSize = size;
        this.stackArray = new int[maxSize];
        this.top = -1; // Top points to -1 initially indicating empty stack
    }

    // Push: Adds an element onto the top of the stack
    public void push(int value) {
        if (top == maxSize - 1) {
            System.out.println("Stack Overflow");
            return;
        }
        stackArray[++top] = value; // Increment top pointer and insert
    }

    // Pop: Removes and returns the top element from the stack
    public int pop() {
        if (top == -1) {
            System.out.println("Stack Underflow");
            return -1;
        }
        return stackArray[top--]; // Return value and decrement top pointer
    }

    // Peek: Returns the top element without removing it
    public int peek() {
        if (top == -1) return -1;
        return stackArray[top];
    }
}`
    },
    queue: {
        title: "Queue",
        difficulty: "Easy",
        timeComplexity: "Enqueue: O(1) | Dequeue: O(1) | Front: O(1)",
        spaceComplexity: "O(N)",
        description: "A Queue is a linear data structure that follows the First In First Out (FIFO) principle. Elements are inserted at the back (Enqueue) and removed from the front (Dequeue). Commonly used for scheduling processes and breadth-first traversals.",
        javaCode: `public class Queue {
    private int[] arr;
    private int front;
    private int rear;
    private int capacity;
    private int count;

    // Constructor to initialize queue
    public Queue(int size) {
        arr = new int[size];
        capacity = size;
        front = 0;
        rear = -1;
        count = 0;
    }

    // Enqueue: Adds an item to the rear of the queue
    public void enqueue(int item) {
        if (count == capacity) {
            System.out.println("Queue Overflow");
            return;
        }
        rear = (rear + 1) % capacity; // Wrap around rear pointer (Circular queue logic)
        arr[rear] = item;
        count++;
    }

    // Dequeue: Removes and returns the item at the front of the queue
    public int dequeue() {
        if (count == 0) {
            System.out.println("Queue Underflow");
            return -1;
        }
        int value = arr[front];
        front = (front + 1) % capacity; // Wrap around front pointer
        count--;
        return value;
    }
}`
    },
    deque: {
        title: "Double-Ended Queue (Deque)",
        difficulty: "Medium",
        timeComplexity: "All End Operations: O(1)",
        spaceComplexity: "O(N)",
        description: "A Deque (Double Ended Queue) allows elements to be inserted or deleted from either the front (head) or the back (tail). It acts as both a Stack and a Queue, making it highly versatile.",
        javaCode: `public class Deque {
    private int[] arr;
    private int front;
    private int rear;
    private int size;
    private int capacity;

    // Constructor to initialize Deque
    public Deque(int capacity) {
        this.capacity = capacity;
        this.arr = new int[capacity];
        this.front = -1;
        this.rear = 0;
        this.size = 0;
    }

    // Inserts element at front of Deque
    public void insertFront(int key) {
        if (size == capacity) return;
        if (front == -1) {
            front = 0;
            rear = 0;
        } else if (front == 0) {
            front = capacity - 1; // Wrap around to end
        } else {
            front = front - 1;
        }
        arr[front] = key;
        size++;
    }

    // Inserts element at rear of Deque
    public void insertLast(int key) {
        if (size == capacity) return;
        if (front == -1) {
            front = 0;
            rear = 0;
        } else if (rear == capacity - 1) {
            rear = 0; // Wrap around to front
        } else {
            rear = rear + 1;
        }
        arr[rear] = key;
        size++;
    }

    // Removes and returns front element
    public int deleteFront() {
        if (size == 0) return -1;
        int val = arr[front];
        if (front == rear) {
            front = -1;
            rear = -1;
        } else {
            front = (front + 1) % capacity;
        }
        size--;
        return val;
    }
}`
    },
    linkedlist: {
        title: "Singly Linked List",
        difficulty: "Easy",
        timeComplexity: "Insert Front: O(1) | Insert/Delete End: O(N) | Search: O(N)",
        spaceComplexity: "O(N)",
        description: "A Singly Linked List is a linear collection of nodes where each node contains data and a pointer reference to the next node in the sequence. It supports efficient memory allocation as elements are not stored in contiguous locations.",
        javaCode: `public class SinglyLinkedList {
    // Represents a single node of the list
    static class Node {
        int data;
        Node next;
        Node(int val) { this.data = val; this.next = null; }
    }
    
    private Node head = null;

    // Inserts a new node at the head (beginning)
    public void insertFirst(int val) {
        Node newNode = new Node(val);
        newNode.next = head; // Point new node next to current head
        head = newNode;      // Move head pointer to new node
    }

    // Deletes the first node containing the matching value
    public void delete(int val) {
        if (head == null) return;
        
        // If head contains the value, move head forward
        if (head.data == val) {
            head = head.next;
            return;
        }
        
        // Traverse to find node prior to target value
        Node current = head;
        while (current.next != null && current.next.data != val) {
            current = current.next;
        }
        
        // Unlink the node containing the target value
        if (current.next != null) {
            current.next = current.next.next;
        }
    }
}`
    },
    doublylinkedlist: {
        title: "Doubly Linked List",
        difficulty: "Easy",
        timeComplexity: "Insert/Delete End: O(N) | Insert/Delete Head: O(1)",
        spaceComplexity: "O(N)",
        description: "A Doubly Linked List (DLL) is a complex type of linked list in which each node contains a pointer to the next node as well as a pointer to the previous node. This allows bidirectional traversal of list nodes.",
        javaCode: `public class DoublyLinkedList {
    // Node structure with prev and next pointers
    static class Node {
        int data;
        Node prev;
        Node next;
        Node(int d) { this.data = d; }
    }
    
    private Node head = null;

    // Inserts a node at the beginning of the list
    public void insertFirst(int val) {
        Node newNode = new Node(val);
        newNode.next = head;
        newNode.prev = null;
        
        // Set previous pointer of old head to new node
        if (head != null) {
            head.prev = newNode;
        }
        head = newNode; // Move head pointer to new node
    }

    // Deletes a specific node from the DLL
    public void deleteNode(Node delNode) {
        if (head == null || delNode == null) return;
        
        // If node to delete is head, move head pointer
        if (head == delNode) {
            head = delNode.next;
        }
        
        // Adjust neighboring node pointers
        if (delNode.next != null) {
            delNode.next.prev = delNode.prev;
        }
        if (delNode.prev != null) {
            delNode.prev.next = delNode.next;
        }
    }
}`
    },
    circularlinkedlist: {
        title: "Circular Linked List",
        difficulty: "Medium",
        timeComplexity: "Insert/Delete End: O(N) | Insert Front: O(N)",
        spaceComplexity: "O(N)",
        description: "In a Circular Linked List, all nodes are connected in a continuous loop. There is no NULL node at the tail. Instead, the last node points back to the head node. Excellent for turn-based scheduling algorithms.",
        javaCode: `public class CircularLinkedList {
    static class Node {
        int data;
        Node next;
        Node(int val) { this.data = val; }
    }
    
    private Node head = null;
    private Node tail = null;

    // Inserts a node at the end of the circular list
    public void insert(int val) {
        Node newNode = new Node(val);
        if (head == null) {
            head = newNode;
            tail = newNode;
            newNode.next = head; // Node points back to itself
        } else {
            tail.next = newNode; // Tail points to new node
            tail = newNode;      // Update tail reference
            tail.next = head;    // Make it circular pointing to head
        }
    }
}`
    },
    binarytree: {
        title: "Binary Tree",
        difficulty: "Medium",
        timeComplexity: "Traversal: O(N) | Depth Search: O(N)",
        spaceComplexity: "O(N)",
        description: "A Binary Tree is a hierarchical data structure where each node has at most two children, referred to as the left child and the right child. Tree traversals (Inorder, Preorder, Postorder) visit nodes in distinct sequences.",
        javaCode: `public class BinaryTree {
    static class Node {
        int data;
        Node left, right;
        Node(int val) {
            data = val;
            left = right = null;
        }
    }

    private Node root;

    // Inorder Traversal: Left -> Root -> Right
    public void inorderTraversal(Node node) {
        if (node == null) return;
        inorderTraversal(node.left);
        System.out.print(node.data + " ");
        inorderTraversal(node.right);
    }

    // Preorder Traversal: Root -> Left -> Right
    public void preorderTraversal(Node node) {
        if (node == null) return;
        System.out.print(node.data + " ");
        preorderTraversal(node.left);
        preorderTraversal(node.right);
    }
}`
    },
    "tree-bfs": {
        title: "BFS in Tree (Level Order)",
        difficulty: "Medium",
        timeComplexity: "O(N) where N is number of nodes",
        spaceComplexity: "O(W) where W is maximum width of the tree",
        description: "Breadth-First Search (BFS) in trees, also known as Level Order Traversal, visits nodes level-by-level, starting from the root and traversing left-to-right at each depth level. A FIFO queue structure tracks the child nodes to be visited next.",
        javaCode: `import java.util.Queue;
import java.util.LinkedList;

public class TreeBFS {
    static class Node {
        int val;
        Node left, right;
        Node(int x) { val = x; }
    }

    // Renders the Level Order Traversal path of the tree
    public void levelOrderBFS(Node root) {
        if (root == null) return;

        // Initialize queue to hold nodes at the current frontier
        Queue<Node> queue = new LinkedList<>();
        queue.add(root);

        while (!queue.isEmpty()) {
            // Remove node from front of Queue and print it
            Node current = queue.poll();
            System.out.print(current.val + " ");

            // Add left child to queue if it exists
            if (current.left != null) {
                queue.add(current.left);
            }

            // Add right child to queue if it exists
            if (current.right != null) {
                queue.add(current.right);
            }
        }
    }
}`
    },
    bst: {
        title: "Binary Search Tree",
        difficulty: "Medium",
        timeComplexity: "Search/Insert: O(log N) average, O(N) worst case",
        spaceComplexity: "O(N)",
        description: "A Binary Search Tree (BST) is a binary tree with ordering constraints: the left subtree of a node contains values smaller than the node's value, and the right subtree contains values greater. This enables efficient O(log N) searches.",
        javaCode: `public class BST {
    static class Node {
        int key;
        Node left, right;
        Node(int item) { key = item; }
    }

    private Node root;

    // Public method to insert a key
    public void insert(int key) {
        root = insertRec(root, key);
    }

    // Helper method to insert recursively down the tree
    private Node insertRec(Node root, int key) {
        if (root == null) {
            return new Node(key); // Return a new node if slot is empty
        }
        if (key < root.key) {
            root.left = insertRec(root.left, key); // Navigate left
        } else if (key > root.key) {
            root.right = insertRec(root.right, key); // Navigate right
        }
        return root;
    }

    // Recursively searches for a key in the BST
    public Node search(Node root, int key) {
        if (root == null || root.key == key) return root; // Found or empty
        if (key < root.key) return search(root.left, key); // Search left
        return search(root.right, key);                   // Search right
    }
}`
    },
    heaps: {
        title: "Heaps & Priority Queue (Min / Max Heap)",
        difficulty: "Medium",
        timeComplexity: "Insert: O(log N) | Extract Max/Min: O(log N) | Peek: O(1)",
        spaceComplexity: "O(N)",
        description: "A Heap is a complete binary tree where parents satisfy the heap property: parent is always <= children (Min Heap) or >= children (Max Heap). Commonly mapped onto a compact 1D array to optimize indexing arithmetic.",
        javaCode: `// Implementation of both MaxHeap and MinHeap concepts
public class BinaryHeap {
    // -------------------------------------------------------------
    // Max Heap Implementation
    // -------------------------------------------------------------
    public static class MaxHeap {
        private int[] heap;
        private int size;
        private int capacity;

        public MaxHeap(int cap) {
            this.capacity = cap;
            this.size = 0;
            this.heap = new int[cap];
        }

        private int parent(int i) { return (i - 1) / 2; }
        private int left(int i) { return 2 * i + 1; }
        private int right(int i) { return 2 * i + 2; }

        // Inserts elements and bubble them up (heapify-up)
        public void insert(int val) {
            if (size == capacity) return;
            heap[size] = val;
            int curr = size++;
            
            // Shift up while parent value is smaller than current
            while (curr != 0 && heap[curr] > heap[parent(curr)]) {
                swap(curr, parent(curr));
                curr = parent(curr);
            }
        }

        // Extracts and returns the maximum element from the heap
        public int extractMax() {
            if (size <= 0) return -1;
            if (size == 1) return heap[--size];
            
            int root = heap[0];
            heap[0] = heap[--size]; // Move last element to root
            maxHeapify(0);          // Heapify-Down
            return root;
        }

        private void maxHeapify(int i) {
            int l = left(i);
            int r = right(i);
            int largest = i;
            if (l < size && heap[l] > heap[i]) largest = l;
            if (r < size && heap[r] > heap[largest]) largest = r;
            if (largest != i) {
                swap(i, largest);
                maxHeapify(largest);
            }
        }

        private void swap(int i, int j) {
            int tmp = heap[i];
            heap[i] = heap[j];
            heap[j] = tmp;
        }
    }

    // -------------------------------------------------------------
    // Min Heap Implementation
    // -------------------------------------------------------------
    public static class MinHeap {
        private int[] heap;
        private int size;
        private int capacity;

        public MinHeap(int cap) {
            this.capacity = cap;
            this.size = 0;
            this.heap = new int[cap];
        }

        private int parent(int i) { return (i - 1) / 2; }
        private int left(int i) { return 2 * i + 1; }
        private int right(int i) { return 2 * i + 2; }

        // Inserts elements and bubble them up (heapify-up)
        public void insert(int val) {
            if (size == capacity) return;
            heap[size] = val;
            int curr = size++;
            
            // Shift up while parent value is larger than current
            while (curr != 0 && heap[curr] < heap[parent(curr)]) {
                swap(curr, parent(curr));
                curr = parent(curr);
            }
        }

        // Extracts and returns the minimum element from the heap
        public int extractMin() {
            if (size <= 0) return -1;
            if (size == 1) return heap[--size];
            
            int root = heap[0];
            heap[0] = heap[--size]; // Move last element to root
            minHeapify(0);          // Heapify-Down
            return root;
        }

        private void minHeapify(int i) {
            int l = left(i);
            int r = right(i);
            int smallest = i;
            if (l < size && heap[l] < heap[i]) smallest = l;
            if (r < size && heap[r] < heap[smallest]) smallest = r;
            if (smallest != i) {
                swap(i, smallest);
                minHeapify(smallest);
            }
        }

        private void swap(int i, int j) {
            int tmp = heap[i];
            heap[i] = heap[j];
            heap[j] = tmp;
        }
    }
}`
    },
    trie: {
        title: "Trie (Prefix Tree)",
        difficulty: "Medium",
        timeComplexity: "Insert: O(L) | Search: O(L) where L is string length",
        spaceComplexity: "O(A * L) where A is alphabet size",
        description: "A Trie (Prefix Tree) is an efficient information retrieval data structure. It stores words in a retrieval tree format where characters represent transition edges. Very fast for autocompletion, dictionary lookups, and prefix validations.",
        javaCode: `public class Trie {
    // Represents a Node in the Trie
    static class TrieNode {
        TrieNode[] children = new TrieNode[26]; // 26 letters of the alphabet
        boolean isEndOfWord = false;           // True if node represents end of a word
    }

    private final TrieNode root = new TrieNode();

    // Insert a word into the Trie
    public void insert(String word) {
        TrieNode current = root;
        for (int i = 0; i < word.length(); i++) {
            int index = word.charAt(i) - 'a'; // Find index from 'a' (0-25)
            if (current.children[index] == null) {
                current.children[index] = new TrieNode(); // Create node if absent
            }
            current = current.children[index];
        }
        current.isEndOfWord = true; // Mark end of word
    }

    // Search a word in the Trie
    public boolean search(String word) {
        TrieNode current = root;
        for (int i = 0; i < word.length(); i++) {
            int index = word.charAt(i) - 'a';
            if (current.children[index] == null) return false; // Absent character means word missing
            current = current.children[index];
        }
        return current.isEndOfWord; // Return true only if it is marked as terminal
    }
}`
    },
    segmenttree: {
        title: "Segment Tree",
        difficulty: "Hard",
        timeComplexity: "Query: O(log N) | Update: O(log N) | Build: O(N)",
        spaceComplexity: "O(N)",
        description: "A Segment Tree is a tree data structure used for storing intervals or segments. It allows querying which of the stored segments contains a given point, and performing range query operations (like sum, minimum, or maximum) in O(log N) time.",
        javaCode: `public class SegmentTree {
    private int[] tree;
    private int n;

    // Constructor builds the segment tree from input array
    public SegmentTree(int[] arr) {
        n = arr.length;
        tree = new int[4 * n];
        build(arr, 0, 0, n - 1);
    }

    // Recursively builds the tree nodes holding range sums
    private void build(int[] arr, int node, int start, int end) {
        if (start === end) {
            tree[node] = arr[start]; // Leaf nodes contain raw values
            return;
        }
        int mid = (start + end) / 2;
        build(arr, 2 * node + 1, start, mid);       // Build Left Segment
        build(arr, 2 * node + 2, mid + 1, end);   // Build Right Segment
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2]; // Range Sum Combination
    }

    // Queries range sum in interval [l, r]
    public int query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return 0; // Segment lies completely outside query boundaries
        if (l <= start && end <= r) return tree[node]; // Segment lies completely inside query
        
        // Partial overlap: search both child segments
        int mid = (start + end) / 2;
        return query(2 * node + 1, start, mid, l, r) +
               query(2 * node + 2, mid + 1, end, l, r);
    }
}`
    },
    graph: {
        title: "Graph",
        difficulty: "Hard",
        timeComplexity: "BFS/DFS: O(V + E) where V=vertices, E=edges",
        spaceComplexity: "O(V + E)",
        description: "A Graph is a non-linear data structure consisting of nodes (vertices) connected by lines (edges). Graphs can be directed/undirected and weighted/unweighted. We represent graphs via an Adjacency List.",
        javaCode: `import java.util.*;

public class Graph {
    private int numVertices;
    private LinkedList<Integer>[] adjLists;

    // Constructor to initialize graph structure
    public Graph(int vertices) {
        numVertices = vertices;
        adjLists = new LinkedList[vertices];
        for (int i = 0; i < vertices; i++) {
            adjLists[i] = new LinkedList<>();
        }
    }

    // Adds undirected edge between src and dest vertices
    public void addEdge(int src, int dest) {
        adjLists[src].add(dest);
        adjLists[dest].add(src); // Symmetric link
    }

    // Breadth First Search (BFS) traversal
    public void BFS(int startVertex) {
        boolean[] visited = new boolean[numVertices];
        Queue<Integer> queue = new LinkedList<>();

        visited[startVertex] = true;
        queue.add(startVertex);

        while (!queue.isEmpty()) {
            int curr = queue.poll(); // Dequeue vertex
            System.out.print(curr + " ");

            // Inspect all unvisited neighbors of curr node
            for (int adj : adjLists[curr]) {
                if (!visited[adj]) {
                    visited[adj] = true;
                    queue.add(adj); // Enqueue neighbor node
                }
            }
        }
    }
}`
    },
    strings: {
        title: "Strings",
        difficulty: "Easy",
        timeComplexity: "Substring Match: O(N*M) worst | Reversal: O(N)",
        spaceComplexity: "O(N)",
        description: "A String is an array of characters. In Java, strings are immutable, meaning they cannot be modified once created. Methods like concat(), substring() create new String references. Reversal and anagram checking are core algorithms.",
        javaCode: `public class StringAlgorithms {
    // Reverses a string in-place utilizing character pointers
    public String reverse(String str) {
        char[] chars = str.toCharArray();
        int left = 0;
        int right = chars.length - 1;
        
        while (left < right) {
            char temp = chars[left];
            chars[left] = chars[right];
            chars[right] = temp; // Swap pointers
            left++;
            right--;
        }
        return new String(chars);
    }

    // Verifies if the target string is a Palindrome
    public boolean isPalindrome(String str) {
        int left = 0, right = str.length() - 1;
        while (left < right) {
            if (str.charAt(left) != str.charAt(right)) {
                return false; // Mismatched characters means not palindrome
            }
            left++;
            right--;
        }
        return true;
    }
}`
    },
    sorting: {
        title: "Sorting Algorithms",
        difficulty: "Medium",
        timeComplexity: "Bubble/Insert/Select: O(N^2) | Merge/Quick/Heap: O(N log N)",
        spaceComplexity: "Merge: O(N) | Others: O(1) in-place",
        description: "Sorting rearranges elements in a sequential order. Classic sorting algorithms involve comparison checks. Choosing the right algorithm depends on performance limits (time & memory overhead).",
        javaCode: `public class Sorting {
    // Bubble Sort: Swaps neighboring unsorted elements repeatedly
    public void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp; // Swap elements
                }
            }
        }
    }

    // Quick Sort helper method
    public void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high); // Select pivot partition index
            quickSort(arr, low, pi - 1);       // Sort left partition
            quickSort(arr, pi + 1, high);      // Sort right partition
        }
    }

    // Partitions array around high element as pivot
    private int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = (low - 1);
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp; // Swap smaller elements to left index i
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp; // Swap pivot to position i+1
        return i + 1;
    }
}`
    },
    searching: {
        title: "Linear / Binary Search",
        difficulty: "Easy",
        timeComplexity: "Linear: O(N) | Binary: O(log N)",
        spaceComplexity: "O(1)",
        description: "Search algorithms locate a target key inside a dataset. Linear Search scans index-by-index. Binary Search cuts the range in half at each step, requiring the array to be sorted beforehand.",
        javaCode: `public class Searching {
    // Linear Search: Scans the array index-by-index from start to finish
    public int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) return i; // Return matching index
        }
        return -1; // Return -1 if target is not in array
    }

    // Binary Search: Repeatedly cuts search space in half (requires sorted input)
    public int binarySearch(int[] arr, int target) {
        int low = 0;
        int high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2; // Midpoint to prevent potential overflow
            if (arr[mid] == target) {
                return mid; // Target found
            }
            if (arr[mid] < target) {
                low = mid + 1; // Narrow search window to right half
            } else {
                high = mid - 1; // Narrow search window to left half
            }
        }
        return -1; // Target not found
    }
}`
    },
    kadane: {
        title: "Kadane's Algorithm",
        difficulty: "Medium",
        timeComplexity: "O(N) where N is array size",
        spaceComplexity: "O(1)",
        description: "Kadane's Algorithm scans a one-dimensional array of numbers to find the contiguous subarray which has the largest sum. It resolves the problem in a single pass O(N) by maintaining the maximum sum ending at each index and overall maximum sum.",
        javaCode: `public class Kadane {
    // Returns the maximum sum contiguous subarray
    public int maxSubArraySum(int[] arr) {
        int size = arr.length;
        int maxSoFar = Integer.MIN_VALUE; // Stores maximum global subarray sum
        int maxEndingHere = 0;           // Tracks sum ending at current index
        
        for (int i = 0; i < size; i++) {
            maxEndingHere = maxEndingHere + arr[i];
            
            // If current sum is larger, update global maximum
            if (maxSoFar < maxEndingHere) {
                maxSoFar = maxEndingHere;
            }
            
            // If running sum drops below 0, discard it and restart window
            if (maxEndingHere < 0) {
                maxEndingHere = 0;
            }
        }
        return maxSoFar;
    }
}`
    },
    greedy: {
        title: "Greedy Algorithms (Activity Selection)",
        difficulty: "Medium",
        timeComplexity: "O(N log N) when unsorted, O(N) if input starts sorted",
        spaceComplexity: "O(1) / O(N)",
        description: "Greedy algorithms make the locally optimal choice at each step, hoping it leads to the globally optimal solution. In the Activity Selection problem, we select the maximum set of non-overlapping activities by sorting activities by their finish times and greedily selecting them.",
        javaCode: `import java.util.Arrays;
import java.util.Comparator;

public class ActivitySelection {
    // Structure representing an activity with start and finish times
    static class Activity {
        int start, finish;
        Activity(int s, int f) { start = s; finish = f; }
    }

    // Selects maximum number of activities that can be performed
    public void printMaxActivities(Activity[] arr) {
        // Sort activities by their finish times in ascending order
        Arrays.sort(arr, Comparator.comparingInt(a -> a.finish));

        System.out.println("Selected activities:");
        
        // The first activity is always selected
        int i = 0;
        System.out.print("(" + arr[i].start + ", " + arr[i].finish + ") ");

        // Inspect remaining activities
        for (int j = 1; j < arr.length; j++) {
            // Select activity if its start time >= finish time of prior selected activity
            if (arr[j].start >= arr[i].finish) {
                System.out.print("(" + arr[j].start + ", " + arr[j].finish + ") ");
                i = j; // Update active selected activity pointer
            }
        }
    }
}`
    },
    dp: {
        title: "Dynamic Programming",
        difficulty: "Medium",
        timeComplexity: "Fibonacci: O(N) | 0-1 Knapsack: O(N * W)",
        spaceComplexity: "O(N) / O(N * W) table size",
        description: "Dynamic Programming (DP) solves complex problems by breaking them down into simpler subproblems. It solves each subproblem once and stores their answers (memoization/tabulation), avoiding redundant work.",
        javaCode: `public class DynamicProgramming {
    // Fibonacci using Tabulation (Bottom-Up approach)
    public int fibonacci(int n) {
        if (n <= 1) return n;
        int[] dp = new int[n + 1];
        
        // Base case setups
        dp[0] = 0;
        dp[1] = 1;
        
        // Fill table iteratively from bottom cases up to N
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2]; // Compute based on cached subproblem states
        }
        return dp[n];
    }

    // Computes 0/1 Knapsack values bottom-up
    public int knapsack(int W, int[] wt, int[] val, int n) {
        int[][] K = new int[n + 1][W + 1];
        
        // Build Knapsack tabulation table K[][]
        for (int i = 0; i <= n; i++) {
            for (int w = 0; w <= W; w++) {
                if (i == 0 || w == 0) {
                    K[i][w] = 0; // Empty capacity or empty item rows initialized to 0
                } else if (wt[i - 1] <= w) {
                    // Maximum of including or excluding current item
                    K[i][w] = Math.max(val[i - 1] + K[i - 1][w - wt[i - 1]], K[i - 1][w]);
                } else {
                    K[i][w] = K[i - 1][w]; // Exclude item due to weight limit exceed
                }
            }
        }
        return K[n][W];
    }
}`
    },
    recursion: {
        title: "Recursion Stack",
        difficulty: "Easy",
        timeComplexity: "Factorial: O(N) | Fibonacci: O(2^N) non-cached",
        spaceComplexity: "O(N) recursion call stack depth",
        description: "Recursion is a process in which a method calls itself directly or indirectly. It must have a base case to prevent stack overflow. Each call creates a new execution stack frame.",
        javaCode: `public class RecursionExample {
    // Computes the Factorial of a number recursively
    public int factorial(int n) {
        // Base case: prevents infinite recursion and stack overflow
        if (n <= 1) {
            return 1; 
        }
        // Recursive step calling itself with reduced input size
        return n * factorial(n - 1); 
    }
}`
    },
    backtracking: {
        title: "Backtracking (N-Queens)",
        difficulty: "Hard",
        timeComplexity: "O(N!) where N is chess board size",
        spaceComplexity: "O(N^2) board grid storage",
        description: "Backtracking builds candidates to the solution incrementally, abandoning a candidate ('backtracking') as soon as it determines the candidate cannot possibly lead to a valid solution. A classic example is the N-Queens puzzle.",
        javaCode: `public class NQueens {
    private int N = 4;

    // Solver logic starts at column index 0
    public boolean solveNQueens(int[][] board, int col) {
        if (col >= N) return true; // Base case: All queens are placed
        
        // Loop rows in active column
        for (int i = 0; i < N; i++) {
            if (isSafe(board, i, col)) {
                board[i][col] = 1; // Place queen tentative selection
                
                // Solve recursively for remaining columns
                if (solveNQueens(board, col + 1)) {
                    return true;
                }
                
                board[i][col] = 0; // Backtrack: undo queen placement
            }
        }
        return false; // Return false if placement yields conflict down-path
    }

    // Safety checks for rows, columns, and diagonal lines
    private boolean isSafe(int[][] board, int row, int col) {
        int i, j;
        for (i = 0; i < col; i++) if (board[row][i] == 1) return false;
        for (i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j] == 1) return false;
        for (i = row, j = col; j >= 0 && i < N; i++, j--) if (board[i][j] == 1) return false;
        return true;
    }
}`
    },
    kmp: {
        title: "KMP String Matching",
        difficulty: "Medium",
        timeComplexity: "O(N + M) where N = text length, M = pattern length",
        spaceComplexity: "O(M) for prefix lookup table (LPS)",
        description: "The Knuth-Morris-Pratt (KMP) search algorithm searches for occurrences of a 'word' W within a main 'text' S by employing the observation that when a mismatch occurs, the word itself contains sufficient information to determine where the next match could begin.",
        javaCode: `public class KMPMatch {
    // Searches for pattern occurrences in text
    public void KMPSearch(String pat, String txt) {
        int M = pat.length();
        int N = txt.length();
        int[] lps = new int[M];
        
        // Compute the Longest Prefix Suffix (LPS) table
        computeLPSArray(pat, M, lps);

        int i = 0; // Index pointer for text
        int j = 0; // Index pointer for pattern
        while (i < N) {
            if (pat.charAt(j) == txt.charAt(i)) {
                j++;
                i++;
            }
            if (j == M) {
                System.out.println("Found pattern at index " + (i - j));
                j = lps[j - 1]; // Reset pattern index pointer using LPS cache
            } else if (i < N && pat.charAt(j) != txt.charAt(i)) {
                if (j != 0) {
                    j = lps[j - 1]; // Re-align pattern using LPS array
                } else {
                    i++;
                }
            }
        }
    }

    // Fills LPS table mapping prefix-suffix match offsets
    private void computeLPSArray(String pat, int M, int[] lps) {
        int len = 0;
        int i = 1;
        lps[0] = 0; // Always 0 base case
        while (i < M) {
            if (pat.charAt(i) == pat.charAt(len)) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len != 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
    }
}`
    },
    "rabin-karp": {
        title: "Rabin Karp Matcher",
        difficulty: "Medium",
        timeComplexity: "Average: O(N + M) | Worst Case: O(N * M)",
        spaceComplexity: "O(1)",
        description: "Rabin-Karp is a string matching algorithm that computes hash values for sliding windows of size M in the Text. It utilizes rolling hashes so that computing the next window hash takes O(1) time. Character comparisons are only run when hashes match, reducing total operations.",
        javaCode: `public class RabinKarp {
    // Prints index locations where pattern is discovered in text
    public void search(String pat, String txt, int q) {
        int M = pat.length();
        int N = txt.length();
        int i, j;
        int p = 0; // Hash value for pattern
        int t = 0; // Hash value for text
        int h = 1;
        int d = 256; // Input alphabet size

        // The value of h would be "pow(d, M-1)%q"
        for (i = 0; i < M - 1; i++) {
            h = (h * d) % q;
        }

        // Calculate initial hash value of pattern and first window of text
        for (i = 0; i < M; i++) {
            p = (d * p + pat.charAt(i)) % q;
            t = (d * t + txt.charAt(i)) % q;
        }

        // Slide the pattern over text one-by-one
        for (i = 0; i <= N - M; i++) {
            // If the hash values match, check characters one by one
            if (p == t) {
                for (j = 0; j < M; j++) {
                    if (txt.charAt(i + j) != pat.charAt(j)) {
                        break;
                    }
                }
                if (j == M) {
                    System.out.println("Pattern found at index " + i);
                }
            }

            // Compute hash value for next window of text: Remove leading digit, add trailing digit
            if (i < N - M) {
                t = (d * (t - txt.charAt(i) * h) + txt.charAt(i + M)) % q;
                
                // If we get negative hash value, convert it to positive
                if (t < 0) {
                    t = (t + q);
                }
            }
        }
    }
}`
    },
    "pointers-window": {
        title: "Two Pointer & Sliding Window",
        difficulty: "Medium",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        description: "Two Pointer scans elements from both ends or distinct positions simultaneously. Sliding Window establishes a moving boundary box over a collection to track subsets or run query checks efficiently in single loops.",
        javaCode: `public class PointersAndWindow {
    // Two Pointer check: checks if a sorted array has two elements summing to target
    public boolean hasTargetSum(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left < right) {
            int currentSum = arr[left] + arr[right];
            if (currentSum == target) {
                return true; // Match found
            } else if (currentSum < target) {
                left++; // Increase sum by moving left pointer right
            } else {
                right--; // Decrease sum by moving right pointer left
            }
        }
        return false;
    }

    // Sliding Window: Finds maximum sum subarray of size K
    public int maxSubArraySum(int[] arr, int k) {
        int n = arr.length;
        if (n < k) return -1;
        
        // Compute sum of first window
        int windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += arr[i];
        }
        
        int maxSum = windowSum;
        
        // Slide the window from left to right across the array
        for (int i = k; i < n; i++) {
            windowSum += arr[i] - arr[i - k]; // Add next element, subtract first element of prior window
            maxSum = Math.max(maxSum, windowSum);
        }
        return maxSum;
    }
}`
    }
};
