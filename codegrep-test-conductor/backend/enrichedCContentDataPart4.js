/**
 * Enriched Content Data for Programming in 'C' (Part 4: Modules 9, 10, and 11)
 * Topics:
 * - Module 9: File Handling using 'C' (9.1 - 9.4)
 * - Module 10: Dynamic Memory Allocation (10.1 - 10.3)
 * - Module 11: Storage Classes and Pre-processor (11.1 - 11.5)
 */

module.exports = {
    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 9: FILE HANDLING USING 'C'
    // ═════════════════════════════════════════════════════════════════════════
    "9-1": {
        content: `### 9.1 Opening and Closing Files in 'C'

When a program terminates, all data stored in RAM variables is lost. **File handling** enables **persistent storage** by reading from and writing to non-volatile secondary storage (SSD, Hard Disk).

#### The \`FILE\` Stream Pointer
In C, files are accessed through a file control structure managed by the standard library:
\`\`\`c
FILE *fp;
\`\`\`
The \`FILE\` pointer acts as an abstraction stream holding buffering status, the current file cursor position, and operating system file descriptors.

#### Opening a File with \`fopen()\`
\`\`\`c
FILE *fopen(const char *filename, const char *mode);
\`\`\`

| Mode | Meaning | If File Exists | If File Does Not Exist |
| :--- | :--- | :--- | :--- |
| **\`"r"\`** | Read | Opens for reading | Returns \`NULL\` (Error) |
| **\`"w"\`** | Write | **Truncates (erases)** content | Creates a new file |
| **\`"a"\`** | Append | Preserves content, writes at EOF | Creates a new file |
| **\`"r+"\`** | Read + Write | Opens from beginning | Returns \`NULL\` (Error) |
| **\`"w+"\`** | Write + Read | Truncates content | Creates a new file |
| **\`"a+"\`** | Append + Read | Appends writes to EOF | Creates a new file |
| **\`"rb"\`, \`"wb"\`** | Binary Modes | Binary read/write modes (preserves raw bytes on Windows) |

#### Closing a File with \`fclose()\`
\`\`\`c
int fclose(FILE *fp);
\`\`\`
- Flushes unwritten stream buffers to disk.
- Releases the OS file descriptor back to the operating system.
- Always check if \`fp == NULL\` after \`fopen()\` before proceeding!`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Safe File Opening, Writing, and Closing',
                code: `#include <stdio.h>

int main(void) {
    // 1. Open file in write mode
    FILE *fp = fopen("output.txt", "w");
    if (fp == NULL) {
        perror("Error opening file");
        return 1;
    }

    // 2. Write data to stream
    fprintf(fp, "HiGen Systems: File persistence initialized.\\n");
    fprintf(fp, "Operating System: Standard POSIX / C Stream.\\n");

    // 3. Mandatory file close
    fclose(fp);
    printf("Data successfully written to output.txt\\n");

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "File handling provides persistent storage. fopen() opens a file stream in modes like 'r', 'w', 'a'. Always check for NULL return on fopen() and call fclose() to flush buffers and release descriptors.",
            keyConcepts: ["FILE* Stream Structure", "File Access Modes (r, w, a, r+)", "NULL Pointer Verification", "fclose() Resource Cleanup"],
            revisionNotes: "Always check `if (fp == NULL)` immediately after `fopen()`. Attempting to read or write to a NULL file pointer causes a fatal crash."
        }
    },

    "9-2": {
        content: `### 9.2 Input / Output Operations on Files

C provides four categories of file input/output functions tailored to different data representations.

#### 1. Character I/O: \`fgetc()\` and \`fputc()\`
Reads or writes a single character at a time:
\`\`\`c
int fputc(int ch, FILE *fp);  // Writes character ch
int fgetc(FILE *fp);          // Reads next character; returns EOF on end
\`\`\`

#### 2. Formatted Text I/O: \`fprintf()\` and \`fscanf()\`
Identical to \`printf\` and \`scanf\`, but directed to a specific file stream:
\`\`\`c
fprintf(fp, "ID: %d Name: %s\\n", id, name);
fscanf(fp, "%d %s", &id, name);
\`\`\`

#### 3. String / Line I/O: \`fgets()\` and \`fputs()\`
Reads or writes whole text lines safely:
\`\`\`c
char buffer[100];
fgets(buffer, sizeof(buffer), fp); // Reads up to newline or buffer limit
fputs("Log line text\\n", fp);
\`\`\`

#### 4. Binary Record I/O: \`fread()\` and \`fwrite()\`
Reads or writes raw binary memory blocks directly to disk without text parsing, ideal for arrays and structures:
\`\`\`c
size_t fwrite(const void *ptr, size_t size, size_t count, FILE *fp);
size_t fread(void *ptr, size_t size, size_t count, FILE *fp);
\`\`\``,
        codeSnippets: [
            {
                language: 'c',
                title: 'Reading and Writing Full File Streams Line by Line',
                code: `#include <stdio.h>

int main(void) {
    // Write sample lines
    FILE *fout = fopen("notes.txt", "w");
    if (!fout) return 1;
    fputs("Line 1: Computer Science Fundamentals\\n", fout);
    fputs("Line 2: Dennis Ritchie C Programming\\n", fout);
    fclose(fout);

    // Read back lines using fgets until EOF
    FILE *fin = fopen("notes.txt", "r");
    if (!fin) return 1;

    char lineBuffer[128];
    printf("Reading contents of notes.txt:\\n");
    while (fgets(lineBuffer, sizeof(lineBuffer), fin) != NULL) {
        printf("-> %s", lineBuffer);
    }

    fclose(fin);
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C supports Character I/O (fgetc/fputc), Formatted I/O (fprintf/fscanf), String Line I/O (fgets/fputs), and Raw Binary Block I/O (fread/fwrite).",
            keyConcepts: ["Character Streams (EOF sentinel)", "Formatted Text I/O", "Line Buffering with fgets()", "Binary Serialization with fwrite/fread"],
            revisionNotes: "Always use `fgets()` instead of `fscanf()` when reading strings with embedded spaces."
        }
    },

    "9-3": {
        content: `### 9.3 Random Access to Files in 'C'

By default, file operations in C are **sequential**: reading begins at byte 0 and advances one byte at a time toward the end. **Random Access** allows you to jump directly to any arbitrary byte location in the file without reading preceding data.

#### Core Random Access Functions
1. **\`fseek()\`:** Moves the file position indicator to a designated byte offset:
   \`\`\`c
   int fseek(FILE *fp, long offset, int origin);
   \`\`\`
   - \`offset\`: Number of bytes to move (positive for forward, negative for backward).
   - \`origin\`: Relative reference point:
     - **\`SEEK_SET\`:** Offset from the **beginning** of the file.
     - **\`SEEK_CUR\`:** Offset from the **current** cursor position.
     - **\`SEEK_END\`:** Offset from the **end** of the file.
2. **\`ftell()\`:** Returns the current byte offset from the start of the file ($0$-based):
   \`\`\`c
   long position = ftell(fp);
   \`\`\`
3. **\`rewind()\`:** Resets the file cursor back to the beginning (\`fseek(fp, 0, SEEK_SET)\`).

#### Calculating File Size using Random Access
\`\`\`c
fseek(fp, 0, SEEK_END);      // Seek to very end
long file_size = ftell(fp);  // Position equals total byte count!
rewind(fp);                  // Reset back to start for reading
\`\`\``,
        codeSnippets: [
            {
                language: 'c',
                title: 'Random Access: File Sizing and Offset Seeking',
                code: `#include <stdio.h>

int main(void) {
    FILE *fp = fopen("random_test.dat", "w+");
    if (!fp) return 1;

    // Write 26 alphabet characters: 'A' through 'Z'
    for (char ch = 'A'; ch <= 'Z'; ch++) {
        fputc(ch, fp);
    }

    // 1. Calculate file size
    fseek(fp, 0, SEEK_END);
    long size = ftell(fp);
    printf("Total File Size: %ld bytes\\n", size);

    // 2. Jump directly to byte 10 (11th character: 'K')
    fseek(fp, 10, SEEK_SET);
    int readChar = fgetc(fp);
    printf("Character at offset 10: '%c' (ASCII %d)\\n", readChar, readChar);

    // 3. Jump 4 bytes forward from current position
    fseek(fp, 4, SEEK_CUR);
    printf("Character after +4 offset: '%c'\\n", fgetc(fp));

    fclose(fp);
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Random access allows non-sequential file seeking. fseek() repositions the cursor using SEEK_SET, SEEK_CUR, or SEEK_END. ftell() returns the current byte position, and rewind() resets to offset 0.",
            keyConcepts: ["fseek() Origins (SEEK_SET, SEEK_CUR, SEEK_END)", "ftell() Byte Position Tracking", "Computing File Size via ftell", "rewind()"],
            revisionNotes: "Use `fseek(fp, 0, SEEK_END); long size = ftell(fp);` as the standard, portable idiom for determining file size."
        }
    },

    "9-4": {
        content: `### 9.4 Command Line Arguments in 'C'

Command-line arguments allow users to pass parameters to the program directly from the shell terminal when launching the executable.

#### The Parameterized \`main()\` Signature
\`\`\`c
int main(int argc, char *argv[])
\`\`\`

#### Parameter Breakdown
1. **\`int argc\` (Argument Count):**
   - An integer holding the total number of command-line arguments passed.
   - **\`argc\` is always at least \`1\`**, because the executable program's name itself is always \`argv[0]\`.
2. **\`char *argv[]\` (Argument Vector):**
   - An array of pointers to null-terminated strings containing each argument.
   - \`argv[0]\`: Path/Name of the running executable.
   - \`argv[1]\`: First argument.
   - \`argv[argc - 1]\`: Final argument.
   - \`argv[argc]\`: Guaranteed to be a \`NULL\` pointer.

#### Converting Argument Strings
Arguments are always passed as **strings** (\`char*\`). Convert them to numbers using:
- \`atoi(argv[i])\`: Converts string to \`int\`.
- \`atof(argv[i])\`: Converts string to \`double\`.
- \`strtol(argv[i], NULL, 10)\`: Robust conversion with base and error detection.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Parsing Command Line Arguments in C',
                code: `#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    printf("Program Name: %s\\n", argv[0]);
    printf("Total Arguments Count (argc): %d\\n", argc);

    if (argc < 2) {
        printf("Usage: %s <num1> <num2>\\n", argv[0]);
        return 0;
    }

    printf("\\nSupplied arguments:\\n");
    for (int i = 1; i < argc; i++) {
        printf("argv[%d] = %s\\n", i, argv[i]);
    }

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Command line arguments are received in main(int argc, char *argv[]). argc represents the count (minimum 1); argv is an array of string pointers starting with the program name at argv[0].",
            keyConcepts: ["argc (Argument Count)", "argv (Argument Vector)", "argv[0] Executable Name", "String Conversion (atoi, strtol)"],
            revisionNotes: "Always verify `if (argc < expected_count)` before accessing `argv[1]` to prevent segmentation faults from missing arguments."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 10: DYNAMIC MEMORY ALLOCATION
    // ═════════════════════════════════════════════════════════════════════════
    "10-1": {
        content: `### 10.1 Concept of Dynamic Memory Allocation

In C, memory is partitioned into four major architecture segments:

\`\`\`
 High Memory
 ┌──────────────────────────────────┐
 │ Stack Segment                    │ Local variables, stack frames (grows downward)
 ├──────────────────────────────────┤
 │               ▼                  │
 │                                  │
 │               ▲                  │
 ├──────────────────────────────────┤
 │ Heap Segment                     │ Dynamic allocation (malloc/calloc) (grows upward)
 ├──────────────────────────────────┤
 │ Data / BSS Segment               │ Global & static variables (initialized / uninitialized)
 ├──────────────────────────────────┤
 │ Text / Code Segment              │ Machine instructions (Read-Only)
 └──────────────────────────────────┘
 Low Memory
\`\`\`

#### Compile-Time (Static/Stack) vs. Runtime (Heap) Allocation
| Attribute | Static / Stack Allocation | Dynamic (Heap) Allocation |
| :--- | :--- | :--- |
| **Allocation Moment** | Compile time or function entry | Runtime during program execution |
| **Size Flexibility** | Fixed, cannot change size | Highly flexible, can resize with \`realloc\` |
| **Lifetime** | Scope of function or block | Persists until explicitly deallocated via \`free()\` |
| **Management** | Automatic by CPU stack pointer | Manual by programmer |
| **Memory Region** | Stack frame | Heap segment |`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Stack vs Heap Memory Demonstration',
                code: `#include <stdio.h>
#include <stdlib.h>

void stackVsHeap(void) {
    int stackVar = 50; // Resides on Call Stack (destroyed on return)
    
    // Resides on Heap (persists until free() is called)
    int *heapVar = (int*)malloc(sizeof(int));
    *heapVar = 100;

    printf("Stack Address: %p | Value: %d\\n", (void*)&stackVar, stackVar);
    printf("Heap Address:  %p | Value: %d\\n", (void*)heapVar, *heapVar);

    free(heapVar); // Explicit cleanup
}

int main(void) {
    stackVsHeap();
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Memory is divided into Text, Data, Heap, and Stack segments. Dynamic allocation occurs on the Heap at runtime, providing size flexibility and persistence beyond function scope.",
            keyConcepts: ["Memory Segments (Text, Data, Heap, Stack)", "Stack (Automatic) vs Heap (Manual)", "Heap Allocation Lifetime", "Manual Memory Management"],
            revisionNotes: "Stack memory is fast but strictly limited in size; large data buffers should always be allocated on the heap."
        }
    },

    "10-2": {
        content: `### 10.2 Implementing malloc, calloc, and realloc

The C standard library header **\`<stdlib.h>\`** provides three core memory allocation routines:

#### 1. \`malloc()\` (Memory Allocation)
Allocates a single contiguous block of raw memory bytes:
\`\`\`c
void* malloc(size_t size);
\`\`\`
- Returns a generic \`void*\` pointer to the allocated block.
- **Leaves memory uninitialized (contains random garbage data).**
- Returns \`NULL\` if the system is out of memory.

#### 2. \`calloc()\` (Contiguous Allocation)
Allocates memory for an array of elements and **initializes every byte to zero**:
\`\`\`c
void* calloc(size_t num_elements, size_t element_size);
\`\`\`
- Slightly slower than \`malloc\` due to the zeroing step, but safer against garbage values.

#### 3. \`realloc()\` (Re-allocation)
Modifies the size of an previously allocated heap memory block:
\`\`\`c
void* realloc(void *ptr, size_t new_size);
\`\`\`
- Expands or shrinks the block in place if possible, or moves data to a new location with sufficient contiguous space.

#### Comparison: \`malloc\` vs. \`calloc\`
| Feature | \`malloc()\` | \`calloc()\` |
| :--- | :--- | :--- |
| **Arguments** | 1 argument (total bytes) | 2 arguments (element count, element size) |
| **Initialization** | **Garbage values** | **Zero-initialized** |
| **Execution Speed** | Faster | Slightly slower |`,
        codeSnippets: [
            {
                language: 'c',
                title: 'malloc vs calloc vs realloc Comparison',
                code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 3;

    // 1. malloc: uninitialized
    int *mPtr = (int*)malloc(n * sizeof(int));
    // 2. calloc: zero-initialized
    int *cPtr = (int*)calloc(n, sizeof(int));

    printf("calloc values (guaranteed 0): ");
    for (int i = 0; i < n; i++) printf("%d ", cPtr[i]);
    printf("\\n");

    // 3. realloc: expand cPtr from 3 to 5 elements
    int *expanded = (int*)realloc(cPtr, 5 * sizeof(int));
    if (expanded != NULL) {
        cPtr = expanded;
        cPtr[3] = 40;
        cPtr[4] = 50;
        printf("Expanded array: ");
        for (int i = 0; i < 5; i++) printf("%d ", cPtr[i]);
        printf("\\n");
    }

    free(mPtr);
    free(cPtr);
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "malloc() allocates raw uninitialized memory; calloc() allocates and initializes memory to zero; realloc() resizes existing blocks. Always check for NULL return.",
            keyConcepts: ["malloc() Raw Allocation", "calloc() Zero-Initialization", "realloc() Dynamic Resizing", "Out-of-Memory NULL Guard"],
            revisionNotes: "Never overwrite the original pointer directly: `ptr = realloc(ptr, ...)` loses the old address if realloc fails, creating a memory leak. Use a temporary pointer."
        }
    },

    "10-3": {
        content: `### 10.3 Releasing Memory and Preventing Leaks

Unlike Java, Python, or Go, C features **no automatic garbage collector**. Heap memory remains allocated until explicitly released by the programmer.

#### The \`free()\` Function
\`\`\`c
void free(void *ptr);
\`\`\`
- Releases the allocated heap memory block pointed to by \`ptr\` back to the system allocator.
- Calling \`free(NULL)\` is safe and performs no action.

#### Common Dynamic Memory Vulnerabilities
1. **Memory Leak:**
   - Occurs when allocated heap memory is abandoned without calling \`free()\`. The operating system cannot reclaim it while the process runs, consuming system RAM.
2. **Dangling Pointer:**
   - A pointer retaining the address of a freed block. Dereferencing it causes undefined behavior or crashes.
   - **Remedy:** Set \`ptr = NULL;\` immediately after calling \`free(ptr);\`.
3. **Double Free:**
   - Calling \`free()\` twice on the exact same address corrupts heap allocator metadata tables.
4. **Buffer Overflow (Heap Corruption):**
   - Writing past the allocated byte bounds of a heap buffer overwrites allocator headers.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Defensive Memory Deallocation Pattern',
                code: `#include <stdio.h>
#include <stdlib.h>

void safeFreeDemo(void) {
    int *data = (int*)malloc(10 * sizeof(int));
    if (!data) return;

    // Use allocated memory
    data[0] = 123;
    printf("Using heap memory: %d\\n", data[0]);

    // Step 1: Free allocated bytes
    free(data);

    // Step 2: Neutralize pointer to NULL
    data = NULL;

    // Step 3: Defensive guard protects against double-free
    if (data != NULL) {
        free(data);
    } else {
        printf("Safety check passed: No double-free attempted.\\n");
    }
}

int main(void) {
    safeFreeDemo();
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "free() deallocates heap memory. Failing to free memory causes memory leaks; freeing twice causes double-free errors; using freed memory causes dangling pointer bugs.",
            keyConcepts: ["free() Deallocation", "Memory Leaks", "Dangling Pointers & ptr = NULL", "Double Free Prevention"],
            revisionNotes: "Every single malloc() or calloc() in your codebase must have a matching free() call."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 11: STORAGE CLASSES AND PRE-PROCESSOR
    // ═════════════════════════════════════════════════════════════════════════
    "11-1": {
        content: `### 11.1 Introduction of Storage Classes in 'C'

A **storage class** in C defines four fundamental properties of a variable:
1. **Storage Location:** Where the variable is physically stored (RAM stack, Data segment, or CPU register).
2. **Initial / Default Value:** The value the variable holds before explicit assignment.
3. **Scope (Visibility):** The code boundaries where the variable can be accessed.
4. **Lifetime (Duration):** How long the variable retains its value in memory.

#### The Four Storage Classes in C
- \`auto\`
- \`register\`
- \`static\`
- \`extern\`

#### Quick Reference Matrix
| Storage Class | Storage Location | Default Initial Value | Scope | Lifetime |
| :--- | :--- | :--- | :--- | :--- |
| **\`auto\`** | Stack RAM | **Garbage value** | Local to block | Until block exits |
| **\`register\`** | CPU Register (or Stack) | **Garbage value** | Local to block | Until block exits |
| **\`static\`** | Data Segment RAM | **Zero (\`0\`)** | Local to block / File | Entire program execution |
| **\`extern\`** | Data Segment RAM | **Zero (\`0\`)** | Global (cross-file) | Entire program execution |`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Storage Class Characteristics Overview',
                code: `#include <stdio.h>

int main(void) {
    auto int localStack = 10;
    static int persistentVal; // Initialized to 0 by default

    printf("auto default location:   Stack (Value: %d)\\n", localStack);
    printf("static default value:    %d (Zero-initialized)\\n", persistentVal);

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Storage classes define storage location, default initial value, scope, and lifetime. The four C storage classes are auto, register, static, and extern.",
            keyConcepts: ["Storage Class Dimensions (Storage, Default, Scope, Lifetime)", "auto", "register", "static", "extern"],
            revisionNotes: "All local variables are auto by default; the auto keyword is rarely written explicitly in modern C."
        }
    },

    "11-2": {
        content: `### 11.2 Types of Storage Classes in 'C'

Let us examine the four storage class specifiers in technical detail.

#### 1. \`auto\` (Automatic)
- Default for all variables declared inside a block or function.
- Resides in the **Call Stack**.
- Destroyed immediately when the enclosing function terminates.

#### 2. \`register\`
- Hints to the compiler to store the variable in a high-speed **CPU register** rather than RAM for intensive loops.
- **Restriction:** You **cannot take the address (\`&var\`) of a register variable**, because CPU registers do not have memory RAM addresses!

#### 3. \`static\`
- **Static Local Variable:** Retains its value **between successive function calls**. It is initialized only once when the program starts.
- **Static Global Variable / Function:** Restricts visibility strictly to the **current source file**, hiding the symbol from other translation units (internal linkage).

#### 4. \`extern\` (External)
- Informs the compiler that a global variable or function is defined in **another source file**.
- Declares the symbol without allocating new storage (external linkage).`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Static Local Variable State Preservation',
                code: `#include <stdio.h>

void visitCounter(void) {
    // static local variable: allocated in Data segment, survives function return
    static int visit_count = 0;
    auto int local_var = 0;

    visit_count++;
    local_var++;

    printf("visit_count (static): %d | local_var (auto): %d\\n", 
           visit_count, local_var);
}

int main(void) {
    printf("Calling visitCounter 3 times:\\n");
    visitCounter(); // visit_count becomes 1
    visitCounter(); // visit_count becomes 2
    visitCounter(); // visit_count becomes 3

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "auto variables exist on the stack; register variables request CPU register storage (no & operator); static variables preserve values between calls; extern variables link symbols defined in other files.",
            keyConcepts: ["static Value Persistence", "register Address Restriction (&)", "extern Multi-File Linkage", "Internal vs External Linkage"],
            revisionNotes: "Use static local variables when you need a persistent counter inside a function without polluting global scope."
        }
    },

    "11-3": {
        content: `### 11.3 Introduction to the 'C' Pre-processor

The **C Preprocessor** is a text-processing engine that transforms your source code **before** actual compilation begins.

#### Characteristics of Preprocessor Directives
1. Every directive begins with a hash / pound symbol (**\`#\`**).
2. Directives are **not C statements**, so they **do not end with a semicolon (\`;\`)**.
3. Directives operate purely via lexical text substitution and pattern expansion.

#### Major Preprocessor Directives
- **\`#define\`:** Macro definition (constants and parameterized macros).
- **\`#undef\`:** Undefines an existing macro.
- **\`#include\`:** Inserts contents of an external header file.
- **\`#ifdef\` / \`#ifndef\` / \`#endif\`:** Conditional compilation checks.
- **\`#pragma\`:** Compiler-specific configuration options.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Inspecting Preprocessor Directives',
                code: `#include <stdio.h>

#define PLATFORM "x86_64 POSIX"
#define TIMEOUT_SECONDS 30

int main(void) {
    printf("Target Platform: %s\\n", PLATFORM);
    printf("Timeout:         %d seconds\\n", TIMEOUT_SECONDS);
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "The C Preprocessor processes directives (#) prior to compilation through text replacement and macro expansion without semicolons.",
            keyConcepts: ["Preprocessor Phase", "# Directive Syntax", "Textual Substitution", "Header Inclusion"],
            revisionNotes: "Run `gcc -E main.c` to view the raw preprocessed output before compilation."
        }
    },

    "11-4": {
        content: `### 11.4 Macro Substitution & Conditional Compilation

Macros are symbolic identifiers defined using \`#define\` that are replaced by the preprocessor.

#### 1. Object-Like Macros (Constants)
\`\`\`c
#define MAX_BUFFER 1024
#define PI 3.14159
\`\`\`

#### 2. Function-Like (Parameterized) Macros
Macros can accept arguments like functions, but without function call stack overhead:
\`\`\`c
#define SQUARE(x) ((x) * (x))
\`\`\`
- **CRITICAL PARENTHESIS RULE:** Always enclose macro parameters and the entire replacement expression in parentheses!
  \`\`\`c
  // WRONG: #define SQUARE(x) x * x
  int val = SQUARE(2 + 3); // Expands to: 2 + 3 * 2 + 3 = 11 (NOT 25!)
  
  // CORRECT: #define SQUARE(x) ((x) * (x))
  int val = SQUARE(2 + 3); // Expands to: ((2 + 3) * (2 + 3)) = 25
  \`\`\`

#### 3. Conditional Compilation
Enables compiling specific code blocks based on environment flags:
\`\`\`c
#ifdef DEBUG
    printf("Debug: variable state = %d\\n", x);
#endif
\`\`\``,
        codeSnippets: [
            {
                language: 'c',
                title: 'Parameterized Macros and Conditional Compilation',
                code: `#include <stdio.h>

#define MAX(a, b) (((a) > (b)) ? (a) : (b))
#define DEBUG_MODE 1

int main(void) {
    int x = 45, y = 82;
    int highest = MAX(x, y);
    printf("Highest value between %d and %d is: %d\\n", x, y, highest);

#if DEBUG_MODE
    printf("[DEBUG] Max evaluation completed successfully.\\n");
#endif

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Macros perform textual replacement. Always parenthesize macro parameters ((x)*(x)) to prevent precedence bugs. Conditional compilation (#ifdef, #if) tailors code to specific build targets.",
            keyConcepts: ["Object-Like Macros", "Function-Like Macros", "Parenthesis Safety Rule", "Conditional Compilation (#ifdef, #endif)"],
            revisionNotes: "Avoid side effects in macro calls: `SQUARE(x++)` increments x twice due to duplicate expansion."
        }
    },

    "11-5": {
        content: `### 11.5 File Inclusion and Header Guards

File inclusion is the mechanism of embedding the contents of external header files into your source file using \`#include\`.

#### Angular Brackets \`<...>\` vs. Double Quotes \`"..."\`
1. **\`#include <stdio.h>\` (Angular Brackets):**
   - Instructs the preprocessor to search standard **system library directories** (e.g., \`/usr/include\` on Linux).
2. **\`#include "custom.h"\` (Double Quotes):**
   - Instructs the preprocessor to search the **current working directory** first; if not found, it falls back to standard system directories.

#### The Duplicate Inclusion Problem & Header Guards
If a header file is included multiple times through nested dependencies, types and structs are defined repeatedly, triggering compiler errors.
- **Solution — Header Guards:**
  \`\`\`c
  #ifndef MY_HEADER_H
  #define MY_HEADER_H

  // Declarations, prototypes, and types go here

  #endif /* MY_HEADER_H */
  \`\`\`
- Alternatively, modern compilers support **\`#pragma once\`** at the top of headers.`,
        codeSnippets: [
            {
                language: 'c',
                title: 'Canonical Header Guard Structure',
                code: `#include <stdio.h>

// Simulating custom header guard
#ifndef CUSTOM_MATH_H
#define CUSTOM_MATH_H

int addNumbers(int a, int b) {
    return a + b;
}

#endif // CUSTOM_MATH_H

int main(void) {
    printf("Header guard pattern active.\\n");
    printf("Sum: %d\\n", addNumbers(15, 30));
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "#include <...> searches system libraries, while #include \"...\" searches local folders first. Header guards (#ifndef ... #define ... #endif) prevent duplicate definition errors from multiple inclusions.",
            keyConcepts: ["#include <lib.h> vs #include \"local.h\"", "Duplicate Inclusion Hazards", "Header Guards (#ifndef, #define, #endif)", "#pragma once"],
            revisionNotes: "Always protect every header file (.h) with header guards or `#pragma once`."
        }
    }
};

