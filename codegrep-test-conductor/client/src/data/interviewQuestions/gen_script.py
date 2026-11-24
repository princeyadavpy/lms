
# Generator for DSA Interview Questions Repository
# 43 Topics x 20 Questions = 860 Comprehensive Company Questions with Company Name, Year, Difficulty, Type, Question, and Detailed Solution

import json
import os

topics_def = [
    # Module 1: Introduction to DSA (3 topics)
    {"mod": 1, "topicId": 1, "key": "1-1", "title": "1.1 Intro to DSA", "desc": "Data structure paradigms, memory layout, abstract data types vs concrete implementations"},
    {"mod": 1, "topicId": 2, "key": "1-2", "title": "1.2 Time & space complexities", "desc": "Big-O, Big-Omega, Big-Theta, auxiliary space, amortized analysis"},
    {"mod": 1, "topicId": 3, "key": "1-3", "title": "1.3 Asymptotics & recurrence relations", "desc": "Master theorem, recursion tree, substitution method, Akra-Bazzi"},

    # Module 2: Stacks (3 topics)
    {"mod": 2, "topicId": 1, "key": "2-1", "title": "2.1 Stacks", "desc": "Stack ADT, LIFO discipline, monotonic stacks, min-stack"},
    {"mod": 2, "topicId": 2, "key": "2-2", "title": "2.2 Pre-, in-, post-fix conversions", "desc": "Shunting-Yard algorithm, operator precedence, associativity"},
    {"mod": 2, "topicId": 3, "key": "2-3", "title": "2.3 Evaluations of expressions", "desc": "Reverse Polish notation evaluation, calculator implementations, syntax tree"},

    # Module 3: Lists and Queues (3 topics)
    {"mod": 3, "topicId": 1, "key": "3-1", "title": "3.1 Linked lists", "desc": "Singly & doubly linked lists, reversal, cycle detection, LRU cache"},
    {"mod": 3, "topicId": 2, "key": "3-2", "title": "3.2 Queues", "desc": "FIFO queues, two-stack queue, BFS queue, deque"},
    {"mod": 3, "topicId": 3, "key": "3-3", "title": "3.3 Circular queues", "desc": "Ring buffer, modulo indexing, overflow vs underflow prevention"},

    # Module 4: Recursion (3 topics)
    {"mod": 4, "topicId": 1, "key": "4-1", "title": "4.1 Simple recursion", "desc": "Call stack frames, base cases, head vs tail recursion"},
    {"mod": 4, "topicId": 2, "key": "4-2", "title": "4.2 Fibonacci numbers", "desc": "Matrix exponentiation, memoization, bottom-up DP, Binet formula"},
    {"mod": 4, "topicId": 3, "key": "4-3", "title": "4.3 Backtracking: 8-queen problem", "desc": "State space tree pruning, N-Queens, Sudoku solver, subset sum"},

    # Module 5: Searching Algorithms (3 topics)
    {"mod": 5, "topicId": 1, "key": "5-1", "title": "5.1 Linear search", "desc": "Sequential scan, sentinel search, cache locality, unsorted data"},
    {"mod": 5, "topicId": 2, "key": "5-2", "title": "5.2 Binary search", "desc": "Logarithmic search, search on answer space, rotated sorted arrays, bounds"},
    {"mod": 5, "topicId": 3, "key": "5-3", "title": "5.3 Quickselect", "desc": "Hoare selection, k-th smallest element, linear average time, median of medians"},

    # Module 6: Sorting Algorithms (7 topics)
    {"mod": 6, "topicId": 1, "key": "6-1", "title": "6.1 Bubble sort", "desc": "Adjacent swapping, early exit optimization, inversion counting"},
    {"mod": 6, "topicId": 2, "key": "6-2", "title": "6.2 Selection sort", "desc": "Minimum element selection, unstable sorting, write minimization"},
    {"mod": 6, "topicId": 3, "key": "6-3", "title": "6.3 Insertion sort", "desc": "Online sorting, adaptive O(n) best case, TimSort building block"},
    {"mod": 6, "topicId": 4, "key": "6-4", "title": "6.4 Mergesort", "desc": "Divide-and-conquer, external sorting, stable sorting, linked list sorting"},
    {"mod": 6, "topicId": 5, "key": "6-5", "title": "6.5 Quicksort", "desc": "Lomuto vs Hoare partitioning, 3-way Dutch national flag, pivot selection"},
    {"mod": 6, "topicId": 6, "key": "6-6", "title": "6.6 Heapsort", "desc": "In-place max heapify, comparison sorting lower bounds, non-stable sort"},
    {"mod": 6, "topicId": 7, "key": "6-7", "title": "6.7 Counting sort", "desc": "Non-comparison sorting, cumulative prefix sum, bounded integer range"},

    # Module 7: Graph Theory (15 topics)
    {"mod": 7, "topicId": 1, "key": "7-1", "title": "7.1 Graphs", "desc": "Adjacency matrix vs list, directed/undirected, bipartite graphs"},
    {"mod": 7, "topicId": 2, "key": "7-2", "title": "7.2 Simple trees", "desc": "Tree hierarchy, diameter of tree, lowest common ancestor, path sum"},
    {"mod": 7, "topicId": 3, "key": "7-3", "title": "7.3 Heaps, heapsort", "desc": "Binary heap invariant, heapify in O(n), priority queue backing"},
    {"mod": 7, "topicId": 4, "key": "7-4", "title": "7.4 Priority queues", "desc": "Task scheduling, Top-K elements, merge K sorted lists"},
    {"mod": 7, "topicId": 5, "key": "7-5", "title": "7.5 Binary trees, n-ary trees", "desc": "Complete/full/perfect trees, serialization/deserialization, Trie variant"},
    {"mod": 7, "topicId": 6, "key": "7-6", "title": "7.6 Binary search trees", "desc": "BST property, inorder traversal, predecessor/successor, delete 3 cases"},
    {"mod": 7, "topicId": 7, "key": "7-7", "title": "7.7 Traversals", "desc": "Preorder, inorder, postorder, level-order, Morris traversal"},
    {"mod": 7, "topicId": 8, "key": "7-8", "title": "7.8 Trie tree", "desc": "Prefix tree, autocomplete, wildcards, maximum XOR pair"},
    {"mod": 7, "topicId": 9, "key": "7-9", "title": "7.9 Kruskal’s MST using disjoint sets", "desc": "Greedy minimum spanning tree, edge sorting, cycle avoidance"},
    {"mod": 7, "topicId": 10, "key": "7-10", "title": "7.10 Dijkstra's Algorithm", "desc": "Single-source shortest path, greedy relaxation, negative edge pitfalls"},
    {"mod": 7, "topicId": 11, "key": "7-11", "title": "7.11 Disjoint sets", "desc": "Union-Find, path compression, union by rank, dynamic connectivity"},
    {"mod": 7, "topicId": 12, "key": "7-12", "title": "7.12 Floyd-Warshall's algorithm", "desc": "All-pairs shortest paths, dynamic programming 3D matrix, transitive closure"},
    {"mod": 7, "topicId": 13, "key": "7-13", "title": "7.13 BFS and DFS searches", "desc": "Connected components, topological sort, cycle detection, flood fill"},
    {"mod": 7, "topicId": 14, "key": "7-14", "title": "7.14 AVL trees, B-trees", "desc": "Self-balancing rotations, balance factors, multi-way indexing"},
    {"mod": 7, "topicId": 15, "key": "7-15", "title": "7.15 Threaded trees", "desc": "Null pointer recycling, stack-free traversal, in-order predecessor threads"},

    # Module 8: Hashing (2 topics)
    {"mod": 8, "topicId": 1, "key": "8-1", "title": "8.1 Hashing by chaining", "desc": "Separate chaining, load factor, collision resolution, hash map rehashing"},
    {"mod": 8, "topicId": 2, "key": "8-2", "title": "8.2 Perfect hashing function", "desc": "Universal hashing, 2-level lookup, O(1) worst-case search, FKS table"},

    # Module 9: String algorithms (2 topics)
    {"mod": 9, "topicId": 1, "key": "9-1", "title": "9.1 Simple string manipulations", "desc": "Two-pointer string reversal, palindrome verification, anagram checking, string compression"},
    {"mod": 9, "topicId": 2, "key": "9-2", "title": "9.2 Pattern search with Rabin-Karp approach", "desc": "Rolling hash polynomial, sliding window pattern match, spurious hits, modular arithmetic"}
]

print(f"Total topics: {len(topics_def)}")
