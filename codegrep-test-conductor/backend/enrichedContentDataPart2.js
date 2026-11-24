/**
 * Enriched Content Data Part 2
 * Covers Modules 4 through 8:
 * - Module 4: Dictionaries and Sets
 * - Module 5: Input and Output in Python
 * - Module 6: Functions, Modules and Packages
 * - Module 7: Object-Oriented Python
 * - Module 8: Exceptions
 */

module.exports = {
    // ── MODULE 4: DICTIONARIES AND SETS ───────────────────────────────────────
    "4-1": {
        content: `### 4.1 Python Dictionaries: Hash Map Architecture
A \`dict\` stores key-value pairs backed by a high-performance hash table with O(1) average time complexity for lookups, insertions, and deletions:
\`\`\`python
student = {
    "id": 101,
    "name": "Asha Sharma",
    "gpa": 3.9,
    "enrolled": True
}
\`\`\`

### Key Constraints: Hashability
Dictionary keys **must be immutable and hashable** (strings, integers, floats, tuples). Lists and dicts cannot be keys:
\`\`\`python
valid = {(1, 2): "Coordinate Point"}   # Valid (Tuple is hashable)
# invalid = {[1, 2]: "Point"}          # TypeError: unhashable type: 'list'
\`\`\`

### 4.2 Safe Access with \`.get()\` and Defaults
Accessing a missing key with bracket notation (\`student["age"]\`) raises a \`KeyError\`. Use \`.get()\` for graceful fallbacks:
\`\`\`python
age = student.get("age", 18)  # Returns 18 instead of crashing
print("Student Age:", age)
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Dictionary Manipulation & Safe Retrieval',
                code: `user = {"username": "coder99", "role": "admin"}\nuser["last_login"] = "2026-11-19"\n\nprint("Email:", user.get("email", "not_provided@domain.com"))\nprint("Keys:", list(user.keys()))\nprint("Values:", list(user.values()))`
            }
        ],
        aiSummary: {
            summary: 'Dictionaries are hash tables mapping hashable keys to values in O(1) time. Use .get() to prevent KeyError crashes on missing keys.',
            keyConcepts: ['Hash Table O(1) Performance', 'Key Hashability Requirement', 'Safe Lookup with .get()', 'KeyError Mitigation'],
            revisionNotes: 'Only immutable types (str, int, float, tuple) can serve as dictionary keys; lists and sets cannot.'
        }
    },

    "4-2": {
        content: `### 4.3 Essential Dictionary Methods
- \`.keys()\`, \`.values()\`, \`.items()\`: Return dynamic dictionary view objects.
- \`.update(other_dict)\`: Merges another dictionary or key-value iterable.
- \`.pop(key, default)\`: Removes key and returns its value.
- \`| \` Operator (Python 3.9+): Clean dictionary union syntax (\`dict1 | dict2\`).

\`\`\`python
defaults = {"theme": "dark", "fontSize": 14, "autoSave": True}
user_prefs = {"fontSize": 16, "wordWrap": True}

merged = defaults | user_prefs
print(merged)
\`\`\`

### 4.4 Dictionary Comprehensions
\`\`\`python
names = ["Alice", "Bob", "Charlie"]
name_lengths = {name: len(name) for name in names if len(name) > 3}
print(name_lengths)  # {'Alice': 5, 'Charlie': 7}

# Swapping keys and values
lookup = {v: k for k, v in name_lengths.items()}
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Dictionary Comprehension & Python 3.9 Union (|)',
                code: `base_config = {"env": "prod", "retries": 3}\noverrides = {"retries": 5, "debug": False}\n\nconfig = base_config | overrides\nprint("Active Config:", config)\n\nsquares = {n: n ** 2 for n in range(1, 6)}\nprint("Squares Dict:", squares)`
            }
        ],
        aiSummary: {
            summary: 'Dictionaries support view objects (.items()), union operations (| in 3.9+), and declarative dictionary comprehensions.',
            keyConcepts: ['.items() View Traversal', 'Dict Union Operator (|)', 'Dictionary Comprehension', '.pop() and .update()'],
            revisionNotes: 'dict.items() provides dynamic key-value tuples without creating redundant list copies in memory.'
        }
    },

    "4-3": {
        content: `### 4.5 Sets: Unordered Unique Collections
A \`set\` is an unordered, mutable collection of unique, hashable elements:
\`\`\`python
tags = {"python", "ai", "backend", "python"}
print(tags)  # Duplicate 'python' is eliminated automatically!
\`\`\`

### Instant Deduplication
\`\`\`python
raw_ids = [101, 102, 101, 105, 102, 107]
unique_ids = list(set(raw_ids))
print("Unique IDs:", unique_ids)
\`\`\`

### 4.6 Core Set Mutators
- \`.add(elem)\`: Inserts an element (O(1)).
- \`.remove(elem)\`: Removes element; raises \`KeyError\` if absent.
- \`.discard(elem)\`: Removes element safely without raising an error if absent.`,
        codeSnippets: [
            {
                language: 'python',
                title: 'Set Deduplication & Safe Discard',
                code: `skills = {"Python", "SQL", "Docker"}\nskills.add("Kubernetes")\nskills.discard("Java") # Safe: does not crash if missing\n\nprint("Skills count:", len(skills))\nprint("Contains SQL?", "SQL" in skills)`
            }
        ],
        aiSummary: {
            summary: 'Sets enforce element uniqueness and provide O(1) membership testing using hashing. discard() removes items without throwing errors.',
            keyConcepts: ['Automatic Deduplication', 'O(1) Membership Testing', '.discard() vs .remove()', 'Unordered Hashing'],
            revisionNotes: 'To create an empty set, use set(), because {} creates an empty dictionary.'
        }
    },

    "4-4": {
        content: `### 4.7 Mathematical Set Operations
Python sets support direct mathematical set theory operations:

| Operation | Method | Operator | Meaning |
| :--- | :--- | :--- | :--- |
| **Union** | \`a.union(b)\` | \`a \| b\` | Elements in either \`a\` or \`b\` |
| **Intersection** | \`a.intersection(b)\` | \`a & b\` | Elements in both \`a\` and \`b\` |
| **Difference** | \`a.difference(b)\` | \`a - b\` | Elements in \`a\` but not in \`b\` |
| **Symmetric Diff** | \`a.symmetric_difference(b)\` | \`a ^ b\` | Elements in either, but not both |

\`\`\`python
devs_frontend = {"HTML", "CSS", "JS", "TypeScript"}
devs_backend = {"Python", "SQL", "Docker", "TypeScript"}

both = devs_frontend & devs_backend  # {'TypeScript'}
all_skills = devs_frontend | devs_backend
only_frontend = devs_frontend - devs_backend
\`\`\`

### 4.8 The \`frozenset\` Immutable Set
A \`frozenset\` is an immutable set. Because it is immutable, it is hashable and can be used as a dictionary key:
\`\`\`python
frozen = frozenset([1, 2, 3])
# frozen.add(4) -> AttributeError
mapping = {frozen: "Allowed Group"}
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Mathematical Set Theory & frozenset',
                code: `team_a = {"Python", "Git", "Linux"}\nteam_b = {"Linux", "AWS", "Terraform"}\n\nprint("Shared skills (&):", team_a & team_b)\nprint("All skills (|):", team_a | team_b)\nprint("Unique to Team A (-):", team_a - team_b)\n\n# frozenset\nkey = frozenset(["read", "write"])\nperms = {key: "Admin Access"}\nprint(perms)`
            }
        ],
        aiSummary: {
            summary: 'Sets support union (|), intersection (&), difference (-), and symmetric difference (^). frozenset provides an immutable, hashable variant.',
            keyConcepts: ['Set Theory Operators (&, |, -, ^)', 'frozenset Immutability', 'Hashable Set Keys', 'Disjoint & Subset Methods'],
            revisionNotes: 'frozenset is the only set type that can be used as a dictionary key or placed inside another set.'
        }
    },

    // ── MODULE 5: INPUT AND OUTPUT IN PYTHON ──────────────────────────────────
    "5-1": {
        content: `### 5.1 File Handling Architecture
Python interacts with the host filesystem via the built-in \`open(filepath, mode)\` function.
Modes: \`'r'\` (read default), \`'w'\` (write/truncate), \`'a'\` (append), \`'x'\` (exclusive creation), \`'b'\` (binary), \`'+'\` (read/write).

### 5.2 Context Managers: The \`with\` Statement
Always open files using the \`with\` statement. It ensures that the file descriptor is **automatically closed**, even if exceptions are thrown:
\`\`\`python
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()  # Entire file into memory
\`\`\`

### 5.3 Memory-Efficient Line-by-Line Streaming
Avoid reading giant multi-gigabyte files into RAM with \`.read()\`. Stream line-by-line:
\`\`\`python
with open("large_log.txt", "r", encoding="utf-8") as f:
    for line in f:  # Lazy generator iteration: O(1) RAM!
        if "ERROR" in line:
            print("Alert:", line.strip())
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Context Manager File Reading & In-Memory Sim',
                code: `import io\n\n# Simulating file reading using io.StringIO\nvirtual_file = io.StringIO("Line 1: System Boot\\nLine 2: Server Listening\\nLine 3: OK\\n")\n\nfor line_no, line in enumerate(virtual_file, start=1):\n    print(f"[{line_no}] {line.strip()}")`
            }
        ],
        aiSummary: {
            summary: 'File I/O uses open(). Context managers (with open()) guarantee deterministic resource cleanup. Iterating lines lazily conserves RAM.',
            keyConcepts: ['open() Modes (r, w, a, b)', 'Context Manager (with open())', 'Lazy Line Iteration', 'Encoding Discipline (utf-8)'],
            revisionNotes: 'Always specify encoding="utf-8" explicitly to prevent platform-dependent encoding bugs between Windows and Linux.'
        }
    },

    "5-2": {
        content: `### 5.4 Writing and Appending Files
- \`mode='w'\`: Overwrites or creates the file from scratch (truncating existing content).
- \`mode='a'\`: Preserves existing content and appends new data to the end.

\`\`\`python
records = ["Report Header", "Transaction: #4912", "Status: Settled"]

with open("transactions.log", "w", encoding="utf-8") as f:
    for line in records:
        f.write(line + "\\n")
\`\`\`

### 5.5 Atomic Writes & Buffer Flushing
Python buffers file writes in RAM for I/O efficiency:
- \`f.flush()\`: Forces buffered writes down to the operating system immediately.
- \`os.fsync(f.fileno())\`: Forces the OS disk controller to commit physical writes.`,
        codeSnippets: [
            {
                language: 'python',
                title: 'Buffered Writing with io.StringIO',
                code: `import io\n\nbuffer = io.StringIO()\nbuffer.write("User: Alice\\n")\nbuffer.write("Action: Checkout\\n")\nbuffer.seek(0) # Rewind to start\n\nprint("Written Content:")\nprint(buffer.read())`
            }
        ],
        aiSummary: {
            summary: 'Write files with mode "w" (overwrite) or "a" (append). Python buffers disk writes for performance, flushed on close or flush().',
            keyConcepts: ['Write vs Append Modes', 'Newline Formatting (\\n)', 'Buffer Flushing (.flush())', 'Atomic File Operations'],
            revisionNotes: 'Using mode="w" destroys all prior file contents instantly without confirmation. Use mode="a" for logs.'
        }
    },

    "5-3": {
        content: `### 5.6 Structured Data: JSON Processing
The standard library \`json\` module converts between Python structures and JSON text:
- \`json.dumps(obj)\`: Serializes Python object into a JSON string.
- \`json.loads(str)\`: Deserializes JSON string into a Python object.
- \`json.dump(obj, file)\`: Writes serialized JSON directly into a file.
- \`json.load(file)\`: Reads and deserializes JSON directly from a file.

\`\`\`python
import json

payload = {
    "server": "us-east-1",
    "ports": [80, 443],
    "ssl": True
}

json_str = json.dumps(payload, indent=2)
print(json_str)

parsed = json.loads(json_str)
print("SSL Enabled?", parsed["ssl"])
\`\`\`

### 5.7 Tabular Data with \`csv\`
\`\`\`python
import csv

data = [["ID", "Name", "Score"], [1, "Asha", 95], [2, "Vikram", 88]]
with open("students.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerows(data)
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'JSON Serialization & Deserialization',
                code: `import json\n\nuser_data = {\n    "name": "Alex",\n    "roles": ["developer", "reviewer"],\n    "active": True\n}\n\nencoded = json.dumps(user_data, indent=4)\nprint("JSON String:\\n", encoded)\n\ndecoded = json.loads(encoded)\nprint("Extracted roles:", decoded["roles"])`
            }
        ],
        aiSummary: {
            summary: 'The json module handles serialization (dumps/dump) and deserialization (loads/load). The csv module provides robust tabular row parsing.',
            keyConcepts: ['json.dumps vs json.dump', 'json.loads vs json.load', 'csv.reader & csv.writer', 'newline="" parameter in CSV'],
            revisionNotes: 'When opening files for csv.writer on Windows, always pass newline="" to avoid duplicate blank lines.'
        }
    },

    "5-4": {
        content: `### 5.8 Binary Data & The \`pickle\` Module
Binary mode (\`'rb'\`, \`'wb'\`) reads and writes raw byte sequences rather than decoded characters:
\`\`\`python
with open("image.png", "rb") as f:
    header = f.read(8) # Read first 8 magic bytes
\`\`\`

### Object Serialization with \`pickle\`
\`pickle\` serializes arbitrary Python objects (including custom class instances) into a binary bytecode stream:
\`\`\`python
import pickle

data = {"weights": [0.24, 0.88, 0.12], "model": "LinearRegressor"}

# Serialize to bytes
serialized = pickle.dumps(data)

# Deserialize from bytes
restored = pickle.loads(serialized)
print("Restored model:", restored["model"])
\`\`\`

> **Security Warning:** **Never unpickle data from untrusted or unauthenticated sources.** Malicious pickle payloads can execute arbitrary operating system shell commands during deserialization!`,
        codeSnippets: [
            {
                language: 'python',
                title: 'Pickle Binary Serialization Demonstration',
                code: `import pickle\n\ncomplex_state = {"timestamp": 1700000000, "coords": (12.97, 77.59)}\nbyte_stream = pickle.dumps(complex_state)\n\nprint("Serialized byte count:", len(byte_stream))\nprint("First 16 bytes:", byte_stream[:16])\n\nrecovered = pickle.loads(byte_stream)\nprint("Recovered State:", recovered)`
            }
        ],
        aiSummary: {
            summary: 'Binary file modes operate on bytes. pickle provides native Python object serialization, but carries remote code execution security risks.',
            keyConcepts: ['Binary Mode (rb, wb)', 'pickle.dumps() & pickle.loads()', 'Custom Object Serialization', 'Pickle Insecurity & Exploits'],
            revisionNotes: 'Never unpickle untrusted user inputs from web requests; use JSON or Protocol Buffers for secure external APIs.'
        }
    },

    // ── MODULE 6: FUNCTIONS, MODULES AND PACKAGES ─────────────────────────────
    "6-1": {
        content: `### 6.1 Function Definition & Call Semantics
Functions encapsulate reusable logic blocks. Defined with the \`def\` keyword:
\`\`\`python
def calculate_bmi(weight_kg: float, height_m: float) -> float:
    """Calculate Body Mass Index rounded to 2 decimal places."""
    return round(weight_kg / (height_m ** 2), 2)

result = calculate_bmi(70, 1.75)
print("BMI:", result)
\`\`\`

### 6.2 Default Parameter Values
Parameters with defaults must follow positional parameters without defaults:
\`\`\`python
def send_email(recipient, subject="No Subject", priority=1):
    print(f"Sending to {recipient}: [{subject}] (Priority {priority})")

send_email("dev@higenlabs.in")
send_email("ceo@higenlabs.in", "Q4 Growth", priority=5)
\`\`\`

> **Critical Trap:** Never use mutable default arguments (like \`def add_item(item, list=[])\`). Default arguments are evaluated **once at function definition time**, causing the list to persist and mutate across all subsequent invocations!`,
        codeSnippets: [
            {
                language: 'python',
                title: 'Functions & The Mutable Default Argument Trap',
                code: `# Safe default pattern using None\ndef append_safe(item, container=None):\n    if container is None:\n        container = []\n    container.append(item)\n    return container\n\nprint("Call 1:", append_safe("A"))\nprint("Call 2:", append_safe("B"))  # Clean and isolated!`
            }
        ],
        aiSummary: {
            summary: 'Functions encapsulate logic with def and return. Never use mutable defaults (list=[]); use None as sentinel default instead.',
            keyConcepts: ['def & return Syntax', 'Type Annotations (PEP 484)', 'Positional vs Keyword Arguments', 'Mutable Default Argument Trap'],
            revisionNotes: 'Always use None as default for mutable containers, initializing them inside the function body.'
        }
    },

    "6-2": {
        content: `### 6.3 Variadic Arguments: \`*args\` and \`**kwargs\`
- **\`*args\`:** Packs variable positional arguments into a **tuple**.
- **\`**kwargs\`:** Packs variable keyword arguments into a **dictionary**.

\`\`\`python
def log_event(event_type, *args, **kwargs):
    print(f"Event: {event_type}")
    print(f"Positional details ({len(args)}):", args)
    print(f"Keyword metadata ({len(kwargs)}):", kwargs)

log_event("USER_SIGNUP", "192.168.1.1", "Chrome", user_id=4201, plan="PRO")
\`\`\`

### 6.4 Keyword-Only and Positional-Only Parameters
- **\`/\` (Positional-only):** Arguments preceding \`/\` cannot be passed by keyword.
- **\`*\` (Keyword-only):** Arguments succeeding \`*\` must be passed by keyword.

\`\`\`python
def connect(host, port, /, *, timeout=30, retry=True):
    print(f"Connecting to {host}:{port} (timeout={timeout})")

connect("localhost", 5432, timeout=60) # Valid
# connect(host="localhost", port=5432)  # TypeError: positional-only argument
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: '*args and **kwargs Packing & Unpacking',
                code: `def build_query(table, *columns, **filters):\n    cols_str = ", ".join(columns) if columns else "*"\n    where_clauses = [f"{k} = '{v}'" for k, v in filters.items()]\n    where_str = " WHERE " + " AND ".join(where_clauses) if where_clauses else ""\n    return f"SELECT {cols_str} FROM {table}{where_str}"\n\nprint(build_query("users", "id", "email", status="active", role="admin"))`
            }
        ],
        aiSummary: {
            summary: '*args captures variadic positional arguments into a tuple. **kwargs captures keyword arguments into a dictionary.',
            keyConcepts: ['*args Tuple Packing', '**kwargs Dict Packing', 'Positional-only Marker (/)', 'Keyword-only Marker (*)'],
            revisionNotes: 'Parameter ordering rule: standard positional -> positional-only (/) -> *args -> keyword-only (*) -> **kwargs.'
        }
    },

    "6-3": {
        content: `### 6.5 Variable Scopes & The LEGB Rule
When Python looks up a variable identifier, it searches through scopes in strict sequence:
1. **L (Local):** Defined inside the current function.
2. **E (Enclosing):** Defined in outer enclosing parent functions (closures).
3. **G (Global):** Defined at module top-level (\`__main__\`).
4. **B (Built-in):** Built-in namespace (\`len\`, \`range\`, \`print\`, \`Exception\`).

\`\`\`python
x = "GLOBAL"

def outer():
    x = "ENCLOSING"
    def inner():
        x = "LOCAL"
        print("Inner x:", x) # Resolves to "LOCAL"
    inner()
    print("Outer x:", x)     # Resolves to "ENCLOSING"

outer()
\`\`\`

### 6.6 The \`global\` and \`nonlocal\` Keywords
- **\`global x\`:** Binds assignments inside a function to the module-level variable.
- **\`nonlocal x\`:** Binds assignments to the nearest enclosing parent function's variable.

### 6.7 Anonymous Lambda Functions
\`lambda arguments: expression\` creates small inline throwaway functions:
\`\`\`python
square = lambda x: x ** 2
pairs = [(1, "one"), (3, "three"), (2, "two")]
pairs.sort(key=lambda item: item[1]) # Sort by name alphabetically
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'nonlocal Closures & Lambda Functions',
                code: `def make_counter(start=0):\n    count = start\n    def counter():\n        nonlocal count\n        count += 1\n        return count\n    return counter\n\nc = make_counter(10)\nprint("Tick:", c())\nprint("Tick:", c())\n\n# Lambda sorting\nstudents = [("Asha", 92), ("Rohan", 78), ("Vikram", 85)]\nstudents.sort(key=lambda s: s[1], reverse=True)\nprint("Ranked:", students)`
            }
        ],
        aiSummary: {
            summary: 'Variable lookup follows LEGB (Local, Enclosing, Global, Built-in). nonlocal mutates closure scope; lambdas define short inline expressions.',
            keyConcepts: ['LEGB Resolution Order', 'global Keyword', 'nonlocal Closure Mutation', 'lambda Anonymous Functions'],
            revisionNotes: 'Lambdas are limited to a single expression and cannot contain return, pass, or multiple statements.'
        }
    },

    "6-4": {
        content: `### 6.8 Function Decorators
A decorator is a higher-order function that takes a function as input, extends its behavior, and returns an enhanced wrapper function without mutating original code:

\`\`\`python
import time

def timing_decorator(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        print(f"[{func.__name__}] executed in {elapsed:.4f}s")
        return result
    return wrapper

@timing_decorator
def intensive_calculation():
    return sum(i ** 2 for i in range(100_000))

intensive_calculation()
\`\`\`

### 6.9 Preserving Metadata with \`functools.wraps\`
Always decorate the wrapper with \`@functools.wraps(func)\` to preserve original \`__name__\` and \`__doc__\` docstrings!

### 6.10 Recursion & Base Conditions
\`\`\`python
def factorial(n):
    if n <= 1:  # Base condition
        return 1
    return n * factorial(n - 1)
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Decorator with functools.wraps',
                code: `import functools\n\ndef logger(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        print(f"[LOG] Calling {func.__name__} with args={args}")\n        return func(*args, **kwargs)\n    return wrapper\n\n@logger\ndef multiply(a, b):\n    """Multiplies two numbers."""\n    return a * b\n\nprint("Result:", multiply(6, 7))\nprint("Docstring preserved:", multiply.__doc__)`
            }
        ],
        aiSummary: {
            summary: 'Decorators wrap functions to dynamically inject logging, caching, or auth. functools.wraps preserves function docstrings and names.',
            keyConcepts: ['Higher-Order Functions', '@decorator Syntax Sugar', 'functools.wraps Utility', 'Recursion & Base Cases'],
            revisionNotes: 'Always include @functools.wraps(func) inside custom decorators to prevent function introspection tools from breaking.'
        }
    },

    "6-5": {
        content: `### 6.11 Python Modules & Imports
Any \`.py\` file is a module. Import mechanisms:
\`\`\`python
import math               # Access via math.sqrt
from math import pi, sqrt # Direct namespace import
import numpy as np        # Module alias
\`\`\`

### 6.12 The \`if __name__ == '__main__':\` Guard
When a Python file executes directly from the CLI, its internal \`__name__\` is set to \`"__main__"\`. When imported as a module by another file, \`__name__\` is set to the module's filename:
\`\`\`python
def compute():
    return 42

if __name__ == "__main__":
    # Only executes when run directly via python file.py
    print("Standalone test run:", compute())
\`\`\`

### 6.13 Packages & \`__init__.py\`
A directory containing an \`__init__.py\` file is treated by Python as an importable **package**.`,
        codeSnippets: [
            {
                language: 'python',
                title: '__name__ Execution Guard Demo',
                code: `def service_health():\n    return {"status": "healthy", "uptime_hours": 128}\n\nif __name__ == "__main__":\n    print("Direct invocation detected.")\n    print(service_health())\nelse:\n    print("Module imported by an external script.")`
            }
        ],
        aiSummary: {
            summary: 'Python modules are .py files. if __name__ == "__main__" protects executable scripts from unintended execution when imported.',
            keyConcepts: ['Module Imports & Aliases', '__name__ == "__main__" Guard', 'Package Structure & __init__.py', 'pip Package Management'],
            revisionNotes: 'Always wrap script execution logic inside if __name__ == "__main__": to keep modules reusable and testable.'
        }
    },

    // ── MODULE 7: OBJECT-ORIENTED PYTHON ──────────────────────────────────────
    "7-1": {
        content: `### 7.1 Object-Oriented Paradigm Foundations
OOP models real-world business entities as **classes** (blueprints) and **objects** (concrete instances):
- **Encapsulation:** Grouping state (attributes) and behavior (methods) together.
- **Abstraction:** Hiding internal implementation complexity.
- **Inheritance:** Deriving specialized classes from base classes.
- **Polymorphism:** Uniform interfaces across differing concrete types.

\`\`\`python
class BankAccount:
    def __init__(self, account_holder, initial_balance=0.0):
        self.holder = account_holder
        self.balance = initial_balance

    def deposit(self, amount):
        if amount > 0:
            self.balance += amount
            return self.balance
        raise ValueError("Deposit must be positive")
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Class Blueprint & Object Instantiation',
                code: `class Server:\n    def __init__(self, hostname, ip_address):\n        self.hostname = hostname\n        self.ip_address = ip_address\n        self.is_running = False\n\n    def start(self):\n        self.is_running = True\n        print(f"[{self.hostname}] Server online at {self.ip_address}")\n\ns1 = Server("api-prod-01", "10.0.1.15")\ns1.start()`
            }
        ],
        aiSummary: {
            summary: 'OOP organizes programs into classes and objects. Encapsulation binds attributes and methods within cohesive state machines.',
            keyConcepts: ['Class Blueprint vs Instance', 'Encapsulation & State', 'Methods and Attributes', 'Instantiation Syntax'],
            revisionNotes: 'Classes are blueprints; creating an instance allocates a dedicated __dict__ for that object in memory.'
        }
    },

    "7-2": {
        content: `### 7.2 The Role of \`self\`
In Python, \`self\` explicitly passes the reference of the current object instance into instance methods:
\`\`\`python
class Car:
    def drive(self):
        print(f"Driving car at address {hex(id(self))}")

c = Car()
c.drive()  # Translated internally to: Car.drive(c)
\`\`\`

### 7.3 Dunder (Magic) Methods
- **\`__init__(self, ...)\`:** Constructor initializer called upon instance creation.
- **\`__str__(self)\`:** User-friendly informal string representation for \`print()\`.
- **\`__repr__(self)\`:** Developer-friendly unambiguous string representation for debugging.
- **\`__len__(self)\`:** Enables \`len(obj)\` on custom objects.

\`\`\`python
class Book:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages

    def __str__(self):
        return f"'{self.title}' ({self.pages} pages)"

    def __len__(self):
        return self.pages
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: '__str__, __repr__ and __len__ Dunder Methods',
                code: `class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    def __repr__(self):\n        return f"Point({self.x}, {self.y})"\n\n    def __str__(self):\n        return f"({self.x}, {self.y})"\n\np = Point(3, 4)\nprint("str output:", str(p))\nprint("repr output:", repr(p))`
            }
        ],
        aiSummary: {
            summary: 'self refers to the current instance. Dunder methods like __init__, __str__, and __repr__ hook into core Python operations.',
            keyConcepts: ['Explicit self Parameter', '__init__ Constructor', '__str__ vs __repr__', 'Operator Overloading Dunders'],
            revisionNotes: '__str__ is for end-user output via print(), while __repr__ should return unambiguous code for developers.'
        }
    },

    "7-3": {
        content: `### 7.4 Instance Variables vs Class Variables
- **Instance Variables:** Bound to \`self\`. Unique to each individual object.
- **Class Variables:** Defined inside the class body outside any method. Shared by **all** instances of that class.

\`\`\`python
class Employee:
    # Class variable: shared across all instances
    company_name = "HiGen Labs"
    total_employees = 0

    def __init__(self, name):
        self.name = name  # Instance variable
        Employee.total_employees += 1

e1 = Employee("Asha")
e2 = Employee("Vikram")
print("Total:", Employee.total_employees)  # 2
\`\`\`

> **Trap:** Mutating a class variable via \`self.company_name = "New"\` shadows the class variable by creating an instance variable on that specific object! Always modify class variables via the class name: \`Employee.company_name = "New"\`.`,
        codeSnippets: [
            {
                language: 'python',
                title: 'Class Variables vs Instance Variables',
                code: `class Counter:\n    shared_count = 0\n\n    def __init__(self, label):\n        self.label = label\n        Counter.shared_count += 1\n\na = Counter("Alpha")\nb = Counter("Beta")\nprint(f"Alpha label: {a.label}")\nprint(f"Total instances created: {Counter.shared_count}")`
            }
        ],
        aiSummary: {
            summary: 'Instance variables are unique per object; class variables are shared across all instances. Modify class variables through the Class identifier.',
            keyConcepts: ['Instance State (self.var)', 'Class State (Class.var)', 'Namespace Shadowing Trap', 'Instance Counter Pattern'],
            revisionNotes: 'Always modify class variables directly via ClassName.var to avoid creating accidental instance attribute shadows.'
        }
    },

    "7-4": {
        content: `### 7.5 Types of Methods in Python
1. **Instance Method:** Receives \`self\`. Reads/mutates instance and class state.
2. **Class Method (\`@classmethod\`):** Receives \`cls\`. Operates on class state; great for alternative factory constructors.
3. **Static Method (\`@staticmethod\`):** Receives no automatic instance or class reference. Pure utility function scoped under the class namespace.

\`\`\`python
class Date:
    def __init__(self, year, month, day):
        self.year, self.month, self.day = year, month, day

    @classmethod
    def from_string(cls, date_str): # Factory constructor
        y, m, d = map(int, date_str.split("-"))
        return cls(y, m, d)

    @staticmethod
    def is_valid_year(year):
        return 1900 <= year <= 2100

d = Date.from_string("2026-11-19")
print("Year:", d.year)
\`\`\`

### 7.6 Access Control Conventions
- **Public:** \`self.name\`
- **Protected:** \`self._internal\` (Convention: internal use only)
- **Private:** \`self.__secret\` (Name-mangled to \`_ClassName__secret\`)`,
        codeSnippets: [
            {
                language: 'python',
                title: 'Classmethod Factory & Static Utility Method',
                code: `class User:\n    def __init__(self, email, role):\n        self.email = email\n        self.role = role\n\n    @classmethod\n    def create_admin(cls, email):\n        return cls(email, role="ADMIN")\n\n    @staticmethod\n    def validate_email(email):\n        return "@" in email and "." in email\n\nadmin = User.create_admin("dev@higenlabs.in")\nprint(f"Admin: {admin.email}, Role: {admin.role}")\nprint("Valid email?", User.validate_email(admin.email))`
            }
        ],
        aiSummary: {
            summary: 'Instance methods take self, @classmethod takes cls (for factory constructors), and @staticmethod functions as a scoped utility.',
            keyConcepts: ['Instance Method (self)', '@classmethod & cls Parameter', '@staticmethod Utilities', 'Name Mangling (__private)'],
            revisionNotes: '@classmethod is the idiomatic way to provide alternative constructors (e.g., from_json, from_dict).'
        }
    },

    "7-5": {
        content: `### 7.7 Class Inheritance & \`super()\`
Inheritance permits derived child classes to inherit attributes and methods from base parent classes:

\`\`\`python
class Vehicle:
    def __init__(self, brand, model):
        self.brand = brand
        self.model = model

    def start(self):
        return f"{self.brand} {self.model} engine running."

class ElectricCar(Vehicle):
    def __init__(self, brand, model, battery_kwh):
        super().__init__(brand, model) # Delegates to Vehicle constructor
        self.battery_kwh = battery_kwh

    def start(self): # Method Overriding (Polymorphism)
        return f"{self.brand} {self.model} powered silently via {self.battery_kwh}kWh battery."

ev = ElectricCar("Tesla", "Model 3", 75)
print(ev.start())
\`\`\`

### 7.8 Method Resolution Order (MRO)
In multiple inheritance, Python resolves attribute lookups using the **C3 Linearization Algorithm**:
\`\`\`python
print(ElectricCar.__mro__)
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Inheritance, super() & Polymorphism',
                code: `class Animal:\n    def speak(self):\n        return "Generic sound"\n\nclass Dog(Animal):\n    def speak(self):\n        return "Woof!"\n\nclass Cat(Animal):\n    def speak(self):\n        return "Meow!"\n\nanimals = [Dog(), Cat(), Dog()]\nfor a in animals:\n    print(a.speak()) # Polymorphic dispatch`
            }
        ],
        aiSummary: {
            summary: 'Inheritance enables reuse and extension. super() calls parent methods, and polymorphism allows uniform interfaces across child types.',
            keyConcepts: ['Parent & Child Inheritance', 'super() Initialization', 'Method Overriding', 'Method Resolution Order (MRO)'],
            revisionNotes: 'Inspect any class MRO using ClassName.__mro__ or ClassName.mro() to debug multiple inheritance resolution order.'
        }
    },

    "7-6": {
        content: `### 7.9 Abstract Base Classes (ABCs)
The standard library \`abc\` module enforces interface contracts. A class inheriting from \`ABC\` with \`@abstractmethod\` cannot be instantiated until all abstract methods are implemented:

\`\`\`python
from abc import ABC, abstractmethod

class PaymentGateway(ABC):
    @abstractmethod
    def process_payment(self, amount: float) -> bool:
        """Process transaction with external provider."""
        pass

class StripeGateway(PaymentGateway):
    def process_payment(self, amount: float) -> bool:
        print(f"Charged \${amount:.2f} via Stripe API.")
        return True

# p = PaymentGateway() # TypeError: Can't instantiate abstract class
gateway = StripeGateway()
gateway.process_payment(99.50)
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Abstract Base Classes with abc.ABC',
                code: `from abc import ABC, abstractmethod\n\nclass StorageDriver(ABC):\n    @abstractmethod\n    def save(self, data):\n        pass\n\nclass LocalDriver(StorageDriver):\n    def save(self, data):\n        return f"Saved to disk: {data}"\n\ndriver = LocalDriver()\nprint(driver.save("report.pdf"))`
            }
        ],
        aiSummary: {
            summary: 'Abstract Base Classes (abc.ABC) define interface contracts. Classes with @abstractmethod cannot be instantiated without implementations.',
            keyConcepts: ['abc.ABC Base Class', '@abstractmethod Decorator', 'Interface Contract Enforcement', 'Strict Architecture Blueprints'],
            revisionNotes: 'Any subclass that forgets to implement an @abstractmethod will fail immediately at instantiation time.'
        }
    },

    // ── MODULE 8: EXCEPTIONS ──────────────────────────────────────────────────
    "8-1": {
        content: `### 8.1 Errors vs Exceptions
- **Syntax Errors:** Parsing mistakes detected before code execution (e.g., missing colons, invalid indentation).
- **Exceptions:** Runtime anomalies encountered during execution (e.g., \`ZeroDivisionError\`, \`FileNotFoundError\`, \`KeyError\`).

\`\`\`python
# Handled gracefully via exceptions
try:
    result = 10 / 0
except ZeroDivisionError as err:
    print("Caught runtime anomaly:", err)
\`\`\`

### 8.2 The Exception Hierarchy
All built-in exceptions derive from \`BaseException\`. User code should inherit from \`Exception\`:
\`\`\`text
BaseException
 ├── SystemExit
 ├── KeyboardInterrupt
 └── Exception
      ├── ArithmeticError (ZeroDivisionError, OverflowError)
      ├── LookupError (IndexError, KeyError)
      └── ValueError, TypeError
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Basic Exception Interception',
                code: `try:\n    value = int("not_a_number")\nexcept ValueError as e:\n    print(f"Conversion failed safely: {e}")\nprint("Program execution continues uninterrupted.")`
            }
        ],
        aiSummary: {
            summary: 'Exceptions are runtime errors. Catching exceptions prevents crashes and allows graceful error recovery and logging.',
            keyConcepts: ['Syntax Errors vs Runtime Exceptions', 'Exception Base Hierarchy', 'try-except Mechanics', 'Safe Program Recovery'],
            revisionNotes: 'Catch Exception, never bare except: or BaseException, as that intercepts KeyboardInterrupt (Ctrl+C).'
        }
    },

    "8-2": {
        content: `### 8.3 The Complete try-except-else-finally Block
Python provides a four-part exception orchestration construct:

\`\`\`python
file = None
try:
    file = open("config.json", "r")
    data = file.read()
except FileNotFoundError:
    print("Configuration file missing. Applying defaults.")
    data = "{}"
else:
    # Runs ONLY if NO exceptions occurred in try
    print("File loaded successfully without errors.")
finally:
    # Runs ALWAYS (whether an exception occurred or not)
    if file:
        file.close()
    print("Cleanup cycle complete.")
\`\`\`

### Catching Multiple Exception Types
\`\`\`python
try:
    val = int(data[index])
except (IndexError, TypeError) as err:
    print("Index or Type issue:", err)
except ValueError:
    print("Value parsing failure")
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'try-except-else-finally Full Flow',
                code: `def divide_safely(a, b):\n    try:\n        res = a / b\n    except ZeroDivisionError:\n        print("Error: Denominator cannot be zero.")\n        return None\n    else:\n        print("Division succeeded!")\n        return res\n    finally:\n        print("[Log] Execution completed.")\n\nprint("Result 10/2:", divide_safely(10, 2))\nprint("Result 10/0:", divide_safely(10, 0))`
            }
        ],
        aiSummary: {
            summary: 'try runs code, except handles errors, else executes only on success, and finally executes unconditionally for guaranteed cleanup.',
            keyConcepts: ['try-except-else-finally Pattern', 'Guaranteed finally Execution', 'else Clean Success Branch', 'Multi-exception Tuple Catching'],
            revisionNotes: 'Code in the finally block will execute even if the try or except blocks contain return statements.'
        }
    },

    "8-3": {
        content: `### 8.4 Common Built-in Exceptions
| Exception | Trigger Condition |
| :--- | :--- |
| **\`ValueError\`** | Right datatype, but inappropriate value (\`int("abc")\`) |
| **\`TypeError\`** | Incompatible datatype for operation (\`"str" + 5\`) |
| **\`KeyError\`** | Dictionary key not found in mapping |
| **\`IndexError\`** | Sequence index out of bounds |
| **\`AttributeError\`** | Reference to non-existent object attribute |
| **\`FileNotFoundError\`**| Attempting to read a non-existent file path |

\`\`\`python
data = {"user": "Alice"}
try:
    print(data["age"])
except KeyError as e:
    print(f"Missing required key: {e}")
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Catching Specific Standard Exceptions',
                code: `items = [10, 20, 30]\ntry:\n    print(items[10])\nexcept IndexError as err:\n    print(f"Handled IndexError: {err}")\n\ntry:\n    "text".non_existent_method()\nexcept AttributeError as err:\n    print(f"Handled AttributeError: {err}")`
            }
        ],
        aiSummary: {
            summary: 'Python provides specialized exceptions (ValueError, TypeError, KeyError, IndexError). Catching specific exceptions prevents masking unrelated bugs.',
            keyConcepts: ['Specific vs Generic Exceptions', 'KeyError vs IndexError', 'ValueError vs TypeError', 'Defensive Exception Mapping'],
            revisionNotes: 'Always catch specific exceptions (e.g. KeyError) rather than a generic Exception to avoid hiding unexpected bugs.'
        }
    },

    "8-4": {
        content: `### 8.5 Raising Exceptions with \`raise\`
Manually signal error conditions using \`raise\`:
\`\`\`python
def withdraw(balance, amount):
    if amount <= 0:
        raise ValueError("Withdrawal amount must be greater than zero")
    if amount > balance:
        raise RuntimeError("Insufficient funds available")
    return balance - amount
\`\`\`

### 8.6 Custom User-Defined Exceptions
Derive from the built-in \`Exception\` class to create domain-specific application exceptions:
\`\`\`python
class InsufficientFundsError(Exception):
    def __init__(self, balance, requested):
        super().__init__(f"Attempted to withdraw \${requested}, but only \${balance} is available.")
        self.balance = balance
        self.requested = requested

try:
    raise InsufficientFundsError(100, 250)
except InsufficientFundsError as err:
    print("Application Business Error:", err)
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Custom Application Exception Architecture',
                code: `class ValidationError(Exception):\n    pass\n\ndef register_user(username, age):\n    if len(username) < 3:\n        raise ValidationError("Username must be at least 3 characters")\n    if age < 18:\n        raise ValidationError("User must be 18 or older")\n    return f"User '{username}' registered successfully."\n\ntry:\n    register_user("al", 22)\nexcept ValidationError as e:\n    print("Validation Error:", e)`
            }
        ],
        aiSummary: {
            summary: 'The raise keyword triggers exceptions. Custom exceptions inherit from Exception, allowing clean domain-specific error handling.',
            keyConcepts: ['raise Keyword', 'Custom Exception Subclassing', 'Domain-specific Error Handling', 'Exception Re-raising'],
            revisionNotes: 'Custom exceptions should always inherit from Exception, not BaseException, so standard catch-all handlers continue working.'
        }
    }
};

