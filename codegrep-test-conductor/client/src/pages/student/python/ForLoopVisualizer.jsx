import React from 'react';
import CodeVisualizer from './CodeVisualizer';

const EXAMPLES = [
    {
        id: 'for-list',
        label: 'List Iteration',
        code: `fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(fruit)`,
    },
    {
        id: 'for-range',
        label: 'range()',
        code: `for i in range(1, 6):
    print(i)`,
    },
    {
        id: 'for-range-step',
        label: 'range(step)',
        code: `for i in range(0, 10, 2):
    print(i)`,
    },
    {
        id: 'for-string',
        label: 'String Chars',
        code: `word = "Hi!"

for char in word:
    print(char)`,
    },
    {
        id: 'for-sum',
        label: 'Sum with for',
        code: `total = 0

for num in range(1, 6):
    total += num
    print(total)

print("Final:")
print(total)`,
    },
];

const CHALLENGES = [
    {
        code: `for i in range(3):\n    print(i)`,
        question: 'What numbers are printed?',
        options: ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3', '1, 2'],
        correct: '0, 1, 2',
        explanation: 'range(3) produces 0, 1, 2 (starts at 0, stops BEFORE 3). So Python prints 0, 1, 2.',
    },
    {
        code: `for i in range(5, 0, -1):\n    print(i)`,
        question: 'What is the FIRST number printed?',
        options: ['0', '1', '5', '4'],
        correct: '5',
        explanation: 'range(5, 0, -1) counts down: 5, 4, 3, 2, 1. The first value is 5.',
    },
    {
        code: `colors = ["red", "green", "blue"]\n\nfor c in colors:\n    print(c)`,
        question: 'How many times does the loop body execute?',
        options: ['1', '2', '3', '4'],
        correct: '3',
        explanation: 'The list has 3 items (red, green, blue), so the loop body runs exactly 3 times.',
    },
    {
        code: `total = 0\n\nfor x in range(1, 4):\n    total += x\n\nprint(total)`,
        question: 'What is printed?',
        options: ['3', '6', '10', '4'],
        correct: '6',
        explanation: 'range(1, 4) gives 1, 2, 3. total = 1 + 2 + 3 = 6.',
    },
];

export default function ForLoopVisualizer() {
    return (
        <CodeVisualizer
            title="The for Loop & range()"
            subtitle='Edit the code, click "Run Code", and watch how Python iterates over sequences item by item.'
            badgeText="Loop Visualizer"
            examples={EXAMPLES}
            challenges={CHALLENGES}
        />
    );
}

