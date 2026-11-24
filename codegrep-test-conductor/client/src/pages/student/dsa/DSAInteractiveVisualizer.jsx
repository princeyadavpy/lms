import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Play,
    Pause,
    RotateCcw,
    SkipForward,
    SkipBack,
    Plus,
    Trash2,
    Search,
    Sparkles,
    Layers,
    Binary,
    ArrowRight,
    ArrowLeft,
    ArrowDown,
    ArrowUp,
    ArrowLeftRight,
    CornerDownRight,
    Check,
    X,
    RefreshCw,
    Sliders,
    Code2,
    Cpu,
    Eye,
    ShieldCheck,
    Terminal,
    Info,
    ChevronRight,
    HelpCircle,
    Clock,
    Hash,
    Database,
    Network,
    Shuffle,
    AlertCircle,
    GitBranch
} from 'lucide-react';

/* =========================================================================
   MODULE-WISE DSA INTERACTIVE VISUALIZER STUDIO
   Strictly scoped to the active course module (Modules 1 to 8)
   Inspired by visualizedsa.com:
   - Module 2: visualizedsa.com/visualizers/stack-queue
   - Module 3: visualizedsa.com/visualizers/linked-list-operations
   - Module 4: visualizedsa.com/visualizers/knapsack
   - Left side: Clean, non-running ANSI C (C89) source code & complexity
   - Right side: Interactive hands-on visual canvas with student inputs & animations
   ========================================================================= */

const MODULE_DEFINITIONS = {
    1: {
        id: 1,
        title: 'Module 01: Algorithm',
        subtitle: 'Foundational Data Structures, Abstract Data Types (ADT), Pointers & Dynamic Memory',
        topics: [
            { id: 1, order: 1, label: '1.1 Data Structure def, classification, ADT', tag: 'ADT' },
            { id: 2, order: 2, label: '1.2 Algorithm representation and complexity', tag: 'Big-O' },
            { id: 3, order: 3, label: '1.3 Pointers, strings, arrays (1-D and n-D)', tag: 'Pointers' },
            { id: 4, order: 4, label: '1.4 Elapsed time', tag: 'Profiling' },
            { id: 5, order: 5, label: '1.5 malloc, realloc, calloc', tag: 'Dynamic RAM' }
        ]
    },
    2: {
        id: 2,
        title: 'Module 02: Stacks',
        subtitle: 'Stack ADT (LIFO), Push/Pop Operations, Shunting-Yard & Postfix Evaluation',
        topics: [
            { id: 1, order: 1, label: '2.1 Stacks', tag: 'LIFO Chamber' },
            { id: 2, order: 2, label: '2.2 Pre-, in-, post-fix conversions', tag: 'Shunting-Yard' },
            { id: 3, order: 3, label: '2.3 Evaluations of expressions', tag: 'Postfix Eval' }
        ]
    },
    3: {
        id: 3,
        title: 'Module 03: Lists and Queues',
        subtitle: 'Linear Dynamic Data Structures: Linked Lists, Queues & Circular Buffers',
        topics: [
            { id: 1, order: 1, label: '3.1 Linked lists', tag: 'Singly / Doubly' },
            { id: 2, order: 2, label: '3.2 Queues', tag: 'FIFO / Two Stacks' },
            { id: 3, order: 3, label: '3.3 Circular queues', tag: 'Ring Buffer' }
        ]
    },
    4: {
        id: 4,
        title: 'Module 04: Recursion',
        subtitle: 'Recursive Activation Frames, Fibonacci Recurrence, 8-Queens Backtracking & 0/1 Knapsack DP',
        topics: [
            { id: 1, order: 1, label: '4.1 Simple recursion', tag: 'Call Stack' },
            { id: 2, order: 2, label: '4.2 Fibonacci numbers', tag: 'Recurrence Tree' },
            { id: 3, order: 3, label: '4.3 Backtracking: 8-queen problem', tag: 'DP / Backtrack' }
        ]
    },
    5: {
        id: 5,
        title: 'Module 05: Searching Algorithms',
        subtitle: 'Sequential & Logarithmic Search: Linear Search, Binary Search & Order Statistics Quickselect',
        topics: [
            { id: 1, order: 1, label: '5.1 Linear search', tag: 'O(n) Scan' },
            { id: 2, order: 2, label: '5.2 Binary search', tag: 'O(log n)' },
            { id: 3, order: 3, label: '5.3 Quickselect', tag: 'Order Statistic' }
        ]
    },
    6: {
        id: 6,
        title: 'Module 06: Sorting Algorithms',
        subtitle: 'Comprehensive Sorting Studio: Bubble, Selection, Insertion, Merge, Quick, Heap & Counting Sort',
        topics: [
            { id: 1, order: 1, label: '6.1 Bubble sort', tag: 'Adjacent Swap' },
            { id: 2, order: 2, label: '6.2 Selection sort', tag: 'Min Swap' },
            { id: 3, order: 3, label: '6.3 Insertion sort', tag: 'Adaptive Card' },
            { id: 4, order: 4, label: '6.4 Mergesort', tag: 'Divide & Merge' },
            { id: 5, order: 5, label: '6.5 Quicksort', tag: 'Pivot Partition' },
            { id: 6, order: 6, label: '6.6 Heapsort', tag: 'Binary Max-Heap' },
            { id: 7, order: 7, label: '6.7 Counting sort', tag: 'Non-Comparison' }
        ]
    },
    7: {
        id: 7,
        title: 'Module 07: Graph Theory',
        subtitle: 'Graphs, Binary Search Trees, Heapsort, Trie, Dijkstra & MST',
        topics: [
            { id: 1, order: 1, label: '7.1 Graphs', tag: 'Matrix / List' },
            { id: 3, order: 3, label: '7.3 Heaps, heapsort', tag: 'Binary Heap' },
            { id: 6, order: 6, label: '7.6 Binary search trees', tag: 'BST Invariant' },
            { id: 8, order: 8, label: '7.8 Trie tree', tag: 'Prefix Tree' },
            { id: 9, order: 9, label: '7.9 Kruskal’s MST using disjoint sets', tag: 'Disjoint Sets' },
            { id: 10, order: 10, label: '7.10 Dijkstra\'s Algorithm', tag: 'Shortest Path' },
            { id: 12, order: 12, label: '7.12 Floyd-Warshall\'s algorithm', tag: 'All-Pairs DP' },
            { id: 13, order: 13, label: '7.13 BFS and DFS searches', tag: 'Traversals' },
            { id: 14, order: 14, label: '7.14 AVL trees, B-trees', tag: 'Balanced Rotations' }
        ]
    },
    8: {
        id: 8,
        title: 'Module 08: Hashing',
        subtitle: 'Hash Tables, Division Method, Collision Handling via Chaining & Perfect Hashing',
        topics: [
            { id: 1, order: 1, label: '8.1 Hashing by chaining', tag: 'Bucket Chains' },
            { id: 2, order: 2, label: '8.2 Perfect hashing function', tag: 'Zero Collision' }
        ]
    },
    9: {
        id: 9,
        title: 'Module 09: String algorithms',
        subtitle: 'Null-Terminated String Manipulations & Rabin-Karp Rolling Hash Substring Search',
        topics: [
            { id: 1, order: 1, label: '9.1 Simple string manipulations', tag: 'Char Buffers' },
            { id: 2, order: 2, label: '9.2 Pattern search with Rabin-Karp approach', tag: 'Rolling Hash' }
        ]
    }
};

// Shunting-Yard Helper (Module 2)
function buildShuntingYardSteps(expressionStr) {
    const rawTokens = expressionStr.trim().split(/\s+/).filter(Boolean);
    const steps = [];
    const opStack = [];
    const output = [];

    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3 };

    steps.push({
        token: 'START',
        tokenIdx: -1,
        opStack: [],
        output: [],
        action: 'Initialized Shunting-Yard parser. Ready to read infix tokens.'
    });

    for (let i = 0; i < rawTokens.length; i++) {
        const token = rawTokens[i];

        if (!isNaN(token) || /^[A-Za-z0-9_]+$/.test(token) && !['+', '-', '*', '/', '%', '^', '(', ')'].includes(token)) {
            output.push(token);
            steps.push({
                token,
                tokenIdx: i,
                opStack: [...opStack],
                output: [...output],
                action: `Encountered operand '${token}': Append directly to output queue.`
            });
        } else if (token === '(') {
            opStack.push(token);
            steps.push({
                token,
                tokenIdx: i,
                opStack: [...opStack],
                output: [...output],
                action: `Encountered '(': Push left parenthesis onto operator stack.`
            });
        } else if (token === ')') {
            while (opStack.length > 0 && opStack[opStack.length - 1] !== '(') {
                const op = opStack.pop();
                output.push(op);
                steps.push({
                    token,
                    tokenIdx: i,
                    opStack: [...opStack],
                    output: [...output],
                    action: `Encountered ')': Popped '${op}' from stack to output queue.`
                });
            }
            if (opStack.length > 0 && opStack[opStack.length - 1] === '(') {
                opStack.pop();
                steps.push({
                    token,
                    tokenIdx: i,
                    opStack: [...opStack],
                    output: [...output],
                    action: `Matched and discarded matching '(' from operator stack.`
                });
            }
        } else if (precedence[token]) {
            while (
                opStack.length > 0 &&
                opStack[opStack.length - 1] !== '(' &&
                (precedence[opStack[opStack.length - 1]] > precedence[token] ||
                 (precedence[opStack[opStack.length - 1]] === precedence[token] && token !== '^'))
            ) {
                const higherOp = opStack.pop();
                output.push(higherOp);
                steps.push({
                    token,
                    tokenIdx: i,
                    opStack: [...opStack],
                    output: [...output],
                    action: `Top of stack '${higherOp}' has >= precedence than '${token}': Pop to output.`
                });
            }
            opStack.push(token);
            steps.push({
                token,
                tokenIdx: i,
                opStack: [...opStack],
                output: [...output],
                action: `Push operator '${token}' onto operator stack.`
            });
        }
    }

    while (opStack.length > 0) {
        const remaining = opStack.pop();
        if (remaining !== '(' && remaining !== ')') {
            output.push(remaining);
            steps.push({
                token: 'EOF',
                tokenIdx: rawTokens.length,
                opStack: [...opStack],
                output: [...output],
                action: `Input exhausted: Drain remaining operator '${remaining}' to output queue.`
            });
        }
    }

    steps.push({
        token: 'COMPLETE',
        tokenIdx: rawTokens.length,
        opStack: [],
        output: [...output],
        action: `Conversion complete! Final Postfix Expression: ${output.join(' ')}`
    });

    return { tokens: rawTokens, steps };
}

// Postfix Evaluation Helper (Module 2)
function buildPostfixEvalSteps(postfixStr) {
    const rawTokens = postfixStr.trim().split(/\s+/).filter(Boolean);
    const steps = [];
    const stack = [];

    steps.push({
        token: 'START',
        tokenIdx: -1,
        stack: [],
        action: 'Ready to evaluate postfix expression from left to right.',
        result: null
    });

    for (let i = 0; i < rawTokens.length; i++) {
        const token = rawTokens[i];
        if (!isNaN(token)) {
            const num = Number(token);
            stack.push(num);
            steps.push({
                token,
                tokenIdx: i,
                stack: [...stack],
                action: `Operand ${num}: Push onto evaluation stack.`,
                result: null
            });
        } else if (['+', '-', '*', '/', '%'].includes(token)) {
            if (stack.length < 2) {
                steps.push({
                    token,
                    tokenIdx: i,
                    stack: [...stack],
                    action: `Error: Invalid postfix expression (insufficient operands for '${token}').`,
                    result: null
                });
                break;
            }
            const b = stack.pop();
            const a = stack.pop();
            let res = 0;
            if (token === '+') res = a + b;
            else if (token === '-') res = a - b;
            else if (token === '*') res = a * b;
            else if (token === '/') res = b !== 0 ? Math.floor(a / b) : 0;
            else if (token === '%') res = b !== 0 ? a % b : 0;

            stack.push(res);
            steps.push({
                token,
                tokenIdx: i,
                stack: [...stack],
                action: `Operator '${token}': Pop ${b} and ${a}, compute ${a} ${token} ${b} = ${res}, push ${res} back.`,
                result: res
            });
        }
    }

    steps.push({
        token: 'FINISH',
        tokenIdx: rawTokens.length,
        stack: [...stack],
        action: `Evaluation complete! Final Computed Result = ${stack[stack.length - 1] ?? 'Empty'}`,
        result: stack[stack.length - 1] ?? null
    });

    return { tokens: rawTokens, steps };
}

// Simple Recursion Generator (Module 4, Topic 4.1: Factorial, Sum of N, Power of 2)
function generateSimpleRecursionSteps(algo, n) {
    const steps = [];
    const stack = [];
    const funcName = algo === 'factorial' ? 'factorial' : algo === 'sumN' ? 'sumOfN' : 'powerOf2';
    const baseN = algo === 'power2' ? 0 : 1;
    const baseVal = 1;

    // Flow nodes tracking
    const flowNodes = [];
    for (let i = n; i >= baseN; i--) {
        flowNodes.push({ id: i, n: i, label: `${funcName}(${i})`, status: 'pending', retVal: null });
    }

    // 1. Winding (Push frames)
    for (let i = n; i >= baseN; i--) {
        const isBase = i === baseN;
        const addr = `0x7FFE${(800 - (n - i) * 32).toString(16).toUpperCase()}`;
        const frame = {
            level: i,
            n: i,
            funcName,
            addr,
            status: isBase ? 'BASE_CASE' : 'WINDING',
            retVal: isBase ? baseVal : null,
            line: isBase
                ? (algo === 'power2' ? 'if (n <= 0) return 1;' : 'if (n <= 1) return 1;')
                : `long subResult = ${funcName}(${i - 1});`
        };
        stack.push(frame);

        flowNodes.forEach(fn => {
            if (fn.n === i) fn.status = isBase ? 'base' : 'calling';
            else if (fn.n > i) fn.status = 'waiting';
        });

        steps.push({
            phase: isBase ? 'base_case' : 'winding',
            currentN: i,
            stack: stack.map(f => ({ ...f })),
            flowNodes: flowNodes.map(fn => ({ ...fn })),
            activeAddr: addr,
            line: frame.line,
            computed: isBase ? `${funcName}(${baseN}) = ${baseVal}` : null,
            note: isBase
                ? `Base Case Reached: ${funcName}(${baseN}) terminates recursion. It immediately returns ${baseVal} without pushing further frames.`
                : `Winding (Push): Push activation frame ${funcName}(${i}) at ${addr}. Caller execution paused; invoking ${funcName}(${i - 1})...`
        });
    }

    // 2. Unwinding (Pop frames & compute)
    let currentVal = baseVal;
    for (let i = baseN + 1; i <= n; i++) {
        const popped = stack.pop();
        const prevVal = currentVal;
        if (algo === 'factorial') currentVal = i * prevVal;
        else if (algo === 'sumN') currentVal = i + prevVal;
        else currentVal = 2 * prevVal;

        if (stack.length > 0) {
            stack[stack.length - 1].status = 'UNWINDING';
            stack[stack.length - 1].retVal = currentVal;
        }

        flowNodes.forEach(fn => {
            if (fn.n === i) { fn.status = 'returning'; fn.retVal = currentVal; }
            else if (fn.n < i) fn.status = 'done';
        });

        const expr = algo === 'factorial'
            ? `${i} × ${prevVal} = ${currentVal}`
            : algo === 'sumN'
            ? `${i} + ${prevVal} = ${currentVal}`
            : `2 × ${prevVal} = ${currentVal}`;

        steps.push({
            phase: 'unwinding',
            currentN: i,
            stack: stack.map(f => ({ ...f })),
            flowNodes: flowNodes.map(fn => ({ ...fn })),
            line: `return ${algo === 'factorial' ? 'n * subResult;' : algo === 'sumN' ? 'n + subResult;' : '2 * subResult;'}`,
            computed: expr,
            note: `Unwinding (Pop): Deallocate ${funcName}(${i}) frame. Multiply/accumulate: ${expr}. Return value handed down to caller frame.`
        });
    }

    // 3. Complete
    steps.push({
        phase: 'complete',
        currentN: n,
        stack: [],
        flowNodes: flowNodes.map(fn => ({ ...fn, status: 'done', retVal: fn.retVal || currentVal })),
        line: 'return result;',
        computed: `Final Answer: ${funcName}(${n}) = ${currentVal}`,
        note: `Recursion Complete! ${funcName}(${n}) = ${currentVal}. All activation frames deallocated. Call stack memory returned to base state.`
    });

    return steps;
}

// Fibonacci Tabulation Helper (Bottom-Up DP)
function generateFibTabulation(n) {
    const steps = [];
    const dp = Array(n + 1).fill(null);
    dp[0] = 0;
    if (n >= 1) dp[1] = 1;

    steps.push({
        action: 'INIT',
        currentIdx: 1,
        dp: [...dp],
        activeIndices: [0, 1],
        formula: 'dp[0] = 0, dp[1] = 1 (Base Seeds)',
        note: `Base initializations: Seed table with dp[0] = 0 and dp[1] = 1 in O(1) space.`
    });

    for (let i = 2; i <= n; i++) {
        // Step 1: reading previous 2 cells
        steps.push({
            action: 'READING',
            currentIdx: i,
            dp: [...dp],
            activeIndices: [i - 1, i - 2],
            formula: `dp[${i}] = dp[${i - 1}] (${dp[i - 1]}) + dp[${i - 2}] (${dp[i - 2]})`,
            note: `Compute dp[${i}]: Sum previous two cached entries dp[${i - 1}] (${dp[i - 1]}) + dp[${i - 2}] (${dp[i - 2]}).`
        });
        dp[i] = dp[i - 1] + dp[i - 2];
        // Step 2: cell filled
        steps.push({
            action: 'WRITTEN',
            currentIdx: i,
            dp: [...dp],
            activeIndices: [i],
            formula: `dp[${i}] = ${dp[i]}`,
            note: `Entry written: dp[${i}] = ${dp[i]}. Stored in 1D array for future iterations in O(1) time!`
        });
    }

    steps.push({
        action: 'COMPLETE',
        currentIdx: n,
        dp: [...dp],
        activeIndices: [n],
        formula: `Final Answer: fib(${n}) = ${dp[n]}`,
        note: `Tabulation complete! Calculated fib(${n}) = ${dp[n]} in O(n) linear time with 0 recursive call stack overhead.`
    });

    return { dp, steps, totalCalls: n - 1, redundantCalls: 0, cacheHits: 0, finalVal: dp[n] };
}

// Fibonacci Recurrence Tree & Trace Generator (Naive O(2^n) vs Memoized DP O(n))
function generateFibTreeAndTrace(n, mode) {
    if (mode === 'tabulation') {
        return generateFibTabulation(n);
    }

    const steps = [];
    const nodes = [];
    const edges = [];
    let idGen = 1;
    const memo = {};
    const computedCount = {};
    const callStack = [];
    let totalCalls = 0;
    let redundantCalls = 0;
    let cacheHits = 0;

    function traverse(val, depth, xMin, xMax, parentNode, branch) {
        totalCalls++;
        const id = idGen++;
        const x = Math.min(95, Math.max(5, (xMin + xMax) / 2));
        const y = depth * 64 + 40;
        const isBase = val <= 1;
        const isMemoized = mode === 'memo' && memo[val] !== undefined;
        const isDuplicate = computedCount[val] !== undefined && computedCount[val] > 0;

        if (isDuplicate) redundantCalls++;
        if (isMemoized) cacheHits++;

        const node = {
            id,
            val,
            depth,
            x,
            y,
            branch,
            parentId: parentNode ? parentNode.id : null,
            isBase,
            isDuplicate,
            isMemoized,
            status: 'pending',
            retVal: isMemoized ? memo[val] : null
        };
        nodes.push(node);

        if (parentNode) {
            edges.push({ from: parentNode.id, to: id, branch });
        }

        callStack.push({ id, val, depth });

        // Step: Visiting / Calling node
        steps.push({
            action: isMemoized ? 'CACHE_HIT' : 'CALL',
            activeNodeId: id,
            val,
            depth,
            callStack: callStack.map(f => ({ ...f })),
            memo: { ...memo },
            totalCalls,
            redundantCalls,
            cacheHits,
            note: isMemoized
                ? `⚡ Cache Hit! fib(${val}) is already memoized in table as ${memo[val]}. Subtree pruned in O(1) time!`
                : isBase
                ? `Base Case: fib(${val}) is a terminal base case (returns ${val}).`
                : isDuplicate
                ? `⚠️ Duplicate Call: fib(${val}) was already computed earlier! In naive recursion, this entire branch is re-evaluated from scratch!`
                : `Recursive Call: fib(${val}) pushed onto call stack. Expanding fib(${val - 1}) + fib(${val - 2})...`
        });

        if (isMemoized) {
            node.status = 'cached';
            node.retVal = memo[val];
            callStack.pop();
            return memo[val];
        }

        if (isBase) {
            node.status = 'completed';
            node.retVal = val;
            memo[val] = val;
            computedCount[val] = (computedCount[val] || 0) + 1;
            callStack.pop();
            steps.push({
                action: 'BASE_RETURN',
                activeNodeId: id,
                val,
                retVal: val,
                callStack: callStack.map(f => ({ ...f })),
                memo: { ...memo },
                totalCalls,
                redundantCalls,
                cacheHits,
                note: `Base return: fib(${val}) terminates and returns ${val} to caller.`
            });
            return val;
        }

        // Recurse Left fib(val - 1)
        const leftVal = traverse(val - 1, depth + 1, xMin, x, node, 'L');
        // Recurse Right fib(val - 2)
        const rightVal = traverse(val - 2, depth + 1, x, xMax, node, 'R');

        const total = leftVal + rightVal;
        node.status = 'completed';
        node.retVal = total;
        memo[val] = total;
        computedCount[val] = (computedCount[val] || 0) + 1;
        callStack.pop();

        steps.push({
            action: 'COMBINE_RETURN',
            activeNodeId: id,
            val,
            leftVal,
            rightVal,
            retVal: total,
            callStack: callStack.map(f => ({ ...f })),
            memo: { ...memo },
            totalCalls,
            redundantCalls,
            cacheHits,
            note: `Compute & Return: fib(${val}) = fib(${val - 1}) [${leftVal}] + fib(${val - 2}) [${rightVal}] = ${total}.${mode === 'memo' ? ` Saved to memo[${val}] = ${total}.` : ''}`
        });

        return total;
    }

    traverse(n, 0, 0, 100, null, 'root');

    steps.push({
        action: 'DONE',
        activeNodeId: 1,
        val: n,
        retVal: memo[n],
        callStack: [],
        memo: { ...memo },
        totalCalls,
        redundantCalls,
        cacheHits,
        note: `Computation finished! fib(${n}) = ${memo[n]}. Total function calls: ${totalCalls} (${mode === 'memo' ? `${cacheHits} cache hits pruned redundant subtrees` : `${redundantCalls} calls were redundant recalculations`}).`
    });

    return { nodes, edges, steps, totalCalls, redundantCalls, cacheHits, finalVal: memo[n] };
}

// 0/1 Knapsack Step Generator & Traceback (Module 4, Topic 4.3 - visualizedsa.com/visualizers/knapsack)
function generateKnapsackSteps(items, capacity) {
    const n = items.length;
    const W = capacity;
    const steps = [];
    const table = Array.from({ length: n + 1 }, () => Array(W + 1).fill(null));

    const pushStep = (currentCell, lookupSkip, lookupTake, phase, decision, tracebackPath, chosenItems, note, opCount) => {
        steps.push({
            items: items.map(it => ({ ...it })),
            capacity: W,
            table: table.map(row => [...row]),
            currentCell,
            lookupSkip,
            lookupTake,
            phase,
            decision,
            tracebackPath: [...tracebackPath],
            chosenItems: [...chosenItems],
            note,
            opCount
        });
    };

    for (let i = 0; i <= n; i++) table[i][0] = 0;
    for (let w = 0; w <= W; w++) table[0][w] = 0;

    pushStep(
        null,
        null,
        null,
        'init',
        null,
        [],
        [],
        'Base cases set: dp[i][0] = 0 (zero capacity) and dp[0][w] = 0 (no items available)',
        0
    );

    let opCount = 0;
    for (let i = 1; i <= n; i++) {
        const item = items[i - 1];
        for (let w = 1; w <= W; w++) {
            opCount++;
            const skipVal = table[i - 1][w];

            if (item.weight > w) {
                pushStep(
                    [i, w],
                    [i - 1, w],
                    null,
                    'lookup',
                    'skip',
                    [],
                    [],
                    `Item ${i} (w=${item.weight}) exceeds capacity ${w} — must skip. Look up dp[${i - 1}][${w}] = ${skipVal}`,
                    opCount
                );
                table[i][w] = skipVal;
                pushStep(
                    [i, w],
                    null,
                    null,
                    'fill',
                    'skip',
                    [],
                    [],
                    `dp[${i}][${w}] = ${skipVal}  (item ${i} skipped — weight ${item.weight} > capacity ${w})`,
                    opCount
                );
            } else {
                const takeVal = table[i - 1][w - item.weight] + item.value;
                const decision = takeVal > skipVal ? 'take' : 'skip';
                const bestVal = Math.max(skipVal, takeVal);

                pushStep(
                    [i, w],
                    [i - 1, w],
                    [i - 1, w - item.weight],
                    'lookup',
                    decision,
                    [],
                    [],
                    `Item ${i} (w=${item.weight}, v=${item.value}): skip → ${skipVal},  take → ${item.value} + dp[${i - 1}][${w - item.weight}] = ${item.value} + ${table[i - 1][w - item.weight]} = ${takeVal}.  Choose ${decision.toUpperCase()} = ${bestVal}`,
                    opCount
                );
                table[i][w] = bestVal;
                pushStep(
                    [i, w],
                    null,
                    null,
                    'fill',
                    decision,
                    [],
                    [],
                    `dp[${i}][${w}] = ${bestVal}  (${decision === 'take' ? `take item ${i}: ${item.value} + ${table[i - 1][w - item.weight]}` : `skip item ${i}: ${skipVal}`})`,
                    opCount
                );
            }
        }
    }

    const tracebackPath = [[n, W]];
    const chosenItems = [];
    let currW = W;

    pushStep(
        [n, W],
        null,
        null,
        'traceback',
        null,
        tracebackPath,
        chosenItems,
        `Traceback from dp[${n}][${W}] = ${table[n][W]}. Maximum value = ${table[n][W]}. Tracing which items were selected…`,
        opCount
    );

    for (let i = n; i >= 1; i--) {
        const item = items[i - 1];
        if (table[i][currW] !== table[i - 1][currW]) {
            chosenItems.push(i);
            const remainingW = currW - item.weight;
            tracebackPath.push([i - 1, remainingW]);
            pushStep(
                [i - 1, remainingW],
                [i, currW],
                null,
                'traceback',
                'take',
                [...tracebackPath],
                [...chosenItems],
                `dp[${i}][${currW}] = ${table[i][currW]} differs from dp[${i - 1}][${currW}] = ${table[i - 1][currW]} → Item ${i} (w=${item.weight}, v=${item.value}) was TAKEN. Remaining capacity: ${remainingW}`,
                opCount
            );
            currW = remainingW;
        } else {
            tracebackPath.push([i - 1, currW]);
            pushStep(
                [i - 1, currW],
                [i, currW],
                null,
                'traceback',
                'skip',
                [...tracebackPath],
                [...chosenItems],
                `dp[${i}][${currW}] = dp[${i - 1}][${currW}] = ${table[i - 1][currW]} → Item ${i} was SKIPPED`,
                opCount
            );
        }
    }

    const sortedChosen = [...chosenItems].sort((a, b) => a - b);
    const totalWt = sortedChosen.reduce((acc, idx) => acc + items[idx - 1].weight, 0);
    const totalVal = sortedChosen.reduce((acc, idx) => acc + items[idx - 1].value, 0);

    pushStep(
        null,
        null,
        null,
        'done',
        null,
        [...tracebackPath],
        sortedChosen,
        `Complete! Max value = ${table[n][W]}. Selected items: [${sortedChosen.map(idx => `#${idx}`).join(', ')}]  (total weight: ${totalWt}/${W}, total value: ${totalVal})`,
        opCount
    );

    return steps;
}

// ═════════════════════════════════════════════════════════════════════════
// MODULE 5: SEARCHING ALGORITHM STEP GENERATOR
// ═════════════════════════════════════════════════════════════════════════
function generateSearchingSteps(algo, rawArr, target, k = 1) {
    const steps = [];

    if (algo === 'linear') {
        const arr = [...rawArr];
        // Initial setup step
        steps.push({
            arr: [...arr],
            activeIdx: -1,
            currentIndex: -1,
            foundIdx: null,
            phase: 'init',
            status: 'comparing',
            comparisons: 0,
            target,
            desc: `Initialized Linear Search for target ${target} across ${arr.length} elements from left to right.`,
            note: `Ready to scan index 0.`
        });

        let comparisons = 0;
        for (let i = 0; i < arr.length; i++) {
            comparisons++;
            const isMatch = arr[i] === target;
            steps.push({
                arr: [...arr],
                activeIdx: i,
                currentIndex: i,
                foundIdx: isMatch ? i : null,
                phase: isMatch ? 'found' : 'comparing',
                status: isMatch ? 'found' : 'comparing',
                comparisons,
                target,
                desc: isMatch
                    ? `Match found! arr[${i}] = ${arr[i]} equals target ${target} (Success in ${comparisons} comparison${comparisons > 1 ? 's' : ''}, O(1) best case / O(n) average).`
                    : `Checking index ${i}: arr[${i}] = ${arr[i]}. Since ${arr[i]} ≠ target ${target}, advancing to index ${i + 1}.`,
                note: isMatch ? `Found at index ${i}!` : `arr[${i}] ≠ ${target}`
            });
            if (isMatch) return steps;
        }

        steps.push({
            arr: [...arr],
            activeIdx: -1,
            currentIndex: -1,
            foundIdx: null,
            phase: 'not_found',
            status: 'not_found',
            comparisons,
            target,
            desc: `Linear Search complete: Scanned all ${arr.length} elements. Target ${target} was not found in the array (O(n) worst case).`,
            note: `Target ${target} not found after ${comparisons} comparisons.`
        });
        return steps;
    }

    if (algo === 'binary') {
        const arr = [...rawArr].sort((a, b) => a - b);
        let low = 0;
        let high = arr.length - 1;
        let comparisons = 0;

        steps.push({
            arr: [...arr],
            low,
            high,
            mid: Math.floor((low + high) / 2),
            foundIdx: null,
            phase: 'init',
            status: 'comparing',
            comparisons: 0,
            target,
            formula: `Search interval [${low}..${high}]. Initial mid = ⌊(${low} + ${high}) / 2⌋ = ${Math.floor((low + high) / 2)}`,
            desc: `Initialized Binary Search for target ${target} over sorted array of ${arr.length} elements. Range: [0..${arr.length - 1}].`,
            note: `Initial interval: low = ${low}, high = ${high}.`
        });

        while (low <= high) {
            comparisons++;
            const mid = low + Math.floor((high - low) / 2);
            const midVal = arr[mid];
            const isMatch = midVal === target;

            steps.push({
                arr: [...arr],
                low,
                mid,
                high,
                foundIdx: isMatch ? mid : null,
                phase: isMatch ? 'found' : 'comparing',
                status: isMatch ? 'found' : 'comparing',
                comparisons,
                target,
                formula: `mid = ${low} + ⌊(${high} - ${low}) / 2⌋ = ${mid}`,
                desc: isMatch
                    ? `Match found! arr[mid] = arr[${mid}] = ${midVal} equals target ${target}! (Found in ${comparisons} comparison${comparisons > 1 ? 's' : ''}, O(log n) time).`
                    : midVal < target
                    ? `arr[mid] = arr[${mid}] = ${midVal} < target ${target}. Target must be in the right half! Discarding left subarray [${low}..${mid}]. Updating low = ${mid + 1}.`
                    : `arr[mid] = arr[${mid}] = ${midVal} > target ${target}. Target must be in the left half! Discarding right subarray [${mid}..${high}]. Updating high = ${mid - 1}.`,
                note: isMatch
                    ? `Target found at mid index ${mid}!`
                    : midVal < target
                    ? `${midVal} < ${target} → search right [${mid + 1}..${high}]`
                    : `${midVal} > ${target} → search left [${low}..${mid - 1}]`
            });

            if (isMatch) return steps;
            if (midVal < target) low = mid + 1;
            else high = mid - 1;
        }

        steps.push({
            arr: [...arr],
            low,
            mid: -1,
            high,
            foundIdx: null,
            phase: 'not_found',
            status: 'not_found',
            comparisons,
            target,
            formula: `low (${low}) > high (${high}): search interval empty`,
            desc: `Binary Search complete: Search interval exhausted (low > high). Target ${target} is not in the sorted array.`,
            note: `Target ${target} not found after ${comparisons} comparisons.`
        });
        return steps;
    }

    // Quickselect (Order Statistics Search)
    if (algo === 'quickselect') {
        const arr = [...rawArr];
        const targetK = Math.max(1, Math.min(arr.length, k));
        const kIdx = targetK - 1;
        let comparisons = 0;

        function qselect(low, high) {
            if (low <= high) {
                const pivot = arr[high];
                let i = low - 1;
                comparisons++;

                steps.push({
                    arr: [...arr],
                    low,
                    high,
                    pivotIdx: high,
                    kIdx,
                    targetK,
                    phase: 'partition_start',
                    status: 'comparing',
                    comparisons,
                    formula: `Seeking k = ${targetK} (index ${kIdx}) in subarray [${low}..${high}]. Pivot = arr[${high}] = ${pivot}.`,
                    desc: `Partitioning window [${low}..${high}] around pivot arr[${high}] = ${pivot}. Seeking ${targetK}-th smallest element.`,
                    note: `Partitioning [${low}..${high}] with pivot ${pivot}.`
                });

                for (let j = low; j < high; j++) {
                    if (arr[j] < pivot) {
                        i++;
                        const temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
                    }
                }
                const pi = i + 1;
                const temp = arr[pi]; arr[pi] = arr[high]; arr[high] = temp;
                const isMatch = pi === kIdx;

                steps.push({
                    arr: [...arr],
                    low,
                    high,
                    pivotIdx: pi,
                    kIdx,
                    targetK,
                    phase: isMatch ? 'found' : 'partition_done',
                    status: isMatch ? 'found' : 'comparing',
                    comparisons,
                    formula: `Pivot placed at index ${pi}. Compared with k-th index ${kIdx}.`,
                    desc: isMatch
                        ? `Quickselect complete! Pivot placed at final sorted index ${pi} which exactly equals k - 1 (${kIdx}). The ${targetK}-th smallest element is ${arr[pi]}!`
                        : pi > kIdx
                        ? `Pivot index ${pi} > target index ${kIdx}. Pruning right half! Recursing only on left partition [${low}..${pi - 1}].`
                        : `Pivot index ${pi} < target index ${kIdx}. Pruning left half! Recursing only on right partition [${pi + 1}..${high}].`,
                    note: isMatch ? `Found ${targetK}-th smallest: ${arr[pi]}` : `Recursing on subproblem.`
                });

                if (isMatch) return;
                if (pi > kIdx) qselect(low, pi - 1);
                else qselect(pi + 1, high);
            }
        }

        qselect(0, arr.length - 1);
        return steps;
    }

    return steps;
}

// ═════════════════════════════════════════════════════════════════════════
// MODULE 6: SORTING ALGORITHM STEP GENERATOR (visualizedsa.com)
// ═════════════════════════════════════════════════════════════════════════
function generateSortingSteps(algo, initialArr) {
    let arr = [...initialArr];
    if (algo === 'counting') {
        arr = arr.map(v => Math.max(1, Math.min(9, Math.abs(v % 10) || 1)));
    }
    const steps = [];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;

    // ── 1. BUBBLE SORT ────────────────────────────────────────────────────────
    if (algo === 'bubble') {
        const sortedIndices = [];
        steps.push({
            arr: [...arr],
            comparing: [],
            swapping: [],
            sorted: [],
            comparisons: 0,
            swaps: 0,
            desc: `Initialized Bubble Sort for ${n} elements. Ready to perform adjacent pairwise comparisons.`
        });

        for (let i = 0; i < n - 1; i++) {
            let swappedInPass = false;
            for (let j = 0; j < n - i - 1; j++) {
                comparisons++;
                const shouldSwap = arr[j] > arr[j + 1];
                steps.push({
                    arr: [...arr],
                    comparing: [j, j + 1],
                    swapping: [],
                    sorted: [...sortedIndices],
                    comparisons,
                    swaps,
                    desc: `Comparing adjacent elements: arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}). ${shouldSwap ? `${arr[j]} > ${arr[j + 1]} → swap required.` : `${arr[j]} ≤ ${arr[j + 1]} → already in relative order.`}`
                });

                if (shouldSwap) {
                    swaps++;
                    swappedInPass = true;
                    const temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;

                    steps.push({
                        arr: [...arr],
                        comparing: [],
                        swapping: [j, j + 1],
                        sorted: [...sortedIndices],
                        comparisons,
                        swaps,
                        desc: `Swapped arr[${j}] and arr[${j + 1}]. Array is now [${arr.join(', ')}].`
                    });
                }
            }
            sortedIndices.push(n - 1 - i);
            steps.push({
                arr: [...arr],
                comparing: [],
                swapping: [],
                sorted: [...sortedIndices],
                comparisons,
                swaps,
                desc: `Pass ${i + 1} complete. Largest unsorted element is now locked at index ${n - 1 - i} (${arr[n - 1 - i]}).`
            });
            if (!swappedInPass) {
                steps.push({
                    arr: [...arr],
                    comparing: [],
                    swapping: [],
                    sorted: Array.from({ length: n }, (_, idx) => idx),
                    comparisons,
                    swaps,
                    desc: `Early termination: No swaps occurred in pass ${i + 1}. Array is fully sorted (O(n) best-case).`
                });
                return steps;
            }
        }
        sortedIndices.push(0);
        steps.push({
            arr: [...arr],
            comparing: [],
            swapping: [],
            sorted: Array.from({ length: n }, (_, idx) => idx),
            comparisons,
            swaps,
            desc: `Bubble Sort complete! All ${n} elements sorted with ${comparisons} comparisons and ${swaps} swaps.`
        });
        return steps;
    }

    // ── 2. SELECTION SORT ─────────────────────────────────────────────────────
    if (algo === 'selection') {
        const sortedIndices = [];
        steps.push({
            arr: [...arr],
            comparing: [],
            swapping: [],
            sorted: [],
            comparisons: 0,
            swaps: 0,
            desc: `Initialized Selection Sort for ${n} elements. Iteratively finds minimum element and swaps to front.`
        });

        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            steps.push({
                arr: [...arr],
                comparing: [i],
                swapping: [],
                sorted: [...sortedIndices],
                comparisons,
                swaps,
                desc: `Pass ${i + 1}: Starting search for minimum in subarray [${i}..${n - 1}]. Initial minIdx = ${i} (val = ${arr[i]}).`
            });

            for (let j = i + 1; j < n; j++) {
                comparisons++;
                const isNewMin = arr[j] < arr[minIdx];
                if (isNewMin) minIdx = j;
                steps.push({
                    arr: [...arr],
                    comparing: [minIdx, j],
                    swapping: [],
                    sorted: [...sortedIndices],
                    comparisons,
                    swaps,
                    desc: isNewMin
                        ? `New minimum found! arr[${j}] (${arr[j]}) < arr[${minIdx}]. Updating minIdx = ${j}.`
                        : `Comparing arr[${j}] (${arr[j]}) with current min arr[${minIdx}] (${arr[minIdx]}). Minimum unchanged.`
                });
            }

            if (minIdx !== i) {
                swaps++;
                const temp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = temp;
                steps.push({
                    arr: [...arr],
                    comparing: [],
                    swapping: [i, minIdx],
                    sorted: [...sortedIndices],
                    comparisons,
                    swaps,
                    desc: `Swapping minimum element arr[${minIdx}] (${arr[i]}) into sorted position ${i}.`
                });
            }
            sortedIndices.push(i);
        }
        sortedIndices.push(n - 1);
        steps.push({
            arr: [...arr],
            comparing: [],
            swapping: [],
            sorted: Array.from({ length: n }, (_, idx) => idx),
            comparisons,
            swaps,
            desc: `Selection Sort complete! Array sorted in O(n²) time with ${swaps} swaps and ${comparisons} comparisons.`
        });
        return steps;
    }

    // ── 3. INSERTION SORT ─────────────────────────────────────────────────────
    if (algo === 'insertion') {
        const sortedIndices = [0];
        steps.push({
            arr: [...arr],
            comparing: [0],
            swapping: [],
            sorted: [0],
            comparisons: 0,
            swaps: 0,
            desc: `Initialized Insertion Sort. Subarray of length 1 (arr[0]=${arr[0]}) is trivially sorted.`
        });

        for (let i = 1; i < n; i++) {
            const key = arr[i];
            let j = i - 1;
            steps.push({
                arr: [...arr],
                comparing: [i],
                swapping: [],
                sorted: [...sortedIndices],
                comparisons,
                swaps,
                desc: `Pass ${i}: Extracted key = arr[${i}] = ${key}. Shifting elements in sorted range [0..${i - 1}] greater than ${key}.`
            });

            while (j >= 0 && arr[j] > key) {
                comparisons++;
                swaps++;
                arr[j + 1] = arr[j];
                steps.push({
                    arr: [...arr],
                    comparing: [j, j + 1],
                    swapping: [j, j + 1],
                    sorted: [...sortedIndices.filter(idx => idx < j)],
                    comparisons,
                    swaps,
                    desc: `arr[${j}] (${arr[j]}) > key (${key}) → shifted right to index ${j + 1}.`
                });
                j--;
            }
            if (j >= 0) comparisons++;
            arr[j + 1] = key;
            sortedIndices.push(i);
            steps.push({
                arr: [...arr],
                comparing: [],
                swapping: [j + 1],
                sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
                comparisons,
                swaps,
                desc: `Inserted key ${key} into position ${j + 1}. Sorted prefix now spans [0..${i}].`
            });
        }
        steps.push({
            arr: [...arr],
            comparing: [],
            swapping: [],
            sorted: Array.from({ length: n }, (_, idx) => idx),
            comparisons,
            swaps,
            desc: `Insertion Sort complete! Adaptive sorting took ${comparisons} comparisons and ${swaps} shifts.`
        });
        return steps;
    }

    // ── 4. MERGE SORT ─────────────────────────────────────────────────────────
    if (algo === 'merge') {
        steps.push({
            arr: [...arr],
            comparing: [],
            swapping: [],
            sorted: [],
            comparisons: 0,
            swaps: 0,
            desc: `Initialized Merge Sort. Dividing array of ${n} elements recursively down to atomic singletons.`
        });

        function mSort(l, r) {
            if (l < r) {
                const m = l + Math.floor((r - l) / 2);
                steps.push({
                    arr: [...arr],
                    comparing: [l, r],
                    swapping: [],
                    sorted: [],
                    comparisons,
                    swaps,
                    desc: `Divide: Subarray [${l}..${r}] partitioned at mid ${m} into [${l}..${m}] and [${m + 1}..${r}].`
                });
                mSort(l, m);
                mSort(m + 1, r);

                const leftPart = arr.slice(l, m + 1);
                const rightPart = arr.slice(m + 1, r + 1);
                let p1 = 0, p2 = 0, k = l;

                while (p1 < leftPart.length && p2 < rightPart.length) {
                    comparisons++;
                    const takeLeft = leftPart[p1] <= rightPart[p2];
                    steps.push({
                        arr: [...arr],
                        comparing: [l + p1, m + 1 + p2],
                        swapping: [k],
                        sorted: [],
                        comparisons,
                        swaps,
                        desc: `Conquer: Comparing ${leftPart[p1]} and ${rightPart[p2]} → placing ${takeLeft ? leftPart[p1] : rightPart[p2]} at arr[${k}].`
                    });
                    if (takeLeft) {
                        arr[k] = leftPart[p1++];
                    } else {
                        arr[k] = rightPart[p2++];
                        swaps++;
                    }
                    k++;
                }
                while (p1 < leftPart.length) {
                    arr[k++] = leftPart[p1++];
                }
                while (p2 < rightPart.length) {
                    arr[k++] = rightPart[p2++];
                }
                steps.push({
                    arr: [...arr],
                    comparing: [],
                    swapping: [],
                    sorted: l === 0 && r === n - 1 ? Array.from({ length: n }, (_, idx) => idx) : [],
                    comparisons,
                    swaps,
                    desc: `Merged subarray [${l}..${r}] is now sorted: [${arr.slice(l, r + 1).join(', ')}].`
                });
            }
        }
        mSort(0, n - 1);
        steps.push({
            arr: [...arr],
            comparing: [],
            swapping: [],
            sorted: Array.from({ length: n }, (_, idx) => idx),
            comparisons,
            swaps,
            desc: `Merge Sort complete! Guaranteed O(n log n) sorting finished in ${comparisons} comparisons.`
        });
        return steps;
    }

    // ── 5. QUICK SORT ─────────────────────────────────────────────────────────
    if (algo === 'quick') {
        const sortedIndices = [];
        steps.push({
            arr: [...arr],
            comparing: [],
            swapping: [],
            sorted: [],
            comparisons: 0,
            swaps: 0,
            desc: `Initialized Quicksort using Lomuto Partitioning Scheme.`
        });

        function qSort(low, high) {
            if (low < high) {
                const pivot = arr[high];
                let i = low - 1;
                steps.push({
                    arr: [...arr],
                    comparing: [],
                    swapping: [],
                    pivot: high,
                    sorted: [...sortedIndices],
                    comparisons,
                    swaps,
                    desc: `Partition window [${low}..${high}]: Selected pivot arr[${high}] = ${pivot}.`
                });

                for (let j = low; j < high; j++) {
                    comparisons++;
                    const isLess = arr[j] < pivot;
                    steps.push({
                        arr: [...arr],
                        comparing: [j, high],
                        swapping: [],
                        pivot: high,
                        sorted: [...sortedIndices],
                        comparisons,
                        swaps,
                        desc: `Comparing arr[${j}] (${arr[j]}) with pivot (${pivot}). ${isLess ? `${arr[j]} < ${pivot} → swap into smaller partition.` : `${arr[j]} ≥ ${pivot} → remains in larger partition.`}`
                    });

                    if (isLess) {
                        i++;
                        if (i !== j) {
                            swaps++;
                            const temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
                            steps.push({
                                arr: [...arr],
                                comparing: [],
                                swapping: [i, j],
                                pivot: high,
                                sorted: [...sortedIndices],
                                comparisons,
                                swaps,
                                desc: `Swapped arr[${i}] and arr[${j}]. Smaller partition boundary now at index ${i}.`
                            });
                        }
                    }
                }

                const pi = i + 1;
                swaps++;
                const temp = arr[pi]; arr[pi] = arr[high]; arr[high] = temp;
                sortedIndices.push(pi);
                steps.push({
                    arr: [...arr],
                    comparing: [],
                    swapping: [pi, high],
                    pivot: pi,
                    sorted: [...sortedIndices],
                    comparisons,
                    swaps,
                    desc: `Placed pivot ${pivot} into its exact sorted position at index ${pi}!`
                });

                qSort(low, pi - 1);
                qSort(pi + 1, high);
            } else if (low === high) {
                if (!sortedIndices.includes(low)) sortedIndices.push(low);
            }
        }
        qSort(0, n - 1);
        steps.push({
            arr: [...arr],
            comparing: [],
            swapping: [],
            sorted: Array.from({ length: n }, (_, idx) => idx),
            comparisons,
            swaps,
            desc: `Quicksort complete! In-place partitioning sorted all elements in O(n log n) average time with ${swaps} swaps.`
        });
        return steps;
    }

    // ── 6. HEAP SORT ──────────────────────────────────────────────────────────
    if (algo === 'heap') {
        const sortedIndices = [];
        steps.push({
            arr: [...arr],
            comparing: [],
            swapping: [],
            sorted: [],
            comparisons: 0,
            swaps: 0,
            desc: `Initialized Heap Sort. Phase 1: Build Max-Heap from unsorted array.`
        });

        function heapify(size, rootIdx) {
            let largest = rootIdx;
            const left = 2 * rootIdx + 1;
            const right = 2 * rootIdx + 2;

            if (left < size) {
                comparisons++;
                if (arr[left] > arr[largest]) largest = left;
            }
            if (right < size) {
                comparisons++;
                if (arr[right] > arr[largest]) largest = right;
            }

            steps.push({
                arr: [...arr],
                comparing: [rootIdx, ...(left < size ? [left] : []), ...(right < size ? [right] : [])],
                swapping: [],
                pivot: rootIdx,
                sorted: [...sortedIndices],
                comparisons,
                swaps,
                desc: `Heapify at root index ${rootIdx} (val = ${arr[rootIdx]}): Left child [${left}]=${left < size ? arr[left] : 'none'}, Right child [${right}]=${right < size ? arr[right] : 'none'}. Largest = index ${largest}.`
            });

            if (largest !== rootIdx) {
                swaps++;
                const temp = arr[rootIdx]; arr[rootIdx] = arr[largest]; arr[largest] = temp;
                steps.push({
                    arr: [...arr],
                    comparing: [],
                    swapping: [rootIdx, largest],
                    pivot: rootIdx,
                    sorted: [...sortedIndices],
                    comparisons,
                    swaps,
                    desc: `Swapped root arr[${rootIdx}] with larger child arr[${largest}] (${arr[rootIdx]}). Sifting down.`
                });
                heapify(size, largest);
            }
        }

        // Build max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(n, i);
        }
        steps.push({
            arr: [...arr],
            comparing: [],
            swapping: [],
            pivot: 0,
            sorted: [],
            comparisons,
            swaps,
            desc: `Max-Heap constructed! Root arr[0]=${arr[0]} is the maximum element. Beginning Phase 2 (Extraction).`
        });

        // Extract elements from heap one by one
        for (let i = n - 1; i > 0; i--) {
            swaps++;
            const temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
            sortedIndices.push(i);
            steps.push({
                arr: [...arr],
                comparing: [],
                swapping: [0, i],
                sorted: [...sortedIndices],
                comparisons,
                swaps,
                desc: `Extracted maximum root arr[0]=${temp} and swapped with arr[${i}]. Index ${i} locked in sorted place!`
            });
            heapify(i, 0);
        }
        sortedIndices.push(0);
        steps.push({
            arr: [...arr],
            comparing: [],
            swapping: [],
            sorted: Array.from({ length: n }, (_, idx) => idx),
            comparisons,
            swaps,
            desc: `Heap Sort complete! In-place guaranteed O(n log n) sorting finished with ${swaps} swaps and ${comparisons} comparisons.`
        });
        return steps;
    }

    // ── 7. COUNTING SORT (NON-COMPARISON) ─────────────────────────────────────
    if (algo === 'counting') {
        const maxVal = Math.max(...arr);
        const countArr = new Array(maxVal + 1).fill(0);
        const outputArr = new Array(n).fill(null);

        steps.push({
            arr: [...arr],
            counts: [...countArr],
            output: [...outputArr],
            comparing: [],
            swapping: [],
            sorted: [],
            comparisons: 0,
            swaps: 0,
            countingPhase: 'init',
            desc: `Initialized Counting Sort. Non-comparison O(n + k) sorting. Maximum value in array is k = ${maxVal}.`
        });

        // Step 1: Count frequencies
        for (let i = 0; i < n; i++) {
            const val = arr[i];
            countArr[val]++;
            steps.push({
                arr: [...arr],
                counts: [...countArr],
                output: [...outputArr],
                comparing: [i],
                swapping: [],
                sorted: [],
                activeInputIdx: i,
                activeCountIdx: val,
                comparisons: 0,
                swaps: i + 1,
                countingPhase: 'count',
                desc: `Counting occurrences: Reading arr[${i}] = ${val}. Increment count[${val}] to ${countArr[val]}.`
            });
        }

        // Step 2: Accumulate counts (prefix sums)
        for (let i = 1; i <= maxVal; i++) {
            countArr[i] += countArr[i - 1];
            steps.push({
                arr: [...arr],
                counts: [...countArr],
                output: [...outputArr],
                comparing: [],
                swapping: [],
                sorted: [],
                activeCountIdx: i,
                comparisons: 0,
                swaps: n + i,
                countingPhase: 'accumulate',
                desc: `Cumulative prefix sum: count[${i}] = count[${i}] + count[${i - 1}] = ${countArr[i]} (indicates ending index position).`
            });
        }

        // Step 3: Build output array backwards (for stability)
        for (let i = n - 1; i >= 0; i--) {
            const val = arr[i];
            const targetPos = countArr[val] - 1;
            outputArr[targetPos] = val;
            countArr[val]--;
            steps.push({
                arr: [...arr],
                counts: [...countArr],
                output: [...outputArr],
                comparing: [i],
                swapping: [targetPos],
                sorted: [],
                activeInputIdx: i,
                activeCountIdx: val,
                activeOutputIdx: targetPos,
                comparisons: 0,
                swaps: n + maxVal + (n - i),
                countingPhase: 'place',
                desc: `Placing arr[${i}] (${val}): Position is count[${val}] - 1 = ${targetPos}. Writing ${val} to output[${targetPos}] and decrementing count.`
            });
        }

        // Final step: output sorted
        steps.push({
            arr: [...outputArr],
            counts: [...countArr],
            output: [...outputArr],
            comparing: [],
            swapping: [],
            sorted: Array.from({ length: n }, (_, idx) => idx),
            comparisons: 0,
            swaps: 2 * n + maxVal,
            countingPhase: 'complete',
            desc: `Counting Sort complete! Stable linear O(n + k) sort placed all elements into final output without any pairwise comparisons!`
        });
        return steps;
    }

    return steps;
}

// ═════════════════════════════════════════════════════════════════════════════
// MODULE 7: GRAPH THEORY & BST STEP GENERATORS (visualizedsa.com/visualizers/dijkstra)
// ═════════════════════════════════════════════════════════════════════════════

const GRAPH_NODES = [
    { id: 'A', label: 'A', x: 80, y: 140 },
    { id: 'B', label: 'B', x: 230, y: 65 },
    { id: 'C', label: 'C', x: 230, y: 215 },
    { id: 'D', label: 'D', x: 410, y: 65 },
    { id: 'E', label: 'E', x: 410, y: 215 },
    { id: 'F', label: 'F', x: 560, y: 140 }
];

const GRAPH_PRESETS = {
    standard: {
        name: 'Standard Graph (6 Nodes)',
        nodes: GRAPH_NODES,
        edges: [
            { id: 'A-B', u: 'A', v: 'B', weight: 4 },
            { id: 'A-C', u: 'A', v: 'C', weight: 2 },
            { id: 'B-C', u: 'B', v: 'C', weight: 1 },
            { id: 'B-D', u: 'B', v: 'D', weight: 5 },
            { id: 'C-D', u: 'C', v: 'D', weight: 8 },
            { id: 'C-E', u: 'C', v: 'E', weight: 10 },
            { id: 'D-E', u: 'D', v: 'E', weight: 2 },
            { id: 'D-F', u: 'D', v: 'F', weight: 6 },
            { id: 'E-F', u: 'E', v: 'F', weight: 3 }
        ]
    },
    dense: {
        name: 'Dense Mesh Graph',
        nodes: GRAPH_NODES,
        edges: [
            { id: 'A-B', u: 'A', v: 'B', weight: 3 },
            { id: 'A-C', u: 'A', v: 'C', weight: 5 },
            { id: 'B-C', u: 'B', v: 'C', weight: 2 },
            { id: 'B-D', u: 'B', v: 'D', weight: 4 },
            { id: 'B-E', u: 'B', v: 'E', weight: 3 },
            { id: 'C-D', u: 'C', v: 'D', weight: 6 },
            { id: 'C-E', u: 'C', v: 'E', weight: 4 },
            { id: 'D-E', u: 'D', v: 'E', weight: 1 },
            { id: 'D-F', u: 'D', v: 'F', weight: 5 },
            { id: 'E-F', u: 'E', v: 'F', weight: 2 },
            { id: 'A-D', u: 'A', v: 'D', weight: 7 }
        ]
    },
    linear: {
        name: 'Flow / DAG Graph',
        nodes: GRAPH_NODES,
        edges: [
            { id: 'A-B', u: 'A', v: 'B', weight: 4 },
            { id: 'A-C', u: 'A', v: 'C', weight: 3 },
            { id: 'B-D', u: 'B', v: 'D', weight: 6 },
            { id: 'C-D', u: 'C', v: 'D', weight: 2 },
            { id: 'C-E', u: 'C', v: 'E', weight: 5 },
            { id: 'D-F', u: 'D', v: 'F', weight: 4 },
            { id: 'E-F', u: 'E', v: 'F', weight: 7 }
        ]
    }
};

// 1. DIJKSTRA STEP GENERATOR
function generateDijkstraSteps(nodes, edges, startNode = 'A') {
    const steps = [];
    const nodeIds = nodes.map(n => n.id);
    const dist = {};
    const prev = {};
    const visited = [];

    nodeIds.forEach(id => {
        dist[id] = id === startNode ? 0 : Infinity;
        prev[id] = null;
    });

    let pq = [{ node: startNode, dist: 0 }];
    const treeEdges = [];

    steps.push({
        phase: 'init',
        activeNode: null,
        activeEdge: null,
        evaluatingNode: null,
        dist: { ...dist },
        prev: { ...prev },
        visited: [...visited],
        pq: [...pq],
        treeEdges: [...treeEdges],
        desc: `Initialized Dijkstra from source '${startNode}': dist[${startNode}] = 0, all other vertices = ∞. Inserted (${startNode}, 0) into Priority Queue.`
    });

    // Adjacency Map
    const adj = {};
    nodeIds.forEach(id => { adj[id] = []; });
    edges.forEach(e => {
        adj[e.u].push({ neighbor: e.v, weight: e.weight, edgeId: e.id });
        adj[e.v].push({ neighbor: e.u, weight: e.weight, edgeId: e.id });
    });

    while (pq.length > 0) {
        // Sort priority queue ascending
        pq.sort((a, b) => a.dist - b.dist);
        const { node: u, dist: uDist } = pq.shift();

        if (visited.includes(u)) continue;

        steps.push({
            phase: 'extract_min',
            activeNode: u,
            activeEdge: null,
            evaluatingNode: null,
            dist: { ...dist },
            prev: { ...prev },
            visited: [...visited],
            pq: [...pq],
            treeEdges: [...treeEdges],
            desc: `Extracted vertex '${u}' (tentative dist: ${uDist}) from Min-Priority Queue.`
        });

        const neighbors = adj[u];
        for (const { neighbor: v, weight: w, edgeId } of neighbors) {
            if (visited.includes(v)) continue;

            const oldDist = dist[v];
            const newDist = dist[u] + w;
            const willRelax = newDist < oldDist;

            steps.push({
                phase: 'inspect_edge',
                activeNode: u,
                activeEdge: edgeId,
                evaluatingNode: v,
                dist: { ...dist },
                prev: { ...prev },
                visited: [...visited],
                pq: [...pq],
                treeEdges: [...treeEdges],
                relaxed: willRelax,
                edgeWeight: w,
                desc: willRelax
                    ? `Inspecting edge ${u} → ${v} (wt: ${w}): dist[${u}] (${dist[u]}) + ${w} = ${newDist} < ${oldDist === Infinity ? '∞' : oldDist}. Relaxation condition met!`
                    : `Inspecting edge ${u} → ${v} (wt: ${w}): dist[${u}] (${dist[u]}) + ${w} = ${newDist} ≥ ${oldDist}. No shorter path found.`
            });

            if (willRelax) {
                dist[v] = newDist;
                prev[v] = u;
                pq.push({ node: v, dist: newDist });

                const existingIdx = treeEdges.findIndex(te => te.to === v);
                if (existingIdx !== -1) {
                    treeEdges.splice(existingIdx, 1);
                }
                treeEdges.push({ from: u, to: v, edgeId });

                steps.push({
                    phase: 'relaxed',
                    activeNode: u,
                    activeEdge: edgeId,
                    evaluatingNode: v,
                    dist: { ...dist },
                    prev: { ...prev },
                    visited: [...visited],
                    pq: [...pq],
                    treeEdges: [...treeEdges],
                    relaxed: true,
                    desc: `RELAXED edge ${u} → ${v}: Updated dist[${v}] = ${newDist}, prev[${v}] = '${u}'. Enqueued (${v}, ${newDist}) into Priority Queue.`
                });
            }
        }

        visited.push(u);
        steps.push({
            phase: 'settled',
            activeNode: u,
            activeEdge: null,
            evaluatingNode: null,
            dist: { ...dist },
            prev: { ...prev },
            visited: [...visited],
            pq: [...pq],
            treeEdges: [...treeEdges],
            desc: `Vertex '${u}' is now permanently SETTLED. Shortest distance from '${startNode}' is finalized as ${dist[u]}.`
        });
    }

    steps.push({
        phase: 'complete',
        activeNode: null,
        activeEdge: null,
        evaluatingNode: null,
        dist: { ...dist },
        prev: { ...prev },
        visited: [...visited],
        pq: [],
        treeEdges: [...treeEdges],
        desc: `Dijkstra complete! All reachable vertices settled. Shortest path tree fully constructed from source '${startNode}'.`
    });

    return steps;
}

// 2. BFS STEP GENERATOR
function generateBFSSteps(nodes, edges, startNode = 'A') {
    const steps = [];
    const nodeIds = nodes.map(n => n.id);
    const visited = [startNode];
    const queue = [startNode];
    const traversalOrder = [startNode];
    const treeEdges = [];

    const adj = {};
    nodeIds.forEach(id => { adj[id] = []; });
    edges.forEach(e => {
        adj[e.u].push({ neighbor: e.v, edgeId: e.id });
        adj[e.v].push({ neighbor: e.u, edgeId: e.id });
    });

    steps.push({
        phase: 'init',
        activeNode: startNode,
        activeEdge: null,
        queue: [...queue],
        visited: [...visited],
        traversalOrder: [...traversalOrder],
        treeEdges: [...treeEdges],
        desc: `BFS initialized at source '${startNode}'. Enqueued '${startNode}' and marked as visited.`
    });

    while (queue.length > 0) {
        const u = queue.shift();
        steps.push({
            phase: 'dequeue',
            activeNode: u,
            activeEdge: null,
            queue: [...queue],
            visited: [...visited],
            traversalOrder: [...traversalOrder],
            treeEdges: [...treeEdges],
            desc: `Dequeued vertex '${u}' from FIFO queue. Exploring unvisited neighbors level-by-level.`
        });

        for (const { neighbor: v, edgeId } of adj[u]) {
            if (!visited.includes(v)) {
                visited.push(v);
                queue.push(v);
                traversalOrder.push(v);
                treeEdges.push({ from: u, to: v, edgeId });

                steps.push({
                    phase: 'enqueue',
                    activeNode: u,
                    activeEdge: edgeId,
                    evaluatingNode: v,
                    queue: [...queue],
                    visited: [...visited],
                    traversalOrder: [...traversalOrder],
                    treeEdges: [...treeEdges],
                    desc: `Discovered unvisited neighbor '${v}'. Enqueued '${v}' and added edge ${u}-${v} to BFS tree.`
                });
            }
        }
    }

    steps.push({
        phase: 'complete',
        activeNode: null,
        activeEdge: null,
        queue: [],
        visited: [...visited],
        traversalOrder: [...traversalOrder],
        treeEdges: [...treeEdges],
        desc: `BFS Traversal complete! Visited ${visited.length} vertices in level order: ${traversalOrder.join(' → ')}.`
    });

    return steps;
}

// 3. DFS STEP GENERATOR
function generateDFSSteps(nodes, edges, startNode = 'A') {
    const steps = [];
    const nodeIds = nodes.map(n => n.id);
    const visited = [];
    const stack = [];
    const traversalOrder = [];
    const treeEdges = [];

    const adj = {};
    nodeIds.forEach(id => { adj[id] = []; });
    edges.forEach(e => {
        adj[e.u].push({ neighbor: e.v, edgeId: e.id });
        adj[e.v].push({ neighbor: e.u, edgeId: e.id });
    });

    function dfs(u, parent = null, parentEdgeId = null) {
        visited.push(u);
        stack.push(u);
        traversalOrder.push(u);
        if (parent && parentEdgeId) {
            treeEdges.push({ from: parent, to: u, edgeId: parentEdgeId });
        }

        steps.push({
            phase: 'visit',
            activeNode: u,
            activeEdge: parentEdgeId,
            stack: [...stack],
            visited: [...visited],
            traversalOrder: [...traversalOrder],
            treeEdges: [...treeEdges],
            desc: `DFS visiting '${u}'. Pushed to call stack. Current traversal depth: ${stack.length}.`
        });

        for (const { neighbor: v, edgeId } of adj[u]) {
            if (!visited.includes(v)) {
                dfs(v, u, edgeId);
            }
        }

        stack.pop();
        steps.push({
            phase: 'backtrack',
            activeNode: stack[stack.length - 1] || null,
            activeEdge: null,
            stack: [...stack],
            visited: [...visited],
            traversalOrder: [...traversalOrder],
            treeEdges: [...treeEdges],
            desc: `Backtracking from vertex '${u}'. Popped from call stack.`
        });
    }

    dfs(startNode);

    steps.push({
        phase: 'complete',
        activeNode: null,
        activeEdge: null,
        stack: [],
        visited: [...visited],
        traversalOrder: [...traversalOrder],
        treeEdges: [...treeEdges],
        desc: `DFS Traversal complete! Visited vertices in depth-first order: ${traversalOrder.join(' → ')}.`
    });

    return steps;
}

// 4. KRUSKAL'S MST STEP GENERATOR
function generateKruskalSteps(nodes, edges) {
    const steps = [];
    const nodeIds = nodes.map(n => n.id);
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

    const parent = {};
    nodeIds.forEach(id => { parent[id] = id; });

    function find(i) {
        if (parent[i] === i) return i;
        return (parent[i] = find(parent[i]));
    }

    function union(i, j) {
        const rootI = find(i);
        const rootJ = find(j);
        if (rootI !== rootJ) {
            parent[rootI] = rootJ;
            return true;
        }
        return false;
    }

    const mstEdges = [];
    const rejectedEdges = [];
    let totalWeight = 0;

    steps.push({
        phase: 'init',
        activeEdge: null,
        sortedEdges: sortedEdges.map(e => ({ ...e })),
        currentEdgeIdx: -1,
        mstEdges: [...mstEdges],
        rejectedEdges: [...rejectedEdges],
        parent: { ...parent },
        totalWeight,
        desc: `Kruskal's MST initialized: Sorted all ${edges.length} edges by ascending weight. Initialized ${nodeIds.length} disjoint singleton sets.`
    });

    for (let i = 0; i < sortedEdges.length; i++) {
        const edge = sortedEdges[i];
        const rootU = find(edge.u);
        const rootV = find(edge.v);
        const isCycle = rootU === rootV;

        if (!isCycle) {
            union(edge.u, edge.v);
            mstEdges.push(edge.id);
            totalWeight += edge.weight;

            steps.push({
                phase: 'accept',
                activeEdge: edge.id,
                edgeStatus: 'accepted',
                sortedEdges: sortedEdges.map(e => ({ ...e })),
                currentEdgeIdx: i,
                mstEdges: [...mstEdges],
                rejectedEdges: [...rejectedEdges],
                parent: { ...parent },
                totalWeight,
                desc: `Edge ${edge.u}-${edge.v} (wt: ${edge.weight}): find('${edge.u}') = '${rootU}' ≠ find('${edge.v}') = '${rootV}'. Disjoint components → ACCEPT into MST! Total MST Weight: ${totalWeight}.`
            });
        } else {
            rejectedEdges.push(edge.id);
            steps.push({
                phase: 'reject',
                activeEdge: edge.id,
                edgeStatus: 'rejected',
                sortedEdges: sortedEdges.map(e => ({ ...e })),
                currentEdgeIdx: i,
                mstEdges: [...mstEdges],
                rejectedEdges: [...rejectedEdges],
                parent: { ...parent },
                totalWeight,
                desc: `Edge ${edge.u}-${edge.v} (wt: ${edge.weight}): find('${edge.u}') = '${rootU}' == find('${edge.v}') = '${rootV}'. Both vertices already in same component → REJECT (creates cycle).`
            });
        }

        if (mstEdges.length === nodeIds.length - 1) {
            break;
        }
    }

    steps.push({
        phase: 'complete',
        activeEdge: null,
        sortedEdges: sortedEdges.map(e => ({ ...e })),
        currentEdgeIdx: sortedEdges.length,
        mstEdges: [...mstEdges],
        rejectedEdges: [...rejectedEdges],
        parent: { ...parent },
        totalWeight,
        desc: `Kruskal's MST complete! Selected exactly ${mstEdges.length} edges spanning all ${nodeIds.length} vertices with minimal total weight of ${totalWeight}.`
    });

    return steps;
}

// 5. FLOYD-WARSHALL STEP GENERATOR
function generateFloydWarshallSteps(nodes, edges) {
    const steps = [];
    const nodeIds = nodes.map(n => n.id);
    const n = nodeIds.length;
    
    const matrix = {};
    nodeIds.forEach(u => {
        matrix[u] = {};
        nodeIds.forEach(v => {
            matrix[u][v] = u === v ? 0 : Infinity;
        });
    });

    edges.forEach(e => {
        matrix[e.u][e.v] = e.weight;
        matrix[e.v][e.u] = e.weight;
    });

    steps.push({
        phase: 'init',
        k: null,
        i: null,
        j: null,
        matrix: JSON.parse(JSON.stringify(matrix)),
        updated: false,
        desc: `Floyd-Warshall initialized: D[i][j] populated with direct edge weights. Matrix dimension ${n}×${n}.`
    });

    for (let kIdx = 0; kIdx < n; kIdx++) {
        const k = nodeIds[kIdx];
        for (let iIdx = 0; iIdx < n; iIdx++) {
            const i = nodeIds[iIdx];
            for (let jIdx = 0; jIdx < n; jIdx++) {
                const j = nodeIds[jIdx];
                if (i === j || i === k || j === k) continue;

                const direct = matrix[i][j];
                const throughK = matrix[i][k] + matrix[k][j];

                if (throughK < direct) {
                    matrix[i][j] = throughK;
                    steps.push({
                        phase: 'update',
                        k,
                        i,
                        j,
                        matrix: JSON.parse(JSON.stringify(matrix)),
                        updated: true,
                        direct,
                        throughK,
                        desc: `Intermediate vertex k='${k}': Path ${i}→${k}→${j} has weight ${throughK} < direct distance ${direct === Infinity ? '∞' : direct}. Updated D[${i}][${j}] = ${throughK}.`
                    });
                }
            }
        }
    }

    steps.push({
        phase: 'complete',
        k: null,
        i: null,
        j: null,
        matrix: JSON.parse(JSON.stringify(matrix)),
        updated: false,
        desc: `Floyd-Warshall complete! All-pairs shortest distance matrix computed in O(V³) time.`
    });

    return steps;
}

// 6. BST LAYOUT GENERATOR
function buildBSTTreeLayout(keys, width = 560) {
    if (!keys || keys.length === 0) return { nodes: [], edges: [] };

    let root = null;
    function insert(r, val) {
        if (!r) return { key: val, left: null, right: null };
        if (val < r.key) r.left = insert(r.left, val);
        else if (val > r.key) r.right = insert(r.right, val);
        return r;
    }
    keys.forEach(k => { root = insert(root, k); });

    const nodes = [];
    const edges = [];

    function traverse(node, depth, leftBound, rightBound) {
        if (!node) return;
        const x = Math.round((leftBound + rightBound) / 2);
        const y = 35 + depth * 55;
        nodes.push({ id: `bst-${node.key}`, key: node.key, x, y, depth });

        if (node.left) {
            const childX = Math.round((leftBound + x) / 2);
            const childY = 35 + (depth + 1) * 55;
            edges.push({ fromX: x, fromY: y, toX: childX, toY: childY, fromKey: node.key, toKey: node.left.key });
            traverse(node.left, depth + 1, leftBound, x);
        }
        if (node.right) {
            const childX = Math.round((x + rightBound) / 2);
            const childY = 35 + (depth + 1) * 55;
            edges.push({ fromX: x, fromY: y, toX: childX, toY: childY, fromKey: node.key, toKey: node.right.key });
            traverse(node.right, depth + 1, x, rightBound);
        }
    }

    traverse(root, 0, 30, width - 30);
    return { nodes, edges };
}

// ═════════════════════════════════════════════════════════════════════════════
// MODULE 8: HASHING STEP GENERATORS & MATH HELPERS (Lab 12 & Perfect Hashing)
// ═════════════════════════════════════════════════════════════════════════════

function computeHash(key, m, method = 'division') {
    const num = typeof key === 'number' ? key : String(key).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    if (method === 'multiplication') {
        const A = 0.6180339887; // Knuth's constant: (sqrt(5) - 1) / 2
        const frac = (num * A) % 1;
        return Math.floor(m * frac);
    }
    if (method === 'midsquare') {
        const sq = num * num;
        const sqStr = String(sq);
        const mid = Math.floor(sqStr.length / 2);
        const chunk = Number(sqStr.substring(Math.max(0, mid - 1), Math.min(sqStr.length, mid + 2))) || sq;
        return chunk % m;
    }
    // Default: division method
    return ((num % m) + m) % m;
}

// FKS 2-Level Universal Hashing Model Generator (Fredman, Komlós, Szemerédi)
function buildPerfectHashTable(keys, m = 7) {
    const p = 101;
    const a = 3, b = 42;
    
    const buckets = Array.from({ length: m }, () => []);
    keys.forEach(k => {
        const h1 = ((a * k + b) % p) % m;
        buckets[h1].push(k);
    });

    const secondaryTables = buckets.map(bucketKeys => {
        const n_j = bucketKeys.length;
        if (n_j === 0) {
            return { m_j: 0, a_j: 1, b_j: 0, table: [] };
        }
        if (n_j === 1) {
            return { m_j: 1, a_j: 1, b_j: 0, table: [bucketKeys[0]] };
        }

        const m_j = n_j * n_j;
        let found = false;
        let chosenA = 1, chosenB = 0;
        let chosenTable = Array(m_j).fill(null);

        for (let testA = 1; testA < 30 && !found; testA++) {
            for (let testB = 0; testB < 15 && !found; testB++) {
                const subTable = Array(m_j).fill(null);
                let collision = false;
                for (const k of bucketKeys) {
                    const slot = ((testA * k + testB) % p) % m_j;
                    if (subTable[slot] !== null) {
                        collision = true;
                        break;
                    }
                    subTable[slot] = k;
                }
                if (!collision) {
                    found = true;
                    chosenA = testA;
                    chosenB = testB;
                    chosenTable = subTable;
                }
            }
        }

        return {
            m_j,
            a_j: chosenA,
            b_j: chosenB,
            table: chosenTable
        };
    });

    return {
        m,
        p,
        a,
        b,
        buckets,
        secondaryTables
    };
}

// ═════════════════════════════════════════════════════════════════════════════
// MODULE 9: STRING ALGORITHMS STEP GENERATORS (Rabin-Karp & String Manipulations)
// ═════════════════════════════════════════════════════════════════════════════

function generateRabinKarpSteps(text, pattern, d = 256, q = 101) {
    const steps = [];
    const n = text.length;
    const m = pattern.length;

    if (m === 0 || n === 0 || m > n) {
        return [{
            phase: 'error',
            windowIdx: 0,
            textHash: 0,
            patternHash: 0,
            matches: [],
            desc: 'Pattern length must be greater than 0 and less than or equal to text length.'
        }];
    }

    let h = 1;
    for (let i = 0; i < m - 1; i++) {
        h = (h * d) % q;
    }

    let p = 0;
    let t = 0;
    for (let i = 0; i < m; i++) {
        p = (d * p + pattern.charCodeAt(i)) % q;
        t = (d * t + text.charCodeAt(i)) % q;
    }

    const matches = [];

    steps.push({
        phase: 'init',
        windowIdx: 0,
        patternHash: p,
        textHash: t,
        matches: [...matches],
        comparingChars: [],
        charMatch: null,
        desc: `Initialized Rabin-Karp: Pattern hash p = ${p}. Window 0 hash t₀ = ${t}. High-order multiplier h = ${d}^(${m}-1) mod ${q} = ${h}.`
    });

    for (let s = 0; s <= n - m; s++) {
        if (p === t) {
            let fullMatch = true;
            const comparing = [];
            for (let j = 0; j < m; j++) {
                const match = text[s + j] === pattern[j];
                comparing.push({ textIdx: s + j, patIdx: j, matches: match });
                if (!match) {
                    fullMatch = false;
                    break;
                }
            }

            if (fullMatch) {
                matches.push(s);
                steps.push({
                    phase: 'match',
                    windowIdx: s,
                    patternHash: p,
                    textHash: t,
                    matches: [...matches],
                    comparingChars: comparing,
                    charMatch: true,
                    desc: `MATCH FOUND at index ${s}! Hash match (p = ${p} == t = ${t}) verified character-by-character: "${text.substring(s, s + m)}" === "${pattern}".`
                });
            } else {
                steps.push({
                    phase: 'spurious_hit',
                    windowIdx: s,
                    patternHash: p,
                    textHash: t,
                    matches: [...matches],
                    comparingChars: comparing,
                    charMatch: false,
                    desc: `SPURIOUS HIT at index ${s}! Hash matched (p = ${p} == t = ${t}), but character comparison revealed a collision: "${text.substring(s, s + m)}" ≠ "${pattern}".`
                });
            }
        } else {
            steps.push({
                phase: 'hash_mismatch',
                windowIdx: s,
                patternHash: p,
                textHash: t,
                matches: [...matches],
                comparingChars: [],
                charMatch: null,
                desc: `Window [${s}..${s + m - 1}]: Hash mismatch (pattern hash ${p} ≠ window hash ${t}). Sliding window right in O(1) time.`
            });
        }

        if (s < n - m) {
            const oldT = t;
            const leavingChar = text[s];
            const enteringChar = text[s + m];
            t = (d * (t - text.charCodeAt(s) * h) + text.charCodeAt(s + m)) % q;
            if (t < 0) t = t + q;

            steps.push({
                phase: 'rolling_hash',
                windowIdx: s + 1,
                patternHash: p,
                textHash: t,
                matches: [...matches],
                leavingChar,
                enteringChar,
                formula: `t_${s + 1} = (${d} × (${oldT} - '${leavingChar}'×${h}) + '${enteringChar}') mod ${q} = ${t}`,
                desc: `Rolling Hash Update: Dropping '${leavingChar}' (left) and adding '${enteringChar}' (right). New window hash t_${s + 1} = ${t} computed in O(1) time.`
            });
        }
    }

    steps.push({
        phase: 'complete',
        windowIdx: n - m,
        patternHash: p,
        textHash: t,
        matches: [...matches],
        comparingChars: [],
        desc: `Rabin-Karp Search complete! Found ${matches.length} occurrence(s) of "${pattern}" at indices: [${matches.join(', ')}].`
    });

    return steps;
}

export default function DSAInteractiveVisualizer({
    activeLesson,
    currentLessonDoc,
    currentModule,
    moduleNumber = 2,
    lessonOrder = 1,
    visualizerType
}) {
    // 1. Strictly determine which module (1 - 8) we are in
    const activeModuleNumber = useMemo(() => {
        if (typeof moduleNumber === 'number' && moduleNumber >= 1 && moduleNumber <= 9) {
            return moduleNumber;
        }
        if (currentModule?.orderIndex && currentModule.orderIndex >= 1 && currentModule.orderIndex <= 9) {
            return currentModule.orderIndex;
        }
        const mTitle = (currentModule?.title || '').toLowerCase();
        if (mTitle.includes('algorithm') || mTitle.includes('01')) return 1;
        if (mTitle.includes('stack') || mTitle.includes('02')) return 2;
        if (mTitle.includes('list') || mTitle.includes('queue') || mTitle.includes('03')) return 3;
        if (mTitle.includes('recursion') || mTitle.includes('04')) return 4;
        if (mTitle.includes('search') || mTitle.includes('05')) return 5;
        if (mTitle.includes('sort') || mTitle.includes('06')) return 6;
        if (mTitle.includes('graph') || mTitle.includes('tree') || mTitle.includes('07')) return 7;
        if (mTitle.includes('hash') || mTitle.includes('08')) return 8;
        if (mTitle.includes('string') || mTitle.includes('09')) return 9;

        if (visualizerType?.includes('stacks')) return 2;
        if (visualizerType?.includes('lists')) return 3;
        if (visualizerType?.includes('recursion')) return 4;
        if (visualizerType?.includes('search')) return 5;
        if (visualizerType?.includes('sort')) return 6;
        if (visualizerType?.includes('graph')) return 7;
        if (visualizerType?.includes('hash')) return 8;
        if (visualizerType?.includes('string')) return 9;
        return 2;
    }, [moduleNumber, currentModule, visualizerType]);

    const currentModuleMeta = MODULE_DEFINITIONS[activeModuleNumber] || MODULE_DEFINITIONS[2];

    // 2. Determine active sub-topic within this specific module
    const initialTopicId = useMemo(() => {
        const order = lessonOrder || 1;
        const matchingTopic = currentModuleMeta.topics.find(t => t.order === order);
        return matchingTopic ? matchingTopic.id : currentModuleMeta.topics[0]?.id || 1;
    }, [lessonOrder, currentModuleMeta]);

    const [selectedTopicId, setSelectedTopicId] = useState(initialTopicId);
    const [logHistory, setLogHistory] = useState([]);

    // Keep sub-topic synced when lessonOrder or module changes
    useEffect(() => {
        const order = lessonOrder || 1;
        const matchingTopic = currentModuleMeta.topics.find(t => t.order === order);
        setSelectedTopicId(matchingTopic ? matchingTopic.id : currentModuleMeta.topics[0]?.id || 1);
    }, [lessonOrder, currentModuleMeta]);

    const addLog = (msg) => {
        const time = new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
        setLogHistory(prev => [{ time, text: msg }, ...prev.slice(0, 7)]);
    };

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 1 STATE: MEMORY & ALGORITHM ADT
    // ═════════════════════════════════════════════════════════════════════════
    const [heapBlocks, setHeapBlocks] = useState([
        { id: 1, type: 'malloc', size: '16B', addr: '0x30A0', val: 'Uninitialized (Garbage)' },
        { id: 2, type: 'calloc', size: '24B', addr: '0x30B4', val: '0, 0, 0, 0, 0, 0 (Zeroed)' }
    ]);
    const [memInputSize, setMemInputSize] = useState(4);
    const [elapsedRunTime, setElapsedRunTime] = useState(null);

    const handleAllocateMalloc = () => {
        const addr = '0x' + (Math.floor(Math.random() * 0xFFF) + 0x3000).toString(16).toUpperCase();
        setHeapBlocks(prev => [...prev, { id: Date.now(), type: 'malloc', size: `${memInputSize * 4}B`, addr, val: 'Raw allocated bytes' }]);
        addLog(`malloc(${memInputSize} * sizeof(int)): Allocated ${memInputSize * 4} raw bytes at heap address ${addr}.`);
    };

    const handleAllocateCalloc = () => {
        const addr = '0x' + (Math.floor(Math.random() * 0xFFF) + 0x3000).toString(16).toUpperCase();
        setHeapBlocks(prev => [...prev, { id: Date.now(), type: 'calloc', size: `${memInputSize * 4}B`, addr, val: Array(Number(memInputSize)).fill(0).join(', ') }]);
        addLog(`calloc(${memInputSize}, sizeof(int)): Allocated and zero-initialized ${memInputSize * 4} bytes at ${addr}.`);
    };

    const handleFreeHeap = () => {
        if (heapBlocks.length === 0) {
            addLog('No active dynamic memory blocks to free.');
            return;
        }
        const freed = heapBlocks[heapBlocks.length - 1];
        setHeapBlocks(prev => prev.slice(0, -1));
        addLog(`free(${freed.addr}): Deallocated block (${freed.size}) back to OS heap allocator.`);
    };

    const handleMeasureElapsedTime = () => {
        const start = performance.now();
        let sum = 0;
        for (let i = 0; i < 500000; i++) sum += i;
        const end = performance.now();
        const duration = (end - start).toFixed(3);
        setElapsedRunTime(duration);
        addLog(`clock() benchmark: 500,000 loop cycles took ${duration} ms (${(duration / 1000).toFixed(6)} s).`);
    };

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 2 STATE: STACKS (visualizedsa.com/visualizers/stack-queue)
    // ═════════════════════════════════════════════════════════════════════════
    const [stackCapacity, setStackCapacity] = useState(6);
    const [stackItems, setStackItems] = useState([24, 48, 72]);
    const [stackInput, setStackInput] = useState('');
    const [stackHighlightIdx, setStackHighlightIdx] = useState(null);

    const handleStackPush = () => {
        if (stackItems.length >= stackCapacity) {
            addLog(`Stack Overflow! Capacity of ${stackCapacity} slots reached (top == MAX - 1).`);
            return;
        }
        const val = stackInput !== '' ? Number(stackInput) : Math.floor(Math.random() * 85) + 10;
        setStackInput('');
        setStackItems(prev => [...prev, val]);
        const newTop = stackItems.length;
        setStackHighlightIdx(newTop);
        addLog(`push(${val}): Pushed element to TOP at index [${newTop}]. top = ${newTop}.`);
        setTimeout(() => setStackHighlightIdx(null), 700);
    };

    const handleStackPop = () => {
        if (stackItems.length === 0) {
            addLog('Stack Underflow! Cannot pop from empty stack (top == -1).');
            return;
        }
        const popped = stackItems[stackItems.length - 1];
        setStackItems(prev => prev.slice(0, -1));
        addLog(`pop(): Removed element ${popped} from TOP. top updated to ${stackItems.length - 2}.`);
    };

    const handleStackPeek = () => {
        if (stackItems.length === 0) {
            addLog('peek(): Stack is empty (top == -1, returns NULL / -1).');
            return;
        }
        const topVal = stackItems[stackItems.length - 1];
        setStackHighlightIdx(stackItems.length - 1);
        addLog(`peek(): Current TOP element is ${topVal} at index [${stackItems.length - 1}]. Stack unchanged.`);
        setTimeout(() => setStackHighlightIdx(null), 1200);
    };

    const handleStackClear = () => {
        setStackItems([]);
        addLog('Stack cleared: top reset to -1.');
    };

    const [infixInput, setInfixInput] = useState('( A + B ) * ( C - D )');
    const [shuntingYardData, setShuntingYardData] = useState(() => buildShuntingYardSteps('( A + B ) * ( C - D )'));
    const [shuntingStepIdx, setShuntingStepIdx] = useState(0);
    const [shuntingIsPlaying, setShuntingIsPlaying] = useState(false);

    const handleApplyInfixPreset = (expr) => {
        setInfixInput(expr);
        const data = buildShuntingYardSteps(expr);
        setShuntingYardData(data);
        setShuntingStepIdx(0);
        setShuntingIsPlaying(false);
        addLog(`Loaded expression: "${expr}" for Shunting-Yard conversion.`);
    };

    const handleStepShuntingForward = () => {
        if (shuntingStepIdx < shuntingYardData.steps.length - 1) {
            const nextIdx = shuntingStepIdx + 1;
            setShuntingStepIdx(nextIdx);
            addLog(`Step ${nextIdx}: ${shuntingYardData.steps[nextIdx].action}`);
        } else {
            setShuntingIsPlaying(false);
        }
    };

    const handleResetShunting = () => {
        setShuntingStepIdx(0);
        setShuntingIsPlaying(false);
        addLog('Reset Shunting-Yard converter to initial state.');
    };

    useEffect(() => {
        let timer;
        if (shuntingIsPlaying) {
            timer = setInterval(() => {
                setShuntingStepIdx(prev => {
                    if (prev < shuntingYardData.steps.length - 1) {
                        return prev + 1;
                    } else {
                        setShuntingIsPlaying(false);
                        return prev;
                    }
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [shuntingIsPlaying, shuntingYardData]);

    const [postfixInput, setPostfixInput] = useState('5 3 + 8 2 - *');
    const [postfixEvalData, setPostfixEvalData] = useState(() => buildPostfixEvalSteps('5 3 + 8 2 - *'));
    const [postfixStepIdx, setPostfixStepIdx] = useState(0);
    const [postfixIsPlaying, setPostfixIsPlaying] = useState(false);

    const handleApplyPostfixPreset = (expr) => {
        setPostfixInput(expr);
        const data = buildPostfixEvalSteps(expr);
        setPostfixEvalData(data);
        setPostfixStepIdx(0);
        setPostfixIsPlaying(false);
        addLog(`Loaded postfix expression: "${expr}" for evaluation.`);
    };

    const handleStepPostfixForward = () => {
        if (postfixStepIdx < postfixEvalData.steps.length - 1) {
            const nextIdx = postfixStepIdx + 1;
            setPostfixStepIdx(nextIdx);
            addLog(`Eval Step ${nextIdx}: ${postfixEvalData.steps[nextIdx].action}`);
        } else {
            setPostfixIsPlaying(false);
        }
    };

    const handleResetPostfix = () => {
        setPostfixStepIdx(0);
        setPostfixIsPlaying(false);
        addLog('Reset Postfix Evaluator to initial state.');
    };

    useEffect(() => {
        let timer;
        if (postfixIsPlaying) {
            timer = setInterval(() => {
                setPostfixStepIdx(prev => {
                    if (prev < postfixEvalData.steps.length - 1) {
                        return prev + 1;
                    } else {
                        setPostfixIsPlaying(false);
                        return prev;
                    }
                });
            }, 1100);
        }
        return () => clearInterval(timer);
    }, [postfixIsPlaying, postfixEvalData]);

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 3 STATE: LISTS & QUEUES (visualizedsa.com/visualizers/linked-list-operations)
    // ═════════════════════════════════════════════════════════════════════════
    const [listType, setListType] = useState('singly');
    const [linkedNodes, setLinkedNodes] = useState([
        { id: 1, val: 15, addr: '0x10A0' },
        { id: 2, val: 30, addr: '0x10B4' },
        { id: 3, val: 45, addr: '0x10C8' },
        { id: 4, val: 60, addr: '0x10DC' }
    ]);
    const [listValInput, setListValInput] = useState('');
    const [listIndexInput, setListIndexInput] = useState(1);
    const [listSearchTarget, setListSearchTarget] = useState('');
    const [listActiveTraverseIdx, setListActiveTraverseIdx] = useState(null);

    const generateHexAddr = () => '0x' + (Math.floor(Math.random() * 0x8FF) + 0x1000).toString(16).toUpperCase();

    const handleListInsertHead = () => {
        if (linkedNodes.length >= 7) {
            addLog('List visualizer limit (7 nodes) reached.');
            return;
        }
        const val = listValInput !== '' ? Number(listValInput) : Math.floor(Math.random() * 85) + 10;
        setListValInput('');
        const newAddr = generateHexAddr();
        const newNode = { id: Date.now(), val, addr: newAddr };
        setLinkedNodes(prev => [newNode, ...prev]);
        setListActiveTraverseIdx(0);
        addLog(`insertAtHead(${val}): Allocated node at ${newAddr}, new_node->next = HEAD; HEAD = new_node in O(1) time.`);
        setTimeout(() => setListActiveTraverseIdx(null), 900);
    };

    const handleListInsertTail = () => {
        if (linkedNodes.length >= 7) {
            addLog('List visualizer limit (7 nodes) reached.');
            return;
        }
        const val = listValInput !== '' ? Number(listValInput) : Math.floor(Math.random() * 85) + 10;
        setListValInput('');
        const newAddr = generateHexAddr();
        const newNode = { id: Date.now(), val, addr: newAddr };
        setLinkedNodes(prev => [...prev, newNode]);
        setListActiveTraverseIdx(linkedNodes.length);
        addLog(`insertAtTail(${val}): Allocated node at ${newAddr}, TAIL->next = new_node in O(1) time.`);
        setTimeout(() => setListActiveTraverseIdx(null), 900);
    };

    const handleListInsertAtIndex = () => {
        if (linkedNodes.length >= 7) return;
        const idx = Math.max(0, Math.min(Number(listIndexInput) || 0, linkedNodes.length));
        const val = listValInput !== '' ? Number(listValInput) : Math.floor(Math.random() * 85) + 10;
        setListValInput('');
        const newAddr = generateHexAddr();
        const newNode = { id: Date.now(), val, addr: newAddr };

        const updated = [...linkedNodes];
        updated.splice(idx, 0, newNode);
        setLinkedNodes(updated);
        setListActiveTraverseIdx(idx);
        addLog(`insertAtIndex(pos=${idx}, val=${val}): Traversed to index ${idx}, spliced pointers.`);
        setTimeout(() => setListActiveTraverseIdx(null), 900);
    };

    const handleListDeleteHead = () => {
        if (linkedNodes.length === 0) return;
        const removed = linkedNodes[0];
        setLinkedNodes(prev => prev.slice(1));
        addLog(`deleteHead(): Freed node (${removed.val} at ${removed.addr}), HEAD advanced.`);
    };

    const handleListDeleteTail = () => {
        if (linkedNodes.length === 0) return;
        const removed = linkedNodes[linkedNodes.length - 1];
        setLinkedNodes(prev => prev.slice(0, -1));
        addLog(`deleteTail(): Freed tail (${removed.val}).`);
    };

    const handleListDeleteByValue = () => {
        if (linkedNodes.length === 0) return;
        const target = listValInput !== '' ? Number(listValInput) : linkedNodes[0].val;
        setListValInput('');
        const matchIdx = linkedNodes.findIndex(n => n.val === target);
        if (matchIdx === -1) {
            addLog(`deleteByValue(${target}): Value not found.`);
            return;
        }
        setLinkedNodes(prev => prev.filter((_, idx) => idx !== matchIdx));
        addLog(`deleteByValue(${target}): Removed node at index [${matchIdx}].`);
    };

    const handleListSearch = () => {
        if (linkedNodes.length === 0) return;
        const target = listSearchTarget !== '' ? Number(listSearchTarget) : linkedNodes[0].val;
        setListSearchTarget(target);

        let step = 0;
        const interval = setInterval(() => {
            if (step < linkedNodes.length) {
                setListActiveTraverseIdx(step);
                const current = linkedNodes[step];
                if (current.val === target) {
                    addLog(`search(${target}): 🎯 Target found at node [${step}]!`);
                    clearInterval(interval);
                    setTimeout(() => setListActiveTraverseIdx(null), 1800);
                    return;
                }
                step++;
            } else {
                addLog(`search(${target}): Reached NULL terminator. Not found.`);
                setListActiveTraverseIdx(null);
                clearInterval(interval);
            }
        }, 600);
    };

    const handleListReverse = () => {
        if (linkedNodes.length <= 1) return;
        setLinkedNodes(prev => [...prev].reverse());
        addLog('reverseList(): Inverted all pointers in O(n) time, O(1) space.');
    };

    const handleListReset = () => {
        setLinkedNodes([
            { id: 1, val: 12, addr: '0x10A0' },
            { id: 2, val: 24, addr: '0x10B4' },
            { id: 3, val: 36, addr: '0x10C8' },
            { id: 4, val: 48, addr: '0x10DC' }
        ]);
        setListActiveTraverseIdx(null);
        addLog('Reset linked list to 4 initial nodes.');
    };

    // Queues
    const [queueMode, setQueueMode] = useState('linear');
    const [linearQueue, setLinearQueue] = useState([10, 20, 30, null, null, null]);
    const [linearFront, setLinearFront] = useState(0);
    const [linearRear, setLinearRear] = useState(2);
    const [queueValInput, setQueueValInput] = useState('');

    const [stackInbox, setStackInbox] = useState([15, 30]);
    const [stackOutbox, setStackOutbox] = useState([45]);

    const handleLinearEnqueue = () => {
        if (linearRear >= 5) {
            addLog('Linear Queue Overflow!');
            return;
        }
        const val = queueValInput !== '' ? Number(queueValInput) : Math.floor(Math.random() * 85) + 10;
        setQueueValInput('');
        const newRear = linearFront === -1 ? 0 : linearRear + 1;
        const newFront = linearFront === -1 ? 0 : linearFront;
        const updated = [...linearQueue];
        updated[newRear] = val;
        setLinearQueue(updated);
        setLinearRear(newRear);
        setLinearFront(newFront);
        addLog(`enqueue(${val}): Inserted at REAR [${newRear}].`);
    };

    const handleLinearDequeue = () => {
        if (linearFront === -1 || linearFront > linearRear) {
            addLog('Linear Queue Underflow!');
            return;
        }
        const val = linearQueue[linearFront];
        const updated = [...linearQueue];
        updated[linearFront] = null;
        setLinearQueue(updated);
        const newFront = linearFront + 1;
        if (newFront > linearRear) {
            setLinearFront(-1);
            setLinearRear(-1);
            addLog(`dequeue(): Removed ${val}. Queue empty.`);
        } else {
            setLinearFront(newFront);
            addLog(`dequeue(): Removed ${val} from FRONT [${linearFront}].`);
        }
    };

    const handleLinearReset = () => {
        setLinearQueue([10, 20, 30, null, null, null]);
        setLinearFront(0);
        setLinearRear(2);
        addLog('Reset Linear FIFO queue.');
    };

    const handleTwoStacksEnqueue = () => {
        if (stackInbox.length + stackOutbox.length >= 6) return;
        const val = queueValInput !== '' ? Number(queueValInput) : Math.floor(Math.random() * 85) + 10;
        setQueueValInput('');
        setStackInbox(prev => [...prev, val]);
        addLog(`enqueue(${val}): Pushed directly to Stack 1 (Inbox).`);
    };

    const handleTwoStacksDequeue = () => {
        if (stackOutbox.length > 0) {
            const popped = stackOutbox[stackOutbox.length - 1];
            setStackOutbox(prev => prev.slice(0, -1));
            addLog(`dequeue(): Popped ${popped} from Stack 2 (Outbox).`);
        } else if (stackInbox.length > 0) {
            const transferred = [...stackInbox].reverse();
            const popped = transferred[transferred.length - 1];
            setStackInbox([]);
            setStackOutbox(transferred.slice(0, -1));
            addLog(`dequeue(): Transferred Stack 1 -> Stack 2, then popped ${popped}.`);
        } else {
            addLog('Queue Underflow!');
        }
    };

    const CIRCULAR_SIZE = 8;
    const [circularSlots, setCircularSlots] = useState([12, 24, 36, null, null, null, null, null]);
    const [circularFront, setCircularFront] = useState(0);
    const [circularRear, setCircularRear] = useState(2);
    const [circularValInput, setCircularValInput] = useState('');

    const handleCircularEnqueue = () => {
        const nextRear = (circularRear + 1) % CIRCULAR_SIZE;
        if (nextRear === circularFront && circularSlots[circularFront] !== null) {
            addLog(`Circular Queue Full! (rear + 1) % ${CIRCULAR_SIZE} == front.`);
            return;
        }
        const val = circularValInput !== '' ? Number(circularValInput) : Math.floor(Math.random() * 85) + 10;
        setCircularValInput('');
        const updated = [...circularSlots];
        updated[nextRear] = val;
        setCircularSlots(updated);
        setCircularRear(nextRear);
        if (circularFront === -1) setCircularFront(0);
        addLog(`enqueue(${val}): rear = (${circularRear} + 1) % ${CIRCULAR_SIZE} = [${nextRear}].`);
    };

    const handleCircularDequeue = () => {
        if (circularFront === -1 || circularSlots[circularFront] === null) {
            addLog('Circular Queue Underflow!');
            return;
        }
        const val = circularSlots[circularFront];
        const updated = [...circularSlots];
        updated[circularFront] = null;
        setCircularSlots(updated);

        if (circularFront === circularRear) {
            setCircularFront(-1);
            setCircularRear(-1);
            addLog(`dequeue(): Removed ${val}. Queue empty.`);
        } else {
            const nextFront = (circularFront + 1) % CIRCULAR_SIZE;
            setCircularFront(nextFront);
            addLog(`dequeue(): Removed ${val} from [${circularFront}].`);
        }
    };

    const handleCircularReset = () => {
        setCircularSlots([12, 24, 36, null, null, null, null, null]);
        setCircularFront(0);
        setCircularRear(2);
        addLog('Reset Circular Queue.');
    };

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 4 STATE: TOPIC 4.1 SIMPLE RECURSION (CALL STACK & FLOW)
    // ═════════════════════════════════════════════════════════════════════════
    const [recursionAlgo, setRecursionAlgo] = useState('factorial'); // 'factorial' | 'sumN' | 'power2'
    const [recursionN, setRecursionN] = useState(4);
    const [recursionStepIdx, setRecursionStepIdx] = useState(0);
    const [recursionIsPlaying, setRecursionIsPlaying] = useState(false);
    const [recursionSpeed, setRecursionSpeed] = useState(800);
    const [recursionView, setRecursionView] = useState('dual'); // 'dual' | 'stack' | 'flow'

    const recursionSteps = useMemo(
        () => generateSimpleRecursionSteps(recursionAlgo, recursionN),
        [recursionAlgo, recursionN]
    );
    const currentRecursionStep = recursionSteps[recursionStepIdx] || recursionSteps[0];

    useEffect(() => {
        let timer;
        if (recursionIsPlaying) {
            timer = setInterval(() => {
                setRecursionStepIdx(prev => {
                    if (prev < recursionSteps.length - 1) return prev + 1;
                    setRecursionIsPlaying(false);
                    return prev;
                });
            }, recursionSpeed);
        }
        return () => clearInterval(timer);
    }, [recursionIsPlaying, recursionSteps, recursionSpeed]);

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 4 STATE: TOPIC 4.2 FIBONACCI RECURRENCE, MEMOIZATION & TABULATION
    // ═════════════════════════════════════════════════════════════════════════
    const [fibN, setFibN] = useState(4);
    const [fibMode, setFibMode] = useState('memo'); // 'naive' | 'memo' | 'tabulation'
    const [fibStepIdx, setFibStepIdx] = useState(0);
    const [fibIsPlaying, setFibIsPlaying] = useState(false);
    const [fibSpeed, setFibSpeed] = useState(750);
    const [fibHoverNodeId, setFibHoverNodeId] = useState(null);

    const fibData = useMemo(() => generateFibTreeAndTrace(fibN, fibMode), [fibN, fibMode]);
    const currentFibStep = fibData.steps[fibStepIdx] || fibData.steps[0];

    useEffect(() => {
        let timer;
        if (fibIsPlaying) {
            timer = setInterval(() => {
                setFibStepIdx(prev => {
                    if (prev < fibData.steps.length - 1) return prev + 1;
                    setFibIsPlaying(false);
                    return prev;
                });
            }, fibSpeed);
        }
        return () => clearInterval(timer);
    }, [fibIsPlaying, fibData.steps, fibSpeed]);

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 4 STATE: TOPIC 4.3 0/1 KNAPSACK DP (visualizedsa.com/visualizers/knapsack)
    // ═════════════════════════════════════════════════════════════════════════
    const [knapsackCapacity, setKnapsackCapacity] = useState(8);
    const [knapsackItems, setKnapsackItems] = useState([
        { id: 1, weight: 3, value: 4 },
        { id: 2, weight: 4, value: 5 },
        { id: 3, weight: 2, value: 3 },
        { id: 4, weight: 1, value: 2 }
    ]);
    const [knapsackStepIdx, setKnapsackStepIdx] = useState(0);
    const [knapsackIsPlaying, setKnapsackIsPlaying] = useState(false);
    const [knapsackSpeed, setKnapsackSpeed] = useState(700);

    const knapsackSteps = useMemo(() => {
        return generateKnapsackSteps(knapsackItems, knapsackCapacity);
    }, [knapsackItems, knapsackCapacity]);

    const currentKnapsackFrame = knapsackSteps[knapsackStepIdx] || knapsackSteps[0];

    useEffect(() => {
        let timer;
        if (knapsackIsPlaying) {
            timer = setInterval(() => {
                setKnapsackStepIdx(prev => {
                    if (prev < knapsackSteps.length - 1) return prev + 1;
                    setKnapsackIsPlaying(false);
                    return prev;
                });
            }, knapsackSpeed);
        }
        return () => clearInterval(timer);
    }, [knapsackIsPlaying, knapsackSteps, knapsackSpeed]);

    const handleKnapsackStepNext = () => {
        if (knapsackStepIdx < knapsackSteps.length - 1) {
            const nextIdx = knapsackStepIdx + 1;
            setKnapsackStepIdx(nextIdx);
            addLog(`Knapsack Step ${nextIdx}: ${knapsackSteps[nextIdx].note}`);
        } else {
            setKnapsackIsPlaying(false);
        }
    };

    const handleKnapsackStepPrev = () => {
        if (knapsackStepIdx > 0) setKnapsackStepIdx(knapsackStepIdx - 1);
    };

    const handleKnapsackReset = () => {
        setKnapsackStepIdx(0);
        setKnapsackIsPlaying(false);
        addLog('Reset 0/1 Knapsack DP table to initial base cases.');
    };

    const handleKnapsackPreset = (presetItems, presetCap) => {
        setKnapsackItems(presetItems);
        setKnapsackCapacity(presetCap);
        setKnapsackStepIdx(0);
        setKnapsackIsPlaying(false);
        addLog(`Applied Preset: ${presetItems.length} items, Capacity W = ${presetCap}.`);
    };

    const handleKnapsackUpdateWeight = (idx, newWt) => {
        const wt = Math.max(1, Math.min(15, Number(newWt) || 1));
        const updated = knapsackItems.map((it, i) => i === idx ? { ...it, weight: wt } : it);
        setKnapsackItems(updated);
        setKnapsackStepIdx(0);
        setKnapsackIsPlaying(false);
    };

    const handleKnapsackUpdateValue = (idx, newVal) => {
        const val = Math.max(1, Math.min(50, Number(newVal) || 1));
        const updated = knapsackItems.map((it, i) => i === idx ? { ...it, value: val } : it);
        setKnapsackItems(updated);
        setKnapsackStepIdx(0);
        setKnapsackIsPlaying(false);
    };

    const handleKnapsackAddItem = () => {
        if (knapsackItems.length >= 6) {
            addLog('Knapsack limits: maximum 6 items supported.');
            return;
        }
        const newWeight = Math.floor(Math.random() * 4) + 1;
        const newValue = Math.floor(Math.random() * 8) + 2;
        setKnapsackItems(prev => [...prev, { id: Date.now(), weight: newWeight, value: newValue }]);
        setKnapsackStepIdx(0);
        setKnapsackIsPlaying(false);
        addLog(`Added Item ${knapsackItems.length + 1} (w=${newWeight}, v=${newValue}).`);
    };

    const handleKnapsackDeleteItem = (idx) => {
        if (knapsackItems.length <= 1) return;
        setKnapsackItems(prev => prev.filter((_, i) => i !== idx));
        setKnapsackStepIdx(0);
        setKnapsackIsPlaying(false);
        addLog(`Removed item #${idx + 1}.`);
    };

    const handleKnapsackRandomize = () => {
        const count = Math.floor(Math.random() * 2) + 3;
        const randomItems = Array.from({ length: count }, (_, i) => ({
            id: Date.now() + i,
            weight: Math.floor(Math.random() * 4) + 1,
            value: Math.floor(Math.random() * 9) + 2
        }));
        const randomCap = Math.floor(Math.random() * 4) + 6;
        setKnapsackItems(randomItems);
        setKnapsackCapacity(randomCap);
        setKnapsackStepIdx(0);
        setKnapsackIsPlaying(false);
        addLog(`Randomized Knapsack: ${count} items, Capacity W = ${randomCap}.`);
    };

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 5 STATE: SEARCHING ALGORITHMS (Topic 5.1 Linear, 5.2 Binary, 5.3 Quickselect)
    // ═════════════════════════════════════════════════════════════════════════
    const [searchArr, setSearchArr] = useState([12, 18, 23, 33, 42, 54, 67, 85]);
    const [searchTargetInput, setSearchTargetInput] = useState('42');
    const [searchTarget, setSearchTarget] = useState(42);
    const [searchK, setSearchK] = useState(3);
    const [searchStepIdx, setSearchStepIdx] = useState(0);
    const [searchIsPlaying, setSearchIsPlaying] = useState(false);
    const [searchSpeed, setSearchSpeed] = useState(750);

    const activeSearchAlgo = useMemo(() => {
        if (selectedTopicId === 1) return 'linear';
        if (selectedTopicId === 3) return 'quickselect';
        return 'binary';
    }, [selectedTopicId]);

    const searchSteps = useMemo(() => {
        return generateSearchingSteps(activeSearchAlgo, searchArr, searchTarget, searchK);
    }, [activeSearchAlgo, searchArr, searchTarget, searchK]);

    const currentSearchStep = searchSteps[searchStepIdx] || searchSteps[0];

    useEffect(() => {
        let timer;
        if (searchIsPlaying) {
            timer = setInterval(() => {
                setSearchStepIdx(prev => {
                    if (prev < searchSteps.length - 1) return prev + 1;
                    setSearchIsPlaying(false);
                    return prev;
                });
            }, searchSpeed);
        }
        return () => clearInterval(timer);
    }, [searchIsPlaying, searchSteps, searchSpeed]);

    const handleRandomizeSearchArray = (size = 8) => {
        const set = new Set();
        while (set.size < size) {
            set.add(Math.floor(Math.random() * 85) + 12);
        }
        let generated = Array.from(set);
        if (activeSearchAlgo === 'binary') generated.sort((a, b) => a - b);
        setSearchArr(generated);
        // Default target to a random element from the newly generated array
        const randomTarget = generated[Math.floor(Math.random() * generated.length)];
        setSearchTarget(randomTarget);
        setSearchTargetInput(randomTarget.toString());
        setSearchStepIdx(0);
        setSearchIsPlaying(false);
        addLog(`Randomized ${activeSearchAlgo} array: [${generated.join(', ')}] with target ${randomTarget}`);
    };

    const handlePickRandomTarget = () => {
        if (!searchArr || searchArr.length === 0) return;
        const randomTarget = searchArr[Math.floor(Math.random() * searchArr.length)];
        setSearchTarget(randomTarget);
        setSearchTargetInput(randomTarget.toString());
        setSearchStepIdx(0);
        setSearchIsPlaying(false);
        addLog(`Selected target present in array: ${randomTarget} (guaranteed match)`);
    };

    const handlePickMissTarget = () => {
        let missTarget = 99;
        while (searchArr.includes(missTarget)) {
            missTarget += 7;
        }
        setSearchTarget(missTarget);
        setSearchTargetInput(missTarget.toString());
        setSearchStepIdx(0);
        setSearchIsPlaying(false);
        addLog(`Selected target NOT in array: ${missTarget} (testing not-found / worst case)`);
    };

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 6 STATE: SORTING ALGORITHMS (Topic 6.1 Selection, 6.2 Insertion, 6.3 Merge, 6.4 Quick)
    // ═════════════════════════════════════════════════════════════════════════
    const [sortArr, setSortArr] = useState([42, 18, 85, 12, 67, 33, 54]);
    const [sortStepIdx, setSortStepIdx] = useState(0);
    const [sortIsPlaying, setSortIsPlaying] = useState(false);
    const [sortSpeed, setSortSpeed] = useState(650);

    const activeSortAlgo = useMemo(() => {
        if (selectedTopicId === 1) return 'bubble';
        if (selectedTopicId === 2) return 'selection';
        if (selectedTopicId === 3) return 'insertion';
        if (selectedTopicId === 4) return 'merge';
        if (selectedTopicId === 5) return 'quick';
        if (selectedTopicId === 6) return 'heap';
        if (selectedTopicId === 7) return 'counting';
        return 'bubble';
    }, [selectedTopicId]);

    const sortSteps = useMemo(() => {
        return generateSortingSteps(activeSortAlgo, sortArr);
    }, [activeSortAlgo, sortArr]);

    const currentSortStep = sortSteps[sortStepIdx] || sortSteps[0];

    useEffect(() => {
        let timer;
        if (sortIsPlaying) {
            timer = setInterval(() => {
                setSortStepIdx(prev => {
                    if (prev < sortSteps.length - 1) return prev + 1;
                    setSortIsPlaying(false);
                    return prev;
                });
            }, sortSpeed);
        }
        return () => clearInterval(timer);
    }, [sortIsPlaying, sortSteps, sortSpeed]);

    const handleSortArrayPreset = (type, size = 8) => {
        let generated;
        if (activeSortAlgo === 'counting') {
            if (type === 'reversed') generated = [9, 8, 7, 6, 5, 4, 3, 2];
            else if (type === 'nearly') generated = [1, 2, 3, 5, 4, 6, 7, 9];
            else if (type === 'few-unique') generated = [3, 7, 3, 9, 7, 3, 9, 3];
            else generated = Array.from({ length: size }, () => Math.floor(Math.random() * 8) + 1);
        } else {
            if (type === 'reversed') {
                generated = [88, 74, 63, 51, 42, 33, 25, 14].slice(0, size);
            } else if (type === 'nearly') {
                generated = [12, 19, 28, 42, 33, 58, 71, 85].slice(0, size);
            } else if (type === 'few-unique') {
                generated = [25, 68, 25, 85, 68, 25, 85, 68].slice(0, size);
            } else {
                generated = Array.from({ length: size }, () => Math.floor(Math.random() * 85) + 12);
            }
        }
        setSortArr(generated);
        setSortStepIdx(0);
        setSortIsPlaying(false);
        addLog(`Loaded ${type} preset for ${activeSortAlgo} sort: [${generated.join(', ')}]`);
    };

    const handleSortArrayReset = () => {
        handleSortArrayPreset('random', 8);
    };

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 7 STATE: GRAPH THEORY & TREES (visualizedsa.com/visualizers/dijkstra)
    // ═════════════════════════════════════════════════════════════════════════
    const [graphPresetKey, setGraphPresetKey] = useState('standard');
    const [graphData, setGraphData] = useState(GRAPH_PRESETS.standard);
    const [graphStartNode, setGraphStartNode] = useState('A');
    const [graphStepIdx, setGraphStepIdx] = useState(0);
    const [graphIsPlaying, setGraphIsPlaying] = useState(false);
    const [graphSpeed, setGraphSpeed] = useState(900);
    const [graphTraversalMode, setGraphTraversalMode] = useState('bfs'); // 'bfs' | 'dfs'
    const [graphViewMode, setGraphViewMode] = useState('matrix'); // 'matrix' | 'list'

    // Determine active algorithm for Module 7:
    const activeGraphAlgo = useMemo(() => {
        if (selectedTopicId === 10) return 'dijkstra';
        if (selectedTopicId === 13) return graphTraversalMode;
        if (selectedTopicId === 9) return 'kruskal';
        if (selectedTopicId === 12) return 'floyd';
        if (selectedTopicId === 1) return 'adj';
        if (selectedTopicId === 6) return 'bst';
        return 'dijkstra';
    }, [selectedTopicId, graphTraversalMode]);

    const graphSteps = useMemo(() => {
        if (activeGraphAlgo === 'dijkstra') {
            return generateDijkstraSteps(graphData.nodes, graphData.edges, graphStartNode);
        }
        if (activeGraphAlgo === 'bfs') {
            return generateBFSSteps(graphData.nodes, graphData.edges, graphStartNode);
        }
        if (activeGraphAlgo === 'dfs') {
            return generateDFSSteps(graphData.nodes, graphData.edges, graphStartNode);
        }
        if (activeGraphAlgo === 'kruskal') {
            return generateKruskalSteps(graphData.nodes, graphData.edges);
        }
        if (activeGraphAlgo === 'floyd') {
            return generateFloydWarshallSteps(graphData.nodes, graphData.edges);
        }
        return generateDijkstraSteps(graphData.nodes, graphData.edges, graphStartNode);
    }, [activeGraphAlgo, graphData, graphStartNode]);

    const currentGraphStep = graphSteps[graphStepIdx] || graphSteps[0] || {};

    // Auto-advance playback for graph algorithm steps
    useEffect(() => {
        let timer;
        if (graphIsPlaying && graphSteps.length > 0) {
            timer = setInterval(() => {
                setGraphStepIdx(prev => {
                    if (prev < graphSteps.length - 1) return prev + 1;
                    setGraphIsPlaying(false);
                    return prev;
                });
            }, graphSpeed);
        }
        return () => clearInterval(timer);
    }, [graphIsPlaying, graphSteps, graphSpeed]);

    const handleGraphPresetChange = (key) => {
        const preset = GRAPH_PRESETS[key] || GRAPH_PRESETS.standard;
        setGraphPresetKey(key);
        setGraphData(preset);
        setGraphStepIdx(0);
        setGraphIsPlaying(false);
        addLog(`Loaded ${preset.name} preset for ${activeGraphAlgo.toUpperCase()}.`);
    };

    const handleRandomizeGraphWeights = () => {
        const randomized = graphData.edges.map(e => ({
            ...e,
            weight: Math.floor(Math.random() * 9) + 1
        }));
        setGraphData(prev => ({ ...prev, edges: randomized }));
        setGraphStepIdx(0);
        setGraphIsPlaying(false);
        addLog('Randomized graph edge weights for interactive exploration.');
    };

    const handleSelectGraphStartNode = (nodeId) => {
        setGraphStartNode(nodeId);
        setGraphStepIdx(0);
        setGraphIsPlaying(false);
        addLog(`Set source vertex to '${nodeId}'. Re-running ${activeGraphAlgo.toUpperCase()}.`);
    };

    // ── BST Specific State & Handlers (Topic 7.6) ──
    const [bstNodes, setBstNodes] = useState([50, 30, 70, 20, 40, 60, 80]);
    const [bstKeyInput, setBstKeyInput] = useState('');
    const [bstSearchActive, setBstSearchActive] = useState(null);
    const [bstTraverseOutput, setBstTraverseOutput] = useState([]);
    const [bstTraverseMode, setBstTraverseMode] = useState(null);

    const bstTreeLayout = useMemo(() => {
        return buildBSTTreeLayout(bstNodes);
    }, [bstNodes]);

    const handleInsertBST = () => {
        const key = bstKeyInput !== '' ? Number(bstKeyInput) : Math.floor(Math.random() * 90) + 10;
        setBstKeyInput('');
        if (bstNodes.includes(key)) {
            addLog(`Key ${key} already exists in BST (no duplicate keys allowed).`);
            return;
        }
        setBstNodes(prev => [...prev, key]);
        addLog(`bstInsert(${key}): Placed node preserving invariant left < root < right.`);
    };

    const handleSearchBST = () => {
        const target = bstKeyInput !== '' ? Number(bstKeyInput) : bstNodes[Math.floor(Math.random() * bstNodes.length)];
        setBstKeyInput('');
        setBstSearchActive(target);
        addLog(`bstSearch(${target}): Traversed down tree branches in O(h) height time.`);
        setTimeout(() => setBstSearchActive(null), 1800);
    };

    const handleTraverseBST = (mode) => {
        setBstTraverseMode(mode);
        let rootNode = null;
        function insert(r, val) {
            if (!r) return { key: val, left: null, right: null };
            if (val < r.key) r.left = insert(r.left, val);
            else if (val > r.key) r.right = insert(r.right, val);
            return r;
        }
        bstNodes.forEach(k => { rootNode = insert(rootNode, k); });

        const result = [];
        function inorder(node) {
            if (!node) return;
            inorder(node.left);
            result.push(node.key);
            inorder(node.right);
        }
        function preorder(node) {
            if (!node) return;
            result.push(node.key);
            preorder(node.left);
            preorder(node.right);
        }
        function postorder(node) {
            if (!node) return;
            postorder(node.left);
            postorder(node.right);
            result.push(node.key);
        }

        if (mode === 'inorder') inorder(rootNode);
        else if (mode === 'preorder') preorder(rootNode);
        else postorder(rootNode);

        setBstTraverseOutput(result);
        addLog(`BST ${mode.toUpperCase()} traversal: [${result.join(', ')}].`);
    };

    const handleResetBST = (preset = 'balanced') => {
        if (preset === 'balanced') setBstNodes([50, 30, 70, 20, 40, 60, 80]);
        else if (preset === 'skewed') setBstNodes([10, 20, 30, 40, 50]);
        else setBstNodes([45, 15, 75, 10, 35, 60, 95]);
        setBstTraverseOutput([]);
        setBstTraverseMode(null);
        addLog(`Reset BST to ${preset} preset.`);
    };

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 8 STATE: HASHING (Separate Chaining & Perfect Hashing)
    // ═════════════════════════════════════════════════════════════════════════
    const [hashTableM, setHashTableM] = useState(8);
    const [hashMethod, setHashMethod] = useState('division'); // 'division' | 'multiplication' | 'midsquare'
    const [hashTable, setHashTable] = useState([
        [16, 24], [33], [], [19, 43], [28], [13, 61], [], [39]
    ]);
    const [hashKeyInput, setHashKeyInput] = useState('');
    const [hashActiveBucket, setHashActiveBucket] = useState(null);
    const [hashActiveKey, setHashActiveKey] = useState(null);
    const [hashSearchStatus, setHashSearchStatus] = useState(null); // 'found' | 'not_found' | 'deleted' | 'inserted'
    const [hashExplanation, setHashExplanation] = useState('Ready for hashing operation. Enter key to insert, search, or delete.');

    // Computed metrics for Chaining
    const hashTotalElements = useMemo(() => {
        return hashTable.reduce((acc, bucket) => acc + bucket.length, 0);
    }, [hashTable]);

    const hashLoadFactor = useMemo(() => {
        return (hashTotalElements / hashTableM).toFixed(2);
    }, [hashTotalElements, hashTableM]);

    const hashCollisions = useMemo(() => {
        return hashTable.reduce((acc, b) => acc + Math.max(0, b.length - 1), 0);
    }, [hashTable]);

    const hashMaxChainLength = useMemo(() => {
        return Math.max(0, ...hashTable.map(b => b.length));
    }, [hashTable]);

    const handleHashInsert = () => {
        const key = hashKeyInput !== '' ? Number(hashKeyInput) : Math.floor(Math.random() * 90) + 10;
        setHashKeyInput('');
        const bucket = computeHash(key, hashTableM, hashMethod);
        setHashActiveBucket(bucket);
        setHashActiveKey(key);
        setHashSearchStatus('inserted');

        const updated = hashTable.map((b, idx) => {
            if (idx === bucket) {
                if (b.includes(key)) return b;
                return [...b, key];
            }
            return b;
        });
        setHashTable(updated);

        const formulaText = hashMethod === 'division' 
            ? `h(${key}) = ${key} % ${hashTableM} = ${bucket}`
            : hashMethod === 'multiplication'
            ? `h(${key}) = ⌊${hashTableM} × ((${key} × 0.618) mod 1)⌋ = ${bucket}`
            : `h(${key}) = midSquare(${key}) % ${hashTableM} = ${bucket}`;

        const isCollision = hashTable[bucket].length > 0;
        setHashExplanation(`${formulaText}. Placed into Bucket [${bucket}] ${isCollision ? '(Collision resolved by appending to chain!)' : '(New chain head)'}.`);
        addLog(`hashInsert(${key}): Mapped to bucket [${bucket}]. Chain length now ${updated[bucket].length}.`);

        setTimeout(() => {
            setHashActiveBucket(null);
            setHashActiveKey(null);
            setHashSearchStatus(null);
        }, 1800);
    };

    const handleHashSearch = () => {
        const key = hashKeyInput !== '' ? Number(hashKeyInput) : 19;
        setHashKeyInput('');
        const bucket = computeHash(key, hashTableM, hashMethod);
        setHashActiveBucket(bucket);
        setHashActiveKey(key);

        const found = hashTable[bucket].includes(key);
        setHashSearchStatus(found ? 'found' : 'not_found');

        const formulaText = `h(${key}) = ${key} % ${hashTableM} = ${bucket}`;
        if (found) {
            const pos = hashTable[bucket].indexOf(key);
            setHashExplanation(`${formulaText}. Traversed chain at Bucket [${bucket}] → Located key ${key} at position #${pos + 1}!`);
            addLog(`hashSearch(${key}): Found in Bucket [${bucket}] at index ${pos}. O(k) chain scan time.`);
        } else {
            setHashExplanation(`${formulaText}. Inspected Bucket [${bucket}] (length: ${hashTable[bucket].length}) → Reached NULL, key ${key} not in table.`);
            addLog(`hashSearch(${key}): Not found in Bucket [${bucket}].`);
        }

        setTimeout(() => {
            setHashActiveBucket(null);
            setHashActiveKey(null);
            setHashSearchStatus(null);
        }, 2000);
    };

    const handleHashDelete = () => {
        const key = hashKeyInput !== '' ? Number(hashKeyInput) : (hashTable.flat()[0] || 16);
        setHashKeyInput('');
        const bucket = computeHash(key, hashTableM, hashMethod);
        setHashActiveBucket(bucket);
        setHashActiveKey(key);

        if (hashTable[bucket].includes(key)) {
            setHashSearchStatus('deleted');
            const updated = hashTable.map((b, idx) => idx === bucket ? b.filter(item => item !== key) : b);
            setHashTable(updated);
            setHashExplanation(`Deleted key ${key} from Bucket [${bucket}]. Relinked chain pointers.`);
            addLog(`hashDelete(${key}): Removed from Bucket [${bucket}].`);
        } else {
            setHashSearchStatus('not_found');
            setHashExplanation(`Key ${key} does not exist in Bucket [${bucket}].`);
            addLog(`hashDelete(${key}): Key not found.`);
        }

        setTimeout(() => {
            setHashActiveBucket(null);
            setHashActiveKey(null);
            setHashSearchStatus(null);
        }, 1800);
    };

    const handleHashPreset = (presetKey) => {
        if (presetKey === 'balanced') {
            setHashTableM(8);
            setHashTable([[10, 18], [25], [12], [27], [], [21, 37], [14], [31]]);
            setHashExplanation('Loaded Balanced Preset (8 elements, low collision rate, α = 1.00).');
            addLog('Loaded Balanced Hash Table preset.');
        } else if (presetKey === 'cluster') {
            setHashTableM(8);
            setHashTable([[], [9, 17, 25, 33, 41], [], [], [], [], [], []]);
            setHashExplanation('Loaded Worst-Case Collision Cluster (keys sharing same remainder 1, chain length 5).');
            addLog('Loaded High-Collision Cluster preset.');
        } else if (presetKey === 'prime') {
            setHashTableM(7);
            setHashTable([[14, 28], [15], [], [17, 31], [], [19], [20]]);
            setHashExplanation('Loaded Prime Modulo Table (m = 7, optimal uniform division distribution).');
            addLog('Loaded Prime Modulo table (m = 7).');
        } else if (presetKey === 'clear') {
            setHashTable(Array.from({ length: hashTableM }, () => []));
            setHashExplanation('Cleared all buckets in hash table.');
            addLog('Cleared hash table.');
        }
    };

    const handleTableSizeChange = (newM) => {
        const allKeys = hashTable.flat();
        const newTable = Array.from({ length: newM }, () => []);
        allKeys.forEach(k => {
            const b = computeHash(k, newM, hashMethod);
            newTable[b].push(k);
        });
        setHashTableM(newM);
        setHashTable(newTable);
        setHashExplanation(`Resized table to m = ${newM}. Rehashed all ${allKeys.length} keys.`);
        addLog(`Resized hash table to m = ${newM} and rehashed keys.`);
    };

    // ── TOPIC 8.2: PERFECT HASHING STATE & HANDLERS ──
    const [perfectPresetKey, setPerfectPresetKey] = useState('dictionary');
    const [perfectKeys, setPerfectKeys] = useState([10, 22, 37, 40, 52, 60, 75]);
    const [perfectSearchInput, setPerfectSearchInput] = useState('');
    const [perfectSearchActive, setPerfectSearchActive] = useState(null);
    const [perfectSearchResult, setPerfectSearchResult] = useState(null);

    const perfectModel = useMemo(() => {
        return buildPerfectHashTable(perfectKeys, 7);
    }, [perfectKeys]);

    const handlePerfectSearch = () => {
        const target = perfectSearchInput !== '' ? Number(perfectSearchInput) : perfectKeys[Math.floor(Math.random() * perfectKeys.length)];
        setPerfectSearchInput('');

        const p = perfectModel.p;
        const h1 = ((perfectModel.a * target + perfectModel.b) % p) % perfectModel.m;
        const sub = perfectModel.secondaryTables[h1];
        let found = false;
        let h2 = -1;

        if (sub && sub.m_j > 0) {
            h2 = ((sub.a_j * target + sub.b_j) % p) % sub.m_j;
            found = sub.table[h2] === target;
        }

        setPerfectSearchActive({ target, h1, h2, found });
        setPerfectSearchResult({ target, h1, h2, found });
        addLog(`perfectLookup(${target}): Level-1 bucket [${h1}], Level-2 slot [${h2}]. ${found ? 'MATCH! Verified in O(1) worst-case time' : 'NOT FOUND (0 collisions guaranteed)'}.`);

        setTimeout(() => {
            setPerfectSearchActive(null);
        }, 2200);
    };

    const handlePerfectPreset = (type) => {
        setPerfectPresetKey(type);
        if (type === 'dictionary') {
            setPerfectKeys([10, 22, 37, 40, 52, 60, 75]);
            addLog('Loaded standard static dictionary keys for Perfect Hashing.');
        } else if (type === 'keywords') {
            setPerfectKeys([14, 28, 35, 49, 63, 77, 84]);
            addLog('Loaded structured keyword integer codes for Perfect Hashing.');
        } else {
            setPerfectKeys([12, 23, 34, 45, 56, 67, 78]);
            addLog('Loaded sequential sample keys.');
        }
        setPerfectSearchResult(null);
    };

    // ═════════════════════════════════════════════════════════════════════════
    // MODULE 9 STATE: STRING ALGORITHMS (Rabin-Karp & String Manipulations)
    // ═════════════════════════════════════════════════════════════════════════
    // 9.1 Simple String Manipulations (In-Place Two-Pointer)
    const [strInput, setStrInput] = useState('RACECAR');
    const [strOpMode, setStrOpMode] = useState('reverse'); // 'reverse' | 'palindrome' | 'case'
    const [strBuffer, setStrBuffer] = useState(['R', 'A', 'C', 'E', 'C', 'A', 'R']);
    const [strLeftPtr, setStrLeftPtr] = useState(0);
    const [strRightPtr, setStrRightPtr] = useState(6);
    const [strManipStatus, setStrManipStatus] = useState('Ready for string manipulation.');

    // 9.2 Rabin-Karp Rolling Hash Substring Search
    const [rkText, setRkText] = useState('AABAACAADAABAABA');
    const [rkPattern, setRkPattern] = useState('AABA');
    const [rkD, setRkD] = useState(256);
    const [rkQ, setRkQ] = useState(101);
    const [rkStepIdx, setRkStepIdx] = useState(0);
    const [rkIsPlaying, setRkIsPlaying] = useState(false);
    const [rkSpeed, setRkSpeed] = useState(900);

    const rkSteps = useMemo(() => {
        return generateRabinKarpSteps(rkText, rkPattern, rkD, rkQ);
    }, [rkText, rkPattern, rkD, rkQ]);

    const currentRkStep = rkSteps[rkStepIdx] || rkSteps[0] || {};

    // Auto-advance playback for Rabin-Karp
    useEffect(() => {
        let timer;
        if (rkIsPlaying && rkSteps.length > 0) {
            timer = setInterval(() => {
                setRkStepIdx(prev => {
                    if (prev < rkSteps.length - 1) return prev + 1;
                    setRkIsPlaying(false);
                    return prev;
                });
            }, rkSpeed);
        }
        return () => clearInterval(timer);
    }, [rkIsPlaying, rkSteps, rkSpeed]);

    const handleRkPreset = (type) => {
        if (type === 'standard') {
            setRkText('AABAACAADAABAABA');
            setRkPattern('AABA');
            setRkStepIdx(0);
            setRkIsPlaying(false);
            addLog('Loaded Standard Rabin-Karp text and pattern.');
        } else if (type === 'words') {
            setRkText('CATBATRATMAT');
            setRkPattern('BAT');
            setRkStepIdx(0);
            setRkIsPlaying(false);
            addLog('Loaded Word Search dataset for Rabin-Karp.');
        } else if (type === 'dna') {
            setRkText('CGATATATCGACGAT');
            setRkPattern('ATAT');
            setRkStepIdx(0);
            setRkIsPlaying(false);
            addLog('Loaded DNA sequence dataset for Rabin-Karp.');
        }
    };

    const handleStringOpRun = (op) => {
        setStrOpMode(op);
        const chars = strInput.split('');
        setStrBuffer([...chars]);
        if (op === 'reverse') {
            const rev = [...chars].reverse();
            setStrBuffer(rev);
            setStrLeftPtr(0);
            setStrRightPtr(chars.length - 1);
            setStrManipStatus(`Reversed in-place: "${rev.join('')}"`);
            addLog(`strrev("${strInput}"): In-place reversal via two pointers.`);
        } else if (op === 'palindrome') {
            const clean = strInput.toLowerCase().replace(/[^a-z0-9]/g, '');
            const isPal = clean === clean.split('').reverse().join('');
            setStrLeftPtr(0);
            setStrRightPtr(clean.length - 1);
            setStrManipStatus(isPal ? `"${strInput}" is a valid PALINDROME!` : `"${strInput}" is NOT a palindrome.`);
            addLog(`isPalindrome("${strInput}"): ${isPal ? 'True' : 'False'}.`);
        } else if (op === 'case') {
            const upper = strInput.toUpperCase();
            setStrBuffer(upper.split(''));
            setStrManipStatus(`Converted to UPPERCASE: "${upper}"`);
            addLog(`toUpperCase("${strInput}"): ASCII transformation.`);
        }
    };

    // ═════════════════════════════════════════════════════════════════════════
    // DYNAMIC MODULE & TOPIC SPECIFIC ANSI C SOURCE CODE & COMPLEXITIES
    // ═════════════════════════════════════════════════════════════════════════
    const codeSnippet = useMemo(() => {
        // Module 2 Codes
        if (activeModuleNumber === 2) {
            if (selectedTopicId === 2) {
                return {
                    title: 'shunting_yard_conversion.c',
                    time: 'O(N) Token Scans & Stack Operations',
                    space: 'O(N) Operator Stack & Postfix Buffer',
                    code: `#include <stdio.h>
#include <string.h>
#include <ctype.h>

int precedence(char op) {
    if (op == '^') return 3;
    if (op == '*' || op == '/') return 2;
    if (op == '+' || op == '-') return 1;
    return 0;
}

// Infix to Postfix Shunting-Yard
void infixToPostfix(char infix[], char postfix[]) {
    char stack[100];
    int top = -1, k = 0;

    for (int i = 0; infix[i]; i++) {
        char c = infix[i];
        if (isalnum(c)) {
            postfix[k++] = c;
        } else if (c == '(') {
            stack[++top] = c;
        } else if (c == ')') {
            while (top >= 0 && stack[top] != '(')
                postfix[k++] = stack[top--];
            top--;
        } else {
            while (top >= 0 && precedence(stack[top]) >= precedence(c))
                postfix[k++] = stack[top--];
            stack[++top] = c;
        }
    }
    while (top >= 0) postfix[k++] = stack[top--];
    postfix[k] = '\\0';
}`
                };
            }
            if (selectedTopicId === 3) {
                return {
                    title: 'postfix_evaluation.c',
                    time: 'O(N) Linear Scan',
                    space: 'O(N) Operand Stack',
                    code: `#include <stdio.h>
#include <ctype.h>

int evaluatePostfix(char exp[]) {
    int stack[100], top = -1;

    for (int i = 0; exp[i]; i++) {
        if (isdigit(exp[i])) {
            stack[++top] = exp[i] - '0';
        } else if (exp[i] != ' ') {
            int val2 = stack[top--];
            int val1 = stack[top--];
            switch (exp[i]) {
                case '+': stack[++top] = val1 + val2; break;
                case '-': stack[++top] = val1 - val2; break;
                case '*': stack[++top] = val1 * val2; break;
                case '/': stack[++top] = val1 / val2; break;
            }
        }
    }
    return stack[top];
}`
                };
            }
            return {
                title: 'module_02_stack_lifo.c',
                time: 'O(1) Push / Pop / Peek',
                space: 'O(N) Stack Array / Linked Nodes',
                code: `#include <stdio.h>
#define MAX 6

typedef struct {
    int items[MAX];
    int top;
} Stack;

void init(Stack *s) { s->top = -1; }
int isFull(Stack *s) { return s->top == MAX - 1; }
int isEmpty(Stack *s) { return s->top == -1; }

void push(Stack *s, int val) {
    if (isFull(s)) return;
    s->items[++(s->top)] = val;
}

int pop(Stack *s) {
    if (isEmpty(s)) return -1;
    return s->items[(s->top)--];
}

int peek(Stack *s) {
    if (isEmpty(s)) return -1;
    return s->items[s->top];
}`
            };
        }

        // Module 3 Codes
        if (activeModuleNumber === 3) {
            if (selectedTopicId === 1) {
                return {
                    title: listType === 'doubly' ? 'doubly_linked_list.c' : 'singly_linked_list.c',
                    time: 'O(1) Head/Tail Ops, O(N) Traversal/Search',
                    space: 'O(N) Dynamic Heap Allocated Nodes',
                    code: listType === 'doubly' ? `#include <stdio.h>
#include <stdlib.h>

typedef struct DNode {
    int data;
    struct DNode *prev;
    struct DNode *next;
} DNode;

DNode* head = NULL;
DNode* tail = NULL;

void insertHead(int val) {
    DNode *n = (DNode*)malloc(sizeof(DNode));
    n->data = val; n->prev = NULL; n->next = head;
    if (head != NULL) head->prev = n;
    else tail = n;
    head = n;
}

void insertTail(int val) {
    DNode *n = (DNode*)malloc(sizeof(DNode));
    n->data = val; n->next = NULL; n->prev = tail;
    if (tail != NULL) tail->next = n;
    else head = n;
    tail = n;
}

void reverse() {
    DNode *curr = head, *temp = NULL;
    while (curr != NULL) {
        temp = curr->prev;
        curr->prev = curr->next;
        curr->next = temp;
        curr = curr->prev;
    }
    if (temp != NULL) head = temp->prev;
}` : `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

Node *head = NULL;

void insertHead(int val) {
    Node *n = (Node*)malloc(sizeof(Node));
    n->data = val; n->next = head;
    head = n;
}

void insertTail(int val) {
    Node *n = (Node*)malloc(sizeof(Node));
    n->data = val; n->next = NULL;
    if (head == NULL) { head = n; return; }
    Node *curr = head;
    while (curr->next != NULL) curr = curr->next;
    curr->next = n;
}

void reverse() {
    Node *prev = NULL, *curr = head, *next = NULL;
    while (curr != NULL) {
        next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    head = prev;
}`
                };
            }
            if (selectedTopicId === 2) {
                return {
                    title: queueMode === 'two-stacks' ? 'queue_using_two_stacks.c' : 'linear_queue.c',
                    time: 'O(1) Enqueue, O(1) Amortized Dequeue',
                    space: 'O(N) Array Buffer / Dual Stack Chambers',
                    code: queueMode === 'two-stacks' ? `#include <stdio.h>
int s1[50], top1 = -1; // Inbox
int s2[50], top2 = -1; // Outbox

void enqueue(int val) {
    s1[++top1] = val; // O(1)
}

int dequeue() {
    if (top1 == -1 && top2 == -1) return -1;
    if (top2 == -1) {
        while (top1 != -1) {
            s2[++top2] = s1[top1--];
        }
    }
    return s2[top2--]; // O(1) amortized
}` : `#include <stdio.h>
#define SIZE 6

int queue[SIZE];
int front = 0, rear = -1;

void enqueue(int val) {
    if (rear == SIZE - 1) return;
    queue[++rear] = val;
}

int dequeue() {
    if (front > rear) return -1;
    return queue[front++];
}`
                };
            }
            return {
                title: 'circular_queue_ring.c',
                time: 'O(1) Enqueue & Dequeue with Modulo Wrapping',
                space: 'O(N) Ring Buffer',
                code: `#include <stdio.h>
#define SIZE 8

int cqueue[SIZE];
int front = -1, rear = -1;

void enqueue(int val) {
    if ((rear + 1) % SIZE == front) return;
    if (front == -1) front = 0;
    rear = (rear + 1) % SIZE;
    cqueue[rear] = val;
}

int dequeue() {
    if (front == -1) return -1;
    int data = cqueue[front];
    if (front == rear) front = rear = -1;
    else front = (front + 1) % SIZE;
    return data;
}`
            };
        }

        // Module 4 Codes: Topic-Specific Scoped Snippets
        if (activeModuleNumber === 4) {
            if (selectedTopicId === 1) {
                if (recursionAlgo === 'sumN') {
                    return {
                        title: 'module_04_simple_recursion_sum.c',
                        time: 'O(n) Linear Call Sequence',
                        space: 'O(n) Activation Frames on Call Stack',
                        code: `#include <stdio.h>

// Simple Recursion: Sum of 1..N Activation Frames
long sumOfN(int n) {
    // 1. Base Case: Terminates recursive expansion
    if (n <= 1) {
        return 1;
    }
    // 2. Recursive Winding: Push frame for sumOfN(n - 1)
    long subResult = sumOfN(n - 1);

    // 3. Unwinding & Combining: Add and return to caller
    return n + subResult;
}

int main() {
    int n = 4;
    printf("Sum(1..%d) = %ld\\n", n, sumOfN(n));
    return 0;
}`
                    };
                }
                if (recursionAlgo === 'power2') {
                    return {
                        title: 'module_04_simple_recursion_pow2.c',
                        time: 'O(n) Linear Call Sequence',
                        space: 'O(n) Activation Frames on Call Stack',
                        code: `#include <stdio.h>

// Simple Recursion: Power of Two (2^n) Activation Frames
long powerOf2(int n) {
    // 1. Base Case: 2^0 = 1
    if (n <= 0) {
        return 1;
    }
    // 2. Recursive Winding: Push frame for powerOf2(n - 1)
    long subResult = powerOf2(n - 1);

    // 3. Unwinding: Multiply 2 * 2^(n-1) and return
    return 2 * subResult;
}

int main() {
    int n = 4;
    printf("2^%d = %ld\\n", n, powerOf2(n));
    return 0;
}`
                    };
                }
                return {
                    title: 'module_04_simple_recursion_fact.c',
                    time: 'O(n) Linear Call Sequence',
                    space: 'O(n) Activation Frames on Call Stack',
                    code: `#include <stdio.h>

// Simple Recursion: Factorial Activation Frames
long factorial(int n) {
    // 1. Base Case (Halts recursive expansion)
    if (n <= 1) {
        return 1;
    }
    // 2. Recursive Step (Winding Stack)
    // Frame for factorial(n-1) pushed above current frame
    long subResult = factorial(n - 1);

    // 3. Unwinding & Combining
    long result = n * subResult;
    return result; // Frame popped from stack, return value passed down
}

int main() {
    int n = 4;
    printf("%d! = %ld\\n", n, factorial(n));
    return 0;
}`
                };
            }
            if (selectedTopicId === 2) {
                if (fibMode === 'naive') {
                    return {
                        title: 'module_04_fibonacci_naive.c',
                        time: 'O(2^n) Exponential Branching Tree',
                        space: 'O(n) Maximum Recursion Depth on Call Stack',
                        code: `#include <stdio.h>

// Naive Binary Recursion: O(2^n) Exponential Explosion
// Warning: Severe duplicate subtree recalculations!
int fib(int n) {
    // Base Cases
    if (n <= 0) return 0;
    if (n == 1) return 1;

    // Recursive Branching: Spawns 2 recursive calls per invocation
    return fib(n - 1) + fib(n - 2);
}

int main() {
    int n = 5;
    printf("fib(%d) = %d\\n", n, fib(n));
    return 0;
}`
                    };
                }
                if (fibMode === 'tabulation') {
                    return {
                        title: 'module_04_fibonacci_tabulation.c',
                        time: 'O(n) Linear Single-Pass Iteration',
                        space: 'O(n) Array Buffer or O(1) with 2 variables',
                        code: `#include <stdio.h>

// Bottom-Up Dynamic Programming (Tabulation): O(n)
// Iteratively fills array from base seeds with 0 recursion overhead!
int fib(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;

    int dp[50];
    dp[0] = 0;
    dp[1] = 1;

    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2]; // O(1) lookup & addition
    }
    return dp[n];
}

int main() {
    int n = 5;
    printf("fib(%d) = %d\\n", n, fib(n));
    return 0;
}`
                    };
                }
                return {
                    title: 'module_04_fibonacci_memo.c',
                    time: 'O(n) Memoized DP - Duplicate Subtrees Pruned',
                    space: 'O(n) Call Stack & Memo Array',
                    code: `#include <stdio.h>

int memo[50] = {0};

// Fibonacci with Top-Down Memoization: O(n)
int fib(int n) {
    // Base Cases
    if (n <= 0) return 0;
    if (n == 1) return 1;

    // Cache lookup: Eliminates exponential duplicate calls!
    if (memo[n] != 0) {
        return memo[n]; // O(1) Cache Hit!
    }

    // Compute & Store in Memoization Buffer
    memo[n] = fib(n - 1) + fib(n - 2);
    return memo[n];
}

int main() {
    int n = 5;
    printf("fib(%d) = %d\\n", n, fib(n));
    return 0;
}`
                };
            }
            // Topic 4.3 Default: Knapsack 0/1 DP
            return {
                title: 'module_04_knapsack_01_dp.c',
                time: 'O(n × W) DP Matrix Iterations & Traceback',
                space: 'O(n × W) 2D Optimal Value Grid',
                code: `#include <stdio.h>
#define MAX(a, b) ((a) > (b) ? (a) : (b))

// 0/1 Knapsack Dynamic Programming with Traceback
void knapsack01(int W, int wt[], int val[], int n) {
    int dp[n + 1][W + 1];

    // 1. Initialize base cases: dp[i][0] = 0, dp[0][w] = 0
    for (int i = 0; i <= n; i++) dp[i][0] = 0;
    for (int w = 0; w <= W; w++) dp[0][w] = 0;

    // 2. Fill DP Table row-by-row
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i - 1] > w) {
                // Must skip item i
                dp[i][w] = dp[i - 1][w];
            } else {
                // Choice: skip vs take
                int skip = dp[i - 1][w];
                int take = val[i - 1] + dp[i - 1][w - wt[i - 1]];
                dp[i][w] = MAX(skip, take);
            }
        }
    }

    // 3. Traceback to recover chosen item subset
    printf("Maximum Achievable Value: %d\\n", dp[n][W]);
    int currW = W;
    for (int i = n; i >= 1; i--) {
        if (dp[i][currW] != dp[i - 1][currW]) {
            printf("Selected Item %d: wt=%d, val=%d\\n",
                   i, wt[i - 1], val[i - 1]);
            currW -= wt[i - 1]; // Decrement capacity
        }
    }
}`
            };
        }

        // Module 5 Codes: Searching Algorithms
        if (activeModuleNumber === 5) {
            if (selectedTopicId === 1) {
                return {
                    title: 'module_05_linear_search.c',
                    time: 'O(1) Best / O(n) Worst Sequential Scan',
                    space: 'O(1) Auxiliary Memory',
                    code: `#include <stdio.h>

// 5.1 Linear Search (Sequential Search)
int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i; // Target found at index i
        }
    }
    return -1; // Target not found
}

int main() {
    int arr[] = {12, 18, 23, 33, 42, 54, 67, 85};
    int n = sizeof(arr)/sizeof(arr[0]);
    int target = 42;
    int idx = linearSearch(arr, n, target);
    printf("Target %d found at index %d\\n", target, idx);
    return 0;
}`
                };
            }
            if (selectedTopicId === 3) {
                return {
                    title: 'module_05_quickselect.c',
                    time: 'O(n) Average / O(n^2) Worst Case',
                    space: 'O(log n) Recursive Call Stack',
                    code: `#include <stdio.h>

int partition(int arr[], int low, int high);

// 5.3 Quickselect: Finding k-th Order Statistic
int quickselect(int arr[], int l, int r, int k) {
    if (k > 0 && k <= r - l + 1) {
        int index = partition(arr, l, r);
        if (index - l == k - 1) return arr[index];
        if (index - l > k - 1) return quickselect(arr, l, index - 1, k);
        return quickselect(arr, index + 1, r, k - index + l - 1);
    }
    return -1;
}

int main() {
    int arr[] = {42, 18, 85, 12, 67, 33, 54};
    int n = sizeof(arr)/sizeof(arr[0]);
    int k = 3; // 3rd smallest element
    printf("%d-th smallest element is %d\\n", k, quickselect(arr, 0, n - 1, k));
    return 0;
}`
                };
            }
            // Topic 5.2 Default: Binary Search
            return {
                title: 'module_05_binary_search.c',
                time: 'O(log n) Divide-and-Conquer Logarithmic',
                space: 'O(1) Iterative Auxiliary Space',
                code: `#include <stdio.h>

// 5.2 Binary Search: Over Sorted Array
int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        // Prevent overflow: low + (high - low)/2
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    int arr[] = {12, 18, 23, 33, 42, 54, 67, 85};
    int n = sizeof(arr)/sizeof(arr[0]);
    int target = 42;
    int idx = binarySearch(arr, n, target);
    printf("Binary search found target at index: %d\\n", idx);
    return 0;
}`
            };
        }

        // Module 6 Codes: Sorting Algorithms (7 Classical Sorts)
        if (activeModuleNumber === 6) {
            // 6.1 Bubble Sort
            if (selectedTopicId === 1 || activeSortAlgo === 'bubble') {
                return {
                    title: 'module_06_bubble_sort.c',
                    time: 'O(n) Best / O(n^2) Average & Worst',
                    space: 'O(1) In-Place Memory',
                    code: `#include <stdio.h>

// 6.1 Bubble Sort: Optimized with Early-Termination Flag
void bubbleSort(int arr[], int n) {
    int i, j, temp;
    for (i = 0; i < n - 1; i++) {
        int swapped = 0;
        for (j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = 1;
            }
        }
        if (!swapped) break; // Array is sorted early!
    }
}

int main() {
    int arr[] = {42, 18, 85, 12, 67, 33, 54};
    int n = sizeof(arr)/sizeof(arr[0]);
    bubbleSort(arr, n);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`
                };
            }
            // 6.2 Selection Sort
            if (selectedTopicId === 2 || activeSortAlgo === 'selection') {
                return {
                    title: 'module_06_selection_sort.c',
                    time: 'O(n^2) All Cases / At most O(n) Swaps',
                    space: 'O(1) In-Place Memory',
                    code: `#include <stdio.h>

// 6.2 Selection Sort: In-Place Minimum Selection
void selectionSort(int arr[], int n) {
    int i, j, minIdx, temp;
    for (i = 0; i < n - 1; i++) {
        minIdx = i;
        for (j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx != i) {
            temp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = temp;
        }
    }
}

int main() {
    int arr[] = {42, 18, 85, 12, 67, 33, 54};
    int n = sizeof(arr)/sizeof(arr[0]);
    selectionSort(arr, n);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`
                };
            }
            // 6.3 Insertion Sort
            if (selectedTopicId === 3 || activeSortAlgo === 'insertion') {
                return {
                    title: 'module_06_insertion_sort.c',
                    time: 'O(n) Best / O(n^2) Worst Case Adaptive',
                    space: 'O(1) In-Place Memory',
                    code: `#include <stdio.h>

// 6.3 Insertion Sort: Adaptive Card Shifting
void insertionSort(int arr[], int n) {
    int i, j, key;
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

int main() {
    int arr[] = {42, 18, 85, 12, 67, 33, 54};
    int n = sizeof(arr)/sizeof(arr[0]);
    insertionSort(arr, n);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`
                };
            }
            // 6.4 Mergesort
            if (selectedTopicId === 4 || activeSortAlgo === 'merge') {
                return {
                    title: 'module_06_mergesort.c',
                    time: 'O(n log n) Guaranteed Across All Cases',
                    space: 'O(n) Auxiliary Buffer Memory',
                    code: `#include <stdio.h>
#include <stdlib.h>

// 6.4 Mergesort: Divide and Conquer
void merge(int arr[], int l, int m, int r) {
    int i, j, k;
    int n1 = m - l + 1, n2 = r - m;
    int *L = (int*)malloc(n1 * sizeof(int));
    int *R = (int*)malloc(n2 * sizeof(int));
    for (i = 0; i < n1; i++) L[i] = arr[l + i];
    for (j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    i = 0; j = 0; k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
    free(L); free(R);
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`
                };
            }
            // 6.5 Quicksort
            if (selectedTopicId === 5 || activeSortAlgo === 'quick') {
                return {
                    title: 'module_06_quicksort.c',
                    time: 'O(n log n) Average / O(n^2) Worst Case',
                    space: 'O(log n) Recursion Stack Space',
                    code: `#include <stdio.h>

// 6.5 Quicksort: Lomuto Partition Scheme
int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int t = arr[i]; arr[i] = arr[j]; arr[j] = t;
        }
    }
    int t = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = t;
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`
                };
            }
            // 6.6 Heapsort
            if (selectedTopicId === 6 || activeSortAlgo === 'heap') {
                return {
                    title: 'module_06_heapsort.c',
                    time: 'O(n log n) Guaranteed In-Place Sort',
                    space: 'O(1) Auxiliary Memory',
                    code: `#include <stdio.h>

// 6.6 Heapsort: In-Place Max-Heap Sorting
void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;

    if (largest != i) {
        int temp = arr[i]; arr[i] = arr[largest]; arr[largest] = temp;
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    int i, temp;
    for (i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (i = n - 1; i > 0; i--) {
        temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
        heapify(arr, i, 0);
    }
}`
                };
            }
            // 6.7 Counting Sort
            return {
                title: 'module_06_counting_sort.c',
                time: 'O(n + k) Linear Non-Comparison Sort',
                space: 'O(k) Frequency & Cumulative Array',
                code: `#include <stdio.h>
#include <string.h>

// 6.7 Counting Sort: Non-Comparison O(n + k) Stable Sort
void countingSort(int arr[], int n) {
    int output[100];
    int count[100] = {0};
    int i, max = arr[0];

    for (i = 1; i < n; i++)
        if (arr[i] > max) max = arr[i];

    for (i = 0; i < n; i++)
        count[arr[i]]++;

    for (i = 1; i <= max; i++)
        count[i] += count[i - 1];

    for (i = n - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }

    for (i = 0; i < n; i++)
        arr[i] = output[i];
}`
            };
        }

        // Module 7: Graph Theory & Tree Dynamic ANSI C Snippets
        if (activeModuleNumber === 7) {
            if (activeGraphAlgo === 'dijkstra') {
                return {
                    title: 'dijkstra_shortest_path.c',
                    time: 'O(V² ) Matrix / O((V + E) log V) Min-Heap',
                    space: 'O(V) Distance & Visited Arrays',
                    code: `#include <stdio.h>
#include <stdbool.h>
#define V 6
#define INF 99999

int minDistance(int dist[], bool sptSet[]) {
    int min = INF, min_index = -1, v;
    for (v = 0; v < V; v++) {
        if (!sptSet[v] && dist[v] <= min) {
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
}

void dijkstra(int graph[V][V], int src) {
    int dist[V], parent[V], i, count, u, v;
    bool sptSet[V];

    for (i = 0; i < V; i++) {
        dist[i] = INF;
        sptSet[i] = false;
        parent[i] = -1;
    }
    dist[src] = 0;

    for (count = 0; count < V - 1; count++) {
        u = minDistance(dist, sptSet);
        if (u == -1) break;
        sptSet[u] = true;

        for (v = 0; v < V; v++) {
            if (!sptSet[v] && graph[u][v] && dist[u] != INF 
                && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
                parent[v] = u;
            }
        }
    }
}`
                };
            }
            if (activeGraphAlgo === 'bfs') {
                return {
                    title: 'graph_bfs_traversal.c',
                    time: 'O(V + E) Level-by-Level Exploration',
                    space: 'O(V) FIFO Queue & Visited Flags',
                    code: `#include <stdio.h>
#include <stdbool.h>
#define V 6

void BFS(int graph[V][V], int start) {
    bool visited[V];
    int queue[V], front = 0, rear = 0, i, u, v;

    for (i = 0; i < V; i++) visited[i] = false;

    visited[start] = true;
    queue[rear++] = start;

    while (front < rear) {
        u = queue[front++];
        printf("%c ", 'A' + u);

        for (v = 0; v < V; v++) {
            if (graph[u][v] && !visited[v]) {
                visited[v] = true;
                queue[rear++] = v;
            }
        }
    }
}`
                };
            }
            if (activeGraphAlgo === 'dfs') {
                return {
                    title: 'graph_dfs_traversal.c',
                    time: 'O(V + E) Depth-First Recursive Scan',
                    space: 'O(V) Call Stack & Visited Flags',
                    code: `#include <stdio.h>
#include <stdbool.h>
#define V 6

void DFSUtil(int graph[V][V], int u, bool visited[]) {
    int v;
    visited[u] = true;
    printf("%c ", 'A' + u);

    for (v = 0; v < V; v++) {
        if (graph[u][v] && !visited[v]) {
            DFSUtil(graph, v, visited);
        }
    }
}

void DFS(int graph[V][V], int start) {
    bool visited[V];
    int i;
    for (i = 0; i < V; i++) visited[i] = false;
    DFSUtil(graph, start, visited);
}`
                };
            }
            if (activeGraphAlgo === 'kruskal') {
                return {
                    title: 'kruskal_mst_dsu.c',
                    time: 'O(E log E) Sorting + O(E α(V)) DSU',
                    space: 'O(V) Parent & Rank Arrays',
                    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Edge {
    int src, dest, weight;
} Edge;

int find(int parent[], int i) {
    if (parent[i] == i) return i;
    return parent[i] = find(parent, parent[i]);
}

void unionSets(int parent[], int rank[], int x, int y) {
    int xroot = find(parent, x);
    int yroot = find(parent, y);
    if (rank[xroot] < rank[yroot]) parent[xroot] = yroot;
    else if (rank[xroot] > rank[yroot]) parent[yroot] = xroot;
    else { parent[yroot] = xroot; rank[xroot]++; }
}

int cmpEdges(const void* a, const void* b) {
    return ((Edge*)a)->weight - ((Edge*)b)->weight;
}`
                };
            }
            if (activeGraphAlgo === 'floyd') {
                return {
                    title: 'floyd_warshall_all_pairs.c',
                    time: 'O(V³) Triply-Nested Dynamic Programming',
                    space: 'O(V²) Distance Matrix',
                    code: `#include <stdio.h>
#define V 6
#define INF 99999

void floydWarshall(int dist[V][V]) {
    int i, j, k;
    for (k = 0; k < V; k++) {
        for (i = 0; i < V; i++) {
            for (j = 0; j < V; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
}`
                };
            }
            if (activeGraphAlgo === 'adj') {
                return {
                    title: 'graph_adjacency_matrix_list.c',
                    time: 'O(1) Edge Lookup vs O(deg(V)) Traversal',
                    space: 'O(V²) Matrix vs O(V + E) Adjacency List',
                    code: `#include <stdio.h>
#include <stdlib.h>
#define V 6

// 1. Adjacency Matrix Representation
int adjMatrix[V][V];

// 2. Adjacency List Node
typedef struct Node {
    int vertex;
    int weight;
    struct Node* next;
} Node;

typedef struct Graph {
    Node* head[V];
} Graph;

void addEdge(Graph* g, int u, int v, int w) {
    Node* n = (Node*)malloc(sizeof(Node));
    n->vertex = v; n->weight = w;
    n->next = g->head[u];
    g->head[u] = n;
}`
                };
            }
            // bst
            return {
                title: 'binary_search_tree.c',
                time: 'O(h) Height BST Insert / Search',
                space: 'O(h) Call Stack Depth',
                code: `#include <stdio.h>
#include <stdlib.h>

typedef struct BSTNode {
    int key;
    struct BSTNode *left, *right;
} BSTNode;

BSTNode* insert(BSTNode *root, int key) {
    if (root == NULL) {
        BSTNode *n = (BSTNode*)malloc(sizeof(BSTNode));
        n->key = key; n->left = n->right = NULL;
        return n;
    }
    if (key < root->key) root->left = insert(root->left, key);
    else if (key > root->key) root->right = insert(root->right, key);
    return root;
}

void inorder(BSTNode *root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->key);
        inorder(root->right);
    }
}`
            };
        }

        // Module 8: Hashing Dynamic ANSI C Snippets (Lab 12 & Perfect Hashing)
        if (activeModuleNumber === 8) {
            if (selectedTopicId === 2) {
                return {
                    title: 'perfect_hashing_fks.c',
                    time: 'O(1) STRICT Worst-Case Lookup (Zero Collision)',
                    space: 'O(N) Total Secondary Space (sum m_j < 2n)',
                    code: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define P 101 // Universal prime > universe size
#define M 7   // Primary table size

typedef struct SecondaryTable {
    int m_j;       // Size = n_j^2 (Guarantees zero collisions)
    int a_j, b_j;  // Universal hash seeds for secondary slot
    int* table;    // Sub-table array of size m_j
} SecondaryTable;

typedef struct PerfectHashTable {
    int a, b;      // Primary universal hash seeds
    SecondaryTable sec[M];
} PerfectHashTable;

// Level 1 Hash: Primary bucket index
int hashLevel1(int key, int a, int b) {
    return (((a * key + b) % P) % M);
}

// Level 2 Hash: Secondary slot index (Zero collision)
int hashLevel2(int key, SecondaryTable* s) {
    if (s->m_j == 0) return -1;
    return (((s->a_j * key + s->b_j) % P) % s->m_j);
}

// STRICT O(1) Worst-Case Lookup: exactly 2 hash computations!
bool perfectLookup(PerfectHashTable* pht, int key) {
    int bucket = hashLevel1(key, pht->a, pht->b);
    SecondaryTable* s = &pht->sec[bucket];
    if (s->m_j == 0) return false;
    int slot = hashLevel2(key, s);
    return (s->table[slot] == key);
}`
                };
            }
            // 8.1 Separate Chaining
            return {
                title: 'hash_table_chaining.c',
                time: 'O(1) Average Lookup / O(n) Worst-Case Chain',
                space: 'O(m + n) Buckets + Dynamically Allocated Nodes',
                code: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#define TABLE_SIZE 8

typedef struct HashNode {
    int key;
    struct HashNode *next;
} HashNode;

HashNode* table[TABLE_SIZE] = {NULL};

// Division Method: h(k) = k mod m
int hash(int key) {
    return key % TABLE_SIZE;
}

// Insert at chain head O(1)
void insert(int key) {
    int idx = hash(key);
    HashNode *node = (HashNode*)malloc(sizeof(HashNode));
    node->key = key;
    node->next = table[idx];
    table[idx] = node;
}

// Linear search down chain O(k)
bool search(int key) {
    int idx = hash(key);
    HashNode *curr = table[idx];
    while (curr != NULL) {
        if (curr->key == key) return true;
        curr = curr->next;
    }
    return false;
}

// Delete key from chain and relink pointers
void deleteKey(int key) {
    int idx = hash(key);
    HashNode *curr = table[idx], *prev = NULL;
    while (curr != NULL && curr->key != key) {
        prev = curr;
        curr = curr->next;
    }
    if (curr == NULL) return; // Key not found
    if (prev == NULL) table[idx] = curr->next;
    else prev->next = curr->next;
    free(curr);
}`
            };
        }

        // Module 9: String Algorithms Dynamic ANSI C Snippets
        if (activeModuleNumber === 9) {
            if (selectedTopicId === 1) {
                return {
                    title: 'string_manipulations.c',
                    time: 'O(N) In-Place Two-Pointer Scans',
                    space: 'O(1) Auxiliary Buffer Swaps',
                    code: `#include <stdio.h>
#include <string.h>
#include <stdbool.h>

// 1. In-place string reversal using two pointers
void strReverse(char str[]) {
    int left = 0;
    int right = strlen(str) - 1;
    char temp;

    while (left < right) {
        temp = str[left];
        str[left] = str[right];
        str[right] = temp;
        left++;
        right--;
    }
}

// 2. In-place palindrome checker
bool isPalindrome(const char str[]) {
    int left = 0;
    int right = strlen(str) - 1;

    while (left < right) {
        if (str[left] != str[right]) return false;
        left++;
        right--;
    }
    return true;
}

// 3. String length calculation (null-byte scan)
int stringLength(const char* s) {
    int len = 0;
    while (*s != '\\0') { len++; s++; }
    return len;
}`
                };
            }
            // 9.2 Rabin-Karp Substring Search
            return {
                title: 'rabin_karp_pattern_search.c',
                time: 'O(N + M) Average / O(N * M) Worst Case',
                space: 'O(1) Rolling Hash Modulo Variables',
                code: `#include <stdio.h>
#include <string.h>
#define d 256  // Number of characters in alphabet
#define q 101  // Prime modulo for rolling hash

void rabinKarp(char pat[], char txt[]) {
    int M = strlen(pat);
    int N = strlen(txt);
    int i, j;
    int p = 0; // Hash value for pattern
    int t = 0; // Hash value for current window
    int h = 1;

    // h = (d^(M-1)) % q
    for (i = 0; i < M - 1; i++)
        h = (h * d) % q;

    // Initial hashes for pattern and window 0
    for (i = 0; i < M; i++) {
        p = (d * p + pat[i]) % q;
        t = (d * t + txt[i]) % q;
    }

    // Slide the pattern over text
    for (i = 0; i <= N - M; i++) {
        // Hash match: verify characters to filter spurious hits
        if (p == t) {
            for (j = 0; j < M; j++) {
                if (txt[i + j] != pat[j]) break;
            }
            if (j == M) printf("Pattern found at index %d\\n", i);
        }

        // Rolling hash update for next window: O(1)
        if (i < N - M) {
            t = (d * (t - txt[i] * h) + txt[i + M]) % q;
            if (t < 0) t = t + q;
        }
    }
}`
            };
        }

        // Module 1, 7, 8, 9 Default Snippets
        const defaults = {
            1: {
                title: 'module_01_algorithm_memory.c',
                time: 'O(1) Allocation / Deallocation',
                space: 'O(N) Heap Segment Block',
                code: `#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main() {
    int *arr = (int*)malloc(4 * sizeof(int));
    int *clean = (int*)calloc(6, sizeof(int));
    int *resized = (int*)realloc(arr, 8 * sizeof(int));
    if (resized != NULL) arr = resized;

    clock_t start = clock();
    clock_t end = clock();
    double cpuTime = (double)(end - start) / CLOCKS_PER_SEC;

    free(arr); free(clean);
    return 0;
}`
            },
            7: {
                title: 'module_07_graph_trees.c',
                time: 'O(h) Height BST / O(V + E) Graph Searches',
                space: 'O(h) Stack / O(V + E) Adjacency List',
                code: `#include <stdio.h>
#include <stdlib.h>

typedef struct BSTNode {
    int key;
    struct BSTNode *left, *right;
} BSTNode;

BSTNode* insert(BSTNode *root, int key) {
    if (root == NULL) {
        BSTNode *n = (BSTNode*)malloc(sizeof(BSTNode));
        n->key = key; n->left = n->right = NULL;
        return n;
    }
    if (key < root->key) root->left = insert(root->left, key);
    else if (key > root->key) root->right = insert(root->right, key);
    return root;
}`
            },
            8: {
                title: 'module_08_hashing.c',
                time: 'O(1) Average Lookup / Insertion',
                space: 'O(N + M) Buckets + Separate Chains',
                code: `#include <stdio.h>
#include <stdlib.h>
#define TABLE_SIZE 8

typedef struct HashNode {
    int key;
    struct HashNode *next;
} HashNode;

HashNode* table[TABLE_SIZE] = {NULL};

int hash(int key) {
    return key % TABLE_SIZE;
}

void insert(int key) {
    int idx = hash(key);
    HashNode *node = (HashNode*)malloc(sizeof(HashNode));
    node->key = key;
    node->next = table[idx];
    table[idx] = node;
}`
            },
            9: {
                title: 'module_09_strings.c',
                time: 'O(N + M) Average Rabin-Karp Match',
                space: 'O(1) Rolling Hash Auxiliary Space',
                code: `#include <stdio.h>
#include <string.h>
#define d 256
#define q 101

void rabinKarp(char pat[], char txt[]) {
    int M = strlen(pat), N = strlen(txt);
    int p = 0, t = 0, h = 1;

    for (int i = 0; i < M - 1; i++) h = (h * d) % q;
    for (int i = 0; i < M; i++) {
        p = (p * d + pat[i]) % q;
        t = (t * d + txt[i]) % q;
    }
}`
            }
        };

        return defaults[activeModuleNumber] || defaults[2];
    }, [activeModuleNumber, selectedTopicId, listType, queueMode]);

    return (
        <div className="space-y-5">
            {/* ── MODULE-SPECIFIC HEADER ───────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
                            <Binary size={19} className="text-blue-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                                    {currentModuleMeta.title} Visualizer
                                </h2>
                                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                    Module {activeModuleNumber} of {Object.keys(MODULE_DEFINITIONS).length}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1">
                                {currentModuleMeta.subtitle}
                            </p>
                        </div>
                    </div>

                    {/* Module-Scoped Sub-Topics Selector */}
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                        {currentModuleMeta.topics.map(t => {
                            const isSelected = selectedTopicId === t.id;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        setSelectedTopicId(t.id);
                                        addLog(`Focused view on ${t.label}.`);
                                    }}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                        isSelected
                                            ? 'bg-slate-900 text-white shadow-xs font-bold ring-2 ring-blue-500/20'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                                    }`}
                                >
                                    <span>{t.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── TWO-COLUMN SPLIT STUDIO ─────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

                {/* ═════════════════════════════════════════════════════════════
                   LEFT COLUMN (5 cols): Clean ANSI C implementation code
                   ═════════════════════════════════════════════════════════════ */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-md overflow-hidden flex flex-col">
                        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 mr-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                                </div>
                                <Terminal size={13} className="text-blue-400" />
                                <span className="font-mono text-xs font-semibold text-slate-200">
                                    {codeSnippet.title}
                                </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                                ANSI C
                            </span>
                        </div>

                        <div className="p-4 font-mono text-xs overflow-x-auto text-slate-300 leading-relaxed max-h-[460px] select-text">
                            <pre>
                                {codeSnippet.code.split('\n').map((line, idx) => (
                                    <div key={idx} className="flex items-start hover:bg-slate-900/60 px-1 rounded transition-colors">
                                        <span className="w-7 text-right pr-3 select-none text-slate-600 text-[11px]">
                                            {idx + 1}
                                        </span>
                                        <span className="flex-1 whitespace-pre">
                                            {line}
                                        </span>
                                    </div>
                                ))}
                            </pre>
                        </div>

                        <div className="px-4 py-3 bg-slate-900/70 border-t border-slate-800 grid grid-cols-2 gap-3 text-[11px]">
                            <div className="flex items-center gap-1.5 text-slate-300">
                                <Clock size={12} className="text-emerald-400 shrink-0" />
                                <span className="text-slate-400">Time:</span>
                                <span className="font-mono font-semibold text-emerald-400 truncate">{codeSnippet.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-300">
                                <Cpu size={12} className="text-blue-400 shrink-0" />
                                <span className="text-slate-400">Space:</span>
                                <span className="font-mono font-semibold text-blue-400 truncate">{codeSnippet.space}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═════════════════════════════════════════════════════════════
                   RIGHT COLUMN (7 cols): Interactive Visual Canvas & Controls
                   ═════════════════════════════════════════════════════════════ */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">

                        {/* MODULE 1: MEMORY, ALGORITHM & ELAPSED TIME */}
                        {activeModuleNumber === 1 && (
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={memInputSize}
                                            onChange={e => setMemInputSize(Math.max(1, Number(e.target.value)))}
                                            className="w-16 px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg"
                                        />
                                        <button onClick={handleAllocateMalloc} className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer">
                                            + malloc()
                                        </button>
                                        <button onClick={handleAllocateCalloc} className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer">
                                            + calloc()
                                        </button>
                                        <button onClick={handleFreeHeap} className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 cursor-pointer">
                                            free()
                                        </button>
                                    </div>
                                    <button onClick={handleMeasureElapsedTime} className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 cursor-pointer">
                                        clock() Profile
                                    </button>
                                </div>

                                <div className="min-h-[240px] bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2">
                                    <span className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                                        Virtual Heap Memory Segment:
                                    </span>
                                    {heapBlocks.length === 0 ? (
                                        <div className="h-28 flex items-center justify-center text-slate-400 font-mono text-xs">
                                            [ Heap Segment Clean - 0 bytes allocated ]
                                        </div>
                                    ) : (
                                        heapBlocks.map(block => (
                                            <div key={block.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between font-mono text-xs shadow-2xs">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${block.type === 'malloc' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                                                        {block.type}
                                                    </span>
                                                    <span className="font-bold text-slate-800">{block.addr}</span>
                                                    <span className="text-slate-400">({block.size})</span>
                                                </div>
                                                <div className="text-slate-600 truncate max-w-[200px]">
                                                    {block.val}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* MODULE 2: STACKS */}
                        {activeModuleNumber === 2 && (
                            <div className="space-y-4">
                                {selectedTopicId === 1 && (
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={stackInput}
                                                    onChange={e => setStackInput(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && handleStackPush()}
                                                    placeholder="Value (e.g. 42)"
                                                    className="w-28 px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button onClick={handleStackPush} className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer">
                                                    Push
                                                </button>
                                                <button onClick={handleStackPop} className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg cursor-pointer">
                                                    Pop
                                                </button>
                                                <button onClick={handleStackPeek} className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer">
                                                    Peek
                                                </button>
                                                <button onClick={handleStackClear} className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 cursor-pointer">
                                                    Clear
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs font-mono">
                                                <span className="text-slate-400">Capacity:</span>
                                                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                                                    {[4, 6, 8].map(cap => (
                                                        <button
                                                            key={cap}
                                                            onClick={() => setStackCapacity(cap)}
                                                            className={`px-2 py-0.5 text-[11px] font-bold ${stackCapacity === cap ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                                                        >
                                                            {cap}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between px-3 py-2 bg-slate-100/70 rounded-xl text-xs font-mono">
                                            <div className="flex items-center gap-3">
                                                <span>top = <strong className="text-blue-600">{stackItems.length - 1}</strong></span>
                                                <span>size = <strong className="text-slate-900">{stackItems.length}</strong> / {stackCapacity}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${stackItems.length === 0 ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-200 text-slate-600'}`}>
                                                    isEmpty(): {stackItems.length === 0 ? 'TRUE' : 'FALSE'}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${stackItems.length >= stackCapacity ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-slate-200 text-slate-600'}`}>
                                                    isFull(): {stackItems.length >= stackCapacity ? 'TRUE' : 'FALSE'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="relative min-h-[260px] bg-gradient-to-b from-slate-50 to-slate-100/70 rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-end">
                                            <div className="absolute top-3 text-[11px] font-mono text-slate-500 flex items-center gap-1 font-semibold">
                                                <ArrowDown size={12} className="animate-bounce text-blue-600" />
                                                <span>LIFO Aperture (Push / Pop only from TOP)</span>
                                            </div>

                                            <div className="w-72 border-x-4 border-b-4 border-slate-800 rounded-b-2xl bg-white/80 backdrop-blur-xs p-2.5 flex flex-col-reverse gap-2 shadow-inner min-h-[200px]">
                                                {stackItems.length === 0 ? (
                                                    <div className="h-32 flex flex-col items-center justify-center text-slate-400 text-xs font-mono gap-1">
                                                        <span>[ Empty Stack Chamber ]</span>
                                                        <span className="text-[10px] text-slate-400">top == -1</span>
                                                    </div>
                                                ) : (
                                                    stackItems.map((val, idx) => {
                                                        const isTop = idx === stackItems.length - 1;
                                                        const isHighlighted = stackHighlightIdx === idx;
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className={`h-11 rounded-xl flex items-center justify-between px-3.5 font-mono font-bold transition-all shadow-xs ${
                                                                    isHighlighted
                                                                        ? 'bg-emerald-500 text-white scale-105 ring-4 ring-emerald-200 shadow-md'
                                                                        : isTop
                                                                        ? 'bg-slate-900 text-white border-2 border-blue-400 ring-2 ring-blue-500/20'
                                                                        : 'bg-slate-100 text-slate-800 border border-slate-200'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    {isTop && (
                                                                        <span className="px-1.5 py-0.5 rounded bg-blue-500 text-[9px] text-white tracking-widest font-black uppercase">
                                                                            TOP
                                                                        </span>
                                                                    )}
                                                                    <span className="text-sm font-extrabold">{val}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-[10px] font-normal opacity-75">
                                                                    <span>0x{1000 + idx * 4}</span>
                                                                    <span className="font-bold">[{idx}]</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedTopicId === 2 && (
                                    <div className="space-y-4">
                                        <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold text-slate-800">Infix Expression:</span>
                                                <div className="flex items-center gap-1.5">
                                                    <button onClick={() => handleApplyInfixPreset('( A + B ) * ( C - D )')} className="px-2 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded hover:bg-slate-100 cursor-pointer">
                                                        Preset 1: (A+B)*(C-D)
                                                    </button>
                                                    <button onClick={() => handleApplyInfixPreset('A + B * C - D')} className="px-2 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded hover:bg-slate-100 cursor-pointer">
                                                        Preset 2: A+B*C-D
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={infixInput}
                                                    onChange={e => setInfixInput(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && handleApplyInfixPreset(infixInput)}
                                                    className="flex-1 px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Space separated tokens: ( A + B ) * C"
                                                />
                                                <button onClick={() => handleApplyInfixPreset(infixInput)} className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer">
                                                    Parse Infix
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-slate-100/70 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <button onClick={handleStepShuntingForward} disabled={shuntingStepIdx >= shuntingYardData.steps.length - 1} className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs">
                                                    <SkipForward size={13} /> Next Step
                                                </button>
                                                <button onClick={() => setShuntingIsPlaying(!shuntingIsPlaying)} className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center gap-1.5">
                                                    {shuntingIsPlaying ? <Pause size={13} /> : <Play size={13} />}
                                                    {shuntingIsPlaying ? 'Pause' : 'Auto Play'}
                                                </button>
                                                <button onClick={handleResetShunting} className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer">
                                                    <RotateCcw size={14} />
                                                </button>
                                            </div>
                                            <span className="text-xs font-mono text-slate-600 font-semibold">
                                                Step {shuntingStepIdx} of {shuntingYardData.steps.length - 1}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mr-1">Input:</span>
                                            {shuntingYardData.tokens.map((tok, idx) => {
                                                const isCurrent = shuntingYardData.steps[shuntingStepIdx]?.tokenIdx === idx;
                                                const isProcessed = idx < (shuntingYardData.steps[shuntingStepIdx]?.tokenIdx ?? 0);
                                                return (
                                                    <div key={idx} className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${isCurrent ? 'bg-blue-600 text-white scale-110 shadow-sm ring-2 ring-blue-300' : isProcessed ? 'bg-slate-200 text-slate-400 line-through' : 'bg-white border border-slate-300 text-slate-800'}`}>
                                                        {tok}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                                        <Layers size={13} className="text-blue-500" />
                                                        Operator Stack (LIFO)
                                                    </span>
                                                    <span className="text-[10px] font-mono text-slate-500">size = {shuntingYardData.steps[shuntingStepIdx]?.opStack.length || 0}</span>
                                                </div>
                                                <div className="h-28 border-2 border-dashed border-slate-300 rounded-lg bg-white p-2 flex flex-col-reverse gap-1 justify-start overflow-y-auto">
                                                    {shuntingYardData.steps[shuntingStepIdx]?.opStack.length === 0 ? (
                                                        <span className="text-slate-400 text-xs font-mono text-center my-auto">[ Stack Empty ]</span>
                                                    ) : (
                                                        shuntingYardData.steps[shuntingStepIdx]?.opStack.map((op, idx) => (
                                                            <div key={idx} className="px-3 py-1 rounded-md bg-slate-900 text-white text-xs font-mono font-bold flex items-center justify-between">
                                                                <span>{op}</span>
                                                                <span className="text-[10px] text-slate-400">top</span>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                                        <Check size={13} className="text-emerald-500" />
                                                        Postfix Output Queue
                                                    </span>
                                                    <span className="text-[10px] font-mono text-emerald-600 font-bold">FIFO Accumulator</span>
                                                </div>
                                                <div className="h-28 border-2 border-dashed border-slate-300 rounded-lg bg-white p-2 flex items-center gap-1.5 overflow-x-auto flex-wrap">
                                                    {shuntingYardData.steps[shuntingStepIdx]?.output.length === 0 ? (
                                                        <span className="text-slate-400 text-xs font-mono text-center w-full">[ Output Queue Empty ]</span>
                                                    ) : (
                                                        shuntingYardData.steps[shuntingStepIdx]?.output.map((tok, idx) => (
                                                            <span key={idx} className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold shadow-2xs">
                                                                {tok}
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-2.5">
                                            <Info size={15} className="text-blue-600 mt-0.5 shrink-0" />
                                            <div className="text-xs text-blue-900 leading-relaxed font-mono">
                                                {shuntingYardData.steps[shuntingStepIdx]?.action}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedTopicId === 3 && (
                                    <div className="space-y-4">
                                        <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold text-slate-800">Postfix Expression:</span>
                                                <div className="flex items-center gap-1.5">
                                                    <button onClick={() => handleApplyPostfixPreset('5 3 + 8 2 - *')} className="px-2 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded hover:bg-slate-100 cursor-pointer">
                                                        Preset 1: (5+3)*(8-2) = 48
                                                    </button>
                                                    <button onClick={() => handleApplyPostfixPreset('4 5 * 2 +')} className="px-2 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded hover:bg-slate-100 cursor-pointer">
                                                        Preset 2: 4*5+2 = 22
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={postfixInput}
                                                    onChange={e => setPostfixInput(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && handleApplyPostfixPreset(postfixInput)}
                                                    className="flex-1 px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Space separated numbers & operators: 5 3 + 8 2 - *"
                                                />
                                                <button onClick={() => handleApplyPostfixPreset(postfixInput)} className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer">
                                                    Load Postfix
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-slate-100/70 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <button onClick={handleStepPostfixForward} disabled={postfixStepIdx >= postfixEvalData.steps.length - 1} className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs">
                                                    <SkipForward size={13} /> Next Step
                                                </button>
                                                <button onClick={() => setPostfixIsPlaying(!postfixIsPlaying)} className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center gap-1.5">
                                                    {postfixIsPlaying ? <Pause size={13} /> : <Play size={13} />}
                                                    {postfixIsPlaying ? 'Pause' : 'Auto Play'}
                                                </button>
                                                <button onClick={handleResetPostfix} className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer">
                                                    <RotateCcw size={14} />
                                                </button>
                                            </div>
                                            <span className="text-xs font-mono text-slate-600 font-semibold">
                                                Eval Step {postfixStepIdx} of {postfixEvalData.steps.length - 1}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                                <span className="text-xs font-bold text-slate-800">Token Stream:</span>
                                                <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-white rounded-lg border border-slate-200">
                                                    {postfixEvalData.tokens.map((tok, idx) => {
                                                        const isCurrent = postfixEvalData.steps[postfixStepIdx]?.tokenIdx === idx;
                                                        const isProcessed = idx < (postfixEvalData.steps[postfixStepIdx]?.tokenIdx ?? 0);
                                                        return (
                                                            <div key={idx} className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${isCurrent ? 'bg-emerald-600 text-white scale-110 shadow-sm ring-2 ring-emerald-300' : isProcessed ? 'bg-slate-200 text-slate-400 line-through' : 'bg-slate-100 text-slate-700'}`}>
                                                                {tok}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-slate-800">Evaluation Stack:</span>
                                                    <span className="text-[10px] font-mono text-slate-500">size = {postfixEvalData.steps[postfixStepIdx]?.stack.length || 0}</span>
                                                </div>
                                                <div className="h-28 border-2 border-dashed border-slate-300 rounded-lg bg-white p-2 flex flex-col-reverse gap-1 justify-start overflow-y-auto">
                                                    {postfixEvalData.steps[postfixStepIdx]?.stack.length === 0 ? (
                                                        <span className="text-slate-400 text-xs font-mono text-center my-auto">[ Stack Empty ]</span>
                                                    ) : (
                                                        postfixEvalData.steps[postfixStepIdx]?.stack.map((val, idx) => (
                                                            <div key={idx} className="px-3 py-1 rounded bg-slate-900 text-white text-xs font-mono font-bold flex items-center justify-between">
                                                                <span>{val}</span>
                                                                <span className="text-[10px] text-emerald-400 font-bold">[{idx}]</span>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-2.5">
                                            <Sparkles size={15} className="text-emerald-600 mt-0.5 shrink-0" />
                                            <div className="text-xs text-emerald-950 leading-relaxed font-mono font-semibold">
                                                {postfixEvalData.steps[postfixStepIdx]?.action}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* MODULE 3: LISTS & QUEUES */}
                        {activeModuleNumber === 3 && (
                            <div className="space-y-4">
                                {selectedTopicId === 1 && (
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl">
                                            <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl">
                                                <button onClick={() => setListType('singly')} className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${listType === 'singly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
                                                    Singly Linked List
                                                </button>
                                                <button onClick={() => setListType('doubly')} className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${listType === 'doubly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
                                                    Doubly Linked List
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button onClick={handleListReverse} className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer flex items-center gap-1">
                                                    <RotateCcw size={12} /> Reverse List
                                                </button>
                                                <button onClick={handleListReset} className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                                    Reset
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-slate-50 rounded-xl space-y-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={listValInput}
                                                    onChange={e => setListValInput(e.target.value)}
                                                    placeholder="Value (e.g. 55)"
                                                    className="w-28 px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button onClick={handleListInsertHead} className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer">
                                                    + Insert Head
                                                </button>
                                                <button onClick={handleListInsertTail} className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg cursor-pointer">
                                                    + Insert Tail
                                                </button>
                                                <div className="flex items-center gap-1 pl-2 border-l border-slate-300">
                                                    <span className="text-xs text-slate-500 font-mono">at pos:</span>
                                                    <input
                                                        type="number"
                                                        value={listIndexInput}
                                                        onChange={e => setListIndexInput(e.target.value)}
                                                        className="w-14 px-2 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg"
                                                    />
                                                    <button onClick={handleListInsertAtIndex} className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg cursor-pointer">
                                                        + Insert At Index
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={handleListDeleteHead} className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg cursor-pointer">
                                                        Delete Head
                                                    </button>
                                                    <button onClick={handleListDeleteTail} className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg cursor-pointer">
                                                        Delete Tail
                                                    </button>
                                                    <button onClick={handleListDeleteByValue} className="px-3 py-1.5 text-xs font-semibold text-rose-800 bg-white border border-rose-200 hover:bg-rose-50 rounded-lg cursor-pointer">
                                                        Delete By Val
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={listSearchTarget}
                                                        onChange={e => setListSearchTarget(e.target.value)}
                                                        placeholder="Search val..."
                                                        className="w-24 px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg"
                                                    />
                                                    <button onClick={handleListSearch} className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer flex items-center gap-1">
                                                        <Search size={12} /> Search
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="min-h-[220px] bg-slate-50/80 rounded-2xl border border-slate-200 p-5 flex flex-col justify-center gap-4 overflow-x-auto">
                                            <div className="flex items-center gap-2 min-w-max py-4">
                                                <div className="flex flex-col items-center">
                                                    <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-mono text-[10px] font-black uppercase tracking-wider shadow-xs">
                                                        HEAD
                                                    </span>
                                                    <ArrowDown size={14} className="text-blue-600 mt-0.5" />
                                                </div>

                                                {linkedNodes.length === 0 ? (
                                                    <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-xl bg-white text-slate-400 font-mono text-xs">
                                                        <span>HEAD points to NULL (Empty List)</span>
                                                    </div>
                                                ) : (
                                                    linkedNodes.map((node, idx) => {
                                                        const isHead = idx === 0;
                                                        const isTail = idx === linkedNodes.length - 1;
                                                        const isTraversing = listActiveTraverseIdx === idx;

                                                        return (
                                                            <div key={node.id} className="flex items-center gap-2">
                                                                <div className="flex flex-col items-center">
                                                                    <div className="h-5 flex items-center gap-1">
                                                                        {isTraversing && (
                                                                            <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-mono text-[9px] font-bold animate-pulse">
                                                                                CURR ❯
                                                                            </span>
                                                                        )}
                                                                        {isTail && (
                                                                            <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-mono text-[9px] font-bold">
                                                                                TAIL
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    <div className={`flex border-2 rounded-xl overflow-hidden bg-white shadow-xs transition-all ${isTraversing ? 'border-emerald-500 ring-4 ring-emerald-200 scale-105' : 'border-slate-800'}`}>
                                                                        {listType === 'doubly' && (
                                                                            <div className="px-2 py-2 bg-slate-100 border-r border-slate-200 flex flex-col items-center justify-center font-mono text-[9px] text-slate-500">
                                                                                <span>prev*</span>
                                                                                <span className="text-[8px] text-slate-400">
                                                                                    {idx > 0 ? linkedNodes[idx - 1].addr : 'NULL'}
                                                                                </span>
                                                                            </div>
                                                                        )}

                                                                        <div className="px-3.5 py-2 flex flex-col items-center justify-center bg-white min-w-[56px]">
                                                                            <span className="text-base font-extrabold text-slate-900 font-mono">{node.val}</span>
                                                                            <span className="text-[9px] font-mono text-slate-400">{node.addr}</span>
                                                                        </div>

                                                                        <div className="px-2 py-2 bg-slate-100 border-l border-slate-200 flex flex-col items-center justify-center font-mono text-[9px] text-slate-500">
                                                                            <span>next*</span>
                                                                            <span className="text-[8px] text-slate-400">
                                                                                {idx < linkedNodes.length - 1 ? linkedNodes[idx + 1].addr : 'NULL'}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <span className="text-[9px] font-mono text-slate-400 mt-1">[{idx}]</span>
                                                                </div>

                                                                <div className="flex flex-col items-center px-1">
                                                                    {listType === 'doubly' ? (
                                                                        <div className="flex flex-col items-center text-blue-600">
                                                                            <ArrowRight size={14} />
                                                                            <ArrowLeft size={14} className="-mt-1" />
                                                                        </div>
                                                                    ) : (
                                                                        <ArrowRight size={16} className="text-blue-600" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                )}

                                                <div className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-300 text-rose-700 font-mono text-xs font-bold">
                                                    NULL
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedTopicId === 2 && (
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl">
                                            <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl">
                                                <button onClick={() => setQueueMode('linear')} className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${queueMode === 'linear' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
                                                    Linear FIFO Array Queue
                                                </button>
                                                <button onClick={() => setQueueMode('two-stacks')} className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${queueMode === 'two-stacks' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
                                                    Queue using Two Stacks
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={queueValInput}
                                                    onChange={e => setQueueValInput(e.target.value)}
                                                    placeholder="Val..."
                                                    className="w-24 px-2.5 py-1 text-xs font-mono bg-white border border-slate-300 rounded-lg"
                                                />
                                                {queueMode === 'linear' ? (
                                                    <>
                                                        <button onClick={handleLinearEnqueue} className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 cursor-pointer">
                                                            Enqueue
                                                        </button>
                                                        <button onClick={handleLinearDequeue} className="px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 cursor-pointer">
                                                            Dequeue
                                                        </button>
                                                        <button onClick={handleLinearReset} className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer">
                                                            Reset
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={handleTwoStacksEnqueue} className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 cursor-pointer">
                                                            Enqueue (S1)
                                                        </button>
                                                        <button onClick={handleTwoStacksDequeue} className="px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 cursor-pointer">
                                                            Dequeue (S2)
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {queueMode === 'linear' && (
                                            <div className="min-h-[200px] bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-center gap-4">
                                                <div className="flex items-center justify-between text-xs font-mono text-slate-600">
                                                    <span>FRONT index = <strong className="text-blue-600">[{linearFront}]</strong></span>
                                                    <span>REAR index = <strong className="text-emerald-600">[{linearRear}]</strong></span>
                                                </div>

                                                <div className="grid grid-cols-6 gap-2 pt-2">
                                                    {linearQueue.map((val, idx) => {
                                                        const isFront = idx === linearFront;
                                                        const isRear = idx === linearRear;
                                                        const hasVal = val !== null;
                                                        return (
                                                            <div key={idx} className="flex flex-col items-center gap-1.5">
                                                                <div className="h-5 flex items-center gap-1">
                                                                    {isFront && <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-mono text-[8px] font-bold">FRONT</span>}
                                                                    {isRear && <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-mono text-[8px] font-bold">REAR</span>}
                                                                </div>

                                                                <div className={`w-full h-16 rounded-xl flex flex-col items-center justify-center font-mono text-xs border-2 transition-all ${hasVal ? 'bg-white border-slate-800 text-slate-900 shadow-xs' : 'bg-slate-100 text-slate-300 border-dashed border-slate-300'}`}>
                                                                    <span className="text-sm font-extrabold">{hasVal ? val : '-'}</span>
                                                                    <span className="text-[9px] text-slate-400">0x{1000 + idx * 4}</span>
                                                                </div>

                                                                <span className="text-[10px] font-mono font-bold text-slate-500">[{idx}]</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {queueMode === 'two-stacks' && (
                                            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                                            <ArrowDown size={12} className="text-emerald-500" />
                                                            Stack 1: Inbox (Enqueue)
                                                        </span>
                                                        <span className="text-[10px] font-mono text-slate-400">size = {stackInbox.length}</span>
                                                    </div>
                                                    <div className="w-full border-x-4 border-b-4 border-slate-700 rounded-b-xl bg-white p-2 flex flex-col-reverse gap-1.5 min-h-[140px]">
                                                        {stackInbox.length === 0 ? (
                                                            <span className="text-slate-400 text-xs font-mono text-center my-auto">[ Inbox Empty ]</span>
                                                        ) : (
                                                            stackInbox.map((v, i) => (
                                                                <div key={i} className="h-8 rounded bg-emerald-50 border border-emerald-300 text-emerald-900 font-mono text-xs font-bold flex items-center justify-between px-3">
                                                                    <span>{v}</span>
                                                                    <span className="text-[9px] text-emerald-600">[{i}]</span>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                                            <ArrowUp size={12} className="text-rose-500" />
                                                            Stack 2: Outbox (Dequeue)
                                                        </span>
                                                        <span className="text-[10px] font-mono text-slate-400">size = {stackOutbox.length}</span>
                                                    </div>
                                                    <div className="w-full border-x-4 border-b-4 border-slate-700 rounded-b-xl bg-white p-2 flex flex-col-reverse gap-1.5 min-h-[140px]">
                                                        {stackOutbox.length === 0 ? (
                                                            <span className="text-slate-400 text-xs font-mono text-center my-auto">[ Outbox Empty ]</span>
                                                        ) : (
                                                            stackOutbox.map((v, i) => (
                                                                <div key={i} className="h-8 rounded bg-blue-50 border border-blue-300 text-blue-900 font-mono text-xs font-bold flex items-center justify-between px-3">
                                                                    <span>{v}</span>
                                                                    <span className="text-[9px] text-blue-600">[{i}]</span>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedTopicId === 3 && (
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={circularValInput}
                                                    onChange={e => setCircularValInput(e.target.value)}
                                                    placeholder="Val..."
                                                    className="w-24 px-2.5 py-1 text-xs font-mono bg-white border border-slate-300 rounded-lg"
                                                />
                                                <button onClick={handleCircularEnqueue} className="px-3.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer">
                                                    + Enqueue (rear+1)%8
                                                </button>
                                                <button onClick={handleCircularDequeue} className="px-3.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg cursor-pointer">
                                                    Dequeue (front+1)%8
                                                </button>
                                            </div>

                                            <button onClick={handleCircularReset} className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                                Reset Ring
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between px-4 py-2.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs font-mono">
                                            <div className="flex items-center gap-4">
                                                <span>FRONT = <strong className="text-blue-700">[{circularFront}]</strong></span>
                                                <span>REAR = <strong className="text-emerald-700">[{circularRear}]</strong></span>
                                                <span>(rear + 1) % 8 = <strong className="text-slate-900">[{(circularRear + 1) % CIRCULAR_SIZE}]</strong></span>
                                            </div>
                                            <span className="text-[10px] text-blue-900 font-bold">
                                                Full condition: (rear + 1) % 8 == front
                                            </span>
                                        </div>

                                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center">
                                            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 w-full">
                                                {circularSlots.map((val, idx) => {
                                                    const isFront = idx === circularFront;
                                                    const isRear = idx === circularRear;
                                                    const hasVal = val !== null;
                                                    return (
                                                        <div key={idx} className="flex flex-col items-center gap-1">
                                                            <div className="h-4 flex items-center gap-0.5">
                                                                {isFront && <span className="px-1 py-0.2 rounded bg-blue-600 text-white font-mono text-[7px] font-bold">FRONT</span>}
                                                                {isRear && <span className="px-1 py-0.2 rounded bg-emerald-600 text-white font-mono text-[7px] font-bold">REAR</span>}
                                                            </div>
                                                            <div className={`w-full h-14 rounded-xl flex flex-col items-center justify-center font-mono text-xs border-2 transition-all ${hasVal ? 'bg-white border-slate-800 text-slate-900 shadow-xs font-bold' : 'bg-slate-100 text-slate-300 border-dashed border-slate-300'}`}>
                                                                <span className="text-sm font-extrabold">{hasVal ? val : '-'}</span>
                                                                <span className="text-[8px] text-slate-400">[{idx}]</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mt-4">
                                                <RotateCcw size={13} className="text-blue-500 animate-spin" />
                                                <span>Continuous Ring Buffer wraps around from slot [7] back to slot [0].</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═════════════════════════════════════════════════════════
                           MODULE 4: RECURSION STUDIO (TOPIC-SCOPED)
                           ═════════════════════════════════════════════════════════ */}
                        {activeModuleNumber === 4 && (
                            <div className="space-y-4">

                                {/* ── SUB-TOPIC 4.1: SIMPLE RECURSION (CALL STACK CHAMBER & FLOW) ── */}
                                {selectedTopicId === 1 && (
                                    <div className="space-y-4">
                                        {/* Algorithm & Presets Bar */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                                    <Sparkles size={13} className="text-blue-600" /> Function:
                                                </span>
                                                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                                                    {[
                                                        { id: 'factorial', label: 'Factorial (n!)' },
                                                        { id: 'sumN', label: 'Sum 1..n' },
                                                        { id: 'power2', label: 'Power (2^n)' }
                                                    ].map(item => (
                                                        <button
                                                            key={item.id}
                                                            onClick={() => {
                                                                setRecursionAlgo(item.id);
                                                                setRecursionStepIdx(0);
                                                                setRecursionIsPlaying(false);
                                                                addLog(`Switched recursion function to ${item.label}.`);
                                                            }}
                                                            className={`px-3 py-1 text-xs font-bold cursor-pointer transition-all ${recursionAlgo === item.id ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
                                                        >
                                                            {item.label}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-1.5 ml-1">
                                                    <span className="text-xs font-semibold text-slate-500">n:</span>
                                                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                                                        {[2, 3, 4, 5, 6].map(val => (
                                                            <button
                                                                key={val}
                                                                onClick={() => {
                                                                    setRecursionN(val);
                                                                    setRecursionStepIdx(0);
                                                                    setRecursionIsPlaying(false);
                                                                    addLog(`Set recursion target n = ${val}.`);
                                                                }}
                                                                className={`px-2.5 py-1 text-xs font-mono font-bold cursor-pointer transition-all ${recursionN === val ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                                                            >
                                                                {val}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* View Mode & Controls */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white text-xs">
                                                    {[
                                                        { id: 'dual', label: 'Dual View' },
                                                        { id: 'stack', label: 'Stack Chamber' },
                                                        { id: 'flow', label: 'Call Flow' }
                                                    ].map(v => (
                                                        <button
                                                            key={v.id}
                                                            onClick={() => setRecursionView(v.id)}
                                                            className={`px-2.5 py-1 font-semibold cursor-pointer ${recursionView === v.id ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                                                        >
                                                            {v.label}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => {
                                                            if (recursionStepIdx > 0) {
                                                                setRecursionStepIdx(recursionStepIdx - 1);
                                                                setRecursionIsPlaying(false);
                                                            }
                                                        }}
                                                        disabled={recursionStepIdx === 0}
                                                        className="p-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 bg-white rounded-lg cursor-pointer disabled:opacity-40"
                                                        title="Previous Step"
                                                    >
                                                        <SkipBack size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => setRecursionIsPlaying(!recursionIsPlaying)}
                                                        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer flex items-center gap-1 shadow-xs"
                                                    >
                                                        {recursionIsPlaying ? <Pause size={13} /> : <Play size={13} />}
                                                        {recursionIsPlaying ? 'Pause' : 'Auto Play'}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (recursionStepIdx < recursionSteps.length - 1) {
                                                                setRecursionStepIdx(recursionStepIdx + 1);
                                                                addLog(recursionSteps[recursionStepIdx + 1].note);
                                                            }
                                                        }}
                                                        disabled={recursionStepIdx >= recursionSteps.length - 1}
                                                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs disabled:opacity-40"
                                                    >
                                                        <SkipForward size={13} /> Next
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setRecursionStepIdx(0);
                                                            setRecursionIsPlaying(false);
                                                            addLog('Reset recursion call stack.');
                                                        }}
                                                        className="p-1.5 text-slate-500 hover:text-slate-800 border border-slate-200 bg-white rounded-lg cursor-pointer"
                                                        title="Reset"
                                                    >
                                                        <RotateCcw size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status & Live Metrics Ribbon */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-gradient-to-r from-slate-100/90 to-blue-50/60 rounded-xl border border-slate-200/80 text-xs font-mono">
                                            <div className="flex items-center gap-2.5">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-2xs ${
                                                    currentRecursionStep.phase === 'winding'
                                                        ? 'bg-amber-600'
                                                        : currentRecursionStep.phase === 'base_case'
                                                        ? 'bg-emerald-600 ring-2 ring-emerald-300'
                                                        : currentRecursionStep.phase === 'unwinding'
                                                        ? 'bg-blue-600'
                                                        : 'bg-purple-600'
                                                }`}>
                                                    {currentRecursionStep.phase === 'winding'
                                                        ? 'Winding (Push Frame)'
                                                        : currentRecursionStep.phase === 'base_case'
                                                        ? 'Base Case Reached'
                                                        : currentRecursionStep.phase === 'unwinding'
                                                        ? 'Unwinding (Pop Frame)'
                                                        : 'Complete'}
                                                </span>
                                                <span className="text-slate-700 font-bold">
                                                    Step {recursionStepIdx + 1} / {recursionSteps.length}
                                                </span>
                                                <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500">
                                                    <Layers size={12} className="text-blue-600" />
                                                    <span>Stack Depth: <strong>{currentRecursionStep.stack.length}</strong></span>
                                                    <span className="text-slate-300">|</span>
                                                    <span>Allocated: <strong>{currentRecursionStep.stack.length * 32} Bytes</strong></span>
                                                </div>
                                            </div>

                                            {currentRecursionStep.computed && (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Formula:</span>
                                                    <span className="text-xs font-black text-blue-700 bg-white px-2.5 py-0.5 rounded-md border border-blue-200 shadow-2xs">
                                                        {currentRecursionStep.computed}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Visualization Workspace (Chamber & Flow) */}
                                        <div className={`grid gap-4 ${recursionView === 'dual' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
                                            {/* OS Activation Stack Chamber */}
                                            {(recursionView === 'dual' || recursionView === 'stack') && (
                                                <div className={`${recursionView === 'dual' ? 'lg:col-span-5' : 'w-full'} flex flex-col bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-2xl border-2 border-slate-800 p-4 shadow-lg text-slate-100`}>
                                                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                                                        <span className="text-xs font-bold font-mono text-blue-400 flex items-center gap-1.5">
                                                            <Cpu size={14} className="text-blue-400" />
                                                            OS Call Stack Chamber
                                                        </span>
                                                        <span className="text-[10px] font-mono text-slate-400">
                                                            SP: {currentRecursionStep.stack.length > 0 ? currentRecursionStep.stack[currentRecursionStep.stack.length - 1].addr : '0x7FFE000 (Empty)'}
                                                        </span>
                                                    </div>

                                                    {/* Stack Beaker Container */}
                                                    <div className="flex-1 flex flex-col justify-end min-h-[260px] bg-slate-950/80 rounded-xl border-x-2 border-b-2 border-slate-700 p-3 relative">
                                                        <div className="absolute top-2 left-2 text-[9px] font-mono text-slate-500 flex items-center gap-1">
                                                            <ArrowDown size={11} className="text-blue-500 animate-pulse" />
                                                            <span>LIFO: Push (Down into Memory) / Pop (Upwards)</span>
                                                        </div>

                                                        <div className="flex flex-col-reverse gap-2 mt-6">
                                                            {currentRecursionStep.stack.length === 0 ? (
                                                                <div className="py-12 flex flex-col items-center justify-center text-slate-500 text-xs font-mono gap-1.5 text-center">
                                                                    <Layers size={20} className="text-slate-600 opacity-60" />
                                                                    <span>[ Call Stack Deallocated ]</span>
                                                                    <span className="text-[10px] text-slate-600">All activation records cleaned up cleanly.</span>
                                                                </div>
                                                            ) : (
                                                                currentRecursionStep.stack.map((frame, idx) => {
                                                                    const isTop = idx === currentRecursionStep.stack.length - 1;
                                                                    const isBase = frame.status === 'BASE_CASE';
                                                                    const isReturning = frame.status === 'UNWINDING';

                                                                    return (
                                                                        <div
                                                                            key={frame.level}
                                                                            className={`p-2.5 rounded-xl font-mono text-xs transition-all duration-200 border shadow-xs relative ${
                                                                                isBase
                                                                                    ? 'bg-emerald-950/90 border-emerald-500/80 text-emerald-200 ring-2 ring-emerald-500/30'
                                                                                    : isReturning
                                                                                    ? 'bg-blue-950/90 border-blue-500/80 text-blue-200 ring-1 ring-blue-500/40'
                                                                                    : isTop
                                                                                    ? 'bg-slate-800 border-blue-400 text-white ring-2 ring-blue-400/30'
                                                                                    : 'bg-slate-900/90 border-slate-800 text-slate-300 opacity-80'
                                                                            }`}
                                                                        >
                                                                            {isTop && (
                                                                                <div className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full hidden xl:flex items-center gap-1 text-[9px] font-bold text-blue-400">
                                                                                    <span>SP</span>
                                                                                    <ArrowRight size={10} />
                                                                                </div>
                                                                            )}
                                                                            <div className="flex items-center justify-between mb-1">
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <span className="px-1.5 py-0.2 bg-white/10 rounded text-[9px] text-slate-400 font-bold">
                                                                                        Frame #{frame.level}
                                                                                    </span>
                                                                                    <span className="font-extrabold text-white text-xs">
                                                                                        {frame.funcName}({frame.n})
                                                                                    </span>
                                                                                </div>
                                                                                <span className="text-[10px] font-mono text-slate-400">
                                                                                    {frame.addr}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
                                                                                <span className="text-slate-400 font-sans">
                                                                                    {isBase ? 'Base Condition: n <= 1' : `Waiting for ${frame.funcName}(${frame.n - 1})`}
                                                                                </span>
                                                                                <span className="font-bold text-white">
                                                                                    {frame.retVal !== null ? (
                                                                                        <span className="text-emerald-400">return: {frame.retVal}</span>
                                                                                    ) : (
                                                                                        <span className="text-amber-400 animate-pulse">suspended...</span>
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Recursion Expansion & Return Flowchart */}
                                            {(recursionView === 'dual' || recursionView === 'flow') && (
                                                <div className={`${recursionView === 'dual' ? 'lg:col-span-7' : 'w-full'} flex flex-col bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3`}>
                                                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                                        <span className="text-xs font-bold font-mono text-slate-800 flex items-center gap-1.5">
                                                            <GitBranch size={14} className="text-blue-600" />
                                                            Recursive Call Chain & Return Value Propagation
                                                        </span>
                                                        <span className="text-[11px] font-semibold text-slate-500">
                                                            {recursionAlgo === 'factorial' ? 'n × fact(n-1)' : recursionAlgo === 'sumN' ? 'n + sum(n-1)' : '2 × pow(n-1)'}
                                                        </span>
                                                    </div>

                                                    {/* Visual Horizontal Call Chain */}
                                                    <div className="flex-1 flex flex-col justify-center py-4 px-2 overflow-x-auto min-h-[220px]">
                                                        <div className="flex items-center justify-start sm:justify-center gap-2 min-w-max pb-2">
                                                            {currentRecursionStep.flowNodes.map((node, idx) => {
                                                                const isActive = node.n === currentRecursionStep.currentN;
                                                                const isBase = node.status === 'base';
                                                                const isReturning = node.status === 'returning';
                                                                const isDone = node.status === 'done';

                                                                return (
                                                                    <React.Fragment key={node.id}>
                                                                        <div className="flex flex-col items-center gap-1.5">
                                                                            {/* Node Card */}
                                                                            <div
                                                                                className={`w-28 p-3 rounded-xl border text-center transition-all duration-200 shadow-2xs ${
                                                                                    isActive
                                                                                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-300 scale-105'
                                                                                        : isBase
                                                                                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300'
                                                                                        : isDone
                                                                                        ? 'bg-slate-50 border-slate-300 text-slate-700'
                                                                                        : 'bg-white border-slate-200 text-slate-800'
                                                                                }`}
                                                                            >
                                                                                <div className="text-[10px] font-mono text-slate-400 font-bold">
                                                                                    Level #{node.n}
                                                                                </div>
                                                                                <div className="text-xs font-extrabold font-mono text-slate-900 my-0.5">
                                                                                    {node.label}
                                                                                </div>
                                                                                <div className="text-[10px] font-mono font-bold mt-1">
                                                                                    {node.retVal !== null ? (
                                                                                        <span className="text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                                                                                            ret = {node.retVal}
                                                                                        </span>
                                                                                    ) : isBase ? (
                                                                                        <span className="text-emerald-700">Base = 1</span>
                                                                                    ) : (
                                                                                        <span className="text-slate-400 italic">calling...</span>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            {/* Return Value Arrow Indicator */}
                                                                            {node.retVal !== null && (
                                                                                <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                                                                    <ArrowLeft size={10} />
                                                                                    <span>yields {node.retVal}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {idx < currentRecursionStep.flowNodes.length - 1 && (
                                                                            <div className="flex flex-col items-center justify-center px-1 text-slate-400">
                                                                                <div className="flex items-center gap-0.5 text-[9px] font-mono text-blue-600 font-bold mb-0.5">
                                                                                    <span>call</span>
                                                                                    <ArrowRight size={10} />
                                                                                </div>
                                                                                <div className="w-6 h-0.5 bg-blue-300 rounded" />
                                                                                {node.retVal !== null && (
                                                                                    <div className="flex items-center gap-0.5 text-[9px] font-mono text-emerald-600 font-bold mt-0.5">
                                                                                        <ArrowLeft size={10} />
                                                                                        <span>ret</span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </React.Fragment>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* Pedagogical Insight Badge */}
                                                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 leading-relaxed font-sans flex items-start gap-2">
                                                        <Info size={14} className="text-blue-600 shrink-0 mt-0.5" />
                                                        <span>
                                                            <strong>Recursion Anatomy:</strong> The recursive step pauses execution on the caller until the child returns. When the base case terminates expansion, return values bubble backwards up the stack chain.
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Dynamic Execution Tracing Card */}
                                        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 font-mono text-xs space-y-1.5 shadow-md">
                                            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                                                <span className="flex items-center gap-1.5 font-bold text-blue-400">
                                                    <Terminal size={13} /> CPU Instruction & Call Stack Trace
                                                </span>
                                                <span className="text-slate-500">
                                                    Line: <code className="text-slate-300 font-bold">{currentRecursionStep.line}</code>
                                                </span>
                                            </div>
                                            <div className="text-slate-300 leading-relaxed pt-0.5">
                                                {currentRecursionStep.note}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── SUB-TOPIC 4.2: FIBONACCI RECURRENCE TREE, MEMOIZATION & TABULATION ── */}
                                {selectedTopicId === 2 && (
                                    <div className="space-y-4">
                                        {/* Mode Selector & Controls Bar */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                                                    {[
                                                        { id: 'naive', label: 'Naive Tree: O(2^n)' },
                                                        { id: 'memo', label: 'Top-Down Memo: O(n)' },
                                                        { id: 'tabulation', label: 'Bottom-Up DP: O(n)' }
                                                    ].map(mode => (
                                                        <button
                                                            key={mode.id}
                                                            onClick={() => {
                                                                setFibMode(mode.id);
                                                                setFibStepIdx(0);
                                                                setFibIsPlaying(false);
                                                                addLog(`Switched Fibonacci mode to ${mode.label}.`);
                                                            }}
                                                            className={`px-3 py-1.5 text-xs font-bold cursor-pointer transition-all ${fibMode === mode.id ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
                                                        >
                                                            {mode.label}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-1.5 ml-1">
                                                    <span className="text-xs font-semibold text-slate-500">n:</span>
                                                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                                                        {[2, 3, 4, 5].map(val => (
                                                            <button
                                                                key={val}
                                                                onClick={() => {
                                                                    setFibN(val);
                                                                    setFibStepIdx(0);
                                                                    setFibIsPlaying(false);
                                                                    addLog(`Set Fibonacci input n = ${val}.`);
                                                                }}
                                                                className={`px-2.5 py-1 text-xs font-mono font-bold cursor-pointer transition-all ${fibN === val ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                                                            >
                                                                {val}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stepper Controls */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        if (fibStepIdx > 0) {
                                                            setFibStepIdx(fibStepIdx - 1);
                                                            setFibIsPlaying(false);
                                                        }
                                                    }}
                                                    disabled={fibStepIdx === 0}
                                                    className="p-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 bg-white rounded-lg cursor-pointer disabled:opacity-40"
                                                    title="Previous Step"
                                                >
                                                    <SkipBack size={13} />
                                                </button>
                                                <button
                                                    onClick={() => setFibIsPlaying(!fibIsPlaying)}
                                                    className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer flex items-center gap-1 shadow-xs"
                                                >
                                                    {fibIsPlaying ? <Pause size={13} /> : <Play size={13} />}
                                                    {fibIsPlaying ? 'Pause' : 'Auto Play'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (fibStepIdx < fibData.steps.length - 1) {
                                                            setFibStepIdx(fibStepIdx + 1);
                                                            addLog(fibData.steps[fibStepIdx + 1].note);
                                                        }
                                                    }}
                                                    disabled={fibStepIdx >= fibData.steps.length - 1}
                                                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs disabled:opacity-40"
                                                >
                                                    <SkipForward size={13} /> Next
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setFibStepIdx(0);
                                                        setFibIsPlaying(false);
                                                        addLog('Reset Fibonacci visualizer.');
                                                    }}
                                                    className="p-1.5 text-slate-500 hover:text-slate-800 border border-slate-200 bg-white rounded-lg cursor-pointer"
                                                    title="Reset"
                                                >
                                                    <RotateCcw size={13} />
                                                </button>

                                                <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-xs font-black shadow-2xs">
                                                    fib({fibN}) = {fibData.finalVal}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Analytical Metric Cards Bar */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                                    Total Function Calls
                                                </span>
                                                <div className="text-lg font-black font-mono text-slate-900 flex items-center justify-between">
                                                    <span>{fibData.totalCalls} calls</span>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${fibMode === 'naive' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                                        {fibMode === 'naive' ? 'O(2^n)' : 'O(n)'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                                    {fibMode === 'memo' ? 'Cache Hits (Saved Subtrees)' : 'Duplicate Wasted Calls'}
                                                </span>
                                                <div className="text-lg font-black font-mono flex items-center justify-between">
                                                    <span className={fibMode === 'memo' ? 'text-emerald-700' : 'text-amber-700'}>
                                                        {fibMode === 'memo' ? `${fibData.cacheHits} Hits` : `${fibData.redundantCalls} Duplicates`}
                                                    </span>
                                                    <span className="text-[10px] font-semibold text-slate-500">
                                                        {fibMode === 'memo' ? 'Pruned' : `${Math.round((fibData.redundantCalls / Math.max(1, fibData.totalCalls)) * 100)}% Wasted`}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                                    Time Complexity
                                                </span>
                                                <div className="text-lg font-black font-mono text-blue-700 flex items-center justify-between">
                                                    <span>{fibMode === 'naive' ? 'O(2^n)' : 'O(n)'}</span>
                                                    <span className="text-[10px] font-semibold text-slate-500">
                                                        {fibMode === 'naive' ? `${Math.pow(2, fibN)} ops` : `${fibN} ops`}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                                    Space Complexity
                                                </span>
                                                <div className="text-lg font-black font-mono text-slate-800 flex items-center justify-between">
                                                    <span>{fibMode === 'tabulation' ? 'O(1) / O(n)' : 'O(n) Stack'}</span>
                                                    <span className="text-[10px] font-semibold text-slate-500">Depth: {fibN}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recurrence Tree Canvas (Naive & Memoized DP) */}
                                        {fibMode !== 'tabulation' && (
                                            <div className="relative min-h-[380px] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-2xl border-2 border-slate-800 p-4 shadow-inner overflow-hidden">
                                                {/* Header & Legend */}
                                                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                                                    <span className="font-bold text-blue-400 flex items-center gap-1.5">
                                                        <GitBranch size={13} />
                                                        {fibMode === 'naive' ? 'Naive Recurrence Tree (Full Call Explosion)' : 'Memoized Recurrence Tree (Subtree Pruning)'}
                                                    </span>
                                                    <div className="flex items-center gap-3 text-[10px]">
                                                        <span className="flex items-center gap-1 text-emerald-400">
                                                            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Base (k≤1)
                                                        </span>
                                                        <span className="flex items-center gap-1 text-blue-400">
                                                            <span className="w-2 h-2 rounded-full bg-blue-400" /> Computed
                                                        </span>
                                                        {fibMode === 'naive' ? (
                                                            <span className="flex items-center gap-1 text-amber-400">
                                                                <span className="w-2 h-2 rounded-full bg-amber-400" /> ⚠️ Duplicate Subtree
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-purple-400">
                                                                <span className="w-2 h-2 rounded-full bg-purple-400" /> ⚡ Cache Hit O(1)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* SVG Connecting Branches */}
                                                <svg className="absolute inset-0 w-full h-full pointer-events-none mt-10">
                                                    {fibData.edges.map(edge => {
                                                        const fromNode = fibData.nodes.find(n => n.id === edge.from);
                                                        const toNode = fibData.nodes.find(n => n.id === edge.to);
                                                        if (!fromNode || !toNode) return null;

                                                        const isEdgeActive = currentFibStep.activeNodeId === toNode.id;
                                                        return (
                                                            <line
                                                                key={`${edge.from}-${edge.to}`}
                                                                x1={`${fromNode.x}%`}
                                                                y1={fromNode.y + 24}
                                                                x2={`${toNode.x}%`}
                                                                y2={toNode.y + 24}
                                                                stroke={isEdgeActive ? '#60a5fa' : toNode.isMemoized ? '#c084fc' : toNode.isDuplicate ? '#f59e0b' : '#475569'}
                                                                strokeWidth={isEdgeActive ? 2.5 : 1.5}
                                                                strokeDasharray={edge.branch === 'R' ? '4,4' : undefined}
                                                            />
                                                        );
                                                    })}
                                                </svg>

                                                {/* Interactive Tree Nodes */}
                                                <div className="relative w-full h-[320px] mt-2">
                                                    {fibData.nodes.map(node => {
                                                        const isActive = currentFibStep.activeNodeId === node.id;
                                                        const isCached = node.isMemoized;
                                                        const isDuplicate = node.isDuplicate && !isCached;
                                                        const isBase = node.isBase;

                                                        return (
                                                            <div
                                                                key={node.id}
                                                                onMouseEnter={() => setFibHoverNodeId(node.id)}
                                                                onMouseLeave={() => setFibHoverNodeId(null)}
                                                                style={{
                                                                    left: `${node.x}%`,
                                                                    top: `${node.y}px`,
                                                                    transform: 'translate(-50%, -50%)'
                                                                }}
                                                                className={`absolute px-2.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all duration-200 cursor-pointer shadow-md select-none flex flex-col items-center ${
                                                                    isActive
                                                                        ? 'bg-blue-600 text-white ring-4 ring-blue-400/50 scale-110 z-30'
                                                                        : isCached
                                                                        ? 'bg-purple-950/90 border border-purple-500/80 text-purple-200 ring-2 ring-purple-500/30 z-20'
                                                                        : isBase
                                                                        ? 'bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 ring-1 ring-emerald-500/40 z-10'
                                                                        : isDuplicate
                                                                        ? 'bg-amber-950/90 border border-amber-500/80 text-amber-200 ring-1 ring-amber-500/30 z-10'
                                                                        : 'bg-slate-800 border border-slate-700 text-slate-200 hover:border-slate-500 z-10'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-1 text-[11px]">
                                                                    <span>fib({node.val})</span>
                                                                    {node.retVal !== null && (
                                                                        <span className="text-white font-extrabold">={node.retVal}</span>
                                                                    )}
                                                                </div>

                                                                {/* Status Micro-badge */}
                                                                <div className="text-[9px] mt-0.5">
                                                                    {isCached ? (
                                                                        <span className="text-purple-300 font-extrabold">⚡ CACHE</span>
                                                                    ) : isBase ? (
                                                                        <span className="text-emerald-400">BASE</span>
                                                                    ) : isDuplicate ? (
                                                                        <span className="text-amber-400 font-bold">DUPLICATE</span>
                                                                    ) : (
                                                                        <span className="text-slate-400">d={node.depth}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Bottom-Up Tabulation Canvas */}
                                        {fibMode === 'tabulation' && (
                                            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
                                                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                                    <span className="text-xs font-bold font-mono text-slate-800 flex items-center gap-1.5">
                                                        <Database size={14} className="text-blue-600" />
                                                        Bottom-Up DP Array Table (dp[i] = dp[i-1] + dp[i-2])
                                                    </span>
                                                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                                                        {currentFibStep.formula}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 overflow-x-auto py-4 justify-start sm:justify-center">
                                                    {fibData.dp.map((val, idx) => {
                                                        const isCurrent = currentFibStep.currentIdx === idx;
                                                        const isActiveOperand = currentFibStep.activeIndices?.includes(idx);

                                                        return (
                                                            <div key={idx} className="flex flex-col items-center gap-1.5">
                                                                <span className="text-[10px] font-mono text-slate-400 font-bold">
                                                                    dp[{idx}]
                                                                </span>
                                                                <div
                                                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-mono font-extrabold text-sm border-2 transition-all duration-200 shadow-2xs ${
                                                                        isCurrent
                                                                            ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 scale-110 shadow-md'
                                                                            : isActiveOperand
                                                                            ? 'bg-blue-50 text-blue-900 border-blue-400 ring-2 ring-blue-200'
                                                                            : val !== null
                                                                            ? 'bg-slate-50 text-slate-800 border-slate-300'
                                                                            : 'bg-white border-dashed border-slate-200 text-slate-300'
                                                                    }`}
                                                                >
                                                                    {val !== null ? val : '—'}
                                                                </div>
                                                                <span className="text-[9px] font-mono text-slate-500">
                                                                    {idx <= 1 ? 'Seed' : `sum[${idx-1},${idx-2}]`}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Memoization Array Buffer (Shown in Memo mode) */}
                                        {fibMode === 'memo' && (
                                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                                                <div className="flex items-center justify-between text-xs font-bold font-mono text-slate-800">
                                                    <span className="flex items-center gap-1.5">
                                                        <Database size={13} className="text-purple-600" />
                                                        Memoization Cache Buffer (memo[n] Lookup Table):
                                                    </span>
                                                    <span className="text-[11px] text-purple-700 font-semibold">
                                                        O(1) Instant Cache Lookups
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 overflow-x-auto py-1">
                                                    {Array.from({ length: fibN + 1 }).map((_, idx) => {
                                                        const isCachedInStep = currentFibStep.memo && currentFibStep.memo[idx] !== undefined;
                                                        const val = isCachedInStep ? currentFibStep.memo[idx] : null;

                                                        return (
                                                            <div key={idx} className="flex flex-col items-center gap-1">
                                                                <span className="text-[9px] font-mono text-slate-400">n={idx}</span>
                                                                <div
                                                                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-xs border-2 transition-all ${
                                                                        val !== null
                                                                            ? 'bg-purple-50 border-purple-400 text-purple-900 font-extrabold ring-1 ring-purple-200'
                                                                            : 'bg-white border-slate-200 text-slate-300 border-dashed'
                                                                    }`}
                                                                >
                                                                    {val !== null ? val : 'nil'}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Step Execution Note Card */}
                                        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 font-mono text-xs space-y-1.5 shadow-md">
                                            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                                                <span className="flex items-center gap-1.5 font-bold text-blue-400">
                                                    <Terminal size={13} /> Fibonacci Execution Trace
                                                </span>
                                                <span className="text-slate-400">
                                                    Step {fibStepIdx + 1} of {fibData.steps.length}
                                                </span>
                                            </div>
                                            <div className="text-slate-300 leading-relaxed pt-0.5">
                                                {currentFibStep.note}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── SUB-TOPIC 4.3: 0/1 KNAPSACK DP STUDIO (VISUALIZEDSA.COM) ── */}
                                {selectedTopicId === 3 && (
                                    <div className="space-y-4">
                                        {/* Presets & Capacity Toolbar */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs font-bold text-slate-800">Presets:</span>
                                                <button
                                                    onClick={() => handleKnapsackPreset([
                                                        { id: 1, weight: 3, value: 4 },
                                                        { id: 2, weight: 4, value: 5 },
                                                        { id: 3, weight: 2, value: 3 },
                                                        { id: 4, weight: 1, value: 2 }
                                                    ], 8)}
                                                    className="px-2.5 py-1 text-[11px] font-mono bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer font-semibold text-slate-700 shadow-2xs"
                                                >
                                                    Preset 1 (n=4, W=8)
                                                </button>
                                                <button
                                                    onClick={() => handleKnapsackPreset([
                                                        { id: 1, weight: 2, value: 3 },
                                                        { id: 2, weight: 3, value: 4 },
                                                        { id: 3, weight: 4, value: 5 }
                                                    ], 6)}
                                                    className="px-2.5 py-1 text-[11px] font-mono bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer font-semibold text-slate-700 shadow-2xs"
                                                >
                                                    Preset 2 (n=3, W=6)
                                                </button>
                                                <button
                                                    onClick={() => handleKnapsackPreset([
                                                        { id: 1, weight: 1, value: 1 },
                                                        { id: 2, weight: 2, value: 6 },
                                                        { id: 3, weight: 3, value: 10 },
                                                        { id: 4, weight: 5, value: 16 }
                                                    ], 7)}
                                                    className="px-2.5 py-1 text-[11px] font-mono bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer font-semibold text-slate-700 shadow-2xs"
                                                >
                                                    Preset 3 (n=4, W=7)
                                                </button>
                                                <button
                                                    onClick={handleKnapsackRandomize}
                                                    className="px-2 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer flex items-center gap-1"
                                                >
                                                    <Shuffle size={11} /> Randomize
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs font-mono">
                                                <span className="text-slate-500 font-semibold">Capacity (W):</span>
                                                <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                                                    <button
                                                        onClick={() => {
                                                            const newCap = Math.max(3, knapsackCapacity - 1);
                                                            setKnapsackCapacity(newCap);
                                                            setKnapsackStepIdx(0);
                                                            setKnapsackIsPlaying(false);
                                                        }}
                                                        className="w-7 h-7 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer border-r border-slate-200"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 text-center font-extrabold text-slate-900">{knapsackCapacity}</span>
                                                    <button
                                                        onClick={() => {
                                                            const newCap = Math.min(14, knapsackCapacity + 1);
                                                            setKnapsackCapacity(newCap);
                                                            setKnapsackStepIdx(0);
                                                            setKnapsackIsPlaying(false);
                                                        }}
                                                        className="w-7 h-7 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer border-l border-slate-200"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items Configuration Editor */}
                                        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                                    <Sliders size={13} className="text-blue-600" />
                                                    Configure Items (Weight $w$ & Value $v$):
                                                </span>
                                                <button
                                                    onClick={handleKnapsackAddItem}
                                                    disabled={knapsackItems.length >= 6}
                                                    className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg cursor-pointer flex items-center gap-1"
                                                >
                                                    <Plus size={12} /> Add Item
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                {knapsackItems.map((item, idx) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs font-mono text-xs"
                                                    >
                                                        <span className="font-extrabold text-blue-600">#{idx + 1}</span>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-slate-400 text-[10px]">w:</span>
                                                            <input
                                                                type="number"
                                                                value={item.weight}
                                                                onChange={e => handleKnapsackUpdateWeight(idx, e.target.value)}
                                                                className="w-10 px-1 py-0.5 text-center bg-slate-50 border border-slate-200 rounded font-bold text-slate-800"
                                                                min={1}
                                                                max={15}
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-slate-400 text-[10px]">v:</span>
                                                            <input
                                                                type="number"
                                                                value={item.value}
                                                                onChange={e => handleKnapsackUpdateValue(idx, e.target.value)}
                                                                className="w-10 px-1 py-0.5 text-center bg-slate-50 border border-slate-200 rounded font-bold text-slate-800"
                                                                min={1}
                                                                max={50}
                                                            />
                                                        </div>
                                                        {knapsackItems.length > 1 && (
                                                            <button
                                                                onClick={() => handleKnapsackDeleteItem(idx)}
                                                                className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                                                                title="Delete item"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Stepper Toolbar */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-100/80 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={handleKnapsackStepPrev}
                                                    disabled={knapsackStepIdx <= 0}
                                                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs"
                                                >
                                                    <SkipBack size={13} /> Prev
                                                </button>
                                                <button
                                                    onClick={handleKnapsackStepNext}
                                                    disabled={knapsackStepIdx >= knapsackSteps.length - 1}
                                                    className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg cursor-pointer flex items-center gap-1 shadow-xs"
                                                >
                                                    <SkipForward size={13} /> Next Step
                                                </button>
                                                <button
                                                    onClick={() => setKnapsackIsPlaying(!knapsackIsPlaying)}
                                                    className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs"
                                                >
                                                    {knapsackIsPlaying ? <Pause size={13} /> : <Play size={13} />}
                                                    {knapsackIsPlaying ? 'Pause' : 'Auto Play'}
                                                </button>
                                                <button
                                                    onClick={handleKnapsackReset}
                                                    className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer"
                                                    title="Reset playback"
                                                >
                                                    <RotateCcw size={14} />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 text-[10px] font-mono">
                                                    <button
                                                        onClick={() => setKnapsackSpeed(1100)}
                                                        className={`px-2 py-0.5 rounded ${knapsackSpeed === 1100 ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                                                    >
                                                        0.5x
                                                    </button>
                                                    <button
                                                        onClick={() => setKnapsackSpeed(700)}
                                                        className={`px-2 py-0.5 rounded ${knapsackSpeed === 700 ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                                                    >
                                                        1x
                                                    </button>
                                                    <button
                                                        onClick={() => setKnapsackSpeed(300)}
                                                        className={`px-2 py-0.5 rounded ${knapsackSpeed === 300 ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                                                    >
                                                        2x
                                                    </button>
                                                </div>

                                                <span className="text-xs font-mono font-bold text-slate-700">
                                                    Step {knapsackStepIdx} / {knapsackSteps.length - 1}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Scrubber slider */}
                                        <div className="px-1">
                                            <input
                                                type="range"
                                                min={0}
                                                max={knapsackSteps.length - 1}
                                                value={knapsackStepIdx}
                                                onChange={e => {
                                                    setKnapsackStepIdx(Number(e.target.value));
                                                    setKnapsackIsPlaying(false);
                                                }}
                                                className="w-full accent-blue-600 cursor-pointer"
                                            />
                                        </div>

                                        {/* Dynamic Decision & Formula Breakdown Card */}
                                        <div className="rounded-xl border transition-all duration-200 overflow-hidden">
                                            {currentKnapsackFrame.phase === 'init' && (
                                                <div className="p-3.5 bg-blue-50 border-blue-200 text-blue-900 text-xs font-mono space-y-1">
                                                    <div className="font-bold flex items-center gap-2">
                                                        <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[9px] font-black uppercase">
                                                            Initialise
                                                        </span>
                                                        <span>Base Cases Setup</span>
                                                    </div>
                                                    <p className="text-[11px] text-blue-800">
                                                        Base cases: <code className="font-bold bg-blue-100 px-1 rounded">dp[i][0] = 0</code> and <code className="font-bold bg-blue-100 px-1 rounded">dp[0][w] = 0</code> — all cells in row 0 and column 0 are initialized to zero.
                                                    </p>
                                                </div>
                                            )}

                                            {(currentKnapsackFrame.phase === 'lookup' || currentKnapsackFrame.phase === 'fill') && currentKnapsackFrame.currentCell && (
                                                (() => {
                                                    const [i, w] = currentKnapsackFrame.currentCell;
                                                    const item = currentKnapsackFrame.items[i - 1];
                                                    const prevSkip = currentKnapsackFrame.table[i - 1]?.[w];
                                                    const canTake = item.weight <= w;
                                                    const prevTake = canTake ? currentKnapsackFrame.table[i - 1]?.[w - item.weight] : null;
                                                    const takeVal = canTake && prevTake !== null ? item.value + prevTake : null;
                                                    const isTakeDecision = currentKnapsackFrame.decision === 'take';

                                                    return (
                                                        <div className={`p-3.5 border text-xs font-mono space-y-2 ${isTakeDecision ? 'bg-blue-50 border-blue-200 text-blue-950' : 'bg-emerald-50 border-emerald-200 text-emerald-950'}`}>
                                                            <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase text-white ${currentKnapsackFrame.phase === 'lookup' ? 'bg-amber-600' : isTakeDecision ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                                                                        {currentKnapsackFrame.phase.toUpperCase()}
                                                                    </span>
                                                                    <span className="font-extrabold text-sm">
                                                                        dp[{i}][{w}] = max(skip, take)
                                                                    </span>
                                                                </div>
                                                                <span className="text-[11px] text-slate-600 font-semibold">
                                                                    Evaluating Item #{i} (w={item.weight}, v={item.value}) at capacity w={w}
                                                                </span>
                                                            </div>

                                                            <div className="flex flex-wrap items-center gap-4 text-xs">
                                                                <div className={`px-2.5 py-1 rounded-md border ${!isTakeDecision ? 'bg-amber-100 border-amber-400 font-bold text-amber-900 ring-2 ring-amber-300' : 'bg-white border-slate-200 text-slate-600'}`}>
                                                                    <span>skip = dp[{i - 1}][{w}] = <strong>{prevSkip ?? '?'}</strong></span>
                                                                </div>

                                                                {canTake ? (
                                                                    <div className={`px-2.5 py-1 rounded-md border ${isTakeDecision ? 'bg-blue-100 border-blue-400 font-bold text-blue-900 ring-2 ring-blue-300' : 'bg-white border-slate-200 text-slate-600'}`}>
                                                                        <span>take = {item.value} + dp[{i - 1}][{w - item.weight}] = {item.value} + {prevTake ?? 0} = <strong>{takeVal ?? '?'}</strong></span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="px-2.5 py-1 rounded-md border bg-slate-100 border-slate-200 text-slate-400 line-through">
                                                                        <span>take — item weight {item.weight} &gt; capacity {w}</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {currentKnapsackFrame.phase === 'fill' && (
                                                                <div className={`text-xs font-bold pt-1 ${isTakeDecision ? 'text-blue-700' : 'text-emerald-700'}`}>
                                                                    Result: dp[{i}][{w}] = {currentKnapsackFrame.table[i][w]} ({isTakeDecision ? `TAKE item #${i}` : `SKIP item #${i}`})
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })()
                                            )}

                                            {currentKnapsackFrame.phase === 'traceback' && currentKnapsackFrame.currentCell && (
                                                <div className="p-3.5 bg-violet-50 border-violet-200 text-violet-950 text-xs font-mono space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 rounded bg-violet-600 text-white text-[9px] font-black uppercase">
                                                            Traceback
                                                        </span>
                                                        <span className="font-extrabold text-sm">Solution Recovery Backtrack</span>
                                                    </div>
                                                    <p className="text-xs text-violet-900 leading-relaxed font-semibold">
                                                        {currentKnapsackFrame.note}
                                                    </p>
                                                </div>
                                            )}

                                            {currentKnapsackFrame.phase === 'done' && (
                                                <div className="p-4 bg-emerald-50 border-emerald-300 text-emerald-950 text-xs font-mono space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black uppercase">
                                                                Optimal Solution Complete
                                                            </span>
                                                            <span className="font-black text-base text-emerald-900">
                                                                Max Value = {currentKnapsackFrame.table[currentKnapsackFrame.items.length][currentKnapsackFrame.capacity]}
                                                            </span>
                                                        </div>
                                                        <span className="text-[11px] font-bold text-emerald-800">
                                                            Selected Items: [{currentKnapsackFrame.chosenItems.map(i => `#${i}`).join(', ')}]
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-emerald-900">
                                                        {currentKnapsackFrame.note}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Split Visualizer Canvas: Items List + 2D DP Table */}
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                                            <div className="md:col-span-3 space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                                                    <span className="text-xs font-bold text-slate-800">Items List</span>
                                                    <span className="text-[10px] font-mono text-slate-500">n = {currentKnapsackFrame.items.length}</span>
                                                </div>

                                                <div className="space-y-1.5">
                                                    {currentKnapsackFrame.items.map((item, idx) => {
                                                        const itemNum = idx + 1;
                                                        const isCurrentEvaluated = currentKnapsackFrame.currentCell && currentKnapsackFrame.currentCell[0] === itemNum;
                                                        const isChosenInTraceback = currentKnapsackFrame.chosenItems.includes(itemNum);
                                                        const isTracebackPhase = currentKnapsackFrame.phase === 'traceback' || currentKnapsackFrame.phase === 'done';

                                                        return (
                                                            <div
                                                                key={item.id}
                                                                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 ${
                                                                    isChosenInTraceback
                                                                        ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-extrabold shadow-xs scale-102'
                                                                        : isCurrentEvaluated
                                                                        ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold ring-2 ring-amber-300'
                                                                        : 'bg-white border-slate-200 text-slate-700'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isChosenInTraceback ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                                                        #{itemNum}
                                                                    </span>
                                                                    <div className="flex flex-col text-[10px] leading-tight">
                                                                        <span>w={item.weight}</span>
                                                                        <span className="text-slate-500">v={item.value}</span>
                                                                    </div>
                                                                </div>

                                                                {isTracebackPhase && (
                                                                    isChosenInTraceback ? (
                                                                        <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black uppercase flex items-center gap-0.5">
                                                                            <Check size={10} /> TAKEN
                                                                        </span>
                                                                    ) : (
                                                                        <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 text-[9px] font-bold uppercase flex items-center gap-0.5">
                                                                            <X size={10} /> SKIP
                                                                        </span>
                                                                    )
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="md:col-span-9 p-3 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
                                                <table className="border-collapse mx-auto">
                                                    <thead>
                                                        <tr>
                                                            <th className="p-0 text-right pr-2 font-mono text-[10px] text-slate-400 font-normal" style={{ minWidth: 90 }}>
                                                                Capacity →
                                                            </th>
                                                            {Array.from({ length: currentKnapsackFrame.capacity + 1 }, (_, w) => (
                                                                <th key={w} className="pb-1.5 px-1 min-w-[34px] text-center font-mono text-xs font-bold text-slate-600">
                                                                    {w}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.from({ length: currentKnapsackFrame.items.length + 1 }, (_, i) => {
                                                            const isRow0 = i === 0;
                                                            const item = !isRow0 ? currentKnapsackFrame.items[i - 1] : null;
                                                            const isCurrentRow = currentKnapsackFrame.currentCell && currentKnapsackFrame.currentCell[0] === i;

                                                            return (
                                                                <tr key={i}>
                                                                    <td className="pr-2 pb-1 text-right">
                                                                        {isRow0 ? (
                                                                            <span className="text-[10px] font-mono text-slate-400 font-semibold">
                                                                                dp[0] (none)
                                                                            </span>
                                                                        ) : (
                                                                            <div className={`flex flex-col text-right font-mono leading-tight ${isCurrentRow ? 'text-blue-600 font-extrabold' : 'text-slate-700'}`}>
                                                                                <span className="text-xs font-bold">Item #{i}</span>
                                                                                <span className="text-[9px] text-slate-400">w={item.weight}, v={item.value}</span>
                                                                            </div>
                                                                        )}
                                                                    </td>

                                                                    {Array.from({ length: currentKnapsackFrame.capacity + 1 }, (_, w) => {
                                                                        const val = currentKnapsackFrame.table[i]?.[w];
                                                                        const isCellMatch = (pos, r, c) => pos && pos[0] === r && pos[1] === c;
                                                                        const isCurr = isCellMatch(currentKnapsackFrame.currentCell, i, w);
                                                                        const isLookupSkip = isCellMatch(currentKnapsackFrame.lookupSkip, i, w);
                                                                        const isLookupTake = isCellMatch(currentKnapsackFrame.lookupTake, i, w);
                                                                        const inTraceback = currentKnapsackFrame.tracebackPath.some(([r, c]) => r === i && c === w);
                                                                        const isFinalOptimal = currentKnapsackFrame.phase === 'done' && i === currentKnapsackFrame.items.length && w === currentKnapsackFrame.capacity;

                                                                        let cellStyle = 'bg-white border-slate-200 text-slate-700';

                                                                        if (i === 0 || w === 0) {
                                                                            cellStyle = currentKnapsackFrame.phase === 'init'
                                                                                ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                                                                                : 'bg-slate-100/70 border-slate-200 text-slate-400';
                                                                        }

                                                                        if (isLookupSkip) {
                                                                            cellStyle = currentKnapsackFrame.decision === 'skip'
                                                                                ? 'bg-amber-100 border-amber-500 text-amber-900 font-black ring-2 ring-amber-300 shadow-xs'
                                                                                : 'bg-amber-50 border-amber-300 text-amber-800 font-semibold';
                                                                        } else if (isLookupTake) {
                                                                            cellStyle = currentKnapsackFrame.decision === 'take'
                                                                                ? 'bg-blue-100 border-blue-500 text-blue-900 font-black ring-2 ring-blue-300 shadow-xs'
                                                                                : 'bg-blue-50 border-blue-300 text-blue-800 font-semibold';
                                                                        } else if (isCurr) {
                                                                            if (currentKnapsackFrame.phase === 'lookup') {
                                                                                cellStyle = 'bg-purple-100 border-purple-500 border-dashed text-purple-900 font-bold scale-105 shadow-xs';
                                                                            } else if (currentKnapsackFrame.phase === 'fill') {
                                                                                cellStyle = currentKnapsackFrame.decision === 'take'
                                                                                    ? 'bg-blue-100 border-blue-500 text-blue-900 font-black scale-110 shadow-md ring-2 ring-blue-300'
                                                                                    : 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black scale-110 shadow-md ring-2 ring-emerald-300';
                                                                            } else if (currentKnapsackFrame.phase === 'traceback') {
                                                                                cellStyle = 'bg-violet-100 border-violet-500 text-violet-900 font-black ring-2 ring-violet-300 scale-105 shadow-sm';
                                                                            }
                                                                        } else if (inTraceback) {
                                                                            cellStyle = 'bg-violet-100/80 border-violet-400 text-violet-900 font-bold';
                                                                        } else if (isFinalOptimal) {
                                                                            cellStyle = 'bg-emerald-500 border-emerald-600 text-white font-black ring-4 ring-emerald-200 scale-110 shadow-md';
                                                                        } else if (val === null) {
                                                                            cellStyle = 'bg-slate-50/50 border-dashed border-slate-200 text-slate-300 opacity-60';
                                                                        }

                                                                        return (
                                                                            <td key={w} className="pb-1 pr-1">
                                                                                <div className={`h-9 min-w-[34px] rounded-lg border-2 flex items-center justify-center font-mono text-xs transition-all duration-200 ${cellStyle}`}>
                                                                                    {val !== null ? val : '?'}
                                                                                </div>
                                                                            </td>
                                                                        );
                                                                    })}
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Legend Card */}
                                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                            <span className="text-xs font-bold text-slate-800">DP Matrix Color Legend:</span>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded border-2 bg-blue-50 border-blue-300 shrink-0" />
                                                    <span>Base cases (row 0, col 0)</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded border-2 border-dashed bg-purple-100 border-purple-500 shrink-0" />
                                                    <span>Cell being evaluated</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded border-2 bg-amber-100 border-amber-500 shrink-0" />
                                                    <span>Skip option (dp[i-1][w])</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded border-2 bg-blue-100 border-blue-500 shrink-0" />
                                                    <span>Take option (dp[i-1][w-wt])</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded border-2 bg-emerald-100 border-emerald-500 shrink-0" />
                                                    <span>Filled — skip chosen</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded border-2 bg-blue-100 border-blue-500 shrink-0 shadow-xs" />
                                                    <span>Filled — take chosen</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded border-2 bg-violet-100 border-violet-400 shrink-0" />
                                                    <span>Traceback path</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded border-2 bg-emerald-500 border-emerald-600 shrink-0" />
                                                    <span>Optimal result cell</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}

                        {/* MODULE 5: SEARCHING ALGORITHMS */}
                        {activeModuleNumber === 5 && (
                            <div className="space-y-4">
                                {/* Complexity & Live Metrics Header */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                            Time Complexity
                                        </span>
                                        <div className="text-sm font-black font-mono text-slate-900 flex items-center justify-between">
                                            <span>
                                                {activeSearchAlgo === 'linear' ? 'O(n)' : activeSearchAlgo === 'binary' ? 'O(log n)' : 'O(n) avg'}
                                            </span>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-blue-100 text-blue-800">
                                                Best: O(1)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                            Space Complexity
                                        </span>
                                        <div className="text-sm font-black font-mono text-slate-900 flex items-center justify-between">
                                            <span>O(1)</span>
                                            <span className="text-[10px] font-semibold text-slate-500">Iterative In-Place</span>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                            Target Value
                                        </span>
                                        <div className="text-sm font-black font-mono text-blue-700 flex items-center justify-between">
                                            <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200">{searchTarget}</span>
                                            <span className="text-[10px] font-mono text-slate-500">
                                                {searchArr.includes(searchTarget) ? 'In Array' : 'Not In Array'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                            Comparisons &amp; Status
                                        </span>
                                        <div className="text-sm font-black font-mono flex items-center justify-between">
                                            <span className="text-slate-900">{currentSearchStep.comparisons ?? 0} comps</span>
                                            <span
                                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1 ${
                                                    currentSearchStep.status === 'found'
                                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                        : currentSearchStep.status === 'not_found'
                                                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                                                }`}
                                            >
                                                {currentSearchStep.status === 'found' ? (
                                                    <><Check size={10} /> Found</>
                                                ) : currentSearchStep.status === 'not_found' ? (
                                                    <><X size={10} /> Not Found</>
                                                ) : (
                                                    'Searching'
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Interactive Controls Bar */}
                                <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {activeSearchAlgo !== 'quickselect' ? (
                                            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                                                <span className="text-xs font-mono font-bold text-slate-500 pl-1.5">Target:</span>
                                                <input
                                                    type="number"
                                                    value={searchTargetInput}
                                                    onChange={e => setSearchTargetInput(e.target.value)}
                                                    placeholder="Val..."
                                                    className="w-16 px-2 py-0.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded font-bold text-slate-800 focus:outline-none"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const num = parseInt(searchTargetInput, 10);
                                                        if (!isNaN(num)) {
                                                            setSearchTarget(num);
                                                            setSearchStepIdx(0);
                                                            setSearchIsPlaying(false);
                                                            addLog(`Set search target to: ${num}`);
                                                        }
                                                    }}
                                                    className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded cursor-pointer"
                                                >
                                                    Set
                                                </button>
                                                <button
                                                    onClick={handlePickRandomTarget}
                                                    title="Pick random element present in array (guaranteed hit)"
                                                    className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded cursor-pointer flex items-center gap-0.5"
                                                >
                                                    <Sparkles size={11} /> Hit
                                                </button>
                                                <button
                                                    onClick={handlePickMissTarget}
                                                    title="Pick target not in array (tests worst case / not-found)"
                                                    className="px-2 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded cursor-pointer flex items-center gap-0.5"
                                                >
                                                    <X size={11} /> Miss
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                                                <span className="text-xs font-mono font-bold text-slate-500 pl-1.5">k-th Smallest:</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={searchArr.length}
                                                    value={searchK}
                                                    onChange={e => {
                                                        const kVal = Math.max(1, Math.min(searchArr.length, parseInt(e.target.value, 10) || 1));
                                                        setSearchK(kVal);
                                                        setSearchStepIdx(0);
                                                        setSearchIsPlaying(false);
                                                    }}
                                                    className="w-14 px-2 py-0.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded font-bold text-slate-800 focus:outline-none"
                                                />
                                                <span className="text-[10px] text-slate-400 font-mono pr-1">(1..{searchArr.length})</span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleRandomizeSearchArray(8)}
                                                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer flex items-center gap-1 shadow-2xs"
                                            >
                                                <RefreshCw size={11} /> Randomize Array
                                            </button>
                                        </div>
                                    </div>

                                    {/* Playback Controls Toolbar */}
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => {
                                                if (searchStepIdx > 0) {
                                                    setSearchStepIdx(searchStepIdx - 1);
                                                    setSearchIsPlaying(false);
                                                }
                                            }}
                                            disabled={searchStepIdx === 0}
                                            className="p-1.5 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 cursor-pointer shadow-2xs"
                                            title="Previous Step"
                                        >
                                            <SkipBack size={13} />
                                        </button>
                                        <button
                                            onClick={() => setSearchIsPlaying(!searchIsPlaying)}
                                            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer flex items-center gap-1 shadow-xs"
                                        >
                                            {searchIsPlaying ? <Pause size={13} /> : <Play size={13} />}
                                            {searchIsPlaying ? 'Pause' : 'Play'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (searchStepIdx < searchSteps.length - 1) {
                                                    setSearchStepIdx(searchStepIdx + 1);
                                                    setSearchIsPlaying(false);
                                                }
                                            }}
                                            disabled={searchStepIdx >= searchSteps.length - 1}
                                            className="p-1.5 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 cursor-pointer shadow-2xs"
                                            title="Next Step"
                                        >
                                            <SkipForward size={13} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSearchStepIdx(0);
                                                setSearchIsPlaying(false);
                                                addLog('Reset search visualizer.');
                                            }}
                                            className="p-1.5 text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer shadow-2xs"
                                            title="Reset"
                                        >
                                            <RotateCcw size={13} />
                                        </button>

                                        {/* Speed controls */}
                                        <div className="flex items-center gap-0.5 bg-slate-200/80 p-0.5 rounded-lg text-[10px] font-mono font-bold">
                                            <button
                                                onClick={() => setSearchSpeed(1100)}
                                                className={`px-1.5 py-0.5 rounded cursor-pointer ${searchSpeed === 1100 ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                                            >
                                                0.5x
                                            </button>
                                            <button
                                                onClick={() => setSearchSpeed(700)}
                                                className={`px-1.5 py-0.5 rounded cursor-pointer ${searchSpeed === 700 ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                                            >
                                                1x
                                            </button>
                                            <button
                                                onClick={() => setSearchSpeed(350)}
                                                className={`px-1.5 py-0.5 rounded cursor-pointer ${searchSpeed === 350 ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                                            >
                                                2x
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Mathematical Breakdown & Step Explanation Card */}
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-mono font-bold uppercase">
                                                Step {searchStepIdx + 1}/{searchSteps.length}
                                            </span>
                                            <span className="text-xs font-bold text-slate-800">
                                                {activeSearchAlgo === 'linear'
                                                    ? 'Linear Sequential Scan'
                                                    : activeSearchAlgo === 'binary'
                                                    ? 'Binary Search (Sorted Interval Division)'
                                                    : 'Quickselect (Order Statistics Search)'}
                                            </span>
                                        </div>

                                        {/* Dynamic Pointer Badges */}
                                        <div className="flex items-center gap-2 font-mono text-[11px]">
                                            {activeSearchAlgo === 'binary' && currentSearchStep.low !== undefined && (
                                                <>
                                                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                                                        Low = {currentSearchStep.low}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                                                        Mid = {currentSearchStep.mid}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold border border-purple-300">
                                                        High = {currentSearchStep.high}
                                                    </span>
                                                </>
                                            )}
                                            {activeSearchAlgo === 'linear' && currentSearchStep.currentIndex !== undefined && currentSearchStep.currentIndex >= 0 && (
                                                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold border border-blue-300">
                                                    Current Index i = {currentSearchStep.currentIndex}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Formula & Natural Language Description */}
                                    {currentSearchStep.formula && (
                                        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-600 bg-white p-2 rounded-lg border border-slate-200/90">
                                            <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                                Formula
                                            </span>
                                            <span>{currentSearchStep.formula}</span>
                                        </div>
                                    )}

                                    <p className="text-xs text-slate-800 font-mono leading-relaxed font-medium">
                                        {currentSearchStep.desc || currentSearchStep.note}
                                    </p>
                                </div>

                                {/* Array Visualizer Canvas */}
                                <div className="min-h-[200px] bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-center items-center gap-4 shadow-xs">
                                    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
                                        {currentSearchStep.arr.map((val, idx) => {
                                            const isMid = currentSearchStep.mid === idx;
                                            const isLow = currentSearchStep.low === idx;
                                            const isHigh = currentSearchStep.high === idx;
                                            const isCurrentScan = currentSearchStep.currentIndex === idx;
                                            const isFound = currentSearchStep.status === 'found' && (isMid || isCurrentScan || currentSearchStep.pivotIdx === idx);
                                            const isEliminated = currentSearchStep.low !== undefined && (idx < currentSearchStep.low || idx > currentSearchStep.high);
                                            const isPivot = currentSearchStep.pivotIdx === idx;

                                            // Combined pointer label if multiple pointers coincide on same index
                                            const pointers = [];
                                            if (isLow) pointers.push('L');
                                            if (isMid) pointers.push('M');
                                            if (isHigh) pointers.push('H');
                                            if (isCurrentScan) pointers.push('i');
                                            if (isPivot) pointers.push('PIV');

                                            return (
                                                <div key={idx} className="flex flex-col items-center gap-1.5">
                                                    {/* Floating Pointer Indicator Badge with Downward Arrow */}
                                                    <div className="h-6 flex items-center justify-center">
                                                        {pointers.length > 0 && (
                                                            <div
                                                                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-black shadow-xs transition-all ${
                                                                    isFound
                                                                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                                                                        : isMid || isCurrentScan
                                                                        ? 'bg-amber-500 text-white ring-2 ring-amber-300 animate-pulse'
                                                                        : isLow
                                                                        ? 'bg-emerald-500 text-white'
                                                                        : isHigh
                                                                        ? 'bg-purple-600 text-white'
                                                                        : 'bg-blue-600 text-white'
                                                                }`}
                                                            >
                                                                <ArrowDown size={10} />
                                                                <span>{pointers.join(' · ')}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Main Element Card */}
                                                    <div
                                                        className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl flex flex-col items-center justify-center font-mono font-black text-base sm:text-lg transition-all duration-200 select-none ${
                                                            isFound
                                                                ? 'bg-emerald-600 text-white shadow-lg ring-4 ring-emerald-300 scale-110 z-10'
                                                                : isMid || isCurrentScan
                                                                ? 'bg-amber-500 text-white shadow-md ring-4 ring-amber-200 scale-105 z-10'
                                                                : isEliminated
                                                                ? 'bg-slate-50 text-slate-300 border-2 border-dashed border-slate-200 opacity-30 grayscale'
                                                                : 'bg-slate-900 text-white border-2 border-slate-800 shadow-xs hover:border-slate-700'
                                                        }`}
                                                    >
                                                        <span>{val}</span>
                                                        {isFound && (
                                                            <span className="text-[10px] text-emerald-100 flex items-center gap-0.5 font-sans font-bold">
                                                                <Check size={11} /> MATCH
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Index Tag */}
                                                    <span className={`text-[10px] font-mono font-bold transition-all ${
                                                        isFound ? 'text-emerald-700 font-extrabold' : isMid || isCurrentScan ? 'text-amber-700 font-extrabold' : 'text-slate-400'
                                                    }`}>
                                                        [{idx}]
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MODULE 6: SORTING ALGORITHMS */}
                        {activeModuleNumber === 6 && (
                            <div className="space-y-4">
                                {/* Analytical Metrics & Complexity Inspector */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                            Time Complexity
                                        </span>
                                        <div className="text-sm font-black font-mono text-slate-900 flex items-center justify-between">
                                            <span>
                                                {activeSortAlgo === 'bubble'
                                                    ? 'O(n²)'
                                                    : activeSortAlgo === 'selection'
                                                    ? 'O(n²)'
                                                    : activeSortAlgo === 'insertion'
                                                    ? 'O(n²)'
                                                    : activeSortAlgo === 'merge'
                                                    ? 'O(n log n)'
                                                    : activeSortAlgo === 'quick'
                                                    ? 'O(n log n)'
                                                    : activeSortAlgo === 'heap'
                                                    ? 'O(n log n)'
                                                    : 'O(n + k)'}
                                            </span>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-blue-100 text-blue-800">
                                                {activeSortAlgo === 'bubble' || activeSortAlgo === 'insertion'
                                                    ? 'Best: O(n)'
                                                    : activeSortAlgo === 'counting'
                                                    ? 'Non-Comparison'
                                                    : 'Best: O(n log n)'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                            Space Complexity
                                        </span>
                                        <div className="text-sm font-black font-mono text-slate-900 flex items-center justify-between">
                                            <span>
                                                {activeSortAlgo === 'merge'
                                                    ? 'O(n)'
                                                    : activeSortAlgo === 'quick'
                                                    ? 'O(log n)'
                                                    : activeSortAlgo === 'counting'
                                                    ? 'O(k)'
                                                    : 'O(1)'}
                                            </span>
                                            <span className="text-[10px] font-semibold text-slate-500">
                                                {activeSortAlgo === 'merge' || activeSortAlgo === 'counting'
                                                    ? 'Auxiliary Buffer'
                                                    : 'In-Place'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                            Comparisons &amp; Shifts
                                        </span>
                                        <div className="text-sm font-black font-mono text-blue-700 flex items-center justify-between">
                                            <span>{currentSortStep.comparisons ?? 0} comps</span>
                                            <span className="text-slate-600 font-normal text-xs">{currentSortStep.swaps ?? 0} swaps</span>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                            Sorting Status
                                        </span>
                                        <div className="text-sm font-black font-mono flex items-center justify-between">
                                            <span className="text-slate-800 capitalize">{activeSortAlgo}</span>
                                            <span
                                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1 ${
                                                    currentSortStep.sorted && currentSortStep.sorted.length === currentSortStep.arr.length
                                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                                                }`}
                                            >
                                                {currentSortStep.sorted && currentSortStep.sorted.length === currentSortStep.arr.length ? (
                                                    <><Check size={10} /> Sorted</>
                                                ) : (
                                                    'In Progress'
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Interactive Data & Playback Toolbar */}
                                <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* Preset Buttons */}
                                        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                                            <span className="text-[10px] font-mono font-bold text-slate-400 pl-1 pr-0.5">Preset:</span>
                                            <button
                                                onClick={() => handleSortArrayPreset('random', 8)}
                                                className="px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                                            >
                                                Random
                                            </button>
                                            <button
                                                onClick={() => handleSortArrayPreset('reversed', 8)}
                                                className="px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                                                title="Reversed array (worst-case scenario)"
                                            >
                                                Reversed
                                            </button>
                                            <button
                                                onClick={() => handleSortArrayPreset('nearly', 8)}
                                                className="px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded cursor-pointer"
                                                title="Nearly sorted array (best-case scenario for Insertion Sort)"
                                            >
                                                Nearly Sorted
                                            </button>
                                            <button
                                                onClick={() => handleSortArrayPreset('few-unique', 8)}
                                                className="px-2 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-50 rounded cursor-pointer"
                                                title="Array with duplicates"
                                            >
                                                Duplicates
                                            </button>
                                        </div>

                                        <button
                                            onClick={handleSortArrayReset}
                                            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer flex items-center gap-1 shadow-2xs"
                                        >
                                            <RefreshCw size={11} /> Randomize
                                        </button>
                                    </div>

                                    {/* Stepper Toolbar */}
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => {
                                                if (sortStepIdx > 0) {
                                                    setSortStepIdx(sortStepIdx - 1);
                                                    setSortIsPlaying(false);
                                                }
                                            }}
                                            disabled={sortStepIdx === 0}
                                            className="p-1.5 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 cursor-pointer shadow-2xs"
                                            title="Previous Step"
                                        >
                                            <SkipBack size={13} />
                                        </button>
                                        <button
                                            onClick={() => setSortIsPlaying(!sortIsPlaying)}
                                            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer flex items-center gap-1 shadow-xs"
                                        >
                                            {sortIsPlaying ? <Pause size={13} /> : <Play size={13} />}
                                            {sortIsPlaying ? 'Pause' : 'Play'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (sortStepIdx < sortSteps.length - 1) {
                                                    setSortStepIdx(sortStepIdx + 1);
                                                    setSortIsPlaying(false);
                                                }
                                            }}
                                            disabled={sortStepIdx >= sortSteps.length - 1}
                                            className="p-1.5 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 cursor-pointer shadow-2xs"
                                            title="Next Step"
                                        >
                                            <SkipForward size={13} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortStepIdx(0);
                                                setSortIsPlaying(false);
                                                addLog('Reset sorting visualizer.');
                                            }}
                                            className="p-1.5 text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer shadow-2xs"
                                            title="Reset"
                                        >
                                            <RotateCcw size={13} />
                                        </button>

                                        {/* Speed Controls */}
                                        <div className="flex items-center gap-0.5 bg-slate-200/80 p-0.5 rounded-lg text-[10px] font-mono font-bold">
                                            <button
                                                onClick={() => setSortSpeed(1000)}
                                                className={`px-1.5 py-0.5 rounded cursor-pointer ${sortSpeed === 1000 ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                                            >
                                                0.5x
                                            </button>
                                            <button
                                                onClick={() => setSortSpeed(650)}
                                                className={`px-1.5 py-0.5 rounded cursor-pointer ${sortSpeed === 650 ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                                            >
                                                1x
                                            </button>
                                            <button
                                                onClick={() => setSortSpeed(300)}
                                                className={`px-1.5 py-0.5 rounded cursor-pointer ${sortSpeed === 300 ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                                            >
                                                2x
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Step Information & Narrative Card */}
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-mono font-bold uppercase">
                                                Step {sortStepIdx + 1}/{sortSteps.length}
                                            </span>
                                            <span className="text-xs font-bold text-slate-800 capitalize">
                                                {activeSortAlgo} Sort Phase
                                            </span>
                                        </div>

                                        {/* Color Legend Badges */}
                                        <div className="flex items-center gap-3 text-[11px] font-mono">
                                            <span className="flex items-center gap-1 text-amber-700 font-semibold">
                                                <span className="w-2.5 h-2.5 rounded bg-amber-400" /> Comparing
                                            </span>
                                            <span className="flex items-center gap-1 text-rose-700 font-semibold">
                                                <span className="w-2.5 h-2.5 rounded bg-rose-500" /> Swapping
                                            </span>
                                            {(activeSortAlgo === 'quick' || activeSortAlgo === 'heap') && (
                                                <span className="flex items-center gap-1 text-purple-700 font-semibold">
                                                    <span className="w-2.5 h-2.5 rounded bg-purple-600" /> {activeSortAlgo === 'heap' ? 'Heap Root' : 'Pivot'}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                                                <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Sorted
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-800 font-mono leading-relaxed font-medium">
                                        {currentSortStep.desc}
                                    </p>
                                </div>

                                {/* Visualizer Canvas: Switching between Comparison Bar Chart and Counting Sort */}
                                {activeSortAlgo !== 'counting' ? (
                                    /* ── Comparison-based Vertical Bar Chart ────────────────── */
                                    <div className="h-60 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 flex items-end justify-center gap-2 sm:gap-3 shadow-xs overflow-x-auto">
                                        {currentSortStep.arr.map((val, idx) => {
                                            const isComparing = currentSortStep.comparing && currentSortStep.comparing.includes(idx);
                                            const isSwapping = currentSortStep.swapping && currentSortStep.swapping.includes(idx);
                                            const isSorted = currentSortStep.sorted && currentSortStep.sorted.includes(idx);
                                            const isPivot = currentSortStep.pivot === idx;
                                            const maxVal = Math.max(...currentSortStep.arr, 1);
                                            const barHeightPx = Math.max(12, Math.round((val / maxVal) * 144));

                                            return (
                                                <div key={idx} className="h-full flex flex-col justify-end items-center gap-1.5 flex-1 min-w-[28px] max-w-[52px]">
                                                    <span className={`text-[11px] font-mono font-bold transition-all ${
                                                        isSorted ? 'text-emerald-700 font-black' : isSwapping ? 'text-rose-700 font-black' : isComparing ? 'text-amber-700 font-black' : 'text-slate-800'
                                                    }`}>
                                                        {val}
                                                    </span>
                                                    <div
                                                        style={{ height: `${barHeightPx}px` }}
                                                        className={`w-full rounded-t-lg transition-all duration-200 ${
                                                            isSwapping
                                                                ? 'bg-rose-500 shadow-md ring-4 ring-rose-200 scale-105'
                                                                : isComparing
                                                                ? 'bg-amber-400 shadow-md ring-4 ring-amber-200 scale-102'
                                                                : isPivot
                                                                ? 'bg-purple-600 shadow-md ring-4 ring-purple-200'
                                                                : isSorted
                                                                ? 'bg-emerald-500 shadow-xs ring-2 ring-emerald-200'
                                                                : 'bg-slate-900'
                                                        }`}
                                                    />
                                                    <span className="text-[10px] text-slate-400 font-mono">[{idx}]</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    /* ── Specialized Counting Sort Multi-Array Studio ───────── */
                                    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                                        {/* Array 1: Input Array (Proportional Bars) */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700">
                                                <span>1. Input Array (arr):</span>
                                                <span className="text-[10px] text-slate-400">n = {currentSortStep.arr.length}</span>
                                            </div>
                                            <div className="h-32 flex items-end gap-2 sm:gap-3 pt-2 overflow-x-auto">
                                                {currentSortStep.arr.map((val, idx) => {
                                                    const isInputActive = currentSortStep.activeInputIdx === idx;
                                                    const maxInputVal = Math.max(...currentSortStep.arr, 1);
                                                    const barHeightPx = Math.max(12, Math.round((val / maxInputVal) * 76));
                                                    return (
                                                        <div key={idx} className="h-full flex flex-col justify-end items-center gap-1 min-w-[36px] flex-1 max-w-[48px]">
                                                            <span className={`text-[11px] font-mono font-bold ${isInputActive ? 'text-amber-600 font-black' : 'text-slate-800'}`}>
                                                                {val}
                                                            </span>
                                                            <div
                                                                style={{ height: `${barHeightPx}px` }}
                                                                className={`w-full rounded-t-lg transition-all duration-200 ${
                                                                    isInputActive
                                                                        ? 'bg-amber-500 ring-2 ring-amber-300 scale-105'
                                                                        : 'bg-slate-900'
                                                                }`}
                                                            />
                                                            <span className="text-[9px] font-mono text-slate-400">[{idx}]</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Array 2: Frequency & Cumulative Count Array */}
                                        <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700">
                                                <span>2. Frequency &amp; Cumulative Array (count[0..k]):</span>
                                                <span className="text-[10px] text-blue-600 font-bold uppercase">{currentSortStep.countingPhase} phase</span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-1">
                                                {currentSortStep.counts?.map((countVal, valIdx) => {
                                                    const isCountActive = currentSortStep.activeCountIdx === valIdx;
                                                    return (
                                                        <div key={valIdx} className="flex flex-col items-center gap-1">
                                                            <span className="text-[9px] font-mono font-bold text-slate-500">val={valIdx}</span>
                                                            <div
                                                                className={`w-10 h-9 rounded-lg flex items-center justify-center font-mono font-black text-sm border transition-all ${
                                                                    isCountActive
                                                                        ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300 scale-105'
                                                                        : 'bg-white text-slate-800 border-slate-300 shadow-2xs'
                                                                }`}
                                                            >
                                                                {countVal}
                                                            </div>
                                                            <span className="text-[8px] font-mono text-slate-400">count</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Array 3: Output Sorted Array */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700">
                                                <span>3. Output Sorted Array:</span>
                                                <span className="text-[10px] text-emerald-600 font-bold">Stable In-Order</span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {currentSortStep.output?.map((outVal, outIdx) => {
                                                    const isOutputActive = currentSortStep.activeOutputIdx === outIdx;
                                                    const hasValue = outVal !== null;
                                                    return (
                                                        <div key={outIdx} className="flex flex-col items-center gap-1">
                                                            <div
                                                                className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-black text-sm border-2 transition-all ${
                                                                    isOutputActive
                                                                        ? 'bg-emerald-600 text-white border-emerald-600 ring-4 ring-emerald-200 scale-110 shadow-md'
                                                                        : hasValue
                                                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                                                                        : 'bg-slate-100 text-slate-300 border-dashed border-slate-300'
                                                                }`}
                                                            >
                                                                {hasValue ? outVal : '-'}
                                                            </div>
                                                            <span className="text-[9px] font-mono text-slate-400">[{outIdx}]</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* MODULE 7: GRAPH THEORY & BST (visualizedsa.com/visualizers/dijkstra) */}
                        {activeModuleNumber === 7 && (
                            <div className="space-y-4">
                                {/* GRAPH ALGORITHMS VIEW (Dijkstra, BFS, DFS, Kruskal, Floyd-Warshall, Adjacency) */}
                                {activeGraphAlgo !== 'bst' ? (
                                    <div className="space-y-4">
                                        {/* Algorithm Metrics Bar */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                                    Algorithm
                                                </span>
                                                <div className="text-sm font-black font-mono text-slate-800 flex items-center gap-1.5 capitalize">
                                                    <Network size={14} className="text-blue-600" />
                                                    {activeGraphAlgo === 'dijkstra' ? "Dijkstra's Shortest Path" :
                                                     activeGraphAlgo === 'bfs' ? 'Breadth-First Search (BFS)' :
                                                     activeGraphAlgo === 'dfs' ? 'Depth-First Search (DFS)' :
                                                     activeGraphAlgo === 'kruskal' ? "Kruskal's MST & DSU" :
                                                     activeGraphAlgo === 'floyd' ? 'Floyd-Warshall All-Pairs' :
                                                     'Adjacency Representation'}
                                                </div>
                                            </div>

                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                                    Time Complexity
                                                </span>
                                                <div className="text-sm font-black font-mono text-blue-700">
                                                    {activeGraphAlgo === 'dijkstra' ? 'O((V + E) log V)' :
                                                     activeGraphAlgo === 'bfs' || activeGraphAlgo === 'dfs' ? 'O(V + E)' :
                                                     activeGraphAlgo === 'kruskal' ? 'O(E log E)' :
                                                     activeGraphAlgo === 'floyd' ? 'O(V³)' : 'O(V²)'}
                                                </div>
                                            </div>

                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                                    Source Vertex
                                                </span>
                                                <div className="text-sm font-black font-mono text-indigo-700 flex items-center justify-between">
                                                    <span>Node '{graphStartNode}'</span>
                                                    <span className="text-[10px] text-slate-500 font-normal">|V| = {graphData.nodes.length}, |E| = {graphData.edges.length}</span>
                                                </div>
                                            </div>

                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                                    Execution Step
                                                </span>
                                                <div className="text-sm font-black font-mono flex items-center justify-between">
                                                    <span className="text-slate-800">
                                                        {graphStepIdx + 1} / {graphSteps.length}
                                                    </span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1 ${
                                                        currentGraphStep.phase === 'complete'
                                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                                                    }`}>
                                                        {currentGraphStep.phase === 'complete' ? <><Check size={10} /> Completed</> : 'Running'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Presets & Playback Controls Bar */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            {/* Left: Presets and Source Node Selector */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                                                    <span className="text-[10px] font-mono font-bold text-slate-400 pl-1 pr-0.5">Preset:</span>
                                                    {Object.entries(GRAPH_PRESETS).map(([k, p]) => (
                                                        <button
                                                            key={k}
                                                            onClick={() => handleGraphPresetChange(k)}
                                                            className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer ${
                                                                graphPresetKey === k
                                                                    ? 'bg-slate-900 text-white'
                                                                    : 'text-slate-700 hover:bg-slate-100'
                                                            }`}
                                                        >
                                                            {k === 'standard' ? 'Standard' : k === 'dense' ? 'Dense Mesh' : 'DAG / Flow'}
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Traversal Toggle for 7.13 BFS & DFS */}
                                                {selectedTopicId === 13 && (
                                                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                                                        <span className="text-[10px] font-mono font-bold text-slate-400 pl-1 pr-0.5">Mode:</span>
                                                        <button
                                                            onClick={() => { setGraphTraversalMode('bfs'); setGraphStepIdx(0); setGraphIsPlaying(false); }}
                                                            className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer ${
                                                                graphTraversalMode === 'bfs' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                                                            }`}
                                                        >
                                                            BFS (Queue)
                                                        </button>
                                                        <button
                                                            onClick={() => { setGraphTraversalMode('dfs'); setGraphStepIdx(0); setGraphIsPlaying(false); }}
                                                            className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer ${
                                                                graphTraversalMode === 'dfs' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                                                            }`}
                                                        >
                                                            DFS (Stack)
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Source Node Buttons */}
                                                {(activeGraphAlgo === 'dijkstra' || activeGraphAlgo === 'bfs' || activeGraphAlgo === 'dfs') && (
                                                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                                                        <span className="text-[10px] font-mono font-bold text-slate-400 pl-1 pr-0.5">Source:</span>
                                                        {graphData.nodes.map(node => (
                                                            <button
                                                                key={node.id}
                                                                onClick={() => handleSelectGraphStartNode(node.id)}
                                                                className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs cursor-pointer ${
                                                                    graphStartNode === node.id
                                                                        ? 'bg-blue-600 text-white shadow-2xs'
                                                                        : 'text-slate-700 hover:bg-slate-100'
                                                                }`}
                                                            >
                                                                {node.id}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                <button
                                                    onClick={handleRandomizeGraphWeights}
                                                    className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg shadow-2xs cursor-pointer flex items-center gap-1"
                                                    title="Randomize edge weights"
                                                >
                                                    <Shuffle size={12} /> Randomize Weights
                                                </button>
                                            </div>

                                            {/* Right: Step Playback Controls */}
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                                                    <button
                                                        onClick={() => {
                                                            setGraphIsPlaying(false);
                                                            setGraphStepIdx(prev => Math.max(0, prev - 1));
                                                        }}
                                                        disabled={graphStepIdx === 0}
                                                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                                        title="Previous step"
                                                    >
                                                        <SkipBack size={14} />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            if (graphStepIdx >= graphSteps.length - 1) {
                                                                setGraphStepIdx(0);
                                                            }
                                                            setGraphIsPlaying(!graphIsPlaying);
                                                        }}
                                                        className="px-2.5 py-1 text-xs font-bold bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 cursor-pointer"
                                                    >
                                                        {graphIsPlaying ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Play</>}
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setGraphIsPlaying(false);
                                                            setGraphStepIdx(prev => Math.min(graphSteps.length - 1, prev + 1));
                                                        }}
                                                        disabled={graphStepIdx >= graphSteps.length - 1}
                                                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                                        title="Next step"
                                                    >
                                                        <SkipForward size={14} />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setGraphIsPlaying(false);
                                                            setGraphStepIdx(0);
                                                        }}
                                                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                                                        title="Reset to beginning"
                                                    >
                                                        <RotateCcw size={14} />
                                                    </button>
                                                </div>

                                                {/* Speed Selector */}
                                                <div className="flex items-center gap-0.5 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs text-[10px] font-mono">
                                                    {[
                                                        { label: '0.5x', speed: 1400 },
                                                        { label: '1x', speed: 900 },
                                                        { label: '2x', speed: 450 }
                                                    ].map(sp => (
                                                        <button
                                                            key={sp.label}
                                                            onClick={() => setGraphSpeed(sp.speed)}
                                                            className={`px-1.5 py-0.5 rounded font-bold cursor-pointer ${
                                                                graphSpeed === sp.speed
                                                                    ? 'bg-slate-900 text-white'
                                                                    : 'text-slate-600 hover:bg-slate-100'
                                                            }`}
                                                        >
                                                            {sp.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Step Explanation Banner */}
                                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-1.5 font-bold font-mono text-slate-800">
                                                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                                    <span>Phase: {currentGraphStep.phase || 'Execution'}</span>
                                                </div>
                                                {/* Color Legend Badges */}
                                                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
                                                    <span className="flex items-center gap-1 text-blue-700 font-semibold">
                                                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Active
                                                    </span>
                                                    <span className="flex items-center gap-1 text-amber-700 font-semibold">
                                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Evaluating
                                                    </span>
                                                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Settled / Tree Edge
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-800 font-mono leading-relaxed font-medium">
                                                {currentGraphStep.desc}
                                            </p>
                                        </div>

                                        {/* ── Interactive SVG Graph Canvas ── */}
                                        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs relative overflow-hidden">
                                            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                                                <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                                    <Eye size={13} className="text-blue-600" />
                                                    Interactive Graph Topology (Click node to set source)
                                                </span>
                                                <span className="text-[10px] font-mono text-slate-400">
                                                    Weighted Undirected Graph
                                                </span>
                                            </div>

                                            <div className="w-full flex items-center justify-center">
                                                <svg viewBox="0 0 640 280" className="w-full max-w-[640px] h-auto select-none overflow-visible">
                                                    <defs>
                                                        <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
                                                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2563eb" floodOpacity="0.4" />
                                                        </filter>
                                                    </defs>

                                                    {/* Render Edges */}
                                                    {graphData.edges.map(edge => {
                                                        const uNode = graphData.nodes.find(n => n.id === edge.u);
                                                        const vNode = graphData.nodes.find(n => n.id === edge.v);
                                                        if (!uNode || !vNode) return null;

                                                        const isTreeEdge = currentGraphStep.treeEdges?.some(
                                                            te => te.edgeId === edge.id || (te.from === edge.u && te.to === edge.v) || (te.from === edge.v && te.to === edge.u)
                                                        );
                                                        const isMstEdge = currentGraphStep.mstEdges?.includes(edge.id);
                                                        const isRejected = currentGraphStep.rejectedEdges?.includes(edge.id);
                                                        const isActiveEdge = currentGraphStep.activeEdge === edge.id;

                                                        const midX = (uNode.x + vNode.x) / 2;
                                                        const midY = (uNode.y + vNode.y) / 2;

                                                        let strokeColor = '#cbd5e1';
                                                        let strokeWidth = 2;
                                                        let strokeDash = undefined;

                                                        if (isTreeEdge || isMstEdge) {
                                                            strokeColor = '#10b981';
                                                            strokeWidth = 3.8;
                                                        } else if (isActiveEdge) {
                                                            strokeColor = '#f59e0b';
                                                            strokeWidth = 3.5;
                                                            strokeDash = '5,4';
                                                        } else if (isRejected) {
                                                            strokeColor = '#f43f5e';
                                                            strokeWidth = 2.2;
                                                            strokeDash = '4,4';
                                                        }

                                                        return (
                                                            <g key={edge.id} className="transition-all duration-300">
                                                                <line
                                                                    x1={uNode.x}
                                                                    y1={uNode.y}
                                                                    x2={vNode.x}
                                                                    y2={vNode.y}
                                                                    stroke={strokeColor}
                                                                    strokeWidth={strokeWidth}
                                                                    strokeDasharray={strokeDash}
                                                                    strokeLinecap="round"
                                                                />
                                                                {/* Edge Weight Bubble */}
                                                                <g transform={`translate(${midX}, ${midY})`}>
                                                                    <rect
                                                                        x="-11"
                                                                        y="-9"
                                                                        width="22"
                                                                        height="18"
                                                                        rx="5"
                                                                        fill={isTreeEdge || isMstEdge ? '#ecfdf5' : isActiveEdge ? '#fffbeb' : '#ffffff'}
                                                                        stroke={isTreeEdge || isMstEdge ? '#10b981' : isActiveEdge ? '#f59e0b' : '#cbd5e1'}
                                                                        strokeWidth="1.5"
                                                                    />
                                                                    <text
                                                                        y="3.5"
                                                                        textAnchor="middle"
                                                                        className={`text-[10px] font-mono font-bold select-none ${
                                                                            isTreeEdge || isMstEdge ? 'fill-emerald-800' : isActiveEdge ? 'fill-amber-800' : 'fill-slate-700'
                                                                        }`}
                                                                    >
                                                                        {edge.weight}
                                                                    </text>
                                                                </g>
                                                            </g>
                                                        );
                                                    })}

                                                    {/* Render Vertices / Nodes */}
                                                    {graphData.nodes.map(node => {
                                                        const isCurrent = currentGraphStep.activeNode === node.id;
                                                        const isEvaluating = currentGraphStep.evaluatingNode === node.id;
                                                        const isSettled = currentGraphStep.visited?.includes(node.id);
                                                        const inPQ = currentGraphStep.pq?.some(item => item.node === node.id);
                                                        const distVal = currentGraphStep.dist ? currentGraphStep.dist[node.id] : null;

                                                        let nodeFill = '#ffffff';
                                                        let nodeStroke = '#475569';
                                                        let textColor = '#1e293b';

                                                        if (isCurrent) {
                                                            nodeFill = '#2563eb';
                                                            nodeStroke = '#1d4ed8';
                                                            textColor = '#ffffff';
                                                        } else if (isEvaluating) {
                                                            nodeFill = '#f59e0b';
                                                            nodeStroke = '#d97706';
                                                            textColor = '#ffffff';
                                                        } else if (isSettled) {
                                                            nodeFill = '#10b981';
                                                            nodeStroke = '#059669';
                                                            textColor = '#ffffff';
                                                        } else if (inPQ) {
                                                            nodeFill = '#fef3c7';
                                                            nodeStroke = '#f59e0b';
                                                            textColor = '#92400e';
                                                        }

                                                        return (
                                                            <g
                                                                key={node.id}
                                                                onClick={() => handleSelectGraphStartNode(node.id)}
                                                                className="cursor-pointer group"
                                                            >
                                                                {/* Glowing pulse ring if active */}
                                                                {isCurrent && (
                                                                    <circle
                                                                        cx={node.x}
                                                                        cy={node.y}
                                                                        r="28"
                                                                        fill="none"
                                                                        stroke="#60a5fa"
                                                                        strokeWidth="2.5"
                                                                        className="animate-ping opacity-60"
                                                                    />
                                                                )}

                                                                {/* Main Node Circle */}
                                                                <circle
                                                                    cx={node.x}
                                                                    cy={node.y}
                                                                    r="22"
                                                                    fill={nodeFill}
                                                                    stroke={nodeStroke}
                                                                    strokeWidth={isCurrent || isSettled ? '3' : '2'}
                                                                    className="transition-all duration-300 group-hover:scale-105"
                                                                    filter={isCurrent ? 'url(#nodeGlow)' : undefined}
                                                                />

                                                                {/* Node Label */}
                                                                <text
                                                                    x={node.x}
                                                                    y={node.y + 4.5}
                                                                    textAnchor="middle"
                                                                    fill={textColor}
                                                                    className="text-xs font-mono font-black select-none pointer-events-none"
                                                                >
                                                                    {node.label}
                                                                </text>

                                                                {/* Distance Chip Floating Above (for Dijkstra / Floyd) */}
                                                                {distVal !== null && distVal !== undefined && (
                                                                    <g transform={`translate(${node.x}, ${node.y - 28})`}>
                                                                        <rect
                                                                            x="-16"
                                                                            y="-8"
                                                                            width="32"
                                                                            height="16"
                                                                            rx="4"
                                                                            fill="#0f172a"
                                                                            stroke="#334155"
                                                                            strokeWidth="1"
                                                                        />
                                                                        <text
                                                                            y="3.5"
                                                                            textAnchor="middle"
                                                                            fill="#38bdf8"
                                                                            className="text-[9px] font-mono font-bold select-none"
                                                                        >
                                                                            {distVal === Infinity ? 'd=∞' : `d=${distVal}`}
                                                                        </text>
                                                                    </g>
                                                                )}
                                                            </g>
                                                        );
                                                    })}
                                                </svg>
                                            </div>
                                        </div>

                                        {/* ── ALGORITHM-SPECIFIC STATE INSPECTOR BARS ── */}

                                        {/* 1. DIJKSTRA: Priority Queue & Shortest Distance Table */}
                                        {activeGraphAlgo === 'dijkstra' && (
                                            <div className="space-y-3">
                                                {/* Min-Priority Queue Display */}
                                                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                                                    <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-900">
                                                        <span className="flex items-center gap-1.5">
                                                            <Layers size={13} className="text-amber-700" />
                                                            Min-Priority Queue Frontier (Min-Heap):
                                                        </span>
                                                        <span className="text-[10px] text-amber-700">
                                                            extract_min() pulls vertex with minimal tentative distance
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {currentGraphStep.pq && currentGraphStep.pq.length > 0 ? (
                                                            currentGraphStep.pq.map((item, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold flex items-center gap-1.5 transition-all ${
                                                                        idx === 0
                                                                            ? 'bg-amber-500 text-white border-amber-600 shadow-sm ring-2 ring-amber-300'
                                                                            : 'bg-white text-slate-800 border-amber-200'
                                                                    }`}
                                                                >
                                                                    <span>({item.node}, {item.dist})</span>
                                                                    {idx === 0 && <span className="text-[9px] uppercase tracking-wider bg-amber-700 text-amber-100 px-1 rounded">MIN</span>}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs font-mono text-slate-500 italic">
                                                                Priority Queue is empty (all vertices settled).
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Shortest Distance & Predecessor Table */}
                                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                                                    <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-mono font-bold text-slate-700">
                                                        <span>Shortest Distance Table (dist[] & prev[])</span>
                                                        <span className="text-[10px] text-slate-400">Source: '{graphStartNode}'</span>
                                                    </div>
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-xs font-mono">
                                                            <thead>
                                                                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-left">
                                                                    <th className="py-2 px-3">Vertex</th>
                                                                    <th className="py-2 px-3">Shortest Distance d[v]</th>
                                                                    <th className="py-2 px-3">Predecessor prev[v]</th>
                                                                    <th className="py-2 px-3">Settled Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-100">
                                                                {graphData.nodes.map(node => {
                                                                    const d = currentGraphStep.dist ? currentGraphStep.dist[node.id] : Infinity;
                                                                    const p = currentGraphStep.prev ? currentGraphStep.prev[node.id] : null;
                                                                    const isSettled = currentGraphStep.visited?.includes(node.id);
                                                                    const isActive = currentGraphStep.activeNode === node.id;
                                                                    const isEvaluating = currentGraphStep.evaluatingNode === node.id;

                                                                    return (
                                                                        <tr
                                                                            key={node.id}
                                                                            className={`transition-colors ${
                                                                                isActive
                                                                                    ? 'bg-blue-50/80 font-bold'
                                                                                    : isEvaluating
                                                                                    ? 'bg-amber-50/80 font-bold'
                                                                                    : 'hover:bg-slate-50/50'
                                                                            }`}
                                                                        >
                                                                            <td className="py-2 px-3 font-black text-slate-800">{node.id}</td>
                                                                            <td className="py-2 px-3 font-bold text-blue-700">
                                                                                {d === Infinity ? '∞' : d}
                                                                            </td>
                                                                            <td className="py-2 px-3 text-slate-600">
                                                                                {p || '—'}
                                                                            </td>
                                                                            <td className="py-2 px-3">
                                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                                                    isSettled
                                                                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                                                        : 'bg-slate-100 text-slate-600'
                                                                                }`}>
                                                                                    {isSettled ? 'Settled' : 'Unvisited'}
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 2. BFS & DFS: Queue / Stack Traversal Order */}
                                        {(activeGraphAlgo === 'bfs' || activeGraphAlgo === 'dfs') && (
                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                                                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700">
                                                    <span>
                                                        {activeGraphAlgo === 'bfs' ? 'FIFO Queue (Level Traversal)' : 'Call Stack (LIFO Recursion)'}:
                                                    </span>
                                                    <span className="text-[10px] text-slate-500">
                                                        Visited sequence: {currentGraphStep.traversalOrder?.join(' → ') || 'None'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {activeGraphAlgo === 'bfs' ? (
                                                        currentGraphStep.queue?.map((v, idx) => (
                                                            <div key={idx} className="px-3 py-1 bg-white border border-slate-300 rounded-lg font-mono font-bold text-xs text-slate-800 shadow-2xs">
                                                                {v}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        currentGraphStep.stack?.map((v, idx) => (
                                                            <div key={idx} className="px-3 py-1 bg-white border border-slate-300 rounded-lg font-mono font-bold text-xs text-indigo-700 shadow-2xs">
                                                                {v}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* 3. KRUSKAL'S MST: Sorted Edges & Disjoint Sets */}
                                        {activeGraphAlgo === 'kruskal' && (
                                            <div className="space-y-3">
                                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                                                    <div className="flex items-center gap-2 font-mono text-xs">
                                                        <span className="font-bold text-slate-700">MST Status:</span>
                                                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                                                            {currentGraphStep.mstEdges?.length || 0} / {graphData.nodes.length - 1} Edges Selected
                                                        </span>
                                                    </div>
                                                    <div className="font-mono text-xs font-black text-slate-900">
                                                        Total MST Weight: ∑w = <span className="text-emerald-700 font-black">{currentGraphStep.totalWeight || 0}</span>
                                                    </div>
                                                </div>

                                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                                                    <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 text-xs font-mono font-bold text-slate-700">
                                                        Sorted Edge List (Greedy Cycle Check via Union-Find)
                                                    </div>
                                                    <div className="p-2 flex flex-wrap gap-2">
                                                        {currentGraphStep.sortedEdges?.map((edge, idx) => {
                                                            const isAccepted = currentGraphStep.mstEdges?.includes(edge.id);
                                                            const isRejected = currentGraphStep.rejectedEdges?.includes(edge.id);
                                                            const isCurrent = currentGraphStep.currentEdgeIdx === idx;

                                                            return (
                                                                <div
                                                                    key={edge.id}
                                                                    className={`px-2.5 py-1.5 rounded-lg border font-mono text-xs font-bold flex items-center gap-1.5 transition-all ${
                                                                        isCurrent
                                                                            ? 'bg-amber-400 text-slate-900 border-amber-500 ring-2 ring-amber-200'
                                                                            : isAccepted
                                                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                                                            : isRejected
                                                                            ? 'bg-rose-50 text-rose-700 border-rose-200 opacity-60 line-through'
                                                                            : 'bg-white text-slate-700 border-slate-200'
                                                                    }`}
                                                                >
                                                                    <span>{edge.u}–{edge.v} (wt: {edge.weight})</span>
                                                                    {isAccepted && <Check size={11} className="text-emerald-700" />}
                                                                    {isRejected && <X size={11} className="text-rose-600" />}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 4. FLOYD-WARSHALL: All-Pairs Distance Matrix */}
                                        {activeGraphAlgo === 'floyd' && (
                                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                                                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-mono font-bold text-slate-700">
                                                    <span>All-Pairs Distance Matrix D[i][j]</span>
                                                    {currentGraphStep.k && (
                                                        <span className="text-[10px] text-blue-700 font-bold">
                                                            Intermediate Vertex k = '{currentGraphStep.k}'
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="p-3 overflow-x-auto">
                                                    <table className="w-full text-center text-xs font-mono border-collapse">
                                                        <thead>
                                                            <tr>
                                                                <th className="p-1.5 text-slate-400"></th>
                                                                {graphData.nodes.map(n => (
                                                                    <th key={n.id} className="p-1.5 font-bold text-slate-700 bg-slate-50 border border-slate-200">{n.id}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {graphData.nodes.map(rowNode => (
                                                                <tr key={rowNode.id}>
                                                                    <td className="p-1.5 font-bold text-slate-700 bg-slate-50 border border-slate-200">{rowNode.id}</td>
                                                                    {graphData.nodes.map(colNode => {
                                                                        const val = currentGraphStep.matrix ? currentGraphStep.matrix[rowNode.id][colNode.id] : null;
                                                                        const isUpdated = currentGraphStep.i === rowNode.id && currentGraphStep.j === colNode.id;
                                                                        return (
                                                                            <td
                                                                                key={colNode.id}
                                                                                className={`p-1.5 border border-slate-200 font-bold transition-all ${
                                                                                    isUpdated
                                                                                        ? 'bg-blue-600 text-white font-black scale-105'
                                                                                        : rowNode.id === colNode.id
                                                                                        ? 'bg-slate-100 text-slate-400'
                                                                                        : 'text-slate-800'
                                                                                }`}
                                                                            >
                                                                                {val === Infinity || val === null ? '∞' : val}
                                                                            </td>
                                                                        );
                                                                    })}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {/* 5. TOPIC 7.1: Adjacency Matrix & Linked List Toggle */}
                                        {activeGraphAlgo === 'adj' && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setGraphViewMode('matrix')}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                                                            graphViewMode === 'matrix' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                                                        }`}
                                                    >
                                                        Adjacency Matrix (Dense O(1))
                                                    </button>
                                                    <button
                                                        onClick={() => setGraphViewMode('list')}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                                                            graphViewMode === 'list' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                                                        }`}
                                                    >
                                                        Adjacency List (Sparse O(deg(V)))
                                                    </button>
                                                </div>

                                                {graphViewMode === 'matrix' ? (
                                                    <div className="p-3 bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-2xs">
                                                        <table className="w-full text-center text-xs font-mono">
                                                            <thead>
                                                                <tr>
                                                                    <th className="p-1.5 text-slate-400"></th>
                                                                    {graphData.nodes.map(n => (
                                                                        <th key={n.id} className="p-1.5 font-bold text-slate-700 bg-slate-50 border border-slate-200">{n.id}</th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {graphData.nodes.map(u => (
                                                                    <tr key={u.id}>
                                                                        <td className="p-1.5 font-bold text-slate-700 bg-slate-50 border border-slate-200">{u.id}</td>
                                                                        {graphData.nodes.map(v => {
                                                                            const edge = graphData.edges.find(e => (e.u === u.id && e.v === v.id) || (e.v === u.id && e.u === v.id));
                                                                            const hasEdge = u.id !== v.id && !!edge;
                                                                            return (
                                                                                <td key={v.id} className={`p-1.5 border border-slate-200 font-bold ${hasEdge ? 'bg-blue-50 text-blue-800' : 'text-slate-400'}`}>
                                                                                    {hasEdge ? edge.weight : 0}
                                                                                </td>
                                                                            );
                                                                        })}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 font-mono text-xs shadow-2xs">
                                                        {graphData.nodes.map(u => {
                                                            const neighbors = graphData.edges
                                                                .filter(e => e.u === u.id || e.v === u.id)
                                                                .map(e => ({ node: e.u === u.id ? e.v : e.u, weight: e.weight }));
                                                            return (
                                                                <div key={u.id} className="flex items-center gap-2">
                                                                    <div className="w-8 h-7 bg-slate-900 text-white rounded flex items-center justify-center font-bold">
                                                                        {u.id}
                                                                    </div>
                                                                    <span className="text-slate-400">→</span>
                                                                    <div className="flex items-center gap-1.5 overflow-x-auto">
                                                                        {neighbors.map((n, idx) => (
                                                                            <div key={idx} className="flex items-center gap-1">
                                                                                <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 rounded font-bold text-blue-800">
                                                                                    {n.node} (w={n.weight})
                                                                                </span>
                                                                                <span className="text-slate-300">→</span>
                                                                            </div>
                                                                        ))}
                                                                        <span className="text-slate-400 text-[10px]">NULL</span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* ── TOPIC 7.6: BINARY SEARCH TREE (BST) STUDIO ───────────── */
                                    <div className="space-y-4">
                                        {/* BST Action Bar */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={bstKeyInput}
                                                    onChange={e => setBstKeyInput(e.target.value)}
                                                    placeholder="Key (e.g. 45)..."
                                                    className="w-24 px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg shadow-2xs"
                                                />
                                                <button
                                                    onClick={handleInsertBST}
                                                    className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer flex items-center gap-1 shadow-2xs"
                                                >
                                                    <Plus size={12} /> Insert Key
                                                </button>
                                                <button
                                                    onClick={handleSearchBST}
                                                    className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer flex items-center gap-1 shadow-2xs"
                                                >
                                                    <Search size={12} /> Search
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => handleTraverseBST('inorder')}
                                                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                                                        bstTraverseMode === 'inorder' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    Inorder (Sorted)
                                                </button>
                                                <button
                                                    onClick={() => handleTraverseBST('preorder')}
                                                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                                                        bstTraverseMode === 'preorder' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    Preorder
                                                </button>
                                                <button
                                                    onClick={() => handleTraverseBST('postorder')}
                                                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                                                        bstTraverseMode === 'postorder' ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    Postorder
                                                </button>
                                                <button
                                                    onClick={() => handleResetBST('balanced')}
                                                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                                                    title="Reset to balanced preset"
                                                >
                                                    <RotateCcw size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Traversal Output Display */}
                                        {bstTraverseOutput.length > 0 && (
                                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs font-mono">
                                                <span className="font-bold text-emerald-900 capitalize">
                                                    BST {bstTraverseMode} Traversal Result:
                                                </span>
                                                <span className="font-black text-emerald-800 bg-white px-3 py-1 rounded-lg border border-emerald-300">
                                                    [ {bstTraverseOutput.join(', ')} ]
                                                </span>
                                            </div>
                                        )}

                                        {/* Dynamic SVG BST Canvas */}
                                        <div className="min-h-[240px] bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col items-center justify-center">
                                            <svg viewBox="0 0 560 220" className="w-full max-w-[560px] h-auto select-none">
                                                {/* Tree Branch Lines */}
                                                {bstTreeLayout.edges.map((e, idx) => (
                                                    <line
                                                        key={idx}
                                                        x1={e.fromX}
                                                        y1={e.fromY}
                                                        x2={e.toX}
                                                        y2={e.toY}
                                                        stroke="#94a3b8"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                    />
                                                ))}

                                                {/* Tree Nodes */}
                                                {bstTreeLayout.nodes.map((node, idx) => {
                                                    const isHit = bstSearchActive === node.key;
                                                    const isRoot = idx === 0;

                                                    return (
                                                        <g key={node.id} className="transition-all duration-300">
                                                            {isHit && (
                                                                <circle
                                                                    cx={node.x}
                                                                    cy={node.y}
                                                                    r="24"
                                                                    fill="none"
                                                                    stroke="#10b981"
                                                                    strokeWidth="3"
                                                                    className="animate-ping"
                                                                />
                                                            )}
                                                            <circle
                                                                cx={node.x}
                                                                cy={node.y}
                                                                r="18"
                                                                fill={isHit ? '#10b981' : isRoot ? '#0f172a' : '#ffffff'}
                                                                stroke={isHit ? '#059669' : isRoot ? '#38bdf8' : '#334155'}
                                                                strokeWidth="2.5"
                                                                className="transition-all"
                                                            />
                                                            <text
                                                                x={node.x}
                                                                y={node.y + 4.5}
                                                                textAnchor="middle"
                                                                fill={isHit || isRoot ? '#ffffff' : '#0f172a'}
                                                                className="text-xs font-mono font-bold select-none"
                                                            >
                                                                {node.key}
                                                            </text>
                                                        </g>
                                                    );
                                                })}
                                            </svg>
                                            <span className="text-[10px] text-slate-500 font-mono mt-3">
                                                BST Invariant: left branch &lt; root &lt; right branch (Inorder traversal yields sorted output).
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* MODULE 8: HASHING STUDIO (Separate Chaining & Perfect Hashing) */}
                        {activeModuleNumber === 8 && (
                            <div className="space-y-4">
                                {/* ── SUB-TOPIC 8.1: HASHING BY CHAINING ────────────────── */}
                                {selectedTopicId === 1 && (
                                    <div className="space-y-4">
                                        {/* Metrics Bar */}
                                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                                    Table Capacity (m)
                                                </span>
                                                <div className="text-sm font-black font-mono text-slate-800 flex items-center justify-between">
                                                    <span>m = {hashTableM}</span>
                                                    <span className="text-[10px] text-slate-500 font-normal">Buckets</span>
                                                </div>
                                            </div>

                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                                    Total Keys (n)
                                                </span>
                                                <div className="text-sm font-black font-mono text-blue-700">
                                                    n = {hashTotalElements}
                                                </div>
                                            </div>

                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                                    Load Factor (α = n/m)
                                                </span>
                                                <div className="text-sm font-black font-mono flex items-center justify-between">
                                                    <span className={hashLoadFactor > 1.0 ? 'text-rose-600' : hashLoadFactor >= 0.75 ? 'text-amber-600' : 'text-emerald-700'}>
                                                        α = {hashLoadFactor}
                                                    </span>
                                                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                                        hashLoadFactor > 1.0 ? 'bg-rose-100 text-rose-800' : hashLoadFactor >= 0.75 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                                                    }`}>
                                                        {hashLoadFactor > 1.0 ? 'High' : hashLoadFactor >= 0.75 ? 'Moderate' : 'Optimal'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                                    Collisions
                                                </span>
                                                <div className="text-sm font-black font-mono text-amber-700">
                                                    {hashCollisions} Collisions
                                                </div>
                                            </div>

                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 col-span-2 sm:col-span-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                                    Operation Status
                                                </span>
                                                <div className="text-sm font-black font-mono">
                                                    {hashSearchStatus ? (
                                                        <span className={hashSearchStatus === 'found' || hashSearchStatus === 'inserted' ? 'text-emerald-600' : 'text-rose-600'}>
                                                            {hashSearchStatus === 'found' ? 'Found' : hashSearchStatus === 'inserted' ? 'Inserted' : hashSearchStatus === 'deleted' ? 'Deleted' : 'Not Found'}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 font-normal text-xs">Idle</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                                            <p className="text-xs text-slate-700 font-mono leading-relaxed font-medium">
                                                {hashExplanation}
                                            </p>
                                        </div>

                                        {/* Visual Hash Table Canvas: Separate Chaining Linked Lists */}
                                        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
                                            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
                                                <span>Hash Table Array (m = {hashTableM})</span>
                                                <span>Separate Chaining Linked List Nodes</span>
                                            </div>

                                            <div className="space-y-2">
                                                {hashTable.map((bucket, idx) => {
                                                    const isBucketActive = hashActiveBucket === idx;
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`flex items-center gap-2 p-2 rounded-xl transition-all ${
                                                                isBucketActive ? 'bg-blue-50/70 border border-blue-200 shadow-2xs' : 'hover:bg-slate-50/70'
                                                            }`}
                                                        >
                                                            {/* Bucket Header */}
                                                            <div className={`w-14 px-2 py-1 rounded-lg text-center font-mono font-bold text-xs flex items-center justify-between shrink-0 shadow-2xs ${
                                                                isBucketActive ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'
                                                            }`}>
                                                                <span>[{idx}]</span>
                                                                <span className="text-[9px] font-normal text-slate-300">({bucket.length})</span>
                                                            </div>

                                                            <ArrowRight size={13} className="text-slate-400 shrink-0" />

                                                            {/* Chain Nodes */}
                                                            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                                                                {bucket.length === 0 ? (
                                                                    <span className="text-slate-400 text-xs font-mono italic">NULL</span>
                                                                ) : (
                                                                    bucket.map((val, bIdx) => {
                                                                        const isNodeActive = isBucketActive && hashActiveKey === val;
                                                                        const isHit = isNodeActive && hashSearchStatus === 'found';
                                                                        const isNew = isNodeActive && hashSearchStatus === 'inserted';

                                                                        return (
                                                                            <div key={bIdx} className="flex items-center gap-1.5">
                                                                                <div
                                                                                    className={`px-3 py-1.5 rounded-lg border font-mono font-bold text-xs transition-all shadow-2xs flex items-center gap-1 ${
                                                                                        isHit
                                                                                            ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 scale-105'
                                                                                            : isNew
                                                                                            ? 'bg-blue-500 text-white border-blue-600 ring-4 ring-blue-200 scale-105'
                                                                                            : isNodeActive
                                                                                            ? 'bg-amber-400 text-slate-900 border-amber-500 ring-4 ring-amber-200'
                                                                                            : 'bg-white border-slate-300 text-slate-800'
                                                                                    }`}
                                                                                >
                                                                                    <span>{val}</span>
                                                                                    {isHit && <Check size={12} className="text-white" />}
                                                                                </div>
                                                                                <span className="text-slate-400 text-xs font-mono">→</span>
                                                                            </div>
                                                                        );
                                                                    })
                                                                )}
                                                                {bucket.length > 0 && (
                                                                    <span className="text-slate-400 text-[10px] font-mono">NULL</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── SUB-TOPIC 8.2: PERFECT HASHING FUNCTION (ZERO COLLISION) ───── */}
                                {selectedTopicId === 2 && (
                                    <div className="space-y-4">
                                        {/* Metrics Bar */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                                    Algorithm Scheme
                                                </span>
                                                <div className="text-xs font-black font-mono text-slate-800">
                                                    FKS Universal 2-Level Hashing
                                                </div>
                                            </div>

                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                                    Worst-Case Lookup
                                                </span>
                                                <div className="text-sm font-black font-mono text-emerald-700 flex items-center gap-1">
                                                    <Check size={14} /> Strict O(1) Time
                                                </div>
                                            </div>

                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                                    Collisions Guarantee
                                                </span>
                                                <div className="text-sm font-black font-mono text-blue-700">
                                                    0 (Zero Collisions)
                                                </div>
                                            </div>

                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                                    Secondary Table Size
                                                </span>
                                                <div className="text-sm font-black font-mono text-indigo-700">
                                                    m_j = n_j² (Quadratic)
                                                </div>
                                            </div>
                                        </div>

                                        {/* Search & Preset Toolbar */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={perfectSearchInput}
                                                    onChange={e => setPerfectSearchInput(e.target.value)}
                                                    placeholder="Search key (e.g. 37)..."
                                                    className="w-32 px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg shadow-2xs"
                                                />
                                                <button
                                                    onClick={handlePerfectSearch}
                                                    className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer flex items-center gap-1 shadow-2xs"
                                                >
                                                    <Search size={12} /> Search in O(1)
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                                                <span className="text-[10px] font-mono font-bold text-slate-400 pl-1 pr-0.5">Presets:</span>
                                                <button
                                                    onClick={() => handlePerfectPreset('dictionary')}
                                                    className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer ${
                                                        perfectPresetKey === 'dictionary' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    Sample Keys
                                                </button>
                                                <button
                                                    onClick={() => handlePerfectPreset('keywords')}
                                                    className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer ${
                                                        perfectPresetKey === 'keywords' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    Keywords (Mod 7)
                                                </button>
                                            </div>
                                        </div>

                                        {/* Two-Level Lookup Walkthrough Banner */}
                                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                                            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800">
                                                <span className="flex items-center gap-1.5">
                                                    <Sparkles size={13} className="text-amber-500" />
                                                    FKS Two-Level Verification Pipeline
                                                </span>
                                                <span className="text-[10px] text-slate-400">
                                                    Universal Prime p = 101, Primary a = 3, b = 42
                                                </span>
                                            </div>
                                            {perfectSearchResult ? (
                                                <div className="text-xs font-mono space-y-1 text-slate-700 leading-relaxed">
                                                    <div>
                                                        <strong>Step 1 (Primary Table):</strong> h(k) = ((3 × {perfectSearchResult.target} + 42) % 101) % 7 = <span className="text-blue-700 font-bold">Bucket [{perfectSearchResult.h1}]</span>
                                                    </div>
                                                    <div>
                                                        <strong>Step 2 (Secondary Table):</strong> h_j(k) = (({perfectModel.secondaryTables[perfectSearchResult.h1]?.a_j} × {perfectSearchResult.target} + {perfectModel.secondaryTables[perfectSearchResult.h1]?.b_j}) % 101) % {perfectModel.secondaryTables[perfectSearchResult.h1]?.m_j} = <span className="text-indigo-700 font-bold">Slot [{perfectSearchResult.h2}]</span>
                                                    </div>
                                                    <div className="font-bold flex items-center gap-1 pt-0.5">
                                                        <span>Result:</span>
                                                        <span className={perfectSearchResult.found ? 'text-emerald-700' : 'text-rose-600'}>
                                                            {perfectSearchResult.found ? `✓ Key ${perfectSearchResult.target} located in exactly 2 steps with ZERO collisions!` : `✗ Key ${perfectSearchResult.target} not present in static set.`}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs font-mono text-slate-500 italic">
                                                    Click 'Search in O(1)' above to observe the 2-level universal hash evaluation.
                                                </p>
                                            )}
                                        </div>

                                        {/* Two-Level Architecture Canvas */}
                                        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                                            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
                                                <span>Level 1: Primary Table (Size M = 7)</span>
                                                <span>Level 2: Collision-Free Secondary Tables (Size m_j = n_j²)</span>
                                            </div>

                                            <div className="space-y-2.5">
                                                {perfectModel.secondaryTables.map((sec, idx) => {
                                                    const isPrimaryActive = perfectSearchActive?.h1 === idx;
                                                    const keysInBucket = perfectModel.buckets[idx];

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`p-2.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                                                                isPrimaryActive ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-100' : 'bg-slate-50/60 border-slate-200'
                                                            }`}
                                                        >
                                                            {/* Primary Bucket Tag */}
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <div className={`w-14 px-2 py-1 rounded-lg text-center font-mono font-bold text-xs ${
                                                                    isPrimaryActive ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'
                                                                }`}>
                                                                    [{idx}]
                                                                </div>
                                                                <span className="text-[10px] font-mono text-slate-500">
                                                                    n_j={keysInBucket.length} → m_j={sec.m_j}
                                                                </span>
                                                                <ArrowRight size={12} className="text-slate-400" />
                                                            </div>

                                                            {/* Secondary Table Array */}
                                                            <div className="flex items-center gap-1.5 flex-wrap flex-1 justify-end">
                                                                {sec.m_j === 0 ? (
                                                                    <span className="text-[11px] font-mono text-slate-400 italic">Empty Bucket (m_j = 0)</span>
                                                                ) : (
                                                                    sec.table.map((val, sIdx) => {
                                                                        const isSlotActive = isPrimaryActive && perfectSearchActive?.h2 === sIdx;
                                                                        const isHit = isSlotActive && perfectSearchActive?.found;

                                                                        return (
                                                                            <div
                                                                                key={sIdx}
                                                                                className={`px-2.5 py-1 rounded-lg border font-mono text-xs font-bold transition-all flex items-center gap-1 ${
                                                                                    isHit
                                                                                        ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 scale-105 shadow-md'
                                                                                        : isSlotActive
                                                                                        ? 'bg-amber-400 text-slate-900 border-amber-500'
                                                                                        : val !== null
                                                                                        ? 'bg-white border-slate-300 text-slate-800'
                                                                                        : 'bg-slate-100/70 border-slate-200 text-slate-400'
                                                                                }`}
                                                                            >
                                                                                <span className="text-[9px] text-slate-400 select-none">[{sIdx}]:</span>
                                                                                <span>{val !== null ? val : '—'}</span>
                                                                            </div>
                                                                        );
                                                                    })
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                                                <span>FKS Theorem: Total secondary space ∑ m_j = ∑ n_j² &lt; 2n with high probability</span>
                                                <span className="text-emerald-700 font-bold">Zero Collisions Guaranteed</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* MODULE 9: STRING ALGORITHMS */}
                        {activeModuleNumber === 9 && (
                            <div className="space-y-4">
                                {selectedTopicId === 1 ? (
                                    /* 9.1 Simple string manipulations */
                                    <div className="space-y-4">
                                        {/* Status & Complexity Metrics Bar */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                                                <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Buffer Length</div>
                                                <div className="text-base font-bold text-slate-800 font-mono mt-0.5">
                                                    N = {strBuffer.length} <span className="text-[11px] font-normal text-slate-500">chars</span>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                                                <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Current Operation</div>
                                                <div className="text-base font-bold text-blue-600 font-mono mt-0.5 capitalize">
                                                    {strOpMode === 'reverse' ? 'In-Place Reversal' : strOpMode === 'palindrome' ? 'Palindrome Verification' : 'Case Shift'}
                                                </div>
                                            </div>
                                            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                                                <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Auxiliary Space</div>
                                                <div className="text-base font-bold text-emerald-600 font-mono mt-0.5">
                                                    O(1) <span className="text-[11px] font-normal text-slate-500">In-Place</span>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                                                <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Time Complexity</div>
                                                <div className="text-base font-bold text-purple-600 font-mono mt-0.5">
                                                    O(N) <span className="text-[11px] font-normal text-slate-500">Two Pointers</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Controls & Presets */}
                                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <span className="text-xs font-mono font-bold text-slate-600 shrink-0">Input String:</span>
                                                    <input
                                                        type="text"
                                                        value={strInput}
                                                        onChange={(e) => {
                                                            const val = e.target.value.toUpperCase();
                                                            setStrInput(val);
                                                            setStrBuffer(val.split(''));
                                                            setStrLeftPtr(0);
                                                            setStrRightPtr(Math.max(0, val.length - 1));
                                                        }}
                                                        className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1 max-w-xs uppercase"
                                                        placeholder="ENTER STRING..."
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="text-[11px] font-mono text-slate-400">Presets:</span>
                                                    {['RACECAR', 'STRUCTURES', 'MADAM', 'ALGORITHM'].map(preset => (
                                                        <button
                                                            key={preset}
                                                            onClick={() => {
                                                                setStrInput(preset);
                                                                setStrBuffer(preset.split(''));
                                                                setStrLeftPtr(0);
                                                                setStrRightPtr(preset.length - 1);
                                                                setStrManipStatus(`Loaded preset "${preset}". Ready.`);
                                                                addLog(`Loaded preset "${preset}".`);
                                                            }}
                                                            className={`px-2 py-1 text-[11px] font-mono rounded border transition-all cursor-pointer ${
                                                                strInput === preset
                                                                    ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                                                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                                            }`}
                                                        >
                                                            {preset}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 pt-1 border-t border-slate-100 flex-wrap">
                                                <button
                                                    onClick={() => handleStringOpRun('reverse')}
                                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                                                >
                                                    <ArrowLeftRight size={13} />
                                                    Reverse In-Place (Two-Pointers)
                                                </button>
                                                <button
                                                    onClick={() => handleStringOpRun('palindrome')}
                                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                                                >
                                                    <ShieldCheck size={13} />
                                                    Verify Palindrome
                                                </button>
                                                <button
                                                    onClick={() => handleStringOpRun('case')}
                                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-900 shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                                                >
                                                    <Sparkles size={13} />
                                                    To UPPERCASE
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const chars = strInput.split('');
                                                        setStrBuffer(chars);
                                                        setStrLeftPtr(0);
                                                        setStrRightPtr(chars.length - 1);
                                                        setStrManipStatus('Buffer reset to original input string.');
                                                    }}
                                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors ml-auto"
                                                >
                                                    <RotateCcw size={12} />
                                                    Reset Buffer
                                                </button>
                                            </div>
                                        </div>

                                        {/* Status Banner */}
                                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                                            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800">
                                                <span className="flex items-center gap-1.5">
                                                    <Sparkles size={13} className="text-amber-500" />
                                                    Two-Pointer In-Place Execution State
                                                </span>
                                                <span className="text-[10px] text-slate-400">
                                                    Left Index: {strLeftPtr} | Right Index: {strRightPtr}
                                                </span>
                                            </div>
                                            <p className="text-xs font-mono text-slate-600">
                                                {strManipStatus}
                                            </p>
                                        </div>

                                        {/* Two-Pointer Character Memory Buffer Canvas */}
                                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                                            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
                                                <span>In-Place Memory Buffer: <code className="text-blue-600">char str[{strBuffer.length + 1}]</code></span>
                                                <span className="text-slate-400">Null-Terminated (ANSI C C89)</span>
                                            </div>

                                            {/* Pointer Indicator Line */}
                                            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
                                                {strBuffer.map((char, idx) => {
                                                    const isLeft = idx === strLeftPtr;
                                                    const isRight = idx === strRightPtr;
                                                    return (
                                                        <div key={idx} className="flex flex-col items-center w-11 shrink-0">
                                                            {/* Floating Pointer Badges */}
                                                            <div className="h-6 flex items-center justify-center">
                                                                {isLeft && isRight ? (
                                                                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white animate-pulse">
                                                                        L,R ↓
                                                                    </span>
                                                                ) : isLeft ? (
                                                                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">
                                                                        L ↓
                                                                    </span>
                                                                ) : isRight ? (
                                                                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-600 text-white">
                                                                        R ↓
                                                                    </span>
                                                                ) : null}
                                                            </div>

                                                            {/* Character Cell */}
                                                            <div
                                                                className={`w-11 h-12 rounded-xl flex flex-col items-center justify-center border font-mono transition-all ${
                                                                    isLeft && isRight
                                                                        ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200 text-amber-900 font-extrabold text-lg'
                                                                        : isLeft
                                                                        ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200 text-blue-900 font-extrabold text-lg'
                                                                        : isRight
                                                                        ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-200 text-purple-900 font-extrabold text-lg'
                                                                        : 'bg-slate-50 border-slate-200 text-slate-800 font-bold text-base hover:bg-slate-100'
                                                                }`}
                                                            >
                                                                <span>{char}</span>
                                                            </div>

                                                            {/* Index Label */}
                                                            <span className="text-[10px] font-mono text-slate-400 mt-1">[{idx}]</span>
                                                            <span className="text-[9px] font-mono text-slate-300">
                                                                {char.charCodeAt(0)}
                                                            </span>
                                                        </div>
                                                    );
                                                })}

                                                {/* ANSI C Null Terminator Slot */}
                                                <div className="flex flex-col items-center w-11 shrink-0 opacity-75">
                                                    <div className="h-6 flex items-center justify-center">
                                                        <span className="text-[9px] font-mono text-slate-400">null</span>
                                                    </div>
                                                    <div className="w-11 h-12 rounded-xl flex items-center justify-center border border-dashed border-slate-300 bg-slate-100 text-slate-400 font-mono font-bold text-xs">
                                                        \0
                                                    </div>
                                                    <span className="text-[10px] font-mono text-slate-400 mt-1">[{strBuffer.length}]</span>
                                                    <span className="text-[9px] font-mono text-slate-300">0</span>
                                                </div>
                                            </div>

                                            {/* Walkthrough card */}
                                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 space-y-1">
                                                <div className="font-bold text-slate-700">Two-Pointer Invariant in C89:</div>
                                                <p className="text-[11px] leading-relaxed">
                                                    Left pointer starts at index <code className="text-blue-600">0</code> and increments (<code className="text-blue-600">L++</code>); Right pointer starts at index <code className="text-purple-600">len - 1</code> and decrements (<code className="text-purple-600">R--</code>). The loop continues while <code className="text-slate-800">L &lt; R</code>, swapping characters in-place without allocating extra heap memory.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* 9.2 Pattern search with Rabin-Karp approach */
                                    <div className="space-y-4">
                                        {/* Status & Complexity Metrics Bar */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                                                <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Pattern Hash (p)</div>
                                                <div className="text-base font-bold text-purple-700 font-mono mt-0.5">
                                                    p = {currentRkStep.patternHash !== undefined ? currentRkStep.patternHash : '—'}
                                                </div>
                                            </div>
                                            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                                                <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Window Hash (t_s)</div>
                                                <div className={`text-base font-bold font-mono mt-0.5 ${
                                                    currentRkStep.phase === 'match'
                                                        ? 'text-emerald-600'
                                                        : currentRkStep.phase === 'spurious_hit'
                                                        ? 'text-amber-600'
                                                        : 'text-blue-600'
                                                }`}>
                                                    t = {currentRkStep.textHash !== undefined ? currentRkStep.textHash : '—'}
                                                </div>
                                            </div>
                                            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                                                <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Rolling Cost</div>
                                                <div className="text-base font-bold text-emerald-600 font-mono mt-0.5">
                                                    O(1) <span className="text-[11px] font-normal text-slate-500">Per Shift</span>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                                                <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Matches Discovered</div>
                                                <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                                                    {currentRkStep.matches ? currentRkStep.matches.length : 0} <span className="text-[11px] font-normal text-slate-500">hits</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Inputs & Presets Bar */}
                                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono font-bold text-slate-600 shrink-0">Text T:</span>
                                                    <input
                                                        type="text"
                                                        value={rkText}
                                                        onChange={(e) => {
                                                            const val = e.target.value.toUpperCase();
                                                            setRkText(val);
                                                            setRkStepIdx(0);
                                                            setRkIsPlaying(false);
                                                        }}
                                                        className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1 uppercase"
                                                        placeholder="SEARCH TEXT..."
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono font-bold text-slate-600 shrink-0">Pattern P:</span>
                                                    <input
                                                        type="text"
                                                        value={rkPattern}
                                                        onChange={(e) => {
                                                            const val = e.target.value.toUpperCase();
                                                            setRkPattern(val);
                                                            setRkStepIdx(0);
                                                            setRkIsPlaying(false);
                                                        }}
                                                        className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1 uppercase"
                                                        placeholder="PATTERN..."
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="text-[11px] font-mono text-slate-400">Datasets:</span>
                                                    <button
                                                        onClick={() => handleRkPreset('standard')}
                                                        className={`px-2 py-1 text-[11px] font-mono rounded border transition-all cursor-pointer ${
                                                            rkPattern === 'AABA'
                                                                ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                                                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        Standard (AABA)
                                                    </button>
                                                    <button
                                                        onClick={() => handleRkPreset('words')}
                                                        className={`px-2 py-1 text-[11px] font-mono rounded border transition-all cursor-pointer ${
                                                            rkPattern === 'BAT'
                                                                ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                                                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        Words (BAT)
                                                    </button>
                                                    <button
                                                        onClick={() => handleRkPreset('dna')}
                                                        className={`px-2 py-1 text-[11px] font-mono rounded border transition-all cursor-pointer ${
                                                            rkPattern === 'ATAT'
                                                                ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                                                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        DNA (ATAT)
                                                    </button>
                                                </div>
                                                <div className="text-[11px] font-mono text-slate-500">
                                                    Radix <span className="font-bold text-slate-700">d = {rkD}</span> | Modulus Prime <span className="font-bold text-slate-700">q = {rkQ}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Playback & Step Controls */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => {
                                                        setRkStepIdx(0);
                                                        setRkIsPlaying(false);
                                                    }}
                                                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer shadow-2xs"
                                                    title="Reset to start"
                                                >
                                                    <RotateCcw size={14} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setRkStepIdx(prev => Math.max(0, prev - 1));
                                                        setRkIsPlaying(false);
                                                    }}
                                                    disabled={rkStepIdx === 0}
                                                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                                                    title="Step backward"
                                                >
                                                    <SkipBack size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setRkIsPlaying(prev => !prev)}
                                                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                                                >
                                                    {rkIsPlaying ? <Pause size={13} /> : <Play size={13} />}
                                                    <span>{rkIsPlaying ? 'Pause' : 'Play'}</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setRkStepIdx(prev => Math.min(rkSteps.length - 1, prev + 1));
                                                        setRkIsPlaying(false);
                                                    }}
                                                    disabled={rkStepIdx >= rkSteps.length - 1}
                                                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                                                    title="Step forward"
                                                >
                                                    <SkipForward size={14} />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="text-xs font-mono text-slate-600">
                                                    Step <strong className="text-slate-900">{rkStepIdx + 1}</strong> of <span className="text-slate-500">{rkSteps.length}</span>
                                                </div>
                                                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                                                    {[
                                                        { label: 'Slow', val: 1600 },
                                                        { label: 'Normal', val: 900 },
                                                        { label: 'Fast', val: 400 }
                                                    ].map(sp => (
                                                        <button
                                                            key={sp.label}
                                                            onClick={() => setRkSpeed(sp.val)}
                                                            className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-colors ${
                                                                rkSpeed === sp.val ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                                                            }`}
                                                        >
                                                            {sp.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rolling Hash Formula & Step Explanation Banner */}
                                        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                                            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800">
                                                <span className="flex items-center gap-1.5">
                                                    <Sparkles size={13} className="text-amber-500" />
                                                    Rabin-Karp Rolling Hash Transition
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                                    currentRkStep.phase === 'match'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : currentRkStep.phase === 'spurious_hit'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : currentRkStep.phase === 'rolling_hash'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {currentRkStep.phase?.replace('_', ' ')}
                                                </span>
                                            </div>

                                            <p className="text-xs font-mono text-slate-700 leading-relaxed">
                                                {currentRkStep.desc || 'Stepping through Rabin-Karp pattern search...'}
                                            </p>

                                            {currentRkStep.formula && (
                                                <div className="p-2 bg-blue-50/70 border border-blue-200 rounded-lg text-xs font-mono text-blue-900 font-bold">
                                                    {currentRkStep.formula}
                                                </div>
                                            )}
                                        </div>

                                        {/* Rabin-Karp Sliding Window Visual Canvas */}
                                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                                            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
                                                <span>Text String <code className="text-slate-700">T[0..{rkText.length - 1}]</code> &amp; Sliding Window <code className="text-blue-600">offset s = {currentRkStep.windowIdx ?? 0}</code></span>
                                                <span>Pattern Length M = {rkPattern.length}</span>
                                            </div>

                                            {/* Text Cells & Sliding Window */}
                                            <div className="flex flex-col gap-2 overflow-x-auto py-2">
                                                {/* Text String Character Row */}
                                                <div className="flex items-center gap-1.5 min-w-max">
                                                    {rkText.split('').map((char, idx) => {
                                                        const winStart = currentRkStep.windowIdx ?? 0;
                                                        const inWindow = idx >= winStart && idx < winStart + rkPattern.length;
                                                        const offsetInWin = idx - winStart;
                                                        const isMatchPhase = currentRkStep.phase === 'match';
                                                        const isSpuriousHit = currentRkStep.phase === 'spurious_hit';
                                                        const isRolling = currentRkStep.phase === 'rolling_hash';

                                                        // Check if this specific character comparison matches
                                                        const compItem = currentRkStep.comparingChars?.find(c => c.textIdx === idx);

                                                        return (
                                                            <div key={idx} className="flex flex-col items-center w-9 shrink-0">
                                                                <div
                                                                    className={`w-9 h-11 rounded-lg flex flex-col items-center justify-center border font-mono font-bold transition-all text-sm ${
                                                                        inWindow
                                                                            ? isMatchPhase
                                                                                ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-300'
                                                                                : isSpuriousHit
                                                                                ? compItem && !compItem.matches
                                                                                    ? 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-300'
                                                                                    : 'bg-amber-400 text-slate-900 border-amber-500'
                                                                                : isRolling
                                                                                ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                                                                                : 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200'
                                                                            : 'bg-slate-50 text-slate-700 border-slate-200'
                                                                    }`}
                                                                >
                                                                    <span>{char}</span>
                                                                </div>
                                                                <span className="text-[9px] font-mono text-slate-400 mt-1">[{idx}]</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Aligned Pattern Row */}
                                                <div className="flex items-center gap-1.5 min-w-max pt-2">
                                                    {rkText.split('').map((_, idx) => {
                                                        const winStart = currentRkStep.windowIdx ?? 0;
                                                        const inWindow = idx >= winStart && idx < winStart + rkPattern.length;
                                                        const patIdx = idx - winStart;
                                                        const patChar = inWindow ? rkPattern[patIdx] : null;

                                                        if (!inWindow) {
                                                            return (
                                                                <div key={idx} className="w-9 h-11 shrink-0 flex items-center justify-center">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                                                </div>
                                                            );
                                                        }

                                                        const compItem = currentRkStep.comparingChars?.find(c => c.patIdx === patIdx);

                                                        return (
                                                            <div key={idx} className="flex flex-col items-center w-9 shrink-0">
                                                                <div
                                                                    className={`w-9 h-11 rounded-lg flex flex-col items-center justify-center border font-mono font-bold text-sm transition-all ${
                                                                        compItem
                                                                            ? compItem.matches
                                                                                ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                                                                                : 'bg-rose-100 text-rose-900 border-rose-400'
                                                                            : 'bg-purple-100 text-purple-900 border-purple-300'
                                                                    }`}
                                                                >
                                                                    <span>{patChar}</span>
                                                                </div>
                                                                <span className="text-[9px] font-mono text-purple-600 font-bold mt-1">P[{patIdx}]</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Discovered Match Indices */}
                                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-mono font-bold text-slate-600">Discovered Matches:</span>
                                                    {currentRkStep.matches && currentRkStep.matches.length > 0 ? (
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            {currentRkStep.matches.map(idx => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono text-[11px] font-bold"
                                                                >
                                                                    Index {idx} ("{rkText.substring(idx, idx + rkPattern.length)}")
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs font-mono text-slate-400 italic">No matches discovered yet</span>
                                                    )}
                                                </div>
                                                <div className="text-[11px] font-mono text-slate-500">
                                                    Average search time: <span className="font-bold text-slate-800">O(N + M)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── LIVE INTERACTION TERMINAL LOG ────────────────── */}
                        <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                                <span className="font-bold flex items-center gap-1.5 text-slate-300">
                                    <Terminal size={12} className="text-emerald-400" />
                                    Module {activeModuleNumber} Interaction Log
                                </span>
                                <span className="font-mono text-[10px]">Real-Time Execution</span>
                            </div>
                            <div className="font-mono text-xs space-y-1 max-h-20 overflow-y-auto">
                                {logHistory.length === 0 ? (
                                    <div className="text-slate-500 italic text-[11px]">
                                        Ready for interaction. Use the action buttons above to step through!
                                    </div>
                                ) : (
                                    logHistory.map((entry, idx) => (
                                        <div key={idx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                                            <span className="text-slate-500 text-[10px] select-none">[{entry.time}]</span>
                                            <span className="text-emerald-400 select-none">❯</span>
                                            <span className="flex-1">{entry.text}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
