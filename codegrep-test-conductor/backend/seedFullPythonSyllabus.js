const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
const Course = require('./models/Course');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const fullPythonModules = [
    // =========================================================================
    // MODULE 1: INTRODUCTION TO PYTHON
    // =========================================================================
    {
        orderIndex: 1,
        title: 'Module 1: Introduction to Python',
        description: 'What Python is, history, features, Python 2 vs 3, environment setup, syntax rules, input/output, variables, data types, numbers and maths.',
        lessons: [
            {
                orderIndex: 1,
                title: 'What is Python & History',
                slug: 'what-is-python-and-history',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 1.1 What is Python?
A **programming language** is a way to give instructions to a computer. Python is one of the easiest languages to read and write. Its code looks close to plain English.

- **High-level:** You do not manage memory or hardware details. Python handles allocation and garbage collection for you.
- **Interpreted:** Python runs your code line by line through an interpreter. You do not need a separate compilation step.
- **Object-oriented:** You can model real-world entities (such as a student, account, or car) as objects with state and behavior.
- **Dynamically typed:** You do not declare variable types explicitly. Writing \`x = 5\` binds \`x\` to an integer object dynamically.

### A Short History
Guido van Rossum started developing Python in the late 1980s at CWI (Centrum Wiskunde & Informatica) in the Netherlands as a successor to the ABC language. The first public release arrived in **1991** (version 0.9.0).

> The name comes from the British comedy show *Monty Python's Flying Circus*, not from the reptile!

- **Python 2.0 (2000):** Introduced list comprehensions, garbage collection, and Unicode support.
- **Python 3.0 (2008):** Designed to rectify fundamental flaws. It broke backward compatibility intentionally to clean up the language.
- **Python 2 Sunset (Jan 1, 2020):** Python 2 reached end-of-life. All modern development uses Python 3.

### What is Python Used For?
- **Web Development:** Django, Flask, FastAPI
- **Data Science & AI:** NumPy, Pandas, Matplotlib, TensorFlow, PyTorch
- **Automation & Scripting:** Web scraping (BeautifulSoup), system automation, file batch processing
- **Testing & DevOps:** Selenium, PyTest, Ansible automation
- **Desktop Apps & Games:** PyQt, Tkinter, Pygame`,
                aiSummary: {
                    summary: 'Python is a high-level, interpreted, dynamically typed language created by Guido van Rossum in 1991. Python 3 is the modern active standard.',
                    keyConcepts: ['High-level & Interpreted', 'Dynamically Typed', 'Guido van Rossum (1991)', 'Python 3 Standard'],
                    revisionNotes: 'Run `import this` in a Python terminal to read The Zen of Python.'
                }
            },
            {
                orderIndex: 2,
                title: 'Unique Features & Python 2 vs Python 3',
                slug: 'unique-features-python-2-vs-3',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 1.2 Unique Features of Python
- **Easy to Learn & Read:** Clean English-like syntax reduces cognitive friction.
- **Free and Open-Source:** Distributed under the OSI-approved PSF License for personal and commercial use.
- **Cross-Platform / Portable:** Identical source code runs without modification on Windows, macOS, and Linux.
- **Batteries Included:** Vast standard library containing math, networking, JSON, file compression, and cryptography modules.
- **Vibrant Ecosystem:** Over 400,000 community packages available via the Python Package Index (\`pip\`).

### 1.3 Python 2 vs Python 3 Comparison
Python 2 was officially retired on January 1, 2020. You only need to know differences when maintaining legacy codebases.

| Feature | Python 2 | Python 3 |
| :--- | :--- | :--- |
| **print** | Statement: \`print "Hi"\` | Function: \`print("Hi")\` |
| **Division** | \`5 / 2 = 2\` (integer floor) | \`5 / 2 = 2.5\` (true float); \`5 // 2 = 2\` |
| **Strings** | ASCII default; separate \`unicode\` type | Unicode (\`str\`) default; \`bytes\` for raw octets |
| **User Input** | \`raw_input()\` returns string, \`input()\` evaluates | \`input()\` always returns string |
| **Iteration** | \`xrange()\` lazy, \`range()\` created list in RAM | \`range()\` is an efficient lazy generator |`,
                aiSummary: {
                    summary: 'Python 3 modernized division (5/2=2.5), turned print into a function, and made Unicode the native string standard.',
                    keyConcepts: ['print() function', 'True division / vs floor //', 'Unicode by default'],
                    revisionNotes: 'Always use Python 3. Never use print without parentheses.'
                }
            },
            {
                orderIndex: 3,
                title: 'Setup, First Program & Syntax Rules',
                slug: 'setup-first-program-syntax',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 1.4 Installation & Setup
1. Download Python from **python.org**.
2. On Windows, **always check "Add python.exe to PATH"** during setup.
3. Verify your installation via terminal:
\`\`\`bash
python --version
pip --version
\`\`\`

### 1.5 Your First Python Program
Create a file named \`hello.py\`:
\`\`\`python
print("Hello, World!")
print("Name:", "Asha", "Age:", 21)
print("A", "B", sep="-")        # Custom separator: A-B
print("Line one", end=" ")      # Stay on same line
print("Line two")
\`\`\`

### 1.6 Identifiers, Keywords & Indentation
- **Identifiers:** Names for variables, functions, and classes.
  - Can contain letters, digits, and underscores (\`_\`).
  - Must **never** start with a digit (\`2name\` is invalid; \`name2\` is valid).
  - Case-sensitive: \`age\`, \`Age\`, and \`AGE\` are distinct.
- **Keywords:** Reserved words with special syntax meaning (\`if\`, \`def\`, \`class\`, \`return\`, \`while\`, \`True\`, \`False\`).
\`\`\`python
import keyword
print(keyword.kwlist)
\`\`\`
- **Indentation:** Python uses **4 spaces indentation** instead of curly braces \`{}\` to define blocks. Inconsistent indentation causes an \`IndentationError\`. Never mix tabs and spaces!`,
                codeSnippets: [
                    {
                        language: 'python',
                        title: 'Print formatting and indentation',
                        code: 'print("Item", 1, sep=" : ")\nif True:\n    print("Inside block")'
                    }
                ]
            },
            {
                orderIndex: 4,
                title: 'Comments, User Input & CLI Arguments',
                slug: 'comments-input-cli-args',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 1.7 Comments and Docstrings
Comments are explanatory notes ignored by Python:
\`\`\`python
# This is a single-line comment
x = 10  # Inline comment

def square(n):
    """Return the square of n."""  # Docstring
    return n * n

print(square.__doc__)  # Return the square of n.
\`\`\`

### 1.8 User Input
The \`input()\` function prompts the user and **always returns a string**:
\`\`\`python
name = input("Enter your name: ")
age = int(input("Enter your age: "))  # Type conversion
print(f"Hello, {name}! In five years, you will be {age + 5}.")
\`\`\`

### Command-line Arguments
Values passed when executing the script via terminal are available in \`sys.argv\`:
\`\`\`python
import sys

print("Script name:", sys.argv[0])
print("Arguments:", sys.argv[1:])

if len(sys.argv) > 1:
    print(f"Welcome, {sys.argv[1]}!")
\`\`\`
Run in terminal:
\`\`\`bash
python greet.py Asha Pune
\`\`\``
            },
            {
                orderIndex: 5,
                title: 'Variables, Data Types & Strings',
                slug: 'variables-data-types-strings',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 1.9 Variables & Memory References
A variable is a name that points to an object in heap memory:
\`\`\`python
x = 10
x = "now text"  # Dynamic reassignment

# Multiple assignment & swapping
a, b = 5, 10
a, b = b, a  # Swapped without temp variable!
print(a, b)  # 10 5
\`\`\`

### 1.10 Built-in Data Types
- **int:** Whole numbers of arbitrary precision (\`42\`, \`-7\`)
- **float:** Double-precision IEEE 754 floating point (\`3.14\`)
- **bool:** Boolean values (\`True\`, \`False\`)
- **str:** Unicode characters (\`"Python"\`, immutable)
- **list:** Ordered mutable sequence (\`[1, 2, 3]\`)
- **tuple:** Ordered immutable sequence (\`(1, 2, 3)\`)
- **dict:** Key-value mapping (\`{"name": "Asha"}\`)
- **set:** Unordered unique elements (\`{1, 2, 3}\`)
- **NoneType:** Represents absence of a value (\`None\`)

### String Operations & Slicing
\`\`\`python
s = "Python"
print(s[0], s[-1])    # 'P', 'n' (first & last)
print(s[1:4])         # 'yth' (slice from index 1 to 3)
print(s[::-1])        # 'nohtyP' (reverse string)
print(len(s), s.upper(), s.lower())
print("  hi  ".strip(), s.replace("P", "J"))
\`\`\``
            },
            {
                orderIndex: 6,
                title: 'Numbers, Maths & Built-in Functions',
                slug: 'numbers-maths-builtins',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 1.11 Core Built-in Functions
- \`len()\`: Count items
- \`type()\`: Inspect object type
- \`abs()\`: Absolute value
- \`round(val, n)\`: Round to n decimal places
- \`max()\`, \`min()\`, \`sum()\`: Aggregations
- \`sorted()\`: Returns a new sorted list

### 1.12 Arithmetic Operators
- \`+\`, \`-\`, \`*\`: Addition, subtraction, multiplication
- \`/\`: Float division (\`7 / 2\` -> \`3.5\`)
- \`//\`: Floor division (\`7 // 2\` -> \`3\`)
- \`%\`: Modulo / remainder (\`7 % 2\` -> \`1\`)
- \`**\`: Exponentiation / power (\`2 ** 5\` -> \`32\`)

### The \`math\` and \`random\` Modules
\`\`\`python
import math
import random

print(math.sqrt(25))        # 5.0
print(math.pi)              # 3.141592653589793
print(math.floor(2.9))      # 2
print(math.ceil(2.1))       # 3
print(random.randint(1, 6)) # Roll dice (1 to 6)
\`\`\``
            }
        ],
        quiz: {
            title: 'Quiz 01: Python Fundamentals & Syntax',
            passingScorePercent: 60,
            timeLimitMinutes: 15,
            questions: [
                {
                    questionText: 'What is the default return type of the input() function in Python 3?',
                    type: 'MCQ',
                    options: ['str', 'int', 'float', 'NoneType'],
                    correctAnswer: 'str',
                    explanation: 'In Python 3, input() always reads input as a string. To treat it as a number, explicit conversion with int() or float() is required.',
                    marks: 5
                },
                {
                    questionText: 'What will evaluate for the expression 17 // 5 and 17 % 5 in Python 3?',
                    type: 'MCQ',
                    options: ['3 and 2', '3.4 and 2', '3 and 0', '2 and 3'],
                    correctAnswer: '3 and 2',
                    explanation: '// performs integer floor division (17 // 5 = 3) and % computes the remainder (17 % 5 = 2).',
                    marks: 5
                },
                {
                    questionText: 'Which of the following variable identifiers is INVALID in Python?',
                    type: 'MCQ',
                    options: ['2nd_score', '_private_var', 'studentScore2', 'TOTAL_VALUE'],
                    correctAnswer: '2nd_score',
                    explanation: 'Variable names cannot start with a numeric digit. They must start with a letter (a-z, A-Z) or an underscore (_).',
                    marks: 5
                },
                {
                    questionText: 'What does s[::-1] produce on a string s = "Python"?',
                    type: 'MCQ',
                    options: ['nohtyP', 'Python', 'P', 'IndexError'],
                    correctAnswer: 'nohtyP',
                    explanation: 'Extended slice syntax [start:stop:step] with a step of -1 traverses the string backwards, effectively reversing it.',
                    marks: 5
                }
            ]
        }
    },

    // =========================================================================
    // MODULE 2: CONTROL STATEMENTS
    // =========================================================================
    {
        orderIndex: 2,
        title: 'Module 2: Control Statements',
        description: 'Decisions with if, if-else, if-elif-else, while loops, for loops, range, break, continue, pass, assert and return.',
        lessons: [
            {
                orderIndex: 1,
                title: 'Decisions with if, if-else & if-elif-else',
                slug: 'decisions-with-if-conditionals',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 2.1 Conditional Decisions in Python
Normally Python programs execute sequentially from top to bottom. Control statements let your program make decisions based on logical conditions.

\`\`\`python
age = 20
if age >= 18:
    print("You are eligible to vote")
else:
    print("Underage")
\`\`\`

### Multi-way Decisions: if-elif-else
\`\`\`python
marks = 78
if marks >= 90:
    grade = "A"
elif marks >= 75:
    grade = "B"
elif marks >= 60:
    grade = "C"
else:
    grade = "Fail"
print("Grade:", grade)  # Grade: B
\`\`\`

### Chained Comparisons & Truthiness
- **Chained comparison:** \`if 18 <= age <= 60:\`
- **Ternary Operator (One-line if):** \`status = "Adult" if age >= 18 else "Minor"\`
- **Truthy & Falsy Values:** The following evaluate to \`False\`: \`0\`, \`0.0\`, \`""\`, \`[]\`, \`{}\`, \`set()\`, and \`None\`. All non-zero and non-empty structures evaluate to \`True\`.`,
                aiSummary: {
                    summary: 'if, elif, and else execute conditional blocks. Python supports chained comparisons and evaluates empty containers as Falsy.',
                    keyConcepts: ['if-elif-else', 'Chained comparisons (18 <= age <= 60)', 'Truthy / Falsy values', 'Ternary operator'],
                    revisionNotes: 'Remember to use == for comparison and = for assignment.'
                }
            },
            {
                orderIndex: 2,
                title: 'The while Loop & while-else',
                slug: 'while-loop-and-while-else',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 2.2 The while Loop
A \`while\` loop repeatedly executes as long as its condition remains \`True\`:
\`\`\`python
n = 1
while n <= 5:
    print(n)
    n += 1
\`\`\`

### Preventing Infinite Loops
If the condition never becomes \`False\`, the loop will run forever until terminated (press \`Ctrl+C\` in terminal):
\`\`\`python
password = ""
while password != "python123":
    password = input("Enter secret password: ")
print("Access Granted!")
\`\`\`

### The \`else\` Clause on Loops
Python loops have an optional \`else\` block that runs **only if the loop finishes normally without encountering a \`break\` statement**:
\`\`\`python
count = 0
while count < 3:
    print(count)
    count += 1
else:
    print("Loop ended naturally without break")
\`\`\``
            },
            {
                orderIndex: 3,
                title: 'The for Loop & range()',
                slug: 'for-loop-and-range',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 2.3 The for Loop
A \`for\` loop iterates over items of any sequence or iterable (such as a list, string, or range):
\`\`\`python
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print("Fruit:", fruit)

for char in "Hi!":
    print(char)
\`\`\`

### Generating Sequences with \`range()\`
\`range(start, stop, step)\` produces numbers up to, but not including, \`stop\`:
- \`range(5)\`: \`0, 1, 2, 3, 4\`
- \`range(1, 6)\`: \`1, 2, 3, 4, 5\`
- \`range(0, 10, 2)\`: \`0, 2, 4, 6, 8\`
- \`range(5, 0, -1)\`: \`5, 4, 3, 2, 1\` (counting down)

\`\`\`python
# Multiplication table
for i in range(1, 6):
    print(f"5 x {i} = {5 * i}")
\`\`\`

### Nested Loops for Patterns
\`\`\`python
for row in range(1, 5):
    for col in range(row):
        print("*", end=" ")
    print()
\`\`\``
            },
            {
                orderIndex: 4,
                title: 'break, continue, pass, assert & return',
                slug: 'break-continue-pass-assert-return',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 2.4 Control Jump Statements
- **break:** Immediately terminates the loop and jumps to code following the loop.
- **continue:** Aborts the current round and skips to the next iteration.
- **pass:** A null operation; acts as a syntactic placeholder where code is required.

\`\`\`python
for i in range(1, 8):
    if i == 3:
        continue  # Skip 3
    if i == 6:
        break     # Terminate loop at 6
    print(i)      # Prints 1, 2, 4, 5
\`\`\`

### Prime Number Check with loop \`else\`
\`\`\`python
for n in range(2, 10):
    for d in range(2, n):
        if n % d == 0:
            break
    else:
        print(n, "is prime")
\`\`\`

### 2.5 \`assert\` for Debugging
\`assert condition, "Error message"\` verifies internal program invariants. If \`False\`, Python raises an \`AssertionError\`:
\`\`\`python
age = 15
assert age >= 18, "Age must be 18 or above"
\`\`\`

### 2.6 \`return\`
Exits a function and transmits computed values back to the caller.`
            }
        ],
        quiz: {
            title: 'Quiz 02: Control Flow & Branching',
            passingScorePercent: 60,
            timeLimitMinutes: 15,
            questions: [
                {
                    questionText: 'When does the else block attached to a for or while loop execute?',
                    type: 'MCQ',
                    options: [
                        'Only when the loop terminates normally without encountering a break',
                        'When a break statement is triggered',
                        'On every single iteration',
                        'Only when the loop condition is initially false'
                    ],
                    correctAnswer: 'Only when the loop terminates normally without encountering a break',
                    explanation: 'In Python, a loop else clause runs only when the loop terminates naturally (condition becomes False or iterable is exhausted) without hit by a break.',
                    marks: 5
                },
                {
                    questionText: 'What is the purpose of the pass statement in Python?',
                    type: 'MCQ',
                    options: [
                        'Acts as a no-op placeholder where a statement is syntactically required',
                        'Skips the next line of code',
                        'Forces the function to return None immediately',
                        'Terminates execution of the current loop'
                    ],
                    correctAnswer: 'Acts as a no-op placeholder where a statement is syntactically required',
                    explanation: 'pass does nothing. It is used when an empty block is required by Python syntax, such as an empty function or loop stub.',
                    marks: 5
                },
                {
                    questionText: 'What output does list(range(10, 0, -2)) produce?',
                    type: 'MCQ',
                    options: ['[10, 8, 6, 4, 2]', '[10, 8, 6, 4, 2, 0]', '[8, 6, 4, 2, 0]', '[10, 9, 8, 7]'],
                    correctAnswer: '[10, 8, 6, 4, 2]',
                    explanation: 'range stops before the stop parameter (0), so it generates 10, 8, 6, 4, and 2.',
                    marks: 5
                },
                {
                    questionText: 'Which error is raised if an assert condition evaluates to False?',
                    type: 'MCQ',
                    options: ['AssertionError', 'ValueError', 'TypeError', 'RuntimeError'],
                    correctAnswer: 'AssertionError',
                    explanation: 'When assert condition fails, Python automatically raises an AssertionError with the optional failure message.',
                    marks: 5
                }
            ]
        }
    },

    // =========================================================================
    // MODULE 3: LISTS, RANGES AND TUPLES
    // =========================================================================
    {
        orderIndex: 3,
        title: 'Module 3: Lists, Ranges and Tuples',
        description: 'Lists, list methods, copying pitfalls, iterators, generators and yield, comprehensions, lambda, ranges and tuples.',
        lessons: [
            {
                orderIndex: 1,
                title: 'Lists & Core List Operations',
                slug: 'lists-and-core-list-operations',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 3.1 Python Lists
A **list** is an ordered, mutable collection enclosed in square brackets \`[]\`. Lists can store heterogeneous types.

\`\`\`python
fruits = ["apple", "banana", "cherry"]
print(fruits[0], fruits[-1])  # 'apple', 'cherry'
fruits[1] = "mango"           # Mutable: modifies in-place
print(len(fruits))            # 3
\`\`\`

### Common List Methods
| Method | Description |
| :--- | :--- |
| \`append(x)\` | Appends \`x\` to the end of the list |
| \`insert(i, x)\` | Inserts \`x\` at index \`i\` |
| \`extend(lst)\` | Appends all elements from another iterable |
| \`remove(x)\` | Removes first occurrence of value \`x\` |
| \`pop(i)\` | Removes and returns item at index \`i\` (last item by default) |
| \`sort()\` | Sorts list in-place (\`reverse=True\` for descending) |
| \`reverse()\` | Reverses elements in-place |
| \`index(x)\` | Returns index of first occurrence of \`x\` |
| \`count(x)\` | Counts occurrences of \`x\` |

\`\`\`python
nums = [5, 2, 9, 1]
nums.append(7)
nums.sort()
print(nums)  # [1, 2, 5, 7, 9]
\`\`\``
            },
            {
                orderIndex: 2,
                title: 'Copying Trap, Iterators & Enumerate',
                slug: 'copying-trap-iterators-enumerate',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### The Copying Trap (\`b = a\` is NOT a copy)
In Python, assignment binds names to objects. Writing \`b = a\` points both variables to the **exact same list in memory**:
\`\`\`python
a = [1, 2, 3]
b = a  # Not a copy!
b.append(4)
print(a)  # [1, 2, 3, 4]  -- a changed too!

# Creating a true independent copy:
c = a.copy()  # or list(a) or a[:]
c.append(5)
print(a)      # [1, 2, 3, 4] -- safe!
\`\`\`

### 3.3 Understanding Iterators
An **iterable** is any object capable of returning its members one at a time (e.g. lists, strings). An **iterator** is the object that produces items sequentially via \`next()\`:
\`\`\`python
it = iter([10, 20, 30])
print(next(it))  # 10
print(next(it))  # 20
print(next(it))  # 30
# print(next(it)) raises StopIteration
\`\`\`

\`for\` loops use \`iter()\` and \`next()\` under the hood and catch \`StopIteration\` gracefully.`
            },
            {
                orderIndex: 3,
                title: 'Generators, yield & Comprehensions',
                slug: 'generators-yield-comprehensions',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 3.4 Generators and \`yield\`
A **generator** function pauses its execution and produces a value using \`yield\`. It remembers its internal execution state, generating elements lazily without consuming RAM for the entire sequence:
\`\`\`python
def countdown(n):
    while n > 0:
        yield n
        n -= 1

g = countdown(3)
print(next(g))  # 3
print(next(g))  # 2
for x in g:
    print(x)    # 1
\`\`\`

### 3.5 List Comprehensions
Concise syntax to transform iterables:
\`\`\`python
# [expression for item in iterable if condition]
squares = [x * x for x in range(1, 6)]         # [1, 4, 9, 16, 25]
evens   = [x for x in range(10) if x % 2 == 0] # [0, 2, 4, 6, 8]
upper   = [w.upper() for w in ["a", "b"]]      # ['A', 'B']
\`\`\`

### Lambda Expressions
Anonymous one-line functions:
\`\`\`python
double = lambda x: x * 2
print(double(5))  # 10

nums = [1, 2, 3, 4]
evens = list(filter(lambda x: x % 2 == 0, nums))  # [2, 4]
\`\`\``
            },
            {
                orderIndex: 4,
                title: 'Ranges & Ordered Tuples',
                slug: 'ranges-and-tuples',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 3.6 Ranges
A \`range\` stores only start, stop, and step parameters. It does not allocate numbers in memory:
\`\`\`python
r = range(2, 20, 3)
print(list(r))       # [2, 5, 8, 11, 14, 17]
print(len(r), 8 in r)# 6 True
print(sum(range(1, 101)))  # 5050
\`\`\`

### 3.6b Ordered Tuples (Immutable)
A **tuple** is an immutable sequence enclosed in parentheses \`()\`:
\`\`\`python
point = (3, 4)
single = (5,)  # Note trailing comma for single-item tuple

# point[0] = 10 -> Raises TypeError!

# Tuple Unpacking
x, y = point
print(x, y)  # 3 4
\`\`\`

| Feature | List | Tuple |
| :--- | :--- | :--- |
| **Syntax** | \`[1, 2]\` | \`(1, 2)\` |
| **Mutability** | Mutable (can change) | Immutable (fixed) |
| **Performance** | Slightly slower | Faster, memory-lean |
| **Dictionary Key** | Cannot be key | Can be key (hashable) |`
            }
        ],
        quiz: {
            title: 'Quiz 03: Sequences, Generators & Tuples',
            passingScorePercent: 60,
            timeLimitMinutes: 15,
            questions: [
                {
                    questionText: 'What happens when a list is modified through a reference b = a?',
                    type: 'MCQ',
                    options: [
                        'Both a and b reflect the modification since both point to the same object',
                        'Only b is updated',
                        'Python creates a shallow copy automatically',
                        'Raises a MemoryError'
                    ],
                    correctAnswer: 'Both a and b reflect the modification since both point to the same object',
                    explanation: 'Assignment (b = a) creates an alias pointing to the same heap object. Mutating through b mutates the object referenced by a.',
                    marks: 5
                },
                {
                    questionText: 'What keyword turns a standard function into a generator that produces values on demand?',
                    type: 'MCQ',
                    options: ['yield', 'generate', 'return', 'next'],
                    correctAnswer: 'yield',
                    explanation: 'yield pauses function execution, saves its local state, and yields an item to the caller on demand.',
                    marks: 5
                },
                {
                    questionText: 'What is the correct syntax for a single-element tuple?',
                    type: 'MCQ',
                    options: ['(5,)', '(5)', '[5]', 'tuple{5}'],
                    correctAnswer: '(5,)',
                    explanation: 'Without the trailing comma, (5) is parsed as an integer inside grouping parentheses, not a tuple.',
                    marks: 5
                },
                {
                    questionText: 'What does [x for x in range(6) if x % 2 != 0] produce?',
                    type: 'MCQ',
                    options: ['[1, 3, 5]', '[0, 2, 4]', '[1, 2, 3, 4, 5]', '[2, 4, 6]'],
                    correctAnswer: '[1, 3, 5]',
                    explanation: 'The comprehension filters for numbers between 0 and 5 whose remainder modulo 2 is not zero (odd numbers).',
                    marks: 5
                }
            ]
        }
    },

    // =========================================================================
    // MODULE 4: DICTIONARIES AND SETS
    // =========================================================================
    {
        orderIndex: 4,
        title: 'Module 4: Dictionaries and Sets',
        description: 'Dictionaries, hash lookups, dictionary methods, nested dictionaries, comprehensions, sets, and set theory operations.',
        lessons: [
            {
                orderIndex: 1,
                title: 'Introduction & Python Dictionaries',
                slug: 'introduction-python-dictionaries',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 4.1 Introduction to Associative Mappings
Lists look up items by sequential integer indexes (\`marks[2]\`). A **dictionary** associates values with meaningful keys, like looking up a phone number by a person's name.

| Collection | Brackets | Order | Mutability | Duplicates |
| :--- | :--- | :--- | :--- | :--- |
| **List** | \`[ ]\` | Ordered | Mutable | Allowed |
| **Tuple** | \`( )\` | Ordered | Immutable | Allowed |
| **Dictionary** | \`{k: v}\` | Insertion Order | Mutable | Keys Unique |
| **Set** | \`{ }\` | Unordered | Mutable | No Duplicates |

### 4.2 Python Dictionaries
Keys must be immutable, hashable types (strings, numbers, tuples). Values can be any object:
\`\`\`python
student = {"name": "Asha", "age": 21, "course": "Python"}
print(student["name"])    # Asha
student["city"] = "Pune"  # Add key-value
student["age"] = 22       # Update existing key
del student["course"]     # Remove key
\`\`\`

### Safe Lookup with \`get()\`
Accessing a missing key via \`student["missing"]\` raises a \`KeyError\`. Use \`get()\` for graceful lookups:
\`\`\`python
print(student.get("grade"))         # None (no crash!)
print(student.get("grade", "N/A"))  # 'N/A' (custom fallback)
print("name" in student)            # True (checks keys)
\`\`\``
            },
            {
                orderIndex: 2,
                title: 'Dictionary Methods & Comprehensions',
                slug: 'dict-methods-and-comprehensions',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### Iterating Over Dictionaries
\`\`\`python
student = {"name": "Asha", "age": 22, "city": "Pune"}

for key in student:
    print(key)

for val in student.values():
    print(val)

for key, val in student.items():
    print(f"{key} = {val}")
\`\`\`

### Core Dictionary Methods
- \`keys()\`, \`values()\`, \`items()\`: Return dynamic views
- \`update(d2)\`: Merges key-values from \`d2\`
- \`pop(k)\`: Removes key and returns its value
- \`setdefault(k, v)\`: Returns value if present, else sets \`k\` with \`v\`

### Nested Dictionaries
\`\`\`python
school = {
    "asha": {"age": 21, "marks": [80, 90]},
    "ravi": {"age": 23, "marks": [70, 75]}
}
print(school["asha"]["marks"][1])  # 90
\`\`\`

### Dictionary Comprehensions & Word Frequency
\`\`\`python
squares = {n: n * n for n in range(1, 5)}  # {1: 1, 2: 4, 3: 9, 4: 16}

# Word counter algorithm
text = "to be or not to be"
counts = {}
for word in text.split():
    counts[word] = counts.get(word, 0) + 1
print(counts)  # {'to': 2, 'be': 2, 'or': 1, 'not': 1}
\`\`\``
            },
            {
                orderIndex: 3,
                title: 'Sets in Python & Core Operations',
                slug: 'sets-and-core-operations',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 4.4 Python Sets
A **set** is an unordered collection of unique, hashable elements. Sets do not support indexing or slicing:
\`\`\`python
s = {1, 2, 3, 3, 2}
print(s)  # {1, 2, 3} (duplicates discarded)

s.add(4)
s.update([5, 6])
s.remove(6)    # Raises KeyError if missing
s.discard(99)  # No error if missing
\`\`\`

> Note: To create an empty set, write \`s = set()\`. Writing \`s = {}\` creates an empty dictionary!

### Deduplicating Collections
Converting a list to a set strips duplicate entries instantly:
\`\`\`python
nums = [1, 2, 2, 3, 4, 4, 4, 5]
unique_nums = list(set(nums))
print(unique_nums)  # [1, 2, 3, 4, 5]
\`\`\``
            },
            {
                orderIndex: 4,
                title: 'Set Theory Operations & frozenset',
                slug: 'set-theory-and-frozenset',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### Set Theory Operations
\`\`\`python
python_devs = {"Asha", "Ravi", "Meera"}
java_devs   = {"Ravi", "Karan"}

# Union (|): All members from either set
print(python_devs | java_devs)  # {'Asha', 'Ravi', 'Meera', 'Karan'}

# Intersection (&): Members present in both sets
print(python_devs & java_devs)  # {'Ravi'}

# Difference (-): In first set but not second
print(python_devs - java_devs)  # {'Asha', 'Meera'}

# Symmetric Difference (^): In one set or the other, but not both
print(python_devs ^ java_devs)  # {'Asha', 'Meera', 'Karan'}
\`\`\`

### \`frozenset\` (Immutable Set)
A \`frozenset\` cannot be modified after creation. Because it is hashable, it can be used as a dictionary key or as an element of another set:
\`\`\`python
fs = frozenset([1, 2, 3])
d = {fs: "allowed as dict key"}
\`\`\``
            }
        ],
        quiz: {
            title: 'Quiz 04: Dictionaries, Sets & Hashing',
            passingScorePercent: 60,
            timeLimitMinutes: 15,
            questions: [
                {
                    questionText: 'How do you initialize an empty set in Python?',
                    type: 'MCQ',
                    options: ['set()', '{}', '[]', 'Set.new()'],
                    correctAnswer: 'set()',
                    explanation: '{} initializes an empty dictionary. An empty set must be instantiated using set().',
                    marks: 5
                },
                {
                    questionText: 'What is the time complexity of checking membership (x in s) on a Python set?',
                    type: 'MCQ',
                    options: ['O(1) average', 'O(n)', 'O(log n)', 'O(n^2)'],
                    correctAnswer: 'O(1) average',
                    explanation: 'Sets are implemented using hash tables, offering constant-time O(1) average membership lookups.',
                    marks: 5
                },
                {
                    questionText: 'What is the result of {1, 2, 3} & {2, 3, 4}?',
                    type: 'MCQ',
                    options: ['{2, 3}', '{1, 2, 3, 4}', '{1}', '{4}'],
                    correctAnswer: '{2, 3}',
                    explanation: '& is the intersection operator, returning elements present in both sets.',
                    marks: 5
                },
                {
                    questionText: 'Which method retrieves a dictionary value safely without risking a KeyError?',
                    type: 'MCQ',
                    options: ['dict.get(key, default)', 'dict.find(key)', 'dict.search(key)', 'dict.lookup(key)'],
                    correctAnswer: 'dict.get(key, default)',
                    explanation: 'dict.get(key, default) safely returns the value if present, or None/default fallback if missing.',
                    marks: 5
                }
            ]
        }
    },

    // =========================================================================
    // MODULE 5: INPUT AND OUTPUT IN PYTHON
    // =========================================================================
    {
        orderIndex: 5,
        title: 'Module 5: Input and Output in Python',
        description: 'Reading and writing text files, appending, file modes, CSV, JSON, binary files and object serialization with pickle.',
        lessons: [
            {
                orderIndex: 1,
                title: 'Reading Text Files with Context Managers',
                slug: 'reading-text-files-context-managers',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 5.1 Reading Text Files
File operations involve three steps: **open**, **read/write**, and **close**. The \`with\` statement creates a context manager that automatically closes the file even if exceptions occur.

| Mode | Meaning | Missing File Behavior |
| :--- | :--- | :--- |
| \`"r"\` | Read (default) | Raises \`FileNotFoundError\` |
| \`"w"\` | Write (truncates / erases existing content) | Creates file |
| \`"a"\` | Append (writes at the end) | Creates file |
| \`"x"\` | Exclusive creation | Raises error if file exists |
| \`"r+"\`| Read and Write | Raises error if missing |
| add \`"b"\` | Binary mode (\`"rb"\`, \`"wb"\`) | Depends on base mode |

### Reading Techniques
\`\`\`python
# Read entire file as one string
with open("notes.txt", "r") as f:
    content = f.read()

# Iterate line by line (memory-safe for massive files)
with open("notes.txt", "r") as f:
    for line in f:
        print(line.strip())

# Cursor manipulation
with open("notes.txt", "r") as f:
    print(f.read(6))  # Reads first 6 characters
    print(f.tell())   # Reports cursor position
    f.seek(0)         # Rewinds cursor back to start
\`\`\``
            },
            {
                orderIndex: 2,
                title: 'Writing & Appending to Text Files',
                slug: 'writing-and-appending-text-files',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 5.2 Writing Text Files
\`\`\`python
with open("hello.txt", "w") as f:
    f.write("Hello\n")
    f.write("Welcome to HiGen Labs Python Platform\n")

# Writing multiple lines
lines = ["Line 1\n", "Line 2\n", "Line 3\n"]
with open("list.txt", "w") as f:
    f.writelines(lines)
\`\`\`

> ⚠️ Caution: Mode \`"w"\` overwrites the file completely. To preserve existing data, use mode \`"a"\`.

### 5.3 Appending to Files & Logging
\`\`\`python
from datetime import datetime

def log_event(message):
    with open("app.log", "a") as f:
        f.write(f"{datetime.now():%Y-%m-%d %H:%M:%S} - {message}\n")

log_event("Application booted")
log_event("User authenticated")
\`\`\``
            },
            {
                orderIndex: 3,
                title: 'Structured Files: CSV & JSON',
                slug: 'structured-files-csv-json',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### Working with CSV Files
\`\`\`python
import csv

# Writing CSV
with open("students.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["ID", "Name", "Score"])
    writer.writerow([101, "Asha", 95])
    writer.writerow([102, "Ravi", 88])

# Reading CSV
with open("students.csv", "r") as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)
\`\`\`

### Working with JSON Files
JSON is the universal, cross-language standard for persisting nested structures:
\`\`\`python
import json

data = {
    "name": "Asha",
    "scores": [95, 88, 92],
    "active": True
}

# Serialize to file
with open("student.json", "w") as f:
    json.dump(data, f, indent=2)

# Deserialize from file
with open("student.json", "r") as f:
    loaded = json.load(f)
print(loaded["scores"])  # [95, 88, 92]
\`\`\``
            },
            {
                orderIndex: 4,
                title: 'Binary Files & Pickle Serialization',
                slug: 'binary-files-and-pickle',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 5.4 Binary Files
Binary files hold raw byte buffers (images, compiled binaries, audio):
\`\`\`python
data = bytes([72, 101, 108, 108, 111])  # 'Hello' in ASCII bytes

with open("data.bin", "wb") as f:
    f.write(data)

with open("data.bin", "rb") as f:
    content = f.read()
print(content)  # b'Hello'
\`\`\`

### 5.5 Object Serialization with \`pickle\`
The \`pickle\` module serializes complex Python objects (including class instances) into binary format:
\`\`\`python
import pickle

record = {"name": "Asha", "scores": [90, 85], "passed": True}

# Save object
with open("record.pkl", "wb") as f:
    pickle.dump(record, f)

# Load object
with open("record.pkl", "rb") as f:
    restored = pickle.load(f)
print(restored["name"])  # 'Asha'
\`\`\`

> ⚠️ Security Warning: Never unpickle untrusted data. Malicious pickle payloads can execute arbitrary system code.`
            }
        ],
        quiz: {
            title: 'Quiz 05: File I/O & Serialization',
            passingScorePercent: 60,
            timeLimitMinutes: 15,
            questions: [
                {
                    questionText: 'What is the primary benefit of using "with open(...) as f" for file operations?',
                    type: 'MCQ',
                    options: [
                        'Guarantees the file is closed automatically even if exceptions occur',
                        'Makes file reads run in parallel',
                        'Automatically converts JSON to Python objects',
                        'Encrypts the file contents'
                    ],
                    correctAnswer: 'Guarantees the file is closed automatically even if exceptions occur',
                    explanation: 'The with statement implements the context manager protocol (__enter__ and __exit__), ensuring the file descriptor is released promptly.',
                    marks: 5
                },
                {
                    questionText: 'Which file opening mode will delete all preexisting content in the file?',
                    type: 'MCQ',
                    options: ['"w"', '"r"', '"a"', '"r+"'],
                    correctAnswer: '"w"',
                    explanation: 'Mode "w" opens the file for writing and truncates it to 0 bytes if it already exists.',
                    marks: 5
                },
                {
                    questionText: 'What method resets the file read/write pointer back to the beginning of the file?',
                    type: 'MCQ',
                    options: ['f.seek(0)', 'f.reset()', 'f.rewind()', 'f.tell(0)'],
                    correctAnswer: 'f.seek(0)',
                    explanation: 'f.seek(offset) repositions the byte offset stream pointer.',
                    marks: 5
                },
                {
                    questionText: 'Why should pickle NOT be used to load files from untrusted internet sources?',
                    type: 'MCQ',
                    options: [
                        'Pickle can execute arbitrary malicious Python code during deserialization',
                        'Pickle files are always corrupted during download',
                        'Pickle cannot store dictionaries',
                        'Pickle is restricted to Linux only'
                    ],
                    correctAnswer: 'Pickle can execute arbitrary malicious Python code during deserialization',
                    explanation: 'Pickle can construct arbitrary objects, meaning an attacker can craft a payload that triggers dangerous system functions upon unpickling.',
                    marks: 5
                }
            ]
        }
    },

    // =========================================================================
    // MODULE 6: FUNCTIONS, MODULES AND PACKAGES
    // =========================================================================
    {
        orderIndex: 6,
        title: 'Module 6: Functions, Modules and Packages',
        description: 'Built-in functions, defining functions, argument types, lambda functions, scope (LEGB), modules, packages, and pip.',
        lessons: [
            {
                orderIndex: 1,
                title: 'Built-in Functions & Defining Functions',
                slug: 'built-in-and-defining-functions',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 6.1 Python Built-in Functions
Python provides numerous built-in utilities:
\`\`\`python
print(len("python"), abs(-7), round(2.567, 1))     # 6 7 2.6
print(max([3, 8, 1]), min([4, 2]), sum([1, 2, 3])) # 8 2 6
print(sorted([3, 1, 2], reverse=True))             # [3, 2, 1]
print(list(zip(["a", "b"], [1, 2])))               # [('a', 1), ('b', 2)]
\`\`\`

### 6.2 Defining Functions with \`def\`
\`\`\`python
def greet(name="Student"):
    """Greeting docstring."""
    return f"Hello, {name}!"

msg = greet("Asha")
print(msg)  # Hello, Asha!
\`\`\``
            },
            {
                orderIndex: 2,
                title: 'Argument Types (*args, **kwargs) & Defaults',
                slug: 'argument-types-args-kwargs',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### Types of Function Arguments
1. **Positional Arguments:** Matched by position.
2. **Keyword Arguments:** Matched by name.
3. **Default Arguments:** Assigned fallback values if omitted.
4. **Arbitrary Positional Arguments (\`*args\`):** Bundled into a **tuple**.
5. **Arbitrary Keyword Arguments (\`**kwargs\`):** Bundled into a **dictionary**.

\`\`\`python
def calculate_summary(*values, multiplier=1, **meta):
    total = sum(values) * multiplier
    print("Meta Details:", meta)
    return total

res = calculate_summary(10, 20, 30, multiplier=2, author="Asha", category="Math")
print("Result:", res)  # 120
\`\`\`

### The Mutable Default Trap
> ⚠️ Never write \`def append_to(item, target=[])\`. The default list is created once at function definition and reused across every invocation! Use \`target=None\` and initialize inside.`
            },
            {
                orderIndex: 3,
                title: 'Variable Scope (LEGB) & Lambda Functions',
                slug: 'scope-legb-and-lambda',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### Variable Scope & The LEGB Rule
Python resolves variable names in this priority order:
1. **L**ocal: Inside the current function
2. **E**nclosing: In any enclosing outer functions (closures)
3. **G**lobal: At module top-level
4. **B**uilt-in: Python's reserved built-in names

\`\`\`python
counter = 0

def increment():
    global counter  # Required to modify global reference
    counter += 1
\`\`\`

### Anonymous (Lambda) Functions
\`\`\`python
square = lambda x: x * x
print(square(6))  # 36

# Sorting collections by custom key
students = [("Asha", 95), ("Ravi", 80), ("Meera", 92)]
students.sort(key=lambda s: s[1], reverse=True)
print(students)  # [('Asha', 95), ('Meera', 92), ('Ravi', 80)]
\`\`\``
            },
            {
                orderIndex: 4,
                title: 'Recursion, Closures & Decorators',
                slug: 'recursion-closures-decorators',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### Recursion
A function calling itself to solve smaller subproblems:
\`\`\`python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 120
\`\`\`

### Decorators
A decorator is a callable that wraps another function to augment its behavior without modifying its source:
\`\`\`python
import time

def timing_decorator(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        duration = time.time() - start
        print(f"{func.__name__} completed in {duration:.4f}s")
        return result
    return wrapper

@timing_decorator
def process_data():
    sum(range(1000000))

process_data()
\`\`\``
            },
            {
                orderIndex: 5,
                title: 'Modules, Packages & pip',
                slug: 'modules-packages-and-pip',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 6.5 Modules
A **module** is simply a \`.py\` file containing reusable code.
\`\`\`python
# math_utils.py
PI = 3.14159
def circle_area(r):
    return PI * r * r
\`\`\`
Importing in \`main.py\`:
\`\`\`python
import math_utils
from math_utils import circle_area, PI
import math_utils as mu
\`\`\`

### The \`__name__ == "__main__"\` Idiom
\`\`\`python
def main():
    print("Executing as standalone script")

if __name__ == "__main__":
    main()
\`\`\`

### Packages & pip
A package is a folder containing modules and an \`__init__.py\` file:
\`\`\`bash
pip install requests numpy
pip freeze > requirements.txt
\`\`\``
            }
        ],
        quiz: {
            title: 'Quiz 06: Functions, Scope & Modules',
            passingScorePercent: 60,
            timeLimitMinutes: 15,
            questions: [
                {
                    questionText: 'What structure receives values passed into *args in a function definition?',
                    type: 'MCQ',
                    options: ['Tuple', 'List', 'Dictionary', 'Set'],
                    correctAnswer: 'Tuple',
                    explanation: '*args packs arbitrary positional arguments into a tuple.',
                    marks: 5
                },
                {
                    questionText: 'What is the order of variable resolution in Python?',
                    type: 'MCQ',
                    options: ['Local, Enclosing, Global, Built-in', 'Global, Local, Enclosing, Built-in', 'Built-in, Global, Local, Enclosing', 'Local, Global, Enclosing, Built-in'],
                    correctAnswer: 'Local, Enclosing, Global, Built-in',
                    explanation: 'The LEGB rule defines resolution: Local first, then Enclosing, then Global, and finally Built-in.',
                    marks: 5
                },
                {
                    questionText: 'What is __name__ set to when a Python script is imported as a module?',
                    type: 'MCQ',
                    options: ['The module file name', '"__main__"', 'None', '"module"'],
                    correctAnswer: 'The module file name',
                    explanation: 'When imported, __name__ matches the module name. When run directly, it is "__main__".',
                    marks: 5
                },
                {
                    questionText: 'Why is def func(val, items=[]) discouraged in Python?',
                    type: 'MCQ',
                    options: [
                        'The default list is bound at definition time and shared across subsequent calls',
                        'It causes a SyntaxError',
                        'Python does not allow list default arguments',
                        'Lists cannot be passed as arguments'
                    ],
                    correctAnswer: 'The default list is bound at definition time and shared across subsequent calls',
                    explanation: 'Default arguments are evaluated once when the function is defined, causing mutable defaults to persist mutations across calls.',
                    marks: 5
                }
            ]
        }
    },

    // =========================================================================
    // MODULE 7: OBJECT-ORIENTED PYTHON
    // =========================================================================
    {
        orderIndex: 7,
        title: 'Module 7: Object-Oriented Python',
        description: 'Classes, objects, self, constructors, variable types, namespaces, methods, inheritance, polymorphism, abstract classes and interfaces.',
        lessons: [
            {
                orderIndex: 1,
                title: 'Overview of OOP & Classes',
                slug: 'overview-of-oop-and-classes',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 7.1 Object-Oriented Programming (OOP)
OOP organizes software design around objects rather than functions.
- **Class:** A blueprint defining attributes and methods.
- **Object (Instance):** A concrete instance built from the blueprint.

### The Four Pillars of OOP
1. **Encapsulation:** Bundling data and methods into a single unit and restricting direct external access.
2. **Inheritance:** Enabling a new class to inherit fields and methods from an existing parent.
3. **Polymorphism:** Allowing different classes to respond to identical method names in class-specific ways.
4. **Abstraction:** Exposing essential operational interfaces while concealing internal mechanics.`
            },
            {
                orderIndex: 2,
                title: 'self, Constructors (__init__) & __str__',
                slug: 'self-constructors-str',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 7.2 The \`self\` Variable & \`__init__\`
\`self\` represents the specific instance invoking the method. The \`__init__\` constructor initializes newly allocated objects:
\`\`\`python
class Student:
    def __init__(self, name, marks):
        self.name = name    # Instance variable
        self.marks = marks

    def display(self):
        print(f"{self.name} scored {self.marks}")

    def __str__(self):
        return f"Student(name={self.name}, marks={self.marks})"

s1 = Student("Asha", 95)
s1.display()
print(s1)  # Student(name=Asha, marks=95)
\`\`\``
            },
            {
                orderIndex: 3,
                title: 'Instance vs Class Variables & Namespaces',
                slug: 'variables-and-namespaces',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 7.4 Types of Variables
- **Instance Variables:** Bound to \`self\`; unique to each instance.
- **Class (Static) Variables:** Defined directly inside the class body; shared by all instances.
- **Local Variables:** Defined inside a method; discarded upon method return.

\`\`\`python
class Employee:
    company = "HiGen Labs"  # Shared class variable

    def __init__(self, name, salary):
        self.name = name      # Instance variable
        self.salary = salary  # Instance variable

e1 = Employee("Asha", 60000)
e2 = Employee("Ravi", 55000)
print(e1.company, e2.company)  # HiGen Labs HiGen Labs
\`\`\``
            },
            {
                orderIndex: 4,
                title: 'Types of Methods & Access Control',
                slug: 'method-types-and-access-control',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 7.6 Types of Methods
\`\`\`python
class Account:
    bank_name = "PyBank"
    total_accounts = 0

    def __init__(self, owner, balance):
        self.owner = owner
        self._code = "Protected"  # Protected convention
        self.__balance = balance  # Private (name mangled)
        Account.total_accounts += 1

    # Instance Method: Receives self
    def deposit(self, amt):
        self.__balance += amt

    # Class Method: Receives cls
    @classmethod
    def get_total_accounts(cls):
        return cls.total_accounts

    # Static Method: Receives no implicit arguments
    @staticmethod
    def is_valid_amount(amt):
        return amt > 0
\`\`\`

> 💡 Private variables with double leading underscores (\`__balance\`) undergo **name mangling** to \`_Account__balance\`.`
            },
            {
                orderIndex: 5,
                title: 'Inheritance, super() & Polymorphism',
                slug: 'inheritance-super-polymorphism',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 7.8 Inheritance and Method Overriding
\`\`\`python
class Person:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return f"{self.name} speaks"

class Teacher(Person):
    def __init__(self, name, subject):
        super().__init__(name)  # Call parent constructor
        self.subject = subject

    def speak(self):  # Overriding
        return f"{super().speak()} about {self.subject}"

t = Teacher("Meera", "Computer Science")
print(t.speak())  # Meera speaks about Computer Science
\`\`\`

### Method Resolution Order (MRO)
In multiple inheritance, Python resolves methods via C3 Linearization (\`Class.__mro__\`).`
            },
            {
                orderIndex: 6,
                title: 'Abstract Classes & Interfaces (abc)',
                slug: 'abstract-classes-and-interfaces',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 7.10 Abstract Base Classes (ABC)
An abstract class cannot be instantiated directly and forces subclasses to implement required abstract methods:
\`\`\`python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Rectangle(Shape):
    def __init__(self, w, h):
        self.w, self.h = w, h

    def area(self):
        return self.w * self.h

rect = Rectangle(4, 5)
print("Area:", rect.area())  # 20
# Shape() raises TypeError: Can't instantiate abstract class
\`\`\``
            }
        ],
        quiz: {
            title: 'Quiz 07: Object-Oriented Programming',
            passingScorePercent: 60,
            timeLimitMinutes: 15,
            questions: [
                {
                    questionText: 'What is the role of self in Python instance methods?',
                    type: 'MCQ',
                    options: [
                        'References the specific instance calling the method',
                        'Refers to the class object itself',
                        'Is a reserved global keyword',
                        'Allocates memory from the OS'
                    ],
                    correctAnswer: 'References the specific instance calling the method',
                    explanation: 'self is the explicit reference to the current instance invoking the method.',
                    marks: 5
                },
                {
                    questionText: 'What decorator defines a method that operates on class state rather than an instance?',
                    type: 'MCQ',
                    options: ['@classmethod', '@staticmethod', '@property', '@abstractmethod'],
                    correctAnswer: '@classmethod',
                    explanation: '@classmethod receives the class object (cls) as its first argument.',
                    marks: 5
                },
                {
                    questionText: 'How does Python implement access protection for variables with double leading underscores (__attr)?',
                    type: 'MCQ',
                    options: ['Name mangling to _ClassName__attr', 'Hardware-level memory locking', 'Throws a CompilationError', 'Encrypts the variable value'],
                    correctAnswer: 'Name mangling to _ClassName__attr',
                    explanation: 'Python mangles double underscore variables by prepending _ClassName to prevent accidental subclass collisions.',
                    marks: 5
                },
                {
                    questionText: 'What module provides the ABC class and @abstractmethod decorator?',
                    type: 'MCQ',
                    options: ['abc', 'oop', 'abstract', 'classes'],
                    correctAnswer: 'abc',
                    explanation: 'The standard library module abc (Abstract Base Classes) provides tools for defining interfaces.',
                    marks: 5
                }
            ]
        }
    },

    // =========================================================================
    // MODULE 8: EXCEPTIONS
    // =========================================================================
    {
        orderIndex: 8,
        title: 'Module 8: Exceptions',
        description: 'Compile-time, runtime, and logical errors, try-except-else-finally blocks, standard exceptions, raising and custom exceptions.',
        lessons: [
            {
                orderIndex: 1,
                title: 'Error Classification & Exceptions',
                slug: 'error-classification-and-exceptions',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 8.1 The Three Classes of Errors
1. **Compile-time (Syntax) Errors:** Violations of Python grammar caught by the parser before running (e.g. missing colon, invalid indentation).
2. **Runtime Errors (Exceptions):** Detected while the program executes (e.g. dividing by zero, missing file).
3. **Logical Errors:** Code runs without errors but computes incorrect outputs due to algorithmic flaws.

### 8.2 What is an Exception?
An exception is a runtime error object. If not intercepted and handled, Python halts execution and outputs a **traceback** identifying the call stack.`
            },
            {
                orderIndex: 2,
                title: 'Handling with try, except, else & finally',
                slug: 'try-except-else-finally',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 8.3 The Complete Handling Structure
\`\`\`python
try:
    num = int(input("Enter divisor: "))
    result = 100 / num
except ValueError:
    print("Invalid number entered")
except ZeroDivisionError:
    print("Cannot divide by zero")
else:
    # Executes ONLY if no exceptions were raised
    print("Computation succeeded:", result)
finally:
    # ALWAYS executes, whether exceptions occurred or not
    print("Execution finalized (cleanup).")
\`\`\`

> 💡 Use \`else\` for code that depends on the success of the \`try\` block. Use \`finally\` to release external resources (files, sockets).`
            },
            {
                orderIndex: 3,
                title: 'Standard Built-in Exceptions',
                slug: 'standard-builtin-exceptions',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 8.7 Common Python Exceptions
- \`ZeroDivisionError\`: Division or modulo by zero
- \`ValueError\`: Appropriate type but inappropriate value (\`int("abc")\`)
- \`TypeError\`: Incompatible data types (\`"5" + 3\`)
- \`IndexError\`: Accessing sequence index out of bounds
- \`KeyError\`: Missing dictionary key
- \`FileNotFoundError\`: Target file does not exist
- \`AttributeError\`: Nonexistent object attribute or method
- \`KeyboardInterrupt\`: User pressed \`Ctrl+C\`

All standard exceptions inherit from \`BaseException\` via \`Exception\`.`
            },
            {
                orderIndex: 4,
                title: 'Raising & User-Defined Exceptions',
                slug: 'raising-and-custom-exceptions',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 8.8 Raising Exceptions
Trigger exceptions deliberately using \`raise\`:
\`\`\`python
def set_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative")
    return age
\`\`\`

### 8.9 Creating Custom Exceptions
Inherit from \`Exception\`:
\`\`\`python
class InsufficientFundsError(Exception):
    def __init__(self, balance, required):
        super().__init__(f"Balance {balance} is less than required {required}")
        self.balance = balance
        self.required = required

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFundsError(balance, amount)
    return balance - amount

try:
    withdraw(100, 500)
except InsufficientFundsError as e:
    print("Transaction Failed:", e)
\`\`\``
            }
        ],
        quiz: {
            title: 'Quiz 08: Exception Handling & Robustness',
            passingScorePercent: 60,
            timeLimitMinutes: 15,
            questions: [
                {
                    questionText: 'When does the else block of a try...except...else...finally statement execute?',
                    type: 'MCQ',
                    options: [
                        'Only when no exception is raised inside the try block',
                        'When an unhandled exception occurs',
                        'On every execution regardless of errors',
                        'Only after the finally block finishes'
                    ],
                    correctAnswer: 'Only when no exception is raised inside the try block',
                    explanation: 'The else block runs only if the try block completed successfully without raising any exceptions.',
                    marks: 5
                },
                {
                    questionText: 'Which block is guaranteed to run for resource cleanup even if an exception crashes the try block?',
                    type: 'MCQ',
                    options: ['finally', 'else', 'except', 'catch'],
                    correctAnswer: 'finally',
                    explanation: 'finally executes under all circumstances, even after return statements or unhandled exceptions.',
                    marks: 5
                },
                {
                    questionText: 'What base class must all user-defined exceptions inherit from in Python?',
                    type: 'MCQ',
                    options: ['Exception', 'BaseError', 'SystemError', 'ErrorObject'],
                    correctAnswer: 'Exception',
                    explanation: 'User-defined custom exceptions should always subclass Exception (or one of its specific derivatives).',
                    marks: 5
                },
                {
                    questionText: 'What error is raised when attempting to convert int("hello")?',
                    type: 'MCQ',
                    options: ['ValueError', 'TypeError', 'SyntaxError', 'ConversionError'],
                    correctAnswer: 'ValueError',
                    explanation: 'The string type is correct for int conversion, but its contents represent an invalid literal, triggering ValueError.',
                    marks: 5
                }
            ]
        }
    },

    // =========================================================================
    // MODULE 9: PYTHON REGULAR EXPRESSIONS
    // =========================================================================
    {
        orderIndex: 9,
        title: 'Module 9: Python Regular Expressions',
        description: 'Regex patterns, re module, raw strings, match vs search, findall, sub, groups, greedy vs lazy matching, and validation.',
        lessons: [
            {
                orderIndex: 1,
                title: 'Introduction to RegEx & Pattern Symbols',
                slug: 'introduction-to-regex-symbols',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 9.1 Regular Expressions in Python
A **regular expression (regex)** describes search patterns for string matching, extraction, and validation. Python provides the built-in \`re\` module.

Always use **raw strings** (\`r"\\d+"\`) to prevent Python from interpreting backslashes.

### Regex Metacharacters
| Symbol | Meaning | Example |
| :--- | :--- | :--- |
| \`.\` | Any character except newline (wildcard) | \`c.t\` matches cat, cot |
| \`\\d\` / \`\\D\` | Digit \`[0-9]\` / Non-digit | \`\\d\\d\` matches 42 |
| \`\\w\` / \`\\W\` | Word char \`[a-zA-Z0-9_]\` / Non-word | \`\\w+\` matches python_1 |
| \`\\s\` / \`\\S\` | Whitespace / Non-whitespace | \`\\s+\` |
| \`^\` / \`$\` | String start / String end | \`^Order\` |
| \`*\` | 0 or more repetitions | \`ab*\` |
| \`+\` | 1 or more repetitions | \`\\d+\` |
| \`?\` | 0 or 1 repetition (optional) | \`colou?r\` |
| \`{n,m}\` | Between n and m repetitions | \`\\d{4,6}\` |
| \`[abc]\` | Character set (any of a, b, c) | \`[A-Z]\` |
| \`(...)\` | Group and capture | \`(\\d+)-(\\d+)\` |
| \`|\` | Alternation (OR) | \`cat|dog\` |`
            },
            {
                orderIndex: 2,
                title: 'match vs search vs fullmatch',
                slug: 'match-search-fullmatch',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 9.2 \`re.match()\` vs 9.3 \`re.search()\`
- \`re.match(pattern, text)\`: Searches **only at the very beginning** of the string.
- \`re.search(pattern, text)\`: Scans **anywhere** throughout the string and returns the first match.
- \`re.fullmatch(pattern, text)\`: Requires the **entire string** to match the pattern.

\`\`\`python
import re

text = "Order 4521 shipped"
print(re.match(r"Order", text))   # Match object
print(re.match(r"\d+", text))     # None (digits are not at index 0)
print(re.search(r"\d+", text))    # Match object (found 4521!)
\`\`\`

### Inspecting Match Objects
\`\`\`python
m = re.search(r"\d+", text)
if m:
    print(m.group())  # '4521'
    print(m.span())   # (6, 10)
\`\`\``
            },
            {
                orderIndex: 3,
                title: 'findall, finditer & Substitution (sub)',
                slug: 'findall-finditer-sub',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### Extracting All Occurrences
\`\`\`python
import re

text = "Items: 12 apples, 45 oranges, 9 bananas"
print(re.findall(r"\d+", text))  # ['12', '45', '9']

for m in re.finditer(r"\d+", text):
    print(f"Found {m.group()} at index {m.start()}")
\`\`\`

### 9.5 Search and Replace (\`re.sub\`)
\`\`\`python
# Collapse consecutive spaces
print(re.sub(r"\s+", " ", "too   many    spaces"))

# Mask sensitive digits
print(re.sub(r"\d", "*", "Account 4829"))  # Account ****

# Rearrange dates using captured groups
raw_date = "12-03-2026"
rearranged = re.sub(r"(\d+)-(\d+)-(\d+)", r"\\3/\\2/\\1", raw_date)
print(rearranged)  # 2026/03/12
\`\`\``
            },
            {
                orderIndex: 4,
                title: 'Extended Patterns, Greedy Matching & Validation',
                slug: 'extended-patterns-and-validation',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### Greedy vs Lazy Matching
By default, quantifiers (\`*\`, \`+\`) are **greedy**—they match as much text as possible. Append \`?\` to make them **lazy**:
\`\`\`python
html = "<b>Bold 1</b> and <b>Bold 2</b>"
print(re.findall(r"<b>.*</b>", html))   # Greedy: captures across entire line
print(re.findall(r"<b>.*?</b>", html))  # Lazy: ['<b>Bold 1</b>', '<b>Bold 2</b>']
\`\`\`

### Real-world Validation Functions
\`\`\`python
def is_valid_email(email):
    return bool(re.fullmatch(r"[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}", email))

def is_valid_phone(phone):
    return bool(re.fullmatch(r"[6-9]\d{9}", phone))  # Indian 10-digit mobile

print(is_valid_email("asha@example.com"))  # True
print(is_valid_phone("9876543210"))       # True
\`\`\``
            }
        ],
        quiz: {
            title: 'Quiz 09: Regular Expressions',
            passingScorePercent: 60,
            timeLimitMinutes: 15,
            questions: [
                {
                    questionText: 'What is the key difference between re.match() and re.search()?',
                    type: 'MCQ',
                    options: [
                        're.match matches only at the beginning of the string, while re.search matches anywhere',
                        're.match is faster for files',
                        're.search only returns integers',
                        're.match checks the full string length'
                    ],
                    correctAnswer: 're.match matches only at the beginning of the string, while re.search matches anywhere',
                    explanation: 're.match is anchored to index 0, whereas re.search searches throughout the entire string.',
                    marks: 5
                },
                {
                    questionText: 'How is a greedy quantifier turned into a non-greedy (lazy) quantifier?',
                    type: 'MCQ',
                    options: ['By appending a question mark (?)', 'By using square brackets', 'By adding raw string r', 'By escaping with backslash'],
                    correctAnswer: 'By appending a question mark (?)',
                    explanation: 'Appending ? to quantifiers like *? or +? makes them lazy, matching the minimum characters necessary.',
                    marks: 5
                },
                {
                    questionText: 'What does the metacharacter \\d represent in Python regex?',
                    type: 'MCQ',
                    options: ['Any numeric digit [0-9]', 'Any letter character', 'Any whitespace character', 'Any punctuation symbol'],
                    correctAnswer: 'Any numeric digit [0-9]',
                    explanation: '\\d matches any decimal digit equivalent to [0-9].',
                    marks: 5
                },
                {
                    questionText: 'What function replaces matching patterns with substitute text?',
                    type: 'MCQ',
                    options: ['re.sub()', 're.replace()', 're.swap()', 're.mutate()'],
                    correctAnswer: 're.sub()',
                    explanation: 're.sub(pattern, replacement, string) substitutes all matching occurrences.',
                    marks: 5
                }
            ]
        }
    },

    // =========================================================================
    // MODULE 10: PYTHON MULTITHREADED PROGRAMMING
    // =========================================================================
    {
        orderIndex: 10,
        title: 'Module 10: Python Multithreaded Programming',
        description: 'Threads vs processes, the Global Interpreter Lock (GIL), threading module, synchronization with Locks, Semaphores, deadlocks and daemon threads.',
        lessons: [
            {
                orderIndex: 1,
                title: 'Processes vs Threads & The GIL',
                slug: 'processes-vs-threads-and-gil',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 10.1 What is Multithreading?
A **thread** is an independent path of execution inside a program. **Multithreading** allows several threads to run concurrently, keeping applications responsive.

| Property | Process | Thread |
| :--- | :--- | :--- |
| **Definition** | An executing program instance | Unit of execution within a process |
| **Memory** | Dedicated, isolated memory space | Shares heap memory with peer threads |
| **Cost** | Heavy creation and context-switch cost | Lightweight |
| **Crash Impact** | Process crash is isolated | Thread crash can corrupt the entire process |

### 10.3 The Global Interpreter Lock (GIL)
CPython enforces a mutex called the **GIL**, allowing **only one native thread to execute Python bytecodes at any given moment**.
- **I/O-Bound Work (Network, Disks, DBs):** Threads excel! Waiting threads release the GIL.
- **CPU-Bound Work (Heavy Math, Image Processing):** Threads do not improve performance. Use the \`multiprocessing\` module instead.`
            },
            {
                orderIndex: 2,
                title: 'Starting Threads & The threading Module',
                slug: 'starting-threads-threading-module',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 10.5 Spawning Threads
\`\`\`python
import threading
import time

def download_task(file_name, delay):
    print(f"Starting {file_name}")
    time.sleep(delay)  # Simulates network latency
    print(f"Finished {file_name}")

t1 = threading.Thread(target=download_task, args=("file1.zip", 2))
t2 = threading.Thread(target=download_task, args=("file2.zip", 2))

t1.start()  # Launch thread
t2.start()

t1.join()   # Wait for t1 completion
t2.join()   # Wait for t2 completion
print("All downloads finished in ~2 seconds instead of 4!")
\`\`\`

### Subclassing \`threading.Thread\`
\`\`\`python
class WorkerThread(threading.Thread):
    def __init__(self, task_id):
        super().__init__()
        self.task_id = task_id

    def run(self):
        print(f"Worker {self.task_id} running")

WorkerThread(1).start()
\`\`\``
            },
            {
                orderIndex: 3,
                title: 'Thread Synchronization & Race Conditions',
                slug: 'thread-synchronization-locks',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 10.6 Race Conditions
Because threads share memory, concurrent updates to mutable variables lead to data corruption:
\`\`\`python
counter = 0

def add():
    global counter
    for _ in range(100000):
        counter += 1  # Read, Modify, Write is not atomic!
\`\`\`

### Protecting Critical Sections with \`threading.Lock\`
A lock ensures only one thread can execute a protected section at a time:
\`\`\`python
counter = 0
lock = threading.Lock()

def safe_add():
    global counter
    for _ in range(100000):
        with lock:  # Automatically acquires and releases
            counter += 1
\`\`\`
Using \`with lock:\` ensures the lock is released even if an exception occurs.`
            },
            {
                orderIndex: 4,
                title: 'Semaphores, Queues & Producer-Consumer',
                slug: 'semaphores-queues-producer-consumer',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### Semaphores: Limiting Concurrent Access
A **Semaphore** manages an internal counter, permitting up to \`N\` concurrent threads:
\`\`\`python
sem = threading.Semaphore(3)  # Allow max 3 connections simultaneously

def access_api(client_id):
    with sem:
        print(f"Client {client_id} active")
        time.sleep(1)
\`\`\`

### Thread-Safe Data Transfer with \`queue.Queue\`
\`\`\`python
from queue import Queue

q = Queue()

def producer():
    for item in range(5):
        q.put(item)
    q.put(None)  # Sentinel to stop

def consumer():
    while (item := q.get()) is not None:
        print(f"Consumed: {item}")
\`\`\``
            },
            {
                orderIndex: 5,
                title: 'Deadlocks & Daemon Threads',
                slug: 'deadlocks-and-daemon-threads',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 10.7 Deadlocks
A deadlock occurs when two or more threads wait indefinitely for locks held by each other.
- **Rule 1: Lock Ordering:** Always acquire multiple locks in identical order across all threads.
- **Rule 2: Timeouts:** Use \`lock.acquire(timeout=2)\` instead of blocking forever.

### 10.9 Daemon Threads
A **daemon thread** runs in the background. When all normal non-daemon threads finish, the program terminates immediately, stopping daemon threads mid-execution:
\`\`\`python
def heartbeat():
    while True:
        print("System pulse...")
        time.sleep(1)

d = threading.Thread(target=heartbeat, daemon=True)
d.start()
time.sleep(3)
print("Main program exited")  # Daemon is abruptly terminated
\`\`\``
            }
        ],
        quiz: {
            title: 'Quiz 10: Multithreading & Concurrency',
            passingScorePercent: 60,
            timeLimitMinutes: 15,
            questions: [
                {
                    questionText: 'What type of workload benefits most from multithreading in CPython?',
                    type: 'MCQ',
                    options: ['I/O-bound tasks (network, disk, DB)', 'CPU-bound numerical computing', 'Cryptographic hashing', 'Video rendering'],
                    correctAnswer: 'I/O-bound tasks (network, disk, DB)',
                    explanation: 'The GIL allows only one thread to execute Python bytecode at a time, but threads waiting for I/O release the GIL, yielding high concurrency.',
                    marks: 5
                },
                {
                    questionText: 'What happens to a daemon thread when all non-daemon threads finish execution?',
                    type: 'MCQ',
                    options: [
                        'It is terminated abruptly and the program exits',
                        'It continues running indefinitely in the background',
                        'It automatically converts to a non-daemon thread',
                        'It raises an unhandled ThreadError'
                    ],
                    correctAnswer: 'It is terminated abruptly and the program exits',
                    explanation: 'The Python process exits as soon as all non-daemon threads complete, immediately killing any active daemon threads.',
                    marks: 5
                },
                {
                    questionText: 'Which synchronization primitive is designed to limit concurrent access to a fixed capacity N?',
                    type: 'MCQ',
                    options: ['Semaphore', 'Lock', 'Barrier', 'Event'],
                    correctAnswer: 'Semaphore',
                    explanation: 'A Semaphore maintains an internal counter decremented by acquire() and incremented by release(), capping concurrency to N.',
                    marks: 5
                },
                {
                    questionText: 'Why should you invoke thread.start() instead of thread.run()?',
                    type: 'MCQ',
                    options: [
                        'start() creates a new OS thread of execution, while run() executes synchronously in the caller thread',
                        'run() is deprecated in Python 3',
                        'start() compiles bytecode to machine code',
                        'There is no difference'
                    ],
                    correctAnswer: 'start() creates a new OS thread of execution, while run() executes synchronously in the caller thread',
                    explanation: 'Calling start() asks the OS thread scheduler to spin up a new thread that invokes run() asynchronously.',
                    marks: 5
                }
            ]
        }
    },

    // =========================================================================
    // MODULE 11: USING DATABASES IN PYTHON
    // =========================================================================
    {
        orderIndex: 11,
        title: 'Module 11: Using Databases in Python',
        description: 'Database basics, MySQL drivers, connecting, CREATE, INSERT, READ, DDL and DML operations, SQL injection defense, and sqlite3.',
        lessons: [
            {
                orderIndex: 1,
                title: 'Database Basics & Driver Installation',
                slug: 'database-basics-and-drivers',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 11.1 Relational Database Fundamentals
A **relational database** stores structured records in tables consisting of rows and columns. Python connects to relational engines (MySQL, PostgreSQL, SQLite) using standardized **DB-API** drivers.

### 11.2 Installing Python Drivers
\`\`\`bash
# Official Oracle driver
pip install mysql-connector-python

# Pure-Python alternative
pip install PyMySQL

# High-performance C-wrapper
pip install mysqlclient
\`\`\`

### Testing Driver Installation
\`\`\`python
import mysql.connector
print(mysql.connector.__version__)
\`\`\``
            },
            {
                orderIndex: 2,
                title: 'Creating Database Connections',
                slug: 'creating-database-connections',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 11.3 Establishing Connections & Cursors
\`\`\`python
import mysql.connector
from mysql.connector import Error

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="your_password"
    )
    if conn.is_connected():
        print("Connected to MySQL Server!")
        cursor = conn.cursor()
        # Work with database here...
        cursor.close()
        conn.close()
except Error as e:
    print("Connection error:", e)
\`\`\`

> 💡 Never hardcode database credentials. Store passwords in environment variables using \`os.environ["DB_PASS"]\`.`
            },
            {
                orderIndex: 3,
                title: 'DDL Operations: CREATE Databases & Tables',
                slug: 'ddl-create-databases-tables',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 11.4 DDL (Data Definition Language)
DDL defines and modifies the physical structure of tables and schemas:
\`\`\`python
cursor.execute("CREATE DATABASE IF NOT EXISTS school")
cursor.execute("USE school")

cursor.execute("""
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    course VARCHAR(30),
    marks INT
)
""")
cursor.execute("SHOW TABLES")
print(cursor.fetchall())
\`\`\`

### Common SQL Data Types
- \`INT\`: Whole integers
- \`VARCHAR(n)\`: Variable-length text up to n chars
- \`DECIMAL(p, s)\`: Exact numeric representation (ideal for financial figures)
- \`DATETIME\`: Temporal timestamps`
            },
            {
                orderIndex: 4,
                title: 'DML INSERT & SQL Injection Defense',
                slug: 'dml-insert-sql-injection',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 11.5 DML INSERT & Parameterized Queries
\`\`\`python
sql = "INSERT INTO students (name, course, marks) VALUES (%s, %s, %s)"

# Single insert
cursor.execute(sql, ("Asha", "Python", 95))
conn.commit()  # Required to persist changes!
print("Inserted ID:", cursor.lastrowid)

# Batch insert
batch_data = [
    ("Ravi", "Python", 82),
    ("Meera", "SQL", 91),
    ("Karan", "Python", 74)
]
cursor.executemany(sql, batch_data)
conn.commit()
print(cursor.rowcount, "rows inserted")
\`\`\`

### ⚠️ Defense Against SQL Injection
Never concatenate raw strings into queries (\`"WHERE name='" + name + "'"\`). An attacker can inject SQL syntax to bypass authentication or drop tables. Always pass values separately using parameter placeholders (\`%s\`).`
            },
            {
                orderIndex: 5,
                title: 'READ Queries (SELECT, fetchall, fetchone)',
                slug: 'read-queries-fetchall-fetchone',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 11.6 Querying Data with SELECT
\`\`\`python
# Retrieve all records
cursor.execute("SELECT * FROM students")
rows = cursor.fetchall()
for row in rows:
    print(row)  # (1, 'Asha', 'Python', 95)

# Parameterized query with WHERE filter
cursor.execute("SELECT name, marks FROM students WHERE marks >= %s", (85,))
top_students = cursor.fetchall()

# Dictionary Cursors (rows as dicts)
dict_cursor = conn.cursor(dictionary=True)
dict_cursor.execute("SELECT name, marks FROM students LIMIT 2")
for item in dict_cursor.fetchall():
    print(item["name"], item["marks"])
\`\`\``
            },
            {
                orderIndex: 6,
                title: 'DDL vs DML & Built-in sqlite3 Practice',
                slug: 'ddl-vs-dml-and-sqlite3',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### DDL vs DML Summary
| Feature | DDL (Data Definition) | DML (Data Manipulation) |
| :--- | :--- | :--- |
| **Scope** | Modifies schema/tables | Modifies rows inside tables |
| **Commands** | \`CREATE\`, \`ALTER\`, \`DROP\`, \`TRUNCATE\` | \`INSERT\`, \`UPDATE\`, \`DELETE\`, \`SELECT\` |
| **Commit** | Auto-committed in MySQL | Requires explicit \`conn.commit()\` |

### 11.9 Serverless Database Practice with \`sqlite3\`
Python includes \`sqlite3\` out-of-the-box. The only difference is using \`?\` placeholders instead of \`%s\`:
\`\`\`python
import sqlite3

conn = sqlite3.connect("school.db")
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    marks INTEGER
)
""")

cur.execute("INSERT INTO students (name, marks) VALUES (?, ?)", ("Asha", 95))
conn.commit()

for row in cur.execute("SELECT * FROM students"):
    print(row)

conn.close()
\`\`\``
            }
        ],
        quiz: {
            title: 'Quiz 11: Database Access & SQL',
            passingScorePercent: 60,
            timeLimitMinutes: 15,
            questions: [
                {
                    questionText: 'What method must be called to permanently persist INSERT or UPDATE modifications in MySQL?',
                    type: 'MCQ',
                    options: ['conn.commit()', 'conn.save()', 'cursor.persist()', 'cursor.flush()'],
                    correctAnswer: 'conn.commit()',
                    explanation: 'Relational databases use transactions. Until conn.commit() is invoked, uncommitted writes can be rolled back.',
                    marks: 5
                },
                {
                    questionText: 'How should dynamic variables be passed to SQL queries to avoid SQL Injection vulnerabilities?',
                    type: 'MCQ',
                    options: [
                        'Using query parameter placeholders (%s or ?) passed in a tuple',
                        'By concatenating variables using the + operator',
                        'Using Python f-strings',
                        'By converting the entire query to uppercase'
                    ],
                    correctAnswer: 'Using query parameter placeholders (%s or ?) passed in a tuple',
                    explanation: 'Placeholders ensure the database engine treats user input strictly as literal data, preventing query structure tampering.',
                    marks: 5
                },
                {
                    questionText: 'Which SQL statement category includes CREATE, ALTER, and DROP?',
                    type: 'MCQ',
                    options: ['DDL (Data Definition Language)', 'DML (Data Manipulation Language)', 'DCL (Data Control Language)', 'TCL (Transaction Control)'],
                    correctAnswer: 'DDL (Data Definition Language)',
                    explanation: 'DDL commands define, alter, and delete database schemas and structural objects.',
                    marks: 5
                },
                {
                    questionText: 'Which built-in Python module allows full relational SQL practice without installing a database server?',
                    type: 'MCQ',
                    options: ['sqlite3', 'mysql', 'psycopg2', 'pymongo'],
                    correctAnswer: 'sqlite3',
                    explanation: 'sqlite3 is built into Python standard library, storing relational databases directly in single local disk files.',
                    marks: 5
                }
            ]
        }
    },

    // =========================================================================
    // MODULE 12: DATA SCIENCE USING PYTHON
    // =========================================================================
    {
        orderIndex: 12,
        title: 'Module 12: Data Science Using Python',
        description: 'Analyse numbers, tables, and charts with the three core libraries: NumPy (arrays, ufuncs), Pandas (Series, DataFrames), and Matplotlib (visualizations).',
        lessons: [
            {
                orderIndex: 1,
                title: 'Part A: NumPy - Introduction & Creating Arrays',
                slug: 'numpy-introduction-and-arrays',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 12.1 Introduction to NumPy
**NumPy** (Numerical Python) provides the \`ndarray\` (N-dimensional array), a contiguous block of homogeneous data stored in memory. It executes vector operations 10 to 100 times faster than native Python lists.

\`\`\`bash
pip install numpy pandas matplotlib
\`\`\`

### 12.2 Creating Arrays
\`\`\`python
import numpy as np

# 1D & 2D Arrays
a = np.array([1, 2, 3, 4])
m = np.array([[1, 2, 3], [4, 5, 6]])
print(m.shape, m.ndim, m.size, m.dtype)  # (2, 3) 2 6 int64

# Array Generators
print(np.zeros((2, 3)))             # 2x3 matrix of 0.0
print(np.ones(4))                   # [1. 1. 1. 1.]
print(np.arange(0, 10, 2))          # [0, 2, 4, 6, 8]
print(np.linspace(0, 1, 5))         # 5 evenly spaced steps: [0., 0.25, 0.5, 0.75, 1.]
print(np.random.randint(1, 10, 5))  # 5 random integers
print(np.arange(6).reshape(2, 3))   # Reshape to 2 rows, 3 cols
\`\`\``
            },
            {
                orderIndex: 2,
                title: 'NumPy Indexing, Transposition & Ufuncs',
                slug: 'numpy-indexing-transposition-ufuncs',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 12.3 Indexing & Slicing
\`\`\`python
import numpy as np

m = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print(m[1, 2])    # 6 (row index 1, col index 2)
print(m[:, 1])    # [2, 5, 8] (entire column 1)
print(m[:2, 1:])  # Sub-matrix: [[2, 3], [5, 6]]

# Boolean Indexing
a = np.array([10, 20, 30, 40, 50])
print(a[a > 25])  # [30, 40, 50]
\`\`\`

> 💡 Slices in NumPy are **views**, not copies. Altering a slice modifies the original array! Use \`a.copy()\` for deep isolation.

### 12.4 Transposition & Matrix Multiplication
\`\`\`python
m = np.array([[1, 2, 3], [4, 5, 6]])
print(m.T)        # Transpose: shape becomes (3, 2)
print(m @ m.T)    # Matrix multiplication (2x3 @ 3x2 -> 2x2)
\`\`\`

### 12.5 Universal Functions (Ufuncs) & Broadcasting
\`\`\`python
a = np.array([1, 4, 9, 16])
print(np.sqrt(a))  # [1. 2. 3. 4.]
print(a * 2)       # Element-wise multiplication
\`\`\``
            },
            {
                orderIndex: 3,
                title: 'NumPy Array Processing & File I/O',
                slug: 'numpy-array-processing-file-io',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### 12.6 Array Aggregations
\`\`\`python
import numpy as np

m = np.array([[1, 2, 3], [4, 5, 6]])
print(m.sum(), m.mean(), m.std())
print(m.sum(axis=0))  # Column sums: [5, 7, 9]
print(m.sum(axis=1))  # Row sums:    [6, 15]

# Conditional selection with np.where
print(np.where(m > 3, "high", "low"))
\`\`\`

### 12.7 Array Input and Output
\`\`\`python
# Binary format (.npy)
np.save("matrix.npy", m)
loaded = np.load("matrix.npy")

# Text CSV format
np.savetxt("matrix.csv", m, delimiter=",", fmt="%d")
\`\`\``
            },
            {
                orderIndex: 4,
                title: 'Part B: Pandas - Series & DataFrames',
                slug: 'pandas-series-and-dataframes',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 12.8 Introduction to Pandas
**Pandas** provides labeled data structures designed for analytical tables, data cleansing, and aggregations.
- **Series:** A 1D labeled array.
- **DataFrame:** A 2D labeled tabular structure with columns of potentially differing types.

### 12.9 Series
\`\`\`python
import pandas as pd

s = pd.Series([10, 20, 30], index=["a", "b", "c"])
print(s["b"])      # 20 (labeled index)
print(s.iloc[0])   # 10 (positional index)
print(s * 2)
\`\`\`

### 12.10 DataFrames
\`\`\`python
df = pd.DataFrame({
    "name":   ["Asha", "Ravi", "Meera", "Karan"],
    "dept":   ["IT", "HR", "IT", "HR"],
    "salary": [50000, 42000, 61000, 39000]
})
print(df.head())
print(df.shape)
df["bonus"] = df["salary"] * 0.10  # Compute new column
\`\`\``
            },
            {
                orderIndex: 5,
                title: 'Pandas Selecting (loc vs iloc) & Alignment',
                slug: 'pandas-loc-iloc-alignment',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 12.13 Selecting Entries: \`loc\` vs \`iloc\`
| Property | \`loc\` | \`iloc\` |
| :--- | :--- | :--- |
| **Referencing** | By **Label** | By **Integer Position** |
| **Slice End** | **Included** (\`0:2\` includes index 2) | **Excluded** (\`0:2\` gets 0 and 1) |

\`\`\`python
# Row by label
print(df.loc[0, ["name", "salary"]])

# Row by integer position
print(df.iloc[0:2, 0:2])

# Boolean Filtering
print(df[df["salary"] > 45000])
print(df[(df["dept"] == "IT") & (df["salary"] > 55000)])
\`\`\`

### 12.14 Data Alignment
When combining structures, Pandas automatically aligns elements by **label**, assigning \`NaN\` for unaligned keys:
\`\`\`python
a = pd.Series([1, 2], index=["x", "y"])
b = pd.Series([10, 20], index=["y", "z"])
print(a + b)  # x: NaN, y: 12.0, z: NaN
\`\`\``
            },
            {
                orderIndex: 6,
                title: 'Pandas Statistics, Groupby & Missing Data',
                slug: 'pandas-statistics-groupby-missing',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 12.16 Summary Statistics & Grouping
\`\`\`python
print(df["salary"].mean())
print(df["salary"].describe())  # count, mean, std, quartiles

# Aggregations by department
print(df.groupby("dept")["salary"].mean())
print(df.groupby("dept").agg({"salary": ["mean", "max"]}))
\`\`\`

### Handling Missing Data (\`NaN\`)
\`\`\`python
df_dirty = pd.DataFrame({"a": [1, None, 3], "b": ["x", "y", None]})
print(df_dirty.isna().sum())       # Count NaNs per column
print(df_dirty.dropna())           # Drop rows containing NaNs
print(df_dirty.fillna({"a": 0, "b": "Unknown"}))
\`\`\`

### Reading & Writing Files
\`\`\`python
df.to_csv("staff.csv", index=False)
loaded_df = pd.read_csv("staff.csv")
\`\`\``
            },
            {
                orderIndex: 7,
                title: 'Part C: Matplotlib - Visual Analytics',
                slug: 'matplotlib-visual-analytics',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### 12.18 Data Visualization with Matplotlib
**Matplotlib** is Python's standard 2D plotting library.

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
plt.plot(x, np.sin(x), label="sin(x)", color="#2563eb", linestyle="--")
plt.plot(x, np.cos(x), label="cos(x)", color="#f59e0b")
plt.title("Wave Analytics")
plt.xlabel("Timeline (x)")
plt.ylabel("Amplitude")
plt.legend()
plt.grid(True)
plt.savefig("chart.png", dpi=150)
plt.show()
\`\`\`

### Chart Archetypes
- **Line Plot (\`plt.plot\`):** Trends over continuous time
- **Bar Chart (\`plt.bar\`):** Category comparisons
- **Histogram (\`plt.hist\`):** Frequency distributions
- **Scatter Plot (\`plt.scatter\`):** Correlation between two variables
- **Pie Chart (\`plt.pie\`):** Proportion of a whole`
            },
            {
                orderIndex: 8,
                title: 'Mini-Project: Student Results Analysis',
                slug: 'student-results-analysis-project',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### End-to-End Pipeline
Combine Pandas and Matplotlib to analyze and graph real data:
\`\`\`python
import pandas as pd
import matplotlib.pyplot as plt

data = pd.DataFrame({
    "student": ["Asha", "Ravi", "Meera", "Karan", "Divya", "Sana"],
    "maths":   [88, 74, 91, 55, 67, 80],
    "science": [92, 70, 85, 60, 72, 78]
})

# Calculate total and letter grade
data["total"] = data["maths"] + data["science"]
data["grade"] = pd.cut(data["total"], bins=[0, 120, 150, 200], labels=["C", "B", "A"])

print("--- Performance Rankings ---")
print(data.sort_values("total", ascending=False))

# Plot comparative bar chart
data.set_index("student")[["maths", "science"]].plot(kind="bar", figsize=(8, 4))
plt.title("Subject Marks by Student")
plt.ylabel("Score")
plt.tight_layout()
plt.show()
\`\`\`

### Congratulations!
You have completed the 12-Module Python Curriculum from foundational syntax to Data Science!`
            }
        ],
        quiz: {
            title: 'Quiz 12: Data Science with NumPy, Pandas & Matplotlib',
            passingScorePercent: 60,
            timeLimitMinutes: 15,
            questions: [
                {
                    questionText: 'What is the key difference between loc and iloc in Pandas?',
                    type: 'MCQ',
                    options: [
                        'loc references by label and includes endpoint; iloc references by integer position and excludes endpoint',
                        'iloc operates only on NumPy arrays',
                        'loc is deprecated in modern Pandas',
                        'iloc is used exclusively for column deletions'
                    ],
                    correctAnswer: 'loc references by label and includes endpoint; iloc references by integer position and excludes endpoint',
                    explanation: 'loc indexes by row/column index labels inclusive of boundary, while iloc uses integer 0-indexed positioning exclusive of endpoint.',
                    marks: 5
                },
                {
                    questionText: 'In NumPy, what does axis=0 indicate during an aggregation like m.sum(axis=0)?',
                    type: 'MCQ',
                    options: [
                        'Aggregates downwards across rows (evaluates each column sum)',
                        'Aggregates across columns (evaluates each row sum)',
                        'Sums only positive numbers',
                        'Transposes the matrix before summation'
                    ],
                    correctAnswer: 'Aggregates downwards across rows (evaluates each column sum)',
                    explanation: 'axis=0 collapses the vertical dimension, producing sums down each individual column.',
                    marks: 5
                },
                {
                    questionText: 'What value does Pandas place by default when aligning two Series on non-matching index labels?',
                    type: 'MCQ',
                    options: ['NaN (Not a Number)', '0', '-1', 'Raises an AlignmentError'],
                    correctAnswer: 'NaN (Not a Number)',
                    explanation: 'Pandas aligns by label and introduces NaN for missing combinations to preserve dimensional integrity.',
                    marks: 5
                },
                {
                    questionText: 'Which function must be executed before plt.show() to save a Matplotlib figure to disk?',
                    type: 'MCQ',
                    options: ['plt.savefig("file.png")', 'plt.write()', 'plt.export()', 'plt.dump()'],
                    correctAnswer: 'plt.savefig("file.png")',
                    explanation: 'plt.savefig() renders and exports the active figure buffer. Calling plt.show() first resets the canvas.',
                    marks: 5
                }
            ]
        }
    }
];

async function seedFullCurriculum() {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected successfully!');

        const totalLessons = fullPythonModules.reduce((acc, m) => acc + m.lessons.length, 0);
        const totalQuizzes = fullPythonModules.filter(m => m.quiz).length;
        console.log(`Updating Course SHU-PY-101: ${fullPythonModules.length} Modules, ${totalLessons} Lessons, ${totalQuizzes} Quizzes...`);

        const updated = await Course.findOneAndUpdate(
            { code: 'SHU-PY-101' },
            {
                title: 'Python Programming Masterclass',
                code: 'SHU-PY-101',
                category: 'PYTHON',
                level: 'Beginner',
                description: 'Comprehensive 12-module Python curriculum covering foundational syntax, control flow, data structures, OOP, multithreading, database access, and data science with NumPy, Pandas, and Matplotlib.',
                estimatedTotalHours: 54,
                modules: fullPythonModules
            },
            { new: true, upsert: true }
        );

        console.log(`\n========================================`);
        console.log(`COURSE UPDATED SUCCESSFULLY!`);
        console.log(`Title: ${updated.title}`);
        console.log(`Code: ${updated.code}`);
        console.log(`Modules: ${updated.modules.length}`);
        console.log(`Total Lessons: ${totalLessons}`);
        console.log(`Total Quizzes: ${totalQuizzes}`);
        console.log(`========================================\n`);

        process.exit(0);
    } catch (err) {
        console.error('Error seeding full curriculum:', err);
        process.exit(1);
    }
}

seedFullCurriculum();
