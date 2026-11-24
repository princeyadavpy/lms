// Course-Wise default curricula with complete module and topic breakdowns
import { cEnrichedData } from './cEnrichedData';
import { cppEnrichedData } from './cppEnrichedData';
import { dsaEnrichedData } from './dsaEnrichedData';

export const getCourseWiseDefaultCurriculum = (courseId = '', code = '', title = '', category = '') => {
    const raw = `${courseId || ''} ${code || ''} ${title || ''} ${category || ''}`.toLowerCase();

    const isCpp = raw.includes('6afd5110bbfd6ce4b5bafacc') ||
        raw.includes('seed-cpp') ||
        raw.includes('cpp-oop-201') ||
        raw.includes('cpp') ||
        raw.includes('c++') ||
        raw.includes('c plus plus') ||
        raw.includes('modern c++') ||
        (category || '').trim().toUpperCase() === 'C++';

    const isC = !isCpp && (
        raw.includes('6afd5110bbfd6ce4b5bafacb') ||
        raw.includes('seed-c') ||
        raw.includes('c-sys-101') ||
        raw.includes('c-sys') ||
        raw.includes("programming in 'c'") ||
        raw.includes('programming in c') ||
        raw.includes('c systems') ||
        (category || '').trim().toUpperCase() === 'C' ||
        (code || '').trim().toUpperCase().startsWith('C-')
    );

    // =========================================================================
    // 1. PROGRAMMING IN 'C++' (Chapters 12 to 20)
    // =========================================================================
    if (isCpp) {
        const cppCurriculum = {
            title: "Programming in 'C++'",
            code: 'CPP-OOP-201',
            category: 'C++',
            level: 'Intermediate',
            overallPercentage: 0,
            modules: [
                {
                    _id: 'cpp-mod-1',
                    orderIndex: 1,
                    title: 'Module 01: Introduction to Object Oriented Programming',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'cpp-l1-1', orderIndex: 1, title: '12.1 Concept of OOP', isCompleted: false, content: '### Concept of Object-Oriented Programming\n\nParadigm organizing software design around data, or objects, rather than functions and logic.' },
                        { _id: 'cpp-l1-2', orderIndex: 2, title: '12.2 Features of OOP', isCompleted: false, content: '### Four Pillars of OOP\n\n1. **Encapsulation**: Bundling data with functions operating on that data.\n2. **Abstraction**: Hiding internal implementation details.\n3. **Inheritance**: Deriving new classes from existing parent classes.\n4. **Polymorphism**: Performing single actions in different ways.' },
                        { _id: 'cpp-l1-3', orderIndex: 3, title: "12.3 Introduction of 'C++'", isCompleted: false, content: "### Introduction to C++\n\nDesigned by Bjarne Stroustrup in 1979 as an extension of C with classes, strong type checking, and zero-overhead abstractions." },
                        { _id: 'cpp-l1-4', orderIndex: 4, title: "12.4 Structure of 'C++' Program", isCompleted: false, content: "### C++ Program Structure\n\n```cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Welcome to Modern C++!\" << endl;\n    return 0;\n}\n```" },
                        { _id: 'cpp-l1-5', orderIndex: 5, title: "12.5 Executing and Debugging a 'C++' Program", isCompleted: false, content: '### Compiling and Debugging C++\n\n`g++ -std=c++20 -Wall -g main.cpp -o app`\nDebugging runtime exceptions, core dumps, and memory leaks with Valgrind.' }
                    ]
                },
                {
                    _id: 'cpp-mod-2',
                    orderIndex: 2,
                    title: "Module 02: 'C++' Tokens and Type Casting",
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'cpp-l2-1', orderIndex: 1, title: '13.1 Keywords and Identifiers', isCompleted: false, content: '### C++ Keywords & Identifiers\n\nKeywords including `class`, `public`, `private`, `protected`, `template`, `virtual`, `constexpr`.' },
                        { _id: 'cpp-l2-2', orderIndex: 2, title: '13.2 Operators', isCompleted: false, content: '### C++ Operators\n\nScope resolution `::`, Stream insertion `<<`, Stream extraction `>>`, `new`, and `delete`.' },
                        { _id: 'cpp-l2-3', orderIndex: 3, title: '13.3 Constants', isCompleted: false, content: '### Constants & constexpr\n\n`const` variables and `constexpr` compile-time evaluated constants.' },
                        { _id: 'cpp-l2-4', orderIndex: 4, title: '13.4 Variables', isCompleted: false, content: '### Variables in C++\n\nReference variables (`int& ref = x;`) and auto type deduction (`auto y = 10;`).' },
                        { _id: 'cpp-l2-5', orderIndex: 5, title: '13.5 Data Types', isCompleted: false, content: '### Data Types\n\nPrimitive types, user-defined classes, `bool`, and `wchar_t`.' },
                        { _id: 'cpp-l2-6', orderIndex: 6, title: '13.6 Precedence of Operators', isCompleted: false, content: '### Operator Precedence\n\nEvaluation precedence hierarchy in C++.' },
                        { _id: 'cpp-l2-7', orderIndex: 7, title: '13.7 Scope and Lifetime of Variables', isCompleted: false, content: '### Scope Resolution & Namespaces\n\nNamespaces (`namespace HiGen { ... }`) preventing symbol collisions.' }
                    ]
                },
                {
                    _id: 'cpp-mod-3',
                    orderIndex: 3,
                    title: 'Module 03: Classes & Objects',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'cpp-l3-1', orderIndex: 1, title: '14.1 Classes & Object Specifier', isCompleted: false, content: '### Class Declaration & Access Specifiers\n\n`public`, `private`, `protected` visibility specifiers.' },
                        { _id: 'cpp-l3-2', orderIndex: 2, title: '14.2 Defining Data Members and Member Functions', isCompleted: false, content: '### Member Functions\n\nInline definitions vs outside definition using scope resolution `Class::func()`.' },
                        { _id: 'cpp-l3-3', orderIndex: 3, title: '14.3 Array of Objects', isCompleted: false, content: '### Array of Objects\n\n`Account bank[50];` instantiation and iteration.' },
                        { _id: 'cpp-l3-4', orderIndex: 4, title: '14.4 Managing Console I/O', isCompleted: false, content: '### Console Stream I/O\n\n`cin`, `cout`, `cerr`, `clog`.' },
                        { _id: 'cpp-l3-5', orderIndex: 5, title: "14.5 'C++' Stream Classes", isCompleted: false, content: '### I/O Stream Hierarchy\n\n`ios`, `istream`, `ostream`, `iostream`, `streambuf`.' },
                        { _id: 'cpp-l3-6', orderIndex: 6, title: '14.6 Formatted and Unformatted Console I/O', isCompleted: false, content: '### Formatted vs Unformatted I/O\n\n`get()`, `put()`, `getline()`, `write()`.' },
                        { _id: 'cpp-l3-7', orderIndex: 7, title: '14.7 Usage of Manipulators', isCompleted: false, content: '### I/O Manipulators\n\n`<iomanip>`: `setw()`, `setprecision()`, `setfill()`, `fixed`.' }
                    ]
                },
                {
                    _id: 'cpp-mod-4',
                    orderIndex: 4,
                    title: "Module 04: Function in 'C++'",
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'cpp-l4-1', orderIndex: 1, title: '15.1 Call by Reference, Return by Reference', isCompleted: false, content: '### C++ Reference Semantics\n\nPassing arguments and returning values by alias reference without copying.' },
                        { _id: 'cpp-l4-2', orderIndex: 2, title: '15.2 Function Overloading and Default Arguments', isCompleted: false, content: '### Function Overloading\n\nDefining multiple functions with identical names distinguished by parameter signatures.' },
                        { _id: 'cpp-l4-3', orderIndex: 3, title: '15.3 Inline Function', isCompleted: false, content: '### Inline Functions\n\n`inline` keyword advising the compiler to substitute function body directly at call site to eliminate call overhead.' },
                        { _id: 'cpp-l4-4', orderIndex: 4, title: '15.4 Static Class Members', isCompleted: false, content: '### Static Variables and Functions\n\nClass-level members shared across all object instances: `static int counter;`.' },
                        { _id: 'cpp-l4-5', orderIndex: 5, title: '15.5 Friend Functions', isCompleted: false, content: '### Friend Functions and Classes\n\n`friend` keyword granting non-member functions access to private class members.' },
                        { _id: 'cpp-l4-6', orderIndex: 6, title: '15.6 Virtual Functions', isCompleted: false, content: '### Virtual Functions & Dynamic Binding\n\nEnabling runtime polymorphism via vtables and vpointers.' }
                    ]
                },
                {
                    _id: 'cpp-mod-5',
                    orderIndex: 5,
                    title: 'Module 05: Constructors and Destructor',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'cpp-l5-1', orderIndex: 1, title: '16.1 Concept of Constructor', isCompleted: false, content: '### Constructors\n\nSpecial member functions called automatically upon object instantiation to initialize state.' },
                        { _id: 'cpp-l5-2', orderIndex: 2, title: '16.2 Types of Constructors', isCompleted: false, content: '### Constructor Variations\n\n- Default Constructor\n- Parameterized Constructor\n- Copy Constructor\n- Move Constructor (C++11)' },
                        { _id: 'cpp-l5-3', orderIndex: 3, title: '16.3 Memory Allocation (new and delete)', isCompleted: false, content: '### Dynamic Memory in C++\n\nType-safe allocation: `int* ptr = new int(10);` and `delete ptr;`.' },
                        { _id: 'cpp-l5-4', orderIndex: 4, title: '16.4 Usage of Destructor', isCompleted: false, content: '### Destructors (~Class)\n\nInvoked automatically when objects exit scope to release resources (RAII).' }
                    ]
                },
                {
                    _id: 'cpp-mod-6',
                    orderIndex: 6,
                    title: 'Module 06: Operator Overloading',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'cpp-l6-1', orderIndex: 1, title: '17.1 Overloading Unary and Binary Operators', isCompleted: false, content: '### Operator Overloading\n\nCustomizing operators (`+`, `-`, `*`, `==`, `[]`) for user-defined types: `Complex operator+(const Complex& other);`.' },
                        { _id: 'cpp-l6-2', orderIndex: 2, title: '17.2 Overloading using Friend Function', isCompleted: false, content: '### Stream Overloading via Friend Functions\n\nOverloading `<<` and `>>` operators for direct object stream printing.' }
                    ]
                },
                {
                    _id: 'cpp-mod-7',
                    orderIndex: 7,
                    title: 'Module 07: Inheritance',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'cpp-l7-1', orderIndex: 1, title: '18.1 Types of Inheritance', isCompleted: false, content: '### Inheritance Forms\n\nSingle, Multiple, Multilevel, Hierarchical, and Hybrid inheritance.' },
                        { _id: 'cpp-l7-2', orderIndex: 2, title: '18.2 Virtual Base Classes and Abstract Base Classes', isCompleted: false, content: '### Virtual Base Classes & Diamond Problem\n\nPreventing duplicate base class copies in hybrid inheritance; Pure virtual functions (`virtual void func() = 0;`) creating Abstract Classes.' },
                        { _id: 'cpp-l7-3', orderIndex: 3, title: '18.3 Constructor and Destructor in Derived Class', isCompleted: false, content: '### Constructor/Destructor Calling Order\n\nBase constructors execute first; Destructors execute in reverse derived-to-base order.' }
                    ]
                },
                {
                    _id: 'cpp-mod-8',
                    orderIndex: 8,
                    title: 'Module 08: Working with Files',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'cpp-l8-1', orderIndex: 1, title: '19.1 File Operations', isCompleted: false, content: '### File Stream Classes\n\n`<fstream>`: `ifstream` (read), `ofstream` (write), `fstream` (read/write).' },
                        { _id: 'cpp-l8-2', orderIndex: 2, title: '19.2 File Pointer and Their Manipulation', isCompleted: false, content: '### Get & Put Pointers\n\n`seekg()`, `seekp()`, `tellg()`, `tellp()` for byte-level positioning.' },
                        { _id: 'cpp-l8-3', orderIndex: 3, title: '19.3 File Updation with Random Access', isCompleted: false, content: '### Binary File Records\n\n`read((char*)&obj, sizeof(obj))` and `write()` for fast binary disk serialization.' }
                    ]
                },
                {
                    _id: 'cpp-mod-9',
                    orderIndex: 9,
                    title: 'Module 09: Exception Handling',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'cpp-l9-1', orderIndex: 1, title: '20.1 Various Exception Handling Classes', isCompleted: false, content: '### `<stdexcept>` Hierarchy\n\n`std::exception`, `std::runtime_error`, `std::logic_error`, `std::out_of_range`.' },
                        { _id: 'cpp-l9-2', orderIndex: 2, title: '20.2 Implementing Try and Catch Block', isCompleted: false, content: '### `try...catch` Blocks\n\nGuarding dangerous code sections and intercepting thrown exception objects.' },
                        { _id: 'cpp-l9-3', orderIndex: 3, title: '20.3 Use of Throw Keyword', isCompleted: false, content: '### The `throw` Keyword\n\nRaising explicit exceptions: `throw std::runtime_error("Invalid value");`.' }
                    ]
                }
            ]
        };

        cppCurriculum.modules = cppCurriculum.modules.map(mod => ({
            ...mod,
            lessons: (mod.lessons || []).map(les => {
                const key = `${mod.orderIndex}-${les.orderIndex}`;
                const enrichment = cppEnrichedData[key];
                return {
                    ...les,
                    content: enrichment?.content || les.content,
                    codeSnippets: enrichment?.codeSnippets || les.codeSnippets || [],
                    aiSummary: enrichment?.aiSummary || les.aiSummary || null
                };
            })
        }));

        return cppCurriculum;
    }

    // =========================================================================
    // 2. PROGRAMMING IN 'C' (Chapters 1 to 11)
    // =========================================================================
    if (isC) {
        const cCurriculum = {
            title: "Programming in 'C'",
            code: 'C-SYS-101',
            category: 'C',
            level: 'Beginner',
            overallPercentage: 0,
            modules: [
                {
                    _id: 'c-mod-1',
                    orderIndex: 1,
                    title: 'Module 01: Introduction of Programming Languages',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'c-l1-1', orderIndex: 1, title: '1.1 Types of Languages', isCompleted: false, content: '### Types of Programming Languages\n\nProgramming languages are categorized by abstraction level:\n\n1. **Low-Level Languages**: Machine Language (binary 0s and 1s) and Assembly Language (symbolic mnemonics like MOV, ADD).\n2. **High-Level Languages**: Human-readable syntax (C, C++, Java, Python) requiring compilers or interpreters to generate machine code.' },
                        { _id: 'c-l1-2', orderIndex: 2, title: "1.2 Evolution of 'C' Language", isCompleted: false, content: "### Evolution of 'C'\n\nDeveloped in 1972 by Dennis Ritchie at Bell Laboratories, C evolved from the **B** language (Ken Thompson) and **BCPL** (Martin Richards) to build the UNIX operating system." },
                        { _id: 'c-l1-3', orderIndex: 3, title: "1.3 Structure of a 'C' Program", isCompleted: false, content: "### Structure of a 'C' Program\n\n```c\n#include <stdio.h> // 1. Preprocessor Directive\n\n// 2. Global Declarations\n\nint main() {         // 3. Entry point\n    printf(\"Hello, HiGen Labs!\\n\"); // 4. Statements\n    return 0;        // 5. Exit Status\n}\n```" },
                        { _id: 'c-l1-4', orderIndex: 4, title: "1.4 'C' Program Development Life Cycle", isCompleted: false, content: "### 'C' Program Development Life Cycle\n\n1. **Source Code** (`.c` file)\n2. **Preprocessing**: Macro expansion and header file inclusion (`.i` file)\n3. **Compilation**: Assembly translation (`.s` file)\n4. **Assembly**: Machine code translation to Object file (`.o` / `.obj`)\n5. **Linking**: Linking object files and standard C library routines to produce an executable (`.exe` or ELF binary)." },
                        { _id: 'c-l1-5', orderIndex: 5, title: "1.5 Executing and Debugging a 'C' Program", isCompleted: false, content: "### Executing and Debugging\n\n- Compiling with GCC: `gcc -Wall -g main.c -o program`\n- Running binary: `./program`\n- Using GDB (GNU Debugger) to set breakpoints, inspect stack frames, and diagnose segmentation faults." }
                    ]
                },
                {
                    _id: 'c-mod-2',
                    orderIndex: 2,
                    title: "Module 02: 'C' Tokens",
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'c-l2-1', orderIndex: 1, title: '2.1 Keywords and Identifiers', isCompleted: false, content: "### Keywords & Identifiers\n\n- **Keywords**: 32 reserved words in ANSI C (e.g., `int`, `return`, `if`, `while`, `static`, `void`).\n- **Identifiers**: Programmer-defined names for variables, functions, and arrays." },
                        { _id: 'c-l2-2', orderIndex: 2, title: '2.2 Operators', isCompleted: false, content: '### Operators in C\n\nArithmetic (`+`, `-`, `*`, `/`, `%`), Relational (`==`, `!=`, `<`, `>`), Logical (`&&`, `||`, `!`), Bitwise (`&`, `|`, `^`, `~`, `<<`, `>>`), and Assignment (`=`, `+=`).' },
                        { _id: 'c-l2-3', orderIndex: 3, title: '2.3 Constants', isCompleted: false, content: '### Constants\n\nFixed values that cannot be altered during program execution: Integer literals, Floating-point literals, Character constants (`\'A\'`), and String literals (`"Hello"`).' },
                        { _id: 'c-l2-4', orderIndex: 4, title: '2.4 Variables', isCompleted: false, content: '### Variables\n\nNamed storage locations in memory bound to a data type: `int counter = 0;`.' },
                        { _id: 'c-l2-5', orderIndex: 5, title: '2.5 Data Types', isCompleted: false, content: '### Data Types in C\n\n- Primary: `char` (1B), `int` (4B), `float` (4B), `double` (8B), `void`\n- Derived: Arrays, Pointers, Structures, Unions\n- User-defined: `typedef`, `enum`.' },
                        { _id: 'c-l2-6', orderIndex: 6, title: '2.6 Precedence of Operators', isCompleted: false, content: '### Operator Precedence and Associativity\n\nDetermines evaluation order in complex expressions. Parentheses `()` have highest precedence, followed by unary operators, multiplicative, additive, relational, logical, and assignment.' },
                        { _id: 'c-l2-7', orderIndex: 7, title: '2.7 Scope and Lifetime of Variables', isCompleted: false, content: '### Variable Scope and Lifetime\n\n- **Local Scope (Block)**: Created on stack, destroyed when block exits.\n- **Global Scope (File)**: Allocated in Data segment, lives throughout program execution.' }
                    ]
                },
                {
                    _id: 'c-mod-3',
                    orderIndex: 3,
                    title: 'Module 03: Control Statement and Expressions',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'c-l3-1', orderIndex: 1, title: '3.1 Decision Making using if Statement', isCompleted: false, content: '### The `if` Statement\n\nExecutes a code block if the boolean condition evaluates to non-zero (true).' },
                        { _id: 'c-l3-2', orderIndex: 2, title: '3.2 Types of if ...else Block', isCompleted: false, content: '### if...else Variations\n\n- Simple `if`\n- `if...else`\n- Nested `if...else`\n- `else-if` Ladder' },
                        { _id: 'c-l3-3', orderIndex: 3, title: '3.3 Switch Case Block', isCompleted: false, content: '### Switch Case Statement\n\nMulti-way branch testing variable equality against constant case labels with optional `default` fallback.' },
                        { _id: 'c-l3-4', orderIndex: 4, title: '3.4 Arithmetic Expressions', isCompleted: false, content: '### Arithmetic Expressions\n\nCombinations of operands and operators following standard algebraic reduction rules.' },
                        { _id: 'c-l3-5', orderIndex: 5, title: '3.5 Evaluation of Expressions', isCompleted: false, content: '### Expression Evaluation & Type Promotion\n\nImplicit type conversion (promotion) converts smaller types (`char`, `short`) to `int` during arithmetic evaluation.' },
                        { _id: 'c-l3-6', orderIndex: 6, title: '3.6 GOTO Statement', isCompleted: false, content: '### GOTO Statement\n\nUnconditional jump statement transferring control to a specified label.' }
                    ]
                },
                {
                    _id: 'c-mod-4',
                    orderIndex: 4,
                    title: 'Module 04: Looping',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'c-l4-1', orderIndex: 1, title: '4.1 Concept of Loop', isCompleted: false, content: '### Repetitive Execution (Loops)\n\nIterative control structures repeating statements while a condition remains true.' },
                        { _id: 'c-l4-2', orderIndex: 2, title: '4.2 For Loop', isCompleted: false, content: '### The `for` Loop\n\n`for (initialization; condition; increment/decrement) { ... }`' },
                        { _id: 'c-l4-3', orderIndex: 3, title: '4.3 While Loop', isCompleted: false, content: '### The `while` Loop\n\nEntry-controlled loop validating condition before executing the loop body.' },
                        { _id: 'c-l4-4', orderIndex: 4, title: '4.4 Do While Loop', isCompleted: false, content: '### The `do...while` Loop\n\nExit-controlled loop executing body at least once before evaluating condition.' },
                        { _id: 'c-l4-5', orderIndex: 5, title: '4.5 Jumping in Loop', isCompleted: false, content: '### Jumping within Loops\n\nAltering standard loop iteration flow programmatically.' },
                        { _id: 'c-l4-6', orderIndex: 6, title: '4.6 Break and Continue Statement', isCompleted: false, content: '### Break vs Continue\n\n- `break`: Immediately terminates enclosing loop.\n- `continue`: Skips remainder of current iteration and jumps to loop step.' }
                    ]
                },
                {
                    _id: 'c-mod-5',
                    orderIndex: 5,
                    title: 'Module 05: Arrays and String',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'c-l5-1', orderIndex: 1, title: '5.1 Introduction of Array', isCompleted: false, content: '### Introduction to Arrays\n\nContiguous, fixed-size memory blocks storing homogeneous data elements.' },
                        { _id: 'c-l5-2', orderIndex: 2, title: '5.2 One - D Array', isCompleted: false, content: '### Single-Dimensional Arrays\n\nDeclaration, indexing (`arr[i]`), traversal, and memory mapping.' },
                        { _id: 'c-l5-3', orderIndex: 3, title: '5.3 Two - D Array', isCompleted: false, content: '### Two-Dimensional Arrays (Matrices)\n\nRow-major ordering representation: `int matrix[3][3];`.' },
                        { _id: 'c-l5-4', orderIndex: 4, title: '5.4 Multidimensional Array', isCompleted: false, content: '### Multidimensional Arrays\n\nExtending arrays to 3 or more dimensions for tensors and 3D coordinate grids.' },
                        { _id: 'c-l5-5', orderIndex: 5, title: '5.5 Dynamic Arrays', isCompleted: false, content: '### Dynamic Arrays\n\nHeap-allocated arrays resized via pointers and `realloc()`.' },
                        { _id: 'c-l5-6', orderIndex: 6, title: '5.6 Implementing String Variables', isCompleted: false, content: "### Strings in C\n\nNull-terminated character arrays: `char str[] = \"HiGen\";` (terminates with `\'\\0\'`)." },
                        { _id: 'c-l5-7', orderIndex: 7, title: '5.7 String Handling Functions', isCompleted: false, content: '### `<string.h>` Library Functions\n\n`strlen()`, `strcpy()`, `strncpy()`, `strcat()`, `strcmp()`, and `strstr()`.' }
                    ]
                },
                {
                    _id: 'c-mod-6',
                    orderIndex: 6,
                    title: 'Module 06: Functions',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'c-l6-1', orderIndex: 1, title: '6.1 Concept of Function', isCompleted: false, content: '### Modular Programming (Functions)\n\nSelf-contained blocks of code designed to perform specific subtasks.' },
                        { _id: 'c-l6-2', orderIndex: 2, title: '6.2 User Defined Function', isCompleted: false, content: '### User Defined Functions\n\nFunction prototype, definition, and invocation.' },
                        { _id: 'c-l6-3', orderIndex: 3, title: '6.3 System Defined Function', isCompleted: false, content: '### Standard Library Functions\n\nBuilt-in functions provided by headers (`<stdio.h>`, `<math.h>`, `<stdlib.h>`).' },
                        { _id: 'c-l6-4', orderIndex: 4, title: '6.4 Types of Parameter Passing in Function', isCompleted: false, content: '### Parameter Passing\n\n- **Call by Value**: Passes a copy of variable value.\n- **Call by Reference (via Pointers)**: Passes variable address, modifying original argument.' }
                    ]
                },
                {
                    _id: 'c-mod-7',
                    orderIndex: 7,
                    title: 'Module 07: Pointers',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'c-l7-1', orderIndex: 1, title: '7.1 Need of Pointers', isCompleted: false, content: '### Why Pointers?\n\nDirect memory addressing, dynamic memory allocation, efficient array passing, and data structures.' },
                        { _id: 'c-l7-2', orderIndex: 2, title: '7.2 Types of Pointers', isCompleted: false, content: '### Pointer Types\n\nNull pointer, Wild pointer, Dangling pointer, Void (generic) pointer, Function pointer.' },
                        { _id: 'c-l7-3', orderIndex: 3, title: '7.3 Pointer Expression', isCompleted: false, content: '### Pointer Arithmetic & Expressions\n\nIncrementing (`ptr++`), decrementing, and address offset arithmetic scaled by `sizeof(type)`.' },
                        { _id: 'c-l7-4', orderIndex: 4, title: '7.4 Arrays of Pointers', isCompleted: false, content: '### Array of Pointers\n\nStoring multiple memory addresses: `int* arr[5];`.' },
                        { _id: 'c-l7-5', orderIndex: 5, title: '7.5 Pointers and Functions', isCompleted: false, content: '### Pointers & Functions\n\nPassing pointers as arguments and returning memory pointers from functions.' }
                    ]
                },
                {
                    _id: 'c-mod-8',
                    orderIndex: 8,
                    title: 'Module 08: Structure and Unions',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'c-l8-1', orderIndex: 1, title: '8.1 Need of Structure', isCompleted: false, content: '### Heterogeneous Data Collections\n\nStructures allow grouping different data types under one logical record name.' },
                        { _id: 'c-l8-2', orderIndex: 2, title: '8.2 Implementing Structure Variable', isCompleted: false, content: '### Structure Declaration & Access\n\n`struct Student { int roll; char name[50]; float gpa; };`\nAccessed via member access operator (`.` or `->`).' },
                        { _id: 'c-l8-3', orderIndex: 3, title: '8.3 Arrays of Structure', isCompleted: false, content: '### Array of Structures\n\n`struct Student batch[100];` for managing collections of structured records.' },
                        { _id: 'c-l8-4', orderIndex: 4, title: '8.4 Structure within Structure', isCompleted: false, content: '### Nested Structures\n\nEmbedding a structure as a member inside another parent structure.' },
                        { _id: 'c-l8-5', orderIndex: 5, title: '8.5 Introduction of Unions', isCompleted: false, content: '### Unions\n\nData structures where all members share the same single memory location (sized to largest member).' },
                        { _id: 'c-l8-6', orderIndex: 6, title: '8.6 Difference between Structure and Unions', isCompleted: false, content: '### Structures vs Unions\n\nStructures allocate separate memory for each member; Unions share a single memory block among all members.' }
                    ]
                },
                {
                    _id: 'c-mod-9',
                    orderIndex: 9,
                    title: "Module 09: File Handling using 'C'",
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'c-l9-1', orderIndex: 1, title: '9.1 Opening and Closing File', isCompleted: false, content: '### File Pointers\n\n`FILE *fp = fopen("data.txt", "r");` and `fclose(fp);`.' },
                        { _id: 'c-l9-2', orderIndex: 2, title: '9.2 Input / Output Operations on File', isCompleted: false, content: '### Stream I/O Operations\n\n`fgetc()`, `fputc()`, `fgets()`, `fputs()`, `fprintf()`, `fscanf()`, `fread()`, `fwrite()`.' },
                        { _id: 'c-l9-3', orderIndex: 3, title: '9.3 Random Access to Files', isCompleted: false, content: '### Random File Access\n\nRepositioning file indicator with `fseek()`, `ftell()`, and `rewind()`.' },
                        { _id: 'c-l9-4', orderIndex: 4, title: '9.4 Command Line Arguments', isCompleted: false, content: '### CLI Arguments\n\n`int main(int argc, char *argv[])` for parsing shell arguments at program start.' }
                    ]
                },
                {
                    _id: 'c-mod-10',
                    orderIndex: 10,
                    title: 'Module 10: Dynamic Memory Allocation',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'c-l10-1', orderIndex: 1, title: '10.1 Concept of Dynamic Allocation', isCompleted: false, content: '### Dynamic Memory Allocation (Heap)\n\nAllocating memory buffers at runtime whose sizes are not known at compile time.' },
                        { _id: 'c-l10-2', orderIndex: 2, title: '10.2 Implementing Malloc and Calloc Functions', isCompleted: false, content: '### malloc vs calloc vs realloc\n\n- `malloc(size)`: Allocates raw uninitialized byte block.\n- `calloc(n, size)`: Allocates and initializes bytes to zero.\n- `realloc(ptr, new_size)`: Resizes existing block.' },
                        { _id: 'c-l10-3', orderIndex: 3, title: '10.3 Releasing the Free Space', isCompleted: false, content: '### Releasing Memory (`free`)\n\n`free(ptr); ptr = NULL;` to avoid memory leaks and dangling pointers.' }
                    ]
                },
                {
                    _id: 'c-mod-11',
                    orderIndex: 11,
                    title: 'Module 11: Storage Classes and Pre-processor',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'c-l11-1', orderIndex: 1, title: '11.1 Introduction of Storage Class', isCompleted: false, content: '### Storage Classes Overview\n\nDefines lifetime, visibility, and initial value of variables.' },
                        { _id: 'c-l11-2', orderIndex: 2, title: '11.2 Types of Storage Classes', isCompleted: false, content: '### Storage Class Specifiers\n\n`auto`, `register`, `static`, `extern`.' },
                        { _id: 'c-l11-3', orderIndex: 3, title: '11.3 Introduction of Pre-processor', isCompleted: false, content: '### The C Preprocessor\n\nProcesses code directives beginning with `#` before compilation.' },
                        { _id: 'c-l11-4', orderIndex: 4, title: '11.4 Macro Substitution', isCompleted: false, content: '### Preprocessor Macros\n\n`#define PI 3.14159` and parameterized macros `#define SQUARE(x) ((x) * (x))`.' },
                        { _id: 'c-l11-5', orderIndex: 5, title: '11.5 File Inclusion', isCompleted: false, content: '### Header Inclusion\n\n`#include <header.h>` for standard libraries and `#include "custom.h"` for user-defined files.' }
                    ]
                }
            ]
        };

        cCurriculum.modules = cCurriculum.modules.map(mod => ({
            ...mod,
            lessons: (mod.lessons || []).map(les => {
                const key = `${mod.orderIndex}-${les.orderIndex}`;
                const enrichment = cEnrichedData[key];
                return {
                    ...les,
                    content: enrichment?.content || les.content,
                    codeSnippets: enrichment?.codeSnippets || les.codeSnippets || [],
                    aiSummary: enrichment?.aiSummary || les.aiSummary || null
                };
            })
        }));

        return cCurriculum;
    }

    // =========================================================================
    // 3. OTHER TRACKS (DSA, ML, DL, GENAI, AGENTIC, JAVA)
    // =========================================================================
    if (raw.includes('dsa') || raw.includes('algorithm')) {
        const dsaCurriculum = {
            title: 'Data Structures and Algorithms (DSA)',
            code: 'DSA-MODERN-2',
            category: 'DSA',
            level: 'Intermediate',
            overallPercentage: 0,
            modules: [
                {
                    _id: 'dsa-mod-1',
                    orderIndex: 1,
                    title: 'Module 01: Algorithm',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'dsa-l1-1', orderIndex: 1, title: '1.1 Data Structure def, classification, ADT', isCompleted: false, content: '### Data Structure Definition, Classification & ADT\n\nPrimitive vs Non-primitive, Linear vs Non-linear structures, and Abstract Data Types (ADT).' },
                        { _id: 'dsa-l1-2', orderIndex: 2, title: '1.2 Algorithm representation and complexity', isCompleted: false, content: '### Algorithm Representation and Asymptotic Complexity\n\nPseudocode representation, Big-O, Omega, and Theta asymptotic complexity notations.' },
                        { _id: 'dsa-l1-3', orderIndex: 3, title: '1.3 Pointers, strings, arrays (1-D and n-D)', isCompleted: false, content: '### Pointers, Strings, and Multi-Dimensional Arrays\n\nMemory addressing, pointer arithmetic, null-terminated strings, and row-major array indexing.' },
                        { _id: 'dsa-l1-4', orderIndex: 4, title: '1.4 Elapsed time', isCompleted: false, content: '### Elapsed Time and Performance Profiling\n\nBenchmarking algorithm wall-clock runtime in ANSI C using clock() and time.h.' },
                        { _id: 'dsa-l1-5', orderIndex: 5, title: '1.5 malloc, realloc, calloc', isCompleted: false, content: '### Dynamic Memory Allocation\n\nmalloc, calloc zero-initialization, realloc buffer resizing, and free memory deallocation.' }
                    ]
                },
                {
                    _id: 'dsa-mod-2',
                    orderIndex: 2,
                    title: 'Module 02: Stacks',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'dsa-l2-1', orderIndex: 1, title: '2.1 Stacks', isCompleted: false, content: '### Stacks\n\nLIFO discipline, push, pop, peek operations, array and linked stack implementations.' },
                        { _id: 'dsa-l2-2', orderIndex: 2, title: '2.2 Pre-, in-, post-fix conversions', isCompleted: false, content: '### Pre-, In-, and Post-fix Conversions\n\nInfix, Polish, and Reverse Polish notation (RPN) conversion via Shunting-yard algorithm.' },
                        { _id: 'dsa-l2-3', orderIndex: 3, title: '2.3 Evaluations of expressions', isCompleted: false, content: '### Expression Evaluation\n\nEvaluating postfix arithmetic expressions with a stack in O(n) linear time.' }
                    ]
                },
                {
                    _id: 'dsa-mod-3',
                    orderIndex: 3,
                    title: 'Module 03: Lists and Queues',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'dsa-l3-1', orderIndex: 1, title: '3.1 Linked lists', isCompleted: false, content: '### Linked Lists\n\nSingly and doubly linked lists, node insertion, deletion, reversal, and traversal.' },
                        { _id: 'dsa-l3-2', orderIndex: 2, title: '3.2 Queues', isCompleted: false, content: '### Queues\n\nFIFO discipline, enqueue, dequeue, front and rear pointer operations.' },
                        { _id: 'dsa-l3-3', orderIndex: 3, title: '3.3 Circular queues', isCompleted: false, content: '### Circular Queues\n\nModulo arithmetic ring buffers preventing linear queue false overflow.' }
                    ]
                },
                {
                    _id: 'dsa-mod-4',
                    orderIndex: 4,
                    title: 'Module 04: Recursion',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'dsa-l4-1', orderIndex: 1, title: '4.1 Simple recursion', isCompleted: false, content: '### Simple Recursion\n\nRecursive mechanics, base cases, and call stack activation frames.' },
                        { _id: 'dsa-l4-2', orderIndex: 2, title: '4.2 Fibonacci numbers', isCompleted: false, content: '### Fibonacci Numbers\n\nRecurrence relations, recursion tree visualization, and overlapping subproblems.' },
                        { _id: 'dsa-l4-3', orderIndex: 3, title: '4.3 Backtracking: 8-queen problem', isCompleted: false, content: '### Backtracking: 8-Queens Problem\n\nState-space tree exploration, constraint pruning, and solving the 8-queens problem.' }
                    ]
                },
                {
                    _id: 'dsa-mod-5',
                    orderIndex: 5,
                    title: 'Module 05: Searching Algorithms',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'dsa-l5-1', orderIndex: 1, title: '5.1 Linear search', isCompleted: false, content: '### Linear Search (Sequential Search)\n\nSequential scanning of elements from index 0 to n-1 with early-exit and sentinel optimization in O(n) linear time.' },
                        { _id: 'dsa-l5-2', orderIndex: 2, title: '5.2 Binary search', isCompleted: false, content: '### Binary Search\n\nLogarithmic search O(log n) over sorted arrays avoiding integer midpoint overflow.' },
                        { _id: 'dsa-l5-3', orderIndex: 3, title: '5.3 Quickselect', isCompleted: false, content: '### Quickselect (Order Statistics Search)\n\nFinding the k-th smallest element in average linear O(n) time using recursive partition pruning without full sorting.' }
                    ]
                },
                {
                    _id: 'dsa-mod-6',
                    orderIndex: 6,
                    title: 'Module 06: Sorting Algorithms',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'dsa-l6-1', orderIndex: 1, title: '6.1 Bubble sort', isCompleted: false, content: '### Bubble Sort\n\nAdjacent pairwise comparisons and bubble-up swaps with early-termination flag optimization.' },
                        { _id: 'dsa-l6-2', orderIndex: 2, title: '6.2 Selection sort', isCompleted: false, content: '### Selection Sort\n\nIn-place quadratic O(n^2) sort selecting minimum elements with at most O(n) swaps.' },
                        { _id: 'dsa-l6-3', orderIndex: 3, title: '6.3 Insertion sort', isCompleted: false, content: '### Insertion Sort\n\nAdaptive card-shifting sorting with linear O(n) best-case for nearly-sorted data.' },
                        { _id: 'dsa-l6-4', orderIndex: 4, title: '6.4 Mergesort', isCompleted: false, content: '### Merge Sort\n\nDivide-and-conquer two-way merging guaranteeing O(n log n) runtime across all cases.' },
                        { _id: 'dsa-l6-5', orderIndex: 5, title: '6.5 Quicksort', isCompleted: false, content: '### Quicksort\n\nIn-place recursive partitioning with Lomuto pivot placement in O(n log n) average time.' },
                        { _id: 'dsa-l6-6', orderIndex: 6, title: '6.6 Heapsort', isCompleted: false, content: '### Heapsort\n\nIn-place max-heap construction and root extraction guaranteeing O(n log n) sorting.' },
                        { _id: 'dsa-l6-7', orderIndex: 7, title: '6.7 Counting sort', isCompleted: false, content: '### Counting Sort\n\nNon-comparison integer sorting using frequency counts and cumulative prefix sums in O(n + k) time.' }
                    ]
                },
                {
                    _id: 'dsa-mod-7',
                    orderIndex: 7,
                    title: 'Module 07: Graph Theory',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'dsa-l7-1', orderIndex: 1, title: '7.1 Graphs', isCompleted: false, content: '### Graphs\n\nAdjacency Matrix vs Adjacency List representations and graph traversal fundamentals.' },
                        { _id: 'dsa-l7-2', orderIndex: 2, title: '7.2 Simple trees', isCompleted: false, content: '### Simple Trees\n\nHierarchical structures, root, depth, height, and leaf node definitions.' },
                        { _id: 'dsa-l7-3', orderIndex: 3, title: '7.3 Heaps, heapsort', isCompleted: false, content: '### Heaps and Heapsort\n\nComplete binary trees in arrays, heapify, and O(n log n) in-place sorting.' },
                        { _id: 'dsa-l7-4', orderIndex: 4, title: '7.4 Priority queues', isCompleted: false, content: '### Priority Queues\n\nPriority queue ADT backed by binary heaps for logarithmic insertions and extractions.' },
                        { _id: 'dsa-l7-5', orderIndex: 5, title: '7.5 Binary trees, n-ary trees', isCompleted: false, content: '### Binary Trees & N-ary Trees\n\nFull, complete, and perfect binary trees, plus Left-Child Right-Sibling representation.' },
                        { _id: 'dsa-l7-6', orderIndex: 6, title: '7.6 Binary search trees', isCompleted: false, content: '### Binary Search Trees\n\nBST property, search, insertion, and 3-case deletion with inorder successors.' },
                        { _id: 'dsa-l7-7', orderIndex: 7, title: '7.7 Traversals', isCompleted: false, content: '### Tree Traversals\n\nDepth-First (Inorder, Preorder, Postorder) and Breadth-First Level-Order traversals.' },
                        { _id: 'dsa-l7-8', orderIndex: 8, title: '7.8 Trie tree', isCompleted: false, content: '### Trie Tree\n\nPrefix tree dictionary structure supporting O(L) string insertions and lookups.' },
                        { _id: 'dsa-l7-9', orderIndex: 9, title: '7.9 Kruskal’s MST using disjoint sets', isCompleted: false, content: '### Kruskal Minimum Spanning Tree\n\nGreedy edge sorting and cycle prevention via Disjoint Set Union (DSU).' },
                        { _id: 'dsa-l7-10', orderIndex: 10, title: '7.10 Dijkstra\'s Algorithm', isCompleted: false, content: '### Dijkstra Shortest Path\n\nSingle-source shortest path algorithm using greedy distance relaxation and min-heaps.' },
                        { _id: 'dsa-l7-11', orderIndex: 11, title: '7.11 Disjoint sets', isCompleted: false, content: '### Disjoint Sets\n\nUnion-Find with path compression and union by rank achieving O(alpha(n)) amortized time.' },
                        { _id: 'dsa-l7-12', orderIndex: 12, title: '7.12 Floyd-Warshall\'s algorithm', isCompleted: false, content: '### Floyd-Warshall Algorithm\n\nDynamic programming all-pairs shortest paths matrix algorithm in O(V^3) time.' },
                        { _id: 'dsa-l7-13', orderIndex: 13, title: '7.13 BFS and DFS searches', isCompleted: false, content: '### BFS and DFS Searches\n\nBreadth-first and depth-first search explorations for graph traversal and paths.' },
                        { _id: 'dsa-l7-14', orderIndex: 14, title: '7.14 AVL trees, B-trees', isCompleted: false, content: '### Balanced Trees: AVL & B-Trees\n\nSelf-balancing AVL trees with rotations and multi-way disk B-trees.' },
                        { _id: 'dsa-l7-15', orderIndex: 15, title: '7.15 Threaded trees', isCompleted: false, content: '### Threaded Trees\n\nBinary trees utilizing null pointers for stack-free in-order traversal.' }
                    ]
                },
                {
                    _id: 'dsa-mod-8',
                    orderIndex: 8,
                    title: 'Module 08: Hashing',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'dsa-l8-1', orderIndex: 1, title: '8.1 Hashing by chaining', isCompleted: false, content: '### Hashing by Chaining\n\nHash functions, load factor management, and collision resolution via separate chaining.' },
                        { _id: 'dsa-l8-2', orderIndex: 2, title: '8.2 Perfect hashing function', isCompleted: false, content: '### Perfect Hashing\n\nZero-collision universal two-level hashing guaranteeing O(1) worst-case lookup.' }
                    ]
                },
                {
                    _id: 'dsa-mod-9',
                    orderIndex: 9,
                    title: 'Module 09: String algorithms',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'dsa-l9-1', orderIndex: 1, title: '9.1 Simple string manipulations', isCompleted: false, content: '### Simple String Manipulations\n\nNull-terminated character arrays, pointer manipulation, and manual string functions.' },
                        { _id: 'dsa-l9-2', orderIndex: 2, title: '9.2 Pattern search with Rabin-Karp approach', isCompleted: false, content: '### Rabin-Karp Pattern Search\n\nRolling hash substring searching with O(n+m) average-time pattern matching.' }
                    ]
                }
            ]
        };

        dsaCurriculum.modules = dsaCurriculum.modules.map(mod => ({
            ...mod,
            lessons: (mod.lessons || []).map(les => {
                const key = `${mod.orderIndex}-${les.orderIndex}`;
                const enrichment = dsaEnrichedData[key];
                return {
                    ...les,
                    title: enrichment?.title || les.title,
                    content: enrichment?.content || les.content,
                    codeSnippets: enrichment?.codeSnippets || les.codeSnippets || [],
                    aiSummary: enrichment?.aiSummary || les.aiSummary || null
                };
            })
        }));

        return dsaCurriculum;
    }

    if (raw.includes('ml') || raw.includes('machine-learning')) {
        return {
            title: 'Machine Learning & Predictive Modeling',
            code: 'ML-201',
            category: 'ML',
            level: 'Intermediate',
            overallPercentage: 0,
            modules: [
                {
                    _id: 'ml-mod-1',
                    orderIndex: 1,
                    title: 'Module 01: Linear Regression & Gradient Descent',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'ml-l1-1', orderIndex: 1, title: 'Hypothesis Function, Cost Function (MSE) & Convexity', isCompleted: false, content: '### Linear Regression Fundamentals\n\nMinimizing MSE loss with gradient descent optimization.' }
                    ]
                }
            ]
        };
    }

    if (raw.includes('dl') || raw.includes('deep-learning') || raw.includes('pytorch')) {
        return {
            title: 'Deep Learning, Neural Networks & PyTorch',
            code: 'DL-301',
            category: 'DL',
            level: 'Advanced',
            overallPercentage: 0,
            modules: [
                {
                    _id: 'dl-mod-1',
                    orderIndex: 1,
                    title: 'Module 01: Perceptrons, Multi-Layer Architectures & Activations',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'dl-l1-1', orderIndex: 1, title: 'Forward Propagation, Non-Linear Activations & Softmax', isCompleted: false, content: '### Multi-Layer Perceptrons\n\nNeural networks stack affine matrix transformations with non-linear activation functions.' }
                    ]
                }
            ]
        };
    }

    if (raw.includes('gen') || raw.includes('llm')) {
        return {
            title: 'Generative AI, LLMs & Prompt Engineering',
            code: 'GENAI-401',
            category: 'GEN AI',
            level: 'Advanced',
            overallPercentage: 0,
            modules: [
                {
                    _id: 'gen-mod-1',
                    orderIndex: 1,
                    title: 'Module 01: Transformer Architecture & Scaled Dot-Product Attention',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'gen-l1-1', orderIndex: 1, title: 'Self-Attention Mechanisms & Matrix Operations', isCompleted: false, content: '### Attention Mechanisms\n\nScaled dot-product attention and transformer architecture.' }
                    ]
                }
            ]
        };
    }

    if (raw.includes('agent') || raw.includes('agnt')) {
        return {
            title: 'Agentic AI & Autonomous Multi-Agent Systems',
            code: 'AGNT-501',
            category: 'AGENTIC AI',
            level: 'Advanced',
            overallPercentage: 0,
            modules: [
                {
                    _id: 'agent-mod-1',
                    orderIndex: 1,
                    title: 'Module 01: The ReAct Framework & Autonomous Decision Loops',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'agent-l1-1', orderIndex: 1, title: 'Thought, Action, Tool Calling & Environmental Feedback', isCompleted: false, content: '### Autonomous Agents\n\nCombining reasoning traces with tool execution.' }
                    ]
                }
            ]
        };
    }

    if (raw.includes('java')) {
        return {
            title: 'Java Enterprise & Backend Engineering',
            code: 'JAVA-ENT-201',
            category: 'JAVA',
            level: 'Intermediate',
            overallPercentage: 0,
            modules: [
                {
                    _id: 'java-mod-1',
                    orderIndex: 1,
                    title: 'Module 01: JVM Internal Architecture & Memory Management',
                    isLocked: false,
                    isCompleted: false,
                    progressPercent: 0,
                    lessons: [
                        { _id: 'java-l1-1', orderIndex: 1, title: 'ClassLoader, Metaspace, Heap Generations & Garbage Collection', isCompleted: false, content: '### JVM Architecture\n\nRuntime data areas, Eden/Survivor/Tenured heap, and Garbage Collection.' }
                    ]
                }
            ]
        };
    }

    return null;
};
