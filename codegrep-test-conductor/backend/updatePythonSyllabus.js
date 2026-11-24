const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
const connectDB = require('./config/db');

const Course = require('./models/Course');
const Organization = require('./models/Organization');
const User = require('./models/User');

const pythonSyllabusModules = [
    {
        orderIndex: 1,
        title: 'Module 1: Introduction to Python',
        description: 'Covers Python history, environment setup, syntax rules, data types, variables, and core functions.',
        lessons: [
            {
                orderIndex: 1,
                title: 'What is Python and history of Python?',
                slug: 'what-is-python-and-history',
                contentType: 'article',
                estimatedMinutes: 15,
                content: `### 1. What is Python?\nPython is a high-level, interpreted, general-purpose programming language created by Guido van Rossum and first released in 1991. It emphasizes code readability with its notable use of significant whitespace.\n\n### 2. History & Evolution\n- **1989**: Conceived by Guido van Rossum at CWI in the Netherlands as a successor to the ABC language.\n- **1991**: Python 0.9.0 released featuring classes with inheritance, exception handling, and functions.\n- **2000**: Python 2.0 introduced list comprehensions, garbage collection system, and Unicode support.\n- **2008**: Python 3.0 released ("Python 3000") rectifying fundamental design flaws and making print a function.\n\nPython's design philosophy is summarized in **The Zen of Python (PEP 20)**: *"Beautiful is better than ugly. Explicit is better than implicit. Simple is better than complex."*`,
                aiSummary: {
                    summary: 'Python was created by Guido van Rossum in 1991. It is high-level, interpreted, and designed for readability and rapid development.',
                    keyConcepts: ['Guido van Rossum (1991)', 'PEP 20 Zen of Python', 'Interpreted and readable'],
                    revisionNotes: 'Run `import this` in the Python REPL to read The Zen of Python.'
                }
            },
            {
                orderIndex: 2,
                title: 'Unique features of Python',
                slug: 'unique-features-of-python',
                contentType: 'article',
                estimatedMinutes: 15,
                content: `### Core Features of Python\n\n1. **Easy to Learn and Read**: Clean English-like syntax reduces cognitive overhead.\n2. **Interpreted Language**: Code executes line-by-line via the CPython interpreter, removing compilation delays.\n3. **Dynamically Typed**: Variable data types are inferred and checked at runtime.\n4. **Free and Open-Source**: Distributed under the OSI-approved Python Software Foundation License.\n5. **High-Level Built-in Structures**: Lists, Tuples, Dictionaries, and Sets are native language citizens.\n6. **Extensive Standard Library**: "Batteries included" philosophy provides modules for cryptography, networking, math, and JSON out of the box.`
            },
            {
                orderIndex: 3,
                title: 'Python-2 and Python-3 differences',
                slug: 'python-2-vs-python-3-differences',
                contentType: 'article',
                estimatedMinutes: 15,
                content: `### Major Differences: Python 2 vs Python 3\n\n| Feature | Python 2 | Python 3 |\n| :--- | :--- | :--- |\n| **Print Statement** | Statement: \`print "Hello"\` | Function: \`print("Hello")\` |\n| **Integer Division** | \`5 / 2 = 2\` (truncating) | \`5 / 2 = 2.5\` (float); \`5 // 2 = 2\` |\n| **String Handling** | ASCII by default; \`unicode\` type | Unicode (\`str\`) by default; \`bytes\` for raw data |\n| **Input Function** | \`raw_input()\` returns string, \`input()\` evaluates | \`input()\` always returns string |\n| **Status** | Deprecated on January 1, 2020 | Modern official standard |`
            },
            {
                orderIndex: 4,
                title: 'Install Python and Environment Setup',
                slug: 'install-python-and-environment-setup',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### Setting up your Python Environment\n\n1. **Download Python**: Visit [python.org](https://www.python.org/downloads/) and install the latest 3.12+ release. **Always check "Add python.exe to PATH"** on Windows.\n2. **Verify Installation**:\n\`\`\`bash\npython --version\npip --version\n\`\`\`\n3. **Virtual Environments (\`venv\`)**: Keeps project dependencies isolated:\n\`\`\`bash\npython -m venv myenv\nsource myenv/bin/activate  # On macOS/Linux\nmyenv\\Scripts\\activate     # On Windows\n\`\`\`\n4. **Recommended IDEs**: VS Code, PyCharm, or Jupyter Notebooks.`
            },
            {
                orderIndex: 5,
                title: 'First Python Program',
                slug: 'first-python-program',
                contentType: 'article',
                estimatedMinutes: 15,
                content: `### Writing and Running Your First Program\n\nCreate a file named \`hello.py\`:\n\`\`\`python\n# Our first program in Python\nprint("Hello, HiGen Labs Learning Community!")\n\nname = input("Enter your name: ")\nprint(f"Welcome to Python Engineering, {name}!")\n\`\`\`\n\nExecute it via terminal:\n\`\`\`bash\npython hello.py\n\`\`\``,
                codeSnippets: [
                    {
                        language: 'python',
                        title: 'Hello World & Dynamic Input',
                        code: 'print("Hello, HiGen Labs!")\ngreeting = "Welcome to Python Mastery"\nprint(greeting)'
                    }
                ]
            },
            {
                orderIndex: 6,
                title: 'Python Identifiers, Keywords and Indentation',
                slug: 'identifiers-keywords-indentation',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### Syntactic Rules in Python\n\n#### 1. Identifiers\nIdentifiers are user-defined names given to variables, functions, and classes.\n- Rules: Can contain letters (a-z, A-Z), numbers (0-9), and underscore (\`_\`). Must **not** start with a digit.\n- Case-sensitive: \`total\` and \`Total\` are distinct.\n\n#### 2. Keywords\nReserved words that cannot be used as identifiers. List keywords using:\n\`\`\`python\nimport keyword\nprint(keyword.kwlist)  # if, def, class, return, while, etc.\n\`\`\`\n\n#### 3. Indentation\nPython uses **4 spaces indentation** instead of curly braces \`{}\` to define blocks of code. Mismatched indentation raises an \`IndentationError\`.`
            },
            {
                orderIndex: 7,
                title: 'Comments and document interlude in Python',
                slug: 'comments-and-docstrings-in-python',
                contentType: 'article',
                estimatedMinutes: 15,
                content: `### Comments & Docstrings\n\n1. **Single-line comments**: Begin with \`#\`\n\`\`\`python\n# This calculates the Euclidean distance\n\`\`\`\n2. **Docstrings**: Triple-quoted strings (\`"""..."""\`) placed immediately under modules, classes, or functions to document their behavior. Accessible at runtime via the \`__doc__\` attribute or \`help()\` function.`
            },
            {
                orderIndex: 8,
                title: 'Command line arguments & Getting User Input',
                slug: 'command-line-args-user-input',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### User Input and CLI Arguments\n\n#### Interactive Input\n\`\`\`python\nage = int(input("Enter your age: "))\nprint(f"In five years, you will be {age + 5}")\n\`\`\`\n\n#### Command Line Arguments (\`sys.argv\` & \`argparse\`)\n\`\`\`python\nimport sys\nprint("Script name:", sys.argv[0])\nprint("Arguments passed:", sys.argv[1:])\n\`\`\``
            },
            {
                orderIndex: 9,
                title: 'Python Data Types & What are variables?',
                slug: 'python-data-types-and-variables',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### Dynamic Typing and Built-in Types\nVariables in Python are pointers (references) to memory objects. Key built-in types:\n- **Numeric**: \`int\`, \`float\`, \`complex\`\n- **Sequence**: \`str\`, \`list\`, \`tuple\`, \`range\`\n- **Mapping**: \`dict\`\n- **Set types**: \`set\`, \`frozenset\`\n- **Boolean**: \`bool\` (\`True\`, \`False\`)\n- **Binary**: \`bytes\`, \`bytearray\`, \`memoryview\`\n- **None**: \`NoneType\` (\`None\`)`
            },
            {
                orderIndex: 10,
                title: 'Python Core objects, Functions, Number and Maths',
                slug: 'core-objects-functions-maths',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### Numbers & Math Library\nPython includes extensive math tools:\n\`\`\`python\nimport math\n\nprint(math.sqrt(16))      # 4.0\nprint(math.ceil(4.2))     # 5\nprint(math.floor(4.9))    # 4\nprint(math.pi)            # 3.141592653589793\nprint(abs(-42))           # Built-in abs: 42\nprint(pow(2, 5))          # 32\n\`\`\``
            }
        ],
        quiz: {
            title: 'Quiz 01: Python Fundamentals & Syntax',
            passingScorePercent: 60,
            timeLimitMinutes: 15,
            questions: [
                {
                    questionText: 'Which keyword in Python is used to inspect all reserved keywords dynamically?',
                    type: 'MCQ',
                    options: ['keyword.kwlist', 'sys.keywords', 'builtins.keywords', 'help.keywords'],
                    correctAnswer: 'keyword.kwlist',
                    explanation: 'import keyword; print(keyword.kwlist) outputs all reserved keywords.',
                    marks: 5
                },
                {
                    questionText: 'What is the default return type of the input() function in Python 3?',
                    type: 'MCQ',
                    options: ['str', 'int', 'object', 'dynamic'],
                    correctAnswer: 'str',
                    explanation: 'In Python 3, input() always captures and returns a string.',
                    marks: 5
                }
            ]
        }
    },
    {
        orderIndex: 2,
        title: 'Module 2: Control Statements',
        description: 'Branching, conditional evaluations, loops (while & for), break, continue, pass, assert, and return.',
        lessons: [
            {
                orderIndex: 1,
                title: 'if-else and if-elif-else Conditionals',
                slug: 'if-else-conditionals',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### Decision Making in Python\n\`\`\`python\nscore = 85\nif score >= 90:\n    print("Grade A")\nelif score >= 80:\n    print("Grade B")\nelif score >= 70:\n    print("Grade C")\nelse:\n    print("Needs Improvement")\n\`\`\``
            },
            {
                orderIndex: 2,
                title: 'while loop & for loop',
                slug: 'while-and-for-loops',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### Iteration Structures\n\n#### While Loop\nRuns as long as a boolean expression evaluates to True:\n\`\`\`python\ncount = 1\nwhile count <= 5:\n    print("Count:", count)\n    count += 1\n\`\`\`\n\n#### For Loop with Iterables\n\`\`\`python\nfruits = ["apple", "banana", "cherry"]\nfor fruit in fruits:\n    print(fruit)\n\nfor i in range(1, 10, 2):\n    print(i)  # 1, 3, 5, 7, 9\n\`\`\``
            },
            {
                orderIndex: 3,
                title: 'break, continue, pass, assert, and return',
                slug: 'break-continue-pass-assert-return',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### Jump & Control Keywords\n\n1. **break**: Immediately exits the enclosing loop.\n2. **continue**: Skips the remainder of the current iteration and jumps to the next.\n3. **pass**: Null operation; used as a syntactic placeholder.\n4. **assert**: Debugging aid that tests a condition and raises \`AssertionError\` if false.\n5. **return**: Exits a function and optionally passes back a computed value.`
            }
        ],
        quiz: {
            title: 'Quiz 02: Control Flow & Branching',
            passingScorePercent: 60,
            timeLimitMinutes: 15,
            questions: [
                {
                    questionText: 'What does the pass statement do in a Python loop or function definition?',
                    type: 'MCQ',
                    options: ['Acts as a no-op placeholder', 'Exits the loop', 'Skips to next iteration', 'Terminates execution'],
                    correctAnswer: 'Acts as a no-op placeholder',
                    explanation: 'pass is a null statement used when syntax requires a statement but no action is needed.',
                    marks: 5
                }
            ]
        }
    },
    {
        orderIndex: 3,
        title: 'Module 3: List, Ranges & Tuples in Python',
        description: 'Sequences, list methods, iterators, generators, yield, comprehensions, and ordered immutable tuples.',
        lessons: [
            {
                orderIndex: 1,
                title: 'Lists in Python & More about Lists',
                slug: 'lists-in-python-operations',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### Python Lists (Mutable Sequences)\n\`\`\`python\nnums = [10, 20, 30, 40]\nnums.append(50)\nnums.insert(1, 15)\nnums.pop()\nnums.sort(reverse=True)\nprint(nums)\n\`\`\``
            },
            {
                orderIndex: 2,
                title: 'Understanding Iterators, Generators, Yield & Comprehensions',
                slug: 'iterators-generators-yield-comprehensions',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### Iterators & Generator Functions\n\n#### List Comprehension\n\`\`\`python\nsquares = [x**2 for x in range(10) if x % 2 == 0]\n\`\`\`\n\n#### Generators using \`yield\`\nGenerators produce values on demand without allocating the entire list in RAM:\n\`\`\`python\ndef countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\n\`\`\``
            },
            {
                orderIndex: 3,
                title: 'Understanding Ranges & Ordered Sets with Tuples',
                slug: 'ranges-and-tuples',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### Ranges & Tuples\n\n#### Tuples (Immutable)\n\`\`\`python\ncoordinates = (19.0760, 72.8777)\n# coordinates[0] = 20.0 -> TypeError (immutable)\nlat, lng = coordinates  # Tuple unpacking\n\`\`\``
            }
        ]
    },
    {
        orderIndex: 4,
        title: 'Module 4: Python Dictionaries and Sets',
        description: 'Key-value hash maps, hashing concepts, dictionary methods, and unique set operations.',
        lessons: [
            {
                orderIndex: 1,
                title: 'Python Dictionaries & Common Methods',
                slug: 'python-dictionaries-methods',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### Python Dictionaries (Hash Maps)\n\`\`\`python\nstudent = {"name": "Shiv", "batch": "DSA 2026", "score": 95}\nprint(student.get("name"))\nstudent["email"] = "shiv@example.com"\n\nfor key, val in student.items():\n    print(f"{key}: {val}")\n\`\`\``
            },
            {
                orderIndex: 2,
                title: 'Python Sets, Set Theory & Practical Examples',
                slug: 'python-sets-examples',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### Sets in Python\nUnordered collections of unique hashable items:\n\`\`\`python\na = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\nprint(a | b)  # Union: {1, 2, 3, 4, 5, 6}\nprint(a & b)  # Intersection: {3, 4}\nprint(a - b)  # Difference: {1, 2}\n\`\`\``
            }
        ]
    },
    {
        orderIndex: 5,
        title: 'Module 5: Input and Output in Python',
        description: 'File system interaction, reading and writing text files, appending, binary serialization, and pickle.',
        lessons: [
            {
                orderIndex: 1,
                title: 'Reading, Writing & Appending Text Files',
                slug: 'reading-writing-text-files',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### File I/O with Context Managers\n\`\`\`python\n# Writing to a text file\nwith open("students.txt", "w", encoding="utf-8") as f:\n    f.write("Pranshu Pathak, 95\\n")\n    f.write("Aryan Saxena, 92\\n")\n\n# Reading text file\nwith open("students.txt", "r", encoding="utf-8") as f:\n    content = f.read()\n    print(content)\n\`\`\``
            },
            {
                orderIndex: 2,
                title: 'Writing Binary Files & Object Serialization with Pickle',
                slug: 'writing-binary-files-pickle',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### Pickle: Binary Serialization\n\`\`\`python\nimport pickle\n\ndata = {"users": ["A", "B"], "config": {"timeout": 30}}\nwith open("state.pkl", "wb") as f:\n    pickle.dump(data, f)\n\nwith open("state.pkl", "rb") as f:\n    loaded = pickle.load(f)\n    print(loaded)\n\`\`\``
            }
        ]
    },
    {
        orderIndex: 6,
        title: 'Module 6: Python Built-in Functions & Modules',
        description: 'User-defined functions, arguments (*args, **kwargs), lambda functions, and packages/modules.',
        lessons: [
            {
                orderIndex: 1,
                title: 'Defining and Calling Functions, Arguments & Scope',
                slug: 'defining-and-calling-functions',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### Function Architecture\n\`\`\`python\ndef calculate_total(*items, tax_rate=0.08):\n    subtotal = sum(items)\n    return subtotal + (subtotal * tax_rate)\n\nprint("Total:", calculate_total(100, 200, 50))\n\`\`\``
            },
            {
                orderIndex: 2,
                title: 'Anonymous Lambda Functions & Map/Filter',
                slug: 'anonymous-lambda-functions',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### Lambdas & High-Order Functions\n\`\`\`python\nsqr = lambda x: x * x\nprint(sqr(6))  # 36\n\nnums = [1, 2, 3, 4, 5, 6]\nevens = list(filter(lambda x: x % 2 == 0, nums))\nprint(evens)  # [2, 4, 6]\n\`\`\``
            },
            {
                orderIndex: 3,
                title: 'Python Modules & Packages',
                slug: 'python-modules-and-packages',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### Packaging Code\n- Any \`.py\` file is a module.\n- Any directory containing an \`__init__.py\` file is a package.\n\`\`\`python\nimport my_package.math_utils as mu\nresult = mu.add(10, 20)\n\`\`\``
            }
        ]
    },
    {
        orderIndex: 7,
        title: 'Module 7: Python Object Oriented Programming',
        description: 'Classes, objects, constructors (__init__), self, inheritance, class/static methods, and abstract classes.',
        lessons: [
            {
                orderIndex: 1,
                title: 'Overview of OOP, self, and Constructors',
                slug: 'overview-of-oop-and-self',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### Classes and Constructors\n\`\`\`python\nclass Student:\n    def __init__(self, name, roll_no):\n        self.name = name\n        self.roll_no = roll_no\n\n    def display(self):\n        print(f"Student: {self.name} (Roll: {self.roll_no})")\n\ns = Student("Shiv", 101)\ns.display()\n\`\`\``
            },
            {
                orderIndex: 2,
                title: 'Inheritance, Method Types & Encapsulation',
                slug: 'inheritance-and-method-types',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### Inheritance and Method Types\n\`\`\`python\nclass Employee:\n    company = "HiGen Labs"  # Class attribute\n\n    def __init__(self, name):\n        self.name = name\n\n    @classmethod\n    def get_company(cls):\n        return cls.company\n\n    @staticmethod\n    def is_valid_id(emp_id):\n        return len(emp_id) == 6\n\nclass Engineer(Employee):\n    def __init__(self, name, domain):\n        super().__init__(name)\n        self.domain = domain\n\`\`\``
            },
            {
                orderIndex: 3,
                title: 'Abstract Classes and Interfaces using abc',
                slug: 'abstract-classes-and-interfaces',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### ABC (Abstract Base Classes)\n\`\`\`python\nfrom abc import ABC, abstractmethod\n\nclass PaymentGateway(ABC):\n    @abstractmethod\n    def process_payment(self, amount):\n        pass\n\nclass StripeGateway(PaymentGateway):\n    def process_payment(self, amount):\n        print(f"Charged USD {amount} via Stripe.")\n\`\`\``
            }
        ]
    },
    {
        orderIndex: 8,
        title: 'Module 8: Exception Handling',
        description: 'Compile-time vs runtime vs logical errors, try-except-else-finally blocks, custom user-defined exceptions.',
        lessons: [
            {
                orderIndex: 1,
                title: 'Errors in Python & What is an Exception?',
                slug: 'errors-and-exceptions-in-python',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### Error Hierarchy\n- **Syntax / Compile Errors**: Violations of grammar caught before execution.\n- **Runtime Exceptions**: Raised during execution (\`ZeroDivisionError\`, \`KeyError\`, \`IndexError\`).\n- **Logical Errors**: Flaws in algorithm giving incorrect outputs.`
            },
            {
                orderIndex: 2,
                title: 'Handling Exceptions: try, except, else, finally',
                slug: 'handling-exceptions-try-except-finally',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### Complete Exception Handling\n\`\`\`python\ntry:\n    f = open("data.txt")\n    val = int(f.readline())\nexcept FileNotFoundError as e:\n    print("File missing:", e)\nexcept ValueError:\n    print("Could not parse integer.")\nelse:\n    print("Parsed successfully:", val)\nfinally:\n    print("Cleanup logic executed regardless.")\n\`\`\``
            },
            {
                orderIndex: 3,
                title: 'Raising Exceptions & User-Defined Custom Exceptions',
                slug: 'raising-and-custom-exceptions',
                contentType: 'article',
                estimatedMinutes: 20,
                content: `### Custom Exceptions\n\`\`\`python\nclass InvalidAgeError(Exception):\n    """Raised when student age is below threshold."""\n    pass\n\ndef register(age):\n    if age < 18:\n        raise InvalidAgeError("Age must be 18+")\n    return True\n\`\`\``
            }
        ]
    },
    {
        orderIndex: 9,
        title: 'Module 9: Python Regular Expressions',
        description: 'Pattern matching, match vs search, regular expression syntax, search and replace with the re module.',
        lessons: [
            {
                orderIndex: 1,
                title: 'What are Regular Expressions? Match vs Search',
                slug: 'what-are-regular-expressions-match-vs-search',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### The \`re\` Module\n\`\`\`python\nimport re\n\ntext = "Contact us at support@higenlabs.in or admin@higenlabs.in"\n\n# Match (anchored at start) vs Search (anywhere in string)\nmatch_obj = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", text)\nif match_obj:\n    print("First email found:", match_obj.group())\n\`\`\``
            },
            {
                orderIndex: 2,
                title: 'Extended RegEx, Wildcards, Search and Replace',
                slug: 'extended-regex-search-and-replace',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### Substitution and Grouping\n\`\`\`python\nimport re\n\nphone = "2004-959-559 # This is Phone Number"\n# Delete Python-style comments\nnum = re.sub(r"#.*$", "", phone)\nprint("Phone Num : ", num)\n\n# Remove anything other than digits\nnum = re.sub(r"\\D", "", phone)\nprint("Digits only : ", num)\n\`\`\``
            }
        ]
    },
    {
        orderIndex: 10,
        title: 'Module 10: Python Multithreaded Programming',
        description: 'Process vs thread, Global Interpreter Lock (GIL), threading module, locks, semaphores, deadlocks, daemon threads.',
        lessons: [
            {
                orderIndex: 1,
                title: 'Multithreading, Processes, Concurrent Programming & GIL',
                slug: 'multithreading-process-and-gil',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### Concurrency in Python\n- **Process**: Independent memory space with separate GIL.\n- **Thread**: Shares memory space within one process.\n- **GIL (Global Interpreter Lock)**: A mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecodes simultaneously. Best for I/O-bound tasks.`
            },
            {
                orderIndex: 2,
                title: 'Starting Threads, Thread Synchronization, Locks & Deadlocks',
                slug: 'starting-threads-synchronization-locks',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### Thread Synchronization\n\`\`\`python\nimport threading\n\ncounter = 0\nlock = threading.Lock()\n\ndef increment():\n    global counter\n    with lock:\n        for _ in range(100000):\n            counter += 1\n\nt1 = threading.Thread(target=increment)\nt2 = threading.Thread(target=increment)\nt1.start(); t2.start()\nt1.join(); t2.join()\nprint("Final counter:", counter)\n\`\`\``
            }
        ]
    },
    {
        orderIndex: 11,
        title: 'Module 11: Using Databases in Python',
        description: 'Connecting Python to relational databases (MySQL/SQLite), executing DDL and DML operations, transactions.',
        lessons: [
            {
                orderIndex: 1,
                title: 'Database Access, Connections & Drivers',
                slug: 'database-access-connections-drivers',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### Database Interaction via SQLite / MySQL\n\`\`\`python\nimport sqlite3\n\nconn = sqlite3.connect("lms.db")\ncursor = conn.cursor()\n\n# DDL: Create Table\ncursor.execute("""\nCREATE TABLE IF NOT EXISTS students (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    name TEXT NOT NULL,\n    email TEXT UNIQUE NOT NULL\n)\n""")\nconn.commit()\n\`\`\``
            },
            {
                orderIndex: 2,
                title: 'CRUD Operations: CREATE, INSERT, READ, UPDATE, DELETE',
                slug: 'crud-operations-with-databases',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### DML Queries & Parameterized Statements\n\`\`\`python\nimport sqlite3\n\nconn = sqlite3.connect("lms.db")\ncursor = conn.cursor()\n\n# Secure parameterized INSERT\ncursor.execute("INSERT INTO students (name, email) VALUES (?, ?)", ("Shiv", "shiv@gmail.com"))\nconn.commit()\n\n# READ\ncursor.execute("SELECT * FROM students")\nrows = cursor.fetchall()\nfor row in rows:\n    print(row)\nconn.close()\n\`\`\``
            }
        ]
    },
    {
        orderIndex: 12,
        title: 'Module 12: Data Science Using Python (NumPy, Pandas, Matplotlib)',
        description: 'Introduction to NumPy arrays, Pandas DataFrames/Series, indexing, reindexing, and Matplotlib data visualization.',
        lessons: [
            {
                orderIndex: 1,
                title: 'NumPy: Creating Arrays, Indexing, Transposition & Processing',
                slug: 'numpy-arrays-processing',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### High-Performance Numerical Computing with NumPy\n\`\`\`python\nimport numpy as np\n\narr = np.array([1, 2, 3, 4, 5, 6])\nmatrix = arr.reshape(2, 3)\nprint("Matrix Shape:", matrix.shape)\nprint("Transposed:\\n", matrix.T)\nprint("Mean:", np.mean(arr))\nprint("Vectorized Ops:", arr * 10)\n\`\`\``
            },
            {
                orderIndex: 2,
                title: 'Pandas: Series, DataFrames, Indexing, Drop Entry & Summary Statistics',
                slug: 'pandas-series-dataframes-statistics',
                contentType: 'article',
                estimatedMinutes: 30,
                content: `### Data Wrangling with Pandas\n\`\`\`python\nimport pandas as pd\n\ndata = {\n    "Student": ["Pranshu", "Shiv", "Aryan"],\n    "Score": [95, 88, 92],\n    "Batch": ["DSA", "Python", "AI"]\n}\ndf = pd.DataFrame(data)\nprint(df.describe())\nprint(df[df["Score"] > 90])\n\`\`\``
            },
            {
                orderIndex: 3,
                title: 'Matplotlib: Data Visualization, Plotting & Visual Analytics',
                slug: 'matplotlib-data-visualization',
                contentType: 'article',
                estimatedMinutes: 25,
                content: `### Plotting with Matplotlib\n\`\`\`python\nimport matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4, 5]\ny = [10, 24, 36, 48, 55]\n\nplt.figure(figsize=(8, 4))\nplt.plot(x, y, marker='o', color='#2563eb', label='Student Growth')\nplt.title('Performance Across Modules')\nplt.xlabel('Module Number')\nplt.ylabel('Competency Score')\nplt.grid(True, linestyle='--', alpha=0.6)\nplt.legend()\nplt.show()\n\`\`\``
            }
        ]
    }
];

async function updatePythonCourse() {
    try {
        await connectDB();
        console.log('Connected to MongoDB. Updating Python Course with 12-Module Syllabus...');

        const updated = await Course.findOneAndUpdate(
            { code: 'SHU-PY-101' },
            {
                title: 'Python Programming Masterclass',
                code: 'SHU-PY-101',
                category: 'PYTHON',
                level: 'Beginner',
                description: 'Comprehensive Python curriculum covering 12 complete industry modules from foundational syntax, OOP, and Multithreading to Databases and Data Science with NumPy, Pandas, and Matplotlib.',
                estimatedTotalHours: 48,
                modules: pythonSyllabusModules
            },
            { new: true, upsert: true }
        );

        console.log(`Successfully updated course "${updated.title}" with ${updated.modules.length} modules!`);
        process.exit(0);
    } catch (err) {
        console.error('Error updating Python syllabus:', err);
        process.exit(1);
    }
}

updatePythonCourse();
