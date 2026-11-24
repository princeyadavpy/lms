const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
const Course = require('./models/Course');

const cQuizzes = {
    1: {
        title: "Module 01: Programming Fundamentals & C Life Cycle Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "Which stage in the C compilation lifecycle combines compiled object files (.o/.obj) with runtime libraries to create an executable binary?",
                type: "MCQ",
                options: ["Preprocessor", "Compiler", "Assembler", "Linker"],
                correctAnswer: "Linker",
                explanation: "The Linker (ld) resolves external symbol references and bundles object files with standard C runtime libraries into a final executable binary.",
                marks: 5
            },
            {
                questionText: "Who originally created the 'C' programming language at Bell Laboratories in 1972?",
                type: "MCQ",
                options: ["Bjarne Stroustrup", "Dennis Ritchie", "Ken Thompson", "James Gosling"],
                correctAnswer: "Dennis Ritchie",
                explanation: "Dennis Ritchie developed the C programming language at Bell Labs to re-implement the UNIX operating system.",
                marks: 5
            },
            {
                questionText: "What is the primary function of the preprocessor directive '#include <stdio.h>'?",
                type: "MCQ",
                options: [
                    "Directs the preprocessor to paste standard I/O function prototypes into the source",
                    "Compiles the input/output code into machine instructions",
                    "Executes the main function",
                    "Allocates standard RAM for console printing"
                ],
                correctAnswer: "Directs the preprocessor to paste standard I/O function prototypes into the source",
                explanation: "#include tells the C preprocessor to copy-paste the contents of stdio.h (declarations of printf, scanf, etc.) into the translation unit before compilation.",
                marks: 5
            },
            {
                questionText: "Which GCC command line flag specifies the output executable file name?",
                type: "MCQ",
                options: ["-c", "-o", "-Wall", "-E"],
                correctAnswer: "-o",
                explanation: "The '-o <filename>' flag instructs the compiler/linker to write the executable to the designated filename instead of the default 'a.out'.",
                marks: 5
            }
        ]
    },
    2: {
        title: "Module 02: 'C' Tokens & Data Types Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "How many reserved keywords are defined in the ANSI C (C89/C90) standard?",
                type: "MCQ",
                options: ["24", "32", "48", "64"],
                correctAnswer: "32",
                explanation: "ANSI C (C89/C90) defines exactly 32 reserved keywords (e.g., auto, break, case, char, const, continue, default, do, double, else, enum, etc.).",
                marks: 5
            },
            {
                questionText: "Which of the following is a legal and valid identifier in C?",
                type: "MCQ",
                options: ["2nd_counter", "_valid_var1", "total-sum", "float"],
                correctAnswer: "_valid_var1",
                explanation: "C identifiers can contain letters, digits, and underscores, but cannot start with a digit, cannot contain hyphens, and cannot match a reserved keyword.",
                marks: 5
            },
            {
                questionText: "According to the C standard, what is the exact return value of sizeof(char)?",
                type: "MCQ",
                options: ["Always 1 byte", "2 bytes", "4 bytes", "Dependent on CPU architecture"],
                correctAnswer: "Always 1 byte",
                explanation: "By definition in the C language standard (ISO C), sizeof(char) is guaranteed to be 1 byte.",
                marks: 5
            },
            {
                questionText: "What is the evaluated result of the expression: 10 + 4 * 3 / 2 in C?",
                type: "MCQ",
                options: ["21", "16", "26", "11"],
                correctAnswer: "16",
                explanation: "* and / share higher precedence than + and evaluate left-to-right: 4 * 3 = 12; 12 / 2 = 6; 10 + 6 = 16.",
                marks: 5
            }
        ]
    },
    3: {
        title: "Module 03: Control Statements & Expressions Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "In C condition evaluation, which value is treated as Boolean FALSE?",
                type: "MCQ",
                options: ["0 only", "-1", "Any non-zero integer", "NULL pointer only"],
                correctAnswer: "0 only",
                explanation: "In C, the integer value 0 evaluates to false, while any non-zero numeric value (positive or negative) evaluates to true.",
                marks: 5
            },
            {
                questionText: "What happens when a 'break' statement is omitted from a matched case in a switch block?",
                type: "MCQ",
                options: [
                    "Compilation error: Missing break statement",
                    "Switch immediately terminates",
                    "Fall-through occurs into the subsequent case statements",
                    "The default case runs and loop restarts"
                ],
                correctAnswer: "Fall-through occurs into the subsequent case statements",
                explanation: "Without a break statement, C continues execution sequentially into subsequent case blocks regardless of their match status (fall-through).",
                marks: 5
            },
            {
                questionText: "What type must the expression inside a C switch(expr) statement evaluate to?",
                type: "MCQ",
                options: ["Integral or character type", "Floating point (float/double)", "String literal", "Pointer array"],
                correctAnswer: "Integral or character type",
                explanation: "The controlling expression of a switch statement in C must evaluate to an integral type (int, char, enum). Floats and strings are prohibited.",
                marks: 5
            },
            {
                questionText: "Which ternary expression correctly finds the maximum of two numbers 'a' and 'b'?",
                type: "MCQ",
                options: ["(a > b) ? a : b", "(a > b) : a ? b", "if (a > b) ? a : b", "a > b ? then a else b"],
                correctAnswer: "(a > b) ? a : b",
                explanation: "The syntax of the ternary operator is: condition ? value_if_true : value_if_false.",
                marks: 5
            }
        ]
    },
    4: {
        title: "Module 04: Looping Constructs & Iteration Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "What is the primary difference between a 'while' loop and a 'do-while' loop in C?",
                type: "MCQ",
                options: [
                    "do-while evaluates the condition at the end, guaranteeing at least one execution",
                    "while loop executes faster in hardware",
                    "do-while cannot use break statements",
                    "while loop does not require loop counter variables"
                ],
                correctAnswer: "do-while evaluates the condition at the end, guaranteeing at least one execution",
                explanation: "A do-while loop is an exit-controlled loop; its body always executes at least once before testing the condition.",
                marks: 5
            },
            {
                questionText: "What does the 'continue' keyword do when encountered inside a loop body?",
                type: "MCQ",
                options: [
                    "Terminates the loop completely",
                    "Skips remaining statements in current iteration and jumps to the next cycle update/test",
                    "Restarts loop from iteration zero",
                    "Exits from the enclosing function"
                ],
                correctAnswer: "Skips remaining statements in current iteration and jumps to the next cycle update/test",
                explanation: "continue aborts the remainder of the current iteration body and immediately advances control to the loop's update/condition check.",
                marks: 5
            },
            {
                questionText: "How do you define an intentional infinite loop using a C 'for' header?",
                type: "MCQ",
                options: ["for (;;)", "for (0; 0; 0)", "for (null)", "for (auto i = 0)"],
                correctAnswer: "for (;;)",
                explanation: "In C, omitting all three expressions in for (;;) creates an infinite loop because an omitted condition defaults to true (non-zero).",
                marks: 5
            },
            {
                questionText: "If a loop has an outer counter running N times and an inner counter running M times, how many times does the inner body execute?",
                type: "MCQ",
                options: ["N + M", "N * M", "N^M", "2 * (N + M)"],
                correctAnswer: "N * M",
                explanation: "For each of the N outer iterations, the inner loop executes M times, resulting in a total of N * M executions.",
                marks: 5
            }
        ]
    },
    5: {
        title: "Module 05: Arrays & String Memory Layout Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "How are elements of a single-dimensional array arranged in computer RAM in C?",
                type: "MCQ",
                options: [
                    "Contiguously in adjacent memory locations",
                    "Scattered randomly across heap buckets",
                    "Linked via pointers like a linked list",
                    "In reverse order based on access frequency"
                ],
                correctAnswer: "Contiguously in adjacent memory locations",
                explanation: "Array elements in C are allocated in a single unbroken contiguous block of memory addresses.",
                marks: 5
            },
            {
                questionText: "What sentinel character marks the termination of a valid C string?",
                type: "MCQ",
                options: ["'\\0' (ASCII 0)", "'\\n'", "'EOF'", "' ' (Space)"],
                correctAnswer: "'\\0' (ASCII 0)",
                explanation: "C strings are null-terminated arrays of characters ending with the null sentinel byte '\\0' (ASCII 0).",
                marks: 5
            },
            {
                questionText: "Which standard header provides string utility functions such as strlen, strcpy, and strcmp?",
                type: "MCQ",
                options: ["<string.h>", "<strings.h>", "<stdlib.h>", "<ctype.h>"],
                correctAnswer: "<string.h>",
                explanation: "Standard C string manipulation functions are declared inside <string.h>.",
                marks: 5
            },
            {
                questionText: "What does strcmp(\"code\", \"code\") return when both strings are identical?",
                type: "MCQ",
                options: ["0", "1", "-1", "true"],
                correctAnswer: "0",
                explanation: "strcmp returns 0 if both strings match character-by-character up to their null terminators.",
                marks: 5
            }
        ]
    },
    6: {
        title: "Module 06: Functions & Call Stack Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "What is a function prototype in C?",
                type: "MCQ",
                options: [
                    "A declaration that informs the compiler of function name, return type, and parameter types before its definition",
                    "A function that calls itself",
                    "The compiled assembly code of a function",
                    "A function with no arguments"
                ],
                correctAnswer: "A declaration that informs the compiler of function name, return type, and parameter types before its definition",
                explanation: "A function prototype declares the interface to the compiler so calls can be type-checked before the full definition is reached.",
                marks: 5
            },
            {
                questionText: "By default, what parameter passing convention is used for primitive types in C?",
                type: "MCQ",
                options: ["Call by Value", "Call by Reference", "Call by Name", "Call by Pointer alias"],
                correctAnswer: "Call by Value",
                explanation: "C exclusively uses Call by Value: copies of actual arguments are passed into the function's parameter variables.",
                marks: 5
            },
            {
                questionText: "What runtime data structure tracks active function calls, local variables, and return addresses?",
                type: "MCQ",
                options: ["Call Stack (LIFO)", "FIFO Queue", "Binary Search Tree", "Hash Map"],
                correctAnswer: "Call Stack (LIFO)",
                explanation: "Function activation records (stack frames) are pushed onto and popped from the hardware runtime Call Stack in Last-In First-Out order.",
                marks: 5
            },
            {
                questionText: "What must every recursive function contain to avoid an infinite recursion stack overflow?",
                type: "MCQ",
                options: ["A Base Case", "A goto statement", "A while loop", "A global counter variable"],
                correctAnswer: "A Base Case",
                explanation: "A base case specifies the terminating condition where the function returns without making further recursive invocations.",
                marks: 5
            }
        ]
    },
    7: {
        title: "Module 07: Pointers & Memory Addressing Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "Which operator is used to obtain the physical memory address of a variable in C?",
                type: "MCQ",
                options: ["& (Address-of operator)", "* (Dereference operator)", "-> (Arrow operator)", "% (Modulo operator)"],
                correctAnswer: "& (Address-of operator)",
                explanation: "The unary '&' address-of operator returns the starting memory address of its operand.",
                marks: 5
            },
            {
                questionText: "What does dereferencing a pointer using '*ptr = 50' accomplish?",
                type: "MCQ",
                options: [
                    "Writes 50 directly into the memory location pointed to by ptr",
                    "Multiplies ptr by 50",
                    "Changes the address stored in ptr to 50",
                    "Allocates 50 bytes of heap memory"
                ],
                correctAnswer: "Writes 50 directly into the memory location pointed to by ptr",
                explanation: "The '*' dereference operator accesses the memory cell at the address stored in ptr, allowing direct read/write of that memory.",
                marks: 5
            },
            {
                questionText: "If an int pointer 'ptr' points to address 0x1000 on a system where sizeof(int) == 4, what is the address of 'ptr + 1'?",
                type: "MCQ",
                options: ["0x1004", "0x1001", "0x1008", "0x1002"],
                correctAnswer: "0x1004",
                explanation: "Pointer arithmetic scales increments by the byte size of the pointed-to type: 0x1000 + (1 * 4 bytes) = 0x1004.",
                marks: 5
            },
            {
                questionText: "What is a 'void*' pointer in C?",
                type: "MCQ",
                options: [
                    "A generic pointer that can hold the address of any data type",
                    "A pointer that points to nothing (NULL)",
                    "An uninitialized illegal pointer",
                    "A pointer that cannot be reassigned"
                ],
                correctAnswer: "A generic pointer that can hold the address of any data type",
                explanation: "A void* is a generic raw memory pointer capable of storing any object address without an explicit type cast.",
                marks: 5
            }
        ]
    },
    8: {
        title: "Module 08: Structures & Unions Memory Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "What is the fundamental difference in memory layout between a 'struct' and a 'union'?",
                type: "MCQ",
                options: [
                    "Struct members have distinct memory slots; union members share the same starting memory space",
                    "Union members can only be integers",
                    "Structs are allocated on heap; unions are allocated on stack",
                    "Structs cannot hold pointers"
                ],
                correctAnswer: "Struct members have distinct memory slots; union members share the same starting memory space",
                explanation: "In a struct, each member has its own separate memory offset. In a union, all members share the same memory location, sized to fit the largest member.",
                marks: 5
            },
            {
                questionText: "How do you access member 'salary' through a pointer 'empPtr' pointing to a struct Employee?",
                type: "MCQ",
                options: ["empPtr->salary", "empPtr.salary", "empPtr=>salary", "*empPtr.salary"],
                correctAnswer: "empPtr->salary",
                explanation: "The arrow operator '->' is syntactic shorthand for (*empPtr).salary when accessing members via a pointer.",
                marks: 5
            },
            {
                questionText: "Why does the C compiler insert padding bytes into a structure?",
                type: "MCQ",
                options: [
                    "To align member addresses to natural CPU word boundaries for faster hardware access",
                    "To encrypt memory contents",
                    "To reserve space for future members",
                    "To prevent pointer overflows"
                ],
                correctAnswer: "To align member addresses to natural CPU word boundaries for faster hardware access",
                explanation: "Modern CPUs access aligned memory words much faster. Structure padding ensures each member aligns with its natural hardware boundary.",
                marks: 5
            },
            {
                questionText: "What does the 'typedef' keyword do in C?",
                type: "MCQ",
                options: [
                    "Creates a new type synonym/alias for an existing type",
                    "Defines a macro constant",
                    "Allocates memory dynamically",
                    "Declares a global struct variable"
                ],
                correctAnswer: "Creates a new type synonym/alias for an existing type",
                explanation: "typedef gives an existing type a new mnemonic name, improving code readability and reducing typing overhead.",
                marks: 5
            }
        ]
    },
    9: {
        title: "Module 09: File Handling & Stream Buffers Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "What does fopen() return when it fails to open the requested file?",
                type: "MCQ",
                options: ["NULL", "-1", "0", "EOF"],
                correctAnswer: "NULL",
                explanation: "When fopen() cannot open a file (e.g. file not found or permission denied), it returns a NULL pointer.",
                marks: 5
            },
            {
                questionText: "Which fopen() file mode opens an existing file for appending data to the end without truncation?",
                type: "MCQ",
                options: ["\"a\"", "\"w\"", "\"r+\"", "\"w+\""],
                correctAnswer: "\"a\"",
                explanation: "Mode 'a' (append) creates the file if it does not exist, or positions the file write pointer at the end of the file.",
                marks: 5
            },
            {
                questionText: "Which function moves the file stream position indicator to a specific byte offset?",
                type: "MCQ",
                options: ["fseek()", "ftell()", "rewind()", "feof()"],
                correctAnswer: "fseek()",
                explanation: "fseek(FILE *stream, long offset, int whence) repositions the file stream pointer relative to SEEK_SET, SEEK_CUR, or SEEK_END.",
                marks: 5
            },
            {
                questionText: "Why is it essential to call fclose() on an open FILE stream before program termination?",
                type: "MCQ",
                options: [
                    "Flushes buffered stream data to physical storage and frees OS file descriptors",
                    "Deletes the file from disk",
                    "Resets file permissions to read-only",
                    "Prevents compilation errors"
                ],
                correctAnswer: "Flushes buffered stream data to physical storage and frees OS file descriptors",
                explanation: "fclose flushes any unwritten buffers to disk and closes the OS file descriptor, preventing resource leaks and data truncation.",
                marks: 5
            }
        ]
    },
    10: {
        title: "Module 10: Dynamic Memory Allocation (Heap) Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "Which header file must be included to use malloc, calloc, realloc, and free?",
                type: "MCQ",
                options: ["<stdlib.h>", "<stdio.h>", "<memory.h>", "<alloc.h>"],
                correctAnswer: "<stdlib.h>",
                explanation: "Standard C dynamic memory management functions are declared in <stdlib.h>.",
                marks: 5
            },
            {
                questionText: "What is the key difference between malloc() and calloc()?",
                type: "MCQ",
                options: [
                    "calloc initializes all allocated bytes to zero; malloc leaves memory uninitialized with garbage values",
                    "malloc allocates on stack; calloc allocates on heap",
                    "calloc cannot be freed with free()",
                    "malloc can only allocate integers"
                ],
                correctAnswer: "calloc initializes all allocated bytes to zero; malloc leaves memory uninitialized with garbage values",
                explanation: "calloc(n, size) zeroes out all bytes in the allocated block, whereas malloc(size) allocates raw bytes containing arbitrary garbage data.",
                marks: 5
            },
            {
                questionText: "What is a 'memory leak' in C?",
                type: "MCQ",
                options: [
                    "When dynamically allocated heap memory is never released using free(), consuming system RAM",
                    "When a pointer points to an invalid address",
                    "When stack overflows into global data",
                    "When a file is not closed"
                ],
                correctAnswer: "When dynamically allocated heap memory is never released using free(), consuming system RAM",
                explanation: "A memory leak happens when memory allocated via malloc/calloc is no longer needed but never released with free(), eventually exhausting available RAM.",
                marks: 5
            },
            {
                questionText: "What does realloc(ptr, newSize) do?",
                type: "MCQ",
                options: [
                    "Changes the size of the previously allocated memory block, preserving existing contents up to minimum of old and new size",
                    "Deallocates ptr permanently without reallocation",
                    "Allocates a duplicate pointer in stack memory",
                    "Resets all memory to zero"
                ],
                correctAnswer: "Changes the size of the previously allocated memory block, preserving existing contents up to minimum of old and new size",
                explanation: "realloc resizes an existing heap allocation block, moving it to a new location if necessary and copying over existing data.",
                marks: 5
            }
        ]
    },
    11: {
        title: "Module 11: Storage Classes & Preprocessor Directives Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "Which storage class specifier preserves a local variable's value between repeated function invocations?",
                type: "MCQ",
                options: ["static", "auto", "register", "extern"],
                correctAnswer: "static",
                explanation: "A static local variable is initialized once in the data segment and retains its value across all subsequent calls to that function.",
                marks: 5
            },
            {
                questionText: "What is the default storage class for local variables declared inside a function block in C?",
                type: "MCQ",
                options: ["auto", "static", "register", "extern"],
                correctAnswer: "auto",
                explanation: "Variables declared inside a function or block default to the 'auto' storage class, residing on the stack and living only while the block executes.",
                marks: 5
            },
            {
                questionText: "What does the preprocessor directive '#define SQUARE(x) ((x)*(x))' represent?",
                type: "MCQ",
                options: ["A parameterized preprocessor macro", "A compiled inline function", "A constant pointer", "A type definition"],
                correctAnswer: "A parameterized preprocessor macro",
                explanation: "#define creates a macro that performs textual substitution before compilation begins.",
                marks: 5
            },
            {
                questionText: "What is the purpose of header guards using '#ifndef HEADER_H', '#define HEADER_H', and '#endif'?",
                type: "MCQ",
                options: [
                    "Prevents multiple inclusions and duplicate symbol definitions of the same header",
                    "Speeds up program execution at runtime",
                    "Enforces strict data encapsulation",
                    "Links external binary libraries"
                ],
                correctAnswer: "Prevents multiple inclusions and duplicate symbol definitions of the same header",
                explanation: "Header guards ensure the preprocessor only processes the contents of a header file once per translation unit, preventing redefinition errors.",
                marks: 5
            }
        ]
    }
};

const cppQuizzes = {
    1: {
        title: "Module 01: OOP Fundamentals & C++ Evolution Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "Which core principle of Object-Oriented Programming binds data together with the functions that manipulate it?",
                type: "MCQ",
                options: ["Encapsulation", "Polymorphism", "Inheritance", "Dynamic Binding"],
                correctAnswer: "Encapsulation",
                explanation: "Encapsulation is the bundling of data and the methods that operate on that data into a single unit (class), restricting direct outside access.",
                marks: 5
            },
            {
                questionText: "Who designed and developed the C++ language as an extension of C ('C with Classes') in 1979?",
                type: "MCQ",
                options: ["Bjarne Stroustrup", "Dennis Ritchie", "Linus Torvalds", "Guido van Rossum"],
                correctAnswer: "Bjarne Stroustrup",
                explanation: "Bjarne Stroustrup created C++ at Bell Laboratories in 1979 by adding classes, inheritance, and type checking to C.",
                marks: 5
            },
            {
                questionText: "Which C++ standard stream object is used for standard console character output?",
                type: "MCQ",
                options: ["std::cout", "std::cin", "std::cerr", "std::clog"],
                correctAnswer: "std::cout",
                explanation: "std::cout (character output stream) defined in <iostream> sends formatted data to standard output (console).",
                marks: 5
            },
            {
                questionText: "Which operator is known as the Stream Insertion operator in C++?",
                type: "MCQ",
                options: ["<<", ">>", "::", "->"],
                correctAnswer: "<<",
                explanation: "The '<<' operator inserts data into an output stream (e.g. std::cout << 'Hello').",
                marks: 5
            }
        ]
    },
    2: {
        title: "Module 02: C++ Tokens & Type Casting Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "Which C++ operator is used to resolve and access global variables or namespace members when shadowed by local scope?",
                type: "MCQ",
                options: [":: (Scope Resolution Operator)", "-> (Arrow)", ". (Dot)", "?: (Ternary)"],
                correctAnswer: ":: (Scope Resolution Operator)",
                explanation: "The unary scope resolution operator (::x) accesses the global variable x even if a local variable with the same name exists.",
                marks: 5
            },
            {
                questionText: "What is a Reference Variable in C++?",
                type: "MCQ",
                options: [
                    "An alternative alias for an existing variable that cannot be reseated",
                    "A pointer that can hold NULL",
                    "A heap-allocated memory integer",
                    "A constant literal"
                ],
                correctAnswer: "An alternative alias for an existing variable that cannot be reseated",
                explanation: "A reference (&ref = var) is an alias for an existing object; once bound upon initialization, it cannot be rebound to refer to another object.",
                marks: 5
            },
            {
                questionText: "Which explicit cast operator in C++ is used for safe, compile-time checked type conversions (such as float to int or between related pointers)?",
                type: "MCQ",
                options: ["static_cast", "dynamic_cast", "reinterpret_cast", "const_cast"],
                correctAnswer: "static_cast",
                explanation: "static_cast performs compile-time type conversions between related types (e.g., numeric casts, upcasts in inheritance hierarchies).",
                marks: 5
            },
            {
                questionText: "What does the 'bool' fundamental data type in C++ store?",
                type: "MCQ",
                options: ["Boolean values true (1) or false (0)", "Any arbitrary string", "Single ASCII character", "4-byte integer exclusively"],
                correctAnswer: "Boolean values true (1) or false (0)",
                explanation: "bool is a built-in C++ data type that takes boolean literals true or false, typically occupying 1 byte.",
                marks: 5
            }
        ]
    },
    3: {
        title: "Module 03: Classes & Objects Architecture Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "What is the default access specifier for members of a 'class' in C++ if none is explicitly specified?",
                type: "MCQ",
                options: ["private", "public", "protected", "internal"],
                correctAnswer: "private",
                explanation: "In C++, members of a class default to 'private' access, whereas members of a struct default to 'public'.",
                marks: 5
            },
            {
                questionText: "What does the 'this' pointer represent inside a non-static class member function?",
                type: "MCQ",
                options: [
                    "A pointer pointing to the current invoking object instance",
                    "A pointer to the base class",
                    "A pointer to the virtual method table",
                    "A reference to the global namespace"
                ],
                correctAnswer: "A pointer pointing to the current invoking object instance",
                explanation: "'this' is an implicit pointer parameter passed to non-static member functions, storing the memory address of the object for which the function was called.",
                marks: 5
            },
            {
                questionText: "What is a 'static member variable' of a class?",
                type: "MCQ",
                options: [
                    "A variable shared among all instances of the class with a single memory allocation",
                    "A variable that cannot be modified",
                    "A variable created fresh for every object",
                    "A private pointer"
                ],
                correctAnswer: "A variable shared among all instances of the class with a single memory allocation",
                explanation: "A static member variable belongs to the class itself, not to individual instances. Only one copy exists, shared by all objects of that class.",
                marks: 5
            },
            {
                questionText: "What is the role of a 'friend' function in C++?",
                type: "MCQ",
                options: [
                    "A non-member function granted full access to private and protected members of a class",
                    "A function that can only access public members",
                    "An inherited virtual function",
                    "A constructor helper"
                ],
                correctAnswer: "A non-member function granted full access to private and protected members of a class",
                explanation: "Declaring a function as friend inside a class grants that function direct access to all private and protected members of the class.",
                marks: 5
            }
        ]
    },
    4: {
        title: "Module 04: Functions & Overloading in C++ Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "What is Function Overloading in C++?",
                type: "MCQ",
                options: [
                    "Defining multiple functions with the same name but different parameter lists (type, number, or order)",
                    "Defining functions with identical parameters but different return types only",
                    "Calling a function from inside another function",
                    "Overriding a virtual function in a derived class"
                ],
                correctAnswer: "Defining multiple functions with the same name but different parameter lists (type, number, or order)",
                explanation: "Function overloading enables multiple functions to share the exact same name as long as their parameter signatures are distinct.",
                marks: 5
            },
            {
                questionText: "What does the 'inline' keyword suggest to the C++ compiler?",
                type: "MCQ",
                options: [
                    "Replace calls to the function with the actual body code at compile time to eliminate call overhead",
                    "Execute the function in a background thread",
                    "Prevent the function from returning a value",
                    "Make the function private to the class"
                ],
                correctAnswer: "Replace calls to the function with the actual body code at compile time to eliminate call overhead",
                explanation: "inline advises the compiler to expand the function body in place of the call, avoiding the overhead of stack frame push/pop for small functions.",
                marks: 5
            },
            {
                questionText: "Where must Default Arguments be specified in a function parameter list?",
                type: "MCQ",
                options: [
                    "From right to left (trailing parameters only)",
                    "From left to right only",
                    "Only on the first parameter",
                    "At any arbitrary position"
                ],
                correctAnswer: "From right to left (trailing parameters only)",
                explanation: "In C++, once a default argument is provided for a parameter, all subsequent parameters to its right must also have default arguments.",
                marks: 5
            },
            {
                questionText: "Can a function be overloaded based solely on a different return type in C++?",
                type: "MCQ",
                options: [
                    "No, return type alone is insufficient for function overload resolution",
                    "Yes, the compiler automatically deduces from assignment",
                    "Only if both functions are declared inline",
                    "Only inside a class template"
                ],
                correctAnswer: "No, return type alone is insufficient for function overload resolution",
                explanation: "Function signature comprises function name and parameter types. The return type is not part of the signature used for overload resolution.",
                marks: 5
            }
        ]
    },
    5: {
        title: "Module 05: Constructors & Destructors Lifecycle Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "What is a Constructor in C++?",
                type: "MCQ",
                options: [
                    "A special member function bearing the same name as the class, invoked automatically upon object instantiation",
                    "A function that destroys dynamic memory",
                    "A static member function that returns an object",
                    "A compiler keyword that defines class layouts"
                ],
                correctAnswer: "A special member function bearing the same name as the class, invoked automatically upon object instantiation",
                explanation: "A constructor has the same name as the class, has no return type, and automatically initializes member fields when an object is created.",
                marks: 5
            },
            {
                questionText: "What is the signature of a standard Copy Constructor for class 'MyClass'?",
                type: "MCQ",
                options: ["MyClass(const MyClass &other)", "MyClass(MyClass other)", "void copy(MyClass other)", "MyClass*(MyClass other)"],
                correctAnswer: "MyClass(const MyClass &other)",
                explanation: "A copy constructor takes a reference to a constant instance of the same class (const MyClass &other) to prevent infinite recursion during parameter passing.",
                marks: 5
            },
            {
                questionText: "What prefix symbol denotes a class Destructor in C++?",
                type: "MCQ",
                options: ["~ (Tilde)", "! (Exclamation)", "* (Asterisk)", "# (Hash)"],
                correctAnswer: "~ (Tilde)",
                explanation: "A destructor is defined with a tilde preceding the class name (e.g. ~MyClass()) and takes no parameters and returns no value.",
                marks: 5
            },
            {
                questionText: "In what order are destructors invoked when multiple local objects go out of scope?",
                type: "MCQ",
                options: [
                    "Reverse order of their construction (LIFO)",
                    "Same order as their construction (FIFO)",
                    "Random order based on heap layout",
                    "Simultaneously in parallel"
                ],
                correctAnswer: "Reverse order of their construction (LIFO)",
                explanation: "Objects on the stack are destroyed in exact reverse order of their construction (Last Constructed, First Destroyed).",
                marks: 5
            }
        ]
    },
    6: {
        title: "Module 06: Operator Overloading Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "Which keyword is used to declare an overloaded operator in C++?",
                type: "MCQ",
                options: ["operator", "overload", "function", "virtual"],
                correctAnswer: "operator",
                explanation: "Operator overloading functions use the 'operator' keyword followed by the symbol being overloaded (e.g. operator+, operator==).",
                marks: 5
            },
            {
                questionText: "Which of the following operators CANNOT be overloaded in C++?",
                type: "MCQ",
                options: [":: (Scope Resolution) and . (Member Access)", "+ and -", "[] (Subscript)", "() (Function Call)"],
                correctAnswer: ":: (Scope Resolution) and . (Member Access)",
                explanation: "In C++, scope resolution (::), member access (.), pointer-to-member (.*), and ternary conditional (?:) cannot be overloaded.",
                marks: 5
            },
            {
                questionText: "How does the compiler distinguish an overloaded prefix increment (++x) from a postfix increment (x++)?",
                type: "MCQ",
                options: [
                    "Postfix overload takes an unused dummy 'int' parameter: operator++(int)",
                    "Prefix takes an int parameter",
                    "Postfix returns void exclusively",
                    "Prefix must be a friend function"
                ],
                correctAnswer: "Postfix overload takes an unused dummy 'int' parameter: operator++(int)",
                explanation: "To distinguish prefix and postfix, C++ specifies that postfix operator++(int) takes an int dummy argument, while prefix operator++() takes none.",
                marks: 5
            },
            {
                questionText: "When overloading the stream insertion operator '<<' for std::cout, what return type should the function have to support chaining?",
                type: "MCQ",
                options: ["std::ostream&", "void", "std::istream&", "bool"],
                correctAnswer: "std::ostream&",
                explanation: "Returning a reference to std::ostream (std::ostream&) allows chaining multiple output operations, such as: cout << a << b << endl;",
                marks: 5
            }
        ]
    },
    7: {
        title: "Module 07: Inheritance & Polymorphism Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "Which inheritance type allows a derived class to inherit directly from more than one base class?",
                type: "MCQ",
                options: ["Multiple Inheritance", "Single Inheritance", "Multilevel Inheritance", "Hierarchical Inheritance"],
                correctAnswer: "Multiple Inheritance",
                explanation: "Multiple inheritance is when a derived class inherits directly from two or more base classes (e.g. class C : public A, public B).",
                marks: 5
            },
            {
                questionText: "What problem does Virtual Inheritance ('virtual public Base') solve in C++?",
                type: "MCQ",
                options: [
                    "The Diamond Problem (duplicate base class subobjects in multiple inheritance)",
                    "Stack overflow in recursive calls",
                    "Dynamic casting failures",
                    "Memory leaks in copy constructors"
                ],
                correctAnswer: "The Diamond Problem (duplicate base class subobjects in multiple inheritance)",
                explanation: "Virtual inheritance ensures only a single shared instance of the common base class exists when classes form a diamond hierarchy.",
                marks: 5
            },
            {
                questionText: "What keyword enables run-time dynamic polymorphism when declaring a member function in a base class?",
                type: "MCQ",
                options: ["virtual", "dynamic", "inline", "override"],
                correctAnswer: "virtual",
                explanation: "Declaring a function 'virtual' instructs the compiler to dispatch the call dynamically via the vtable based on the actual runtime object type.",
                marks: 5
            },
            {
                questionText: "What makes a C++ class an Abstract Class?",
                type: "MCQ",
                options: [
                    "Containing at least one Pure Virtual Function (= 0)",
                    "Having only private constructors",
                    "Declaring all methods static",
                    "Having no member variables"
                ],
                correctAnswer: "Containing at least one Pure Virtual Function (= 0)",
                explanation: "A class with at least one pure virtual function (e.g. virtual void draw() = 0;) is an abstract class and cannot be directly instantiated.",
                marks: 5
            }
        ]
    },
    8: {
        title: "Module 08: Working with Files & Streams Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "Which header file provides the C++ stream classes for disk file processing (ifstream, ofstream, fstream)?",
                type: "MCQ",
                options: ["<fstream>", "<iostream>", "<sstream>", "<fileio>"],
                correctAnswer: "<fstream>",
                explanation: "<fstream> defines std::ifstream (input file stream), std::ofstream (output file stream), and std::fstream (bidirectional).",
                marks: 5
            },
            {
                questionText: "Which class is specifically used for reading data from an existing text file?",
                type: "MCQ",
                options: ["std::ifstream", "std::ofstream", "std::fstream", "std::cout"],
                correctAnswer: "std::ifstream",
                explanation: "std::ifstream provides input operations for reading data streams from files.",
                marks: 5
            },
            {
                questionText: "What stream member function tests whether a file stream reached the end-of-file condition?",
                type: "MCQ",
                options: ["file.eof()", "file.end()", "file.is_open()", "file.fail()"],
                correctAnswer: "file.eof()",
                explanation: "eof() returns true if the stream has encountered the end-of-file indicator.",
                marks: 5
            },
            {
                questionText: "Which file open mode flag truncates any existing file contents to length 0 upon opening?",
                type: "MCQ",
                options: ["std::ios::trunc", "std::ios::app", "std::ios::ate", "std::ios::binary"],
                correctAnswer: "std::ios::trunc",
                explanation: "std::ios::trunc causes any existing content in the destination file to be discarded upon opening.",
                marks: 5
            }
        ]
    },
    9: {
        title: "Module 09: C++ Exception Handling Exam",
        passingScorePercent: 60,
        timeLimitMinutes: 15,
        questions: [
            {
                questionText: "Which keyword is used to signal the occurrence of an anomalous error condition in C++?",
                type: "MCQ",
                options: ["throw", "try", "catch", "raise"],
                correctAnswer: "throw",
                explanation: "The 'throw' statement raises an exception object, transferring control to the nearest matching enclosing catch handler.",
                marks: 5
            },
            {
                questionText: "What syntax catches any and all thrown exceptions regardless of their type?",
                type: "MCQ",
                options: ["catch (...)", "catch (all)", "catch (Exception &e)", "catch (*)"],
                correctAnswer: "catch (...)",
                explanation: "The catch-all ellipsis handler 'catch (...)' catches any exception that was not matched by previous specific catch blocks.",
                marks: 5
            },
            {
                questionText: "What is the standard base class for all standard library exceptions in C++?",
                type: "MCQ",
                options: ["std::exception", "std::error", "std::runtime", "std::base_exception"],
                correctAnswer: "std::exception",
                explanation: "std::exception defined in <exception> is the base class for standard exceptions like std::runtime_error, std::out_of_range, and std::bad_alloc.",
                marks: 5
            },
            {
                questionText: "What happens during 'Stack Unwinding' when an exception is thrown and propagates up the call stack?",
                type: "MCQ",
                options: [
                    "Destructors of all fully constructed local objects in vacated stack frames are automatically called",
                    "All heap memory is instantly freed",
                    "The operating system restarts the process",
                    "Global variables are reset to default values"
                ],
                correctAnswer: "Destructors of all fully constructed local objects in vacated stack frames are automatically called",
                explanation: "Stack unwinding cleans up each stack frame as control travels up to find a matching catch handler, invoking destructors for all local objects (RAII guarantee).",
                marks: 5
            }
        ]
    }
};

const otherQuizzes = {
    'GENAI-401': {
        1: {
            title: "Module 01: Transformers, Attention & LLMs Exam",
            passingScorePercent: 60,
            timeLimitMinutes: 15,
            questions: [
                {
                    questionText: "What breakthrough mechanism in the 2017 'Attention Is All You Need' paper enabled parallelized sequence modeling without recurrence?",
                    type: "MCQ",
                    options: ["Multi-Head Self-Attention", "Recurrent LSTM Cells", "Convolutional Max-Pooling", "Markov Decision Chains"],
                    correctAnswer: "Multi-Head Self-Attention",
                    explanation: "Self-attention computes dynamic relevance scores between all token positions in parallel using Query, Key, and Value projections.",
                    marks: 5
                },
                {
                    questionText: "What is the computational complexity of standard dot-product self-attention with respect to sequence length N?",
                    type: "MCQ",
                    options: ["O(N^2)", "O(N)", "O(log N)", "O(N * log N)"],
                    correctAnswer: "O(N^2)",
                    explanation: "Standard self-attention computes an N x N matrix of attention weights between all pairs of tokens, resulting in quadratic O(N^2) complexity.",
                    marks: 5
                },
                {
                    questionText: "What does temperature control in generative LLM decoding?",
                    type: "MCQ",
                    options: [
                        "Softmax logit scaling to govern response randomness vs determinism",
                        "The hardware clock speed of the GPU",
                        "The maximum sequence context window length",
                        "The weight decay learning rate"
                    ],
                    correctAnswer: "Softmax logit scaling to govern response randomness vs determinism",
                    explanation: "Lower temperature (< 1.0) sharpens probability distribution towards high-likelihood tokens (deterministic); higher temperature flattens it for creativity.",
                    marks: 5
                },
                {
                    questionText: "In Retrieval-Augmented Generation (RAG), what database type is typically used to store and index high-dimensional text embeddings?",
                    type: "MCQ",
                    options: ["Vector Database", "Relational SQL Database", "Hierarchical Graph Tree", "Flat Key-Value Cache"],
                    correctAnswer: "Vector Database",
                    explanation: "Vector databases (e.g. Pinecone, Chroma, Milvus) index dense embeddings for fast approximate nearest neighbor (ANN) similarity search.",
                    marks: 5
                }
            ]
        }
    },
    'DL-301': {
        1: {
            title: "Module 01: Deep Neural Networks & Backprop Exam",
            passingScorePercent: 60,
            timeLimitMinutes: 15,
            questions: [
                {
                    questionText: "Which algorithm applies the chain rule of calculus to compute weight gradients across deep neural network layers?",
                    type: "MCQ",
                    options: ["Backpropagation", "K-Means Clustering", "Forward Elimination", "Principal Component Analysis"],
                    correctAnswer: "Backpropagation",
                    explanation: "Backpropagation computes partial derivatives of the loss with respect to all layer weights by propagating gradients backward using the chain rule.",
                    marks: 5
                },
                {
                    questionText: "Why is the ReLU (Rectified Linear Unit) activation function preferred over Sigmoid in deep networks?",
                    type: "MCQ",
                    options: [
                        "Mitigates vanishing gradient problem for positive inputs with constant derivative of 1",
                        "Produces bounded outputs strictly between 0 and 1",
                        "Guarantees convex optimization",
                        "Eliminates the need for bias parameters"
                    ],
                    correctAnswer: "Mitigates vanishing gradient problem for positive inputs with constant derivative of 1",
                    explanation: "ReLU: f(x) = max(0, x). For positive inputs, its gradient is 1, which prevents gradients from decaying exponentially in deep architectures.",
                    marks: 5
                },
                {
                    questionText: "What regularization technique randomly drops hidden neuron activations to 0 during training to prevent co-adaptation?",
                    type: "MCQ",
                    options: ["Dropout", "L2 Weight Decay", "Batch Normalization", "Gradient Clipping"],
                    correctAnswer: "Dropout",
                    explanation: "Dropout deactivates a random subset of neurons during training passes with probability p, preventing overfitting.",
                    marks: 5
                },
                {
                    questionText: "In PyTorch, which method call resets previously accumulated gradients before the next backward pass?",
                    type: "MCQ",
                    options: ["optimizer.zero_grad()", "loss.backward()", "optimizer.step()", "model.eval()"],
                    correctAnswer: "optimizer.zero_grad()",
                    explanation: "PyTorch accumulates gradients by default; calling optimizer.zero_grad() clears grad buffers before computing fresh gradients.",
                    marks: 5
                }
            ]
        }
    },
    'ML-201': {
        1: {
            title: "Module 01: Linear Regression & Optimization Exam",
            passingScorePercent: 60,
            timeLimitMinutes: 15,
            questions: [
                {
                    questionText: "Which loss function is minimized in standard Ordinary Least Squares (OLS) Linear Regression?",
                    type: "MCQ",
                    options: ["Mean Squared Error (MSE)", "Binary Cross-Entropy", "Categorical Cross-Entropy", "Hinge Loss"],
                    correctAnswer: "Mean Squared Error (MSE)",
                    explanation: "OLS minimizes the sum of squared differences (residuals) between predicted and actual continuous target values.",
                    marks: 5
                },
                {
                    questionText: "What optimization hyperparameter controls the step size taken along the negative gradient direction in Gradient Descent?",
                    type: "MCQ",
                    options: ["Learning Rate (alpha)", "Momentum beta", "Batch Size", "Epoch Count"],
                    correctAnswer: "Learning Rate (alpha)",
                    explanation: "The learning rate scales the gradient vector to determine how large of a step parameters take towards the loss minimum.",
                    marks: 5
                },
                {
                    questionText: "Which regularization method adds a penalty proportional to the absolute values of the coefficients (L1 penalty)?",
                    type: "MCQ",
                    options: ["Lasso Regression (L1)", "Ridge Regression (L2)", "ElasticNet", "Kernel Trick"],
                    correctAnswer: "Lasso Regression (L1)",
                    explanation: "Lasso adds an L1 penalty (|w|), driving irrelevant feature weights to exactly zero and performing sparse feature selection.",
                    marks: 5
                },
                {
                    questionText: "What is the Bias-Variance tradeoff?",
                    type: "MCQ",
                    options: [
                        "The balance between underfitting from strong model assumptions and overfitting from high sensitivity to training fluctuations",
                        "The trade-off between CPU and GPU memory usage",
                        "The ratio between precision and recall",
                        "The conflict between training time and dataset size"
                    ],
                    correctAnswer: "The balance between underfitting from strong model assumptions and overfitting from high sensitivity to training fluctuations",
                    explanation: "High bias causes underfitting (oversimplified model); high variance causes overfitting (capturing noise instead of general patterns).",
                    marks: 5
                }
            ]
        }
    },
    'AGNT-501': {
        1: {
            title: "Module 01: Autonomous Agent Architectures & ReAct Exam",
            passingScorePercent: 60,
            timeLimitMinutes: 15,
            questions: [
                {
                    questionText: "What does the 'ReAct' agent framework combine in autonomous decision loops?",
                    type: "MCQ",
                    options: ["Reasoning (Thoughts) and Acting (Tool Executions)", "Reinforcement and Activation", "Reactive and Active states", "Recursive Actions"],
                    correctAnswer: "Reasoning (Thoughts) and Acting (Tool Executions)",
                    explanation: "ReAct interleaves reasoning trace generation ('Thought') with task-specific external tool invocations ('Action' and 'Observation').",
                    marks: 5
                },
                {
                    questionText: "In multi-agent systems, what is the role of a Coordinator agent?",
                    type: "MCQ",
                    options: [
                        "Decomposes goals, delegates subtasks to specialized workers, and aggregates final deliverables",
                        "Runs local shell commands exclusively",
                        "Stores vector embeddings on disk",
                        "Provides authentication credentials"
                    ],
                    correctAnswer: "Decomposes goals, delegates subtasks to specialized workers, and aggregates final deliverables",
                    explanation: "A Coordinator breaks down complex multi-step objectives, orchestrates worker agents with specific briefs, and combines outputs.",
                    marks: 5
                },
                {
                    questionText: "Which communication pattern enables decentralized, asynchronous multi-agent collaboration without point-to-point locking?",
                    type: "MCQ",
                    options: ["Shared Message Board (Blackboard pattern)", "Synchronous RPC Callbacks", "Single-threaded Pipeline", "Monolithic Monologue"],
                    correctAnswer: "Shared Message Board (Blackboard pattern)",
                    explanation: "A blackboard / message board architecture lets multiple autonomous agents post findings, read peer updates, and claim unassigned tasks.",
                    marks: 5
                },
                {
                    questionText: "What mechanism allows an autonomous LLM agent to interact with live databases, APIs, and file systems?",
                    type: "MCQ",
                    options: ["Tool Calling / Function Calling", "Prompt Compression", "Zero-Shot Sampling", "Beam Search"],
                    correctAnswer: "Tool Calling / Function Calling",
                    explanation: "Tool calling supplies structured JSON schemas of available functions to the model, allowing it to emit executable tool arguments.",
                    marks: 5
                }
            ]
        }
    },
    'JAVA-ENT-201': {
        1: {
            title: "Module 01: JVM Architecture & Object Lifecycle Exam",
            passingScorePercent: 60,
            timeLimitMinutes: 15,
            questions: [
                {
                    questionText: "Which component of the JVM compiles bytecode into native machine instructions at runtime for frequently executed hot spots?",
                    type: "MCQ",
                    options: ["JIT (Just-In-Time) Compiler", "Bytecode Verifier", "Class Loader Subsystem", "Garbage Collector"],
                    correctAnswer: "JIT (Just-In-Time) Compiler",
                    explanation: "The JIT compiler profiles execution and compiles hot bytecode methods directly into optimized native machine code.",
                    marks: 5
                },
                {
                    questionText: "Where are object instances allocated in the Java Virtual Machine runtime data areas?",
                    type: "MCQ",
                    options: ["Heap Memory", "JVM Thread Stack", "Program Counter (PC) Register", "Method Area"],
                    correctAnswer: "Heap Memory",
                    explanation: "All Java class instances and arrays are allocated in shared Heap memory, managed automatically by the Garbage Collector.",
                    marks: 5
                },
                {
                    questionText: "In Java generational garbage collection, where are newly instantiated objects initially placed?",
                    type: "MCQ",
                    options: ["Eden Space (in Young Generation)", "Old (Tenured) Generation", "Metaspace", "Permanent Generation"],
                    correctAnswer: "Eden Space (in Young Generation)",
                    explanation: "New objects are allocated in the Eden space of the Young Generation. Surviving objects are promoted through Survivor spaces (S0/S1) to Tenured.",
                    marks: 5
                },
                {
                    questionText: "What is the primary benefit of the Spring Framework's Inversion of Control (IoC) and Dependency Injection (DI)?",
                    type: "MCQ",
                    options: [
                        "Decouples component creation from usage, facilitating loose coupling, modularity, and testability",
                        "Accelerates network bandwidth",
                        "Compiles Java code directly to C++",
                        "Replaces SQL databases"
                    ],
                    correctAnswer: "Decouples component creation from usage, facilitating loose coupling, modularity, and testability",
                    explanation: "IoC delegates object lifecycle and dependency wiring to the Spring container, avoiding hardcoded instantiations.",
                    marks: 5
                }
            ]
        }
    }
};

async function seed() {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('MongoDB Connected successfully!');

    // 1. Seed C Quizzes (All 11 modules)
    const cCourse = await Course.findOne({ code: 'C-SYS-101' });
    if (cCourse && cCourse.modules) {
        console.log(`Seeding quizzes for C Course (${cCourse.modules.length} modules)...`);
        cCourse.modules.forEach(mod => {
            const quizDef = cQuizzes[mod.orderIndex];
            if (quizDef) {
                mod.quiz = quizDef;
                console.log(`  Added quiz for C Module ${mod.orderIndex}: "${quizDef.title}" (${quizDef.questions.length} questions)`);
            }
        });
        await cCourse.save();
        console.log('✅ All C Course module quizzes saved!');
    }

    // 2. Seed C++ Quizzes (All 9 modules)
    const cppCourse = await Course.findOne({ code: 'CPP-OOP-201' });
    if (cppCourse && cppCourse.modules) {
        console.log(`Seeding quizzes for C++ Course (${cppCourse.modules.length} modules)...`);
        cppCourse.modules.forEach(mod => {
            const quizDef = cppQuizzes[mod.orderIndex];
            if (quizDef) {
                mod.quiz = quizDef;
                console.log(`  Added quiz for C++ Module ${mod.orderIndex}: "${quizDef.title}" (${quizDef.questions.length} questions)`);
            }
        });
        await cppCourse.save();
        console.log('✅ All C++ Course module quizzes saved!');
    }

    // 3. Seed other courses
    for (const [code, mods] of Object.entries(otherQuizzes)) {
        const course = await Course.findOne({ code });
        if (course && course.modules) {
            console.log(`Seeding quizzes for ${code} (${course.modules.length} modules)...`);
            course.modules.forEach(mod => {
                const quizDef = mods[mod.orderIndex];
                if (quizDef) {
                    mod.quiz = quizDef;
                    console.log(`  Added quiz for ${code} Module ${mod.orderIndex}: "${quizDef.title}"`);
                }
            });
            await course.save();
            console.log(`✅ ${code} module quizzes saved!`);
        }
    }

    console.log('\n🎉 ALL COURSE MODULE QUIZZES HAVE BEEN SEEDED SUCCESSFULLY!');
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('Error seeding quizzes:', err);
    process.exit(1);
});

