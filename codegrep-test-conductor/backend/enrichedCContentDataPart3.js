/**
 * Enriched Content Data for Programming in 'C' (Part 3: Modules 6, 7, and 8)
 * Topics:
 * - Module 6: Functions (6.1 - 6.4)
 * - Module 7: Pointers (7.1 - 7.5)
 * - Module 8: Structure and Unions (8.1 - 8.6)
 */

module.exports = {
    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 6: FUNCTIONS
    // ═════════════════════════════════════════════════════════════════════════
    "6-1": {
        content: `### 6.1 Concept of Function in 'C'

A **function** is a self-contained block of statements designed to perform a specific, well-defined task. Functions form the backbone of **modular, procedural programming** in C.

#### The Philosophy of Modular Programming
Rather than writing an entire software system in one monolithic \`main()\` block, programs are decomposed into smaller sub-tasks.
1. **Divide and Conquer:** Large complex problems are broken down into manageable subroutines.
2. **Code Reusability:** Write once, invoke many times from anywhere in the codebase.
3. **Maintainability & Testing:** Functions can be isolated, tested, and debugged independently.
4. **Information Hiding:** Functions expose what they accomplish through their interface (prototype), hiding internal complexity.

#### How Function Calls Work: The Call Stack
When a function is called, the CPU creates a new **Activation Record (Stack Frame)** on the **Call Stack**:
1. It pushes function arguments onto the stack.
2. It pushes the **Return Address** (the instruction pointer to resume after completion).
3. It allocates memory for local variables.
4. When the function returns, its stack frame is popped, and execution resumes at the caller's return address.

\`\`\`
   Top of Stack:
  ┌──────────────────────────────────┐
  │ Stack Frame: calculateSquare()   │ ◄── Active Function
  ├──────────────────────────────────┤
  │ Stack Frame: processData()       │
  ├──────────────────────────────────┤
  │ Stack Frame: main()              │ ◄── Base Function
  └──────────────────────────────────┘
\`\`\``,
        codeSnippets: [
            {
                language: 'c',
                title: 'Modular Function Invocation & Call Stack',
                code: `#include <stdio.h>

int multiply(int a, int b) {
    return a * b; // Pops stack frame and returns result
}

int calculateArea(int width, int height) {
    return multiply(width, height); // Nested function call
}

int main(void) {
    int w = 5, h = 8;
    int area = calculateArea(w, h);
    printf("Rectangle Area: %d\\n", area);
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Functions modularize code into reusable subroutines. Every function call pushes a stack frame onto the Call Stack containing parameters, local variables, and return addresses.",
            keyConcepts: ["Modular Decomposition", "Call Stack & Stack Frames", "Return Address & Scope", "Code Reusability"],
            revisionNotes: "Keep functions focused on a single responsibility; a function should do one task and do it well."
        }
    },

    "6-2": {
        content: `### 6.2 User Defined Functions

A **user-defined function** is created by the programmer to fulfill custom application requirements. Working with user-defined functions involves three distinct phases:

\`\`\`
 1. Function Prototype (Declaration) ──> Informs compiler of name, return type & params
 2. Function Call (Invocation)       ──> Passes arguments and transfers execution
 3. Function Definition              ──> Contains the executable statements
\`\`\`

#### 1. Function Prototype (Declaration)
Placed before \`main()\` or in header files:
\`\`\`c
return_type function_name(parameter_type1 param1, parameter_type2 param2);
\`\`\`
- Informs the compiler of parameter types so it can validate calls before the definition appears.

#### 2. Function Definition
Contains the formal parameters and the actual code body:
\`\`\`c
int add(int a, int b) {
    int result = a + b;
    return result; // Exit and yield value
}
\`\`\`

#### 3. Formal vs. Actual Parameters
- **Actual Parameters (Arguments):** The real values or variables passed into the function call (e.g., \`add(x, y);\`).
- **Formal Parameters:** The local variable placeholders declared in the function definition header (e.g., \`int a, int b\`).

#### Classification of Functions by Parameters and Returns
| Category | Example Prototype | Description |
| :--- | :--- | :--- |
| **No params, No return** | \`void greet(void);\` | Pure side-effect (e.g., printing banner) |
| **With params, No return** | \`void printScore(int s);\` | Consumes input, produces side effect |
| **No params, With return** | \`int getSystemTime(void);\` | Generates data without external input |
| **With params, With return** | \`double power(double b, int e);\` | Functional transformation |`,
        codeSnippets: [
            {
                language: 'c',
                title: 'User-Defined Function Lifecycle & Primes',
                code: `#include <stdio.h>
#include <stdbool.h>

// 1. Function Prototype
bool isPrime(int n);

int main(void) {
    int num = 29;

    // 2. Function Call (Passing actual parameter 'num')
    if (isPrime(num)) {
        printf("%d is a Prime number.\\n", num);
    } else {
        printf("%d is NOT a Prime number.\\n", num);
    }

    return 0;
}

// 3. Function Definition (Formal parameter 'n')
bool isPrime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}`
            }
        ],
        aiSummary: {
            summary: "User-defined functions require a Prototype, Call, and Definition. Actual parameters passed during the call bind to formal parameters defined in the function signature.",
            keyConcepts: ["Function Prototype vs Definition", "Actual vs Formal Parameters", "Return Types", "Parameter-Return Classifications"],
            revisionNotes: "Always declare function prototypes before main() to enable compile-time type verification."
        }
    },

    "6-3": {
        content: `### 6.3 System Defined (Standard Library) Functions

C includes a vast suite of pre-compiled, optimized functions bundled within the **C Standard Library** (\`libc\`).

#### Key Standard Library Headers
- **\`<stdio.h>\` (Standard Input/Output):**
  - \`printf()\`: Formatted output to stdout.
  - \`scanf()\`: Formatted input from stdin.
  - \`getchar()\`, \`putchar()\`: Character-level I/O.
- **\`<stdlib.h>\` (General Utilities):**
  - \`malloc()\`, \`calloc()\`, \`realloc()\`, \`free()\`: Dynamic heap memory management.
  - \`exit()\`: Terminate program execution with exit code.
  - \`rand()\`, \`srand()\`: Pseudo-random number generation.
  - \`atoi()\`, \`atof()\`: String-to-number conversions.
- **\`<math.h>\` (Mathematical Routines):**
  - \`sqrt()\`, \`pow()\`, \`sin()\`, \`cos()\`, \`ceil()\`, \`floor()\`, \`fabs()\`.
  - *Note: On GCC Linux, compile with \`-lm\` to link the math library.*
- **\`<ctype.h>\` (Character Classification):**
  - \`isalpha()\`, \`isdigit()\`, \`isspace()\`, \`toupper()\`, \`tolower()\`.
- **\`<time.h>\` (Date and Time Utilities):**
  - \`time()\`, \`clock()\`, \`difftime()\`.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Standard Library Showcase (<stdlib.h>, <math.h>, <time.h>)',
                code: `#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>

int main(void) {
    // Math functions
    double val = 16.0;
    printf("sqrt(%.1f) = %.2f\\n", val, sqrt(val));
    printf("2.0 ^ 5 = %.1f\\n", pow(2.0, 5.0));

    // Random numbers seeded by system time
    srand((unsigned int)time(NULL));
    int roll = (rand() % 6) + 1; // Die roll: 1 to 6
    printf("Random Die Roll: %d\\n", roll);

    // String to integer conversion
    char strNum[] = "456";
    int converted = atoi(strNum);
    printf("Converted integer: %d (x2 = %d)\\n", converted, converted * 2);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C standard library functions are organized into headers (<stdio.h>, <stdlib.h>, <math.h>, <ctype.h>). They provide robust, battle-tested utilities across platforms.",
            keyConcepts: ["Standard Headers", "Math Library Linking (-lm)", "Random Number Seeding (srand/time)", "String Conversion (atoi/atof)"],
            revisionNotes: "Always include the exact corresponding header file; calling library functions without headers leads to implicit declaration warnings."
        }
    },

    "6-4": {
        content: `### 6.4 Types of Parameter Passing in Functions

In C, the mechanism of passing data into functions is categorized into:
1. **Call by Value** (Default in C)
2. **Call by Reference** (Simulated using Pointers)

#### 1. Call by Value
- A **copy** of the actual parameter's value is passed into the function's formal parameter.
- The function operates entirely on its own private stack frame copies.
- **Changes made to formal parameters inside the function do NOT affect the caller's original variables.**

\`\`\`
 Caller Frame:            Called Frame:
 ┌──────────────┐         ┌──────────────┐
 │ int x = 10   │ ──────► │ int a = 10   │ (Copy created)
 └──────────────┘         └──────────────┘
 Original unchanged        Changes stay in stack frame
\`\`\`

#### 2. Call by Reference (Using Pointers)
- Instead of passing values, the **memory addresses** (\`&x\`) of the caller's variables are passed.
- The formal parameters are **pointers** (\`int *ptr\`) storing these memory addresses.
- By **dereferencing** the pointer (\`*ptr\`), the function directly reads and modifies the original memory location in the caller's stack frame.

#### Comparison: Call by Value vs. Call by Reference
| Attribute | Call by Value | Call by Reference (via Pointers) |
| :--- | :--- | :--- |
| **Data Passed** | Copy of actual values | Physical memory addresses (\`&var\`) |
| **Original Variable** | Protected from changes | Directly modified in place |
| **Formal Parameter** | Standard variable | Pointer variable (\`type*\`) |
| **Memory Overhead** | Copies entire data (inefficient for large structs) | Passes 8-byte pointer (fast and efficient) |`,
        codeSnippets: [
            {
                language: 'c',
                title: 'The Classic Swap: Call by Value vs Call by Reference',
                code: `#include <stdio.h>

// Call by Value: Fails to modify originals
void swapByValue(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}

// Call by Reference: Successfully modifies originals via pointers
void swapByReference(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int x = 10, y = 20;

    printf("Original: x = %d, y = %d\\n", x, y);

    swapByValue(x, y);
    printf("After swapByValue:     x = %d, y = %d (Unchanged!)\\n", x, y);

    swapByReference(&x, &y);
    printf("After swapByReference: x = %d, y = %d (Swapped!)\\n", x, y);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C is strictly Call by Value by default (copies are passed). Call by Reference is achieved by passing variable memory addresses (&) and dereferencing pointers (*) inside the function.",
            keyConcepts: ["Call by Value (Data Protection)", "Call by Reference (Pointer Addressing)", "The Swap Algorithm", "Memory Efficiency for Large Structures"],
            revisionNotes: "To allow a function to modify caller variables, pass their addresses: `func(&var)` and declare parameters as pointers: `void func(int *ptr)`."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 7: POINTERS
    // ═════════════════════════════════════════════════════════════════════════
    "7-1": {
        content: `### 7.1 Need of Pointers in 'C'

A **pointer** is a variable that stores the **physical memory address** of another variable. Pointers are the defining feature that grants C its legendary speed, control, and systems-level capabilities.

#### Why Pointers are Indispensable
1. **Dynamic Memory Allocation:** You cannot allocate heap memory at runtime (\`malloc\`) without pointer references.
2. **Efficient Data Passing:** Passing a 1,000,000-byte structure by value duplicates all 1,000,000 bytes. Passing a pointer copies only an 8-byte address.
3. **Complex Data Structures:** Linked lists, trees, graphs, and hash tables require pointer links between nodes.
4. **Direct Hardware Interaction:** Device drivers and operating systems interface with memory-mapped hardware I/O registers via raw pointers.
5. **Multiple Return Values:** Functions can return multiple outputs by modifying variables passed by address.

#### Fundamental Pointer Operators
- **Address-Of Operator (\`&\`):** Retrieves the physical memory address of a variable.
- **Dereference Operator (\`*\`):** Accesses the value stored at the memory address held by the pointer.

\`\`\`
 Variable: int age = 25;   (Address: 0x1004)
 Pointer:  int *ptr = &age;

 ┌───────────────┐              ┌───────────────┐
 │ ptr (0x1004)  │ ───────────► │ age (25)      │
 └───────────────┘              └───────────────┘
 Address: 0x2000                Address: 0x1004
\`\`\``,
        codeSnippets: [
            {
                language: 'c',
                title: 'Pointer Declaration, Addressing & Dereferencing',
                code: `#include <stdio.h>

int main(void) {
    int target = 42;
    int *ptr = &target; // ptr stores the address of target

    printf("Value of target:             %d\\n", target);
    printf("Address of target (&target): %p\\n", (void*)&target);
    printf("Value stored in ptr:         %p\\n", (void*)ptr);
    printf("Dereferenced value (*ptr):   %d\\n", *ptr);

    // Modifying target indirectly through the pointer
    *ptr = 99;
    printf("Target after indirect edit:  %d\\n", target);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "A pointer is a variable holding a memory address. The address-of operator (&) extracts an address; the dereference operator (*) accesses the value stored at that address.",
            keyConcepts: ["Memory Addresses (Hexadecimal)", "Address-Of (&)", "Dereferencing (*)", "Hardware/Systems Memory Control"],
            revisionNotes: "Always initialize pointers immediately: uninitialized pointers hold random addresses and dereferencing them causes fatal Segmentation Faults."
        }
    },

    "7-2": {
        content: `### 7.2 Types of Pointers in 'C'

Pointers are categorized based on their initialization state, data type targets, and runtime behaviors.

#### 1. Null Pointer
A pointer explicitly initialized to point to no valid memory address (\`NULL\` or \`0\`):
\`\`\`c
int *ptr = NULL;
\`\`\`
- Dereferencing a NULL pointer causes a deterministic segmentation fault.
- Used to indicate that a pointer has not yet been allocated or that a linked list has reached its end.

#### 2. Wild Pointer
A pointer that has been declared but **not initialized**:
\`\`\`c
int *ptr; // Wild pointer! Contains arbitrary garbage address
*ptr = 100; // DANGEROUS! Overwrites random memory
\`\`\`

#### 3. Dangling Pointer
A pointer that points to a memory location that has already been **deallocated or freed**:
\`\`\`c
int *ptr = (int*)malloc(sizeof(int));
free(ptr); // Memory returned to OS
// ptr is now a DANGLING pointer!
*ptr = 50; // Undefined behavior / Heap corruption!
\`\`\`
*Fix: Always set \`ptr = NULL;\` immediately after calling \`free(ptr);\`.*

#### 4. Generic / Void Pointer (\`void*\`)
A pointer that has no associated data type. Can hold the memory address of any type:
\`\`\`c
void *genPtr;
int x = 10;
float f = 3.14f;
genPtr = &x; // Valid
genPtr = &f; // Valid
\`\`\`
- Cannot be dereferenced directly without explicit type casting: \`*(float*)genPtr\`.

#### 5. Function Pointers
Pointers that point to executable code (functions) in the text segment rather than data in RAM.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Void Pointer Generic Printing & Dangling Prevention',
                code: `#include <stdio.h>
#include <stdlib.h>

void printGeneric(void *ptr, char type) {
    if (type == 'i') printf("Integer: %d\\n", *(int*)ptr);
    else if (type == 'f') printf("Float:   %.2f\\n", *(float*)ptr);
    else if (type == 'c') printf("Char:    %c\\n", *(char*)ptr);
}

int main(void) {
    int num = 120;
    float pi = 3.1415f;

    printGeneric(&num, 'i');
    printGeneric(&pi, 'f');

    // Safe deallocation pattern
    int *dynamicVal = (int*)malloc(sizeof(int));
    *dynamicVal = 500;
    free(dynamicVal);
    dynamicVal = NULL; // Defeats dangling pointer hazard

    if (dynamicVal == NULL) {
        printf("Dynamic pointer safely neutralized to NULL.\\n");
    }

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Pointer types include NULL pointers (pointing to 0), Wild pointers (uninitialized), Dangling pointers (pointing to freed memory), and Void pointers (generic void* pointers needing type casting).",
            keyConcepts: ["NULL Pointer Guard", "Wild Pointer Hazards", "Dangling Pointers & Heap Corruption", "Generic void* Pointers"],
            revisionNotes: "Always follow the rule: `free(ptr); ptr = NULL;` to eliminate dangling pointer bugs."
        }
    },

    "7-3": {
        content: `### 7.3 Pointer Expressions & Pointer Arithmetic

Pointer arithmetic is unique: it is scaled automatically by the **byte size of the data type** to which the pointer points.

#### Pointer Arithmetic Operations
1. **Incrementing (\`ptr++\`):** Moves the pointer forward to the **next element**.
   - New Address = Current Address + \`sizeof(*ptr)\`
   - If \`int *ptr\` is at address \`0x1000\`, \`ptr++\` moves to \`0x1004\` (4 bytes).
2. **Decrementing (\`ptr--\`):** Moves backward to the previous element.
3. **Adding / Subtracting an Integer (\`ptr + n\`):** Shifts by $n \\times \\text{sizeof}(*ptr)$ bytes.
4. **Pointer Subtraction (\`ptr2 - ptr1\`):**
   - Both pointers must point into the same array.
   - Result is the **number of elements** between them, not raw bytes.

\`\`\`
 Pointer Arithmetic on 4-byte Integers:
 [10]        [20]        [30]        [40]
 0x1000      0x1004      0x1008      0x100C
  ▲           ▲
 ptr         ptr + 1 (+4 bytes)
\`\`\`

#### Illegal Pointer Operations
- Adding two pointers together (\`ptr1 + ptr2\` is meaningless and illegal).
- Multiplying or dividing a pointer.
- Applying bitwise operators to pointers.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Array Traversal via Pointer Arithmetic',
                code: `#include <stdio.h>

int main(void) {
    int arr[] = {100, 200, 300, 400, 500};
    int *ptr = arr; // Points to arr[0]

    printf("Initial pointer address: %p, value: %d\\n", (void*)ptr, *ptr);

    ptr++; // Advances by sizeof(int) = 4 bytes
    printf("After ptr++: address:   %p, value: %d\\n", (void*)ptr, *ptr);

    // Access using offset: *(ptr + 2) is arr[3]
    printf("Value at *(ptr + 2):    %d\\n", *(ptr + 2));

    // Pointer distance subtraction
    int *end = &arr[4];
    printf("Elements between end and start: %td\\n", end - arr);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Pointer arithmetic is scaled by sizeof(data_type). ptr++ increments by the byte size of the target type. Pointer subtraction (ptr2 - ptr1) yields the number of elements between them.",
            keyConcepts: ["Scaled Arithmetic (+ sizeof(type))", "Pointer Incrementation", "Subscript Equivalence *(ptr + i) == arr[i]", "Pointer Subtraction (ptrdiff_t)"],
            revisionNotes: "Remember: `arr[i]` is identical to `*(arr + i)` in C. The compiler converts all array subscripts into pointer arithmetic."
        }
    },

    "7-4": {
        content: `### 7.4 Arrays of Pointers vs. Pointer to an Array

A critical distinction in C is the difference between an **Array of Pointers** and a **Pointer to an Array**.

#### 1. Array of Pointers (\`type *arr[N]\`)
- An array where **every element is a pointer** holding a memory address.
- Most commonly used to manage collections of strings of varying lengths (ragged string tables):
  \`\`\`c
  char *names[] = {"Dennis", "Ken", "Brian"};
  \`\`\`
- Memory efficient: Only allocates bytes for the exact length of each string literal, avoiding fixed matrix padding.

#### 2. Pointer to an Array (\`type (*ptr)[N]\`)
- A **single pointer** that points to an entire array of $N$ elements as a collective unit.
- Notice the parentheses \`(*ptr)\` due to operator precedence:
  - \`int *p[5];\`: Array of 5 integer pointers.
  - \`int (*p)[5];\`: Single pointer to an array of 5 integers.

\`\`\`
 Array of Pointers (char *cities[3]):
 cities[0] ────► "Tokyo\\0"      (6 bytes)
 cities[1] ────► "New York\\0"   (9 bytes)
 cities[2] ────► "Paris\\0"      (6 bytes)
\`\`\``,
        codeSnippets: [
            {
                language: 'c',
                title: 'Array of String Pointers vs Pointer to Array',
                code: `#include <stdio.h>

int main(void) {
    // Array of Pointers: Ragged string table
    const char *languages[] = {
        "C Systems",
        "Modern C++",
        "Python"
    };

    printf("--- Array of Pointers (String Table) ---\\n");
    for (int i = 0; i < 3; i++) {
        printf("Index %d points to: %s\\n", i, languages[i]);
    }

    // Pointer to an entire 1D array of 3 ints
    int numbers[3] = {10, 20, 30};
    int (*ptrToArray)[3] = &numbers;

    printf("\\n--- Pointer to Array ---\\n");
    printf("Value at (*ptrToArray)[1] = %d\\n", (*ptrToArray)[1]);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "An Array of Pointers (type *arr[N]) holds multiple address elements. A Pointer to an Array (type (*ptr)[N]) is a single pointer addressing a complete array block.",
            keyConcepts: ["Array of Pointers (Ragged Tables)", "Pointer to Array Syntax (*p)[N]", "Operator Precedence with [] and *"],
            revisionNotes: "Always use parentheses for pointer to an array: `int (*ptr)[5]`. Without parentheses, `int *ptr[5]` becomes an array of pointers."
        }
    },

    "7-5": {
        content: `### 7.5 Pointers and Functions

Pointers and functions interact in three major ways in C:
1. Passing pointers to functions (enabling call by reference).
2. Returning pointers from functions.
3. **Function Pointers:** Pointing directly to executable code for callbacks.

#### 1. Returning Pointers from Functions
A function can return a pointer to memory.
- **CRITICAL HAZARD:** **Never return a pointer to a local stack variable!** Local variables are destroyed when the function returns, leaving a dangling pointer pointing to an invalidated stack frame:
  \`\`\`c
  // DANGEROUS BUG!
  int* getVal() {
      int x = 10;
      return &x; // Crash! x is deallocated upon return
  }
  \`\`\`
- Safe approaches: Return pointers to **heap-allocated memory** (\`malloc\`) or \`static\` variables.

#### 2. Function Pointers
A function pointer holds the memory address of a function's machine code in the text segment:
\`\`\`c
return_type (*func_ptr_name)(param_types);
\`\`\`
- Enables dynamic callback mechanisms and event dispatch tables.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Function Pointer Callbacks in Practice',
                code: `#include <stdio.h>

int add(int a, int b) { return a + b; }
int multiply(int a, int b) { return a * b; }

// Higher-order function taking a function pointer as parameter
void compute(int a, int b, int (*operation)(int, int)) {
    int res = operation(a, b);
    printf("Computation Result: %d\\n", res);
}

int main(void) {
    // Function pointer declaration and assignment
    int (*opPtr)(int, int) = add;
    printf("Calling add via pointer: %d\\n", opPtr(10, 5));

    // Dynamic callbacks
    compute(10, 5, add);
    compute(10, 5, multiply);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Functions can accept and return pointers. Never return pointers to local stack variables. Function pointers store machine code addresses, enabling dynamic callbacks.",
            keyConcepts: ["Returning Pointers Safely (Heap/Static)", "Local Stack Dangling Return Hazard", "Function Pointers Syntax", "Callback Architecture"],
            revisionNotes: "Returning pointers to heap memory is safe, but requires the caller to assume responsibility for calling free()."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 8: STRUCTURE AND UNIONS
    // ═════════════════════════════════════════════════════════════════════════
    "8-1": {
        content: `### 8.1 Need of Structures in 'C'

While arrays store collections of elements of the **same data type**, real-world entities consist of **heterogeneous attributes** of differing types.

#### The Problem with Separate Variables
Consider representing a student:
- \`int roll_no;\` (4 bytes)
- \`char name[50];\` (50 bytes)
- \`float gpa;\` (4 bytes)
- \`char grade;\` (1 byte)

Managing these as separate arrays for 1,000 students (\`rolls[1000]\`, \`names[1000][50]\`, \`gpas[1000]\`) leads to fragmented code, lack of cohesion, and complex sorting operations.

#### The Structure Solution (\`struct\`)
A **structure** is a user-defined composite data type that allows you to group variables of **different data types** together under a single meaningful record name.

\`\`\`
 Real-World Student Entity
┌────────────────────────────────────────────────────────┐
│ struct Student                                         │
│ ├── int roll_no          (4 bytes)                     │
│ ├── char name[50]        (50 bytes)                    │
│ └── float gpa            (4 bytes)                     │
└────────────────────────────────────────────────────────┘
 Encapsulated into a single contiguous record in RAM
\`\`\``,
        codeSnippets: [
            {
                language: 'c',
                title: 'Declaring and Visualizing a Custom Structure',
                code: `#include <stdio.h>

// Defining the user-defined blueprint
struct Student {
    int roll_no;
    char name[40];
    float gpa;
};

int main(void) {
    struct Student s1 = {101, "Pranshu Pathak", 3.95f};

    printf("Student Record:\\n");
    printf("Roll Number: %d\\n", s1.roll_no);
    printf("Full Name:   %s\\n", s1.name);
    printf("GPA:         %.2f\\n", s1.gpa);
    printf("Total Memory Size: %zu bytes\\n", sizeof(struct Student));

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Structures encapsulate heterogeneous data types into a single compound record. They bridge the gap between primitive scalar variables and real-world domain objects.",
            keyConcepts: ["Heterogeneous Data Grouping", "Record Encapsulation", "struct Blueprint Declaration"],
            revisionNotes: "Defining a struct (struct Person { ... };) defines a blueprint; memory is only allocated when an instance variable is declared."
        }
    },

    "8-2": {
        content: `### 8.2 Implementing Structure Variables & Member Access

Once a structure template is defined, instance variables can be declared and manipulated using specialized member operators.

#### 1. Declaration and Initialization
\`\`\`c
struct Book {
    char title[50];
    char author[50];
    int pages;
    float price;
};

// Method 1: Positional initialization
struct Book b1 = {"The C Programming Language", "Dennis Ritchie", 272, 45.50f};

// Method 2: Designated initializers (C99 onwards)
struct Book b2 = {.title = "Operating Systems", .price = 65.00f};
\`\`\`

#### 2. Member Access Operators: Dot (\`.\`) vs. Arrow (\`->\`)
- **Dot Operator (\`.\`):** Used when accessing members directly through a **structure variable**:
  \`\`\`c
  printf("%s", b1.title);
  \`\`\`
- **Arrow Operator (\`->\`):** Used when accessing members through a **pointer to a structure**:
  \`\`\`c
  struct Book *ptr = &b1;
  printf("%s", ptr->title); // Equivalent to (*ptr).title
  \`\`\`

#### 3. Structure Padding and Memory Alignment
Compilers insert unused padding bytes between structure members so that data types align with native hardware word boundaries (e.g., 4-byte or 8-byte boundaries), optimizing CPU bus transfer speeds.
- Consequently, \`sizeof(struct)\` is often greater than the sum of its individual members.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Dot vs Arrow Member Operators and Memory Padding',
                code: `#include <stdio.h>

struct ServerNode {
    int id;           // 4 bytes
    char status;      // 1 byte (+ 3 bytes padding)
    double load_pct;  // 8 bytes
};

int main(void) {
    struct ServerNode srv = {1, 'A', 42.8};
    struct ServerNode *ptr = &srv;

    // Member access via Dot operator
    printf("Via Dot Operator:   ID = %d, Status = %c\\n", srv.id, srv.status);

    // Member access via Arrow operator
    printf("Via Arrow Operator: ID = %d, Load = %.1f%%\\n", ptr->id, ptr->load_pct);

    // Structure padding demonstration
    printf("Sum of member sizes: 4 + 1 + 8 = 13 bytes\\n");
    printf("Actual sizeof(struct): %zu bytes (padded to 8-byte boundary)\\n", 
           sizeof(struct ServerNode));

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Structure members are accessed using the dot operator (.) for values and arrow operator (->) for pointers. Compilers insert padding bytes to align data with hardware word boundaries.",
            keyConcepts: ["Dot Operator (.)", "Arrow Operator (->)", "Designated Initializers", "Structure Padding & Alignment"],
            revisionNotes: "Order structure members from largest to smallest (e.g., double, int, char) to minimize compiler padding bytes."
        }
    },

    "8-3": {
        content: `### 8.3 Arrays of Structures

An **Array of Structures** is a collection where every element is a complete structure record. It represents database tables where each array index corresponds to a row (record) and each structure field corresponds to a column (attribute).

#### Declaration Syntax
\`\`\`c
struct Student batch[60]; // Array holding 60 complete student records
\`\`\`

#### Memory Layout
Elements reside in contiguous physical memory. If \`sizeof(struct Student)\` is 64 bytes, \`batch[0]\` occupies bytes 0-63, \`batch[1]\` occupies bytes 64-127, and so forth.

\`\`\`
 batch[0]                batch[1]                batch[2]
┌───────────────────────┬───────────────────────┬───────────────────────┐
│ id | name | gpa       │ id | name | gpa       │ id | name | gpa       │
└───────────────────────┴───────────────────────┴───────────────────────┘
 Contiguous sequential blocks in memory
\`\`\``,
        codeSnippets: [
            {
                language: 'c',
                title: 'Array of Structures: Recording and Searching Records',
                code: `#include <stdio.h>

struct Employee {
    int id;
    char name[30];
    double salary;
};

int main(void) {
    struct Employee team[3] = {
        {101, "Alice Smith", 85000.0},
        {102, "Bob Jones",   72000.0},
        {103, "Carol White", 91000.0}
    };

    printf("--- Employee Directory ---\\n");
    for (int i = 0; i < 3; i++) {
        printf("ID: %d | Name: %-12s | Salary: $%.2f\\n", 
               team[i].id, team[i].name, team[i].salary);
    }

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "An Array of Structures stores multiple compound records contiguously. It models tabular database rows with zero-based indexing: arr[i].member.",
            keyConcepts: ["Tabular Data Representation", "Contiguous Record Storage", "Iteration with for loops", "Sorting and Searching Records"],
            revisionNotes: "To pass an array of structures to a function: `void process(struct Employee arr[], int size)`."
        }
    },

    "8-4": {
        content: `### 8.4 Structure within Structure (Nested Structures)

In complex domain modeling, structures often contain other structures as members. This is called **Structure Nesting**.

#### Implementing Nested Structures
Consider an Employee who has a joining Date:
\`\`\`c
struct Date {
    int day;
    int month;
    int year;
};

struct Employee {
    int id;
    char name[40];
    struct Date join_date; // Nested structure member
};
\`\`\`

#### Accessing Nested Members
Chain the dot (\`.\`) operators sequentially to reach inner members:
\`\`\`c
struct Employee emp;
emp.join_date.day = 15;
emp.join_date.month = 8;
emp.join_date.year = 2024;
\`\`\``,
        codeSnippets: [
            {
                language: 'c',
                title: 'Nested Structure Implementation',
                code: `#include <stdio.h>

struct Address {
    char city[30];
    char state[20];
    int zip_code;
};

struct Organization {
    char name[50];
    struct Address location; // Embedded structure
};

int main(void) {
    struct Organization org = {
        "HiGen Labs",
        {"San Francisco", "California", 94105}
    };

    printf("Organization: %s\\n", org.name);
    printf("City:         %s\\n", org.location.city);
    printf("State:        %s\\n", org.location.state);
    printf("Zip Code:     %d\\n", org.location.zip_code);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Nested structures embed one structure inside another, modeling hierarchical relationships. Members are accessed via chained dot operators: outer.inner.field.",
            keyConcepts: ["Hierarchical Data Modeling", "Composition", "Chained Dot Operator Navigation"],
            revisionNotes: "A structure cannot contain an instance of itself (infinite recursion), but it CAN contain a pointer to its own type (self-referential structure)."
        }
    },

    "8-5": {
        content: `### 8.5 Introduction to Unions in 'C'

A **\`union\`** is a user-defined data type similar to a structure, with one fundamental difference: **all members of a union share the exact same physical memory location**.

#### Memory Allocation in Unions
- In a \`struct\`, each member is allocated its own distinct memory offset.
- In a \`union\`, the compiler allocates only as much memory as is required by its **single largest member**.
- **Only one member can hold a valid value at any given time.** Assigning a new value to one member overwrites the shared memory space.

\`\`\`
 Memory Footprint Comparison:

 struct Example { int a; double b; }; (Total: 4 + 8 = 12 bytes + padding)
 ┌───────────────┬───────────────────────────────┐
 │ a (4 bytes)   │ b (8 bytes)                   │
 └───────────────┴───────────────────────────────┘

 union Example  { int a; double b; }; (Total: 8 bytes total)
 ┌───────────────────────────────────────────────┐
 │ Both a and b share these same 8 bytes         │
 └───────────────────────────────────────────────┘
\`\`\``,
        codeSnippets: [
            {
                language: 'c',
                title: 'Union Shared Memory Overwrite Demonstration',
                code: `#include <stdio.h>

union DataPacket {
    int intVal;
    float floatVal;
    char charVal;
};

int main(void) {
    union DataPacket packet;

    printf("Size of union DataPacket: %zu bytes (size of float/int)\\n\\n", 
           sizeof(union DataPacket));

    // Storing intVal
    packet.intVal = 1000;
    printf("Stored intVal:   %d\\n", packet.intVal);

    // Storing floatVal overwrites the shared memory!
    packet.floatVal = 3.14159f;
    printf("Stored floatVal: %.4f\\n", packet.floatVal);
    printf("intVal is now corrupted: %d (interpreted as float bits!)\\n", packet.intVal);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "A union shares a single memory location among all its members, sized to its largest member. Assigning a value to one member overwrites the others.",
            keyConcepts: ["Shared Memory Location", "Size Equals Largest Member", "Memory Overwriting Behavior", "Hardware Register Modeling"],
            revisionNotes: "Unions are widely used in low-level systems and network protocols to interpret the same raw bytes in different formats."
        }
    },

    "8-6": {
        content: `### 8.6 Difference between Structure and Union

Structures and unions represent two distinct approaches to grouping data in C systems programming.

#### Comprehensive Comparison Table
| Feature | Structure (\`struct\`) | Union (\`union\`) |
| :--- | :--- | :--- |
| **Keyword** | \`struct\` | \`union\` |
| **Memory Allocation** | Each member receives its own distinct memory address. | All members share the exact same starting memory address. |
| **Total Size** | Equal to the sum of all members (plus padding). | Exactly equal to the size of its largest member. |
| **Value Persistence** | All members hold their respective values simultaneously. | Only **one** member can hold a meaningful value at a time. |
| **Member Mutation** | Changing one member does not affect any other member. | Changing any member overwrites the values of all other members. |
| **Primary Use Case** | Modeling complex real-world entities (records, objects). | Low-level hardware drivers, packet parsing, memory conservation. |

#### When to Choose Structure vs. Union
- Use a **Structure** when an entity possesses multiple independent attributes simultaneously (e.g., an employee having an ID, a name, and a salary).
- Use a **Union** when an entity can only be one of several mutually exclusive formats at any one moment (e.g., a variant type that can be an integer, a float, or a string).`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Side-by-Side Comparison: struct vs union',
                code: `#include <stdio.h>

struct StructDemo {
    int id;
    double score;
};

union UnionDemo {
    int id;
    double score;
};

int main(void) {
    printf("Memory Size Comparison:\\n");
    printf("sizeof(struct StructDemo): %zu bytes (int 4 + double 8 + padding)\\n", 
           sizeof(struct StructDemo));
    printf("sizeof(union UnionDemo):   %zu bytes (largest member: double 8)\\n\\n", 
           sizeof(union UnionDemo));

    struct StructDemo s = {10, 99.5};
    printf("Struct simultaneously holds: ID = %d, Score = %.1f\\n", s.id, s.score);

    union UnionDemo u;
    u.id = 10;
    u.score = 99.5; // Overwrites id!
    printf("Union score is valid: %.1f, but ID is now corrupted: %d\\n", u.score, u.id);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Structures allocate independent memory for every member, permitting simultaneous value access. Unions share a single memory block sized to the largest member, conserving RAM.",
            keyConcepts: ["Independent vs Shared Memory", "Size Calculations", "Simultaneous vs Mutually Exclusive Data", "Tagged Union Idiom"],
            revisionNotes: "Combine a struct with a union to create a 'Tagged Union' (variant) that tracks which union field is currently active."
        }
    }
};

