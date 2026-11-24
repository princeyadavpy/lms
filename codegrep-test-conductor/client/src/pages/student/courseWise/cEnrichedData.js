// Auto-generated enriched C curriculum data
export const cEnrichedData = {
  "1-1": {
    "content": "### 1.1 Types of Programming Languages\n\nA **programming language** is a formal set of instructions that humans use to communicate with computers. Languages operate at different levels of abstraction between human thought and hardware binary.\n\n#### 1. Low-Level Languages\nLow-level languages are closely coupled to the CPU architecture and machine hardware.\n\n- **Machine Language (First Generation):** \n  - Written directly in binary sequences of `0`s and `1`s.\n  - Executed directly by the CPU instruction decoder without translation.\n  - Platform-dependent: Code written for x86 cannot run on ARM or MIPS.\n  - Extremely error-prone and tedious for humans to read or maintain.\n- **Assembly Language (Second Generation):**\n  - Replaces binary opcodes with human-readable mnemonics (e.g., `MOV`, `ADD`, `SUB`, `JMP`).\n  - Requires an **Assembler** to translate mnemonics into machine code.\n  - Directly accesses CPU registers and flags, providing maximum speed.\n\n#### 2. High-Level Languages (Third Generation & Beyond)\nHigh-level languages provide abstraction over CPU registers and direct memory manipulation.\n- Uses English-like keywords, mathematical expressions, and structured logic.\n- **Portable:** The same source code can be compiled or interpreted across different operating systems and CPU architectures.\n- Examples: **C**, C++, Java, Python, Rust, Go.\n\n#### Comparison: Low-Level vs. High-Level Languages\n| Attribute | Low-Level Language | High-Level Language |\n| :--- | :--- | :--- |\n| **Abstraction** | Direct hardware control (registers/memory) | Abstracted data types and structures |\n| **Execution Speed** | Extremely fast (raw machine code) | Very fast (compiled C/C++) to moderate (interpreted) |\n| **Portability** | Machine/Architecture specific | Portable across OS and hardware |\n| **Ease of Learning** | Complex, requires CPU architecture mastery | Intuitive English-like syntax |\n| **Translation** | Assembler (for Assembly) or None (Machine code) | Compiler or Interpreter required |\n\n#### Language Translators: Compilers vs. Interpreters\n- **Compiler:** Translates the entire source file at once into an independent machine-code object file (`.o` / `.obj` / `.exe`). Execution is lightning fast because translation happens ahead of time. *C and C++ are compiled languages.*\n- **Interpreter:** Translates and executes the program line by line at runtime. Errors are caught dynamically during execution. *Python and JavaScript are interpreted.*",
    "codeSnippets": [
      {
        "language": "c",
        "title": "High-Level C vs Machine Perspective",
        "code": "#include <stdio.h>\n\nint main(void) {\n    // High-level abstraction: variable assignment and addition\n    int a = 15;\n    int b = 27;\n    int sum = a + b;\n\n    // CPU performs: LOAD R1, 15; LOAD R2, 27; ADD R1, R2; STORE sum\n    printf(\"Calculated Sum: %d\\n\", sum);\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Programming languages span from Low-Level (Machine code and Assembly) to High-Level (C, C++, Python). C is a high-level compiled language offering both abstraction and low-level memory efficiency.",
      "keyConcepts": [
        "Machine Language (Binary)",
        "Assembly Language (Mnemonics)",
        "High-Level Languages",
        "Compilers vs Interpreters"
      ],
      "revisionNotes": "Remember: C is often classified as a 'middle-level' language because it combines the readability of high-level languages with the raw pointer and memory access of low-level languages."
    }
  },
  "1-2": {
    "content": "### 1.2 Evolution of 'C' Language\n\nThe C programming language was created between 1969 and 1973 by **Dennis Ritchie** at AT&T Bell Laboratories (New Jersey, USA). It was designed specifically to rewrite the **UNIX** operating system kernel, which was previously written in assembly language.\n\n#### The Historical Genealogy of C\n1. **ALGOL 60 (1960):** Introduced structured block-based programming concepts.\n2. **CPL (Combined Programming Language, 1963):** Developed by Cambridge and University of London, but was too complex to implement easily.\n3. **BCPL (Basic Combined Programming Language, 1967):** Created by **Martin Richards** as a stripped-down, typeless language for systems programming.\n4. **B Language (1969 - 1970):** Developed by **Ken Thompson** for the early DEC PDP-7 Unix system. It was typeless and manipulated single computer words.\n5. **C Language (1972):** Dennis Ritchie extended B by adding **data types** (integers, characters, floating-point), structures, and pointers. The name \"C\" was chosen because it was the successor to the \"B\" language.\n\n```\nALGOL (1960) ──> CPL (1963) ──> BCPL (1967) ──> B (1970) ──> C (1972)\n```\n\n#### Major Standardization Milestones\n- **K&R C (1978):** Brian Kernighan and Dennis Ritchie published the seminal book *\"The C Programming Language\"*, which served as the de facto specification for a decade.\n- **ANSI C / ISO C89 (1989/1990):** The American National Standards Institute (ANSI) standardized C (ANSI X3.159-1989), introducing function prototypes, standard library headers (`<stdio.h>`, `<stdlib.h>`), and `void` pointers.\n- **C99 (1999):** Introduced inline functions, single-line comments (`//`), variable-length arrays (VLAs), and `<stdbool.h>`.\n- **C11 (2011):** Added native multi-threading support (`<threads.h>`), atomic operations (`<stdatomic.h>`), and anonymous structs.\n- **C17 / C23:** Modern revisions focusing on security, boundary checks, and removing deprecated features.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Standard ANSI C Demonstration",
        "code": "#include <stdio.h>\n\nint main(void) {\n    printf(\"==========================================\\n\");\n    printf(\"   Welcome to Programming in 'C' (HiGen)   \\n\");\n    printf(\"   Developed by Dennis Ritchie (1972)      \\n\");\n    printf(\"==========================================\\n\");\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C was created in 1972 by Dennis Ritchie at Bell Labs to implement the UNIX kernel. It evolved from Ken Thompson's B language and BCPL, and was formally standardized by ANSI in 1989.",
      "keyConcepts": [
        "Dennis Ritchie & Bell Labs",
        "B & BCPL Roots",
        "UNIX Operating System",
        "ANSI C89 / ISO C99 Standards"
      ],
      "revisionNotes": "C was named 'C' simply because it succeeded Ken Thompson's 'B' language."
    }
  },
  "1-3": {
    "content": "### 1.3 Structure of a 'C' Program\n\nEvery standard C program adheres to a structured, modular organization composed of specific functional sections.\n\n```\n┌────────────────────────────────────────────────────────┐\n│ 1. Documentation Section   (Comments & Author Info)    │\n├────────────────────────────────────────────────────────┤\n│ 2. Preprocessor Section    (#include, #define)         │\n├────────────────────────────────────────────────────────┤\n│ 3. Global Declaration      (Global vars, typedefs)     │\n├────────────────────────────────────────────────────────┤\n│ 4. main() Function         (Execution entry point)     │\n│    {                                                   │\n│        Declaration part;                               │\n│        Executable statements;                          │\n│        return 0;                                       │\n│    }                                                   │\n├────────────────────────────────────────────────────────┤\n│ 5. Subprogram / Functions  (User-defined functions)    │\n└────────────────────────────────────────────────────────┘\n```\n\n#### Detailed Breakdown of Sections\n1. **Documentation Section:** Contains comments stating the purpose of the program, author, and date.\n   - Single-line: `// comment` (C99 onwards)\n   - Multi-line: `/* comment */`\n2. **Preprocessor / Link Section:** Directives beginning with `#` processed before compilation.\n   - `#include <stdio.h>`: Includes standard input/output header functions like `printf` and `scanf`.\n   - `#define MAX 100`: Declares symbolic constants or macros.\n3. **Global Declaration Section:** Declares variables and custom data types accessible across all functions in the file.\n4. **The `main()` Function:** The mandatory entry point for program execution.\n   - Return type `int`: Returns an exit status code to the operating system (`0` indicates success; non-zero indicates error).\n   - Enclosed in curly braces `{ ... }` designating block scope.\n5. **Subprogram Section:** Contains user-defined functions that modularize the application logic.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Complete Canonical C Program Anatomy",
        "code": "/* Documentation: Demonstrating standard C program structure */\n#include <stdio.h>    // Link Section\n#define APP_NAME \"HiGen C Engine\"  // Definition Section\n\nint global_counter = 0; // Global Declaration\n\nvoid greetUser(void);   // Function Prototype\n\nint main(void) {        // Main Function Entry\n    int local_num = 10; // Local declaration\n    \n    printf(\"Application: %s\\n\", APP_NAME);\n    printf(\"Local Value: %d\\n\", local_num);\n    greetUser();\n    \n    return 0;           // Termination Status Code\n}\n\nvoid greetUser(void) {  // Subprogram Definition\n    printf(\"Welcome to modular C systems programming!\\n\");\n}"
      }
    ],
    "aiSummary": {
      "summary": "A C program consists of Documentation, Preprocessor directives (#include), Global declarations, the mandatory main() entry point, and optional user-defined functions.",
      "keyConcepts": [
        "Preprocessor Directives",
        "main() Entry Point",
        "Exit Status Codes",
        "Global vs Local Sections"
      ],
      "revisionNotes": "Always return 0 from main() to inform the OS that the program completed successfully without errors."
    }
  },
  "1-4": {
    "content": "### 1.4 'C' Program Development Life Cycle\n\nThe journey from human-written text to an executable machine binary involves 5 distinct stages in the **Compilation Pipeline**.\n\n```\n [Source Code (.c)]\n        │\n        ▼ (Preprocessor: expands macros, strips comments, inserts headers)\n [Expanded Code (.i)]\n        │\n        ▼ (Compiler: translates C syntax to Assembly instructions)\n [Assembly Code (.s)]\n        │\n        ▼ (Assembler: translates assembly mnemonics to machine code)\n [Object Code (.o / .obj)]\n        │\n        ▼ (Linker: combines object files with C Runtime Library routines)\n [Executable Binary (.exe / a.out)]\n```\n\n#### Step-by-Step Compilation Pipeline\n1. **Creation / Editing:**\n   - The developer writes source code in a text editor and saves it as `main.c`.\n2. **Preprocessing (`gcc -E main.c -o main.i`):**\n   - Strips all comments (`/*...*/` and `//`).\n   - Replaces macro definitions (`#define`) with their literal substitutions.\n   - Copies the full contents of header files (`#include <stdio.h>`) into the source stream.\n3. **Compilation (`gcc -S main.i -o main.s`):**\n   - Checks syntax and semantics.\n   - Translates high-level C logic into target-specific assembly language instructions (`mov`, `add`, `push`).\n4. **Assembly (`gcc -c main.s -o main.o`):**\n   - Converts assembly instructions into raw binary machine code stored in an **Object file** (`.o` on Linux, `.obj` on Windows).\n5. **Linking (`gcc main.o -o main.exe`):**\n   - Resolves external references (such as `printf`) by linking the object file with the **C Standard Runtime Library** (libc).\n   - Produces the final executable binary.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "GCC Compilation Commands",
        "code": "# 1. Preprocess only (generates main.i):\n# gcc -E main.c -o main.i\n\n# 2. Compile to assembly (generates main.s):\n# gcc -S main.c -o main.s\n\n# 3. Assemble to object file (generates main.o):\n# gcc -c main.c -o main.o\n\n# 4. Link into final executable:\n# gcc main.o -o my_program\n\n# 5. One-step compilation with all warnings enabled:\n# gcc -Wall -Wextra -O2 main.c -o my_program"
      }
    ],
    "aiSummary": {
      "summary": "The C compilation process consists of Preprocessing (.i), Compilation (.s), Assembly (.o), and Linking into the final executable binary.",
      "keyConcepts": [
        "Preprocessor Expansion",
        "Assembly Translation",
        "Object File Generation",
        "Linker & C Runtime (libc)"
      ],
      "revisionNotes": "Use `gcc -Wall -Wextra main.c` during development to catch uninitialized variables, unused parameters, and type mismatches."
    }
  },
  "1-5": {
    "content": "### 1.5 Executing and Debugging a 'C' Program\n\nWriting software is only half the task; running, testing, and debugging are essential for robust systems.\n\n#### Program Execution Errors\nErrors in C fall into three major classifications:\n1. **Compile-Time Errors (Syntax & Semantic):**\n   - Violations of C grammar rules, such as missing semicolons `;`, undeclared variables, or mismatched parentheses.\n   - Detected by the compiler before an executable is produced.\n2. **Link-Time Errors:**\n   - Occur when the compiler references a function or variable that cannot be resolved in any object file or library (e.g., `undefined reference to 'main'` or missing math library `-lm`).\n3. **Runtime Errors (Bugs):**\n   - Errors occurring while the binary is actively running:\n     - **Segmentation Fault (SIGSEGV):** Attempting to read/write unauthorized memory (dereferencing a `NULL` or dangling pointer).\n     - **Division by Zero:** Triggering CPU floating-point exceptions (SIGFPE).\n     - **Buffer Overflow:** Writing past the allocated boundary of an array or stack buffer.\n\n#### Debugging with GDB (GNU Debugger)\nTo debug a C program, compile with the `-g` flag to embed debugging symbols:\n```bash\ngcc -g -Wall main.c -o debug_app\ngdb ./debug_app\n```\n\n| GDB Command | Action |\n| :--- | :--- |\n| `break main` / `b 14` | Set a breakpoint at `main()` or line 14 |\n| `run` / `r` | Start program execution |\n| `next` / `n` | Step over to the next source line |\n| `step` / `s` | Step into a function call |\n| `print var` / `p var` | Display the current runtime value of variable `var` |\n| `backtrace` / `bt` | Print stack frame backtrace showing crash origin |\n| `quit` / `q` | Exit GDB debugger |",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Defensive Coding: Preventing Runtime Division by Zero",
        "code": "#include <stdio.h>\n\nint safeDivide(int numerator, int denominator, int *result) {\n    if (denominator == 0) {\n        fprintf(stderr, \"Error: Division by zero attempted!\\n\");\n        return -1; // Return error code\n    }\n    *result = numerator / denominator;\n    return 0; // Success\n}\n\nint main(void) {\n    int res = 0;\n    if (safeDivide(100, 5, &res) == 0) {\n        printf(\"100 / 5 = %d\\n\", res);\n    }\n    if (safeDivide(100, 0, &res) != 0) {\n        printf(\"Division safely aborted without crash.\\n\");\n    }\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C programs encounter Compile-time, Link-time, or Runtime errors (such as Segmentation Faults). Debugging is handled via GCC error warnings (-Wall) and GDB breakpoints.",
      "keyConcepts": [
        "Compile vs Link vs Runtime Errors",
        "Segmentation Faults (SIGSEGV)",
        "GDB Breakpoints & Backtraces",
        "Defensive Programming"
      ],
      "revisionNotes": "Compile with `gcc -g` whenever you need to inspect stack traces or step through variables in GDB."
    }
  },
  "2-1": {
    "content": "### 2.1 Keywords and Identifiers\n\nIn C, the compiler breaks source code into the smallest individual lexical units called **Tokens**. Tokens comprise:\n1. Keywords\n2. Identifiers\n3. Constants\n4. Strings\n5. Special Symbols\n6. Operators\n\n#### 1. Keywords (Reserved Words)\nKeywords are predefined, reserved identifiers with fixed meanings that cannot be used as variable, function, or array names. ANSI C89 specifies **32 standard keywords**:\n\n| Category | Keywords |\n| :--- | :--- |\n| **Data Types** | `char`, `int`, `float`, `double`, `void` |\n| **Type Modifiers** | `signed`, `unsigned`, `short`, `long` |\n| **Control Flow** | `if`, `else`, `switch`, `case`, `default`, `goto` |\n| **Loops** | `for`, `while`, `do`, `break`, `continue` |\n| **Storage Classes** | `auto`, `register`, `static`, `extern` |\n| **User Types & Qualifiers** | `struct`, `union`, `typedef`, `enum`, `const`, `volatile`, `sizeof`, `return` |\n\n*(C99 added: `inline`, `_Bool`, `_Complex`, `_Imaginary`. C11 added: `_Atomic`, `_Generic`, etc.)*\n\n#### 2. Identifiers\nIdentifiers are names given by the programmer to entities like variables, functions, structures, and arrays.\n\n#### Rules for Constructing Valid Identifiers\n1. **Allowed Characters:** Uppercase English letters (`A-Z`), lowercase letters (`a-z`), digits (`0-9`), and underscore (`_`).\n2. **First Character:** Must be a letter or an underscore (`_`). **Cannot begin with a digit.**\n3. **No Reserved Words:** Keywords cannot be used as identifiers (e.g., `int while = 5;` is illegal).\n4. **Case Sensitivity:** C is strictly case-sensitive: `student`, `Student`, and `STUDENT` are three distinct identifiers.\n5. **No Special Symbols or Spaces:** Characters like `@`, `$`, `#`, `-`, and spaces are invalid.\n\n| Valid Identifier | Invalid Identifier | Reason Invalid |\n| :--- | :--- | :--- |\n| `total_score` | `total score` | Space is not permitted |\n| `_counter` | `2nd_place` | Cannot begin with a number |\n| `studentGrade` | `float` | Cannot use reserved keyword |\n| `MAX_BUFFER_SIZE` | `emp$salary` | Special character `$` not allowed |",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Valid Identifiers and Keywords in Practice",
        "code": "#include <stdio.h>\n\nint main(void) {\n    // Valid identifier declarations\n    int total_marks = 95;\n    float _gpa = 3.92f;\n    char studentInitial = 'P';\n\n    printf(\"Student '%c' scored %d with GPA %.2f\\n\", studentInitial, total_marks, _gpa);\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Tokens are basic building blocks of C. ANSI C has 32 reserved keywords. Identifiers are user-defined names that must start with a letter or underscore and cannot use keywords or spaces.",
      "keyConcepts": [
        "32 ANSI Keywords",
        "Identifier Naming Rules",
        "Case Sensitivity",
        "Lexical Tokens"
      ],
      "revisionNotes": "Always choose descriptive, snake_case identifiers like `student_count` rather than cryptic single letters."
    }
  },
  "2-2": {
    "content": "### 2.2 Operators in 'C'\n\nAn **operator** is a symbol that instructs the compiler to perform specific mathematical, relational, or logical manipulations on data operands.\n\n#### 1. Arithmetic Operators\nUsed for standard mathematical calculations:\n- `+` (Addition), `-` (Subtraction), `*` (Multiplication)\n- `/` (Division): If both operands are integers, performs **integer division** (truncating the decimal part: `7 / 2` evaluates to `3`).\n- `%` (Modulo): Returns the remainder of integer division (`7 % 2` evaluates to `1`). Operands must be integers.\n\n#### 2. Relational (Comparison) Operators\nEvaluate comparisons returning integer boolean values: `1` for True, `0` for False:\n- `==` (Equal to), `!=` (Not equal to)\n- `>` (Greater than), `<` (Less than)\n- `>=` (Greater than or equal to), `<=` (Less than or equal to)\n\n#### 3. Logical Operators\nUsed to combine conditional tests:\n- `&&` (Logical AND): Returns true only if both operands evaluate to non-zero. Features **short-circuit evaluation**: if the first operand is false, the second is never evaluated.\n- `||` (Logical OR): Returns true if at least one operand is non-zero. Short-circuits if the first operand is true.\n- `!` (Logical NOT): Unary negation operator (`!1` evaluates to `0`).\n\n#### 4. Bitwise Operators\nOperate directly on individual bits of integer numbers:\n- `&` (Bitwise AND), `|` (Bitwise OR), `^` (Bitwise XOR), `~` (Bitwise NOT/1's complement)\n- `<<` (Left Shift): Shifts bits left, multiplying by 2^n (`5 << 1` is `10`).\n- `>>` (Right Shift): Shifts bits right, dividing by 2^n (`10 >> 1` is `5`).\n\n#### 5. Assignment & Compound Assignment\n- Standard assignment: `=`\n- Compound arithmetic: `+=`, `-=`, `*=`, `/=`, `%=`\n- Compound bitwise: `&=`, `|=`, `^=`, `<<=`, `>>=`\n\n#### 6. Increment and Decrement Operators (`++`, `--`)\n- **Prefix (`++x`):** Increments `x` first, then yields the incremented value in the expression.\n- **Postfix (`x++`):** Yields the current value in the expression first, then increments `x` in memory.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Prefix vs Postfix and Bitwise Operations",
        "code": "#include <stdio.h>\n\nint main(void) {\n    int a = 5;\n    int b = ++a; // Prefix: a becomes 6, b = 6\n    printf(\"Prefix -> a: %d, b: %d\\n\", a, b);\n\n    int c = 5;\n    int d = c++; // Postfix: d = 5, then c becomes 6\n    printf(\"Postfix -> c: %d, d: %d\\n\", c, d);\n\n    // Bitwise Left Shift (Multiply by 2)\n    int val = 12; // Binary: 0000 1100\n    int shifted = val << 1; // Binary: 0001 1000 = 24\n    printf(\"Bitwise Shift: 12 << 1 = %d\\n\", shifted);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C provides Arithmetic, Relational, Logical (with short-circuiting), Bitwise, Assignment, and Prefix/Postfix increment/decrement operators.",
      "keyConcepts": [
        "Integer Division vs Modulo",
        "Short-Circuit Logic (&&, ||)",
        "Bitwise Shift Operators",
        "Prefix (++i) vs Postfix (i++)"
      ],
      "revisionNotes": "Remember: Modulo (%) only works with integers. Writing 5.5 % 2 causes a compile-time error."
    }
  },
  "2-3": {
    "content": "### 2.3 Constants in 'C'\n\nA **constant** (or literal) is a fixed value that cannot be altered by the program during its execution. In C, constants are classified into numeric, character, and string constants.\n\n#### 1. Integer Constants\nFixed whole numbers without fractional points:\n- **Decimal:** Digits `0-9` (e.g., `42`, `-100`).\n- **Octal:** Starts with prefix `0` followed by digits `0-7` (e.g., `052` = 5 \× 8^1 + 2 \× 8^0 = 42_{10}).\n- **Hexadecimal:** Starts with prefix `0x` or `0X` followed by digits `0-9` and `a-f` (e.g., `0x2A` = 2 \× 16^1 + 10 \× 16^0 = 42_{10}).\n- **Suffixes:** `U` or `u` for unsigned (`500U`), `L` or `l` for long (`100000L`).\n\n#### 2. Real (Floating-Point) Constants\nNumbers containing fractional parts or exponential scientific notation:\n- **Fractional form:** `3.14159`, `-0.005`\n- **Exponential form:** `1.5e3` (1.5 \× 10^3 = 1500.0), `2.8E-4` (2.8 \× 10^{-4})\n- By default, floating literals are of type `double`. Suffix `f` specifies `float` (`3.14f`).\n\n#### 3. Character Constants\nA single character enclosed within single quotes (e.g., `'A'`, `'9'`, `'+'`).\n- In C, a character constant is stored internally as its integer **ASCII value** (`'A'` is `65`, `'a'` is `97`, `'0'` is `48`).\n- **Escape Sequences:** Non-printable or special characters prefixed by backslash `\\`:\n  - `\\n`: Newline\n  - `\\t`: Horizontal tab\n  - `\\0`: Null character (ASCII 0)\n  - `\\\\`: Backslash\n  - `\\'`: Single quote\n  - `\\\"`: Double quote\n\n#### 4. String Constants\nA sequence of characters enclosed in double quotation marks (e.g., `\"HiGen Labs\"`).\n- The compiler automatically appends a terminating null character (`'\\0'`) at the end of every string constant in memory.\n\n#### 5. Defining Constants in C\n- Using `#define` preprocessor: `#define PI 3.14159` (textual replacement, no memory allocated).\n- Using `const` qualifier: `const double PI = 3.14159;` (typed, memory allocated, read-only).",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Constant Types & Escape Characters",
        "code": "#include <stdio.h>\n#define PI 3.1415926535\n\nint main(void) {\n    const int MAX_USERS = 500;\n    int hexVal = 0xFF;    // 255 in decimal\n    int octalVal = 077;   // 63 in decimal\n    char tabChar = '\\t';\n\n    printf(\"PI: %.4f\\n\", PI);\n    printf(\"Max Users: %d\\n\", MAX_USERS);\n    printf(\"Hex 0xFF = %d, Octal 077 = %d\\n\", hexVal, octalVal);\n    printf(\"Item%cPrice\\n\", tabChar);\n    printf(\"Book%c$29.99\\n\", tabChar);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Constants are immutable values categorized into integer (decimal, octal, hex), floating-point, character (ASCII), and string literals (null-terminated). They are defined via #define or const.",
      "keyConcepts": [
        "Decimal, Octal (0 prefix), Hex (0x prefix)",
        "Float Suffixes (f, L)",
        "ASCII Character Values",
        "Escape Sequences",
        "const vs #define"
      ],
      "revisionNotes": "Prefer `const int LIMIT = 100;` over `#define LIMIT 100` because const provides type-checking and adheres to compiler scoping."
    }
  },
  "2-4": {
    "content": "### 2.4 Variables in 'C'\n\nA **variable** is a named location in computer memory used to store data that can be altered during program execution.\n\n#### Variable Declaration vs. Initialization\n- **Declaration:** Informs the compiler about the variable's name and data type so it can allocate appropriate memory bytes.\n  ```c\n  int age;       // Allocates 4 bytes (contains uninitialized garbage)\n  float salary;  // Allocates 4 bytes\n  ```\n- **Initialization:** Assigns an initial value to the allocated variable at the time of declaration.\n  ```c\n  int age = 21;\n  float salary = 75000.50f;\n  ```\n\n#### Memory Representation of a Variable\nWhen you declare `int score = 85;`:\n1. The compiler binds the identifier name `score` to a specific memory address (e.g., `0x7ffeefbff568`).\n2. It reserves 4 contiguous bytes in the stack frame.\n3. It writes the binary representation of `85` into those 4 bytes.\n\n```\n Identifier: score\n Type:       int (4 bytes)\n Address:    0x7ffeefbff568\n Value:      85 (Binary: 00000000 00000000 00000000 01010101)\n```\n\n#### Understanding lvalue and rvalue\n- **lvalue (Locator Value):** An expression that designates a persistent, identifiable memory address. Appears on the **left side** of an assignment operator. (e.g., `x` in `x = 10;`).\n- **rvalue (Read Value):** A temporary data value or literal stored in memory or a CPU register. Appears on the **right side** of an assignment operator. (e.g., `10` in `x = 10;`).\n- `10 = x;` is illegal because the literal constant `10` is an rvalue without an assignable memory address.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Variable Memory Inspection (Address & Size)",
        "code": "#include <stdio.h>\n\nint main(void) {\n    int count = 100;\n    double price = 99.95;\n\n    // Printing variable value, memory size, and physical memory address (&)\n    printf(\"Variable 'count': Value = %d, Size = %zu bytes, Address = %p\\n\", \n           count, sizeof(count), (void*)&count);\n    \n    printf(\"Variable 'price': Value = %.2f, Size = %zu bytes, Address = %p\\n\", \n           price, sizeof(price), (void*)&price);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "A variable is a named memory location with a data type. Declaration allocates bytes; initialization writes the starting value. Variables act as lvalues holding assignable memory addresses.",
      "keyConcepts": [
        "Declaration vs Initialization",
        "Memory Address (& operator)",
        "sizeof Operator",
        "lvalue vs rvalue"
      ],
      "revisionNotes": "Always initialize local variables; uninitialized local stack variables hold unpredictable garbage data."
    }
  },
  "2-5": {
    "content": "### 2.5 Data Types in 'C'\n\nData types in C define the size of memory allocated, the range of values that can be stored, and the allowable operations.\n\n```\n                    Data Types in C\n      ┌────────────────────┼────────────────────┐\n      ▼                    ▼                    ▼\n   Primary              Derived           User-Defined\n (char, int,        (Arrays, Pointers,     (typedef,\n float, double,     Structures, Unions)    enum)\n void)\n```\n\n#### Primary (Fundamental) Data Types on Standard 64-bit Systems\n| Data Type | Keyword | Typical Size | Range of Values | Format Specifier |\n| :--- | :--- | :--- | :--- | :--- |\n| **Character** | `char` | 1 Byte | -128 to 127 | `%c` |\n| **Unsigned Char** | `unsigned char` | 1 Byte | 0 to 255 | `%c` or `%u` |\n| **Integer** | `int` | 4 Bytes | -2,147,483,648 to +2,147,483,647 | `%d` or `%i` |\n| **Unsigned Int** | `unsigned int` | 4 Bytes | 0 to 4,294,967,295 | `%u` |\n| **Short Int** | `short int` | 2 Bytes | -32,768 to +32,767 | `%hd` |\n| **Long Int** | `long int` | 8 Bytes | -9.22 \× 10^{18} to +9.22 \× 10^{18} | `%ld` |\n| **Float** | `float` | 4 Bytes | \≈ 3.4 \× 10^{\pm 38} (6-7 decimal places) | `%f` |\n| **Double** | `double` | 8 Bytes | \≈ 1.7 \× 10^{\pm 308} (15 decimal places) | `%lf` |\n| **Long Double** | `long double` | 16 Bytes | Extended precision (19 decimal places) | `%Lf` |\n| **Void** | `void` | 0 Bytes | Valueless / Generic pointer indicator | N/A |\n\n#### Modifiers in C\nModifiers customize the storage capacity and sign handling of primary types:\n- **Sign Modifiers:** `signed` (default, can be positive or negative) and `unsigned` (non-negative only, doubling positive range).\n- **Size Modifiers:** `short` (reduces size or keeps it minimal) and `long` (expands integer or floating-point range).",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Data Type Size & Limit Verification",
        "code": "#include <stdio.h>\n#include <limits.h>\n#include <float.h>\n\nint main(void) {\n    printf(\"--- Integer Data Type Sizes & Limits ---\\n\");\n    printf(\"char:   %zu byte  [min: %d, max: %d]\\n\", sizeof(char), CHAR_MIN, CHAR_MAX);\n    printf(\"short:  %zu bytes [min: %d, max: %d]\\n\", sizeof(short), SHRT_MIN, SHRT_MAX);\n    printf(\"int:    %zu bytes [min: %d, max: %d]\\n\", sizeof(int), INT_MIN, INT_MAX);\n    printf(\"long:   %zu bytes [min: %ld, max: %ld]\\n\", sizeof(long), LONG_MIN, LONG_MAX);\n\n    printf(\"\\n--- Floating-Point Precision ---\\n\");\n    printf(\"float:  %zu bytes [precision: %d digits]\\n\", sizeof(float), FLT_DIG);\n    printf(\"double: %zu bytes [precision: %d digits]\\n\", sizeof(double), DBL_DIG);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C provides Primary (char, int, float, double, void), Derived (arrays, pointers, structs), and User-defined (enum, typedef) types. Modifiers include signed, unsigned, short, and long.",
      "keyConcepts": [
        "Fundamental Data Types",
        "Memory Footprints",
        "Sign Modifiers (signed/unsigned)",
        "Format Specifiers (%d, %f, %c)"
      ],
      "revisionNotes": "Always inspect `<limits.h>` and `<float.h>` for platform-specific integer and floating-point boundaries."
    }
  },
  "2-6": {
    "content": "### 2.6 Precedence and Associativity of Operators\n\nWhen multiple operators appear in a single expression, the evaluation order is governed by **Precedence** and **Associativity**.\n\n- **Operator Precedence:** Determines which operator is evaluated first in an expression. Operators with higher precedence are evaluated before operators with lower precedence.\n- **Associativity:** Dictates the direction of evaluation (Left-to-Right or Right-to-Left) when operators of equal precedence appear together.\n\n#### Comprehensive C Operator Precedence Table (Highest to Lowest)\n| Rank | Category | Operators | Associativity |\n| :---: | :--- | :--- | :---: |\n| **1** | Postfix / Grouping | `()`, `[]`, `->`, `.`, `x++`, `x--` | Left-to-Right |\n| **2** | Unary | `++x`, `--x`, `+`, `-`, `!`, `~`, `*` (deref), `&` (addr), `sizeof` | **Right-to-Left** |\n| **3** | Multiplicative | `*`, `/`, `%` | Left-to-Right |\n| **4** | Additive | `+`, `-` | Left-to-Right |\n| **5** | Shift | `<<`, `>>` | Left-to-Right |\n| **6** | Relational | `<`, `<=`, `>`, `>=` | Left-to-Right |\n| **7** | Equality | `==`, `!=` | Left-to-Right |\n| **8** | Bitwise AND | `&` | Left-to-Right |\n| **9** | Bitwise XOR | `^` | Left-to-Right |\n| **10** | Bitwise OR | `|` | Left-to-Right |\n| **11** | Logical AND | `&&` | Left-to-Right |\n| **12** | Logical OR | `||` | Left-to-Right |\n| **13** | Conditional (Ternary) | `? :` | **Right-to-Left** |\n| **14** | Assignment | `=`, `+=`, `-=`, `*=`, `/=`, `%=` | **Right-to-Left** |\n| **15** | Comma | `,` | Left-to-Right |\n\n#### Step-by-Step Expression Evaluation\nEvaluate: `int result = 10 + 20 * 3 / 2 - 5;`\n1. High precedence: `*` and `/` are equal, evaluated Left-to-Right:\n   - `20 * 3 = 60`\n   - `60 / 2 = 30`\n2. Next precedence: `+` and `-` evaluated Left-to-Right:\n   - `10 + 30 = 40`\n   - `40 - 5 = 35`\n3. Final assignment: `result = 35`.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Precedence & Parentheses Influence",
        "code": "#include <stdio.h>\n\nint main(void) {\n    int a = 10, b = 20, c = 30;\n\n    // Evaluated as: a + (b * c)\n    int res1 = a + b * c; \n    \n    // Explicit override via parentheses: (a + b) * c\n    int res2 = (a + b) * c;\n\n    printf(\"Without parentheses (10 + 20 * 30) = %d\\n\", res1);\n    printf(\"With parentheses ((10 + 20) * 30)   = %d\\n\", res2);\n\n    // Chained Assignment (Right-to-Left associativity)\n    int x, y, z;\n    x = y = z = 50; // z=50 evaluated first, then y=50, then x=50\n    printf(\"Chained: x=%d, y=%d, z=%d\\n\", x, y, z);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Operator precedence dictates evaluation priority; associativity resolves order among equal-priority operators. Multiplication/Division precede Addition/Subtraction. Unary, Ternary, and Assignment associate Right-to-Left.",
      "keyConcepts": [
        "Operator Precedence Hierarchy",
        "Left-to-Right vs Right-to-Left Associativity",
        "Parenthetical Overrides ()"
      ],
      "revisionNotes": "When in doubt, always use parentheses () to ensure clarity and eliminate ambiguity in complex expressions."
    }
  },
  "2-7": {
    "content": "### 2.7 Scope and Lifetime of Variables\n\nThe behavior of a variable across a program is defined by two fundamental properties:\n1. **Scope (Visibility):** The region of code where the variable identifier is accessible.\n2. **Lifetime (Duration):** The period of program execution during which the variable retains its allocated memory location.\n\n```\n Memory Segment          Variable Type               Lifetime\n┌──────────────────────┬───────────────────────────┬──────────────────────┐\n│ Stack                │ Local / Automatic         │ Block execution      │\n├──────────────────────┼───────────────────────────┼──────────────────────┤\n│ Data / BSS Segment   │ Global / Static           │ Entire program run   │\n├──────────────────────┼───────────────────────────┼──────────────────────┤\n│ Heap                 │ Dynamic (malloc/calloc)   │ Until free()         │\n└──────────────────────┴───────────────────────────┴──────────────────────┘\n```\n\n#### 1. Local (Block) Scope\n- Declared inside a function or a block enclosed by curly braces `{ ... }`.\n- **Visibility:** Accessible only within the enclosing block.\n- **Lifetime:** Allocated on the **Call Stack** when the block is entered; automatically destroyed when the block terminates.\n- **Default Value:** Uninitialized garbage.\n\n#### 2. Global (File) Scope\n- Declared outside of all functions, typically at the top of the file.\n- **Visibility:** Accessible by any function from its point of declaration to the end of the file.\n- **Lifetime:** Allocated in the **Data/BSS segment**; exists continuously throughout the entire lifecycle of the program.\n- **Default Value:** Automatically zero-initialized by the OS loader (`0` for ints, `0.0` for floats, `NULL` for pointers).\n\n#### 3. Variable Shadowing\nIf a local variable has the same identifier name as a global variable, the local variable **shadows** (hides) the global variable within that inner block.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Local Scope, Global Scope & Variable Shadowing",
        "code": "#include <stdio.h>\n\nint global_val = 500; // Global Variable (Data Segment)\n\nvoid demonstrateScope(void) {\n    int local_val = 20; // Local to function\n    printf(\"Inside demonstrateScope: global = %d, local = %d\\n\", global_val, local_val);\n}\n\nint main(void) {\n    int global_val = 99; // Shadows the global variable inside main()\n\n    printf(\"Inside main(): shadowed global_val = %d\\n\", global_val);\n    demonstrateScope();\n\n    { // Nested block\n        int inner_block_val = 777;\n        printf(\"Inner block: %d\\n\", inner_block_val);\n    }\n    // inner_block_val cannot be accessed here (out of scope)\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Scope defines where a variable can be referenced; lifetime defines how long its memory persists. Local variables live in stack frames during block execution; global variables live in data segments throughout program execution.",
      "keyConcepts": [
        "Block / Local Scope",
        "File / Global Scope",
        "Variable Shadowing",
        "Stack vs Data Segment Lifetime"
      ],
      "revisionNotes": "Minimize global variables to prevent accidental side effects and hard-to-trace bugs across large codebases."
    }
  },
  "3-1": {
    "content": "### 3.1 Decision Making using if Statement\n\nControl statements alter the default top-to-bottom sequential flow of program execution based on runtime conditions.\n\n#### The Concept of Truth in C\nUnlike languages with a native boolean type like Java or Python, classic C treats booleans as integers:\n- **Zero (`0`):** Evaluates to **False**.\n- **Any Non-Zero Value (e.g., `1`, `-5`, `100`):** Evaluates to **True**.\n\n#### Syntax of the Simple `if` Statement\n```c\nif (condition) {\n    // Statements executed only when condition is non-zero (true)\n}\n```\n\n#### Execution Flowchart\n```\n       [ Condition ]\n         /       \\\n   True /         \\ False\n       ▼           \\\n [ Code Block ]     ▼\n       \\           /\n        ▼         /\n   [ Continue ] ◄─┘\n```\n\nIf `condition` evaluates to non-zero (true), the block inside the braces executes. If it evaluates to zero (false), the block is bypassed and control jumps directly to the statement following the `if` block.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Simple if Decision Statement",
        "code": "#include <stdio.h>\n\nint main(void) {\n    int marks = 78;\n\n    printf(\"Checking exam status...\\n\");\n    if (marks >= 40) {\n        printf(\"Result: PASSED! Congratulations.\\n\");\n    }\n\n    // Demonstrating C's non-zero truth concept\n    if (-42) {\n        printf(\"Negative numbers evaluate to TRUE in C!\\n\");\n    }\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "The if statement executes a block when its test expression evaluates to non-zero. In C, 0 represents False and any non-zero value represents True.",
      "keyConcepts": [
        "Truth Value in C (0 vs Non-Zero)",
        "Conditional Branching",
        "Control Flow Redirection"
      ],
      "revisionNotes": "Beware of accidental assignment in conditions: `if (x = 5)` assigns 5 to x (always true) instead of comparing `if (x == 5)`."
    }
  },
  "3-2": {
    "content": "### 3.2 Types of if...else Blocks\n\nTo handle alternative decision paths, C provides four primary variations of the `if...else` construct.\n\n#### 1. Simple `if...else`\nExecutes one block if true, and an alternate block if false.\n```c\nif (condition) {\n    // Executed if condition is true\n} else {\n    // Executed if condition is false\n}\n```\n\n#### 2. Nested `if...else`\nAn `if` or `else` statement placed inside the body of another `if` or `else` block.\n```c\nif (age >= 18) {\n    if (has_license) {\n        printf(\"Allowed to drive\\n\");\n    } else {\n        printf(\"Adult, but license required\\n\");\n    }\n}\n```\n\n#### 3. The `else-if` Ladder (Multi-Way Selection)\nEvaluates conditions sequentially from top to bottom. As soon as one condition evaluates to true, its statement block executes and the rest of the ladder is skipped.\n```c\nif (score >= 90) {\n    grade = 'A';\n} else if (score >= 80) {\n    grade = 'B';\n} else if (score >= 70) {\n    grade = 'C';\n} else {\n    grade = 'F';\n}\n```\n\n#### 4. The \"Dangling Else\" Problem\nWhen an `else` follows nested `if` statements without braces, the compiler binds the `else` to the **closest preceding unmatched `if`**:\n```c\nif (x > 0)\n    if (y > 0)\n        printf(\"Both positive\");\nelse // Binds to (y > 0), NOT (x > 0)!\n    printf(\"x is non-positive? (NO, y is <= 0!)\");\n```\n*Always use explicit curly braces `{ ... }` to prevent dangling else logic bugs.*",
    "codeSnippets": [
      {
        "language": "c",
        "title": "else-if Ladder with Grade Classification",
        "code": "#include <stdio.h>\n\nint main(void) {\n    int percentage = 84;\n    char grade;\n\n    if (percentage >= 90) {\n        grade = 'A';\n    } else if (percentage >= 80) {\n        grade = 'B';\n    } else if (percentage >= 70) {\n        grade = 'C';\n    } else if (percentage >= 60) {\n        grade = 'D';\n    } else {\n        grade = 'F';\n    }\n\n    printf(\"Percentage: %d%% -> Assigned Grade: %c\\n\", percentage, grade);\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "if...else variations include simple if-else, nested if-else, and the else-if ladder. Always use curly braces to eliminate the dangling else ambiguity.",
      "keyConcepts": [
        "if-else Syntax",
        "else-if Ladder",
        "Nested Conditions",
        "Dangling Else Ambiguity"
      ],
      "revisionNotes": "An else-if ladder tests conditions sequentially; once a branch matches, subsequent conditions are skipped entirely."
    }
  },
  "3-3": {
    "content": "### 3.3 Switch Case Block\n\nThe **`switch`** statement is a multi-way branch selection control statement that tests whether an integer or character expression matches one of several constant values.\n\n#### Syntax & Structure\n```c\nswitch (expression) {\n    case constant1:\n        // Statements\n        break;\n    case constant2:\n        // Statements\n        break;\n    default:\n        // Fallback statements if no case matches\n        break;\n}\n```\n\n#### Critical Rules of the `switch` Statement\n1. **Expression Type:** The switch expression must evaluate to an **integral type** (`int`, `char`, `short`, `enum`). **Floating-point values (`float`, `double`) and strings are illegal.**\n2. **Case Labels:** Case values must be **constant expressions** or literals (e.g., `case 1:`, `case 'A':`). Variables like `case x:` are not allowed.\n3. **The `break` Statement:** Terminates the `switch` block immediately. If `break` is omitted, execution **falls through** into subsequent case blocks regardless of whether their condition matches!\n4. **The `default` Label:** Optional fallback block that executes when none of the specified cases match. It can be placed anywhere, but is conventionally at the end.\n\n#### Intentional Fall-Through\nFall-through is sometimes used intentionally to share logic across multiple case values:\n```c\nswitch (ch) {\n    case 'a':\n    case 'e':\n    case 'i':\n    case 'o':\n    case 'u':\n        printf(\"Vowel\\n\");\n        break;\n    default:\n        printf(\"Consonant or symbol\\n\");\n}\n```",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Menu-Driven Calculator with Switch Statement",
        "code": "#include <stdio.h>\n\nint main(void) {\n    char operator = '*';\n    double num1 = 12.0, num2 = 4.0;\n    double result = 0.0;\n\n    switch (operator) {\n        case '+':\n            result = num1 + num2;\n            printf(\"%.2f + %.2f = %.2f\\n\", num1, num2, result);\n            break;\n        case '-':\n            result = num1 - num2;\n            printf(\"%.2f - %.2f = %.2f\\n\", num1, num2, result);\n            break;\n        case '*':\n            result = num1 * num2;\n            printf(\"%.2f * %.2f = %.2f\\n\", num1, num2, result);\n            break;\n        case '/':\n            if (num2 != 0) {\n                result = num1 / num2;\n                printf(\"%.2f / %.2f = %.2f\\n\", num1, num2, result);\n            } else {\n                printf(\"Error: Division by zero!\\n\");\n            }\n            break;\n        default:\n            printf(\"Error: Unknown operator '%c'!\\n\", operator);\n            break;\n    }\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "The switch statement handles multi-way branching against integer or character constant cases. Each case must terminate with break to prevent unintended fall-through.",
      "keyConcepts": [
        "Integral / Char Expressions",
        "Case Labels (Constant Literals)",
        "Break Statement & Fall-Through",
        "Default Fallback"
      ],
      "revisionNotes": "Switch statements can be optimized by compilers into O(1) jump tables, making them faster than long else-if chains."
    }
  },
  "3-4": {
    "content": "### 3.4 Arithmetic Expressions\n\nAn **arithmetic expression** is a combination of constants, variable identifiers, and arithmetic operators structured according to C algebraic syntax.\n\n#### Types of Arithmetic Expressions\n1. **Integer Expressions:** Contain solely integer operands. Results are always integers:\n   ```c\n   int result = 15 / 4; // Evaluates to 3 (decimal .75 is truncated)\n   ```\n2. **Floating-Point (Real) Expressions:** Contain floating-point operands. Results retain decimal precision:\n   ```c\n   float result = 15.0f / 4.0f; // Evaluates to 3.75f\n   ```\n3. **Mixed-Mode Expressions:** Contain a mixture of integer and floating-point operands. C automatically promotes integer operands to floating-point representation before computation:\n   ```c\n   double result = 15 / 4.0; // 15 is promoted to 15.0 -> result is 3.75\n   ```\n\n#### Common Arithmetic Formulas in C\n- **Temperature Conversion (C = 5/9(F - 32)):**\n  ```c\n  // WRONG: 5 / 9 performs integer division = 0!\n  celsius = (5 / 9) * (fahrenheit - 32); \n  \n  // CORRECT: Using floating-point literal 5.0 / 9.0\n  celsius = (5.0 / 9.0) * (fahrenheit - 32);\n  ```\n- **Euclidean Distance (\√((x_2 - x_1)^2 + (y_2 - y_1)^2)):**\n  ```c\n  #include <math.h>\n  double dist = sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));\n  ```",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Mixed-Mode Arithmetic Pitfalls & Solutions",
        "code": "#include <stdio.h>\n\nint main(void) {\n    int total_marks = 425;\n    int max_marks = 500;\n\n    // Common Pitfall: integer division yields 0\n    float wrong_pct = (total_marks / max_marks) * 100;\n    \n    // Correct Approach: Explicit type promotion\n    float correct_pct = ((float)total_marks / max_marks) * 100.0f;\n\n    printf(\"Wrong Calculation (integer division):   %.2f%%\\n\", wrong_pct);\n    printf(\"Correct Calculation (floating promotion): %.2f%%\\n\", correct_pct);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Arithmetic expressions can be integer, floating-point, or mixed-mode. In integer division (7 / 2), remainders are truncated. Mixed-mode automatically promotes smaller types to larger types.",
      "keyConcepts": [
        "Integer vs Real Expressions",
        "Truncation in Integer Division",
        "Mixed-Mode Type Promotion",
        "Mathematical Library Functions (<math.h>)"
      ],
      "revisionNotes": "Always write 5.0 / 9.0 rather than 5 / 9 when converting mathematical formulas into C."
    }
  },
  "3-5": {
    "content": "### 3.5 Evaluation of Expressions & Type Conversion\n\nWhen evaluating expressions with multiple data types, C uses **Type Conversion** rules to harmonize operands.\n\n#### 1. Implicit Type Conversion (Type Coercion / Promotion)\nPerformed automatically by the compiler without programmer intervention. Operands are converted upward along the **Type Hierarchy** to prevent data loss:\n\n```\n char / short ──> int ──> unsigned int ──> long ──> unsigned long ──> float ──> double ──> long double\n```\n\n- **Integer Promotion:** In any arithmetic expression, values of type `char` and `short` are automatically promoted to `int`.\n- **Usual Arithmetic Conversions:** If one operand is `double`, the other is converted to `double`.\n\n#### 2. Explicit Type Conversion (Type Casting)\nForced conversion performed explicitly by the programmer using the cast operator `(type_name)`:\n```c\n(type_name) expression;\n```\n- Example: `double avg = (double)sum / count;`\n- Casting prevents integer division truncation or narrows larger types down to smaller types.\n\n#### Danger: Data Loss through Narrowing\nCasting a large data type into a smaller one can cause overflow or data truncation:\n```c\nint large_val = 300;\nchar ch = (char)large_val; // Overflow! A signed char only holds up to 127.\n// 300 % 256 = 44 -> ch becomes ',' (ASCII 44)\n```",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Implicit vs Explicit Casting Demonstration",
        "code": "#include <stdio.h>\n\nint main(void) {\n    char letter = 'A'; // ASCII 65\n    int offset = 5;\n\n    // Implicit Promotion: 'letter' promoted to int 65\n    int combined = letter + offset; \n    printf(\"Character 'A' + 5 = %d (Character '%c')\\n\", combined, (char)combined);\n\n    // Explicit Cast: Precision preservation\n    int a = 17, b = 4;\n    double exact_division = (double)a / b;\n    printf(\"17 / 4 with explicit cast = %.3f\\n\", exact_division);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Implicit conversion (type promotion) widens operands automatically to avoid data loss. Explicit casting (type) manually forces conversions, such as converting int to double for precise division.",
      "keyConcepts": [
        "Type Promotion Hierarchy",
        "Implicit Coercion vs Explicit Casting",
        "Data Narrowing & Overflow Risks"
      ],
      "revisionNotes": "Explicitly cast one operand: `(double)sum / count` forces floating-point division instead of integer truncation."
    }
  },
  "3-6": {
    "content": "### 3.6 GOTO Statement in 'C'\n\nThe **`goto`** statement is an unconditional jump statement that transfers program control directly to a labeled statement within the same function.\n\n#### Syntax & Structure\n```c\ngoto label_name;\n...\nlabel_name:\n    // Destination statements executed after the jump\n```\n\n#### Why `goto` is Strongly Discouraged in General Programming\nIn 1968, computer scientist Edsger W. Dijkstra published the classic paper *\"Go To Statement Considered Harmful\"*.\n- **Spaghetti Code:** Unconstrained `goto` jumps make program flow erratic and impossible to trace, debug, or verify formally.\n- **Breaks Structured Design:** Bypasses initialization logic and loop invariants.\n- **Better Alternatives:** Modern control structures (`for`, `while`, `break`, `continue`, functions) eliminate the need for `goto` in 99% of tasks.\n\n#### The Legitimate Systems Programming Exception: Error Cleanup\nIn low-level systems programming (e.g., the Linux Kernel), `goto` is used as an idiomatic pattern for **centralized resource cleanup** to prevent memory and file descriptor leaks across deeply nested operations:\n```c\nint init_device() {\n    if (!alloc_mem()) goto err_mem;\n    if (!open_port()) goto err_port;\n    if (!start_timer()) goto err_timer;\n    return 0; // Success\n\nerr_timer:\n    close_port();\nerr_port:\n    free_mem();\nerr_mem:\n    return -1; // Failure\n}\n```",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Idiomatic Resource Cleanup Pattern using goto",
        "code": "#include <stdio.h>\n#include <stdlib.h>\n\nint processResources(void) {\n    int *buffer = (int*)malloc(100 * sizeof(int));\n    if (!buffer) {\n        printf(\"Error: Memory allocation failed.\\n\");\n        return -1;\n    }\n\n    FILE *fp = fopen(\"sample.txt\", \"w\");\n    if (!fp) {\n        printf(\"Error: File opening failed.\\n\");\n        goto cleanup_buffer; // Centralized cleanup\n    }\n\n    fprintf(fp, \"HiGen Systems: Data written successfully.\\n\");\n    printf(\"Work finished cleanly.\\n\");\n\n    fclose(fp);\ncleanup_buffer:\n    free(buffer);\n    printf(\"Allocated buffer released.\\n\");\n    return 0;\n}\n\nint main(void) {\n    processResources();\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "goto performs unconditional jumps to named labels. While generally avoided due to creating 'spaghetti code', it is an accepted idiom in systems code for centralized error cleanup.",
      "keyConcepts": [
        "Unconditional Jumping",
        "Labeled Statements",
        "Spaghetti Code Hazards",
        "Linux Kernel Cleanup Idiom"
      ],
      "revisionNotes": "Never use goto across functions (which is illegal in C anyway) or to simulate basic loops."
    }
  },
  "4-1": {
    "content": "### 4.1 Concept of Loop\n\nA **loop** is a control structure that repeatedly executes a block of code as long as a specified test condition evaluates to non-zero (true).\n\n#### Why Loops are Fundamental\nWithout loops, performing an operation 1,000 times would require manually duplicating 1,000 identical lines of code. Loops provide:\n1. **Code Reusability:** Execute the same algorithm across changing data values.\n2. **Dynamic Automation:** Terminate automatically when target data conditions or sentinel inputs are reached.\n3. **Memory & Size Efficiency:** Compact code binaries with minimal instruction footprints.\n\n#### Anatomy of a Loop\nEvery loop in C involves four essential components:\n1. **Initialization:** Setting the initial value of the loop control variable (counter).\n2. **Test Condition:** Evaluating whether the loop body should execute or terminate.\n3. **Loop Body:** The statements executed repeatedly during each iteration.\n4. **Update / Step Expression:** Modifying (incrementing/decrementing) the loop control variable so the condition eventually becomes false.\n\n```\n       [ Initialization: i = 0 ]\n                   │\n                   ▼\n       ┌──► [ Test Condition: i < N ]\n       │           │\n       │    True   ▼          False\n       │     [ Loop Body ] ──────────► [ Exit Loop ]\n       │           │\n       │           ▼\n       └─── [ Update: i++ ]\n```\n\n#### Loop Classification: Entry-Controlled vs. Exit-Controlled\n- **Entry-Controlled Loops (`for`, `while`):** The condition is evaluated **before** executing the loop body. If the condition is false initially, the body does not execute at all.\n- **Exit-Controlled Loops (`do-while`):** The condition is evaluated **after** the loop body executes. The body is guaranteed to execute at least once.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Basic Loop Iteration Anatomy",
        "code": "#include <stdio.h>\n\nint main(void) {\n    int counter = 1; // 1. Initialization\n\n    printf(\"Starting loop sequence:\\n\");\n    while (counter <= 5) { // 2. Test Condition\n        printf(\"Iteration #%d: Working on data\\n\", counter); // 3. Loop Body\n        counter++; // 4. Update expression\n    }\n    printf(\"Loop terminated. Final counter = %d\\n\", counter);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Loops repeat code blocks while a condition remains true. They require Initialization, Condition testing, Body execution, and an Update step. They are classified as Entry-controlled (for, while) or Exit-controlled (do-while).",
      "keyConcepts": [
        "Loop Lifecycle (Init, Condition, Body, Update)",
        "Entry-Controlled vs Exit-Controlled",
        "Loop Termination Invariants"
      ],
      "revisionNotes": "Always verify that the loop control variable changes inside the loop body, otherwise the loop will run infinitely."
    }
  },
  "4-2": {
    "content": "### 4.2 The For Loop in 'C'\n\nThe **`for` loop** is an entry-controlled iterative structure that packages initialization, condition checking, and loop updating into a single, compact statement line.\n\n#### Syntax & Execution Flow\n```c\nfor (initialization; test_condition; update_expression) {\n    // Body of loop\n}\n```\n\n#### Step-by-Step Execution Sequence\n1. **Initialization:** Executes once when the loop starts.\n2. **Condition Test:** Evaluated before every iteration. If true, proceed to step 3; if false, exit the loop.\n3. **Body Execution:** Executes all statements inside `{ ... }`.\n4. **Update Expression:** Increments or decrements the counter.\n5. **Repeat:** Control jumps back to step 2.\n\n#### Advanced Features of the C `for` Loop\n- **Multiple Loop Variables:** You can initialize and update multiple variables using the comma operator:\n  ```c\n  for (int i = 0, j = 10; i < j; i++, j--) {\n      printf(\"i=%d, j=%d\\n\", i, j);\n  }\n  ```\n- **Optional Expressions:** Any of the three expressions may be omitted:\n  ```c\n  int i = 0;\n  for (; i < 5;) { // Valid: acts like while loop\n      i++;\n  }\n  ```\n- **The Infinite Loop:** Leaving the condition blank evaluates to non-zero (true):\n  ```c\n  for (;;) {\n      // Runs indefinitely until break or exit\n  }\n  ```",
    "codeSnippets": [
      {
        "language": "c",
        "title": "For Loop Variations & Factorial Calculation",
        "code": "#include <stdio.h>\n\nint main(void) {\n    int n = 6;\n    long long factorial = 1;\n\n    // Standard incrementing loop\n    for (int i = 1; i <= n; i++) {\n        factorial *= i;\n    }\n    printf(\"Factorial of %d = %lld\\n\", n, factorial);\n\n    // Multi-variable parallel countdown loop\n    printf(\"\\nTwo-pointer convergence demo:\\n\");\n    for (int left = 0, right = 6; left <= right; left++, right--) {\n        printf(\"Left Index: %d <---> Right Index: %d\\n\", left, right);\n    }\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "The for loop bundles initialization, condition, and update in one header. It is ideal for counter-driven iterations where the number of repetitions is known in advance.",
      "keyConcepts": [
        "For Loop Syntax",
        "Execution Lifecycle",
        "Comma Operator in Loops",
        "Infinite Loop (for(;;))"
      ],
      "revisionNotes": "Since C99, loop counters can be declared directly inside the for header: `for (int i = 0; i < n; i++)`."
    }
  },
  "4-3": {
    "content": "### 4.3 The While Loop in 'C'\n\nThe **`while` loop** is an entry-controlled loop that repeats statements as long as its condition remains true. It is preferred when the **exact number of iterations is unknown** prior to starting the loop (e.g., reading until End of File or awaiting user input).\n\n#### Syntax & Structure\n```c\nwhile (condition) {\n    // Body statements\n    // Must update variables affecting condition!\n}\n```\n\n#### Execution Flow\n```\n       [ Condition ]\n         /       \\\n   True /         \\ False\n       ▼           \\\n [ Loop Body ]      ▼\n       │      [ Exit Loop ]\n       └───────► (Re-test)\n```\n\n#### Key Characteristics\n1. **Pre-Test Evaluation:** If the condition evaluates to `0` (false) on the very first check, the body is never executed.\n2. **Sentinel-Controlled Iteration:** Commonly used to process streams until a sentinel stop-value (such as `-1` or `EOF`) is encountered.\n3. **Common Pitfall — Accidental Semicolon:**\n   ```c\n   int i = 0;\n   while (i < 5); // Empty statement! Infinite loop spins forever\n   {\n       i++;\n   }\n   ```",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Reversing a Number using While Loop",
        "code": "#include <stdio.h>\n\nint main(void) {\n    int number = 98452;\n    int reversed = 0;\n    int temp = number;\n\n    // Loop continues until all digits are extracted\n    while (temp > 0) {\n        int remainder = temp % 10;          // Extract last digit\n        reversed = (reversed * 10) + remainder; // Append to reversed\n        temp /= 10;                         // Drop last digit\n    }\n\n    printf(\"Original Number: %d\\n\", number);\n    printf(\"Reversed Number: %d\\n\", reversed);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "The while loop tests its condition prior to executing the loop body. It is ideal for event-driven or sentinel-driven loops where the iteration count depends on dynamic runtime conditions.",
      "keyConcepts": [
        "Entry-Controlled Looping",
        "Sentinel-Controlled Loops",
        "Digit Manipulation Algorithms",
        "Trailing Semicolon Hazard"
      ],
      "revisionNotes": "Never put a semicolon immediately after the while condition: `while (x < 10);` creates an empty infinite loop."
    }
  },
  "4-4": {
    "content": "### 4.4 The Do While Loop in 'C'\n\nThe **`do-while` loop** is an **exit-controlled** iterative structure where the condition is evaluated after the loop body executes.\n\n#### Syntax & Structure\n```c\ndo {\n    // Statements executed at least once\n} while (condition); // Note the mandatory trailing semicolon!\n```\n\n#### Critical Difference: `while` vs. `do-while`\n| Feature | `while` Loop | `do-while` Loop |\n| :--- | :--- | :--- |\n| **Control Type** | Entry-controlled (pre-test) | Exit-controlled (post-test) |\n| **Minimum Iterations** | **0 times** (if initial condition is false) | **1 time** (guaranteed execution) |\n| **Semicolon Usage** | No semicolon after condition | Mandatory semicolon after `while(cond);` |\n| **Primary Use Case** | Data processing, stream parsing | Interactive menus, input validation |\n\n#### Primary Use Cases\n1. **Menu-Driven Interfaces:** Displaying an interactive console menu and awaiting user choice at least once.\n2. **Input Validation:** Forcing the user to enter data until valid bounds are satisfied:\n   ```c\n   int age;\n   do {\n       printf(\"Enter valid age (1-120): \");\n       scanf(\"%d\", &age);\n   } while (age < 1 || age > 120);\n   ```",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Menu-Driven Console Loop using do-while",
        "code": "#include <stdio.h>\n\nint main(void) {\n    int choice = 0;\n\n    do {\n        printf(\"\\n--- SYSTEM CONSOLE MENU ---\\n\");\n        printf(\"1. Check Server Status\\n\");\n        printf(\"2. Clear Memory Cache\\n\");\n        printf(\"3. Exit Console\\n\");\n        printf(\"Select option (1-3): \");\n        \n        // Simulating user input: option 3 to exit\n        choice = 3; \n        printf(\"%d\\n\", choice);\n\n        switch (choice) {\n            case 1: printf(\"-> Server: ONLINE, Latency: 12ms\\n\"); break;\n            case 2: printf(\"-> Cache cleared successfully.\\n\"); break;\n            case 3: printf(\"-> Exiting application... Goodbye!\\n\"); break;\n            default: printf(\"-> Invalid choice! Try again.\\n\"); break;\n        }\n    } while (choice != 3);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "The do-while loop is an exit-controlled loop that guarantees at least one execution of its body because condition evaluation happens at the bottom. A trailing semicolon is mandatory.",
      "keyConcepts": [
        "Exit-Controlled Logic",
        "Guaranteed Single Execution",
        "Menu-Driven Architecture",
        "Input Validation Loops"
      ],
      "revisionNotes": "Always remember the closing semicolon: `do { ... } while (condition);`. Omitting it causes a syntax compilation error."
    }
  },
  "4-5": {
    "content": "### 4.5 Jumping and Nested Loops in 'C'\n\nA **nested loop** occurs when one loop is placed inside the body of another loop. Nested loops are fundamental for traversing multi-dimensional structures such as 2D matrices, grids, and image pixels.\n\n#### Execution Mechanics\nFor each single iteration of the **outer loop**, the entire **inner loop** runs from start to completion.\n- If the outer loop runs M times and the inner loop runs N times, the inner loop body executes M \× N total times.\n\n```\n Outer Loop (i = 0 to M-1)\n    └── Inner Loop (j = 0 to N-1)\n           └── Executes M * N times total\n```\n\n#### Multi-Loop Jumping\n- In standard C, the `break` statement breaks out of only the **innermost enclosing loop**.\n- To break completely out of two or three deeply nested loops at once, developers use either a **boolean flag** or an explicit **`goto exit_label;`**.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Nested Loops: Printing Multiplication Table & Pattern",
        "code": "#include <stdio.h>\n\nint main(void) {\n    int rows = 4, cols = 4;\n\n    printf(\"--- 4x4 Coordinate Matrix ---\\n\");\n    for (int i = 1; i <= rows; i++) {\n        for (int j = 1; j <= cols; j++) {\n            printf(\"(%d,%d) \", i, j);\n        }\n        printf(\"\\n\"); // Newline after each row\n    }\n\n    printf(\"\\n--- Half-Pyramid Asterisk Pattern ---\\n\");\n    for (int r = 1; r <= 5; r++) {\n        for (int c = 1; c <= r; c++) {\n            printf(\"* \");\n        }\n        printf(\"\\n\");\n    }\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Nested loops contain an inner loop inside an outer loop, executing M * N times total. They are essential for 2D matrices and pattern generation.",
      "keyConcepts": [
        "Nested Iteration Flow",
        "Matrix Coordinate Traversal",
        "Inner vs Outer Loop Indices",
        "Total Iteration Complexity O(N^2)"
      ],
      "revisionNotes": "Keep nested loops within 2-3 levels; deeper nesting dramatically increases time complexity and degrades readability."
    }
  },
  "4-6": {
    "content": "### 4.6 Break and Continue Statements\n\nC provides two jump statements specifically designed to control and alter loop execution: **`break`** and **`continue`**.\n\n#### 1. The `break` Statement\n- Immediately **terminates** the loop or switch block in which it appears.\n- Program control jumps to the statement directly following the terminated loop.\n- **Use Case:** Early exit upon finding a target element during a search.\n\n#### 2. The `continue` Statement\n- **Skips the remainder** of the current loop iteration.\n- Control jumps directly to the **next iteration's condition test** (in `while`/`do-while`) or the **update step** (in `for`).\n- **Use Case:** Filtering out unwanted elements or skipping error states without exiting the loop.\n\n#### Comparison: `break` vs. `continue`\n| Feature | `break` | `continue` |\n| :--- | :--- | :--- |\n| **Effect on Loop** | Permanently terminates the loop | Skips current iteration only |\n| **Next Action** | Control jumps outside the loop | Control jumps to the next cycle |\n| **Switch Usage** | Valid inside loops and switch blocks | Valid **only inside loops** (illegal in switch) |",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Break vs Continue in Action",
        "code": "#include <stdio.h>\n\nint main(void) {\n    printf(\"--- Demonstrating continue (Skipping even numbers) ---\\n\");\n    for (int i = 1; i <= 8; i++) {\n        if (i % 2 == 0) {\n            continue; // Skip rest of body for even numbers\n        }\n        printf(\"Odd number: %d\\n\", i);\n    }\n\n    printf(\"\\n--- Demonstrating break (Search & Early Exit) ---\\n\");\n    int target = 4;\n    for (int i = 1; i <= 10; i++) {\n        if (i == target) {\n            printf(\"Found target %d! Terminating search loop.\\n\", target);\n            break; // Stop immediately\n        }\n        printf(\"Scanning element %d...\\n\", i);\n    }\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "break immediately terminates loop execution and jumps out. continue skips the remainder of the current cycle and begins the next iteration. break works in loops and switches; continue works only in loops.",
      "keyConcepts": [
        "break (Loop Termination)",
        "continue (Iteration Skipping)",
        "Search Optimization",
        "Filtering Logic"
      ],
      "revisionNotes": "Using continue in a while loop requires caution: ensure the counter update happens before continue, otherwise an infinite loop results."
    }
  },
  "5-1": {
    "content": "### 5.1 Introduction to Arrays\n\nAn **array** is a derived data structure that stores a fixed-size sequential collection of elements of the **same data type** in **contiguous memory locations**.\n\n#### Why Arrays are Needed\nIf you need to track the exam scores of 100 students, creating 100 individual variables (`score1`, `score2`, ..., `score100`) is unmanageable. An array allows you to store all 100 scores under a single name (`scores[100]`) and access each through an index.\n\n#### Core Characteristics of C Arrays\n1. **Homogeneous:** Every element in the array has identical data type and byte size.\n2. **Contiguous Memory:** Elements reside directly adjacent to one another in physical RAM without gaps.\n3. **Zero-Based Indexing:** The first element is at index `0`, and the last element of an array of size N is at index N-1.\n4. **Direct O(1) Random Access:** Any element can be read or written instantly using its index.\n5. **Fixed Size:** Array bounds must be determined at compile time (or stack allocation time) and cannot grow or shrink dynamically.\n\n#### Memory Mapping Formula\nBecause elements are contiguous, the memory address of any element at index i is calculated directly by the hardware:\n\Address of  arr[i] = \Base Address + (i \× \sizeof(\Data Type))\n\n```\n Array: int arr[4] = {10, 20, 30, 40}; (assuming 4 bytes per int)\n\n Index:         [0]            [1]            [2]            [3]\n Value:       │  10   │      │  20   │      │  30   │      │  40   │\n Address:     0x1000         0x1004         0x1008         0x100C\n              Base Address   Base + 1*4     Base + 2*4     Base + 3*4\n```",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Array Memory Contiguity Inspection",
        "code": "#include <stdio.h>\n\nint main(void) {\n    int arr[4] = {10, 20, 30, 40};\n\n    printf(\"Array base address (arr): %p\\n\", (void*)arr);\n    printf(\"----------------------------------------\\n\");\n    for (int i = 0; i < 4; i++) {\n        printf(\"arr[%d]: Value = %d | Address = %p (Offset: +%zu bytes)\\n\", \n               i, arr[i], (void*)&arr[i], (char*)&arr[i] - (char*)&arr[0]);\n    }\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "An array is a fixed-size, contiguous collection of homogeneous elements. Elements are accessed in O(1) time via zero-based indexing calculated as: Base + i * sizeof(type).",
      "keyConcepts": [
        "Homogeneous Elements",
        "Contiguous RAM Layout",
        "Zero-Based Indexing",
        "Base Address Calculation"
      ],
      "revisionNotes": "In C, arrays do not perform bounds checking; accessing arr[10] in an array of size 5 causes undefined behavior or segmentation fault."
    }
  },
  "5-2": {
    "content": "### 5.2 One-Dimensional Arrays\n\nA **one-dimensional (1D) array** represents a linear list of elements stored sequentially.\n\n#### 1. Declaration and Initialization Syntax\n```c\n// Declaration without initialization (contains garbage values)\nint numbers[5]; \n\n// Complete initialization\nint scores[5] = {88, 92, 79, 95, 84};\n\n// Partial initialization (remaining elements default to 0)\nint primes[5] = {2, 3}; // Contains {2, 3, 0, 0, 0}\n\n// Universal zero initialization\nint zeros[100] = {0}; // All 100 elements initialized to 0\n\n// Inferred size from initializer list\nint grades[] = {10, 20, 30}; // Compiler automatically allocates size 3\n```\n\n#### 2. Determining Array Size in C\nIn C, arrays do not store their length metadata. You calculate the number of elements using `sizeof`:\n```c\nint length = sizeof(arr) / sizeof(arr[0]);\n```\n\n#### 3. Common Array Operations\n- **Traversal:** Iterating through elements using a `for` loop from index `0` to `length - 1`.\n- **Search (Linear Search):** Checking each element sequentially until the target is found (O(n)).\n- **Extremes:** Tracking minimum and maximum values across the dataset.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "1D Array Processing: Average, Max, and Min",
        "code": "#include <stdio.h>\n\nint main(void) {\n    int temperatures[] = {32, 28, 35, 30, 26, 33, 29};\n    int n = sizeof(temperatures) / sizeof(temperatures[0]);\n\n    int sum = 0;\n    int max = temperatures[0];\n    int min = temperatures[0];\n\n    for (int i = 0; i < n; i++) {\n        sum += temperatures[i];\n        if (temperatures[i] > max) max = temperatures[i];\n        if (temperatures[i] < min) min = temperatures[i];\n    }\n\n    double average = (double)sum / n;\n\n    printf(\"Dataset Size: %d readings\\n\", n);\n    printf(\"Max Temp:     %d C\\n\", max);\n    printf(\"Min Temp:     %d C\\n\", min);\n    printf(\"Average Temp: %.2f C\\n\", average);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "1D arrays store linear sequences of elements. Array length is calculated as sizeof(arr) / sizeof(arr[0]). Common operations include traversal, search, and computing aggregate metrics.",
      "keyConcepts": [
        "Array Declaration & Initializers",
        "Zero-Initialization ({0})",
        "Array Length Idiom via sizeof",
        "Linear Traversal"
      ],
      "revisionNotes": "When passing an array to a function, it decays into a pointer. Always pass the array length as a separate parameter."
    }
  },
  "5-3": {
    "content": "### 5.3 Two-Dimensional Arrays (Matrices)\n\nA **two-dimensional (2D) array** organizes data into a table of **rows** and **columns**, commonly used for matrices, game boards (chess, tic-tac-toe), and image pixels.\n\n#### Declaration & Initialization\n```c\nint matrix[rows][columns];\n```\n```c\n// Explicit row-by-row initialization\nint grid[2][3] = {\n    {1, 2, 3},  // Row 0\n    {4, 5, 6}   // Row 1\n};\n```\n\n#### Physical Memory Representation: Row-Major Order\nWhile humans visualize a 2D array as a grid, physical RAM is strictly a 1D sequence of byte addresses. C stores 2D arrays in **Row-Major Order**:\n- The entirety of Row 0 is stored first, followed immediately by Row 1, Row 2, etc.\n\n```\n Grid Visualization:\n         Col 0   Col 1   Col 2\n Row 0: [ 10  ,   20  ,   30  ]\n Row 1: [ 40  ,   50  ,   60  ]\n\n Memory Layout in RAM (Linear):\n [10] [20] [30] [40] [50] [60]\n └─────Row 0───┘ └─────Row 1───┘\n```\n\n#### Address Formula in Row-Major Order\n\Address(arr[i][j]) = \Base + ((i \× \Cols) + j) \× \sizeof(\Type)",
    "codeSnippets": [
      {
        "language": "c",
        "title": "2D Matrix Addition and Transpose",
        "code": "#include <stdio.h>\n\n#define ROWS 2\n#define COLS 3\n\nint main(void) {\n    int A[ROWS][COLS] = { {1, 2, 3}, {4, 5, 6} };\n    int B[ROWS][COLS] = { {7, 8, 9}, {3, 2, 1} };\n    int Sum[ROWS][COLS];\n\n    printf(\"Matrix Addition (A + B):\\n\");\n    for (int i = 0; i < ROWS; i++) {\n        for (int j = 0; j < COLS; j++) {\n            Sum[i][j] = A[i][j] + B[i][j];\n            printf(\"%3d \", Sum[i][j]);\n        }\n        printf(\"\\n\");\n    }\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "A 2D array represents rows and columns stored in linear RAM via Row-Major Order. Accessing element arr[i][j] uses the offset: (i * Cols + j) * sizeof(Type).",
      "keyConcepts": [
        "Row-Major Ordering",
        "Matrix Declarations",
        "Nested Loop Traversal",
        "Coordinate Indexing [row][col]"
      ],
      "revisionNotes": "When passing 2D arrays to functions, the column dimension must be specified: `void printMatrix(int arr[][3], int rows)`."
    }
  },
  "5-4": {
    "content": "### 5.4 Multidimensional Arrays\n\nA **multidimensional array** extends array indexing to three or more dimensions. In C, an array can have an arbitrary number of dimensions, bounded only by available system memory.\n\n#### 3D Arrays: Tensors and Depth Grids\nA 3D array is conceptually an **array of 2D arrays** (Blocks \× Rows \× Columns):\n```c\nint tensor[BLOCKS][ROWS][COLS];\n```\n\n#### Visualizing a 3D Array\nThink of a 3D array as a book:\n- Dimension 1 (Blocks / Pages): Which page in the book.\n- Dimension 2 (Rows): Which line on that page.\n- Dimension 3 (Columns): Which word on that line.\n\n```\n Block 0:             Block 1:\n [1, 2] [3, 4]        [5, 6] [7, 8]\n```\n\n#### Real-World Applications\n1. **3D Computer Graphics:** Storing voxel data or 3D vector coordinates (x, y, z).\n2. **Color Digital Images:** Height \× Width \× Color Channels (RGB: 3 channels).\n3. **Time-Series Sensor Grids:** Time-step \× Sensor-Row \× Sensor-Column.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "3D Array Traversal (Blocks, Rows, Cols)",
        "code": "#include <stdio.h>\n\n#define LAYERS 2\n#define ROWS 2\n#define COLS 3\n\nint main(void) {\n    int space[LAYERS][ROWS][COLS] = {\n        { // Layer 0\n            {10, 20, 30},\n            {40, 50, 60}\n        },\n        { // Layer 1\n            {70, 80, 90},\n            {15, 25, 35}\n        }\n    };\n\n    printf(\"Traversing 3D Space (2x2x3):\\n\");\n    for (int l = 0; l < LAYERS; l++) {\n        printf(\"--- Layer %d ---\\n\", l);\n        for (int r = 0; r < ROWS; r++) {\n            for (int c = 0; c < COLS; c++) {\n                printf(\"%2d \", space[l][r][c]);\n            }\n            printf(\"\\n\");\n        }\n    }\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Multidimensional arrays extend indexing to 3 or more dimensions (e.g. Layers x Rows x Cols). They are stored sequentially in memory and traversed using corresponding nested loops.",
      "keyConcepts": [
        "3D Array Visualization (Layers/Rows/Cols)",
        "Linearized Tensor Storage",
        "Triple Nested Loops"
      ],
      "revisionNotes": "Memory consumed by multidimensional arrays multiplies rapidly: int arr[100][100][100] consumes 4 MB of RAM."
    }
  },
  "5-5": {
    "content": "### 5.5 Dynamic Arrays in 'C'\n\nStatic arrays declared as `int arr[100];` reside in the **Call Stack** with fixed sizes fixed at compile time. This leads to two critical problems:\n1. **Under-allocation:** The array is too small for large user inputs, causing buffer overflows.\n2. **Over-allocation:** Memory is wasted when only a few elements are used.\n\n#### Dynamic Array Solution (Heap Memory)\nA **dynamic array** is allocated in the **Heap segment** at runtime using pointers and standard allocation functions (`malloc`, `calloc`, `realloc`).\n\n```\n Stack                  Heap Memory\n┌───────────┐          ┌───────────────┬───────────────┬───────────────┐\n│ int *arr  │ ───────► │ arr[0] (int)  │ arr[1] (int)  │ arr[2] (int)  │\n└───────────┘          └───────────────┴───────────────┴───────────────┘\n Pointer holds address  Contiguous block allocated at runtime\n```\n\n#### Lifecycle of a Dynamic Array\n1. **Allocation (`malloc` / `calloc`):**\n   ```c\n   int *arr = (int*)malloc(n * sizeof(int));\n   ```\n2. **Access:** Use standard array indexing syntax (`arr[i]`).\n3. **Resizing (`realloc`):** Expand or shrink capacity dynamically as needed.\n4. **Deallocation (`free`):** Return heap memory back to the operating system to prevent **memory leaks**.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Creating and Resizing a Dynamic Array with realloc",
        "code": "#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int initial_size = 3;\n    int *arr = (int*)malloc(initial_size * sizeof(int));\n\n    if (arr == NULL) {\n        fprintf(stderr, \"Error: Memory allocation failed!\\n\");\n        return 1;\n    }\n\n    // Populate initial 3 items\n    for (int i = 0; i < initial_size; i++) {\n        arr[i] = (i + 1) * 10;\n    }\n\n    // Resize array from 3 elements to 5 elements\n    int new_size = 5;\n    int *temp = (int*)realloc(arr, new_size * sizeof(int));\n    if (temp != NULL) {\n        arr = temp;\n        arr[3] = 40;\n        arr[4] = 50;\n    }\n\n    printf(\"Dynamic array contents after resize:\\n\");\n    for (int i = 0; i < new_size; i++) {\n        printf(\"arr[%d] = %d\\n\", i, arr[i]);\n    }\n\n    // Mandatory deallocation\n    free(arr);\n    arr = NULL; // Guard against dangling pointer\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Dynamic arrays are allocated on the heap at runtime via malloc/calloc and resized with realloc. They must be freed explicitly using free() to prevent memory leaks.",
      "keyConcepts": [
        "Stack vs Heap Allocation",
        "malloc / calloc / realloc",
        "free() & Memory Deallocation",
        "Dangling Pointer Guard (NULL)"
      ],
      "revisionNotes": "Always assign pointers to NULL after calling free(ptr) to prevent accidental dangling pointer dereferencing."
    }
  },
  "5-6": {
    "content": "### 5.6 Implementing String Variables in 'C'\n\nUnlike modern languages with a built-in `string` object, C has **no primitive string type**. In C, a **string** is implemented as a **one-dimensional array of characters terminated by a null character (`'\\0'`)**.\n\n#### The Null Terminator (`'\\0'`)\nThe null character has an ASCII value of `0`. It serves as a sentinel marker informing library functions (like `printf`, `strlen`) where the string text ends in memory.\n- To store a string of length N, the character array must be sized at least N + 1 to accommodate the trailing `'\\0'`.\n\n```\n Storing \"HiGen\" in memory:\n Index:    [0]   [1]   [2]   [3]   [4]   [5]\n Char:    'H'   'i'   'G'   'e'   'n'   '\\0'\n ASCII:    72    105   71    101   110    0\n```\n\n#### String Declaration Methods\n1. **Character Array (Mutable):**\n   ```c\n   char name[] = \"Dennis\"; // Allocated on Stack, can modify name[0] = 'd'\n   ```\n2. **String Pointer to Literal (Immutable / Read-Only):**\n   ```c\n   const char *title = \"HiGen LMS\"; // Stored in Read-Only Data Segment (.rodata)\n   ```\n\n#### String Input: `scanf` vs. `fgets`\n- **`scanf(\"%s\", str)`:** Unsafe! Stops reading at whitespace and does not check buffer limits, making it prone to buffer overflows.\n- **`fgets(str, sizeof(str), stdin)`:** Safe and recommended! Reads whitespace and strictly bounds input to the array buffer size.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Safe String Handling: Array vs Pointer and fgets",
        "code": "#include <stdio.h>\n\nint main(void) {\n    // Array string (mutable stack storage)\n    char greeting[20] = \"Hello, World!\";\n    greeting[7] = 'C'; // Modify in-place\n    printf(\"Modified array string: %s\\n\", greeting);\n\n    // Manual character iteration until null terminator\n    printf(\"Iterating characters: \");\n    for (int i = 0; greeting[i] != '\\0'; i++) {\n        printf(\"[%c]\", greeting[i]);\n    }\n    printf(\"\\n\");\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "A string in C is a null-terminated ('\\0') character array. Always allocate size N + 1 for length N. Prefer fgets() over scanf() for safe, bound-checked string input.",
      "keyConcepts": [
        "Null Terminator ('\\0', ASCII 0)",
        "String Size Requirement (N + 1)",
        "Array vs String Literal Pointers",
        "Safe Input with fgets()"
      ],
      "revisionNotes": "Never attempt to mutate a string literal pointer: `char *s = \"hello\"; s[0] = 'H';` crashes with a Segmentation Fault."
    }
  },
  "5-7": {
    "content": "### 5.7 String Handling Library Functions (`<string.h>`)\n\nThe C standard library header **`<string.h>`** provides a rich suite of optimized functions for manipulating null-terminated strings.\n\n#### Core `<string.h>` Functions\n| Function Prototype | Description |\n| :--- | :--- |\n| `size_t strlen(const char *s)` | Returns character count excluding the trailing `'\\0'` |\n| `char* strcpy(char *dest, const char *src)` | Copies string `src` into buffer `dest` (including `'\\0'`) |\n| `char* strncpy(char *dest, const char *src, size_t n)` | Bounds-checked copy of up to `n` characters |\n| `char* strcat(char *dest, const char *src)` | Concatenates `src` onto the end of `dest` |\n| `char* strncat(char *dest, const char *src, size_t n)` | Bounds-checked concatenation of up to `n` characters |\n| `int strcmp(const char *s1, const char *s2)` | Lexicographically compares two strings |\n| `char* strchr(const char *s, int c)` | Finds first occurrence of character `c` in string |\n| `char* strstr(const char *haystack, const char *needle)` | Locates first occurrence of substring in string |\n\n#### Understanding `strcmp` Return Values\n`strcmp(str1, str2)` compares strings character by character by ASCII value:\n- Returns **`0`**: `str1` and `str2` are completely identical.\n- Returns **`< 0` (negative)**: `str1` is lexicographically smaller than `str2`.\n- Returns **`> 0` (positive)**: `str1` is lexicographically greater than `str2`.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Comprehensive String Manipulation Suite",
        "code": "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char first[50] = \"HiGen\";\n    char second[] = \" Labs\";\n\n    // 1. Length calculation (excluding null terminator)\n    printf(\"Length of first: %zu\\n\", strlen(first));\n\n    // 2. Concatenation\n    strcat(first, second);\n    printf(\"Concatenated:    %s\\n\", first);\n\n    // 3. String Comparison\n    if (strcmp(first, \"HiGen Labs\") == 0) {\n        printf(\"Comparison: Strings are identical!\\n\");\n    }\n\n    // 4. Substring Search\n    char *sub = strstr(first, \"Labs\");\n    if (sub != NULL) {\n        printf(\"Substring 'Labs' found at index: %ld\\n\", sub - first);\n    }\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "<string.h> provides essential string utilities: strlen for length, strcpy/strncpy for copying, strcat/strncat for concatenation, strcmp for comparison, and strstr for substring searching.",
      "keyConcepts": [
        "strlen vs sizeof",
        "strcpy vs strncpy (Buffer Safety)",
        "strcat Concatenation",
        "strcmp Lexicographical Comparison",
        "strstr Substring Search"
      ],
      "revisionNotes": "Always ensure the destination buffer has enough allocated capacity before calling strcat or strcpy to avoid buffer overflows."
    }
  },
  "6-1": {
    "content": "### 6.1 Concept of Function in 'C'\n\nA **function** is a self-contained block of statements designed to perform a specific, well-defined task. Functions form the backbone of **modular, procedural programming** in C.\n\n#### The Philosophy of Modular Programming\nRather than writing an entire software system in one monolithic `main()` block, programs are decomposed into smaller sub-tasks.\n1. **Divide and Conquer:** Large complex problems are broken down into manageable subroutines.\n2. **Code Reusability:** Write once, invoke many times from anywhere in the codebase.\n3. **Maintainability & Testing:** Functions can be isolated, tested, and debugged independently.\n4. **Information Hiding:** Functions expose what they accomplish through their interface (prototype), hiding internal complexity.\n\n#### How Function Calls Work: The Call Stack\nWhen a function is called, the CPU creates a new **Activation Record (Stack Frame)** on the **Call Stack**:\n1. It pushes function arguments onto the stack.\n2. It pushes the **Return Address** (the instruction pointer to resume after completion).\n3. It allocates memory for local variables.\n4. When the function returns, its stack frame is popped, and execution resumes at the caller's return address.\n\n```\n   Top of Stack:\n  ┌──────────────────────────────────┐\n  │ Stack Frame: calculateSquare()   │ ◄── Active Function\n  ├──────────────────────────────────┤\n  │ Stack Frame: processData()       │\n  ├──────────────────────────────────┤\n  │ Stack Frame: main()              │ ◄── Base Function\n  └──────────────────────────────────┘\n```",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Modular Function Invocation & Call Stack",
        "code": "#include <stdio.h>\n\nint multiply(int a, int b) {\n    return a * b; // Pops stack frame and returns result\n}\n\nint calculateArea(int width, int height) {\n    return multiply(width, height); // Nested function call\n}\n\nint main(void) {\n    int w = 5, h = 8;\n    int area = calculateArea(w, h);\n    printf(\"Rectangle Area: %d\\n\", area);\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Functions modularize code into reusable subroutines. Every function call pushes a stack frame onto the Call Stack containing parameters, local variables, and return addresses.",
      "keyConcepts": [
        "Modular Decomposition",
        "Call Stack & Stack Frames",
        "Return Address & Scope",
        "Code Reusability"
      ],
      "revisionNotes": "Keep functions focused on a single responsibility; a function should do one task and do it well."
    }
  },
  "6-2": {
    "content": "### 6.2 User Defined Functions\n\nA **user-defined function** is created by the programmer to fulfill custom application requirements. Working with user-defined functions involves three distinct phases:\n\n```\n 1. Function Prototype (Declaration) ──> Informs compiler of name, return type & params\n 2. Function Call (Invocation)       ──> Passes arguments and transfers execution\n 3. Function Definition              ──> Contains the executable statements\n```\n\n#### 1. Function Prototype (Declaration)\nPlaced before `main()` or in header files:\n```c\nreturn_type function_name(parameter_type1 param1, parameter_type2 param2);\n```\n- Informs the compiler of parameter types so it can validate calls before the definition appears.\n\n#### 2. Function Definition\nContains the formal parameters and the actual code body:\n```c\nint add(int a, int b) {\n    int result = a + b;\n    return result; // Exit and yield value\n}\n```\n\n#### 3. Formal vs. Actual Parameters\n- **Actual Parameters (Arguments):** The real values or variables passed into the function call (e.g., `add(x, y);`).\n- **Formal Parameters:** The local variable placeholders declared in the function definition header (e.g., `int a, int b`).\n\n#### Classification of Functions by Parameters and Returns\n| Category | Example Prototype | Description |\n| :--- | :--- | :--- |\n| **No params, No return** | `void greet(void);` | Pure side-effect (e.g., printing banner) |\n| **With params, No return** | `void printScore(int s);` | Consumes input, produces side effect |\n| **No params, With return** | `int getSystemTime(void);` | Generates data without external input |\n| **With params, With return** | `double power(double b, int e);` | Functional transformation |",
    "codeSnippets": [
      {
        "language": "c",
        "title": "User-Defined Function Lifecycle & Primes",
        "code": "#include <stdio.h>\n#include <stdbool.h>\n\n// 1. Function Prototype\nbool isPrime(int n);\n\nint main(void) {\n    int num = 29;\n\n    // 2. Function Call (Passing actual parameter 'num')\n    if (isPrime(num)) {\n        printf(\"%d is a Prime number.\\n\", num);\n    } else {\n        printf(\"%d is NOT a Prime number.\\n\", num);\n    }\n\n    return 0;\n}\n\n// 3. Function Definition (Formal parameter 'n')\nbool isPrime(int n) {\n    if (n <= 1) return false;\n    for (int i = 2; i * i <= n; i++) {\n        if (n % i == 0) return false;\n    }\n    return true;\n}"
      }
    ],
    "aiSummary": {
      "summary": "User-defined functions require a Prototype, Call, and Definition. Actual parameters passed during the call bind to formal parameters defined in the function signature.",
      "keyConcepts": [
        "Function Prototype vs Definition",
        "Actual vs Formal Parameters",
        "Return Types",
        "Parameter-Return Classifications"
      ],
      "revisionNotes": "Always declare function prototypes before main() to enable compile-time type verification."
    }
  },
  "6-3": {
    "content": "### 6.3 System Defined (Standard Library) Functions\n\nC includes a vast suite of pre-compiled, optimized functions bundled within the **C Standard Library** (`libc`).\n\n#### Key Standard Library Headers\n- **`<stdio.h>` (Standard Input/Output):**\n  - `printf()`: Formatted output to stdout.\n  - `scanf()`: Formatted input from stdin.\n  - `getchar()`, `putchar()`: Character-level I/O.\n- **`<stdlib.h>` (General Utilities):**\n  - `malloc()`, `calloc()`, `realloc()`, `free()`: Dynamic heap memory management.\n  - `exit()`: Terminate program execution with exit code.\n  - `rand()`, `srand()`: Pseudo-random number generation.\n  - `atoi()`, `atof()`: String-to-number conversions.\n- **`<math.h>` (Mathematical Routines):**\n  - `sqrt()`, `pow()`, `sin()`, `cos()`, `ceil()`, `floor()`, `fabs()`.\n  - *Note: On GCC Linux, compile with `-lm` to link the math library.*\n- **`<ctype.h>` (Character Classification):**\n  - `isalpha()`, `isdigit()`, `isspace()`, `toupper()`, `tolower()`.\n- **`<time.h>` (Date and Time Utilities):**\n  - `time()`, `clock()`, `difftime()`.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Standard Library Showcase (<stdlib.h>, <math.h>, <time.h>)",
        "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <math.h>\n#include <time.h>\n\nint main(void) {\n    // Math functions\n    double val = 16.0;\n    printf(\"sqrt(%.1f) = %.2f\\n\", val, sqrt(val));\n    printf(\"2.0 ^ 5 = %.1f\\n\", pow(2.0, 5.0));\n\n    // Random numbers seeded by system time\n    srand((unsigned int)time(NULL));\n    int roll = (rand() % 6) + 1; // Die roll: 1 to 6\n    printf(\"Random Die Roll: %d\\n\", roll);\n\n    // String to integer conversion\n    char strNum[] = \"456\";\n    int converted = atoi(strNum);\n    printf(\"Converted integer: %d (x2 = %d)\\n\", converted, converted * 2);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C standard library functions are organized into headers (<stdio.h>, <stdlib.h>, <math.h>, <ctype.h>). They provide robust, battle-tested utilities across platforms.",
      "keyConcepts": [
        "Standard Headers",
        "Math Library Linking (-lm)",
        "Random Number Seeding (srand/time)",
        "String Conversion (atoi/atof)"
      ],
      "revisionNotes": "Always include the exact corresponding header file; calling library functions without headers leads to implicit declaration warnings."
    }
  },
  "6-4": {
    "content": "### 6.4 Types of Parameter Passing in Functions\n\nIn C, the mechanism of passing data into functions is categorized into:\n1. **Call by Value** (Default in C)\n2. **Call by Reference** (Simulated using Pointers)\n\n#### 1. Call by Value\n- A **copy** of the actual parameter's value is passed into the function's formal parameter.\n- The function operates entirely on its own private stack frame copies.\n- **Changes made to formal parameters inside the function do NOT affect the caller's original variables.**\n\n```\n Caller Frame:            Called Frame:\n ┌──────────────┐         ┌──────────────┐\n │ int x = 10   │ ──────► │ int a = 10   │ (Copy created)\n └──────────────┘         └──────────────┘\n Original unchanged        Changes stay in stack frame\n```\n\n#### 2. Call by Reference (Using Pointers)\n- Instead of passing values, the **memory addresses** (`&x`) of the caller's variables are passed.\n- The formal parameters are **pointers** (`int *ptr`) storing these memory addresses.\n- By **dereferencing** the pointer (`*ptr`), the function directly reads and modifies the original memory location in the caller's stack frame.\n\n#### Comparison: Call by Value vs. Call by Reference\n| Attribute | Call by Value | Call by Reference (via Pointers) |\n| :--- | :--- | :--- |\n| **Data Passed** | Copy of actual values | Physical memory addresses (`&var`) |\n| **Original Variable** | Protected from changes | Directly modified in place |\n| **Formal Parameter** | Standard variable | Pointer variable (`type*`) |\n| **Memory Overhead** | Copies entire data (inefficient for large structs) | Passes 8-byte pointer (fast and efficient) |",
    "codeSnippets": [
      {
        "language": "c",
        "title": "The Classic Swap: Call by Value vs Call by Reference",
        "code": "#include <stdio.h>\n\n// Call by Value: Fails to modify originals\nvoid swapByValue(int a, int b) {\n    int temp = a;\n    a = b;\n    b = temp;\n}\n\n// Call by Reference: Successfully modifies originals via pointers\nvoid swapByReference(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nint main(void) {\n    int x = 10, y = 20;\n\n    printf(\"Original: x = %d, y = %d\\n\", x, y);\n\n    swapByValue(x, y);\n    printf(\"After swapByValue:     x = %d, y = %d (Unchanged!)\\n\", x, y);\n\n    swapByReference(&x, &y);\n    printf(\"After swapByReference: x = %d, y = %d (Swapped!)\\n\", x, y);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C is strictly Call by Value by default (copies are passed). Call by Reference is achieved by passing variable memory addresses (&) and dereferencing pointers (*) inside the function.",
      "keyConcepts": [
        "Call by Value (Data Protection)",
        "Call by Reference (Pointer Addressing)",
        "The Swap Algorithm",
        "Memory Efficiency for Large Structures"
      ],
      "revisionNotes": "To allow a function to modify caller variables, pass their addresses: `func(&var)` and declare parameters as pointers: `void func(int *ptr)`."
    }
  },
  "7-1": {
    "content": "### 7.1 Need of Pointers in 'C'\n\nA **pointer** is a variable that stores the **physical memory address** of another variable. Pointers are the defining feature that grants C its legendary speed, control, and systems-level capabilities.\n\n#### Why Pointers are Indispensable\n1. **Dynamic Memory Allocation:** You cannot allocate heap memory at runtime (`malloc`) without pointer references.\n2. **Efficient Data Passing:** Passing a 1,000,000-byte structure by value duplicates all 1,000,000 bytes. Passing a pointer copies only an 8-byte address.\n3. **Complex Data Structures:** Linked lists, trees, graphs, and hash tables require pointer links between nodes.\n4. **Direct Hardware Interaction:** Device drivers and operating systems interface with memory-mapped hardware I/O registers via raw pointers.\n5. **Multiple Return Values:** Functions can return multiple outputs by modifying variables passed by address.\n\n#### Fundamental Pointer Operators\n- **Address-Of Operator (`&`):** Retrieves the physical memory address of a variable.\n- **Dereference Operator (`*`):** Accesses the value stored at the memory address held by the pointer.\n\n```\n Variable: int age = 25;   (Address: 0x1004)\n Pointer:  int *ptr = &age;\n\n ┌───────────────┐              ┌───────────────┐\n │ ptr (0x1004)  │ ───────────► │ age (25)      │\n └───────────────┘              └───────────────┘\n Address: 0x2000                Address: 0x1004\n```",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Pointer Declaration, Addressing & Dereferencing",
        "code": "#include <stdio.h>\n\nint main(void) {\n    int target = 42;\n    int *ptr = &target; // ptr stores the address of target\n\n    printf(\"Value of target:             %d\\n\", target);\n    printf(\"Address of target (&target): %p\\n\", (void*)&target);\n    printf(\"Value stored in ptr:         %p\\n\", (void*)ptr);\n    printf(\"Dereferenced value (*ptr):   %d\\n\", *ptr);\n\n    // Modifying target indirectly through the pointer\n    *ptr = 99;\n    printf(\"Target after indirect edit:  %d\\n\", target);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "A pointer is a variable holding a memory address. The address-of operator (&) extracts an address; the dereference operator (*) accesses the value stored at that address.",
      "keyConcepts": [
        "Memory Addresses (Hexadecimal)",
        "Address-Of (&)",
        "Dereferencing (*)",
        "Hardware/Systems Memory Control"
      ],
      "revisionNotes": "Always initialize pointers immediately: uninitialized pointers hold random addresses and dereferencing them causes fatal Segmentation Faults."
    }
  },
  "7-2": {
    "content": "### 7.2 Types of Pointers in 'C'\n\nPointers are categorized based on their initialization state, data type targets, and runtime behaviors.\n\n#### 1. Null Pointer\nA pointer explicitly initialized to point to no valid memory address (`NULL` or `0`):\n```c\nint *ptr = NULL;\n```\n- Dereferencing a NULL pointer causes a deterministic segmentation fault.\n- Used to indicate that a pointer has not yet been allocated or that a linked list has reached its end.\n\n#### 2. Wild Pointer\nA pointer that has been declared but **not initialized**:\n```c\nint *ptr; // Wild pointer! Contains arbitrary garbage address\n*ptr = 100; // DANGEROUS! Overwrites random memory\n```\n\n#### 3. Dangling Pointer\nA pointer that points to a memory location that has already been **deallocated or freed**:\n```c\nint *ptr = (int*)malloc(sizeof(int));\nfree(ptr); // Memory returned to OS\n// ptr is now a DANGLING pointer!\n*ptr = 50; // Undefined behavior / Heap corruption!\n```\n*Fix: Always set `ptr = NULL;` immediately after calling `free(ptr);`.*\n\n#### 4. Generic / Void Pointer (`void*`)\nA pointer that has no associated data type. Can hold the memory address of any type:\n```c\nvoid *genPtr;\nint x = 10;\nfloat f = 3.14f;\ngenPtr = &x; // Valid\ngenPtr = &f; // Valid\n```\n- Cannot be dereferenced directly without explicit type casting: `*(float*)genPtr`.\n\n#### 5. Function Pointers\nPointers that point to executable code (functions) in the text segment rather than data in RAM.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Void Pointer Generic Printing & Dangling Prevention",
        "code": "#include <stdio.h>\n#include <stdlib.h>\n\nvoid printGeneric(void *ptr, char type) {\n    if (type == 'i') printf(\"Integer: %d\\n\", *(int*)ptr);\n    else if (type == 'f') printf(\"Float:   %.2f\\n\", *(float*)ptr);\n    else if (type == 'c') printf(\"Char:    %c\\n\", *(char*)ptr);\n}\n\nint main(void) {\n    int num = 120;\n    float pi = 3.1415f;\n\n    printGeneric(&num, 'i');\n    printGeneric(&pi, 'f');\n\n    // Safe deallocation pattern\n    int *dynamicVal = (int*)malloc(sizeof(int));\n    *dynamicVal = 500;\n    free(dynamicVal);\n    dynamicVal = NULL; // Defeats dangling pointer hazard\n\n    if (dynamicVal == NULL) {\n        printf(\"Dynamic pointer safely neutralized to NULL.\\n\");\n    }\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Pointer types include NULL pointers (pointing to 0), Wild pointers (uninitialized), Dangling pointers (pointing to freed memory), and Void pointers (generic void* pointers needing type casting).",
      "keyConcepts": [
        "NULL Pointer Guard",
        "Wild Pointer Hazards",
        "Dangling Pointers & Heap Corruption",
        "Generic void* Pointers"
      ],
      "revisionNotes": "Always follow the rule: `free(ptr); ptr = NULL;` to eliminate dangling pointer bugs."
    }
  },
  "7-3": {
    "content": "### 7.3 Pointer Expressions & Pointer Arithmetic\n\nPointer arithmetic is unique: it is scaled automatically by the **byte size of the data type** to which the pointer points.\n\n#### Pointer Arithmetic Operations\n1. **Incrementing (`ptr++`):** Moves the pointer forward to the **next element**.\n   - New Address = Current Address + `sizeof(*ptr)`\n   - If `int *ptr` is at address `0x1000`, `ptr++` moves to `0x1004` (4 bytes).\n2. **Decrementing (`ptr--`):** Moves backward to the previous element.\n3. **Adding / Subtracting an Integer (`ptr + n`):** Shifts by n \× \sizeof(*ptr) bytes.\n4. **Pointer Subtraction (`ptr2 - ptr1`):**\n   - Both pointers must point into the same array.\n   - Result is the **number of elements** between them, not raw bytes.\n\n```\n Pointer Arithmetic on 4-byte Integers:\n [10]        [20]        [30]        [40]\n 0x1000      0x1004      0x1008      0x100C\n  ▲           ▲\n ptr         ptr + 1 (+4 bytes)\n```\n\n#### Illegal Pointer Operations\n- Adding two pointers together (`ptr1 + ptr2` is meaningless and illegal).\n- Multiplying or dividing a pointer.\n- Applying bitwise operators to pointers.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Array Traversal via Pointer Arithmetic",
        "code": "#include <stdio.h>\n\nint main(void) {\n    int arr[] = {100, 200, 300, 400, 500};\n    int *ptr = arr; // Points to arr[0]\n\n    printf(\"Initial pointer address: %p, value: %d\\n\", (void*)ptr, *ptr);\n\n    ptr++; // Advances by sizeof(int) = 4 bytes\n    printf(\"After ptr++: address:   %p, value: %d\\n\", (void*)ptr, *ptr);\n\n    // Access using offset: *(ptr + 2) is arr[3]\n    printf(\"Value at *(ptr + 2):    %d\\n\", *(ptr + 2));\n\n    // Pointer distance subtraction\n    int *end = &arr[4];\n    printf(\"Elements between end and start: %td\\n\", end - arr);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Pointer arithmetic is scaled by sizeof(data_type). ptr++ increments by the byte size of the target type. Pointer subtraction (ptr2 - ptr1) yields the number of elements between them.",
      "keyConcepts": [
        "Scaled Arithmetic (+ sizeof(type))",
        "Pointer Incrementation",
        "Subscript Equivalence *(ptr + i) == arr[i]",
        "Pointer Subtraction (ptrdiff_t)"
      ],
      "revisionNotes": "Remember: `arr[i]` is identical to `*(arr + i)` in C. The compiler converts all array subscripts into pointer arithmetic."
    }
  },
  "7-4": {
    "content": "### 7.4 Arrays of Pointers vs. Pointer to an Array\n\nA critical distinction in C is the difference between an **Array of Pointers** and a **Pointer to an Array**.\n\n#### 1. Array of Pointers (`type *arr[N]`)\n- An array where **every element is a pointer** holding a memory address.\n- Most commonly used to manage collections of strings of varying lengths (ragged string tables):\n  ```c\n  char *names[] = {\"Dennis\", \"Ken\", \"Brian\"};\n  ```\n- Memory efficient: Only allocates bytes for the exact length of each string literal, avoiding fixed matrix padding.\n\n#### 2. Pointer to an Array (`type (*ptr)[N]`)\n- A **single pointer** that points to an entire array of N elements as a collective unit.\n- Notice the parentheses `(*ptr)` due to operator precedence:\n  - `int *p[5];`: Array of 5 integer pointers.\n  - `int (*p)[5];`: Single pointer to an array of 5 integers.\n\n```\n Array of Pointers (char *cities[3]):\n cities[0] ────► \"Tokyo\\0\"      (6 bytes)\n cities[1] ────► \"New York\\0\"   (9 bytes)\n cities[2] ────► \"Paris\\0\"      (6 bytes)\n```",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Array of String Pointers vs Pointer to Array",
        "code": "#include <stdio.h>\n\nint main(void) {\n    // Array of Pointers: Ragged string table\n    const char *languages[] = {\n        \"C Systems\",\n        \"Modern C++\",\n        \"Python\"\n    };\n\n    printf(\"--- Array of Pointers (String Table) ---\\n\");\n    for (int i = 0; i < 3; i++) {\n        printf(\"Index %d points to: %s\\n\", i, languages[i]);\n    }\n\n    // Pointer to an entire 1D array of 3 ints\n    int numbers[3] = {10, 20, 30};\n    int (*ptrToArray)[3] = &numbers;\n\n    printf(\"\\n--- Pointer to Array ---\\n\");\n    printf(\"Value at (*ptrToArray)[1] = %d\\n\", (*ptrToArray)[1]);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "An Array of Pointers (type *arr[N]) holds multiple address elements. A Pointer to an Array (type (*ptr)[N]) is a single pointer addressing a complete array block.",
      "keyConcepts": [
        "Array of Pointers (Ragged Tables)",
        "Pointer to Array Syntax (*p)[N]",
        "Operator Precedence with [] and *"
      ],
      "revisionNotes": "Always use parentheses for pointer to an array: `int (*ptr)[5]`. Without parentheses, `int *ptr[5]` becomes an array of pointers."
    }
  },
  "7-5": {
    "content": "### 7.5 Pointers and Functions\n\nPointers and functions interact in three major ways in C:\n1. Passing pointers to functions (enabling call by reference).\n2. Returning pointers from functions.\n3. **Function Pointers:** Pointing directly to executable code for callbacks.\n\n#### 1. Returning Pointers from Functions\nA function can return a pointer to memory.\n- **CRITICAL HAZARD:** **Never return a pointer to a local stack variable!** Local variables are destroyed when the function returns, leaving a dangling pointer pointing to an invalidated stack frame:\n  ```c\n  // DANGEROUS BUG!\n  int* getVal() {\n      int x = 10;\n      return &x; // Crash! x is deallocated upon return\n  }\n  ```\n- Safe approaches: Return pointers to **heap-allocated memory** (`malloc`) or `static` variables.\n\n#### 2. Function Pointers\nA function pointer holds the memory address of a function's machine code in the text segment:\n```c\nreturn_type (*func_ptr_name)(param_types);\n```\n- Enables dynamic callback mechanisms and event dispatch tables.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Function Pointer Callbacks in Practice",
        "code": "#include <stdio.h>\n\nint add(int a, int b) { return a + b; }\nint multiply(int a, int b) { return a * b; }\n\n// Higher-order function taking a function pointer as parameter\nvoid compute(int a, int b, int (*operation)(int, int)) {\n    int res = operation(a, b);\n    printf(\"Computation Result: %d\\n\", res);\n}\n\nint main(void) {\n    // Function pointer declaration and assignment\n    int (*opPtr)(int, int) = add;\n    printf(\"Calling add via pointer: %d\\n\", opPtr(10, 5));\n\n    // Dynamic callbacks\n    compute(10, 5, add);\n    compute(10, 5, multiply);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Functions can accept and return pointers. Never return pointers to local stack variables. Function pointers store machine code addresses, enabling dynamic callbacks.",
      "keyConcepts": [
        "Returning Pointers Safely (Heap/Static)",
        "Local Stack Dangling Return Hazard",
        "Function Pointers Syntax",
        "Callback Architecture"
      ],
      "revisionNotes": "Returning pointers to heap memory is safe, but requires the caller to assume responsibility for calling free()."
    }
  },
  "8-1": {
    "content": "### 8.1 Need of Structures in 'C'\n\nWhile arrays store collections of elements of the **same data type**, real-world entities consist of **heterogeneous attributes** of differing types.\n\n#### The Problem with Separate Variables\nConsider representing a student:\n- `int roll_no;` (4 bytes)\n- `char name[50];` (50 bytes)\n- `float gpa;` (4 bytes)\n- `char grade;` (1 byte)\n\nManaging these as separate arrays for 1,000 students (`rolls[1000]`, `names[1000][50]`, `gpas[1000]`) leads to fragmented code, lack of cohesion, and complex sorting operations.\n\n#### The Structure Solution (`struct`)\nA **structure** is a user-defined composite data type that allows you to group variables of **different data types** together under a single meaningful record name.\n\n```\n Real-World Student Entity\n┌────────────────────────────────────────────────────────┐\n│ struct Student                                         │\n│ ├── int roll_no          (4 bytes)                     │\n│ ├── char name[50]        (50 bytes)                    │\n│ └── float gpa            (4 bytes)                     │\n└────────────────────────────────────────────────────────┘\n Encapsulated into a single contiguous record in RAM\n```",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Declaring and Visualizing a Custom Structure",
        "code": "#include <stdio.h>\n\n// Defining the user-defined blueprint\nstruct Student {\n    int roll_no;\n    char name[40];\n    float gpa;\n};\n\nint main(void) {\n    struct Student s1 = {101, \"Pranshu Pathak\", 3.95f};\n\n    printf(\"Student Record:\\n\");\n    printf(\"Roll Number: %d\\n\", s1.roll_no);\n    printf(\"Full Name:   %s\\n\", s1.name);\n    printf(\"GPA:         %.2f\\n\", s1.gpa);\n    printf(\"Total Memory Size: %zu bytes\\n\", sizeof(struct Student));\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Structures encapsulate heterogeneous data types into a single compound record. They bridge the gap between primitive scalar variables and real-world domain objects.",
      "keyConcepts": [
        "Heterogeneous Data Grouping",
        "Record Encapsulation",
        "struct Blueprint Declaration"
      ],
      "revisionNotes": "Defining a struct (struct Person { ... };) defines a blueprint; memory is only allocated when an instance variable is declared."
    }
  },
  "8-2": {
    "content": "### 8.2 Implementing Structure Variables & Member Access\n\nOnce a structure template is defined, instance variables can be declared and manipulated using specialized member operators.\n\n#### 1. Declaration and Initialization\n```c\nstruct Book {\n    char title[50];\n    char author[50];\n    int pages;\n    float price;\n};\n\n// Method 1: Positional initialization\nstruct Book b1 = {\"The C Programming Language\", \"Dennis Ritchie\", 272, 45.50f};\n\n// Method 2: Designated initializers (C99 onwards)\nstruct Book b2 = {.title = \"Operating Systems\", .price = 65.00f};\n```\n\n#### 2. Member Access Operators: Dot (`.`) vs. Arrow (`->`)\n- **Dot Operator (`.`):** Used when accessing members directly through a **structure variable**:\n  ```c\n  printf(\"%s\", b1.title);\n  ```\n- **Arrow Operator (`->`):** Used when accessing members through a **pointer to a structure**:\n  ```c\n  struct Book *ptr = &b1;\n  printf(\"%s\", ptr->title); // Equivalent to (*ptr).title\n  ```\n\n#### 3. Structure Padding and Memory Alignment\nCompilers insert unused padding bytes between structure members so that data types align with native hardware word boundaries (e.g., 4-byte or 8-byte boundaries), optimizing CPU bus transfer speeds.\n- Consequently, `sizeof(struct)` is often greater than the sum of its individual members.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Dot vs Arrow Member Operators and Memory Padding",
        "code": "#include <stdio.h>\n\nstruct ServerNode {\n    int id;           // 4 bytes\n    char status;      // 1 byte (+ 3 bytes padding)\n    double load_pct;  // 8 bytes\n};\n\nint main(void) {\n    struct ServerNode srv = {1, 'A', 42.8};\n    struct ServerNode *ptr = &srv;\n\n    // Member access via Dot operator\n    printf(\"Via Dot Operator:   ID = %d, Status = %c\\n\", srv.id, srv.status);\n\n    // Member access via Arrow operator\n    printf(\"Via Arrow Operator: ID = %d, Load = %.1f%%\\n\", ptr->id, ptr->load_pct);\n\n    // Structure padding demonstration\n    printf(\"Sum of member sizes: 4 + 1 + 8 = 13 bytes\\n\");\n    printf(\"Actual sizeof(struct): %zu bytes (padded to 8-byte boundary)\\n\", \n           sizeof(struct ServerNode));\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Structure members are accessed using the dot operator (.) for values and arrow operator (->) for pointers. Compilers insert padding bytes to align data with hardware word boundaries.",
      "keyConcepts": [
        "Dot Operator (.)",
        "Arrow Operator (->)",
        "Designated Initializers",
        "Structure Padding & Alignment"
      ],
      "revisionNotes": "Order structure members from largest to smallest (e.g., double, int, char) to minimize compiler padding bytes."
    }
  },
  "8-3": {
    "content": "### 8.3 Arrays of Structures\n\nAn **Array of Structures** is a collection where every element is a complete structure record. It represents database tables where each array index corresponds to a row (record) and each structure field corresponds to a column (attribute).\n\n#### Declaration Syntax\n```c\nstruct Student batch[60]; // Array holding 60 complete student records\n```\n\n#### Memory Layout\nElements reside in contiguous physical memory. If `sizeof(struct Student)` is 64 bytes, `batch[0]` occupies bytes 0-63, `batch[1]` occupies bytes 64-127, and so forth.\n\n```\n batch[0]                batch[1]                batch[2]\n┌───────────────────────┬───────────────────────┬───────────────────────┐\n│ id | name | gpa       │ id | name | gpa       │ id | name | gpa       │\n└───────────────────────┴───────────────────────┴───────────────────────┘\n Contiguous sequential blocks in memory\n```",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Array of Structures: Recording and Searching Records",
        "code": "#include <stdio.h>\n\nstruct Employee {\n    int id;\n    char name[30];\n    double salary;\n};\n\nint main(void) {\n    struct Employee team[3] = {\n        {101, \"Alice Smith\", 85000.0},\n        {102, \"Bob Jones\",   72000.0},\n        {103, \"Carol White\", 91000.0}\n    };\n\n    printf(\"--- Employee Directory ---\\n\");\n    for (int i = 0; i < 3; i++) {\n        printf(\"ID: %d | Name: %-12s | Salary: $%.2f\\n\", \n               team[i].id, team[i].name, team[i].salary);\n    }\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "An Array of Structures stores multiple compound records contiguously. It models tabular database rows with zero-based indexing: arr[i].member.",
      "keyConcepts": [
        "Tabular Data Representation",
        "Contiguous Record Storage",
        "Iteration with for loops",
        "Sorting and Searching Records"
      ],
      "revisionNotes": "To pass an array of structures to a function: `void process(struct Employee arr[], int size)`."
    }
  },
  "8-4": {
    "content": "### 8.4 Structure within Structure (Nested Structures)\n\nIn complex domain modeling, structures often contain other structures as members. This is called **Structure Nesting**.\n\n#### Implementing Nested Structures\nConsider an Employee who has a joining Date:\n```c\nstruct Date {\n    int day;\n    int month;\n    int year;\n};\n\nstruct Employee {\n    int id;\n    char name[40];\n    struct Date join_date; // Nested structure member\n};\n```\n\n#### Accessing Nested Members\nChain the dot (`.`) operators sequentially to reach inner members:\n```c\nstruct Employee emp;\nemp.join_date.day = 15;\nemp.join_date.month = 8;\nemp.join_date.year = 2024;\n```",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Nested Structure Implementation",
        "code": "#include <stdio.h>\n\nstruct Address {\n    char city[30];\n    char state[20];\n    int zip_code;\n};\n\nstruct Organization {\n    char name[50];\n    struct Address location; // Embedded structure\n};\n\nint main(void) {\n    struct Organization org = {\n        \"HiGen Labs\",\n        {\"San Francisco\", \"California\", 94105}\n    };\n\n    printf(\"Organization: %s\\n\", org.name);\n    printf(\"City:         %s\\n\", org.location.city);\n    printf(\"State:        %s\\n\", org.location.state);\n    printf(\"Zip Code:     %d\\n\", org.location.zip_code);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Nested structures embed one structure inside another, modeling hierarchical relationships. Members are accessed via chained dot operators: outer.inner.field.",
      "keyConcepts": [
        "Hierarchical Data Modeling",
        "Composition",
        "Chained Dot Operator Navigation"
      ],
      "revisionNotes": "A structure cannot contain an instance of itself (infinite recursion), but it CAN contain a pointer to its own type (self-referential structure)."
    }
  },
  "8-5": {
    "content": "### 8.5 Introduction to Unions in 'C'\n\nA **`union`** is a user-defined data type similar to a structure, with one fundamental difference: **all members of a union share the exact same physical memory location**.\n\n#### Memory Allocation in Unions\n- In a `struct`, each member is allocated its own distinct memory offset.\n- In a `union`, the compiler allocates only as much memory as is required by its **single largest member**.\n- **Only one member can hold a valid value at any given time.** Assigning a new value to one member overwrites the shared memory space.\n\n```\n Memory Footprint Comparison:\n\n struct Example { int a; double b; }; (Total: 4 + 8 = 12 bytes + padding)\n ┌───────────────┬───────────────────────────────┐\n │ a (4 bytes)   │ b (8 bytes)                   │\n └───────────────┴───────────────────────────────┘\n\n union Example  { int a; double b; }; (Total: 8 bytes total)\n ┌───────────────────────────────────────────────┐\n │ Both a and b share these same 8 bytes         │\n └───────────────────────────────────────────────┘\n```",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Union Shared Memory Overwrite Demonstration",
        "code": "#include <stdio.h>\n\nunion DataPacket {\n    int intVal;\n    float floatVal;\n    char charVal;\n};\n\nint main(void) {\n    union DataPacket packet;\n\n    printf(\"Size of union DataPacket: %zu bytes (size of float/int)\\n\\n\", \n           sizeof(union DataPacket));\n\n    // Storing intVal\n    packet.intVal = 1000;\n    printf(\"Stored intVal:   %d\\n\", packet.intVal);\n\n    // Storing floatVal overwrites the shared memory!\n    packet.floatVal = 3.14159f;\n    printf(\"Stored floatVal: %.4f\\n\", packet.floatVal);\n    printf(\"intVal is now corrupted: %d (interpreted as float bits!)\\n\", packet.intVal);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "A union shares a single memory location among all its members, sized to its largest member. Assigning a value to one member overwrites the others.",
      "keyConcepts": [
        "Shared Memory Location",
        "Size Equals Largest Member",
        "Memory Overwriting Behavior",
        "Hardware Register Modeling"
      ],
      "revisionNotes": "Unions are widely used in low-level systems and network protocols to interpret the same raw bytes in different formats."
    }
  },
  "8-6": {
    "content": "### 8.6 Difference between Structure and Union\n\nStructures and unions represent two distinct approaches to grouping data in C systems programming.\n\n#### Comprehensive Comparison Table\n| Feature | Structure (`struct`) | Union (`union`) |\n| :--- | :--- | :--- |\n| **Keyword** | `struct` | `union` |\n| **Memory Allocation** | Each member receives its own distinct memory address. | All members share the exact same starting memory address. |\n| **Total Size** | Equal to the sum of all members (plus padding). | Exactly equal to the size of its largest member. |\n| **Value Persistence** | All members hold their respective values simultaneously. | Only **one** member can hold a meaningful value at a time. |\n| **Member Mutation** | Changing one member does not affect any other member. | Changing any member overwrites the values of all other members. |\n| **Primary Use Case** | Modeling complex real-world entities (records, objects). | Low-level hardware drivers, packet parsing, memory conservation. |\n\n#### When to Choose Structure vs. Union\n- Use a **Structure** when an entity possesses multiple independent attributes simultaneously (e.g., an employee having an ID, a name, and a salary).\n- Use a **Union** when an entity can only be one of several mutually exclusive formats at any one moment (e.g., a variant type that can be an integer, a float, or a string).",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Side-by-Side Comparison: struct vs union",
        "code": "#include <stdio.h>\n\nstruct StructDemo {\n    int id;\n    double score;\n};\n\nunion UnionDemo {\n    int id;\n    double score;\n};\n\nint main(void) {\n    printf(\"Memory Size Comparison:\\n\");\n    printf(\"sizeof(struct StructDemo): %zu bytes (int 4 + double 8 + padding)\\n\", \n           sizeof(struct StructDemo));\n    printf(\"sizeof(union UnionDemo):   %zu bytes (largest member: double 8)\\n\\n\", \n           sizeof(union UnionDemo));\n\n    struct StructDemo s = {10, 99.5};\n    printf(\"Struct simultaneously holds: ID = %d, Score = %.1f\\n\", s.id, s.score);\n\n    union UnionDemo u;\n    u.id = 10;\n    u.score = 99.5; // Overwrites id!\n    printf(\"Union score is valid: %.1f, but ID is now corrupted: %d\\n\", u.score, u.id);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Structures allocate independent memory for every member, permitting simultaneous value access. Unions share a single memory block sized to the largest member, conserving RAM.",
      "keyConcepts": [
        "Independent vs Shared Memory",
        "Size Calculations",
        "Simultaneous vs Mutually Exclusive Data",
        "Tagged Union Idiom"
      ],
      "revisionNotes": "Combine a struct with a union to create a 'Tagged Union' (variant) that tracks which union field is currently active."
    }
  },
  "9-1": {
    "content": "### 9.1 Opening and Closing Files in 'C'\n\nWhen a program terminates, all data stored in RAM variables is lost. **File handling** enables **persistent storage** by reading from and writing to non-volatile secondary storage (SSD, Hard Disk).\n\n#### The `FILE` Stream Pointer\nIn C, files are accessed through a file control structure managed by the standard library:\n```c\nFILE *fp;\n```\nThe `FILE` pointer acts as an abstraction stream holding buffering status, the current file cursor position, and operating system file descriptors.\n\n#### Opening a File with `fopen()`\n```c\nFILE *fopen(const char *filename, const char *mode);\n```\n\n| Mode | Meaning | If File Exists | If File Does Not Exist |\n| :--- | :--- | :--- | :--- |\n| **`\"r\"`** | Read | Opens for reading | Returns `NULL` (Error) |\n| **`\"w\"`** | Write | **Truncates (erases)** content | Creates a new file |\n| **`\"a\"`** | Append | Preserves content, writes at EOF | Creates a new file |\n| **`\"r+\"`** | Read + Write | Opens from beginning | Returns `NULL` (Error) |\n| **`\"w+\"`** | Write + Read | Truncates content | Creates a new file |\n| **`\"a+\"`** | Append + Read | Appends writes to EOF | Creates a new file |\n| **`\"rb\"`, `\"wb\"`** | Binary Modes | Binary read/write modes (preserves raw bytes on Windows) |\n\n#### Closing a File with `fclose()`\n```c\nint fclose(FILE *fp);\n```\n- Flushes unwritten stream buffers to disk.\n- Releases the OS file descriptor back to the operating system.\n- Always check if `fp == NULL` after `fopen()` before proceeding!",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Safe File Opening, Writing, and Closing",
        "code": "#include <stdio.h>\n\nint main(void) {\n    // 1. Open file in write mode\n    FILE *fp = fopen(\"output.txt\", \"w\");\n    if (fp == NULL) {\n        perror(\"Error opening file\");\n        return 1;\n    }\n\n    // 2. Write data to stream\n    fprintf(fp, \"HiGen Systems: File persistence initialized.\\n\");\n    fprintf(fp, \"Operating System: Standard POSIX / C Stream.\\n\");\n\n    // 3. Mandatory file close\n    fclose(fp);\n    printf(\"Data successfully written to output.txt\\n\");\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "File handling provides persistent storage. fopen() opens a file stream in modes like 'r', 'w', 'a'. Always check for NULL return on fopen() and call fclose() to flush buffers and release descriptors.",
      "keyConcepts": [
        "FILE* Stream Structure",
        "File Access Modes (r, w, a, r+)",
        "NULL Pointer Verification",
        "fclose() Resource Cleanup"
      ],
      "revisionNotes": "Always check `if (fp == NULL)` immediately after `fopen()`. Attempting to read or write to a NULL file pointer causes a fatal crash."
    }
  },
  "9-2": {
    "content": "### 9.2 Input / Output Operations on Files\n\nC provides four categories of file input/output functions tailored to different data representations.\n\n#### 1. Character I/O: `fgetc()` and `fputc()`\nReads or writes a single character at a time:\n```c\nint fputc(int ch, FILE *fp);  // Writes character ch\nint fgetc(FILE *fp);          // Reads next character; returns EOF on end\n```\n\n#### 2. Formatted Text I/O: `fprintf()` and `fscanf()`\nIdentical to `printf` and `scanf`, but directed to a specific file stream:\n```c\nfprintf(fp, \"ID: %d Name: %s\\n\", id, name);\nfscanf(fp, \"%d %s\", &id, name);\n```\n\n#### 3. String / Line I/O: `fgets()` and `fputs()`\nReads or writes whole text lines safely:\n```c\nchar buffer[100];\nfgets(buffer, sizeof(buffer), fp); // Reads up to newline or buffer limit\nfputs(\"Log line text\\n\", fp);\n```\n\n#### 4. Binary Record I/O: `fread()` and `fwrite()`\nReads or writes raw binary memory blocks directly to disk without text parsing, ideal for arrays and structures:\n```c\nsize_t fwrite(const void *ptr, size_t size, size_t count, FILE *fp);\nsize_t fread(void *ptr, size_t size, size_t count, FILE *fp);\n```",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Reading and Writing Full File Streams Line by Line",
        "code": "#include <stdio.h>\n\nint main(void) {\n    // Write sample lines\n    FILE *fout = fopen(\"notes.txt\", \"w\");\n    if (!fout) return 1;\n    fputs(\"Line 1: Computer Science Fundamentals\\n\", fout);\n    fputs(\"Line 2: Dennis Ritchie C Programming\\n\", fout);\n    fclose(fout);\n\n    // Read back lines using fgets until EOF\n    FILE *fin = fopen(\"notes.txt\", \"r\");\n    if (!fin) return 1;\n\n    char lineBuffer[128];\n    printf(\"Reading contents of notes.txt:\\n\");\n    while (fgets(lineBuffer, sizeof(lineBuffer), fin) != NULL) {\n        printf(\"-> %s\", lineBuffer);\n    }\n\n    fclose(fin);\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C supports Character I/O (fgetc/fputc), Formatted I/O (fprintf/fscanf), String Line I/O (fgets/fputs), and Raw Binary Block I/O (fread/fwrite).",
      "keyConcepts": [
        "Character Streams (EOF sentinel)",
        "Formatted Text I/O",
        "Line Buffering with fgets()",
        "Binary Serialization with fwrite/fread"
      ],
      "revisionNotes": "Always use `fgets()` instead of `fscanf()` when reading strings with embedded spaces."
    }
  },
  "9-3": {
    "content": "### 9.3 Random Access to Files in 'C'\n\nBy default, file operations in C are **sequential**: reading begins at byte 0 and advances one byte at a time toward the end. **Random Access** allows you to jump directly to any arbitrary byte location in the file without reading preceding data.\n\n#### Core Random Access Functions\n1. **`fseek()`:** Moves the file position indicator to a designated byte offset:\n   ```c\n   int fseek(FILE *fp, long offset, int origin);\n   ```\n   - `offset`: Number of bytes to move (positive for forward, negative for backward).\n   - `origin`: Relative reference point:\n     - **`SEEK_SET`:** Offset from the **beginning** of the file.\n     - **`SEEK_CUR`:** Offset from the **current** cursor position.\n     - **`SEEK_END`:** Offset from the **end** of the file.\n2. **`ftell()`:** Returns the current byte offset from the start of the file (0-based):\n   ```c\n   long position = ftell(fp);\n   ```\n3. **`rewind()`:** Resets the file cursor back to the beginning (`fseek(fp, 0, SEEK_SET)`).\n\n#### Calculating File Size using Random Access\n```c\nfseek(fp, 0, SEEK_END);      // Seek to very end\nlong file_size = ftell(fp);  // Position equals total byte count!\nrewind(fp);                  // Reset back to start for reading\n```",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Random Access: File Sizing and Offset Seeking",
        "code": "#include <stdio.h>\n\nint main(void) {\n    FILE *fp = fopen(\"random_test.dat\", \"w+\");\n    if (!fp) return 1;\n\n    // Write 26 alphabet characters: 'A' through 'Z'\n    for (char ch = 'A'; ch <= 'Z'; ch++) {\n        fputc(ch, fp);\n    }\n\n    // 1. Calculate file size\n    fseek(fp, 0, SEEK_END);\n    long size = ftell(fp);\n    printf(\"Total File Size: %ld bytes\\n\", size);\n\n    // 2. Jump directly to byte 10 (11th character: 'K')\n    fseek(fp, 10, SEEK_SET);\n    int readChar = fgetc(fp);\n    printf(\"Character at offset 10: '%c' (ASCII %d)\\n\", readChar, readChar);\n\n    // 3. Jump 4 bytes forward from current position\n    fseek(fp, 4, SEEK_CUR);\n    printf(\"Character after +4 offset: '%c'\\n\", fgetc(fp));\n\n    fclose(fp);\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Random access allows non-sequential file seeking. fseek() repositions the cursor using SEEK_SET, SEEK_CUR, or SEEK_END. ftell() returns the current byte position, and rewind() resets to offset 0.",
      "keyConcepts": [
        "fseek() Origins (SEEK_SET, SEEK_CUR, SEEK_END)",
        "ftell() Byte Position Tracking",
        "Computing File Size via ftell",
        "rewind()"
      ],
      "revisionNotes": "Use `fseek(fp, 0, SEEK_END); long size = ftell(fp);` as the standard, portable idiom for determining file size."
    }
  },
  "9-4": {
    "content": "### 9.4 Command Line Arguments in 'C'\n\nCommand-line arguments allow users to pass parameters to the program directly from the shell terminal when launching the executable.\n\n#### The Parameterized `main()` Signature\n```c\nint main(int argc, char *argv[])\n```\n\n#### Parameter Breakdown\n1. **`int argc` (Argument Count):**\n   - An integer holding the total number of command-line arguments passed.\n   - **`argc` is always at least `1`**, because the executable program's name itself is always `argv[0]`.\n2. **`char *argv[]` (Argument Vector):**\n   - An array of pointers to null-terminated strings containing each argument.\n   - `argv[0]`: Path/Name of the running executable.\n   - `argv[1]`: First argument.\n   - `argv[argc - 1]`: Final argument.\n   - `argv[argc]`: Guaranteed to be a `NULL` pointer.\n\n#### Converting Argument Strings\nArguments are always passed as **strings** (`char*`). Convert them to numbers using:\n- `atoi(argv[i])`: Converts string to `int`.\n- `atof(argv[i])`: Converts string to `double`.\n- `strtol(argv[i], NULL, 10)`: Robust conversion with base and error detection.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Parsing Command Line Arguments in C",
        "code": "#include <stdio.h>\n#include <stdlib.h>\n\nint main(int argc, char *argv[]) {\n    printf(\"Program Name: %s\\n\", argv[0]);\n    printf(\"Total Arguments Count (argc): %d\\n\", argc);\n\n    if (argc < 2) {\n        printf(\"Usage: %s <num1> <num2>\\n\", argv[0]);\n        return 0;\n    }\n\n    printf(\"\\nSupplied arguments:\\n\");\n    for (int i = 1; i < argc; i++) {\n        printf(\"argv[%d] = %s\\n\", i, argv[i]);\n    }\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Command line arguments are received in main(int argc, char *argv[]). argc represents the count (minimum 1); argv is an array of string pointers starting with the program name at argv[0].",
      "keyConcepts": [
        "argc (Argument Count)",
        "argv (Argument Vector)",
        "argv[0] Executable Name",
        "String Conversion (atoi, strtol)"
      ],
      "revisionNotes": "Always verify `if (argc < expected_count)` before accessing `argv[1]` to prevent segmentation faults from missing arguments."
    }
  },
  "10-1": {
    "content": "### 10.1 Concept of Dynamic Memory Allocation\n\nIn C, memory is partitioned into four major architecture segments:\n\n```\n High Memory\n ┌──────────────────────────────────┐\n │ Stack Segment                    │ Local variables, stack frames (grows downward)\n ├──────────────────────────────────┤\n │               ▼                  │\n │                                  │\n │               ▲                  │\n ├──────────────────────────────────┤\n │ Heap Segment                     │ Dynamic allocation (malloc/calloc) (grows upward)\n ├──────────────────────────────────┤\n │ Data / BSS Segment               │ Global & static variables (initialized / uninitialized)\n ├──────────────────────────────────┤\n │ Text / Code Segment              │ Machine instructions (Read-Only)\n └──────────────────────────────────┘\n Low Memory\n```\n\n#### Compile-Time (Static/Stack) vs. Runtime (Heap) Allocation\n| Attribute | Static / Stack Allocation | Dynamic (Heap) Allocation |\n| :--- | :--- | :--- |\n| **Allocation Moment** | Compile time or function entry | Runtime during program execution |\n| **Size Flexibility** | Fixed, cannot change size | Highly flexible, can resize with `realloc` |\n| **Lifetime** | Scope of function or block | Persists until explicitly deallocated via `free()` |\n| **Management** | Automatic by CPU stack pointer | Manual by programmer |\n| **Memory Region** | Stack frame | Heap segment |",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Stack vs Heap Memory Demonstration",
        "code": "#include <stdio.h>\n#include <stdlib.h>\n\nvoid stackVsHeap(void) {\n    int stackVar = 50; // Resides on Call Stack (destroyed on return)\n    \n    // Resides on Heap (persists until free() is called)\n    int *heapVar = (int*)malloc(sizeof(int));\n    *heapVar = 100;\n\n    printf(\"Stack Address: %p | Value: %d\\n\", (void*)&stackVar, stackVar);\n    printf(\"Heap Address:  %p | Value: %d\\n\", (void*)heapVar, *heapVar);\n\n    free(heapVar); // Explicit cleanup\n}\n\nint main(void) {\n    stackVsHeap();\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Memory is divided into Text, Data, Heap, and Stack segments. Dynamic allocation occurs on the Heap at runtime, providing size flexibility and persistence beyond function scope.",
      "keyConcepts": [
        "Memory Segments (Text, Data, Heap, Stack)",
        "Stack (Automatic) vs Heap (Manual)",
        "Heap Allocation Lifetime",
        "Manual Memory Management"
      ],
      "revisionNotes": "Stack memory is fast but strictly limited in size; large data buffers should always be allocated on the heap."
    }
  },
  "10-2": {
    "content": "### 10.2 Implementing malloc, calloc, and realloc\n\nThe C standard library header **`<stdlib.h>`** provides three core memory allocation routines:\n\n#### 1. `malloc()` (Memory Allocation)\nAllocates a single contiguous block of raw memory bytes:\n```c\nvoid* malloc(size_t size);\n```\n- Returns a generic `void*` pointer to the allocated block.\n- **Leaves memory uninitialized (contains random garbage data).**\n- Returns `NULL` if the system is out of memory.\n\n#### 2. `calloc()` (Contiguous Allocation)\nAllocates memory for an array of elements and **initializes every byte to zero**:\n```c\nvoid* calloc(size_t num_elements, size_t element_size);\n```\n- Slightly slower than `malloc` due to the zeroing step, but safer against garbage values.\n\n#### 3. `realloc()` (Re-allocation)\nModifies the size of an previously allocated heap memory block:\n```c\nvoid* realloc(void *ptr, size_t new_size);\n```\n- Expands or shrinks the block in place if possible, or moves data to a new location with sufficient contiguous space.\n\n#### Comparison: `malloc` vs. `calloc`\n| Feature | `malloc()` | `calloc()` |\n| :--- | :--- | :--- |\n| **Arguments** | 1 argument (total bytes) | 2 arguments (element count, element size) |\n| **Initialization** | **Garbage values** | **Zero-initialized** |\n| **Execution Speed** | Faster | Slightly slower |",
    "codeSnippets": [
      {
        "language": "c",
        "title": "malloc vs calloc vs realloc Comparison",
        "code": "#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int n = 3;\n\n    // 1. malloc: uninitialized\n    int *mPtr = (int*)malloc(n * sizeof(int));\n    // 2. calloc: zero-initialized\n    int *cPtr = (int*)calloc(n, sizeof(int));\n\n    printf(\"calloc values (guaranteed 0): \");\n    for (int i = 0; i < n; i++) printf(\"%d \", cPtr[i]);\n    printf(\"\\n\");\n\n    // 3. realloc: expand cPtr from 3 to 5 elements\n    int *expanded = (int*)realloc(cPtr, 5 * sizeof(int));\n    if (expanded != NULL) {\n        cPtr = expanded;\n        cPtr[3] = 40;\n        cPtr[4] = 50;\n        printf(\"Expanded array: \");\n        for (int i = 0; i < 5; i++) printf(\"%d \", cPtr[i]);\n        printf(\"\\n\");\n    }\n\n    free(mPtr);\n    free(cPtr);\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "malloc() allocates raw uninitialized memory; calloc() allocates and initializes memory to zero; realloc() resizes existing blocks. Always check for NULL return.",
      "keyConcepts": [
        "malloc() Raw Allocation",
        "calloc() Zero-Initialization",
        "realloc() Dynamic Resizing",
        "Out-of-Memory NULL Guard"
      ],
      "revisionNotes": "Never overwrite the original pointer directly: `ptr = realloc(ptr, ...)` loses the old address if realloc fails, creating a memory leak. Use a temporary pointer."
    }
  },
  "10-3": {
    "content": "### 10.3 Releasing Memory and Preventing Leaks\n\nUnlike Java, Python, or Go, C features **no automatic garbage collector**. Heap memory remains allocated until explicitly released by the programmer.\n\n#### The `free()` Function\n```c\nvoid free(void *ptr);\n```\n- Releases the allocated heap memory block pointed to by `ptr` back to the system allocator.\n- Calling `free(NULL)` is safe and performs no action.\n\n#### Common Dynamic Memory Vulnerabilities\n1. **Memory Leak:**\n   - Occurs when allocated heap memory is abandoned without calling `free()`. The operating system cannot reclaim it while the process runs, consuming system RAM.\n2. **Dangling Pointer:**\n   - A pointer retaining the address of a freed block. Dereferencing it causes undefined behavior or crashes.\n   - **Remedy:** Set `ptr = NULL;` immediately after calling `free(ptr);`.\n3. **Double Free:**\n   - Calling `free()` twice on the exact same address corrupts heap allocator metadata tables.\n4. **Buffer Overflow (Heap Corruption):**\n   - Writing past the allocated byte bounds of a heap buffer overwrites allocator headers.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Defensive Memory Deallocation Pattern",
        "code": "#include <stdio.h>\n#include <stdlib.h>\n\nvoid safeFreeDemo(void) {\n    int *data = (int*)malloc(10 * sizeof(int));\n    if (!data) return;\n\n    // Use allocated memory\n    data[0] = 123;\n    printf(\"Using heap memory: %d\\n\", data[0]);\n\n    // Step 1: Free allocated bytes\n    free(data);\n\n    // Step 2: Neutralize pointer to NULL\n    data = NULL;\n\n    // Step 3: Defensive guard protects against double-free\n    if (data != NULL) {\n        free(data);\n    } else {\n        printf(\"Safety check passed: No double-free attempted.\\n\");\n    }\n}\n\nint main(void) {\n    safeFreeDemo();\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "free() deallocates heap memory. Failing to free memory causes memory leaks; freeing twice causes double-free errors; using freed memory causes dangling pointer bugs.",
      "keyConcepts": [
        "free() Deallocation",
        "Memory Leaks",
        "Dangling Pointers & ptr = NULL",
        "Double Free Prevention"
      ],
      "revisionNotes": "Every single malloc() or calloc() in your codebase must have a matching free() call."
    }
  },
  "11-1": {
    "content": "### 11.1 Introduction of Storage Classes in 'C'\n\nA **storage class** in C defines four fundamental properties of a variable:\n1. **Storage Location:** Where the variable is physically stored (RAM stack, Data segment, or CPU register).\n2. **Initial / Default Value:** The value the variable holds before explicit assignment.\n3. **Scope (Visibility):** The code boundaries where the variable can be accessed.\n4. **Lifetime (Duration):** How long the variable retains its value in memory.\n\n#### The Four Storage Classes in C\n- `auto`\n- `register`\n- `static`\n- `extern`\n\n#### Quick Reference Matrix\n| Storage Class | Storage Location | Default Initial Value | Scope | Lifetime |\n| :--- | :--- | :--- | :--- | :--- |\n| **`auto`** | Stack RAM | **Garbage value** | Local to block | Until block exits |\n| **`register`** | CPU Register (or Stack) | **Garbage value** | Local to block | Until block exits |\n| **`static`** | Data Segment RAM | **Zero (`0`)** | Local to block / File | Entire program execution |\n| **`extern`** | Data Segment RAM | **Zero (`0`)** | Global (cross-file) | Entire program execution |",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Storage Class Characteristics Overview",
        "code": "#include <stdio.h>\n\nint main(void) {\n    auto int localStack = 10;\n    static int persistentVal; // Initialized to 0 by default\n\n    printf(\"auto default location:   Stack (Value: %d)\\n\", localStack);\n    printf(\"static default value:    %d (Zero-initialized)\\n\", persistentVal);\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Storage classes define storage location, default initial value, scope, and lifetime. The four C storage classes are auto, register, static, and extern.",
      "keyConcepts": [
        "Storage Class Dimensions (Storage, Default, Scope, Lifetime)",
        "auto",
        "register",
        "static",
        "extern"
      ],
      "revisionNotes": "All local variables are auto by default; the auto keyword is rarely written explicitly in modern C."
    }
  },
  "11-2": {
    "content": "### 11.2 Types of Storage Classes in 'C'\n\nLet us examine the four storage class specifiers in technical detail.\n\n#### 1. `auto` (Automatic)\n- Default for all variables declared inside a block or function.\n- Resides in the **Call Stack**.\n- Destroyed immediately when the enclosing function terminates.\n\n#### 2. `register`\n- Hints to the compiler to store the variable in a high-speed **CPU register** rather than RAM for intensive loops.\n- **Restriction:** You **cannot take the address (`&var`) of a register variable**, because CPU registers do not have memory RAM addresses!\n\n#### 3. `static`\n- **Static Local Variable:** Retains its value **between successive function calls**. It is initialized only once when the program starts.\n- **Static Global Variable / Function:** Restricts visibility strictly to the **current source file**, hiding the symbol from other translation units (internal linkage).\n\n#### 4. `extern` (External)\n- Informs the compiler that a global variable or function is defined in **another source file**.\n- Declares the symbol without allocating new storage (external linkage).",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Static Local Variable State Preservation",
        "code": "#include <stdio.h>\n\nvoid visitCounter(void) {\n    // static local variable: allocated in Data segment, survives function return\n    static int visit_count = 0;\n    auto int local_var = 0;\n\n    visit_count++;\n    local_var++;\n\n    printf(\"visit_count (static): %d | local_var (auto): %d\\n\", \n           visit_count, local_var);\n}\n\nint main(void) {\n    printf(\"Calling visitCounter 3 times:\\n\");\n    visitCounter(); // visit_count becomes 1\n    visitCounter(); // visit_count becomes 2\n    visitCounter(); // visit_count becomes 3\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "auto variables exist on the stack; register variables request CPU register storage (no & operator); static variables preserve values between calls; extern variables link symbols defined in other files.",
      "keyConcepts": [
        "static Value Persistence",
        "register Address Restriction (&)",
        "extern Multi-File Linkage",
        "Internal vs External Linkage"
      ],
      "revisionNotes": "Use static local variables when you need a persistent counter inside a function without polluting global scope."
    }
  },
  "11-3": {
    "content": "### 11.3 Introduction to the 'C' Pre-processor\n\nThe **C Preprocessor** is a text-processing engine that transforms your source code **before** actual compilation begins.\n\n#### Characteristics of Preprocessor Directives\n1. Every directive begins with a hash / pound symbol (**`#`**).\n2. Directives are **not C statements**, so they **do not end with a semicolon (`;`)**.\n3. Directives operate purely via lexical text substitution and pattern expansion.\n\n#### Major Preprocessor Directives\n- **`#define`:** Macro definition (constants and parameterized macros).\n- **`#undef`:** Undefines an existing macro.\n- **`#include`:** Inserts contents of an external header file.\n- **`#ifdef` / `#ifndef` / `#endif`:** Conditional compilation checks.\n- **`#pragma`:** Compiler-specific configuration options.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Inspecting Preprocessor Directives",
        "code": "#include <stdio.h>\n\n#define PLATFORM \"x86_64 POSIX\"\n#define TIMEOUT_SECONDS 30\n\nint main(void) {\n    printf(\"Target Platform: %s\\n\", PLATFORM);\n    printf(\"Timeout:         %d seconds\\n\", TIMEOUT_SECONDS);\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "The C Preprocessor processes directives (#) prior to compilation through text replacement and macro expansion without semicolons.",
      "keyConcepts": [
        "Preprocessor Phase",
        "# Directive Syntax",
        "Textual Substitution",
        "Header Inclusion"
      ],
      "revisionNotes": "Run `gcc -E main.c` to view the raw preprocessed output before compilation."
    }
  },
  "11-4": {
    "content": "### 11.4 Macro Substitution & Conditional Compilation\n\nMacros are symbolic identifiers defined using `#define` that are replaced by the preprocessor.\n\n#### 1. Object-Like Macros (Constants)\n```c\n#define MAX_BUFFER 1024\n#define PI 3.14159\n```\n\n#### 2. Function-Like (Parameterized) Macros\nMacros can accept arguments like functions, but without function call stack overhead:\n```c\n#define SQUARE(x) ((x) * (x))\n```\n- **CRITICAL PARENTHESIS RULE:** Always enclose macro parameters and the entire replacement expression in parentheses!\n  ```c\n  // WRONG: #define SQUARE(x) x * x\n  int val = SQUARE(2 + 3); // Expands to: 2 + 3 * 2 + 3 = 11 (NOT 25!)\n  \n  // CORRECT: #define SQUARE(x) ((x) * (x))\n  int val = SQUARE(2 + 3); // Expands to: ((2 + 3) * (2 + 3)) = 25\n  ```\n\n#### 3. Conditional Compilation\nEnables compiling specific code blocks based on environment flags:\n```c\n#ifdef DEBUG\n    printf(\"Debug: variable state = %d\\n\", x);\n#endif\n```",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Parameterized Macros and Conditional Compilation",
        "code": "#include <stdio.h>\n\n#define MAX(a, b) (((a) > (b)) ? (a) : (b))\n#define DEBUG_MODE 1\n\nint main(void) {\n    int x = 45, y = 82;\n    int highest = MAX(x, y);\n    printf(\"Highest value between %d and %d is: %d\\n\", x, y, highest);\n\n#if DEBUG_MODE\n    printf(\"[DEBUG] Max evaluation completed successfully.\\n\");\n#endif\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Macros perform textual replacement. Always parenthesize macro parameters ((x)*(x)) to prevent precedence bugs. Conditional compilation (#ifdef, #if) tailors code to specific build targets.",
      "keyConcepts": [
        "Object-Like Macros",
        "Function-Like Macros",
        "Parenthesis Safety Rule",
        "Conditional Compilation (#ifdef, #endif)"
      ],
      "revisionNotes": "Avoid side effects in macro calls: `SQUARE(x++)` increments x twice due to duplicate expansion."
    }
  },
  "11-5": {
    "content": "### 11.5 File Inclusion and Header Guards\n\nFile inclusion is the mechanism of embedding the contents of external header files into your source file using `#include`.\n\n#### Angular Brackets `<...>` vs. Double Quotes `\"...\"`\n1. **`#include <stdio.h>` (Angular Brackets):**\n   - Instructs the preprocessor to search standard **system library directories** (e.g., `/usr/include` on Linux).\n2. **`#include \"custom.h\"` (Double Quotes):**\n   - Instructs the preprocessor to search the **current working directory** first; if not found, it falls back to standard system directories.\n\n#### The Duplicate Inclusion Problem & Header Guards\nIf a header file is included multiple times through nested dependencies, types and structs are defined repeatedly, triggering compiler errors.\n- **Solution — Header Guards:**\n  ```c\n  #ifndef MY_HEADER_H\n  #define MY_HEADER_H\n\n  // Declarations, prototypes, and types go here\n\n  #endif /* MY_HEADER_H */\n  ```\n- Alternatively, modern compilers support **`#pragma once`** at the top of headers.",
    "codeSnippets": [
      {
        "language": "c",
        "title": "Canonical Header Guard Structure",
        "code": "#include <stdio.h>\n\n// Simulating custom header guard\n#ifndef CUSTOM_MATH_H\n#define CUSTOM_MATH_H\n\nint addNumbers(int a, int b) {\n    return a + b;\n}\n\n#endif // CUSTOM_MATH_H\n\nint main(void) {\n    printf(\"Header guard pattern active.\\n\");\n    printf(\"Sum: %d\\n\", addNumbers(15, 30));\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "#include <...> searches system libraries, while #include \"...\" searches local folders first. Header guards (#ifndef ... #define ... #endif) prevent duplicate definition errors from multiple inclusions.",
      "keyConcepts": [
        "#include <lib.h> vs #include \"local.h\"",
        "Duplicate Inclusion Hazards",
        "Header Guards (#ifndef, #define, #endif)",
        "#pragma once"
      ],
      "revisionNotes": "Always protect every header file (.h) with header guards or `#pragma once`."
    }
  }
};
