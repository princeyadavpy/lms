// Comprehensive, Unique Enriched Data Structures & Algorithms (DSA) Curriculum
// Rigorously structured for Academic Mastery, GATE, and High-Performance Technical Interviews.

export const dsaEnrichedData = {
    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 01: ALGORITHMS, COMPLEXITY & DYNAMIC MEMORY
    // ═════════════════════════════════════════════════════════════════════════
    "1-1": {
        title: "1.1 Data Structure def, classification, ADT",
        content: `### 1.1 Data Structure Classification & Abstract Data Types (ADT)

A **Data Structure** is a specialized format for organizing, processing, retrieving, and storing data in computer memory efficiently. The choice of an appropriate data structure directly dictates the algorithmic efficiency of an application.

#### Fundamental Taxonomy of Data Structures
Data structures are broadly partitioned along several architectural dimensions:

\`\`\`
                         Data Structures Taxonomy
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
   Primitive Structures                              Non-Primitive Structures
   (int, char, float, pointer)                               │
                                     ┌───────────────────────┴──────────────────────┐
                                     ▼                                              ▼
                             Linear Structures                             Non-Linear Structures
                        (Contiguous / Sequential)                       (Hierarchical / Interconnected)
                                     │                                              │
                      ┌──────────────┼──────────────┐                ┌──────────────┴──────────────┐
                      ▼              ▼              ▼                ▼                             ▼
                    Arrays      Linked Lists     Stacks/          Trees                         Graphs
                                                 Queues      (BST, AVL, B-Tree)             (Directed, Undirected)
\`\`\`

1. **Primitive vs. Non-Primitive**:
   - **Primitive**: Basic data types provided directly by the machine architecture and programming language (e.g., \`int\`, \`float\`, \`char\`, pointers).
   - **Non-Primitive**: Sophisticated structures constructed by aggregating primitive types to manage complex data collections.
2. **Linear vs. Non-Linear**:
   - **Linear**: Elements form a sequential sequence where each element has a unique predecessor and successor (except the first and last). Examples: Arrays, Linked Lists, Stacks, Queues.
   - **Non-Linear**: Elements are organized hierarchically or interconnected arbitrarily. A single element can be connected to multiple elements. Examples: Trees, Graphs, Tries.
3. **Static vs. Dynamic Memory Allocation**:
   - **Static**: Memory size is fixed at compile-time (e.g., fixed-size arrays). Fast access, zero allocation overhead, but risks stack overflow or memory wastage.
   - **Dynamic**: Memory expands or shrinks at runtime on the heap (e.g., dynamic arrays, linked nodes). Highly flexible, but requires pointer indirection and careful deallocation.

---

#### Abstract Data Types (ADT)
An **Abstract Data Type (ADT)** is a mathematical model for data types where a data type is defined solely by its **behavior (semantics)** from the point of view of a user of the data, specifically in terms of:
1. **Values**: The domain of valid values it can store.
2. **Operations**: The set of allowed operations (e.g., \`push()\`, \`pop()\`, \`insert()\`, \`delete()\`) and their axiomatic invariants.
3. **Encapsulation**: The implementation details (whether an array, a linked list, or a hash map is used internally) are strictly hidden from the consumer.

| ADT Specification | Internal Implementation Candidates | Primary Operations & Axioms |
| :--- | :--- | :--- |
| **List ADT** | Dynamic Array, Singly/Doubly Linked List | \`get(i)\`, \`insert(i, val)\`, \`remove(i)\`, \`size()\` |
| **Stack ADT** | Array with \`top\` index, Linked List with head pointer | \`push(val)\`, \`pop()\`, \`peek()\`, \`isEmpty()\` (LIFO) |
| **Queue ADT** | Circular Array with modulo, Doubly Linked List | \`enqueue(val)\`, \`dequeue()\`, \`front()\` (FIFO) |
| **Map / Dictionary ADT** | Hash Table with Chaining, Red-Black Balanced BST | \`put(key, val)\`, \`get(key)\`, \`delete(key)\`, \`contains(key)\` |
| **Priority Queue ADT** | Binary Min/Max Heap, Fibonacci Heap | \`insert(val, priority)\`, \`extractMin()\`, \`peekMin()\` |`,
        codeSnippets: [
            {
                language: "c",
                title: "List ADT Interface in ANSI C (Encapsulation Pattern)",
                code: `/* list_adt.h - Strict separation of ADT interface and implementation */
#ifndef LIST_ADT_H
#define LIST_ADT_H

#include <stddef.h>

/* Incomplete type declaration hides internal memory representation */
typedef struct List List;

/* ADT Operations Specification */
List* list_create(size_t initial_capacity);
int   list_append(List* list, int value);
int   list_get(const List* list, size_t index, int* out_val);
size_t list_size(const List* list);
void  list_destroy(List* list);

#endif /* LIST_ADT_H */`
            }
        ],
        aiSummary: {
            summary: "Data structures organize memory for algorithmic efficiency. Primitive types represent single values, linear structures sequence elements sequentially, and non-linear structures express hierarchical or networked relationships. An ADT defines operations abstractly, decoupling consumer logic from physical memory layouts.",
            keyConcepts: [
                "Linear vs Non-Linear Structures",
                "Static vs Dynamic Memory",
                "Abstract Data Type (ADT) Decoupling",
                "Encapsulation and Data Invariants"
            ],
            revisionNotes: "Remember: An ADT defines WHAT operations can be performed, while a concrete Data Structure dictates HOW those operations are physically executed in memory."
        }
    },

    "1-2": {
        title: "1.2 Algorithm representation and complexity",
        content: `### 1.2 Asymptotic Notations & Algorithmic Complexity (Big-O, Ω, Θ)

Algorithm analysis measures resource consumption (primarily **Time** and **Auxiliary Space**) as the input size $n$ approaches infinity ($n \to \infty$). Asymptotic notations provide a rigorous mathematical framework to classify algorithms independently of machine hardware, CPU clock speed, operating systems, or compiler optimizations.

#### Mathematical Definitions of Asymptotic Notations

\`\`\`
   f(n) = O(g(n)) [Upper Bound]       f(n) = Ω(g(n)) [Lower Bound]       f(n) = Θ(g(n)) [Tight Bound]
          Time                               Time                               Time
           ▲                                  ▲                                  ▲
           │        c·g(n)                    │          f(n)                    │        c₂·g(n)
           │       /                          │         /                        │       /  f(n)
           │      /   f(n)                    │        /   c·g(n)                │      /  /
           │     /   /                        │       /   /                      │     /  /   c₁·g(n)
           │    /   /                         │      /   /                       │    /  /   /
           │   /───/                          │     /───/                        │   /──/───/
           └───┴───────► n                    └───┴───────► n                    └───┴──────────► n
               n₀                                 n₀                                 n₀
\`\`\`

1. **Big-O Notation ($O$) — Asymptotic Upper Bound**:
   $$f(n) = O(g(n)) \iff \exists c > 0, n_0 \ge 1 \text{ such that } 0 \le f(n) \le c \cdot g(n) \quad \forall n \ge n_0$$
   - Represents the **worst-case guarantee**: the algorithm will never consume more time than $c \cdot g(n)$ for large inputs.
2. **Big-Omega Notation ($\Omega$) — Asymptotic Lower Bound**:
   $$f(n) = \Omega(g(n)) \iff \exists c > 0, n_0 \ge 1 \text{ such that } 0 \le c \cdot g(n) \le f(n) \quad \forall n \ge n_0$$
   - Represents the **best-case performance**: the algorithm requires at least $c \cdot g(n)$ operations even under optimal input conditions.
3. **Big-Theta Notation ($\Theta$) — Asymptotically Tight Bound**:
   $$f(n) = \Theta(g(n)) \iff \exists c_1, c_2 > 0, n_0 \ge 1 \text{ such that } 0 \le c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n) \quad \forall n \ge n_0$$
   - Proves that $f(n) = O(g(n))$ and $f(n) = \Omega(g(n))$ simultaneously.
4. **Little-o ($o$) and Little-omega ($\omega$)**:
   - Strictly non-tight bounds: $f(n) = o(g(n)) \implies \lim_{n \to \infty} \frac{f(n)}{g(n)} = 0$; $f(n) = \omega(g(n)) \implies \lim_{n \to \infty} \frac{f(n)}{g(n)} = \infty$.

---

#### Hierarchy of Complexity Classes
$$O(1) < O(\log \log n) < O(\log n) < O(\sqrt{n}) < O(n) < O(n \log n) < O(n^2) < O(n^3) < O(2^n) < O(n!)$$

| Complexity Class | Common Name | Typical Exemplar Algorithm | Operations for $n = 10^6$ |
| :--- | :--- | :--- | :--- |
| $O(1)$ | Constant Time | Hash table lookup, Stack push/pop | $\sim 1$ |
| $O(\log n)$ | Logarithmic Time | Binary Search, BST Search (Balanced) | $\sim 20$ |
| $O(n)$ | Linear Time | Linear Scan, Quickselect (Average), Counting Sort | $10^6$ |
| $O(n \log n)$ | Linearithmic | Merge Sort, Heap Sort, Quick Sort (Average) | $\approx 2 \times 10^7$ |
| $O(n^2)$ | Quadratic | Bubble Sort, Selection Sort, Insertion Sort (Worst) | $10^{12}$ (Stalls CPU) |
| $O(2^n)$ | Exponential | Recursive Fibonacci, 0/1 Knapsack Brute Force | $\approx 10^{301029}$ (Intractable) |`,
        codeSnippets: [
            {
                language: "c",
                title: "Demonstration of O(1), O(log n), and O(n) Time Complexities",
                code: `#include <stdio.h>

/* O(1) - Constant Time: Direct array index calculation */
int get_first_element(const int arr[]) {
    return arr[0];
}

/* O(log n) - Logarithmic Time: Repeated interval bisection */
int binary_search(const int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

/* O(n) - Linear Time: Single sequential pass */
long long compute_sum(const int arr[], int n) {
    long long total = 0;
    for (int i = 0; i < n; i++) total += arr[i];
    return total;
}`
            }
        ],
        aiSummary: {
            summary: "Asymptotic notation evaluates algorithmic growth rates as n approaches infinity. Big-O gives the worst-case upper bound, Big-Omega gives the best-case lower bound, and Big-Theta establishes an asymptotically tight bound. Mastering complexity orders prevents selecting quadratic algorithms for large-scale datasets.",
            keyConcepts: [
                "Big-O (Upper Bound)",
                "Big-Omega (Lower Bound)",
                "Big-Theta (Tight Bound)",
                "Orders of Growth Comparison"
            ],
            revisionNotes: "Always state the exact assumptions when analyzing complexity: worst-case vs average-case vs amortized. For example, QuickSort is O(n log n) on average, but O(n^2) worst-case with naive pivot choice."
        }
    },

    "1-3": {
        title: "1.3 Pointers, strings, arrays (1-D and n-D)",
        content: `### 1.3 Multi-Dimensional Arrays, Row/Column-Major Layout & Pointers

In physical computer hardware, Random Access Memory (RAM) is a linear, one-dimensional addressable sequence of byte cells. Multi-dimensional arrays are mathematical abstractions that must be flattened into linear memory addresses.

#### Address Translation Formulas
Let an array $A$ have dimensions $R \times C$ (Rows $\times$ Columns) with element size $S = \text{sizeof}(T)$, and base address $\text{Base}(A)$:

1. **Row-Major Order (Standard in C, C++, Python, Java)**:
   Consecutive elements of the same row are placed in contiguous memory addresses.
   $$\text{Address}(A[i][j]) = \text{Base}(A) + \left( i \times C + j \right) \times S$$
   *Generalized for 3D array $A[D_1][D_2][D_3]$:*
   $$\text{Address}(A[i][j][k]) = \text{Base} + \left( i \cdot (D_2 \cdot D_3) + j \cdot D_3 + k \right) \times S$$

2. **Column-Major Order (Standard in Fortran, MATLAB, R, Julia)**:
   Consecutive elements of the same column are stored contiguously.
   $$\text{Address}(A[i][j]) = \text{Base}(A) + \left( j \times R + i \right) \times S$$

\`\`\`
   2D Array Matrix:                     Physical Memory Storage in C (Row-Major):
   ┌─────────┬─────────┬─────────┐      ┌─────┬─────┬─────┬─────┬─────┬─────┐
   │ A[0][0] │ A[0][1] │ A[0][2] │ ───► │ 0,0 │ 0,1 │ 0,2 │ 1,0 │ 1,1 │ 1,2 │
   ├─────────┼─────────┼─────────┤      └─────┴─────┴─────┴─────┴─────┴─────┘
   │ A[1][0] │ A[1][1] │ A[1][2] │       ◄──── Row 0 ────► ◄──── Row 1 ────►
   └─────────┴─────────┴─────────┘
\`\`\`

---

#### Pointer Arithmetic & Cache Locality
- **Pointer Scaling**: Incrementing a pointer \`ptr++\` advances the address by \`sizeof(*ptr)\` bytes, NOT 1 byte.
- **Cache Lines**: CPUs fetch memory in cache line blocks (typically 64 bytes). Iterating over a 2D array in Row-Major order in C maximizes **Spatial Locality**, producing L1/L2 cache hits. Iterating column-by-column causes constant **cache misses**, degrading performance by up to 10×–20×.

#### Array of Pointers vs. Pointer to an Array
- \`int *arr[5]\`: An array of 5 pointers to integers (ragged/jagged array where each row can have variable length).
- \`int (*arr)[5]\`: A single pointer to an array of 5 integers (true contiguous 2D grid allocation).`,
        codeSnippets: [
            {
                language: "c",
                title: "Cache-Friendly Row-Major vs Cache-Hostile Traversal",
                code: `#include <stdio.h>
#define ROWS 1024
#define COLS 1024

int matrix[ROWS][COLS];

/* Cache-Friendly: Traverses memory contiguously (Row-Major) */
void fast_row_major_traversal(void) {
    for (int r = 0; r < ROWS; r++) {
        for (int c = 0; c < COLS; c++) {
            matrix[r][c] = r + c; /* Spatial locality hit */
        }
    }
}

/* Cache-Hostile: Jumps 1024 * 4 bytes per access, causing cache misses */
void slow_col_major_traversal(void) {
    for (int c = 0; c < COLS; c++) {
        for (int r = 0; r < ROWS; r++) {
            matrix[r][c] = r + c; /* Cache eviction storm */
        }
    }
}`
            }
        ],
        aiSummary: {
            summary: "Computer RAM is strictly 1-dimensional. C maps 2D matrices into 1D space using Row-Major ordering: Address = Base + (i * Cols + j) * sizeof(Type). Iterating row-by-row leverages CPU hardware spatial cache lines, while column-by-column traversal causes severe cache miss stalls.",
            keyConcepts: [
                "Row-Major vs Column-Major Layout",
                "Linear Address Translation Formula",
                "Pointer Arithmetic and Scaling",
                "CPU Cache Line Spatial Locality"
            ],
            revisionNotes: "Exam formula: In Row-Major order, Address(A[i][j]) = Base + ((i - L1) * N2 + (j - L2)) * Size, where L1, L2 are lower index bounds and N2 is total columns."
        }
    },

    "1-4": {
        title: "1.4 Elapsed time",
        content: `### 1.4 Wall-Clock Benchmarking & Performance Profiling (clock_t)

While asymptotic analysis provides theoretical bounds, empirical profiling measures real-world performance on target silicon, revealing hidden overheads such as memory stalls, branch mispredictions, context switches, and cache latency.

#### CPU Time vs. Wall-Clock Time
1. **CPU Time (\`clock()\`)**:
   - Measures only the clock cycles actively consumed by the current process on the CPU core.
   - Ignores time spent waiting for disk I/O, network responses, page faults, or sleep timers.
   - Expressed in system clock ticks; divide by \`CLOCKS_PER_SEC\` to convert to seconds.
2. **Wall-Clock (Real) Time (\`clock_gettime()\` / \`gettimeofday\` / \`std::chrono\`)**:
   - Measures the total elapsed real-world time from start to finish, exactly as measured by an external stopwatch.
   - Crucial for multi-threaded systems where total CPU time across multiple cores exceeds wall-clock time.

\`\`\`
                     Timeline of Process Execution
   ├─────────── CPU Active ───────────┼── Disk I/O Wait ──┼── CPU Active ──┤
   ▲                                                                        ▲
   Start                                                                   End
   ◄──────────────────────── Wall-Clock Time ──────────────────────────────►
   ◄──────── CPU Time 1 ──────────────►                    ◄─ CPU Time 2 ──►
\`\`\`

---

#### Profiling Best Practices
- **Warm-Up Cycles**: Execute algorithms once prior to timing to warm up CPU instruction and data caches and page in virtual memory.
- **Multiple Iterations**: Run quick operations thousands of times and calculate the arithmetic mean to mitigate OS scheduler jitter.
- **Compiler Optimizations**: Compile with \`-O2\` or \`-O3\` during production benchmarking, but ensure benchmark variables are not optimized away using volatile qualifiers.`,
        codeSnippets: [
            {
                language: "c",
                title: "High-Precision Benchmarking Harness in ANSI C",
                code: `#include <stdio.h>
#include <time.h>

#define ITERATIONS 100000000

int main(void) {
    clock_t start_time = clock();

    /* Target Computation */
    volatile long long accumulator = 0;
    for (int i = 0; i < ITERATIONS; i++) {
        accumulator += (i ^ 3);
    }

    clock_t end_time = clock();
    double cpu_duration = ((double)(end_time - start_time)) / CLOCKS_PER_SEC;

    printf("Total Ticks: %ld\n", (long)(end_time - start_time));
    printf("CPU Time   : %.6f seconds\n", cpu_duration);
    printf("Throughput : %.2f million ops/sec\n", (ITERATIONS / 1e6) / cpu_duration);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Benchmarking measures real-world runtime. The C library clock() function measures CPU time consumed by the calling process, divided by CLOCKS_PER_SEC. Wall-clock time measures real-world elapsed time, including I/O waits and OS preemption.",
            keyConcepts: [
                "CPU Time vs Wall-Clock Time",
                "clock() and CLOCKS_PER_SEC",
                "Cache Warm-Up Runs",
                "Preventing Dead-Code Elimination"
            ],
            revisionNotes: "Remember: clock() measures CPU cycles, not wall time. In multi-threaded programs running across 4 saturated cores, clock() may advance 4 seconds for every 1 second of wall-clock time."
        }
    },

    "1-5": {
        title: "1.5 malloc, realloc, calloc",
        content: `### 1.5 Dynamic Memory Allocation Mechanics (malloc, calloc, realloc, free)

In ANSI C systems programming, the process memory space is divided into distinct virtual memory segments: **Text** (compiled machine instructions), **Data** (initialized globals), **BSS** (uninitialized globals), **Stack** (activation records), and the **Heap** (dynamically allocated memory).

\`\`\`
                 Virtual Memory Layout of a C Process
   ┌─────────────────────────────────────────────────────────┐  High Memory (0xFFFFFFFF)
   │ Stack Segment (Local variables, return addresses)       │  Grows Downward ▼
   │                         ▼                               │
   │               (Free Memory Gap)                         │
   │                         ▲                               │
   │ Heap Segment (malloc, calloc, realloc buffers)          │  Grows Upward ▲
   ├─────────────────────────────────────────────────────────┤
   │ BSS Segment (Uninitialized static/global variables)     │
   ├─────────────────────────────────────────────────────────┤
   │ Data Segment (Initialized static/global variables)      │
   ├─────────────────────────────────────────────────────────┤
   │ Text Segment (Read-only binary CPU instructions)        │  Low Memory (0x00000000)
   └─────────────────────────────────────────────────────────┘
\`\`\`

#### Standard Allocation Functions
1. **\`malloc(size_t size)\`**:
   Allocates a raw contiguous block of \`size\` bytes from the heap. Memory contents remain **uninitialized** (contain whatever garbage data previously occupied those physical bytes).
2. **\`calloc(size_t num, size_t size)\`**:
   Allocates memory for an array of \`num\` objects of \`size\` bytes each and initializes **every byte to zero**.
3. **\`realloc(void *ptr, size_t new_size)\`**:
   Resizes an existing heap allocation.
   - *In-Place Expansion*: If contiguous heap space is free adjacent to \`ptr\`, the heap allocator expands the chunk in-place and returns the same pointer.
   - *Relocation*: If adjacent space is blocked, it allocates a new chunk of \`new_size\`, copies the existing data, frees the old block, and returns the new address.
4. **\`free(void *ptr)\`**:
   Returns the allocated heap memory to the operating system's heap pool.

---

#### Critical Pitfalls in Heap Management
| Hazard | Manifestation | Prevention / Mitigation |
| :--- | :--- | :--- |
| **Memory Leak** | Memory allocated via \`malloc\` is never freed, exhausting RAM over time. | Ensure every allocation has an explicit, reachable \`free()\`. |
| **Dangling Pointer** | A pointer referencing heap memory that has already been deallocated. | Set pointer to \`NULL\` immediately after freeing (\`free(ptr); ptr = NULL;\`). |
| **Double Free** | Calling \`free()\` twice on the same memory block corrupts the heap metadata. | Setting freed pointers to \`NULL\` prevents double-free crashes. |
| **Buffer Overflow** | Writing past the allocated byte boundary corrupts neighboring heap chunk headers. | Strictly validate array indices against bounds before writes. |`,
        codeSnippets: [
            {
                language: "c",
                title: "Safe Dynamic Memory Allocation & Reallocation Pattern",
                code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    size_t capacity = 4;
    int *buffer = (int*)malloc(capacity * sizeof(int));
    if (!buffer) {
        perror("Initial heap allocation failed");
        return EXIT_FAILURE;
    }

    for (size_t i = 0; i < capacity; i++) buffer[i] = (int)(i * 10);

    /* Safe Reallocation Pattern */
    size_t new_capacity = capacity * 2;
    int *temp = (int*)realloc(buffer, new_capacity * sizeof(int));
    if (!temp) {
        /* buffer is still valid and not leaked */
        free(buffer);
        buffer = NULL;
        return EXIT_FAILURE;
    }
    buffer = temp; /* Safe pointer update */

    /* Cleanup */
    free(buffer);
    buffer = NULL; /* Eliminates dangling pointer */
    return EXIT_SUCCESS;
}`
            }
        ],
        aiSummary: {
            summary: "Heap memory allocation permits runtime variable-sized buffers. malloc allocates uninitialized bytes, calloc zeroes all allocated memory, realloc dynamically resizes buffers with possible relocation, and free returns memory to the OS. Memory leaks, dangling pointers, and double-free bugs are critical vulnerabilities.",
            keyConcepts: [
                "Process Memory Segments (Stack vs Heap)",
                "malloc vs calloc vs realloc",
                "In-Place vs Relocated realloc",
                "Dangling Pointers and Memory Leaks"
            ],
            revisionNotes: "Golden rule for realloc: Never write `ptr = realloc(ptr, size);`. If realloc fails, it returns NULL and overwrites the only reference to the original buffer, causing an untraceable memory leak."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 02: STACKS (LIFO ADT & PARSING APPLICATIONS)
    // ═════════════════════════════════════════════════════════════════════════
    "2-1": {
        title: "2.1 Stacks",
        content: `### 2.1 Stack ADT & LIFO Mechanics (Array vs Linked Implementation)

A **Stack** is a linear data structure following the **Last-In, First-Out (LIFO)** operational discipline: the last element added to the stack is the first element to be removed. All insertions and deletions take place at a single designated end termed the **top**.

\`\`\`
                       Stack Push and Pop Mechanics
                Push (70)                     Pop() -> Returns 70
                   │                               ▲
                   ▼                               │
              ┌─────────┐                     ┌─────────┐
     top ──►  │   70    │                     │   40    │  ◄── top
              ├─────────┤                     ├─────────┤
              │   40    │                     │   25    │
              ├─────────┤                     ├─────────┤
              │   25    │                     │   10    │
              ├─────────┤                     ├─────────┤
              │   10    │                     │  (base) │
              └─────────┘                     └─────────┘
\`\`\`

#### Core Operations and Invariants
- **\`push(x)\`**: Inserts element $x$ onto the top of the stack. Time: $O(1)$.
- **\`pop()\`**: Removes and returns the top element. Precondition: Stack must not be empty (prevents **Underflow**). Time: $O(1)$.
- **\`peek()\` / \`top()\`**: Returns the value of the top element without removing it. Time: $O(1)$.
- **\`isEmpty()\`**: Returns true if stack contains zero elements. Time: $O(1)$.
- **\`isFull()\`**: Applicable only to fixed-size array implementations when \`top == capacity - 1\` (prevents **Overflow**). Time: $O(1)$.

---

#### Comparative Implementation Analysis
| Dimension | Fixed Array Implementation | Singly Linked List Implementation |
| :--- | :--- | :--- |
| **Memory Overhead** | Zero per-element overhead; allocated contiguously. | 8 bytes per node for the \`next\` pointer (64-bit systems). |
| **Capacity Limits** | Static limit; subject to stack overflow. | Dynamic; constrained only by total available heap memory. |
| **Cache Performance**| Outstanding spatial locality due to contiguous RAM. | Poor cache performance due to scattered heap node pointers. |
| **Time Complexity** | Strictly $O(1)$ constant time for all operations. | Strictly $O(1)$ constant time at the linked list head. |`,
        codeSnippets: [
            {
                language: "c",
                title: "Array-Based Stack Implementation with Bound Checking",
                code: `#include <stdio.h>
#include <stdbool.h>

#define STACK_CAPACITY 128

typedef struct {
    int data[STACK_CAPACITY];
    int top;
} Stack;

void stack_init(Stack *s) { s->top = -1; }
bool stack_is_empty(const Stack *s) { return s->top == -1; }
bool stack_is_full(const Stack *s) { return s->top == STACK_CAPACITY - 1; }

bool stack_push(Stack *s, int val) {
    if (stack_is_full(s)) return false; /* Overflow */
    s->data[++(s->top)] = val;
    return true;
}

bool stack_pop(Stack *s, int *out_val) {
    if (stack_is_empty(s)) return false; /* Underflow */
    *out_val = s->data[(s->top)--];
    return true;
}`
            }
        ],
        aiSummary: {
            summary: "A Stack is a LIFO linear structure where elements are pushed and popped exclusively at the top. Push, pop, and peek operate in O(1) time. Stacks are implemented using contiguous arrays (bounded, cache-friendly) or singly linked lists (dynamic, pointer overhead).",
            keyConcepts: [
                "LIFO Discipline",
                "Stack Overflow vs Underflow",
                "Array vs Linked List Stack Architectures",
                "O(1) Time Operation Guarantees"
            ],
            revisionNotes: "When implementing a stack via a linked list, always insert and delete at the HEAD node, guaranteeing O(1) operations without needing a tail pointer."
        }
    },

    "2-2": {
        title: "2.2 Pre-, in-, post-fix conversions",
        content: `### 2.2 Infix to Postfix & Prefix Conversion (Shunting-Yard Algorithm)

Arithmetic expressions can be expressed in three distinct notations:
1. **Infix**: Operators reside between operands (e.g., \`A + B * C\`). Requires operator precedence and parentheses to eliminate ambiguity.
2. **Postfix (Reverse Polish Notation - RPN)**: Operators follow their operands (e.g., \`A B C * +\`). Parenthesis-free and unambiguous.
3. **Prefix (Polish Notation)**: Operators precede their operands (e.g., \`+ A * B C\`).

#### Dijkstra's Shunting-Yard Algorithm
Invented by **Edsger Dijkstra**, the Shunting-Yard algorithm utilizes an operator stack to convert human-readable infix expressions into machine-executable postfix notation in $O(N)$ linear time.

\`\`\`
   Infix Token Stream: "A + B * C"
   ┌──────────┬──────────────┬──────────────────┬─────────────────────────────┐
   │ Token    │ Action       │ Operator Stack   │ Postfix Output Buffer       │
   ├──────────┼──────────────┼──────────────────┼─────────────────────────────┤
   │ 'A'      │ Operand      │ []               │ "A"                         │
   │ '+'      │ Operator     │ ['+']            │ "A"                         │
   │ 'B'      │ Operand      │ ['+']            │ "A B"                       │
   │ '*'      │ Op (High Prio│ ['+', '*']       │ "A B"                       │
   │ 'C'      │ Operand      │ ['+', '*']       │ "A B C"                     │
   │ (End)    │ Pop All      │ []               │ "A B C * +"                 │
   └──────────┴──────────────┴──────────────────┴─────────────────────────────┘
\`\`\`

#### Operator Precedence and Associativity Rules
| Operator | Precedence | Associativity | Stack Pop Condition |
| :--- | :--- | :--- | :--- |
| \`^\` (Exponentiation)| 3 (Highest) | Right-to-Left | Pop if stack top has **strictly higher** precedence. |
| \`*\`, \`/\`, \`%\` | 2 | Left-to-Right | Pop if stack top has **higher or equal** precedence. |
| \`+\`, \`-\` | 1 | Left-to-Right | Pop if stack top has **higher or equal** precedence. |
| \`(\` | 0 (Inside stack)| Non-associative | Only popped when matching \`)\` is encountered. |`,
        codeSnippets: [
            {
                language: "c",
                title: "Infix to Postfix Token Converter",
                code: `#include <stdio.h>
#include <ctype.h>
#include <string.h>

int precedence(char op) {
    if (op == '^') return 3;
    if (op == '*' || op == '/') return 2;
    if (op == '+' || op == '-') return 1;
    return 0;
}

void infix_to_postfix(const char *infix, char *postfix) {
    char stack[256];
    int top = -1, p_idx = 0;

    for (int i = 0; infix[i] != '\0'; i++) {
        char ch = infix[i];
        if (isalnum(ch)) {
            postfix[p_idx++] = ch;
        } else if (ch == '(') {
            stack[++top] = ch;
        } else if (ch == ')') {
            while (top >= 0 && stack[top] != '(') postfix[p_idx++] = stack[top--];
            if (top >= 0) top--; /* Discard '(' */
        } else {
            while (top >= 0 && precedence(stack[top]) >= precedence(ch)) {
                if (ch == '^' && stack[top] == '^') break; /* Right-associative */
                postfix[p_idx++] = stack[top--];
            }
            stack[++top] = ch;
        }
    }
    while (top >= 0) postfix[p_idx++] = stack[top--];
    postfix[p_idx] = '\0';
}`
            }
        ],
        aiSummary: {
            summary: "Expressions exist in Infix, Postfix (RPN), and Prefix notations. Dijkstra's Shunting-Yard algorithm uses an operator stack to convert infix expressions into postfix in O(n) time by respecting operator precedence and associativity.",
            keyConcepts: [
                "Infix vs Postfix vs Prefix",
                "Dijkstra's Shunting-Yard Algorithm",
                "Operator Precedence and Associativity",
                "Parenthesis Matching Semantics"
            ],
            revisionNotes: "Watch out for exponentiation (`^`): it is right-associative (`2^3^2 = 2^(3^2) = 512`), meaning incoming `^` does NOT pop an existing `^` on the stack."
        }
    },

    "2-3": {
        title: "2.3 Evaluations of expressions",
        content: `### 2.3 Arithmetic Expression Evaluation Using Stacks

Postfix expressions (Reverse Polish Notation) allow arithmetic calculations without parentheses or operator backtracking. Compilers and runtime virtual machines (such as the JVM and Forth) evaluate arithmetic expressions using an **operand stack**.

#### Postfix Evaluation Algorithm
1. Initialize an empty numeric operand stack.
2. Scan the postfix token sequence from **left to right**.
3. If the token is an **operand** (number), push its value onto the stack.
4. If the token is an **operator** ($\odot \in \{+, -, *, /, \^\dots\}$):
   - Pop the top element: $\text{operand}_2 = \text{pop}()$.
   - Pop the next top element: $\text{operand}_1 = \text{pop}()$.
   - Compute: $\text{result} = \text{operand}_1 \odot \text{operand}_2$.
   - Push $\text{result}$ back onto the stack.
5. At the end of the expression, the stack contains exactly one value: the final evaluated result.

\`\`\`
   Evaluation of Postfix: "5 3 2 * + 4 -"  =>  Result: 7
   ┌────────┬──────────────┬──────────────────┬─────────────────────────────────┐
   │ Token  │ Type         │ Operand Stack    │ Arithmetic Calculation          │
   ├────────┼──────────────┼──────────────────┼─────────────────────────────────┤
   │ '5'    │ Operand      │ [5]              │ Push 5                          │
   │ '3'    │ Operand      │ [5, 3]           │ Push 3                          │
   │ '2'    │ Operand      │ [5, 3, 2]        │ Push 2                          │
   │ '*'    │ Operator     │ [5, 6]           │ pop 2, pop 3 -> 3 * 2 = 6       │
   │ '+'    │ Operator     │ [11]             │ pop 6, pop 5 -> 5 + 6 = 11      │
   │ '4'    │ Operand      │ [11, 4]          │ Push 4                          │
   │ '-'    │ Operator     │ [7]              │ pop 4, pop 11 -> 11 - 4 = 7     │
   └────────┴──────────────┴──────────────────┴─────────────────────────────────┘
\`\`\`

---

#### Prefix Evaluation
Prefix expressions are evaluated similarly, but scanned from **right to left**, popping $\text{operand}_1$ first and $\text{operand}_2$ second: $\text{result} = \text{operand}_1 \odot \text{operand}_2$.`,
        codeSnippets: [
            {
                language: "c",
                title: "Postfix Arithmetic Evaluator in ANSI C",
                code: `#include <stdio.h>
#include <ctype.h>
#include <stdlib.h>

int evaluate_postfix(const char *exp) {
    int stack[128];
    int top = -1;

    for (int i = 0; exp[i] != '\0'; i++) {
        if (isspace(exp[i])) continue;
        if (isdigit(exp[i])) {
            stack[++top] = exp[i] - '0';
        } else {
            int op2 = stack[top--];
            int op1 = stack[top--];
            switch (exp[i]) {
                case '+': stack[++top] = op1 + op2; break;
                case '-': stack[++top] = op1 - op2; break;
                case '*': stack[++top] = op1 * op2; break;
                case '/': stack[++top] = (op2 != 0) ? (op1 / op2) : 0; break;
            }
        }
    }
    return stack[top];
}`
            }
        ],
        aiSummary: {
            summary: "Postfix arithmetic evaluation processes tokens linearly in O(n) time. Operands are pushed onto a numeric stack; operators pop the top two operands, evaluate operand1 op operand2, and push the intermediate result.",
            keyConcepts: [
                "Linear Evaluation without Parentheses",
                "Operand Stacking Mechanics",
                "Operand Order Sensitivity (op1 - op2)",
                "Error Handling (Division by Zero)"
            ],
            revisionNotes: "Order matters: The first popped item is operand 2, and the second popped item is operand 1. Swapping them will reverse subtraction and division (`op1 / op2`)."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 03: LISTS & QUEUES (LINEAR DYNAMIC STRUCTURES)
    // ═════════════════════════════════════════════════════════════════════════
    "3-1": {
        title: "3.1 Linked lists",
        content: `### 3.1 Singly & Doubly Linked Lists: Insertion, Deletion & Traversal

A **Linked List** is a linear data structure composed of self-referential nodes allocated dynamically on the heap. Unlike arrays, nodes are not stored contiguously in memory; instead, each node contains a data payload and one or more pointer links referencing neighboring nodes.

\`\`\`
   Singly Linked List:
   head ──► ┌──────┬─────┐      ┌──────┬─────┐      ┌──────┬──────┐
            │ Data │Next ├────► │ Data │Next ├────► │ Data │ NULL │
            └──────┴─────┘      └──────┴─────┘      └──────┴──────┘

   Doubly Linked List:
            ┌──────┬──────┬──────┐      ┌──────┬──────┬──────┐
   head ──► │ NULL │ Data │ Next ├────► │ Prev │ Data │ NULL │
            └──────┴──┬───┴──────┘      └──────┴──▲───┴──────┘
                      │                           │
                      └───────────────────────────┘
\`\`\`

#### Node Structures
- **Singly Linked Node**: \`struct Node { int val; struct Node *next; };\`
- **Doubly Linked Node**: \`struct DNode { int val; struct DNode *prev; struct DNode *next; };\`

#### Core Operations and Complexity Analysis
| Operation | Array (Static) | Singly Linked List | Doubly Linked List |
| :--- | :--- | :--- | :--- |
| **Insert at Head** | $O(N)$ (requires shifting) | $O(1)$ | $O(1)$ |
| **Insert at Tail** | $O(1)$ (amortized) | $O(1)$ with tail pointer | $O(1)$ with tail pointer |
| **Insert at Index $k$** | $O(N)$ (requires shifting) | $O(k)$ (requires traversal) | $O(k)$ |
| **Delete Given Node Pointer**| $O(N)$ | $O(N)$ (needs predecessor) | $O(1)$ (\`node->prev->next = node->next\`) |
| **Random Access ($A[k]$)** | $O(1)$ direct index calculation | $O(k)$ sequential traversal | $O(k)$ sequential traversal |

---

#### Classical Algorithmic Techniques
1. **In-Place List Reversal (Three-Pointer Method)**:
   Maintains three pointers (\`prev\`, \`curr\`, \`next\`), reversing the link \`curr->next = prev\` in a single pass ($O(N)$ time, $O(1)$ space).
2. **Floyd’s Cycle-Finding Algorithm (Tortoise and Hare)**:
   Uses a slow pointer advancing 1 step and a fast pointer advancing 2 steps. If a cycle exists, they are guaranteed to meet inside the loop in $O(N)$ time.`,
        codeSnippets: [
            {
                language: "c",
                title: "In-Place Singly Linked List Reversal (O(N) Time, O(1) Space)",
                code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

Node* reverse_linked_list(Node *head) {
    Node *prev = NULL;
    Node *curr = head;
    Node *next = NULL;

    while (curr != NULL) {
        next = curr->next; /* Preserve rest of list */
        curr->next = prev; /* Reverse link */
        prev = curr;       /* Advance prev */
        curr = next;       /* Advance curr */
    }
    return prev; /* New head of reversed list */
}`
            }
        ],
        aiSummary: {
            summary: "Linked lists allocate nodes dynamically on the heap. Singly linked lists maintain a single forward pointer, while doubly linked lists maintain forward and backward pointers, enabling O(1) node deletion. Reversal operates in O(n) time and O(1) space via the three-pointer technique.",
            keyConcepts: [
                "Node Structure and Dynamic Allocation",
                "Singly vs Doubly Linked Lists",
                "Three-Pointer In-Place Reversal",
                "Floyd's Cycle-Detection Algorithm"
            ],
            revisionNotes: "Always handle edge cases when manipulating linked lists: empty list (head == NULL), single-node list (head->next == NULL), and head/tail insertions."
        }
    },

    "3-2": {
        title: "3.2 Queues",
        content: `### 3.2 Linear Queue ADT & FIFO Operations (Array & Linked Nodes)

A **Queue** is a linear data structure operating under the **First-In, First-Out (FIFO)** discipline: the first element inserted is the first element to be removed. Elements enter the queue at the **rear** and exit at the **front**.

\`\`\`
                       Linear FIFO Queue Mechanics
         Enqueue(99) ──►  ┌────┬────┬────┬────┐  ──► Dequeue() -> Returns 12
                          │ 99 │ 45 │ 30 │ 12 │
                          └────┴────┴────┴────┘
                            ▲               ▲
                            │               │
                           rear           front
\`\`\`

#### Operations and Invariants
- **\`enqueue(x)\`**: Inserts element $x$ at the rear. Time: $O(1)$.
- **\`dequeue()\`**: Removes and returns element from the front. Time: $O(1)$.
- **\`front()\` / \`peek()\`**: Inspects the front element without removing it. Time: $O(1)$.
- **\`isEmpty()\`**: Evaluates \`front == -1 || front > rear\`. Time: $O(1)$.

---

#### The False Overflow Problem in Linear Arrays
When a linear queue is implemented with a simple array, advancing \`rear\` and \`front\` sequentially causes an issue:
Even if items are dequeued, leaving unused slots at indices $0, 1 \dots$, once \`rear == capacity - 1\`, the queue reports **Overflow** despite having free memory.
- *Solution 1*: Shift all remaining elements left on every dequeue ($O(N)$ per dequeue — highly inefficient).
- *Solution 2*: **Circular Queue** with modulo arithmetic (optimal $O(1)$ — see Topic 3.3).
- *Solution 3*: **Linked List Queue** (maintaining head and tail pointers).`,
        codeSnippets: [
            {
                language: "c",
                title: "Linked List Queue Implementation (Strict O(1) Operations)",
                code: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct QNode {
    int val;
    struct QNode *next;
} QNode;

typedef struct {
    QNode *front;
    QNode *rear;
} Queue;

void queue_init(Queue *q) { q->front = q->rear = NULL; }
bool queue_is_empty(const Queue *q) { return q->front == NULL; }

void queue_enqueue(Queue *q, int val) {
    QNode *newNode = (QNode*)malloc(sizeof(QNode));
    newNode->val = val;
    newNode->next = NULL;
    if (q->rear == NULL) {
        q->front = q->rear = newNode;
        return;
    }
    q->rear->next = newNode;
    q->rear = newNode;
}

bool queue_dequeue(Queue *q, int *out_val) {
    if (queue_is_empty(q)) return false;
    QNode *temp = q->front;
    *out_val = temp->val;
    q->front = q->front->next;
    if (q->front == NULL) q->rear = NULL;
    free(temp);
    return true;
}`
            }
        ],
        aiSummary: {
            summary: "A Queue is a linear FIFO structure where elements are enqueued at the rear and dequeued from the front in O(1) time. Array-based linear queues suffer from false overflow, which is resolved via Circular Queues or Linked List Queues.",
            keyConcepts: [
                "FIFO Discipline",
                "Enqueue and Dequeue Mechanics",
                "The False Overflow Hazard",
                "Linked List Queue Architecture"
            ],
            revisionNotes: "In a linked list queue, always enqueue at the tail (rear->next = node; rear = node) and dequeue from the head (front = front->next) to achieve O(1) performance for both operations."
        }
    },

    "3-3": {
        title: "3.3 Circular queues",
        content: `### 3.3 Circular Queue & Ring Buffer Modulo Arithmetic

A **Circular Queue** (or **Ring Buffer**) connects the last memory slot back to the first memory slot in a logical circle, completely resolving the linear array false overflow problem without shifting elements.

\`\`\`
                       Circular Ring Buffer Layout (Capacity = 8)
                                    [0]
                                ┌─────────┐
                         [7]    │  val 0  │    [1]
                      ┌─────────┼─────────┼─────────┐
                      │  val 7  │         │  val 1  │
                      ├─────────┤  RING   ├─────────┤
                 [6]  │  val 6  │ BUFFER  │  val 2  │  [2]
                      ├─────────┤         ├─────────┤
                      │  val 5  │         │  val 3  │
                      └─────────┼─────────┼─────────┘
                         [5]    │  val 4  │    [3]
                                └─────────┘
                                    [4]
\`\`\`

#### Modulo Arithmetic Formulas
Let $C$ be the fixed capacity of the circular array:
1. **Advance Rear Index**:
   $$\text{rear} = (\text{rear} + 1) \pmod C$$
2. **Advance Front Index**:
   $$\text{front} = (\text{front} + 1) \pmod C$$
3. **Queue Full Condition**:
   $$(\text{rear} + 1) \pmod C == \text{front}$$
4. **Queue Empty Condition**:
   $$\text{front} == -1$$

---

#### Real-World Systems Applications
- **Operating System Audio Buffers**: Streams audio PCM samples between application threads and audio DAC hardware.
- **Network Interface Card (NIC) Rings**: Kernel socket ring buffers receiving raw ethernet frames via DMA.
- **Producer-Consumer Queues**: Lock-free single-producer single-consumer circular buffers in low-latency trading engines.`,
        codeSnippets: [
            {
                language: "c",
                title: "Circular Queue Ring Buffer in ANSI C",
                code: `#include <stdio.h>
#include <stdbool.h>

#define RING_CAPACITY 8

typedef struct {
    int buffer[RING_CAPACITY];
    int front;
    int rear;
} CircularQueue;

void cqueue_init(CircularQueue *q) { q->front = q->rear = -1; }
bool cqueue_is_empty(const CircularQueue *q) { return q->front == -1; }
bool cqueue_is_full(const CircularQueue *q) {
    return ((q->rear + 1) % RING_CAPACITY) == q->front;
}

bool cqueue_enqueue(CircularQueue *q, int val) {
    if (cqueue_is_full(q)) return false; /* Overflow */
    if (q->front == -1) q->front = 0;
    q->rear = (q->rear + 1) % RING_CAPACITY;
    q->buffer[q->rear] = val;
    return true;
}

bool cqueue_dequeue(CircularQueue *q, int *out_val) {
    if (cqueue_is_empty(q)) return false; /* Underflow */
    *out_val = q->buffer[q->front];
    if (q->front == q->rear) {
        q->front = q->rear = -1; /* Reset when empty */
    } else {
        q->front = (q->front + 1) % RING_CAPACITY;
    }
    return true;
}`
            }
        ],
        aiSummary: {
            summary: "A Circular Queue wraps array boundaries using modulo arithmetic: (index + 1) % capacity. It eliminates false overflow and supports continuous, lock-free streaming in OS audio buffers, network drivers, and device rings in O(1) time.",
            keyConcepts: [
                "Ring Buffer Architecture",
                "Modulo Wrap-Around Mechanics",
                "Full Condition: (rear + 1) % capacity == front",
                "OS Device Driver Ring Applications"
            ],
            revisionNotes: "Remember: A circular buffer of physical size N can store at most N - 1 elements if distinguishing full vs empty relies solely on front and rear pointers without a separate counter."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 04: RECURSION & BACKTRACKING
    // ═════════════════════════════════════════════════════════════════════════
    "4-1": {
        title: "4.1 Simple recursion",
        content: `### 4.1 Recursion Fundamentals, Base Cases & Call Stack Frames

**Recursion** is an algorithmic technique where a function solves a problem by calling copies of itself on progressively smaller sub-instances of the same problem. Every recursive algorithm relies on two foundational components:
1. **The Base Case (Termination Condition)**: The simplest subproblem that can be solved directly without further recursive calls, preventing infinite recursion.
2. **The Recursive Step**: Decomposes the primary problem, invokes the function recursively on the reduced domain, and recombines the results.

#### Anatomy of a Call Stack Activation Record
When a recursive call occurs, the runtime environment allocates an **Activation Record (Stack Frame)** on the program's call stack:
- Return Address (instruction pointer where execution resumes after return).
- Function Arguments.
- Local Variables.
- Saved Registers.

\`\`\`
   Recursive Call Stack Growth for Factorial(3):
   
   Call: fact(3)             Call: fact(2)             Call: fact(1) (Base)      Unwinding:
   ┌───────────────┐         ┌───────────────┐         ┌───────────────┐         ┌───────────────┐
   │ fact(3): n=3  │         │ fact(2): n=2  │         │ fact(1): n=1  │ ──► 1   │ fact(2): 2*1=2│
   ├───────────────┤         ├───────────────┤         ├───────────────┤         ├───────────────┤
   │ (caller main) │         │ fact(3): n=3  │         │ fact(2): n=2  │         │ fact(3): 3*2=6│
   └───────────────┘         ├───────────────┤         ├───────────────┤         └───────────────┘
                             │ (caller main) │         │ fact(3): n=3  │
                             └───────────────┘         └───────────────┘
\`\`\`

---

#### Head Recursion vs. Tail Recursion
- **Head Recursion**: The recursive call is made before performing other calculations. Work is executed during call stack *unwinding*.
- **Tail Recursion**: The recursive call is the final operation in the function. Modern optimizing compilers (\`-O2\`) perform **Tail-Call Elimination (TCO)**, transforming the recursion into an iterative jump, reducing stack space from $O(N)$ to $O(1)$.`,
        codeSnippets: [
            {
                language: "c",
                title: "Standard vs Tail-Recursive Factorial (TCO Pattern)",
                code: `#include <stdio.h>

/* Standard Non-Tail Recursive: Requires O(n) Stack Frames */
long long factorial(int n) {
    if (n <= 1) return 1; /* Base Case */
    return n * factorial(n - 1); /* Multiplication happens AFTER recursive return */
}

/* Tail-Recursive: Can be optimized by compiler into an iterative loop (O(1) space) */
long long factorial_tail(int n, long long accumulator) {
    if (n <= 1) return accumulator; /* Base Case */
    return factorial_tail(n - 1, n * accumulator); /* Pure Tail Call */
}`
            }
        ],
        aiSummary: {
            summary: "Recursion divides problems into self-similar subproblems. Each call pushes an activation record onto the call stack. Base cases prevent infinite recursion and stack overflow. Tail-recursive functions place the recursive call as the final statement, enabling compiler Tail-Call Optimization (TCO) down to O(1) space.",
            keyConcepts: [
                "Base Case vs Recursive Step",
                "Call Stack Activation Records",
                "Stack Overflow Mechanics",
                "Tail Recursion & Compiler TCO"
            ],
            revisionNotes: "Missing or unreachable base cases lead to undefined behavior or a SIGSEGV Stack Overflow as activation frames exhaust the limited thread stack (typically 8MB on Linux, 1MB on Windows)."
        }
    },

    "4-2": {
        title: "4.2 Fibonacci numbers",
        content: `### 4.2 Fibonacci Numbers & Recurrence Relation Analysis

The Fibonacci sequence is defined by the linear recurrence relation:
$$F(0) = 0, \quad F(1) = 1, \quad F(n) = F(n-1) + F(n-2) \quad \text{for } n \ge 2$$

#### The Exponential Tree of Naive Recursion
A naive recursive implementation branches twice per call, generating a recursion tree of height $n$:

\`\`\`
                                  fib(5)
                      ┌──────────────┴──────────────┐
                    fib(4)                        fib(3)
              ┌───────┴───────┐               ┌───────┴───────┐
            fib(3)          fib(2)          fib(2)          fib(1)
          ┌───┴───┐       ┌───┴───┐       ┌───┴───┐
        fib(2)  fib(1)  fib(1)  fib(0)  fib(1)  fib(0)
        ┌─┴─┐
      fib(1)fib(0)
\`\`\`

- **Time Complexity**: $O(2^n)$ (more precisely $O(\phi^n)$ where $\phi = \frac{1 + \sqrt{5}}{2} \approx 1.618$ is the Golden Ratio).
- **Redundant Subproblems**: For $n=5$, \`fib(3)\` is computed 2 times, \`fib(2)\` is computed 3 times, and \`fib(1)\` is computed 5 times.

---

#### Evolution from Recursion to Dynamic Programming
| Approach | Recurrence Strategy | Time Complexity | Space Complexity |
| :--- | :--- | :--- | :--- |
| **Naive Recursion** | Pure divide-and-conquer tree | $O(2^n)$ | $O(n)$ stack depth |
| **Memoization (Top-Down DP)**| Cache results in a lookup table | $O(n)$ | $O(n)$ heap + stack |
| **Tabulation (Bottom-Up DP)**| Iteratively compute $F(0) \to F(n)$| $O(n)$ | $O(n)$ array |
| **Space-Optimized DP** | Keep only two prior variables | $O(n)$ | $O(1)$ constant space |
| **Matrix Exponentiation** | $\begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}^n$ via fast exp | $O(\log n)$ | $O(1)$ space |`,
        codeSnippets: [
            {
                language: "c",
                title: "From O(2^n) Naive Recursion to O(n) Space-Optimized Fibonacci",
                code: `#include <stdio.h>

/* O(n) Time, O(1) Space Iterative Tabulation */
long long fibonacci_optimized(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;

    long long prev2 = 0, prev1 = 1, current = 0;
    for (int i = 2; i <= n; i++) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return current;
}`
            }
        ],
        aiSummary: {
            summary: "Naive recursive Fibonacci suffers from overlapping subproblems, yielding O(2^n) exponential time. By applying Dynamic Programming (memoization or tabulation), time drops to O(n). Space can be optimized to O(1) using two variables, and matrix exponentiation achieves O(log n).",
            keyConcepts: [
                "Recurrence Relation Formulations",
                "Exponential Recursion Trees",
                "Overlapping Subproblems",
                "Space-Optimized Dynamic Programming"
            ],
            revisionNotes: "Exam tip: The number of leaf nodes in the recursion tree for naive fib(n) is exactly F(n+1), confirming that runtime is directly proportional to the golden ratio power."
        }
    },

    "4-3": {
        title: "4.3 Backtracking: 8-queen problem",
        content: `### 4.3 Backtracking & State-Space Search (8-Queens & 0/1 Knapsack)

**Backtracking** is a systematic algorithmic technique for solving constraint satisfaction and combinatorial optimization problems. It builds candidate solutions incrementally and abandons (\"backtracks\" from) a partial candidate as soon as it determines the candidate cannot lead to a valid solution.

\`\`\`
                        State-Space Search Tree
                                [Root]
                        ┌─────────┼─────────┐
                      Choice 1  Choice 2  Choice 3
                     ┌────┴────┐     X (Pruned)
                  Valid      Dead End
                    │        (Backtrack)
                 [GOAL]
\`\`\`

#### The Classical N-Queens Problem
Place $N$ chess queens on an $N \times N$ chessboard such that no two queens attack each other (no two queens share the same row, column, or diagonal).
- **Row Constraint**: Place exactly one queen per row.
- **Column Constraint**: Ensure column index is unvisited.
- **Diagonal Constraints**:
  - Main Diagonal ($\setminus$): Row and column indices share the same difference: \`row - col == constant\`.
  - Anti-Diagonal ($/$): Row and column indices share the same sum: \`row + col == constant\`.
- **Pruning**: If a candidate square violates any constraint, prune the entire subtree immediately without recursing further.

---

#### 0/1 Knapsack Problem (Backtracking vs. DP)
Given weights $W_i$ and values $V_i$, maximize total value within weight capacity $C$:
- **Binary Choice**: For each item $i$, explore two branches:
  1. *Include item $i$*: Decrement capacity $C - W_i$ and add $V_i$.
  2. *Exclude item $i$*: Maintain capacity $C$.
- **Bounding Function**: If current accumulated weight exceeds capacity, prune immediately.`,
        codeSnippets: [
            {
                language: "c",
                title: "N-Queens Backtracking Solver in ANSI C",
                code: `#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>

#define N 8

bool is_safe(int board[N][N], int row, int col) {
    /* Check column */
    for (int i = 0; i < row; i++)
        if (board[i][col]) return false;
    /* Check upper-left diagonal */
    for (int i = row, j = col; i >= 0 && j >= 0; i--, j--)
        if (board[i][j]) return false;
    /* Check upper-right diagonal */
    for (int i = row, j = col; i >= 0 && j < N; i--, j++)
        if (board[i][j]) return false;
    return true;
}

bool solve_nqueens(int board[N][N], int row) {
    if (row >= N) return true; /* All queens placed */

    for (int col = 0; col < N; col++) {
        if (is_safe(board, row, col)) {
            board[row][col] = 1; /* Place queen */
            if (solve_nqueens(board, row + 1)) return true;
            board[row][col] = 0; /* Backtrack */
        }
    }
    return false;
}`
            }
        ],
        aiSummary: {
            summary: "Backtracking explores state-space trees depth-first, pruning invalid candidates early via constraint checks. The N-Queens problem enforces row, column, and diagonal non-attacking constraints. The 0/1 Knapsack problem evaluates inclusion/exclusion branches, pruning states that exceed capacity.",
            keyConcepts: [
                "State-Space Tree Exploration",
                "Constraint Pruning / Bounding",
                "N-Queens Diagonal Invariants (r-c and r+c)",
                "Backtrack State Restoration (board[r][c] = 0)"
            ],
            revisionNotes: "Always remember to undo the state mutation after returning from the recursive step (e.g. board[row][col] = 0). Omitting state restoration is the #1 bug in backtracking implementations."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 05: SEARCHING ALGORITHMS
    // ═════════════════════════════════════════════════════════════════════════
    "5-1": {
        title: "5.1 Linear search",
        content: `### 5.1 Linear Search & Sentinel Search Optimization

**Linear Search (Sequential Search)** scans an array sequentially from the first element to the last until the target element is encountered or the end of the collection is reached. It makes no assumptions about array ordering.

\`\`\`
   Target = 42
   Index:   [0]    [1]    [2]    [3]    [4]
   Array:  │ 15 │  │ 28 │  │ 42 │  │ 89 │  │ 04 │
             ▲      ▲      ▲
             │      │      └── Match Found! Return index 2
           Step 1 Step 2
\`\`\`

#### Complexity Analysis
- **Best-Case Time**: $O(1)$ (target resides at index 0).
- **Worst-Case Time**: $O(N)$ (target resides at the last index or is absent).
- **Average-Case Time**: $O(N)$ ($\approx \frac{N+1}{2}$ comparisons).
- **Auxiliary Space**: $O(1)$ in-place search.

---

#### Sentinel Linear Search Optimization
In standard linear search, the inner loop executes **two comparisons per iteration**:
1. Check loop boundary: \`i < n\`
2. Check element equality: \`arr[i] == target\`

**Sentinel Search** eliminates the boundary comparison by placing the target value as a sentinel at the end of the array (\`arr[n - 1] = target\`). The loop condition simplifies to just testing for the target, reducing total CPU branch comparisons by nearly 50%:`,
        codeSnippets: [
            {
                language: "c",
                title: "Sentinel Linear Search (Branch-Optimized)",
                code: `#include <stdio.h>

int sentinel_linear_search(int arr[], int n, int target) {
    int last = arr[n - 1];
    arr[n - 1] = target; /* Set sentinel */

    int i = 0;
    while (arr[i] != target) {
        i++;
    }

    arr[n - 1] = last; /* Restore original element */

    if (i < n - 1 || last == target) return i; /* Found */
    return -1; /* Not present */
}`
            }
        ],
        aiSummary: {
            summary: "Linear search performs a sequential O(n) scan, applicable to unsorted collections. Sentinel linear search stores the target at the terminal position, eliminating the loop boundary check (i < n) and cutting branch instructions in half.",
            keyConcepts: [
                "Sequential Scanning Mechanics",
                "Best vs Average vs Worst Case Analysis",
                "Sentinel Search Optimization",
                "Branch Reduction in Low-Level Code"
            ],
            revisionNotes: "Linear search is the only option for unsorted, non-indexed data structures like singly linked lists where random access indexing is unavailable."
        }
    },

    "5-2": {
        title: "5.2 Binary search",
        content: `### 5.2 Binary Search & Logarithmic Interval Bisection

**Binary Search** is an optimal search algorithm that operates on **monotonically sorted** collections. It repeatedly divides the search interval in half using the divide-and-conquer strategy, achieving logarithmic $O(\log N)$ time.

\`\`\`
   Target = 54
   Step 1:  [0]  [1]  [2]  [3]  [4]  [5]  [6]    low=0, high=6, mid=3 (val=38 < 54)
           │ 12 │ 23 │ 31 │ 38 │ 44 │ 54 │ 79 │  ──► Discard left half; low = mid + 1 = 4
                           ▲
                          mid

   Step 2:                  [4]  [5]  [6]        low=4, high=6, mid=5 (val=54 == 54)
                           │ 44 │ 54 │ 79 │  ──► Match Found at Index 5!
                                  ▲
                                 mid
\`\`\`

#### Preventing 32-Bit Integer Overflow
A classic implementation bug in binary search is writing:
\`\`\`c
int mid = (low + high) / 2; /* Dangerous: can overflow 32-bit signed integer! */
\`\`\`
If \`low + high\` exceeds $2^{31} - 1 = 2,147,483,647$, the calculation rolls over into a negative number, causing invalid memory indexing. The safe formulation is:
\`\`\`c
int mid = low + (high - low) / 2; /* Safe: guarantees no arithmetic overflow */
\`\`\`

---

#### Complexity Derivation via Recurrence
$$T(n) = T\left(\frac{n}{2}\right) + O(1)$$
By the Master Theorem ($a=1, b=2, c=0 \implies \log_2 1 = 0 = c$), the time complexity is strictly:
$$T(n) = \Theta(\log n)$$`,
        codeSnippets: [
            {
                language: "c",
                title: "Overflow-Safe Binary Search in ANSI C",
                code: `#include <stdio.h>

int binary_search_safe(const int arr[], int n, int target) {
    int low = 0;
    int high = n - 1;

    while (low <= high) {
        /* Prevents arithmetic integer overflow */
        int mid = low + (high - low) / 2;

        if (arr[mid] == target) {
            return mid; /* Match identified */
        } else if (arr[mid] < target) {
            low = mid + 1; /* Discard left half */
        } else {
            high = mid - 1; /* Discard right half */
        }
    }
    return -1; /* Target not present */
}`
            }
        ],
        aiSummary: {
            summary: "Binary search locates targets in sorted arrays in O(log n) time by bisecting the search range. The midpoint must always be calculated as mid = low + (high - low) / 2 to prevent 32-bit integer overflow.",
            keyConcepts: [
                "Sorted Precondition Requirement",
                "Divide-and-Conquer Bisection",
                "Overflow-Safe Midpoint Calculation",
                "Logarithmic Recurrence Derivation"
            ],
            revisionNotes: "Always verify the precondition: Binary search FAILS completely on unsorted arrays. Sorting an array takes O(n log n), so don't sort just to perform a single search."
        }
    },

    "5-3": {
        title: "5.3 Quickselect",
        content: `### 5.3 Quickselect Algorithm & Order Statistics (k-th Smallest Element)

**Quickselect** (developed by Tony Hoare) finds the **$k$-th smallest (or largest) element** in an unsorted array without sorting the entire array. While full sorting requires $O(N \log N)$ time, Quickselect achieves **$O(N)$ average linear time**.

#### Algorithmic Strategy
Quickselect leverages the **partitioning step** of Quicksort:
1. Select a pivot element and partition the array such that all elements $\le$ pivot are placed to its left, and all elements $>$ pivot are placed to its right.
2. The pivot lands at its final sorted position \`p_idx\`.
3. **Pruning Decision**:
   - If \`p_idx == k\`, the pivot IS the $k$-th smallest element! Return \`arr[p_idx]\`.
   - If \`k < p_idx\`, the target must reside in the **left partition**; recurse only on the left subarray.
   - If \`k > p_idx\`, the target must reside in the **right partition**; recurse only on the right subarray.

\`\`\`
   Array: [7, 10, 4, 3, 20, 15], Find k=2 (3rd smallest element)
   Pivot = 15
   Partitioned: [7, 10, 4, 3]  [15]  [20]
                                 ▲
                            p_idx = 4
   Since k=2 < p_idx=4, discard the right half [20] completely!
   Recurse ONLY on [7, 10, 4, 3].
\`\`\`

---

#### Complexity Analysis
- **Average-Case Time**: $T(n) = T(n/2) + O(n) \implies O(N)$ linear time.
- **Worst-Case Time**: $O(N^2)$ (occurs with poor pivot selection on already-sorted input).
- **Mitigation**: Randomized pivot selection or the **Median-of-Medians** algorithm guarantees worst-case $O(N)$ runtime.`,
        codeSnippets: [
            {
                language: "c",
                title: "Quickselect Algorithm in ANSI C",
                code: `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int lomuto_partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            swap(&arr[i], &arr[j]);
            i++;
        }
    }
    swap(&arr[i], &arr[high]);
    return i;
}

int quickselect(int arr[], int low, int high, int k) {
    if (low == high) return arr[low];

    int p_idx = lomuto_partition(arr, low, high);

    if (p_idx == k) return arr[p_idx];
    else if (k < p_idx) return quickselect(arr, low, p_idx - 1, k);
    else return quickselect(arr, p_idx + 1, high, k);
}`
            }
        ],
        aiSummary: {
            summary: "Quickselect finds the k-th smallest element in O(n) average time without fully sorting the collection. Unlike Quicksort which recurses into both partitions, Quickselect recurses into only the single partition containing index k, pruning the problem space in half each step.",
            keyConcepts: [
                "Selection of Order Statistics",
                "Quicksort Partitioning Mechanics",
                "Single-Branch Recursion Pruning",
                "O(n) Average vs O(n^2) Worst-Case"
            ],
            revisionNotes: "Quickselect is the algorithmic engine powering C++ `std::nth_element`. It rearranges the array so that the n-th element is at its sorted position, with smaller elements preceding it."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 06: SORTING ALGORITHMS
    // ═════════════════════════════════════════════════════════════════════════
    "6-1": {
        title: "6.1 Bubble sort",
        content: `### 6.1 Bubble Sort & Adaptive Early-Termination Optimization

**Bubble Sort** is a comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Pass after pass, larger elements \"bubble up\" to the end of the array.

\`\`\`
   Pass 1 Walkthrough:
   [5, 1, 4, 2, 8]  ──► compare (5,1), swap ──► [1, 5, 4, 2, 8]
                    ──► compare (5,4), swap ──► [1, 4, 5, 2, 8]
                    ──► compare (5,2), swap ──► [1, 4, 2, 5, 8]
                    ──► compare (5,8), ok   ──► [1, 4, 2, 5, 8] (8 is locked!)
\`\`\`

#### Algorithmic Invariants
- After pass $i$, the largest $i$ elements are guaranteed to be in their final sorted positions at the tail of the array.
- Total comparisons without optimization: $\frac{n(n-1)}{2} = \Theta(n^2)$.
- **Stability**: Bubble sort is **stable**; identical elements never swap past each other.

---

#### Adaptive Early-Termination Flag
If an entire pass completes **without a single swap**, the array is already sorted. Introducing a boolean \`swapped\` flag reduces the best-case runtime on sorted input from $O(N^2)$ to $O(N)$ linear time:`,
        codeSnippets: [
            {
                language: "c",
                title: "Optimized Adaptive Bubble Sort in ANSI C",
                code: `#include <stdio.h>
#include <stdbool.h>

void bubble_sort_adaptive(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        /* Early exit if no swaps occurred: Array is sorted */
        if (!swapped) break;
    }
}`
            }
        ],
        aiSummary: {
            summary: "Bubble Sort compares adjacent elements and swaps them into order, bubbling the largest unsorted value to the tail on each pass. An early-exit flag reduces best-case runtime to O(n) when the input is already sorted.",
            keyConcepts: [
                "Adjacent Pairwise Comparisons",
                "Pass Invariant (Tail Settlement)",
                "Stable Sorting Property",
                "Adaptive Early-Exit Optimization"
            ],
            revisionNotes: "Bubble Sort has high overhead due to frequent swap operations. It is primarily an educational algorithm and rarely used in production systems."
        }
    },

    "6-2": {
        title: "6.2 Selection sort",
        content: `### 6.2 Selection Sort & In-Place Minimum Swapping

**Selection Sort** divides the input array into two conceptual regions: a sorted subarray built from left to right, and an unsorted subarray occupying the remainder. In each pass, it scans the unsorted subarray to locate the minimum element and swaps it with the first unsorted element.

\`\`\`
   Selection Sort Step-by-Step:
   Sorted │ Unsorted
   []     │ [64, 25, 12, 22, 11]  ──► Min is 11, swap with 64
   [11]   │ [25, 12, 22, 64]      ──► Min is 12, swap with 25
   [11,12]│ [25, 22, 64]          ──► Min is 22, swap with 25
   [11,12,22] │ [25, 64]          ──► Min is 25, swap with 25
   [11,12,22,25,64]               ──► Completely sorted!
\`\`\`

#### Complexity and Memory Properties
- **Comparisons**: Always $\frac{n(n-1)}{2} = \Theta(n^2)$ regardless of initial ordering.
- **Swaps**: Performs at most $n - 1$ swaps ($O(N)$ writes).
- **Stability**: **Unstable** (e.g. \`[4a, 4b, 1]\` swaps \`4a\` with \`1\`, moving \`4a\` after \`4b\`).
- **Optimal Hardware Use Case**: Ideal for embedded systems with Flash EEPROM memory where memory write cycles degrade physical silicon and reads are cheap.`,
        codeSnippets: [
            {
                language: "c",
                title: "Selection Sort Implementation in ANSI C",
                code: `#include <stdio.h>

void selection_sort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        if (min_idx != i) {
            int temp = arr[i];
            arr[i] = arr[min_idx];
            arr[min_idx] = temp;
        }
    }
}`
            }
        ],
        aiSummary: {
            summary: "Selection Sort repeatedly finds the minimum element from the unsorted partition and places it at the beginning. It executes Theta(n^2) comparisons, but guarantees at most O(n) memory writes, making it ideal for write-sensitive hardware like EEPROM.",
            keyConcepts: [
                "Sorted vs Unsorted Partitioning",
                "Minimum Search Mechanics",
                "O(n) Minimal Write Advantage",
                "Unstable Sort Classification"
            ],
            revisionNotes: "Selection Sort does NOT adapt to already-sorted input: its runtime remains strictly Theta(n^2) in all cases because it must always scan the remaining subarray to verify the minimum."
        }
    },

    "6-3": {
        title: "6.3 Insertion sort",
        content: `### 6.3 Insertion Sort & Online Card-Shifting Adaptive Sort

**Insertion Sort** constructs the sorted array one element at a time, similar to sorting playing cards in hand. For each element, it shifts all greater preceding elements one position to the right and inserts the current key into its correct relative position.

\`\`\`
   Insertion Sort Card Shifting:
   [12, 11, 13, 5, 6]  ──► Key = 11: Shift 12 right ──► [11, 12, 13, 5, 6]
   [11, 12, 13, 5, 6]  ──► Key = 13: No shift needed ──► [11, 12, 13, 5, 6]
   [11, 12, 13, 5, 6]  ──► Key = 5:  Shift 13, 12, 11  ──► [5, 11, 12, 13, 6]
\`\`\`

#### Key Characteristics
- **Adaptive**: Operates in $O(N)$ linear time when the array is already sorted or nearly sorted.
- **Online**: Can sort a list as it receives it in real time from a data stream.
- **Stable**: Preserves the relative order of duplicate elements.
- **Hybrid Algorithm Engine**: Serves as the base-case sorting engine in production hybrid algorithms like **Timsort** (Python/Java) and **Introsort** (C++ \`std::sort\`) for small subarrays ($n \le 16$ or $32$) due to low constant factors and cache locality.`,
        codeSnippets: [
            {
                language: "c",
                title: "Insertion Sort in ANSI C",
                code: `#include <stdio.h>

void insertion_sort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        /* Shift elements greater than key to one position ahead */
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`
            }
        ],
        aiSummary: {
            summary: "Insertion Sort builds a sorted array by inserting each element into its proper position among previously sorted elements. It is stable, in-place, and achieves O(n) best-case performance on nearly-sorted data, serving as the base case for Timsort and Introsort.",
            keyConcepts: [
                "Card-Shifting Intuition",
                "Adaptive Linear Best Case O(n)",
                "Online Data Stream Processing",
                "Role in Hybrid Sorting Engines"
            ],
            revisionNotes: "For small arrays (n <= 16), Insertion Sort consistently outperforms QuickSort and MergeSort because it has virtually zero function-call overhead and excellent cache locality."
        }
    },

    "6-4": {
        title: "6.4 Mergesort",
        content: `### 6.4 Merge Sort & Divide-and-Conquer Recurrence

**Merge Sort** (invented by John von Neumann) is a canonical **Divide-and-Conquer** sorting algorithm. It divides the array into two equal halves, recursively sorts both halves, and merges the two sorted subarrays into a single sorted array.

\`\`\`
                            Merge Sort Divide & Conquer Tree
                               [38, 27, 43, 3, 9, 82, 10]
                                            │
                       ┌────────────────────┴────────────────────┐
                [38, 27, 43, 3]                            [9, 82, 10]
                       │                                         │
                 ┌─────┴─────┐                             ┌─────┴─────┐
              [38, 27]    [43, 3]                        [9, 82]     [10]
                 │           │                              │          │
              ┌──┴──┐     ┌──┴──┐                        ┌──┴──┐       │
             [38]  [27]  [43]  [3]                      [9]   [82]     │
                 │           │                              │          │
              [27, 38]    [3, 43]                        [9, 82]       │
                 └─────┬─────┘                             └─────┬─────┘
                  [3, 27, 38, 43]                            [9, 10, 82]
                       └────────────────────┬────────────────────┘
                               [3, 9, 10, 27, 38, 43, 82]
\`\`\`

#### Recurrence Relation and Master Theorem
$$T(n) = 2T\left(\frac{n}{2}\right) + \Theta(n)$$
By Master Theorem Case 2: $a=2, b=2 \implies n^{\log_2 2} = n^1 \implies T(n) = \Theta(n \log n)$ across **all** cases (Worst, Average, and Best).

---

#### Key Characteristics
- **Guaranteed $O(N \log N)$**: Never degrades to quadratic runtime.
- **Stable**: Preserves relative ordering during merging by preferring left subarray elements when values match (\`left[i] <= right[j]\`).
- **Space Requirement**: Requires $O(N)$ auxiliary heap memory for the temporary merge buffer.
- **External Sorting**: Ideal for sorting massive datasets that do not fit in RAM (stored on disk).`,
        codeSnippets: [
            {
                language: "c",
                title: "Merge Sort Implementation in ANSI C",
                code: `#include <stdio.h>
#include <stdlib.h>

void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    int *L = (int*)malloc(n1 * sizeof(int));
    int *R = (int*)malloc(n2 * sizeof(int));

    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++]; /* <= ensures stability */
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];

    free(L);
    free(R);
}

void merge_sort(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        merge_sort(arr, left, mid);
        merge_sort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}`
            }
        ],
        aiSummary: {
            summary: "Merge Sort recursively divides the array in half and merges the sorted subarrays in O(n) time, guaranteeing O(n log n) performance in all cases. It is stable and ideal for external sorting, but requires O(n) auxiliary space.",
            keyConcepts: [
                "Divide-and-Conquer Paradigm",
                "Two-Way Merge Procedure",
                "Guaranteed O(n log n) Complexity",
                "O(n) Auxiliary Space Trade-off"
            ],
            revisionNotes: "Merge sort is preferred for sorting Linked Lists because merge operations require only pointer manipulation with O(1) extra space, avoiding the O(n) buffer needed for arrays."
        }
    },

    "6-5": {
        title: "6.5 Quicksort",
        content: `### 6.5 Quick Sort & Lomuto/Hoare In-Place Partitioning

**Quick Sort** is an in-place, divide-and-conquer sorting algorithm. It picks an element as a **pivot** and partitions the array around the pivot such that elements smaller than the pivot are placed to its left, and elements greater are placed to its right.

\`\`\`
   Lomuto Partitioning on Array: [10, 80, 30, 90, 40, 50, 70]
   Pivot = 70 (Last element)
   i scans for boundary of smaller elements; j scans current element:
   ┌────┬────┬────┬────┬────┬────┬────┐
   │ 10 │ 30 │ 40 │ 50 │ 90 │ 80 │ 70 │  ──► Swap pivot 70 with 90:
   └────┴────┴────┴────┴────┴────┴────┘
   ┌────┬────┬────┬────┬────┬────┬────┐
   │ 10 │ 30 │ 40 │ 50 │ 70 │ 80 │ 90 │  ──► Pivot 70 is in final sorted position!
   └────┴────┴────┴────┴────┴────┴────┘
    ◄── Elements < 70 ──►  ▲  ◄─ El > 70 ─►
\`\`\`

#### Partitioning Schemes
1. **Lomuto Partition Scheme**:
   - Pivot is chosen as the last element.
   - Slower, but simpler: a single index $i$ tracks the partition boundary. Performs more swaps.
2. **Hoare Partition Scheme**:
   - Uses two pointers moving toward each other from opposite ends of the array.
   - Performs approximately **3× fewer swaps** than Lomuto and partitions more efficiently.

---

#### Complexity and Pivot Selection
- **Average-Case Time**: $O(N \log N)$ with excellent CPU cache locality.
- **Worst-Case Time**: $O(N^2)$ (occurs when the pivot is consistently the smallest or largest element, e.g., already sorted input with naive last-element pivot).
- **Mitigation**: **Randomized Pivot** or **Median-of-Three** (median of first, middle, and last elements) avoids quadratic worst-case behavior in production systems.`,
        codeSnippets: [
            {
                language: "c",
                title: "Quick Sort with Lomuto Partitioning in ANSI C",
                code: `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return i + 1;
}

void quick_sort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quick_sort(arr, low, pi - 1);
        quick_sort(arr, pi + 1, high);
    }
}`
            }
        ],
        aiSummary: {
            summary: "Quick Sort partitions arrays around a pivot in O(n log n) average time. It is in-place and cache-friendly, but has an O(n^2) worst case on poor pivot selection, which is mitigated via Median-of-Three or randomized pivots.",
            keyConcepts: [
                "Pivot Selection Strategies",
                "Lomuto vs Hoare Partitioning",
                "In-Place Sorting & Cache Locality",
                "Worst-Case Quadratic Mitigation"
            ],
            revisionNotes: "Standard QuickSort is UNSTABLE because elements can be swapped across large distances during partitioning."
        }
    },

    "6-6": {
        title: "6.6 Heapsort",
        content: `### 6.6 Heap Sort & Complete Binary Max-Heap Tree

**Heap Sort** is an in-place, non-recursive sorting algorithm with a guaranteed $O(N \log N)$ runtime. It leverages a **Complete Binary Max-Heap** data structure stored in a flat array.

\`\`\`
       Array Representation: [90, 75, 80, 40, 60, 70]
       Tree Mapping:
                     (90) [0]
                   ┌────┴────┐
                (75) [1]    (80) [2]
               ┌───┴───┐       │
             (40)[3] (60)[4] (70)[5]
\`\`\`

#### Array Index Mapping for Zero-Indexed Heaps
For node at index $i$:
- **Left Child**: $2i + 1$
- **Right Child**: $2i + 2$
- **Parent**: $\lfloor(i - 1) / 2\rfloor$

---

#### Two-Phase Algorithmic Strategy
1. **Phase 1: Build Max-Heap (\`buildMaxHeap\`)**:
   Converts an unsorted array into a Max-Heap where \`parent >= children\`. Starts at the last non-leaf node ($\lfloor n/2 \rfloor - 1$) and calls \`heapifyDown\` up to the root.
   - **Time Complexity**: Computed as $\sum_{h=0}^{\log n} \frac{n}{2^{h+1}} O(h) = \mathbf{O(N)}$ linear time.
2. **Phase 2: Extraction & Sorting**:
   Repeatedly swap the root element (maximum value at index 0) with the last element of the heap, reduce heap size by 1, and restore the max-heap property via \`heapifyDown(0)\`.
   - **Time Complexity**: $n$ extractions $\times O(\log n) = \mathbf{O(N \log N)}$.`,
        codeSnippets: [
            {
                language: "c",
                title: "Heap Sort Implementation in ANSI C",
                code: `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest != i) {
        swap(&arr[i], &arr[largest]);
        heapify(arr, n, largest);
    }
}

void heap_sort(int arr[], int n) {
    /* Phase 1: Build Max-Heap in O(n) */
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);

    /* Phase 2: Extract root and heapify in O(n log n) */
    for (int i = n - 1; i > 0; i--) {
        swap(&arr[0], &arr[i]); /* Move current root to end */
        heapify(arr, i, 0);     /* Restore heap on reduced tree */
    }
}`
            }
        ],
        aiSummary: {
            summary: "Heap Sort builds a complete binary max-heap in O(n) linear time, then repeatedly extracts the root maximum to the end of the array, restoring the heap in O(log n). It guarantees O(n log n) time and O(1) auxiliary space, but is unstable.",
            keyConcepts: [
                "Complete Binary Heap Array Mapping",
                "O(n) Build-Heap Derivation",
                "Heapify Sift-Down Mechanics",
                "Guaranteed O(n log n) In-Place Sorting"
            ],
            revisionNotes: "Why buildMaxHeap is O(n) and not O(n log n): Most nodes reside near the bottom of the tree with small heights (n/2 leaves require 0 swaps, n/4 require at most 1 swap), so the summation converges to O(n)."
        }
    },

    "6-7": {
        title: "6.7 Counting sort",
        content: `### 6.7 Counting Sort & Non-Comparison Integer Key Distribution

**Counting Sort** is a non-comparison integer sorting algorithm that breaks the theoretical $\Omega(N \log N)$ lower bound of comparison-based sorting, achieving **$O(N + K)$ linear time**, where $K$ is the range of keys.

\`\`\`
   Input Array: [4, 2, 2, 8, 3, 3, 1] (Range K = 8)
   
   1. Frequency Counts:
      Key:   [0] [1] [2] [3] [4] [5] [6] [7] [8]
      Count:  0   1   2   2   1   0   0   0   1
      
   2. Prefix Sums (Cumulative Positions):
      Cum:    0   1   3   5   6   6   6   6   7
      
   3. Stable Placement from Right-to-Left:
      Output: [1, 2, 2, 3, 3, 4, 8]
\`\`\`

#### Algorithmic Procedure
1. Determine the maximum key value $K$. Allocate an array \`count\` of size $K + 1$ initialized to 0.
2. Count the occurrences of each value: \`count[arr[i]]++\`.
3. Compute **cumulative prefix sums** in \`count\`: each index now stores the total count of elements $\le$ that key, representing its 1-based ending output index.
4. Iterate through the input array from **right to left** (tail to head), placing elements into an output array at \`count[arr[i]] - 1\`, and decrement \`count[arr[i]]\`.
   - Traversing right-to-left guarantees **Stability**.

---

#### Complexity and Limitations
- **Time Complexity**: $O(N + K)$ in all cases.
- **Space Complexity**: $O(N + K)$ auxiliary memory.
- **Applicability**: Highly efficient when $K = O(N)$ (small key range), but impractical when $K \gg N$ (e.g., sorting 100 elements with values up to $10^9$ requires a 1GB count array).`,
        codeSnippets: [
            {
                language: "c",
                title: "Stable Counting Sort in ANSI C",
                code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void counting_sort(int arr[], int n, int max_val) {
    int *count = (int*)calloc(max_val + 1, sizeof(int));
    int *output = (int*)malloc(n * sizeof(int));

    /* Frequency count */
    for (int i = 0; i < n; i++) count[arr[i]]++;

    /* Cumulative prefix sum */
    for (int i = 1; i <= max_val; i++) count[i] += count[i - 1];

    /* Right-to-left placement for stability */
    for (int i = n - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }

    for (int i = 0; i < n; i++) arr[i] = output[i];

    free(count);
    free(output);
}`
            }
        ],
        aiSummary: {
            summary: "Counting Sort achieves O(n + k) linear time by counting frequencies and accumulating prefix sums to place keys into sorted positions without comparisons. It is stable, but requires O(n + k) auxiliary space and is efficient only when the key range k is comparable to n.",
            keyConcepts: [
                "Non-Comparison Sorting Principle",
                "Frequency Count and Prefix Sums",
                "Stability via Right-to-Left Traversal",
                "O(n + k) Time and Space Bounds"
            ],
            revisionNotes: "Counting Sort forms the core sub-routine of Radix Sort, which sorts integers digit-by-digit or byte-by-byte."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 07: GRAPH THEORY & HIERARCHICAL STRUCTURES
    // ═════════════════════════════════════════════════════════════════════════
    "7-1": {
        title: "7.1 Graphs",
        content: `### 7.1 Graph Representation: Adjacency Matrix vs Adjacency List

A **Graph** $G = (V, E)$ consists of a set of vertices (nodes) $V$ and a set of edges $E$ connecting pairs of vertices. Graphs may be **directed (digraph)** or **undirected**, and **weighted** or **unweighted**.

\`\`\`
   Graph Topology:                  Adjacency Matrix:       Adjacency List:
        (0)                         [0] [1] [2]             [0] ──► [1] ──► [2] ──► NULL
       /   \\                        ┌───┬───┬───┐           [1] ──► [0] ──► [2] ──► NULL
     (1)───(2)                  [0] │ 0 │ 1 │ 1 │           [2] ──► [0] ──► [1] ──► NULL
                                [1] │ 1 │ 0 │ 1 │
                                [2] │ 1 │ 1 │ 0 │
                                    └───┴───┴───┘
\`\`\`

#### Architectural Trade-Off Analysis
| Feature | Adjacency Matrix | Adjacency List |
| :--- | :--- | :--- |
| **Data Structure** | 2D Array: \`bool adj[V][V]\` or \`int weight[V][V]\` | Array of Linked Lists or dynamic vectors |
| **Space Complexity** | $\Theta(V^2)$ bytes regardless of edge count | $\Theta(V + E)$ (Directed) / $\Theta(V + 2E)$ (Undirected)|
| **Edge Query $(u, v)$** | $O(1)$ constant time lookup: \`adj[u][v]\` | $O(\text{deg}(u))$ (scan linked list) |
| **Enumerate Neighbors**| $O(V)$ scan across entire row | $O(\text{deg}(u))$ scan only existing neighbors |
| **Add Vertex** | $O(V^2)$ requires matrix reallocation | $O(1)$ append new list head |
| **Dense vs Sparse** | Optimal for **Dense Graphs** ($E \approx V^2$) | Optimal for **Sparse Graphs** ($E \ll V^2$) |`,
        codeSnippets: [
            {
                language: "c",
                title: "Adjacency List Graph Architecture in ANSI C",
                code: `#include <stdio.h>
#include <stdlib.h>

typedef struct AdjNode {
    int dest;
    int weight;
    struct AdjNode *next;
} AdjNode;

typedef struct {
    int num_vertices;
    AdjNode **heads;
} Graph;

Graph* create_graph(int v) {
    Graph *g = (Graph*)malloc(sizeof(Graph));
    g->num_vertices = v;
    g->heads = (AdjNode**)calloc(v, sizeof(AdjNode*));
    return g;
}

void add_edge(Graph *g, int src, int dest, int weight) {
    AdjNode *node = (AdjNode*)malloc(sizeof(AdjNode));
    node->dest = dest;
    node->weight = weight;
    node->next = g->heads[src];
    g->heads[src] = node;
}`
            }
        ],
        aiSummary: {
            summary: "Graphs represent networks of vertices and edges. Adjacency Matrices use O(V^2) memory and provide O(1) edge checks, best for dense graphs. Adjacency Lists use O(V + E) memory, best for sparse graphs and fast neighbor traversal.",
            keyConcepts: [
                "Graph Formalism G = (V, E)",
                "Adjacency Matrix O(V^2) Overhead",
                "Adjacency List O(V + E) Efficiency",
                "Dense vs Sparse Topological Regimes"
            ],
            revisionNotes: "Most real-world networks (social graphs, web graphs, road networks) are extremely sparse (average degree < 50), making Adjacency Lists the standard representation."
        }
    },

    "7-2": {
        title: "7.2 Simple trees",
        content: `### 7.2 Hierarchical Tree Structures & Terminology

A **Tree** is an undirected, connected, acyclic graph. In a rooted tree, there is a designated **root** node from which every other node is reachable via a unique path. A tree with $N$ vertices always contains exactly $N - 1$ edges.

\`\`\`
                          Root: [A] (Depth = 0, Level = 1)
                        ┌────┴────┐
                   [B]               [C] (Depth = 1, Level = 2)
                ┌───┴───┐             │
              [D]       [E]          [F] (Depth = 2, Level = 3)
                                      │
                                     [G] (Depth = 3, Level = 4)
\`\`\`

#### Key Terminology
- **Root**: The unique node without a parent (Node A).
- **Edge**: The directed or undirected link connecting parent to child.
- **Leaf (Terminal Node)**: A node with degree 0 (no children: D, E, G).
- **Internal (Non-terminal) Node**: A node with at least one child.
- **Depth of a Node**: The number of edges along the path from the root to that node ($\text{Depth}(\text{Root}) = 0$).
- **Height of a Node**: The number of edges on the longest downward path from that node to a leaf ($\text{Height}(\text{Leaf}) = 0$).
- **Height of a Tree**: The height of its root node ($\max \text{depth}$).`,
        codeSnippets: [
            {
                language: "c",
                title: "Tree Height Calculation via Post-Order Traversal",
                code: `#include <stdio.h>

typedef struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
} TreeNode;

int tree_height(TreeNode *root) {
    if (root == NULL) return -1; /* Convention: Empty tree height = -1, leaf = 0 */
    int left_h = tree_height(root->left);
    int right_h = tree_height(root->right);
    return 1 + (left_h > right_h ? left_h : right_h);
}`
            }
        ],
        aiSummary: {
            summary: "A tree is an acyclic connected graph with N nodes and N - 1 edges. The depth of a node is its edge distance from the root. The height of a tree is the length of the longest path from the root to a leaf.",
            keyConcepts: [
                "Tree Properties (|E| = |V| - 1)",
                "Node Depth vs Node Height",
                "Internal Nodes vs Leaf Nodes",
                "Recursive Subtree Definition"
            ],
            revisionNotes: "Note the convention: Some textbooks define leaf height as 0 (empty tree = -1); others define leaf height as 1 (empty tree = 0). State your convention clearly on exams."
        }
    },

    "7-3": {
        title: "7.3 Heaps, heapsort",
        content: `### 7.3 Binary Heaps & Priority Queues (Min-Heap / Max-Heap)

A **Binary Heap** is a complete binary tree that satisfies the **Heap Order Invariant**:
- **Max-Heap Property**: For every node $i$ other than the root, $\text{val}(\text{parent}(i)) \ge \text{val}(i)$. The root holds the maximum element.
- **Min-Heap Property**: For every node $i$ other than the root, $\text{val}(\text{parent}(i)) \le \text{val}(i)$. The root holds the minimum element.

#### Array Index Mapping (0-Indexed)
\`\`\`
   Left Child(i)  = 2*i + 1
   Right Child(i) = 2*i + 2
   Parent(i)      = (i - 1) / 2
\`\`\`

#### Core Operations and Mechanics
1. **\`insert(x)\`**: Place $x$ at the next free leaf position at the end of the array to maintain the complete tree property. Call **\`siftUp(index)\`**: swap with parent while parent violates the heap property. Time: $O(\log N)$.
2. **\`extractMax()\` / \`extractMin()\`**: Copy root value for return. Move the last leaf element to the root position. Decrement heap size by 1. Call **\`siftDown(0)\`**: repeatedly swap with the larger child (in max-heap) until heap invariant is restored. Time: $O(\log N)$.
3. **\`peek()\`**: Direct return of \`arr[0]\` in $O(1)$ constant time.`,
        codeSnippets: [
            {
                language: "c",
                title: "Min-Heap Insert and Extract-Min in ANSI C",
                code: `#include <stdio.h>

#define MAX_HEAP_SIZE 1024

typedef struct {
    int data[MAX_HEAP_SIZE];
    int size;
} MinHeap;

void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

void min_heap_insert(MinHeap *h, int val) {
    if (h->size >= MAX_HEAP_SIZE) return;
    int curr = h->size++;
    h->data[curr] = val;

    /* Sift-Up */
    while (curr > 0 && h->data[(curr - 1) / 2] > h->data[curr]) {
        swap(&h->data[(curr - 1) / 2], &h->data[curr]);
        curr = (curr - 1) / 2;
    }
}

int min_heap_extract(MinHeap *h) {
    int min_val = h->data[0];
    h->data[0] = h->data[--(h->size)];

    /* Sift-Down */
    int curr = 0;
    while (2 * curr + 1 < h->size) {
        int left = 2 * curr + 1, right = 2 * curr + 2, smallest = left;
        if (right < h->size && h->data[right] < h->data[left]) smallest = right;
        if (h->data[curr] <= h->data[smallest]) break;
        swap(&h->data[curr], &h->data[smallest]);
        curr = smallest;
    }
    return min_val;
}`
            }
        ],
        aiSummary: {
            summary: "A Binary Heap is a complete binary tree stored in an array that satisfies the heap property (parent >= child for max-heap, parent <= child for min-heap). Sift-up and sift-down restore the invariant in O(log n) time, and peek takes O(1).",
            keyConcepts: [
                "Complete Binary Tree Array Mapping",
                "Max-Heap vs Min-Heap Invariant",
                "Sift-Up (Bubble Up) Insertion",
                "Sift-Down (Heapify) Extraction"
            ],
            revisionNotes: "A binary heap is NOT a search tree: elements are not sorted from left to right, and searching for an arbitrary value takes O(n) linear scan."
        }
    },

    "7-4": {
        title: "7.4 Priority queues",
        content: `### 7.4 Priority Queue ADT & Heap-Based Scheduling

A **Priority Queue** is an Abstract Data Type where each element has an associated numerical **priority**. In contrast to a FIFO queue, elements with the highest priority are dequeued first.

#### Implementation Comparison
| Backing Data Structure | \`insert()\` | \`extractMax()\` | \`peekMax()\` |
| :--- | :--- | :--- | :--- |
| **Unsorted Array** | $O(1)$ append | $O(N)$ linear scan | $O(N)$ |
| **Sorted Array** | $O(N)$ shift | $O(1)$ remove tail | $O(1)$ |
| **Binary Heap** | $\mathbf{O(\log N)}$ | $\mathbf{O(\log N)}$ | $\mathbf{O(1)}$ |
| **Fibonacci Heap** | $O(1)$ amortized | $O(\log N)$ amortized| $O(1)$ |

---

#### Real-World Applications
1. **Operating System Schedulers**: Round-robin priority scheduling and timer interrupt event queues.
2. **Graph Algorithms**: **Dijkstra’s Algorithm** (extract node with minimum tentative distance) and **Prim’s Algorithm** (extract edge with minimum weight).
3. **Data Compression**: **Huffman Coding** repeatedly combines the two characters with lowest frequencies.`,
        codeSnippets: [
            {
                language: "c",
                title: "Task Priority Queue Dispatcher",
                code: `#include <stdio.h>

typedef struct {
    int task_id;
    int priority; /* Higher value = higher priority */
} Task;

/* Priority comparison logic for heap sift operations */
int compare_tasks(Task a, Task b) {
    return a.priority - b.priority;
}`
            }
        ],
        aiSummary: {
            summary: "A Priority Queue ADT serves elements according to priority rather than arrival order. Binary heaps provide an optimal balance with O(log n) insertions and extractions, powering Dijkstra's algorithm, OS process schedulers, and Huffman coding.",
            keyConcepts: [
                "Priority Queue ADT Specification",
                "Heap-Backed Priority Queues",
                "Dijkstra & Prim Algorithmic Engines",
                "Operating System Process Scheduling"
            ],
            revisionNotes: "Priority Queues can be min-oriented (lowest number = highest urgency, as in Dijkstra's) or max-oriented (highest number = highest priority, as in task schedulers)."
        }
    },

    "7-5": {
        title: "7.5 Binary trees, n-ary trees",
        content: `### 7.5 Binary Trees & N-ary Trees (LCRS Representation)

A **Binary Tree** is a tree data structure in which every node has at most two children, referred to as the **left child** and the **right child**.

#### Special Classes of Binary Trees
\`\`\`
   Full Binary Tree:         Complete Binary Tree:       Perfect Binary Tree:
         (A)                         (A)                         (A)
       ┌──┴──┐                     ┌──┴──┐                     ┌──┴──┐
      (B)   (C)                   (B)   (C)                   (B)   (C)
           ┌─┴─┐                 ┌─┴─┐   │                   ┌─┴─┐ ┌─┴─┐
          (D) (E)               (D) (E) (F)                 (D) (E)(F) (G)
   (Every node has 0 or 2)   (Filled left-to-right)      (All leaves at same level)
\`\`\`

1. **Full (Proper) Tree**: Every node has either 0 or 2 children.
2. **Complete Tree**: Every level is completely filled, except possibly the last level, which is filled from left to right.
3. **Perfect Tree**: All internal nodes have two children and all leaves are at the exact same depth. Total nodes $N = 2^{h+1} - 1$.
4. **Degenerate (Skewed) Tree**: Every internal node has only one child, degrading to a linked list with $O(N)$ operations.

---

#### N-ary Trees via Left-Child Right-Sibling (LCRS)
In general **N-ary Trees**, a node can have an arbitrary number of children. Instead of allocating variable-sized pointer arrays, the **LCRS representation** transforms any N-ary tree into a binary tree with two pointers:
- \`left_child\`: Points to the node's first immediate child.
- \`right_sibling\`: Points to the node's next sibling in the parent's child list.`,
        codeSnippets: [
            {
                language: "c",
                title: "Left-Child Right-Sibling (LCRS) Node Architecture",
                code: `#include <stdio.h>
#include <stdlib.h>

typedef struct LCRSNode {
    int data;
    struct LCRSNode *first_child;   /* Left pointer: Points to first child */
    struct LCRSNode *next_sibling;  /* Right pointer: Points to next sibling */
} LCRSNode;

LCRSNode* create_lcrs_node(int val) {
    LCRSNode *node = (LCRSNode*)malloc(sizeof(LCRSNode));
    node->data = val;
    node->first_child = NULL;
    node->next_sibling = NULL;
    return node;
}`
            }
        ],
        aiSummary: {
            summary: "Binary trees restrict nodes to at most 2 children. Complete trees fill all levels left-to-right, while perfect trees have 2^(h+1) - 1 nodes. Arbitrary N-ary trees are represented using Left-Child Right-Sibling (LCRS) binary nodes.",
            keyConcepts: [
                "Full vs Complete vs Perfect Trees",
                "Tree Capacity Formula (N = 2^(h+1) - 1)",
                "Skewed Degeneration to Linked Lists",
                "Left-Child Right-Sibling (LCRS) Transformation"
            ],
            revisionNotes: "LCRS trees allow any N-ary tree (like file system directory trees or XML/DOM hierarchies) to be stored using fixed-size 2-pointer nodes."
        }
    },

    "7-6": {
        title: "7.6 Binary search trees",
        content: `### 7.6 Binary Search Tree (BST) Invariant & 3-Case Deletion

A **Binary Search Tree (BST)** is a binary tree with the **BST Ordering Invariant**:
For every node $X$:
- All keys in the **left subtree** of $X$ are strictly smaller: $\text{key}(L) < \text{key}(X)$.
- All keys in the **right subtree** of $X$ are strictly greater: $\text{key}(R) > \text{key}(X)$.
- Both left and right subtrees must also be binary search trees.

\`\`\`
                          Valid BST:
                             (50)
                           ┌──┴──┐
                         (30)   (70)
                        ┌──┴──┐ ┌──┴──┐
                      (20)  (40)(60)  (80)
\`\`\`

#### Search and Insertion
- **Search**: Start at root. If \`target < curr->key\`, go left; if \`target > curr->key\`, go right; if equal, return found. Time: $O(h)$ where $h$ is tree height ($O(\log N)$ balanced, $O(N)$ skewed).
- **Inorder Traversal Property**: Inorder traversal (Left, Root, Right) of any BST yields keys in **monotonically sorted order**.

---

#### The Three Cases of BST Deletion
Deleting a node $Z$ requires maintaining the BST invariant:
1. **Case 1: $Z$ is a Leaf Node (No children)**:
   Simply set the parent's pointer to $Z$ to \`NULL\` and free $Z$.
2. **Case 2: $Z$ has Exactly One Child**:
   Bypass $Z$ by pointing its parent directly to $Z$'s child, then free $Z$.
3. **Case 3: $Z$ has Two Children**:
   - Find $Z$'s **Inorder Successor** (smallest node in $Z$'s right subtree: go right once, then left until NULL).
   - Copy the successor's key into $Z$.
   - Recursively delete the successor node (which is guaranteed to fall into Case 1 or Case 2).`,
        codeSnippets: [
            {
                language: "c",
                title: "Complete 3-Case BST Node Deletion in ANSI C",
                code: `#include <stdio.h>
#include <stdlib.h>

typedef struct BSTNode {
    int key;
    struct BSTNode *left;
    struct BSTNode *right;
} BSTNode;

BSTNode* find_min(BSTNode *root) {
    while (root && root->left != NULL) root = root->left;
    return root;
}

BSTNode* delete_bst_node(BSTNode *root, int key) {
    if (root == NULL) return NULL;

    if (key < root->key) {
        root->left = delete_bst_node(root->left, key);
    } else if (key > root->key) {
        root->right = delete_bst_node(root->right, key);
    } else {
        /* Case 1: Leaf or Case 2: One child */
        if (root->left == NULL) {
            BSTNode *temp = root->right;
            free(root);
            return temp;
        } else if (root->right == NULL) {
            BSTNode *temp = root->left;
            free(root);
            return temp;
        }
        /* Case 3: Two children */
        BSTNode *successor = find_min(root->right);
        root->key = successor->key;
        root->right = delete_bst_node(root->right, successor->key);
    }
    return root;
}`
            }
        ],
        aiSummary: {
            summary: "A BST maintains left < root < right across all subtrees, producing sorted order via inorder traversal. Deletion handles three cases: leaf node (free directly), one child (bypass to child), and two children (replace with inorder successor and delete successor).",
            keyConcepts: [
                "BST Ordering Invariant",
                "Inorder Traversal Sorted Property",
                "3-Case Deletion Mechanics",
                "Inorder Successor vs Predecessor"
            ],
            revisionNotes: "Worst-case BST operations degrade to O(n) when keys are inserted in sorted order (creating a degenerate linked-list tree). This motivates self-balancing trees like AVL and Red-Black trees."
        }
    },

    "7-7": {
        title: "7.7 Traversals",
        content: `### 7.7 Depth-First & Breadth-First Tree Traversals

Tree traversal is the process of visiting every node in a tree data structure exactly once. Traversals fall into two broad categories: **Depth-First Search (DFS)** and **Breadth-First Search (BFS)**.

\`\`\`
                          Sample Tree:
                              (1)
                            ┌──┴──┐
                           (2)   (3)
                          ┌──┴──┐
                         (4)   (5)
\`\`\`

#### Depth-First Traversals (DFS)
DFS explores subtrees as deeply as possible before backtracking. Implemented via recursion or an explicit LIFO stack:
1. **Preorder (Root $\to$ Left $\to$ Right)**:
   - Visit sequence: \`1, 2, 4, 5, 3\`
   - *Application*: Serializing/cloning trees, prefix expressions.
2. **Inorder (Left $\to$ Root $\to$ Right)**:
   - Visit sequence: \`4, 2, 5, 1, 3\`
   - *Application*: Yields monotonically sorted values in Binary Search Trees.
3. **Postorder (Left $\to$ Right $\to$ Root)**:
   - Visit sequence: \`4, 5, 2, 3, 1\`
   - *Application*: Bottom-up tree deletion (\`free\`), directory space calculation, postfix expression evaluation.

---

#### Breadth-First Traversal (BFS / Level-Order)
Visits all nodes level-by-level from top to bottom, left-to-right:
- Visit sequence: \`1, 2, 3, 4, 5\`
- Implemented using a **FIFO Queue**: enqueue root; while queue is not empty, dequeue current node, visit it, and enqueue its left and right children. Time: $O(N)$, Space: $O(W)$ where $W$ is maximum tree width.`,
        codeSnippets: [
            {
                language: "c",
                title: "Inorder, Preorder, and Postorder Traversals in ANSI C",
                code: `#include <stdio.h>

typedef struct Node {
    int val;
    struct Node *left;
    struct Node *right;
} Node;

void preorder(Node *root) {
    if (!root) return;
    printf("%d ", root->val);
    preorder(root->left);
    preorder(root->right);
}

void inorder(Node *root) {
    if (!root) return;
    inorder(root->left);
    printf("%d ", root->val);
    inorder(root->right);
}

void postorder(Node *root) {
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    printf("%d ", root->val);
}`
            }
        ],
        aiSummary: {
            summary: "Tree traversals visit every node once in O(n) time. DFS includes Preorder (root-left-right, tree cloning), Inorder (left-root-right, BST sorted extraction), and Postorder (left-right-root, bottom-up deletion). BFS (Level-Order) uses a FIFO queue to visit nodes level-by-level.",
            keyConcepts: [
                "Preorder (Root, Left, Right)",
                "Inorder (Left, Root, Right)",
                "Postorder (Left, Right, Root)",
                "Level-Order Queue Traversal"
            ],
            revisionNotes: "A binary tree can be uniquely reconstructed from its Inorder traversal combined with either its Preorder or Postorder traversal."
        }
    },

    "7-8": {
        title: "7.8 Trie tree",
        content: `### 7.8 Trie (Prefix Tree) ADT for Fast String Lookup

A **Trie** (derived from re**trie**val) is a tree-like search data structure used to store a dynamic collection of strings. Unlike BSTs, individual keys are not stored within nodes; instead, a node's position in the tree defines the associated string key.

\`\`\`
                     Trie Containing: "CAT", "CAR", "CARD", "DO"
                                  (root)
                                ┌───┴───┐
                               'C'     'D'
                                │       │
                               'A'     'O'*
                              ┌─┴─┐
                             'T'* 'R'*
                                   │
                                  'D'*   (* = isEndOfWord)
\`\`\`

#### Node Architecture
For a standard English lowercase alphabet of size $\Sigma = 26$:
\`\`\`c
typedef struct TrieNode {
    struct TrieNode *children[26];
    bool isEndOfWord;
} TrieNode;
\`\`\`

#### Operations and Algorithmic Complexity
Let $L$ be the length of the string and $N$ be total strings in the dictionary:
1. **\`insert(key)\`**: Traverse down character by character. If a child pointer for \`key[i] - 'a'\` is null, allocate a new node. Mark the final node with \`isEndOfWord = true\`. Time: $\mathbf{O(L)}$.
2. **\`search(key)\`**: Follow child pointers. If any character pointer is null, the word is absent. Returns \`true\` only if the final node has \`isEndOfWord == true\`. Time: $\mathbf{O(L)}$.
3. **\`startsWith(prefix)\`**: Identical to search, but returns \`true\` if prefix traversal finishes without encountering null pointers. Time: $\mathbf{O(L)}$.

---

#### Why Use a Trie Over a Hash Table?
- **Prefix Matching**: Supports finding all words with a given prefix (\`startsWith\`) in $O(L)$ time; impossible in standard hash tables.
- **No Hash Collisions**: Zero collision penalties; worst-case lookup is strictly bounded by key length $L$.
- **Alphabetical Ordering**: Naturally prints words in lexicographical order via depth-first traversal.`,
        codeSnippets: [
            {
                language: "c",
                title: "Complete Trie Implementation in ANSI C",
                code: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define ALPHABET_SIZE 26

typedef struct TrieNode {
    struct TrieNode *children[ALPHABET_SIZE];
    bool is_end_of_word;
} TrieNode;

TrieNode* trie_create(void) {
    TrieNode *node = (TrieNode*)malloc(sizeof(TrieNode));
    node->is_end_of_word = false;
    for (int i = 0; i < ALPHABET_SIZE; i++) node->children[i] = NULL;
    return node;
}

void trie_insert(TrieNode *root, const char *key) {
    TrieNode *curr = root;
    for (int i = 0; key[i] != '\0'; i++) {
        int idx = key[i] - 'a';
        if (!curr->children[idx]) curr->children[idx] = trie_create();
        curr = curr->children[idx];
    }
    curr->is_end_of_word = true;
}

bool trie_search(TrieNode *root, const char *key) {
    TrieNode *curr = root;
    for (int i = 0; key[i] != '\0'; i++) {
        int idx = key[i] - 'a';
        if (!curr->children[idx]) return false;
        curr = curr->children[idx];
    }
    return curr != NULL && curr->is_end_of_word;
}`
            }
        ],
        aiSummary: {
            summary: "A Trie stores strings character by character across tree edges. Insertion, search, and prefix matching operate in O(L) time, where L is string length, independent of dictionary size. Tries power search engine autocomplete, spell-checking, and IP router longest-prefix matching.",
            keyConcepts: [
                "Trie Node Architecture (children[26])",
                "O(L) Search & Prefix Matching",
                "Absence of Hash Collisions",
                "Autocomplete Systems Engineering"
            ],
            revisionNotes: "Memory overhead is the main drawback of Tries (each node has 26 pointers). In production, space is optimized using Radix Trees (Compressed Tries) that merge single-child chains."
        }
    },

    "7-9": {
        title: "7.9 Kruskal’s MST using disjoint sets",
        content: `### 7.9 Kruskal's Minimum Spanning Tree (MST) Algorithm

A **Spanning Tree** of a connected, undirected graph $G = (V, E)$ is an acyclic subgraph that includes all $V$ vertices using exactly $V - 1$ edges. A **Minimum Spanning Tree (MST)** is a spanning tree whose sum of edge weights is minimized.

\`\`\`
   Weighted Graph:                  Kruskal's MST (Weight = 11):
       (0)────4────(1)                  (0)────4────(1)
        │  \\       │                     │           │
        2   8      7                     2           │
        │    \\     │                     │           │
       (2)────9────(3)                  (2)         (3)  (Edge 1-3 weight 7 added)
\`\`\`

#### Kruskal's Greedy Strategy
Kruskal’s algorithm selects edges greedily in ascending order of weight:
1. Sort all edges $E$ in non-decreasing order of weight.
2. Initialize an empty MST forest: $T = \emptyset$.
3. For each edge $(u, v)$ in sorted order:
   - Check if $u$ and $v$ belong to the same connected component using **Disjoint Set Union (DSU)**.
   - If they are in **different components**, adding the edge will not create a cycle:
     - Add $(u, v)$ to $T$.
     - Union the sets containing $u$ and $v$.
   - If they are in the **same component**, discard $(u, v)$ to avoid creating a cycle.
4. Terminate when $T$ contains exactly $V - 1$ edges.

---

#### Complexity Analysis
- **Edge Sorting**: $O(E \log E)$ time.
- **DSU Operations**: $2E$ find operations and $V - 1$ union operations take $O(E \cdot \alpha(V))$ time, where $\alpha$ is the Inverse Ackermann function.
- **Total Time Complexity**: $\mathbf{O(E \log E)}$ (or $\mathbf{O(E \log V)}$ since $E \le V^2 \implies \log E \le 2\log V$).`,
        codeSnippets: [
            {
                language: "c",
                title: "Kruskal's Algorithm Skeleton in ANSI C",
                code: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int u, v, weight;
} Edge;

int compare_edges(const void *a, const void *b) {
    return ((Edge*)a)->weight - ((Edge*)b)->weight;
}

int dsu_find(int parent[], int i) {
    if (parent[i] == i) return i;
    return parent[i] = dsu_find(parent, parent[i]); /* Path compression */
}

void kruskal_mst(Edge edges[], int V, int E) {
    qsort(edges, E, sizeof(Edge), compare_edges);

    int *parent = (int*)malloc(V * sizeof(int));
    for (int i = 0; i < V; i++) parent[i] = i;

    int edges_in_mst = 0, total_weight = 0;
    for (int i = 0; i < E && edges_in_mst < V - 1; i++) {
        int root_u = dsu_find(parent, edges[i].u);
        int root_v = dsu_find(parent, edges[i].v);

        if (root_u != root_v) {
            printf("MST Edge: %d - %d (Weight: %d)\n", edges[i].u, edges[i].v, edges[i].weight);
            total_weight += edges[i].weight;
            edges_in_mst++;
            parent[root_u] = root_v; /* Union */
        }
    }
    free(parent);
}`
            }
        ],
        aiSummary: {
            summary: "Kruskal's algorithm finds a Minimum Spanning Tree (MST) by sorting edges by weight and greedily adding non-cycle-forming edges using Disjoint Set Union (DSU) in O(E log E) time. It guarantees an optimal tree with V - 1 edges.",
            keyConcepts: [
                "Minimum Spanning Tree (MST) Definition",
                "Greedy Edge-Addition Strategy",
                "Cycle Prevention via Disjoint Sets",
                "O(E log E) Sorting Bottleneck"
            ],
            revisionNotes: "Kruskal's is preferred for sparse graphs where E << V^2. For dense graphs, Prim's algorithm with an adjacency matrix running in O(V^2) or with a Fibonacci heap in O(E + V log V) is faster."
        }
    },

    "7-10": {
        title: "7.10 Dijkstra's Algorithm",
        content: `### 7.10 Dijkstra's Single-Source Shortest Path Algorithm

**Dijkstra's Algorithm** (conceived by Edsger Dijkstra) solves the **Single-Source Shortest Path (SSSP)** problem on graphs with **non-negative edge weights**. It computes the minimum cost path from a source vertex $S$ to every other vertex in the graph.

\`\`\`
   Shortest Path Relaxation Step:
        (u) ──────── weight(u, v) ────────► (v)
      dist[u]                             dist[v]
   
   If (dist[u] + weight(u, v) < dist[v]):
       dist[v] = dist[u] + weight(u, v)  ──► Path through u is shorter!
\`\`\`

#### Algorithmic Procedure
1. Initialize a distance array: $\text{dist}[S] = 0$, and $\text{dist}[v] = \infty$ for all $v \neq S$.
2. Insert source $(0, S)$ into a **Min-Heap Priority Queue**.
3. While the priority queue is not empty:
   - Extract vertex $u$ with minimum tentative distance.
   - If extracted distance is greater than $\text{dist}[u]$, ignore (stale heap entry).
   - For each neighbor $v$ of $u$:
     - **Edge Relaxation**:
       $$\text{if } \text{dist}[u] + \text{weight}(u, v) < \text{dist}[v]:$$
       $$\text{dist}[v] = \text{dist}[u] + \text{weight}(u, v)$$
       Push $(\text{dist}[v], v)$ into the Min-Heap.

---

#### Complexity Analysis
- With a Binary Min-Heap:
  - $V$ calls to \`extractMin()\`: $O(V \log V)$.
  - At most $E$ distance relaxations pushing to heap: $O(E \log V)$.
  - **Total Time Complexity**: $\mathbf{O((V + E) \log V)}$.
- **Fatal Limitation**: Dijkstra's fails completely on graphs with **negative edge weights** (requires Bellman-Ford).`,
        codeSnippets: [
            {
                language: "c",
                title: "Dijkstra Edge Relaxation Invariant",
                code: `#include <stdio.h>
#include <stdbool.h>

#define INF 1000000000

void relax_edge(int u, int v, int weight, int dist[]) {
    if (dist[u] != INF && dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        /* Push updated (dist[v], v) to Min-Heap */
    }
}`
            }
        ],
        aiSummary: {
            summary: "Dijkstra's algorithm finds single-source shortest paths on non-negative weighted graphs in O((V + E) log V) time using a min-heap priority queue and greedy edge relaxation. It fails on graphs with negative edge weights.",
            keyConcepts: [
                "Single-Source Shortest Paths (SSSP)",
                "Greedy Distance Relaxation Invariant",
                "Min-Heap Priority Queue Optimization",
                "Non-Negative Weight Precondition"
            ],
            revisionNotes: "Why Dijkstra fails with negative weights: Once a vertex is extracted from the priority queue, Dijkstra marks its shortest distance as finalized. A negative edge encountered later could shorten a path to an already-finalized vertex."
        }
    },

    "7-11": {
        title: "7.11 Disjoint sets",
        content: `### 7.11 Disjoint Set Union (DSU) with Path Compression & Rank

**Disjoint Set Union (DSU)**, also called **Union-Find**, manages a collection of disjoint (non-overlapping) sets. It supports two primary operations in nearly $O(1)$ amortized time:
1. **\`find(x)\`**: Determines which set element $x$ belongs to by returning the representative root of $x$'s set.
2. **\`union(x, y)\`**: Merges the sets containing elements $x$ and $y$.

#### The Two Crucial Optimizations
A naive array implementation can degenerate into a linear chain of height $N$, making operations $O(N)$. Two optimizations prevent this:

\`\`\`
   Path Compression in Find(4):
   Before:  (1) ◄── (2) ◄── (3) ◄── (4)       After:       (1)
                                                      ┌───┼───┐
                                                     (2) (3) (4) (Height = 1!)
\`\`\`

1. **Path Compression (during \`find\`)**:
   During the find operation, make every visited node on the traversal path point directly to the set root. This flattens the tree dynamically.
   \`\`\`c
   int find(int i) {
       if (parent[i] == i) return i;
       return parent[i] = find(parent[i]); /* Path compression */
   }
   \`\`\`
2. **Union by Rank / Size (during \`union\`)**:
   Always attach the root of the shallower tree to the root of the deeper tree, keeping tree height bounded by $O(\log N)$.

---

#### Amortized Complexity
When both Path Compression and Union by Rank are combined, any sequence of $M$ operations on $N$ elements executes in:
$$O(M \cdot \alpha(N))$$
Where $\alpha(N)$ is the **Inverse Ackermann Function**. For all physically conceivable values of $N \le 10^{80}$ (atoms in the observable universe), $\alpha(N) \le 4$, making DSU effectively **$O(1)$ constant time per operation**.`,
        codeSnippets: [
            {
                language: "c",
                title: "Optimized DSU with Path Compression and Union by Rank",
                code: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *parent;
    int *rank;
    int n;
} DSU;

DSU* dsu_create(int n) {
    DSU *dsu = (DSU*)malloc(sizeof(DSU));
    dsu->n = n;
    dsu->parent = (int*)malloc(n * sizeof(int));
    dsu->rank = (int*)calloc(n, sizeof(int));
    for (int i = 0; i < n; i++) dsu->parent[i] = i;
    return dsu;
}

int dsu_find(DSU *dsu, int i) {
    if (dsu->parent[i] == i) return i;
    return dsu->parent[i] = dsu_find(dsu, dsu->parent[i]); /* Path compression */
}

void dsu_union(DSU *dsu, int x, int y) {
    int root_x = dsu_find(dsu, x);
    int root_y = dsu_find(dsu, y);
    if (root_x != root_y) {
        /* Union by rank */
        if (dsu->rank[root_x] < dsu->rank[root_y]) {
            dsu->parent[root_x] = root_y;
        } else if (dsu->rank[root_x] > dsu->rank[root_y]) {
            dsu->parent[root_y] = root_x;
        } else {
            dsu->parent[root_y] = root_x;
            dsu->rank[root_x]++;
        }
    }
}`
            }
        ],
        aiSummary: {
            summary: "Disjoint Set Union (Union-Find) maintains partitioned sets. Combined with Path Compression and Union by Rank, operations run in nearly O(1) amortized time, bounded by the Inverse Ackermann function alpha(n) <= 4. It is essential for Kruskal's algorithm and dynamic connectivity.",
            keyConcepts: [
                "Disjoint Set Partitioning",
                "Path Compression Flattening",
                "Union by Rank Depth Bounding",
                "Inverse Ackermann Complexity O(alpha(n))"
            ],
            revisionNotes: "Remember: Path compression happens during FIND, not during UNION. Union simply calls find on both elements and attaches one root to the other."
        }
    },

    "7-12": {
        title: "7.12 Floyd-Warshall's algorithm",
        content: `### 7.12 Floyd-Warshall All-Pairs Shortest Path Dynamic Programming

The **Floyd-Warshall Algorithm** is a Dynamic Programming algorithm that finds the shortest paths between **all pairs of vertices** in a weighted, directed graph in $O(V^3)$ time. It handles negative edge weights, provided the graph contains **no negative cycles**.

\`\`\`
   Core DP Recurrence:
   Can path between i and j be shortened by routing through intermediate vertex k?
   
         (i) ──────────────────────────► (j)
          \\                             ▲
           \\                           /
            ▼                         /
           (k) Intermediate Candidate
   
   dist[i][j] = min( dist[i][j],  dist[i][k] + dist[k][j] )
\`\`\`

#### Dynamic Programming Formulation
Let $D^{(k)}[i][j]$ represent the shortest path from vertex $i$ to vertex $j$ considering only intermediate vertices from the set $\{0, 1, \dots, k\}$.
$$D^{(k)}[i][j] = \min\left( D^{(k-1)}[i][j], \quad D^{(k-1)}[i][k] + D^{(k-1)}[k][j] \right)$$

---

#### Negative Cycle Detection
In the final distance matrix, all diagonal entries $\text{dist}[i][i]$ should be 0 (the shortest distance from a node to itself). If any diagonal entry becomes **negative** ($\text{dist}[i][i] < 0$), the graph contains a **negative weight cycle**, which allows paths to loop indefinitely to reduce cost to $-\infty$.`,
        codeSnippets: [
            {
                language: "c",
                title: "Floyd-Warshall All-Pairs Shortest Path in ANSI C",
                code: `#include <stdio.h>
#define INF 1000000000
#define V 4

void floyd_warshall(int dist[V][V]) {
    /* k is the intermediate vertex */
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] != INF && dist[k][j] != INF) {
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
    }
}`
            }
        ],
        aiSummary: {
            summary: "Floyd-Warshall solves the All-Pairs Shortest Path problem in O(V^3) time using dynamic programming across three nested loops. It supports negative edge weights and detects negative cycles when any diagonal entry dist[i][i] becomes negative.",
            keyConcepts: [
                "All-Pairs Shortest Path (APSP)",
                "Intermediate Vertex DP Recurrence",
                "O(V^3) Triple Loop Formulation",
                "Negative Cycle Detection (dist[i][i] < 0)"
            ],
            revisionNotes: "Loop ordering is critical: The outer loop MUST iterate over intermediate vertex k (for k; for i; for j). Swapping k to an inner loop will produce incorrect results."
        }
    },

    "7-13": {
        title: "7.13 BFS and DFS searches",
        content: `### 7.13 Breadth-First Search (BFS) & Depth-First Search (DFS)

Graph traversal algorithms systematically visit every reachable vertex and edge in a graph, forming the foundation for connectivity analysis, topological sorting, cycle detection, and pathfinding.

\`\`\`
   Breadth-First Search (BFS):               Depth-First Search (DFS):
   (Explores in concentric circles via Queue) (Dives deeply along branches via Stack)
              (1)                                        (1)
            ┌──┴──┐                                    ┌──┴──┐
           (2)   (3)                                  (2)   (5)
          ┌─┴─┐   │                                  ┌─┴─┐   │
         (4) (5) (6)                                (3) (4) (6)
   Order: 1 -> 2 -> 3 -> 4 -> 5 -> 6          Order: 1 -> 2 -> 3 -> 4 -> 5 -> 6
\`\`\`

#### Comparative Analysis
| Attribute | Breadth-First Search (BFS) | Depth-First Search (DFS) |
| :--- | :--- | :--- |
| **Backing Data Structure** | FIFO Queue | LIFO Stack (or Call Stack) |
| **Exploration Style** | Level-by-level, radial expansion | Path-by-path, deep dives with backtracking |
| **Time Complexity** | $O(V + E)$ | $O(V + E)$ |
| **Space Complexity** | $O(V)$ (queue can hold maximum breadth) | $O(V)$ (stack holds maximum depth) |
| **Shortest Path** | Guarantees shortest path on **unweighted** graphs | Does NOT guarantee shortest paths |
| **Classic Applications** | Shortest path hops, Web crawlers, P2P flood | Topological sort, Cycle detection, Biconnectivity |`,
        codeSnippets: [
            {
                language: "c",
                title: "Breadth-First Search (BFS) on Adjacency Matrix",
                code: `#include <stdio.h>
#include <stdbool.h>

#define MAX_V 64

void bfs(int graph[MAX_V][MAX_V], int V, int start_node) {
    bool visited[MAX_V] = {false};
    int queue[MAX_V];
    int front = 0, rear = 0;

    visited[start_node] = true;
    queue[rear++] = start_node;

    while (front < rear) {
        int curr = queue[front++];
        printf("%d ", curr);

        for (int neighbor = 0; neighbor < V; neighbor++) {
            if (graph[curr][neighbor] && !visited[neighbor]) {
                visited[neighbor] = true;
                queue[rear++] = neighbor;
            }
        }
    }
}`
            }
        ],
        aiSummary: {
            summary: "BFS explores graphs level-by-level using a FIFO queue, finding shortest paths on unweighted graphs in O(V + E) time. DFS dives deeply along paths using a stack or recursion, powering topological sorting, cycle detection, and connected components.",
            keyConcepts: [
                "BFS Queue vs DFS Stack Paradigms",
                "O(V + E) Linear Graph Runtime",
                "Visited Array Preventing Infinite Cycles",
                "Shortest Path Guarantee in Unweighted Graphs"
            ],
            revisionNotes: "Always track visited nodes using a boolean array or hash set. Omitting visited tracking on cyclic graphs causes infinite loops and stack overflow."
        }
    },

    "7-14": {
        title: "7.14 AVL trees, B-trees",
        content: `### 7.14 Self-Balancing Trees: AVL Rotations & Multi-Way B-Trees

When standard BSTs receive pre-sorted data, they degrade into skewed linear chains with $O(N)$ operations. **Self-Balancing Trees** maintain a strictly bounded height $h = O(\log N)$ by performing tree rotations during insertions and deletions.

#### AVL Trees (Adelson-Velsky and Landis)
An **AVL Tree** is a strictly height-balanced BST where every node satisfies the **Balance Factor Invariant**:
$$\text{BF}(\text{node}) = \text{Height}(\text{Left Subtree}) - \text{Height}(\text{Right Subtree}) \in \{-1, 0, +1\}$$

\`\`\`
   The Four AVL Rotation Cases:
   
   1. Left-Left (LL) Case:             2. Right-Right (RR) Case:
         (Z)                                 (Z)
        /          Right Rotation           / \\          Left Rotation
      (Y)       ──────────────────►       (Y)   (X)    ◄──────────────────
      /                                  /   \\
    (X)                                (X)   (Z)
   
   3. Left-Right (LR) Case: Left-rotate child, then Right-rotate root.
   4. Right-Left (RL) Case: Right-rotate child, then Left-rotate root.
\`\`\`

---

#### Multi-Way B-Trees for Disk Storage
While AVL trees are ideal for in-memory operations, magnetic disks and SSDs read and write data in blocks (pages of 4KB to 64KB).
A **B-Tree** is a self-balancing search tree where internal nodes can have hundreds of keys and children ($M$-way branching):
- Shallow tree height: A B-Tree storing billions of records may have a height of only 3 or 4.
- Minimizes disk I/O seek operations, making B-Trees the standard index structure for relational database storage engines (e.g., PostgreSQL, MySQL InnoDB).`,
        codeSnippets: [
            {
                language: "c",
                title: "AVL Right Rotation Implementation in ANSI C",
                code: `#include <stdio.h>

typedef struct AVLNode {
    int key;
    int height;
    struct AVLNode *left;
    struct AVLNode *right;
} AVLNode;

int max(int a, int b) { return a > b ? a : b; }
int get_height(AVLNode *n) { return n ? n->height : 0; }

AVLNode* rotate_right(AVLNode *y) {
    AVLNode *x = y->left;
    AVLNode *T2 = x->right;

    /* Perform rotation */
    x->right = y;
    y->left = T2;

    /* Update heights */
    y->height = max(get_height(y->left), get_height(y->right)) + 1;
    x->height = max(get_height(x->left), get_height(x->right)) + 1;

    return x; /* New root */
}`
            }
        ],
        aiSummary: {
            summary: "AVL Trees maintain strict height balance with balance factors in {-1, 0, 1} via four rotation types (LL, RR, LR, RL), guaranteeing O(log n) search, insert, and delete. Multi-way B-Trees optimize disk block I/O through high branching factors, serving as database indexes.",
            keyConcepts: [
                "AVL Balance Factor (height(L) - height(R))",
                "Tree Rotations (LL, RR, LR, RL)",
                "Guaranteed O(log n) Operations",
                "B-Tree Block Storage Optimization"
            ],
            revisionNotes: "AVL trees are more strictly balanced than Red-Black trees. They provide faster lookups due to smaller height, but require more rotations during insertions and deletions."
        }
    },

    "7-15": {
        title: "7.15 Threaded trees",
        content: `### 7.15 Threaded Trees & Stackless Inorder Traversal

In a standard binary tree of $N$ nodes, exactly $N + 1$ child pointers are \`NULL\`, wasting roughly half of the tree's pointer memory. **Threaded Binary Trees** (invented by A.J. Perlis and C. Thornton) repurpose these null pointers as \"threads\":
- A \`NULL\` left pointer is modified to point to the node's **inorder predecessor**.
- A \`NULL\` right pointer is modified to point to the node's **inorder successor**.

\`\`\`
                         Threaded Binary Tree
                                 (20)
                                ┌──┴──┐
                             (10)     (30)
                            ┌──┴──┐
                           (5)   (15)
                           / \\   / \\
                         NULL ──► ──► (Thread to 20)
\`\`\`

#### Stackless Inorder Traversal
Because every leaf node points directly to its inorder successor, the tree can be traversed in sorted order without recursion, an explicit call stack, or memory allocation ($O(1)$ auxiliary space):
1. Find the leftmost node (the minimum key).
2. While current node is not null:
   - Visit current node.
   - If right pointer is a thread, follow it directly: \`curr = curr->right\`.
   - If right pointer is a true child, step right once and then follow left child pointers to the bottom of the right subtree.`,
        codeSnippets: [
            {
                language: "c",
                title: "Threaded Binary Tree Inorder Traversal (O(1) Space)",
                code: `#include <stdio.h>
#include <stdbool.h>

typedef struct TBNode {
    int data;
    struct TBNode *left, *right;
    bool is_threaded; /* true if right pointer is an inorder successor thread */
} TBNode;

void threaded_inorder(TBNode *root) {
    if (!root) return;
    TBNode *curr = root;

    /* Find leftmost node */
    while (curr->left != NULL) curr = curr->left;

    while (curr != NULL) {
        printf("%d ", curr->data);
        if (curr->is_threaded) {
            curr = curr->right; /* Follow thread */
        } else {
            curr = curr->right;
            while (curr && curr->left != NULL) curr = curr->left;
        }
    }
}`
            }
        ],
        aiSummary: {
            summary: "Threaded binary trees repurpose unused NULL child pointers to point to inorder predecessors and successors. This enables fast, stackless, and recursion-free inorder traversal in O(1) auxiliary space.",
            keyConcepts: [
                "Repurposing NULL Pointers",
                "Inorder Predecessor and Successor Threads",
                "Stackless O(1) Auxiliary Space Traversal",
                "Boolean Flags Differentiating Child vs Thread"
            ],
            revisionNotes: "Threaded trees eliminate stack overflow risks in constrained embedded systems with limited stack memory, enabling traversal without dynamic memory."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 08: HASHING & COLLISION RESOLUTION
    // ═════════════════════════════════════════════════════════════════════════
    "8-1": {
        title: "8.1 Hashing by chaining",
        content: `### 8.1 Hash Tables, Collision Resolution & Separate Chaining

A **Hash Table** is a data structure that maps keys to values using a mathematical **hash function** $h(k)$ that computes an integer index into an array of buckets, aiming to achieve **$O(1)$ average-case dictionary operations** (\`insert\`, \`search\`, \`delete\`).

\`\`\`
   Key: "Alice" ──► Hash Function h(k) ──► Index: 2
                                            ┌───┬──────────────┐
                                        [0] │   │ NULL         │
                                            ├───┼──────────────┤
                                        [1] │   │ NULL         │
                                            ├───┼──────────────┤
                                        [2] │ ──┼──► ["Alice"] ──► ["Dave"] ──► NULL (Collision Chain)
                                            ├───┼──────────────┤
                                        [3] │   │ NULL         │
                                            └───┴──────────────┘
\`\`\`

#### The Collision Problem & Pigeonhole Principle
By the Pigeonhole Principle, if the universe of possible keys $U$ is larger than table capacity $M$ ($|U| > M$), collisions are mathematically inevitable: distinct keys $k_1 \neq k_2$ will hash to the same bucket ($h(k_1) = h(k_2)$).

---

#### Collision Resolution Strategies
1. **Separate Chaining (Open Hashing)**:
   Each bucket contains a pointer to a linked list of entries that hash to that slot.
   - **Load Factor**: $\alpha = \frac{n}{m}$ (average keys per bucket).
   - Expected search time: $\Theta(1 + \alpha)$ time.
   - Graceful degradation: continues functioning even when $\alpha > 1$.
2. **Open Addressing (Closed Hashing)**:
   All entries reside directly within the array itself. When a collision occurs, alternative slots are probed systematically:
   - *Linear Probing*: $h(k, i) = (h(k) + i) \pmod m$ (prone to primary clustering).
   - *Quadratic Probing*: $h(k, i) = (h(k) + c_1 i + c_2 i^2) \pmod m$ (reduces clustering).
   - *Double Hashing*: $h(k, i) = (h_1(k) + i \cdot h_2(k)) \pmod m$ (optimal permutation).`,
        codeSnippets: [
            {
                language: "c",
                title: "Separate Chaining Hash Table in ANSI C",
                code: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define TABLE_SIZE 7

typedef struct HashNode {
    int key;
    struct HashNode *next;
} HashNode;

typedef struct {
    HashNode *buckets[TABLE_SIZE];
} HashTable;

int hash_func(int key) {
    return (key % TABLE_SIZE + TABLE_SIZE) % TABLE_SIZE;
}

void hash_insert(HashTable *ht, int key) {
    int b = hash_func(key);
    HashNode *node = (HashNode*)malloc(sizeof(HashNode));
    node->key = key;
    node->next = ht->buckets[b];
    ht->buckets[b] = node;
}

bool hash_search(HashTable *ht, int key) {
    int b = hash_func(key);
    HashNode *curr = ht->buckets[b];
    while (curr) {
        if (curr->key == key) return true;
        curr = curr->next;
    }
    return false;
}`
            }
        ],
        aiSummary: {
            summary: "Hash tables map keys to array indexes in O(1) average time via hash functions. Collisions are resolved through Separate Chaining (linked list buckets, O(1 + alpha) search) or Open Addressing (probing within the array).",
            keyConcepts: [
                "Hash Functions and Determinism",
                "The Pigeonhole Collision Principle",
                "Separate Chaining vs Open Addressing",
                "Load Factor Management (alpha = n/m)"
            ],
            revisionNotes: "When the load factor alpha exceeds a threshold (typically 0.75 for chaining, 0.5 for open addressing), the table must be dynamically rehashed to twice its size to preserve O(1) performance."
        }
    },

    "8-2": {
        title: "8.2 Perfect hashing function",
        content: `### 8.2 Universal Perfect Hashing & Two-Level Lookup O(1)

While standard hash tables provide $O(1)$ *average-case* lookup time, their *worst-case* search time can degrade to $O(N)$ when malicious or unlucky inputs collide into a single chain. **Perfect Hashing** (the FKS scheme by Fredman, Komlós, and Szemerédi) guarantees **$O(1)$ worst-case search time** with $O(N)$ total memory for static sets.

\`\`\`
   Fredman-Komlós-Szemerédi (FKS) Two-Level Architecture:
   
   Level 1: Primary Table (Size M = N)
   Index = ((a·k + b) mod p) mod M
   ┌───────────────────────────────────────────────┐
   │ Bucket 0: n₀=0 ──► [Empty]                    │
   │ Bucket 1: n₁=3 ──► Secondary Table (m₁ = 3² = 9 Slots, Zero Collisions!)
   │ Bucket 2: n₂=1 ──► Secondary Table (m₂ = 1² = 1 Slot)
   └───────────────────────────────────────────────┘
\`\`\`

#### The Two-Level FKS Construction
1. **Level 1 (Primary Table)**:
   Hashes $N$ keys into $M = N$ primary buckets using a universal hash function $h(k) = ((ak + b) \pmod p) \pmod M$.
   - Let $n_j$ be the number of keys assigned to bucket $j$.
2. **Level 2 (Secondary Tables)**:
   Each primary bucket $j$ has an independent secondary hash table of size:
   $$m_j = n_j^2$$
   - By the Birthday Paradox, sizing the table to $m_j = n_j^2$ guarantees that a randomly chosen universal hash function produces **zero collisions** with probability $> 1/2$.
   - If a collision occurs during construction, pick a new $(a_j, b_j)$ pair and rehash that secondary table until it is completely collision-free.

---

#### Total Space Proof
$$\sum_{j=0}^{M-1} m_j = \sum_{j=0}^{M-1} n_j^2 = O(N)$$
The expected sum of squares of bucket sizes is mathematically proven to be bounded by $O(N)$, guaranteeing worst-case $O(1)$ lookup time with linear total memory.`,
        codeSnippets: [
            {
                language: "c",
                title: "Two-Level FKS Perfect Hashing Lookup in ANSI C",
                code: `#include <stdio.h>
#include <stdbool.h>

typedef struct {
    int *slots;
    int m_j;
    int a_j, b_j;
} SecondaryTable;

typedef struct {
    SecondaryTable *tables;
    int M, p, a, b;
} PerfectHashTable;

bool perfect_hash_search(PerfectHashTable *pht, int key) {
    /* Level 1: Find primary bucket in O(1) */
    int b = (((long long)pht->a * key + pht->b) % pht->p) % pht->M;
    SecondaryTable *sec = &pht->tables[b];
    if (sec->m_j == 0) return false;

    /* Level 2: Find secondary slot in O(1) - Zero Collisions Guaranteed! */
    int slot = (((long long)sec->a_j * key + sec->b_j) % pht->p) % sec->m_j;
    return sec->slots[slot] == key;
}`
            }
        ],
        aiSummary: {
            summary: "FKS Perfect Hashing guarantees O(1) worst-case search time using a two-level universal hashing architecture. Level 1 distributes keys into N buckets; Level 2 sizes secondary tables to m_j = n_j^2, eliminating collisions entirely via the Birthday Paradox within O(N) total space.",
            keyConcepts: [
                "Worst-Case O(1) Search Guarantees",
                "Two-Level Hashing Architecture",
                "Birthday Paradox Quadratic Sizing (m_j = n_j^2)",
                "Universal Hash Family Selection"
            ],
            revisionNotes: "Perfect hashing requires a static, known dataset ahead of time (e.g., programming language keyword tables or CD-ROM dictionaries) and does not support dynamic insertions."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 09: STRING ALGORITHMS
    // ═════════════════════════════════════════════════════════════════════════
    "9-1": {
        title: "9.1 Simple string manipulations",
        content: `### 9.1 In-Place String Manipulations & Two-Pointer Techniques

In ANSI C systems programming, a **string** is represented as a contiguous array of \`char\` primitives terminated by a **null sentinel character (\`'\\0'\`, ASCII code 0)**. String algorithms must operate without relying on dynamic heap memory to adhere to strict memory and latency constraints.

\`\`\`
   Memory Buffer Layout for "RACECAR\\0":
   Index:   [0]   [1]   [2]   [3]   [4]   [5]   [6]   [7]
   Value:  │ 'R' │ 'A' │ 'C' │ 'E' │ 'C' │ 'A' │ 'R' │ '\\0' │
   ASCII:   (82)  (65)  (67)  (69)  (67)  (65)  (82)   (0)
             ▲                                       ▲
             │                                       │
           Left Pointer                            Right Pointer
\`\`\`

#### The Two-Pointer Invariant
Two pointers ($L$ at the head and $R$ at the tail) advance toward each other, swapping or comparing characters until they meet ($L \ge R$).
- **In-Place Reversal**: Swapping \`str[L++]\` with \`str[R--]\` in $O(N)$ time with $O(1)$ auxiliary space.
- **Palindrome Verification**: Validating \`str[L++] == str[R--]\`. If any character mismatches, the string is not a palindrome.
- **In-Place Compaction / Casing**: Shifting ASCII values directly (\`str[i] -= 32\` for lowercase to uppercase) or removing whitespace in a single pass.`,
        codeSnippets: [
            {
                language: "c",
                title: "In-Place Two-Pointer String Operations in ANSI C",
                code: `#include <stdio.h>
#include <string.h>
#include <stdbool.h>

/* O(n) Time, O(1) Space In-Place Reversal */
void string_reverse(char *str) {
    if (!str) return;
    int left = 0;
    int right = (int)strlen(str) - 1;

    while (left < right) {
        char temp = str[left];
        str[left] = str[right];
        str[right] = temp;
        left++;
        right--;
    }
}

/* O(n) Time, O(1) Space Palindrome Check */
bool is_palindrome(const char *str) {
    if (!str) return false;
    int left = 0;
    int right = (int)strlen(str) - 1;

    while (left < right) {
        if (str[left++] != str[right--]) return false;
    }
    return true;
}`
            }
        ],
        aiSummary: {
            summary: "C strings are contiguous null-terminated character arrays. Two-pointer in-place operations achieve linear O(n) time and O(1) auxiliary space for string reversal, palindrome checks, and case normalization.",
            keyConcepts: [
                "Null-Terminated Character Arrays (\\0)",
                "Two-Pointer Convergence Pattern",
                "In-Place Memory Space Guarantees O(1)",
                "ASCII Transformation Mechanics"
            ],
            revisionNotes: "Always ensure target buffers have capacity for the null terminator: a string of length N requires an array of size N + 1. Omitting the null terminator leads to buffer overrun reads."
        }
    },

    "9-2": {
        title: "9.2 Pattern search with Rabin-Karp approach",
        content: `### 9.2 Rabin-Karp Substring Search with Rolling Hash Engine

The **Rabin-Karp Algorithm** (designed by Michael O. Rabin and Richard M. Karp) solves the exact **Substring Pattern Matching** problem: finding all occurrences of a pattern string $P$ of length $M$ inside a text string $T$ of length $N$.

While naive pattern matching requires $O((N - M + 1) \cdot M)$ time by comparing characters at every position, Rabin-Karp computes a **rolling hash** over a sliding window, achieving **$O(N + M)$ average-case runtime**.

\`\`\`
   Text: "A A B A A C A A D A A B A A B A"
   Window: [A A B A]  ──► Hash(Window) == Hash(Pattern)?
   Shift 1: Dropping leftmost 'A', shifting right, adding incoming 'A' in O(1)!
\`\`\`

#### The Rolling Hash Formula
Using Horner's polynomial rule with radix base $d = 256$ and prime modulus $q = 101$:
1. **Initial Window Hash**:
   $$p = \left( \sum_{i=0}^{M-1} P[i] \cdot d^{M-1-i} \right) \pmod q$$
2. **$O(1)$ Rolling Hash Transition**:
   To slide the window from index $s$ to $s+1$, drop the outgoing character $T[s]$ and add the incoming character $T[s + M]$:
   $$t_{s+1} = \left( d \cdot \left( t_s - T[s] \cdot h \right) + T[s + M] \right) \pmod q$$
   Where $h = d^{M-1} \pmod q$. If $t_{s+1} < 0$, add $q$ to maintain a positive modulo.

---

#### Handling Spurious Hits (Hash Collisions)
- **Hash Mismatch ($p \neq t_s$)**: The pattern cannot match the current window. Slide window in $O(1)$ time without examining individual characters.
- **Hash Match ($p == t_s$)**: May be a true match OR a **Spurious Hit** (hash collision). Perform an $O(M)$ character-by-character comparison to verify.`,
        codeSnippets: [
            {
                language: "c",
                title: "Rabin-Karp Rolling Hash Substring Search in ANSI C",
                code: `#include <stdio.h>
#include <string.h>

#define RADIX_D 256
#define PRIME_Q 101

void rabin_karp_search(const char *text, const char *pat) {
    int n = (int)strlen(text);
    int m = (int)strlen(pat);
    if (m > n || m == 0) return;

    int p = 0; /* Pattern hash */
    int t = 0; /* Text window hash */
    int h = 1;

    /* Compute h = (d^(m-1)) % q */
    for (int i = 0; i < m - 1; i++) h = (h * RADIX_D) % PRIME_Q;

    /* Compute initial hash values */
    for (int i = 0; i < m; i++) {
        p = (RADIX_D * p + pat[i]) % PRIME_Q;
        t = (RADIX_D * t + text[i]) % PRIME_Q;
    }

    /* Slide the window over the text */
    for (int s = 0; s <= n - m; s++) {
        if (p == t) {
            /* Character verification to detect spurious hits */
            int j = 0;
            for (; j < m; j++) {
                if (text[s + j] != pat[j]) break;
            }
            if (j == m) printf("Pattern found at index %d\n", s);
        }

        /* Calculate rolling hash for next window in O(1) */
        if (s < n - m) {
            t = (RADIX_D * (t - text[s] * h) + text[s + m]) % PRIME_Q;
            if (t < 0) t += PRIME_Q;
        }
    }
}`
            }
        ],
        aiSummary: {
            summary: "The Rabin-Karp algorithm searches for substrings by comparing rolling hash values in O(1) time per window shift. When hashes match, character-by-character validation verifies true matches versus spurious hits, yielding O(N + M) average-case performance.",
            keyConcepts: [
                "Rolling Hash Mechanics",
                "Horner's Method Modulo Arithmetic",
                "Spurious Hit Character Verification",
                "O(N + M) Average vs O(N*M) Worst Case"
            ],
            revisionNotes: "Rabin-Karp is especially suited for Multi-Pattern Search and Plagiarism Detection, where calculating a rolling hash once allows checking against thousands of pattern hashes simultaneously."
        }
    }
};
