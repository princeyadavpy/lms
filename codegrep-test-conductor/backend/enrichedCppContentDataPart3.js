/**
 * Enriched Content Data for Programming in 'C++' (Part 3: Modules 7 through 9)
 * Topics:
 * - Module 7: Inheritance (7.1 - 7.3)
 * - Module 8: Working with files (8.1 - 8.3)
 * - Module 9: Exception Handling (9.1 - 9.3)
 */

module.exports = {
    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 7: INHERITANCE
    // ═════════════════════════════════════════════════════════════════════════
    "7-1": {
        content: `### 7.1 Types of Inheritance & Access Specifiers in 'C++'

**Inheritance** is the mechanism by which a new class (**Derived / Child Class**) inherits the data attributes and member functions of an existing class (**Base / Parent Class**), modeling an **\`is-a\` relationship** and facilitating code reuse.

\`\`\`
                          Forms of Inheritance
     ┌──────────────┬──────────────┬──────────────┬──────────────┐
     ▼              ▼              ▼              ▼              ▼
   Single        Multiple      Multilevel    Hierarchical      Hybrid
   (A -> B)    (A, B -> C)    (A -> B -> C)   (A -> B, C)   (Diamond graph)
\`\`\`

#### Forms of Inheritance
1. **Single Inheritance:** A single derived class inherits from one single base class (A \→ B).
2. **Multiple Inheritance:** A single derived class inherits directly from two or more base classes (A, B \→ C).
3. **Multilevel Inheritance:** A class inherits from a derived class, forming a chain (A \→ B \→ C).
4. **Hierarchical Inheritance:** Multiple derived classes inherit from a single common base class (A \→ B and A \→ C).
5. **Hybrid Inheritance:** A combination of two or more forms of inheritance (e.g., forming a diamond).

#### Access Visibility in Inheritance Modes
The inheritance mode specifier (\`public\`, \`protected\`, or \`private\`) controls how inherited members appear in the derived class:

| Base Class Member | \`public\` Inheritance | \`protected\` Inheritance | \`private\` Inheritance |
| :--- | :--- | :--- | :--- |
| **\`public\`** | Remains **\`public\`** | Becomes **\`protected\`** | Becomes **\`private\`** |
| **\`protected\`** | Remains **\`protected\`** | Remains **\`protected\`** | Becomes **\`private\`** |
| **\`private\`** | **Never accessible** | **Never accessible** | **Never accessible** |

- \`public\` inheritance represents true subtyping (an \`is-a\` relationship).`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Multiple and Multilevel Inheritance in Action',
                code: `#include <iostream>

// Base Class 1
class PoweredDevice {
public:
    void powerOn() { std::cout << "Device powered ON\\n"; }
};

// Base Class 2
class NetworkConnected {
public:
    void connectWiFi() { std::cout << "Connected to WiFi network\\n"; }
};

// Multiple Inheritance: SmartTV inherits from both base classes
class SmartTV : public PoweredDevice, public NetworkConnected {
public:
    void streamMovie() {
        std::cout << "Streaming 4K video...\\n";
    }
};

int main() {
    SmartTV myTV;
    myTV.powerOn();     // Inherited from PoweredDevice
    myTV.connectWiFi(); // Inherited from NetworkConnected
    myTV.streamMovie(); // Defined in SmartTV
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Inheritance models the 'is-a' relationship. Forms include Single, Multiple, Multilevel, Hierarchical, and Hybrid. Public inheritance preserves member visibility; private members are never accessible in derived classes.",
            keyConcepts: ["Inheritance Modes (public, protected, private)", "Multiple Inheritance", "Multilevel Inheritance Chains", "is-a Relationship Modeling"],
            revisionNotes: "Public inheritance is standard; private inheritance represents implementation composition ('implemented-in-terms-of')."
        }
    },

    "7-2": {
        content: `### 7.2 Virtual Base Classes & Abstract Base Classes

Two advanced inheritance concepts in C++ resolve structural ambiguity and define architectural contracts: **Virtual Base Classes** and **Abstract Base Classes**.

#### 1. The Diamond Problem & Virtual Base Classes
In hybrid multiple inheritance, the **Diamond Problem** occurs when a class inherits from two classes that share a common grandparent:

\`\`\`
         Grandparent Class (A)
              /         \\
             /           \\
    Parent1 (B)         Parent2 (C)
             \\           /
              \\         /
          Child Class (D)
\`\`\`
- Without virtual inheritance, \`Class D\` receives **two separate copies of Class A's data members**, causing compiler ambiguity errors when referencing members of \`A\`.
- **Solution — Virtual Base Class:** By inheriting using the \`virtual\` keyword:
  \`\`\`cpp
  class B : virtual public A { /* ... */ };
  class C : virtual public A { /* ... */ };
  \`\`\`
  The compiler ensures that \`Class D\` contains only **one single, shared instance** of \`Class A\`.

#### 2. Abstract Base Classes (ABCs) and Pure Virtual Functions
- An **Abstract Base Class** defines an interface without providing complete implementation.
- Contains at least one **Pure Virtual Function** (\`virtual void func() = 0;\`).
- Forces all derived classes to implement the required interface before they can be instantiated.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Solving the Diamond Problem with Virtual Base Classes',
                code: `#include <iostream>

class Device {
public:
    int deviceId;
};

// Virtual inheritance ensures only ONE copy of Device exists in Smartphone
class Phone : virtual public Device {};
class Camera : virtual public Device {};

class Smartphone : public Phone, public Camera {
public:
    void printId() {
        // Unambiguous: only one shared deviceId exists!
        std::cout << "Smartphone Unified Device ID: " << deviceId << std::endl;
    }
};

int main() {
    Smartphone sp;
    sp.deviceId = 9001; // No ambiguity!
    sp.printId();
    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Virtual Base Classes solve the Diamond Problem by ensuring derived classes share a single copy of grandparent members. Abstract Base Classes enforce design contracts using pure virtual functions (= 0).",
            keyConcepts: ["The Diamond Problem", "Virtual Base Class (virtual public Base)", "Shared Instance Layout", "Abstract Base Classes (ABCs) & Interfaces"],
            revisionNotes: "An abstract class cannot be instantiated directly; you can only instantiate concrete derived classes that implement all pure virtual methods."
        }
    },

    "7-3": {
        content: `### 7.3 Constructor and Destructor Calling Order in Inheritance

Understanding the exact sequence in which constructors and destructors execute across an inheritance hierarchy is essential for memory safety.

#### 1. Constructor Execution Order: Top-Down (Base to Derived)
When an object of a derived class is created:
1. **Base class constructors execute first**, starting from the root of the hierarchy down to the derived class.
2. If multiple base classes are present, they execute in the **exact order they appear in the class declaration list**, NOT in the order listed in the member initializer list.
3. Finally, the derived class constructor body executes.

#### 2. Destructor Execution Order: Bottom-Up (Derived to Base)
When the derived object goes out of scope or is deleted:
1. The **derived class destructor executes first**, cleaning up derived members.
2. Destructors of base classes execute in the **exact reverse order** of construction, finishing at the root base class.

\`\`\`
 Object Creation:           Object Destruction:
 1. Base Constructor        1. Derived Destructor
    └── 2. Derived Constr.     └── 2. Base Destructor
\`\`\`

#### Virtual Destructors in Base Classes
If an object of a derived class is deleted via a base class pointer (\`Base *b = new Derived(); delete b;\`), the base class destructor **MUST be marked \`virtual\`**!
- Without a \`virtual\` destructor, only the base destructor runs; the derived destructor is bypassed, causing memory and resource leaks.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Constructor/Destructor Order and Virtual Destructors',
                code: `#include <iostream>

class Base {
public:
    Base()  { std::cout << "1. Base Constructor\\n"; }
    virtual ~Base() { std::cout << "4. Base Destructor\\n"; }
};

class Derived : public Base {
public:
    Derived() { std::cout << "2. Derived Constructor\\n"; }
    ~Derived() override { std::cout << "3. Derived Destructor\\n"; }
};

int main() {
    std::cout << "--- Stack Object Lifecycle ---\\n";
    {
        Derived d; // Construction: 1 -> 2 | Destruction: 3 -> 4
    }

    std::cout << "\\n--- Polymorphic Pointer Deletion ---\\n";
    Base *poly = new Derived();
    delete poly; // Safely executes Derived Destructor, then Base Destructor!

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Constructors execute top-down (Base to Derived); destructors execute in reverse bottom-up order (Derived to Base). Base classes must have virtual destructors to ensure derived cleanup during polymorphic deletions.",
            keyConcepts: ["Construction Sequence (Base -> Derived)", "Destruction Sequence (Derived -> Base)", "Declaration Order in Multiple Inheritance", "Virtual Destructor Mandate"],
            revisionNotes: "Always make base class destructors virtual: `virtual ~Base() = default;`."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 8: WORKING WITH FILES
    // ═════════════════════════════════════════════════════════════════════════
    "8-1": {
        content: `### 8.1 File Stream Classes and Operations in 'C++'

In C++, file input and output is managed using object-oriented stream abstractions defined in **\`<fstream>\`**.

#### The Three Core File Stream Classes
1. **\`std::ifstream\` (Input File Stream):** Specialized for reading data from files.
2. **\`std::ofstream\` (Output File Stream):** Specialized for writing and creating files.
3. **\`std::fstream\` (File Stream):** General-purpose bidirectional stream supporting simultaneous reading and writing.

#### File Opening Modes (\`std::ios::\`)
Modes can be combined using the bitwise OR operator (\`|\`):

| File Mode Flag | Meaning |
| :--- | :--- |
| **\`std::ios::in\`** | Open for reading (default for \`ifstream\`) |
| **\`std::ios::out\`**| Open for writing (default for \`ofstream\`, truncates existing content) |
| **\`std::ios::app\`**| Append writes to the end of the file |
| **\`std::ios::ate\`**| Open file and seek immediately to the end (at-the-end) |
| **\`std::ios::trunc\`**| Discard existing contents (truncate to 0 bytes) |
| **\`std::ios::binary\`**| Open in raw binary mode (disables newline translation) |

#### Automatic RAII Cleanup
Because file streams are C++ classes, their **destructors automatically call \`close()\`** when the stream object exits scope.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'File Writing and Reading with <fstream>',
                code: `#include <iostream>
#include <fstream>
#include <string>

int main() {
    // 1. Write text using ofstream (with RAII automatic close)
    {
        std::ofstream outFile("config.txt");
        if (!outFile) {
            std::cerr << "Error opening file for write!\\n";
            return 1;
        }
        outFile << "SERVER_PORT=8080\\n";
        outFile << "ENVIRONMENT=production\\n";
        outFile << "MAX_CONNECTIONS=1000\\n";
    } // File closed automatically here by ~ofstream()

    // 2. Read back lines using ifstream
    std::ifstream inFile("config.txt");
    std::string line;
    std::cout << "Reading config.txt contents:\\n";
    while (std::getline(inFile, line)) {
        std::cout << "-> " << line << std::endl;
    }

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C++ file handling uses ifstream (reading), ofstream (writing), and fstream (bidirectional) from <fstream>. Stream destructors automatically close files via RAII.",
            keyConcepts: ["ifstream, ofstream, fstream", "File Open Modes (ios::in, ios::out, ios::app, ios::binary)", "Stream Operator Symmetry (<< and >>)", "Automatic RAII Closure"],
            revisionNotes: "Always verify file stream validity using `if (!file)` before reading or writing."
        }
    },

    "8-2": {
        content: `### 8.2 File Pointers and Stream Positioning in 'C++'

Every open file stream maintains internal **file position pointers** tracking the current read or write byte location.

#### The Get and Put Pointers
- **Get Pointer (\`seekg\` and \`tellg\`):** Belongs to input streams (\`ifstream\`), tracking where the next read occurs.
- **Put Pointer (\`seekp\` and \`tellp\`):** Belongs to output streams (\`ofstream\`), tracking where the next write occurs.

#### Seeking Functions
\`\`\`cpp
// Move read (get) pointer
stream.seekg(offset, seek_direction);

// Move write (put) pointer
stream.seekp(offset, seek_direction);
\`\`\`

#### Seek Directions (\`std::ios::\`)
- **\`std::ios::beg\`:** Offset relative to the **beginning** of the file.
- **\`std::ios::cur\`:** Offset relative to the **current** pointer position.
- **\`std::ios::end\`:** Offset relative to the **end** of the file.

#### Getting Current Position
- \`long pos = stream.tellg();\` // Current read byte offset
- \`long pos = stream.tellp();\` // Current write byte offset`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Inspecting File Positions with seekg and tellg',
                code: `#include <iostream>
#include <fstream>

int main() {
    std::ofstream out("alphabet.txt");
    out << "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    out.close();

    std::ifstream in("alphabet.txt");

    // 1. Calculate file size using tellg
    in.seekg(0, std::ios::end);
    std::streampos fileSize = in.tellg();
    std::cout << "File size: " << fileSize << " bytes" << std::endl;

    // 2. Seek to byte 7 (8th letter: 'H')
    in.seekg(7, std::ios::beg);
    char ch;
    in.get(ch);
    std::cout << "Character at byte offset 7: " << ch << std::endl;

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C++ distinguishes between get pointers for reading (seekg, tellg) and put pointers for writing (seekp, tellp). Seek directions include ios::beg, ios::cur, and ios::end.",
            keyConcepts: ["seekg() & seekp() Navigation", "tellg() & tellp() Tracking", "Seek Directions (beg, cur, end)", "Computing File Size"],
            revisionNotes: "Remember: 'g' stands for Get (reading); 'p' stands for Put (writing)."
        }
    },

    "8-3": {
        content: `### 8.3 File Updating with Binary Random Access

Standard text streams perform formatted string translations. For high-speed data storage and database record updates, **Binary Random Access** writes raw memory bytes directly to disk.

#### Raw Binary Functions
\`\`\`cpp
// Write raw bytes directly from RAM to file
stream.write(reinterpret_cast<const char*>(&object), sizeof(object));

// Read raw bytes directly from file into RAM
stream.read(reinterpret_cast<char*>(&object), sizeof(object));
\`\`\`

#### In-Place Record Updating
To update record N in a binary file without rewriting preceding records:
1. Open in bidirectional binary mode: \`std::fstream file("data.bin", std::ios::in | std::ios::out | std::ios::binary);\`.
2. Seek write pointer directly to record N:
   \`\`\`cpp
   file.seekp(N * sizeof(Record), std::ios::beg);
   \`\`\`
3. Write the updated record structure:
   \`\`\`cpp
   file.write(reinterpret_cast<char*>(&updatedRec), sizeof(Record));
   \`\`\``,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'In-Place Binary Record Serialization & Updating',
                code: `#include <iostream>
#include <fstream>

struct Player {
    int id;
    int score;
};

int main() {
    std::fstream file("players.bin", std::ios::in | std::ios::out | std::ios::trunc | std::ios::binary);

    Player p1 = {1, 150};
    Player p2 = {2, 280};

    // Write 2 binary records
    file.write(reinterpret_cast<char*>(&p1), sizeof(Player));
    file.write(reinterpret_cast<char*>(&p2), sizeof(Player));

    // Update Player 2's score in-place: jump to 2nd record
    p2.score = 500;
    file.seekp(1 * sizeof(Player), std::ios::beg);
    file.write(reinterpret_cast<char*>(&p2), sizeof(Player));

    // Read back Player 2 to verify update
    Player verify;
    file.seekg(1 * sizeof(Player), std::ios::beg);
    file.read(reinterpret_cast<char*>(&verify), sizeof(Player));

    std::cout << "Updated Record 2: ID = " << verify.id 
              << ", New Score = " << verify.score << std::endl;

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "Binary I/O uses write() and read() with reinterpret_cast<char*> to store raw memory structs. In-place updates reposition the seekp pointer to record offsets: index * sizeof(Record).",
            keyConcepts: ["Binary File Mode (ios::binary)", "write() and read() Block Transfers", "reinterpret_cast<char*> Casting", "In-Place Record Updation"],
            revisionNotes: "Never write classes containing raw pointers or dynamic strings (like std::string) directly with binary read/write; serialize scalar members instead."
        }
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 9: EXCEPTION HANDLING
    // ═════════════════════════════════════════════════════════════════════════
    "9-1": {
        content: `### 9.1 Standard Exception Classes in 'C++'

**Exception handling** is a structured mechanism in C++ to detect, propagate, and recover from anomalous runtime conditions without crashing the application.

#### The \`std::exception\` Hierarchy (\`<stdexcept>\`)
All standard C++ exceptions inherit from the root **\`std::exception\`** class:

\`\`\`
                          std::exception (root)
                                     ▲
               ┌─────────────────────┴─────────────────────┐
               ▼                                           ▼
       std::logic_error                            std::runtime_error
    (Bugs detectable by logic)                 (Errors detectable at runtime)
    ├── std::invalid_argument                  ├── std::overflow_error
    ├── std::out_of_range                      ├── std::underflow_error
    └── std::domain_error                      └── std::range_error
\`\`\`

#### Other Core Standard Exceptions
- **\`std::bad_alloc\`:** Thrown by \`new\` when system heap memory is exhausted.
- **\`std::bad_cast\`:** Thrown by \`dynamic_cast\` on reference downcast failure.

#### The \`.what()\` Virtual Method
Every class in the exception hierarchy implements the virtual method:
\`\`\`cpp
virtual const char* what() const noexcept;
\`\`\`
- Returns an explanatory, null-terminated C-string describing the error cause.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Standard Exceptions & .what() Diagnostics',
                code: `#include <iostream>
#include <vector>
#include <stdexcept>

void processScore(int score) {
    if (score < 0 || score > 100) {
        throw std::invalid_argument("Score must be between 0 and 100!");
    }
    std::cout << "Score registered: " << score << std::endl;
}

int main() {
    try {
        processScore(85);
        processScore(150); // Throws std::invalid_argument
    } catch (const std::exception &ex) {
        std::cerr << "Standard Exception Caught: " << ex.what() << std::endl;
    }

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "C++ exceptions inherit from std::exception, divided into logic_error (preventable bugs) and runtime_error (unforeseeable environment errors). The .what() method returns error descriptions.",
            keyConcepts: ["std::exception Root Class", "logic_error vs runtime_error", "out_of_range & invalid_argument", "what() Diagnostic String"],
            revisionNotes: "Always catch exceptions by const reference: `catch (const std::exception &e)` to prevent object slicing."
        }
    },

    "9-2": {
        content: `### 9.2 Implementing Try, Catch, and Stack Unwinding

Exception handling in C++ is structured around three keywords: **\`try\`**, **\`catch\`**, and **\`throw\`**.

#### Syntax & Structure
\`\`\`cpp
try {
    // Protected code that may throw an exception
} catch (const SpecificException &e) {
    // Handler for specific exception
} catch (...) {
    // Catch-All Handler (catches any type)
}
\`\`\`

#### Stack Unwinding
When an exception is thrown:
1. The C++ runtime halts execution in the current function.
2. It walks backward up the **Call Stack** looking for an enclosing \`try...catch\` block.
3. During this search, **all local stack objects in exited scopes are automatically destroyed, and their destructors are executed!**
4. This automatic destruction during error propagation is called **Stack Unwinding**.

#### The Catch-All Handler (\`catch (...)\`)
A catch block with an ellipsis (\`...\`) catches **any exception of any data type**, acting as a fallback safety net to prevent application termination.`,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Stack Unwinding with Automatic Destructor Execution',
                code: `#include <iostream>
#include <stdexcept>

class Resource {
public:
    Resource()  { std::cout << "Resource constructed.\\n"; }
    ~Resource() { std::cout << "Resource safely cleaned up by Stack Unwinding!\\n"; }
};

void riskyFunction() {
    Resource r; // Stack object
    std::cout << "Executing risky function...\\n";
    throw std::runtime_error("Unexpected network failure!");
}

int main() {
    try {
        riskyFunction();
    } catch (const std::runtime_error &e) {
        std::cerr << "Caught in main: " << e.what() << std::endl;
    } catch (...) {
        std::cerr << "Catch-All: Unknown exception caught!\\n";
    }

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "try blocks wrap code that may throw; catch blocks handle errors. Stack unwinding automatically executes destructors of local objects as the stack is cleared during an exception.",
            keyConcepts: ["try, catch, throw Flow", "Stack Unwinding Guarantee", "Catch-All Handler catch (...)", "Destructor Execution Safety"],
            revisionNotes: "Never allow a destructor to throw an exception during stack unwinding; doing so calls std::terminate immediately."
        }
    },

    "9-3": {
        content: `### 9.3 The Throw Keyword & Custom Exceptions in 'C++'

The **\`throw\`** keyword raises an exception, interrupting normal control flow and transferring execution to the nearest matching \`catch\` block.

#### 1. Throwing Exceptions
You can throw primitive values, strings, or exception objects:
\`\`\`cpp
throw 404;                              // Throw int error code
throw std::runtime_error("DB Timeout"); // Throw standard object
\`\`\`

#### 2. Re-Throwing Exceptions (\`throw;\`)
Inside a \`catch\` block, a bare \`throw;\` statement without arguments **re-throws the current exception** up to the next enclosing caller:
\`\`\`cpp
try {
    // ...
} catch (const std::exception &e) {
    logError(e.what());
    throw; // Re-throw to caller
}
\`\`\`

#### 3. Creating Custom Exception Classes
In professional C++ software engineering, domain-specific exceptions are created by subclassing **\`std::exception\`**:
\`\`\`cpp
class InsufficientFundsException : public std::exception {
public:
    const char* what() const noexcept override {
        return "Transaction Failed: Insufficient Account Balance!";
    }
};
\`\`\``,
        codeSnippets: [
            {
                language: 'cpp',
                title: 'Custom Exception Class Subclassing std::exception',
                code: `#include <iostream>
#include <stdexcept>

class InsufficientBalanceException : public std::exception {
private:
    std::string message;

public:
    InsufficientBalanceException(double balance, double amount) {
        message = "Attempted to withdraw $" + std::to_string(amount) + 
                  " with only $" + std::to_string(balance) + " available!";
    }

    const char* what() const noexcept override {
        return message.c_str();
    }
};

void withdraw(double balance, double amount) {
    if (amount > balance) {
        throw InsufficientBalanceException(balance, amount);
    }
    std::cout << "Withdrawal of $" << amount << " successful!\\n";
}

int main() {
    try {
        withdraw(200.0, 50.0);
        withdraw(150.0, 300.0); // Throws custom exception
    } catch (const InsufficientBalanceException &ex) {
        std::cerr << "Custom Exception: " << ex.what() << std::endl;
    }

    return 0;
}`
            }
        ],
        aiSummary: {
            summary: "The throw keyword raises exceptions. Re-throwing uses a bare throw;. Custom exceptions inherit from std::exception and override what() to provide domain-specific diagnostic messages.",
            keyConcepts: ["throw Expressions", "Re-Throwing (throw;)", "Custom Exception Classes", "Overriding what() noexcept"],
            revisionNotes: "Always mark your custom `what()` method as `noexcept` to match `std::exception`'s virtual signature."
        }
    }
};

