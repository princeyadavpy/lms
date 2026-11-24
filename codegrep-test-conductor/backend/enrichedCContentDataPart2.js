/**
 * Enriched Content Data for Programming in 'C' (Part 2: Modules 4 and 5)
 * Topics:
 * - Module 4: Looping (4.1 - 4.6)
 * - Module 5: Arrays and String (5.1 - 5.7)
 */

module.exports = {
    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 4: LOOPING
    // ═════════════════════════════════════════════════════════════════════════
    "4-1": {
        content: `### 4.1 Concept of Loop

A **loop** is a control structure that repeatedly executes a block of code as long as a specified test condition evaluates to non-zero (true).

#### Why Loops are Fundamental
Without loops, performing an operation 1,000 times would require manually duplicating 1,000 identical lines of code. Loops provide:
1. **Code Reusability:** Execute the same algorithm across changing data values.
2. **Dynamic Automation:** Terminate automatically when target data conditions or sentinel inputs are reached.
3. **Memory & Size Efficiency:** Compact code binaries with minimal instruction footprints.

#### Anatomy of a Loop
Every loop in C involves four essential components:
1. **Initialization:** Setting the initial value of the loop control variable (counter).
2. **Test Condition:** Evaluating whether the loop body should execute or terminate.
3. **Loop Body:** The statements executed repeatedly during each iteration.
4. **Update / Step Expression:** Modifying (incrementing/decrementing) the loop control variable so the condition eventually becomes false.

\`\`\`
       [ Initialization: i = 0 ]
                   │
                   ▼
       ┌──► [ Test Condition: i < N ]
       │           │
       │    True   ▼          False
       │     [ Loop Body ] ──────────► [ Exit Loop ]
       │           │
       │           ▼
       └─── [ Update: i++ ]
\`\`\`

#### Loop Classification: Entry-Controlled vs. Exit-Controlled
- **Entry-Controlled Loops (\`for\`, \`while\`):** The condition is evaluated **before** executing the loop body. If the condition is false initially, the body does not execute at all.
- **Exit-Controlled Loops (\`do-while\`):** The condition is evaluated **after** the loop body executes. The body is guaranteed to execute at least once.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Basic Loop Iteration Anatomy',
                code: `#include <stdio.h>

int main(void) {
    int counter = 1; // 1. Initialization

    printf("Starting loop sequence:\\n");
    while (counter <= 5) { // 2. Test Condition
        printf("Iteration #%d: Working on data\\n", counter); // 3. Loop Body
        counter++; // 4. Update expression
    }
    printf("Loop terminated. Final counter = %d\\n", counter);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Loops repeat code blocks while a condition remains true. They require Initialization, Condition testing, Body execution, and an Update step. They are classified as Entry-controlled (for, while) or Exit-controlled (do-while).",
            keyConcepts: ["Loop Lifecycle (Init, Condition, Body, Update)", "Entry-Controlled vs Exit-Controlled", "Loop Termination Invariants"],
            revisionNotes: "Always verify that the loop control variable changes inside the loop body, otherwise the loop will run infinitely."
        }
    },

    "4-2": {
        content: `### 4.2 The For Loop in 'C'

The **\`for\` loop** is an entry-controlled iterative structure that packages initialization, condition checking, and loop updating into a single, compact statement line.

#### Syntax & Execution Flow
\`\`\`c
for (initialization; test_condition; update_expression) {
    // Body of loop
}
\`\`\`

#### Step-by-Step Execution Sequence
1. **Initialization:** Executes once when the loop starts.
2. **Condition Test:** Evaluated before every iteration. If true, proceed to step 3; if false, exit the loop.
3. **Body Execution:** Executes all statements inside \`{ ... }\`.
4. **Update Expression:** Increments or decrements the counter.
5. **Repeat:** Control jumps back to step 2.

#### Advanced Features of the C \`for\` Loop
- **Multiple Loop Variables:** You can initialize and update multiple variables using the comma operator:
  \`\`\`c
  for (int i = 0, j = 10; i < j; i++, j--) {
      printf("i=%d, j=%d\\n", i, j);
  }
  \`\`\`
- **Optional Expressions:** Any of the three expressions may be omitted:
  \`\`\`c
  int i = 0;
  for (; i < 5;) { // Valid: acts like while loop
      i++;
  }
  \`\`\`
- **The Infinite Loop:** Leaving the condition blank evaluates to non-zero (true):
  \`\`\`c
  for (;;) {
      // Runs indefinitely until break or exit
  }
  \`\`\``,
        codeSnippets: [
            {
                language: 'c',
                title: 'For Loop Variations & Factorial Calculation',
                code: `#include <stdio.h>

int main(void) {
    int n = 6;
    long long factorial = 1;

    // Standard incrementing loop
    for (int i = 1; i <= n; i++) {
        factorial *= i;
    }
    printf("Factorial of %d = %lld\\n", n, factorial);

    // Multi-variable parallel countdown loop
    printf("\\nTwo-pointer convergence demo:\\n");
    for (int left = 0, right = 6; left <= right; left++, right--) {
        printf("Left Index: %d <---> Right Index: %d\\n", left, right);
    }

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "The for loop bundles initialization, condition, and update in one header. It is ideal for counter-driven iterations where the number of repetitions is known in advance.",
            keyConcepts: ["For Loop Syntax", "Execution Lifecycle", "Comma Operator in Loops", "Infinite Loop (for(;;))"],
            revisionNotes: "Since C99, loop counters can be declared directly inside the for header: `for (int i = 0; i < n; i++)`."
        }
    },

    "4-3": {
        content: `### 4.3 The While Loop in 'C'

The **\`while\` loop** is an entry-controlled loop that repeats statements as long as its condition remains true. It is preferred when the **exact number of iterations is unknown** prior to starting the loop (e.g., reading until End of File or awaiting user input).

#### Syntax & Structure
\`\`\`c
while (condition) {
    // Body statements
    // Must update variables affecting condition!
}
\`\`\`

#### Execution Flow
\`\`\`
       [ Condition ]
         /       \\
   True /         \\ False
       ▼           \\
 [ Loop Body ]      ▼
       │      [ Exit Loop ]
       └───────► (Re-test)
\`\`\`

#### Key Characteristics
1. **Pre-Test Evaluation:** If the condition evaluates to \`0\` (false) on the very first check, the body is never executed.
2. **Sentinel-Controlled Iteration:** Commonly used to process streams until a sentinel stop-value (such as \`-1\` or \`EOF\`) is encountered.
3. **Common Pitfall — Accidental Semicolon:**
   \`\`\`c
   int i = 0;
   while (i < 5); // Empty statement! Infinite loop spins forever
   {
       i++;
   }
   \`\`\``,
        codeSnippets: [
            {
                language: 'c',
                title: 'Reversing a Number using While Loop',
                code: `#include <stdio.h>

int main(void) {
    int number = 98452;
    int reversed = 0;
    int temp = number;

    // Loop continues until all digits are extracted
    while (temp > 0) {
        int remainder = temp % 10;          // Extract last digit
        reversed = (reversed * 10) + remainder; // Append to reversed
        temp /= 10;                         // Drop last digit
    }

    printf("Original Number: %d\\n", number);
    printf("Reversed Number: %d\\n", reversed);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "The while loop tests its condition prior to executing the loop body. It is ideal for event-driven or sentinel-driven loops where the iteration count depends on dynamic runtime conditions.",
            keyConcepts: ["Entry-Controlled Looping", "Sentinel-Controlled Loops", "Digit Manipulation Algorithms", "Trailing Semicolon Hazard"],
            revisionNotes: "Never put a semicolon immediately after the while condition: `while (x < 10);` creates an empty infinite loop."
        }
    },

    "4-4": {
        content: `### 4.4 The Do While Loop in 'C'

The **\`do-while\` loop** is an **exit-controlled** iterative structure where the condition is evaluated after the loop body executes.

#### Syntax & Structure
\`\`\`c
do {
    // Statements executed at least once
} while (condition); // Note the mandatory trailing semicolon!
\`\`\`

#### Critical Difference: \`while\` vs. \`do-while\`
| Feature | \`while\` Loop | \`do-while\` Loop |
| :--- | :--- | :--- |
| **Control Type** | Entry-controlled (pre-test) | Exit-controlled (post-test) |
| **Minimum Iterations** | **0 times** (if initial condition is false) | **1 time** (guaranteed execution) |
| **Semicolon Usage** | No semicolon after condition | Mandatory semicolon after \`while(cond);\` |
| **Primary Use Case** | Data processing, stream parsing | Interactive menus, input validation |

#### Primary Use Cases
1. **Menu-Driven Interfaces:** Displaying an interactive console menu and awaiting user choice at least once.
2. **Input Validation:** Forcing the user to enter data until valid bounds are satisfied:
   \`\`\`c
   int age;
   do {
       printf("Enter valid age (1-120): ");
       scanf("%d", &age);
   } while (age < 1 || age > 120);
   \`\`\``,
        codeSnippets: [
            {
                language: 'c',
                title: 'Menu-Driven Console Loop using do-while',
                code: `#include <stdio.h>

int main(void) {
    int choice = 0;

    do {
        printf("\\n--- SYSTEM CONSOLE MENU ---\\n");
        printf("1. Check Server Status\\n");
        printf("2. Clear Memory Cache\\n");
        printf("3. Exit Console\\n");
        printf("Select option (1-3): ");
        
        // Simulating user input: option 3 to exit
        choice = 3; 
        printf("%d\\n", choice);

        switch (choice) {
            case 1: printf("-> Server: ONLINE, Latency: 12ms\\n"); break;
            case 2: printf("-> Cache cleared successfully.\\n"); break;
            case 3: printf("-> Exiting application... Goodbye!\\n"); break;
            default: printf("-> Invalid choice! Try again.\\n"); break;
        }
    } while (choice != 3);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "The do-while loop is an exit-controlled loop that guarantees at least one execution of its body because condition evaluation happens at the bottom. A trailing semicolon is mandatory.",
            keyConcepts: ["Exit-Controlled Logic", "Guaranteed Single Execution", "Menu-Driven Architecture", "Input Validation Loops"],
            revisionNotes: "Always remember the closing semicolon: `do { ... } while (condition);`. Omitting it causes a syntax compilation error."
        }
    },

    "4-5": {
        content: `### 4.5 Jumping and Nested Loops in 'C'

A **nested loop** occurs when one loop is placed inside the body of another loop. Nested loops are fundamental for traversing multi-dimensional structures such as 2D matrices, grids, and image pixels.

#### Execution Mechanics
For each single iteration of the **outer loop**, the entire **inner loop** runs from start to completion.
- If the outer loop runs $M$ times and the inner loop runs $N$ times, the inner loop body executes $M \\times N$ total times.

\`\`\`
 Outer Loop (i = 0 to M-1)
    └── Inner Loop (j = 0 to N-1)
           └── Executes M * N times total
\`\`\`

#### Multi-Loop Jumping
- In standard C, the \`break\` statement breaks out of only the **innermost enclosing loop**.
- To break completely out of two or three deeply nested loops at once, developers use either a **boolean flag** or an explicit **\`goto exit_label;\`**.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Nested Loops: Printing Multiplication Table & Pattern',
                code: `#include <stdio.h>

int main(void) {
    int rows = 4, cols = 4;

    printf("--- 4x4 Coordinate Matrix ---\\n");
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= cols; j++) {
            printf("(%d,%d) ", i, j);
        }
        printf("\\n"); // Newline after each row
    }

    printf("\\n--- Half-Pyramid Asterisk Pattern ---\\n");
    for (int r = 1; r <= 5; r++) {
        for (int c = 1; c <= r; c++) {
            printf("* ");
        }
        printf("\\n");
    }

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Nested loops contain an inner loop inside an outer loop, executing M * N times total. They are essential for 2D matrices and pattern generation.",
            keyConcepts: ["Nested Iteration Flow", "Matrix Coordinate Traversal", "Inner vs Outer Loop Indices", "Total Iteration Complexity O(N^2)"],
            revisionNotes: "Keep nested loops within 2-3 levels; deeper nesting dramatically increases time complexity and degrades readability."
        }
    },

    "4-6": {
        content: `### 4.6 Break and Continue Statements

C provides two jump statements specifically designed to control and alter loop execution: **\`break\`** and **\`continue\`**.

#### 1. The \`break\` Statement
- Immediately **terminates** the loop or switch block in which it appears.
- Program control jumps to the statement directly following the terminated loop.
- **Use Case:** Early exit upon finding a target element during a search.

#### 2. The \`continue\` Statement
- **Skips the remainder** of the current loop iteration.
- Control jumps directly to the **next iteration's condition test** (in \`while\`/\`do-while\`) or the **update step** (in \`for\`).
- **Use Case:** Filtering out unwanted elements or skipping error states without exiting the loop.

#### Comparison: \`break\` vs. \`continue\`
| Feature | \`break\` | \`continue\` |
| :--- | :--- | :--- |
| **Effect on Loop** | Permanently terminates the loop | Skips current iteration only |
| **Next Action** | Control jumps outside the loop | Control jumps to the next cycle |
| **Switch Usage** | Valid inside loops and switch blocks | Valid **only inside loops** (illegal in switch) |`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Break vs Continue in Action',
                code: `#include <stdio.h>

int main(void) {
    printf("--- Demonstrating continue (Skipping even numbers) ---\\n");
    for (int i = 1; i <= 8; i++) {
        if (i % 2 == 0) {
            continue; // Skip rest of body for even numbers
        }
        printf("Odd number: %d\\n", i);
    }

    printf("\\n--- Demonstrating break (Search & Early Exit) ---\\n");
    int target = 4;
    for (int i = 1; i <= 10; i++) {
        if (i == target) {
            printf("Found target %d! Terminating search loop.\\n", target);
            break; // Stop immediately
        }
        printf("Scanning element %d...\\n", i);
    }

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "break immediately terminates loop execution and jumps out. continue skips the remainder of the current cycle and begins the next iteration. break works in loops and switches; continue works only in loops.",
            keyConcepts: ["break (Loop Termination)", "continue (Iteration Skipping)", "Search Optimization", "Filtering Logic"],
            revisionNotes: "Using continue in a while loop requires caution: ensure the counter update happens before continue, otherwise an infinite loop results."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 5: ARRAYS AND STRING
    // ═════════════════════════════════════════════════════════════════════════
    "5-1": {
        content: `### 5.1 Introduction to Arrays

An **array** is a derived data structure that stores a fixed-size sequential collection of elements of the **same data type** in **contiguous memory locations**.

#### Why Arrays are Needed
If you need to track the exam scores of 100 students, creating 100 individual variables (\`score1\`, \`score2\`, ..., \`score100\`) is unmanageable. An array allows you to store all 100 scores under a single name (\`scores[100]\`) and access each through an index.

#### Core Characteristics of C Arrays
1. **Homogeneous:** Every element in the array has identical data type and byte size.
2. **Contiguous Memory:** Elements reside directly adjacent to one another in physical RAM without gaps.
3. **Zero-Based Indexing:** The first element is at index \`0\`, and the last element of an array of size $N$ is at index $N-1$.
4. **Direct $O(1)$ Random Access:** Any element can be read or written instantly using its index.
5. **Fixed Size:** Array bounds must be determined at compile time (or stack allocation time) and cannot grow or shrink dynamically.

#### Memory Mapping Formula
Because elements are contiguous, the memory address of any element at index $i$ is calculated directly by the hardware:
$$\\text{Address of } arr[i] = \\text{Base Address} + (i \\times \\text{sizeof}(\\text{Data Type}))$$

\`\`\`
 Array: int arr[4] = {10, 20, 30, 40}; (assuming 4 bytes per int)

 Index:         [0]            [1]            [2]            [3]
 Value:       │  10   │      │  20   │      │  30   │      │  40   │
 Address:     0x1000         0x1004         0x1008         0x100C
              Base Address   Base + 1*4     Base + 2*4     Base + 3*4
\`\`\``,
        codeSnippets: [
            {
                language: 'c',
                title: 'Array Memory Contiguity Inspection',
                code: `#include <stdio.h>

int main(void) {
    int arr[4] = {10, 20, 30, 40};

    printf("Array base address (arr): %p\\n", (void*)arr);
    printf("----------------------------------------\\n");
    for (int i = 0; i < 4; i++) {
        printf("arr[%d]: Value = %d | Address = %p (Offset: +%zu bytes)\\n", 
               i, arr[i], (void*)&arr[i], (char*)&arr[i] - (char*)&arr[0]);
    }

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "An array is a fixed-size, contiguous collection of homogeneous elements. Elements are accessed in O(1) time via zero-based indexing calculated as: Base + i * sizeof(type).",
            keyConcepts: ["Homogeneous Elements", "Contiguous RAM Layout", "Zero-Based Indexing", "Base Address Calculation"],
            revisionNotes: "In C, arrays do not perform bounds checking; accessing arr[10] in an array of size 5 causes undefined behavior or segmentation fault."
        }
    },

    "5-2": {
        content: `### 5.2 One-Dimensional Arrays

A **one-dimensional (1D) array** represents a linear list of elements stored sequentially.

#### 1. Declaration and Initialization Syntax
\`\`\`c
// Declaration without initialization (contains garbage values)
int numbers[5]; 

// Complete initialization
int scores[5] = {88, 92, 79, 95, 84};

// Partial initialization (remaining elements default to 0)
int primes[5] = {2, 3}; // Contains {2, 3, 0, 0, 0}

// Universal zero initialization
int zeros[100] = {0}; // All 100 elements initialized to 0

// Inferred size from initializer list
int grades[] = {10, 20, 30}; // Compiler automatically allocates size 3
\`\`\`

#### 2. Determining Array Size in C
In C, arrays do not store their length metadata. You calculate the number of elements using \`sizeof\`:
\`\`\`c
int length = sizeof(arr) / sizeof(arr[0]);
\`\`\`

#### 3. Common Array Operations
- **Traversal:** Iterating through elements using a \`for\` loop from index \`0\` to \`length - 1\`.
- **Search (Linear Search):** Checking each element sequentially until the target is found ($O(n)$).
- **Extremes:** Tracking minimum and maximum values across the dataset.`,
        codeSnippets: [
            {
                language: 'c',
                title: '1D Array Processing: Average, Max, and Min',
                code: `#include <stdio.h>

int main(void) {
    int temperatures[] = {32, 28, 35, 30, 26, 33, 29};
    int n = sizeof(temperatures) / sizeof(temperatures[0]);

    int sum = 0;
    int max = temperatures[0];
    int min = temperatures[0];

    for (int i = 0; i < n; i++) {
        sum += temperatures[i];
        if (temperatures[i] > max) max = temperatures[i];
        if (temperatures[i] < min) min = temperatures[i];
    }

    double average = (double)sum / n;

    printf("Dataset Size: %d readings\\n", n);
    printf("Max Temp:     %d C\\n", max);
    printf("Min Temp:     %d C\\n", min);
    printf("Average Temp: %.2f C\\n", average);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "1D arrays store linear sequences of elements. Array length is calculated as sizeof(arr) / sizeof(arr[0]). Common operations include traversal, search, and computing aggregate metrics.",
            keyConcepts: ["Array Declaration & Initializers", "Zero-Initialization ({0})", "Array Length Idiom via sizeof", "Linear Traversal"],
            revisionNotes: "When passing an array to a function, it decays into a pointer. Always pass the array length as a separate parameter."
        }
    },

    "5-3": {
        content: `### 5.3 Two-Dimensional Arrays (Matrices)

A **two-dimensional (2D) array** organizes data into a table of **rows** and **columns**, commonly used for matrices, game boards (chess, tic-tac-toe), and image pixels.

#### Declaration & Initialization
\`\`\`c
int matrix[rows][columns];
\`\`\`
\`\`\`c
// Explicit row-by-row initialization
int grid[2][3] = {
    {1, 2, 3},  // Row 0
    {4, 5, 6}   // Row 1
};
\`\`\`

#### Physical Memory Representation: Row-Major Order
While humans visualize a 2D array as a grid, physical RAM is strictly a 1D sequence of byte addresses. C stores 2D arrays in **Row-Major Order**:
- The entirety of Row 0 is stored first, followed immediately by Row 1, Row 2, etc.

\`\`\`
 Grid Visualization:
         Col 0   Col 1   Col 2
 Row 0: [ 10  ,   20  ,   30  ]
 Row 1: [ 40  ,   50  ,   60  ]

 Memory Layout in RAM (Linear):
 [10] [20] [30] [40] [50] [60]
 └─────Row 0───┘ └─────Row 1───┘
\`\`\`

#### Address Formula in Row-Major Order
$$\\text{Address}(arr[i][j]) = \\text{Base} + ((i \\times \\text{Cols}) + j) \\times \\text{sizeof}(\\text{Type})$$`,
        codeSnippets: [
            {
                language: 'c',
                title: '2D Matrix Addition and Transpose',
                code: `#include <stdio.h>

#define ROWS 2
#define COLS 3

int main(void) {
    int A[ROWS][COLS] = { {1, 2, 3}, {4, 5, 6} };
    int B[ROWS][COLS] = { {7, 8, 9}, {3, 2, 1} };
    int Sum[ROWS][COLS];

    printf("Matrix Addition (A + B):\\n");
    for (int i = 0; i < ROWS; i++) {
        for (int j = 0; j < COLS; j++) {
            Sum[i][j] = A[i][j] + B[i][j];
            printf("%3d ", Sum[i][j]);
        }
        printf("\\n");
    }

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "A 2D array represents rows and columns stored in linear RAM via Row-Major Order. Accessing element arr[i][j] uses the offset: (i * Cols + j) * sizeof(Type).",
            keyConcepts: ["Row-Major Ordering", "Matrix Declarations", "Nested Loop Traversal", "Coordinate Indexing [row][col]"],
            revisionNotes: "When passing 2D arrays to functions, the column dimension must be specified: `void printMatrix(int arr[][3], int rows)`."
        }
    },

    "5-4": {
        content: `### 5.4 Multidimensional Arrays

A **multidimensional array** extends array indexing to three or more dimensions. In C, an array can have an arbitrary number of dimensions, bounded only by available system memory.

#### 3D Arrays: Tensors and Depth Grids
A 3D array is conceptually an **array of 2D arrays** (Blocks $\\times$ Rows $\\times$ Columns):
\`\`\`c
int tensor[BLOCKS][ROWS][COLS];
\`\`\`

#### Visualizing a 3D Array
Think of a 3D array as a book:
- Dimension 1 (Blocks / Pages): Which page in the book.
- Dimension 2 (Rows): Which line on that page.
- Dimension 3 (Columns): Which word on that line.

\`\`\`
 Block 0:             Block 1:
 [1, 2] [3, 4]        [5, 6] [7, 8]
\`\`\`

#### Real-World Applications
1. **3D Computer Graphics:** Storing voxel data or 3D vector coordinates $(x, y, z)$.
2. **Color Digital Images:** Height $\\times$ Width $\\times$ Color Channels (RGB: 3 channels).
3. **Time-Series Sensor Grids:** Time-step $\\times$ Sensor-Row $\\times$ Sensor-Column.`,
        codeSnippets: [
            {
                language: 'c',
                title: '3D Array Traversal (Blocks, Rows, Cols)',
                code: `#include <stdio.h>

#define LAYERS 2
#define ROWS 2
#define COLS 3

int main(void) {
    int space[LAYERS][ROWS][COLS] = {
        { // Layer 0
            {10, 20, 30},
            {40, 50, 60}
        },
        { // Layer 1
            {70, 80, 90},
            {15, 25, 35}
        }
    };

    printf("Traversing 3D Space (2x2x3):\\n");
    for (int l = 0; l < LAYERS; l++) {
        printf("--- Layer %d ---\\n", l);
        for (int r = 0; r < ROWS; r++) {
            for (int c = 0; c < COLS; c++) {
                printf("%2d ", space[l][r][c]);
            }
            printf("\\n");
        }
    }

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Multidimensional arrays extend indexing to 3 or more dimensions (e.g. Layers x Rows x Cols). They are stored sequentially in memory and traversed using corresponding nested loops.",
            keyConcepts: ["3D Array Visualization (Layers/Rows/Cols)", "Linearized Tensor Storage", "Triple Nested Loops"],
            revisionNotes: "Memory consumed by multidimensional arrays multiplies rapidly: int arr[100][100][100] consumes 4 MB of RAM."
        }
    },

    "5-5": {
        content: `### 5.5 Dynamic Arrays in 'C'

Static arrays declared as \`int arr[100];\` reside in the **Call Stack** with fixed sizes fixed at compile time. This leads to two critical problems:
1. **Under-allocation:** The array is too small for large user inputs, causing buffer overflows.
2. **Over-allocation:** Memory is wasted when only a few elements are used.

#### Dynamic Array Solution (Heap Memory)
A **dynamic array** is allocated in the **Heap segment** at runtime using pointers and standard allocation functions (\`malloc\`, \`calloc\`, \`realloc\`).

\`\`\`
 Stack                  Heap Memory
┌───────────┐          ┌───────────────┬───────────────┬───────────────┐
│ int *arr  │ ───────► │ arr[0] (int)  │ arr[1] (int)  │ arr[2] (int)  │
└───────────┘          └───────────────┴───────────────┴───────────────┘
 Pointer holds address  Contiguous block allocated at runtime
\`\`\`

#### Lifecycle of a Dynamic Array
1. **Allocation (\`malloc\` / \`calloc\`):**
   \`\`\`c
   int *arr = (int*)malloc(n * sizeof(int));
   \`\`\`
2. **Access:** Use standard array indexing syntax (\`arr[i]\`).
3. **Resizing (\`realloc\`):** Expand or shrink capacity dynamically as needed.
4. **Deallocation (\`free\`):** Return heap memory back to the operating system to prevent **memory leaks**.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Creating and Resizing a Dynamic Array with realloc',
                code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int initial_size = 3;
    int *arr = (int*)malloc(initial_size * sizeof(int));

    if (arr == NULL) {
        fprintf(stderr, "Error: Memory allocation failed!\\n");
        return 1;
    }

    // Populate initial 3 items
    for (int i = 0; i < initial_size; i++) {
        arr[i] = (i + 1) * 10;
    }

    // Resize array from 3 elements to 5 elements
    int new_size = 5;
    int *temp = (int*)realloc(arr, new_size * sizeof(int));
    if (temp != NULL) {
        arr = temp;
        arr[3] = 40;
        arr[4] = 50;
    }

    printf("Dynamic array contents after resize:\\n");
    for (int i = 0; i < new_size; i++) {
        printf("arr[%d] = %d\\n", i, arr[i]);
    }

    // Mandatory deallocation
    free(arr);
    arr = NULL; // Guard against dangling pointer

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Dynamic arrays are allocated on the heap at runtime via malloc/calloc and resized with realloc. They must be freed explicitly using free() to prevent memory leaks.",
            keyConcepts: ["Stack vs Heap Allocation", "malloc / calloc / realloc", "free() & Memory Deallocation", "Dangling Pointer Guard (NULL)"],
            revisionNotes: "Always assign pointers to NULL after calling free(ptr) to prevent accidental dangling pointer dereferencing."
        }
    },

    "5-6": {
        content: `### 5.6 Implementing String Variables in 'C'

Unlike modern languages with a built-in \`string\` object, C has **no primitive string type**. In C, a **string** is implemented as a **one-dimensional array of characters terminated by a null character (\`'\\0'\`)**.

#### The Null Terminator (\`'\\0'\`)
The null character has an ASCII value of \`0\`. It serves as a sentinel marker informing library functions (like \`printf\`, \`strlen\`) where the string text ends in memory.
- To store a string of length $N$, the character array must be sized at least $N + 1$ to accommodate the trailing \`'\\0'\`.

\`\`\`
 Storing "HiGen" in memory:
 Index:    [0]   [1]   [2]   [3]   [4]   [5]
 Char:    'H'   'i'   'G'   'e'   'n'   '\\0'
 ASCII:    72    105   71    101   110    0
\`\`\`

#### String Declaration Methods
1. **Character Array (Mutable):**
   \`\`\`c
   char name[] = "Dennis"; // Allocated on Stack, can modify name[0] = 'd'
   \`\`\`
2. **String Pointer to Literal (Immutable / Read-Only):**
   \`\`\`c
   const char *title = "HiGen LMS"; // Stored in Read-Only Data Segment (.rodata)
   \`\`\`

#### String Input: \`scanf\` vs. \`fgets\`
- **\`scanf("%s", str)\`:** Unsafe! Stops reading at whitespace and does not check buffer limits, making it prone to buffer overflows.
- **\`fgets(str, sizeof(str), stdin)\`:** Safe and recommended! Reads whitespace and strictly bounds input to the array buffer size.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Safe String Handling: Array vs Pointer and fgets',
                code: `#include <stdio.h>

int main(void) {
    // Array string (mutable stack storage)
    char greeting[20] = "Hello, World!";
    greeting[7] = 'C'; // Modify in-place
    printf("Modified array string: %s\\n", greeting);

    // Manual character iteration until null terminator
    printf("Iterating characters: ");
    for (int i = 0; greeting[i] != '\\0'; i++) {
        printf("[%c]", greeting[i]);
    }
    printf("\\n");

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "A string in C is a null-terminated ('\\0') character array. Always allocate size N + 1 for length N. Prefer fgets() over scanf() for safe, bound-checked string input.",
            keyConcepts: ["Null Terminator ('\\0', ASCII 0)", "String Size Requirement (N + 1)", "Array vs String Literal Pointers", "Safe Input with fgets()"],
            revisionNotes: "Never attempt to mutate a string literal pointer: `char *s = \"hello\"; s[0] = 'H';` crashes with a Segmentation Fault."
        }
    },

    "5-7": {
        content: `### 5.7 String Handling Library Functions (\`<string.h>\`)

The C standard library header **\`<string.h>\`** provides a rich suite of optimized functions for manipulating null-terminated strings.

#### Core \`<string.h>\` Functions
| Function Prototype | Description |
| :--- | :--- |
| \`size_t strlen(const char *s)\` | Returns character count excluding the trailing \`'\\0'\` |
| \`char* strcpy(char *dest, const char *src)\` | Copies string \`src\` into buffer \`dest\` (including \`'\\0'\`) |
| \`char* strncpy(char *dest, const char *src, size_t n)\` | Bounds-checked copy of up to \`n\` characters |
| \`char* strcat(char *dest, const char *src)\` | Concatenates \`src\` onto the end of \`dest\` |
| \`char* strncat(char *dest, const char *src, size_t n)\` | Bounds-checked concatenation of up to \`n\` characters |
| \`int strcmp(const char *s1, const char *s2)\` | Lexicographically compares two strings |
| \`char* strchr(const char *s, int c)\` | Finds first occurrence of character \`c\` in string |
| \`char* strstr(const char *haystack, const char *needle)\` | Locates first occurrence of substring in string |

#### Understanding \`strcmp\` Return Values
\`strcmp(str1, str2)\` compares strings character by character by ASCII value:
- Returns **\`0\`**: \`str1\` and \`str2\` are completely identical.
- Returns **\`< 0\` (negative)**: \`str1\` is lexicographically smaller than \`str2\`.
- Returns **\`> 0\` (positive)**: \`str1\` is lexicographically greater than \`str2\`.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Comprehensive String Manipulation Suite',
                code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char first[50] = "HiGen";
    char second[] = " Labs";

    // 1. Length calculation (excluding null terminator)
    printf("Length of first: %zu\\n", strlen(first));

    // 2. Concatenation
    strcat(first, second);
    printf("Concatenated:    %s\\n", first);

    // 3. String Comparison
    if (strcmp(first, "HiGen Labs") == 0) {
        printf("Comparison: Strings are identical!\\n");
    }

    // 4. Substring Search
    char *sub = strstr(first, "Labs");
    if (sub != NULL) {
        printf("Substring 'Labs' found at index: %ld\\n", sub - first);
    }

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "<string.h> provides essential string utilities: strlen for length, strcpy/strncpy for copying, strcat/strncat for concatenation, strcmp for comparison, and strstr for substring searching.",
            keyConcepts: ["strlen vs sizeof", "strcpy vs strncpy (Buffer Safety)", "strcat Concatenation", "strcmp Lexicographical Comparison", "strstr Substring Search"],
            revisionNotes: "Always ensure the destination buffer has enough allocated capacity before calling strcat or strcpy to avoid buffer overflows."
        }
    }
};

