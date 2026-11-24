/**
 * Enriched Content Data for Programming in 'C++' (Part 2: Modules 4 through 6)
 * Topics:
 * - Module 4: Function in 'C++' (4.1 - 4.6)
 * - Module 5: Constructors and Destructor (5.1 - 5.4)
 * - Module 6: Operator Overloading (6.1 - 6.2)
 */

module.exports = {
    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 4: FUNCTION IN 'C++'
    // ═════════════════════════════════════════════════════════════════════════
    "4-1": {
        content: `### 4.1 Call by Reference and Return by Reference in 'C++'

In C, passing by reference requires raw pointer addressing (\`&x\`) and dereferencing (\`*ptr\`). C++ introduces native **Reference Parameters (\`type &ref\`)**, enabling direct modification of caller variables with clean scalar syntax.

#### 1. Call by Reference
When a formal parameter is declared as a reference (\`void func(int &x)\`):
- It binds directly as an **alias** to the caller's actual argument in memory.
- No copy is created, and no pointer dereference operator (\`*\`) is required.
- Any change inside the function immediately mutates the caller's variable.

#### 2. Passing by \`const\` Reference (\`const Type &param\`)
- Combines the **efficiency of references** (no copying of large objects) with the **safety of call by value** (the caller's data cannot be modified).
- Standard practice in modern C++ for passing strings, vectors, and complex classes.

#### 3. Return by Reference (\`Type& func()\`)
A function can return a reference to an existing object:
- Allows the function call itself to appear as an **lvalue on the left-hand side of an assignment**!
  \`\`\`cpp
  int& getElement(int i) { return arr[i]; }
  getElement(2) = 500; // Directly assigns 500 to arr[2]!
  \`\`\`
- **CRITICAL WARNING:** **Never return a reference to a local stack variable!** The local variable is destroyed when the function returns, resulting in an undefined dangling reference.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Clean Call by Reference and Return by Reference',
                code: `#include <iostream>

// Clean reference swap without pointers
void swap(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;
}

// Returning reference to static array element (lvalue)
int globalArray[5] = {10, 20, 30, 40, 50};

int& at(int index) {
    return globalArray[index]; // Safe: globalArray persists in data segment
}

int main() {
    int x = 10, y = 99;
    std::cout << "Before swap: x=" << x << ", y=" << y << std::endl;
    swap(x, y);
    std::cout << "After swap:  x=" << x << ", y=" << y << std::endl;

    // Using a function call as an lvalue assignment target!
    at(2) = 777;
    std::cout << "Modified globalArray[2] via return-by-reference: " 
              << globalArray[2] << std::endl;

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C++ reference parameters enable Call by Reference without pointer dereferencing. Return by Reference allows functions to act as lvalue assignment targets, but must never return references to local stack variables.",
            keyConcepts: ["Reference Parameters (&)", "Passing by const Reference (Performance & Safety)", "Return by Reference (lvalue Functions)", "Dangling Reference Hazards"],
            revisionNotes: "Always pass large objects via `const MyClass &obj` rather than by value to avoid copying overhead."
        }
    },

    "4-2": {
        content: `### 4.2 Function Overloading & Default Arguments

C++ provides two powerful features to simplify function interfaces: **Function Overloading** (compile-time polymorphism) and **Default Arguments**.

#### 1. Function Overloading
**Function Overloading** allows multiple functions to share the **exact same name**, provided they have **different parameter signatures**:
- Different number of parameters.
- Different types of parameters.
- Different sequence/order of parameter types.
- *Note: Return type alone does NOT distinguish overloaded functions.*

#### How Overloading Works: Name Mangling
The C++ compiler encodes parameter types into the internal symbol table names (**Name Mangling**). For instance, \`add(int, int)\` becomes \`_Z3addii\`, while \`add(double, double)\` becomes \`_Z3adddd\`.

#### 2. Default Arguments
C++ allows function parameters to have default fallback values if the caller omits them:
\`\`\`cpp
void printBanner(std::string text, int times = 1, char border = '=');
\`\`\`
- Rules: **Default parameters must be placed from right to left.** Once a parameter has a default, all subsequent parameters to its right must also have defaults.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Overloading & Default Arguments in Action',
                code: `#include <iostream>

// Overloaded functions: differentiated by parameter types
int calculate(int a, int b) {
    return a + b;
}

double calculate(double a, double b) {
    return a * b;
}

// Function with default arguments
void displayInfo(std::string label, int count = 1, bool uppercase = false) {
    std::cout << label << " [Count: " << count 
              << ", Mode: " << (uppercase ? "UPPER" : "normal") << "]\\n";
}

int main() {
    std::cout << "Integer calculate(10, 20):  " << calculate(10, 20) << std::endl;
    std::cout << "Double calculate(2.5, 4.0):  " << calculate(2.5, 4.0) << std::endl;

    // Utilizing default arguments
    displayInfo("Server Status");            // Uses count=1, uppercase=false
    displayInfo("Error Log", 5);             // Uses uppercase=false
    displayInfo("Warning Alert", 3, true);   // Supplies all 3 arguments

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Function Overloading permits multiple functions with identical names distinguished by parameter lists (via name mangling). Default arguments provide fallback values and must be trailing from right to left.",
            keyConcepts: ["Function Overloading Signatures", "Compiler Name Mangling", "Default Argument Rules (Right-to-Left)", "Ambiguity Resolution"],
            revisionNotes: "Do not combine default arguments with overloaded functions in ways that introduce ambiguity: `void f(int)` vs `void f(int, int=0)`."
        }
    },

    "4-3": {
        content: `### 4.3 Inline Functions in 'C++'

In standard function calls, the CPU performs an overhead sequence: pushing arguments onto the stack, saving the instruction pointer, jumping to the function body, executing, popping the stack, and returning. For small 1-line functions executed millions of times inside a loop, this overhead impairs performance.

#### The \`inline\` Keyword
An **inline function** is a function where the compiler substitutes the function's machine code **directly at the call site**, eliminating the function call overhead completely.

\`\`\`cpp
inline int square(int x) {
    return x * x;
}
\`\`\`

#### Inline Functions vs. Preprocessor Macros
| Feature | Inline Function (\`inline\`) | Preprocessor Macro (\`#define\`) |
| :--- | :--- | :--- |
| **Type Checking** | Strict compile-time type verification | No type checking (raw text replacement) |
| **Side Effects** | Safe (\`square(x++)\` evaluates once) | Dangerous (\`SQUARE(x++)\` increments twice!) |
| **Debugging** | Supported in GDB / debuggers | Inaccessible to debuggers |
| **Member Access** | Can access private class members | Cannot access class encapsulation |

#### Compiler Discretion
The \`inline\` keyword is a **hint/request to the compiler**, not a command. The compiler may refuse to inline if the function is too large, contains complex loops/switches, or involves recursion.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Inline Function vs Macro Side-Effect Safety',
                code: `#include <iostream>

#define MACRO_SQUARE(x) ((x) * (x))

inline int inlineSquare(int x) {
    return x * x;
}

int main() {
    int a = 3;
    // Macro bug: (a++) * (a++) -> increments 'a' twice!
    int resMacro = MACRO_SQUARE(a++);
    std::cout << "Macro result with a++: " << resMacro << " (a became " << a << ")\\n";

    int b = 3;
    // Inline function is type-safe and evaluates parameter exactly once
    int resInline = inlineSquare(b++);
    std::cout << "Inline result with b++: " << resInline << " (b became " << b << ")\\n";

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "inline functions eliminate function call stack overhead by substituting the function body directly at call sites. Unlike preprocessor macros, inline functions provide type safety, scope rules, and debuggability.",
            keyConcepts: ["Function Call Overhead", "inline Substitution", "Type Safety vs Macros", "Compiler Discretion (Inlining limits)"],
            revisionNotes: "Keep inline functions short (1-3 lines). Inlining large functions increases binary executable code bloat."
        }
    },

    "4-4": {
        content: `### 4.4 Static Class Members in 'C++'

In standard classes, each instantiated object receives its own independent copy of data members. A **\`static\` class member** belongs to the **class itself**, rather than to any individual object instance.

#### 1. Static Data Members
- Only a **single copy** exists in memory, shared across all instantiated objects of that class.
- Stored in the **Data Segment**, not inside object stack frames.
- **Must be defined and initialized outside the class** using the scope resolution operator (\`::\`).
- Common use case: Tracking object instance counters or global configuration settings.

#### 2. Static Member Functions
- Can be invoked directly using the class name without creating an object: \`ClassName::method()\`.
- **Has NO \`this\` pointer!**
- **Can ONLY access \`static\` data members and call other \`static\` functions.** They cannot access standard non-static instance members because they are not bound to any specific object instance.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Tracking Active Object Instances with Static Members',
                code: `#include <iostream>

class Worker {
private:
    int workerId;
    static int activeWorkersCount; // Declared inside class

public:
    Worker(int id) : workerId(id) {
        activeWorkersCount++;
    }

    ~Worker() {
        activeWorkersCount--;
    }

    // Static member function (operates without object instance)
    static int getActiveCount() {
        return activeWorkersCount; // Can only access static variables
    }
};

// Definition and initialization outside class in file scope
int Worker::activeWorkersCount = 0;

int main() {
    std::cout << "Initial active count: " << Worker::getActiveCount() << std::endl;

    Worker *w1 = new Worker(101);
    Worker *w2 = new Worker(102);
    std::cout << "Active count after spawns: " << Worker::getActiveCount() << std::endl;

    delete w1; // Destructor decrements static counter
    std::cout << "Active count after deleting w1: " << Worker::getActiveCount() << std::endl;

    delete w2;
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Static data members are shared across all instances and initialized outside the class. Static member functions can be called via Class::method(), have no this pointer, and can only access static data.",
            keyConcepts: ["Shared Class Variables", "Definition Outside Class (::)", "Static Functions (No this pointer)", "Object Instance Tracking"],
            revisionNotes: "Remember: Static member functions cannot access non-static instance variables because they do not have a `this` pointer."
        }
    },

    "4-5": {
        content: `### 4.5 Friend Functions and Friend Classes in 'C++'

Encapsulation dictates that \`private\` and \`protected\` class members are strictly inaccessible to external functions. The **\`friend\`** keyword provides a controlled exception, granting non-member functions or other classes access to private data.

#### 1. Friend Function
- A non-member function granted access to a class's private sections by declaring it inside the class prefixed with \`friend\`.
- Not a member of the class, so it is **not called using an object and dot operator** (\`obj.func()\`). Instead, it receives objects as parameters (\`func(obj)\`).

#### 2. Friend Class
- Granting an entire class friendship: \`friend class ClassB;\`.
- All member functions of \`ClassB\` can access the private members of \`ClassA\`.

#### Important Properties of Friendship
1. **Friendship is not mutual:** If A is a friend of B, B is not automatically a friend of A.
2. **Friendship is not inherited:** Derived classes do not inherit parent friendships.
3. **Friendship is not transitive:** If A is a friend of B, and B is a friend of C, A is not a friend of C.

#### Primary Use Cases
- Overloading stream insertion (\`<<\`) and extraction (\`>>\`) operators.
- High-performance mathematical libraries bridging matrices and vectors.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Friend Function Accessing Private Members of Two Classes',
                code: `#include <iostream>

class Beta; // Forward declaration

class Alpha {
private:
    int dataAlpha;
public:
    Alpha(int a) : dataAlpha(a) {}
    // Declaring friend function
    friend void compareValues(const Alpha &a, const Beta &b);
};

class Beta {
private:
    int dataBeta;
public:
    Beta(int b) : dataBeta(b) {}
    // Granting friendship to the same external function
    friend void compareValues(const Alpha &a, const Beta &b);
};

// Non-member friend function accesses private members of both classes
void compareValues(const Alpha &a, const Beta &b) {
    if (a.dataAlpha > b.dataBeta)
        std::cout << "Alpha is greater (" << a.dataAlpha << " > " << b.dataBeta << ")\\n";
    else
        std::cout << "Beta is greater or equal (" << b.dataBeta << " >= " << a.dataAlpha << ")\\n";
}

int main() {
    Alpha objA(45);
    Beta objB(80);
    compareValues(objA, objB);
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Friend functions and friend classes are granted access to private and protected members of a class. Friendship is neither mutual, inherited, nor transitive, and is primarily used for operator overloading.",
            keyConcepts: ["friend Keyword", "Non-Member Access to Private Data", "Friend Classes", "Operator Overloading Utilities"],
            revisionNotes: "Use friend judiciously; excessive use breaks encapsulation and couples classes tightly."
        }
    },

    "4-6": {
        content: `### 4.6 Virtual Functions & Runtime Polymorphism

**Runtime Polymorphism** (or Late / Dynamic Binding) is the ability of C++ to resolve function calls at execution time based on the **actual type of the object pointed to**, rather than the compile-time type of the pointer.

#### The Virtual Function Mechanism (\`virtual\`)
When a base class declares a member function as \`virtual\`, it instructs the compiler: *"Do not bind this call at compile time. Look up the actual object's overriding method at runtime."*

\`\`\`cpp
class Base {
public:
    virtual void show() { std::cout << "Base\\n"; }
};

class Derived : public Base {
public:
    void show() override { std::cout << "Derived\\n"; }
};
\`\`\`

#### How Runtime Binding Works: vptr and vtable
1. **vtable (Virtual Table):** A static array of function pointers generated by the compiler for every class containing virtual functions.
2. **vptr (Virtual Table Pointer):** A hidden 8-byte pointer injected into every object instance pointing to its class's vtable.
3. When \`ptr->show()\` is invoked:
   - The CPU follows the object's \`vptr\` to the \`vtable\`.
   - It fetches the function pointer corresponding to \`show()\` and executes the derived implementation.

\`\`\`
 Base Pointer: Base *p = new Derived();
 p ──► [ vptr ] ──► Derived vtable ──► Derived::show()
       [ data ]
\`\`\`

#### Pure Virtual Functions and Abstract Classes
- A **Pure Virtual Function** has no implementation in the base class and is declared with \`= 0\`:
  \`\`\`cpp
  virtual void draw() = 0;
  \`\`\`
- A class containing at least one pure virtual function is an **Abstract Base Class (ABC)** and cannot be instantiated directly.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Virtual Functions & Runtime Dynamic Dispatch',
                code: `#include <iostream>
#include <vector>

class Animal {
public:
    virtual void makeSound() const {
        std::cout << "Generic animal sound\\n";
    }
    virtual ~Animal() = default; // Always make base destructors virtual!
};

class Dog : public Animal {
public:
    void makeSound() const override {
        std::cout << "Woof! Woof!\\n";
    }
};

class Cat : public Animal {
public:
    void makeSound() const override {
        std::cout << "Meow!\\n";
    }
};

int main() {
    // Polymorphic collection of base pointers
    std::vector<Animal*> animals = { new Dog(), new Cat(), new Animal() };

    std::cout << "Polymorphic Dynamic Dispatch:\\n";
    for (Animal *a : animals) {
        a->makeSound(); // Dispatched dynamically at runtime via vtable!
    }

    for (Animal *a : animals) delete a;
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Virtual functions enable runtime polymorphism via dynamic binding. The compiler creates a vtable of function pointers and injects a vptr into each object. Pure virtual functions (= 0) create Abstract Classes.",
            keyConcepts: ["virtual Keyword & override", "Dynamic Binding vs Static Binding", "vtable and vptr Mechanics", "Pure Virtual Functions & Abstract Classes"],
            revisionNotes: "Always declare the base class destructor as `virtual ~Base()` to prevent memory leaks when deleting derived objects via base pointers."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 5: CONSTRUCTORS AND DESTRUCTOR
    // ═════════════════════════════════════════════════════════════════════════
    "5-1": {
        content: `### 5.1 Concept of Constructors in 'C++'

A **constructor** is a specialized member function called **automatically** by the runtime whenever an object of that class is instantiated in memory.

#### Properties of Constructors
1. **Identical Name:** The constructor has the exact same name as the class.
2. **No Return Type:** Constructors do not have any return type—**not even \`void\`**.
3. **Automatic Invocation:** Invoked implicitly when an object is created on the stack or via \`new\` on the heap.
4. **Public Placement:** Placed in the \`public\` section (unless implementing singleton or factory patterns).

#### Member Initializer Lists
Modern C++ strongly advocates initializing member variables using **Member Initializer Lists** rather than assignments inside the constructor body:
\`\`\`cpp
// PREFERRED: Member Initializer List (directly initializes members)
Point(int x, int y) : xCoord(x), yCoord(y) {}

// LESS EFFICIENT: Default initializes first, then assigns
Point(int x, int y) {
    xCoord = x;
    yCoord = y;
}
\`\`\`
- Mandatory for: \`const\` members, reference members, and base class constructors.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Constructors & Member Initializer Lists',
                code: `#include <iostream>

class ServerConfig {
private:
    const int port; // Const member: MUST be initialized in initializer list!
    std::string hostname;

public:
    // Member Initializer List syntax
    ServerConfig(std::string host, int p) : port(p), hostname(host) {
        std::cout << "ServerConfig initialized for " << hostname << ":" << port << std::endl;
    }

    void display() const {
        std::cout << "Host: " << hostname << " | Port: " << port << std::endl;
    }
};

int main() {
    ServerConfig srv("api.higenlabs.in", 443);
    srv.display();
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "A constructor is an automatically invoked initialization method matching the class name with no return type. Member initializer lists initialize fields directly, required for const and reference members.",
            keyConcepts: ["Automatic Initialization", "No Return Type", "Member Initializer Lists (: member(val))", "Const/Reference Member Initialization"],
            revisionNotes: "Always use member initializer lists; they avoid the double-initialization penalty of complex member objects."
        }
    },

    "5-2": {
        content: `### 5.2 Types of Constructors in 'C++'

C++ supports four distinct categories of constructors:

\`\`\`
                          Types of Constructors
      ┌──────────────────────┬──────────────────────┬──────────────────────┐
      ▼                      ▼                      ▼                      ▼
   Default             Parameterized               Copy                   Move
 (Zero arguments)    (Custom arguments)       (Deep/Shallow copy)    (Transfer ownership)
\`\`\`

#### 1. Default Constructor
Takes no arguments (or all arguments have defaults). If no constructor is written, the compiler synthesizes a default constructor automatically.

#### 2. Parameterized Constructor
Accepts arguments to initialize object attributes with custom values upon creation.

#### 3. Copy Constructor (\`ClassName(const ClassName &other)\`)
Initializes a new object as a copy of an existing object:
- **Shallow Copy (Default):** Copies member variables bit-by-bit. If members include raw heap pointers, both objects end up pointing to the **same heap memory**, causing double-free crashes upon destruction!
- **Deep Copy (Custom):** Allocates new independent heap memory and copies the actual contents.

#### 4. Move Constructor (C++11, \`ClassName(ClassName &&other) noexcept\`)
Steals / transfers ownership of heap resources from a temporary rvalue object instead of performing an expensive deep copy.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Copy Constructor: Shallow Copy Trap vs Deep Copy',
                code: `#include <iostream>
#include <cstring>

class DeepString {
private:
    char *data;

public:
    // Parameterized constructor
    DeepString(const char *str) {
        data = new char[strlen(str) + 1];
        strcpy(data, str);
    }

    // Custom Deep Copy Constructor
    DeepString(const DeepString &other) {
        data = new char[strlen(other.data) + 1]; // Allocate separate memory
        strcpy(data, other.data);                // Copy bytes
        std::cout << "[Deep Copy Constructor invoked]\\n";
    }

    ~DeepString() {
        delete[] data;
    }

    void print() const { std::cout << "Text: " << data << std::endl; }
};

int main() {
    DeepString s1("HiGen Systems");
    DeepString s2 = s1; // Invokes Copy Constructor cleanly without double-free

    s1.print();
    s2.print();
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C++ constructors include Default, Parameterized, Copy, and Move constructors. When classes manage raw heap pointers, a custom Deep Copy constructor is mandatory to avoid double-free errors.",
            keyConcepts: ["Default & Parameterized Constructors", "Copy Constructor (ClassName(const ClassName&))", "Shallow vs Deep Copying", "The Rule of Three / Five"],
            revisionNotes: "The Rule of Three: If a class needs a custom Destructor, Copy Constructor, or Copy Assignment Operator, it almost certainly needs all three."
        }
    },

    "5-3": {
        content: `### 5.3 Dynamic Memory Management with new and delete

In modern C++, dynamic allocation on the heap is handled via **\`new\`** and **\`delete\`** rather than C's \`malloc\` and \`free\`.

#### Comparison: \`new\` / \`delete\` vs. \`malloc\` / \`free\`
| Feature | \`new\` and \`delete\` (C++) | \`malloc\` and \`free\` (C) |
| :--- | :--- | :--- |
| **Nature** | **Operators** built into the language | Library functions in \`<stdlib.h>\` |
| **Constructor / Destructor**| **Automatically calls constructor & destructor** | Allocates raw bytes only; no constructors |
| **Return Type** | Type-safe (returns typed pointer \`T*\`) | Returns generic \`void*\` requiring casting |
| **Size Calculation** | Automatic based on type: \`new int\` | Manual byte calculation: \`sizeof(int)\` |
| **Failure Handling** | Throws \`std::bad_alloc\` exception | Returns \`NULL\` |
| **Array Variant** | \`new[]\` and \`delete[]\` | Single \`malloc()\` / \`free()\` |

#### Array Form Syntax
\`\`\`cpp
int *arr = new int[100]; // Allocate array of 100 ints
delete[] arr;            // Mandatory brackets delete[] for arrays!
\`\`\``,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Dynamic Object Allocation via new and delete',
                code: `#include <iostream>

class DatabaseConnection {
private:
    std::string connString;
public:
    DatabaseConnection(std::string conn) : connString(conn) {
        std::cout << "-> Connection opened: " << connString << std::endl;
    }
    ~DatabaseConnection() {
        std::cout << "-> Connection closed: " << connString << std::endl;
    }
};

int main() {
    // new automatically calls constructor
    DatabaseConnection *db = new DatabaseConnection("postgres://localhost:5432");

    // delete automatically calls destructor and frees heap memory
    delete db;

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "new and delete are type-safe C++ operators that automatically call constructors and destructors. Arrays allocated with new[] must be deallocated with delete[].",
            keyConcepts: ["new vs malloc", "Automatic Constructor/Destructor Invocations", "Array new[] and delete[]", "Exception std::bad_alloc"],
            revisionNotes: "Never mix `malloc` with `delete`, or `new` with `free`. Always match `new` with `delete` and `new[]` with `delete[]`."
        }
    },

    "5-4": {
        content: `### 5.4 Usage of Destructors in 'C++'

A **destructor** is a specialized member function invoked **automatically** whenever an object's lifetime ends (when a stack object exits scope, or when \`delete\` is executed on a heap pointer).

#### Characteristics of Destructors
1. **Tilde Prefix:** Named with a tilde (**\`~\`**) followed by the class name: \`~ClassName()\`.
2. **No Arguments & No Return Type:** Destructors cannot take arguments, cannot return values, and **cannot be overloaded**. There is only one destructor per class.
3. **Automatic Execution:** Executes automatically when an object goes out of scope.

#### RAII (Resource Acquisition Is Initialization)
Destructors are the foundation of C++'s most celebrated programming idiom: **RAII**:
- Resources (heap memory, open files, network sockets, thread mutex locks) are **acquired in the constructor**.
- Those same resources are **guaranteed to be released in the destructor**.
- Because destructors run automatically even during exception stack unwinding, RAII guarantees **zero resource leaks**.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'RAII File Wrapper with Automatic Cleanup',
                code: `#include <iostream>
#include <fstream>

class FileHandler {
private:
    std::ofstream fileStream;

public:
    // Resource acquired in constructor
    FileHandler(const std::string &filename) {
        fileStream.open(filename);
        std::cout << "Resource Acquired: File opened.\\n";
    }

    void writeLine(const std::string &text) {
        if (fileStream.is_open()) fileStream << text << "\\n";
    }

    // Resource guaranteed to be released in destructor
    ~FileHandler() {
        if (fileStream.is_open()) {
            fileStream.close();
            std::cout << "Resource Released: File closed safely by Destructor.\\n";
        }
    }
};

int main() {
    { // Enclosing block scope
        FileHandler log("audit.log");
        log.writeLine("User login recorded.");
    } // log goes out of scope here: ~FileHandler() called automatically!

    std::cout << "Main continuing after file cleanup.\\n";
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "A destructor (~ClassName) cleans up resources automatically when an object exits scope. It powers RAII (Resource Acquisition Is Initialization), ensuring leak-free resource management.",
            keyConcepts: ["Destructor Syntax (~ClassName)", "Automatic Destruction Order", "RAII Resource Management Idiom", "Guaranteed Cleanup during Exceptions"],
            revisionNotes: "Destructors execute in exact reverse order of constructor invocations for local stack objects."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 6: OPERATOR OVERLOADING
    // ═════════════════════════════════════════════════════════════════════════
    "6-1": {
        content: `### 6.1 Overloading Unary and Binary Operators

**Operator Overloading** is a form of compile-time polymorphism that allows user-defined types (classes) to use standard C++ operators (\`+\`, \`-\`, \`*\`, \`==\`, \`++\`, \`[]\`).

#### Syntax of Operator Functions
\`\`\`cpp
return_type operator#(argument_list);
\`\`\`
where \`#\` represents the operator being overloaded.

#### 1. Overloading Binary Operators (e.g., \`+\`)
When overloading a binary operator as a member function:
- The **left-hand operand** becomes the calling object (\`this\` pointer).
- The **right-hand operand** is passed as the single explicit argument.
  \`\`\`cpp
  Complex operator+(const Complex &other) const {
      return Complex(real + other.real, imag + other.imag);
  }
  \`\`\`
- \`c3 = c1 + c2;\` is translated by the compiler into \`c3 = c1.operator+(c2);\`.

#### 2. Overloading Unary Operators (Prefix vs. Postfix \`++\`)
- **Prefix (\`++x\`):** \`Complex& operator++();\` (Increments, then returns \`*this\`).
- **Postfix (\`x++\`):** \`Complex operator++(int);\` (Accepts a dummy \`int\` parameter to distinguish signature, returns old state).

#### Operators that CANNOT be Overloaded in C++
1. \`.\` (Member access)
2. \`.*\` (Pointer-to-member)
3. \`::\` (Scope resolution)
4. \`?:\` (Ternary conditional)
5. \`sizeof\` (Object size)`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Overloading Binary + and Unary ++ Operators',
                code: `#include <iostream>

class Complex {
private:
    double real, imag;

public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}

    // Overload Binary + Operator
    Complex operator+(const Complex &rhs) const {
        return Complex(real + rhs.real, imag + rhs.imag);
    }

    // Overload Prefix ++ Operator (++obj)
    Complex& operator++() {
        real++; imag++;
        return *this;
    }

    void display() const {
        std::cout << real << " + " << imag << "i" << std::endl;
    }
};

int main() {
    Complex c1(3.0, 4.0);
    Complex c2(1.5, 2.5);

    Complex c3 = c1 + c2; // Calls c1.operator+(c2)
    std::cout << "c1 + c2 = ";
    c3.display();

    ++c3; // Calls c3.operator++()
    std::cout << "After ++c3: ";
    c3.display();

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Operator overloading customizes operator behavior for user classes using operator#(). Binary operators receive the right operand as argument; prefix vs postfix ++ are distinguished by a dummy int parameter.",
            keyConcepts: ["operator#() Syntax", "Binary Operator Overloading (c1 + c2)", "Prefix (++x) vs Postfix (x++) Overloading", "Non-Overloadable Operators (., ::, ?:, sizeof)"],
            revisionNotes: "Never alter the natural semantics of an operator; overloading + to perform subtraction confuses users and causes defects."
        }
    },

    "6-2": {
        content: `### 6.2 Operator Overloading using Friend Functions

While member functions handle many operator overloads, **Friend Functions** are necessary when:
1. The **left-hand operand is not a class object** (e.g., streaming with \`std::cout << myObj\`).
2. Symmetric arithmetic is needed (e.g., \`5 + myObj\` where an integer primitive is on the left).

#### Overloading Stream Operators (\`<<\` and \`>>\`)
In the expression \`std::cout << myObj;\`:
- The left-hand operand is \`std::ostream\` (from the standard library, which we cannot modify).
- Therefore, the operator function **must be a non-member friend function**:

\`\`\`cpp
friend std::ostream& operator<<(std::ostream &out, const Complex &c);
friend std::istream& operator>>(std::istream &in, Complex &c);
\`\`\`

#### Why Return Stream Reference (\`ostream&\`)?
Returning the stream reference by reference enables **Chained Output Statements**:
\`\`\`cpp
std::cout << c1 << " and " << c2 << std::endl;
\`\`\`
Each \`<<\` operation returns \`std::cout\`, allowing the next \`<<\` in the chain to proceed.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Stream Insertion (<<) Overloading via Friend Function',
                code: `#include <iostream>

class Vector2D {
private:
    double x, y;

public:
    Vector2D(double xVal = 0, double yVal = 0) : x(xVal), y(yVal) {}

    // Overloading << as a friend function
    friend std::ostream& operator<<(std::ostream &os, const Vector2D &v) {
        os << "(" << v.x << ", " << v.y << ")";
        return os; // Enables chaining
    }
};

int main() {
    Vector2D v1(3.5, 7.2);
    Vector2D v2(10.0, -4.5);

    // Chained stream printing
    std::cout << "Vector 1: " << v1 << " | Vector 2: " << v2 << std::endl;
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Friend functions overload operators when the left-hand operand is an external class or primitive (such as ostream in cout << obj). Returning ostream& enables stream chaining.",
            keyConcepts: ["Stream Overloading (operator<<, operator>>)", "Non-Member Overload Operators", "Chained Stream Invocations", "Friend Access to Private Members"],
            revisionNotes: "Always take ostream as non-const reference `std::ostream&` because writing to a stream mutates its internal buffer."
        }
    }
};

