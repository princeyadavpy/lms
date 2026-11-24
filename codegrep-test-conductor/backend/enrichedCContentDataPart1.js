/**
 * Enriched Content Data for Programming in 'C' (Part 1: Modules 1 through 5)
 * Topics:
 * - Module 1: Introduction of Programming Languages (1.1 - 1.5)
 * - Module 2: 'C' Tokens (2.1 - 2.7)
 * - Module 3: Control Statement and Expressions (3.1 - 3.6)
 * - Module 4: Looping (4.1 - 4.6)
 * - Module 5: Arrays and String (5.1 - 5.7)
 */

module.exports = {
    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 1: INTRODUCTION OF PROGRAMMING LANGUAGES
    // ═════════════════════════════════════════════════════════════════════════
    "1-1": {
        content: `### 1.1 Types of Programming Languages

A **programming language** is a formal set of instructions that humans use to communicate with computers. Languages operate at different levels of abstraction between human thought and hardware binary.

#### 1. Low-Level Languages
Low-level languages are closely coupled to the CPU architecture and machine hardware.

- **Machine Language (First Generation):** 
  - Written directly in binary sequences of \`0\`s and \`1\`s.
  - Executed directly by the CPU instruction decoder without translation.
  - Platform-dependent: Code written for x86 cannot run on ARM or MIPS.
  - Extremely error-prone and tedious for humans to read or maintain.
- **Assembly Language (Second Generation):**
  - Replaces binary opcodes with human-readable mnemonics (e.g., \`MOV\`, \`ADD\`, \`SUB\`, \`JMP\`).
  - Requires an **Assembler** to translate mnemonics into machine code.
  - Directly accesses CPU registers and flags, providing maximum speed.

#### 2. High-Level Languages (Third Generation & Beyond)
High-level languages provide abstraction over CPU registers and direct memory manipulation.
- Uses English-like keywords, mathematical expressions, and structured logic.
- **Portable:** The same source code can be compiled or interpreted across different operating systems and CPU architectures.
- Examples: **C**, C++, Java, Python, Rust, Go.

#### Comparison: Low-Level vs. High-Level Languages
| Attribute | Low-Level Language | High-Level Language |
| :--- | :--- | :--- |
| **Abstraction** | Direct hardware control (registers/memory) | Abstracted data types and structures |
| **Execution Speed** | Extremely fast (raw machine code) | Very fast (compiled C/C++) to moderate (interpreted) |
| **Portability** | Machine/Architecture specific | Portable across OS and hardware |
| **Ease of Learning** | Complex, requires CPU architecture mastery | Intuitive English-like syntax |
| **Translation** | Assembler (for Assembly) or None (Machine code) | Compiler or Interpreter required |

#### Language Translators: Compilers vs. Interpreters
- **Compiler:** Translates the entire source file at once into an independent machine-code object file (\`.o\` / \`.obj\` / \`.exe\`). Execution is lightning fast because translation happens ahead of time. *C and C++ are compiled languages.*
- **Interpreter:** Translates and executes the program line by line at runtime. Errors are caught dynamically during execution. *Python and JavaScript are interpreted.*`,
        codeSnippets: [
            {
                language: 'c',
                title: 'High-Level C vs Machine Perspective',
                code: `#include <stdio.h>

int main(void) {
    // High-level abstraction: variable assignment and addition
    int a = 15;
    int b = 27;
    int sum = a + b;

    // CPU performs: LOAD R1, 15; LOAD R2, 27; ADD R1, R2; STORE sum
    printf("Calculated Sum: %d\\n", sum);
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Programming languages span from Low-Level (Machine code and Assembly) to High-Level (C, C++, Python). C is a high-level compiled language offering both abstraction and low-level memory efficiency.",
            keyConcepts: ["Machine Language (Binary)", "Assembly Language (Mnemonics)", "High-Level Languages", "Compilers vs Interpreters"],
            revisionNotes: "Remember: C is often classified as a 'middle-level' language because it combines the readability of high-level languages with the raw pointer and memory access of low-level languages."
        }
    },

    "1-2": {
        content: `### 1.2 Evolution of 'C' Language

The C programming language was created between 1969 and 1973 by **Dennis Ritchie** at AT&T Bell Laboratories (New Jersey, USA). It was designed specifically to rewrite the **UNIX** operating system kernel, which was previously written in assembly language.

#### The Historical Genealogy of C
1. **ALGOL 60 (1960):** Introduced structured block-based programming concepts.
2. **CPL (Combined Programming Language, 1963):** Developed by Cambridge and University of London, but was too complex to implement easily.
3. **BCPL (Basic Combined Programming Language, 1967):** Created by **Martin Richards** as a stripped-down, typeless language for systems programming.
4. **B Language (1969 - 1970):** Developed by **Ken Thompson** for the early DEC PDP-7 Unix system. It was typeless and manipulated single computer words.
5. **C Language (1972):** Dennis Ritchie extended B by adding **data types** (integers, characters, floating-point), structures, and pointers. The name "C" was chosen because it was the successor to the "B" language.

\`\`\`
ALGOL (1960) ──> CPL (1963) ──> BCPL (1967) ──> B (1970) ──> C (1972)
\`\`\`

#### Major Standardization Milestones
- **K&R C (1978):** Brian Kernighan and Dennis Ritchie published the seminal book *"The C Programming Language"*, which served as the de facto specification for a decade.
- **ANSI C / ISO C89 (1989/1990):** The American National Standards Institute (ANSI) standardized C (ANSI X3.159-1989), introducing function prototypes, standard library headers (\`<stdio.h>\`, \`<stdlib.h>\`), and \`void\` pointers.
- **C99 (1999):** Introduced inline functions, single-line comments (\`//\`), variable-length arrays (VLAs), and \`<stdbool.h>\`.
- **C11 (2011):** Added native multi-threading support (\`<threads.h>\`), atomic operations (\`<stdatomic.h>\`), and anonymous structs.
- **C17 / C23:** Modern revisions focusing on security, boundary checks, and removing deprecated features.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Standard ANSI C Demonstration',
                code: `#include <stdio.h>

int main(void) {
    printf("==========================================\\n");
    printf("   Welcome to Programming in 'C' (HiGen)   \\n");
    printf("   Developed by Dennis Ritchie (1972)      \\n");
    printf("==========================================\\n");
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C was created in 1972 by Dennis Ritchie at Bell Labs to implement the UNIX kernel. It evolved from Ken Thompson's B language and BCPL, and was formally standardized by ANSI in 1989.",
            keyConcepts: ["Dennis Ritchie & Bell Labs", "B & BCPL Roots", "UNIX Operating System", "ANSI C89 / ISO C99 Standards"],
            revisionNotes: "C was named 'C' simply because it succeeded Ken Thompson's 'B' language."
        }
    },

    "1-3": {
        content: `### 1.3 Structure of a 'C' Program

Every standard C program adheres to a structured, modular organization composed of specific functional sections.

\`\`\`
┌────────────────────────────────────────────────────────┐
│ 1. Documentation Section   (Comments & Author Info)    │
├────────────────────────────────────────────────────────┤
│ 2. Preprocessor Section    (#include, #define)         │
├────────────────────────────────────────────────────────┤
│ 3. Global Declaration      (Global vars, typedefs)     │
├────────────────────────────────────────────────────────┤
│ 4. main() Function         (Execution entry point)     │
│    {                                                   │
│        Declaration part;                               │
│        Executable statements;                          │
│        return 0;                                       │
│    }                                                   │
├────────────────────────────────────────────────────────┤
│ 5. Subprogram / Functions  (User-defined functions)    │
└────────────────────────────────────────────────────────┘
\`\`\`

#### Detailed Breakdown of Sections
1. **Documentation Section:** Contains comments stating the purpose of the program, author, and date.
   - Single-line: \`// comment\` (C99 onwards)
   - Multi-line: \`/* comment */\`
2. **Preprocessor / Link Section:** Directives beginning with \`#\` processed before compilation.
   - \`#include <stdio.h>\`: Includes standard input/output header functions like \`printf\` and \`scanf\`.
   - \`#define MAX 100\`: Declares symbolic constants or macros.
3. **Global Declaration Section:** Declares variables and custom data types accessible across all functions in the file.
4. **The \`main()\` Function:** The mandatory entry point for program execution.
   - Return type \`int\`: Returns an exit status code to the operating system (\`0\` indicates success; non-zero indicates error).
   - Enclosed in curly braces \`{ ... }\` designating block scope.
5. **Subprogram Section:** Contains user-defined functions that modularize the application logic.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Complete Canonical C Program Anatomy',
                code: `/* Documentation: Demonstrating standard C program structure */
#include <stdio.h>    // Link Section
#define APP_NAME "HiGen C Engine"  // Definition Section

int global_counter = 0; // Global Declaration

void greetUser(void);   // Function Prototype

int main(void) {        // Main Function Entry
    int local_num = 10; // Local declaration
    
    printf("Application: %s\\n", APP_NAME);
    printf("Local Value: %d\\n", local_num);
    greetUser();
    
    return 0;           // Termination Status Code
}

void greetUser(void) {  // Subprogram Definition
    printf("Welcome to modular C systems programming!\\n");
}`
            }
        ],
        aiSummary: {
            summary: "A C program consists of Documentation, Preprocessor directives (#include), Global declarations, the mandatory main() entry point, and optional user-defined functions.",
            keyConcepts: ["Preprocessor Directives", "main() Entry Point", "Exit Status Codes", "Global vs Local Sections"],
            revisionNotes: "Always return 0 from main() to inform the OS that the program completed successfully without errors."
        }
    },

    "1-4": {
        content: `### 1.4 'C' Program Development Life Cycle

The journey from human-written text to an executable machine binary involves 5 distinct stages in the **Compilation Pipeline**.

\`\`\`
 [Source Code (.c)]
        │
        ▼ (Preprocessor: expands macros, strips comments, inserts headers)
 [Expanded Code (.i)]
        │
        ▼ (Compiler: translates C syntax to Assembly instructions)
 [Assembly Code (.s)]
        │
        ▼ (Assembler: translates assembly mnemonics to machine code)
 [Object Code (.o / .obj)]
        │
        ▼ (Linker: combines object files with C Runtime Library routines)
 [Executable Binary (.exe / a.out)]
\`\`\`

#### Step-by-Step Compilation Pipeline
1. **Creation / Editing:**
   - The developer writes source code in a text editor and saves it as \`main.c\`.
2. **Preprocessing (\`gcc -E main.c -o main.i\`):**
   - Strips all comments (\`/*...*/\` and \`//\`).
   - Replaces macro definitions (\`#define\`) with their literal substitutions.
   - Copies the full contents of header files (\`#include <stdio.h>\`) into the source stream.
3. **Compilation (\`gcc -S main.i -o main.s\`):**
   - Checks syntax and semantics.
   - Translates high-level C logic into target-specific assembly language instructions (\`mov\`, \`add\`, \`push\`).
4. **Assembly (\`gcc -c main.s -o main.o\`):**
   - Converts assembly instructions into raw binary machine code stored in an **Object file** (\`.o\` on Linux, \`.obj\` on Windows).
5. **Linking (\`gcc main.o -o main.exe\`):**
   - Resolves external references (such as \`printf\`) by linking the object file with the **C Standard Runtime Library** (libc).
   - Produces the final executable binary.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'GCC Compilation Commands',
                code: `# 1. Preprocess only (generates main.i):
# gcc -E main.c -o main.i

# 2. Compile to assembly (generates main.s):
# gcc -S main.c -o main.s

# 3. Assemble to object file (generates main.o):
# gcc -c main.c -o main.o

# 4. Link into final executable:
# gcc main.o -o my_program

# 5. One-step compilation with all warnings enabled:
# gcc -Wall -Wextra -O2 main.c -o my_program`
            }
        ],
        aiSummary: {
            summary: "The C compilation process consists of Preprocessing (.i), Compilation (.s), Assembly (.o), and Linking into the final executable binary.",
            keyConcepts: ["Preprocessor Expansion", "Assembly Translation", "Object File Generation", "Linker & C Runtime (libc)"],
            revisionNotes: "Use `gcc -Wall -Wextra main.c` during development to catch uninitialized variables, unused parameters, and type mismatches."
        }
    },

    "1-5": {
        content: `### 1.5 Executing and Debugging a 'C' Program

Writing software is only half the task; running, testing, and debugging are essential for robust systems.

#### Program Execution Errors
Errors in C fall into three major classifications:
1. **Compile-Time Errors (Syntax & Semantic):**
   - Violations of C grammar rules, such as missing semicolons \`;\`, undeclared variables, or mismatched parentheses.
   - Detected by the compiler before an executable is produced.
2. **Link-Time Errors:**
   - Occur when the compiler references a function or variable that cannot be resolved in any object file or library (e.g., \`undefined reference to 'main'\` or missing math library \`-lm\`).
3. **Runtime Errors (Bugs):**
   - Errors occurring while the binary is actively running:
     - **Segmentation Fault (SIGSEGV):** Attempting to read/write unauthorized memory (dereferencing a \`NULL\` or dangling pointer).
     - **Division by Zero:** Triggering CPU floating-point exceptions (SIGFPE).
     - **Buffer Overflow:** Writing past the allocated boundary of an array or stack buffer.

#### Debugging with GDB (GNU Debugger)
To debug a C program, compile with the \`-g\` flag to embed debugging symbols:
\`\`\`bash
gcc -g -Wall main.c -o debug_app
gdb ./debug_app
\`\`\`

| GDB Command | Action |
| :--- | :--- |
| \`break main\` / \`b 14\` | Set a breakpoint at \`main()\` or line 14 |
| \`run\` / \`r\` | Start program execution |
| \`next\` / \`n\` | Step over to the next source line |
| \`step\` / \`s\` | Step into a function call |
| \`print var\` / \`p var\` | Display the current runtime value of variable \`var\` |
| \`backtrace\` / \`bt\` | Print stack frame backtrace showing crash origin |
| \`quit\` / \`q\` | Exit GDB debugger |`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Defensive Coding: Preventing Runtime Division by Zero',
                code: `#include <stdio.h>

int safeDivide(int numerator, int denominator, int *result) {
    if (denominator == 0) {
        fprintf(stderr, "Error: Division by zero attempted!\\n");
        return -1; // Return error code
    }
    *result = numerator / denominator;
    return 0; // Success
}

int main(void) {
    int res = 0;
    if (safeDivide(100, 5, &res) == 0) {
        printf("100 / 5 = %d\\n", res);
    }
    if (safeDivide(100, 0, &res) != 0) {
        printf("Division safely aborted without crash.\\n");
    }
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C programs encounter Compile-time, Link-time, or Runtime errors (such as Segmentation Faults). Debugging is handled via GCC error warnings (-Wall) and GDB breakpoints.",
            keyConcepts: ["Compile vs Link vs Runtime Errors", "Segmentation Faults (SIGSEGV)", "GDB Breakpoints & Backtraces", "Defensive Programming"],
            revisionNotes: "Compile with `gcc -g` whenever you need to inspect stack traces or step through variables in GDB."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 2: 'C' TOKENS
    // ═════════════════════════════════════════════════════════════════════════
    "2-1": {
        content: `### 2.1 Keywords and Identifiers

In C, the compiler breaks source code into the smallest individual lexical units called **Tokens**. Tokens comprise:
1. Keywords
2. Identifiers
3. Constants
4. Strings
5. Special Symbols
6. Operators

#### 1. Keywords (Reserved Words)
Keywords are predefined, reserved identifiers with fixed meanings that cannot be used as variable, function, or array names. ANSI C89 specifies **32 standard keywords**:

| Category | Keywords |
| :--- | :--- |
| **Data Types** | \`char\`, \`int\`, \`float\`, \`double\`, \`void\` |
| **Type Modifiers** | \`signed\`, \`unsigned\`, \`short\`, \`long\` |
| **Control Flow** | \`if\`, \`else\`, \`switch\`, \`case\`, \`default\`, \`goto\` |
| **Loops** | \`for\`, \`while\`, \`do\`, \`break\`, \`continue\` |
| **Storage Classes** | \`auto\`, \`register\`, \`static\`, \`extern\` |
| **User Types & Qualifiers** | \`struct\`, \`union\`, \`typedef\`, \`enum\`, \`const\`, \`volatile\`, \`sizeof\`, \`return\` |

*(C99 added: \`inline\`, \`_Bool\`, \`_Complex\`, \`_Imaginary\`. C11 added: \`_Atomic\`, \`_Generic\`, etc.)*

#### 2. Identifiers
Identifiers are names given by the programmer to entities like variables, functions, structures, and arrays.

#### Rules for Constructing Valid Identifiers
1. **Allowed Characters:** Uppercase English letters (\`A-Z\`), lowercase letters (\`a-z\`), digits (\`0-9\`), and underscore (\`_\`).
2. **First Character:** Must be a letter or an underscore (\`_\`). **Cannot begin with a digit.**
3. **No Reserved Words:** Keywords cannot be used as identifiers (e.g., \`int while = 5;\` is illegal).
4. **Case Sensitivity:** C is strictly case-sensitive: \`student\`, \`Student\`, and \`STUDENT\` are three distinct identifiers.
5. **No Special Symbols or Spaces:** Characters like \`@\`, \`$\`, \`#\`, \`-\`, and spaces are invalid.

| Valid Identifier | Invalid Identifier | Reason Invalid |
| :--- | :--- | :--- |
| \`total_score\` | \`total score\` | Space is not permitted |
| \`_counter\` | \`2nd_place\` | Cannot begin with a number |
| \`studentGrade\` | \`float\` | Cannot use reserved keyword |
| \`MAX_BUFFER_SIZE\` | \`emp$salary\` | Special character \`$\` not allowed |`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Valid Identifiers and Keywords in Practice',
                code: `#include <stdio.h>

int main(void) {
    // Valid identifier declarations
    int total_marks = 95;
    float _gpa = 3.92f;
    char studentInitial = 'P';

    printf("Student '%c' scored %d with GPA %.2f\\n", studentInitial, total_marks, _gpa);
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Tokens are basic building blocks of C. ANSI C has 32 reserved keywords. Identifiers are user-defined names that must start with a letter or underscore and cannot use keywords or spaces.",
            keyConcepts: ["32 ANSI Keywords", "Identifier Naming Rules", "Case Sensitivity", "Lexical Tokens"],
            revisionNotes: "Always choose descriptive, snake_case identifiers like `student_count` rather than cryptic single letters."
        }
    },

    "2-2": {
        content: `### 2.2 Operators in 'C'

An **operator** is a symbol that instructs the compiler to perform specific mathematical, relational, or logical manipulations on data operands.

#### 1. Arithmetic Operators
Used for standard mathematical calculations:
- \`+\` (Addition), \`-\` (Subtraction), \`*\` (Multiplication)
- \`/\` (Division): If both operands are integers, performs **integer division** (truncating the decimal part: \`7 / 2\` evaluates to \`3\`).
- \`%\` (Modulo): Returns the remainder of integer division (\`7 % 2\` evaluates to \`1\`). Operands must be integers.

#### 2. Relational (Comparison) Operators
Evaluate comparisons returning integer boolean values: \`1\` for True, \`0\` for False:
- \`==\` (Equal to), \`!=\` (Not equal to)
- \`>\` (Greater than), \`<\` (Less than)
- \`>=\` (Greater than or equal to), \`<=\` (Less than or equal to)

#### 3. Logical Operators
Used to combine conditional tests:
- \`&&\` (Logical AND): Returns true only if both operands evaluate to non-zero. Features **short-circuit evaluation**: if the first operand is false, the second is never evaluated.
- \`||\` (Logical OR): Returns true if at least one operand is non-zero. Short-circuits if the first operand is true.
- \`!\` (Logical NOT): Unary negation operator (\`!1\` evaluates to \`0\`).

#### 4. Bitwise Operators
Operate directly on individual bits of integer numbers:
- \`&\` (Bitwise AND), \`|\` (Bitwise OR), \`^\` (Bitwise XOR), \`~\` (Bitwise NOT/1's complement)
- \`<<\` (Left Shift): Shifts bits left, multiplying by 2^n (\`5 << 1\` is \`10\`).
- \`>>\` (Right Shift): Shifts bits right, dividing by 2^n (\`10 >> 1\` is \`5\`).

#### 5. Assignment & Compound Assignment
- Standard assignment: \`=\`
- Compound arithmetic: \`+=\`, \`-=\`, \`*=\`, \`/=\`, \`%=\`
- Compound bitwise: \`&=\`, \`|=\`, \`^=\`, \`<<=\`, \`>>=\`

#### 6. Increment and Decrement Operators (\`++\`, \`--\`)
- **Prefix (\`++x\`):** Increments \`x\` first, then yields the incremented value in the expression.
- **Postfix (\`x++\`):** Yields the current value in the expression first, then increments \`x\` in memory.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Prefix vs Postfix and Bitwise Operations',
                code: `#include <stdio.h>

int main(void) {
    int a = 5;
    int b = ++a; // Prefix: a becomes 6, b = 6
    printf("Prefix -> a: %d, b: %d\\n", a, b);

    int c = 5;
    int d = c++; // Postfix: d = 5, then c becomes 6
    printf("Postfix -> c: %d, d: %d\\n", c, d);

    // Bitwise Left Shift (Multiply by 2)
    int val = 12; // Binary: 0000 1100
    int shifted = val << 1; // Binary: 0001 1000 = 24
    printf("Bitwise Shift: 12 << 1 = %d\\n", shifted);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C provides Arithmetic, Relational, Logical (with short-circuiting), Bitwise, Assignment, and Prefix/Postfix increment/decrement operators.",
            keyConcepts: ["Integer Division vs Modulo", "Short-Circuit Logic (&&, ||)", "Bitwise Shift Operators", "Prefix (++i) vs Postfix (i++)"],
            revisionNotes: "Remember: Modulo (%) only works with integers. Writing 5.5 % 2 causes a compile-time error."
        }
    },

    "2-3": {
        content: `### 2.3 Constants in 'C'

A **constant** (or literal) is a fixed value that cannot be altered by the program during its execution. In C, constants are classified into numeric, character, and string constants.

#### 1. Integer Constants
Fixed whole numbers without fractional points:
- **Decimal:** Digits \`0-9\` (e.g., \`42\`, \`-100\`).
- **Octal:** Starts with prefix \`0\` followed by digits \`0-7\` (e.g., \`052\` = 5 \× 8^1 + 2 \× 8^0 = 42_{10}).
- **Hexadecimal:** Starts with prefix \`0x\` or \`0X\` followed by digits \`0-9\` and \`a-f\` (e.g., \`0x2A\` = 2 \× 16^1 + 10 \× 16^0 = 42_{10}).
- **Suffixes:** \`U\` or \`u\` for unsigned (\`500U\`), \`L\` or \`l\` for long (\`100000L\`).

#### 2. Real (Floating-Point) Constants
Numbers containing fractional parts or exponential scientific notation:
- **Fractional form:** \`3.14159\`, \`-0.005\`
- **Exponential form:** \`1.5e3\` (1.5 \× 10^3 = 1500.0), \`2.8E-4\` (2.8 \× 10^{-4})
- By default, floating literals are of type \`double\`. Suffix \`f\` specifies \`float\` (\`3.14f\`).

#### 3. Character Constants
A single character enclosed within single quotes (e.g., \`'A'\`, \`'9'\`, \`'+'\`).
- In C, a character constant is stored internally as its integer **ASCII value** (\`'A'\` is \`65\`, \`'a'\` is \`97\`, \`'0'\` is \`48\`).
- **Escape Sequences:** Non-printable or special characters prefixed by backslash \`\\\`:
  - \`\\n\`: Newline
  - \`\\t\`: Horizontal tab
  - \`\\0\`: Null character (ASCII 0)
  - \`\\\\\`: Backslash
  - \`\\'\`: Single quote
  - \`\\"\`: Double quote

#### 4. String Constants
A sequence of characters enclosed in double quotation marks (e.g., \`"HiGen Labs"\`).
- The compiler automatically appends a terminating null character (\`'\\0'\`) at the end of every string constant in memory.

#### 5. Defining Constants in C
- Using \`#define\` preprocessor: \`#define PI 3.14159\` (textual replacement, no memory allocated).
- Using \`const\` qualifier: \`const double PI = 3.14159;\` (typed, memory allocated, read-only).`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Constant Types & Escape Characters',
                code: `#include <stdio.h>
#define PI 3.1415926535

int main(void) {
    const int MAX_USERS = 500;
    int hexVal = 0xFF;    // 255 in decimal
    int octalVal = 077;   // 63 in decimal
    char tabChar = '\\t';

    printf("PI: %.4f\\n", PI);
    printf("Max Users: %d\\n", MAX_USERS);
    printf("Hex 0xFF = %d, Octal 077 = %d\\n", hexVal, octalVal);
    printf("Item%cPrice\\n", tabChar);
    printf("Book%c$29.99\\n", tabChar);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Constants are immutable values categorized into integer (decimal, octal, hex), floating-point, character (ASCII), and string literals (null-terminated). They are defined via #define or const.",
            keyConcepts: ["Decimal, Octal (0 prefix), Hex (0x prefix)", "Float Suffixes (f, L)", "ASCII Character Values", "Escape Sequences", "const vs #define"],
            revisionNotes: "Prefer `const int LIMIT = 100;` over `#define LIMIT 100` because const provides type-checking and adheres to compiler scoping."
        }
    },

    "2-4": {
        content: `### 2.4 Variables in 'C'

A **variable** is a named location in computer memory used to store data that can be altered during program execution.

#### Variable Declaration vs. Initialization
- **Declaration:** Informs the compiler about the variable's name and data type so it can allocate appropriate memory bytes.
  \`\`\`c
  int age;       // Allocates 4 bytes (contains uninitialized garbage)
  float salary;  // Allocates 4 bytes
  \`\`\`
- **Initialization:** Assigns an initial value to the allocated variable at the time of declaration.
  \`\`\`c
  int age = 21;
  float salary = 75000.50f;
  \`\`\`

#### Memory Representation of a Variable
When you declare \`int score = 85;\`:
1. The compiler binds the identifier name \`score\` to a specific memory address (e.g., \`0x7ffeefbff568\`).
2. It reserves 4 contiguous bytes in the stack frame.
3. It writes the binary representation of \`85\` into those 4 bytes.

\`\`\`
 Identifier: score
 Type:       int (4 bytes)
 Address:    0x7ffeefbff568
 Value:      85 (Binary: 00000000 00000000 00000000 01010101)
\`\`\`

#### Understanding lvalue and rvalue
- **lvalue (Locator Value):** An expression that designates a persistent, identifiable memory address. Appears on the **left side** of an assignment operator. (e.g., \`x\` in \`x = 10;\`).
- **rvalue (Read Value):** A temporary data value or literal stored in memory or a CPU register. Appears on the **right side** of an assignment operator. (e.g., \`10\` in \`x = 10;\`).
- \`10 = x;\` is illegal because the literal constant \`10\` is an rvalue without an assignable memory address.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Variable Memory Inspection (Address & Size)',
                code: `#include <stdio.h>

int main(void) {
    int count = 100;
    double price = 99.95;

    // Printing variable value, memory size, and physical memory address (&)
    printf("Variable 'count': Value = %d, Size = %zu bytes, Address = %p\\n", 
           count, sizeof(count), (void*)&count);
    
    printf("Variable 'price': Value = %.2f, Size = %zu bytes, Address = %p\\n", 
           price, sizeof(price), (void*)&price);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "A variable is a named memory location with a data type. Declaration allocates bytes; initialization writes the starting value. Variables act as lvalues holding assignable memory addresses.",
            keyConcepts: ["Declaration vs Initialization", "Memory Address (& operator)", "sizeof Operator", "lvalue vs rvalue"],
            revisionNotes: "Always initialize local variables; uninitialized local stack variables hold unpredictable garbage data."
        }
    },

    "2-5": {
        content: `### 2.5 Data Types in 'C'

Data types in C define the size of memory allocated, the range of values that can be stored, and the allowable operations.

\`\`\`
                    Data Types in C
      ┌────────────────────┼────────────────────┐
      ▼                    ▼                    ▼
   Primary              Derived           User-Defined
 (char, int,        (Arrays, Pointers,     (typedef,
 float, double,     Structures, Unions)    enum)
 void)
\`\`\`

#### Primary (Fundamental) Data Types on Standard 64-bit Systems
| Data Type | Keyword | Typical Size | Range of Values | Format Specifier |
| :--- | :--- | :--- | :--- | :--- |
| **Character** | \`char\` | 1 Byte | -128 to 127 | \`%c\` |
| **Unsigned Char** | \`unsigned char\` | 1 Byte | 0 to 255 | \`%c\` or \`%u\` |
| **Integer** | \`int\` | 4 Bytes | -2,147,483,648 to +2,147,483,647 | \`%d\` or \`%i\` |
| **Unsigned Int** | \`unsigned int\` | 4 Bytes | 0 to 4,294,967,295 | \`%u\` |
| **Short Int** | \`short int\` | 2 Bytes | -32,768 to +32,767 | \`%hd\` |
| **Long Int** | \`long int\` | 8 Bytes | -9.22 \× 10^{18} to +9.22 \× 10^{18} | \`%ld\` |
| **Float** | \`float\` | 4 Bytes | \≈ 3.4 \× 10^{\pm 38} (6-7 decimal places) | \`%f\` |
| **Double** | \`double\` | 8 Bytes | \≈ 1.7 \× 10^{\pm 308} (15 decimal places) | \`%lf\` |
| **Long Double** | \`long double\` | 16 Bytes | Extended precision (19 decimal places) | \`%Lf\` |
| **Void** | \`void\` | 0 Bytes | Valueless / Generic pointer indicator | N/A |

#### Modifiers in C
Modifiers customize the storage capacity and sign handling of primary types:
- **Sign Modifiers:** \`signed\` (default, can be positive or negative) and \`unsigned\` (non-negative only, doubling positive range).
- **Size Modifiers:** \`short\` (reduces size or keeps it minimal) and \`long\` (expands integer or floating-point range).`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Data Type Size & Limit Verification',
                code: `#include <stdio.h>
#include <limits.h>
#include <float.h>

int main(void) {
    printf("--- Integer Data Type Sizes & Limits ---\\n");
    printf("char:   %zu byte  [min: %d, max: %d]\\n", sizeof(char), CHAR_MIN, CHAR_MAX);
    printf("short:  %zu bytes [min: %d, max: %d]\\n", sizeof(short), SHRT_MIN, SHRT_MAX);
    printf("int:    %zu bytes [min: %d, max: %d]\\n", sizeof(int), INT_MIN, INT_MAX);
    printf("long:   %zu bytes [min: %ld, max: %ld]\\n", sizeof(long), LONG_MIN, LONG_MAX);

    printf("\\n--- Floating-Point Precision ---\\n");
    printf("float:  %zu bytes [precision: %d digits]\\n", sizeof(float), FLT_DIG);
    printf("double: %zu bytes [precision: %d digits]\\n", sizeof(double), DBL_DIG);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C provides Primary (char, int, float, double, void), Derived (arrays, pointers, structs), and User-defined (enum, typedef) types. Modifiers include signed, unsigned, short, and long.",
            keyConcepts: ["Fundamental Data Types", "Memory Footprints", "Sign Modifiers (signed/unsigned)", "Format Specifiers (%d, %f, %c)"],
            revisionNotes: "Always inspect `<limits.h>` and `<float.h>` for platform-specific integer and floating-point boundaries."
        }
    },

    "2-6": {
        content: `### 2.6 Precedence and Associativity of Operators

When multiple operators appear in a single expression, the evaluation order is governed by **Precedence** and **Associativity**.

- **Operator Precedence:** Determines which operator is evaluated first in an expression. Operators with higher precedence are evaluated before operators with lower precedence.
- **Associativity:** Dictates the direction of evaluation (Left-to-Right or Right-to-Left) when operators of equal precedence appear together.

#### Comprehensive C Operator Precedence Table (Highest to Lowest)
| Rank | Category | Operators | Associativity |
| :---: | :--- | :--- | :---: |
| **1** | Postfix / Grouping | \`()\`, \`[]\`, \`->\`, \`.\`, \`x++\`, \`x--\` | Left-to-Right |
| **2** | Unary | \`++x\`, \`--x\`, \`+\`, \`-\`, \`!\`, \`~\`, \`*\` (deref), \`&\` (addr), \`sizeof\` | **Right-to-Left** |
| **3** | Multiplicative | \`*\`, \`/\`, \`%\` | Left-to-Right |
| **4** | Additive | \`+\`, \`-\` | Left-to-Right |
| **5** | Shift | \`<<\`, \`>>\` | Left-to-Right |
| **6** | Relational | \`<\`, \`<=\`, \`>\`, \`>=\` | Left-to-Right |
| **7** | Equality | \`==\`, \`!=\` | Left-to-Right |
| **8** | Bitwise AND | \`&\` | Left-to-Right |
| **9** | Bitwise XOR | \`^\` | Left-to-Right |
| **10** | Bitwise OR | \`|\` | Left-to-Right |
| **11** | Logical AND | \`&&\` | Left-to-Right |
| **12** | Logical OR | \`||\` | Left-to-Right |
| **13** | Conditional (Ternary) | \`? :\` | **Right-to-Left** |
| **14** | Assignment | \`=\`, \`+=\`, \`-=\`, \`*=\`, \`/=\`, \`%=\` | **Right-to-Left** |
| **15** | Comma | \`,\` | Left-to-Right |

#### Step-by-Step Expression Evaluation
Evaluate: \`int result = 10 + 20 * 3 / 2 - 5;\`
1. High precedence: \`*\` and \`/\` are equal, evaluated Left-to-Right:
   - \`20 * 3 = 60\`
   - \`60 / 2 = 30\`
2. Next precedence: \`+\` and \`-\` evaluated Left-to-Right:
   - \`10 + 30 = 40\`
   - \`40 - 5 = 35\`
3. Final assignment: \`result = 35\`.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Precedence & Parentheses Influence',
                code: `#include <stdio.h>

int main(void) {
    int a = 10, b = 20, c = 30;

    // Evaluated as: a + (b * c)
    int res1 = a + b * c; 
    
    // Explicit override via parentheses: (a + b) * c
    int res2 = (a + b) * c;

    printf("Without parentheses (10 + 20 * 30) = %d\\n", res1);
    printf("With parentheses ((10 + 20) * 30)   = %d\\n", res2);

    // Chained Assignment (Right-to-Left associativity)
    int x, y, z;
    x = y = z = 50; // z=50 evaluated first, then y=50, then x=50
    printf("Chained: x=%d, y=%d, z=%d\\n", x, y, z);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Operator precedence dictates evaluation priority; associativity resolves order among equal-priority operators. Multiplication/Division precede Addition/Subtraction. Unary, Ternary, and Assignment associate Right-to-Left.",
            keyConcepts: ["Operator Precedence Hierarchy", "Left-to-Right vs Right-to-Left Associativity", "Parenthetical Overrides ()"],
            revisionNotes: "When in doubt, always use parentheses () to ensure clarity and eliminate ambiguity in complex expressions."
        }
    },

    "2-7": {
        content: `### 2.7 Scope and Lifetime of Variables

The behavior of a variable across a program is defined by two fundamental properties:
1. **Scope (Visibility):** The region of code where the variable identifier is accessible.
2. **Lifetime (Duration):** The period of program execution during which the variable retains its allocated memory location.

\`\`\`
 Memory Segment          Variable Type               Lifetime
┌──────────────────────┬───────────────────────────┬──────────────────────┐
│ Stack                │ Local / Automatic         │ Block execution      │
├──────────────────────┼───────────────────────────┼──────────────────────┤
│ Data / BSS Segment   │ Global / Static           │ Entire program run   │
├──────────────────────┼───────────────────────────┼──────────────────────┤
│ Heap                 │ Dynamic (malloc/calloc)   │ Until free()         │
└──────────────────────┴───────────────────────────┴──────────────────────┘
\`\`\`

#### 1. Local (Block) Scope
- Declared inside a function or a block enclosed by curly braces \`{ ... }\`.
- **Visibility:** Accessible only within the enclosing block.
- **Lifetime:** Allocated on the **Call Stack** when the block is entered; automatically destroyed when the block terminates.
- **Default Value:** Uninitialized garbage.

#### 2. Global (File) Scope
- Declared outside of all functions, typically at the top of the file.
- **Visibility:** Accessible by any function from its point of declaration to the end of the file.
- **Lifetime:** Allocated in the **Data/BSS segment**; exists continuously throughout the entire lifecycle of the program.
- **Default Value:** Automatically zero-initialized by the OS loader (\`0\` for ints, \`0.0\` for floats, \`NULL\` for pointers).

#### 3. Variable Shadowing
If a local variable has the same identifier name as a global variable, the local variable **shadows** (hides) the global variable within that inner block.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Local Scope, Global Scope & Variable Shadowing',
                code: `#include <stdio.h>

int global_val = 500; // Global Variable (Data Segment)

void demonstrateScope(void) {
    int local_val = 20; // Local to function
    printf("Inside demonstrateScope: global = %d, local = %d\\n", global_val, local_val);
}

int main(void) {
    int global_val = 99; // Shadows the global variable inside main()

    printf("Inside main(): shadowed global_val = %d\\n", global_val);
    demonstrateScope();

    { // Nested block
        int inner_block_val = 777;
        printf("Inner block: %d\\n", inner_block_val);
    }
    // inner_block_val cannot be accessed here (out of scope)

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Scope defines where a variable can be referenced; lifetime defines how long its memory persists. Local variables live in stack frames during block execution; global variables live in data segments throughout program execution.",
            keyConcepts: ["Block / Local Scope", "File / Global Scope", "Variable Shadowing", "Stack vs Data Segment Lifetime"],
            revisionNotes: "Minimize global variables to prevent accidental side effects and hard-to-trace bugs across large codebases."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 3: CONTROL STATEMENT AND EXPRESSIONS
    // ═════════════════════════════════════════════════════════════════════════
    "3-1": {
        content: `### 3.1 Decision Making using if Statement

Control statements alter the default top-to-bottom sequential flow of program execution based on runtime conditions.

#### The Concept of Truth in C
Unlike languages with a native boolean type like Java or Python, classic C treats booleans as integers:
- **Zero (\`0\`):** Evaluates to **False**.
- **Any Non-Zero Value (e.g., \`1\`, \`-5\`, \`100\`):** Evaluates to **True**.

#### Syntax of the Simple \`if\` Statement
\`\`\`c
if (condition) {
    // Statements executed only when condition is non-zero (true)
}
\`\`\`

#### Execution Flowchart
\`\`\`
       [ Condition ]
         /       \\
   True /         \\ False
       ▼           \\
 [ Code Block ]     ▼
       \\           /
        ▼         /
   [ Continue ] ◄─┘
\`\`\`

If \`condition\` evaluates to non-zero (true), the block inside the braces executes. If it evaluates to zero (false), the block is bypassed and control jumps directly to the statement following the \`if\` block.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Simple if Decision Statement',
                code: `#include <stdio.h>

int main(void) {
    int marks = 78;

    printf("Checking exam status...\\n");
    if (marks >= 40) {
        printf("Result: PASSED! Congratulations.\\n");
    }

    // Demonstrating C's non-zero truth concept
    if (-42) {
        printf("Negative numbers evaluate to TRUE in C!\\n");
    }

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "The if statement executes a block when its test expression evaluates to non-zero. In C, 0 represents False and any non-zero value represents True.",
            keyConcepts: ["Truth Value in C (0 vs Non-Zero)", "Conditional Branching", "Control Flow Redirection"],
            revisionNotes: "Beware of accidental assignment in conditions: `if (x = 5)` assigns 5 to x (always true) instead of comparing `if (x == 5)`."
        }
    },

    "3-2": {
        content: `### 3.2 Types of if...else Blocks

To handle alternative decision paths, C provides four primary variations of the \`if...else\` construct.

#### 1. Simple \`if...else\`
Executes one block if true, and an alternate block if false.
\`\`\`c
if (condition) {
    // Executed if condition is true
} else {
    // Executed if condition is false
}
\`\`\`

#### 2. Nested \`if...else\`
An \`if\` or \`else\` statement placed inside the body of another \`if\` or \`else\` block.
\`\`\`c
if (age >= 18) {
    if (has_license) {
        printf("Allowed to drive\\n");
    } else {
        printf("Adult, but license required\\n");
    }
}
\`\`\`

#### 3. The \`else-if\` Ladder (Multi-Way Selection)
Evaluates conditions sequentially from top to bottom. As soon as one condition evaluates to true, its statement block executes and the rest of the ladder is skipped.
\`\`\`c
if (score >= 90) {
    grade = 'A';
} else if (score >= 80) {
    grade = 'B';
} else if (score >= 70) {
    grade = 'C';
} else {
    grade = 'F';
}
\`\`\`

#### 4. The "Dangling Else" Problem
When an \`else\` follows nested \`if\` statements without braces, the compiler binds the \`else\` to the **closest preceding unmatched \`if\`**:
\`\`\`c
if (x > 0)
    if (y > 0)
        printf("Both positive");
else // Binds to (y > 0), NOT (x > 0)!
    printf("x is non-positive? (NO, y is <= 0!)");
\`\`\`
*Always use explicit curly braces \`{ ... }\` to prevent dangling else logic bugs.*`,
        codeSnippets: [
            {
                language: 'c',
                title: 'else-if Ladder with Grade Classification',
                code: `#include <stdio.h>

int main(void) {
    int percentage = 84;
    char grade;

    if (percentage >= 90) {
        grade = 'A';
    } else if (percentage >= 80) {
        grade = 'B';
    } else if (percentage >= 70) {
        grade = 'C';
    } else if (percentage >= 60) {
        grade = 'D';
    } else {
        grade = 'F';
    }

    printf("Percentage: %d%% -> Assigned Grade: %c\\n", percentage, grade);
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "if...else variations include simple if-else, nested if-else, and the else-if ladder. Always use curly braces to eliminate the dangling else ambiguity.",
            keyConcepts: ["if-else Syntax", "else-if Ladder", "Nested Conditions", "Dangling Else Ambiguity"],
            revisionNotes: "An else-if ladder tests conditions sequentially; once a branch matches, subsequent conditions are skipped entirely."
        }
    },

    "3-3": {
        content: `### 3.3 Switch Case Block

The **\`switch\`** statement is a multi-way branch selection control statement that tests whether an integer or character expression matches one of several constant values.

#### Syntax & Structure
\`\`\`c
switch (expression) {
    case constant1:
        // Statements
        break;
    case constant2:
        // Statements
        break;
    default:
        // Fallback statements if no case matches
        break;
}
\`\`\`

#### Critical Rules of the \`switch\` Statement
1. **Expression Type:** The switch expression must evaluate to an **integral type** (\`int\`, \`char\`, \`short\`, \`enum\`). **Floating-point values (\`float\`, \`double\`) and strings are illegal.**
2. **Case Labels:** Case values must be **constant expressions** or literals (e.g., \`case 1:\`, \`case 'A':\`). Variables like \`case x:\` are not allowed.
3. **The \`break\` Statement:** Terminates the \`switch\` block immediately. If \`break\` is omitted, execution **falls through** into subsequent case blocks regardless of whether their condition matches!
4. **The \`default\` Label:** Optional fallback block that executes when none of the specified cases match. It can be placed anywhere, but is conventionally at the end.

#### Intentional Fall-Through
Fall-through is sometimes used intentionally to share logic across multiple case values:
\`\`\`c
switch (ch) {
    case 'a':
    case 'e':
    case 'i':
    case 'o':
    case 'u':
        printf("Vowel\\n");
        break;
    default:
        printf("Consonant or symbol\\n");
}
\`\`\``,
        codeSnippets: [
            {
                language: 'c',
                title: 'Menu-Driven Calculator with Switch Statement',
                code: `#include <stdio.h>

int main(void) {
    char operator = '*';
    double num1 = 12.0, num2 = 4.0;
    double result = 0.0;

    switch (operator) {
        case '+':
            result = num1 + num2;
            printf("%.2f + %.2f = %.2f\\n", num1, num2, result);
            break;
        case '-':
            result = num1 - num2;
            printf("%.2f - %.2f = %.2f\\n", num1, num2, result);
            break;
        case '*':
            result = num1 * num2;
            printf("%.2f * %.2f = %.2f\\n", num1, num2, result);
            break;
        case '/':
            if (num2 != 0) {
                result = num1 / num2;
                printf("%.2f / %.2f = %.2f\\n", num1, num2, result);
            } else {
                printf("Error: Division by zero!\\n");
            }
            break;
        default:
            printf("Error: Unknown operator '%c'!\\n", operator);
            break;
    }

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "The switch statement handles multi-way branching against integer or character constant cases. Each case must terminate with break to prevent unintended fall-through.",
            keyConcepts: ["Integral / Char Expressions", "Case Labels (Constant Literals)", "Break Statement & Fall-Through", "Default Fallback"],
            revisionNotes: "Switch statements can be optimized by compilers into O(1) jump tables, making them faster than long else-if chains."
        }
    },

    "3-4": {
        content: `### 3.4 Arithmetic Expressions

An **arithmetic expression** is a combination of constants, variable identifiers, and arithmetic operators structured according to C algebraic syntax.

#### Types of Arithmetic Expressions
1. **Integer Expressions:** Contain solely integer operands. Results are always integers:
   \`\`\`c
   int result = 15 / 4; // Evaluates to 3 (decimal .75 is truncated)
   \`\`\`
2. **Floating-Point (Real) Expressions:** Contain floating-point operands. Results retain decimal precision:
   \`\`\`c
   float result = 15.0f / 4.0f; // Evaluates to 3.75f
   \`\`\`
3. **Mixed-Mode Expressions:** Contain a mixture of integer and floating-point operands. C automatically promotes integer operands to floating-point representation before computation:
   \`\`\`c
   double result = 15 / 4.0; // 15 is promoted to 15.0 -> result is 3.75
   \`\`\`

#### Common Arithmetic Formulas in C
- **Temperature Conversion (C = 5/9(F - 32)):**
  \`\`\`c
  // WRONG: 5 / 9 performs integer division = 0!
  celsius = (5 / 9) * (fahrenheit - 32); 
  
  // CORRECT: Using floating-point literal 5.0 / 9.0
  celsius = (5.0 / 9.0) * (fahrenheit - 32);
  \`\`\`
- **Euclidean Distance (\√((x_2 - x_1)^2 + (y_2 - y_1)^2)):**
  \`\`\`c
  #include <math.h>
  double dist = sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));
  \`\`\``,
        codeSnippets: [
            {
                language: 'c',
                title: 'Mixed-Mode Arithmetic Pitfalls & Solutions',
                code: `#include <stdio.h>

int main(void) {
    int total_marks = 425;
    int max_marks = 500;

    // Common Pitfall: integer division yields 0
    float wrong_pct = (total_marks / max_marks) * 100;
    
    // Correct Approach: Explicit type promotion
    float correct_pct = ((float)total_marks / max_marks) * 100.0f;

    printf("Wrong Calculation (integer division):   %.2f%%\\n", wrong_pct);
    printf("Correct Calculation (floating promotion): %.2f%%\\n", correct_pct);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Arithmetic expressions can be integer, floating-point, or mixed-mode. In integer division (7 / 2), remainders are truncated. Mixed-mode automatically promotes smaller types to larger types.",
            keyConcepts: ["Integer vs Real Expressions", "Truncation in Integer Division", "Mixed-Mode Type Promotion", "Mathematical Library Functions (<math.h>)"],
            revisionNotes: "Always write 5.0 / 9.0 rather than 5 / 9 when converting mathematical formulas into C."
        }
    },

    "3-5": {
        content: `### 3.5 Evaluation of Expressions & Type Conversion

When evaluating expressions with multiple data types, C uses **Type Conversion** rules to harmonize operands.

#### 1. Implicit Type Conversion (Type Coercion / Promotion)
Performed automatically by the compiler without programmer intervention. Operands are converted upward along the **Type Hierarchy** to prevent data loss:

\`\`\`
 char / short ──> int ──> unsigned int ──> long ──> unsigned long ──> float ──> double ──> long double
\`\`\`

- **Integer Promotion:** In any arithmetic expression, values of type \`char\` and \`short\` are automatically promoted to \`int\`.
- **Usual Arithmetic Conversions:** If one operand is \`double\`, the other is converted to \`double\`.

#### 2. Explicit Type Conversion (Type Casting)
Forced conversion performed explicitly by the programmer using the cast operator \`(type_name)\`:
\`\`\`c
(type_name) expression;
\`\`\`
- Example: \`double avg = (double)sum / count;\`
- Casting prevents integer division truncation or narrows larger types down to smaller types.

#### Danger: Data Loss through Narrowing
Casting a large data type into a smaller one can cause overflow or data truncation:
\`\`\`c
int large_val = 300;
char ch = (char)large_val; // Overflow! A signed char only holds up to 127.
// 300 % 256 = 44 -> ch becomes ',' (ASCII 44)
\`\`\``,
        codeSnippets: [
            {
                language: 'c',
                title: 'Implicit vs Explicit Casting Demonstration',
                code: `#include <stdio.h>

int main(void) {
    char letter = 'A'; // ASCII 65
    int offset = 5;

    // Implicit Promotion: 'letter' promoted to int 65
    int combined = letter + offset; 
    printf("Character 'A' + 5 = %d (Character '%c')\\n", combined, (char)combined);

    // Explicit Cast: Precision preservation
    int a = 17, b = 4;
    double exact_division = (double)a / b;
    printf("17 / 4 with explicit cast = %.3f\\n", exact_division);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Implicit conversion (type promotion) widens operands automatically to avoid data loss. Explicit casting (type) manually forces conversions, such as converting int to double for precise division.",
            keyConcepts: ["Type Promotion Hierarchy", "Implicit Coercion vs Explicit Casting", "Data Narrowing & Overflow Risks"],
            revisionNotes: "Explicitly cast one operand: `(double)sum / count` forces floating-point division instead of integer truncation."
        }
    },

    "3-6": {
        content: `### 3.6 GOTO Statement in 'C'

The **\`goto\`** statement is an unconditional jump statement that transfers program control directly to a labeled statement within the same function.

#### Syntax & Structure
\`\`\`c
goto label_name;
...
label_name:
    // Destination statements executed after the jump
\`\`\`

#### Why \`goto\` is Strongly Discouraged in General Programming
In 1968, computer scientist Edsger W. Dijkstra published the classic paper *"Go To Statement Considered Harmful"*.
- **Spaghetti Code:** Unconstrained \`goto\` jumps make program flow erratic and impossible to trace, debug, or verify formally.
- **Breaks Structured Design:** Bypasses initialization logic and loop invariants.
- **Better Alternatives:** Modern control structures (\`for\`, \`while\`, \`break\`, \`continue\`, functions) eliminate the need for \`goto\` in 99% of tasks.

#### The Legitimate Systems Programming Exception: Error Cleanup
In low-level systems programming (e.g., the Linux Kernel), \`goto\` is used as an idiomatic pattern for **centralized resource cleanup** to prevent memory and file descriptor leaks across deeply nested operations:
\`\`\`c
int init_device() {
    if (!alloc_mem()) goto err_mem;
    if (!open_port()) goto err_port;
    if (!start_timer()) goto err_timer;
    return 0; // Success

err_timer:
    close_port();
err_port:
    free_mem();
err_mem:
    return -1; // Failure
}
\`\`\``,
        codeSnippets: [
            {
                language: 'c',
                title: 'Idiomatic Resource Cleanup Pattern using goto',
                code: `#include <stdio.h>
#include <stdlib.h>

int processResources(void) {
    int *buffer = (int*)malloc(100 * sizeof(int));
    if (!buffer) {
        printf("Error: Memory allocation failed.\\n");
        return -1;
    }

    FILE *fp = fopen("sample.txt", "w");
    if (!fp) {
        printf("Error: File opening failed.\\n");
        goto cleanup_buffer; // Centralized cleanup
    }

    fprintf(fp, "HiGen Systems: Data written successfully.\\n");
    printf("Work finished cleanly.\\n");

    fclose(fp);
cleanup_buffer:
    free(buffer);
    printf("Allocated buffer released.\\n");
    return 0;
}

int main(void) {
    processResources();
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "goto performs unconditional jumps to named labels. While generally avoided due to creating 'spaghetti code', it is an accepted idiom in systems code for centralized error cleanup.",
            keyConcepts: ["Unconditional Jumping", "Labeled Statements", "Spaghetti Code Hazards", "Linux Kernel Cleanup Idiom"],
            revisionNotes: "Never use goto across functions (which is illegal in C anyway) or to simulate basic loops."
        }
    }
};

