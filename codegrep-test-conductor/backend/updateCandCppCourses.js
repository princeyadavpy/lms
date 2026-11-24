const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
const Course = require('./models/Course');
const StudentProgress = require('./models/StudentProgress');

// Import C enrichments
const cPart1 = require('./enrichedCContentDataPart1');
const cPart2 = require('./enrichedCContentDataPart2');
const cPart3 = require('./enrichedCContentDataPart3');
const cPart4 = require('./enrichedCContentDataPart4');
const allCEnrichments = { ...cPart1, ...cPart2, ...cPart3, ...cPart4 };

// Import C++ enrichments
const cppPart1 = require('./enrichedCppContentDataPart1');
const cppPart2 = require('./enrichedCppContentDataPart2');
const cppPart3 = require('./enrichedCppContentDataPart3');
const allCppEnrichments = { ...cppPart1, ...cppPart2, ...cppPart3 };

// Full C Modules Definition from Syllabus
const cModules = [
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
            { orderIndex: 2, title: '5.2 One Dimensional Array', contentType: 'article', content: 'Declaration, index bounds, traversal, and memory footprint.' },
            { orderIndex: 3, title: '5.3 Two Dimensional Array', contentType: 'article', content: 'Matrix representation, row-major memory ordering, and 2D indexing.' },
            { orderIndex: 4, title: '5.4 Multidimensional Array', contentType: 'article', content: '3D and higher-dimensional tensors and coordinate mapping.' },
            { orderIndex: 5, title: '5.5 Dynamic Arrays', contentType: 'article', content: 'Heap-backed scalable buffers and pointer-based indexing.' },
            { orderIndex: 6, title: '5.6 String Variables', contentType: 'article', content: 'Null-terminated character arrays, string literals, and buffer safety.' },
            { orderIndex: 7, title: '5.7 String Handling Functions', contentType: 'article', content: 'strlen, strcpy, strcat, strcmp, strchr, and string.h standard library routines.' }
        ]
    },
    {
        orderIndex: 6,
        title: 'Module 06: Functions',
        description: 'Concept, user-defined functions, standard library functions, call by value, and call by reference.',
        lessons: [
            { orderIndex: 1, title: '6.1 Concept of Function', contentType: 'article', content: 'Modularity, call stack activation records, and function reusability.' },
            { orderIndex: 2, title: '6.2 User Defined Functions', contentType: 'article', content: 'Function declarations (prototypes), function definitions, and return types.' },
            { orderIndex: 3, title: '6.3 System Defined Functions', contentType: 'article', content: 'Standard C library functions from stdio.h, stdlib.h, math.h, and ctype.h.' },
            { orderIndex: 4, title: '6.4 Parameter Passing Technique', contentType: 'article', content: 'Call by value (copying data) vs Call by reference (passing memory addresses).' }
        ]
    },
    {
        orderIndex: 7,
        title: 'Module 07: Pointers',
        description: 'Need for pointers, pointer types, expressions and arithmetic, array of pointers, and pointer functions.',
        lessons: [
            { orderIndex: 1, title: '7.1 Need of Pointers', contentType: 'article', content: 'Direct memory addressing, address-of (&) and dereference (*) operators.' },
            { orderIndex: 2, title: '7.2 Types of Pointers', contentType: 'article', content: 'NULL pointers, void generic pointers, wild pointers, and dangling pointers.' },
            { orderIndex: 3, title: '7.3 Pointer Expression and Arithmetic', contentType: 'article', content: 'Pointer increment, decrement, addition, subtraction, and type scaling.' },
            { orderIndex: 4, title: '7.4 Arrays of Pointers', contentType: 'article', content: 'Collections of memory addresses, string arrays, and pointer indexing.' },
            { orderIndex: 5, title: '7.5 Pointers and Functions', contentType: 'article', content: 'Passing pointers to functions and function pointers for callbacks.' }
        ]
    },
    {
        orderIndex: 8,
        title: 'Module 08: Structure and Union',
        description: 'Need for structures, structure variables, array of structures, nested structures, unions, and comparisons.',
        lessons: [
            { orderIndex: 1, title: '8.1 Need of Structure', contentType: 'article', content: 'Heterogeneous record grouping, struct syntax, and real-world entity modeling.' },
            { orderIndex: 2, title: '8.2 Structure Variables', contentType: 'article', content: 'Declaration, member initialization, and dot (.) and arrow (->) access operators.' },
            { orderIndex: 3, title: '8.3 Array of Structure', contentType: 'article', content: 'Storing tables of structured records in contiguous memory.' },
            { orderIndex: 4, title: '8.4 Structure within Structure', contentType: 'article', content: 'Nested hierarchical structures for complex data relationships.' },
            { orderIndex: 5, title: '8.5 Union', contentType: 'article', content: 'Shared memory overlapping among members and union declaration.' },
            { orderIndex: 6, title: '8.6 Difference between Structure and Union', contentType: 'article', content: 'Memory allocation, member independence, size calculation, and use cases.' }
        ]
    },
    {
        orderIndex: 9,
        title: 'Module 09: File Handling',
        description: 'Opening and closing files, reading and writing streams, random access, and command-line arguments.',
        lessons: [
            { orderIndex: 1, title: '9.1 Opening and Closing a File', contentType: 'article', content: 'fopen, fclose, file modes (r, w, a, r+, w+, a+), and FILE pointer.' },
            { orderIndex: 2, title: '9.2 Read and Write Operations', contentType: 'article', content: 'fgetc, fputc, fgets, fputs, fprintf, fscanf, fread, and fwrite routines.' },
            { orderIndex: 3, title: '9.3 Random Access to Files', contentType: 'article', content: 'fseek, ftell, rewind, and SEEK_SET, SEEK_CUR, SEEK_END offsets.' },
            { orderIndex: 4, title: '9.4 Command Line Arguments', contentType: 'article', content: 'int argc and char *argv[] parameters in main() for terminal inputs.' }
        ]
    },
    {
        orderIndex: 10,
        title: 'Module 10: Dynamic Memory Allocation',
        description: 'Concept of dynamic memory, malloc, calloc, realloc, and free space releasing.',
        lessons: [
            { orderIndex: 1, title: '10.1 Concept of Dynamic Allocation', contentType: 'article', content: 'Stack vs Heap memory segments, compile-time vs runtime sizing.' },
            { orderIndex: 2, title: '10.2 Allocating Memory: malloc, calloc, realloc', contentType: 'article', content: 'malloc uninitialized blocks, calloc zero-initialized buffers, realloc resizing.' },
            { orderIndex: 3, title: '10.3 Releasing the Space: free', contentType: 'article', content: 'Preventing memory leaks, deallocating blocks, and NULL pointer resetting.' }
        ]
    },
    {
        orderIndex: 11,
        title: 'Module 11: Storage Class and Pre-processor',
        description: 'Storage classes (auto, register, static, extern), preprocessor concepts, macros, and file inclusion.',
        lessons: [
            { orderIndex: 1, title: '11.1 Introduction of Storage Class', contentType: 'article', content: 'Variable lifetime, scope, visibility, and initial default values.' },
            { orderIndex: 2, title: '11.2 Types of Storage Classes', contentType: 'article', content: 'auto, register, static, and extern specifiers and behavior.' },
            { orderIndex: 3, title: '11.3 Introduction of Pre-processor', contentType: 'article', content: 'Pre-compilation translation phase and directive syntax (#).' },
            { orderIndex: 4, title: '11.4 Macro Substitution', contentType: 'article', content: 'Simple and parameterized macros, conditional compilation (#ifdef, #endif).' },
            { orderIndex: 5, title: '11.5 File Inclusion', contentType: 'article', content: 'Standard header inclusion (<...>) vs local header inclusion ("...").' }
        ]
    }
];

// Full C++ Modules Definition from Syllabus
const cppModules = [
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
];

async function updateCourses() {
    try {
        const atlasUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(atlasUri);
        console.log('MongoDB Connected successfully!');

        // 1. UPDATE C COURSE
        console.log('Updating C Course (C-SYS-101)...');
        let cCourse = await Course.findOne({ code: 'C-SYS-101' });
        if (!cCourse) {
            cCourse = new Course({
                title: "Programming in 'C'",
                code: 'C-SYS-101',
                category: 'C',
                level: 'Beginner'
            });
        }
        cCourse.title = "Programming in 'C'";
        cCourse.category = 'C';
        cCourse.description = "Complete C programming curriculum: Tokens, Control Statements, Loops, Arrays, Functions, Pointers, Structures, File Handling, and Dynamic Memory Allocation.";
        cCourse.modules = cModules;

        // Enrich C Course lessons
        let cEnriched = 0;
        cCourse.modules.forEach(mod => {
            mod.lessons.forEach(les => {
                const key = `${mod.orderIndex}-${les.orderIndex}`;
                const enrichment = allCEnrichments[key];
                if (enrichment) {
                    if (enrichment.content) les.content = enrichment.content;
                    if (enrichment.codeSnippets) les.codeSnippets = enrichment.codeSnippets;
                    if (enrichment.aiSummary) les.aiSummary = enrichment.aiSummary;
                    cEnriched++;
                }
            });
        });
        await cCourse.save();
        console.log(`✅ C Course updated with ${cCourse.modules.length} modules and ${cEnriched} enriched topics!`);

        // 2. UPDATE C++ COURSE
        console.log('Updating C++ Course (CPP-OOP-201)...');
        let cppCourse = await Course.findOne({ code: 'CPP-OOP-201' });
        if (!cppCourse) {
            cppCourse = new Course({
                title: "Programming in 'C++'",
                code: 'CPP-OOP-201',
                category: 'C++',
                level: 'Intermediate'
            });
        }
        cppCourse.title = "Programming in 'C++'";
        cppCourse.category = 'C++';
        cppCourse.description = "Complete C++ programming curriculum: OOP Concepts, C++ Tokens, Classes & Objects, Overloading, Constructors, Inheritance, Files, and Exception Handling.";
        cppCourse.modules = cppModules;

        // Enrich C++ Course lessons
        let cppEnriched = 0;
        cppCourse.modules.forEach(mod => {
            mod.lessons.forEach(les => {
                const key = `${mod.orderIndex}-${les.orderIndex}`;
                const enrichment = allCppEnrichments[key];
                if (enrichment) {
                    if (enrichment.content) les.content = enrichment.content;
                    if (enrichment.codeSnippets) les.codeSnippets = enrichment.codeSnippets;
                    if (enrichment.aiSummary) les.aiSummary = enrichment.aiSummary;
                    cppEnriched++;
                }
            });
        });
        await cppCourse.save();
        console.log(`✅ C++ Course updated with ${cppCourse.modules.length} modules and ${cppEnriched} enriched topics!`);

        // 3. UNLOCK MODULES IN STUDENT PROGRESS FOR ALL STUDENTS/ADMINS
        console.log('Unlocking all modules in StudentProgress for C & C++...');
        const allCModIds = cCourse.modules.map(m => m._id);
        const allCppModIds = cppCourse.modules.map(m => m._id);

        await StudentProgress.updateMany(
            { courseId: cCourse._id },
            {
                $addToSet: { unlockedModules: { $each: allCModIds } },
                $set: {
                    overallPercentage: 0,
                    completedModules: [],
                    completedLessons: [],
                    currentActiveModuleId: allCModIds[0],
                    currentActiveLessonId: cCourse.modules[0].lessons[0]._id
                }
            }
        );

        await StudentProgress.updateMany(
            { courseId: cppCourse._id },
            {
                $addToSet: { unlockedModules: { $each: allCppModIds } },
                $set: {
                    overallPercentage: 0,
                    completedModules: [],
                    completedLessons: [],
                    currentActiveModuleId: allCppModIds[0],
                    currentActiveLessonId: cppCourse.modules[0].lessons[0]._id
                }
            }
        );

        console.log('✅ StudentProgress records updated with all unlocked modules!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Error updating courses:', err);
        process.exit(1);
    }
}

updateCourses();
