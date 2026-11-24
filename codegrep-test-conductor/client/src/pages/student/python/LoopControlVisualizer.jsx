import React from 'react';
import CodeVisualizer from './CodeVisualizer';

const EXAMPLES = [
    {
        id: 'break-continue',
        label: 'break & continue',
        code: `for i in range(1, 8):
    if i == 3:
        continue
    if i == 6:
        break
    print(i)`,
    },
    {
        id: 'break-search',
        label: 'break (Search)',
        code: `numbers = [4, 7, 2, 9, 1]
target = 9
found = 0

for n in numbers:
    if n == target:
        found = 1
        break
    print(n)

if found == 1:
    print("Found it!")
else:
    print("Not found")`,
    },
    {
        id: 'continue-skip',
        label: 'continue (Skip)',
        code: `for i in range(1, 6):
    if i == 3:
        continue
    print(i)`,
    },
    {
        id: 'pass-placeholder',
        label: 'pass',
        code: `for i in range(1, 4):
    if i == 2:
        pass
    print(i)`,
    },
    {
        id: 'for-else',
        label: 'for-else (break)',
        code: `for i in range(2, 6):
    if i == 4:
        print("Found 4!")
        break
    print(i)
else:
    print("Loop finished normally")`,
    },
];

const CHALLENGES = [
    {
        code: `for i in range(1, 8):\n    if i == 3:\n        continue\n    if i == 6:\n        break\n    print(i)`,
        question: 'Which numbers are printed?',
        options: ['1, 2, 3, 4, 5', '1, 2, 4, 5', '1, 2, 4, 5, 6', '1, 2'],
        correct: '1, 2, 4, 5',
        explanation: 'i=1: print. i=2: print. i=3: continue (skip print). i=4: print. i=5: print. i=6: break (exit loop). Output: 1, 2, 4, 5.',
    },
    {
        code: `for i in range(1, 4):\n    if i == 2:\n        pass\n    print(i)`,
        question: 'What does pass do here?',
        options: ['Skips printing 2', 'Does nothing, all 3 numbers print', 'Breaks the loop', 'Causes an error'],
        correct: 'Does nothing, all 3 numbers print',
        explanation: 'pass is a no-op placeholder. It does absolutely nothing. Python continues to print(i) for all values: 1, 2, 3.',
    },
    {
        code: `for i in range(2, 6):\n    if i == 4:\n        print("Found 4!")\n        break\n    print(i)\nelse:\n    print("Loop finished normally")`,
        question: 'Does "Loop finished normally" print?',
        options: ['Yes', 'No', 'Error', 'Only if i < 4'],
        correct: 'No',
        explanation: 'The for-else clause runs ONLY if the loop ends without break. Here break executes at i=4, so the else block is skipped.',
    },
    {
        code: `for i in range(1, 5):\n    if i == 2:\n        continue\n    if i == 4:\n        break\n    print(i)`,
        question: 'What is printed?',
        options: ['1, 3', '1, 2, 3', '1', '1, 3, 4'],
        correct: '1, 3',
        explanation: 'i=1: print(1). i=2: continue (skip). i=3: print(3). i=4: break (exit). Output: 1, 3.',
    },
];

export default function LoopControlVisualizer() {
    return (
        <CodeVisualizer
            title="break, continue, pass & Loop Control"
            subtitle='Edit the code, click "Run Code", and watch how break exits loops, continue skips iterations, and pass does nothing.'
            badgeText="Control Flow Visualizer"
            examples={EXAMPLES}
            challenges={CHALLENGES}
        />
    );
}

