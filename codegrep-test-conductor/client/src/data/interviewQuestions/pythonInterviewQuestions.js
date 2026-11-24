// Python Programming Company Interview Questions Repository
// 12 Modules x 15+ Authentic Company Questions with Company Name, Year, Difficulty, Question, and Detailed Solution

export const pythonInterviewQuestions = {
    // Module 1: Introduction to Python
    1: {
        moduleTitle: "Introduction to Python, Syntax & Ecosystem",
        questions: [
            {
                id: "py-1-1",
                company: "Google",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Is Python an interpreted or compiled language? Explain the role of `.pyc` files and CPython bytecode.",
                explanation: "Python is both compiled and interpreted. CPython first compiles source code (`.py`) into intermediate platform-independent bytecode instructions stored in `__pycache__/*.pyc` files. The CPython Virtual Machine (PVM) then interprets this bytecode line-by-line into native machine instructions at runtime."
            },
            {
                id: "py-1-2",
                company: "Microsoft",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the GIL (Global Interpreter Lock) in CPython and how does it affect CPU-bound multithreaded programs?",
                explanation: "The GIL is a mutex lock in CPython that prevents multiple native threads from executing Python bytecode simultaneously. It was introduced to make memory management (reference counting) thread-safe without fine-grained locks. Consequently, multithreading in Python does NOT speed up CPU-bound tasks across multiple CPU cores; developers must use multiprocessing (`multiprocessing` module) or free-threaded Python 3.13."
            },
            {
                id: "py-1-3",
                company: "Amazon",
                year: 2024,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What does 'Dynamic and Strongly Typed' mean in Python?",
                explanation: "- Dynamically Typed: Variable types are checked at runtime, not compile time. A variable name is merely a reference label bound to an object, so `x = 5` followed by `x = \"hello\"` is valid.\n- Strongly Typed: Python enforces type operations strictly and does not perform silent coercion across incompatible types (e.g. `'5' + 5` raises `TypeError`, unlike JavaScript which produces `'55'`)."
            },
            {
                id: "py-1-4",
                company: "Meta",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the difference between Python 2 and Python 3 regarding division (`/` vs `//`) and `print`?",
                explanation: "In Python 2, `/` on integers performed floor division (`5 / 2 = 2`), and `print` was a statement (`print \"hi\"`). In Python 3, `/` always performs true floating-point division (`5 / 2 = 2.5`), `//` performs floor division (`5 // 2 = 2`), and `print()` is strictly a function."
            },
            {
                id: "py-1-5",
                company: "Apple",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is Duck Typing in Python and how does it relate to EAFP ('Easier to Ask for Forgiveness than Permission')?",
                explanation: "Duck Typing ('If it walks like a duck and quacks like a duck, it's a duck') means an object's suitability is determined by the presence of specific methods and properties, rather than its inheritance hierarchy. EAFP promotes trying to execute an action directly inside a `try...except` block rather than checking preconditions with `isinstance` or `hasattr` beforehand."
            },
            {
                id: "py-1-6",
                company: "Netflix",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "How does Python manage memory using Reference Counting and Generational Garbage Collection?",
                explanation: "1. Reference Counting: Every Python object header contains an `ob_refcnt` counter. When references are created, the count increments; when deleted (`del` or out of scope), it decrements. When it hits 0, memory is immediately deallocated.\n2. Generational GC (`gc` module): Handles cyclic references (e.g. `a.next = b; b.prev = a`) using 3 generational heaps (Gen 0, 1, 2) inspected via heuristic thresholds."
            },
            {
                id: "py-1-7",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Who developed Python and what is 'The Zen of Python'?",
                explanation: "Guido van Rossum developed Python in 1991 at CWI in the Netherlands. The Zen of Python is a set of 19 guiding design aphorisms written by Tim Peters (accessible by typing `import this` in the Python terminal), emphasizing readability, simplicity, and explicitness."
            },
            {
                id: "py-1-8",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is PEP 8 in the Python community?",
                explanation: "PEP 8 (Python Enhancement Proposal 8) is the official style guide for writing clean, readable Python code, recommending 4 spaces per indentation level, snake_case function names, CamelCase class names, and a 79-character maximum line length."
            },
            {
                id: "py-1-9",
                company: "Uber",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the difference between mutable and immutable built-in objects in Python?",
                explanation: "- Immutable: Value cannot be altered after creation (e.g. `int`, `float`, `bool`, `str`, `tuple`, `frozenset`, `bytes`). Attempting to modify creates a new object.\n- Mutable: Internal state can be modified in-place without changing object identity `id()` (e.g. `list`, `dict`, `set`, `bytearray`)."
            },
            {
                id: "py-1-10",
                company: "Goldman Sachs",
                year: 2023,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Integer Interning and String Interning in CPython?",
                explanation: "CPython pre-allocates and caches small integers in the range `[-5, 256]` during startup. Any variable assigned a value in this range points to the exact same shared object in RAM (`a = 256; b = 256; a is b` is True). Similarly, short ASCII identifier strings are interned for rapid dictionary lookup via pointer comparison."
            },
            {
                id: "py-1-11",
                company: "Cisco",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What does the `help()` and `dir()` built-in functions do in the Python REPL?",
                explanation: "`dir(object)` returns a list of all valid attribute and method names associated with that object. `help(object)` displays the interactive formatted docstring documentation for functions, modules, or classes."
            },
            {
                id: "py-1-12",
                company: "Adobe",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the output of `type(type(1))` in Python?",
                explanation: "Output: `<class 'type'>`.\nIn Python, everything is an object. `type(1)` is `<class 'int'>`, and `type(<class 'int'>)` is `<class 'type'>`, because `type` is the metaclass of all built-in classes."
            },
            {
                id: "py-1-13",
                company: "IBM",
                year: 2022,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is a virtual environment in Python (`venv`) and why is it essential?",
                explanation: "A virtual environment isolates project-specific Python dependencies, libraries, and `pip` packages into a standalone directory. This prevents version conflicts between projects that require differing package versions."
            },
            {
                id: "py-1-14",
                company: "Wipro",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the difference between `.py` and `.pyw` file extensions?",
                explanation: "`.py` files are executed by `python.exe` and open a console terminal window for stdout/stderr. `.pyw` files are executed by `pythonw.exe` without opening a command prompt window, used for graphical GUI desktop applications (Tkinter, PyQt)."
            },
            {
                id: "py-1-15",
                company: "Bloomberg",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is PyPy and how does its JIT (Just-In-Time) compiler differ from standard CPython?",
                explanation: "PyPy is an alternative Python interpreter written in RPython. While CPython interprets bytecode with a static interpreter loop, PyPy uses a tracing JIT compiler that monitors running code, identifies hot loops, and compiles them directly into native x86/ARM machine code at runtime, achieving 4-7x speedups for numerical code."
            }
        ]
    },

    // Module 2: Python Tokens & Operators
    2: {
        moduleTitle: "Python Tokens, Variables & Operators",
        questions: [
            {
                id: "py-2-1",
                company: "Google",
                year: 2024,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What is the difference between `==` and `is` in Python? Give an example where `a == b` is True but `a is b` is False.",
                explanation: "`==` tests for equality of **values** (calls `__eq__`). `is` tests for **identity** (checks whether both operands refer to the exact same memory address: `id(a) == id(b)`).\nExample:\n`a = [1, 2, 3]`\n`b = [1, 2, 3]`\n`a == b` is `True` (same elements), but `a is b` is `False` (two distinct heap objects)."
            },
            {
                id: "py-2-2",
                company: "Amazon",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "What is the Walrus Operator `:=` introduced in Python 3.8 and when is it useful?",
                explanation: "The walrus operator `:=` (Assignment Expression) assigns values to variables as part of an expression:\n```python\n# Without walrus:\nline = f.readline()\nwhile line:\n    process(line)\n    line = f.readline()\n\n# With walrus operator:\nwhile (line := f.readline()):\n    process(line)\n```"
            },
            {
                id: "py-2-3",
                company: "Microsoft",
                year: 2024,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What does `2 ** 3 ** 2` evaluate to in Python and why?",
                explanation: "Evaluates to `512` (not 64).\nIn Python, the exponentiation operator `**` has **right-to-left associativity**: `2 ** (3 ** 2) = 2 ** 9 = 512`."
            },
            {
                id: "py-2-4",
                company: "Apple",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What are the Truthy and Falsy values in Python?",
                explanation: "Falsy values in Python evaluate to `False` in boolean contexts:\n`None`, `False`, numeric zeroes (`0`, `0.0`, `0j`), empty collections (`\"\"`, `()`, `[]`, `{}`, `set()`, `range(0)`), and objects defining `__bool__()` or `__len__()` that return 0 or False. All other values and non-empty objects are Truthy."
            },
            {
                id: "py-2-5",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What is the output of `bool('False')` vs `bool('')`?",
                explanation: "`bool('False')` evaluates to `True` because it is a non-empty string. `bool('')` evaluates to `False` because it is an empty string."
            },
            {
                id: "py-2-6",
                company: "Qualcomm",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "How do bitwise operators (`&`, `|`, `^`, `~`, `<<`, `>>`) handle arbitrary-precision integers in Python?",
                explanation: "Unlike C where integers overflow at 32/64 bits, Python integers have arbitrary precision (Bignum). Bitwise operations conceptually operate on infinite two's complement binary representations. E.g., `~x` evaluates to `-(x + 1)`, so `~5` evaluates to `-6`."
            },
            {
                id: "py-2-7",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What does `x, y = y, x` do in Python and how does it work without a temp variable?",
                explanation: "It swaps `x` and `y`. Under the hood, Python creates a temporary 2-element tuple on the right-hand side `(y, x)` and unpacks it into the variables on the left-hand side `x, y`."
            },
            {
                id: "py-2-8",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the output of `print(0.1 + 0.2 == 0.3)`?",
                explanation: "Output: `False`.\nDue to IEEE 754 floating-point binary representation limitations, `0.1 + 0.2` evaluates to `0.30000000000000004`. For accurate floating-point comparisons, use `math.isclose(a, b)` or the `decimal` module."
            },
            {
                id: "py-2-9",
                company: "Adobe",
                year: 2023,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What is the output of `'a' < 'b' and 'apple' < 'app'`?",
                explanation: "Output: `False`.\n`'a' < 'b'` is `True`. In lexicographical comparison, `'apple'` has length 5 and `'app'` has length 3, so `'apple' < 'app'` is `False`. `True and False` evaluates to `False`."
            },
            {
                id: "py-2-10",
                company: "Goldman Sachs",
                year: 2024,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What is the result of `10 and 20` vs `10 or 20` in Python?",
                explanation: "`10 and 20` evaluates to `20`. In Python, `and` returns the first falsy operand, or the last operand if all are truthy.\n`10 or 20` evaluates to `10`. `or` returns the first truthy operand, or the last operand if all are falsy."
            },
            {
                id: "py-2-11",
                company: "Cisco",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What are the Membership Operators in Python and what is their time complexity?",
                explanation: "The membership operators are `in` and `not in`. Time complexity:\n- In `list` or `tuple`: $O(N)$ linear search.\n- In `set` or `dict`: $O(1)$ average hash table lookup."
            },
            {
                id: "py-2-12",
                company: "Intel",
                year: 2023,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Chained Comparison in Python (e.g. `1 < x < 10`)?",
                explanation: "Python supports chained comparisons where `1 < x < 10` is evaluated as `(1 < x) and (x < 10)`, with the crucial guarantee that the middle expression `x` is evaluated **only once**."
            },
            {
                id: "py-2-13",
                company: "Uber",
                year: 2024,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What is the output of `a = [1, 2]; b = a; b += [3]; print(a)` vs `b = b + [4]`?",
                explanation: "`b += [3]` calls `__iadd__` on the list, modifying the underlying list object in-place, so `a` becomes `[1, 2, 3]`. In contrast, `b = b + [4]` creates a brand new list and rebinds `b`, leaving `a` unchanged."
            },
            {
                id: "py-2-14",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "How do you define multi-line string literals and comments in Python?",
                explanation: "Multi-line strings are enclosed in triple quotes (`'''...'''` or `\"\"\"...\"\"\"`). When not assigned to a variable or placed as docstrings under functions/classes, they act as multi-line comments."
            },
            {
                id: "py-2-15",
                company: "Bloomberg",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "How does Python handle operator overloading for custom classes?",
                explanation: "Python invokes special dunder methods on the class: `+` calls `__add__`, `-` calls `__sub__`, `*` calls `__mul__`, `==` calls `__eq__`, `<` calls `__lt__`, `[]` calls `__getitem__`, and `()` calls `__call__`."
            }
        ]
    },

    // Module 3: Control Flow & Loops
    3: {
        moduleTitle: "Control Flow, Loops & Pattern Matching",
        questions: [
            {
                id: "py-3-1",
                company: "Google",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What does the `else` clause attached to a `for` or `while` loop do in Python?",
                explanation: "The `else` block executes when the loop finishes iterating naturally (e.g. exhausts all items in iterable, or condition becomes false). If the loop is terminated prematurely by a `break` statement, the `else` block is **skipped**. Idiomatic for search loops."
            },
            {
                id: "py-3-2",
                company: "Microsoft",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "What is Structural Pattern Matching (`match / case`) introduced in Python 3.10?",
                explanation: "Python 3.10 introduced `match...case` which supports deep structural destructuring of sequences, mappings, and class objects:\n```python\nmatch command.split():\n    case [\"quit\"]:\n        exit()\n    case [\"load\", filename]:\n        load_file(filename)\n    case [\"move\", (\"up\" | \"down\") as direction, int(steps)]:\n        move(direction, steps)\n    case _:\n        print(\"Unknown command\")\n```"
            },
            {
                id: "py-3-3",
                company: "Amazon",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the difference between `range(10)` in Python 2 vs Python 3?",
                explanation: "In Python 2, `range()` created an explicit `list` in memory allocating $O(N)$ RAM. In Python 3, `range()` is an immutable sequence type that computes elements on-demand in $O(1)$ memory regardless of size."
            },
            {
                id: "py-3-4",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "What is the idiomatic way to iterate over both indices and elements of a list in Python?",
                explanation: "Use the `enumerate()` built-in function:\n```python\nfor idx, val in enumerate(my_list, start=0):\n    print(f\"Index {idx}: {val}\")\n```\nAvoids manual counter increments or `range(len(my_list))`."
            },
            {
                id: "py-3-5",
                company: "Apple",
                year: 2024,
                difficulty: "Medium",
                type: "Coding",
                question: "How do you iterate over two lists simultaneously in Python?",
                explanation: "Use `zip(list1, list2)` to iterate in lockstep until the shortest list ends. To iterate to the longest list using a default fill value, use `itertools.zip_longest(list1, list2, fillvalue=None)`."
            },
            {
                id: "py-3-6",
                company: "Uber",
                year: 2023,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What happens if you modify a list while iterating over it in a `for` loop?",
                explanation: "Modifying (e.g. `remove()` or `append()`) a list while iterating over it shifts the internal list indices, causing the loop to skip elements or repeat iterations. Best practice: iterate over a shallow copy (`for item in my_list[:]:`) or use a list comprehension."
            },
            {
                id: "py-3-7",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Coding",
                question: "Write a one-line Python list comprehension to extract all even numbers from a list `nums` and square them.",
                explanation: "```python\nsquared_evens = [x**2 for x in nums if x % 2 == 0]\n```"
            },
            {
                id: "py-3-8",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the difference between `break`, `continue`, and `pass` in Python loops?",
                explanation: "- `break`: Terminates the enclosing loop immediately.\n- `continue`: Skips the remainder of the current iteration and jumps to the next cycle.\n- `pass`: A null statement used as a placeholder where syntax requires code but no action is needed."
            },
            {
                id: "py-3-9",
                company: "Goldman Sachs",
                year: 2024,
                difficulty: "Medium",
                type: "Coding",
                question: "How do you reverse a list using slice syntax vs `reversed()` vs `.reverse()`?",
                explanation: "1. `nums[::-1]`: Creates a brand new reversed list copy in $O(N)$ space.\n2. `reversed(nums)`: Returns a lazy reverse iterator consuming $O(1)$ auxiliary space.\n3. `nums.reverse()`: Mutates the existing list in-place and returns `None`."
            },
            {
                id: "py-3-10",
                company: "Adobe",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "Write Python code using a while loop to find the Greatest Common Divisor (GCD) using the Euclidean algorithm.",
                explanation: "```python\ndef gcd(a, b):\n    while b != 0:\n        a, b = b, a % b\n    return a\n```"
            },
            {
                id: "py-3-11",
                company: "Cisco",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the output of `for i in range(1, 10, 2): print(i, end=' ')`?",
                explanation: "Output: `1 3 5 7 9 `.\n`range(start, stop, step)` starts at 1, increments by step 2, and stops strictly before 10."
            },
            {
                id: "py-3-12",
                company: "NVIDIA",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "How can you break out of multiple nested loops simultaneously in Python?",
                explanation: "Python has no labeled `break`. Standard idioms:\n1. Wrap nested loops inside a function and use `return`.\n2. Use a boolean flag variable (`found = True; break`).\n3. Use loop `else` blocks with `continue`."
            },
            {
                id: "py-3-13",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the output of `[x for x in range(3) for y in range(2)]`?",
                explanation: "Output: `[0, 0, 1, 1, 2, 2]`.\nNested list comprehensions iterate in order from left to right (outer loop first, inner loop second)."
            },
            {
                id: "py-3-14",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the ternary conditional expression syntax in Python?",
                explanation: "Syntax: `value_if_true if condition else value_if_false`\nExample: `status = \"Adult\" if age >= 18 else \"Minor\"`."
            },
            {
                id: "py-3-15",
                company: "Bloomberg",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "Implement run-length encoding (RLE) on a string using a single loop in Python.",
                explanation: "```python\ndef rle(s):\n    if not s: return \"\"\n    res, count = [], 1\n    for i in range(1, len(s)):\n        if s[i] == s[i-1]:\n            count += 1\n        else:\n            res.append(f\"{s[i-1]}{count}\")\n            count = 1\n    res.append(f\"{s[-1]}{count}\")\n    return \"\".join(res)\n```"
            }
        ]
    },

    // Module 4: Functions & Scope
    4: {
        moduleTitle: "Functions, Lambdas & Scope",
        questions: [
            {
                id: "py-4-1",
                company: "Google",
                year: 2024,
                difficulty: "Hard",
                type: "Output Prediction",
                question: "Why should you NEVER use a mutable default argument like `def append_to(val, target=[])` in Python?",
                explanation: "Default parameter values are evaluated **only once** when the function definition is executed at module load time, not on each call. Subsequent calls reuse the exact same mutable list object in memory:\n```python\nappend_to(1) # target becomes [1]\nappend_to(2) # target becomes [1, 2]!\n# Correct idiom:\ndef append_to(val, target=None):\n    if target is None: target = []\n    target.append(val)\n```"
            },
            {
                id: "py-4-2",
                company: "Microsoft",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Explain the LEGB scope lookup rule in Python.",
                explanation: "When resolving an unqualified variable name, Python searches scopes in the following strict order:\n1. **L**ocal: Names assigned inside the current function.\n2. **E**nclosing: Names in enclosing scopes of outer nested functions.\n3. **G**lobal: Names declared at the top-level module scope.\n4. **B**uilt-in: Built-in Python names (`len`, `range`, `ValueError`)."
            },
            {
                id: "py-4-3",
                company: "Amazon",
                year: 2024,
                difficulty: "Medium",
                type: "Coding",
                question: "What do `*args` and `**kwargs` do in a function definition?",
                explanation: "- `*args` (Positional variable arguments): Collects arbitrary positional arguments into a `tuple`.\n- `**kwargs` (Keyword variable arguments): Collects arbitrary keyword arguments into a `dict`.\nAllows writing versatile wrapper and decorator functions."
            },
            {
                id: "py-4-4",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the difference between `global` and `nonlocal` keywords in Python?",
                explanation: "- `global var`: Informs Python that `var` refers to the top-level module scope, allowing re-assignment.\n- `nonlocal var`: Informs Python that `var` refers to a variable in the nearest enclosing parent function's scope (used in closures), skipping the local scope without touching global."
            },
            {
                id: "py-4-5",
                company: "Apple",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "What is a Closure in Python? Write a closure that implements a counter function.",
                explanation: "A closure is an inner function that retains access to variables from its enclosing lexical scope even after the outer function has finished executing:\n```python\ndef make_counter(start=0):\n    count = start\n    def counter():\n        nonlocal count\n        count += 1\n        return count\n    return counter\nc = make_counter(10)\nc() # returns 11\nc() # returns 12\n```"
            },
            {
                id: "py-4-6",
                company: "Netflix",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is a Lambda function in Python and what are its limitations?",
                explanation: "A lambda is a small, anonymous inline function defined with `lambda params: expression`. Limitations: It can contain only a single expression (no statements like `return`, `pass`, assignments, loops, or `try...except`), and cannot contain type annotations."
            },
            {
                id: "py-4-7",
                company: "Bloomberg",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What are Positional-Only (`/`) and Keyword-Only (`*`) parameters introduced in Python 3.8?",
                explanation: "Syntax: `def f(pos_only, /, standard, *, kw_only):`\n- Any parameter before `/` MUST be passed by position (`f(1, ...)`).\n- Any parameter after `*` MUST be passed by keyword (`f(..., kw_only=3)`).\nPrevents API consumers from depending on parameter names that library authors may want to rename."
            },
            {
                id: "py-4-8",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Coding",
                question: "How do you sort a list of tuples `[(1, 'b'), (2, 'a')]` by the second element using a lambda?",
                explanation: "```python\ndata.sort(key=lambda x: x[1])\n# Result: [(2, 'a'), (1, 'b')]\n```"
            },
            {
                id: "py-4-9",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What does a Python function return if it does not contain a `return` statement?",
                explanation: "It implicitly returns `None`."
            },
            {
                id: "py-4-10",
                company: "Adobe",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Are arguments passed by value or passed by reference in Python?",
                explanation: "Python uses **Pass by Object Reference** (also called Call by Sharing). The caller passes a copy of the object reference (pointer). If the passed object is mutable (like a `list`), in-place modifications affect the caller; if re-assigned (`x = 10`), only the local variable name is rebound."
            },
            {
                id: "py-4-11",
                company: "Goldman Sachs",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "What is `functools.partial` and when is it used?",
                explanation: "`partial` creates a new callable with frozen pre-configured arguments:\n```python\nfrom functools import partial\ndef power(base, exp): return base ** exp\nsquare = partial(power, exp=2)\nsquare(5) # returns 25\n```"
            },
            {
                id: "py-4-12",
                company: "Uber",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "What is Function Memoization and how do you use `functools.lru_cache`?",
                explanation: "Memoization caches function call outputs for given input arguments. `lru_cache` provides a built-in Least Recently Used decorator:\n```python\nfrom functools import lru_cache\n@lru_cache(maxsize=128)\ndef fib(n):\n    if n < 2: return n\n    return fib(n-1) + fib(n-2)\n```\nReduces exponential $O(2^N)$ recursion to linear $O(N)$."
            },
            {
                id: "py-4-13",
                company: "Cisco",
                year: 2024,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What are Type Hints (Type Annotations) in Python?",
                explanation: "Introduced in PEP 484 (Python 3.5), type hints allow annotating expected parameter and return types (`def add(x: int, y: int) -> int:`). They are ignored by the runtime but validated by static type checkers like `mypy`."
            },
            {
                id: "py-4-14",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Can a Python function return multiple values?",
                explanation: "Yes. Returning `return a, b, c` packs the values into a single `tuple` that can be unpacked by the caller: `x, y, z = func()`."
            },
            {
                id: "py-4-15",
                company: "Intel",
                year: 2023,
                difficulty: "Hard",
                type: "Output Prediction",
                question: "Explain the late-binding closure bug in loops: `funcs = [lambda: i for i in range(3)]`.",
                explanation: "All 3 lambdas return `2`! Python closures bind to the variable name `i`, not its value at creation. When invoked later, `i` has its final loop value `2`. Fix with default argument capture: `[lambda i=i: i for i in range(3)]`."
            }
        ]
    },

    // Module 5: Strings & Regex
    5: {
        moduleTitle: "Strings, Slicing & Regular Expressions",
        questions: [
            {
                id: "py-5-1",
                company: "Google",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Why are strings immutable in Python? List three engineering benefits.",
                explanation: "1. Hash Consistency: Being immutable guarantees `hash(str)` never changes, enabling strings to be safe dictionary keys and set elements.\n2. Security: Strings are used for file paths, network URLs, and credentials; immutability prevents malicious tampering.\n3. Memory Optimization: Allows Python to intern strings and share identical instances across memory."
            },
            {
                id: "py-5-2",
                company: "Microsoft",
                year: 2024,
                difficulty: "Easy",
                type: "Coding",
                question: "Explain F-strings (Formatted String Literals) in Python 3.6+ and formatting specifiers.",
                explanation: "F-strings allow embedded expressions evaluated at runtime: `f\"Total: {price * qty:.2f}\"`. In Python 3.8+, `f\"{x=}\"` outputs `x=5` for debugging. F-strings are faster than `%` formatting or `.format()` because they compile directly into efficient bytecode."
            },
            {
                id: "py-5-3",
                company: "Amazon",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "Why should you use `''.join(list_of_strings)` instead of `+=` concatenation in a loop?",
                explanation: "Strings are immutable. Using `+=` in a loop allocates a new string and copies all previous characters on every iteration, leading to catastrophic $O(N^2)$ quadratic time. `''.join()` pre-calculates the exact required buffer size and copies characters once in $O(N)$ linear time."
            },
            {
                id: "py-5-4",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "Write a regular expression in Python using `re` to validate an email address.",
                explanation: "```python\nimport re\ndef is_valid_email(email):\n    pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$'\n    return bool(re.match(pattern, email))\n```"
            },
            {
                id: "py-5-5",
                company: "Apple",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the difference between `re.match()`, `re.search()`, and `re.findall()` in Python?",
                explanation: "- `re.match()`: Checks for a match strictly at the **beginning** of the string.\n- `re.search()`: Scans through the entire string to find the **first** location where the pattern matches.\n- `re.findall()`: Scans the entire string and returns all non-overlapping matches as a list of strings/tuples."
            },
            {
                id: "py-5-6",
                company: "Bloomberg",
                year: 2024,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What does string slice `s[:: -1]` do, and what are the start/stop defaults?",
                explanation: "`s[::-1]` reverses the string. When step is negative (`-1`), the default start is the end of the string (index -1), and the default stop is the beginning (before index 0)."
            },
            {
                id: "py-5-7",
                company: "Uber",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the difference between `str.strip()`, `str.lstrip()`, and `str.rstrip()`?",
                explanation: "- `strip()`: Removes whitespace (or specified characters) from both ends.\n- `lstrip()`: Removes whitespace strictly from the leading (left) end.\n- `rstrip()`: Removes whitespace strictly from the trailing (right) end."
            },
            {
                id: "py-5-8",
                company: "Adobe",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the output of `'abc'.find('z')` vs `'abc'.index('z')`?",
                explanation: "`find('z')` returns `-1` when the substring is not found. `index('z')` raises a `ValueError: substring not found` exception."
            },
            {
                id: "py-5-9",
                company: "Goldman Sachs",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What are Raw Strings (`r\"...\"`) in Python and why are they used with regex and Windows paths?",
                explanation: "Raw strings treat backslashes `\\` as literal characters rather than escape characters (e.g. `r'\\n'` is a 2-character string of backslash and 'n', not a newline). Essential for regex patterns and Windows file paths (`r'C:\\new\\test'`)."
            },
            {
                id: "py-5-10",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Coding",
                question: "How do you count the occurrences of each word in a text string in Python?",
                explanation: "```python\nfrom collections import Counter\nwords = text.lower().split()\ncounts = Counter(words)\n```"
            },
            {
                id: "py-5-11",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the output of `','.join(['a', 'b', 'c'])`?",
                explanation: "Output: `'a,b,c'`.\nJoins the iterable of strings using `','` as the delimiter."
            },
            {
                id: "py-5-12",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What are Greedy vs Non-Greedy (Lazy) quantifiers in Python regular expressions?",
                explanation: "Greedy quantifiers (`*`, `+`) match as much text as possible. Appending `?` makes them non-greedy/lazy (`*?`, `+?`), matching the minimal number of characters required to satisfy the pattern."
            },
            {
                id: "py-5-13",
                company: "Cisco",
                year: 2024,
                difficulty: "Medium",
                type: "Coding",
                question: "What does `str.split(sep, maxsplit)` do?",
                explanation: "`split(sep, maxsplit)` splits a string into a list. `maxsplit` limits the number of splits performed: `'a:b:c'.split(':', 1)` yields `['a', 'b:c']`."
            },
            {
                id: "py-5-14",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the difference between ASCII and Unicode in Python 3 strings?",
                explanation: "In Python 3, all `str` objects are native Unicode strings supporting multi-lingual characters, emojis, and symbols. The `bytes` type represents raw 8-bit octet sequences. Encoding transforms `str` -> `bytes` (`s.encode('utf-8')`); decoding transforms `bytes` -> `str` (`b.decode('utf-8')`)."
            },
            {
                id: "py-5-15",
                company: "Netflix",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "How do you use regex named capture groups with `re.compile()`?",
                explanation: "```python\npattern = re.compile(r'(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})')\nmatch = pattern.match(\"2024-11-23\")\nprint(match.groupdict()) # {'year': '2024', 'month': '11', 'day': '23'}\n```"
            }
        ]
    },

    // Module 6: Data Structures
    6: {
        moduleTitle: "Data Structures - Lists, Tuples, Sets, Dictionaries",
        questions: [
            {
                id: "py-6-1",
                company: "Google",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "How is a Python `dict` implemented internally (Compact Hash Table since Python 3.6)?",
                explanation: "Since Python 3.6, CPython uses Raymond Hettinger's compact dictionary layout: an `indices` sparse array containing integer offsets into a dense `entries` array: `[hash, key_ptr, val_ptr]`. This layout preserves **insertion order** by default and reduces RAM usage by 20-25%."
            },
            {
                id: "py-6-2",
                company: "Amazon",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the difference between a shallow copy and a deep copy in Python?",
                explanation: "A shallow copy (`copy.copy()` or `list.copy()`) creates a new collection object, but inserts references to the original child objects. A deep copy (`copy.deepcopy()`) recursively clones the collection AND all nested child objects, producing an entirely independent copy."
            },
            {
                id: "py-6-3",
                company: "Microsoft",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Why can a `list` NOT be used as a dictionary key or set element in Python?",
                explanation: "Dictionary keys and set elements must be **hashable** (define `__hash__` and `__eq__` such that hash values never change). Because lists are mutable, their contents can change, which would corrupt the hash bucket index. Immutable `tuple`s can be keys provided all their elements are also hashable."
            },
            {
                id: "py-6-4",
                company: "Meta",
                year: 2024,
                difficulty: "Medium",
                type: "Coding",
                question: "How does `collections.defaultdict` work and how does it prevent `KeyError`?",
                explanation: "```python\nfrom collections import defaultdict\nd = defaultdict(list)\nd['fruits'].append('apple') # No KeyError! Creates empty list automatically\n```"
            },
            {
                id: "py-6-5",
                company: "Apple",
                year: 2023,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the over-allocation strategy of Python `list` dynamic arrays?",
                explanation: "CPython lists allocate more capacity than needed (`allocated > size`). When resizing, CPython grows capacity in proportional steps: $N + (N \\gg 3) + (3 \\text{ or } 6)$, amortizing append operations to $O(1)$ time."
            },
            {
                id: "py-6-6",
                company: "Bloomberg",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "What is a `collections.deque` and why is it preferred over `list` for FIFO queues?",
                explanation: "`collections.deque` is a doubly-linked list of blocks. Appending and popping from **both ends** (`append`, `appendleft`, `pop`, `popleft`) operates in guaranteed $O(1)$ time. In contrast, popping from the front of a `list` (`list.pop(0)`) requires shifting all $N$ elements in $O(N)$ time."
            },
            {
                id: "py-6-7",
                company: "Uber",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "How do you merge two dictionaries in Python 3.9+ using the union operator `|`?",
                explanation: "```python\nd1 = {'a': 1, 'b': 2}\nd2 = {'b': 99, 'c': 3}\nmerged = d1 | d2 # {'a': 1, 'b': 99, 'c': 3}\nd1 |= d2 # in-place update\n```"
            },
            {
                id: "py-6-8",
                company: "Adobe",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What mathematical set operations are supported by Python `set`?",
                explanation: "Union `s1 | s2`, Intersection `s1 & s2`, Difference `s1 - s2`, and Symmetric Difference `s1 ^ s2`."
            },
            {
                id: "py-6-9",
                company: "Goldman Sachs",
                year: 2024,
                difficulty: "Medium",
                type: "Coding",
                question: "Find the top 3 most frequent elements in a list in Python.",
                explanation: "```python\nfrom collections import Counter\ncounts = Counter(nums)\ntop3 = counts.most_common(3)\n```"
            },
            {
                id: "py-6-10",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What is the output of `t = (1); type(t)` vs `t = (1,); type(t)`?",
                explanation: "`type((1))` is `<class 'int'>` (parentheses act as expression grouping). `type((1,))` is `<class 'tuple'>` (the trailing comma defines a 1-element tuple)."
            },
            {
                id: "py-6-11",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "How do you remove duplicates from a list while preserving element order?",
                explanation: "Use `list(dict.fromkeys(items))`. In Python 3.7+, dictionary keys preserve insertion order and drop duplicates in $O(N)$ time."
            },
            {
                id: "py-6-12",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "What is `heapq` in Python and how do you implement a Min-Heap / Max-Heap?",
                explanation: "`heapq` provides binary min-heap algorithms operating on standard lists (`heapq.heappush(h, val)`, `heapq.heappop(h)` in $O(\\log N)$). To implement a max-heap, multiply values by -1."
            },
            {
                id: "py-6-13",
                company: "Cisco",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is `collections.namedtuple` and `typing.NamedTuple`?",
                explanation: "Creates lightweight tuple subclasses with named fields accessible via attribute lookup (`p.x`, `p.y`) while preserving tuple immutability and $O(1)$ memory footprint."
            },
            {
                id: "py-6-14",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What does `dict.get(key, default)` return if `key` is missing?",
                explanation: "It returns `default` (or `None` if omitted), preventing `KeyError` exceptions."
            },
            {
                id: "py-6-15",
                company: "Netflix",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Timsort and what are its best, average, and worst case time complexities in Python `sort()`?",
                explanation: "Timsort (invented by Tim Peters for Python) is an adaptive stable hybrid of Merge Sort and Insertion Sort. Best case: $O(N)$ on already sorted or partially sorted runs. Average and worst case: $O(N \\log N)$. Space complexity: $O(N)$."
            }
        ]
    },

    // Module 7: Object-Oriented Python
    7: {
        moduleTitle: "Object-Oriented Python (Classes & Metaclasses)",
        questions: [
            {
                id: "py-7-1",
                company: "Google",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the C3 Linearization algorithm and how does `super()` resolve Method Resolution Order (MRO)?",
                explanation: "C3 Linearization computes a deterministic, monotonic order of classes in multiple inheritance hierarchies, ensuring derived classes precede bases and preserving local precedence. `super()` does not call the parent class directly; it calls the next class in the object's dynamic `__mro__` sequence."
            },
            {
                id: "py-7-2",
                company: "Microsoft",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Explain `@staticmethod` vs `@classmethod` vs regular instance methods in Python.",
                explanation: "- Instance method: Takes `self` as first argument; operates on specific object instance state.\n- `@classmethod`: Takes `cls` as first argument; operates on the class itself, commonly used as alternative factory constructors.\n- `@staticmethod`: Takes neither `self` nor `cls`; an isolated utility function grouped logically inside the class namespace."
            },
            {
                id: "py-7-3",
                company: "Amazon",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "What does `__slots__` do and how does it optimize memory in Python classes?",
                explanation: "By default, every Python instance stores attributes in a dynamic `__dict__` dictionary, consuming substantial RAM. Defining `__slots__ = ('name', 'id')` tells CPython to allocate a fixed-size C array for attributes instead of `__dict__`, reducing memory by 40-50%."
            },
            {
                id: "py-7-4",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "How does Name Mangling implement private attributes (`__var`) in Python?",
                explanation: "Python has no true private access modifiers. Prefixing an attribute with double underscores (`__attr`) triggers compiler name mangling: Python renames it internally to `_ClassName__attr`, preventing accidental overriding in child classes."
            },
            {
                id: "py-7-5",
                company: "Apple",
                year: 2024,
                difficulty: "Medium",
                type: "Coding",
                question: "How does the `@property` decorator implement getters and setters in Python?",
                explanation: "```python\nclass Account:\n    def __init__(self, balance):\n        self._balance = balance\n    @property\n    def balance(self):\n        return self._balance\n    @balance.setter\n    def balance(self, val):\n        if val < 0: raise ValueError(\"Negative balance\")\n        self._balance = val\n```"
            },
            {
                id: "py-7-6",
                company: "Bloomberg",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the difference between `__new__` and `__init__` in Python?",
                explanation: "`__new__(cls, ...)` is the static constructor that creates and returns a brand new instance object in memory. `__init__(self, ...)` is the initializer that receives the created object and sets up its initial attributes."
            },
            {
                id: "py-7-7",
                company: "Uber",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is `dataclasses.dataclass` introduced in Python 3.7?",
                explanation: "`@dataclass` automatically synthesizes boilerplate special methods (`__init__`, `__repr__`, `__eq__`, `__hash__`) from class field type annotations: `@dataclass class User: id: int; name: str`."
            },
            {
                id: "py-7-8",
                company: "Adobe",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the difference between `__str__` and `__repr__` in Python?",
                explanation: "- `__repr__`: Intended for developers/debugging; should return an unambiguous representation ideally evaluable with `eval()`.\n- `__str__`: Intended for end-users; returns a friendly readable string when printed with `print()`."
            },
            {
                id: "py-7-9",
                company: "Goldman Sachs",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is a Metaclass in Python? How do you define one?",
                explanation: "A metaclass is a class whose instances are classes. `type` is the default metaclass. You define custom metaclasses by inheriting from `type` and overriding `__new__` to intercept, modify, or validate class creation."
            },
            {
                id: "py-7-10",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Coding",
                question: "Write a simple Python class demonstrating Single Inheritance.",
                explanation: "```python\nclass Animal:\n    def speak(self): return \"Generic sound\"\nclass Dog(Animal):\n    def speak(self): return \"Woof!\"\n```"
            },
            {
                id: "py-7-11",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is `isinstance()` vs `type()` for checking object types?",
                explanation: "`isinstance(obj, Class)` considers inheritance hierarchies (returns True if obj is an instance of Class or any subclass). `type(obj) is Class` tests for exact type equality and ignores subclasses."
            },
            {
                id: "py-7-12",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the Abstract Base Class (`abc.ABC`) module in Python?",
                explanation: "`from abc import ABC, abstractmethod` allows defining abstract interfaces. Classes inheriting from `ABC` with `@abstractmethod` decorators cannot be instantiated unless all abstract methods are overridden."
            },
            {
                id: "py-7-13",
                company: "Cisco",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the Descriptor Protocol in Python (`__get__`, `__set__`, `__delete__`)?",
                explanation: "A descriptor is an object attribute with binding behavior whose access is overridden by methods in the descriptor protocol. Underpins properties, methods, static methods, class methods, and ORMs like SQLAlchemy and Django."
            },
            {
                id: "py-7-14",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What does `super().__init__()` do in a derived class constructor?",
                explanation: "Invokes the parent class constructor to initialize inherited base attributes before the child class initializes its own specific attributes."
            },
            {
                id: "py-7-15",
                company: "Netflix",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "Implement the Singleton pattern in Python using `__new__`.",
                explanation: "```python\nclass Singleton:\n    _instance = None\n    def __new__(cls, *args, **kwargs):\n        if not cls._instance:\n            cls._instance = super().__new__(cls)\n        return cls._instance\n```"
            }
        ]
    },

    // Module 8: File Handling & Serialization
    8: {
        moduleTitle: "File Handling, JSON, CSV & Serialization",
        questions: [
            {
                id: "py-8-1",
                company: "Google",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is a Context Manager (`with` statement) in Python and how do `__enter__` and `__exit__` work?",
                explanation: "The `with` statement guarantees deterministic resource cleanup (like RAII). `__enter__` acquires the resource and returns it; `__exit__(exc_type, exc_val, exc_tb)` executes automatically upon block exit (even if exceptions occur) to close files or release locks."
            },
            {
                id: "py-8-2",
                company: "Microsoft",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "How do you read and write JSON data in Python using the `json` module?",
                explanation: "```python\nimport json\n# Serialize to string / file\ndata = {'name': 'Alice', 'score': 95}\njson_str = json.dumps(data)\nwith open('data.json', 'w') as f:\n    json.dump(data, f)\n# Parse from string / file\nparsed = json.loads(json_str)\n```"
            },
            {
                id: "py-8-3",
                company: "Amazon",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "Why is `pickle` considered insecure for deserializing untrusted data?",
                explanation: "`pickle` can serialize arbitrary Python objects by serializing bytecode and callable execution instructions. An attacker can craft a malicious pickle payload using `__reduce__` that invokes `os.system()` to execute arbitrary shell commands upon `pickle.loads()`."
            },
            {
                id: "py-8-4",
                company: "Apple",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "How do you read a CSV file with headers into dictionary records using `csv.DictReader`?",
                explanation: "```python\nimport csv\nwith open('data.csv', mode='r', encoding='utf-8') as f:\n    reader = csv.DictReader(f)\n    for row in reader:\n        print(row['Name'], row['Salary'])\n```"
            },
            {
                id: "py-8-5",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the difference between `read()`, `readline()`, and `readlines()` on file objects?",
                explanation: "- `read(size)`: Reads entire file (or up to `size` bytes) as a single `str`.\n- `readline()`: Reads a single line up to `\\n`.\n- `readlines()`: Reads all lines into a `list` of strings in memory. (Best practice: iterate over the file directly: `for line in f:`)."
            },
            {
                id: "py-8-6",
                company: "Bloomberg",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "How do you process a massive 50 GB log file in Python without running out of RAM?",
                explanation: "```python\nwith open('huge_log.txt', 'r', encoding='utf-8') as f:\n    for line in f: # Lazy generator reads one line at a time in O(1) RAM\n        if \"ERROR\" in line:\n            process(line)\n```"
            },
            {
                id: "py-8-7",
                company: "Uber",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What are the common file modes in Python (`'r'`, `'w'`, `'a'`, `'x'`, `'b'`, `'+'`)?",
                explanation: "- `'r'`: Read (default).\n- `'w'`: Write (truncates existing).\n- `'a'`: Append.\n- `'x'`: Exclusive creation (fails if file exists).\n- `'b'`: Binary mode.\n- `'+'`: Open for updating (reading and writing)."
            },
            {
                id: "py-8-8",
                company: "Adobe",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "Create a custom Context Manager using `contextlib.contextmanager`.",
                explanation: "```python\nfrom contextlib import contextmanager\n@contextmanager\ndef timer():\n    import time\n    start = time.perf_counter()\n    try:\n        yield\n    finally:\n        print(f\"Elapsed: {time.perf_counter() - start:.4f}s\")\n```"
            },
            {
                id: "py-8-9",
                company: "Goldman Sachs",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What does `tell()` and `seek(offset, whence)` do in Python file streams?",
                explanation: "`tell()` returns current byte cursor position. `seek(offset, whence)` moves cursor: `0` (start), `1` (current), `2` (end)."
            },
            {
                id: "py-8-10",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Coding",
                question: "Write Python code to write a list of strings to a text file.",
                explanation: "```python\nlines = [\"First line\\n\", \"Second line\\n\"]\nwith open('output.txt', 'w') as f:\n    f.writelines(lines)\n```"
            },
            {
                id: "py-8-11",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is `pathlib.Path` in Python 3.4+ and why is it preferred over `os.path`?",
                explanation: "`pathlib.Path` provides an object-oriented API for path operations with operator overloading (`path / 'subfolder' / 'file.txt'`), cross-platform separator handling, and methods like `.read_text()`."
            },
            {
                id: "py-8-12",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What happens if a file is not closed explicitly and not opened with `with`?",
                explanation: "The file stays open until the garbage collector reclaims the file object and its `__del__` method runs, risking running out of OS file descriptors (`OSError: Too many open files`)."
            },
            {
                id: "py-8-13",
                company: "Cisco",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is `shutil` module in Python and what does `shutil.copyfile` vs `shutil.copy2` do?",
                explanation: "`shutil` provides high-level file operations. `copyfile` copies file content only; `copy2` copies file content AND preserves metadata (timestamps, file permissions)."
            },
            {
                id: "py-8-14",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What error is raised if you open a non-existent file in `'r'` mode?",
                explanation: "Raises `FileNotFoundError` (subclass of `OSError`)."
            },
            {
                id: "py-8-15",
                company: "Netflix",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "How do you serialize custom Python objects to JSON using `json.JSONEncoder`?",
                explanation: "```python\nimport json\nclass UserEncoder(json.JSONEncoder):\n    def default(self, obj):\n        if isinstance(obj, User):\n            return {'id': obj.id, 'name': obj.name}\n        return super().default(obj)\njson.dumps(user_obj, cls=UserEncoder)\n```"
            }
        ]
    },

    // Module 9: Exception Handling
    9: {
        moduleTitle: "Exception Handling & Custom Exceptions",
        questions: [
            {
                id: "py-9-1",
                company: "Google",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "Explain the full structure of `try ... except ... else ... finally` in Python.",
                explanation: "- `try`: Encloses code that may raise an exception.\n- `except ExceptionClass as e`: Catches and handles matching exceptions.\n- `else`: Executes ONLY if NO exception was raised in the `try` block.\n- `finally`: Guaranteed to execute ALWAYS upon exit (for cleanup, even after returns or unhandled exceptions)."
            },
            {
                id: "py-9-2",
                company: "Microsoft",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Why is a bare `except:` or `except Exception:` considered bad practice?",
                explanation: "A bare `except:` catches `BaseException`, which includes `KeyboardInterrupt` (Ctrl+C) and `SystemExit`, preventing the user from stopping the program. `except Exception:` catches all standard errors and masks subtle bugs. Best practice: catch specific expected exceptions (`except (ValueError, KeyError):`)."
            },
            {
                id: "py-9-3",
                company: "Amazon",
                year: 2024,
                difficulty: "Medium",
                type: "Coding",
                question: "What is Exception Chaining (`raise ... from ...`) in Python 3?",
                explanation: "Allows connecting an original exception with a new high-level exception to preserve the full root cause stack trace:\n```python\ntry:\n    connect_database()\nexcept ConnectionError as err:\n    raise ServiceUnavailableError(\"Database offline\") from err\n```"
            },
            {
                id: "py-9-4",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "How do you create a Custom User-Defined Exception in Python?",
                explanation: "```python\nclass InsufficientFundsError(Exception):\n    def __init__(self, balance, amount):\n        super().__init__(f\"Attempted withdrawal ${amount} exceeds balance ${balance}\")\n        self.balance = balance\n        self.amount = amount\n```"
            },
            {
                id: "py-9-5",
                company: "Apple",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Exception Groups (`ExceptionGroup`) and `except*` introduced in Python 3.11?",
                explanation: "Allows raising and catching multiple unrelated exceptions simultaneously (essential in concurrent `asyncio.TaskGroup` tasks). `except* SpecificError:` matches and handles only matching exception types within the group, leaving others to propagate."
            },
            {
                id: "py-9-6",
                company: "Bloomberg",
                year: 2024,
                difficulty: "Medium",
                type: "Output Prediction",
                question: "What does `raise` without arguments do inside an `except` block?",
                explanation: "Re-raises the active exception currently being handled, preserving its original stack trace."
            },
            {
                id: "py-9-7",
                company: "Uber",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the base class for all built-in non-system-exiting exceptions in Python?",
                explanation: "`Exception` is the base class for all application exceptions. `BaseException` is the root superclass above `Exception`, `SystemExit`, and `KeyboardInterrupt`."
            },
            {
                id: "py-9-8",
                company: "Adobe",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What happens if both `try` and `finally` contain a `return` statement?",
                explanation: "The `finally` block's `return` statement overrides the `try` block's `return` value and suppresses any raised exceptions."
            },
            {
                id: "py-9-9",
                company: "Goldman Sachs",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the difference between an Exception and a SyntaxError in Python?",
                explanation: "A `SyntaxError` occurs during the parsing/compilation stage before any bytecode runs. Regular exceptions (`ZeroDivisionError`, `KeyError`) occur during runtime execution."
            },
            {
                id: "py-9-10",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Coding",
                question: "Write a function that safely converts a string to integer, returning a default value on error.",
                explanation: "```python\ndef safe_int(val, default=0):\n    try:\n        return int(val)\n    except (ValueError, TypeError):\n        return default\n```"
            },
            {
                id: "py-9-11",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the `assert` statement in Python and when should it NOT be used for data validation?",
                explanation: "`assert condition, \"message\"` raises `AssertionError` if condition is false. It must NEVER be used for production data validation or security checks because running Python with `-O` (optimized) strips all assert statements from bytecode."
            },
            {
                id: "py-9-12",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "How do you access the full traceback of an exception programmatically?",
                explanation: "```python\nimport traceback\ntry:\n    1 / 0\nexcept Exception:\n    tb_str = traceback.format_exc()\n```"
            },
            {
                id: "py-9-13",
                company: "Cisco",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is `sys.exc_info()` in Python?",
                explanation: "Returns a 3-tuple `(type, value, traceback)` representing the exception currently being handled."
            },
            {
                id: "py-9-14",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What error is raised when accessing `d['unknown']` on a standard dictionary?",
                explanation: "Raises `KeyError`."
            },
            {
                id: "py-9-15",
                company: "Netflix",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is PEP 654 Exception Notes (`add_note()`) introduced in Python 3.11?",
                explanation: "Allows attaching arbitrary diagnostic context notes to an exception without re-instantiating it: `e.add_note(\"Context: user_id=123\")`."
            }
        ]
    },

    // Module 10: Advanced Python - Generators & Decorators
    10: {
        moduleTitle: "Advanced Python - Generators, Iterators & Decorators",
        questions: [
            {
                id: "py-10-1",
                company: "Google",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "How do you write a Decorator that accepts arguments in Python?",
                explanation: "A decorator with arguments requires three nested functions:\n```python\ndef repeat(num_times):\n    def decorator(func):\n        from functools import wraps\n        @wraps(func)\n        def wrapper(*args, **kwargs):\n            for _ in range(num_times):\n                result = func(*args, **kwargs)\n            return result\n        return wrapper\n    return decorator\n@repeat(3)\ndef greet(): print(\"Hello\")\n```"
            },
            {
                id: "py-10-2",
                company: "Microsoft",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the Iterator Protocol in Python? What must an object implement to be iterable?",
                explanation: "An object must implement:\n1. `__iter__()`: Returns the iterator object itself.\n2. `__next__()`: Returns the next element in sequence, or raises `StopIteration` when exhaustion is reached."
            },
            {
                id: "py-10-3",
                company: "Amazon",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "What is a Generator Function and what does the `yield` statement do?",
                explanation: "A generator function uses `yield` instead of `return`. When called, it returns a generator iterator without executing immediately. Each `next()` executes code until hitting `yield`, emits the value, and suspends function state (local variables and instruction pointer), resuming seamlessly on the next call in $O(1)$ memory."
            },
            {
                id: "py-10-4",
                company: "Meta",
                year: 2023,
                difficulty: "Hard",
                type: "Coding",
                question: "What is `functools.wraps` and why must it ALWAYS be used inside custom decorators?",
                explanation: "Without `@wraps(func)`, the wrapper function overwrites the decorated function's metadata (`__name__`, `__doc__`, and signature), causing introspection and docstrings to report `'wrapper'` instead of the original function name."
            },
            {
                id: "py-10-5",
                company: "Apple",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "What is `yield from` in Python generators?",
                explanation: "`yield from iterable` delegates generator iteration directly to a sub-generator or iterable, transparently passing two-way values, exceptions, and return values without manual `for x in sub: yield x` loops."
            },
            {
                id: "py-10-6",
                company: "Bloomberg",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "Write an infinite Fibonacci generator function in Python.",
                explanation: "```python\ndef fibonacci():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n```"
            },
            {
                id: "py-10-7",
                company: "Uber",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is a Generator Expression vs a List Comprehension?",
                explanation: "A list comprehension `[x*2 for x in range(1000)]` computes all elements eagerly in memory. A generator expression `(x*2 for x in range(1000))` returns a lazy generator iterator that computes elements on-demand in $O(1)$ RAM."
            },
            {
                id: "py-10-8",
                company: "Adobe",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "Write a Class-based Decorator in Python.",
                explanation: "```python\nclass CountCalls:\n    def __init__(self, func):\n        self.func = func\n        self.num_calls = 0\n    def __call__(self, *args, **kwargs):\n        self.num_calls += 1\n        return self.func(*args, **kwargs)\n```"
            },
            {
                id: "py-10-9",
                company: "Goldman Sachs",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What are Generator Coroutines (`send()`, `throw()`, `close()`)?",
                explanation: "Generators can receive values dynamically from callers via `val = yield expr`. Calling `gen.send(data)` injects values into the suspended generator."
            },
            {
                id: "py-10-10",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What happens when `next()` is called on an exhausted generator?",
                explanation: "Raises `StopIteration` exception."
            },
            {
                id: "py-10-11",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What module provides high-performance iterator building blocks in Python?",
                explanation: "`itertools` (`count`, `cycle`, `chain`, `combinations`, `permutations`, `islice`)."
            },
            {
                id: "py-10-12",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "How do you chain multiple iterables together in Python without creating a new list?",
                explanation: "```python\nimport itertools\ncombined = itertools.chain([1, 2], [3, 4], [5])\n```"
            },
            {
                id: "py-10-13",
                company: "Cisco",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "Can multiple decorators be stacked on a single function? In what order do they execute?",
                explanation: "Yes (`@dec1 @dec2 def f():`). They are applied from bottom to top: `f = dec1(dec2(f))`."
            },
            {
                id: "py-10-14",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Output Prediction",
                question: "What does `sys.getsizeof()` reveal when comparing a list vs a generator for 1,000,000 items?",
                explanation: "The list consumes ~8 MB of memory; the generator consumes ~120 bytes."
            },
            {
                id: "py-10-15",
                company: "Netflix",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "Write a decorator that times function execution duration and prints it.",
                explanation: "```python\nimport time\nfrom functools import wraps\ndef timeit(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        t0 = time.perf_counter()\n        res = func(*args, **kwargs)\n        print(f\"{func.__name__} took {time.perf_counter()-t0:.4f}s\")\n        return res\n    return wrapper\n```"
            }
        ]
    },

    // Module 11: Database Access & SQL
    11: {
        moduleTitle: "Database Access, SQL & Python DB-API",
        questions: [
            {
                id: "py-11-1",
                company: "Google",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Python DB-API 2.0 (PEP 249) and what core objects does it mandate?",
                explanation: "PEP 249 defines standard database interface specifications so Python code works with any RDBMS (PostgreSQL, MySQL, SQLite, Oracle). Mandates:\n1. `connect(...)`: Creates Connection object.\n2. `Connection`: Manages transactions (`.commit()`, `.rollback()`, `.cursor()`, `.close()`).\n3. `Cursor`: Executes SQL statements (`.execute()`, `.executemany()`, `.fetchone()`, `.fetchall()`)."
            },
            {
                id: "py-11-2",
                company: "Microsoft",
                year: 2023,
                difficulty: "Hard",
                type: "Coding",
                question: "Why should you NEVER use string formatting/F-strings for SQL queries, and how do Parameterized Queries prevent SQL Injection?",
                explanation: "Using F-strings (`f\"SELECT * FROM users WHERE user = '{name}'\"`) exposes the application to catastrophic SQL Injection attacks. Parameterized queries (`cursor.execute(\"SELECT * FROM users WHERE user = ?\", (name,))\`) send SQL logic and untrusted user data separately to the database engine, escaping parameters safely."
            },
            {
                id: "py-11-3",
                company: "Amazon",
                year: 2024,
                difficulty: "Medium",
                type: "Coding",
                question: "Write Python code using `sqlite3` to create a table, insert a row with transaction commit, and query it.",
                explanation: "```python\nimport sqlite3\nwith sqlite3.connect('app.db') as conn:\n    cursor = conn.cursor()\n    cursor.execute('''CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)''')\n    cursor.execute(\"INSERT INTO users (name) VALUES (?)\", (\"Alice\",))\n    conn.commit()\n    cursor.execute(\"SELECT * FROM users\")\n    rows = cursor.fetchall()\n```"
            },
            {
                id: "py-11-4",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is an ORM (Object-Relational Mapping) like SQLAlchemy or Django ORM? Pros and Cons.",
                explanation: "An ORM maps database tables to Python classes and rows to Python objects. Pros: Database engine agnostic, automatic query generation, prevents SQL injection, integrates with business logic. Cons: Slight performance overhead on complex joins, potential N+1 query problems."
            },
            {
                id: "py-11-5",
                company: "Apple",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Connection Pooling in Python web services and why is it essential?",
                explanation: "Establishing a TCP handshake and authentication with database servers is expensive. A connection pool maintains an active pool of open connections; worker threads borrow a connection, execute queries, and return it to the pool, eliminating connection startup latency."
            },
            {
                id: "py-11-6",
                company: "Bloomberg",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "How do you handle database transactions with rollback on failure in Python?",
                explanation: "```python\ntry:\n    cursor.execute(\"UPDATE accounts SET bal = bal - 100 WHERE id = 1\")\n    cursor.execute(\"UPDATE accounts SET bal = bal + 100 WHERE id = 2\")\n    conn.commit()\nexcept Exception:\n    conn.rollback()\n    raise\n```"
            },
            {
                id: "py-11-7",
                company: "Uber",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the difference between `.fetchone()`, `.fetchmany(size)`, and `.fetchall()`?",
                explanation: "- `fetchone()`: Retrieves next row as tuple/dict, or None.\n- `fetchmany(size)`: Retrieves next batch of $N$ rows (prevents loading millions of rows into RAM).\n- `fetchall()`: Loads all remaining query result rows into RAM as a list."
            },
            {
                id: "py-11-8",
                company: "Adobe",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "Which database engine is bundled directly into the Python Standard Library without requiring third-party drivers?",
                explanation: "`sqlite3` is a zero-configuration, serverless, self-contained SQL database engine included in Python's standard library."
            },
            {
                id: "py-11-9",
                company: "Goldman Sachs",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is the N+1 Query Problem in ORMs and how is it resolved in Python?",
                explanation: "Occurs when code queries a list of $N$ parent objects and then issues an individual query for each parent's child relation ($1 + N$ queries). Resolved using Eager Loading: `select_related` (SQL JOIN) or `prefetch_related` in Django, and `joinedload()` in SQLAlchemy."
            },
            {
                id: "py-11-10",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Coding",
                question: "How do you execute bulk inserts efficiently in Python DB-API?",
                explanation: "```python\nrecords = [(1, 'Alice'), (2, 'Bob')]\ncursor.executemany(\"INSERT INTO users VALUES (?, ?)\", records)\n```"
            },
            {
                id: "py-11-11",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What does `cursor.rowcount` return after an `UPDATE` or `DELETE` query?",
                explanation: "Returns the integer count of rows modified or deleted by the query."
            },
            {
                id: "py-11-12",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "How do you configure `sqlite3` to return rows as dictionaries by column name instead of tuples?",
                explanation: "```python\nconn.row_factory = sqlite3.Row\ncursor = conn.cursor()\ncursor.execute(\"SELECT * FROM users\")\nrow = cursor.fetchone()\nprint(row['name'])\n```"
            },
            {
                id: "py-11-13",
                company: "Cisco",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is an in-memory SQLite database in Python?",
                explanation: "`sqlite3.connect(':memory:')` creates a fast, transient database stored entirely in RAM that is destroyed when the connection closes, ideal for unit testing."
            },
            {
                id: "py-11-14",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What happens if you execute DML queries (`INSERT`, `UPDATE`) in SQLite without calling `conn.commit()`?",
                explanation: "Changes remain inside an uncommitted transaction and are discarded (rolled back) when the script exits or connection closes."
            },
            {
                id: "py-11-15",
                company: "Netflix",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "What is Async Database Access with `asyncpg` or `databases` in FastAPI / asyncio?",
                explanation: "Standard DB-API is blocking; it halts the event loop while waiting for DB I/O. Asynchronous drivers like `asyncpg` use non-blocking coroutines: `await conn.execute(...)` allowing thousands of concurrent web requests per process."
            }
        ]
    },

    // Module 12: Standard Library & Concurrency
    12: {
        moduleTitle: "Standard Library, Concurrency & Modern Python Tools",
        questions: [
            {
                id: "py-12-1",
                company: "Google",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "When should you use `threading` vs `multiprocessing` vs `asyncio` in Python?",
                explanation: "1. `multiprocessing`: CPU-bound tasks (data crunching, ML, encryption). Spawns separate OS processes with independent memory spaces and GILs, utilizing all CPU cores.\n2. `threading`: I/O-bound tasks with legacy synchronous libraries (file I/O, network requests). Threads release GIL during I/O wait.\n3. `asyncio`: High-concurrency I/O-bound web servers (FastAPI, WebSockets). Uses single-threaded cooperative multitasking with an Event Loop, handling 10,000+ connections with low memory overhead."
            },
            {
                id: "py-12-2",
                company: "Microsoft",
                year: 2024,
                difficulty: "Hard",
                type: "Coding",
                question: "What is `async` / `await` and how does the Event Loop work in Python `asyncio`?",
                explanation: "```python\nimport asyncio\nasync def fetch_data():\n    await asyncio.sleep(1) # Non-blocking sleep yields control back to event loop\n    return {\"status\": 200}\nasync def main():\n    results = await asyncio.gather(fetch_data(), fetch_data())\nasyncio.run(main())\n```"
            },
            {
                id: "py-12-3",
                company: "Amazon",
                year: 2024,
                difficulty: "Medium",
                type: "Coding",
                question: "How do you run concurrent tasks using `concurrent.futures.ThreadPoolExecutor`?",
                explanation: "```python\nfrom concurrent.futures import ThreadPoolExecutor\ndef download(url): return fetch(url)\nwith ThreadPoolExecutor(max_workers=5) as executor:\n    results = list(executor.map(download, urls))\n```"
            },
            {
                id: "py-12-4",
                company: "Meta",
                year: 2023,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is the `__name__ == '__main__'` idiom and why is it necessary for `multiprocessing` on Windows?",
                explanation: "It tests whether the script is being executed directly by the user versus imported as a module. In `multiprocessing` on Windows, child processes spawn by re-importing the parent script; without this guard, child processes would spawn recursive infinite child processes, crashing the OS."
            },
            {
                id: "py-12-5",
                company: "Apple",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is a Race Condition in Python threads and how does `threading.Lock` prevent it?",
                explanation: "A race condition occurs when multiple threads concurrently read and mutate shared memory. Even with the GIL, operations like `counter += 1` consist of multiple bytecode instructions (`LOAD`, `ADD`, `STORE`). A context switch between these instructions causes lost updates. `with threading.Lock():` enforces mutual exclusion."
            },
            {
                id: "py-12-6",
                company: "Bloomberg",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is IPC (Inter-Process Communication) in Python `multiprocessing`?",
                explanation: "Because processes have isolated memory spaces, data must be shared via IPC mechanisms provided in `multiprocessing`:\n- `Queue`: Thread- and process-safe FIFO queue backed by OS pipes.\n- `Pipe`: Duplex two-way communication channel.\n- `Value` / `Array`: Shared ctypes memory blocks wrapped with semaphores."
            },
            {
                id: "py-12-7",
                company: "Uber",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What does `datetime.timezone.utc` and `datetime.datetime.now(timezone.utc)` do?",
                explanation: "Produces timezone-aware UTC datetime objects, preventing subtle daylight saving and local machine clock offset bugs."
            },
            {
                id: "py-12-8",
                company: "Adobe",
                year: 2023,
                difficulty: "Easy",
                type: "Coding",
                question: "How do you parse command-line arguments in production Python using `argparse`?",
                explanation: "```python\nimport argparse\nparser = argparse.ArgumentParser(description=\"File Processor\")\nparser.add_argument(\"-f\", \"--file\", required=True, help=\"Path to file\")\nargs = parser.parse_args()\nprint(args.file)\n```"
            },
            {
                id: "py-12-9",
                company: "Goldman Sachs",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is `asyncio.TaskGroup` introduced in Python 3.11?",
                explanation: "`TaskGroup` provides modern Structured Concurrency: all child tasks launched in the group are monitored together. If one task fails, remaining tasks in the group are automatically cancelled, and exceptions are bundled into an `ExceptionGroup`."
            },
            {
                id: "py-12-10",
                company: "TCS",
                year: 2024,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the `logging` module in Python and why is it superior to `print()`?",
                explanation: "`logging` supports severity levels (`DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`), configurable output destinations (files, syslog), timestamps, thread tracking, and can be disabled or toggled per module in production."
            },
            {
                id: "py-12-11",
                company: "Infosys",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is the difference between `time.time()` and `time.perf_counter()`?",
                explanation: "`time.time()` returns system wall-clock time which can be adjusted backward by NTP. `time.perf_counter()` returns a high-resolution, monotonic clock that never steps backward, ideal for benchmarking."
            },
            {
                id: "py-12-12",
                company: "Intel",
                year: 2023,
                difficulty: "Medium",
                type: "Coding",
                question: "How do you run shell commands safely in Python using `subprocess.run()`?",
                explanation: "```python\nimport subprocess\nresult = subprocess.run([\"git\", \"status\"], capture_output=True, text=True, check=True)\nprint(result.stdout)\n```\nAvoids shell injection vulnerabilities."
            },
            {
                id: "py-12-13",
                company: "Cisco",
                year: 2024,
                difficulty: "Medium",
                type: "Conceptual",
                question: "What is a Deadlock in multithreading and how do you prevent it in Python?",
                explanation: "A deadlock occurs when Thread 1 holds Lock A and waits for Lock B, while Thread 2 holds Lock B and waits for Lock A. Prevention: Always acquire multiple locks in a strict global alphabetical order, or use lock timeouts (`lock.acquire(timeout=5)`)."
            },
            {
                id: "py-12-14",
                company: "Samsung",
                year: 2023,
                difficulty: "Easy",
                type: "Conceptual",
                question: "What is `uuid.uuid4()` used for in Python?",
                explanation: "Generates a cryptographically strong, random 128-bit UUID (Universally Unique Identifier) string with virtually zero probability of collision."
            },
            {
                id: "py-12-15",
                company: "Netflix",
                year: 2024,
                difficulty: "Hard",
                type: "Conceptual",
                question: "What is Free-Threaded CPython (No-GIL) introduced in Python 3.13 (PEP 703)?",
                explanation: "PEP 703 introduces an experimental build option in Python 3.13 that completely removes the Global Interpreter Lock (GIL). It replaces global reference counting with mimalloc thread-safe allocators and biased reference counting, allowing Python threads to execute across multiple CPU cores in true parallel fashion."
            }
        ]
    }
};

