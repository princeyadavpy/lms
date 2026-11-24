/**
 * Enriched Content Data Part 3
 * Covers Modules 9 through 12:
 * - Module 9: Python Regular Expressions
 * - Module 10: Python Multithreaded Programming
 * - Module 11: Using Databases in Python
 * - Module 12: Data Science Using Python
 */

module.exports = {
    // ── MODULE 9: PYTHON REGULAR EXPRESSIONS ──────────────────────────────────
    "9-1": {
        content: `### 9.1 Regular Expression (RegEx) Fundamentals
Regular expressions provide declarative pattern-matching syntax for text search, validation, and parsing via the standard library \`re\` module.

### Core Metacharacter Reference
| Symbol | Meaning | Example | Matches |
| :--- | :--- | :--- | :--- |
| \`.\` | Any single character except newline | \`c.t\` | \`cat\`, \`cot\`, \`c#t\` |
| \`^\` | Start of string | \`^Hello\` | String beginning with "Hello" |
| \`$\` | End of string | \`end$\` | String ending with "end" |
| \`*\` | 0 or more occurrences (greedy) | \`go*l\` | \`gl\`, \`gol\`, \`goool\` |
| \`+\` | 1 or more occurrences (greedy) | \`go+l\` | \`gol\`, \`goool\` (NOT \`gl\`) |
| \`?\` | 0 or 1 occurrence (optional) | \`colou?r\` | \`color\`, \`colour\` |
| \`\\d\` | Any numeric digit \`[0-9]\` | \`\\d{3}\` | \`101\`, \`999\` |
| \`\\w\` | Alphanumeric or underscore \`[a-zA-Z0-9_]\` | \`\\w+\` | \`user_99\` |
| \`\\s\` | Any whitespace (space, tab, newline) | \`\\s+\` | Spaces and tabs |

> **Pro Tip:** Always prefix RegEx pattern strings with \`r\` (raw string, e.g. \`r"\\d+\"\`) so Python does not interpret backslashes as string escape sequences!`,
        codeSnippets: [
            {
                language: 'python',
                title: 'Basic Pattern Matching with re.search',
                code: `import re\n\nlog = "2026-11-19 [ERROR] Database timeout on port 5432"\n\nmatch = re.search(r"\\[([A-Z]+)\\]", log)\nif match:\n    print("Log Level:", match.group(1))\n\nport_match = re.search(r"port (\\d+)", log)\nif port_match:\n    print("Target Port:", port_match.group(1))`
            }
        ],
        aiSummary: {
            summary: 'The re module provides regex pattern matching. Always use raw strings (r"\\d+") to prevent unintended backslash escape conflicts.',
            keyConcepts: ['re Module Overview', 'Raw String Notation (r"...")', 'Metacharacters (., ^, $, *, +, ?)', 'Character Classes (\\d, \\w, \\s)'],
            revisionNotes: 'Always prefix regex pattern literals with r to keep backslashes raw: r"\\d+" instead of "\\\\d+".'
        }
    },

    "9-2": {
        content: `### 9.2 Key Search Methods: \`match\` vs \`search\` vs \`fullmatch\`
- **\`re.match(pattern, string)\`:** Checks for a match **only at the beginning** of the string.
- **\`re.search(pattern, string)\`:** Scans through the string looking for the **first occurrence anywhere**.
- **\`re.fullmatch(pattern, string)\`:** Requires the **entire string** to match the pattern (ideal for form validation).

\`\`\`python
import re

text = "Error 404: Page not found"

print(bool(re.match(r"\d+", text)))       # False (string starts with "Error")
print(bool(re.search(r"\d+", text)))      # True (finds "404")
print(bool(re.fullmatch(r"Error.*", text)))# True (entire string matches)
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'match vs search vs fullmatch Demonstration',
                code: `import re\n\npin = "560001"\n# fullmatch validates strict 6-digit postal pin\nis_valid = bool(re.fullmatch(r"\\d{6}", pin))\nprint(f"PIN '{pin}' is valid?", is_valid)\n\ninvalid_pin = "560001-XYZ"\nprint(f"PIN '{invalid_pin}' is valid?", bool(re.fullmatch(r"\\d{6}", invalid_pin)))`
            }
        ],
        aiSummary: {
            summary: 'match checks from the start, search scans anywhere, and fullmatch validates the complete string against the pattern.',
            keyConcepts: ['re.match() Start Constraint', 're.search() Scanning', 're.fullmatch() Validation', 'Match Objects & .group()'],
            revisionNotes: 'Use re.fullmatch() for user input validation (passwords, postal codes, IDs) to ensure no rogue characters sneak past.'
        }
    },

    "9-3": {
        content: `### 9.3 Extracting Multi-Matches: \`findall\` & \`finditer\`
- **\`re.findall(pattern, string)\`:** Returns all non-overlapping matches as a list of strings.
- **\`re.finditer(pattern, string)\`:** Yields an iterator of \`Match\` objects with start/end character positions.

\`\`\`python
import re

text = "Prices: \$45.00, \$12.50, and \$99.99"
prices = re.findall(r"\$(\d+\.\d{2})", text)
print("Extracted prices:", prices) # ['45.00', '12.50', '99.99']
\`\`\`

### 9.4 String Substitution with \`re.sub()\`
Replace matching patterns with a replacement string or a dynamic callback function:
\`\`\`python
# Masking sensitive account numbers
raw_text = "Account: 4123-5566-7788-9900"
masked = re.sub(r"\\d{4}-\\d{4}-\\d{4}-(\\d{4})", r"****-****-****-\\1", raw_text)
print("Masked:", masked) # ****-****-****-9900
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 're.findall and re.sub Data Sanitization',
                code: `import re\n\nhtml = "<p>Welcome to <b>HiGen Labs</b>! Contact: support@higenlabs.in</p>"\nclean_text = re.sub(r"<[^>]+>", "", html)\nprint("Sanitized Text:", clean_text)\n\nemails = re.findall(r"[\\w.-]+@[\\w.-]+\\.\\w+", html)\nprint("Found emails:", emails)`
            }
        ],
        aiSummary: {
            summary: 'findall returns all matches as a list, finditer provides span offsets, and re.sub sanitizes text via regex substitution.',
            keyConcepts: ['re.findall() Multi-extraction', 're.finditer() Match Offsets', 're.sub() Pattern Replacement', 'Backreferences (\\\\1, \\\\2)'],
            revisionNotes: 'Compile regex patterns used in high-volume loops via re.compile(pattern) to avoid parsing overhead on each iteration.'
        }
    },

    "9-4": {
        content: `### 9.5 Greedy vs Non-Greedy (Lazy) Matching
By default, quantifiers (\`*\`, \`+\`, \`{m,n}\`) are **greedy**—they match as much text as possible. Append \`?\` to make them **lazy/non-greedy**:

\`\`\`python
import re

html = "<div>First</div><div>Second</div>"

# Greedy: consumes everything up to the final </div>
print(re.findall(r"<div>.*</div>", html))
# Output: ['<div>First</div><div>Second</div>']

# Lazy: matches the shortest possible span
print(re.findall(r"<div>.*?</div>", html))
# Output: ['<div>First</div>', '<div>Second</div>']
\`\`\`

### 9.6 Pre-compiling with \`re.compile\`
\`\`\`python
EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
if EMAIL_REGEX.fullmatch("user@domain.com"):
    print("Valid Email")
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Greedy vs Lazy Quantifier Comparison',
                code: `import re\n\ntext = '{"key1": "val1"}, {"key2": "val2"}'\ngreedy = re.findall(r'\\{.*\\}', text)\nlazy = re.findall(r'\\{.*?\\}', text)\n\nprint("Greedy count:", len(greedy))\nprint("Lazy count:", len(lazy))\nprint("Lazy matches:", lazy)`
            }
        ],
        aiSummary: {
            summary: 'Greedy quantifiers consume maximal text; adding ? makes them lazy. re.compile() caches regex bytecode for high-throughput loops.',
            keyConcepts: ['Greedy vs Lazy (* vs *?)', 're.compile() Performance Cache', 'Regex Flag Modifiers (re.IGNORECASE)', 'Email & Form Validation'],
            revisionNotes: 'When parsing tags or quotes, always use lazy quantifiers like .*? or [^"]* to avoid overmatching across multiple blocks.'
        }
    },

    // ── MODULE 10: PYTHON MULTITHREADED PROGRAMMING ───────────────────────────
    "10-1": {
        content: `### 10.1 Processes vs Threads
- **Process:** An independent program in execution with its own private virtual memory address space. Expensive context switching.
- **Thread:** A lightweight sub-execution path sharing the memory heap of its parent process. Very fast communication, but risks race conditions.

### 10.2 The Global Interpreter Lock (GIL) in CPython
CPython's memory management is not fully thread-safe due to its reference counting garbage collector. The **GIL** is a mutual exclusion lock preventing multiple native OS threads from executing Python bytecode simultaneously on multiple CPU cores:

| Workload Type | Bottleneck | Concurrency Solution |
| :--- | :--- | :--- |
| **I/O-Bound** (Network, disk, DB queries) | Waiting on external I/O | \`threading\` or \`asyncio\` (GIL released during I/O!) |
| **CPU-Bound** (Matrix math, compression, ML) | Raw CPU cycles | \`multiprocessing\` (Separate processes, separate GILs) |

> **Crucial Takeaway:** Multithreading in Python provides massive speedups for I/O-bound tasks because CPython releases the GIL while waiting on network or disk!`,
        codeSnippets: [
            {
                language: 'python',
                title: 'Thread Information & Active Count Inspection',
                code: `import threading\n\ncurrent = threading.current_thread()\nprint(f"Main Thread: {current.name} (ID: {current.ident})")\nprint(f"Total Active Threads: {threading.active_count()}")`
            }
        ],
        aiSummary: {
            summary: 'Threads share process memory. The CPython GIL limits bytecode execution to 1 thread at a time, making threads ideal for I/O-bound tasks.',
            keyConcepts: ['Process vs Thread Architecture', 'CPython Global Interpreter Lock (GIL)', 'I/O-Bound vs CPU-Bound Tasks', 'multiprocessing vs threading'],
            revisionNotes: 'For CPU-heavy math tasks, use multiprocessing. For web requests and database queries, use threading or asyncio.'
        }
    },

    "10-2": {
        content: `### 10.3 Starting Threads with the \`threading\` Module
Define a worker target function and spawn a thread using \`threading.Thread\`:

\`\`\`python
import threading
import time

def fetch_api(endpoint):
    print(f"[{threading.current_thread().name}] Fetching {endpoint}...")
    time.sleep(1) # Simulates network latency
    print(f"[{threading.current_thread().name}] Finished {endpoint}!")

t1 = threading.Thread(target=fetch_api, args=("https://api.one.com",), name="Worker-1")
t2 = threading.Thread(target=fetch_api, args=("https://api.two.com",), name="Worker-2")

t1.start() # Spawns native OS thread
t2.start()

t1.join()  # Blocks caller until t1 finishes execution
t2.join()  # Blocks caller until t2 finishes execution
print("All network requests settled.")
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Concurrent Thread Spawning & join()',
                code: `import threading\nimport time\n\ndef worker(task_id):\n    time.sleep(0.1)\n    print(f"Task {task_id} completed by {threading.current_thread().name}")\n\nthreads = []\nfor i in range(3):\n    t = threading.Thread(target=worker, args=(i,))\n    threads.append(t)\n    t.start()\n\nfor t in threads:\n    t.join()\nprint("All worker threads joined successfully.")`
            }
        ],
        aiSummary: {
            summary: 'Spawn threads with threading.Thread(target, args). Call .start() to launch and .join() to wait for completion.',
            keyConcepts: ['threading.Thread Creation', '.start() vs .run()', '.join() Barrier Synchronization', 'Thread Naming Conventions'],
            revisionNotes: 'Never call t.run() directly; calling .run() executes code sequentially in the main thread without spawning a new thread.'
        }
    },

    "10-3": {
        content: `### 10.4 Race Conditions & Shared State Hazards
When multiple threads read and mutate shared memory simultaneously without coordination, race conditions corrupt data:

\`\`\`python
# Danger: Non-atomic increment (read -> add -> write)
shared_counter = 0

def unsafe_worker():
    global shared_counter
    for _ in range(100_000):
        shared_counter += 1 # Not atomic in bytecode!
\`\`\`

### 10.5 Mutual Exclusion with \`threading.Lock\`
A \`Lock\` allows only one thread to access a critical section at any given moment:
\`\`\`python
import threading

counter = 0
lock = threading.Lock()

def safe_worker():
    global counter
    for _ in range(50_000):
        with lock: # Automatically acquires and releases lock
            counter += 1
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Mutex Lock Synchronization Demonstration',
                code: `import threading\n\nbalance = 1000\naccount_lock = threading.Lock()\n\ndef debit(amount):\n    global balance\n    with account_lock:\n        if balance >= amount:\n            balance -= amount\n            print(f"Debited {amount}. Remaining: {balance}")\n\nt1 = threading.Thread(target=debit, args=(400,))\nt2 = threading.Thread(target=debit, args=(800,))\nt1.start(); t2.start()\nt1.join(); t2.join()`
            }
        ],
        aiSummary: {
            summary: 'Shared memory access without synchronization causes race conditions. threading.Lock coordinates critical sections safely.',
            keyConcepts: ['Race Conditions in Shared Memory', 'Non-atomic Bytecode Operations', 'threading.Lock Mutex', 'Context Managed Locks (with lock)'],
            revisionNotes: 'Always use with lock: instead of lock.acquire() and lock.release() to ensure locks are freed even if exceptions occur.'
        }
    },

    "10-4": {
        content: `### 10.6 Producer-Consumer Architecture with \`queue.Queue\`
The standard library \`queue.Queue\` is thread-safe and implements thread coordination, locking, and notification internally:
\`\`\`python
import threading
import queue
import time

task_queue = queue.Queue(maxsize=10)

def producer():
    for item in range(5):
        task_queue.put(item) # Blocks if queue is full
        print(f"Produced task {item}")

def consumer():
    while True:
        task = task_queue.get() # Blocks if queue is empty
        print(f"Consumed task {task}")
        task_queue.task_done()
\`\`\`

### 10.7 Semaphores for Throttling
A \`threading.Semaphore(n)\` permits up to \`n\` concurrent threads—ideal for rate-limiting calls against external third-party APIs.`,
        codeSnippets: [
            {
                language: 'python',
                title: 'Thread-safe Queue Task Pipeline',
                code: `import queue\nimport threading\n\nq = queue.Queue()\nfor i in ["Job-A", "Job-B", "Job-C"]:\n    q.put(i)\n\ndef worker():\n    while not q.empty():\n        job = q.get()\n        print(f"Processing {job}")\n        q.task_done()\n\nt = threading.Thread(target=worker)\nt.start()\nt.join()\nprint("Queue processing completed.")`
            }
        ],
        aiSummary: {
            summary: 'queue.Queue provides thread-safe producer-consumer pipelines with automatic locking. Semaphores limit concurrent resource usage.',
            keyConcepts: ['Producer-Consumer Pattern', 'Thread-safe queue.Queue', 'Bounded Buffers (maxsize)', 'threading.Semaphore Rate Limiting'],
            revisionNotes: 'Use queue.Queue for thread communication instead of manual locks and shared lists to eliminate deadlocks.'
        }
    },

    "10-5": {
        content: `### 10.8 Deadlocks: Causes and Prevention
A deadlock happens when two or more threads block forever waiting for locks held by each other (Circular Wait):
- Thread 1 holds Lock A, requests Lock B.
- Thread 2 holds Lock B, requests Lock A.

### Prevention Strategies
1. **Global Lock Ordering:** Always acquire locks in the exact same sequence across the entire application.
2. **Lock Timeouts:** Use \`lock.acquire(timeout=5)\` instead of blocking indefinitely.
3. **Use Queues:** Decouple components with queues rather than shared mutex locks.

### 10.9 Daemon Threads
Daemon threads run in the background (e.g., metric loggers, garbage monitors) and are **automatically terminated when all non-daemon threads exit**:
\`\`\`python
t = threading.Thread(target=background_monitor, daemon=True)
t.start()
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Daemon Thread Background Execution',
                code: `import threading\nimport time\n\ndef telemetry_logger():\n    while True:\n        time.sleep(0.5)\n        print("Telemetry heartbeat...")\n\ndaemon_t = threading.Thread(target=telemetry_logger, daemon=True)\ndaemon_t.start()\n\nprint("Main script finished; daemon thread terminates automatically.")`
            }
        ],
        aiSummary: {
            summary: 'Deadlocks happen when threads circular-wait for locks. Daemon threads run background tasks and terminate when main threads exit.',
            keyConcepts: ['Deadlock Conditions & Circular Wait', 'Lock Acquisition Ordering', 'Lock Timeouts (timeout=5)', 'Daemon Thread Lifecycle'],
            revisionNotes: 'Daemon threads are abruptly killed when the main thread finishes, without executing finally blocks or flushing file buffers.'
        }
    },

    // ── MODULE 11: USING DATABASES IN PYTHON ──────────────────────────────────
    "11-1": {
        content: `### 11.1 Python DB-API 2.0 (PEP 249) Standard
Python standardizes all database drivers (PostgreSQL, MySQL, SQLite, Oracle) under **PEP 249**. Every compliant driver exposes identical core objects:
- **Connection Object:** Represents the physical socket connection to the database engine.
- **Cursor Object:** Executes SQL queries, handles transactions, and iterates through result sets.

### 11.2 Standard Database Drivers
- **SQLite:** \`sqlite3\` (Built into Python standard library, zero setup required).
- **PostgreSQL:** \`psycopg2\` or \`asyncpg\`.
- **MySQL:** \`mysql-connector-python\` or \`PyMySQL\`.`,
        codeSnippets: [
            {
                language: 'python',
                title: 'In-Memory SQLite DB-API Connection',
                code: `import sqlite3\n\n# Open in-memory test database\nconn = sqlite3.connect(":memory:")\ncursor = conn.cursor()\n\ncursor.execute("SELECT sqlite_version()")\nversion = cursor.fetchone()\nprint("SQLite Version:", version[0])\nconn.close()`
            }
        ],
        aiSummary: {
            summary: 'PEP 249 DB-API 2.0 standardizes database client drivers across Python. sqlite3 is built-in; psycopg2 powers PostgreSQL.',
            keyConcepts: ['PEP 249 Standard', 'Connection & Cursor Roles', 'sqlite3 Built-in Zero-Config', 'Enterprise Drivers (psycopg2, PyMySQL)'],
            revisionNotes: 'Always close connections using conn.close() or manage them via context managers to prevent socket leaks.'
        }
    },

    "11-2": {
        content: `### 11.3 Managing Database Connections & Autocommit
Establishing a database connection involves authentication, TLS handshakes, and resource allocation:
\`\`\`python
import sqlite3

# Context managed connection automatically handles commit() and rollback()
with sqlite3.connect("store.db") as conn:
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS inventory (id INT, item TEXT)")
\`\`\`

### Transactions: Commit & Rollback
- \`conn.commit()\`: Persists pending uncommitted changes to disk storage.
- \`conn.rollback()\`: Reverts all uncommitted changes back to the previous snapshot state.`,
        codeSnippets: [
            {
                language: 'python',
                title: 'Transaction Commit & Rollback Workflow',
                code: `import sqlite3\n\nconn = sqlite3.connect(":memory:")\ncur = conn.cursor()\ncur.execute("CREATE TABLE accounts (name TEXT, balance INT)")\ncur.execute("INSERT INTO accounts VALUES ('Alice', 1000)")\nconn.commit()\n\n# Transaction rollback simulation\ntry:\n    cur.execute("UPDATE accounts SET balance = balance - 200 WHERE name = 'Alice'")\n    raise RuntimeError("Power failure during transaction!")\n    conn.commit()\nexcept RuntimeError:\n    conn.rollback()\n    print("Transaction rolled back safely.")\n\ncur.execute("SELECT balance FROM accounts WHERE name = 'Alice'")\nprint("Balance retained:", cur.fetchone()[0])`
            }
        ],
        aiSummary: {
            summary: 'Database transactions are atomic units of work. Call conn.commit() to persist changes or conn.rollback() to abort on failure.',
            keyConcepts: ['Connection Management', 'ACID Transaction Guarantees', 'conn.commit() vs conn.rollback()', 'Connection Pooling Concepts'],
            revisionNotes: 'Without conn.commit(), DML changes (INSERT, UPDATE, DELETE) are discarded when the script terminates.'
        }
    },

    "11-3": {
        content: `### 11.4 DDL Operations: Table Schema Creation
Data Definition Language (DDL) creates and alters relational schema structures:
\`\`\`python
import sqlite3

conn = sqlite3.connect("school.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS students (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    gpa REAL DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")
conn.commit()
conn.close()
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'DDL Table Schema Creation',
                code: `import sqlite3\n\nconn = sqlite3.connect(":memory:")\ncur = conn.cursor()\n\ncur.execute("""\nCREATE TABLE products (\n    sku TEXT PRIMARY KEY,\n    title TEXT NOT NULL,\n    price REAL CHECK(price >= 0)\n)\n""")\n\ncur.execute("SELECT name FROM sqlite_master WHERE type='table'")\nprint("Tables created:", [r[0] for r in cur.fetchall()])`
            }
        ],
        aiSummary: {
            summary: 'DDL statements (CREATE TABLE, ALTER, DROP) define relational database schemas, column datatypes, primary keys, and constraints.',
            keyConcepts: ['DDL Schema Definitions', 'PRIMARY KEY & Constraints', 'AUTOINCREMENT Sequences', 'sqlite_master Introspection'],
            revisionNotes: 'Always include IF NOT EXISTS in CREATE TABLE scripts to make database migration scripts idempotent.'
        }
    },

    "11-4": {
        content: `### 11.5 DML INSERT & SQL Injection Defense
**Never format user values into SQL strings via f-strings or string concatenation!** This creates critical **SQL Injection vulnerabilities**. Always use parameterized queries:

\`\`\`python
# DANGEROUS VULNERABILITY (SQL Injection):
# cursor.execute(f"INSERT INTO users VALUES ('{user_input}')")

# SECURE: Parameterized Query
user_data = ("Asha Sharma", "asha@higenlabs.in", 3.92)
cursor.execute("""
    INSERT INTO students (full_name, email, gpa)
    VALUES (?, ?, ?)
""", user_data)
conn.commit()
\`\`\`

### 11.6 Bulk Inserts with \`executemany()\`
\`\`\`python
students_batch = [
    ("Vikram Rao", "vikram@domain.com", 3.85),
    ("Ananya Sen", "ananya@domain.com", 3.95),
    ("Rohan Patel", "rohan@domain.com", 3.60)
]
cursor.executemany("INSERT INTO students (full_name, email, gpa) VALUES (?, ?, ?)", students_batch)
conn.commit()
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Parameterized Queries & executemany Batching',
                code: `import sqlite3\n\nconn = sqlite3.connect(":memory:")\ncur = conn.cursor()\ncur.execute("CREATE TABLE users (id INT, name TEXT)")\n\n# Secure parameter substitution using ? placeholder\nbatch = [(1, "Alice"), (2, "Bob"), (3, "Charlie")]\ncur.executemany("INSERT INTO users VALUES (?, ?)", batch)\nconn.commit()\n\ncur.execute("SELECT COUNT(*) FROM users")\nprint("Inserted user count:", cur.fetchone()[0])`
            }
        ],
        aiSummary: {
            summary: 'Always use parameterized queries (?, %s) to prevent SQL injection. executemany() batches bulk insertions efficiently.',
            keyConcepts: ['SQL Injection Vulnerabilities', 'Parameterized Placeholders (?, %s)', 'executemany() Batch Ingestion', 'Atomic Multi-row Commits'],
            revisionNotes: 'Never construct SQL using f-strings or format(); the database driver must sanitize inputs via query parameters.'
        }
    },

    "11-5": {
        content: `### 11.7 Querying Data: SELECT and Fetch Methods
Execute query statements and retrieve matching records:
- **\`cursor.fetchone()\`:** Returns the next single row tuple, or \`None\` when exhausted.
- **\`cursor.fetchall()\`:** Returns a list of all remaining result tuples.
- **\`cursor.fetchmany(size)\`:** Returns a batch of \`size\` rows.

\`\`\`python
cursor.execute("SELECT student_id, full_name, gpa FROM students WHERE gpa >= ?", (3.8,))

# Fetching one by one
while row := cursor.fetchone():
    print(f"ID: {row[0]}, Name: {row[1]}, GPA: {row[2]}")
\`\`\`

### 11.8 Dictionary Cursors (\`sqlite3.Row\`)
Map column names to indices for dictionary-style attribute access:
\`\`\`python
conn.row_factory = sqlite3.Row
cursor = conn.cursor()
cursor.execute("SELECT * FROM students")
for row in cursor.fetchall():
    print(row["full_name"], "->", row["email"])
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'sqlite3.Row Dictionary Mapping',
                code: `import sqlite3\n\nconn = sqlite3.connect(":memory:")\nconn.row_factory = sqlite3.Row\ncur = conn.cursor()\n\ncur.execute("CREATE TABLE metrics (name TEXT, value REAL)")\ncur.execute("INSERT INTO metrics VALUES ('cpu_usage', 72.4)")\n\ncur.execute("SELECT * FROM metrics")\nrow = cur.fetchone()\nprint("Access by name:", row["name"], "=>", row["value"])`
            }
        ],
        aiSummary: {
            summary: 'Query records with fetchone(), fetchall(), or fetchmany(). Set conn.row_factory = sqlite3.Row for dictionary-like column access.',
            keyConcepts: ['cursor.fetchone() vs fetchall()', 'cursor.fetchmany(chunk_size)', 'sqlite3.Row Column Mapping', 'Streaming Large Query Results'],
            revisionNotes: 'Use fetchmany() or cursor iteration for million-row queries to prevent allocating giant result lists into RAM.'
        }
    },

    "11-6": {
        content: `### 11.9 DDL vs DML Summary
| Dimension | DDL (Definition) | DML (Manipulation) |
| :--- | :--- | :--- |
| **Commands** | \`CREATE\`, \`ALTER\`, \`DROP\`, \`TRUNCATE\` | \`INSERT\`, \`UPDATE\`, \`DELETE\`, \`SELECT\` |
| **Target** | Database schema & table structures | Concrete data row values |
| **Transactions** | Often autocommitted in many DBs | Requires explicit \`conn.commit()\` |

### 11.10 Complete End-to-End SQLite Lifecycle
\`\`\`python
import sqlite3

def run_database_flow():
    with sqlite3.connect("app.db") as conn:
        cur = conn.cursor()
        # DDL
        cur.execute("CREATE TABLE IF NOT EXISTS audit (id INT, action TEXT)")
        # DML Insert
        cur.execute("INSERT INTO audit VALUES (?, ?)", (1, "LOGIN"))
        # DML Update
        cur.execute("UPDATE audit SET action = ? WHERE id = ?", ("LOGOUT", 1))
        # Query
        cur.execute("SELECT * FROM audit")
        print("Audit rows:", cur.fetchall())
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Full Database Lifecycle: DDL, DML, Query',
                code: `import sqlite3\n\nwith sqlite3.connect(":memory:") as conn:\n    cur = conn.cursor()\n    cur.execute("CREATE TABLE tasks (id INT, title TEXT, done INT)")\n    cur.execute("INSERT INTO tasks VALUES (1, 'Complete Python Masterclass', 0)")\n    cur.execute("UPDATE tasks SET done = 1 WHERE id = 1")\n    \n    cur.execute("SELECT title, done FROM tasks")\n    print("Task status:", cur.fetchall())`
            }
        ],
        aiSummary: {
            summary: 'DDL defines database structures while DML modifies records. A complete workflow integrates schema creation, parameterized queries, and commits.',
            keyConcepts: ['DDL vs DML Distinctions', 'Complete DB Lifecycle', 'Idempotent Schema Migrations', 'Context Managed Auto-cleanup'],
            revisionNotes: 'Always wrap database scripts in context managers (with sqlite3.connect(...) as conn:) for automatic commits and rollbacks.'
        }
    },

    // ── MODULE 12: DATA SCIENCE USING PYTHON ──────────────────────────────────
    "12-1": {
        content: `### 12.1 Introduction to NumPy
NumPy (Numerical Python) is the foundational engine of modern Python data science and machine learning. At its core is the **\`ndarray\`** (N-dimensional array):
- **Contiguous Memory:** Elements stored in continuous memory blocks without Python object pointer overhead.
- **Homogeneous Datatypes:** All elements share a single datatype (e.g., \`float64\`, \`int32\`).
- **Vectorized Computation:** Compiled C routines perform fast SIMD operations without Python for-loop delays.

\`\`\`python
import numpy as np

# Creating 1D and 2D arrays
arr1d = np.array([1, 2, 3, 4, 5])
arr2d = np.array([[1, 2, 3], [4, 5, 6]], dtype=np.float32)

print("Shape:", arr2d.shape) # (2, 3)
print("Data type:", arr2d.dtype)
\`\`\`

### 12.2 Built-in Array Generators
- \`np.zeros((3, 3))\`: 3x3 matrix filled with 0.0.
- \`np.ones((2, 4))\`: 2x4 matrix filled with 1.0.
- \`np.arange(0, 10, 2)\`: Array with step progression (\`[0, 2, 4, 6, 8]\`).
- \`np.linspace(0, 1, 5)\`: 5 evenly spaced points between 0 and 1 inclusive.`,
        codeSnippets: [
            {
                language: 'python',
                title: 'NumPy Array Creation & Generators',
                code: `import numpy as np\n\nvec = np.arange(1, 10)\nmatrix = vec.reshape((3, 3))\nprint("3x3 Matrix:\\n", matrix)\nprint("Itemsize (bytes):", matrix.itemsize)\nprint("Total elements:", matrix.size)`
            }
        ],
        aiSummary: {
            summary: 'NumPy provides fast ndarrays in contiguous memory. Vectorized operations execute in compiled C, outperforming Python lists by 50-100x.',
            keyConcepts: ['ndarray Architecture', 'Homogeneous Datatypes', 'Vectorization & SIMD', 'np.zeros, np.ones, np.linspace'],
            revisionNotes: 'Unlike standard Python lists, all elements in a NumPy array must share the exact same datatype.'
        }
    },

    "12-2": {
        content: `### 12.3 NumPy Indexing, Slicing & Strides
NumPy supports multi-dimensional slicing without copying data (returns a memory view):
\`\`\`python
import numpy as np

grid = np.array([
    [10, 20, 30],
    [40, 50, 60],
    [70, 80, 90]
])

print(grid[0, 1])     # 20 (row 0, col 1)
print(grid[:, 1])      # [20, 50, 80] (all rows, col 1)
print(grid[:2, 1:])    # 2x2 submatrix
\`\`\`

### 12.4 Vectorized Universal Functions (ufuncs)
Element-wise arithmetic without writing loops:
\`\`\`python
a = np.array([1, 2, 3])
b = np.array([10, 20, 30])

print(a + b)           # [11, 22, 33]
print(a * 2)           # [2, 4, 6] (Broadcasting scalar)
print(np.sqrt(a))      # [1.0, 1.414, 1.732]
print(grid.T)          # Matrix Transposition
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'Vectorized Arithmetic & Matrix Transpose',
                code: `import numpy as np\n\nm = np.array([[1, 2], [3, 4]])\nprint("Original:\\n", m)\nprint("Transposed (m.T):\\n", m.T)\nprint("Element-wise Squared:\\n", m ** 2)`
            }
        ],
        aiSummary: {
            summary: 'NumPy slicing returns views rather than copies. Universal functions (ufuncs) perform element-wise vectorized arithmetic.',
            keyConcepts: ['Multi-dimensional Slicing', 'Array Views vs Copies', 'Broadcasting Rules', 'Universal Functions (ufuncs)'],
            revisionNotes: 'Modifying an array slice modifies the parent array because slicing returns a view, not an isolated copy.'
        }
    },

    "12-3": {
        content: `### 12.5 Array Aggregations & Axis Operations
Aggregate functions take an \`axis\` parameter:
- \`axis=0\`: Aggregate vertically down columns.
- \`axis=1\`: Aggregate horizontally across rows.

\`\`\`python
import numpy as np

scores = np.array([
    [85, 90, 78],
    [92, 88, 95]
])

print("Overall mean:", scores.mean())
print("Mean per student (row):", scores.mean(axis=1))
print("Max score per subject (col):", scores.max(axis=0))
\`\`\`

### 12.6 Binary File I/O with \`np.save\` & \`np.load\`
Save arrays efficiently to disk in binary \`.npy\` format:
\`\`\`python
np.save("model_weights.npy", scores)
loaded = np.load("model_weights.npy")
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'NumPy Aggregations across Axes',
                code: `import numpy as np\n\ndata = np.array([[10, 20], [30, 40]])\nprint("Sum all:", data.sum())\nprint("Sum axis=0 (columns):", data.sum(axis=0))\nprint("Sum axis=1 (rows):", data.sum(axis=1))\nprint("Standard deviation:", data.std())`
            }
        ],
        aiSummary: {
            summary: 'Aggregate with .mean(), .sum(), and .std(). axis=0 operates down columns; axis=1 operates across rows. np.save saves in binary .npy format.',
            keyConcepts: ['Axis Operations (axis=0, axis=1)', 'Statistical Reductions', 'Binary Serialization (.npy)', 'Matrix Reductions'],
            revisionNotes: 'Remember: axis=0 collapses rows (leaving column metrics); axis=1 collapses columns (leaving row metrics).'
        }
    },

    "12-4": {
        content: `### 12.7 Introduction to Pandas: Series & DataFrames
Pandas provides high-level data analysis structures built on top of NumPy:
- **\`Series\`:** 1-dimensional labeled array.
- **\`DataFrame\`:** 2-dimensional tabular structure with labeled rows (index) and columns.

\`\`\`python
import pandas as pd

# Creating a DataFrame from a dictionary
data = {
    "Name": ["Asha", "Vikram", "Ananya"],
    "Department": ["AI", "Cloud", "Security"],
    "Salary": [95000, 88000, 105000]
}
df = pd.DataFrame(data)
print(df)
\`\`\`

### Core Inspection Methods
- \`df.head(n)\`: Displays the first n rows (default 5).
- \`df.info()\`: Shows column datatypes, memory usage, and non-null counts.
- \`df.describe()\`: Statistical summary (mean, std, min, max, quartiles).`,
        codeSnippets: [
            {
                language: 'python',
                title: 'Pandas DataFrame Creation & Inspection',
                code: `import pandas as pd\n\nsales = pd.DataFrame({\n    "Product": ["Laptop", "Monitor", "Keyboard"],\n    "Price": [1200, 350, 85],\n    "Units": [15, 40, 120]\n})\n\nsales["Revenue"] = sales["Price"] * sales["Units"]\nprint(sales)\nprint("\\nSummary Statistics:\\n", sales.describe())`
            }
        ],
        aiSummary: {
            summary: 'Pandas provides DataFrames (2D tables) and Series (1D columns). .describe() and .info() inspect schema structure and summary statistics.',
            keyConcepts: ['Series vs DataFrame', 'Labeled Row & Column Indices', '.info() Schema Inspection', '.describe() Descriptive Stats'],
            revisionNotes: 'A DataFrame is essentially a collection of Series objects sharing a common row index.'
        }
    },

    "12-5": {
        content: `### 12.8 Indexing: \`loc\` vs \`iloc\`
Pandas offers two primary selection accessors:
- **\`df.loc[]\`:** Label-based selection (by row/column names). End boundary is **inclusive**!
- **\`df.iloc[]\`:** Integer position-based selection (0 to N-1). End boundary is **exclusive**!

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Score": [88, 92, 79]
}, index=["Alice", "Bob", "Charlie"])

# Label based
print(df.loc["Alice", "Score"])      # 88
print(df.loc["Alice":"Bob"])         # Inclusive of "Bob"!

# Integer position based
print(df.iloc[0, 0])                 # 88
print(df.iloc[0:2])                  # Rows 0 and 1 (exclusive of 2)
\`\`\`

### 12.9 Boolean Mask Filtering
\`\`\`python
high_scorers = df[df["Score"] >= 85]
print(high_scorers)
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'loc vs iloc & Boolean Filtering',
                code: `import pandas as pd\n\nemployees = pd.DataFrame({\n    "Name": ["John", "Sara", "Mike", "Emma"],\n    "Dept": ["IT", "HR", "IT", "Finance"],\n    "Salary": [70000, 65000, 85000, 90000]\n})\n\n# Boolean mask filter\nit_staff = employees[employees["Dept"] == "IT"]\nprint("IT Staff:\\n", it_staff)\nprint("\\nTop earner with iloc:\\n", employees.iloc[2])`
            }
        ],
        aiSummary: {
            summary: 'loc uses labels and is boundary-inclusive. iloc uses 0-based integer positions and is boundary-exclusive. Boolean masks filter rows cleanly.',
            keyConcepts: ['loc Label-based Access (Inclusive)', 'iloc Integer-based Access (Exclusive)', 'Boolean Mask Filtering', 'Column Slicing'],
            revisionNotes: 'Remember: loc["a":"c"] includes "c", whereas iloc[0:2] only selects indices 0 and 1.'
        }
    },

    "12-6": {
        content: `### 12.10 Aggregation & GroupBy Mechanics
The **Split-Apply-Combine** pattern groups data by categories and computes summary metrics:

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "Dept": ["Engineering", "Sales", "Engineering", "Sales"],
    "Salary": [120000, 80000, 140000, 95000]
})

dept_summary = df.groupby("Dept")["Salary"].agg(["mean", "max", "count"])
print(dept_summary)
\`\`\`

### 12.11 Handling Missing Data (NaN)
- \`df.isnull().sum()\`: Count missing values per column.
- \`df.dropna()\`: Drops rows containing missing values.
- \`df.fillna(value)\`: Imputes missing values with a designated constant or column mean.`,
        codeSnippets: [
            {
                language: 'python',
                title: 'Pandas GroupBy & Imputing Missing Values',
                code: `import pandas as pd\nimport numpy as np\n\ndf = pd.DataFrame({\n    "City": ["Pune", "Mumbai", "Pune", "Mumbai"],\n    "Temp": [28.5, np.nan, 30.2, 32.0]\n})\n\nprint("Missing count:\\n", df.isnull().sum())\n# Impute missing temperature with column mean\ndf["Temp"] = df["Temp"].fillna(df["Temp"].mean())\nprint("\\nCleaned Data:\\n", df)\nprint("\\nAvg Temp by City:\\n", df.groupby("City")["Temp"].mean())`
            }
        ],
        aiSummary: {
            summary: 'groupby() implements the split-apply-combine paradigm for grouped statistics. Handle missing data via .isnull(), .dropna(), and .fillna().',
            keyConcepts: ['Split-Apply-Combine Pattern', 'groupby().agg() Method', 'Detecting NaN with .isnull()', 'Imputation with .fillna()'],
            revisionNotes: 'Never silently drop NaN values without inspecting their distribution; impute with mean/median when appropriate.'
        }
    },

    "12-7": {
        content: `### 12.12 Visual Analytics with Matplotlib
Matplotlib is the primary 2D plotting library for Python data science:
\`\`\`python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [10, 25, 45, 60, 95]

plt.figure(figsize=(8, 4))
plt.plot(x, y, color="#2563eb", marker="o", linestyle="--", label="Growth")
plt.title("System Performance Velocity")
plt.xlabel("Sprint Cycle")
plt.ylabel("Velocity Points")
plt.grid(True, linestyle=":", alpha=0.6)
plt.legend()
plt.tight_layout()
plt.show()
\`\`\`

### Common Plot Types
- **Line Plot (\`plt.plot\`):** Trends over continuous intervals.
- **Bar Chart (\`plt.bar\`):** Category-wise comparison.
- **Histogram (\`plt.hist\`):** Distribution and frequency analysis.
- **Scatter Plot (\`plt.scatter\`):** Correlation between two continuous variables.`,
        codeSnippets: [
            {
                language: 'python',
                title: 'Matplotlib Line & Bar Plot Architecture',
                code: `import matplotlib.pyplot as plt\n\nmonths = ["Jan", "Feb", "Mar", "Apr"]\nrevenue = [12000, 15500, 18200, 22000]\n\nfig, ax = plt.subplots(figsize=(6, 3))\nax.bar(months, revenue, color="#3b82f6")\nax.set_title("Q1 Revenue Trend")\nax.set_ylabel("USD (\$)")\nplt.tight_layout()\nprint("Matplotlib figure configured successfully.")`
            }
        ],
        aiSummary: {
            summary: 'Matplotlib renders 2D visual charts (line, bar, scatter, histogram). Use plt.subplots() for clean object-oriented figure and axis control.',
            keyConcepts: ['Figure and Axes Objects', 'Line, Bar, Scatter Plots', 'Labels, Titles & Legends', 'plt.tight_layout() Spacing'],
            revisionNotes: 'Always prefer the object-oriented API (fig, ax = plt.subplots()) over stateful pyplot commands for reproducible visuals.'
        }
    },

    "12-8": {
        content: `### 12.13 Mini-Project: Student Results Analysis Pipeline
A complete end-to-end data science pipeline integrating NumPy vectorization, Pandas grouping, and analytical evaluation:

\`\`\`python
import pandas as pd
import numpy as np

# 1. Dataset Ingestion
records = {
    "StudentID": [101, 102, 103, 104, 105, 106],
    "Subject": ["Python", "Python", "Data", "Data", "Python", "Data"],
    "Score": [88, 94, 76, 85, 91, 62],
    "Attendance": [95, 98, 80, 88, 92, 70]
}
df = pd.DataFrame(records)

# 2. Vectorized Feature Engineering
# Pass if Score >= 75 and Attendance >= 75
df["Passed"] = (df["Score"] >= 75) & (df["Attendance"] >= 75)

# 3. Grouped Analytics
summary = df.groupby("Subject").agg(
    Avg_Score=("Score", "mean"),
    Pass_Rate=("Passed", "mean")
)
print("Pipeline Analytics Output:\\n", summary)
\`\`\``,
        codeSnippets: [
            {
                language: 'python',
                title: 'End-to-End Data Science Pipeline Project',
                code: `import pandas as pd\nimport numpy as np\n\ndf = pd.DataFrame({\n    "Candidate": ["Asha", "Vikram", "Rohan", "Ananya"],\n    "Quiz": [85, 92, 78, 95],\n    "Project": [90, 88, 84, 98]\n})\n\n# Vectorized grading\ndf["FinalScore"] = 0.4 * df["Quiz"] + 0.6 * df["Project"]\ndf["Grade"] = np.where(df["FinalScore"] >= 90, "A", "B")\nprint(df.sort_values(by="FinalScore", ascending=False))`
            }
        ],
        aiSummary: {
            summary: 'Integrated data science project demonstrating dataset construction, vectorized metrics, categorization with np.where, and grouped aggregation.',
            keyConcepts: ['End-to-End Data Pipeline', 'Vectorized Metric Engineering', 'np.where() Conditional Flagging', 'Multi-column Grouped Analysis'],
            revisionNotes: 'Combine Pandas for tabular restructuring with NumPy vectorization for high-performance production data analytics.'
        }
    }
};
