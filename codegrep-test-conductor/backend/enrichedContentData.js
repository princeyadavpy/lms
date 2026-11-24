/**
 * Enriched Content Data for Python Masterclass Curriculum
 * Covers Modules 1 through 12 sequence-wise with:
 * - Well-researched comprehensive content with markdown tables, code blocks, and callout quotes
 * - Runnable codeSnippets for demonstration and the code playground
 * - Complete aiSummary (summary, keyConcepts, revisionNotes, conceptualDiagram)
 */

module.exports = {
    // ── MODULE 1: INTRODUCTION TO PYTHON ──────────────────────────────────────
    "1-1": {
        content: `### 1.1 What is Python?
Python is a modern, high-level, interpreted programming language designed for code readability and programmer efficiency. Created by Guido van Rossum in the late 1980s and first released in 1991, Python's design philosophy is guided by **The Zen of Python (PEP 20)**: *"Simple is better than complex. Readability counts."*

- **High-level:** You focus on problem-solving logic. Memory management, pointer arithmetic, and system architectures are abstracted away.
- **Interpreted:** Python code compiles to bytecode (\`.pyc\`), which is then executed by the CPython virtual machine line-by-line without an explicit ahead-of-time compilation step.
- **Dynamically Typed:** Variable types are resolved and verified at runtime. You do not need explicit static type declarations.
- **Multi-paradigm:** Supports procedural, object-oriented, and functional programming patterns seamlessly.

### Brief History & Timeline
| Year | Milestone | Key Introductions |
| :--- | :--- | :--- |
| **1989** | Development starts | Guido van Rossum begins project at CWI, Netherlands |
| **1991** | Python 0.9.0 | Functions, classes, exception handling, core datatypes |
| **2000** | Python 2.0 | List comprehensions, cycle-detecting garbage collector |
| **2008** | Python 3.0 | Intentional breaking change to fix unicode, division, and standard library |
| **2020** | Python 2 Sunset | Official End of Life (EOL); Python 3 is the sole industry standard |

> **Key Insight:** Python was named after the surreal British comedy show *Monty Python's Flying Circus*, not the serpent!

### Industry Use Cases
1. **Web Development:** Backend services with FastAPI, Django, Flask.
2. **Data Science & AI:** TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy.
3. **Automation & DevOps:** Scripting, CI/CD pipelines, Ansible, web scraping.
4. **Cloud Infrastructure:** Serverless functions on AWS Lambda, Google Cloud, Azure.`,
        codeSnippets: [
            {
                language: 'python',
                title: 'Hello Python & System Inspection',
                code: `import sys\nimport platform\n\nprint("Hello, Python Masterclass!")\nprint(f"Python Version: {platform.python_version()}")\nprint(f"Platform Architecture: {sys.platform}")`
            }
        ],
        aiSummary: {
            summary: 'Python is an interpreted, high-level, multi-paradigm language created by Guido van Rossum in 1991. Modern development is standardized on Python 3.',
            keyConcepts: ['Interpreted vs Compiled', 'Dynamically Typed', 'PEP 20 Zen of Python', 'Multi-paradigm Support'],
            revisionNotes: 'Run `import this` in any Python REPL to inspect the 19 guiding design aphorisms.'
        }
    },

    "1-2": {
        content: `### 1.2 Core Architectural Features
Python balances high-level abstraction with vast developer productivity:
- **Clean English-like Syntax:** Replaces curly braces with significant indentation, minimizing visual noise.
- **"Batteries Included":** The standard library provides built-in modules for JSON, SQLite, regular expressions, cryptographic hashing, and networking.
- **Cross-Platform Portability:** Runs identically across Linux, Windows, and macOS without code recompilation.
- **Massive Ecosystem:** Over 450,000 production packages accessible via \`pip\` on PyPI.

### Python 2 vs Python 3: Fundamental Divergences
| Feature | Python 2 (Deprecated) | Python 3 (Active Standard) |
| :--- | :--- | :--- |
| **Print Statement** | Statement: \`print "Hi"\` | Built-in Function: \`print("Hi")\` |
| **True Division (\`/\`)** | \`5 / 2 = 2\` (Integer truncation) | \`5 / 2 = 2.5\` (Float); \`5 // 2 = 2\` (Floor) |
| **Strings & Text** | ASCII by default; separate \`unicode\` type | Unicode (\`str\`) default; \`bytes\` for raw octets |
| **User Input** | \`raw_input()\` returns string, \`input()\` evaluates | \`input()\` always returns string securely |
| **Iteration** | \`range()\` allocated entire list in RAM | \`range()\` is a lazy, memory-efficient generator |

> **Pro Tip:** When migrating legacy code, use the \`2to3\` automated refactoring CLI tool provided in standard Python toolchains.`,
        codeSnippets: [
            {
                language: 'python',
                title: 'Python 3 Division & Unicode Demonstration',
                code: `# True division vs Floor division\nprint("5 / 2 =", 5 / 2)    # 2.5\nprint("5 // 2 =", 5 // 2)  # 2\n\n# Native Unicode strings\ntext = "नमस्ते Python 🐍"\nprint(text, type(text))`
            }
        ],
        aiSummary: {
            summary: 'Python 3 modernized division, made print a function, made Unicode the default string encoding, and optimized generators.',
            keyConcepts: ['print() Function', 'True Division (/) vs Floor Division (//)', 'Default Unicode Strings', 'Lazy range() Generator'],
            revisionNotes: 'Python 2 officially reached End-Of-Life on January 1, 2020. Never write legacy Python 2 print statements.'
        }
    },

    "1-3": {
        content: `### 1.3 Setup & Environment Configuration
1. **Download:** Official binary installer from **python.org**.
2. **PATH Configuration:** Always check **"Add python.exe to PATH"** on Windows to register CLI binaries.
3. **Verification Command:**
\`\`\`bash
python --version
pip --version
\`\`\`

### 1.4 Syntax Rules & Significant Indentation
In C/Java/JS, code blocks use curly braces \`{}\`. Python uses **whitespace indentation** (standard: **4 spaces per indent level**).

\`\`\`python
def check_score(score):
    if score >= 90:
        print("Excellent!")  # Indented 8 spaces
    else:
        print("Keep practicing!")
\`\`\`

### Critical Identifier Rules
- May contain alphanumeric characters (\`a-z\`, \`A-Z\`, \`0-9\`) and underscores (\`_\`).
- **Never start with a digit** (\`2score\` is invalid; \`score2\` is valid).
- Cannot use reserved keywords (\`if\`, \`def\`, \`class\`, \`return\`, \`yield\`, \`import\`).
- Case-sensitive: \`data\`, \`Data\`, and \`DATA\` represent three separate variables.

> **Warning:** Mixing tab characters and spaces causes an \`IndentationError\` at parse time. Configure your IDE to convert tabs to 4 spaces automatically.`,
        codeSnippets: [
            {
                language: 'python',
                title: 'Indentation & Keyword Inspection',
                code: `import keyword\n\nprint("Reserved Python Keywords count:", len(keyword.kwlist))\nprint("First 10 keywords:", keyword.kwlist[:10])\n\n# 4-space indented block\nfor i in range(3):\n    print(f"Indented step: {i}")`
            }
        ],
        aiSummary: {
            summary: 'Python uses 4 spaces of indentation to denote scope instead of curly braces. Identifiers cannot start with digits or use reserved keywords.',
            keyConcepts: ['4-space Indentation Rule', 'Identifier Naming Constraints', 'Reserved Keywords', 'Tab vs Space Discipline'],
            revisionNotes: 'Never use keywords like `class`, `def`, or `return` as variable identifiers.'
        }
    },

    "1-4": {
        content: `### 1.5 Comments and Documentation
Comments clarify code intent for fellow engineers and automated parsers:
- **Single-line:** Prefixed by the hash symbol (\`#\`).
- **Inline Comment:** Placed at the end of an executable statement.
- **Docstrings:** Triple-quoted strings (\`"""..."""\`) as the first statement of a module, class, or function.

\`\`\`python
def calculate_tax(amount: float, rate: float = 0.18) -> float:
    """Calculate and return the GST tax amount."""
    return round(amount * rate, 2)

print(calculate_tax.__doc__)
\`\`\`

### 1.6 Dynamic User Input
The built-in \`input(prompt)\` reads standard input (stdin) as a **string**:
\`\`\`python
user_name = input("Enter your name: ")
age_raw = input("Enter your age: ")
age = int(age_raw)  # Explicit casting required for arithmetic!
print(f"Welcome {user_name}, next year you will be {age + 1}.")
\`\`\`

### 1.7 Command-Line Arguments via \`sys.argv\`
Arguments passed when invoking a script from the terminal are available in \`sys.argv\`:
- \`sys.argv[0]\`: The script file path.
- \`sys.argv[1:]\`: User-supplied command-line flags and parameters.`,
        codeSnippets: [
            {
                language: 'python',
                title: 'Docstring & Type Conversion Demo',
                code: `def greet(name: str, score: int = 100):\n    """Formatted greeting generator."""\n    return f"Player {name.upper()}: Score = {score}"\n\nprint(greet.__doc__)\nprint(greet("Asha", 98))`
            }
        ],
        aiSummary: {
            summary: 'Comments explain code, docstrings power introspection, and input() reads console input as a string requiring type casting.',
            keyConcepts: ['# Single-line Comments', 'Triple-quoted Docstrings (__doc__)', 'input() string return type', 'sys.argv CLI arguments'],
            revisionNotes: 'Always wrap numeric user input in int() or float() before performing math calculations.'
        }
    },

    "1-5": {
        content: `### 1.8 Dynamic Variables & Memory References
In Python, variables are **labels (pointers)** bound to objects allocated on the runtime heap.
- Assigning \`x = 10\` creates an integer object \`10\` in memory and points \`x\` to its memory address (\`id(x)\`).
- Reassigning \`x = "Hi"\` does not mutate \`10\`; it rebinds \`x\` to a new string object.

\`\`\`python
a = 10
b = 10
print(id(a) == id(b))  # True due to small integer caching (-5 to 256)
\`\`\`

### 1.9 Built-in Core Data Types
| Category | Type | Mutability | Example |
| :--- | :--- | :--- | :--- |
| **Numeric** | \`int\`, \`float\`, \`complex\` | Immutable | \`42\`, \`3.14\`, \`2 + 3j\` |
| **Sequence** | \`str\`, \`list\`, \`tuple\` | \`str\`/\`tuple\` (Immutable), \`list\` (Mutable) | \`"code"\`, \`[1, 2]\`, \`(1, 2)\` |
| **Mapping** | \`dict\` | Mutable | \`{"id": 101, "role": "admin"}\` |
| **Set** | \`set\`, \`frozenset\` | \`set\` (Mutable), \`frozenset\` (Immutable) | \`{1, 2, 3}\` |
| **Boolean** | \`bool\` | Immutable | \`True\`, \`False\` |
| **Null** | \`NoneType\` | Immutable | \`None\` |

### 1.10 Advanced String Manipulation
Strings are ordered immutable sequences of Unicode characters:
\`\`\`python
s = "Python Mastery"
print(s[0], s[-1])     # 'P', 'y' (Indexing)
print(s[0:6])          # 'Python' (Slicing)
print(s[::-1])         # 'yretsaM nohtyP' (Reverse)
print(s.replace("P", "J")) # Returns new string "Jython Mastery"
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Data Types, Identity & Slicing',
                code: `name = "Python"\nversion = 3.12\nis_active = True\ntags = ["core", "backend", "ai"]\n\nprint(f"Type of name: {type(name).__name__}")\nprint(f"Reversed string: {name[::-1]}")\nprint(f"Memory Address of name: {hex(id(name))}")`
            }
        ],
        aiSummary: {
            summary: 'Variables are pointers bound to heap objects. Python offers integers, floats, strings, lists, tuples, dicts, sets, and booleans.',
            keyConcepts: ['Variables as Object Pointers', 'Mutable vs Immutable Types', 'Small Integer Caching', 'String Slicing [start:stop:step]'],
            revisionNotes: 'Strings and tuples are immutable. In-place modification methods return new objects rather than mutating the original.'
        }
    },

    "1-6": {
        content: `### 1.11 Numeric Types & Arithmetic Operators
Python provides arbitrary precision for integers (no 32-bit or 64-bit overflow) and standard IEEE 754 double-precision floats:

| Operator | Operation | Example | Output |
| :--- | :--- | :--- | :--- |
| \`+\` / \`-\` | Addition / Subtraction | \`10 + 4\` | \`14\` |
| \`*\` | Multiplication | \`6 * 7\` | \`42\` |
| \`/\` | True Float Division | \`7 / 2\` | \`3.5\` |
| \`//\` | Floor / Integer Division | \`7 // 2\` | \`3\` |
| \`%\` | Modulo / Remainder | \`7 % 2\` | \`1\` |
| \`**\` | Exponentiation (Power) | \`2 ** 8\` | \`256\` |

### 1.12 Math Library & Random Generation
\`\`\`python
import math
import random

print(math.sqrt(64))         # 8.0
print(math.ceil(4.2))        # 5
print(math.floor(4.9))       # 4
print(math.gcd(48, 18))      # 6

# Secure random choices
roll = random.randint(1, 6)  # Random integer from 1 to 6 inclusive
\`\`\`

> **Key Rule:** Operator precedence follows standard PEMDAS: Parentheses \`()\` > Exponentiation \`**\` > Multiplication/Division \`*\`, \`/\`, \`//\`, \`%\` > Addition/Subtraction \`+\`, \`-\`.`,
        codeSnippets: [
            {
                language: 'python',
                title: 'Math Module & Precision Calculations',
                code: `import math\n\nradius = 7.5\narea = math.pi * (radius ** 2)\nprint(f"Circle Area: {area:.2f}")\nprint(f"Ceiling: {math.ceil(area)}, Floor: {math.floor(area)}")`
            }
        ],
        aiSummary: {
            summary: 'Python supports arbitrary-precision integers, floats, arithmetic operators, and built-in math and random modules.',
            keyConcepts: ['Arbitrary Precision Ints', 'True Division vs Floor Division', 'math.ceil() & math.floor()', 'PEMDAS Precedence'],
            revisionNotes: 'Use round(val, 2) or formatted strings f"{val:.2f}" to control float decimal precision.'
        }
    },

    // ── MODULE 2: CONTROL STATEMENTS ──────────────────────────────────────────
    "2-1": {
        content: `### 2.1 Conditional Decisions in Python
Programs evaluate boolean conditions to choose between divergent execution paths. Python uses clean English keywords: \`if\`, \`elif\`, and \`else\`.

\`\`\`python
temperature = 32

if temperature > 35:
    print("Extreme Heat Warning")
elif temperature > 25:
    print("Warm and sunny")
elif temperature > 15:
    print("Mild pleasant weather")
else:
    print("Cold weather")
\`\`\`

### Comparison Operators in Python
| Operator | Name | Example | Evaluates To |
| :--- | :--- | :--- | :--- |
| **\`==\`** | Equal to | \`5 == 5\` | \`True\` |
| **\`!=\`** | Not equal to | \`5 != 3\` | \`True\` |
| **\`>\`** / **\`<\`** | Greater / Less than | \`10 > 20\` | \`False\` |
| **\`>=\`** / **\`<=\`** | Greater / Less or equal | \`18 >= 18\` | \`True\` |

### 2.2 Truthy and Falsy Evaluations
Every Python object inherently evaluates to either \`True\` or \`False\` in a boolean context:

| Category | Falsy Values (Evaluate to \`False\`) | Truthy Values (Evaluate to \`True\`) |
| :--- | :--- | :--- |
| **Numbers** | \`0\`, \`0.0\`, \`0j\` | Any non-zero number (\`1\`, \`-42\`, \`3.14\`) |
| **Strings** | \`""\` (empty string) | Any non-empty string (\`"hello"\`, \`" "\`) |
| **Collections** | \`[]\` (list), \`()\` (tuple), \`{}\` (dict), \`set()\` | Any non-empty container (\`[0]\`, \`{"k": "v"}\`) |
| **Special** | \`None\`, \`False\` | \`True\`, object instances |

\`\`\`python
cart = ["Laptop"]
if cart:  # Evaluates to True because list is non-empty
    print(f"Processing {len(cart)} items in checkout")
\`\`\`

### 2.3 Chained Comparisons & Ternary Expressions
- **Chained:** \`if 18 <= age < 65:\` (evaluates cleanly without needing \`and\`).
- **Ternary Operator:** \`status = "Eligible" if age >= 18 else "Minor"\`.`,
        codeSnippets: [
            {
                language: 'python',
                title: 'Conditional Branching & Ternary Operator',
                code: `marks = 84\n\ngrade = "A" if marks >= 90 else "B" if marks >= 75 else "C"\nprint(f"Student Marks: {marks} -> Grade: {grade}")\n\n# Truthiness check\nitems = []\nif not items:\n    print("Cart is currently empty")`
            }
        ],
        aiSummary: {
            summary: 'if, elif, and else evaluate sequential conditions. Python supports chained comparisons (18 <= age <= 60) and inline ternary expressions.',
            keyConcepts: ['Sequential Branching', 'Truthy vs Falsy Containers', 'Chained Comparisons', 'Ternary Conditional Operator'],
            revisionNotes: 'Never write "if x == True:"; simply write "if x:" to follow idiomatic Python PEP 8 conventions.'
        }
    },

    "2-2": {
        content: `### 2.3 The while Loop Mechanism
A \`while\` loop evaluates its condition before every cycle, executing the block repeatedly until the condition turns \`False\`:

\`\`\`python
count = 1
while count <= 5:
    print(f"Cycle #{count}")
    count += 1
\`\`\`

### 2.4 while-else Semantics
Unique to Python, loops can feature an \`else\` clause. The \`else\` block executes **only if the loop completes all iterations normally without hitting a \`break\` statement**:

| Execution Scenario | Condition State | Was \`break\` Hit? | Does \`else\` Block Run? |
| :--- | :--- | :--- | :--- |
| **Normal Completion** | Becomes \`False\` naturally | No | **Yes** |
| **Early Termination** | Loop aborted early | **Yes** | **No** (Skipped) |
| **Zero Iterations** | Initially \`False\` | No | **Yes** (Executes immediately) |

\`\`\`python
attempts = 0
authenticated = False

while attempts < 3:
    pwd = input("Enter pin: ")
    if pwd == "7421":
        print("Unlocked!")
        authenticated = True
        break
    attempts += 1
else:
    print("Account locked: 3 failed attempts.")
\`\`\`

> **Critical Safety:** Always ensure your loop body includes a state mutator (\`count += 1\`) that moves variables toward the termination condition to prevent infinite loops!`,
        codeSnippets: [
            {
                language: 'python',
                title: 'while Loop with while-else Validation',
                code: `num = 11\ndiv = 2\n\nwhile div < num:\n    if num % div == 0:\n        print(f"{num} is not prime (divisible by {div})")\n        break\n    div += 1\nelse:\n    print(f"{num} is a prime number!")`
            }
        ],
        aiSummary: {
            summary: 'while loops repeat while a condition holds True. The while-else block runs only if the loop terminates without encountering a break statement.',
            keyConcepts: ['Conditional Loop Cycle', 'Loop State Mutators', 'while-else Construct', 'Infinite Loop Prevention'],
            revisionNotes: 'The else block in while-else runs when condition becomes False, but skips if break is triggered.'
        }
    },

    "2-3": {
        content: `### 2.5 Iterating Sequences with for Loops
In Python, \`for\` loops iterate directly over members of any iterable object (lists, tuples, strings, ranges, dictionaries):

\`\`\`python
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print("Fruit:", fruit)

for char in "Hi!":
    print(char)
\`\`\`

### \`for\` Loop vs \`while\` Loop Comparison
| Dimension | \`for\` Loop | \`while\` Loop |
| :--- | :--- | :--- |
| **Primary Use Case** | Definite iteration over known sequences or ranges | Indefinite iteration waiting for condition to change |
| **Termination** | Exhausts all items in sequence automatically | Stops when boolean condition evaluates to \`False\` |
| **State Mutator** | Handled internally by iterator protocol | Requires explicit increment (\`count += 1\`) |
| **Infinite Loop Risk** | Extremely low (operates on finite bounds) | High if condition variable is not mutated |

### 2.6 The \`range()\` Sequence Generator
\`range(start, stop, step)\` generates integers lazily on demand up to, but excluding, \`stop\`:

| Variation | Syntax Example | Sequence Produced | Explanation |
| :--- | :--- | :--- | :--- |
| **Stop Only** | \`range(5)\` | \`0, 1, 2, 3, 4\` | Defaults start=0, step=1; stops at \`stop - 1\` |
| **Start & Stop** | \`range(2, 7)\` | \`2, 3, 4, 5, 6\` | Starts at \`start\`, stops at \`stop - 1\` |
| **Positive Step** | \`range(1, 10, 2)\` | \`1, 3, 5, 7, 9\` | Advances by \`step\` increments |
| **Negative Step** | \`range(10, 0, -2)\` | \`10, 8, 6, 4, 2\` | Decrements backwards toward lower bound |

\`\`\`python
# Accumulating sum with step
total = 0
for n in range(1, 101):
    total += n
print("Sum from 1 to 100:", total)  # 5050
\`\`\`

### 2.7 Nested Loops & Matrix Traversals
\`\`\`python
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
for row in matrix:
    for val in row:
        print(val, end=" ")
    print()
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'for Loop with range() & Step Calculations',
                code: `print("Even numbers descending from 10:")\nfor n in range(10, 0, -2):\n    print(n, end=" ")\nprint()\n\n# String iteration\nfor ch in "PYTHON":\n    print(f"Character: {ch}")`
            }
        ],
        aiSummary: {
            summary: 'for loops iterate directly over elements of any sequence or iterable. range(start, stop, step) generates arithmetic progressions lazily.',
            keyConcepts: ['Sequence Traversal', 'range() Start-Stop-Step', 'Lazy Memory Allocation', 'Nested Loop Traversals'],
            revisionNotes: 'Remember range(n) generates numbers from 0 up to n - 1 (the stop index is non-inclusive).'
        }
    },

    "2-4": {
        content: `### 2.8 Loop Control Statements
Python provides fine-grained control over execution flow within iterative blocks:

| Statement | Purpose | Behavior |
| :--- | :--- | :--- |
| **\`break\`** | Immediate exit | Aborts loop completely; skips the loop's \`else\` block |
| **\`continue\`** | Skip cycle | Skips remaining statements in current iteration; advances to next |
| **\`pass\`** | No-op placeholder | Syntactical placeholder for empty blocks without doing anything |
| **\`assert\`** | Invariant check | Raises \`AssertionError\` if boolean condition evaluates to \`False\` |
| **\`return\`** | Function exit | Exits the enclosing function and passes a value back to caller |

\`\`\`python
# Demonstration of break and continue
for num in range(1, 10):
    if num % 2 == 0:
        continue  # Skip even numbers
    if num > 7:
        break     # Exit when num exceeds 7
    print("Odd:", num)
\`\`\`

### 2.9 Using \`pass\` for Stubbing Architecture
\`\`\`python
def implement_later():
    pass  # Prevents IndentationError while building blueprints
\`\`\`

### 2.10 Defensive Invariant Checking with \`assert\`
\`\`\`python
def set_discount(percentage):
    assert 0 <= percentage <= 100, "Discount must be between 0 and 100"
    return f"Discount set to {percentage}%"
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'break, continue & assert In Action',
                code: `for i in range(1, 8):\n    if i == 3:\n        print("Skipping 3 (continue)")\n        continue\n    if i == 6:\n        print("Breaking at 6 (break)")\n        break\n    print(f"Value: {i}")\n\n# Assertion verification\nx = 25\nassert x > 0, "x must be positive"`
            }
        ],
        aiSummary: {
            summary: 'break exits a loop immediately, continue skips to the next cycle, pass serves as a no-op placeholder, and assert validates invariants.',
            keyConcepts: ['break Early Termination', 'continue Cycle Skipping', 'pass Syntax Placeholder', 'assert Invariant Verification'],
            revisionNotes: 'Using break inside a loop prevents any associated loop-else block from executing.'
        }
    },

    // ── MODULE 3: LISTS, RANGES AND TUPLES ────────────────────────────────────
    "3-1": {
        content: `### 3.1 Lists in Python: Ordered Dynamic Arrays
A \`list\` is a mutable, ordered sequence of heterogeneous elements backed by a dynamic array buffer:
\`\`\`python
fruits = ["apple", "banana", "cherry"]
fruits.append("orange")        # Add to end: O(1) amortized
fruits.insert(1, "blueberry")  # Insert at index: O(N)
fruits.remove("banana")        # Remove by value: O(N)
popped = fruits.pop()          # Remove last item: O(1)
\`\`\`

### 3.2 List Slicing & Strides
\`\`\`python
nums = [10, 20, 30, 40, 50, 60]
print(nums[1:4])   # [20, 30, 40]
print(nums[:3])    # [10, 20, 30]
print(nums[::2])   # [10, 30, 50] (every 2nd item)
print(nums[::-1])  # [60, 50, 40, 30, 20, 10] (reversed)
\`\`\`

### 3.3 Sorting & Reversing Operations
- \`nums.sort()\`: In-place mutation using Timsort ($O(N \log N)$), returns \`None\`.
- \`sorted(nums)\`: Returns a **new** sorted list without mutating the original.`,
        codeSnippets: [
            {
                language: 'python',
                title: 'List Operations & Timsort In-Place',
                code: `scores = [88, 42, 95, 71, 60]\nscores.append(100)\nscores.sort(reverse=True)\n\nprint("Top 3 scores:", scores[:3])\nprint("Total players:", len(scores))\nprint("Average:", sum(scores) / len(scores))`
            }
        ],
        aiSummary: {
            summary: 'Lists are mutable ordered sequences implemented as dynamic arrays. Elements can be added, removed, sliced, and sorted.',
            keyConcepts: ['Mutable Dynamic Array', 'Slicing [start:stop:step]', 'In-place .sort() vs sorted()', 'Amortized O(1) append()'],
            revisionNotes: 'list.sort() modifies the list in place and returns None; sorted(list) creates a brand new sorted list.'
        }
    },

    "3-2": {
        content: `### 3.4 The Shallow Copy Trap
In Python, assigning \`b = a\` creates a reference pointer to the same underlying list object in memory:
\`\`\`python
a = [1, 2, [3, 4]]
b = a              # Same reference!
b.append(5)
print(a)           # [1, 2, [3, 4], 5] -> Mutated!
\`\`\`

### Shallow Copy vs Deep Copy
- **Shallow Copy (\`copy.copy\` or \`a[:]\`):** Copies outer container, but inner nested objects remain shared references.
- **Deep Copy (\`copy.deepcopy\`):** Recursively clones all nested objects down the entire hierarchy.

\`\`\`python
import copy
original = [[1, 2], [3, 4]]
shallow = copy.copy(original)
deep = copy.deepcopy(original)

original[0][0] = 999
print(shallow[0][0])  # 999 (Nested list was shared!)
print(deep[0][0])     # 1 (Completely isolated copy)
\`\`\`

### 3.5 The \`enumerate()\` and \`zip()\` Helpers
\`\`\`python
names = ["Alice", "Bob", "Charlie"]
scores = [92, 85, 98]

for idx, name in enumerate(names, start=1):
    print(f"Rank {idx}: {name}")

for name, score in zip(names, scores):
    print(f"{name} -> {score}%")
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Deep Copy vs Shallow Copy & zip()',
                code: `import copy\n\nbase = ["admin", [80, 443]]\nclone = copy.deepcopy(base)\nclone[1].append(8080)\n\nprint("Base ports:", base[1])   # [80, 443]\nprint("Clone ports:", clone[1]) # [80, 443, 8080]`
            }
        ],
        aiSummary: {
            summary: 'Assignment copies object references. Shallow copies duplicate the container only, while deepcopy duplicates nested structures recursively.',
            keyConcepts: ['Reference Assignment', 'Shallow vs Deep Copy', 'enumerate() Index Traversal', 'zip() Parallel Iteration'],
            revisionNotes: 'Always use copy.deepcopy() when duplicating nested lists or complex configuration dictionaries.'
        }
    },

    "3-3": {
        content: `### 3.6 List Comprehensions
List comprehensions provide a concise, declarative syntax to transform and filter iterables:
\`\`\`python
# Syntax: [expression for item in iterable if condition]
squares = [x ** 2 for x in range(1, 11) if x % 2 == 0]
print(squares)  # [4, 16, 36, 64, 100]
\`\`\`

### 3.7 Generator Expressions & Memory Conservation
While list comprehensions allocate all items into RAM upfront, generator expressions use parentheses \`()\` and produce items **lazily on demand**:
\`\`\`python
# Allocates 10 million ints in RAM (~80MB)
list_comp = [x * 2 for x in range(10_000_000)]

# Allocates only a 112-byte generator state machine!
gen_expr = (x * 2 for x in range(10_000_000))
print(next(gen_expr))  # 0
print(next(gen_expr))  # 2
\`\`\`

### 3.8 Custom Generators with \`yield\`
The \`yield\` keyword suspends execution, preserving local state between calls:
\`\`\`python
def fibonacci(limit):
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b

for num in fibonacci(50):
    print(num, end=" ")
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Comprehensions vs Generators & yield',
                code: `def count_up(max_val):\n    n = 1\n    while n <= max_val:\n        yield n\n        n += 1\n\ngen = count_up(3)\nprint(next(gen))\nprint(next(gen))\nprint(next(gen))\n\n# Compact list comprehension\nfiltered = [x for x in range(10) if x % 3 == 0]\nprint("Multiples of 3:", filtered)`
            }
        ],
        aiSummary: {
            summary: 'List comprehensions transform iterables concisely. Generators use yield to emit values lazily, conserving significant memory.',
            keyConcepts: ['List Comprehension Syntax', 'Generator Expressions', 'yield State Preservation', 'Lazy Evaluation Mechanics'],
            revisionNotes: 'Use generator expressions over list comprehensions when processing massive datasets or unbounded data streams.'
        }
    },

    "3-4": {
        content: `### 3.9 Tuples: Immutable Sequences
A \`tuple\` is an ordered, immutable sequence of elements defined with parentheses \`()\`:
\`\`\`python
point = (10, 20)
rgb = (255, 128, 0)
singleton = (42,)  # Notice the trailing comma! Without it, it is just an integer
\`\`\`

### Why Use Tuples Instead of Lists?
1. **Immutability Protection:** Ensures write-protected constant data (e.g., coordinates, DB credentials).
2. **Hashability:** Tuples can be used as dictionary keys and set elements; lists cannot.
3. **Performance:** Tuples consume less memory and have faster allocation routines in CPython.

### 3.10 Tuple Unpacking & Star Operator (\`*\`)
\`\`\`python
record = ("Asha", "Engineer", 95000, "Pune")
name, role, salary, city = record

# Star unpacking (extended unpacking)
first, *middle, last = [1, 2, 3, 4, 5]
print(first)   # 1
print(middle)  # [2, 3, 4]
print(last)    # 5
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Tuple Unpacking & Star Operator',
                code: `credentials = ("db_admin", "prod_server", 5432)\nuser, host, port = credentials\nprint(f"Connecting to {host}:{port} as {user}")\n\n# Extended unpacking\nhead, *tail = [10, 20, 30, 40]\nprint(f"Head: {head}, Tail: {tail}")`
            }
        ],
        aiSummary: {
            summary: 'Tuples are immutable, hashable sequences. They prevent accidental mutation, optimize memory, and enable elegant pattern unpacking.',
            keyConcepts: ['Immutable Sequence', 'Singleton Tuple Trailing Comma', 'Hashable Dictionary Keys', 'Star (*) Tuple Unpacking'],
            revisionNotes: 'Single-item tuples must have a trailing comma: (42,) is a tuple, but (42) is just an integer in parentheses.'
        }
    }
};

