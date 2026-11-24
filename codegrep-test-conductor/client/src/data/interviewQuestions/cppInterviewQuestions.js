// C++ Programming Company Interview Questions Repository
// 9 Modules x 15+ Authentic Company Questions with Company Name, Year, Difficulty, Question, and Detailed Solution

export const cppInterviewQuestions = {
    // Module 1: Introduction to Object Oriented Programming
    1: {
        moduleTitle: "Introduction to OOP & C++ Paradigms",
        questions: [
            {
                id: "cpp-1-1",
                company: "Google",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What are the four core pillars of Object-Oriented Programming (OOP) and how does C++ enforce each?",
                explanation: "1. Encapsulation: Bundling data and methods into classes with access specifiers (`public`, `private`, `protected`).\n2. Abstraction: Hiding implementation details via abstract classes (pure virtual functions) and interfaces.\n3. Inheritance: Reusing and extending base class properties (`class Derived : public Base`).\n4. Polymorphism: Compile-time (function/operator overloading, templates) and runtime dynamic dispatch (virtual functions, VTable)."
            },
            {
                id: "cpp-1-2",
                company: "Microsoft",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Explain the difference between Procedural Programming (C) and Object-Oriented Programming (C++).",
                explanation: "Procedural programming focuses on sequences of procedural steps acting on passive data structures, with functions separated from data. OOP couples data and behavior together inside cohesive objects, employing message passing, data hiding, and inheritance hierarchies to scale large systems."
            },
            {
                id: "cpp-1-3",
                company: "Amazon",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Name Mangling (decoration) in C++ and why does `extern \"C\"` exist?",
                explanation: "C++ supports function overloading, so the compiler encodes function names with parameter types in the object symbol table (e.g., `_Z3addii` for `add(int, int)`). `extern \"C\"` instructs the C++ compiler to disable name mangling for specified functions, allowing seamless linking with pure C libraries."
            },
            {
                id: "cpp-1-4",
                company: "Apple",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Why should `using namespace std;` NEVER be placed in a C++ header file?",
                explanation: "Placing `using namespace std;` in a header file pollutes the global namespace of every translation unit that includes that header. It causes naming collisions with standard library identifiers (e.g. `count`, `data`, `distance`), breaking modularity."
            },
            {
                id: "cpp-1-5",
                company: "Meta",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is a `namespace` in C++ and how does it prevent identifier collisions?",
                explanation: "A namespace is a declarative region that provides a scope for identifiers (names of types, functions, variables). Identifiers declared within a namespace do not collide with identical names in other namespaces or the global scope (e.g. `std::vector` vs `my_lib::vector`)."
            },
            {
                id: "cpp-1-6",
                company: "Bloomberg",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the difference between Compile-time Polymorphism and Runtime Polymorphism in C++?",
                explanation: "Compile-time (Static) Polymorphism is resolved at build time via templates and function/operator overloading with zero runtime overhead (inlining opportunities). Runtime (Dynamic) Polymorphism is resolved during program execution via virtual functions and VTable lookup, incurring a minor pointer dereference overhead."
            },
            {
                id: "cpp-1-7",
                company: "Qualcomm",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the One Definition Rule (ODR) in C++?",
                explanation: "ODR states that within a single translation unit, a template, type, function, or variable can have no more than one definition. Across the entire program, non-inline functions and variables can have only one definition, while classes, inline functions, and templates can be defined in multiple translation units provided the definitions are identical byte-for-byte."
            },
            {
                id: "cpp-1-8",
                company: "Adobe",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the fundamental difference between `class` and `struct` in C++?",
                explanation: "The ONLY syntactic difference in C++ is the default access specifier and inheritance mode: in a `class`, members and base classes are `private` by default; in a `struct`, members and base classes are `public` by default."
            },
            {
                id: "cpp-1-9",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Who developed C++ and why was it originally named 'C with Classes'?",
                explanation: "Bjarne Stroustrup developed C++ in 1979 at Bell Laboratories. It was originally called 'C with Classes' because it added Simula-style object-oriented programming features, classes, and strong type-checking directly onto the fast, portable C language foundation."
            },
            {
                id: "cpp-1-10",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the role of `std::cin` and `std::cout` compared to `scanf` and `printf` in C?",
                explanation: "`std::cin` and `std::cout` are type-safe stream objects belonging to `<iostream>`. Unlike `printf`/`scanf`, they do not require format specifiers (`%d`, `%s`), avoid buffer overflow mismatches, and can be overloaded for custom user-defined types via `<<` and `>>`."
            },
            {
                id: "cpp-1-11",
                company: "NVIDIA",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What are Zero-Overhead Abstractions in C++?",
                explanation: "The core design principle articulated by Bjarne Stroustrup: 'What you don't use, you don't pay for. And what you do use, you couldn't hand code any better yourself.' Features like templates, inline functions, and smart pointers compile to the exact same or better assembly as hand-tuned C."
            },
            {
                id: "cpp-1-12",
                company: "Goldman Sachs",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is an Anonymous Namespace in C++ and what is its C equivalent?",
                explanation: "An anonymous namespace (`namespace { ... }`) defines identifiers with internal linkage (accessible only within the current translation unit). It is the modern C++ standard replacement for the C `static` keyword on global functions and variables."
            },
            {
                id: "cpp-1-13",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "How does C++ support both generic programming and object-oriented programming simultaneously?",
                explanation: "C++ is a multi-paradigm language. It supports OOP via polymorphic class hierarchies and virtual dispatch, and generic programming via compile-time template metaprogramming (STL algorithms and containers), allowing developers to combine dynamic runtime adaptability with zero-cost static abstractions."
            },
            {
                id: "cpp-1-14",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the standard stream used for unbuffered error logging in C++?",
                explanation: "`std::cerr` is the unbuffered standard error stream, ensuring error messages are flushed to the terminal immediately without waiting for buffer flushes. `std::clog` is the buffered error stream variant."
            },
            {
                id: "cpp-1-15",
                company: "Cisco",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is ADL (Argument-Dependent Lookup / Koenig Lookup) in C++?",
                explanation: "ADL is a compiler rule where unqualified function calls look up function names not only in the local scope, but also inside the namespaces containing the types of the function's arguments. This allows non-member operator functions like `std::cout << my_obj;` to be found naturally."
            }
        ]
    },

    // Module 2: C++ Tokens, Types & Memory
    2: {
        moduleTitle: "C++ Tokens, Types & Dynamic Memory",
        questions: [
            {
                id: "cpp-2-1",
                company: "Google",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the fundamental difference between `new`/`delete` in C++ and `malloc()`/`free()` in C?",
                explanation: "`new` is a type-safe operator that calculates size automatically, invokes the class constructor to initialize the object, and returns a properly typed pointer. `delete` invokes the class destructor before releasing heap memory. In contrast, `malloc()` and `free()` are raw runtime functions that allocate and deallocate raw bytes without running constructors or destructors."
            },
            {
                id: "cpp-2-2",
                company: "Microsoft",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "Explain the difference between `delete ptr;` and `delete[] ptr;`. What happens if you mix them?",
                explanation: "`delete ptr;` deallocates a single object and calls its destructor once. `delete[] ptr;` reads the array length prefix stored by `new[]`, calls the destructor on EVERY element in the array, and frees the entire block. Mixing them (e.g. `delete` on an array) results in Undefined Behavior and heap corruption."
            },
            {
                id: "cpp-2-3",
                company: "Amazon",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is a Reference (`&`) in C++ and how does it differ from a Pointer (`*`)?",
                explanation: "A reference is an immutable alias for an existing object. Key differences:\n1. A reference must be initialized upon declaration and can never be rebound to refer to another object.\n2. References cannot be null (`int &r = *nullptr;` is UB).\n3. References do not require dereferencing syntax (accessed with `.` rather than `->`)."
            },
            {
                id: "cpp-2-4",
                company: "Apple",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What are the four C++ style explicit casts and when should each be used?",
                explanation: "1. `static_cast`: Safe compile-time conversions (int to float, upcasting in class hierarchies).\n2. `dynamic_cast`: Safe runtime downcasting in polymorphic hierarchies using RTTI (returns nullptr on pointer failure or throws `std::bad_cast`).\n3. `const_cast`: Adds or removes `const` or `volatile` qualifiers.\n4. `reinterpret_cast`: Low-level bitwise re-interpretation of addresses (e.g. pointer to integer or raw byte buffers)."
            },
            {
                id: "cpp-2-5",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What is the difference between `auto` and `decltype` in modern C++?",
                explanation: "`auto` deduces type from the initializer expression with decay (stripping top-level `const` and references unless explicitly added: `const auto&`). `decltype(expr)` inspects the exact declared type of an expression without evaluating it, preserving exact references and constness."
            },
            {
                id: "cpp-2-6",
                company: "Qualcomm",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "What is Placement New and how is it used in custom memory pools and embedded systems?",
                explanation: "Placement new constructs an object inside a pre-allocated raw memory buffer without allocating new heap memory:\n```c++\n#include <new>\nchar buffer[sizeof(MyClass)];\nMyClass* obj = new (buffer) MyClass(args); // Construct at buffer\nobj->~MyClass(); // Explicit destructor call required!\n```"
            },
            {
                id: "cpp-2-7",
                company: "Bloomberg",
                year: 2023,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is `constexpr` in C++11/C++14/C++20 and how does it differ from `const`?",
                explanation: "`const` means read-only (value cannot be mutated after runtime initialization). `constexpr` guarantees that the value or function can be evaluated at **compile time**, enabling its use in template arguments, array sizes, and static assertions."
            },
            {
                id: "cpp-2-8",
                company: "Adobe",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the output of `int a = 10; int &ref = a; ref = 20; std::cout << a;`?",
                explanation: "Output: `20`.\n`ref` is an alias bound directly to the memory storage of `a`. Mutating `ref` mutates `a` in place."
            },
            {
                id: "cpp-2-9",
                company: "NVIDIA",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "Explain Value Categories in modern C++: lvalues, rvalues, prvalues, and xvalues.",
                explanation: "- lvalue: An expression with an identifiable memory identity (address can be taken via `&`, e.g. named variables `x`).\n- prvalue (pure rvalue): A computed temporary value without identity (e.g. `42`, `x + y`).\n- xvalue (eXpiring value): An object with identity whose memory can be moved/stolen (e.g. `std::move(x)`).\n- rvalues = prvalues + xvalues."
            },
            {
                id: "cpp-2-10",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the Scope Resolution Operator `::` in C++ and what does `::var` mean?",
                explanation: "`::` specifies the scope to which an identifier belongs (`ClassName::member` or `Namespace::func`). When used without a prefix (`::var`), it refers explicitly to the identifier in the global scope, bypassing local shadowed variables."
            },
            {
                id: "cpp-2-11",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the advantage of `nullptr` over `NULL` in C++11?",
                explanation: "`nullptr` has type `std::nullptr_t` and converts only to pointer types. `NULL` is defined as integer `0` (or `0L`), causing ambiguous resolution bugs when overloading functions like `f(int)` vs `f(char*)`: `f(NULL)` calls `f(int)` whereas `f(nullptr)` correctly calls `f(char*)`."
            },
            {
                id: "cpp-2-12",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is RTTI (Run-Time Type Information) and what is the cost of `typeid`?",
                explanation: "RTTI enables determining the dynamic type of an object at runtime via `typeid` and `dynamic_cast`. It requires the class to have at least one virtual function and stores type descriptor pointers in the class VTable, adding a slight binary footprint."
            },
            {
                id: "cpp-2-13",
                company: "Goldman Sachs",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Structured Binding introduced in C++17?",
                explanation: "Structured binding allows unpacking tuples, pairs, structs, or fixed arrays directly into individual named variables:\n`auto [id, name, salary] = getEmployee();`\nEliminates verbose `std::tie()` calls."
            },
            {
                id: "cpp-2-14",
                company: "Samsung",
                year: 2023,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "Can a reference bind to a temporary rvalue (e.g. `int &r = 10;`)?",
                explanation: "No. A non-const lvalue reference cannot bind to an rvalue (`int &r = 10;` is illegal). However, a `const` lvalue reference (`const int &r = 10;`) CAN bind to a temporary, which extends the lifetime of the temporary to match the lifetime of the reference."
            },
            {
                id: "cpp-2-15",
                company: "Cisco",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What header defines standard fixed-width integer types (`int32_t`, `uint64_t`) in C++?",
                explanation: "`<cstdint>` (equivalent to C's `<stdint.h>`) defines standard fixed-width integer types like `int8_t`, `int16_t`, `int32_t`, and `uint64_t`."
            }
        ]
    },

    // Module 3: Classes & Objects
    3: {
        moduleTitle: "Classes & Objects, Encapsulation & this pointer",
        questions: [
            {
                id: "cpp-3-1",
                company: "Google",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the `this` pointer in C++? What is its type inside a `const` member function?",
                explanation: "`this` is an implicit pointer passed as a hidden first argument to all non-static member functions, pointing to the instance object on which the method was invoked. In a class `Widget`, inside a normal member function its type is `Widget * const this`. Inside a `const` member function, its type is `const Widget * const this`, prohibiting mutation of any member variables."
            },
            {
                id: "cpp-3-2",
                company: "Microsoft",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What are static member variables and static member functions? Why can a static member function not use `this`?",
                explanation: "Static member variables are shared across ALL instances of the class and allocated once in the static data segment. A static member function belongs to the class as a whole and can be called without any object instance (`Class::func()`). Because it is not invoked on an object, no hidden instance pointer is passed, so `this` does not exist."
            },
            {
                id: "cpp-3-3",
                company: "Amazon",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is a `friend` class or `friend` function in C++? Does it violate encapsulation?",
                explanation: "A `friend` declaration grants an external function or class full access to the declaring class's `private` and `protected` members. Pragmatically, it does not violate encapsulation when used judiciously (e.g. operator overloading `operator<<` or tightly coupled iterator classes) because the class author explicitly chooses who to trust."
            },
            {
                id: "cpp-3-4",
                company: "Apple",
                year: 2023,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What does the `mutable` keyword do when applied to a class member variable?",
                explanation: "`mutable` allows a specific member variable to be modified even from within a `const` member function. It is used for internal caching, mutexes (`std::mutex`), reference counts, and debug tracking that do not affect the visible observable state of the object."
            },
            {
                id: "cpp-3-5",
                company: "Bloomberg",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "What is Method Chaining and how is it implemented using the `this` pointer?",
                explanation: "Method chaining allows cascading multiple function calls on a single object in one line (`obj.setX(10).setY(20).build();`). It is implemented by returning a reference to the current object: `return *this;` from each setter."
            },
            {
                id: "cpp-3-6",
                company: "Adobe",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the difference between `private` and `protected` access specifiers?",
                explanation: "`private` members are accessible strictly from within the member functions and friends of the declaring class itself. `protected` members are accessible by the declaring class AND by derived child classes, but remain inaccessible to the outside public world."
            },
            {
                id: "cpp-3-7",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What is the size of an empty class `class Empty {};` in C++? Why is it not 0?",
                explanation: "`sizeof(Empty)` is **1 byte** (not 0). The C++ standard mandates that every distinct object must have a unique non-zero memory address so that pointers to two distinct objects `&obj1 != &obj2` are guaranteed to compare unequal."
            },
            {
                id: "cpp-3-8",
                company: "Qualcomm",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the Empty Base Optimization (EBO) in C++?",
                explanation: "EBO allows an empty base class (size 1) to occupy 0 bytes when inherited by a derived class that contains other members. Used heavily in STL allocators and traits (`std::unique_ptr` with custom stateless deleters) to achieve zero size overhead."
            },
            {
                id: "cpp-3-9",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Coding",
                question: "Write a simple C++ class `Rectangle` with encapsulation, private width/height, and public area method.",
                explanation: "```c++\nclass Rectangle {\nprivate:\n    double width, height;\npublic:\n    Rectangle(double w, double h) : width(w), height(h) {}\n    double getArea() const { return width * height; }\n};\n```"
            },
            {
                id: "cpp-3-10",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Where must a static data member of a C++ class be defined?",
                explanation: "A static member variable is declared inside the class definition, but it must be defined and allocated outside the class body in a single translation unit (.cpp file) using the scope resolution operator: `int MyClass::count = 0;` (unless marked `inline static` in C++17)."
            },
            {
                id: "cpp-3-11",
                company: "NVIDIA",
                year: 2023,
                difficulty: "Hard",
                type: "Conceptual",
                question: "Can a member function call `delete this;`? When is this safe?",
                explanation: "Yes, `delete this;` is legal C++ syntax. It is safe ONLY under two strict conditions:\n1. The object was allocated dynamically using `new` (not on the stack or as a global).\n2. The function makes no access to any member variables or virtual methods after the `delete this;` statement returns. Common in COM reference-counted objects (`Release()`)."
            },
            {
                id: "cpp-3-12",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the difference between an Object and an Instance?",
                explanation: "The terms are generally synonymous in C++. A class is an abstract blueprint or user-defined type; an object or instance is a concrete manifestation of that class instantiated in memory (stack, heap, or static segment) containing real member data."
            },
            {
                id: "cpp-3-13",
                company: "Goldman Sachs",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "How can you prevent a C++ class from being instantiated on the heap (disallow `new MyClass`)?",
                explanation: "Declare `operator new` and `operator delete` as `private` or delete them:\n`void* operator new(size_t) = delete;`\n`void operator delete(void*) = delete;`"
            },
            {
                id: "cpp-3-14",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Can `this` pointer be modified inside a member function (e.g. `this = ptr;`)?",
                explanation: "No. `this` is a prvalue pointer of type `ClassName * const`, meaning it is an immutable pointer whose address target cannot be changed."
            },
            {
                id: "cpp-3-15",
                company: "Cisco",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the PIMPL (Pointer to Implementation) idiom in C++ and what problem does it solve?",
                explanation: "The PIMPL idiom moves private data members and internal dependencies of a class into a forward-declared implementation struct (`struct Impl; std::unique_ptr<Impl> pImpl;`). Benefits: Decouples interface from implementation, shields callers from rebuilding when private members change (reduces compile times), and avoids leaking internal private headers."
            }
        ]
    },

    // Module 4: Functions in C++
    4: {
        moduleTitle: "Functions, Overloading & Inline Functions",
        questions: [
            {
                id: "cpp-4-1",
                company: "Google",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What criteria must be met for Function Overloading in C++? Can functions be overloaded on return type alone?",
                explanation: "Overloaded functions must share the exact same function name in the same scope but have distinct parameter lists (different number of parameters, different types, or different order of types). Functions CANNOT be overloaded on return type alone because the compiler cannot deduce which function to call when the return value is discarded."
            },
            {
                id: "cpp-4-2",
                company: "Microsoft",
                year: 2024,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What is the danger of combining Function Overloading with Default Arguments?",
                explanation: "It introduces compile-time ambiguity. For example:\n`void print(int x, int y = 0);` and `void print(int x);`\nCalling `print(5)` causes a compilation error (`error: call of overloaded 'print(int)' is ambiguous`) because both prototypes are equally valid candidates."
            },
            {
                id: "cpp-4-3",
                company: "Amazon",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is an `inline` function in C++ and does the compiler guarantee inlining?",
                explanation: "An `inline` function requests that the compiler substitute the function body directly at call sites to eliminate call/return overhead. The `inline` keyword is only a suggestion: compilers may refuse to inline complex functions containing loops, recursion, or dynamic dispatch. In modern C++, `inline` primarily serves to allow multiple identical function definitions across translation units without violating ODR."
            },
            {
                id: "cpp-4-4",
                company: "Apple",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "What are Move Semantics and Rvalue References (`Type&&`) introduced in C++11?",
                explanation: "Rvalue references (`&&`) bind to temporary objects. Move semantics allows transferring (stealing) heap resources, buffers, and file handles from an expiring rvalue object to a new object without allocating fresh memory or performing expensive deep copies. Example: `std::vector::push_back(std::move(heavy_obj))`."
            },
            {
                id: "cpp-4-5",
                company: "Bloomberg",
                year: 2023,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Perfect Forwarding and how does `std::forward<T>` work with Universal (Forwarding) References?",
                explanation: "A forwarding reference `T&&` inside a template preserves whether an argument was passed as an lvalue or rvalue (Reference Collapsing rules: `& & -> &`, `& && -> &`, `&& && -> &&`). `std::forward<T>(arg)` conditionally casts `arg` back to an rvalue only if it was originally an rvalue, allowing perfect forwarding of arguments into constructors without unnecessary copies."
            },
            {
                id: "cpp-4-6",
                company: "Qualcomm",
                year: 2024,
                difficulty: "Medium",
                type: "Coding",
                question: "Explain Pass by Value vs Pass by Reference vs Pass by Const Reference with performance guidelines.",
                explanation: "1. Pass by Value (`Type x`): Copies the object; ideal for cheap primitive types (`int`, `double`, `enum`, pointer) $\\le 16$ bytes.\n2. Pass by Reference (`Type &x`): Modifies caller's object in place without copying.\n3. Pass by Const Reference (`const Type &x`): Zero copy overhead while guaranteeing read-only access; standard for complex objects (`std::string`, `std::vector`, large structs)."
            },
            {
                id: "cpp-4-7",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "What are Lambda Expressions in C++11 and what does the Capture Clause `[&]` vs `[=]` do?",
                explanation: "A lambda is an anonymous functor object: `[capture](params) -> ret { body }`.\n- `[&]`: Captures all outer local variables by reference (fast, but danger of dangling reference if lambda outlives enclosing scope).\n- `[=]`: Captures all outer local variables by value (safe independent copies).\n- `[this]`: Captures current object pointer."
            },
            {
                id: "cpp-4-8",
                company: "Adobe",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the output of `void f(int x = 5) { std::cout << x; } int main() { f(); f(10); }`?",
                explanation: "Output: `510`.\nWhen called without arguments, `f()` uses the default argument value `5`. When called with argument `10`, the default is overridden."
            },
            {
                id: "cpp-4-9",
                company: "NVIDIA",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is `constexpr` function vs `consteval` function in C++20?",
                explanation: "A `constexpr` function can be evaluated at compile time if its arguments are compile-time constants, but will execute as a normal function at runtime if passed runtime variables. A `consteval` function (immediate function in C++20) MUST execute at compile time; passing runtime variables triggers a compile-time error."
            },
            {
                id: "cpp-4-10",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Coding",
                question: "Write an overloaded function `swap` for both `int` and `double` in C++.",
                explanation: "```c++\nvoid swap(int &a, int &b) { int tmp = a; a = b; b = tmp; }\nvoid swap(double &a, double &b) { double tmp = a; a = b; b = tmp; }\n```"
            },
            {
                id: "cpp-4-11",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is a Function Template in C++?",
                explanation: "A function template defines a generic family of functions parameterized by one or more types:\n`template <typename T> T max(T a, T b) { return a > b ? a : b; }`\nThe compiler instantiates the required concrete function for each type used at compile time."
            },
            {
                id: "cpp-4-12",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What are Trailing Return Types in C++11 (`auto func() -> int`) and when are they necessary?",
                explanation: "Trailing return syntax places the return type after parameter declarations. It is required when the return type depends on parameter expressions via `decltype`, e.g.:\n`template <typename T, typename U> auto add(T a, U b) -> decltype(a + b);`"
            },
            {
                id: "cpp-4-13",
                company: "Goldman Sachs",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is SFINAE (Substitution Failure Is Not An Error) in C++ template overloading?",
                explanation: "SFINAE states that if an invalid type or expression is produced during template argument substitution for an overload, the compiler does not emit an error; it simply discards that candidate from the overload resolution set. Used with `std::enable_if` to selectively enable template overloads based on type traits."
            },
            {
                id: "cpp-4-14",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Can an inline function be declared in a `.cpp` file and called from another `.cpp` file?",
                explanation: "Generally no, unless declared in every translation unit. An inline function's code definition must be available to the compiler during compilation of each call site; therefore, inline functions should always reside in `.h` header files."
            },
            {
                id: "cpp-4-15",
                company: "Cisco",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is `std::function` vs raw function pointer?",
                explanation: "A raw function pointer `int (*)(int)` can only point to stateless freestanding functions. `std::function<int(int)>` from `<functional>` is a polymorphic wrapper that can store ANY callable target: free functions, lambda closures with captured state, functors, and bound member functions via `std::bind`."
            }
        ]
    },

    // Module 5: Constructors and Destructors
    5: {
        moduleTitle: "Constructors, Destructors & RAII",
        questions: [
            {
                id: "cpp-5-1",
                company: "Google",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is RAII (Resource Acquisition Is Initialization) and why is it the most fundamental idiom in C++?",
                explanation: "RAII binds the lifecycle of a resource (heap memory, file handles, mutex locks, database sockets) to the lifetime of a stack object. The resource is acquired in the constructor and deterministically released in the destructor. Because C++ guarantees destructor execution during scope exit and stack unwinding, RAII prevents memory leaks and lock starvation even in the presence of unexpected exceptions."
            },
            {
                id: "cpp-5-2",
                company: "Microsoft",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the Rule of Three, Rule of Five, and Rule of Zero in C++?",
                explanation: "- Rule of Three (C++98): If a class manages a raw resource and requires custom Destructor, Copy Constructor, or Copy Assignment Operator, it almost certainly needs all three.\n- Rule of Five (C++11): Adds Move Constructor and Move Assignment Operator to support move semantics.\n- Rule of Zero: Modern best practice: write classes that use standard RAII wrappers (`std::unique_ptr`, `std::string`, `std::vector`), eliminating the need to write any custom destructor or copy/move operations."
            },
            {
                id: "cpp-5-3",
                company: "Amazon",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the Member Initialization List and why is it preferred over assignment inside the constructor body?",
                explanation: "Member initialization list (`MyClass() : m_val(10) {}`) directly constructs member variables in place in the order they are declared in the class definition. In contrast, assigning inside the constructor body (`{ m_val = 10; }`) first invokes the default constructor and then invokes the assignment operator, causing double-work. Furthermore, `const` members and references CANNOT be assigned and MUST use the initialization list."
            },
            {
                id: "cpp-5-4",
                company: "Apple",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "Why MUST a base class destructor be declared `virtual` if it has virtual methods?",
                explanation: "If a base class destructor is NOT virtual, deleting a derived object through a base class pointer (`Base *ptr = new Derived(); delete ptr;`) invokes only the Base class destructor. The Derived class destructor is never called, causing catastrophic resource and memory leaks for any members held by Derived."
            },
            {
                id: "cpp-5-5",
                company: "Bloomberg",
                year: 2024,
                difficulty: "Medium",
                type: "Coding",
                question: "What is the Copy-and-Swap idiom and what guarantee does it provide?",
                explanation: "Copy-and-swap implements the assignment operator by passing the argument by value (creating a copy) and then swapping internal members with `std::swap`:\n```c++\nMyClass& operator=(MyClass other) {\n    swap(*this, other);\n    return *this;\n}\n```\nIt provides the **Strong Exception Safety Guarantee** (if copying fails, `*this` is untouched) and automatically prevents self-assignment bugs."
            },
            {
                id: "cpp-5-6",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Why should a single-argument constructor almost always be marked `explicit`?",
                explanation: "Single-argument constructors act as implicit converting constructors by default. If a class `String` has constructor `String(int size)`, writing `String s = 10;` or passing `10` to a function expecting `String` silently compiles, leading to bugs. Marking it `explicit String(int size)` forbids implicit conversions and requires `String s(10);`."
            },
            {
                id: "cpp-5-7",
                company: "Qualcomm",
                year: 2023,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Copy Elision and Return Value Optimization (RVO / NRVO)? Is it mandatory in C++17?",
                explanation: "RVO is an optimization where the compiler constructs a function's return object directly inside the caller's storage location, eliminating all copy and move constructor calls. In C++17, RVO for prvalues (unnamed temporaries returned by value) became a mandatory language guarantee, not just an optional optimization."
            },
            {
                id: "cpp-5-8",
                company: "Adobe",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "In what order are base class constructors, derived class constructors, and member objects executed?",
                explanation: "1. Virtual base classes construct first.\n2. Non-virtual base classes construct in order of inheritance declaration.\n3. Non-static member variables construct in order of class declaration.\n4. Derived class constructor body executes.\nDestructors execute in the exact REVERSE order."
            },
            {
                id: "cpp-5-9",
                company: "NVIDIA",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "Why should a Destructor NEVER throw an exception in C++?",
                explanation: "If a destructor throws an exception during Stack Unwinding (while another exception is already active and propagating), C++ has two active uncaught exceptions simultaneously. In this scenario, the C++ runtime immediately invokes `std::terminate()`, abruptly aborting the process without cleanup. In modern C++, all destructors are implicitly `noexcept(true)`."
            },
            {
                id: "cpp-5-10",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is a Default Constructor and when does the C++ compiler automatically generate one?",
                explanation: "A default constructor is a constructor callable with zero arguments. The compiler automatically synthesizes an implicit default constructor ONLY if the class declares NO custom constructors of any kind. If any custom constructor (e.g. parameterized) is defined, the compiler will not generate the default constructor unless requested with `= default;`."
            },
            {
                id: "cpp-5-11",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is a Copy Constructor and why must its parameter be passed by Reference?",
                explanation: "A copy constructor initializes a new object by copying an existing object: `MyClass(const MyClass &other)`. The parameter MUST be passed by reference; passing by value would require creating a copy of the argument, which would invoke the copy constructor recursively, resulting in infinite recursion and stack overflow."
            },
            {
                id: "cpp-5-12",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is a Delegating Constructor in C++11?",
                explanation: "A delegating constructor calls another constructor of the same class in its member initializer list to reuse initialization logic and eliminate code duplication:\n`MyClass(int x) : MyClass(x, \"default\") {}`"
            },
            {
                id: "cpp-5-13",
                company: "Goldman Sachs",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What does `= default;` and `= delete;` do on special member functions?",
                explanation: "`= default;` explicitly instructs the compiler to generate the standard default implementation (e.g. `MyClass() = default;`). `= delete;` disables a function, causing any attempt to call it to fail at compile time (used to make classes non-copyable: `MyClass(const MyClass&) = delete;`)."
            },
            {
                id: "cpp-5-14",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Can a constructor be declared `virtual` in C++?",
                explanation: "No. A constructor CANNOT be virtual. When a constructor executes, the object is not yet fully constructed and its virtual table pointer (`vptr`) is not completely initialized. To create objects polymorphically, the Virtual Constructor idiom (Factory Method / `clone()`) is used."
            },
            {
                id: "cpp-5-15",
                company: "Cisco",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "Implement a minimal RAII Mutex Lock Guard class in C++.",
                explanation: "```c++\nclass LockGuard {\n    std::mutex &m_mtx;\npublic:\n    explicit LockGuard(std::mutex &m) : m_mtx(m) { m_mtx.lock(); }\n    ~LockGuard() { m_mtx.unlock(); }\n    LockGuard(const LockGuard&) = delete;\n    LockGuard& operator=(const LockGuard&) = delete;\n};\n```"
            }
        ]
    },

    // Module 6: Operator Overloading
    6: {
        moduleTitle: "Operator Overloading & Type Conversions",
        questions: [
            {
                id: "cpp-6-1",
                company: "Google",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Which operators CANNOT be overloaded in C++ and why?",
                explanation: "The operators that cannot be overloaded are:\n1. Scope Resolution `::`\n2. Member Access `.`\n3. Pointer-to-member `.*`\n4. Ternary Conditional `?:`\n5. `sizeof`\n6. `typeid`\nReason: Bjarne Stroustrup designed this to preserve compile-time syntax parsing guarantees, prevent ambiguities, and ensure core member access cannot be hijacked."
            },
            {
                id: "cpp-6-2",
                company: "Microsoft",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "Why must the stream insertion operator `operator<<` be overloaded as a non-member friend function rather than a class member?",
                explanation: "If overloaded as a member function, the left-hand operand must be the invoking class object (`my_obj << std::cout`). Because standard I/O syntax requires `std::cout` on the left (`std::cout << my_obj`), the function must be a non-member taking `std::ostream&` as its first parameter and `const MyClass&` as its second parameter."
            },
            {
                id: "cpp-6-3",
                company: "Amazon",
                year: 2024,
                difficulty: "Medium",
                type: "Coding",
                question: "How do you distinguish between Prefix `++x` and Postfix `x++` operator overloading in C++?",
                explanation: "Prefix `++` takes no arguments and returns a reference: `MyClass& operator++();`.\nPostfix `++` takes a dummy integer argument (`int`) to disambiguate the signature, makes a copy, increments the current instance, and returns the copy by value: `MyClass operator++(int);`."
            },
            {
                id: "cpp-6-4",
                company: "Apple",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "What is the C++20 Three-Way Comparison (Spaceship) Operator `<=>`?",
                explanation: "The spaceship operator `auto operator<=>(const MyClass&) const = default;` generates all six relational comparisons (`<`, `<=`, `>`, `>=`, `==`, `!=`) automatically with consistent ordering semantics (`std::strong_ordering`, `std::weak_ordering`, or `std::partial_ordering`)."
            },
            {
                id: "cpp-6-5",
                company: "Bloomberg",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "Implement `operator[]` for a custom dynamic array class providing both read-only and mutable access.",
                explanation: "```c++\nclass Array {\n    int *data; size_t sz;\npublic:\n    int& operator[](size_t idx) { return data[idx]; } // Non-const: allows assignment arr[0] = 5;\n    const int& operator[](size_t idx) const { return data[idx]; } // Const: read-only\n};\n```"
            },
            {
                id: "cpp-6-6",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Can operator overloading change operator precedence, associativity, or the number of operands?",
                explanation: "No. Operator overloading in C++ cannot change operator precedence (e.g. `*` will always bind before `+`), cannot change associativity (left-to-right vs right-to-left), cannot invent new operator tokens (like `**`), and cannot alter the arity of the operator."
            },
            {
                id: "cpp-6-7",
                company: "Adobe",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "What is a Conversion Operator in C++ and how do you make it `explicit`?",
                explanation: "A conversion operator defines how an object can be cast to another type:\n```c++\nclass Fraction {\n    int num, den;\npublic:\n    explicit operator double() const { return (double)num / den; }\n};\n```\nMaking it `explicit` prevents unintended implicit conversions in arithmetic expressions, requiring `static_cast<double>(f)`."
            },
            {
                id: "cpp-6-8",
                company: "Qualcomm",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "Why is overloading the logical operators `&&` and `||` considered dangerous and antipattern?",
                explanation: "Overloading `&&` or `||` transforms the expression into a regular function call `operator&&(a, b)`. In a function call, BOTH arguments `a` and `b` MUST be evaluated before invoking the function, completely breaking short-circuit evaluation semantics and causing unexpected side effects or null dereferences."
            },
            {
                id: "cpp-6-9",
                company: "NVIDIA",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the Functor (Function Call Operator `operator()`) and where is it used in STL?",
                explanation: "Overloading `operator()` allows an instance of a class to be invoked using standard function call syntax: `obj(arg1, arg2)`. Objects with `operator()` are called Function Objects (Functors). They are widely used in STL algorithms (`std::sort`, `std::for_each`) because they can carry persistent internal state across calls."
            },
            {
                id: "cpp-6-10",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Coding",
                question: "Write an overloaded `operator+` to add two `Complex` number objects.",
                explanation: "```c++\nclass Complex {\npublic:\n    double r, i;\n    Complex(double r = 0, double i = 0) : r(r), i(i) {}\n    Complex operator+(const Complex &o) const {\n        return Complex(r + o.r, i + o.i);\n    }\n};\n```"
            },
            {
                id: "cpp-6-11",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Which operators MUST be overloaded as member functions and cannot be friend functions?",
                explanation: "The C++ language mandates that the following four operators must strictly be non-static class member functions:\n1. Assignment operator `=`\n2. Subscript operator `[]`\n3. Function call operator `()`\n4. Member access operator `->`"
            },
            {
                id: "cpp-6-12",
                company: "Intel",
                year: 2023,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the Arrow Operator `->` overloading mechanism for Smart Pointers?",
                explanation: "Overloading `operator->` allows smart pointer classes (`std::unique_ptr`, `std::shared_ptr`) to wrap raw pointers. The compiler iteratively unwraps `operator->` until it reaches a raw pointer on which it applies the standard member access operation."
            },
            {
                id: "cpp-6-13",
                company: "Goldman Sachs",
                year: 2024,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What return type should `operator+=` have and why?",
                explanation: "`MyClass& operator+=(const MyClass &rhs)` should return a reference to `*this` to support assignment chaining and mimic primitive type behavior: `(a += b) += c;`."
            },
            {
                id: "cpp-6-14",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Can `new` and `delete` operators be overloaded per class?",
                explanation: "Yes. Classes can overload member `void* operator new(size_t size)` and `void operator delete(void *ptr)` to direct object allocations to high-performance custom memory pools or fixed-size block allocators."
            },
            {
                id: "cpp-6-15",
                company: "Cisco",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is User-Defined Literals (UDL) in C++11?",
                explanation: "UDLs allow custom suffix operators on literal values (e.g. `10_km`, `5.0_sec`, `\"hello\"s`): `Distance operator\"\"_km(long double val) { return Distance(val * 1000); }`. Enables compile-time type-safe physical units."
            }
        ]
    },

    // Module 7: Inheritance
    7: {
        moduleTitle: "Inheritance, Polymorphism & Virtual Functions",
        questions: [
            {
                id: "cpp-7-1",
                company: "Google",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "Explain the internal mechanics of Virtual Functions, the VTable (Virtual Table), and the `vptr`.",
                explanation: "For any class with virtual functions, the compiler generates a static VTable containing pointers to the class's virtual methods. Each instance of the class contains an invisible pointer member (`vptr`) placed at offset 0 pointing to its class's VTable. When `ptr->virtualFunc()` is called at runtime, the CPU follows `ptr` -> reads `vptr` -> indexes the slot in the VTable -> jumps dynamically to the target method."
            },
            {
                id: "cpp-7-2",
                company: "Microsoft",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the Diamond Problem in multiple inheritance and how does Virtual Base Class (`virtual public Base`) solve it?",
                explanation: "The Diamond Problem occurs when class `D` inherits from both `B` and `C`, and both `B` and `C` inherit from base `A`. Without virtual inheritance, `D` contains two duplicate sub-objects of `A`, causing memory waste and ambiguity when accessing `A`'s members. Declaring `virtual public A` ensures that only ONE single shared sub-object of `A` exists in memory for `D`."
            },
            {
                id: "cpp-7-3",
                company: "Amazon",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is an Abstract Class and Pure Virtual Function in C++? Can an abstract class have a constructor?",
                explanation: "A pure virtual function is declared with `= 0` (`virtual void draw() = 0;`), indicating that derived classes must provide an implementation. A class with at least one pure virtual function is an Abstract Class and cannot be instantiated. Abstract classes CAN have constructors; their constructors execute when derived class objects are instantiated."
            },
            {
                id: "cpp-7-4",
                company: "Apple",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the purpose of `override` and `final` specifiers in C++11?",
                explanation: "- `override`: Tells the compiler that the member function is intended to override a virtual function in the base class. If signatures mismatch (misspelled name, constness difference), compilation fails immediately.\n- `final`: Prohibits further overriding of a virtual method in derived classes, or prevents a class from being inherited at all (`class Sealed final {};`)."
            },
            {
                id: "cpp-7-5",
                company: "Bloomberg",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Object Slicing in C++?",
                explanation: "Object slicing occurs when a derived class object is assigned or passed by value to a base class variable (`Base b = derived_obj;`). The derived-specific member variables are 'sliced off', leaving only the base portion. Virtual dynamic dispatch is lost because `b` becomes a pure `Base` object with a Base `vptr`."
            },
            {
                id: "cpp-7-6",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Explain the differences between Public, Protected, and Private inheritance in C++.",
                explanation: "1. Public Inheritance: 'is-a' relationship; public/protected members of base retain their access levels in derived.\n2. Protected Inheritance: Public and protected members of base both become `protected` in derived.\n3. Private Inheritance: 'implemented-in-terms-of' relationship; public and protected members of base both become `private` in derived."
            },
            {
                id: "cpp-7-7",
                company: "Qualcomm",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Covariant Return Type in virtual function overriding?",
                explanation: "C++ allows an overriding virtual function in a derived class to return a pointer or reference to a more derived class than the return type declared in the base class:\n`Base* Base::clone();` can be overridden by `Derived* Derived::clone();`."
            },
            {
                id: "cpp-7-8",
                company: "Adobe",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the output of calling a virtual function from inside a Constructor or Destructor in C++?",
                explanation: "In C++, dynamic dispatch does NOT work in constructors and destructors! While `Base` constructor executes, the object is only a `Base` (its `vptr` points to `Base::vtable`), so invoking a virtual function calls `Base`'s implementation, NOT `Derived`'s."
            },
            {
                id: "cpp-7-9",
                company: "NVIDIA",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the Curiously Recurring Template Pattern (CRTP) and how does it achieve Static Polymorphism?",
                explanation: "CRTP is an idiom where a class `Derived` derives from a template base instantiated with `Derived` itself: `class Derived : public Base<Derived>`. The base class casts `static_cast<Derived*>(this)->interface()` to dispatch method calls at compile time, eliminating VTable pointer overhead and enabling inlining."
            },
            {
                id: "cpp-7-10",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Coding",
                question: "Write a simple C++ inheritance example showing a `Shape` base class and a `Circle` derived class.",
                explanation: "```c++\nclass Shape {\npublic:\n    virtual double area() const = 0;\n    virtual ~Shape() {}\n};\nclass Circle : public Shape {\n    double r;\npublic:\n    Circle(double r) : r(r) {}\n    double area() const override { return 3.14159 * r * r; }\n};\n```"
            },
            {
                id: "cpp-7-11",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Can a derived class access private members of its base class directly?",
                explanation: "No. Private members of a base class are strictly hidden and cannot be accessed directly by derived classes. Derived classes must use public or protected accessor methods (`get()`/`set()`)."
            },
            {
                id: "cpp-7-12",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the memory size overhead added to an object when it contains virtual functions?",
                explanation: "The only overhead is the single Virtual Table Pointer (`vptr`), which adds 8 bytes on a 64-bit architecture (or 4 bytes on 32-bit), plus any necessary structure alignment padding. The size does not increase with additional virtual functions."
            },
            {
                id: "cpp-7-13",
                company: "Goldman Sachs",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Devirtualization and how does the compiler optimize virtual calls?",
                explanation: "Devirtualization is an optimizing compiler pass (`-O3`) that analyzes class hierarchies. If the compiler can prove that only one derived class can possibly be targeted by a virtual call (e.g. object is marked `final` or constructed locally), it replaces the indirect VTable jump with a direct static function call, enabling inlining."
            },
            {
                id: "cpp-7-14",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Can a class inherit from multiple base classes in C++?",
                explanation: "Yes, C++ fully supports Multiple Inheritance: `class Derived : public BaseA, public BaseB`. Each base sub-object is laid out in memory in order of declaration."
            },
            {
                id: "cpp-7-15",
                company: "Cisco",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "Can a Pure Virtual Function have a function body definition in C++?",
                explanation: "Yes! A pure virtual function (`virtual void f() = 0;`) CAN have a definition provided outside the class body (`void Base::f() { ... }`). Derived classes are still forced to override it, but can explicitly invoke the base implementation via `Base::f()`."
            }
        ]
    },

    // Module 8: Working with Files
    8: {
        moduleTitle: "Working with Files & C++ Stream I/O",
        questions: [
            {
                id: "cpp-8-1",
                company: "Google",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "How do you read a text file line-by-line using `std::ifstream` and `std::getline()` safely?",
                explanation: "```c++\n#include <fstream>\n#include <string>\n#include <iostream>\n\nvoid readFile(const std::string &filename) {\n    std::ifstream file(filename);\n    if (!file.is_open()) return;\n    std::string line;\n    while (std::getline(file, line)) {\n        std::cout << line << \"\\n\";\n    }\n}\n```"
            },
            {
                id: "cpp-8-2",
                company: "Microsoft",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "Explain the difference between `seekg` (seek get) and `seekp` (seek put) with file streams.",
                explanation: "`seekg()` manipulates the input get pointer (used by `std::ifstream` for reading). `seekp()` manipulates the output put pointer (used by `std::ofstream` for writing). With bidirectional `std::fstream`, both pointers can be positioned independently on disk files."
            },
            {
                id: "cpp-8-3",
                company: "Amazon",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What are Stream State Flags in `std::ios` (`good()`, `eof()`, `fail()`, `bad()`)?",
                explanation: "1. `good()`: Returns true if no error flags are set.\n2. `eof()`: Returns true if read pointer passed end-of-file.\n3. `fail()`: Returns true on logical format conversion errors (e.g. reading string letters into an `int`).\n4. `bad()`: Returns true on fatal low-level hardware or filesystem read/write failures."
            },
            {
                id: "cpp-8-4",
                company: "Apple",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "How do you write and read raw binary structures to disk using `.write()` and `.read()`?",
                explanation: "```c++\nstruct Record { int id; double score; };\n// Write\nstd::ofstream out(\"data.bin\", std::ios::binary);\nRecord r1{101, 98.5};\nout.write(reinterpret_cast<const char*>(&r1), sizeof(r1));\n// Read\nstd::ifstream in(\"data.bin\", std::ios::binary);\nRecord r2;\nin.read(reinterpret_cast<char*>(&r2), sizeof(r2));\n```"
            },
            {
                id: "cpp-8-5",
                company: "Bloomberg",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "Why does `std::endl` degrade performance in high-throughput file output, and what should be used instead?",
                explanation: "`std::endl` outputs a newline character `\\n` AND forces an immediate flush of the stream buffer (`flush()`). Repeatedly calling `std::endl` causes frequent, expensive system calls. High-performance code should always use `\\n` and allow the stream buffer to flush automatically."
            },
            {
                id: "cpp-8-6",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is `std::filesystem` introduced in C++17?",
                explanation: "`<filesystem>` provides a modern, portable, cross-platform standard library for manipulating paths, iterating over directories, querying file permissions, file sizes, and copying/renaming files without relying on OS-specific POSIX or Win32 APIs."
            },
            {
                id: "cpp-8-7",
                company: "Qualcomm",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Does `std::fstream` close files automatically when leaving scope?",
                explanation: "Yes. `std::ifstream`, `std::ofstream`, and `std::fstream` follow the RAII principle. Their destructors automatically flush and close any open file descriptors when the stream object goes out of scope."
            },
            {
                id: "cpp-8-8",
                company: "Adobe",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What does file open mode `std::ios::trunc` vs `std::ios::app` do?",
                explanation: "`std::ios::trunc` discards existing file content and truncates length to 0. `std::ios::app` forces all write operations to append strictly at the end of the file."
            },
            {
                id: "cpp-8-9",
                company: "NVIDIA",
                year: 2023,
                difficulty: "Hard",
                type: "Coding",
                question: "How do you read the entire contents of a file into a `std::string` in one line?",
                explanation: "```c++\nstd::ifstream file(\"input.txt\");\nstd::string content((std::istreambuf_iterator<char>(file)),\n                    std::istreambuf_iterator<char>());\n```"
            },
            {
                id: "cpp-8-10",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Which header file is required for file streams in C++?",
                explanation: "`#include <fstream>` declares `std::ifstream`, `std::ofstream`, and `std::fstream`."
            },
            {
                id: "cpp-8-11",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What does `tellg()` and `tellp()` return?",
                explanation: "`tellg()` returns the current byte position of the get (read) pointer. `tellp()` returns the current byte position of the put (write) pointer (of type `std::streampos`)."
            },
            {
                id: "cpp-8-12",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is `std::stringstream` and what is it used for?",
                explanation: "`std::stringstream` from `<sstream>` provides an in-memory stream buffer. It is used for formatting, serializing data to string, and parsing tokens from string inputs like `cin`."
            },
            {
                id: "cpp-8-13",
                company: "Goldman Sachs",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is Stream Synchronization with C `stdio` (`std::ios::sync_with_stdio(false)`)?",
                explanation: "By default, C++ streams synchronize their buffers with standard C `stdio` (`printf`/`scanf`) after every I/O operation. Calling `std::ios::sync_with_stdio(false)` disables this sync, significantly speeding up C++ stream I/O."
            },
            {
                id: "cpp-8-14",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What happens if you attempt to read from a non-existent file with `std::ifstream`?",
                explanation: "The stream fails to open. `file.is_open()` returns `false`, and `file.fail()` returns `true`. Attempting to read sets the fail bit without crashing."
            },
            {
                id: "cpp-8-15",
                company: "Cisco",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "How do you enable C++ streams to throw exceptions instead of silently setting error bits?",
                explanation: "Call `.exceptions()` with the desired state mask:\n`file.exceptions(std::ifstream::failbit | std::ifstream::badbit);`\nAny subsequent I/O failure throws `std::ios_base::failure`."
            }
        ]
    },

    // Module 9: Exception Handling
    9: {
        moduleTitle: "Exception Handling & Stack Unwinding",
        questions: [
            {
                id: "cpp-9-1",
                company: "Google",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "Explain Stack Unwinding in C++. What happens to local objects when an exception propagates?",
                explanation: "When an exception is thrown, the C++ runtime searches upward through the call stack for a matching enclosing `catch` block. During this traversal, the runtime destroys all fully constructed local stack objects in each exited stack frame by calling their destructors in reverse order of construction (RAII guarantee). If no catch block is found, `std::terminate()` is invoked."
            },
            {
                id: "cpp-9-2",
                company: "Microsoft",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Why should exceptions always be caught by Reference (`catch (const std::exception &e)`) rather than by Value?",
                explanation: "1. Avoids Object Slicing: If caught by value (`catch (std::exception e)`), derived exception information (such as custom error codes or `what()`) is sliced off.\n2. Avoids Copy Overhead: Catching by reference eliminates invoking the copy constructor on the thrown exception object."
            },
            {
                id: "cpp-9-3",
                company: "Amazon",
                year: 2023,
                difficulty: "Easy",
                type: "Coding",
                question: "What is `catch (...)` and where MUST it be placed in a multi-catch block hierarchy?",
                explanation: "`catch (...)` is the catch-all handler that catches any and all thrown exceptions regardless of type. It MUST be placed as the absolute LAST catch block in a `try-catch` sequence; placing it before specific catch handlers causes compilation errors because the specific handlers become unreachable."
            },
            {
                id: "cpp-9-4",
                company: "Apple",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the `noexcept` specifier in C++11 and how does it optimize standard containers like `std::vector`?",
                explanation: "`noexcept` declares that a function guarantees not to throw exceptions. If a function marked `noexcept` throws, `std::terminate()` is called immediately. `std::vector` checks `std::is_nothrow_move_constructible<T>`: if the move constructor is `noexcept`, it uses fast move semantics during reallocation; if not `noexcept`, it falls back to expensive copies to preserve the strong exception safety guarantee."
            },
            {
                id: "cpp-9-5",
                company: "Bloomberg",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What are the four levels of Exception Safety Guarantees in C++?",
                explanation: "1. No-throw (Failure Transparency): Function guarantees it will never throw; always succeeds (`noexcept`).\n2. Strong Guarantee: Transactional semantics: if an exception occurs, state is rolled back completely to before the call.\n3. Basic Guarantee: If an exception occurs, no memory is leaked and objects remain in valid (though possibly modified) states.\n4. No Guarantee: Leaks memory or leaves corrupted state; undefined behavior."
            },
            {
                id: "cpp-9-6",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "How do you re-throw the currently active exception in a `catch` block?",
                explanation: "Use a bare `throw;` statement with no operand:\n```c++\ntry {\n    // code\n} catch (const std::exception &e) {\n    logError(e.what());\n    throw; // Re-throws current exception intact to outer caller\n}\n```"
            },
            {
                id: "cpp-9-7",
                company: "Qualcomm",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What happens if an exception is thrown from inside a Constructor?",
                explanation: "If a constructor throws an exception, the object is considered not fully constructed. Its own destructor will NOT be called. However, any base classes and member variables that were already fully initialized before the throw WILL have their destructors automatically executed in reverse order. Raw pointer heap allocations must be managed via smart pointers to avoid leaks."
            },
            {
                id: "cpp-9-8",
                company: "Adobe",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "Write a custom exception class inheriting from `std::runtime_error`.",
                explanation: "```c++\n#include <stdexcept>\n#include <string>\n\nclass DatabaseException : public std::runtime_error {\npublic:\n    explicit DatabaseException(const std::string &msg)\n        : std::runtime_error(\"DB Error: \" + msg) {}\n};\n```"
            },
            {
                id: "cpp-9-9",
                company: "NVIDIA",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is `std::current_exception` and `std::exception_ptr` in C++11?",
                explanation: "`std::current_exception()` captures the currently handled exception into a reference-counted `std::exception_ptr` object. This allows passing exceptions across worker threads to be re-thrown and caught on the main thread via `std::rethrow_exception()`."
            },
            {
                id: "cpp-9-10",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is `std::exception::what()` in C++?",
                explanation: "`what()` is a virtual member function of `std::exception` that returns a `const char*` null-terminated explanatory string describing the error message."
            },
            {
                id: "cpp-9-11",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "Can an integer or string literal be thrown directly in C++? (e.g. `throw 404;` or `throw \"Not found\";`)",
                explanation: "Yes! In C++, any type can be thrown (integers, strings, floats, pointers, classes). However, production guidelines recommend strictly throwing classes derived from `std::exception`."
            },
            {
                id: "cpp-9-12",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is Function Try Block in C++ and when is it required?",
                explanation: "A function try block wraps the entire constructor body and member initialization list:\n`MyClass() try : member(init) { } catch (...) { }`\nIt is the ONLY way to catch exceptions thrown during member initializer list evaluation."
            },
            {
                id: "cpp-9-13",
                company: "Goldman Sachs",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the performance overhead of C++ exceptions when NO exception is thrown ('Zero-Cost Exceptions')?",
                explanation: "Modern compilers (GCC/Clang on 64-bit systems) use table-driven zero-cost exception handling. In the normal happy path (no exceptions thrown), there is virtually zero execution time overhead (no runtime stack tracking). The tradeoff is increased binary size due to static unwind tables (`.eh_frame`) and high latency when an exception is actually thrown."
            },
            {
                id: "cpp-9-14",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is `std::uncaught_exceptions()` in C++17?",
                explanation: "Returns the integer count of uncaught exception objects currently in flight. Used in custom RAII scopes to detect whether a destructor is running normally or during stack unwinding."
            },
            {
                id: "cpp-9-15",
                company: "Cisco",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the difference between `std::terminate()` and `std::abort()`?",
                explanation: "`std::abort()` terminates the program abnormally immediately without calling destructors or atexit handlers. `std::terminate()` is invoked when exception handling fails, which in turn calls the registered `std::terminate_handler` (which defaults to `abort()`)."
            }
        ]
    }
};

