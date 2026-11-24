/**
 * Enriched Content Data for Programming in 'C++' (Part 1: Modules 1 through 3)
 * Topics:
 * - Module 1: Introduction to Object Oriented Programming (1.1 - 1.5)
 * - Module 2: 'C++' Tokens and Type Casting (2.1 - 2.7)
 * - Module 3: Classes & Objects (3.1 - 3.7)
 */

module.exports = {
    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 1: INTRODUCTION TO OBJECT ORIENTED PROGRAMMING
    // ═════════════════════════════════════════════════════════════════════════
    "1-1": {
        content: `### 1.1 Concept of Object-Oriented Programming (OOP)

**Object-Oriented Programming (OOP)** is a programming paradigm organized around real-world **objects** containing both data (attributes) and code (methods/functions), rather than mere actions and logic.

#### Procedural vs. Object-Oriented Programming
In traditional **Procedural Programming** (such as standard C or Pascal):
- Programs are structured as collections of step-by-step procedures or subroutines.
- **Data is separated from functions:** Data flows freely across global functions, leaving it vulnerable to unintended modification.
- As systems scale, procedural codebases become difficult to maintain, test, and refactor.

In **Object-Oriented Programming** (such as C++):
- Programs are modeled as collections of interacting **objects**.
- **Data is tightly coupled with the functions that operate on it**, enforcing security and encapsulation.
- Code reusability is dramatically increased through inheritance and polymorphic interfaces.

#### Procedural (POP) vs. Object-Oriented (OOP) Comparison
| Feature | Procedural Programming (POP) | Object-Oriented Programming (OOP) |
| :--- | :--- | :--- |
| **Primary Focus** | Algorithms and sequence of procedures | Data structures and real-world objects |
| **Approach** | Top-Down design approach | Bottom-Up design approach |
| **Data Security** | Low; data moves freely across functions | High; data is hidden via access specifiers |
| **Decomposition** | Program decomposes into functions | Program decomposes into objects/classes |
| **Code Reusability** | Limited (functions only) | Vast (inheritance, polymorphism, templates) |
| **Real-World Modeling**| Difficult to model real-world behavior | Natural mapping of real-world entities |`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'OOP Object Modeling: Bank Account Entity',
                code: `#include <iostream>
#include <string>

// Blueprint representing a real-world Bank Account object
class BankAccount {
private:
    std::string accountHolder;
    double balance;

public:
    BankAccount(std::string name, double initialBalance) 
        : accountHolder(name), balance(initialBalance) {}

    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    void display() const {
        std::cout << "Account Holder: " << accountHolder 
                  << " | Current Balance: $" << balance << std::endl;
    }
};

int main() {
    BankAccount myAccount("Pranshu Pathak", 1500.0);
    myAccount.deposit(500.0);
    myAccount.display();
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "OOP organizes software around objects binding data with methods. Unlike Procedural programming (top-down, unprotected data), OOP uses a bottom-up approach with high data security and natural domain modeling.",
            keyConcepts: ["Procedural vs Object-Oriented", "Top-Down vs Bottom-Up Design", "Data-Function Binding", "Real-World Entity Modeling"],
            revisionNotes: "Remember: OOP models *what an entity is* and *what it can do*, bundling state and behavior together."
        }
    },

    "1-2": {
        content: `### 1.2 Features of OOP (The Four Pillars)

Object-Oriented Programming is anchored by four fundamental foundational pillars: **Encapsulation**, **Abstraction**, **Inheritance**, and **Polymorphism**.

\`\`\`
                       The 4 Pillars of OOP
      ┌───────────────────┼───────────────────┐
      ▼                   ▼                   ▼
 Encapsulation       Abstraction         Inheritance        Polymorphism
 (Data Hiding       (Hiding internal    (Code reuse        (One interface,
  & Bundling)        mechanisms)         & hierarchy)       many forms)
\`\`\`

#### 1. Encapsulation (Data Hiding)
- Bundling data variables and the member functions that manipulate them into a single unit (\`class\`).
- Restricts direct access to internal components using access specifiers (\`private\`, \`protected\`, \`public\`), preventing accidental corruption from external code.

#### 2. Abstraction (Essential Details Only)
- Displaying only essential features of an object to the outside world while hiding complex internal implementation mechanics.
- *Real-world analogy:* When you press the gas pedal of a car, you know the car accelerates; you do not need to understand electronic fuel injection or valve timing.

#### 3. Inheritance (Reusability & Extensibility)
- The mechanism by which a new class (**Derived / Child Class**) inherits the properties and behaviors of an existing class (**Base / Parent Class**).
- Eliminates redundant code duplication and creates natural hierarchical relationships (\`is-a\` relationship).

#### 4. Polymorphism ("Many Forms")
- The ability of a message or function to be processed in more than one form.
- **Compile-Time Polymorphism:** Function Overloading and Operator Overloading.
- **Runtime Polymorphism:** Virtual functions and dynamic method overriding.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Demonstrating the Four Pillars of OOP in C++',
                code: `#include <iostream>

// 1. Abstraction & 2. Encapsulation: Abstract Shape interface
class Shape {
protected:
    double dimension; // Encapsulated data
public:
    Shape(double d) : dimension(d) {}
    // 4. Polymorphism: Virtual function interface
    virtual double calculateArea() const = 0; 
};

// 3. Inheritance: Circle derives from Shape
class Circle : public Shape {
public:
    Circle(double r) : Shape(r) {}
    double calculateArea() const override {
        return 3.14159 * dimension * dimension;
    }
};

int main() {
    Circle c(5.0);
    std::cout << "Circle Area (Polymorphic call): " << c.calculateArea() << std::endl;
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "The four pillars of OOP are Encapsulation (bundling data and hiding private members), Abstraction (exposing only essential interfaces), Inheritance (reusing parent class capabilities), and Polymorphism (one interface presenting multiple implementations).",
            keyConcepts: ["Encapsulation & Access Modifiers", "Abstraction & Interfaces", "Inheritance (is-a)", "Polymorphism (Compile-time vs Runtime)"],
            revisionNotes: "Encapsulation is about data protection (private variables); Abstraction is about hiding implementation complexity."
        }
    },

    "1-3": {
        content: `### 1.3 Introduction to 'C++'

**C++** was designed and developed by Danish computer scientist **Bjarne Stroustrup** at AT&T Bell Laboratories in Murray Hill, New Jersey, starting in **1979**.

#### Motivation: "C with Classes"
Stroustrup was working on his Ph.D. analyzing distributed system simulations using **Simula 67** (which had classes and OOP, but was too slow) and **C** (which was blazing fast and close to hardware, but lacked high-level organization).
- He set out to combine the **raw execution speed and hardware access of C** with the **high-level organization of Simula**.
- Initially named **"C with Classes"** in 1979, it was officially renamed **C++** in **1983** (the \`++\` operator signifying the increment of C).

#### C++ Design Principles
1. **Zero-Overhead Principle:** What you don't use, you don't pay for. And what you do use, you couldn't hand-code any better.
2. **Backward Compatibility with C:** C++ was designed as a superset of C; almost all valid C programs compile cleanly under C++.
3. **Multi-Paradigm Support:** Supports Procedural, Object-Oriented, Generic (Templates), and Functional programming.

#### Major ISO C++ Standards
- **C++98 (ISO/IEC 14882:1998):** First official standardization including the Standard Template Library (STL).
- **C++03:** Bug fix and technical corrigendum release.
- **C++11 ("Modern C++"):** Revolutionary update introducing \`auto\`, lambda expressions, smart pointers, move semantics, and \`nullptr\`.
- **C++14 & C++17:** Generic lambdas, structured bindings, \`std::optional\`, filesystem library.
- **C++20:** Concepts, Ranges, Coroutines, and Modules.
- **C++23:** Standard library enhancements and multidimensional subscript operator (\`[]\`).`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Modern C++ Hello World & Feature Inspection',
                code: `#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::cout << "========================================\\n";
    std::cout << "    Modern C++ Systems Engine (HiGen)   \\n";
    std::cout << "    Designed by Bjarne Stroustrup       \\n";
    std::cout << "========================================\\n";

    // Modern C++11 auto deduction and vector collection
    std::vector<int> numbers = {10, 20, 30, 40, 50};
    int total = std::accumulate(numbers.begin(), numbers.end(), 0);

    std::cout << "Sum of elements using STL: " << total << std::endl;
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C++ was created by Bjarne Stroustrup in 1979 at Bell Labs as 'C with Classes'. Built on the Zero-Overhead Principle, modern C++ (C++11/C++20) provides multi-paradigm programming with high performance.",
            keyConcepts: ["Bjarne Stroustrup & Bell Labs", "Zero-Overhead Principle", "C Compatibility", "ISO Standards (C++98 to C++23)"],
            revisionNotes: "The name C++ was coined by Rick Mascitti in 1983, referencing C's ++ increment operator."
        }
    },

    "1-4": {
        content: `### 1.4 Structure of a 'C++' Program

A C++ program follows a structured architecture composed of preprocessor headers, namespaces, class definitions, and the mandatory \`main()\` entry function.

\`\`\`
┌────────────────────────────────────────────────────────┐
│ 1. Header Inclusion         (#include <iostream>)      │
├────────────────────────────────────────────────────────┤
│ 2. Namespace Declaration    (using namespace std;)     │
├────────────────────────────────────────────────────────┤
│ 3. Class Definitions        (class Engine { ... };)    │
├────────────────────────────────────────────────────────┤
│ 4. Global Declarations      (Global vars, typedefs)    │
├────────────────────────────────────────────────────────┤
│ 5. main() Entry Function    (int main() { ... })       │
│    {                                                   │
│        Object instantiations;                          │
│        Stream I/O (cin / cout);                        │
│        return 0;                                       │
│    }                                                   │
└────────────────────────────────────────────────────────┘
\`\`\`

#### Key Components of C++ Program Structure
1. **Header Inclusion (\`#include <iostream>\`):**
   - Standard C++ headers **omit the \`.h\` extension** (unlike C's \`<stdio.h>\`).
   - \`<iostream>\` defines input/output stream objects: \`std::cin\`, \`std::cout\`, \`std::cerr\`.
2. **Namespaces (\`using namespace std;\`):**
   - Namespaces prevent naming collisions in large software libraries.
   - All standard library entities reside inside namespace \`std\`.
3. **The \`main()\` Function:**
   - Must return type \`int\`. Returning \`0\` indicates successful execution to the operating system.
   - In standard C++, if control reaches the end of \`main()\` without an explicit \`return\`, the compiler implicitly inserts \`return 0;\`.
4. **Stream I/O Operators:**
   - **Insertion Operator (\`<<\`):** Pushes data into the output stream (\`cout << "Text";\`).
   - **Extraction Operator (\`>>\`):** Extracts data from the input stream (\`cin >> var;\`).`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Canonical C++ Program Architecture',
                code: `#include <iostream> // Header inclusion
#include <string>

using namespace std; // Namespace declaration

// Class definition section
class UserProfile {
public:
    string username;
    int age;

    void printDetails() const {
        cout << "User: " << username << " | Age: " << age << endl;
    }
};

// Main execution entry point
int main() {
    UserProfile user1;
    user1.username = "Pranshu Pathak";
    user1.age = 21;

    user1.printDetails();
    return 0; // Return success status code to OS
}`
            }
        ],
        aiSummary: {
            summary: "A C++ program consists of Header files (<iostream>), Namespaces (std), Class blueprints, and the main() function utilizing stream operators (<< and >>).",
            keyConcepts: ["<iostream> Stream Headers", "using namespace std;", "Stream Insertion (<<) & Extraction (>>)", "Implicit return 0 in main"],
            revisionNotes: "In professional enterprise codebases, avoid `using namespace std;` in header files to prevent namespace pollution; prefer explicit prefixes like `std::cout`."
        }
    },

    "1-5": {
        content: `### 1.5 Executing and Debugging a 'C++' Program

Running and debugging a C++ application involves invoking the compiler pipeline, checking for diagnostics, and analyzing runtime memory.

#### Compiling with GCC / Clang (\`g++\`)
C++ source files typically use the \`.cpp\`, \`.cc\`, or \`.cxx\` extensions.
\`\`\`bash
# Standard compilation with Modern C++ standard:
g++ -std=c++17 -Wall -Wextra main.cpp -o app

# Running the binary on Linux/macOS:
./app

# Running the binary on Windows:
app.exe
\`\`\`

#### Critical Compiler Warning Flags
- \`-std=c++17\` or \`-std=c++20\`: Specifies the target C++ ISO standard version.
- \`-Wall\`: Enables all primary compiler warnings.
- \`-Wextra\`: Enables additional aggressive diagnostic checks.
- \`-O2\` / \`-O3\`: Optimizes binary execution speed.
- \`-g\`: Emits DWARF debugging symbol tables for GDB.

#### Debugging C++ Applications
C++ runtime bugs often involve:
1. **Uncaught Exceptions (\`std::terminate\`):** When a \`throw\` occurs without a matching \`catch\` block.
2. **Segmentation Faults:** Dereferencing null pointers or indexing past vector boundaries.
3. **Memory Leaks:** Forgetting to \`delete\` objects allocated with \`new\`.
4. **Detecting Memory Bugs with Valgrind / AddressSanitizer (ASan):**
   \`\`\`bash
   g++ -fsanitize=address -g main.cpp -o app
   \`\`\`
   AddressSanitizer detects out-of-bounds access and use-after-free bugs with exact line numbers at runtime.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Defensive C++: Exception Handling & Boundary Safety',
                code: `#include <iostream>
#include <vector>
#include <stdexcept>

int main() {
    std::vector<int> data = {10, 20, 30};

    try {
        // Safe bound-checked access using .at() instead of unchecked operator[]
        std::cout << "Element at index 1: " << data.at(1) << std::endl;
        
        // This deliberately triggers std::out_of_range
        std::cout << "Accessing index 10: " << data.at(10) << std::endl;
    } catch (const std::out_of_range &ex) {
        std::cerr << "Caught Out-Of-Range Exception: " << ex.what() << std::endl;
    }

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C++ programs are compiled using g++ with flags like -std=c++17, -Wall, and -g. Debugging targets uncaught exceptions and memory issues, verified using AddressSanitizer and GDB.",
            keyConcepts: ["g++ Compiler Flags (-std, -Wall, -g)", "AddressSanitizer (-fsanitize=address)", "Safe Vector Access (.at() vs [])", "GDB Debugging"],
            revisionNotes: "Use `vec.at(i)` during development for automatic bounds checking, which throws std::out_of_range on index errors."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 2: 'C++' TOKENS AND TYPE CASTING
    // ═════════════════════════════════════════════════════════════════════════
    "2-1": {
        content: `### 2.1 Keywords and Identifiers in 'C++'

In C++, source code is broken down into **Tokens**: Keywords, Identifiers, Literals, Operators, and Punctuators.

#### 1. C++ Keywords
C++ inherits all 32 ANSI C keywords and adds dozens of specialized keywords for object orientation, templates, memory management, and exceptions. Modern C++ features **over 90 reserved keywords**:

| Category | Key C++ Keywords |
| :--- | :--- |
| **OOP & Access** | \`class\`, \`public\`, \`private\`, \`protected\`, \`friend\`, \`this\`, \`virtual\` |
| **Memory** | \`new\`, \`delete\`, \`nullptr\` |
| **Generics & Casts** | \`template\`, \`typename\`, \`static_cast\`, \`dynamic_cast\`, \`const_cast\`, \`reinterpret_cast\` |
| **Exceptions** | \`try\`, \`catch\`, \`throw\`, \`noexcept\` |
| **Types & Storage** | \`bool\`, \`true\`, \`false\`, \`auto\`, \`decltype\`, \`constexpr\`, \`explicit\`, \`inline\` |
| **Namespaces** | \`namespace\`, \`using\` |

#### 2. C++ Identifiers
Identifiers are names assigned by programmers to classes, functions, variables, and namespaces.
- Rules: Letters (\`A-Z\`, \`a-z\`), digits (\`0-9\`), and underscore (\`_\`).
- **Cannot begin with a digit.**
- Identifiers starting with a double underscore (\`__\`) or an underscore followed by an uppercase letter (\`_A\`) are reserved for compiler implementations.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Keywords and Clean Identifier Conventions',
                code: `#include <iostream>

class StudentRecord { // PascalCase for Classes
private:
    int studentId;    // camelCase for variables
    double gpaScore;

public:
    StudentRecord(int id, double gpa) : studentId(id), gpaScore(gpa) {}

    void display() const {
        std::cout << "ID: " << studentId << " | GPA: " << gpaScore << std::endl;
    }
};

int main() {
    StudentRecord student(101, 3.88);
    student.display();
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C++ expands C's keywords with class, new, delete, template, virtual, constexpr, and explicit. Identifiers follow naming rules: starting with letters or underscores without using keywords.",
            keyConcepts: ["C++ Keywords Expansion", "Identifier Naming Rules", "Reserved Compiler Prefixes (__, _Upper)", "Naming Conventions (PascalCase/camelCase)"],
            revisionNotes: "Never define identifiers with double underscores like `__myVar`; these are reserved for compiler internal symbols."
        }
    },

    "2-2": {
        content: `### 2.2 Operators in 'C++'

C++ supports all standard C operators while introducing specialized operators for OOP, scope resolution, and memory management.

#### 1. The Scope Resolution Operator (\`::\`)
The **\`::\`** operator is used to:
- Access global variables when shadowed by a local variable: \`::globalVar\`.
- Define member functions outside of class declarations: \`ClassName::functionName()\`.
- Access static class members: \`ClassName::staticMember\`.
- Qualify symbols inside namespaces: \`std::cout\`.

#### 2. Stream Insertion (\`<<\`) and Extraction (\`>>\`)
- In C, \`<<\` and \`>>\` are solely bitwise shifts. In C++, they are overloaded for stream I/O via \`<iostream>\`.

#### 3. Memory Management Operators: \`new\` and \`delete\`
- **\`new\`**: Allocates memory on the heap and automatically invokes the object's **constructor**.
- **\`delete\`**: Invokes the object's **destructor** and frees the heap memory.
- Array forms: \`new[]\` and \`delete[]\`.

#### 4. Pointer-to-Member Operators
- \`.*\` and \`->*\` allow dereferencing member pointers on class instances.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Scope Resolution (::) and Dynamic new/delete',
                code: `#include <iostream>

int counter = 1000; // Global variable

int main() {
    int counter = 50; // Local variable shadows global

    std::cout << "Local counter:            " << counter << std::endl;
    std::cout << "Global counter via (::):  " << ::counter << std::endl;

    // Dynamic allocation via new (type-safe, constructor invoked)
    int *dynInt = new int(42);
    std::cout << "Dynamic heap integer:     " << *dynInt << std::endl;

    delete dynInt; // Deallocation
    dynInt = nullptr;

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C++ introduces the Scope Resolution Operator (::), Stream operators (<<, >>), and type-safe dynamic allocation operators (new, delete) that automatically execute constructors and destructors.",
            keyConcepts: ["Scope Resolution Operator (::)", "Global Variable Un-shadowing", "new vs malloc (Constructor execution)", "delete vs free (Destructor execution)"],
            revisionNotes: "Always pair `new` with `delete`, and `new[]` with `delete[]`. Mixing them leads to heap allocator corruption."
        }
    },

    "2-3": {
        content: `### 2.3 Constants and constexpr in 'C++'

In modern C++, constants provide compile-time safety and performance optimization through **\`const\`** and **\`constexpr\`**.

#### 1. The \`const\` Qualifier
- Specifies that a variable's value cannot be modified after initialization.
- In C++, a \`const\` global variable has **internal linkage** by default (restricted to the current file), unlike C.

#### 2. \`constexpr\` (Compile-Time Expressions, C++11)
- Specifies that the value of an expression or function can be **evaluated at compile time**.
- Allows calculations to happen during compilation, eliminating runtime computation overhead and enabling use in array bounds and template arguments.

#### Difference: \`const\` vs. \`constexpr\`
| Feature | \`const\` | \`constexpr\` |
| :--- | :--- | :--- |
| **Evaluation Time** | Can be computed at compile time OR runtime | **Guaranteed to be evaluated at compile time** |
| **Use as Array Bound**| Only if initialized with a constant literal | Yes, always usable in array dimensions |
| **Functions** | Marks member methods as non-mutating | Allows functions to run at compile time |`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Compile-Time Calculations using constexpr',
                code: `#include <iostream>

// constexpr function evaluated during compilation
constexpr int calculateFactorial(int n) {
    return (n <= 1) ? 1 : (n * calculateFactorial(n - 1));
}

int main() {
    // Computed by the compiler at compile time:
    constexpr int fact5 = calculateFactorial(5);
    
    // Can be used directly as array bound!
    int buffer[fact5]; // Size 120 array allocated statically

    std::cout << "Compile-time Factorial(5) = " << fact5 << std::endl;
    std::cout << "Buffer size: " << sizeof(buffer) / sizeof(buffer[0]) << " elements" << std::endl;

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "const ensures immutability, while constexpr guarantees compile-time evaluation. constexpr functions can compute values during compilation for array dimensions and zero-overhead performance.",
            keyConcepts: ["const (Read-Only Safety)", "constexpr (Compile-Time Execution)", "Array Bounds via constexpr", "Zero Runtime Overhead"],
            revisionNotes: "Use `constexpr` whenever a value is known at compile time to maximize optimization."
        }
    },

    "2-4": {
        content: `### 2.4 Variables, References, and auto in 'C++'

C++ introduces powerful modern variable abstractions: **Reference Variables** and **Automatic Type Deduction (\`auto\`)**.

#### 1. Reference Variables (\`type &ref = original;\`)
A **reference** is an **alias (alternate name)** for an existing variable.
- Once initialized, a reference cannot be rebound to point to another variable.
- Unlike pointers, references cannot be \`NULL\` and do not require dereferencing operators (\`*\`).
- Syntactically treated as a normal variable, but accesses the original memory location directly.

#### References vs. Pointers
| Feature | Reference (\`&\`) | Pointer (\`*\`) |
| :--- | :--- | :--- |
| **Reassignment** | Cannot be rebound to another object | Can be reassigned freely |
| **Nullability** | **Cannot be NULL** (must bind to valid object) | Can hold \`nullptr\` |
| **Syntax** | Direct access (no dereferencing needed) | Requires dereferencing (\`*ptr\`) |
| **Memory Address** | Shares the address of the target | Holds its own distinct memory address |

#### 2. Automatic Type Deduction (\`auto\`, C++11)
The \`auto\` keyword instructs the compiler to automatically deduce the variable's type from its initializer expression:
\`\`\`cpp
auto x = 5;          // deduced as int
auto pi = 3.1415;    // deduced as double
auto name = "HiGen"; // deduced as const char*
\`\`\``,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Reference Semantics and auto Type Deduction',
                code: `#include <iostream>
#include <vector>

int main() {
    int original = 50;
    int &alias = original; // alias is a reference to original

    alias = 99; // Modifying alias directly modifies original!
    std::cout << "Original after alias edit: " << original << std::endl;
    std::cout << "Address of original: " << &original << std::endl;
    std::cout << "Address of alias:    " << &alias << " (Identical!)\\n" << std::endl;

    // auto type deduction with complex STL types
    std::vector<std::string> cities = {"Tokyo", "Paris", "New York"};
    for (const auto &city : cities) { // Clean range-based for loop
        std::cout << "City: " << city << std::endl;
    }

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "A reference variable (&) acts as a non-null, immutable alias for an existing object. The auto keyword enables compile-time type deduction, simplifying complex type expressions.",
            keyConcepts: ["Reference Aliases (&)", "References vs Pointers", "auto Keyword (Type Deduction)", "Range-Based For Loops"],
            revisionNotes: "Always pass large objects by const reference (`const MyClass &obj`) to avoid expensive copy operations."
        }
    },

    "2-5": {
        content: `### 2.5 Data Types and Type Casting in 'C++'

C++ expands C's primary types with native **boolean** (\`bool\`), wide character sets, and four specialized, type-safe **C++ Casting Operators**.

#### Native Boolean (\`bool\`)
- Takes values \`true\` (evaluates to 1) and \`false\` (evaluates to 0).
- Occupies 1 byte in memory.

#### The Four Named C++ Casting Operators
In C, casting is written as \`(int)val\`. C-style casting is dangerous because it blindly overrides type rules. C++ introduces four explicit, intention-revealing casts:

\`\`\`
                          C++ Named Casts
     ┌────────────────────┼────────────────────┐
     ▼                    ▼                    ▼
static_cast          dynamic_cast          const_cast        reinterpret_cast
(Compile-time        (Runtime safe         (Add/remove       (Dangerous low-level
 conversions)        downcasting)          const qualifier)   reinterpretation)
\`\`\`

1. **\`static_cast<Type>(expr)\`:**
   - Standard compile-time conversions (e.g., float to int, or related pointers). Validated by compiler.
2. **\`dynamic_cast<Type*>(ptr)\`:**
   - Used for **safe downcasting** across polymorphic inheritance hierarchies. Evaluated at runtime using RTTI; returns \`nullptr\` on failure.
3. **\`const_cast<Type>(expr)\`:**
   - Explicitly adds or removes the \`const\` qualifier from a variable.
4. **\`reinterpret_cast<Type>(expr)\`:**
   - Reinterprets raw byte sequences without changing bit representations (e.g., pointer to integer).`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'static_cast vs C-Style Cast Safety',
                code: `#include <iostream>

int main() {
    double preciseValue = 45.789;

    // Safe C++ static_cast
    int truncated = static_cast<int>(preciseValue);
    std::cout << "Original Double: " << preciseValue << std::endl;
    std::cout << "static_cast:     " << truncated << std::endl;

    // Boolean display format
    bool isActive = true;
    std::cout << "Bool numeric: " << isActive << " | Bool alpha: " 
              << std::boolalpha << isActive << std::endl;

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C++ introduces native bool types and replaces unsafe C-style casting with four explicit operators: static_cast, dynamic_cast (polymorphic RTTI), const_cast, and reinterpret_cast.",
            keyConcepts: ["bool Data Type & std::boolalpha", "static_cast (Standard conversions)", "dynamic_cast (Safe Downcasting via RTTI)", "const_cast & reinterpret_cast"],
            revisionNotes: "Never use old C-style casts `(int)x` in C++; prefer `static_cast<int>(x)` for clarity and compiler verification."
        }
    },

    "2-6": {
        content: `### 2.6 Precedence of Operators in 'C++'

C++ operator precedence dictates evaluation order in compound expressions. C++ includes all C operators plus additional operators for scope, member access, and memory allocation.

#### Operator Precedence Hierarchy (Highest to Lowest)
| Precedence Level | Operators | Associativity |
| :---: | :--- | :---: |
| **1 (Highest)** | Scope resolution \`::\` | Left-to-Right |
| **2** | Postfix \`()\`, \`[]\`, \`.\`, \`->\`, \`x++\`, \`x--\`, \`typeid\`, C++ casts | Left-to-Right |
| **3** | Unary \`++x\`, \`--x\`, \`+\`, \`-\`, \`!\`, \`~\`, \`*\`, \`&\`, \`sizeof\`, \`new\`, \`delete\` | **Right-to-Left** |
| **4** | Pointer-to-Member \`.*\` , \`->*\` | Left-to-Right |
| **5** | Multiplicative \`*\`, \`/\`, \`%\` | Left-to-Right |
| **6** | Additive \`+\`, \`-\` | Left-to-Right |
| **7** | Shift \`<<\`, \`>>\` | Left-to-Right |
| **8** | Three-way Comparison \`<=>\` (C++20 Spaceship) | Left-to-Right |
| **9** | Relational \`<\`, \`<=\`, \`>\`, \`>=\` | Left-to-Right |
| **10** | Equality \`==\`, \`!=\` | Left-to-Right |
| **11-13** | Bitwise \`&\`, \`^\`, \`|\` | Left-to-Right |
| **14-15** | Logical \`&&\`, \`||\` | Left-to-Right |
| **16** | Ternary Conditional \`? :\` | **Right-to-Left** |
| **17** | Assignment \`=\`, \`+=\`, \`-=\`, etc. | **Right-to-Left** |
| **18 (Lowest)** | Comma \`,\` | Left-to-Right |`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Operator Precedence and Stream Insertion Evaluation',
                code: `#include <iostream>

int main() {
    int a = 5, b = 10, c = 2;

    // Evaluated as: a + (b * c)
    int res = a + b * c; 
    std::cout << "5 + 10 * 2 = " << res << std::endl;

    // Relational vs Shift precedence: << has higher precedence than comparison!
    // WRONG: std::cout << 5 < 10 << std::endl; (Syntax error!)
    // CORRECT: Parenthesize comparisons when printing
    std::cout << "Is 5 < 10? " << (5 < 10 ? "Yes" : "No") << std::endl;

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C++ operator precedence ranks Scope Resolution (::) highest, followed by Member Access, Arithmetic, Stream Shifts (<<, >>), Comparisons, and Assignments.",
            keyConcepts: ["Scope Resolution Highest Priority", "Stream Shift Precedence Hazards", "Spaceship Operator <=> (C++20)", "Associativity Rules"],
            revisionNotes: "Always wrap relational or bitwise expressions in parentheses when streaming with `cout << (x == y)`."
        }
    },

    "2-7": {
        content: `### 2.7 Scope Resolution & Namespaces in 'C++'

In large enterprise software projects containing millions of lines of code and numerous external libraries, variable and class name collisions are common. C++ solves this using **Namespaces**.

#### 1. What is a Namespace?
A **namespace** is a declarative region that provides a distinct scope to the identifiers (types, functions, variables) declared within it.

\`\`\`cpp
namespace AudioEngine {
    int sampleRate = 44100;
    void init() { /* ... */ }
}

namespace GraphicsEngine {
    int sampleRate = 60; // No collision with AudioEngine!
    void init() { /* ... */ }
}
\`\`\`

#### 2. Accessing Namespace Entities
- **Explicit Qualification:** \`AudioEngine::init();\`
- **Using Directive:** \`using namespace AudioEngine;\` (Brings all symbols into local scope).
- **Using Declaration:** \`using AudioEngine::sampleRate;\` (Selectively imports one symbol).

#### 3. Anonymous (Unnamed) Namespaces
Namespaces without a name restrict visibility strictly to the current translation unit (file), serving as the modern C++ replacement for C's \`static\` globals:
\`\`\`cpp
namespace {
    int filePrivateToken = 12345; // Visible only within this .cpp file
}
\`\`\``,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Custom Namespaces and Symbol Resolution',
                code: `#include <iostream>

namespace NetworkModule {
    int port = 8080;
    void connect() {
        std::cout << "Connecting via port: " << port << std::endl;
    }
}

namespace DatabaseModule {
    int port = 5432;
    void connect() {
        std::cout << "Connecting to database on port: " << port << std::endl;
    }
}

int main() {
    // Disambiguated access via Scope Resolution Operator
    NetworkModule::connect();
    DatabaseModule::connect();

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Namespaces group identifiers into distinct named scopes, preventing symbol collisions across libraries. Anonymous namespaces replace static globals for file-local linkage.",
            keyConcepts: ["Namespace Declarations", "Scope Resolution Disambiguation", "using Directives vs using Declarations", "Anonymous Namespaces"],
            revisionNotes: "Prefer explicit namespace qualification (`std::cout`) in header files rather than `using namespace std;` to avoid name clashes."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 3: CLASSES & OBJECTS
    // ═════════════════════════════════════════════════════════════════════════
    "3-1": {
        content: `### 3.1 Classes & Access Specifiers in 'C++'

A **class** is a user-defined blueprint or prototype from which real-world **objects** are created. An **object** is a concrete instance of a class occupying physical memory.

#### Class Syntax & Access Specifiers
A class is declared using the \`class\` keyword. Its internal members are governed by three access specifiers:

\`\`\`cpp
class ClassName {
private:
    // Accessible ONLY by member functions of this class
protected:
    // Accessible by this class AND derived (child) classes
public:
    // Accessible by ANY external code
};
\`\`\`

#### Access Specifier Visibility Matrix
| Access Specifier | Accessible Inside Same Class? | Accessible Inside Derived Class? | Accessible from Outside / main()? |
| :--- | :---: | :---: | :---: |
| **\`public\`** | Yes | Yes | **Yes** |
| **\`protected\`**| Yes | **Yes** | **No** |
| **\`private\`** (Default)| Yes | **No** | **No** |

#### Critical Difference: \`class\` vs. \`struct\` in C++
In C++, both \`class\` and \`struct\` can have data members and functions. The only difference is their default access level:
- In a **\`class\`**, members are **\`private\`** by default.
- In a **\`struct\`**, members are **\`public\`** by default.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Class Declaration and Access Specifiers',
                code: `#include <iostream>
#include <string>

class Employee {
private:
    double salary; // Private: hidden from external access

public:
    int id;
    std::string name;

    // Setter for controlled private data access
    void setSalary(double s) {
        if (s > 0) salary = s;
    }

    // Getter
    double getSalary() const {
        return salary;
    }
};

int main() {
    Employee emp;
    emp.id = 101;
    emp.name = "Alice";
    // emp.salary = 90000; // COMPILATION ERROR: salary is private!
    
    emp.setSalary(95000.0); // Encapsulated access
    std::cout << "Employee: " << emp.name << " | Salary: $" << emp.getSalary() << std::endl;

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "A class is a user-defined blueprint; an object is an instance. Access specifiers (private, protected, public) enforce encapsulation. In C++, class members are private by default; struct members are public.",
            keyConcepts: ["Class Blueprint vs Object Instance", "public, private, protected Access Specifiers", "Encapsulation Getters/Setters", "class vs struct Defaults"],
            revisionNotes: "Always make member variables private and expose controlled access via public getter/setter methods."
        }
    },

    "3-2": {
        content: `### 3.2 Defining Member Functions Inside vs. Outside Classes

In C++, member functions can be defined in two ways:
1. **Inside the class definition** (Implicitly Inlined)
2. **Outside the class definition** using the **Scope Resolution Operator (\`::\`)**

#### 1. Inside-Class Definition
When a function is defined directly inside the class body, the C++ compiler automatically treats it as an **inline function**:
\`\`\`cpp
class Rectangle {
public:
    int area(int w, int h) { return w * h; } // Automatically inlined
};
\`\`\`

#### 2. Outside-Class Definition via Scope Resolution (\`::\`)
In production software engineering, class prototypes are kept in **header files (\`.h\`)**, while their function definitions are placed in separate **implementation files (\`.cpp\`)**:
\`\`\`cpp
// In Rectangle.h
class Rectangle {
public:
    int area(int w, int h); // Prototype only
};

// In Rectangle.cpp
int Rectangle::area(int w, int h) {
    return w * h;
}
\`\`\`

#### Syntax of Outside Definition:
\`\`\`cpp
return_type ClassName::functionName(parameter_list) {
    // Body
}
\`\`\``,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Inside vs Outside Member Function Definitions',
                code: `#include <iostream>

class Box {
private:
    double length, width, height;

public:
    // Defined inside class: Inlined
    void setDimensions(double l, double w, double h) {
        length = l; width = w; height = h;
    }

    // Declared inside class, defined outside
    double calculateVolume() const;
};

// Definition outside the class using Scope Resolution (::)
double Box::calculateVolume() const {
    return length * width * height;
}

int main() {
    Box myBox;
    myBox.setDimensions(5.0, 4.0, 3.0);
    std::cout << "Box Volume: " << myBox.calculateVolume() << " cubic units" << std::endl;
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Member functions defined inside a class are automatically inlined. Outside-class definitions use the Scope Resolution Operator (ClassName::methodName) to separate interfaces from implementation.",
            keyConcepts: ["Inline Member Functions", "Outside Definition via Class::", "Separation of Interface and Implementation", "Const Member Methods"],
            revisionNotes: "Mark methods that do not modify member variables with the `const` qualifier: `double getVal() const;`."
        }
    },

    "3-3": {
        content: `### 3.3 Array of Objects in 'C++'

An **Array of Objects** allows you to store and manage multiple object instances of the same class under a single indexed collection.

#### Declaration & Instantiation
\`\`\`cpp
ClassName objectArray[SIZE];
\`\`\`
- When an array of objects is declared, the class's **default constructor** is automatically called for every single object in the array.
- For an array of size N, the default constructor executes N times.

#### Initializing Arrays of Objects with Parameterized Constructors
You can initialize array elements using explicit constructor calls in an initializer list:
\`\`\`cpp
Student classroom[3] = {
    Student(101, "Alice"),
    Student(102, "Bob"),
    Student(103, "Charlie")
};
\`\`\`

#### Invoking Methods on Object Arrays
Access individual objects via zero-based subscript indexing, followed by the dot operator:
\`\`\`cpp
classroom[i].displayGrade();
\`\`\``,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Array of Objects with Parameterized Initializers',
                code: `#include <iostream>
#include <string>

class Product {
private:
    std::string name;
    double price;

public:
    Product(std::string n = "Unnamed", double p = 0.0) : name(n), price(p) {}

    void print() const {
        std::cout << "Product: " << name << " | Price: $" << price << std::endl;
    }
};

int main() {
    // Array of 3 Product objects
    Product inventory[3] = {
        Product("Mechanical Keyboard", 129.99),
        Product("Gaming Mouse", 69.50),
        Product("UltraWide Monitor", 349.00)
    };

    std::cout << "--- Store Inventory ---\\n";
    for (int i = 0; i < 3; i++) {
        inventory[i].print();
    }

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "An Array of Objects stores multiple instances of a class. The constructor executes for each element during array allocation. Elements are accessed via arr[i].member.",
            keyConcepts: ["Array of Class Instances", "Repeated Constructor Execution", "Initializer Lists for Object Arrays"],
            revisionNotes: "If a class defines a parameterized constructor, you must also provide a default constructor to declare uninitialized arrays like `MyClass arr[10];`."
        }
    },

    "3-4": {
        content: `### 3.4 Managing Console Stream I/O in 'C++'

C++ manages console input and output through an object-oriented stream pipeline provided by **\`<iostream>\`**.

#### The Standard Stream Objects
1. **\`std::cout\` (Standard Output):** Buffered output stream connected to the display console.
2. **\`std::cin\` (Standard Input):** Buffered input stream connected to the keyboard.
3. **\`std::cerr\` (Standard Error):** **Unbuffered** error stream that writes directly to the screen immediately without buffering.
4. **\`std::clog\` (Standard Log):** Buffered error/logging stream.

#### Stream State Flags
Input streams track their health using internal bit flags:
- **\`cin.good()\`**: Returns true if the stream is healthy and ready.
- **\`cin.fail()\`**: Returns true if a type mismatch occurred (e.g., typing "abc" when an integer was expected).
- **\`cin.eof()\`**: Returns true if End of File was encountered.
- **\`cin.bad()\`**: Returns true on fatal low-level I/O failure.
- **\`cin.clear()\`**: Resets error flags so future input can be read.
- **\`cin.ignore()\`**: Discards unwanted characters (such as leftover newline characters) from the input buffer.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Robust Console Input Validation & Stream Recovery',
                code: `#include <iostream>
#include <limits>

int main() {
    int age;
    std::cout << "Enter your age: ";

    // Loop until valid integer input is supplied
    while (!(std::cin >> age)) {
        std::cout << "Invalid input! Please enter a numeric age: ";
        std::cin.clear(); // Clear stream fail flag
        // Discard bad input up to the newline
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\\n');
    }

    std::cout << "Validated age: " << age << std::endl;
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C++ stream I/O uses cout (buffered stdout), cin (stdin), cerr (unbuffered stderr), and clog (buffered log). Stream states are verified with good(), fail(), and restored via clear() and ignore().",
            keyConcepts: ["Stream Objects (cout, cin, cerr, clog)", "Unbuffered cerr for Instant Diagnostics", "Stream Flags (fail, eof, bad)", "Buffer Clearing with cin.clear()"],
            revisionNotes: "Always use `cerr` instead of `cout` for error messages so errors are printed immediately even if output is redirected."
        }
    },

    "3-5": {
        content: `### 3.5 'C++' Stream Class Hierarchy

In C++, input and output streams are designed using an inheritance hierarchy rooted in the \`ios_base\` class.

\`\`\`
                          ios_base (Formatting Flags & State)
                                     ▲
                                     │
                             ios (Char Traits & Buffers)
                         ┌───────────┴───────────┐
                         ▼                       ▼
                      istream                 ostream
                   (cin, >>)               (cout, cerr, <<)
                         ▲                       ▲
                         │                       │
                         └───────────┬───────────┘
                                     ▼
                                  iostream
                                (cin & cout)
\`\`\`

#### Major Stream Classes
1. **\`ios_base\`:** Base class independent of character type, defining formatting flags, open modes, and I/O state enums.
2. **\`basic_ios\`:** Manages the underlying stream buffer pointer (\`streambuf\`).
3. **\`istream\`:** Input stream class providing extraction operators (\`>>\`) and methods like \`get()\`, \`getline()\`, and \`read()\`.
4. **\`ostream\`:** Output stream class providing insertion operators (\`<<\`) and methods like \`put()\` and \`write()\`.
5. **\`iostream\`:** Inherits from both \`istream\` and \`ostream\` via multiple inheritance for bidirectional stream access.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Inspecting Stream Hierarchy State Flags',
                code: `#include <iostream>

int main() {
    std::cout << "Stream Hierarchy State Check:\\n";
    std::cout << "cout.good(): " << std::cout.good() << std::endl;
    std::cout << "cin.good():  " << std::cin.good() << std::endl;

    // Stream width configuration via ios_base method
    std::cout.width(10);
    std::cout << "HiGen" << " [Formatted Output]" << std::endl;

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C++ stream classes are arranged in an inheritance hierarchy: ios_base -> basic_ios -> istream/ostream -> iostream. They bind stream buffers to devices.",
            keyConcepts: ["ios_base Foundation", "istream Extraction & ostream Insertion", "Bidirectional iostream", "Underlying streambuf"],
            revisionNotes: "Understanding the stream hierarchy explains why fstream (files) and stringstream (strings) share the same `<<` and `>>` operators as cout and cin."
        }
    },

    "3-6": {
        content: `### 3.6 Formatted and Unformatted Console I/O

C++ supports both **formatted I/O** (which interprets and converts data types) and **unformatted I/O** (which operates on raw byte blocks without transformation).

#### 1. Formatted I/O (\`<<\` and \`>>\`)
- Automatically parses and formats primitives: integers, floats, and strings.
- \`cin >> str\` stops reading upon encountering whitespace (spaces, tabs, newlines).

#### 2. Unformatted I/O Functions
- **\`cin.get(char &ch)\`:** Reads a single character, **including whitespace**.
- **\`cout.put(char ch)\`:** Writes a single character to output.
- **\`cin.getline(char *buffer, int size)\`:** Reads a full line of text including embedded spaces into a C-string until a newline is reached.
- **\`std::getline(cin, stringObj)\`:** Safe, dynamic C++ string reader.
- **\`cin.read(char *buf, int n)\`:** Reads raw n bytes without null termination.
- **\`cout.write(const char *buf, int n)\`:** Writes raw n bytes directly.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Unformatted Console I/O: Reading Lines with Spaces',
                code: `#include <iostream>
#include <string>

int main() {
    std::string fullName;
    std::cout << "Enter full name (with spaces): ";
    
    // std::getline reads the whole line including spaces
    std::getline(std::cin, fullName);

    std::cout << "Formatted line output: Hello, " << fullName << "!" << std::endl;

    // Single character unformatted put
    std::cout << "Status code: ";
    std::cout.put('O');
    std::cout.put('K');
    std::cout.put('\\n');

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Formatted I/O (<<, >>) parses data types and stops at whitespace. Unformatted I/O (get, put, getline, read, write) reads raw characters and whole lines without stripping whitespace.",
            keyConcepts: ["Whitespace Delimitation in cin >>", "std::getline for Line Input", "cin.get() and cout.put()", "Raw Binary read() and write()"],
            revisionNotes: "If switching from `cin >> number` to `std::getline()`, call `cin.ignore()` first to consume the residual newline character."
        }
    },

    "3-7": {
        content: `### 3.7 Usage of Manipulators (\`<iomanip>\`)

**Manipulators** are special functions inserted directly into the stream pipeline using \`<<\` or \`>>\` to format output and control stream states.

#### Standard Manipulators
- **Without Parameters (in \`<iostream>\`):**
  - \`std::endl\`: Inserts a newline character (\`'\\n'\`) and **flushes the output buffer**.
  - \`std::flush\`: Flushes the stream buffer without writing a newline.
  - \`std::boolalpha\` / \`std::noboolalpha\`: Displays booleans as "true"/"false" instead of 1/0.
  - \`std::hex\`, \`std::oct\`, \`std::dec\`: Switches integer numeric bases.
  - \`std::fixed\` / \`std::scientific\`: Sets floating-point output format.

#### Parameterized Manipulators (in \`<iomanip>\`)
- **\`setw(int n)\`:** Sets field width for the **very next** output value (non-sticky).
- **\`setprecision(int n)\`:** Controls total significant digits, or exact decimal places when combined with \`std::fixed\`.
- **\`setfill(char ch)\`:** Sets the fill padding character (e.g., zero-padding).`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Tabular Data Formatting with <iomanip>',
                code: `#include <iostream>
#include <iomanip>

int main() {
    double price1 = 19.99, price2 = 1250.5;

    std::cout << "--- Sales Invoice Table ---\\n";
    // Fixed decimal notation with 2 decimal places
    std::cout << std::fixed << std::setprecision(2);

    // Formatted columns using setw and setfill
    std::cout << std::left  << std::setw(15) << "Item"
              << std::right << std::setw(10) << "Price ($)" << std::endl;
    std::cout << std::setfill('-') << std::setw(25) << "" << std::endl;
    
    std::cout << std::setfill(' '); // Reset fill character
    std::cout << std::left  << std::setw(15) << "Book" 
              << std::right << std::setw(10) << price1 << std::endl;
    std::cout << std::left  << std::setw(15) << "Laptop" 
              << std::right << std::setw(10) << price2 << std::endl;

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Manipulators format stream outputs. Parameterized manipulators in <iomanip> include setw (column width), setprecision (decimal places with fixed), and setfill (padding character).",
            keyConcepts: ["endl vs \\n (Buffer Flushing)", "boolalpha / hex / dec", "setw() Column Alignment", "setprecision() & std::fixed"],
            revisionNotes: "`setw()` applies only to the immediate next output item; all other manipulators like `setprecision()` remain active until explicitly changed."
        }
    }
};

