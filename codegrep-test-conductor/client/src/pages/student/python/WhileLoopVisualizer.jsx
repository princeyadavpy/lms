import React from 'react';
import CodeVisualizer from './CodeVisualizer';

const EXAMPLES = [
    {
        id: 'while-basic',
        label: 'Basic while',
        code: `n = 1

while n <= 5:
    print(n)
    n += 1`,
    },
    {
        id: 'while-countdown',
        label: 'Countdown',
        code: `count = 5

while count > 0:
    print(count)
    count -= 1

print("Liftoff!")`,
    },
    {
        id: 'while-else',
        label: 'while-else',
        code: `count = 0

while count < 3:
    print(count)
    count += 1
else:
    print("Loop ended naturally")`,
    },
    {
        id: 'while-sum',
        label: 'Sum Numbers',
        code: `total = 0
i = 1

while i <= 4:
    total += i
    print(total)
    i += 1

print("Final sum:")
print(total)`,
    },
];

const CHALLENGES = [
    {
        code: `n = 3\n\nwhile n > 0:\n    print(n)\n    n -= 1\n\nprint("Done!")`,
        question: 'What is the LAST line printed?',
        options: ['3', '1', '0', 'Done!'],
        correct: 'Done!',
        explanation: 'The while loop prints 3, 2, 1. When n becomes 0, the condition n > 0 is False, so the loop ends. Then print("Done!") runs.',
    },
    {
        code: `x = 10\n\nwhile x > 5:\n    x -= 3\n    print(x)`,
        question: 'What numbers are printed?',
        options: ['10, 7', '7, 4', '7, 4, 1', '10, 7, 4'],
        correct: '7, 4',
        explanation: 'x starts at 10. First iteration: x=7 (print 7). Second: x=4 (print 4). Now 4 > 5 is False, so the loop stops.',
    },
    {
        code: `count = 0\n\nwhile count < 3:\n    print(count)\n    count += 1\nelse:\n    print("Finished!")`,
        question: 'Does "Finished!" get printed?',
        options: ['Yes', 'No', 'Error', 'Only if count is 0'],
        correct: 'Yes',
        explanation: 'The while-else clause runs when the loop ends naturally (without break). Here the loop finishes normally, so "Finished!" prints.',
    },
    {
        code: `total = 0\ni = 1\n\nwhile i <= 3:\n    total += i\n    i += 1\n\nprint(total)`,
        question: 'What value is printed?',
        options: ['3', '5', '6', '1'],
        correct: '6',
        explanation: 'total accumulates: 0+1=1, 1+2=3, 3+3=6. After the loop, print(total) outputs 6.',
    },
];

export default function WhileLoopVisualizer() {
    return (
        <CodeVisualizer
            title="The while Loop & while-else"
            subtitle='Edit the code, click "Run Code", and watch how Python repeats the loop body while the condition stays True.'
            badgeText="Loop Visualizer"
            examples={EXAMPLES}
            challenges={CHALLENGES}
        />
    );
}

