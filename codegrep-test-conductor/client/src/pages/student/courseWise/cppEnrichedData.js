// Auto-generated enriched C++ curriculum data
export const cppEnrichedData = {
  "1-1": {
    "content": "### 1.1 Concept of Object-Oriented Programming (OOP)\n\n**Object-Oriented Programming (OOP)** is a programming paradigm organized around real-world **objects** containing both data (attributes) and code (methods/functions), rather than mere actions and logic.\n\n#### Procedural vs. Object-Oriented Programming\nIn traditional **Procedural Programming** (such as standard C or Pascal):\n- Programs are structured as collections of step-by-step procedures or subroutines.\n- **Data is separated from functions:** Data flows freely across global functions, leaving it vulnerable to unintended modification.\n- As systems scale, procedural codebases become difficult to maintain, test, and refactor.\n\nIn **Object-Oriented Programming** (such as C++):\n- Programs are modeled as collections of interacting **objects**.\n- **Data is tightly coupled with the functions that operate on it**, enforcing security and encapsulation.\n- Code reusability is dramatically increased through inheritance and polymorphic interfaces.\n\n#### Procedural (POP) vs. Object-Oriented (OOP) Comparison\n| Feature | Procedural Programming (POP) | Object-Oriented Programming (OOP) |\n| :--- | :--- | :--- |\n| **Primary Focus** | Algorithms and sequence of procedures | Data structures and real-world objects |\n| **Approach** | Top-Down design approach | Bottom-Up design approach |\n| **Data Security** | Low; data moves freely across functions | High; data is hidden via access specifiers |\n| **Decomposition** | Program decomposes into functions | Program decomposes into objects/classes |\n| **Code Reusability** | Limited (functions only) | Vast (inheritance, polymorphism, templates) |\n| **Real-World Modeling**| Difficult to model real-world behavior | Natural mapping of real-world entities |",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "OOP Object Modeling: Bank Account Entity",
        "code": "#include <iostream>\n#include <string>\n\n// Blueprint representing a real-world Bank Account object\nclass BankAccount {\nprivate:\n    std::string accountHolder;\n    double balance;\n\npublic:\n    BankAccount(std::string name, double initialBalance) \n        : accountHolder(name), balance(initialBalance) {}\n\n    void deposit(double amount) {\n        if (amount > 0) balance += amount;\n    }\n\n    void display() const {\n        std::cout << \"Account Holder: \" << accountHolder \n                  << \" | Current Balance: $\" << balance << std::endl;\n    }\n};\n\nint main() {\n    BankAccount myAccount(\"Pranshu Pathak\", 1500.0);\n    myAccount.deposit(500.0);\n    myAccount.display();\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "OOP organizes software around objects binding data with methods. Unlike Procedural programming (top-down, unprotected data), OOP uses a bottom-up approach with high data security and natural domain modeling.",
      "keyConcepts": [
        "Procedural vs Object-Oriented",
        "Top-Down vs Bottom-Up Design",
        "Data-Function Binding",
        "Real-World Entity Modeling"
      ],
      "revisionNotes": "Remember: OOP models *what an entity is* and *what it can do*, bundling state and behavior together."
    }
  },
  "1-2": {
    "content": "### 1.2 Features of OOP (The Four Pillars)\n\nObject-Oriented Programming is anchored by four fundamental foundational pillars: **Encapsulation**, **Abstraction**, **Inheritance**, and **Polymorphism**.\n\n```\n                       The 4 Pillars of OOP\n      ┌───────────────────┼───────────────────┐\n      ▼                   ▼                   ▼\n Encapsulation       Abstraction         Inheritance        Polymorphism\n (Data Hiding       (Hiding internal    (Code reuse        (One interface,\n  & Bundling)        mechanisms)         & hierarchy)       many forms)\n```\n\n#### 1. Encapsulation (Data Hiding)\n- Bundling data variables and the member functions that manipulate them into a single unit (`class`).\n- Restricts direct access to internal components using access specifiers (`private`, `protected`, `public`), preventing accidental corruption from external code.\n\n#### 2. Abstraction (Essential Details Only)\n- Displaying only essential features of an object to the outside world while hiding complex internal implementation mechanics.\n- *Real-world analogy:* When you press the gas pedal of a car, you know the car accelerates; you do not need to understand electronic fuel injection or valve timing.\n\n#### 3. Inheritance (Reusability & Extensibility)\n- The mechanism by which a new class (**Derived / Child Class**) inherits the properties and behaviors of an existing class (**Base / Parent Class**).\n- Eliminates redundant code duplication and creates natural hierarchical relationships (`is-a` relationship).\n\n#### 4. Polymorphism (\"Many Forms\")\n- The ability of a message or function to be processed in more than one form.\n- **Compile-Time Polymorphism:** Function Overloading and Operator Overloading.\n- **Runtime Polymorphism:** Virtual functions and dynamic method overriding.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Demonstrating the Four Pillars of OOP in C++",
        "code": "#include <iostream>\n\n// 1. Abstraction & 2. Encapsulation: Abstract Shape interface\nclass Shape {\nprotected:\n    double dimension; // Encapsulated data\npublic:\n    Shape(double d) : dimension(d) {}\n    // 4. Polymorphism: Virtual function interface\n    virtual double calculateArea() const = 0; \n};\n\n// 3. Inheritance: Circle derives from Shape\nclass Circle : public Shape {\npublic:\n    Circle(double r) : Shape(r) {}\n    double calculateArea() const override {\n        return 3.14159 * dimension * dimension;\n    }\n};\n\nint main() {\n    Circle c(5.0);\n    std::cout << \"Circle Area (Polymorphic call): \" << c.calculateArea() << std::endl;\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "The four pillars of OOP are Encapsulation (bundling data and hiding private members), Abstraction (exposing only essential interfaces), Inheritance (reusing parent class capabilities), and Polymorphism (one interface presenting multiple implementations).",
      "keyConcepts": [
        "Encapsulation & Access Modifiers",
        "Abstraction & Interfaces",
        "Inheritance (is-a)",
        "Polymorphism (Compile-time vs Runtime)"
      ],
      "revisionNotes": "Encapsulation is about data protection (private variables); Abstraction is about hiding implementation complexity."
    }
  },
  "1-3": {
    "content": "### 1.3 Introduction to 'C++'\n\n**C++** was designed and developed by Danish computer scientist **Bjarne Stroustrup** at AT&T Bell Laboratories in Murray Hill, New Jersey, starting in **1979**.\n\n#### Motivation: \"C with Classes\"\nStroustrup was working on his Ph.D. analyzing distributed system simulations using **Simula 67** (which had classes and OOP, but was too slow) and **C** (which was blazing fast and close to hardware, but lacked high-level organization).\n- He set out to combine the **raw execution speed and hardware access of C** with the **high-level organization of Simula**.\n- Initially named **\"C with Classes\"** in 1979, it was officially renamed **C++** in **1983** (the `++` operator signifying the increment of C).\n\n#### C++ Design Principles\n1. **Zero-Overhead Principle:** What you don't use, you don't pay for. And what you do use, you couldn't hand-code any better.\n2. **Backward Compatibility with C:** C++ was designed as a superset of C; almost all valid C programs compile cleanly under C++.\n3. **Multi-Paradigm Support:** Supports Procedural, Object-Oriented, Generic (Templates), and Functional programming.\n\n#### Major ISO C++ Standards\n- **C++98 (ISO/IEC 14882:1998):** First official standardization including the Standard Template Library (STL).\n- **C++03:** Bug fix and technical corrigendum release.\n- **C++11 (\"Modern C++\"):** Revolutionary update introducing `auto`, lambda expressions, smart pointers, move semantics, and `nullptr`.\n- **C++14 & C++17:** Generic lambdas, structured bindings, `std::optional`, filesystem library.\n- **C++20:** Concepts, Ranges, Coroutines, and Modules.\n- **C++23:** Standard library enhancements and multidimensional subscript operator (`[]`).",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Modern C++ Hello World & Feature Inspection",
        "code": "#include <iostream>\n#include <vector>\n#include <numeric>\n\nint main() {\n    std::cout << \"========================================\\n\";\n    std::cout << \"    Modern C++ Systems Engine (HiGen)   \\n\";\n    std::cout << \"    Designed by Bjarne Stroustrup       \\n\";\n    std::cout << \"========================================\\n\";\n\n    // Modern C++11 auto deduction and vector collection\n    std::vector<int> numbers = {10, 20, 30, 40, 50};\n    int total = std::accumulate(numbers.begin(), numbers.end(), 0);\n\n    std::cout << \"Sum of elements using STL: \" << total << std::endl;\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C++ was created by Bjarne Stroustrup in 1979 at Bell Labs as 'C with Classes'. Built on the Zero-Overhead Principle, modern C++ (C++11/C++20) provides multi-paradigm programming with high performance.",
      "keyConcepts": [
        "Bjarne Stroustrup & Bell Labs",
        "Zero-Overhead Principle",
        "C Compatibility",
        "ISO Standards (C++98 to C++23)"
      ],
      "revisionNotes": "The name C++ was coined by Rick Mascitti in 1983, referencing C's ++ increment operator."
    }
  },
  "1-4": {
    "content": "### 1.4 Structure of a 'C++' Program\n\nA C++ program follows a structured architecture composed of preprocessor headers, namespaces, class definitions, and the mandatory `main()` entry function.\n\n```\n┌────────────────────────────────────────────────────────┐\n│ 1. Header Inclusion         (#include <iostream>)      │\n├────────────────────────────────────────────────────────┤\n│ 2. Namespace Declaration    (using namespace std;)     │\n├────────────────────────────────────────────────────────┤\n│ 3. Class Definitions        (class Engine { ... };)    │\n├────────────────────────────────────────────────────────┤\n│ 4. Global Declarations      (Global vars, typedefs)    │\n├────────────────────────────────────────────────────────┤\n│ 5. main() Entry Function    (int main() { ... })       │\n│    {                                                   │\n│        Object instantiations;                          │\n│        Stream I/O (cin / cout);                        │\n│        return 0;                                       │\n│    }                                                   │\n└────────────────────────────────────────────────────────┘\n```\n\n#### Key Components of C++ Program Structure\n1. **Header Inclusion (`#include <iostream>`):**\n   - Standard C++ headers **omit the `.h` extension** (unlike C's `<stdio.h>`).\n   - `<iostream>` defines input/output stream objects: `std::cin`, `std::cout`, `std::cerr`.\n2. **Namespaces (`using namespace std;`):**\n   - Namespaces prevent naming collisions in large software libraries.\n   - All standard library entities reside inside namespace `std`.\n3. **The `main()` Function:**\n   - Must return type `int`. Returning `0` indicates successful execution to the operating system.\n   - In standard C++, if control reaches the end of `main()` without an explicit `return`, the compiler implicitly inserts `return 0;`.\n4. **Stream I/O Operators:**\n   - **Insertion Operator (`<<`):** Pushes data into the output stream (`cout << \"Text\";`).\n   - **Extraction Operator (`>>`):** Extracts data from the input stream (`cin >> var;`).",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Canonical C++ Program Architecture",
        "code": "#include <iostream> // Header inclusion\n#include <string>\n\nusing namespace std; // Namespace declaration\n\n// Class definition section\nclass UserProfile {\npublic:\n    string username;\n    int age;\n\n    void printDetails() const {\n        cout << \"User: \" << username << \" | Age: \" << age << endl;\n    }\n};\n\n// Main execution entry point\nint main() {\n    UserProfile user1;\n    user1.username = \"Pranshu Pathak\";\n    user1.age = 21;\n\n    user1.printDetails();\n    return 0; // Return success status code to OS\n}"
      }
    ],
    "aiSummary": {
      "summary": "A C++ program consists of Header files (<iostream>), Namespaces (std), Class blueprints, and the main() function utilizing stream operators (<< and >>).",
      "keyConcepts": [
        "<iostream> Stream Headers",
        "using namespace std;",
        "Stream Insertion (<<) & Extraction (>>)",
        "Implicit return 0 in main"
      ],
      "revisionNotes": "In professional enterprise codebases, avoid `using namespace std;` in header files to prevent namespace pollution; prefer explicit prefixes like `std::cout`."
    }
  },
  "1-5": {
    "content": "### 1.5 Executing and Debugging a 'C++' Program\n\nRunning and debugging a C++ application involves invoking the compiler pipeline, checking for diagnostics, and analyzing runtime memory.\n\n#### Compiling with GCC / Clang (`g++`)\nC++ source files typically use the `.cpp`, `.cc`, or `.cxx` extensions.\n```bash\n# Standard compilation with Modern C++ standard:\ng++ -std=c++17 -Wall -Wextra main.cpp -o app\n\n# Running the binary on Linux/macOS:\n./app\n\n# Running the binary on Windows:\napp.exe\n```\n\n#### Critical Compiler Warning Flags\n- `-std=c++17` or `-std=c++20`: Specifies the target C++ ISO standard version.\n- `-Wall`: Enables all primary compiler warnings.\n- `-Wextra`: Enables additional aggressive diagnostic checks.\n- `-O2` / `-O3`: Optimizes binary execution speed.\n- `-g`: Emits DWARF debugging symbol tables for GDB.\n\n#### Debugging C++ Applications\nC++ runtime bugs often involve:\n1. **Uncaught Exceptions (`std::terminate`):** When a `throw` occurs without a matching `catch` block.\n2. **Segmentation Faults:** Dereferencing null pointers or indexing past vector boundaries.\n3. **Memory Leaks:** Forgetting to `delete` objects allocated with `new`.\n4. **Detecting Memory Bugs with Valgrind / AddressSanitizer (ASan):**\n   ```bash\n   g++ -fsanitize=address -g main.cpp -o app\n   ```\n   AddressSanitizer detects out-of-bounds access and use-after-free bugs with exact line numbers at runtime.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Defensive C++: Exception Handling & Boundary Safety",
        "code": "#include <iostream>\n#include <vector>\n#include <stdexcept>\n\nint main() {\n    std::vector<int> data = {10, 20, 30};\n\n    try {\n        // Safe bound-checked access using .at() instead of unchecked operator[]\n        std::cout << \"Element at index 1: \" << data.at(1) << std::endl;\n        \n        // This deliberately triggers std::out_of_range\n        std::cout << \"Accessing index 10: \" << data.at(10) << std::endl;\n    } catch (const std::out_of_range &ex) {\n        std::cerr << \"Caught Out-Of-Range Exception: \" << ex.what() << std::endl;\n    }\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C++ programs are compiled using g++ with flags like -std=c++17, -Wall, and -g. Debugging targets uncaught exceptions and memory issues, verified using AddressSanitizer and GDB.",
      "keyConcepts": [
        "g++ Compiler Flags (-std, -Wall, -g)",
        "AddressSanitizer (-fsanitize=address)",
        "Safe Vector Access (.at() vs [])",
        "GDB Debugging"
      ],
      "revisionNotes": "Use `vec.at(i)` during development for automatic bounds checking, which throws std::out_of_range on index errors."
    }
  },
  "2-1": {
    "content": "### 2.1 Keywords and Identifiers in 'C++'\n\nIn C++, source code is broken down into **Tokens**: Keywords, Identifiers, Literals, Operators, and Punctuators.\n\n#### 1. C++ Keywords\nC++ inherits all 32 ANSI C keywords and adds dozens of specialized keywords for object orientation, templates, memory management, and exceptions. Modern C++ features **over 90 reserved keywords**:\n\n| Category | Key C++ Keywords |\n| :--- | :--- |\n| **OOP & Access** | `class`, `public`, `private`, `protected`, `friend`, `this`, `virtual` |\n| **Memory** | `new`, `delete`, `nullptr` |\n| **Generics & Casts** | `template`, `typename`, `static_cast`, `dynamic_cast`, `const_cast`, `reinterpret_cast` |\n| **Exceptions** | `try`, `catch`, `throw`, `noexcept` |\n| **Types & Storage** | `bool`, `true`, `false`, `auto`, `decltype`, `constexpr`, `explicit`, `inline` |\n| **Namespaces** | `namespace`, `using` |\n\n#### 2. C++ Identifiers\nIdentifiers are names assigned by programmers to classes, functions, variables, and namespaces.\n- Rules: Letters (`A-Z`, `a-z`), digits (`0-9`), and underscore (`_`).\n- **Cannot begin with a digit.**\n- Identifiers starting with a double underscore (`__`) or an underscore followed by an uppercase letter (`_A`) are reserved for compiler implementations.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Keywords and Clean Identifier Conventions",
        "code": "#include <iostream>\n\nclass StudentRecord { // PascalCase for Classes\nprivate:\n    int studentId;    // camelCase for variables\n    double gpaScore;\n\npublic:\n    StudentRecord(int id, double gpa) : studentId(id), gpaScore(gpa) {}\n\n    void display() const {\n        std::cout << \"ID: \" << studentId << \" | GPA: \" << gpaScore << std::endl;\n    }\n};\n\nint main() {\n    StudentRecord student(101, 3.88);\n    student.display();\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C++ expands C's keywords with class, new, delete, template, virtual, constexpr, and explicit. Identifiers follow naming rules: starting with letters or underscores without using keywords.",
      "keyConcepts": [
        "C++ Keywords Expansion",
        "Identifier Naming Rules",
        "Reserved Compiler Prefixes (__, _Upper)",
        "Naming Conventions (PascalCase/camelCase)"
      ],
      "revisionNotes": "Never define identifiers with double underscores like `__myVar`; these are reserved for compiler internal symbols."
    }
  },
  "2-2": {
    "content": "### 2.2 Operators in 'C++'\n\nC++ supports all standard C operators while introducing specialized operators for OOP, scope resolution, and memory management.\n\n#### 1. The Scope Resolution Operator (`::`)\nThe **`::`** operator is used to:\n- Access global variables when shadowed by a local variable: `::globalVar`.\n- Define member functions outside of class declarations: `ClassName::functionName()`.\n- Access static class members: `ClassName::staticMember`.\n- Qualify symbols inside namespaces: `std::cout`.\n\n#### 2. Stream Insertion (`<<`) and Extraction (`>>`)\n- In C, `<<` and `>>` are solely bitwise shifts. In C++, they are overloaded for stream I/O via `<iostream>`.\n\n#### 3. Memory Management Operators: `new` and `delete`\n- **`new`**: Allocates memory on the heap and automatically invokes the object's **constructor**.\n- **`delete`**: Invokes the object's **destructor** and frees the heap memory.\n- Array forms: `new[]` and `delete[]`.\n\n#### 4. Pointer-to-Member Operators\n- `.*` and `->*` allow dereferencing member pointers on class instances.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Scope Resolution (::) and Dynamic new/delete",
        "code": "#include <iostream>\n\nint counter = 1000; // Global variable\n\nint main() {\n    int counter = 50; // Local variable shadows global\n\n    std::cout << \"Local counter:            \" << counter << std::endl;\n    std::cout << \"Global counter via (::):  \" << ::counter << std::endl;\n\n    // Dynamic allocation via new (type-safe, constructor invoked)\n    int *dynInt = new int(42);\n    std::cout << \"Dynamic heap integer:     \" << *dynInt << std::endl;\n\n    delete dynInt; // Deallocation\n    dynInt = nullptr;\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C++ introduces the Scope Resolution Operator (::), Stream operators (<<, >>), and type-safe dynamic allocation operators (new, delete) that automatically execute constructors and destructors.",
      "keyConcepts": [
        "Scope Resolution Operator (::)",
        "Global Variable Un-shadowing",
        "new vs malloc (Constructor execution)",
        "delete vs free (Destructor execution)"
      ],
      "revisionNotes": "Always pair `new` with `delete`, and `new[]` with `delete[]`. Mixing them leads to heap allocator corruption."
    }
  },
  "2-3": {
    "content": "### 2.3 Constants and constexpr in 'C++'\n\nIn modern C++, constants provide compile-time safety and performance optimization through **`const`** and **`constexpr`**.\n\n#### 1. The `const` Qualifier\n- Specifies that a variable's value cannot be modified after initialization.\n- In C++, a `const` global variable has **internal linkage** by default (restricted to the current file), unlike C.\n\n#### 2. `constexpr` (Compile-Time Expressions, C++11)\n- Specifies that the value of an expression or function can be **evaluated at compile time**.\n- Allows calculations to happen during compilation, eliminating runtime computation overhead and enabling use in array bounds and template arguments.\n\n#### Difference: `const` vs. `constexpr`\n| Feature | `const` | `constexpr` |\n| :--- | :--- | :--- |\n| **Evaluation Time** | Can be computed at compile time OR runtime | **Guaranteed to be evaluated at compile time** |\n| **Use as Array Bound**| Only if initialized with a constant literal | Yes, always usable in array dimensions |\n| **Functions** | Marks member methods as non-mutating | Allows functions to run at compile time |",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Compile-Time Calculations using constexpr",
        "code": "#include <iostream>\n\n// constexpr function evaluated during compilation\nconstexpr int calculateFactorial(int n) {\n    return (n <= 1) ? 1 : (n * calculateFactorial(n - 1));\n}\n\nint main() {\n    // Computed by the compiler at compile time:\n    constexpr int fact5 = calculateFactorial(5);\n    \n    // Can be used directly as array bound!\n    int buffer[fact5]; // Size 120 array allocated statically\n\n    std::cout << \"Compile-time Factorial(5) = \" << fact5 << std::endl;\n    std::cout << \"Buffer size: \" << sizeof(buffer) / sizeof(buffer[0]) << \" elements\" << std::endl;\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "const ensures immutability, while constexpr guarantees compile-time evaluation. constexpr functions can compute values during compilation for array dimensions and zero-overhead performance.",
      "keyConcepts": [
        "const (Read-Only Safety)",
        "constexpr (Compile-Time Execution)",
        "Array Bounds via constexpr",
        "Zero Runtime Overhead"
      ],
      "revisionNotes": "Use `constexpr` whenever a value is known at compile time to maximize optimization."
    }
  },
  "2-4": {
    "content": "### 2.4 Variables, References, and auto in 'C++'\n\nC++ introduces powerful modern variable abstractions: **Reference Variables** and **Automatic Type Deduction (`auto`)**.\n\n#### 1. Reference Variables (`type &ref = original;`)\nA **reference** is an **alias (alternate name)** for an existing variable.\n- Once initialized, a reference cannot be rebound to point to another variable.\n- Unlike pointers, references cannot be `NULL` and do not require dereferencing operators (`*`).\n- Syntactically treated as a normal variable, but accesses the original memory location directly.\n\n#### References vs. Pointers\n| Feature | Reference (`&`) | Pointer (`*`) |\n| :--- | :--- | :--- |\n| **Reassignment** | Cannot be rebound to another object | Can be reassigned freely |\n| **Nullability** | **Cannot be NULL** (must bind to valid object) | Can hold `nullptr` |\n| **Syntax** | Direct access (no dereferencing needed) | Requires dereferencing (`*ptr`) |\n| **Memory Address** | Shares the address of the target | Holds its own distinct memory address |\n\n#### 2. Automatic Type Deduction (`auto`, C++11)\nThe `auto` keyword instructs the compiler to automatically deduce the variable's type from its initializer expression:\n```cpp\nauto x = 5;          // deduced as int\nauto pi = 3.1415;    // deduced as double\nauto name = \"HiGen\"; // deduced as const char*\n```",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Reference Semantics and auto Type Deduction",
        "code": "#include <iostream>\n#include <vector>\n\nint main() {\n    int original = 50;\n    int &alias = original; // alias is a reference to original\n\n    alias = 99; // Modifying alias directly modifies original!\n    std::cout << \"Original after alias edit: \" << original << std::endl;\n    std::cout << \"Address of original: \" << &original << std::endl;\n    std::cout << \"Address of alias:    \" << &alias << \" (Identical!)\\n\" << std::endl;\n\n    // auto type deduction with complex STL types\n    std::vector<std::string> cities = {\"Tokyo\", \"Paris\", \"New York\"};\n    for (const auto &city : cities) { // Clean range-based for loop\n        std::cout << \"City: \" << city << std::endl;\n    }\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "A reference variable (&) acts as a non-null, immutable alias for an existing object. The auto keyword enables compile-time type deduction, simplifying complex type expressions.",
      "keyConcepts": [
        "Reference Aliases (&)",
        "References vs Pointers",
        "auto Keyword (Type Deduction)",
        "Range-Based For Loops"
      ],
      "revisionNotes": "Always pass large objects by const reference (`const MyClass &obj`) to avoid expensive copy operations."
    }
  },
  "2-5": {
    "content": "### 2.5 Data Types and Type Casting in 'C++'\n\nC++ expands C's primary types with native **boolean** (`bool`), wide character sets, and four specialized, type-safe **C++ Casting Operators**.\n\n#### Native Boolean (`bool`)\n- Takes values `true` (evaluates to 1) and `false` (evaluates to 0).\n- Occupies 1 byte in memory.\n\n#### The Four Named C++ Casting Operators\nIn C, casting is written as `(int)val`. C-style casting is dangerous because it blindly overrides type rules. C++ introduces four explicit, intention-revealing casts:\n\n```\n                          C++ Named Casts\n     ┌────────────────────┼────────────────────┐\n     ▼                    ▼                    ▼\nstatic_cast          dynamic_cast          const_cast        reinterpret_cast\n(Compile-time        (Runtime safe         (Add/remove       (Dangerous low-level\n conversions)        downcasting)          const qualifier)   reinterpretation)\n```\n\n1. **`static_cast<Type>(expr)`:**\n   - Standard compile-time conversions (e.g., float to int, or related pointers). Validated by compiler.\n2. **`dynamic_cast<Type*>(ptr)`:**\n   - Used for **safe downcasting** across polymorphic inheritance hierarchies. Evaluated at runtime using RTTI; returns `nullptr` on failure.\n3. **`const_cast<Type>(expr)`:**\n   - Explicitly adds or removes the `const` qualifier from a variable.\n4. **`reinterpret_cast<Type>(expr)`:**\n   - Reinterprets raw byte sequences without changing bit representations (e.g., pointer to integer).",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "static_cast vs C-Style Cast Safety",
        "code": "#include <iostream>\n\nint main() {\n    double preciseValue = 45.789;\n\n    // Safe C++ static_cast\n    int truncated = static_cast<int>(preciseValue);\n    std::cout << \"Original Double: \" << preciseValue << std::endl;\n    std::cout << \"static_cast:     \" << truncated << std::endl;\n\n    // Boolean display format\n    bool isActive = true;\n    std::cout << \"Bool numeric: \" << isActive << \" | Bool alpha: \" \n              << std::boolalpha << isActive << std::endl;\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C++ introduces native bool types and replaces unsafe C-style casting with four explicit operators: static_cast, dynamic_cast (polymorphic RTTI), const_cast, and reinterpret_cast.",
      "keyConcepts": [
        "bool Data Type & std::boolalpha",
        "static_cast (Standard conversions)",
        "dynamic_cast (Safe Downcasting via RTTI)",
        "const_cast & reinterpret_cast"
      ],
      "revisionNotes": "Never use old C-style casts `(int)x` in C++; prefer `static_cast<int>(x)` for clarity and compiler verification."
    }
  },
  "2-6": {
    "content": "### 2.6 Precedence of Operators in 'C++'\n\nC++ operator precedence dictates evaluation order in compound expressions. C++ includes all C operators plus additional operators for scope, member access, and memory allocation.\n\n#### Operator Precedence Hierarchy (Highest to Lowest)\n| Precedence Level | Operators | Associativity |\n| :---: | :--- | :---: |\n| **1 (Highest)** | Scope resolution `::` | Left-to-Right |\n| **2** | Postfix `()`, `[]`, `.`, `->`, `x++`, `x--`, `typeid`, C++ casts | Left-to-Right |\n| **3** | Unary `++x`, `--x`, `+`, `-`, `!`, `~`, `*`, `&`, `sizeof`, `new`, `delete` | **Right-to-Left** |\n| **4** | Pointer-to-Member `.*` , `->*` | Left-to-Right |\n| **5** | Multiplicative `*`, `/`, `%` | Left-to-Right |\n| **6** | Additive `+`, `-` | Left-to-Right |\n| **7** | Shift `<<`, `>>` | Left-to-Right |\n| **8** | Three-way Comparison `<=>` (C++20 Spaceship) | Left-to-Right |\n| **9** | Relational `<`, `<=`, `>`, `>=` | Left-to-Right |\n| **10** | Equality `==`, `!=` | Left-to-Right |\n| **11-13** | Bitwise `&`, `^`, `|` | Left-to-Right |\n| **14-15** | Logical `&&`, `||` | Left-to-Right |\n| **16** | Ternary Conditional `? :` | **Right-to-Left** |\n| **17** | Assignment `=`, `+=`, `-=`, etc. | **Right-to-Left** |\n| **18 (Lowest)** | Comma `,` | Left-to-Right |",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Operator Precedence and Stream Insertion Evaluation",
        "code": "#include <iostream>\n\nint main() {\n    int a = 5, b = 10, c = 2;\n\n    // Evaluated as: a + (b * c)\n    int res = a + b * c; \n    std::cout << \"5 + 10 * 2 = \" << res << std::endl;\n\n    // Relational vs Shift precedence: << has higher precedence than comparison!\n    // WRONG: std::cout << 5 < 10 << std::endl; (Syntax error!)\n    // CORRECT: Parenthesize comparisons when printing\n    std::cout << \"Is 5 < 10? \" << (5 < 10 ? \"Yes\" : \"No\") << std::endl;\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C++ operator precedence ranks Scope Resolution (::) highest, followed by Member Access, Arithmetic, Stream Shifts (<<, >>), Comparisons, and Assignments.",
      "keyConcepts": [
        "Scope Resolution Highest Priority",
        "Stream Shift Precedence Hazards",
        "Spaceship Operator <=> (C++20)",
        "Associativity Rules"
      ],
      "revisionNotes": "Always wrap relational or bitwise expressions in parentheses when streaming with `cout << (x == y)`."
    }
  },
  "2-7": {
    "content": "### 2.7 Scope Resolution & Namespaces in 'C++'\n\nIn large enterprise software projects containing millions of lines of code and numerous external libraries, variable and class name collisions are common. C++ solves this using **Namespaces**.\n\n#### 1. What is a Namespace?\nA **namespace** is a declarative region that provides a distinct scope to the identifiers (types, functions, variables) declared within it.\n\n```cpp\nnamespace AudioEngine {\n    int sampleRate = 44100;\n    void init() { /* ... */ }\n}\n\nnamespace GraphicsEngine {\n    int sampleRate = 60; // No collision with AudioEngine!\n    void init() { /* ... */ }\n}\n```\n\n#### 2. Accessing Namespace Entities\n- **Explicit Qualification:** `AudioEngine::init();`\n- **Using Directive:** `using namespace AudioEngine;` (Brings all symbols into local scope).\n- **Using Declaration:** `using AudioEngine::sampleRate;` (Selectively imports one symbol).\n\n#### 3. Anonymous (Unnamed) Namespaces\nNamespaces without a name restrict visibility strictly to the current translation unit (file), serving as the modern C++ replacement for C's `static` globals:\n```cpp\nnamespace {\n    int filePrivateToken = 12345; // Visible only within this .cpp file\n}\n```",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Custom Namespaces and Symbol Resolution",
        "code": "#include <iostream>\n\nnamespace NetworkModule {\n    int port = 8080;\n    void connect() {\n        std::cout << \"Connecting via port: \" << port << std::endl;\n    }\n}\n\nnamespace DatabaseModule {\n    int port = 5432;\n    void connect() {\n        std::cout << \"Connecting to database on port: \" << port << std::endl;\n    }\n}\n\nint main() {\n    // Disambiguated access via Scope Resolution Operator\n    NetworkModule::connect();\n    DatabaseModule::connect();\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Namespaces group identifiers into distinct named scopes, preventing symbol collisions across libraries. Anonymous namespaces replace static globals for file-local linkage.",
      "keyConcepts": [
        "Namespace Declarations",
        "Scope Resolution Disambiguation",
        "using Directives vs using Declarations",
        "Anonymous Namespaces"
      ],
      "revisionNotes": "Prefer explicit namespace qualification (`std::cout`) in header files rather than `using namespace std;` to avoid name clashes."
    }
  },
  "3-1": {
    "content": "### 3.1 Classes & Access Specifiers in 'C++'\n\nA **class** is a user-defined blueprint or prototype from which real-world **objects** are created. An **object** is a concrete instance of a class occupying physical memory.\n\n#### Class Syntax & Access Specifiers\nA class is declared using the `class` keyword. Its internal members are governed by three access specifiers:\n\n```cpp\nclass ClassName {\nprivate:\n    // Accessible ONLY by member functions of this class\nprotected:\n    // Accessible by this class AND derived (child) classes\npublic:\n    // Accessible by ANY external code\n};\n```\n\n#### Access Specifier Visibility Matrix\n| Access Specifier | Accessible Inside Same Class? | Accessible Inside Derived Class? | Accessible from Outside / main()? |\n| :--- | :---: | :---: | :---: |\n| **`public`** | Yes | Yes | **Yes** |\n| **`protected`**| Yes | **Yes** | **No** |\n| **`private`** (Default)| Yes | **No** | **No** |\n\n#### Critical Difference: `class` vs. `struct` in C++\nIn C++, both `class` and `struct` can have data members and functions. The only difference is their default access level:\n- In a **`class`**, members are **`private`** by default.\n- In a **`struct`**, members are **`public`** by default.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Class Declaration and Access Specifiers",
        "code": "#include <iostream>\n#include <string>\n\nclass Employee {\nprivate:\n    double salary; // Private: hidden from external access\n\npublic:\n    int id;\n    std::string name;\n\n    // Setter for controlled private data access\n    void setSalary(double s) {\n        if (s > 0) salary = s;\n    }\n\n    // Getter\n    double getSalary() const {\n        return salary;\n    }\n};\n\nint main() {\n    Employee emp;\n    emp.id = 101;\n    emp.name = \"Alice\";\n    // emp.salary = 90000; // COMPILATION ERROR: salary is private!\n    \n    emp.setSalary(95000.0); // Encapsulated access\n    std::cout << \"Employee: \" << emp.name << \" | Salary: $\" << emp.getSalary() << std::endl;\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "A class is a user-defined blueprint; an object is an instance. Access specifiers (private, protected, public) enforce encapsulation. In C++, class members are private by default; struct members are public.",
      "keyConcepts": [
        "Class Blueprint vs Object Instance",
        "public, private, protected Access Specifiers",
        "Encapsulation Getters/Setters",
        "class vs struct Defaults"
      ],
      "revisionNotes": "Always make member variables private and expose controlled access via public getter/setter methods."
    }
  },
  "3-2": {
    "content": "### 3.2 Defining Member Functions Inside vs. Outside Classes\n\nIn C++, member functions can be defined in two ways:\n1. **Inside the class definition** (Implicitly Inlined)\n2. **Outside the class definition** using the **Scope Resolution Operator (`::`)**\n\n#### 1. Inside-Class Definition\nWhen a function is defined directly inside the class body, the C++ compiler automatically treats it as an **inline function**:\n```cpp\nclass Rectangle {\npublic:\n    int area(int w, int h) { return w * h; } // Automatically inlined\n};\n```\n\n#### 2. Outside-Class Definition via Scope Resolution (`::`)\nIn production software engineering, class prototypes are kept in **header files (`.h`)**, while their function definitions are placed in separate **implementation files (`.cpp`)**:\n```cpp\n// In Rectangle.h\nclass Rectangle {\npublic:\n    int area(int w, int h); // Prototype only\n};\n\n// In Rectangle.cpp\nint Rectangle::area(int w, int h) {\n    return w * h;\n}\n```\n\n#### Syntax of Outside Definition:\n```cpp\nreturn_type ClassName::functionName(parameter_list) {\n    // Body\n}\n```",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Inside vs Outside Member Function Definitions",
        "code": "#include <iostream>\n\nclass Box {\nprivate:\n    double length, width, height;\n\npublic:\n    // Defined inside class: Inlined\n    void setDimensions(double l, double w, double h) {\n        length = l; width = w; height = h;\n    }\n\n    // Declared inside class, defined outside\n    double calculateVolume() const;\n};\n\n// Definition outside the class using Scope Resolution (::)\ndouble Box::calculateVolume() const {\n    return length * width * height;\n}\n\nint main() {\n    Box myBox;\n    myBox.setDimensions(5.0, 4.0, 3.0);\n    std::cout << \"Box Volume: \" << myBox.calculateVolume() << \" cubic units\" << std::endl;\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Member functions defined inside a class are automatically inlined. Outside-class definitions use the Scope Resolution Operator (ClassName::methodName) to separate interfaces from implementation.",
      "keyConcepts": [
        "Inline Member Functions",
        "Outside Definition via Class::",
        "Separation of Interface and Implementation",
        "Const Member Methods"
      ],
      "revisionNotes": "Mark methods that do not modify member variables with the `const` qualifier: `double getVal() const;`."
    }
  },
  "3-3": {
    "content": "### 3.3 Array of Objects in 'C++'\n\nAn **Array of Objects** allows you to store and manage multiple object instances of the same class under a single indexed collection.\n\n#### Declaration & Instantiation\n```cpp\nClassName objectArray[SIZE];\n```\n- When an array of objects is declared, the class's **default constructor** is automatically called for every single object in the array.\n- For an array of size $N$, the default constructor executes $N$ times.\n\n#### Initializing Arrays of Objects with Parameterized Constructors\nYou can initialize array elements using explicit constructor calls in an initializer list:\n```cpp\nStudent classroom[3] = {\n    Student(101, \"Alice\"),\n    Student(102, \"Bob\"),\n    Student(103, \"Charlie\")\n};\n```\n\n#### Invoking Methods on Object Arrays\nAccess individual objects via zero-based subscript indexing, followed by the dot operator:\n```cpp\nclassroom[i].displayGrade();\n```",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Array of Objects with Parameterized Initializers",
        "code": "#include <iostream>\n#include <string>\n\nclass Product {\nprivate:\n    std::string name;\n    double price;\n\npublic:\n    Product(std::string n = \"Unnamed\", double p = 0.0) : name(n), price(p) {}\n\n    void print() const {\n        std::cout << \"Product: \" << name << \" | Price: $\" << price << std::endl;\n    }\n};\n\nint main() {\n    // Array of 3 Product objects\n    Product inventory[3] = {\n        Product(\"Mechanical Keyboard\", 129.99),\n        Product(\"Gaming Mouse\", 69.50),\n        Product(\"UltraWide Monitor\", 349.00)\n    };\n\n    std::cout << \"--- Store Inventory ---\\n\";\n    for (int i = 0; i < 3; i++) {\n        inventory[i].print();\n    }\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "An Array of Objects stores multiple instances of a class. The constructor executes for each element during array allocation. Elements are accessed via arr[i].member.",
      "keyConcepts": [
        "Array of Class Instances",
        "Repeated Constructor Execution",
        "Initializer Lists for Object Arrays"
      ],
      "revisionNotes": "If a class defines a parameterized constructor, you must also provide a default constructor to declare uninitialized arrays like `MyClass arr[10];`."
    }
  },
  "3-4": {
    "content": "### 3.4 Managing Console Stream I/O in 'C++'\n\nC++ manages console input and output through an object-oriented stream pipeline provided by **`<iostream>`**.\n\n#### The Standard Stream Objects\n1. **`std::cout` (Standard Output):** Buffered output stream connected to the display console.\n2. **`std::cin` (Standard Input):** Buffered input stream connected to the keyboard.\n3. **`std::cerr` (Standard Error):** **Unbuffered** error stream that writes directly to the screen immediately without buffering.\n4. **`std::clog` (Standard Log):** Buffered error/logging stream.\n\n#### Stream State Flags\nInput streams track their health using internal bit flags:\n- **`cin.good()`**: Returns true if the stream is healthy and ready.\n- **`cin.fail()`**: Returns true if a type mismatch occurred (e.g., typing \"abc\" when an integer was expected).\n- **`cin.eof()`**: Returns true if End of File was encountered.\n- **`cin.bad()`**: Returns true on fatal low-level I/O failure.\n- **`cin.clear()`**: Resets error flags so future input can be read.\n- **`cin.ignore()`**: Discards unwanted characters (such as leftover newline characters) from the input buffer.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Robust Console Input Validation & Stream Recovery",
        "code": "#include <iostream>\n#include <limits>\n\nint main() {\n    int age;\n    std::cout << \"Enter your age: \";\n\n    // Loop until valid integer input is supplied\n    while (!(std::cin >> age)) {\n        std::cout << \"Invalid input! Please enter a numeric age: \";\n        std::cin.clear(); // Clear stream fail flag\n        // Discard bad input up to the newline\n        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\\n');\n    }\n\n    std::cout << \"Validated age: \" << age << std::endl;\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C++ stream I/O uses cout (buffered stdout), cin (stdin), cerr (unbuffered stderr), and clog (buffered log). Stream states are verified with good(), fail(), and restored via clear() and ignore().",
      "keyConcepts": [
        "Stream Objects (cout, cin, cerr, clog)",
        "Unbuffered cerr for Instant Diagnostics",
        "Stream Flags (fail, eof, bad)",
        "Buffer Clearing with cin.clear()"
      ],
      "revisionNotes": "Always use `cerr` instead of `cout` for error messages so errors are printed immediately even if output is redirected."
    }
  },
  "3-5": {
    "content": "### 3.5 'C++' Stream Class Hierarchy\n\nIn C++, input and output streams are designed using an inheritance hierarchy rooted in the `ios_base` class.\n\n```\n                          ios_base (Formatting Flags & State)\n                                     ▲\n                                     │\n                             ios (Char Traits & Buffers)\n                         ┌───────────┴───────────┐\n                         ▼                       ▼\n                      istream                 ostream\n                   (cin, >>)               (cout, cerr, <<)\n                         ▲                       ▲\n                         │                       │\n                         └───────────┬───────────┘\n                                     ▼\n                                  iostream\n                                (cin & cout)\n```\n\n#### Major Stream Classes\n1. **`ios_base`:** Base class independent of character type, defining formatting flags, open modes, and I/O state enums.\n2. **`basic_ios`:** Manages the underlying stream buffer pointer (`streambuf`).\n3. **`istream`:** Input stream class providing extraction operators (`>>`) and methods like `get()`, `getline()`, and `read()`.\n4. **`ostream`:** Output stream class providing insertion operators (`<<`) and methods like `put()` and `write()`.\n5. **`iostream`:** Inherits from both `istream` and `ostream` via multiple inheritance for bidirectional stream access.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Inspecting Stream Hierarchy State Flags",
        "code": "#include <iostream>\n\nint main() {\n    std::cout << \"Stream Hierarchy State Check:\\n\";\n    std::cout << \"cout.good(): \" << std::cout.good() << std::endl;\n    std::cout << \"cin.good():  \" << std::cin.good() << std::endl;\n\n    // Stream width configuration via ios_base method\n    std::cout.width(10);\n    std::cout << \"HiGen\" << \" [Formatted Output]\" << std::endl;\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C++ stream classes are arranged in an inheritance hierarchy: ios_base -> basic_ios -> istream/ostream -> iostream. They bind stream buffers to devices.",
      "keyConcepts": [
        "ios_base Foundation",
        "istream Extraction & ostream Insertion",
        "Bidirectional iostream",
        "Underlying streambuf"
      ],
      "revisionNotes": "Understanding the stream hierarchy explains why fstream (files) and stringstream (strings) share the same `<<` and `>>` operators as cout and cin."
    }
  },
  "3-6": {
    "content": "### 3.6 Formatted and Unformatted Console I/O\n\nC++ supports both **formatted I/O** (which interprets and converts data types) and **unformatted I/O** (which operates on raw byte blocks without transformation).\n\n#### 1. Formatted I/O (`<<` and `>>`)\n- Automatically parses and formats primitives: integers, floats, and strings.\n- `cin >> str` stops reading upon encountering whitespace (spaces, tabs, newlines).\n\n#### 2. Unformatted I/O Functions\n- **`cin.get(char &ch)`:** Reads a single character, **including whitespace**.\n- **`cout.put(char ch)`:** Writes a single character to output.\n- **`cin.getline(char *buffer, int size)`:** Reads a full line of text including embedded spaces into a C-string until a newline is reached.\n- **`std::getline(cin, stringObj)`:** Safe, dynamic C++ string reader.\n- **`cin.read(char *buf, int n)`:** Reads raw $n$ bytes without null termination.\n- **`cout.write(const char *buf, int n)`:** Writes raw $n$ bytes directly.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Unformatted Console I/O: Reading Lines with Spaces",
        "code": "#include <iostream>\n#include <string>\n\nint main() {\n    std::string fullName;\n    std::cout << \"Enter full name (with spaces): \";\n    \n    // std::getline reads the whole line including spaces\n    std::getline(std::cin, fullName);\n\n    std::cout << \"Formatted line output: Hello, \" << fullName << \"!\" << std::endl;\n\n    // Single character unformatted put\n    std::cout << \"Status code: \";\n    std::cout.put('O');\n    std::cout.put('K');\n    std::cout.put('\\n');\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Formatted I/O (<<, >>) parses data types and stops at whitespace. Unformatted I/O (get, put, getline, read, write) reads raw characters and whole lines without stripping whitespace.",
      "keyConcepts": [
        "Whitespace Delimitation in cin >>",
        "std::getline for Line Input",
        "cin.get() and cout.put()",
        "Raw Binary read() and write()"
      ],
      "revisionNotes": "If switching from `cin >> number` to `std::getline()`, call `cin.ignore()` first to consume the residual newline character."
    }
  },
  "3-7": {
    "content": "### 3.7 Usage of Manipulators (`<iomanip>`)\n\n**Manipulators** are special functions inserted directly into the stream pipeline using `<<` or `>>` to format output and control stream states.\n\n#### Standard Manipulators\n- **Without Parameters (in `<iostream>`):**\n  - `std::endl`: Inserts a newline character (`'\\n'`) and **flushes the output buffer**.\n  - `std::flush`: Flushes the stream buffer without writing a newline.\n  - `std::boolalpha` / `std::noboolalpha`: Displays booleans as \"true\"/\"false\" instead of 1/0.\n  - `std::hex`, `std::oct`, `std::dec`: Switches integer numeric bases.\n  - `std::fixed` / `std::scientific`: Sets floating-point output format.\n\n#### Parameterized Manipulators (in `<iomanip>`)\n- **`setw(int n)`:** Sets field width for the **very next** output value (non-sticky).\n- **`setprecision(int n)`:** Controls total significant digits, or exact decimal places when combined with `std::fixed`.\n- **`setfill(char ch)`:** Sets the fill padding character (e.g., zero-padding).",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Tabular Data Formatting with <iomanip>",
        "code": "#include <iostream>\n#include <iomanip>\n\nint main() {\n    double price1 = 19.99, price2 = 1250.5;\n\n    std::cout << \"--- Sales Invoice Table ---\\n\";\n    // Fixed decimal notation with 2 decimal places\n    std::cout << std::fixed << std::setprecision(2);\n\n    // Formatted columns using setw and setfill\n    std::cout << std::left  << std::setw(15) << \"Item\"\n              << std::right << std::setw(10) << \"Price ($)\" << std::endl;\n    std::cout << std::setfill('-') << std::setw(25) << \"\" << std::endl;\n    \n    std::cout << std::setfill(' '); // Reset fill character\n    std::cout << std::left  << std::setw(15) << \"Book\" \n              << std::right << std::setw(10) << price1 << std::endl;\n    std::cout << std::left  << std::setw(15) << \"Laptop\" \n              << std::right << std::setw(10) << price2 << std::endl;\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Manipulators format stream outputs. Parameterized manipulators in <iomanip> include setw (column width), setprecision (decimal places with fixed), and setfill (padding character).",
      "keyConcepts": [
        "endl vs \\n (Buffer Flushing)",
        "boolalpha / hex / dec",
        "setw() Column Alignment",
        "setprecision() & std::fixed"
      ],
      "revisionNotes": "`setw()` applies only to the immediate next output item; all other manipulators like `setprecision()` remain active until explicitly changed."
    }
  },
  "4-1": {
    "content": "### 4.1 Call by Reference and Return by Reference in 'C++'\n\nIn C, passing by reference requires raw pointer addressing (`&x`) and dereferencing (`*ptr`). C++ introduces native **Reference Parameters (`type &ref`)**, enabling direct modification of caller variables with clean scalar syntax.\n\n#### 1. Call by Reference\nWhen a formal parameter is declared as a reference (`void func(int &x)`):\n- It binds directly as an **alias** to the caller's actual argument in memory.\n- No copy is created, and no pointer dereference operator (`*`) is required.\n- Any change inside the function immediately mutates the caller's variable.\n\n#### 2. Passing by `const` Reference (`const Type &param`)\n- Combines the **efficiency of references** (no copying of large objects) with the **safety of call by value** (the caller's data cannot be modified).\n- Standard practice in modern C++ for passing strings, vectors, and complex classes.\n\n#### 3. Return by Reference (`Type& func()`)\nA function can return a reference to an existing object:\n- Allows the function call itself to appear as an **lvalue on the left-hand side of an assignment**!\n  ```cpp\n  int& getElement(int i) { return arr[i]; }\n  getElement(2) = 500; // Directly assigns 500 to arr[2]!\n  ```\n- **CRITICAL WARNING:** **Never return a reference to a local stack variable!** The local variable is destroyed when the function returns, resulting in an undefined dangling reference.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Clean Call by Reference and Return by Reference",
        "code": "#include <iostream>\n\n// Clean reference swap without pointers\nvoid swap(int &a, int &b) {\n    int temp = a;\n    a = b;\n    b = temp;\n}\n\n// Returning reference to static array element (lvalue)\nint globalArray[5] = {10, 20, 30, 40, 50};\n\nint& at(int index) {\n    return globalArray[index]; // Safe: globalArray persists in data segment\n}\n\nint main() {\n    int x = 10, y = 99;\n    std::cout << \"Before swap: x=\" << x << \", y=\" << y << std::endl;\n    swap(x, y);\n    std::cout << \"After swap:  x=\" << x << \", y=\" << y << std::endl;\n\n    // Using a function call as an lvalue assignment target!\n    at(2) = 777;\n    std::cout << \"Modified globalArray[2] via return-by-reference: \" \n              << globalArray[2] << std::endl;\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C++ reference parameters enable Call by Reference without pointer dereferencing. Return by Reference allows functions to act as lvalue assignment targets, but must never return references to local stack variables.",
      "keyConcepts": [
        "Reference Parameters (&)",
        "Passing by const Reference (Performance & Safety)",
        "Return by Reference (lvalue Functions)",
        "Dangling Reference Hazards"
      ],
      "revisionNotes": "Always pass large objects via `const MyClass &obj` rather than by value to avoid copying overhead."
    }
  },
  "4-2": {
    "content": "### 4.2 Function Overloading & Default Arguments\n\nC++ provides two powerful features to simplify function interfaces: **Function Overloading** (compile-time polymorphism) and **Default Arguments**.\n\n#### 1. Function Overloading\n**Function Overloading** allows multiple functions to share the **exact same name**, provided they have **different parameter signatures**:\n- Different number of parameters.\n- Different types of parameters.\n- Different sequence/order of parameter types.\n- *Note: Return type alone does NOT distinguish overloaded functions.*\n\n#### How Overloading Works: Name Mangling\nThe C++ compiler encodes parameter types into the internal symbol table names (**Name Mangling**). For instance, `add(int, int)` becomes `_Z3addii`, while `add(double, double)` becomes `_Z3adddd`.\n\n#### 2. Default Arguments\nC++ allows function parameters to have default fallback values if the caller omits them:\n```cpp\nvoid printBanner(std::string text, int times = 1, char border = '=');\n```\n- Rules: **Default parameters must be placed from right to left.** Once a parameter has a default, all subsequent parameters to its right must also have defaults.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Overloading & Default Arguments in Action",
        "code": "#include <iostream>\n\n// Overloaded functions: differentiated by parameter types\nint calculate(int a, int b) {\n    return a + b;\n}\n\ndouble calculate(double a, double b) {\n    return a * b;\n}\n\n// Function with default arguments\nvoid displayInfo(std::string label, int count = 1, bool uppercase = false) {\n    std::cout << label << \" [Count: \" << count \n              << \", Mode: \" << (uppercase ? \"UPPER\" : \"normal\") << \"]\\n\";\n}\n\nint main() {\n    std::cout << \"Integer calculate(10, 20):  \" << calculate(10, 20) << std::endl;\n    std::cout << \"Double calculate(2.5, 4.0):  \" << calculate(2.5, 4.0) << std::endl;\n\n    // Utilizing default arguments\n    displayInfo(\"Server Status\");            // Uses count=1, uppercase=false\n    displayInfo(\"Error Log\", 5);             // Uses uppercase=false\n    displayInfo(\"Warning Alert\", 3, true);   // Supplies all 3 arguments\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Function Overloading permits multiple functions with identical names distinguished by parameter lists (via name mangling). Default arguments provide fallback values and must be trailing from right to left.",
      "keyConcepts": [
        "Function Overloading Signatures",
        "Compiler Name Mangling",
        "Default Argument Rules (Right-to-Left)",
        "Ambiguity Resolution"
      ],
      "revisionNotes": "Do not combine default arguments with overloaded functions in ways that introduce ambiguity: `void f(int)` vs `void f(int, int=0)`."
    }
  },
  "4-3": {
    "content": "### 4.3 Inline Functions in 'C++'\n\nIn standard function calls, the CPU performs an overhead sequence: pushing arguments onto the stack, saving the instruction pointer, jumping to the function body, executing, popping the stack, and returning. For small 1-line functions executed millions of times inside a loop, this overhead impairs performance.\n\n#### The `inline` Keyword\nAn **inline function** is a function where the compiler substitutes the function's machine code **directly at the call site**, eliminating the function call overhead completely.\n\n```cpp\ninline int square(int x) {\n    return x * x;\n}\n```\n\n#### Inline Functions vs. Preprocessor Macros\n| Feature | Inline Function (`inline`) | Preprocessor Macro (`#define`) |\n| :--- | :--- | :--- |\n| **Type Checking** | Strict compile-time type verification | No type checking (raw text replacement) |\n| **Side Effects** | Safe (`square(x++)` evaluates once) | Dangerous (`SQUARE(x++)` increments twice!) |\n| **Debugging** | Supported in GDB / debuggers | Inaccessible to debuggers |\n| **Member Access** | Can access private class members | Cannot access class encapsulation |\n\n#### Compiler Discretion\nThe `inline` keyword is a **hint/request to the compiler**, not a command. The compiler may refuse to inline if the function is too large, contains complex loops/switches, or involves recursion.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Inline Function vs Macro Side-Effect Safety",
        "code": "#include <iostream>\n\n#define MACRO_SQUARE(x) ((x) * (x))\n\ninline int inlineSquare(int x) {\n    return x * x;\n}\n\nint main() {\n    int a = 3;\n    // Macro bug: (a++) * (a++) -> increments 'a' twice!\n    int resMacro = MACRO_SQUARE(a++);\n    std::cout << \"Macro result with a++: \" << resMacro << \" (a became \" << a << \")\\n\";\n\n    int b = 3;\n    // Inline function is type-safe and evaluates parameter exactly once\n    int resInline = inlineSquare(b++);\n    std::cout << \"Inline result with b++: \" << resInline << \" (b became \" << b << \")\\n\";\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "inline functions eliminate function call stack overhead by substituting the function body directly at call sites. Unlike preprocessor macros, inline functions provide type safety, scope rules, and debuggability.",
      "keyConcepts": [
        "Function Call Overhead",
        "inline Substitution",
        "Type Safety vs Macros",
        "Compiler Discretion (Inlining limits)"
      ],
      "revisionNotes": "Keep inline functions short (1-3 lines). Inlining large functions increases binary executable code bloat."
    }
  },
  "4-4": {
    "content": "### 4.4 Static Class Members in 'C++'\n\nIn standard classes, each instantiated object receives its own independent copy of data members. A **`static` class member** belongs to the **class itself**, rather than to any individual object instance.\n\n#### 1. Static Data Members\n- Only a **single copy** exists in memory, shared across all instantiated objects of that class.\n- Stored in the **Data Segment**, not inside object stack frames.\n- **Must be defined and initialized outside the class** using the scope resolution operator (`::`).\n- Common use case: Tracking object instance counters or global configuration settings.\n\n#### 2. Static Member Functions\n- Can be invoked directly using the class name without creating an object: `ClassName::method()`.\n- **Has NO `this` pointer!**\n- **Can ONLY access `static` data members and call other `static` functions.** They cannot access standard non-static instance members because they are not bound to any specific object instance.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Tracking Active Object Instances with Static Members",
        "code": "#include <iostream>\n\nclass Worker {\nprivate:\n    int workerId;\n    static int activeWorkersCount; // Declared inside class\n\npublic:\n    Worker(int id) : workerId(id) {\n        activeWorkersCount++;\n    }\n\n    ~Worker() {\n        activeWorkersCount--;\n    }\n\n    // Static member function (operates without object instance)\n    static int getActiveCount() {\n        return activeWorkersCount; // Can only access static variables\n    }\n};\n\n// Definition and initialization outside class in file scope\nint Worker::activeWorkersCount = 0;\n\nint main() {\n    std::cout << \"Initial active count: \" << Worker::getActiveCount() << std::endl;\n\n    Worker *w1 = new Worker(101);\n    Worker *w2 = new Worker(102);\n    std::cout << \"Active count after spawns: \" << Worker::getActiveCount() << std::endl;\n\n    delete w1; // Destructor decrements static counter\n    std::cout << \"Active count after deleting w1: \" << Worker::getActiveCount() << std::endl;\n\n    delete w2;\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Static data members are shared across all instances and initialized outside the class. Static member functions can be called via Class::method(), have no this pointer, and can only access static data.",
      "keyConcepts": [
        "Shared Class Variables",
        "Definition Outside Class (::)",
        "Static Functions (No this pointer)",
        "Object Instance Tracking"
      ],
      "revisionNotes": "Remember: Static member functions cannot access non-static instance variables because they do not have a `this` pointer."
    }
  },
  "4-5": {
    "content": "### 4.5 Friend Functions and Friend Classes in 'C++'\n\nEncapsulation dictates that `private` and `protected` class members are strictly inaccessible to external functions. The **`friend`** keyword provides a controlled exception, granting non-member functions or other classes access to private data.\n\n#### 1. Friend Function\n- A non-member function granted access to a class's private sections by declaring it inside the class prefixed with `friend`.\n- Not a member of the class, so it is **not called using an object and dot operator** (`obj.func()`). Instead, it receives objects as parameters (`func(obj)`).\n\n#### 2. Friend Class\n- Granting an entire class friendship: `friend class ClassB;`.\n- All member functions of `ClassB` can access the private members of `ClassA`.\n\n#### Important Properties of Friendship\n1. **Friendship is not mutual:** If A is a friend of B, B is not automatically a friend of A.\n2. **Friendship is not inherited:** Derived classes do not inherit parent friendships.\n3. **Friendship is not transitive:** If A is a friend of B, and B is a friend of C, A is not a friend of C.\n\n#### Primary Use Cases\n- Overloading stream insertion (`<<`) and extraction (`>>`) operators.\n- High-performance mathematical libraries bridging matrices and vectors.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Friend Function Accessing Private Members of Two Classes",
        "code": "#include <iostream>\n\nclass Beta; // Forward declaration\n\nclass Alpha {\nprivate:\n    int dataAlpha;\npublic:\n    Alpha(int a) : dataAlpha(a) {}\n    // Declaring friend function\n    friend void compareValues(const Alpha &a, const Beta &b);\n};\n\nclass Beta {\nprivate:\n    int dataBeta;\npublic:\n    Beta(int b) : dataBeta(b) {}\n    // Granting friendship to the same external function\n    friend void compareValues(const Alpha &a, const Beta &b);\n};\n\n// Non-member friend function accesses private members of both classes\nvoid compareValues(const Alpha &a, const Beta &b) {\n    if (a.dataAlpha > b.dataBeta)\n        std::cout << \"Alpha is greater (\" << a.dataAlpha << \" > \" << b.dataBeta << \")\\n\";\n    else\n        std::cout << \"Beta is greater or equal (\" << b.dataBeta << \" >= \" << a.dataAlpha << \")\\n\";\n}\n\nint main() {\n    Alpha objA(45);\n    Beta objB(80);\n    compareValues(objA, objB);\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Friend functions and friend classes are granted access to private and protected members of a class. Friendship is neither mutual, inherited, nor transitive, and is primarily used for operator overloading.",
      "keyConcepts": [
        "friend Keyword",
        "Non-Member Access to Private Data",
        "Friend Classes",
        "Operator Overloading Utilities"
      ],
      "revisionNotes": "Use friend judiciously; excessive use breaks encapsulation and couples classes tightly."
    }
  },
  "4-6": {
    "content": "### 4.6 Virtual Functions & Runtime Polymorphism\n\n**Runtime Polymorphism** (or Late / Dynamic Binding) is the ability of C++ to resolve function calls at execution time based on the **actual type of the object pointed to**, rather than the compile-time type of the pointer.\n\n#### The Virtual Function Mechanism (`virtual`)\nWhen a base class declares a member function as `virtual`, it instructs the compiler: *\"Do not bind this call at compile time. Look up the actual object's overriding method at runtime.\"*\n\n```cpp\nclass Base {\npublic:\n    virtual void show() { std::cout << \"Base\\n\"; }\n};\n\nclass Derived : public Base {\npublic:\n    void show() override { std::cout << \"Derived\\n\"; }\n};\n```\n\n#### How Runtime Binding Works: vptr and vtable\n1. **vtable (Virtual Table):** A static array of function pointers generated by the compiler for every class containing virtual functions.\n2. **vptr (Virtual Table Pointer):** A hidden 8-byte pointer injected into every object instance pointing to its class's vtable.\n3. When `ptr->show()` is invoked:\n   - The CPU follows the object's `vptr` to the `vtable`.\n   - It fetches the function pointer corresponding to `show()` and executes the derived implementation.\n\n```\n Base Pointer: Base *p = new Derived();\n p ──► [ vptr ] ──► Derived vtable ──► Derived::show()\n       [ data ]\n```\n\n#### Pure Virtual Functions and Abstract Classes\n- A **Pure Virtual Function** has no implementation in the base class and is declared with `= 0`:\n  ```cpp\n  virtual void draw() = 0;\n  ```\n- A class containing at least one pure virtual function is an **Abstract Base Class (ABC)** and cannot be instantiated directly.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Virtual Functions & Runtime Dynamic Dispatch",
        "code": "#include <iostream>\n#include <vector>\n\nclass Animal {\npublic:\n    virtual void makeSound() const {\n        std::cout << \"Generic animal sound\\n\";\n    }\n    virtual ~Animal() = default; // Always make base destructors virtual!\n};\n\nclass Dog : public Animal {\npublic:\n    void makeSound() const override {\n        std::cout << \"Woof! Woof!\\n\";\n    }\n};\n\nclass Cat : public Animal {\npublic:\n    void makeSound() const override {\n        std::cout << \"Meow!\\n\";\n    }\n};\n\nint main() {\n    // Polymorphic collection of base pointers\n    std::vector<Animal*> animals = { new Dog(), new Cat(), new Animal() };\n\n    std::cout << \"Polymorphic Dynamic Dispatch:\\n\";\n    for (Animal *a : animals) {\n        a->makeSound(); // Dispatched dynamically at runtime via vtable!\n    }\n\n    for (Animal *a : animals) delete a;\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Virtual functions enable runtime polymorphism via dynamic binding. The compiler creates a vtable of function pointers and injects a vptr into each object. Pure virtual functions (= 0) create Abstract Classes.",
      "keyConcepts": [
        "virtual Keyword & override",
        "Dynamic Binding vs Static Binding",
        "vtable and vptr Mechanics",
        "Pure Virtual Functions & Abstract Classes"
      ],
      "revisionNotes": "Always declare the base class destructor as `virtual ~Base()` to prevent memory leaks when deleting derived objects via base pointers."
    }
  },
  "5-1": {
    "content": "### 5.1 Concept of Constructors in 'C++'\n\nA **constructor** is a specialized member function called **automatically** by the runtime whenever an object of that class is instantiated in memory.\n\n#### Properties of Constructors\n1. **Identical Name:** The constructor has the exact same name as the class.\n2. **No Return Type:** Constructors do not have any return type—**not even `void`**.\n3. **Automatic Invocation:** Invoked implicitly when an object is created on the stack or via `new` on the heap.\n4. **Public Placement:** Placed in the `public` section (unless implementing singleton or factory patterns).\n\n#### Member Initializer Lists\nModern C++ strongly advocates initializing member variables using **Member Initializer Lists** rather than assignments inside the constructor body:\n```cpp\n// PREFERRED: Member Initializer List (directly initializes members)\nPoint(int x, int y) : xCoord(x), yCoord(y) {}\n\n// LESS EFFICIENT: Default initializes first, then assigns\nPoint(int x, int y) {\n    xCoord = x;\n    yCoord = y;\n}\n```\n- Mandatory for: `const` members, reference members, and base class constructors.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Constructors & Member Initializer Lists",
        "code": "#include <iostream>\n\nclass ServerConfig {\nprivate:\n    const int port; // Const member: MUST be initialized in initializer list!\n    std::string hostname;\n\npublic:\n    // Member Initializer List syntax\n    ServerConfig(std::string host, int p) : port(p), hostname(host) {\n        std::cout << \"ServerConfig initialized for \" << hostname << \":\" << port << std::endl;\n    }\n\n    void display() const {\n        std::cout << \"Host: \" << hostname << \" | Port: \" << port << std::endl;\n    }\n};\n\nint main() {\n    ServerConfig srv(\"api.higenlabs.in\", 443);\n    srv.display();\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "A constructor is an automatically invoked initialization method matching the class name with no return type. Member initializer lists initialize fields directly, required for const and reference members.",
      "keyConcepts": [
        "Automatic Initialization",
        "No Return Type",
        "Member Initializer Lists (: member(val))",
        "Const/Reference Member Initialization"
      ],
      "revisionNotes": "Always use member initializer lists; they avoid the double-initialization penalty of complex member objects."
    }
  },
  "5-2": {
    "content": "### 5.2 Types of Constructors in 'C++'\n\nC++ supports four distinct categories of constructors:\n\n```\n                          Types of Constructors\n      ┌──────────────────────┬──────────────────────┬──────────────────────┐\n      ▼                      ▼                      ▼                      ▼\n   Default             Parameterized               Copy                   Move\n (Zero arguments)    (Custom arguments)       (Deep/Shallow copy)    (Transfer ownership)\n```\n\n#### 1. Default Constructor\nTakes no arguments (or all arguments have defaults). If no constructor is written, the compiler synthesizes a default constructor automatically.\n\n#### 2. Parameterized Constructor\nAccepts arguments to initialize object attributes with custom values upon creation.\n\n#### 3. Copy Constructor (`ClassName(const ClassName &other)`)\nInitializes a new object as a copy of an existing object:\n- **Shallow Copy (Default):** Copies member variables bit-by-bit. If members include raw heap pointers, both objects end up pointing to the **same heap memory**, causing double-free crashes upon destruction!\n- **Deep Copy (Custom):** Allocates new independent heap memory and copies the actual contents.\n\n#### 4. Move Constructor (C++11, `ClassName(ClassName &&other) noexcept`)\nSteals / transfers ownership of heap resources from a temporary rvalue object instead of performing an expensive deep copy.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Copy Constructor: Shallow Copy Trap vs Deep Copy",
        "code": "#include <iostream>\n#include <cstring>\n\nclass DeepString {\nprivate:\n    char *data;\n\npublic:\n    // Parameterized constructor\n    DeepString(const char *str) {\n        data = new char[strlen(str) + 1];\n        strcpy(data, str);\n    }\n\n    // Custom Deep Copy Constructor\n    DeepString(const DeepString &other) {\n        data = new char[strlen(other.data) + 1]; // Allocate separate memory\n        strcpy(data, other.data);                // Copy bytes\n        std::cout << \"[Deep Copy Constructor invoked]\\n\";\n    }\n\n    ~DeepString() {\n        delete[] data;\n    }\n\n    void print() const { std::cout << \"Text: \" << data << std::endl; }\n};\n\nint main() {\n    DeepString s1(\"HiGen Systems\");\n    DeepString s2 = s1; // Invokes Copy Constructor cleanly without double-free\n\n    s1.print();\n    s2.print();\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C++ constructors include Default, Parameterized, Copy, and Move constructors. When classes manage raw heap pointers, a custom Deep Copy constructor is mandatory to avoid double-free errors.",
      "keyConcepts": [
        "Default & Parameterized Constructors",
        "Copy Constructor (ClassName(const ClassName&))",
        "Shallow vs Deep Copying",
        "The Rule of Three / Five"
      ],
      "revisionNotes": "The Rule of Three: If a class needs a custom Destructor, Copy Constructor, or Copy Assignment Operator, it almost certainly needs all three."
    }
  },
  "5-3": {
    "content": "### 5.3 Dynamic Memory Management with new and delete\n\nIn modern C++, dynamic allocation on the heap is handled via **`new`** and **`delete`** rather than C's `malloc` and `free`.\n\n#### Comparison: `new` / `delete` vs. `malloc` / `free`\n| Feature | `new` and `delete` (C++) | `malloc` and `free` (C) |\n| :--- | :--- | :--- |\n| **Nature** | **Operators** built into the language | Library functions in `<stdlib.h>` |\n| **Constructor / Destructor**| **Automatically calls constructor & destructor** | Allocates raw bytes only; no constructors |\n| **Return Type** | Type-safe (returns typed pointer `T*`) | Returns generic `void*` requiring casting |\n| **Size Calculation** | Automatic based on type: `new int` | Manual byte calculation: `sizeof(int)` |\n| **Failure Handling** | Throws `std::bad_alloc` exception | Returns `NULL` |\n| **Array Variant** | `new[]` and `delete[]` | Single `malloc()` / `free()` |\n\n#### Array Form Syntax\n```cpp\nint *arr = new int[100]; // Allocate array of 100 ints\ndelete[] arr;            // Mandatory brackets delete[] for arrays!\n```",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Dynamic Object Allocation via new and delete",
        "code": "#include <iostream>\n\nclass DatabaseConnection {\nprivate:\n    std::string connString;\npublic:\n    DatabaseConnection(std::string conn) : connString(conn) {\n        std::cout << \"-> Connection opened: \" << connString << std::endl;\n    }\n    ~DatabaseConnection() {\n        std::cout << \"-> Connection closed: \" << connString << std::endl;\n    }\n};\n\nint main() {\n    // new automatically calls constructor\n    DatabaseConnection *db = new DatabaseConnection(\"postgres://localhost:5432\");\n\n    // delete automatically calls destructor and frees heap memory\n    delete db;\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "new and delete are type-safe C++ operators that automatically call constructors and destructors. Arrays allocated with new[] must be deallocated with delete[].",
      "keyConcepts": [
        "new vs malloc",
        "Automatic Constructor/Destructor Invocations",
        "Array new[] and delete[]",
        "Exception std::bad_alloc"
      ],
      "revisionNotes": "Never mix `malloc` with `delete`, or `new` with `free`. Always match `new` with `delete` and `new[]` with `delete[]`."
    }
  },
  "5-4": {
    "content": "### 5.4 Usage of Destructors in 'C++'\n\nA **destructor** is a specialized member function invoked **automatically** whenever an object's lifetime ends (when a stack object exits scope, or when `delete` is executed on a heap pointer).\n\n#### Characteristics of Destructors\n1. **Tilde Prefix:** Named with a tilde (**`~`**) followed by the class name: `~ClassName()`.\n2. **No Arguments & No Return Type:** Destructors cannot take arguments, cannot return values, and **cannot be overloaded**. There is only one destructor per class.\n3. **Automatic Execution:** Executes automatically when an object goes out of scope.\n\n#### RAII (Resource Acquisition Is Initialization)\nDestructors are the foundation of C++'s most celebrated programming idiom: **RAII**:\n- Resources (heap memory, open files, network sockets, thread mutex locks) are **acquired in the constructor**.\n- Those same resources are **guaranteed to be released in the destructor**.\n- Because destructors run automatically even during exception stack unwinding, RAII guarantees **zero resource leaks**.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "RAII File Wrapper with Automatic Cleanup",
        "code": "#include <iostream>\n#include <fstream>\n\nclass FileHandler {\nprivate:\n    std::ofstream fileStream;\n\npublic:\n    // Resource acquired in constructor\n    FileHandler(const std::string &filename) {\n        fileStream.open(filename);\n        std::cout << \"Resource Acquired: File opened.\\n\";\n    }\n\n    void writeLine(const std::string &text) {\n        if (fileStream.is_open()) fileStream << text << \"\\n\";\n    }\n\n    // Resource guaranteed to be released in destructor\n    ~FileHandler() {\n        if (fileStream.is_open()) {\n            fileStream.close();\n            std::cout << \"Resource Released: File closed safely by Destructor.\\n\";\n        }\n    }\n};\n\nint main() {\n    { // Enclosing block scope\n        FileHandler log(\"audit.log\");\n        log.writeLine(\"User login recorded.\");\n    } // log goes out of scope here: ~FileHandler() called automatically!\n\n    std::cout << \"Main continuing after file cleanup.\\n\";\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "A destructor (~ClassName) cleans up resources automatically when an object exits scope. It powers RAII (Resource Acquisition Is Initialization), ensuring leak-free resource management.",
      "keyConcepts": [
        "Destructor Syntax (~ClassName)",
        "Automatic Destruction Order",
        "RAII Resource Management Idiom",
        "Guaranteed Cleanup during Exceptions"
      ],
      "revisionNotes": "Destructors execute in exact reverse order of constructor invocations for local stack objects."
    }
  },
  "6-1": {
    "content": "### 6.1 Overloading Unary and Binary Operators\n\n**Operator Overloading** is a form of compile-time polymorphism that allows user-defined types (classes) to use standard C++ operators (`+`, `-`, `*`, `==`, `++`, `[]`).\n\n#### Syntax of Operator Functions\n```cpp\nreturn_type operator#(argument_list);\n```\nwhere `#` represents the operator being overloaded.\n\n#### 1. Overloading Binary Operators (e.g., `+`)\nWhen overloading a binary operator as a member function:\n- The **left-hand operand** becomes the calling object (`this` pointer).\n- The **right-hand operand** is passed as the single explicit argument.\n  ```cpp\n  Complex operator+(const Complex &other) const {\n      return Complex(real + other.real, imag + other.imag);\n  }\n  ```\n- `c3 = c1 + c2;` is translated by the compiler into `c3 = c1.operator+(c2);`.\n\n#### 2. Overloading Unary Operators (Prefix vs. Postfix `++`)\n- **Prefix (`++x`):** `Complex& operator++();` (Increments, then returns `*this`).\n- **Postfix (`x++`):** `Complex operator++(int);` (Accepts a dummy `int` parameter to distinguish signature, returns old state).\n\n#### Operators that CANNOT be Overloaded in C++\n1. `.` (Member access)\n2. `.*` (Pointer-to-member)\n3. `::` (Scope resolution)\n4. `?:` (Ternary conditional)\n5. `sizeof` (Object size)",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Overloading Binary + and Unary ++ Operators",
        "code": "#include <iostream>\n\nclass Complex {\nprivate:\n    double real, imag;\n\npublic:\n    Complex(double r = 0, double i = 0) : real(r), imag(i) {}\n\n    // Overload Binary + Operator\n    Complex operator+(const Complex &rhs) const {\n        return Complex(real + rhs.real, imag + rhs.imag);\n    }\n\n    // Overload Prefix ++ Operator (++obj)\n    Complex& operator++() {\n        real++; imag++;\n        return *this;\n    }\n\n    void display() const {\n        std::cout << real << \" + \" << imag << \"i\" << std::endl;\n    }\n};\n\nint main() {\n    Complex c1(3.0, 4.0);\n    Complex c2(1.5, 2.5);\n\n    Complex c3 = c1 + c2; // Calls c1.operator+(c2)\n    std::cout << \"c1 + c2 = \";\n    c3.display();\n\n    ++c3; // Calls c3.operator++()\n    std::cout << \"After ++c3: \";\n    c3.display();\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Operator overloading customizes operator behavior for user classes using operator#(). Binary operators receive the right operand as argument; prefix vs postfix ++ are distinguished by a dummy int parameter.",
      "keyConcepts": [
        "operator#() Syntax",
        "Binary Operator Overloading (c1 + c2)",
        "Prefix (++x) vs Postfix (x++) Overloading",
        "Non-Overloadable Operators (., ::, ?:, sizeof)"
      ],
      "revisionNotes": "Never alter the natural semantics of an operator; overloading + to perform subtraction confuses users and causes defects."
    }
  },
  "6-2": {
    "content": "### 6.2 Operator Overloading using Friend Functions\n\nWhile member functions handle many operator overloads, **Friend Functions** are necessary when:\n1. The **left-hand operand is not a class object** (e.g., streaming with `std::cout << myObj`).\n2. Symmetric arithmetic is needed (e.g., `5 + myObj` where an integer primitive is on the left).\n\n#### Overloading Stream Operators (`<<` and `>>`)\nIn the expression `std::cout << myObj;`:\n- The left-hand operand is `std::ostream` (from the standard library, which we cannot modify).\n- Therefore, the operator function **must be a non-member friend function**:\n\n```cpp\nfriend std::ostream& operator<<(std::ostream &out, const Complex &c);\nfriend std::istream& operator>>(std::istream &in, Complex &c);\n```\n\n#### Why Return Stream Reference (`ostream&`)?\nReturning the stream reference by reference enables **Chained Output Statements**:\n```cpp\nstd::cout << c1 << \" and \" << c2 << std::endl;\n```\nEach `<<` operation returns `std::cout`, allowing the next `<<` in the chain to proceed.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Stream Insertion (<<) Overloading via Friend Function",
        "code": "#include <iostream>\n\nclass Vector2D {\nprivate:\n    double x, y;\n\npublic:\n    Vector2D(double xVal = 0, double yVal = 0) : x(xVal), y(yVal) {}\n\n    // Overloading << as a friend function\n    friend std::ostream& operator<<(std::ostream &os, const Vector2D &v) {\n        os << \"(\" << v.x << \", \" << v.y << \")\";\n        return os; // Enables chaining\n    }\n};\n\nint main() {\n    Vector2D v1(3.5, 7.2);\n    Vector2D v2(10.0, -4.5);\n\n    // Chained stream printing\n    std::cout << \"Vector 1: \" << v1 << \" | Vector 2: \" << v2 << std::endl;\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Friend functions overload operators when the left-hand operand is an external class or primitive (such as ostream in cout << obj). Returning ostream& enables stream chaining.",
      "keyConcepts": [
        "Stream Overloading (operator<<, operator>>)",
        "Non-Member Overload Operators",
        "Chained Stream Invocations",
        "Friend Access to Private Members"
      ],
      "revisionNotes": "Always take ostream as non-const reference `std::ostream&` because writing to a stream mutates its internal buffer."
    }
  },
  "7-1": {
    "content": "### 7.1 Types of Inheritance & Access Specifiers in 'C++'\n\n**Inheritance** is the mechanism by which a new class (**Derived / Child Class**) inherits the data attributes and member functions of an existing class (**Base / Parent Class**), modeling an **`is-a` relationship** and facilitating code reuse.\n\n```\n                          Forms of Inheritance\n     ┌──────────────┬──────────────┬──────────────┬──────────────┐\n     ▼              ▼              ▼              ▼              ▼\n   Single        Multiple      Multilevel    Hierarchical      Hybrid\n   (A -> B)    (A, B -> C)    (A -> B -> C)   (A -> B, C)   (Diamond graph)\n```\n\n#### Forms of Inheritance\n1. **Single Inheritance:** A single derived class inherits from one single base class ($A \\rightarrow B$).\n2. **Multiple Inheritance:** A single derived class inherits directly from two or more base classes ($A, B \\rightarrow C$).\n3. **Multilevel Inheritance:** A class inherits from a derived class, forming a chain ($A \\rightarrow B \\rightarrow C$).\n4. **Hierarchical Inheritance:** Multiple derived classes inherit from a single common base class ($A \\rightarrow B$ and $A \\rightarrow C$).\n5. **Hybrid Inheritance:** A combination of two or more forms of inheritance (e.g., forming a diamond).\n\n#### Access Visibility in Inheritance Modes\nThe inheritance mode specifier (`public`, `protected`, or `private`) controls how inherited members appear in the derived class:\n\n| Base Class Member | `public` Inheritance | `protected` Inheritance | `private` Inheritance |\n| :--- | :--- | :--- | :--- |\n| **`public`** | Remains **`public`** | Becomes **`protected`** | Becomes **`private`** |\n| **`protected`** | Remains **`protected`** | Remains **`protected`** | Becomes **`private`** |\n| **`private`** | **Never accessible** | **Never accessible** | **Never accessible** |\n\n- `public` inheritance represents true subtyping (an `is-a` relationship).",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Multiple and Multilevel Inheritance in Action",
        "code": "#include <iostream>\n\n// Base Class 1\nclass PoweredDevice {\npublic:\n    void powerOn() { std::cout << \"Device powered ON\\n\"; }\n};\n\n// Base Class 2\nclass NetworkConnected {\npublic:\n    void connectWiFi() { std::cout << \"Connected to WiFi network\\n\"; }\n};\n\n// Multiple Inheritance: SmartTV inherits from both base classes\nclass SmartTV : public PoweredDevice, public NetworkConnected {\npublic:\n    void streamMovie() {\n        std::cout << \"Streaming 4K video...\\n\";\n    }\n};\n\nint main() {\n    SmartTV myTV;\n    myTV.powerOn();     // Inherited from PoweredDevice\n    myTV.connectWiFi(); // Inherited from NetworkConnected\n    myTV.streamMovie(); // Defined in SmartTV\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Inheritance models the 'is-a' relationship. Forms include Single, Multiple, Multilevel, Hierarchical, and Hybrid. Public inheritance preserves member visibility; private members are never accessible in derived classes.",
      "keyConcepts": [
        "Inheritance Modes (public, protected, private)",
        "Multiple Inheritance",
        "Multilevel Inheritance Chains",
        "is-a Relationship Modeling"
      ],
      "revisionNotes": "Public inheritance is standard; private inheritance represents implementation composition ('implemented-in-terms-of')."
    }
  },
  "7-2": {
    "content": "### 7.2 Virtual Base Classes & Abstract Base Classes\n\nTwo advanced inheritance concepts in C++ resolve structural ambiguity and define architectural contracts: **Virtual Base Classes** and **Abstract Base Classes**.\n\n#### 1. The Diamond Problem & Virtual Base Classes\nIn hybrid multiple inheritance, the **Diamond Problem** occurs when a class inherits from two classes that share a common grandparent:\n\n```\n         Grandparent Class (A)\n              /         \\\n             /           \\\n    Parent1 (B)         Parent2 (C)\n             \\           /\n              \\         /\n          Child Class (D)\n```\n- Without virtual inheritance, `Class D` receives **two separate copies of Class A's data members**, causing compiler ambiguity errors when referencing members of `A`.\n- **Solution — Virtual Base Class:** By inheriting using the `virtual` keyword:\n  ```cpp\n  class B : virtual public A { /* ... */ };\n  class C : virtual public A { /* ... */ };\n  ```\n  The compiler ensures that `Class D` contains only **one single, shared instance** of `Class A`.\n\n#### 2. Abstract Base Classes (ABCs) and Pure Virtual Functions\n- An **Abstract Base Class** defines an interface without providing complete implementation.\n- Contains at least one **Pure Virtual Function** (`virtual void func() = 0;`).\n- Forces all derived classes to implement the required interface before they can be instantiated.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Solving the Diamond Problem with Virtual Base Classes",
        "code": "#include <iostream>\n\nclass Device {\npublic:\n    int deviceId;\n};\n\n// Virtual inheritance ensures only ONE copy of Device exists in Smartphone\nclass Phone : virtual public Device {};\nclass Camera : virtual public Device {};\n\nclass Smartphone : public Phone, public Camera {\npublic:\n    void printId() {\n        // Unambiguous: only one shared deviceId exists!\n        std::cout << \"Smartphone Unified Device ID: \" << deviceId << std::endl;\n    }\n};\n\nint main() {\n    Smartphone sp;\n    sp.deviceId = 9001; // No ambiguity!\n    sp.printId();\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Virtual Base Classes solve the Diamond Problem by ensuring derived classes share a single copy of grandparent members. Abstract Base Classes enforce design contracts using pure virtual functions (= 0).",
      "keyConcepts": [
        "The Diamond Problem",
        "Virtual Base Class (virtual public Base)",
        "Shared Instance Layout",
        "Abstract Base Classes (ABCs) & Interfaces"
      ],
      "revisionNotes": "An abstract class cannot be instantiated directly; you can only instantiate concrete derived classes that implement all pure virtual methods."
    }
  },
  "7-3": {
    "content": "### 7.3 Constructor and Destructor Calling Order in Inheritance\n\nUnderstanding the exact sequence in which constructors and destructors execute across an inheritance hierarchy is essential for memory safety.\n\n#### 1. Constructor Execution Order: Top-Down (Base to Derived)\nWhen an object of a derived class is created:\n1. **Base class constructors execute first**, starting from the root of the hierarchy down to the derived class.\n2. If multiple base classes are present, they execute in the **exact order they appear in the class declaration list**, NOT in the order listed in the member initializer list.\n3. Finally, the derived class constructor body executes.\n\n#### 2. Destructor Execution Order: Bottom-Up (Derived to Base)\nWhen the derived object goes out of scope or is deleted:\n1. The **derived class destructor executes first**, cleaning up derived members.\n2. Destructors of base classes execute in the **exact reverse order** of construction, finishing at the root base class.\n\n```\n Object Creation:           Object Destruction:\n 1. Base Constructor        1. Derived Destructor\n    └── 2. Derived Constr.     └── 2. Base Destructor\n```\n\n#### Virtual Destructors in Base Classes\nIf an object of a derived class is deleted via a base class pointer (`Base *b = new Derived(); delete b;`), the base class destructor **MUST be marked `virtual`**!\n- Without a `virtual` destructor, only the base destructor runs; the derived destructor is bypassed, causing memory and resource leaks.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Constructor/Destructor Order and Virtual Destructors",
        "code": "#include <iostream>\n\nclass Base {\npublic:\n    Base()  { std::cout << \"1. Base Constructor\\n\"; }\n    virtual ~Base() { std::cout << \"4. Base Destructor\\n\"; }\n};\n\nclass Derived : public Base {\npublic:\n    Derived() { std::cout << \"2. Derived Constructor\\n\"; }\n    ~Derived() override { std::cout << \"3. Derived Destructor\\n\"; }\n};\n\nint main() {\n    std::cout << \"--- Stack Object Lifecycle ---\\n\";\n    {\n        Derived d; // Construction: 1 -> 2 | Destruction: 3 -> 4\n    }\n\n    std::cout << \"\\n--- Polymorphic Pointer Deletion ---\\n\";\n    Base *poly = new Derived();\n    delete poly; // Safely executes Derived Destructor, then Base Destructor!\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Constructors execute top-down (Base to Derived); destructors execute in reverse bottom-up order (Derived to Base). Base classes must have virtual destructors to ensure derived cleanup during polymorphic deletions.",
      "keyConcepts": [
        "Construction Sequence (Base -> Derived)",
        "Destruction Sequence (Derived -> Base)",
        "Declaration Order in Multiple Inheritance",
        "Virtual Destructor Mandate"
      ],
      "revisionNotes": "Always make base class destructors virtual: `virtual ~Base() = default;`."
    }
  },
  "8-1": {
    "content": "### 8.1 File Stream Classes and Operations in 'C++'\n\nIn C++, file input and output is managed using object-oriented stream abstractions defined in **`<fstream>`**.\n\n#### The Three Core File Stream Classes\n1. **`std::ifstream` (Input File Stream):** Specialized for reading data from files.\n2. **`std::ofstream` (Output File Stream):** Specialized for writing and creating files.\n3. **`std::fstream` (File Stream):** General-purpose bidirectional stream supporting simultaneous reading and writing.\n\n#### File Opening Modes (`std::ios::`)\nModes can be combined using the bitwise OR operator (`|`):\n\n| File Mode Flag | Meaning |\n| :--- | :--- |\n| **`std::ios::in`** | Open for reading (default for `ifstream`) |\n| **`std::ios::out`**| Open for writing (default for `ofstream`, truncates existing content) |\n| **`std::ios::app`**| Append writes to the end of the file |\n| **`std::ios::ate`**| Open file and seek immediately to the end (at-the-end) |\n| **`std::ios::trunc`**| Discard existing contents (truncate to 0 bytes) |\n| **`std::ios::binary`**| Open in raw binary mode (disables newline translation) |\n\n#### Automatic RAII Cleanup\nBecause file streams are C++ classes, their **destructors automatically call `close()`** when the stream object exits scope.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "File Writing and Reading with <fstream>",
        "code": "#include <iostream>\n#include <fstream>\n#include <string>\n\nint main() {\n    // 1. Write text using ofstream (with RAII automatic close)\n    {\n        std::ofstream outFile(\"config.txt\");\n        if (!outFile) {\n            std::cerr << \"Error opening file for write!\\n\";\n            return 1;\n        }\n        outFile << \"SERVER_PORT=8080\\n\";\n        outFile << \"ENVIRONMENT=production\\n\";\n        outFile << \"MAX_CONNECTIONS=1000\\n\";\n    } // File closed automatically here by ~ofstream()\n\n    // 2. Read back lines using ifstream\n    std::ifstream inFile(\"config.txt\");\n    std::string line;\n    std::cout << \"Reading config.txt contents:\\n\";\n    while (std::getline(inFile, line)) {\n        std::cout << \"-> \" << line << std::endl;\n    }\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C++ file handling uses ifstream (reading), ofstream (writing), and fstream (bidirectional) from <fstream>. Stream destructors automatically close files via RAII.",
      "keyConcepts": [
        "ifstream, ofstream, fstream",
        "File Open Modes (ios::in, ios::out, ios::app, ios::binary)",
        "Stream Operator Symmetry (<< and >>)",
        "Automatic RAII Closure"
      ],
      "revisionNotes": "Always verify file stream validity using `if (!file)` before reading or writing."
    }
  },
  "8-2": {
    "content": "### 8.2 File Pointers and Stream Positioning in 'C++'\n\nEvery open file stream maintains internal **file position pointers** tracking the current read or write byte location.\n\n#### The Get and Put Pointers\n- **Get Pointer (`seekg` and `tellg`):** Belongs to input streams (`ifstream`), tracking where the next read occurs.\n- **Put Pointer (`seekp` and `tellp`):** Belongs to output streams (`ofstream`), tracking where the next write occurs.\n\n#### Seeking Functions\n```cpp\n// Move read (get) pointer\nstream.seekg(offset, seek_direction);\n\n// Move write (put) pointer\nstream.seekp(offset, seek_direction);\n```\n\n#### Seek Directions (`std::ios::`)\n- **`std::ios::beg`:** Offset relative to the **beginning** of the file.\n- **`std::ios::cur`:** Offset relative to the **current** pointer position.\n- **`std::ios::end`:** Offset relative to the **end** of the file.\n\n#### Getting Current Position\n- `long pos = stream.tellg();` // Current read byte offset\n- `long pos = stream.tellp();` // Current write byte offset",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Inspecting File Positions with seekg and tellg",
        "code": "#include <iostream>\n#include <fstream>\n\nint main() {\n    std::ofstream out(\"alphabet.txt\");\n    out << \"ABCDEFGHIJKLMNOPQRSTUVWXYZ\";\n    out.close();\n\n    std::ifstream in(\"alphabet.txt\");\n\n    // 1. Calculate file size using tellg\n    in.seekg(0, std::ios::end);\n    std::streampos fileSize = in.tellg();\n    std::cout << \"File size: \" << fileSize << \" bytes\" << std::endl;\n\n    // 2. Seek to byte 7 (8th letter: 'H')\n    in.seekg(7, std::ios::beg);\n    char ch;\n    in.get(ch);\n    std::cout << \"Character at byte offset 7: \" << ch << std::endl;\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C++ distinguishes between get pointers for reading (seekg, tellg) and put pointers for writing (seekp, tellp). Seek directions include ios::beg, ios::cur, and ios::end.",
      "keyConcepts": [
        "seekg() & seekp() Navigation",
        "tellg() & tellp() Tracking",
        "Seek Directions (beg, cur, end)",
        "Computing File Size"
      ],
      "revisionNotes": "Remember: 'g' stands for Get (reading); 'p' stands for Put (writing)."
    }
  },
  "8-3": {
    "content": "### 8.3 File Updating with Binary Random Access\n\nStandard text streams perform formatted string translations. For high-speed data storage and database record updates, **Binary Random Access** writes raw memory bytes directly to disk.\n\n#### Raw Binary Functions\n```cpp\n// Write raw bytes directly from RAM to file\nstream.write(reinterpret_cast<const char*>(&object), sizeof(object));\n\n// Read raw bytes directly from file into RAM\nstream.read(reinterpret_cast<char*>(&object), sizeof(object));\n```\n\n#### In-Place Record Updating\nTo update record $N$ in a binary file without rewriting preceding records:\n1. Open in bidirectional binary mode: `std::fstream file(\"data.bin\", std::ios::in | std::ios::out | std::ios::binary);`.\n2. Seek write pointer directly to record $N$:\n   ```cpp\n   file.seekp(N * sizeof(Record), std::ios::beg);\n   ```\n3. Write the updated record structure:\n   ```cpp\n   file.write(reinterpret_cast<char*>(&updatedRec), sizeof(Record));\n   ```",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "In-Place Binary Record Serialization & Updating",
        "code": "#include <iostream>\n#include <fstream>\n\nstruct Player {\n    int id;\n    int score;\n};\n\nint main() {\n    std::fstream file(\"players.bin\", std::ios::in | std::ios::out | std::ios::trunc | std::ios::binary);\n\n    Player p1 = {1, 150};\n    Player p2 = {2, 280};\n\n    // Write 2 binary records\n    file.write(reinterpret_cast<char*>(&p1), sizeof(Player));\n    file.write(reinterpret_cast<char*>(&p2), sizeof(Player));\n\n    // Update Player 2's score in-place: jump to 2nd record\n    p2.score = 500;\n    file.seekp(1 * sizeof(Player), std::ios::beg);\n    file.write(reinterpret_cast<char*>(&p2), sizeof(Player));\n\n    // Read back Player 2 to verify update\n    Player verify;\n    file.seekg(1 * sizeof(Player), std::ios::beg);\n    file.read(reinterpret_cast<char*>(&verify), sizeof(Player));\n\n    std::cout << \"Updated Record 2: ID = \" << verify.id \n              << \", New Score = \" << verify.score << std::endl;\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "Binary I/O uses write() and read() with reinterpret_cast<char*> to store raw memory structs. In-place updates reposition the seekp pointer to record offsets: index * sizeof(Record).",
      "keyConcepts": [
        "Binary File Mode (ios::binary)",
        "write() and read() Block Transfers",
        "reinterpret_cast<char*> Casting",
        "In-Place Record Updation"
      ],
      "revisionNotes": "Never write classes containing raw pointers or dynamic strings (like std::string) directly with binary read/write; serialize scalar members instead."
    }
  },
  "9-1": {
    "content": "### 9.1 Standard Exception Classes in 'C++'\n\n**Exception handling** is a structured mechanism in C++ to detect, propagate, and recover from anomalous runtime conditions without crashing the application.\n\n#### The `std::exception` Hierarchy (`<stdexcept>`)\nAll standard C++ exceptions inherit from the root **`std::exception`** class:\n\n```\n                          std::exception (root)\n                                     ▲\n               ┌─────────────────────┴─────────────────────┐\n               ▼                                           ▼\n       std::logic_error                            std::runtime_error\n    (Bugs detectable by logic)                 (Errors detectable at runtime)\n    ├── std::invalid_argument                  ├── std::overflow_error\n    ├── std::out_of_range                      ├── std::underflow_error\n    └── std::domain_error                      └── std::range_error\n```\n\n#### Other Core Standard Exceptions\n- **`std::bad_alloc`:** Thrown by `new` when system heap memory is exhausted.\n- **`std::bad_cast`:** Thrown by `dynamic_cast` on reference downcast failure.\n\n#### The `.what()` Virtual Method\nEvery class in the exception hierarchy implements the virtual method:\n```cpp\nvirtual const char* what() const noexcept;\n```\n- Returns an explanatory, null-terminated C-string describing the error cause.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Standard Exceptions & .what() Diagnostics",
        "code": "#include <iostream>\n#include <vector>\n#include <stdexcept>\n\nvoid processScore(int score) {\n    if (score < 0 || score > 100) {\n        throw std::invalid_argument(\"Score must be between 0 and 100!\");\n    }\n    std::cout << \"Score registered: \" << score << std::endl;\n}\n\nint main() {\n    try {\n        processScore(85);\n        processScore(150); // Throws std::invalid_argument\n    } catch (const std::exception &ex) {\n        std::cerr << \"Standard Exception Caught: \" << ex.what() << std::endl;\n    }\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "C++ exceptions inherit from std::exception, divided into logic_error (preventable bugs) and runtime_error (unforeseeable environment errors). The .what() method returns error descriptions.",
      "keyConcepts": [
        "std::exception Root Class",
        "logic_error vs runtime_error",
        "out_of_range & invalid_argument",
        "what() Diagnostic String"
      ],
      "revisionNotes": "Always catch exceptions by const reference: `catch (const std::exception &e)` to prevent object slicing."
    }
  },
  "9-2": {
    "content": "### 9.2 Implementing Try, Catch, and Stack Unwinding\n\nException handling in C++ is structured around three keywords: **`try`**, **`catch`**, and **`throw`**.\n\n#### Syntax & Structure\n```cpp\ntry {\n    // Protected code that may throw an exception\n} catch (const SpecificException &e) {\n    // Handler for specific exception\n} catch (...) {\n    // Catch-All Handler (catches any type)\n}\n```\n\n#### Stack Unwinding\nWhen an exception is thrown:\n1. The C++ runtime halts execution in the current function.\n2. It walks backward up the **Call Stack** looking for an enclosing `try...catch` block.\n3. During this search, **all local stack objects in exited scopes are automatically destroyed, and their destructors are executed!**\n4. This automatic destruction during error propagation is called **Stack Unwinding**.\n\n#### The Catch-All Handler (`catch (...)`)\nA catch block with an ellipsis (`...`) catches **any exception of any data type**, acting as a fallback safety net to prevent application termination.",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Stack Unwinding with Automatic Destructor Execution",
        "code": "#include <iostream>\n#include <stdexcept>\n\nclass Resource {\npublic:\n    Resource()  { std::cout << \"Resource constructed.\\n\"; }\n    ~Resource() { std::cout << \"Resource safely cleaned up by Stack Unwinding!\\n\"; }\n};\n\nvoid riskyFunction() {\n    Resource r; // Stack object\n    std::cout << \"Executing risky function...\\n\";\n    throw std::runtime_error(\"Unexpected network failure!\");\n}\n\nint main() {\n    try {\n        riskyFunction();\n    } catch (const std::runtime_error &e) {\n        std::cerr << \"Caught in main: \" << e.what() << std::endl;\n    } catch (...) {\n        std::cerr << \"Catch-All: Unknown exception caught!\\n\";\n    }\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "try blocks wrap code that may throw; catch blocks handle errors. Stack unwinding automatically executes destructors of local objects as the stack is cleared during an exception.",
      "keyConcepts": [
        "try, catch, throw Flow",
        "Stack Unwinding Guarantee",
        "Catch-All Handler catch (...)",
        "Destructor Execution Safety"
      ],
      "revisionNotes": "Never allow a destructor to throw an exception during stack unwinding; doing so calls std::terminate immediately."
    }
  },
  "9-3": {
    "content": "### 9.3 The Throw Keyword & Custom Exceptions in 'C++'\n\nThe **`throw`** keyword raises an exception, interrupting normal control flow and transferring execution to the nearest matching `catch` block.\n\n#### 1. Throwing Exceptions\nYou can throw primitive values, strings, or exception objects:\n```cpp\nthrow 404;                              // Throw int error code\nthrow std::runtime_error(\"DB Timeout\"); // Throw standard object\n```\n\n#### 2. Re-Throwing Exceptions (`throw;`)\nInside a `catch` block, a bare `throw;` statement without arguments **re-throws the current exception** up to the next enclosing caller:\n```cpp\ntry {\n    // ...\n} catch (const std::exception &e) {\n    logError(e.what());\n    throw; // Re-throw to caller\n}\n```\n\n#### 3. Creating Custom Exception Classes\nIn professional C++ software engineering, domain-specific exceptions are created by subclassing **`std::exception`**:\n```cpp\nclass InsufficientFundsException : public std::exception {\npublic:\n    const char* what() const noexcept override {\n        return \"Transaction Failed: Insufficient Account Balance!\";\n    }\n};\n```",
    "codeSnippets": [
      {
        "language": "cpp",
        "title": "Custom Exception Class Subclassing std::exception",
        "code": "#include <iostream>\n#include <stdexcept>\n\nclass InsufficientBalanceException : public std::exception {\nprivate:\n    std::string message;\n\npublic:\n    InsufficientBalanceException(double balance, double amount) {\n        message = \"Attempted to withdraw $\" + std::to_string(amount) + \n                  \" with only $\" + std::to_string(balance) + \" available!\";\n    }\n\n    const char* what() const noexcept override {\n        return message.c_str();\n    }\n};\n\nvoid withdraw(double balance, double amount) {\n    if (amount > balance) {\n        throw InsufficientBalanceException(balance, amount);\n    }\n    std::cout << \"Withdrawal of $\" << amount << \" successful!\\n\";\n}\n\nint main() {\n    try {\n        withdraw(200.0, 50.0);\n        withdraw(150.0, 300.0); // Throws custom exception\n    } catch (const InsufficientBalanceException &ex) {\n        std::cerr << \"Custom Exception: \" << ex.what() << std::endl;\n    }\n\n    return 0;\n}"
      }
    ],
    "aiSummary": {
      "summary": "The throw keyword raises exceptions. Re-throwing uses a bare throw;. Custom exceptions inherit from std::exception and override what() to provide domain-specific diagnostic messages.",
      "keyConcepts": [
        "throw Expressions",
        "Re-Throwing (throw;)",
        "Custom Exception Classes",
        "Overriding what() noexcept"
      ],
      "revisionNotes": "Always mark your custom `what()` method as `noexcept` to match `std::exception`'s virtual signature."
    }
  }
};
