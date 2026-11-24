import React from 'react';
import CodeVisualizer from './CodeVisualizer';

const EXAMPLES = [
    {
        id: 'if',
        label: 'Simple if',
        code: `age = 20

if age >= 18:
    print("Eligible to vote")`,
    },
    {
        id: 'if-else',
        label: 'if-else',
        code: `temperature = 15

if temperature > 25:
    print("It's Hot")
else:
    print("It's Cool")`,
    },
    {
        id: 'if-elif-else',
        label: 'if-elif-else',
        code: `marks = 72

if marks >= 90:
    print("Grade A")
elif marks >= 75:
    print("Grade B")
elif marks >= 60:
    print("Grade C")
else:
    print("Grade D")`,
    },
];

const CHALLENGES = [
    {
        code: `marks = 84\n\nif marks >= 90:\n    print("Grade A")\nelif marks >= 75:\n    print("Grade B")\nelif marks >= 60:\n    print("Grade C")\nelse:\n    print("Grade D")`,
        question: 'If marks = 84, what will be printed?',
        options: ['Grade A', 'Grade B', 'Grade C', 'Grade D'],
        correct: 'Grade B',
        explanation: '84 is not >= 90 (False), but 84 >= 75 is True. Python executes print("Grade B") and skips the rest.',
    },
    {
        code: `temperature = 28\n\nif temperature > 25:\n    print("It's Hot")\nelse:\n    print("It's Cool")`,
        question: 'If temperature = 28, what will be printed?',
        options: ["It's Hot", "It's Cool", 'Both execute', 'No output'],
        correct: "It's Hot",
        explanation: '28 > 25 is True, so Python takes the if-branch and prints "It\'s Hot".',
    },
    {
        code: `age = 16\n\nif age >= 18:\n    print("Eligible to vote")`,
        question: 'If age = 16, what appears in the output?',
        options: ['Eligible to vote', 'Nothing (no output)', 'Error', 'Underage'],
        correct: 'Nothing (no output)',
        explanation: '16 >= 18 is False. There is no else clause, so Python skips the print entirely — zero output.',
    },
    {
        code: `marks = 55\n\nif marks >= 90:\n    print("Grade A")\nelif marks >= 75:\n    print("Grade B")\nelif marks >= 60:\n    print("Grade C")\nelse:\n    print("Grade D")`,
        question: 'If marks = 55, which grade is printed?',
        options: ['Grade A', 'Grade B', 'Grade C', 'Grade D'],
        correct: 'Grade D',
        explanation: '55 fails all three conditions (>=90, >=75, >=60). Python falls into the else block and prints "Grade D".',
    },
];

export default function DecisionVisualizer() {
    return (
        <CodeVisualizer
            title="Decision-Making Statements"
            subtitle='Edit the code below, click "Run Code", and watch how Python evaluates if, if-else, and if-elif-else.'
            badgeText="Interactive Code Visualizer"
            examples={EXAMPLES}
            challenges={CHALLENGES}
        />
    );
}
