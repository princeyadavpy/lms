const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
const Course = require('./models/Course');
const StudentProgress = require('./models/StudentProgress');

// Complete DSA Modules and Topics from Official Syllabus
const dsaModules = [
    {
        orderIndex: 1,
        title: 'Module 01: Algorithm',
        description: 'Data structure definitions, classification, abstract data types (ADT), algorithm representation and complexity, pointers, strings, 1-D & n-D arrays, elapsed time measurement, and dynamic memory allocation (malloc, realloc, calloc).',
        estimatedHours: 6,
        lessons: [
            {
                orderIndex: 1,
                title: '1.1 Data Structure def, classification, ADT',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 1.1 Data Structure Definition, Classification & Abstract Data Types (ADT)

#### 1. What is a Data Structure?
A **data structure** is a specialized format for organizing, processing, retrieving, and storing data efficiently in memory. Choosing the right data structure reduces computational time and memory footprint.

#### 2. Classification of Data Structures
Data structures are broadly classified into:
* **Primitive Data Structures**: Directly supported by the machine and programming language (e.g., \`int\`, \`float\`, \`char\`, pointers).
* **Non-Primitive Data Structures**: Built using primitive types to handle complex collections:
  * **Linear Data Structures**: Elements arranged sequentially (Arrays, Linked Lists, Stacks, Queues).
  * **Non-Linear Data Structures**: Elements arranged hierarchically or interconnected (Trees, Graphs).
  * **Static vs Dynamic**: Static data structures have fixed size at compile-time (e.g., standard arrays), while dynamic data structures can grow or shrink at runtime on the heap (e.g., linked lists, dynamic arrays).

#### 3. Abstract Data Types (ADT)
An **Abstract Data Type (ADT)** defines a mathematical model for data types where the type is defined by its behavior (semantics) from the point of view of a user of the data, specifically in terms of possible values, possible operations on data of this type, and the behavior of these operations.
* **Separation of Concern**: Interface (what it does) vs Implementation (how it works internally).
* Examples: List ADT, Stack ADT, Queue ADT, Priority Queue ADT, Map/Dictionary ADT.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'ADT Concept in C using Struct & Function Pointers',
                        code: `#include <stdio.h>\n#include <stdlib.h>\n\n// Abstract interface representation for a Container ADT\ntypedef struct Container {\n    int *data;\n    int size;\n    int capacity;\n} Container;\n\nContainer* createContainer(int capacity) {\n    Container *c = (Container*)malloc(sizeof(Container));\n    c->data = (int*)malloc(sizeof(int) * capacity);\n    c->size = 0;\n    c->capacity = capacity;\n    return c;\n}\n\nvoid destroyContainer(Container *c) {\n    free(c->data);\n    free(c);\n}\n\nint main() {\n    Container *c = createContainer(10);\n    printf("Container initialized with capacity: %d\\n", c->capacity);\n    destroyContainer(c);\n    return 0;\n}`,
                        explanation: 'Demonstrates encapsulation of state and operations in ANSI C.'
                    }
                ],
                aiSummary: {
                    summary: 'Introduces foundational definitions of data structures, linear vs non-linear classifications, and the concept of Abstract Data Types (ADT).',
                    keyConcepts: ['Data Structure Definition', 'Primitive vs Non-Primitive', 'Linear vs Non-Linear', 'Abstract Data Type (ADT)'],
                    revisionNotes: 'Remember: ADT specifies WHAT operations are supported, while data structures specify HOW they are implemented in memory.'
                }
            },
            {
                orderIndex: 2,
                title: '1.2 Algorithm representation and complexity',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 1.2 Algorithm Representation and Asymptotic Complexity

#### 1. Algorithm Definition & Representation
An **algorithm** is a well-defined computational procedure that takes some value as input and produces some value as output. Algorithms are typically represented via:
* **Pseudocode**: Language-agnostic, structured English specifying step-by-step logic.
* **Flowcharts**: Diagrammatic depiction of control flow, conditionals, and loops.
* **Implementation Source Code**: Concrete execution in languages such as ANSI C (C89).

#### 2. Algorithm Complexity
* **Time Complexity**: Quantifies the amount of time taken by an algorithm to run as a function of the length of the input string \(n\).
* **Space Complexity**: Quantifies the amount of working storage (memory) required by an algorithm.

#### 3. Asymptotic Notations
* **Big-O Notation (\(O\))**: Asymptotic upper bound. Represents worst-case running time.
  * \(f(n) = O(g(n))\) if there exist positive constants \(c\) and \(n_0\) such that \(0 \\le f(n) \\le c \\cdot g(n)\) for all \(n \\ge n_0\).
* **Omega Notation (\(\\Omega\))**: Asymptotic lower bound. Represents best-case running time.
* **Theta Notation (\(\\Theta\))**: Asymptotic tight bound. When both upper and lower bounds coincide.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Analyzing O(1), O(n), and O(n^2) Loops',
                        code: `#include <stdio.h>\n\n// O(1) - Constant Time\nint getFirstElement(int arr[], int n) {\n    return arr[0];\n}\n\n// O(n) - Linear Time\nint linearSum(int arr[], int n) {\n    int sum = 0;\n    for(int i = 0; i < n; i++) sum += arr[i];\n    return sum;\n}\n\n// O(n^2) - Quadratic Time\nvoid printPairs(int arr[], int n) {\n    for(int i = 0; i < n; i++) {\n        for(int j = 0; j < n; j++) {\n            printf("(%d, %d) ", arr[i], arr[j]);\n        }\n    }\n}`,
                        explanation: 'Illustrates how nested iterations directly determine polynomial growth rates.'
                    }
                ],
                aiSummary: {
                    summary: 'Explores algorithm representation through pseudocode and formal asymptotic analysis using Big-O, Omega, and Theta notations.',
                    keyConcepts: ['Time Complexity', 'Space Complexity', 'Big-O Upper Bound', 'Theta Tight Bound'],
                    revisionNotes: 'Always analyze the dominant term and ignore constant multiplicative factors for asymptotic growth.'
                }
            },
            {
                orderIndex: 3,
                title: '1.3 Pointers, strings, arrays (1-D and n-D)',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### 1.3 Pointers, Strings, and Multi-Dimensional Arrays

#### 1. Pointers in Memory
A pointer stores the direct virtual memory address of another variable.
* Address operator (\`&\`): Retrieves variable address.
* Dereference operator (\`*\`): Accesses value stored at the pointed address.
* Pointer arithmetic scales by the size of the base type: \`ptr + 1\` shifts forward by \`sizeof(*ptr)\` bytes.

#### 2. Strings in ANSI C
In C (C89), a string is simply a null-terminated 1-D array of characters:
\`\`\`c
char str[] = "DSA"; // ['D', 'S', 'A', '\\0']
\`\`\`

#### 3. 1-D and Multi-Dimensional (n-D) Arrays
* **1-D Array**: Contiguous memory buffer where \`arr[i]\` is internally evaluated as \`*(arr + i)\`.
* **2-D Array**: Represented in **Row-Major Order** in C:
  \`Address(arr[i][j]) = BaseAddress + (i * COLS + j) * sizeof(Type)\`.
* **n-D Arrays**: Generalized mapping of higher-dimension tensor coordinates into a linear flat memory address space.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Pointer Arithmetic and 2D Array Mapping in C',
                        code: `#include <stdio.h>\n\n#define ROWS 2\n#define COLS 3\n\nint main() {\n    int matrix[ROWS][COLS] = {\n        {10, 20, 30},\n        {40, 50, 60}\n    };\n\n    int *ptr = &matrix[0][0];\n    for(int i = 0; i < ROWS * COLS; i++) {\n        printf("Value at offset %d: %d (Address: %p)\\n", i, *(ptr + i), (void*)(ptr + i));\n    }\n    return 0;\n}`,
                        explanation: 'Proves row-major contiguous storage of multidimensional arrays in C.'
                    }
                ],
                aiSummary: {
                    summary: 'Covers low-level memory addressing, pointer arithmetic, string representations, and row-major layout of multi-dimensional arrays.',
                    keyConcepts: ['Pointer Dereferencing', 'Pointer Arithmetic', 'Row-Major Order', 'Null-Terminated Strings'],
                    revisionNotes: 'Formula for 2D row-major addressing: Base + (i * COLS + j) * sizeof(element).'
                }
            },
            {
                orderIndex: 4,
                title: '1.4 Elapsed time',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 1.4 Elapsed Time and Performance Profiling

#### 1. Why Measure Elapsed Time?
While asymptotic complexity provides theoretical bounds, measuring actual wall-clock elapsed time is critical for:
* Benchmarking real-world hardware performance and cache behavior.
* Comparing algorithms with identical asymptotic bounds (e.g., Quicksort vs Mergesort).
* Identifying performance bottlenecks in systems programming.

#### 2. Measuring Time in ANSI C (C89)
ANSI C provides standard time utilities inside \`<time.h>\`:
* \`clock()\`: Returns the number of clock ticks elapsed since program start.
* \`CLOCKS_PER_SEC\`: Constant defining the number of clock ticks per second.
* \`elapsed_seconds = (double)(end - start) / CLOCKS_PER_SEC\`.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Benchmarking an Algorithm using clock()',
                        code: `#include <stdio.h>\n#include <time.h>\n\nvoid computeIntensiveTask() {\n    volatile long sum = 0;\n    for(long i = 0; i < 50000000L; i++) {\n        sum += i;\n    }\n}\n\nint main() {\n    clock_t start = clock();\n    computeIntensiveTask();\n    clock_t end = clock();\n\n    double cpuTimeUsed = ((double)(end - start)) / CLOCKS_PER_SEC;\n    printf("Computation took %f seconds.\\n", cpuTimeUsed);\n    return 0;\n}`,
                        explanation: 'High-precision CPU cycle timing using standard ANSI C time.h.'
                    }
                ],
                aiSummary: {
                    summary: 'Details empirical performance benchmarking in C using clock() and calculating wall-clock execution time.',
                    keyConcepts: ['clock()', 'CLOCKS_PER_SEC', 'Wall-clock vs CPU Time', 'Empirical Benchmarking'],
                    revisionNotes: 'Divide (end - start) by CLOCKS_PER_SEC with floating-point casting to obtain elapsed seconds.'
                }
            },
            {
                orderIndex: 5,
                title: '1.5 malloc, realloc, calloc',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### 1.5 Dynamic Memory Allocation: malloc, calloc, realloc & free

#### 1. Stack vs Heap Memory
* **Stack**: Automatically managed, fixed size, fast allocation, cleared upon function return.
* **Heap**: Dynamically managed by programmer at runtime via system allocator; remains allocated until explicitly freed.

#### 2. The Standard Allocation Routines (\`<stdlib.h>\`)
* **\`malloc(size_t size)\`**: Allocates raw, uninitialized memory block of \`size\` bytes. Returns \`NULL\` on failure.
* **\`calloc(size_t num, size_t size)\`**: Allocates memory for an array of \`num\` elements of \`size\` bytes each and initializes all bytes to zero (\`0\`).
* **\`realloc(void *ptr, size_t new_size)\`**: Resizes an existing heap allocation. It can expand or contract in-place or relocate the buffer to a new address.
* **\`free(void *ptr)\`**: Releases allocated memory back to the heap to prevent memory leaks.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Dynamic Allocation Workflow in C',
                        code: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n = 5;\n    int *arr = (int*)calloc(n, sizeof(int)); // Zero initialized\n    if (arr == NULL) { printf("Allocation failed\\n"); return 1; }\n\n    for(int i = 0; i < n; i++) arr[i] = (i + 1) * 10;\n\n    // Resize dynamically using realloc\n    int newN = 8;\n    int *temp = (int*)realloc(arr, newN * sizeof(int));\n    if (temp != NULL) {\n        arr = temp;\n        arr[5] = 60; arr[6] = 70; arr[7] = 80;\n    }\n\n    for(int i = 0; i < newN; i++) printf("%d ", arr[i]);\n    printf("\\n");\n\n    free(arr);\n    arr = NULL; // Prevent dangling pointer\n    return 0;\n}`,
                        explanation: 'Shows calloc, reallocation, null checks, and safe pointer clearing.'
                    }
                ],
                aiSummary: {
                    summary: 'Explains heap memory management using malloc, calloc, realloc, and free, including memory leak prevention.',
                    keyConcepts: ['Heap Allocation', 'calloc Zeroing', 'realloc Resizing', 'free & Dangling Pointers'],
                    revisionNotes: 'Always verify if pointer returned by malloc/calloc/realloc is NULL before dereferencing!'
                }
            }
        ],
        quiz: {
            title: 'Module 01 Quiz: Algorithm & Memory Fundamentals',
            passingScorePercent: 60,
            questions: [
                {
                    questionText: 'Which dynamic memory allocation function initializes all allocated bytes to zero?',
                    type: 'MCQ',
                    options: ['malloc()', 'calloc()', 'realloc()', 'alloc()'],
                    correctAnswer: 'calloc()',
                    explanation: 'calloc allocates memory and zeroes out every byte, unlike malloc which leaves memory uninitialized.'
                },
                {
                    questionText: 'What is the tight asymptotic bound (Theta) for searching an element in an unsorted array of size n?',
                    type: 'MCQ',
                    options: ['Θ(1)', 'Θ(log n)', 'Θ(n)', 'Θ(n^2)'],
                    correctAnswer: 'Θ(n)',
                    explanation: 'In the worst case or average case of linear search, all n elements must be scanned.'
                }
            ]
        }
    },
    {
        orderIndex: 2,
        title: 'Module 02: Stacks',
        description: 'Stack data structure, LIFO principle, array and linked representations, stack operations, conversions between infix, prefix, and postfix, and expression evaluation.',
        estimatedHours: 5,
        lessons: [
            {
                orderIndex: 1,
                title: '2.1 Stacks (Lab 1)',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### 2.1 Stacks (Lab 1)

#### 1. Stack Data Structure & LIFO Principle
A **Stack** is a linear data structure following the **Last-In, First-Out (LIFO)** discipline. The element added last is the first to be removed.

#### 2. Core Stack Operations
* **\`push(x)\`**: Inserts element \(x\) onto the top of the stack. Checks for Stack Overflow.
* **\`pop()\`**: Removes and returns the top element. Checks for Stack Underflow.
* **\`peek() / top()\`**: Returns the top element without removing it.
* **\`isEmpty()\`**: Returns true if the stack contains zero elements.
* **\`isFull()\`**: Returns true if maximum capacity is reached (for fixed array implementations).

#### 3. Hands-on Lab 1 Focus
Implementing a complete stack in ANSI C using a static array and dynamic memory, testing boundary overflow and underflow scenarios.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Stack Implementation in C (Lab 1)',
                        code: `#include <stdio.h>\n#include <stdlib.h>\n#define MAX 100\n\ntypedef struct Stack {\n    int items[MAX];\n    int top;\n} Stack;\n\nvoid initStack(Stack *s) { s->top = -1; }\nint isFull(Stack *s) { return s->top == MAX - 1; }\nint isEmpty(Stack *s) { return s->top == -1; }\n\nvoid push(Stack *s, int val) {\n    if (isFull(s)) { printf("Stack Overflow\\n"); return; }\n    s->items[++(s->top)] = val;\n}\n\nint pop(Stack *s) {\n    if (isEmpty(s)) { printf("Stack Underflow\\n"); return -1; }\n    return s->items[(s->top)--];\n}\n\nint peek(Stack *s) {\n    if (isEmpty(s)) return -1;\n    return s->items[s->top];\n}\n\nint main() {\n    Stack s; initStack(&s);\n    push(&s, 10); push(&s, 20); push(&s, 30);\n    printf("Top: %d\\n", peek(&s));\n    printf("Popped: %d\\n", pop(&s));\n    return 0;\n}`,
                        explanation: 'Standard array-based stack implementation with bounds checking.'
                    }
                ],
                aiSummary: {
                    summary: 'Explores stack data structure principles, LIFO behavior, primary operations, and Lab 1 implementation.',
                    keyConcepts: ['LIFO Order', 'push & pop', 'Stack Overflow/Underflow', 'Array & Linked Stacks'],
                    revisionNotes: 'All primary stack operations (push, pop, peek) operate in O(1) constant time.'
                }
            },
            {
                orderIndex: 2,
                title: '2.2 Pre-, in-, post-fix conversions',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### 2.2 Pre-, In-, and Post-fix Conversions

#### 1. Expression Notations
* **Infix**: Operator between operands (e.g., \`A + B\`). Natural to humans, requires parentheses to indicate precedence.
* **Prefix (Polish Notation)**: Operator precedes operands (e.g., \`+ A B\`).
* **Postfix (Reverse Polish Notation - RPN)**: Operator follows operands (e.g., \`A B +\`).

#### 2. Infix to Postfix Conversion (Shunting-Yard Algorithm)
1. Initialize an empty operator stack.
2. Scan infix expression from left to right:
   * If operand, append to output string.
   * If \`'('\`, push onto stack.
   * If \`')'\`, pop from stack to output until matching \`'('\` is encountered.
   * If operator, pop operators of greater or equal precedence from stack, then push incoming operator.
3. Pop all remaining operators to output.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Infix to Postfix Algorithm Core',
                        code: `#include <stdio.h>\n#include <ctype.h>\n\nint precedence(char op) {\n    if (op == '+' || op == '-') return 1;\n    if (op == '*' || op == '/') return 2;\n    if (op == '^') return 3;\n    return 0;\n}\n// Full parser processes tokens adhering to precedence hierarchy`,
                        explanation: 'Operator precedence comparison function for Shunting-Yard conversion.'
                    }
                ],
                aiSummary: {
                    summary: 'Details conversion mechanisms between infix, postfix, and prefix notation using the stack-based Shunting-yard algorithm.',
                    keyConcepts: ['Infix Notation', 'Postfix (RPN)', 'Operator Precedence', 'Shunting-Yard Algorithm'],
                    revisionNotes: 'RPN eliminates parentheses ambiguity completely, making it ideal for machine evaluation.'
                }
            },
            {
                orderIndex: 3,
                title: '2.3 Evaluations of expressions',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 2.3 Evaluation of Postfix and Prefix Expressions

#### 1. Evaluating Postfix Expressions
Because postfix notation has no parentheses and explicit operator ordering, computers evaluate it using a single stack:
1. Scan the postfix string from left to right.
2. If token is an **operand**, push its numerical value onto the stack.
3. If token is an **operator**:
   * Pop the right operand: \`val2 = pop()\`.
   * Pop the left operand: \`val1 = pop()\`.
   * Compute \`result = val1 (op) val2\`.
   * Push \`result\` back onto stack.
4. When scan completes, top of stack contains the final evaluated answer.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Postfix Evaluation in C',
                        code: `#include <stdio.h>\n#include <ctype.h>\n#define MAX 50\n\nint stack[MAX], top = -1;\nvoid push(int x) { stack[++top] = x; }\nint pop() { return stack[top--]; }\n\nint evaluatePostfix(char *exp) {\n    for(int i = 0; exp[i] != '\\0'; i++) {\n        if (isdigit(exp[i])) {\n            push(exp[i] - '0');\n        } else {\n            int val2 = pop();\n            int val1 = pop();\n            switch(exp[i]) {\n                case '+': push(val1 + val2); break;\n                case '-': push(val1 - val2); break;\n                case '*': push(val1 * val2); break;\n                case '/': push(val1 / val2); break;\n            }\n        }\n    }\n    return pop();\n}\n\nint main() {\n    char exp[] = "231*+9-"; // (2 + (3 * 1)) - 9 = -4\n    printf("Result: %d\\n", evaluatePostfix(exp));\n    return 0;\n}`,
                        explanation: 'Evaluates postfix arithmetic expressions with a stack in linear O(n) time.'
                    }
                ],
                aiSummary: {
                    summary: 'Covers stack-driven evaluation of arithmetic expressions without ambiguity or parentheses.',
                    keyConcepts: ['Postfix Evaluation', 'Operand Stacking', 'Operator Application', 'O(n) Evaluation Time'],
                    revisionNotes: 'Notice the operand order: first popped is the right-hand operand, second popped is left-hand operand.'
                }
            }
        ],
        quiz: {
            title: 'Module 02 Quiz: Stacks & Expressions',
            passingScorePercent: 60,
            questions: [
                {
                    questionText: 'What is the postfix representation of the infix expression: (A + B) * C?',
                    type: 'MCQ',
                    options: ['A B + C *', 'A B C + *', '* + A B C', 'A B + * C'],
                    correctAnswer: 'A B + C *',
                    explanation: '(A + B) converts to AB+, then multiplied with C gives AB+C*.'
                }
            ]
        }
    },
    {
        orderIndex: 3,
        title: 'Module 03: Lists and Queues',
        description: 'Linear data structures: Singly, doubly, and circular linked lists, Queue FIFO concepts, Queue implementations, and Circular queues.',
        estimatedHours: 6,
        lessons: [
            {
                orderIndex: 1,
                title: '3.1 Linked lists (Lab 2)',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### 3.1 Linked Lists (Lab 2)

#### 1. Singly Linked Lists
A linked list is a linear collection of data elements called **nodes**, where linear order is determined by pointers rather than physical memory adjacency.
* Each node contains:
  1. \`data\`: Value stored.
  2. \`next\`: Pointer to next node in memory.

#### 2. Primary Operations
* **Insertion**: At head (\(O(1)\)), at tail (\(O(n)\) or \(O(1)\) with tail pointer), or after a specific node.
* **Deletion**: By value or position, adjusting neighboring pointer links and freeing deallocated memory.
* **Traversal**: Sequentially following \`next\` links until \`NULL\`.
* **Reversal**: Inverting pointer direction in \(O(n)\) time and \(O(1)\) space.

#### 3. Doubly & Circular Linked Lists
* **Doubly Linked List**: Nodes have both \`prev\` and \`next\` pointers allowing bidirectional navigation.
* **Circular Linked List**: Last node points back to the first node instead of \`NULL\`.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Singly Linked List Implementation (Lab 2)',
                        code: `#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node {\n    int data;\n    struct Node *next;\n} Node;\n\nNode* insertHead(Node *head, int val) {\n    Node *newNode = (Node*)malloc(sizeof(Node));\n    newNode->data = val;\n    newNode->next = head;\n    return newNode;\n}\n\nvoid printList(Node *head) {\n    Node *curr = head;\n    while(curr != NULL) {\n        printf("%d -> ", curr->data);\n        curr = curr->next;\n    }\n    printf("NULL\\n");\n}\n\nint main() {\n    Node *head = NULL;\n    head = insertHead(head, 30);\n    head = insertHead(head, 20);\n    head = insertHead(head, 10);\n    printList(head);\n    return 0;\n}`,
                        explanation: 'Dynamic node allocation and pointer linking for singly linked lists.'
                    }
                ],
                aiSummary: {
                    summary: 'Explains singly, doubly, and circular linked list structures, node allocations, and pointer manipulations.',
                    keyConcepts: ['Dynamic Nodes', 'Pointer Linking', 'Insertion/Deletion', 'Singly vs Doubly Linked'],
                    revisionNotes: 'Linked lists allow O(1) insertions at the head without resizing, unlike contiguous arrays.'
                }
            },
            {
                orderIndex: 2,
                title: '3.2 Queues (Lab 3)',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 3.2 Queues (Lab 3)

#### 1. Queue Data Structure & FIFO Principle
A **Queue** is an ordered list in which all insertions take place at one end called the **rear**, and all deletions take place at the opposite end called the **front**.
* Follows **First-In, First-Out (FIFO)** discipline.

#### 2. Core Operations
* **\`enqueue(x)\`**: Inserts element \(x\) at rear.
* **\`dequeue()\`**: Removes element from front.
* **\`peek() / front()\`**: Examines front element.
* **\`isEmpty()\`**: Checks if queue has elements.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Linear Queue Implementation (Lab 3)',
                        code: `#include <stdio.h>\n#define MAX 50\n\ntypedef struct Queue {\n    int items[MAX];\n    int front;\n    int rear;\n} Queue;\n\nvoid initQueue(Queue *q) { q->front = 0; q->rear = -1; }\nint isEmpty(Queue *q) { return q->rear < q->front; }\n\nvoid enqueue(Queue *q, int val) {\n    if (q->rear == MAX - 1) { printf("Queue Full\\n"); return; }\n    q->items[++(q->rear)] = val;\n}\n\nint dequeue(Queue *q) {\n    if (isEmpty(q)) { printf("Queue Empty\\n"); return -1; }\n    return q->items[(q->front)++];\n}`,
                        explanation: 'Array queue demonstrating FIFO operations.'
                    }
                ],
                aiSummary: {
                    summary: 'Details FIFO queue mechanics, enqueue and dequeue operations, and basic linear implementation.',
                    keyConcepts: ['FIFO Paradigm', 'Front & Rear Pointers', 'Enqueue & Dequeue', 'Queue Underflow'],
                    revisionNotes: 'Simple array linear queues suffer from memory wastage when front advances forward.'
                }
            },
            {
                orderIndex: 3,
                title: '3.3 Circular queues',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 3.3 Circular Queues

#### 1. Overcoming Linear Queue Limitations
In a linear queue using arrays, once \`rear\` reaches \`MAX - 1\`, no new elements can be enqueued even if elements were dequeued from \`front\` (false overflow).
A **Circular Queue** solves this by connecting the last position back to the first position like a ring.

#### 2. Modulo Arithmetic Indexing
* **Next Rear Index**: \`(rear + 1) % CAPACITY\`
* **Next Front Index**: \`(front + 1) % CAPACITY\`
* **Full Condition**: \`(rear + 1) % CAPACITY == front\`
* **Empty Condition**: \`front == -1\` (or \`front == rear\`, depending on convention).`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Circular Queue Implementation in C',
                        code: `#include <stdio.h>\n#define SIZE 5\n\nint items[SIZE], front = -1, rear = -1;\n\nint isFull() {\n    return (rear + 1) % SIZE == front;\n}\nint isEmpty() {\n    return front == -1;\n}\n\nvoid enqueue(int val) {\n    if (isFull()) { printf("Circular Queue is Full\\n"); return; }\n    if (isEmpty()) front = 0;\n    rear = (rear + 1) % SIZE;\n    items[rear] = val;\n}\n\nint dequeue() {\n    if (isEmpty()) { printf("Circular Queue is Empty\\n"); return -1; }\n    int val = items[front];\n    if (front == rear) { front = rear = -1; } // Queue becomes empty\n    else { front = (front + 1) % SIZE; }\n    return val;\n}`,
                        explanation: 'Modulo arithmetic ring buffer circular queue in ANSI C.'
                    }
                ],
                aiSummary: {
                    summary: 'Addresses linear queue memory leakage using circular queues and modulo arithmetic.',
                    keyConcepts: ['Circular Buffer', 'Modulo Arithmetic', 'Ring Buffers', 'Full vs Empty Conditions'],
                    revisionNotes: 'Use (index + 1) % SIZE to wrap around indices seamlessly.'
                }
            }
        ],
        quiz: {
            title: 'Module 03 Quiz: Lists & Queues',
            passingScorePercent: 60,
            questions: [
                {
                    questionText: 'What is the formula to advance the rear pointer in a circular queue of size N?',
                    type: 'MCQ',
                    options: ['rear = (rear + 1) % N', 'rear = rear + 1', 'rear = (rear - 1) % N', 'rear = (rear + N) % 2'],
                    correctAnswer: 'rear = (rear + 1) % N',
                    explanation: 'Modulo arithmetic (rear + 1) % N enables wrapping back to index 0 when reaching the end of the array.'
                }
            ]
        }
    },
    {
        orderIndex: 4,
        title: 'Module 04: Recursion',
        description: 'Principles of recursion, base conditions and recursive call stacks, recurrence relations, Fibonacci sequence generation, and Backtracking paradigms (8-queen problem).',
        estimatedHours: 5,
        lessons: [
            {
                orderIndex: 1,
                title: '4.1 Simple recursion',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 4.1 Simple Recursion and Stack Mechanics

#### 1. Nature of Recursion
Recursion occurs when a function calls itself to solve smaller instances of the same problem.
Every well-formed recursive function requires two primary components:
1. **Base Case**: Condition under which recursion terminates without making further self-calls.
2. **Recursive Step**: Reduces problem size toward the base case.

#### 2. The Call Stack
Each recursive invocation pushes a new **Activation Record (Stack Frame)** containing local variables, parameters, and return address onto the system call stack.
Missing the base case causes an infinite recursion sequence resulting in a **Stack Overflow Error**.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Recursive Factorial in C',
                        code: `#include <stdio.h>\n\nlong long factorial(int n) {\n    if (n <= 1) return 1; // Base case\n    return n * factorial(n - 1); // Recursive step\n}\n\nint main() {\n    printf("5! = %lld\\n", factorial(5));\n    return 0;\n}`,
                        explanation: 'Classic recursion showing base case and recursive call.'
                    }
                ],
                aiSummary: {
                    summary: 'Introduces recursive logic, base condition necessity, and stack frame allocation.',
                    keyConcepts: ['Base Case', 'Recursive Step', 'Call Stack Frames', 'Stack Overflow'],
                    revisionNotes: 'Always formulate the base condition first to guarantee algorithm termination.'
                }
            },
            {
                orderIndex: 2,
                title: '4.2 Fibonacci numbers',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 4.2 Fibonacci Numbers & Recursion Trees

#### 1. Recursive Formulation
The Fibonacci sequence is defined mathematically as:
* \(F(0) = 0\)
* \(F(1) = 1\)
* \(F(n) = F(n-1) + F(n-2)\) for \(n \\ge 2\)

#### 2. The Exponential Recursion Tree
Naïve recursion computes identical subproblems multiple times (overlapping subproblems):
* Time Complexity: \(O(2^n)\) exponential growth.
* Recursion tree visualization highlights the rapid duplication of computation.
* Linear optimization \(O(n)\) is achieved via iteration or memoization (Dynamic Programming).`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Fibonacci Comparison: Recursive vs Iterative',
                        code: `#include <stdio.h>\n\n// Exponential O(2^n)\nint fibRecursive(int n) {\n    if (n <= 1) return n;\n    return fibRecursive(n - 1) + fibRecursive(n - 2);\n}\n\n// Linear O(n)\nint fibIterative(int n) {\n    if (n <= 1) return n;\n    int a = 0, b = 1, c;\n    for(int i = 2; i <= n; i++) {\n        c = a + b; a = b; b = c;\n    }\n    return b;\n}`,
                        explanation: 'Contrasts naive recursion with linear iteration for Fibonacci calculation.'
                    }
                ],
                aiSummary: {
                    summary: 'Analyzes Fibonacci sequence generation, recursion tree visualization, and exponential complexity.',
                    keyConcepts: ['Fibonacci Recurrence', 'Overlapping Subproblems', 'O(2^n) Complexity', 'Iterative vs Recursive'],
                    revisionNotes: 'Naive recursive Fibonacci suffers from exponential time due to duplicate subproblem evaluation.'
                }
            },
            {
                orderIndex: 3,
                title: '4.3 Backtracking: 8-queen problem',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### 4.3 Backtracking Paradigm & The 8-Queens Problem

#### 1. What is Backtracking?
Backtracking is an algorithmic paradigm for solving constraint satisfaction problems by systematically searching the **state-space tree**. When a partial candidate violates constraints, the algorithm abandons it ("backtracks") to the nearest decision point.

#### 2. The 8-Queens Problem
* **Goal**: Place 8 queens on an \(8 \\times 8\) chessboard such that no two queens attack each other (no two queens share the same row, column, or diagonal).
* **Approach**:
  1. Try placing a queen in column \(col\) row by row.
  2. For each row, check if position is safe from existing queens.
  3. If safe, mark queen placed and recurse for next column: \`solve(col + 1)\`.
  4. If next column leads to no solution, remove queen (**backtrack**) and try next row.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: '8-Queens Safety Check & Solver Skeleton',
                        code: `#include <stdio.h>\n#include <stdbool.h>\n#define N 8\n\nint board[N][N];\n\nbool isSafe(int row, int col) {\n    int i, j;\n    // Check row on left\n    for (i = 0; i < col; i++)\n        if (board[row][i]) return false;\n    // Check upper diagonal on left\n    for (i = row, j = col; i >= 0 && j >= 0; i--, j--)\n        if (board[i][j]) return false;\n    // Check lower diagonal on left\n    for (i = row, j = col; j >= 0 && i < N; i++, j--)\n        if (board[i][j]) return false;\n    return true;\n}`,
                        explanation: 'State validation function enforcing 8-Queens row and diagonal safety constraints.'
                    }
                ],
                aiSummary: {
                    summary: 'Explores the backtracking technique, state space pruning, and solving the classic 8-Queens puzzle.',
                    keyConcepts: ['Backtracking Paradigm', 'State-Space Tree', 'Constraint Pruning', '8-Queens Safety'],
                    revisionNotes: 'Backtracking prunes entire branches of invalid candidates early, saving massive computation over brute force.'
                }
            }
        ],
        quiz: {
            title: 'Module 04 Quiz: Recursion & Backtracking',
            passingScorePercent: 60,
            questions: [
                {
                    questionText: 'What happens when a recursive function fails to reach its base condition?',
                    type: 'MCQ',
                    options: ['Stack Overflow Error', 'CPU Underclock', 'Array Index Error', 'Memory Zeroing'],
                    correctAnswer: 'Stack Overflow Error',
                    explanation: 'Unbounded recursive invocations continuously consume stack frames until stack memory is exhausted.'
                }
            ]
        }
    },
    {
        orderIndex: 5,
        title: 'Module 05: Searching Algorithms',
        description: 'Linear sequential search, Divide-and-Conquer Binary Search (Lab 4), and Order Statistics Quickselect.',
        estimatedHours: 4,
        lessons: [
            {
                orderIndex: 1,
                title: '5.1 Linear search',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 5.1 Linear Search (Sequential Search)

#### 1. Linear Search Principle
Linear search traverses the array sequentially from the first element to the last element, comparing each item with the target value until a match is found or the end of the array is reached.
* Unsorted collections: Works on arbitrary, unsorted datasets.
* Best Case: \(O(1)\) when the target is at index 0.
* Worst Case: \(O(n)\) when the target is at the final index or not present.

#### 2. Sentinel Optimization
A sentinel value placed at the end of the array avoids bounds checking inside the loop (\`i < n\`), reducing constant loop overhead.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Linear Search in C',
                        code: `#include <stdio.h>\n\nint linearSearch(int arr[], int n, int target) {\n    for (int i = 0; i < n; i++) {\n        if (arr[i] == target) return i; // Target found\n    }\n    return -1; // Target not found\n}\n\nint main() {\n    int arr[] = {42, 18, 9, 73, 25};\n    int n = sizeof(arr)/sizeof(arr[0]);\n    int idx = linearSearch(arr, n, 73);\n    printf("Target found at index: %d\\n", idx);\n    return 0;\n}`,
                        explanation: 'Sequential O(n) scan returning target index or -1.'
                    }
                ],
                aiSummary: {
                    summary: 'Details linear search mechanics, worst-case linear O(n) performance, and applicability to unsorted data.',
                    keyConcepts: ['Sequential Scan', 'Unsorted Data', 'Linear Time O(n)', 'Early Exit'],
                    revisionNotes: 'Linear search requires no preprocessing and operates on any collection in O(n) time.'
                }
            },
            {
                orderIndex: 2,
                title: '5.2 Binary search (Lab 4)',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 5.2 Binary Search (Lab 4)

#### 1. Binary Search Principle
Binary search is an efficient search algorithm on **sorted arrays** using the divide-and-conquer paradigm.
* Compares target with middle element:
  * If target matches middle, search succeeds.
  * If target is less than middle, search left half.
  * If target is greater than middle, search right half.

#### 2. Complexity
* **Time Complexity**: \(O(\\log n)\) logarithmic time.
* **Space Complexity**: \(O(1)\) for iterative implementation.
* Note on overflow: compute mid as \`low + (high - low) / 2\` to avoid integer overflow.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Iterative Binary Search in C (Lab 4)',
                        code: `#include <stdio.h>\n\nint binarySearch(int arr[], int n, int target) {\n    int low = 0, high = n - 1;\n    while(low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}\n\nint main() {\n    int arr[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};\n    int n = sizeof(arr)/sizeof(arr[0]);\n    int idx = binarySearch(arr, n, 23);\n    printf("Target 23 found at index: %d\\n", idx);\n    return 0;\n}`,
                        explanation: 'Iterative O(log n) binary search with safe midpoint calculation.'
                    }
                ],
                aiSummary: {
                    summary: 'Explains binary search algorithm, logarithmic time complexity, precondition of sorted data, and Lab 4 implementation.',
                    keyConcepts: ['Divide and Conquer', 'Logarithmic Time O(log n)', 'Preconditioned Sorting', 'Integer Overflow Prevention'],
                    revisionNotes: 'Midpoint calculation: use low + (high - low) / 2 to avoid overflow when low + high exceeds integer max.'
                }
            },
            {
                orderIndex: 3,
                title: '5.3 Quickselect',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 5.3 Quickselect (Order Statistics Search)

#### 1. Problem Statement
Given an unsorted array of \(n\) elements, find the **k-th smallest** (or k-th largest) element without sorting the entire array.

#### 2. Quickselect Algorithm
* Uses the partition step from Quicksort.
* If pivot lands at index \(k\), the k-th element is found!
* If \(k < pivotIndex\), recurse **only on left partition**.
* If \(k > pivotIndex\), recurse **only on right partition**.

#### 3. Complexity
* **Average Case Time**: \(O(n)\) linear time! (Because \(n + n/2 + n/4 + \\dots = 2n\)).
* **Worst Case Time**: \(O(n^2)\).`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Quickselect in C',
                        code: `#include <stdio.h>\n\nint partition(int arr[], int l, int r);\n\nint quickselect(int arr[], int l, int r, int k) {\n    if (k > 0 && k <= r - l + 1) {\n        int index = partition(arr, l, r);\n        if (index - l == k - 1) return arr[index];\n        if (index - l > k - 1) return quickselect(arr, l, index - 1, k);\n        return quickselect(arr, index + 1, r, k - index + l - 1);\n    }\n    return -1;\n}`,
                        explanation: 'One-sided recursive selection achieving O(n) average-case time.'
                    }
                ],
                aiSummary: {
                    summary: 'Details Quickselect for finding the k-th order statistic in O(n) average time without full sorting.',
                    keyConcepts: ['Order Statistics', 'k-th Smallest Element', 'One-Sided Recurrence', 'Linear Average Time O(n)'],
                    revisionNotes: 'Quickselect discards one partition completely at each step, yielding average O(n) linear performance.'
                }
            }
        ],
        quiz: {
            title: 'Module 05 Quiz: Searching Algorithms',
            passingScorePercent: 60,
            questions: [
                {
                    questionText: 'What is the precondition for executing Binary Search on an array?',
                    type: 'MCQ',
                    options: ['Array must be sorted', 'Array must have prime size', 'Array elements must be unique', 'Array must be stored on heap'],
                    correctAnswer: 'Array must be sorted',
                    explanation: 'Binary search divides the search space in half based on sorted order.'
                },
                {
                    questionText: 'What is the average time complexity of Quickselect for finding the k-th smallest element?',
                    type: 'MCQ',
                    options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n^2)'],
                    correctAnswer: 'O(n)',
                    explanation: 'Because Quickselect recurses on only one partition, average work is n + n/2 + n/4 ... = O(n).'
                }
            ]
        }
    },
    {
        orderIndex: 6,
        title: 'Module 06: Sorting Algorithms',
        description: 'Comparison-based sorting paradigms: Selection sort, Insertion sort, Mergesort, and Quicksort (Lab 5).',
        estimatedHours: 6,
        lessons: [
            {
                orderIndex: 1,
                title: '6.1 Selection sort',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 6.1 Selection Sort

#### 1. Algorithm Concept
Selection sort repeatedly finds the minimum element from the unsorted partition and places it at the beginning of the sorted partition.
* Simple and in-place comparison sort.
* Number of swaps is at most \(n - 1\).

#### 2. Complexity & Characteristics
* **Time Complexity**: \(O(n^2)\) in Best, Worst, and Average cases.
* **Space Complexity**: \(O(1)\) Auxiliary space.
* **Stability**: Unstable in its standard implementation.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Selection Sort in C',
                        code: `#include <stdio.h>\n\nvoid selectionSort(int arr[], int n) {\n    for(int i = 0; i < n - 1; i++) {\n        int minIdx = i;\n        for(int j = i + 1; j < n; j++) {\n            if (arr[j] < arr[minIdx]) minIdx = j;\n        }\n        if (minIdx != i) {\n            int temp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = temp;\n        }\n    }\n}`,
                        explanation: 'In-place selection sort finding minimum element in each pass.'
                    }
                ],
                aiSummary: {
                    summary: 'Details selection sort mechanism, quadratic runtime, and minimal memory swaps.',
                    keyConcepts: ['Selection of Minimum', 'O(n^2) Complexity', 'In-Place Sorting', 'At Most O(n) Swaps'],
                    revisionNotes: 'Selection sort makes O(n^2) comparisons regardless of initial array ordering.'
                }
            },
            {
                orderIndex: 2,
                title: '6.2 Insertion sort',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 6.2 Insertion Sort

#### 1. Algorithm Concept
Insertion sort works similarly to the way you sort playing cards in your hands. Elements are consumed one by one, shifting larger elements to the right to make room for insertion.

#### 2. Complexity & Adaptiveness
* **Best Case (Already Sorted)**: \(O(n)\) linear time!
* **Worst / Average Case**: \(O(n^2)\) time.
* **Space Complexity**: \(O(1)\) in-place.
* **Stability**: Stable. Excellent for small datasets (\(n < 30\)) or nearly sorted arrays.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Insertion Sort in C',
                        code: `#include <stdio.h>\n\nvoid insertionSort(int arr[], int n) {\n    for(int i = 1; i < n; i++) {\n        int key = arr[i];\n        int j = i - 1;\n        while(j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n        arr[j + 1] = key;\n    }\n}`,
                        explanation: 'Adaptive insertion sort shifting elements rightward to insert key in sorted sub-array.'
                    }
                ],
                aiSummary: {
                    summary: 'Explains adaptive insertion sort, linear best-case behavior on nearly-sorted data, and stability.',
                    keyConcepts: ['Adaptive Sorting', 'O(n) Best Case', 'Stable Sorting', 'In-Place Insertion'],
                    revisionNotes: 'Insertion sort is the fastest algorithm for very small or nearly sorted collections.'
                }
            },
            {
                orderIndex: 3,
                title: '6.3 Mergesort',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### 6.3 Merge Sort

#### 1. Divide and Conquer Strategy
Merge sort recursively divides the input array into two equal halves, sorts each half recursively, and merges the two sorted halves back together.
* Recurrence Relation: \(T(n) = 2T(n/2) + \\Theta(n)\)
* By Master Theorem: \(T(n) = \\Theta(n \\log n)\) across all cases (Best, Average, Worst).

#### 2. Characteristics
* **Time Complexity**: Guaranteed \(O(n \\log n)\).
* **Space Complexity**: \(O(n)\) auxiliary memory for buffer merging.
* **Stability**: Stable sorting algorithm. Preferred for linked lists and external sorting.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Merge Routine in C',
                        code: `#include <stdio.h>\n#include <stdlib.h>\n\nvoid merge(int arr[], int l, int m, int r) {\n    int n1 = m - l + 1, n2 = r - m;\n    int *L = (int*)malloc(sizeof(int)*n1);\n    int *R = (int*)malloc(sizeof(int)*n2);\n    for(int i = 0; i < n1; i++) L[i] = arr[l + i];\n    for(int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];\n    int i = 0, j = 0, k = l;\n    while(i < n1 && j < n2) {\n        if (L[i] <= R[j]) arr[k++] = L[i++];\n        else arr[k++] = R[j++];\n    }\n    while(i < n1) arr[k++] = L[i++];\n    while(j < n2) arr[k++] = R[j++];\n    free(L); free(R);\n}`,
                        explanation: 'Two-way merge function combining two sorted sub-arrays into arr.'
                    }
                ],
                aiSummary: {
                    summary: 'Covers merge sort divide-and-conquer strategy, recurrence relations, and guaranteed O(n log n) runtime.',
                    keyConcepts: ['Divide and Conquer', 'Two-Way Merging', 'Guaranteed O(n log n)', 'Auxiliary Memory O(n)'],
                    revisionNotes: 'Merge sort provides guaranteed O(n log n) runtime but requires O(n) extra space for array merging.'
                }
            },
            {
                orderIndex: 4,
                title: '6.4 Quicksort (Lab 5)',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### 6.4 Quicksort (Lab 5)

#### 1. Partitioning Strategy
Quicksort is an in-place divide-and-conquer algorithm. It picks an element as **pivot** and partitions the array around the pivot such that:
* Elements smaller than pivot lie to the left.
* Elements greater than pivot lie to the right.
* The pivot reaches its final sorted index.

#### 2. Complexity Analysis
* **Average Case**: \(O(n \\log n)\) with extremely small constant factors.
* **Worst Case**: \(O(n^2)\) when pivot is consistently the extreme element (mitigated by randomized pivot or median-of-three).
* **Space Complexity**: \(O(\\log n)\) auxiliary stack space for recursion.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Quicksort Lomuto Partition Implementation (Lab 5)',
                        code: `#include <stdio.h>\n\nvoid swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }\n\nint partition(int arr[], int low, int high) {\n    int pivot = arr[high];\n    int i = low - 1;\n    for(int j = low; j < high; j++) {\n        if (arr[j] < pivot) {\n            i++;\n            swap(&arr[i], &arr[j]);\n        }\n    }\n    swap(&arr[i + 1], &arr[high]);\n    return i + 1;\n}\n\nvoid quickSort(int arr[], int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}`,
                        explanation: 'Lomuto partition scheme and recursive quicksort implementation in ANSI C.'
                    }
                ],
                aiSummary: {
                    summary: 'Explores quicksort algorithm, partition schemes (Lomuto/Hoare), pivot selection, and Lab 5 implementation.',
                    keyConcepts: ['In-Place Partitioning', 'Pivot Selection', 'Average O(n log n)', 'Stack Space O(log n)'],
                    revisionNotes: 'Quicksort is typically faster in practice than mergesort due to excellent CPU cache locality.'
                }
            }
        ],
        quiz: {
            title: 'Module 06 Quiz: Sorting Algorithms',
            passingScorePercent: 60,
            questions: [
                {
                    questionText: 'Which sorting algorithm has a guaranteed worst-case time complexity of O(n log n)?',
                    type: 'MCQ',
                    options: ['Merge Sort', 'Quick Sort', 'Insertion Sort', 'Selection Sort'],
                    correctAnswer: 'Merge Sort',
                    explanation: 'Merge sort always divides into halves and merges in linear time, guaranteeing O(n log n) in all cases.'
                }
            ]
        }
    },
    {
        orderIndex: 7,
        title: 'Module 07: Graph Theory',
        description: 'Comprehensive graph representations, tree structures, binary trees, binary search trees (BST), priority queues, heaps, Trie, Kruskal\'s MST, Dijkstra, Floyd-Warshall, BFS/DFS, AVL, B-trees, and threaded trees.',
        estimatedHours: 12,
        lessons: [
            {
                orderIndex: 1,
                title: '6.1 Graphs',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 6.1 Graph Fundamentals & Representations

#### 1. Definitions
A Graph \(G = (V, E)\) consists of a set of vertices (nodes) \(V\) and a set of edges \(E\) connecting pairs of vertices.
* Directed vs Undirected.
* Weighted vs Unweighted.
* Dense vs Sparse graphs.

#### 2. Graph Representations in C
* **Adjacency Matrix**: A \(2D\) array of size \(V \\times V\).
  * Fast edge lookup: \(O(1)\).
  * Space complexity: \(O(V^2)\), ideal for dense graphs.
* **Adjacency List**: An array of \(V\) linked lists.
  * Space complexity: \(O(V + E)\), ideal for sparse graphs.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Adjacency Matrix in ANSI C',
                        code: `#include <stdio.h>\n#define V 4\n\nvoid addEdge(int adj[V][V], int u, int v) {\n    adj[u][v] = 1;\n    adj[v][u] = 1;\n}\n\nint main() {\n    int adj[V][V] = {0};\n    addEdge(adj, 0, 1);\n    addEdge(adj, 1, 2);\n    printf("Edge (0,1) exists: %d\\n", adj[0][1]);\n    return 0;\n}`,
                        explanation: 'Adjacency matrix representation for undirected graph.'
                    }
                ],
                aiSummary: {
                    summary: 'Introduces graph theory definitions, directed vs undirected graphs, and Adjacency Matrix vs Adjacency List representations.',
                    keyConcepts: ['Vertices & Edges', 'Adjacency Matrix O(V^2)', 'Adjacency List O(V+E)', 'Sparse vs Dense'],
                    revisionNotes: 'Choose adjacency list for sparse graphs where E << V^2 to save significant memory.'
                }
            },
            {
                orderIndex: 2,
                title: '6.2 Simple trees',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 6.2 Simple Trees & Terminology

#### 1. Tree Definition
A **Tree** is a connected, acyclic undirected graph with \(N\) vertices and exactly \(N - 1\) edges.
* Hierarchical structure with a single designated **Root** node.

#### 2. Key Terminology
* **Parent & Child**: Direct predecessor and successor in hierarchy.
* **Leaf Node**: Node with degree 0 (no children).
* **Depth of a Node**: Number of edges on path from root to that node.
* **Height of Tree**: Maximum depth among all nodes.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Generic Tree Node in C',
                        code: `typedef struct TreeNode {\n    int val;\n    struct TreeNode **children;\n    int numChildren;\n} TreeNode;`,
                        explanation: 'Multi-way tree node representation in C.'
                    }
                ],
                aiSummary: {
                    summary: 'Explains tree definitions, hierarchical relationships, depth, height, and leaf nodes.',
                    keyConcepts: ['Acyclic Hierarchical Graph', 'Root & Leaf Nodes', 'Height & Depth', 'N-1 Edges for N Nodes'],
                    revisionNotes: 'Any connected graph with N nodes and N-1 edges is a valid tree.'
                }
            },
            {
                orderIndex: 3,
                title: '6.3 Heaps, heapsort (Lab 6)',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### 6.3 Heaps and Heapsort (Lab 6)

#### 1. Binary Heap Concept
A **Binary Heap** is a complete binary tree stored compactly in an array:
* For element at index \(i\):
  * Left child: \(2i + 1\)
  * Right child: \(2i + 2\)
  * Parent: \((i - 1) / 2\)
* **Max-Heap Property**: Parent key \(\\ge\) Children keys.
* **Min-Heap Property**: Parent key \(\\le\) Children keys.

#### 2. Heapify & Heapsort Algorithm
* **\`heapify\`**: Sifts element down in \(O(\\log n)\) time.
* **Build-Heap**: Converts arbitrary array to heap in \(O(n)\) time.
* **Heapsort**: Repeatedly swaps root with last element and reduces heap size, sorting in \(O(n \\log n)\) guaranteed in-place time without extra memory!`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Heapify and Heapsort in C (Lab 6)',
                        code: `#include <stdio.h>\n\nvoid swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }\n\nvoid heapify(int arr[], int n, int i) {\n    int largest = i;\n    int l = 2 * i + 1, r = 2 * i + 2;\n    if (l < n && arr[l] > arr[largest]) largest = l;\n    if (r < n && arr[r] > arr[largest]) largest = r;\n    if (largest != i) {\n        swap(&arr[i], &arr[largest]);\n        heapify(arr, n, largest);\n    }\n}\n\nvoid heapSort(int arr[], int n) {\n    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);\n    for (int i = n - 1; i > 0; i--) {\n        swap(&arr[0], &arr[i]);\n        heapify(arr, i, 0);\n    }\n}`,
                        explanation: 'Array-backed complete binary tree heapsort in ANSI C.'
                    }
                ],
                aiSummary: {
                    summary: 'Details Binary Heaps, array index relations, O(n) build-heap, and O(n log n) in-place Heapsort for Lab 6.',
                    keyConcepts: ['Complete Binary Tree', 'Max/Min Heap Property', 'O(log n) Heapify', 'O(n log n) In-Place Sorting'],
                    revisionNotes: 'Heapsort requires no additional memory (O(1) extra space), unlike mergesort.'
                }
            },
            {
                orderIndex: 4,
                title: '6.4 Priority queues',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 6.4 Priority Queues

#### 1. What is a Priority Queue?
A **Priority Queue** is an ADT where each element has an associated priority. Elements with higher priority are dequeued before elements with lower priority.

#### 2. Implementations
* **Unsorted Array**: Insert \(O(1)\), Extract-Min \(O(n)\).
* **Sorted Array**: Insert \(O(n)\), Extract-Min \(O(1)\).
* **Binary Heap**: Both Insert and Extract-Min run in \(O(\\log n)\). This is the standard efficient implementation.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Priority Queue Heap Operations',
                        code: `// insert: appends to bottom and siftUp O(log n)\n// extractMax: swaps root with last element and heapify O(log n)`,
                        explanation: 'Logarithmic priority queue operations via binary heap.'
                    }
                ],
                aiSummary: {
                    summary: 'Explains Priority Queue ADT, comparison of underlying data structures, and binary heap backing.',
                    keyConcepts: ['Priority Queue ADT', 'extractMin / extractMax', 'Logarithmic Operations O(log n)'],
                    revisionNotes: 'Binary heaps achieve the optimal balance of O(log n) insertions and extractions.'
                }
            },
            {
                orderIndex: 5,
                title: '6.5 Binary trees, n-ary trees',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 6.5 Binary Trees and N-ary Trees

#### 1. Binary Tree Types
* **Full Binary Tree**: Every node has 0 or 2 children.
* **Complete Binary Tree**: All levels filled except possibly the last, which is filled from left to right.
* **Perfect Binary Tree**: All internal nodes have 2 children, all leaves are at same depth.

#### 2. N-ary Trees & Left-Child Right-Sibling Representation
An N-ary tree can be represented using binary tree pointers via:
* \`left\`: Points to first child.
* \`right\`: Points to next sibling.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Left-Child Right-Sibling Node',
                        code: `typedef struct LCRSNode {\n    int val;\n    struct LCRSNode *firstChild;\n    struct LCRSNode *nextSibling;\n} LCRSNode;`,
                        explanation: 'Converting any n-ary tree to binary node format.'
                    }
                ],
                aiSummary: {
                    summary: 'Covers full, complete, and perfect binary trees, plus the Left-Child Right-Sibling representation for N-ary trees.',
                    keyConcepts: ['Full vs Complete vs Perfect', 'Binary Trees', 'N-ary Trees', 'Left-Child Right-Sibling'],
                    revisionNotes: 'Left-Child Right-Sibling enables representing arbitrary n-ary trees using only two pointers per node.'
                }
            },
            {
                orderIndex: 6,
                title: '6.6 Binary search trees (Lab 7)',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### 6.6 Binary Search Trees (BST) (Lab 7)

#### 1. The BST Property
For every node \(x\) in a Binary Search Tree:
* All keys in left subtree of \(x\) are \(< x.key\).
* All keys in right subtree of \(x\) are \(> x.key\).

#### 2. BST Operations
* **Search**: Compare key with root and branch left or right: \(O(h)\).
* **Insert**: Traverse to correct leaf location and link new node: \(O(h)\).
* **Delete**:
  * Case 1: Node is a leaf -> delete directly.
  * Case 2: Node has one child -> link parent to child.
  * Case 3: Node has two children -> replace with **Inorder Successor** (smallest in right subtree) and delete successor.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'BST Insertion and Search in C (Lab 7)',
                        code: `#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct BSTNode {\n    int key;\n    struct BSTNode *left, *right;\n} BSTNode;\n\nBSTNode* insert(BSTNode *root, int key) {\n    if (root == NULL) {\n        BSTNode *node = (BSTNode*)malloc(sizeof(BSTNode));\n        node->key = key; node->left = node->right = NULL;\n        return node;\n    }\n    if (key < root->key) root->left = insert(root->left, key);\n    else if (key > root->key) root->right = insert(root->right, key);\n    return root;\n}`,
                        explanation: 'Recursive BST insertion adhering to binary search invariant.'
                    }
                ],
                aiSummary: {
                    summary: 'Details BST invariants, search, insertion, and three-case deletion algorithms for Lab 7.',
                    keyConcepts: ['BST Invariant', 'Inorder Successor', 'Three Deletion Cases', 'O(h) Height Complexity'],
                    revisionNotes: 'Inorder traversal of any valid BST yields keys in strictly sorted ascending order.'
                }
            },
            {
                orderIndex: 7,
                title: '6.7 Traversals',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 6.7 Tree Traversals: DFS and BFS

#### 1. Depth-First Traversals (DFS)
* **Inorder (Left, Root, Right)**: Yields sorted keys in a BST.
* **Preorder (Root, Left, Right)**: Useful for copying or serializing trees.
* **Postorder (Left, Right, Root)**: Useful for deleting or freeing trees bottom-up.

#### 2. Breadth-First Traversal (BFS / Level-Order)
Visits nodes level by level from top to bottom, left to right, implemented using a FIFO Queue.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Three DFS Traversals in C',
                        code: `void inorder(BSTNode *r) { if(r) { inorder(r->left); printf("%d ", r->key); inorder(r->right); } }\nvoid preorder(BSTNode *r) { if(r) { printf("%d ", r->key); preorder(r->left); preorder(r->right); } }\nvoid postorder(BSTNode *r) { if(r) { postorder(r->left); postorder(r->right); printf("%d ", r->key); } }`,
                        explanation: 'Recursive implementations of Preorder, Inorder, and Postorder tree traversals.'
                    }
                ],
                aiSummary: {
                    summary: 'Explains depth-first (Inorder, Preorder, Postorder) and breadth-first level-order traversals.',
                    keyConcepts: ['Inorder (Sorted order)', 'Preorder Serialization', 'Postorder Destruction', 'BFS Level-Order Queue'],
                    revisionNotes: 'Postorder visits children before parents, making it ideal for free() deallocation of trees.'
                }
            },
            {
                orderIndex: 8,
                title: '6.8 Trie tree (Lab 8)',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### 6.8 Trie Tree (Prefix Tree) (Lab 8)

#### 1. What is a Trie?
A **Trie** is a specialized tree-based data structure used to store an associative collection of strings where keys are usually sequences of characters.
* Every node contains an array of child pointers (e.g., 26 for English lowercase letters) and a boolean flag \`isEndOfWord\`.
* Common prefixes are shared along paths from the root.

#### 2. Complexity
* Search / Insert time: \(O(L)\), where \(L\) is the length of the string, completely independent of the number of words stored!
* Ideal for autocomplete, spelling checkers, and IP routing tables.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Trie Node Definition and Insertion (Lab 8)',
                        code: `#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n#define ALPHABET_SIZE 26\n\ntypedef struct TrieNode {\n    struct TrieNode *children[ALPHABET_SIZE];\n    bool isEndOfWord;\n} TrieNode;\n\nTrieNode* createNode() {\n    TrieNode *node = (TrieNode*)malloc(sizeof(TrieNode));\n    node->isEndOfWord = false;\n    for(int i = 0; i < ALPHABET_SIZE; i++) node->children[i] = NULL;\n    return node;\n}`,
                        explanation: 'Trie node initialization with 26-character alphabet array.'
                    }
                ],
                aiSummary: {
                    summary: 'Covers Trie prefix trees, shared prefix node structures, and O(L) search/insert mechanics for Lab 8.',
                    keyConcepts: ['Prefix Tree', 'Alphabet Pointers', 'O(L) String Lookup', 'Autocomplete & Dictionaries'],
                    revisionNotes: 'Trie lookup depends strictly on the word length L, never on dictionary size N.'
                }
            },
            {
                orderIndex: 9,
                title: '6.9 Kruskal’s MST using disjoint sets',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### 6.9 Kruskal's Minimum Spanning Tree Algorithm

#### 1. Minimum Spanning Tree (MST)
An MST of a connected, weighted, undirected graph is a spanning subgraph that connects all vertices together with minimum possible total edge weight, with no cycles.

#### 2. Kruskal's Greedy Algorithm
1. Sort all edges in non-decreasing order of weight.
2. Initialize each vertex into its own disjoint set.
3. Iterate through sorted edges:
   * If endpoints \(u\) and \(v\) belong to different sets: add edge to MST and merge their sets via \`union\`.
   * If \(u\) and \(v\) are already in the same set: discard edge (adding it would create a cycle).
4. Terminate when MST contains exactly \(V - 1\) edges.
* Complexity: \(O(E \\log E)\) due to edge sorting.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Kruskal Algorithm Overview',
                        code: `// 1. qsort(edges, E, sizeof(Edge), edgeCompare);\n// 2. For each edge (u, v): if (find(u) != find(v)) { add_to_mst(); union(u, v); }`,
                        explanation: 'Greedy edge scanning with Disjoint Set Union cycle check.'
                    }
                ],
                aiSummary: {
                    summary: 'Details Kruskal greedy algorithm for Minimum Spanning Tree using Disjoint Set Union for cycle detection.',
                    keyConcepts: ['Minimum Spanning Tree', 'Greedy Edge Sorting', 'Cycle Detection via DSU', 'O(E log E) Complexity'],
                    revisionNotes: 'An MST on a graph with V vertices always consists of exactly V - 1 edges.'
                }
            },
            {
                orderIndex: 10,
                title: '6.10 Dijkstra\'s Algorithm',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### 6.10 Dijkstra's Single-Source Shortest Path Algorithm

#### 1. Problem Definition
Find the shortest path from a starting source vertex to all other vertices in a weighted graph with **non-negative edge weights**.

#### 2. Algorithm
1. Initialize distance to source as \(0\), and all other distances as \(\\infty\).
2. Insert all vertices into a Min-Priority Queue keyed by distance.
3. While queue is not empty:
   * Extract vertex \(u\) with minimum distance.
   * For each neighbor \(v\) of \(u\):
     * **Edge Relaxation**: If \(dist[u] + weight(u, v) < dist[v]\), update \(dist[v] = dist[u] + weight(u, v)\).
* Complexity with Min-Heap: \(O((V + E) \\log V)\).`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Edge Relaxation Step in C',
                        code: `void relax(int u, int v, int weight) {\n    if (dist[u] != 1e9 && dist[u] + weight < dist[v]) {\n        dist[v] = dist[u] + weight;\n        parent[v] = u;\n    }\n}`,
                        explanation: 'Standard relaxation condition reducing shortest-path estimates.'
                    }
                ],
                aiSummary: {
                    summary: 'Covers Dijkstra greedy shortest-path algorithm, distance relaxation, and priority queue optimization.',
                    keyConcepts: ['Single-Source Shortest Path', 'Non-Negative Weights', 'Distance Relaxation', 'Min-Heap O((V+E) log V)'],
                    revisionNotes: 'Dijkstra fails on graphs with negative edge weights; use Bellman-Ford instead in such cases.'
                }
            },
            {
                orderIndex: 11,
                title: '6.11 Disjoint sets (Lab 9)',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 6.11 Disjoint Sets (Union-Find) (Lab 9)

#### 1. Disjoint Set Union (DSU) ADT
Maintains a collection of disjoint dynamic sets. Each set is identified by a representative element.
* **\`makeSet(x)\`**: Creates set with element \(x\).
* **\`find(x)\`**: Returns representative root of set containing \(x\).
* **\`union(x, y)\`**: Merges sets containing \(x\) and \(y\).

#### 2. Two Crucial Optimizations
* **Path Compression**: Flatten tree structure during \`find\`, pointing visited nodes directly to root.
* **Union by Rank**: Always attach smaller height tree under root of taller tree.
* Amortized complexity per operation is nearly constant: \(O(\\alpha(n))\) using inverse Ackermann function.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'DSU with Path Compression & Union by Rank (Lab 9)',
                        code: `#include <stdio.h>\n#define N 100\nint parent[N], rankArr[N];\n\nvoid makeSet(int n) {\n    for(int i = 0; i < n; i++) { parent[i] = i; rankArr[i] = 0; }\n}\n\nint find(int x) {\n    if (parent[x] != x) parent[x] = find(parent[x]); // Path compression\n    return parent[x];\n}\n\nvoid unionSets(int x, int y) {\n    int rootX = find(x), rootY = find(y);\n    if (rootX != rootY) {\n        if (rankArr[rootX] < rankArr[rootY]) parent[rootX] = rootY;\n        else if (rankArr[rootX] > rankArr[rootY]) parent[rootY] = rootX;\n        else { parent[rootY] = rootX; rankArr[rootX]++; }\n    }\n}`,
                        explanation: 'Ultra-fast Union-Find implementation with path compression and union by rank.'
                    }
                ],
                aiSummary: {
                    summary: 'Details Union-Find Disjoint Set data structure, path compression, and union by rank for Lab 9.',
                    keyConcepts: ['Disjoint Sets', 'Path Compression', 'Union by Rank', 'Inverse Ackermann O(alpha(n))'],
                    revisionNotes: 'Path compression flattens the tree during find, achieving near-constant time operations.'
                }
            },
            {
                orderIndex: 12,
                title: '6.12 Floyd-Warshall\'s algorithm (Lab 10)',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### 6.12 Floyd-Warshall's All-Pairs Shortest Path (Lab 10)

#### 1. Problem Statement
Find shortest path distances between **every pair of vertices** in a directed/undirected weighted graph.

#### 2. Dynamic Programming Formulation
Let \(dist[i][j]\) be the shortest distance from vertex \(i\) to vertex \(j\) using intermediate vertices in subset \(\\{1, 2, \\dots, k\\}\).
* Recurrence:
  \`dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])\`
* Triple nested loop iterating \(k\), then \(i\), then \(j\).
* Complexity: \(\\Theta(V^3)\) time and \(\\Theta(V^2)\) space.
* Can detect negative weight cycles if any diagonal \(dist[i][i] < 0\).`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Floyd-Warshall Algorithm in C (Lab 10)',
                        code: `#include <stdio.h>\n#define V 4\n#define INF 99999\n\nvoid floydWarshall(int graph[V][V]) {\n    int dist[V][V];\n    for(int i = 0; i < V; i++)\n        for(int j = 0; j < V; j++) dist[i][j] = graph[i][j];\n\n    for (int k = 0; k < V; k++) {\n        for (int i = 0; i < V; i++) {\n            for (int j = 0; j < V; j++) {\n                if (dist[i][k] + dist[k][j] < dist[i][j])\n                    dist[i][j] = dist[i][k] + dist[k][j];\n            }\n        }\n    }\n}`,
                        explanation: 'Dynamic programming matrix update for all-pairs shortest paths.'
                    }
                ],
                aiSummary: {
                    summary: 'Explains Floyd-Warshall dynamic programming algorithm for all-pairs shortest paths in O(V^3) time (Lab 10).',
                    keyConcepts: ['All-Pairs Shortest Path', 'Dynamic Programming', 'O(V^3) Complexity', 'Negative Cycle Detection'],
                    revisionNotes: 'The outermost loop index k represents the allowed intermediate vertex.'
                }
            },
            {
                orderIndex: 13,
                title: '6.13 BFS and DFS searches (Lab 11)',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### 6.13 BFS and DFS Searches (Lab 11)

#### 1. Breadth-First Search (BFS)
* Explores vertex neighbors before going deeper.
* Implemented using a FIFO **Queue** and boolean \`visited\` array.
* Computes shortest path on unweighted graphs!
* Complexity: \(O(V + E)\).

#### 2. Depth-First Search (DFS)
* Explores as deep as possible along each branch before backtracking.
* Implemented using recursion or an explicit **Stack**.
* Used for topological sorting, cycle detection, and strongly connected components.
* Complexity: \(O(V + E)\).`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Recursive DFS in C (Lab 11)',
                        code: `#include <stdio.h>\n#include <stdbool.h>\n#define V 5\n\nbool visited[V];\nvoid DFS(int adj[V][V], int u) {\n    visited[u] = true;\n    printf("%d ", u);\n    for(int v = 0; v < V; v++) {\n        if (adj[u][v] && !visited[v]) DFS(adj, v);\n    }\n}`,
                        explanation: 'Depth-first search traversing graph with boolean visited tracking.'
                    }
                ],
                aiSummary: {
                    summary: 'Details graph exploration algorithms: BFS using Queue and DFS using Stack/Recursion for Lab 11.',
                    keyConcepts: ['Breadth-First Search (Queue)', 'Depth-First Search (Stack)', 'O(V+E) Complexity', 'Shortest Unweighted Path'],
                    revisionNotes: 'BFS finds the shortest path in unweighted graphs; DFS is ideal for topological sorting and cycle checks.'
                }
            },
            {
                orderIndex: 14,
                title: '6.14 AVL trees, B-trees',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### 6.14 Balanced Trees: AVL Trees & B-Trees

#### 1. AVL Trees (Self-Balancing BST)
* For every node, height difference between left and right subtrees (Balance Factor) must be \(-1, 0,\) or \(+1\).
* Rebalances after insertion/deletion using **Rotations**:
  * Single Rotations: LL (Left-Left), RR (Right-Right).
  * Double Rotations: LR (Left-Right), RL (Right-Left).
* Guarantees strict \(O(\\log n)\) search, insert, and delete.

#### 2. B-Trees (Multi-Way Search Trees)
* Self-balancing search tree where nodes can have multiple keys and more than two children.
* Optimized for systems reading/writing large blocks of memory (Disk storage, DBMS indexing).`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'AVL Right Rotation (RR Fix)',
                        code: `AVLNode* rightRotate(AVLNode *y) {\n    AVLNode *x = y->left;\n    AVLNode *T2 = x->right;\n    x->right = y;\n    y->left = T2;\n    y->height = 1 + max(getHeight(y->left), getHeight(y->right));\n    x->height = 1 + max(getHeight(x->left), getHeight(x->right));\n    return x;\n}`,
                        explanation: 'Standard pointer rotation restoring AVL height balance.'
                    }
                ],
                aiSummary: {
                    summary: 'Explains self-balancing AVL trees, balance factor rotations, and disk-oriented B-trees.',
                    keyConcepts: ['Balance Factor (-1, 0, 1)', 'AVL Rotations (LL, RR, LR, RL)', 'B-Trees', 'Disk & Database Indexing'],
                    revisionNotes: 'AVL trees strictly maintain logarithmic height, ensuring O(log n) worst-case time for all operations.'
                }
            },
            {
                orderIndex: 15,
                title: '6.15 Threaded trees',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 6.15 Threaded Binary Trees

#### 1. Motivation
In a standard binary tree with \(N\) nodes, there are \(N + 1\) null pointers. A **Threaded Binary Tree** makes efficient use of these null pointers to store direct links ("threads") to in-order predecessors and successors.

#### 2. Benefits
* Allows in-order tree traversal **without using recursion or a call stack**!
* Saves memory overhead by replacing stack memory with previously wasted null pointers.
* Single-threaded vs Double-threaded trees.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Threaded Tree Node Definition in C',
                        code: `typedef struct ThreadedNode {\n    int data;\n    struct ThreadedNode *left, *right;\n    bool lThread; // true if left points to inorder predecessor\n    bool rThread; // true if right points to inorder successor\n} ThreadedNode;`,
                        explanation: 'Threaded binary tree node storing predecessor/successor flags.'
                    }
                ],
                aiSummary: {
                    summary: 'Covers Threaded Binary Trees, utilizing null pointers for traversal without recursion or call stacks.',
                    keyConcepts: ['Threaded Pointers', 'Inorder Predecessor/Successor', 'Stack-Free Traversal', 'Memory Utilization'],
                    revisionNotes: 'Threaded trees allow traversing binary trees in O(n) time and O(1) space without stack frames.'
                }
            }
        ],
        quiz: {
            title: 'Module 07 Quiz: Graph Theory & Advanced Trees',
            passingScorePercent: 60,
            questions: [
                {
                    questionText: 'What is the maximum allowed balance factor difference in an AVL Tree?',
                    type: 'MCQ',
                    options: ['0 or 1', '-1, 0, or 1', '-2, 0, or 2', 'Any constant'],
                    correctAnswer: '-1, 0, or 1',
                    explanation: 'An AVL tree strictly requires that the height difference between left and right subtrees never exceeds 1.'
                }
            ]
        }
    },
    {
        orderIndex: 8,
        title: 'Module 08: Hashing',
        description: 'Hash tables, hash functions, collision resolution techniques, hashing by chaining, and perfect hashing functions.',
        estimatedHours: 5,
        lessons: [
            {
                orderIndex: 1,
                title: '8.1 Hashing by chaining (Lab 12)',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### 8.1 Hashing by Chaining (Lab 12)

#### 1. Hash Tables & Hash Functions
A **Hash Table** maps keys to indices of an array using a **Hash Function** \(h(k)\).
* Common Hash Functions:
  * Division Method: \(h(k) = k \\pmod m\)
  * Multiplication Method: \(h(k) = \\lfloor m(k A \\pmod 1) \\rfloor\)

#### 2. Collision Resolution: Chaining
When two distinct keys produce the same hash index (\(h(k_1) = h(k_2)\)), a **collision** occurs.
* In **Separate Chaining**, each bucket of the hash table contains a linked list of all entries mapped to that index.
* **Load Factor**: \(\\alpha = n / m\) (number of elements divided by number of buckets).
* Average search/insert time is \(O(1 + \\alpha)\). When \(\\alpha = O(1)\), operations run in constant \(O(1)\) time.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Separate Chaining Hash Table in C (Lab 12)',
                        code: `#include <stdio.h>\n#include <stdlib.h>\n#define TABLE_SIZE 10\n\ntypedef struct HashNode {\n    int key;\n    struct HashNode *next;\n} HashNode;\n\nHashNode *table[TABLE_SIZE];\n\nint hash(int key) { return key % TABLE_SIZE; }\n\nvoid insert(int key) {\n    int idx = hash(key);\n    HashNode *newNode = (HashNode*)malloc(sizeof(HashNode));\n    newNode->key = key;\n    newNode->next = table[idx];\n    table[idx] = newNode;\n}`,
                        explanation: 'Separate chaining linked-list bucket insertion in C.'
                    }
                ],
                aiSummary: {
                    summary: 'Explains hash functions, collision handling via separate chaining, load factors, and Lab 12 implementation.',
                    keyConcepts: ['Hash Function', 'Collision Resolution', 'Separate Chaining', 'O(1) Average Lookup'],
                    revisionNotes: 'Keep the load factor alpha reasonably low to maintain average O(1) performance.'
                }
            },
            {
                orderIndex: 2,
                title: '8.2 Perfect hashing function',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 8.2 Perfect Hashing Functions

#### 1. What is Perfect Hashing?
A **Perfect Hash Function** maps a static set of \(n\) keys into a table of size \(m\) with **zero collisions**.
* **Minimal Perfect Hashing**: \(m = n\) (no empty slots in table).

#### 2. Two-Level Hashing Scheme (Fredman-Komlós-Szemerédi / FKS)
* Level 1: Hash into \(m\) buckets using a universal hash function.
* Level 2: Each bucket has its own secondary hash table of size \(s_i = n_i^2\).
* Guarantees \(O(1)\) worst-case search time in \(O(n)\) total storage! Ideal for compilers (reserved keywords) and static dictionaries.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Perfect Hashing Concept',
                        code: `// Primary table hashes key to secondary table\n// Secondary table size is square of bucket items, guaranteeing 0 collisions\n// Search takes exactly 2 hash computations: O(1) worst-case!`,
                        explanation: 'Two-level universal hashing scheme.'
                    }
                ],
                aiSummary: {
                    summary: 'Details perfect hashing and FKS two-level hashing guaranteeing O(1) worst-case lookup for static key sets.',
                    keyConcepts: ['Zero Collisions', 'Minimal Perfect Hashing', 'FKS Two-Level Hashing', 'O(1) Worst-Case Lookup'],
                    revisionNotes: 'Perfect hashing is optimal for fixed, unchanging sets of keys such as language compiler keywords.'
                }
            }
        ],
        quiz: {
            title: 'Module 08 Quiz: Hashing',
            passingScorePercent: 60,
            questions: [
                {
                    questionText: 'What is the average time complexity for searching an element in a hash table using separate chaining?',
                    type: 'MCQ',
                    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
                    correctAnswer: 'O(1)',
                    explanation: 'Assuming a uniform hash distribution and reasonable load factor, search runs in O(1) average time.'
                }
            ]
        }
    },
    {
        orderIndex: 9,
        title: 'Module 09: String algorithms',
        description: 'String manipulation fundamentals, pattern matching algorithms, and Rabin-Karp substring search with rolling hash.',
        estimatedHours: 5,
        lessons: [
            {
                orderIndex: 1,
                title: '9.1 Simple string manipulations',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 9.1 Simple String Manipulations in ANSI C

#### 1. Strings in C Architecture
Strings in C are contiguous sequences of characters terminated by the null character (\`'\\0'\`).
* No built-in string class; operations are performed via pointer manipulation or \`<string.h>\`.

#### 2. Fundamental Operations from Scratch
* **Length Calculation (\`strlen\`)**: Counting characters until \`'\\0'\`.
* **String Copy (\`strcpy\`)**: Copying characters byte by byte including null terminator.
* **String Concatenation (\`strcat\`)**: Appending characters from source to the end of destination buffer.
* **String Comparison (\`strcmp\`)**: Lexicographical difference of first mismatching characters.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Manual String Functions in C',
                        code: `#include <stdio.h>\n\nint myStrlen(const char *s) {\n    int len = 0;\n    while(s[len] != '\\0') len++;\n    return len;\n}\n\nvoid myStrcpy(char *dest, const char *src) {\n    while((*dest++ = *src++));\n}\n\nint main() {\n    char buffer[50];\n    myStrcpy(buffer, "Data Structures");\n    printf("%s (Length: %d)\\n", buffer, myStrlen(buffer));\n    return 0;\n}`,
                        explanation: 'Writing standard string routines using basic pointer arithmetic.'
                    }
                ],
                aiSummary: {
                    summary: 'Explores null-terminated string representation in C and implementing manual string manipulation routines.',
                    keyConcepts: ['Null-Terminator', 'strlen & strcpy', 'Buffer Bounds', 'Pointer Arithmetic on Strings'],
                    revisionNotes: 'Always ensure the destination buffer has sufficient allocated space for the trailing null byte.'
                }
            },
            {
                orderIndex: 2,
                title: '9.2 Pattern search with Rabin-Karp approach',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### 9.2 Pattern Searching: Rabin-Karp Algorithm

#### 1. The Substring Search Problem
Given text \(T\) of length \(n\) and pattern \(P\) of length \(m\), find all occurrences of \(P\) in \(T\).
* Naïve search compares characters directly: \(O((n - m + 1)m)\) worst-case.

#### 2. Rabin-Karp Rolling Hash Technique
Instead of comparing characters at every position, Rabin-Karp calculates a numerical hash value for the pattern and for each window of length \(m\) in the text:
* When window hash matches pattern hash, perform a character-by-character check to rule out hash collisions ("spurious hits").
* **Rolling Hash**: Computes hash of next window in \(O(1)\) time using previous window hash:
  \`hash(next) = (d * (hash(prev) - T[i] * h) + T[i + m]) % q\`
* **Complexity**:
  * Average Case: \(O(n + m)\) linear time!
  * Worst Case: \(O(nm)\) if many hash collisions occur.`,
                codeSnippets: [
                    {
                        language: 'c',
                        title: 'Rabin-Karp Substring Search in C',
                        code: `#include <stdio.h>\n#include <string.h>\n#define d 256\n\nvoid searchRabinKarp(char pat[], char txt[], int q) {\n    int M = strlen(pat);\n    int N = strlen(txt);\n    int i, j, p = 0, t = 0, h = 1;\n\n    for (i = 0; i < M - 1; i++) h = (h * d) % q;\n\n    for (i = 0; i < M; i++) {\n        p = (p * d + pat[i]) % q;\n        t = (t * d + txt[i]) % q;\n    }\n\n    for (i = 0; i <= N - M; i++) {\n        if (p == t) {\n            for (j = 0; j < M; j++) if (txt[i + j] != pat[j]) break;\n            if (j == M) printf("Pattern found at index %d\\n", i);\n        }\n        if (i < N - M) {\n            t = (d * (t - txt[i] * h) + txt[i + M]) % q;\n            if (t < 0) t = (t + q);\n        }\n    }\n}`,
                        explanation: 'Rabin-Karp pattern matching using rolling hash in ANSI C.'
                    }
                ],
                aiSummary: {
                    summary: 'Details Rabin-Karp string pattern matching using rolling hash and collision resolution in average O(n+m) time.',
                    keyConcepts: ['Pattern Matching', 'Rolling Hash Function', 'Spurious Hit Verification', 'Average O(n+m) Complexity'],
                    revisionNotes: 'Rolling hash computes the hash of adjacent sliding windows in O(1) constant time.'
                }
            }
        ],
        quiz: {
            title: 'Module 09 Quiz: String Algorithms',
            passingScorePercent: 60,
            questions: [
                {
                    questionText: 'What technique enables the Rabin-Karp algorithm to update the window hash value in O(1) time?',
                    type: 'MCQ',
                    options: ['Rolling Hash', 'Binary Search', 'Dynamic Table Sizing', 'Prefix Tree Lookup'],
                    correctAnswer: 'Rolling Hash',
                    explanation: 'Rolling hash removes the leading character and appends the trailing character using modulo arithmetic in O(1) time.'
                }
            ]
        }
    }
];

async function updateDsaCourse() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');

        console.log('Finding or creating DSA Course (DSA-MODERN-2)...');
        let dsaCourse = await Course.findOne({ code: 'DSA-MODERN-2' });
        if (!dsaCourse) {
            dsaCourse = new Course({
                title: 'Data Structures and Algorithms (DSA)',
                code: 'DSA-MODERN-2',
                category: 'DSA',
                level: 'Intermediate'
            });
        }

        dsaCourse.title = 'Data Structures and Algorithms (DSA)';
        dsaCourse.category = 'DSA';
        dsaCourse.level = 'Intermediate';
        dsaCourse.description = 'Complete curriculum in Data Structures and Algorithms based on ANSI C (C89), GNU/Linux environment, Graphviz, Gnuplot, and classical algorithms literature (Cormen, Langsam, Kernighan & Ritchie).';
        dsaCourse.modules = dsaModules;
        dsaCourse.estimatedTotalHours = 51;
        dsaCourse.sequentialOrder = false; // Allow easy navigation across modules

        await dsaCourse.save();
        console.log(`✅ DSA Course updated successfully with ${dsaCourse.modules.length} modules!`);

        let totalLessons = 0;
        dsaCourse.modules.forEach(m => {
            totalLessons += m.lessons.length;
            console.log(`   - ${m.title} (${m.lessons.length} topics)`);
        });
        console.log(`Total Topics / Lessons across all modules: ${totalLessons}`);

        // Unlock all modules in StudentProgress so all students can access every module immediately
        console.log('Unlocking all DSA modules in StudentProgress...');
        const allDsaModIds = dsaCourse.modules.map(m => m._id);

        const updateResult = await StudentProgress.updateMany(
            { courseId: dsaCourse._id },
            {
                $addToSet: { unlockedModules: { $each: allDsaModIds } },
                $set: {
                    currentActiveModuleId: allDsaModIds[0],
                    currentActiveLessonId: dsaCourse.modules[0].lessons[0]._id
                }
            }
        );
        console.log(`✅ StudentProgress updated for ${updateResult.modifiedCount} student records.`);

        if (require.main === module) {
            process.exit(0);
        }
    } catch (err) {
        console.error('❌ Error updating DSA course:', err);
        if (require.main === module) {
            process.exit(1);
        }
    }
}

if (require.main === module) {
    updateDsaCourse();
}

module.exports = { dsaModules, updateDsaCourse };

