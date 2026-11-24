const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const Organization = require('./models/Organization');
const Batch = require('./models/Batch');
const Course = require('./models/Course');
const User = require('./models/User');
const StudentProgress = require('./models/StudentProgress');
const PracticeLab = require('./models/PracticeLab');
const Test = require('./models/Test');
const { dsaModules } = require('./updateDsaCourse');

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/higenlabs';

async function seed() {
    try {
        console.log('Connecting to MongoDB...', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB successfully.');

        // Clean up any stale index in courses or organizations
        try {
            await mongoose.connection.collection('courses').dropIndex('id_1');
        } catch (e) {}
        try {
            await mongoose.connection.collection('organizations').dropIndex('apiKey_1');
        } catch (e) {}

        // 1. Institutions
        console.log('Seeding Institutions...');
        let shoolini = await Organization.findOne({ code: 'SHOOLINI' });
        if (!shoolini) {
            shoolini = new Organization({
                name: 'Shoolini University',
                code: 'SHOOLINI',
                domain: 'shooliniuniversity.com',
                type: 'University',
                plan: 'enterprise',
                seatCount: 1500,
                contactPerson: 'Dr. Sharma',
                contactEmail: 'academics@shoolini.edu',
                billingEmail: 'accounts@shoolini.edu',
                settings: { enforceStrictSequence: true, allowSelfRegistration: false, defaultPassScorePercent: 60 }
            });
            await shoolini.save();
        }

        let gla = await Organization.findOne({ code: 'GLA' });
        if (!gla) {
            gla = new Organization({
                name: 'GLA University',
                code: 'GLA',
                domain: 'gla.ac.in',
                type: 'University',
                plan: 'enterprise',
                seatCount: 2000,
                contactPerson: 'Prof. Verma',
                contactEmail: 'director.it@gla.ac.in',
                settings: { enforceStrictSequence: true, allowSelfRegistration: false, defaultPassScorePercent: 60 }
            });
            await gla.save();
        }

        let higenOrg = await Organization.findOne({ code: 'HIGEN' });
        if (!higenOrg) {
            higenOrg = new Organization({
                name: 'HiGen Global Institute',
                code: 'HIGEN',
                domain: 'higenlabs.in',
                type: 'TrainingPartner',
                plan: 'enterprise',
                seatCount: 10000,
                contactPerson: 'HiGen Admin',
                contactEmail: 'support@higenlabs.in'
            });
            await higenOrg.save();
        }

        // 2. Instructor and Admin Users
        const hashedAdminPwd = bcrypt.hashSync('Admin@123', 10);
        const hashedStudentPwd = bcrypt.hashSync('Student@123', 10);
        const hashedTeacherPwd = bcrypt.hashSync('Teacher@123', 10);

        const adminUser = await User.findOneAndUpdate(
            { email: 'admin@higenlabs.in' },
            {
                name: 'HiGen System Admin',
                email: 'admin@higenlabs.in',
                password: hashedAdminPwd,
                role: 'Admin',
                institutionId: higenOrg._id,
                orgId: higenOrg._id,
                isActive: true
            },
            { upsert: true, new: true }
        );

        const instructorUser = await User.findOneAndUpdate(
            { email: 'instructor@higenlabs.in' },
            {
                name: 'Dr. Aryan Saxena',
                email: 'instructor@higenlabs.in',
                password: hashedTeacherPwd,
                role: 'Teacher',
                institutionId: shoolini._id,
                orgId: shoolini._id,
                isActive: true
            },
            { upsert: true, new: true }
        );

        // 3. Courses
        console.log('Seeding Courses...');
        const pythonCourse = await Course.findOneAndUpdate(
            { code: 'SHU-PY-101' },
            {
                title: 'Shoolini - Python Programming',
                code: 'SHU-PY-101',
                description: 'Comprehensive Python programming from fundamentals to object-oriented architectures and real-world scripting.',
                category: 'Python',
                level: 'Beginner',
                thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
                instructorId: instructorUser._id,
                instructorName: instructorUser.name,
                institutionRestrictions: [shoolini._id],
                sequentialOrder: true,
                estimatedTotalHours: 35,
                modules: [
                    {
                        orderIndex: 1,
                        title: 'Module 01: Variables, Types & Syntax Fundamentals',
                        description: 'Learn the core building blocks of Python syntax, variable allocation, data types, and arithmetic operations.',
                        lessons: [
                            {
                                orderIndex: 1,
                                title: 'Variables, Assignment, and Naming Conventions',
                                slug: 'variables-assignment-and-naming-conventions',
                                contentType: 'article',
                                estimatedMinutes: 20,
                                content: `### Introduction\nThink about a kitchen shelf lined with jars. One is labelled "sugar", another "salt", another "tea". The label is not the contents; it is how you find the contents. When a recipe says "add two spoons of sugar", you do not care which exact grains you use. You just reach for the jar named "sugar".\n\nA \`variable\` in Python is exactly that: a label attached to a piece of data. You already met one in the last unit, when a program asked for your name and remembered it. That remembered value lived in a variable. Without that labelled drawer, the computer would have nowhere to keep what you typed, and the very next line of the program would have no idea what you meant by "your name". Variables are the reason a program can hold a thought from one line to the next instead of forgetting everything the instant it moves on. In this lesson we look at how to create variables, how to give them values, and how to name them well.\n\n**Definition:** A \`variable\` in Python is an identifier bound to an object in memory.\n\n### Variable Declaration & Dynamic Typing\nIn Python, you do not declare types explicitly. You simply assign a value to an identifier:\n\n\`\`\`python\n# Creating variables with clean descriptive names\nstudent_name = "Pranshu Pathak"\nage = 20\ncourse_grade = 98.5\nis_enrolled = True\n\nprint(f"Student: {student_name}, Age: {age}, Enrolled: {is_enrolled}")\n\`\`\`\n\n### Memory Reference Model\nUnlike C or C++ where a variable is a named memory location holding raw bytes, Python variables are **pointers/references** to objects stored in the heap:\n\n1. **Object Creation:** An object of a specific type (e.g. integer 42) is created in memory.\n2. **Binding:** The variable name (e.g. \`score\`) is bound to that object's memory address.\n3. **Reassignment:** Reassigning \`score = 50\` simply points the name to a new object.`,
                                codeSnippets: [
                                    {
                                        language: 'python',
                                        title: 'Variables and Reference Demo',
                                        code: 'x = 10\ny = x\nprint("x ID:", id(x))\nprint("y ID:", id(y))\n# Both point to identical integer object\n\nx = 20\nprint("After modifying x:")\nprint("x:", x, "y:", y)',
                                        explanation: 'Demonstrates immutability of integers and reference rebinding in Python.'
                                    }
                                ],
                                aiSummary: {
                                    summary: 'Variables in Python act as labels (references) pointing to objects stored in memory. Python uses dynamic typing, meaning variable types are resolved at runtime based on the assigned object.',
                                    keyConcepts: [
                                        'Variables are names bound to objects in heap memory',
                                        'Dynamic typing removes the need for explicit type declarations',
                                        'Naming conventions follow PEP 8 snake_case for variables and functions',
                                        'Immutability vs Mutability dictates how memory references react to changes'
                                    ],
                                    visualDiagram: 'graph LR\n  A["Variable Name (label)"] -->|"Points to reference"| B["Heap Object (Type: int, Value: 42)"]\n  C["Second Variable Name"] -->|"Points to same reference"| B',
                                    revisionNotes: 'Remember: PEP 8 prescribes lowercase words separated by underscores (snake_case) for variable names. Avoid single-letter variables except in quick loops (i, j, k).',
                                    formulas: ['Identifier = Expression', 'type(var_name) -> Class Object', 'id(var_name) -> Memory Integer']
                                },
                                resources: [
                                    { title: 'PEP 8 Style Guide for Python Code (Official)', url: 'https://peps.python.org/pep-0008/', type: 'link' }
                                ]
                            },
                            {
                                orderIndex: 2,
                                title: 'Numbers: int, float, and complex',
                                slug: 'numbers-int-float-complex',
                                contentType: 'article',
                                estimatedMinutes: 15,
                                content: `### Numeric Types in Python\nPython provides three distinct numeric types: integers (\`int\`), floating-point numbers (\`float\`), and complex numbers (\`complex\`).\n\n#### 1. Integers\nIntegers have unlimited precision in Python 3. They can grow as large as system memory permits.\n\n\`\`\`python\nlarge_num = 10 ** 50\nprint(large_num)\n\`\`\`\n\n#### 2. Floating-Point Numbers\nFloats are implemented using standard C \`double\` (IEEE 754 floating point standard). Beware of decimal representation limits!`,
                                aiSummary: {
                                    summary: 'Python supports arbitrarily large integers without overflow, IEEE 754 double-precision floats, and native complex numbers with j suffix.',
                                    keyConcepts: ['Arbitrary precision ints', 'IEEE 754 floats', 'Float round-off caution'],
                                    visualDiagram: 'graph TD\n  Numeric["Numeric Types"] --> Int["int (Arbitrary precision)"]\n  Numeric --> Float["float (IEEE 754 64-bit)"]\n  Numeric --> Complex["complex (a + bj)"]',
                                    revisionNotes: 'Use the `decimal` module for mission-critical financial calculations where binary float rounding issues cannot be tolerated.'
                                }
                            },
                            {
                                orderIndex: 3,
                                title: 'Strings and Booleans',
                                slug: 'strings-and-booleans',
                                contentType: 'article',
                                estimatedMinutes: 15,
                                content: `### Strings in Python\nStrings (\`str\`) in Python are immutable sequences of Unicode characters. You can define strings using single, double, or triple quotes.\n\n\`\`\`python\nmsg = "HiGen Labs LMS"\nprint(msg[0:5]) # Slice: 'HiGen'\nprint(len(msg))\n\`\`\`\n\n### Booleans\nBooleans (\`bool\`) represent truth values: \`True\` and \`False\`. In Python, \`bool\` is a subclass of \`int\`, where \`True == 1\` and \`False == 0\`.`
                            },
                            {
                                orderIndex: 4,
                                title: 'Type Conversion (Casting)',
                                slug: 'type-conversion-casting',
                                contentType: 'article',
                                estimatedMinutes: 10,
                                content: `### Explicit and Implicit Type Conversion\nPython provides built-in constructors for explicit casting: \`int()\`, \`float()\`, \`str()\`, and \`bool()\`.`
                            },
                            {
                                orderIndex: 5,
                                title: 'Arithmetic Operators',
                                slug: 'arithmetic-operators',
                                contentType: 'article',
                                estimatedMinutes: 15,
                                content: `### Standard & Special Arithmetic Operators\nPython supports \`+\`, \`-\`, \`*\`, \`/\` (float division), \`//\` (floor division), \`%\` (modulo), and \`**\` (exponentiation).`
                            },
                            {
                                orderIndex: 6,
                                title: 'Comparison (Relational) Operators',
                                slug: 'comparison-relational-operators',
                                contentType: 'article',
                                estimatedMinutes: 15,
                                content: `### Comparison Operators\nEvaluate expressions to boolean \`True\` or \`False\`: \`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\`, and identity operators \`is\` and \`is not\`.`
                            },
                            {
                                orderIndex: 7,
                                title: 'Logical Operators: and, or, not',
                                slug: 'logical-operators',
                                contentType: 'article',
                                estimatedMinutes: 15,
                                content: `### Short-Circuit Logic\nPython uses short-circuit evaluation for \`and\` and \`or\`. If the first operand determines the truth value, the second operand is not evaluated.`
                            },
                            {
                                orderIndex: 8,
                                title: 'Assignment and Augmented Assignment',
                                slug: 'assignment-and-augmented-assignment',
                                contentType: 'article',
                                estimatedMinutes: 15,
                                content: `### Compound Assignment Operators\nOperators like \`+=\`, \`-=\`, \`*=\`, \`/=\`, \`//=\`, and \`**=\` mutate or rebind variables efficiently.`
                            }
                        ],
                        quiz: {
                            title: 'Quiz 01: Python Variables and Operations',
                            passingScorePercent: 60,
                            timeLimitMinutes: 15,
                            questions: [
                                {
                                    questionText: 'What is the data type of the expression: 10 / 2 in Python 3?',
                                    type: 'MCQ',
                                    options: ['int', 'float', 'double', 'NoneType'],
                                    correctAnswer: 'float',
                                    explanation: 'In Python 3, standard division (/) always returns a float (5.0), whereas floor division (//) returns an integer (5).',
                                    marks: 5
                                },
                                {
                                    questionText: 'Which PEP document defines the official style guide for naming conventions in Python?',
                                    type: 'MCQ',
                                    options: ['PEP 20', 'PEP 8', 'PEP 484', 'PEP 572'],
                                    correctAnswer: 'PEP 8',
                                    explanation: 'PEP 8 is the official Style Guide for Python Code.',
                                    marks: 5
                                },
                                {
                                    questionText: 'Are strings in Python mutable or immutable?',
                                    type: 'MCQ',
                                    options: ['Mutable', 'Immutable', 'Partially Mutable', 'Depends on declaration'],
                                    correctAnswer: 'Immutable',
                                    explanation: 'Strings in Python are immutable sequences; any string operation that appears to modify a string returns a new object.',
                                    marks: 5
                                }
                            ]
                        },
                        assessment: {
                            title: 'Module 01 Assessment: Dynamic Pricing Calculator',
                            type: 'Coding',
                            maxMarks: 100,
                            codingProblem: {
                                title: 'Calculate Final Cart Value with Discount & Tax',
                                problemStatement: 'Write a Python function that takes price, quantity, discount_percentage, and tax_percentage and returns the final rounded total.',
                                inputFormat: 'Four space-separated numbers: price quantity discount tax',
                                outputFormat: 'Single float value rounded to two decimal places',
                                constraints: 'price > 0, quantity >= 1',
                                sampleTestCases: [
                                    { input: '100 2 10 5', output: '189.0', explanation: '200 - 10% = 180 + 5% tax = 189.0' }
                                ],
                                starterCode: {
                                    python: 'def solve(price, qty, discount, tax):\n    # Write your solution here\n    pass'
                                }
                            }
                        }
                    },
                    {
                        orderIndex: 2,
                        title: 'Module 02: Control Flow & Decision Making',
                        description: 'Master if-elif-else statements, match-case constructs, while loops, and for loops with iterables.',
                        lessons: [
                            {
                                orderIndex: 1,
                                title: 'Conditional Statements: if, elif, else',
                                contentType: 'article',
                                estimatedMinutes: 20,
                                content: 'Comprehensive guide to decision making in Python with conditional branch execution.'
                            },
                            {
                                orderIndex: 2,
                                title: 'Loops: while and for loops with range()',
                                contentType: 'article',
                                estimatedMinutes: 25,
                                content: 'Loop execution patterns, break, continue, and else clauses in Python loops.'
                            }
                        ],
                        quiz: {
                            title: 'Quiz – Control Flow',
                            passingScorePercent: 60,
                            questions: [
                                {
                                    questionText: 'What executes if a while loop finishes normally without hitting a break statement?',
                                    type: 'MCQ',
                                    options: ['The loop else block', 'An Exception', 'The finally block', 'Nothing special'],
                                    correctAnswer: 'The loop else block',
                                    explanation: 'In Python, loops can have an optional else clause that executes only when the loop completes naturally without break.',
                                    marks: 10
                                }
                            ]
                        }
                    },
                    {
                        orderIndex: 3,
                        title: 'Module 03: Functions and Scope',
                        description: 'First-class functions, *args, **kwargs, lambda expressions, closures, and variable scope rules.',
                        lessons: [
                            {
                                orderIndex: 1,
                                title: 'Function Definitions & Parameter Handling',
                                contentType: 'article',
                                content: 'Defining modular reusable logic with Python functions.'
                            }
                        ]
                    }
                ]
            },
            { upsert: true, new: true }
        );

        const dsaCourse = await Course.findOneAndUpdate(
            { code: 'DSA-MODERN-2' },
            {
                title: 'Data Structures and Algorithms (DSA)',
                code: 'DSA-MODERN-2',
                description: 'Complete curriculum in Data Structures and Algorithms based on ANSI C (C89), GNU/Linux environment, Graphviz, Gnuplot, and classical algorithms literature (Cormen, Langsam, Kernighan & Ritchie).',
                category: 'DSA',
                level: 'Intermediate',
                thumbnailUrl: 'https://images.unsplash.com/photo-1516116211227-bbc1b0b534cf?w=600&auto=format&fit=crop&q=80',
                instructorId: instructorUser._id,
                instructorName: instructorUser.name,
                sequentialOrder: false,
                estimatedTotalHours: 51,
                modules: dsaModules
            },
            { upsert: true, new: true }
        );

        // ML Course
        const mlCourse = await Course.findOneAndUpdate(
            { code: 'ML-201' },
            {
                title: 'Machine Learning & Predictive Modeling',
                code: 'ML-201',
                description: 'Supervised and unsupervised learning, regression, classification, random forests, clustering, and model validation with Scikit-Learn.',
                category: 'ML',
                level: 'Intermediate',
                thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop&q=80',
                instructorId: instructorUser._id,
                instructorName: instructorUser.name,
                sequentialOrder: true,
                estimatedTotalHours: 40,
                modules: [
                    {
                        orderIndex: 1,
                        title: 'Module 01: Linear Regression & Optimization',
                        description: 'Gradient descent, cost functions, feature scaling, and multi-variable linear regression.',
                        lessons: [{ orderIndex: 1, title: 'Ordinary Least Squares & Gradient Descent', contentType: 'article', content: 'Mathematical derivation of gradient descent.' }]
                    }
                ]
            },
            { upsert: true, new: true }
        );

        // DL Course
        const dlCourse = await Course.findOneAndUpdate(
            { code: 'DL-301' },
            {
                title: 'Deep Learning, Neural Networks & PyTorch',
                code: 'DL-301',
                description: 'Multi-layer perceptrons, backpropagation, CNNs for computer vision, RNNs, and transformer architectures using PyTorch.',
                category: 'DL',
                level: 'Advanced',
                thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80',
                instructorId: instructorUser._id,
                instructorName: instructorUser.name,
                sequentialOrder: true,
                estimatedTotalHours: 50,
                modules: [
                    {
                        orderIndex: 1,
                        title: 'Module 01: Deep Feedforward Networks & Backprop',
                        description: 'Computation graphs, automatic differentiation with autograd, activation functions, and vanishing gradients.',
                        lessons: [{ orderIndex: 1, title: 'Tensor Operations and Neural Graph Architecture', contentType: 'article', content: 'Constructing neural nets in PyTorch.' }]
                    }
                ]
            },
            { upsert: true, new: true }
        );

        // GEN AI Course
        const genAiCourse = await Course.findOneAndUpdate(
            { code: 'GENAI-401' },
            {
                title: 'Generative AI, LLMs & Prompt Engineering',
                code: 'GENAI-401',
                description: 'Large Language Models (LLMs), attention mechanisms, transformer decoders, prompt engineering, fine-tuning, and RAG pipelines.',
                category: 'GEN AI',
                level: 'Advanced',
                thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80',
                instructorId: instructorUser._id,
                instructorName: instructorUser.name,
                sequentialOrder: true,
                estimatedTotalHours: 35,
                modules: [
                    {
                        orderIndex: 1,
                        title: 'Module 01: Transformer Architecture & Attention',
                        description: 'Self-attention mechanics, multi-head attention, positional encoding, and tokenization.',
                        lessons: [{ orderIndex: 1, title: 'Inside the Transformer: Scaled Dot-Product Attention', contentType: 'article', content: 'Understanding how tokens attend to each other.' }]
                    }
                ]
            },
            { upsert: true, new: true }
        );

        // AGENTIC AI Course
        const agenticAiCourse = await Course.findOneAndUpdate(
            { code: 'AGNT-501' },
            {
                title: 'Agentic AI & Autonomous Multi-Agent Systems',
                code: 'AGNT-501',
                description: 'Autonomous decision-making loops (ReAct), multi-agent coordination, tool calling, memory management, and LangGraph workflows.',
                category: 'AGENTIC AI',
                level: 'Advanced',
                thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
                instructorId: instructorUser._id,
                instructorName: instructorUser.name,
                sequentialOrder: true,
                estimatedTotalHours: 42,
                modules: [
                    {
                        orderIndex: 1,
                        title: 'Module 01: Autonomous Agent Architectures & ReAct',
                        description: 'Reasoning and Acting (ReAct) loops, dynamic reflection, plan-and-solve paradigms, and stateful swarms.',
                        lessons: [{ orderIndex: 1, title: 'Designing Tool-Equipped Autonomous Agents', contentType: 'article', content: 'Integrating external function calling and structured reasoning.' }]
                    }
                ]
            },
            { upsert: true, new: true }
        );

        // C Course
        const cCourse = await Course.findOneAndUpdate(
            { code: 'C-SYS-101' },
            {
                title: "Programming in 'C'",
                code: 'C-SYS-101',
                description: "Complete C programming curriculum: Tokens, Control Statements, Loops, Arrays, Functions, Pointers, Structures, File Handling, and Dynamic Memory Allocation.",
                category: 'C',
                level: 'Beginner',
                thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
                instructorId: instructorUser._id,
                instructorName: instructorUser.name,
                sequentialOrder: true,
                estimatedTotalHours: 40,
                modules: [
                    {
                        orderIndex: 1,
                        title: 'Module 01: Introduction of Programming Languages',
                        description: 'Types of languages, evolution of C, program structure, compilation life cycle, execution and debugging.',
                        lessons: [
                            { orderIndex: 1, title: '1.1 Types of Languages', contentType: 'article', content: 'Low-level and high-level programming languages, compilers and interpreters.' },
                            { orderIndex: 2, title: "1.2 Evolution of 'C' Language", contentType: 'article', content: 'History and milestones from BCPL and B to ANSI C and Dennis Ritchie at Bell Labs.' },
                            { orderIndex: 3, title: "1.3 Structure of a 'C' Program", contentType: 'article', content: 'Preprocessor directives, main function, headers, and statement structure.' },
                            { orderIndex: 4, title: "1.4 'C' Program Development Life Cycle", contentType: 'article', content: 'Editing, preprocessing, compiling, assembling, and linking.' },
                            { orderIndex: 5, title: "1.5 Executing and Debugging a 'C' Program", contentType: 'article', content: 'GCC compiler commands, syntax vs runtime errors, and GDB debugging.' }
                        ]
                    },
                    {
                        orderIndex: 2,
                        title: "Module 02: 'C' Tokens",
                        description: 'Keywords, identifiers, operators, constants, variables, primary data types, and precedence.',
                        lessons: [
                            { orderIndex: 1, title: '2.1 Keywords and Identifiers', contentType: 'article', content: '32 standard C keywords, identifier naming rules, and symbol conventions.' },
                            { orderIndex: 2, title: '2.2 Operators', contentType: 'article', content: 'Arithmetic, relational, logical, bitwise, assignment, and ternary operators.' },
                            { orderIndex: 3, title: '2.3 Constants', contentType: 'article', content: 'Integer, floating-point, character, and string literal constants.' },
                            { orderIndex: 4, title: '2.4 Variables', contentType: 'article', content: 'Variable declaration, memory allocation, and value assignment.' },
                            { orderIndex: 5, title: '2.5 Data Types', contentType: 'article', content: 'Primary types (int, float, double, char, void) and size modifiers.' },
                            { orderIndex: 6, title: '2.6 Precedence of Operators', contentType: 'article', content: 'Operator precedence hierarchy and associativity rules.' },
                            { orderIndex: 7, title: '2.7 Scope and Lifetime of Variables', contentType: 'article', content: 'Local vs global variables, block scope, and lifetime during execution.' }
                        ]
                    },
                    {
                        orderIndex: 3,
                        title: 'Module 03: Control Statement and Expressions',
                        description: 'Decision making constructs, if-else variations, switch-case, arithmetic expressions, and GOTO.',
                        lessons: [
                            { orderIndex: 1, title: '3.1 Decision Making using if Statement', contentType: 'article', content: 'Single condition branching and boolean evaluation.' },
                            { orderIndex: 2, title: '3.2 Types of if ...else Block', contentType: 'article', content: 'Simple if, if-else, nested if, and else-if ladder constructs.' },
                            { orderIndex: 3, title: '3.3 Switch Case Block', contentType: 'article', content: 'Multi-way branching with case labels, break statement, and default fallback.' },
                            { orderIndex: 4, title: '3.4 Arithmetic Expressions', contentType: 'article', content: 'Algebraic expressions and operator evaluation sequences.' },
                            { orderIndex: 5, title: '3.5 Evaluation of Expressions', contentType: 'article', content: 'Type casting, implicit type promotion, and expression evaluation order.' },
                            { orderIndex: 6, title: '3.6 GOTO Statement', contentType: 'article', content: 'Unconditional branching with label markers and structured alternatives.' }
                        ]
                    },
                    {
                        orderIndex: 4,
                        title: 'Module 04: Looping',
                        description: 'Repetitive execution, for, while, do-while loops, nested loops, break, and continue.',
                        lessons: [
                            { orderIndex: 1, title: '4.1 Concept of Loop', contentType: 'article', content: 'Understanding iterative logic, loop counters, and termination conditions.' },
                            { orderIndex: 2, title: '4.2 For Loop', contentType: 'article', content: 'Three-part loop syntax: initialization, test condition, and step increment.' },
                            { orderIndex: 3, title: '4.3 While Loop', contentType: 'article', content: 'Pre-test entry-controlled loop execution.' },
                            { orderIndex: 4, title: '4.4 Do While Loop', contentType: 'article', content: 'Post-test exit-controlled loop with guaranteed first run.' },
                            { orderIndex: 5, title: '4.5 Jumping in Loop', contentType: 'article', content: 'Loop control redirection and early exits.' },
                            { orderIndex: 6, title: '4.6 Break and Continue Statement', contentType: 'article', content: 'Terminating loop iterations with break vs skipping with continue.' }
                        ]
                    },
                    {
                        orderIndex: 5,
                        title: 'Module 05: Arrays and String',
                        description: '1D, 2D, and multidimensional arrays, dynamic arrays, string handling, and library routines.',
                        lessons: [
                            { orderIndex: 1, title: '5.1 Introduction of Array', contentType: 'article', content: 'Contiguous memory layout and indexed access of homogeneous elements.' },
                            { orderIndex: 2, title: '5.2 One - D Array', contentType: 'article', content: 'Single dimensional arrays, bounds, traversal, and memory calculations.' },
                            { orderIndex: 3, title: '5.3 Two - D Array', contentType: 'article', content: 'Matrix representation, row-major storage, and nested loop manipulation.' },
                            { orderIndex: 4, title: '5.4 Multidimensional Array', contentType: 'article', content: '3D and higher dimension tensor arrays and indexing.' },
                            { orderIndex: 5, title: '5.5 Dynamic Arrays', contentType: 'article', content: 'Heap-backed dynamic arrays allocated via pointers.' },
                            { orderIndex: 6, title: '5.6 Implementing String Variables', contentType: 'article', content: 'Null-terminated character arrays in C and string literal initialization.' },
                            { orderIndex: 7, title: '5.7 String Handling Functions', contentType: 'article', content: 'Standard string functions: strlen, strcpy, strcat, strcmp, strchr.' }
                        ]
                    },
                    {
                        orderIndex: 6,
                        title: 'Module 06: Functions',
                        description: 'Modular program design, user-defined functions, standard library functions, and parameter passing.',
                        lessons: [
                            { orderIndex: 1, title: '6.1 Concept of Function', contentType: 'article', content: 'Procedural decomposition, reusability, and call stack frames.' },
                            { orderIndex: 2, title: '6.2 User Defined Function', contentType: 'article', content: 'Function declarations, definitions, return types, and arguments.' },
                            { orderIndex: 3, title: '6.3 System Defined Function', contentType: 'article', content: 'Standard C library functions from stdio, math, stdlib headers.' },
                            { orderIndex: 4, title: '6.4 Types of Parameter Passing in Function', contentType: 'article', content: 'Call by value versus call by reference using pointers.' }
                        ]
                    },
                    {
                        orderIndex: 7,
                        title: 'Module 07: Pointers',
                        description: 'Memory addresses, pointer types, pointer arithmetic, pointer arrays, and function pointers.',
                        lessons: [
                            { orderIndex: 1, title: '7.1 Need of Pointers', contentType: 'article', content: 'Direct memory addressing, dynamic allocation, and efficient data passing.' },
                            { orderIndex: 2, title: '7.2 Types of Pointers', contentType: 'article', content: 'Null, wild, void, dangling, and typed pointer variants.' },
                            { orderIndex: 3, title: '7.3 Pointer Expression', contentType: 'article', content: 'Pointer arithmetic, increment, decrement, and difference operations.' },
                            { orderIndex: 4, title: '7.4 Arrays of Pointers', contentType: 'article', content: 'Arrays containing memory addresses and string tables.' },
                            { orderIndex: 5, title: '7.5 Pointers and Functions', contentType: 'article', content: 'Passing pointers to functions, returning pointers, and function pointers.' }
                        ]
                    },
                    {
                        orderIndex: 8,
                        title: 'Module 08: Structure and Unions',
                        description: 'Heterogeneous records, struct definitions, nested structs, unions, and memory comparisons.',
                        lessons: [
                            { orderIndex: 1, title: '8.1 Need of Structure', contentType: 'article', content: 'Grouping heterogeneous data types into compound records.' },
                            { orderIndex: 2, title: '8.2 Implementing Structure Variable', contentType: 'article', content: 'Structure declaration, initialization, and dot (.) and arrow (->) operators.' },
                            { orderIndex: 3, title: '8.3 Arrays of Structure', contentType: 'article', content: 'Managing collections of student, employee, or coordinate records.' },
                            { orderIndex: 4, title: '8.4 Structure within Structure', contentType: 'article', content: 'Nested structures and hierarchical data modeling.' },
                            { orderIndex: 5, title: '8.5 Introduction of Unions', contentType: 'article', content: 'Memory-sharing structures and union declaration syntax.' },
                            { orderIndex: 6, title: '8.6 Difference between Structure and Unions', contentType: 'article', content: 'Memory footprint, member overlay, and use-case comparisons.' }
                        ]
                    },
                    {
                        orderIndex: 9,
                        title: "Module 09: File Handling using 'C'",
                        description: 'Stream files, fopen, fclose, stream I/O routines, fseek, ftell, and command line arguments.',
                        lessons: [
                            { orderIndex: 1, title: '9.1 Opening and Closing File', contentType: 'article', content: 'FILE pointer, fopen modes (r, w, a, r+, w+), and fclose cleanup.' },
                            { orderIndex: 2, title: '9.2 Input / Output Operations on File', contentType: 'article', content: 'fgetc, fputc, fgets, fputs, fprintf, fscanf, fread, and fwrite.' },
                            { orderIndex: 3, title: '9.3 Random Access to Files', contentType: 'article', content: 'fseek, ftell, and rewind for positioning the file cursor.' },
                            { orderIndex: 4, title: '9.4 Command Line Arguments', contentType: 'article', content: 'argc, argv[] parameter parsing in main function.' }
                        ]
                    },
                    {
                        orderIndex: 10,
                        title: 'Module 10: Dynamic Memory Allocation',
                        description: 'Heap memory management, malloc, calloc, realloc, and free for leak prevention.',
                        lessons: [
                            { orderIndex: 1, title: '10.1 Concept of Dynamic Allocation', contentType: 'article', content: 'Compile-time vs runtime memory allocation in heap segment.' },
                            { orderIndex: 2, title: '10.2 Implementing Malloc and Calloc Functions', contentType: 'article', content: 'Allocating uninitialized vs zeroed memory buffers and realloc resizing.' },
                            { orderIndex: 3, title: '10.3 Releasing the Free Space', contentType: 'article', content: 'Using free() and avoiding memory leaks, double free, and dangling pointers.' }
                        ]
                    },
                    {
                        orderIndex: 11,
                        title: 'Module 11: Storage Classes and Pre-processor',
                        description: 'Auto, register, static, extern storage classes, preprocessor directives, macros, and file inclusion.',
                        lessons: [
                            { orderIndex: 1, title: '11.1 Introduction of Storage Class', contentType: 'article', content: 'Variable lifetime, scope, visibility, and initial default values.' },
                            { orderIndex: 2, title: '11.2 Types of Storage Classes', contentType: 'article', content: 'auto, register, static, and extern specifiers and behavior.' },
                            { orderIndex: 3, title: '11.3 Introduction of Pre-processor', contentType: 'article', content: 'Pre-compilation translation phase and directive syntax (#).' },
                            { orderIndex: 4, title: '11.4 Macro Substitution', contentType: 'article', content: 'Simple and parameterized macros, conditional compilation (#ifdef, #endif).' },
                            { orderIndex: 5, title: '11.5 File Inclusion', contentType: 'article', content: 'Standard header inclusion (<...>) vs local header inclusion ("...").' }
                        ]
                    }
                ]
            },
            { upsert: true, new: true }
        );

        // C++ Course
        const cppCourse = await Course.findOneAndUpdate(
            { code: 'CPP-OOP-201' },
            {
                title: "Programming in 'C++'",
                code: 'CPP-OOP-201',
                description: "Complete C++ programming curriculum: OOP Concepts, C++ Tokens, Classes & Objects, Overloading, Constructors, Inheritance, Files, and Exception Handling.",
                category: 'C++',
                level: 'Intermediate',
                thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&auto=format&fit=crop&q=80',
                instructorId: instructorUser._id,
                instructorName: instructorUser.name,
                sequentialOrder: true,
                estimatedTotalHours: 42,
                modules: [
                    {
                        orderIndex: 1,
                        title: 'Module 01: Introduction to Object Oriented Programming',
                        description: 'OOP concepts, four pillars, C++ introduction, program structure, and compilation.',
                        lessons: [
                            { orderIndex: 1, title: '12.1 Concept of OOP', contentType: 'article', content: 'Procedural vs Object-Oriented paradigms and core principles.' },
                            { orderIndex: 2, title: '12.2 Features of OOP', contentType: 'article', content: 'Encapsulation, abstraction, inheritance, and polymorphism.' },
                            { orderIndex: 3, title: "12.3 Introduction of 'C++'", contentType: 'article', content: 'History, Bjarne Stroustrup, C with Classes, and modern standards.' },
                            { orderIndex: 4, title: "12.4 Structure of 'C++' Program", contentType: 'article', content: 'Headers, namespace std, main function, and stream I/O.' },
                            { orderIndex: 5, title: "12.5 Executing and Debugging a 'C++' Program", contentType: 'article', content: 'g++ compiler commands, warnings, and debugging workflows.' }
                        ]
                    },
                    {
                        orderIndex: 2,
                        title: "Module 02: 'C++' Tokens and Type Casting",
                        description: 'Keywords, identifiers, operators, reference variables, data types, precedence, and namespaces.',
                        lessons: [
                            { orderIndex: 1, title: '13.1 Keywords and Identifiers', contentType: 'article', content: 'C++ keywords, class, public, private, protected keywords.' },
                            { orderIndex: 2, title: '13.2 Operators', contentType: 'article', content: 'Scope resolution (::), stream operators (<<, >>), memory operators (new, delete).' },
                            { orderIndex: 3, title: '13.3 Constants', contentType: 'article', content: 'const qualifier and constexpr compile-time evaluation.' },
                            { orderIndex: 4, title: '13.4 Variables', contentType: 'article', content: 'Reference variables (&), auto type deduction, and initialization syntax.' },
                            { orderIndex: 5, title: '13.5 Data Types', contentType: 'article', content: 'Fundamental types, bool, wchar_t, and user-defined class types.' },
                            { orderIndex: 6, title: '13.6 Precedence of Operators', contentType: 'article', content: 'C++ operator precedence chart and associative rules.' },
                            { orderIndex: 7, title: '13.7 Scope and Lifetime of Variables', contentType: 'article', content: 'Namespace scope, local scope, class scope, and global variables.' }
                        ]
                    },
                    {
                        orderIndex: 3,
                        title: 'Module 03: Classes & Objects',
                        description: 'Access specifiers, member functions, object arrays, console stream I/O, and manipulators.',
                        lessons: [
                            { orderIndex: 1, title: '14.1 Classes & Object Specifier', contentType: 'article', content: 'Class declaration, private/public/protected sections, and object instantiation.' },
                            { orderIndex: 2, title: '14.2 Defining Data Members and Member Functions', contentType: 'article', content: 'Inside-class definitions vs outside-class with scope resolution (::).' },
                            { orderIndex: 3, title: '14.3 Array of Objects', contentType: 'article', content: 'Instantiating arrays of class objects and accessing member methods.' },
                            { orderIndex: 4, title: '14.4 Managing Console I/O', contentType: 'article', content: 'cin, cout, cerr, and clog streams in modern C++.' },
                            { orderIndex: 5, title: "14.5 'C++' Stream Classes", contentType: 'article', content: 'ios, istream, ostream, and iostream class hierarchy.' },
                            { orderIndex: 6, title: '14.6 Formatted and Unformatted Console I/O', contentType: 'article', content: 'get(), put(), getline(), read(), and write() functions.' },
                            { orderIndex: 7, title: '14.7 Usage of Manipulators', contentType: 'article', content: 'setw, setprecision, setfill, endl from <iomanip>.' }
                        ]
                    },
                    {
                        orderIndex: 4,
                        title: "Module 04: Function in 'C++'",
                        description: 'Call and return by reference, function overloading, inline functions, static members, friend functions, and virtual functions.',
                        lessons: [
                            { orderIndex: 1, title: '15.1 Call by Reference, Return by Reference', contentType: 'article', content: 'Pass-by-reference semantics and returning references safely.' },
                            { orderIndex: 2, title: '15.2 Function Overloading and Default Arguments', contentType: 'article', content: 'Polymorphic function signatures and optional parameter defaults.' },
                            { orderIndex: 3, title: '15.3 Inline Function', contentType: 'article', content: 'The inline keyword, compiler substitution, and macro replacement.' },
                            { orderIndex: 4, title: '15.4 Static Class Members', contentType: 'article', content: 'Static member variables and static member functions.' },
                            { orderIndex: 5, title: '15.5 Friend Functions', contentType: 'article', content: 'friend function and friend class access to private members.' },
                            { orderIndex: 6, title: '15.6 Virtual Functions', contentType: 'article', content: 'Runtime polymorphism, virtual keyword, and dynamic binding.' }
                        ]
                    },
                    {
                        orderIndex: 5,
                        title: 'Module 05: Constructors and Destructor',
                        description: 'Constructor types, copy/move constructors, dynamic memory with new/delete, and destructors.',
                        lessons: [
                            { orderIndex: 1, title: '16.1 Concept of Constructor', contentType: 'article', content: 'Automatic object initialization upon instantiation.' },
                            { orderIndex: 2, title: '16.2 Types of Constructors', contentType: 'article', content: 'Default, parameterized, copy, and move constructors.' },
                            { orderIndex: 3, title: '16.3 Memory Allocation (new and delete)', contentType: 'article', content: 'new and delete operators for single objects and dynamic arrays.' },
                            { orderIndex: 4, title: '16.4 Usage of Destructor', contentType: 'article', content: 'Tilde (~) destructor syntax, automatic destruction, and RAII cleanup.' }
                        ]
                    },
                    {
                        orderIndex: 6,
                        title: 'Module 06: Operator Overloading',
                        description: 'Unary and binary operator overloading, member vs friend function overloading.',
                        lessons: [
                            { orderIndex: 1, title: '17.1 Overloading Unary and Binary Operators', contentType: 'article', content: 'Overloading +, -, *, ==, ++, -- for user classes.' },
                            { orderIndex: 2, title: '17.2 Overloading using Friend Function', contentType: 'article', content: 'Stream insertion (<<) and extraction (>>) friend overloading.' }
                        ]
                    },
                    {
                        orderIndex: 7,
                        title: 'Module 07: Inheritance',
                        description: 'Single, multiple, multilevel, hierarchical, hybrid inheritance, virtual base classes, and constructor calling order.',
                        lessons: [
                            { orderIndex: 1, title: '18.1 Types of Inheritance', contentType: 'article', content: 'Single, multiple, multilevel, hierarchical, and hybrid inheritance.' },
                            { orderIndex: 2, title: '18.2 Virtual Base Classes and Abstract Base Classes', contentType: 'article', content: 'Solving the diamond problem and pure virtual functions (= 0).' },
                            { orderIndex: 3, title: '18.3 Constructor and Destructor in Derived Class', contentType: 'article', content: 'Execution order from base to derived and reverse for destructors.' }
                        ]
                    },
                    {
                        orderIndex: 8,
                        title: 'Module 08: Working with files',
                        description: 'File operations, ifstream/ofstream streams, seekg/seekp pointers, and random access binary files.',
                        lessons: [
                            { orderIndex: 1, title: '19.1 File Operations', contentType: 'article', content: 'fstream header, ifstream, ofstream, open, close, and modes.' },
                            { orderIndex: 2, title: '19.2 File Pointer and Their Manipulation', contentType: 'article', content: 'seekg, seekp, tellg, tellp for file pointer navigation.' },
                            { orderIndex: 3, title: '19.3 File Updation with Random Access', contentType: 'article', content: 'Binary read and write for structured record persistence.' }
                        ]
                    },
                    {
                        orderIndex: 9,
                        title: 'Module 09: Exception Handling',
                        description: 'Exception hierarchy, try-catch blocks, and throw keyword in C++.',
                        lessons: [
                            { orderIndex: 1, title: '20.1 Various Exception Handling Classes', contentType: 'article', content: 'std::exception hierarchy, runtime_error, and logic_error.' },
                            { orderIndex: 2, title: '20.2 Implementing Try and Catch Block', contentType: 'article', content: 'Guarding blocks with try, catching typed exceptions, and catch-all (...).' },
                            { orderIndex: 3, title: '20.3 Use of Throw Keyword', contentType: 'article', content: 'Throwing primitive and object exceptions, and re-throwing exceptions.' }
                        ]
                    }
                ]
            },
            { upsert: true, new: true }
        );

        // JAVA Course
        const javaCourse = await Course.findOneAndUpdate(
            { code: 'JAVA-ENT-201' },
            {
                title: 'Java Enterprise & Backend Engineering',
                code: 'JAVA-ENT-201',
                description: 'Core Java fundamentals, JVM internals, Collections framework, Multi-threading, Streams API, and Spring Boot microservices.',
                category: 'JAVA',
                level: 'Intermediate',
                thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
                instructorId: instructorUser._id,
                instructorName: instructorUser.name,
                sequentialOrder: true,
                estimatedTotalHours: 45,
                modules: [
                    {
                        orderIndex: 1,
                        title: 'Module 01: JVM Architecture & Object Lifecycle',
                        description: 'Bytecode execution, Garbage Collection algorithms, ClassLoader, and JVM memory areas.',
                        lessons: [{ orderIndex: 1, title: 'Understanding the Java Virtual Machine & Memory Model', contentType: 'article', content: 'Heap, Stack, Metaspace, and GC mechanics.' }]
                    }
                ]
            },
            { upsert: true, new: true }
        );

        const allSubjectCourses = [
            pythonCourse._id,
            dsaCourse._id,
            mlCourse._id,
            dlCourse._id,
            genAiCourse._id,
            agenticAiCourse._id,
            cCourse._id,
            cppCourse._id,
            javaCourse._id
        ];

        // 4. Batches
        console.log('Seeding Batches...');
        const dsaBatch = await Batch.findOneAndUpdate(
            { code: 'SHU-DSA-2026' },
            {
                name: 'DSA Training Batch 2026',
                code: 'SHU-DSA-2026',
                institutionId: shoolini._id,
                description: 'Special technical batch for competitive programming, AI, and full-stack software engineering.',
                assignedCourses: allSubjectCourses,
                instructors: [instructorUser._id],
                startDate: new Date('2026-01-10'),
                endDate: new Date('2026-06-30'),
                status: 'Active'
            },
            { upsert: true, new: true }
        );

        const pyBatch = await Batch.findOneAndUpdate(
            { code: 'SHU-PY-2026' },
            {
                name: 'Python Programming Batch',
                code: 'SHU-PY-2026',
                institutionId: shoolini._id,
                description: 'Hands-on Python training batch with weekly code challenges and project submissions.',
                assignedCourses: [pythonCourse._id],
                instructors: [instructorUser._id],
                startDate: new Date('2026-02-01'),
                status: 'Active'
            },
            { upsert: true, new: true }
        );

        const glaBatch = await Batch.findOneAndUpdate(
            { code: 'GLA-CPP-2026' },
            {
                name: 'C++ Programming Batch',
                code: 'GLA-CPP-2026',
                institutionId: gla._id,
                description: 'GLA University specialized batch for Systems Programming and Modern C++.',
                instructors: [instructorUser._id],
                status: 'Active'
            },
            { upsert: true, new: true }
        );

        // 5. Student User: Pranshu Pathak (matching Reference Image 1 & 2)
        console.log('Seeding Student: Pranshu Pathak...');
        const pranshu = await User.findOneAndUpdate(
            { email: 'pranshu@shoolini.edu' },
            {
                name: 'Pranshu Pathak',
                email: 'pranshu@shoolini.edu',
                password: hashedStudentPwd,
                role: 'Student',
                institutionId: shoolini._id,
                orgId: shoolini._id,
                batchIds: [dsaBatch._id, pyBatch._id],
                enrolledCourses: allSubjectCourses,
                isActive: true
            },
            { upsert: true, new: true }
        );

        // Add Pranshu to batches
        if (!dsaBatch.students.includes(pranshu._id)) {
            dsaBatch.students.push(pranshu._id);
            await dsaBatch.save();
        }
        if (!pyBatch.students.includes(pranshu._id)) {
            pyBatch.students.push(pranshu._id);
            await pyBatch.save();
        }

        // 6. Practice Labs (Matching Reference Image 1)
        console.log('Seeding Practice Labs...');
        await PracticeLab.findOneAndUpdate(
            { code: 'CPP-LAB-01' },
            {
                title: 'CPP - Classes and Objects - lab',
                code: 'CPP-LAB-01',
                category: 'Classes and Objects',
                language: 'cpp',
                difficulty: 'Medium',
                totalQuestions: 10,
                maxScore: 50,
                description: 'Implement a Student class with encapsulation, constructor overloading, and member methods to compute GPA.',
                testCases: [
                    { input: 'Alice 90 95', output: 'Alice: 92.5', isHidden: false },
                    { input: 'Bob 80 85', output: 'Bob: 82.5', isHidden: true }
                ],
                starterCode: {
                    cpp: '#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Student {\n    // Write your class here\n};\n\nint main() {\n    return 0;\n}'
                }
            },
            { upsert: true, new: true }
        );

        await PracticeLab.findOneAndUpdate(
            { code: 'CPP-LAB-02' },
            {
                title: 'CPP - Strings - lab',
                code: 'CPP-LAB-02',
                category: 'Strings',
                language: 'cpp',
                difficulty: 'Easy',
                totalQuestions: 10,
                maxScore: 50,
                description: 'String manipulation routines: anagram checking, palindrome validation, and substring occurrences.',
                testCases: [
                    { input: 'racecar', output: 'true', isHidden: false },
                    { input: 'hello', output: 'false', isHidden: true }
                ],
                starterCode: {
                    cpp: '#include <iostream>\n#include <string>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    // Your solution\n    return false;\n}'
                }
            },
            { upsert: true, new: true }
        );

        // 7. Seed Initial Student Progress matching Reference Image 1
        console.log('Seeding Progress for Pranshu Pathak...');
        const pyLesson1 = pythonCourse.modules[0].lessons[0];
        const pyModule1 = pythonCourse.modules[0];

        await StudentProgress.findOneAndUpdate(
            { studentId: pranshu._id, courseId: pythonCourse._id },
            {
                studentId: pranshu._id,
                courseId: pythonCourse._id,
                batchId: dsaBatch._id,
                institutionId: shoolini._id,
                overallPercentage: 9,
                totalTimeSpentMinutes: 17,
                currentGradePercent: 9,
                currentActiveModuleId: pyModule1._id,
                currentActiveLessonId: pyLesson1._id,
                unlockedModules: [pyModule1._id],
                completedLessons: [
                    {
                        lessonId: pyLesson1._id,
                        moduleId: pyModule1._id,
                        completedAt: new Date(),
                        timeSpentSeconds: 1028 // 17min 8s
                    }
                ]
            },
            { upsert: true, new: true }
        );

        const dsaModule1 = dsaCourse.modules[0];
        await StudentProgress.findOneAndUpdate(
            { studentId: pranshu._id, courseId: dsaCourse._id },
            {
                studentId: pranshu._id,
                courseId: dsaCourse._id,
                batchId: dsaBatch._id,
                institutionId: shoolini._id,
                overallPercentage: 10,
                totalTimeSpentMinutes: 16,
                currentGradePercent: 9,
                currentActiveModuleId: dsaModule1._id,
                currentActiveLessonId: dsaModule1.lessons[0]._id,
                unlockedModules: [dsaModule1._id]
            },
            { upsert: true, new: true }
        );

        // 8. Ensure existing Tests are tagged with Batch/Org
        const sampleTest = await Test.findOne();
        if (sampleTest && !sampleTest.orgId) {
            sampleTest.orgId = shoolini._id;
            await sampleTest.save();
            if (!dsaBatch.assignedExams.includes(sampleTest._id)) {
                dsaBatch.assignedExams.push(sampleTest._id);
                await dsaBatch.save();
            }
        }

        console.log('✅ Seeding completed successfully!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
