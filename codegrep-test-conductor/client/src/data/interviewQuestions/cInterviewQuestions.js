// C Programming Company Interview Questions Repository
// 11 Modules x 15+ Authentic Company Questions with Company Name, Year, Difficulty, Question, and Detailed Solution

export const cInterviewQuestions = {
    // Module 1: Introduction of Programming Languages & Lifecycle
    1: {
        moduleTitle: "Introduction of Programming Languages & C Life Cycle",
        questions: [
            {
                id: "c-1-1",
                company: "Google",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What are the four discrete phases of the C compilation pipeline, and what intermediate files are produced at each stage?",
                explanation: "1. Preprocessing (`gcc -E`): Strips comments, expands `#include` header files, and evaluates macros (`#define`). Generates `.i` file.\n2. Compilation (`gcc -S`): Translates preprocessed C code into architecture-specific assembly instructions. Generates `.s` file.\n3. Assembly (`gcc -c`): Translates assembly mnemonics into machine code object files. Generates `.o` or `.obj` file.\n4. Linking (`gcc` or `ld`): Merges object files with runtime libraries (e.g. libc.so, crt0.o) and resolves symbol addresses to produce the final executable binary."
            },
            {
                id: "c-1-2",
                company: "Qualcomm",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "Explain the difference between Static Linking and Dynamic Linking in embedded C environments.",
                explanation: "Static linking copies all required library functions directly into the final executable image at build time. This results in larger binary sizes but eliminates runtime dependency issues (ideal for bare-metal systems). Dynamic linking leaves unresolved symbol stubs in the executable, which the OS dynamic loader (ld.so) binds to shared objects (.so / .dll) in RAM at runtime, saving disk space and memory across multiple processes."
            },
            {
                id: "c-1-3",
                company: "Microsoft",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Why does C require a function named `main()`? What happens if `main` does not return 0?",
                explanation: "The C runtime entry point (traditionally `_start` in crt0) sets up the stack frame, registers, and arguments (`argc`, `argv`), then transfers execution control directly to `main()`. Returning 0 indicates successful exit (`EXIT_SUCCESS`), while any non-zero value communicates an error code (`EXIT_FAILURE`) back to the invoking operating system environment."
            },
            {
                id: "c-1-4",
                company: "Amazon",
                year: 2022,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What does `gcc -Wall -Wextra -Werror` do, and why is it standard in production CI/CD?",
                explanation: "`-Wall` enables all commonly recommended compiler warnings; `-Wextra` activates additional strict warnings (such as unused parameters and sign comparisons); and `-Werror` elevates every warning to a fatal compilation error. In production CI/CD pipelines, this prevents undefined behavior, uninitialized variables, and subtle memory bugs from ever making it to release binaries."
            },
            {
                id: "c-1-5",
                company: "Intel",
                year: 2023,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is an ABI (Application Binary Interface) in C, and how does it differ from an API?",
                explanation: "An API (Application Programming Interface) is a source-code level contract specifying function names, parameters, and return types in header files. An ABI (Application Binary Interface) is a binary-level contract defining calling conventions (registers used for passing arguments, stack cleanup responsibility), data type alignment, struct padding, and endianness at the machine code level."
            },
            {
                id: "c-1-6",
                company: "Apple",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the role of `crt0.o` (C Runtime Zero) in launching a C program?",
                explanation: "`crt0.o` is an execution prelude object file linked by default into every C program. It handles kernel-to-user-space bootstrapping: parsing environment variables (`envp`), preparing command-line arguments into `argc` and `argv`, initializing static constructors, calling `main(argc, argv, envp)`, and finally passing `main()`'s return code to the `exit()` system call."
            },
            {
                id: "c-1-7",
                company: "TCS",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Why is C considered a middle-level programming language?",
                explanation: "C combines high-level structured programming language features (functions, control loops, modularity, user-defined types) with low-level assembly-like capabilities (direct memory addressing through pointers, bitwise manipulation, inline assembly, register keywords)."
            },
            {
                id: "c-1-8",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the difference between Syntax Errors, Runtime Errors, and Logical Errors in C?",
                explanation: "1. Syntax Error: Grammatical violation of C rules (missing semicolon, misspelled keyword) detected at compile time.\n2. Runtime Error: Fatal condition occurring during execution (segmentation fault from null dereference, division by zero).\n3. Logical Error: Code compiles and runs without crashing but produces mathematically incorrect outputs due to algorithmic bugs."
            },
            {
                id: "c-1-9",
                company: "NVIDIA",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "How does the preprocessor prevent duplicate header inclusions using Header Guards vs `#pragma once`?",
                explanation: "Header Guards use conditional compilation `#ifndef HEADER_NAME_H`, `#define HEADER_NAME_H`, and `#endif`, which is fully ANSI C standard compliant across every compiler. `#pragma once` is a non-standard compiler directive supported by all modern compilers that instructs the preprocessor to open and read the file only once per translation unit, speeding up compilation by avoiding file I/O overhead."
            },
            {
                id: "c-1-10",
                company: "Cisco",
                year: 2022,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What is the difference between `#include <stdio.h>` and `#include \"myheader.h\"`?",
                explanation: "`#include <file.h>` directs the preprocessor to search strictly within standard system library directories (e.g. `/usr/include`). `#include \"file.h\"` instructs the preprocessor to first look in the current working directory of the source file; if not found, it falls back to the system directory path."
            },
            {
                id: "c-1-11",
                company: "Samsung",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the difference between an uninitialized global variable and an uninitialized local variable in C memory layout?",
                explanation: "Uninitialized global/static variables are allocated in the BSS (Block Started by Symbol) segment and automatically zero-initialized by the kernel loader before execution. Uninitialized local variables reside on the runtime call stack frame and contain arbitrary undefined garbage data."
            },
            {
                id: "c-1-12",
                company: "Adobe",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the purpose of GDB (GNU Debugger) and what does compiling with `-g` do?",
                explanation: "Compiling with `-g` embeds DWARF debugging symbols (mapping machine instructions back to C source line numbers and variable names) into the compiled object file. GDB uses these symbols to set breakpoints, inspect CPU registers, print stack frames (`backtrace`), and track segmentation faults."
            },
            {
                id: "c-1-13",
                company: "IBM",
                year: 2022,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What causes a 'Undefined reference to symbol' error during the C build process?",
                explanation: "An 'Undefined reference' is a Linker (not compiler) error. It occurs when a function or variable has a prototype declaration available during compilation, but the linker cannot find the actual definition in any linked object file (.o) or library (.a/.so)."
            },
            {
                id: "c-1-14",
                company: "Wipro",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the return type of `printf()` in C?",
                explanation: "`printf()` returns an `int` representing the total number of characters successfully written to `stdout`, or a negative number if an output error occurs."
            },
            {
                id: "c-1-15",
                company: "Broadcom",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Translation Unit (TU) in C and how does internal linkage (`static`) affect it?",
                explanation: "A Translation Unit is the single stream of C tokens that results from running the preprocessor on a `.c` file and all headers it recursively includes. A function or global variable marked `static` has internal linkage: its symbol visibility is restricted exclusively to that single translation unit and cannot be resolved by the linker in other object files."
            }
        ]
    },

    // Module 2: 'C' Tokens, Data Types & Operators
    2: {
        moduleTitle: "'C' Tokens, Data Types & Operators",
        questions: [
            {
                id: "c-2-1",
                company: "Microsoft",
                year: 2024,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What is the output of `int a = 5; int b = a++ + ++a; printf(\"%d %d\", a, b);` in C?",
                explanation: "This invokes Undefined Behavior (UB) under the C standard before C23. Modifying `a` more than once between sequence points violates sequence point rules. Different compilers (GCC vs Clang vs MSVC) produce 12, 13, or 14 depending on register scheduling. In production C code, multiple modifications to the same variable within a single statement must never be written."
            },
            {
                id: "c-2-2",
                company: "Amazon",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the output of `printf(\"%d\", sizeof('a'));` in C vs C++?",
                explanation: "In C, character literals like `'a'` are integer constants of type `int`, so `sizeof('a')` equals `sizeof(int)` (typically 4 bytes on modern 32/64-bit systems). In C++, character literals have type `char`, so `sizeof('a')` is guaranteed to be 1 byte."
            },
            {
                id: "c-2-3",
                company: "Google",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "Write an optimized single-line C expression using bitwise operators to determine if an integer `n > 0` is a power of 2.",
                explanation: "Expression: `(n > 0) && ((n & (n - 1)) == 0)`\nExplanation: Powers of 2 in binary contain exactly one set bit (e.g., 8 is 1000). Subtracting 1 flips that bit and sets all lower bits (7 is 0111). Performing bitwise AND yields 0."
            },
            {
                id: "c-2-4",
                company: "Qualcomm",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "How do you swap two integers in C without using any temporary variable using bitwise XOR?",
                explanation: "Code:\n```c\na = a ^ b;\nb = a ^ b;\na = a ^ b;\n```\nExplanation: XOR is associative and symmetric ($x \\oplus x = 0$ and $x \\oplus 0 = x$). Caveat: If `a` and `b` point to the exact same memory address (aliased pointer), this zeroes the memory cell."
            },
            {
                id: "c-2-5",
                company: "Apple",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is Integer Promotion in C expressions?",
                explanation: "In C arithmetic expressions, any integer type smaller than `int` (namely `char`, `signed char`, `unsigned char`, `short`, and `unsigned short`) is automatically promoted to `int` (or `unsigned int` if `int` cannot represent all values of the original type) before performing the arithmetic operation."
            },
            {
                id: "c-2-6",
                company: "Cisco",
                year: 2023,
                difficulty: "Hard",
                type: "Output Prediction",
                question: "What is the output of `unsigned int x = 10; int y = -20; if (x + y > 0) printf(\"Positive\"); else printf(\"Negative\");`?",
                explanation: "Output: `Positive`.\nExplanation: Due to C Usual Arithmetic Conversions, when a signed int (`y = -20`) is combined with an unsigned int (`x = 10`), `y` is implicitly converted to an `unsigned int`. `-20` becomes a huge positive number (`4294967276` on 32-bit `UINT_MAX`), making the sum `> 0`."
            },
            {
                id: "c-2-7",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What are the naming rules for identifiers in ANSI C?",
                explanation: "1. Must begin with an alphabetical letter (a-z, A-Z) or underscore (`_`).\n2. Subsequent characters may include letters, digits (0-9), and underscores.\n3. Cannot contain whitespace or special symbols (`@`, `$`, `-`, `%`).\n4. Cannot match any of C's 32 reserved keywords.\n5. Case-sensitive (`total` and `Total` are distinct)."
            },
            {
                id: "c-2-8",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the output of `printf(\"%d\", 5 / 2);` vs `printf(\"%.1f\", 5.0 / 2);`?",
                explanation: "`5 / 2` evaluates to integer `2` because both operands are integers (truncating fractional remainder). `5.0 / 2` promotes `2` to `double 2.0`, resulting in floating-point division `2.5`."
            },
            {
                id: "c-2-9",
                company: "Texas Instruments",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "Write a C macro to set, clear, and toggle the $k$-th bit of a register `REG`.",
                explanation: "```c\n#define SET_BIT(REG, k)   ((REG) |= (1U << (k)))\n#define CLEAR_BIT(REG, k) ((REG) &= ~(1U << (k)))\n#define TOGGLE_BIT(REG, k) ((REG) ^= (1U << (k)))\n#define CHECK_BIT(REG, k) (((REG) >> (k)) & 1U)\n```"
            },
            {
                id: "c-2-10",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the difference between `const int *ptr`, `int * const ptr`, and `const int * const ptr`?",
                explanation: "1. `const int *ptr` (or `int const *ptr`): Pointer to constant integer. You cannot modify the value pointed to (`*ptr = 10` illegal), but you can point to another address (`ptr = &b` legal).\n2. `int * const ptr`: Constant pointer to an integer. You can modify the value (`*ptr = 10` legal), but the pointer address is immutable (`ptr = &b` illegal).\n3. `const int * const ptr`: Constant pointer to constant integer. Neither address nor data can be changed."
            },
            {
                id: "c-2-11",
                company: "NVIDIA",
                year: 2023,
                difficulty: "Hard",
                type: "Output Prediction",
                question: "What is the output of `int i = 0; if (i == 0 || ++i) printf(\"%d\", i);`?",
                explanation: "Output: `0`.\nExplanation: C logical OR (`||`) uses short-circuit evaluation. Because the left condition `i == 0` evaluates to true (1), the right expression `++i` is never evaluated, leaving `i` as 0."
            },
            {
                id: "c-2-12",
                company: "Samsung",
                year: 2022,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the difference between `float`, `double`, and `long double` in IEEE 754 precision?",
                explanation: "`float`: Single precision (32 bits, 1 sign, 8 exponent, 23 mantissa) ~7 decimal digits of precision. `double`: Double precision (64 bits, 1 sign, 11 exponent, 52 mantissa) ~15-17 decimal digits. `long double`: Extended precision (typically 80-bit on x86 or 128-bit on ARM/RISC-V) providing 19-34 decimal digits."
            },
            {
                id: "c-2-13",
                company: "Adobe",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is a Literal Constant vs Symbolic Constant in C?",
                explanation: "A literal constant is an explicit data value written directly into the code (e.g. `42`, `3.14f`, `'A'`). A symbolic constant is an identifier representing a fixed value, defined using `#define PI 3.14159` or `const double PI = 3.14159;`."
            },
            {
                id: "c-2-14",
                company: "Intel",
                year: 2023,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What does the `volatile` type qualifier tell the C compiler?",
                explanation: "The `volatile` keyword tells the compiler that the value of the variable may be changed at any time by something outside the program's control (such as hardware registers, memory-mapped I/O, or a concurrent ISR thread). This disables compiler read/write caching optimizations and forces the CPU to fetch from actual memory on every single access."
            },
            {
                id: "c-2-15",
                company: "Broadcom",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Explain Operator Precedence vs Operator Associativity with an example.",
                explanation: "Precedence determines which operator binds first when operators have different priority levels (e.g. `2 + 3 * 4` evaluates as `2 + (3 * 4) = 14`). Associativity determines evaluation direction (Left-to-Right or Right-to-Left) when operators have the exact same precedence (e.g. `a = b = c = 5` evaluates Right-to-Left; `10 - 4 - 2` evaluates Left-to-Right as `(10 - 4) - 2 = 4`)."
            }
        ]
    },

    // Module 3: Control Statements & Expressions
    3: {
        moduleTitle: "Control Statements & Expressions",
        questions: [
            {
                id: "c-3-1",
                company: "Google",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Why can the switch expression in C only evaluate integer or character types and not floating-point numbers or strings?",
                explanation: "C `switch` statements compile into an efficient Jump Table (indirect branch via jump target array) or binary search tree of comparison instructions at the assembly level. Jump tables require discrete, contiguous integer indices (`O(1)` time jump). Floating-point values have infinite representations and precision tolerances, and strings require pointer comparisons or `strcmp()`, preventing O(1) jump table generation."
            },
            {
                id: "c-3-2",
                company: "Amazon",
                year: 2024,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is 'Fall-Through' in a switch case, and when is it intentionally useful?",
                explanation: "Fall-through happens when a `case` block does not end with a `break` statement, causing execution to flow unconditionally into subsequent case statements regardless of their labels. It is intentionally useful for grouping multiple cases together (e.g. `case 'a': case 'A': count++; break;`) or in Duff's Device for loop unrolling."
            },
            {
                id: "c-3-3",
                company: "Microsoft",
                year: 2023,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What is the output of `int x = 1; switch (x) { default: printf(\"Def \"); case 1: printf(\"One \"); case 2: printf(\"Two \"); }`?",
                explanation: "Output: `One Two `.\nExplanation: Execution matches `case 1:` first, prints 'One '. Because there is no `break`, execution falls through into `case 2:` and prints 'Two '. `default:` is ignored because an exact match existed."
            },
            {
                id: "c-3-4",
                company: "Qualcomm",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "Implement a branchless C expression to find the maximum of two integers without using `if`, `switch`, or ternary `?:`.",
                explanation: "```c\nint max(int a, int b) {\n    return a - ((a - b) & ((a - b) >> 31));\n}\n```\nExplanation: On 32-bit two's complement architectures, `(a - b) >> 31` yields `-1` (all 1s) if `a < b`, or `0` if `a >= b`. When `a < b`, `a - (a - b) = b`. When `a >= b`, `a - 0 = a`."
            },
            {
                id: "c-3-5",
                company: "Apple",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the Dangling Else problem in C, and how does the compiler resolve it?",
                explanation: "The Dangling Else problem occurs when nested `if` statements have fewer `else` clauses than `if`s (e.g. `if (c1) if (c2) s1; else s2;`). The ANSI C grammar resolves ambiguity by binding the `else` to the nearest preceding open `if` that does not already have an `else`. Programmers should always use curly braces `{}` to avoid confusion."
            },
            {
                id: "c-3-6",
                company: "Cisco",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the output of `if (-5) printf(\"True\"); else printf(\"False\");`?",
                explanation: "Output: `True`.\nExplanation: In C, any non-zero value (including negative numbers like -5) evaluates as boolean TRUE. Only exact `0` (and `NULL`) evaluates as FALSE."
            },
            {
                id: "c-3-7",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the common bug in `if (x = 0)` vs `if (x == 0)`?",
                explanation: "`x == 0` tests for equality. `x = 0` is an assignment expression that overwrites `x` with `0` and evaluates to the assigned value `0` (FALSE), so the `if` body never executes. Good practice is using Yoda conditions like `if (0 == x)` where accidental assignment `0 = x` triggers a compiler error."
            },
            {
                id: "c-3-8",
                company: "Intel",
                year: 2023,
                difficulty: "Hard",
                type: "Conceptual",
                question: "When is the `goto` statement justified in Linux kernel C programming?",
                explanation: "In systems programming and the Linux kernel, `goto` is standard for centralized error handling and cleanup (RAII simulation). When allocating multiple resources (locks, memory, file descriptors), jumping forward to cleanup labels in reverse order (`goto err_free_mem; err_unlock: ...`) prevents deep nested conditionals and avoids code duplication."
            },
            {
                id: "c-3-9",
                company: "Infosys",
                year: 2022,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the value of `int res = 10 > 5 ? 1 : 2;`?",
                explanation: "`res = 1`. The ternary operator evaluates condition `10 > 5` (true), returning the first expression `1`."
            },
            {
                id: "c-3-10",
                company: "NVIDIA",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the difference between explicit type casting and implicit type conversion in arithmetic expressions?",
                explanation: "Implicit type conversion (coercion) is performed automatically by the compiler to promote operands to a common type without data loss (e.g. `int + float -> float`). Explicit type casting is specified by the programmer using `(type)val` to force conversion, which may truncate or re-interpret data (e.g. `(int)3.99 -> 3`)."
            },
            {
                id: "c-3-11",
                company: "Adobe",
                year: 2023,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What does `int x = (1, 2, 3);` evaluate to in C?",
                explanation: "`x = 3`. The comma operator `,` evaluates each operand from left to right and returns the value of the rightmost operand."
            },
            {
                id: "c-3-12",
                company: "Samsung",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Can case labels in a switch statement be variable expressions like `case x + 2:`?",
                explanation: "No. In C, `case` labels must be compile-time integer constant expressions (such as `case 5:`, `case 'A':`, or `case 2 * 3:`). Variable expressions are illegal because jump tables must be computed at compile time."
            },
            {
                id: "c-3-13",
                company: "IBM",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What happens if no `default` case is specified in a switch statement and no case matches?",
                explanation: "If no case matches and there is no `default` label, the entire `switch` block is simply skipped and execution continues at the statement immediately following the closing curly brace."
            },
            {
                id: "c-3-14",
                company: "Wipro",
                year: 2024,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "Can you place a `default` label at the top of a switch statement instead of at the bottom?",
                explanation: "Yes, `default` can appear anywhere inside the `switch` block (top, middle, or bottom). If no other case matches, execution jumps directly to `default`. If placed at the top without a `break`, it will fall through to subsequent cases."
            },
            {
                id: "c-3-15",
                company: "Broadcom",
                year: 2024,
                difficulty: "Hard",
                type: "Output Prediction",
                question: "What is the output of `int a = 10; if (a = 0) printf(\"A\"); else if (a = -1) printf(\"B\"); else printf(\"C\");`?",
                explanation: "Output: `B`.\nExplanation: The first condition assigns `a = 0` which evaluates to false (0). The `else if` assigns `a = -1` which evaluates to true (non-zero), executing `printf(\"B\")`."
            }
        ]
    },

    // Module 4: Looping Constructs
    4: {
        moduleTitle: "Looping Constructs (for, while, do-while)",
        questions: [
            {
                id: "c-4-1",
                company: "Google",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the exact semantic difference between `while (cond)` and `do { ... } while (cond)`?",
                explanation: "`while` is an entry-controlled loop: the condition is tested before executing the loop body. If the condition is false initially, the body executes 0 times. `do-while` is an exit-controlled loop: the body executes first, and the condition is tested at the end, guaranteeing at least one execution."
            },
            {
                id: "c-4-2",
                company: "Amazon",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What does `for (;;)` represent in C, and how does it compare to `while (1)`?",
                explanation: "Both represent an infinite loop. `for (;;)` has no condition specified; the C standard explicitly defines an empty condition in a `for` loop as evaluating to true (1). Modern compilers generate the identical assembly unconditional jump (`jmp`) instruction for both."
            },
            {
                id: "c-4-3",
                company: "Microsoft",
                year: 2024,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What is the output of `int i = 0; while (i++ < 3) { printf(\"%d \", i); }`?",
                explanation: "Output: `1 2 3 `.\nIteration 1: `i` is 0 (< 3 true), incremented to 1, prints 1.\nIteration 2: `i` is 1 (< 3 true), incremented to 2, prints 2.\nIteration 3: `i` is 2 (< 3 true), incremented to 3, prints 3.\nIteration 4: `i` is 3 (< 3 false), incremented to 4, loop terminates."
            },
            {
                id: "c-4-4",
                company: "Qualcomm",
                year: 2023,
                difficulty: "Hard",
                type: "Coding",
                question: "Write an optimized C function to reverse the digits of an integer `n` using a while loop.",
                explanation: "```c\nlong reverseDigits(int n) {\n    long rev = 0;\n    while (n != 0) {\n        rev = rev * 10 + (n % 10);\n        n /= 10;\n    }\n    return rev;\n}\n```"
            },
            {
                id: "c-4-5",
                company: "Apple",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is Loop Unrolling and why do optimizing compilers (`-O3`) perform it?",
                explanation: "Loop unrolling replicates the loop body multiple times to decrease loop control overhead (condition checks and counter increments) and expose instruction-level parallelism (ILP) to modern CPU pipeline execution units."
            },
            {
                id: "c-4-6",
                company: "Cisco",
                year: 2024,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the difference between `break` and `continue` inside a nested loop?",
                explanation: "`break` completely terminates the innermost enclosing loop and transfers control to the statement right after the loop. `continue` skips the remainder of the current iteration and immediately transfers control to the next iteration's update step (in `for`) or condition check (in `while`)."
            },
            {
                id: "c-4-7",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Coding",
                question: "Write a C loop to print Fibonacci sequence numbers up to $N$ terms.",
                explanation: "```c\nvoid printFibonacci(int n) {\n    long a = 0, b = 1;\n    for (int i = 0; i < n; i++) {\n        printf(\"%ld \", a);\n        long next = a + b;\n        a = b;\n        b = next;\n    }\n    printf(\"\\n\");\n}\n```"
            },
            {
                id: "c-4-8",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the output of `for (int i = 0; i < 5; i++); printf(\"%d\", i);` in C99?",
                explanation: "In C99+, this causes a compile error: `error: 'i' undeclared`. Variable `i` declared inside `for (int i = 0; ...)` is scoped strictly to that loop. Furthermore, the trailing semicolon `;` acts as an empty statement, so the loop executes 5 times doing nothing."
            },
            {
                id: "c-4-9",
                company: "NVIDIA",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Duff's Device and how does it interleave a `switch` inside a `do-while` loop?",
                explanation: "Duff's Device is a manual loop unrolling mechanism invented by Tom Duff. It uses the valid C grammar feature where `case` labels can exist inside nested loop blocks:\n```c\nint n = (count + 7) / 8;\nswitch (count % 8) {\n    case 0: do { *to = *from++;\n    case 7:      *to = *from++;\n    case 6:      *to = *from++;\n    case 5:      *to = *from++;\n    case 4:      *to = *from++;\n    case 3:      *to = *from++;\n    case 2:      *to = *from++;\n    case 1:      *to = *from++;\n            } while (--n > 0);\n}\n```"
            },
            {
                id: "c-4-10",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "Write a C function to check if a number is prime using a loop running in $O(\\sqrt{N})$ time.",
                explanation: "```c\nbool isPrime(int n) {\n    if (n <= 1) return false;\n    if (n <= 3) return true;\n    if (n % 2 == 0 || n % 3 == 0) return false;\n    for (int i = 5; i * i <= n; i += 6) {\n        if (n % i == 0 || n % (i + 2) == 0) return false;\n    }\n    return true;\n}\n```"
            },
            {
                id: "c-4-11",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the output of `int x = 10; do { printf(\"%d \", x); } while (x < 5);`?",
                explanation: "Output: `10 `.\nExplanation: The `do-while` loop body executes unconditionally before checking condition `x < 5`. Because `10 < 5` is false, the loop terminates after printing 10 once."
            },
            {
                id: "c-4-12",
                company: "Adobe",
                year: 2024,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What happens when using `unsigned int i; for (i = 10; i >= 0; i--)`?",
                explanation: "Infinite loop! An `unsigned int` can never be negative ($i \\ge 0$ is always true). When `i` is 0, `i--` underflows and wraps around to `UINT_MAX` (4294967295), looping forever."
            },
            {
                id: "c-4-13",
                company: "Wipro",
                year: 2023,
                difficulty: "Easy",
                type: "Coding",
                question: "Write a C program to find the factorial of an integer using a for loop.",
                explanation: "```c\nunsigned long long factorial(int n) {\n    unsigned long long fact = 1;\n    for (int i = 2; i <= n; i++) {\n        fact *= i;\n    }\n    return fact;\n}\n```"
            },
            {
                id: "c-4-14",
                company: "IBM",
                year: 2022,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Can multiple variables be initialized and incremented in a single `for` loop statement?",
                explanation: "Yes, using the comma operator `,`: `for (int i = 0, j = 10; i < j; i++, j--) { ... }`. All initialized variables must share the same base type in C99 declaration syntax."
            },
            {
                id: "c-4-15",
                company: "Broadcom",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Loop Invariant Code Motion (LICM)?",
                explanation: "LICM is a compiler optimization technique that detects statements or expressions inside a loop whose result does not change across iterations (e.g. `for (int i = 0; i < strlen(str); i++)`). The compiler hoists `strlen(str)` outside the loop so it executes once rather than $O(N)$ times."
            }
        ]
    },

    // Module 5: Arrays & String
    5: {
        moduleTitle: "Arrays & Strings",
        questions: [
            {
                id: "c-5-1",
                company: "Google",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Array Decay in C? Under what two circumstances does an array name NOT decay into a pointer?",
                explanation: "Array decay is the automatic conversion of an array's name into a pointer to its first element (`&arr[0]`) when passed to functions or used in expressions. An array does NOT decay into a pointer in exactly two cases:\n1. When passed as operand to `sizeof(arr)` (returns total byte size of entire array).\n2. When passed as operand to address-of `&arr` (returns pointer to entire array `int (*)[N]`)."
            },
            {
                id: "c-5-2",
                company: "Amazon",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "Write an in-place C function to reverse a string terminated by null byte `\\0`.",
                explanation: "```c\nvoid reverseString(char *s) {\n    if (!s) return;\n    int left = 0, right = strlen(s) - 1;\n    while (left < right) {\n        char tmp = s[left];\n        s[left] = s[right];\n        s[right] = tmp;\n        left++;\n        right--;\n    }\n}\n```"
            },
            {
                id: "c-5-3",
                company: "Microsoft",
                year: 2024,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What is the difference between `char str[] = \"Hello\";` and `char *ptr = \"Hello\";`?",
                explanation: "`char str[] = \"Hello\";` allocates a 6-byte array on the runtime stack and copies the characters into it. Modifying `str[0] = 'h'` is completely legal.\n`char *ptr = \"Hello\";` points directly to the string literal stored in read-only text/data segment memory (.rodata). Attempting `ptr[0] = 'h'` causes a fatal segmentation fault (SIGSEGV)."
            },
            {
                id: "c-5-4",
                company: "Qualcomm",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "Explain row-major order storage in 2D C arrays and calculate the memory address of `arr[i][j]`.",
                explanation: "C stores multi-dimensional arrays in Row-Major order (consecutive rows laid out contiguously in memory). For an array declared as `T arr[R][C]` with base address `B` and element size `S = sizeof(T)`: Address of `arr[i][j] = B + (i * C + j) * S`."
            },
            {
                id: "c-5-5",
                company: "Apple",
                year: 2023,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What is the output of `int a[5] = {1, 2, 3}; printf(\"%d %d\", a[3], a[4]);`?",
                explanation: "Output: `0 0`.\nExplanation: In C, if an array initializer list provides fewer elements than the declared size, the remaining elements are automatically zero-initialized."
            },
            {
                id: "c-5-6",
                company: "Cisco",
                year: 2023,
                difficulty: "Hard",
                type: "Coding",
                question: "Why is `gets()` deprecated and removed from the C11 standard? What should be used instead?",
                explanation: "`gets()` cannot check buffer boundaries and reads until newline or EOF, creating catastrophic Buffer Overflow vulnerabilities that overwrite the stack return address. Programmers must use `fgets(buffer, sizeof(buffer), stdin)` which limits the maximum characters read."
            },
            {
                id: "c-5-7",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Coding",
                question: "Write custom C code implementing `strlen()` without using `<string.h>`.",
                explanation: "```c\nsize_t custom_strlen(const char *s) {\n    const char *p = s;\n    while (*p) p++;\n    return p - s;\n}\n```"
            },
            {
                id: "c-5-8",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the difference between `sizeof(\"hello\")` and `strlen(\"hello\")`?",
                explanation: "`sizeof(\"hello\")` evaluates to `6` because it counts all characters plus the trailing null terminator `\\0`. `strlen(\"hello\")` evaluates to `5` because it counts characters up to (but excluding) the null terminator."
            },
            {
                id: "c-5-9",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "Implement `strcpy()` with pointer arithmetic.",
                explanation: "```c\nchar* custom_strcpy(char *dest, const char *src) {\n    char *res = dest;\n    while ((*dest++ = *src++));\n    return res;\n}\n```\nExplanation: Copies each byte until the null terminator `\\0` is copied, which evaluates to 0 and stops the while loop."
            },
            {
                id: "c-5-10",
                company: "NVIDIA",
                year: 2024,
                difficulty: "Hard",
                type: "Output Prediction",
                question: "What does `2[arr]` mean in C? Why does it work identically to `arr[2]`?",
                explanation: "In C, array subscript syntax `arr[i]` is defined by the compiler as `*(arr + i)`. Because addition is commutative, `*(arr + i) == *(i + arr) == i[arr]`. Therefore, `2[arr]` is completely valid syntax identical to `arr[2]`."
            },
            {
                id: "c-5-11",
                company: "Intel",
                year: 2023,
                difficulty: "Hard",
                type: "Coding",
                question: "How do you find the second largest element in an unsorted integer array in $O(N)$ time with one pass?",
                explanation: "```c\nint secondLargest(int arr[], int n) {\n    int first = INT_MIN, second = INT_MIN;\n    for (int i = 0; i < n; i++) {\n        if (arr[i] > first) {\n            second = first;\n            first = arr[i];\n        } else if (arr[i] > second && arr[i] != first) {\n            second = arr[i];\n        }\n    }\n    return second;\n}\n```"
            },
            {
                id: "c-5-12",
                company: "Samsung",
                year: 2022,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What are Variable Length Arrays (VLAs) in C99, and why does the Linux kernel forbid them?",
                explanation: "VLAs allow sizing arrays with runtime variables (e.g. `int arr[n];`). The Linux kernel forbids them because VLAs allocate dynamic variable amounts of memory on the limited kernel stack (typically 8KB-16KB), risking unhandled stack overflow and silent memory corruption."
            },
            {
                id: "c-5-13",
                company: "Adobe",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "Write a function to check if a string is a Palindrome ignoring case.",
                explanation: "```c\nbool isPalindrome(const char *s) {\n    int l = 0, r = strlen(s) - 1;\n    while (l < r) {\n        if (tolower(s[l]) != tolower(s[r])) return false;\n        l++; r--;\n    }\n    return true;\n}\n```"
            },
            {
                id: "c-5-14",
                company: "Wipro",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What happens when accessing an array out-of-bounds in C (e.g. `arr[10]` on `arr[5]`)?",
                explanation: "C does not perform runtime array bounds checking. Accessing `arr[10]` reads or writes into neighboring memory, causing Undefined Behavior (UB), potential stack smashing, data corruption, or segmentation faults."
            },
            {
                id: "c-5-15",
                company: "Broadcom",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "Explain how `memcpy` differs from `memmove` when dealing with overlapping memory blocks.",
                explanation: "`memcpy()` assumes source and destination buffers do not overlap; if they do overlap, behavior is undefined and memory corruption occurs. `memmove()` safely handles overlapping memory by checking pointer positions and copying backward or via a temporary buffer."
            }
        ]
    },

    // Module 6: Functions
    6: {
        moduleTitle: "Functions & Recursion",
        questions: [
            {
                id: "c-6-1",
                company: "Google",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Explain what happens on the Call Stack during a C function call.",
                explanation: "1. Caller pushes function arguments (or loads them into registers per ABI convention like System V x86-64).\n2. CPU executes `call` instruction: pushes the Return Instruction Pointer (`RIP`) onto the stack.\n3. Callee prologue executes: saves caller's Base Pointer `push %rbp`, sets `rbp = rsp`, and decrements stack pointer `rsp` to allocate space for local variables.\n4. Callee executes.\n5. Callee epilogue restores stack pointer `mov %rbp, %rsp`, pops `%rbp`, and executes `ret` which pops return address back to `RIP`."
            },
            {
                id: "c-6-2",
                company: "Microsoft",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Does C support Call by Reference natively?",
                explanation: "No. C is strictly **Call by Value**. To achieve reference semantics (modifying caller variables), C passes pointer values by value (Call by Address / Pointer). The address itself is copied into the parameter variable."
            },
            {
                id: "c-6-3",
                company: "Amazon",
                year: 2024,
                difficulty: "Medium",
                type: "Coding",
                question: "Write a function pointer declaration for a function taking two `int` parameters and returning an `int`.",
                explanation: "```c\nint (*funcPtr)(int, int);\n// Usage:\nint add(int a, int b) { return a + b; }\nfuncPtr = add;\nint result = funcPtr(5, 10); // result = 15\n```"
            },
            {
                id: "c-6-4",
                company: "Qualcomm",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Tail Call Optimization (TCO) in recursive C functions?",
                explanation: "Tail recursion occurs when the recursive call is the absolute final action in the function (nothing left to compute after the call returns). An optimizing compiler (`-O2`) re-uses the current stack frame instead of allocating a new stack frame, effectively transforming recursion into an iterative loop with $O(1)$ space."
            },
            {
                id: "c-6-5",
                company: "Apple",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is an `inline` function in C99, and how does it differ from a macro `#define`?",
                explanation: "An `inline` function suggests to the compiler to replace the function call directly with the function's machine code body, eliminating call overhead. Unlike preprocessor macros, `inline` functions perform strict type checking, respect variable scope, evaluate arguments exactly once, and are safe from operator precedence bugs."
            },
            {
                id: "c-6-6",
                company: "Cisco",
                year: 2023,
                difficulty: "Hard",
                type: "Coding",
                question: "How do variadic functions like `printf(const char *format, ...)` work using `<stdarg.h>`?",
                explanation: "Variadic functions access variable argument lists using macros from `<stdarg.h>`:\n1. `va_list args;` declares argument pointer.\n2. `va_start(args, format);` initializes pointer after last named parameter.\n3. `va_arg(args, type);` retrieves the next argument cast to `type`.\n4. `va_end(args);` cleans up the argument pointer."
            },
            {
                id: "c-6-7",
                company: "TCS",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the difference between Function Declaration (Prototype) and Function Definition?",
                explanation: "A Declaration (e.g. `int add(int, int);`) informs the compiler of the function's name, return type, and parameter types without allocating code memory. A Definition (e.g. `int add(int a, int b) { return a + b; }`) provides the executable body and allocates machine instructions in the code segment."
            },
            {
                id: "c-6-8",
                company: "Infosys",
                year: 2022,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What happens if a non-void function in C reaches the closing brace without executing a `return` statement?",
                explanation: "Reaching the end of a non-void function without a `return` statement invokes Undefined Behavior (UB) if the caller attempts to read the return value. In practice, the caller reads whatever garbage value was left in the CPU return register (e.g. `%eax`/`%rax`)."
            },
            {
                id: "c-6-9",
                company: "NVIDIA",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "Write a recursive C function to solve the Tower of Hanoi problem for $N$ disks.",
                explanation: "```c\nvoid towerOfHanoi(int n, char from, char to, char aux) {\n    if (n == 1) {\n        printf(\"Move disk 1 from %c to %c\\n\", from, to);\n        return;\n    }\n    towerOfHanoi(n - 1, from, aux, to);\n    printf(\"Move disk %d from %c to %c\\n\", n, from, to);\n    towerOfHanoi(n - 1, aux, to, from);\n}\n```"
            },
            {
                id: "c-6-10",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What are callback functions in C, and how does `qsort()` utilize them?",
                explanation: "A callback function is a function passed as an argument via a function pointer to another function, which invokes it later. `qsort()` takes a comparator callback `int (*cmp)(const void *, const void *)` to decouple the sorting algorithm from the data type being compared."
            },
            {
                id: "c-6-11",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What is the output of `int f(int n) { if (n <= 1) return 1; return n * f(n-1); }` for `f(4)`?",
                explanation: "Output: `24`.\nCall sequence: $4 \\times f(3) = 4 \\times (3 \\times f(2)) = 4 \\times 3 \\times (2 \\times f(1)) = 4 \\times 3 \\times 2 \\times 1 = 24$."
            },
            {
                id: "c-6-12",
                company: "Samsung",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Can a C function return multiple values directly? If not, what are the workarounds?",
                explanation: "No, a C function can return at most one value via the `return` statement. Workarounds include:\n1. Passing pointers as 'out parameters' (e.g. `void getCoords(int *x, int *y)`).\n2. Bundling values into a `struct` and returning the struct by value."
            },
            {
                id: "c-6-13",
                company: "Adobe",
                year: 2024,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the output of returning a pointer to a local stack variable from a function?",
                explanation: "Returning a pointer to a local stack variable causes a Dangling Pointer and Undefined Behavior. When the function returns, its stack frame is invalidated and will be overwritten by subsequent function calls."
            },
            {
                id: "c-6-14",
                company: "Wipro",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the difference between recursion and iteration?",
                explanation: "Recursion repeatedly invokes a function on smaller sub-problems, requiring $O(N)$ stack memory overhead for activation frames and risking stack overflow. Iteration uses a loop construct within a single stack frame with $O(1)$ auxiliary space."
            },
            {
                id: "c-6-15",
                company: "Broadcom",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is a Reentrant function in C?",
                explanation: "A reentrant function can be safely interrupted in the middle of execution (e.g. by a hardware ISR signal or context switch) and re-invoked concurrently without corrupting shared state. Reentrant functions only use local stack variables and never read or write non-const global or static variables without synchronization."
            }
        ]
    },

    // Module 7: Pointers
    7: {
        moduleTitle: "Pointers & Pointer Arithmetic",
        questions: [
            {
                id: "c-7-1",
                company: "Google",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the difference between NULL, NUL, and `nullptr`?",
                explanation: "1. `NULL`: A macro defined in `<stddef.h>` representing a null pointer constant (typically `((void*)0)` in C or `0` in C++).\n2. `NUL`: The ASCII character constant `'\\0'` with integer value 0 used to terminate C strings.\n3. `nullptr`: A strongly-typed null pointer literal introduced in C++11 and C23 to resolve type deduction ambiguities."
            },
            {
                id: "c-7-2",
                company: "Amazon",
                year: 2023,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "If `int *ptr = 1000;`, what is the value of `ptr + 1` on a 64-bit architecture?",
                explanation: "The value is `1004` (not 1001). In C pointer arithmetic, adding 1 advances the pointer by `1 * sizeof(*ptr)`. Because `sizeof(int)` is 4 bytes, `1000 + 4 = 1004`."
            },
            {
                id: "c-7-3",
                company: "Microsoft",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is a Dangling Pointer, a Wild Pointer, and a Memory Leak in C?",
                explanation: "1. Dangling Pointer: Points to a memory address that has already been deallocated (via `free()` or stack return).\n2. Wild Pointer: An uninitialized pointer pointing to arbitrary garbage memory.\n3. Memory Leak: Heap memory allocated via `malloc()` whose pointer reference was lost without calling `free()`, making the block unrecoverable until process exit."
            },
            {
                id: "c-7-4",
                company: "Qualcomm",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "What is a `void*` (generic pointer) and why can you NOT perform arithmetic directly on `void*` in strict ANSI C?",
                explanation: "`void*` represents a raw memory address with no associated data type. Because `void` has an incomplete type with unknown size (`sizeof(void)` is undefined under ISO C), the compiler cannot determine how many bytes to advance for `ptr + 1`. GCC allows it as an extension treating `sizeof(void) == 1`, but portable code must cast to `char*` or `uint8_t*` before arithmetic."
            },
            {
                id: "c-7-5",
                company: "Apple",
                year: 2023,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What does `int **ptr` represent? Provide an authentic use case.",
                explanation: "`int **ptr` is a pointer to a pointer to an integer. Authentic use cases include:\n1. Dynamic 2D arrays (array of pointer rows allocated via `malloc`).\n2. Modifying a caller's pointer inside a function (e.g. `void allocate(int **p) { *p = malloc(...); }`)."
            },
            {
                id: "c-7-6",
                company: "Cisco",
                year: 2023,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Pointer Aliasing and what does the `restrict` keyword do in C99?",
                explanation: "Pointer aliasing occurs when two or more pointers refer to the exact same memory location. The `restrict` keyword asserts to the compiler that for the lifetime of that pointer, the target object will only be accessed through that specific pointer, allowing the compiler to aggressively cache loads in CPU registers."
            },
            {
                id: "c-7-7",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the output of `int a = 10; int *p = &a; *p = 20; printf(\"%d\", a);`?",
                explanation: "Output: `20`.\nDereferencing `*p` directly accesses and overwrites the memory cell of variable `a`."
            },
            {
                id: "c-7-8",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the size of a pointer variable in C?",
                explanation: "The size of a pointer is strictly determined by the target CPU machine architecture:\n- 4 bytes (32 bits) on a 32-bit system.\n- 8 bytes (64 bits) on a 64-bit system.\nIt is identical regardless of the data type pointed to (`char*`, `int*`, or `double*`)."
            },
            {
                id: "c-7-9",
                company: "NVIDIA",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "Explain the difference between `int *arr[5]` and `int (*arr)[5]`.",
                explanation: "`int *arr[5]` is an **Array of 5 pointers to integers** (allocates 5 pointer slots).\n`int (*arr)[5]` is a **Pointer to an array of 5 integers** (allocates 1 pointer slot that points to a contiguous block of 5 ints)."
            },
            {
                id: "c-7-10",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "How do you detect a cycle in a linked list using Floyd's Cycle Detection algorithm (Tortoise and Hare)?",
                explanation: "```c\nbool hasCycle(struct Node *head) {\n    struct Node *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return true;\n    }\n    return false;\n}\n```"
            },
            {
                id: "c-7-11",
                company: "Intel",
                year: 2023,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What causes a Segmentation Fault (SIGSEGV) when working with pointers?",
                explanation: "A segmentation fault is triggered by the CPU Memory Management Unit (MMU) when a program attempts to access a virtual memory address that is not mapped in its page table or violates access permissions (e.g. dereferencing `NULL`, writing to read-only string literal memory, or accessing unallocated addresses)."
            },
            {
                id: "c-7-12",
                company: "Samsung",
                year: 2023,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What is the result of subtracting two pointers pointing into the same array: `&arr[5] - &arr[2]`?",
                explanation: "The result is integer `3` (of type `ptrdiff_t`). Pointer subtraction yields the count of elements between them, not the byte difference."
            },
            {
                id: "c-7-13",
                company: "Adobe",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "Write a function that accepts an array via pointer and size to find the array sum.",
                explanation: "```c\nlong sumArray(const int *arr, size_t n) {\n    long sum = 0;\n    for (size_t i = 0; i < n; i++) {\n        sum += *(arr + i);\n    }\n    return sum;\n}\n```"
            },
            {
                id: "c-7-14",
                company: "Wipro",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Can we add two pointers together in C? (e.g. `ptr1 + ptr2`)",
                explanation: "No. Adding two pointers is illegal and causes a compiler error. Adding two memory addresses has no logical mathematical meaning in address space."
            },
            {
                id: "c-7-15",
                company: "Broadcom",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Memory Alignment and how does Unaligned Pointer Access impact modern CPUs?",
                explanation: "CPUs access memory in word-sized chunks (4 or 8 bytes). Natural alignment requires $k$-byte types to reside at addresses divisible by $k$. Unaligned access forces the CPU to issue two bus cycles and perform bitwise shifts, causing significant latency penalties or triggering hardware alignment faults (bus error `SIGBUS` on architectures like ARM and SPARC)."
            }
        ]
    },

    // Module 8: Structure, Union & Enums
    8: {
        moduleTitle: "Structure, Union & Enums",
        questions: [
            {
                id: "c-8-1",
                company: "Google",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "Explain Structure Padding and Memory Alignment in C. What is `sizeof(struct { char a; int b; char c; })` on a 64-bit system?",
                explanation: "The size is **12 bytes** (not 6 bytes). Because `int` requires 4-byte alignment, the compiler inserts 3 padding bytes after `char a` (offset 0 -> 4). Then `int b` occupies bytes 4-7. `char c` occupies byte 8, followed by 3 tail padding bytes (bytes 9-11) to round up the total structure size to a multiple of its largest member's alignment (4 bytes)."
            },
            {
                id: "c-8-2",
                company: "Amazon",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the fundamental difference between a `struct` and a `union` in C?",
                explanation: "In a `struct`, every member has its own distinct memory offset; the total size is the sum of members plus alignment padding. In a `union`, all members share the exact same starting memory address; the size equals the size of its largest member (plus alignment padding). Modifying one member overwrites all other members."
            },
            {
                id: "c-8-3",
                company: "Microsoft",
                year: 2024,
                difficulty: "Medium",
                type: "Coding",
                question: "How can you use a union to check if the host system architecture is Little-Endian or Big-Endian?",
                explanation: "```c\nbool isLittleEndian() {\n    union {\n        unsigned int i;\n        char c[sizeof(int)];\n    } u;\n    u.i = 1;\n    return u.c[0] == 1; // If lowest byte holds 1, system is Little-Endian\n}\n```"
            },
            {
                id: "c-8-4",
                company: "Qualcomm",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "What are Bit-Fields in C structures and how do they map to hardware register layouts?",
                explanation: "Bit-fields allow specifying the exact number of bits allocated to structure members:\n```c\nstruct Reg {\n    unsigned int enable : 1;\n    unsigned int mode   : 3;\n    unsigned int reserved : 4;\n};\n```\nAllows packing flags into minimal space to mirror micro-controller peripheral registers."
            },
            {
                id: "c-8-5",
                company: "Apple",
                year: 2023,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What does `#pragma pack(1)` or `__attribute__((packed))` do, and what are the performance tradeoffs?",
                explanation: "It instructs the compiler to eliminate all structure padding bytes, aligning members byte-for-byte. Tradeoff: Decreases memory consumption and enables 1:1 serial network protocol packet transmission, but introduces CPU alignment penalties and unaligned access penalties on hardware."
            },
            {
                id: "c-8-6",
                company: "Cisco",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the difference between the dot `.` operator and arrow `->` operator in C?",
                explanation: "The dot `.` operator accesses members of a structure directly (`student.id`). The arrow `->` operator accesses members through a pointer to a structure (`ptr->id`), equivalent to dereferencing first: `(*ptr).id`."
            },
            {
                id: "c-8-7",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the output of `enum Day { MON = 1, TUE, WED }; printf(\"%d %d\", TUE, WED);`?",
                explanation: "Output: `2 3`.\nIf not explicitly initialized, enum identifiers increment by 1 from the preceding value."
            },
            {
                id: "c-8-8",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What does `typedef` do when declaring a structure in C?",
                explanation: "`typedef` creates an alias for the type name, allowing variables to be declared without writing the `struct` keyword:\n`typedef struct { int x, y; } Point; Point p1;` instead of `struct Point p1;`."
            },
            {
                id: "c-8-9",
                company: "NVIDIA",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "How does the Linux kernel `offsetof(TYPE, MEMBER)` macro calculate member byte offset?",
                explanation: "Macro: `#define offsetof(TYPE, MEMBER) ((size_t)&(((TYPE *)0)->MEMBER))`\nExplanation: Casts address `0` to a pointer to `TYPE`, accesses `MEMBER`, and takes its address `&`. Since the base address is 0, the resulting address is the exact byte offset."
            },
            {
                id: "c-8-10",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Can a C structure contain an instance of itself?",
                explanation: "No. A structure cannot contain a direct instance of itself (`struct Node n;`) because its size would be infinite. However, it can contain a **pointer** to its own type (`struct Node *next;`) because all pointers have a fixed known size (Self-Referential Structure)."
            },
            {
                id: "c-8-11",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "Can structures be compared using the equality operator `s1 == s2`?",
                explanation: "No, C does not support `==` on structures. Because structures contain uninitialized random padding bytes between members, byte-wise comparison (`memcmp`) could produce false negatives even when all data fields match. Programmers must compare members field by field."
            },
            {
                id: "c-8-12",
                company: "Samsung",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Can you pass and return structures by value in C functions?",
                explanation: "Yes. C allows passing and returning structures by value, which copies all fields byte-for-byte on the stack. For large structures, passing by `const StructType *` pointer is preferred to avoid stack copy overhead."
            },
            {
                id: "c-8-13",
                company: "Adobe",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is an Anonymous Struct or Union in C11?",
                explanation: "In C11, an inner struct or union without a tag name allows its members to be accessed directly as if they were declared in the outer structure: `struct Outer { int id; struct { int x, y; }; };` allows `obj.x = 5;`."
            },
            {
                id: "c-8-14",
                company: "Wipro",
                year: 2024,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the default integer type of an `enum` in C?",
                explanation: "By default under the C standard, enumeration constants have type `int`."
            },
            {
                id: "c-8-15",
                company: "Broadcom",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "Explain the Flexible Array Member feature introduced in C99.",
                explanation: "A flexible array member is declared as the final element of a struct with empty brackets `int data[];`. It allocates zero bytes in `sizeof(Struct)`, but allows dynamic allocation of variable payload sizes at runtime:\n`struct Packet *p = malloc(sizeof(struct Packet) + n * sizeof(int));`"
            }
        ]
    },

    // Module 9: File Handling
    9: {
        moduleTitle: "File Handling & I/O Streams",
        questions: [
            {
                id: "c-9-1",
                company: "Google",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the difference between Text Mode (`\"r\"`, `\"w\"`) and Binary Mode (`\"rb\"`, `\"wb\"`) in C file streams?",
                explanation: "In Text Mode on Windows, newline characters `\\n` are automatically translated to carriage return + line feed `\\r\\n` on write and translated back on read. In Binary Mode, bytes are read and written strictly 1:1 without any translation or modification."
            },
            {
                id: "c-9-2",
                company: "Amazon",
                year: 2024,
                difficulty: "Medium",
                type: "Coding",
                question: "Write safe C code to open, read line-by-line, and close a file using `fgets()`.",
                explanation: "```c\nFILE *fp = fopen(\"data.txt\", \"r\");\nif (!fp) { perror(\"fopen failed\"); return; }\nchar buffer[256];\nwhile (fgets(buffer, sizeof(buffer), fp)) {\n    printf(\"%s\", buffer);\n}\nfclose(fp);\n```"
            },
            {
                id: "c-9-3",
                company: "Microsoft",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Why should `feof(fp)` NEVER be used as a loop condition (e.g. `while (!feof(fp))` is wrong)?",
                explanation: "`feof()` only returns true AFTER an I/O read operation has already attempted to read past the end of the file and failed. Using it as a loop condition results in processing the final line or character twice."
            },
            {
                id: "c-9-4",
                company: "Qualcomm",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "Explain the difference between `fread()`/`fwrite()` and `fprintf()`/`fscanf()`.",
                explanation: "`fread()` and `fwrite()` perform raw unformatted binary block transfers (`size_t fread(void *ptr, size_t size, size_t count, FILE *stream)`), preserving memory bytes directly. `fprintf()` and `fscanf()` perform ASCII character formatting and parsing, which is slower and loses floating-point precision."
            },
            {
                id: "c-9-5",
                company: "Apple",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What are the three seek constants used with `fseek(fp, offset, whence)`?",
                explanation: "1. `SEEK_SET`: Offset is relative to the start of the file.\n2. `SEEK_CUR`: Offset is relative to the current file pointer position.\n3. `SEEK_END`: Offset is relative to the end of the file (e.g. `fseek(fp, 0, SEEK_END)`)."
            },
            {
                id: "c-9-6",
                company: "Cisco",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "How do you calculate the exact size of a file in bytes using C standard I/O?",
                explanation: "```c\nlong getFileSize(const char *filename) {\n    FILE *fp = fopen(filename, \"rb\");\n    if (!fp) return -1;\n    fseek(fp, 0, SEEK_END);\n    long size = ftell(fp);\n    fclose(fp);\n    return size;\n}\n```"
            },
            {
                id: "c-9-7",
                company: "TCS",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What are the three standard I/O streams opened automatically for every C process?",
                explanation: "1. `stdin` (File descriptor 0): Standard input stream (keyboard).\n2. `stdout` (File descriptor 1): Standard output stream (console/display).\n3. `stderr` (File descriptor 2): Standard error stream (unbuffered diagnostic messages)."
            },
            {
                id: "c-9-8",
                company: "Infosys",
                year: 2022,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the difference between file open modes `\"w\"` and `\"a\"`?",
                explanation: "`\"w\"` (write mode) truncates an existing file to length 0 or creates a new file. `\"a\"` (append mode) preserves existing data and automatically positions all write operations at the end of the file."
            },
            {
                id: "c-9-9",
                company: "NVIDIA",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is stream buffering (`fflush`) and what is the danger of calling `fflush(stdin)`?",
                explanation: "`fflush(stream)` flushes unwritten user-space buffer data to the OS kernel. Under the ANSI C standard, `fflush()` is strictly defined for output streams; calling `fflush(stdin)` on an input stream invokes Undefined Behavior (UB), though some Microsoft compilers allow it as an extension."
            },
            {
                id: "c-9-10",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "How do you copy a binary file from source to destination efficiently in chunks?",
                explanation: "```c\nvoid copyFile(FILE *src, FILE *dest) {\n    char buf[4096];\n    size_t bytes;\n    while ((bytes = fread(buf, 1, sizeof(buf), src)) > 0) {\n        fwrite(buf, 1, bytes, dest);\n    }\n}\n```"
            },
            {
                id: "c-9-11",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What does `rewind(fp)` do?",
                explanation: "`rewind(fp)` sets the file position indicator to the beginning of the file and clears the stream's error and end-of-file indicators, equivalent to `(void)fseek(fp, 0L, SEEK_SET); clearerr(fp);`."
            },
            {
                id: "c-9-12",
                company: "Samsung",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What does `fclose()` do behind the scenes?",
                explanation: "`fclose()` flushes any unwritten buffered data in the user-space `FILE` buffer to the OS kernel, releases buffer memory allocated by `setvbuf()`, and invokes the `close()` system call to return the OS file descriptor back to the kernel table."
            },
            {
                id: "c-9-13",
                company: "Adobe",
                year: 2024,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What return value indicates an error or end-of-file for `fgetc()`?",
                explanation: "`fgetc()` returns `EOF` (an integer constant, typically `-1`). The return type is `int` (not `char`) so that it can represent all 256 unsigned byte values plus the distinct negative `EOF` value."
            },
            {
                id: "c-9-14",
                company: "Wipro",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What does `rename()` and `remove()` do in C `<stdio.h>`?",
                explanation: "`remove(filename)` deletes the specified file from the filesystem. `rename(oldname, newname)` changes the name or path of an existing file."
            },
            {
                id: "c-9-15",
                company: "Broadcom",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Memory-Mapped I/O (`mmap`) and how does it surpass traditional C `fread` for massive files?",
                explanation: "`mmap()` maps a file directly into the process's virtual address space. Reading and writing the file becomes as simple as dereferencing a memory pointer. This avoids user-space-to-kernel-space buffer copying overhead and utilizes the kernel's demand-paging virtual memory architecture."
            }
        ]
    },

    // Module 10: Dynamic Memory Allocation
    10: {
        moduleTitle: "Dynamic Memory Allocation",
        questions: [
            {
                id: "c-10-1",
                company: "Google",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the internal mechanism of `malloc()` and how does it communicate with the OS kernel via `brk`/`sbrk` and `mmap`?",
                explanation: "Small allocations are serviced from a heap memory pool managed by the C runtime (e.g. glibc ptmalloc). The runtime requests more heap memory from the kernel using the `brk()` system call to raise the program break. Large allocations (typically $\\ge 128$ KB) bypass the heap entirely and use `mmap()` to allocate dedicated anonymous memory pages that can be returned immediately to the OS upon `free()`."
            },
            {
                id: "c-10-2",
                company: "Amazon",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the difference between `malloc()` and `calloc()`?",
                explanation: "1. `malloc(size_t size)` takes 1 argument (total bytes) and leaves memory uninitialized with whatever garbage was present.\n2. `calloc(size_t num, size_t size)` takes 2 arguments (element count and size per element) and zeroes all allocated bytes in memory."
            },
            {
                id: "c-10-3",
                company: "Microsoft",
                year: 2024,
                difficulty: "Medium",
                type: "Coding",
                question: "What is the danger of writing `ptr = realloc(ptr, new_size);`?",
                explanation: "If `realloc()` fails due to insufficient memory, it returns `NULL`. Overwriting `ptr = realloc(ptr, ...)` destroys the original pointer address, creating an irrecoverable memory leak. Safe idiom:\n```c\nvoid *temp = realloc(ptr, new_size);\nif (!temp) { /* handle error; ptr is still valid! */ }\nelse { ptr = temp; }\n```"
            },
            {
                id: "c-10-4",
                company: "Qualcomm",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is a Double Free vulnerability and how does it corrupt the heap?",
                explanation: "Calling `free()` twice on the exact same pointer address corrupts the memory allocator's internal free-list linked data structures. Attackers can exploit double-free bugs to achieve arbitrary code execution. Mitigation: Always assign `ptr = NULL;` immediately after `free(ptr);` because `free(NULL)` is a safe no-op."
            },
            {
                id: "c-10-5",
                company: "Apple",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Why should you NOT cast the return value of `malloc()` in C? (e.g. `int *p = (int *)malloc(...);`)",
                explanation: "In C, `void*` converts implicitly and safely to any other pointer type. Casting is redundant and was historically dangerous in pre-C89 code because omitting `#include <stdlib.h>` would cause the compiler to assume `malloc()` returns `int`, masking truncation bugs on 64-bit systems."
            },
            {
                id: "c-10-6",
                company: "Cisco",
                year: 2023,
                difficulty: "Hard",
                type: "Coding",
                question: "Write code to allocate a dynamic 2D array of integers of size $R \\times C$ as a single contiguous memory block.",
                explanation: "```c\nint** create2D(int R, int C) {\n    int **arr = malloc(R * sizeof(int *));\n    arr[0] = malloc(R * C * sizeof(int));\n    for (int i = 1; i < R; i++) arr[i] = arr[0] + i * C;\n    return arr;\n}\nvoid free2D(int **arr) {\n    free(arr[0]);\n    free(arr);\n}\n```"
            },
            {
                id: "c-10-7",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What happens if a C program requests memory via `malloc()` and the system has run out of RAM?",
                explanation: "`malloc()` fails and returns `NULL`. Production code must always check `if (ptr == NULL)` before attempting to dereference the allocated pointer."
            },
            {
                id: "c-10-8",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What happens if you call `free()` on a pointer allocated on the stack (e.g. `int x = 10; free(&x);`)?",
                explanation: "Calling `free()` on a non-heap address triggers a fatal runtime error (`free(): invalid pointer`) and causes an immediate process abort (`SIGABRT`)."
            },
            {
                id: "c-10-9",
                company: "NVIDIA",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Memory Fragmentation (Internal vs External)?",
                explanation: "1. Internal Fragmentation: Memory allocated inside an allocation block that is unused (e.g. allocating 28 bytes when allocator minimum alignment chunk is 32 bytes).\n2. External Fragmentation: Free heap memory is scattered in small non-contiguous chunks throughout the address space, causing a request for a large contiguous block to fail even though total free memory is sufficient."
            },
            {
                id: "c-10-10",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "What is `alloca()` and how does it differ from `malloc()`?",
                explanation: "`alloca()` allocates dynamic memory directly on the current call stack frame rather than the heap. Memory allocated with `alloca()` is automatically freed when the enclosing function returns, avoiding `free()`. Danger: Risk of stack overflow on large allocations."
            },
            {
                id: "c-10-11",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "How does Valgrind Memcheck detect memory leaks and buffer overruns?",
                explanation: "Valgrind runs code in a synthetic CPU virtual machine, tracking every single bit of memory with shadow valid-address and valid-value metadata bits. It intercepts all `malloc()`/`free()` calls and flags uninitialized reads, out-of-bounds writes, and blocks reachable vs lost upon exit."
            },
            {
                id: "c-10-12",
                company: "Samsung",
                year: 2023,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What does `realloc(ptr, 0)` do in C?",
                explanation: "In C99/C11, `realloc(ptr, 0)` is equivalent to calling `free(ptr)`. In C23, passing size 0 to `realloc` is explicitly defined as Undefined Behavior."
            },
            {
                id: "c-10-13",
                company: "Adobe",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Does the OS reclaim leaked heap memory when a C process terminates?",
                explanation: "Yes. When a process terminates, the operating system kernel destroys its entire virtual address space and reclaims all physical pages, freeing leaked heap memory. However, memory leaks in long-running services or servers cause exhaustion during runtime."
            },
            {
                id: "c-10-14",
                company: "Wipro",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Which header file must be included to use dynamic memory functions?",
                explanation: "`#include <stdlib.h>` declares `malloc()`, `calloc()`, `realloc()`, and `free()`."
            },
            {
                id: "c-10-15",
                company: "Broadcom",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "Implement a simple custom aligned memory allocator: `void* aligned_malloc(size_t bytes, size_t alignment)`.",
                explanation: "```c\nvoid* aligned_malloc(size_t bytes, size_t alignment) {\n    void *p1 = malloc(bytes + alignment + sizeof(void*));\n    if (!p1) return NULL;\n    size_t addr = (size_t)p1 + alignment + sizeof(void*);\n    void *p2 = (void *)(addr - (addr % alignment));\n    ((void **)p2)[-1] = p1;\n    return p2;\n}\nvoid aligned_free(void *p2) {\n    free(((void **)p2)[-1]);\n}\n```"
            }
        ]
    },

    // Module 11: Storage Classes & Preprocessor Directives
    11: {
        moduleTitle: "Storage Classes & Preprocessor Directives",
        questions: [
            {
                id: "c-11-1",
                company: "Google",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Explain the four storage classes in C: `auto`, `register`, `static`, and `extern`.",
                explanation: "1. `auto`: Default for local variables; allocated on stack; block scope.\n2. `register`: Hint to compiler to store variable in a CPU register for fast access; address-of operator `&` is prohibited.\n3. `static`: Preserves value across function calls (local static in data segment) or restricts linkage to the current translation unit (global static).\n4. `extern`: Declares a global variable or function whose definition resides in another translation unit."
            },
            {
                id: "c-11-2",
                company: "Microsoft",
                year: 2023,
                difficulty: "Output Prediction",
                question: "What is the output of `void f() { static int count = 0; printf(\"%d \", ++count); } int main() { f(); f(); f(); }`?",
                explanation: "Output: `1 2 3 `.\nExplanation: The local `static` variable is initialized only once in the data segment when the program loads. Its state is preserved across multiple calls to `f()`."
            },
            {
                id: "c-11-3",
                company: "Amazon",
                year: 2024,
                difficulty: "Medium",
                type: "Coding",
                question: "What is the Stringification (`#`) and Token-Pasting (`##`) operator in C macros?",
                explanation: "`#` converts a macro parameter into a quoted string literal:\n`#define PRINT_VAR(x) printf(#x \" = %d\\n\", x)` -> `PRINT_VAR(val)` becomes `printf(\"val\" \" = %d\\n\", val)`.\n`##` merges two tokens into a single identifier at preprocess time:\n`#define CONCAT(a, b) a##b` -> `CONCAT(test, 1)` becomes `test1`."
            },
            {
                id: "c-11-4",
                company: "Qualcomm",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "Why should macro parameters always be wrapped in parentheses? (e.g. `#define SQUARE(x) ((x) * (x))` vs `#define SQUARE(x) x * x`)",
                explanation: "Without parentheses, operator precedence causes bugs. For example, `SQUARE(2 + 3)` with `x * x` expands to `2 + 3 * 2 + 3 = 2 + 6 + 3 = 11` instead of $(2+3)^2 = 25$."
            },
            {
                id: "c-11-5",
                company: "Apple",
                year: 2023,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What are predefined macros `__FILE__`, `__LINE__`, `__func__`, and `__DATE__` in C?",
                explanation: "1. `__FILE__`: String literal containing the current source file path.\n2. `__LINE__`: Integer constant containing the current source line number.\n3. `__func__`: String variable containing the current enclosing function name (C99).\n4. `__DATE__`: String literal containing the compilation date (\"Mmm dd yyyy\")."
            },
            {
                id: "c-11-6",
                company: "Cisco",
                year: 2023,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What is the difference between `extern int x;` and `int x;` in a header file?",
                explanation: "`extern int x;` is a pure declaration that informs the compiler that `x` exists somewhere, allocating 0 memory. `int x;` is a tentative definition that allocates memory in the data segment. Placing `int x;` in a header included by multiple `.c` files causes multiple definition linker errors."
            },
            {
                id: "c-11-7",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is conditional compilation (`#ifdef`, `#ifndef`, `#endif`) used for?",
                explanation: "It includes or excludes blocks of source code from compilation based on whether a macro is defined. Used for platform-specific code (e.g. `#ifdef _WIN32`), debug tracing (`#ifdef DEBUG`), and header inclusion guards."
            },
            {
                id: "c-11-8",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Can we apply the address-of operator `&` to a variable declared with the `register` storage class?",
                explanation: "No. The C language standard strictly forbids using `&` on a `register` variable because registers do not reside in system RAM and have no memory addresses."
            },
            {
                id: "c-11-9",
                company: "NVIDIA",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "Write an X-Macro pattern in C to automatically generate an enum and a string lookup array.",
                explanation: "```c\n#define COLOR_TABLE \\\n    X(RED)   \\\n    X(GREEN) \\\n    X(BLUE)\n\n// Generate enum\nenum Color { #define X(name) COLOR_##name, COLOR_TABLE #undef X };\n// Generate string array\nconst char* color_names[] = { #define X(name) #name, COLOR_TABLE #undef X };\n```"
            },
            {
                id: "c-11-10",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is `#error` and `#pragma message` in C preprocessor directives?",
                explanation: "`#error \"Message\"` halts compilation immediately and outputs the error string to stderr (used for assertion checks on compiler versions or unsupported architectures). `#pragma message(\"...\")` outputs an informational message without stopping compilation."
            },
            {
                id: "c-11-11",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What is the danger of writing `#define MAX(a, b) ((a) > (b) ? (a) : (b))` with `MAX(x++, y)`?",
                explanation: "If `a > b`, `a` is evaluated twice in the ternary expression. Calling `MAX(x++, y)` increments `x` twice instead of once, creating subtle side-effect bugs."
            },
            {
                id: "c-11-12",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the lifetime and scope of a global static variable?",
                explanation: "Lifetime: Entire execution duration of the program (stored in static data segment). Scope: File scope with internal linkage (visible only within the specific translation unit where it is declared)."
            },
            {
                id: "c-11-13",
                company: "Adobe",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What does `#undef MACRO_NAME` do?",
                explanation: "`#undef` undefines an existing macro, allowing it to be redefined later with a different definition or ensuring it is no longer active."
            },
            {
                id: "c-11-14",
                company: "Wipro",
                year: 2024,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the default value of an uninitialized static variable?",
                explanation: "Static variables are stored in the BSS/Data segment and are guaranteed by the C runtime to be automatically initialized to 0 (or `NULL` for pointers)."
            },
            {
                id: "c-11-15",
                company: "Broadcom",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "Explain the `do { ... } while(0)` macro idiom in multi-statement C macros.",
                explanation: "Wrapping multiple statements inside `do { ... } while(0)` ensures the macro behaves like a single statement that syntactically requires a terminating semicolon and works correctly inside `if-else` blocks without dangling `else` bugs:\n`#define LOG(msg) do { print_time(); printf(msg); } while(0)`."
            }
        ]
    }
};

