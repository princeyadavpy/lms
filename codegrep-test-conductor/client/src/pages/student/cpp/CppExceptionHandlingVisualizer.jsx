import React, { useState, useEffect } from 'react';
import InteractiveEditorWithArrow, { getStepTransitionInfo } from '../python/InteractiveEditorWithArrow';
import CppExecutionInspector from './CppExecutionInspector';
import CppStackFootprint from './CppStackFootprint';
import {
    Play,
    RotateCcw,
    Code2,
    AlertTriangle,
    ShieldAlert,
    Terminal,
    Layers,
    ArrowRight,
    CornerDownRight,
    Trash2,
    CheckCircle2
} from 'lucide-react';

const TOPIC_PRESETS = [
    {
        topicId: 1,
        matchPattern: /various exception handling classes/i,
        label: '9.1 Exception Classes Hierarchy',
        code: `#include <iostream>
#include <vector>
#include <stdexcept>

int main() {
    std::vector<int> numbers = { 10, 20, 30 };

    try {
        // .at() performs bounds checking and throws std::out_of_range
        std::cout << "Element at index 5: " << numbers.at(5) << std::endl;
    }
    catch (const std::out_of_range& e) {
        // e.what() provides diagnostic description
        std::cout << "Caught out_of_range: " << e.what() << std::endl;
    }
    catch (const std::exception& e) {
        std::cout << "Caught generic exception: " << e.what() << std::endl;
    }

    std::cout << "Program resumes safely." << std::endl;
    return 0;
}`,
        steps: [
            { lineNum: 6, action: 'init_vector', detail: 'std::vector<int> numbers = {10, 20, 30}', explanation: 'Vector initialized with size 3 (indices 0, 1, 2).', vars: { size: 3, validIndices: '0..2' }, output: [] },
            { lineNum: 8, action: 'enter_try', detail: 'try block entered', explanation: 'Establishes an active exception protection frame on the thread execution context.', vars: { tryBlockActive: true }, output: [] },
            { lineNum: 10, action: 'throw_out_of_range', detail: 'numbers.at(5) throws std::out_of_range', explanation: 'Requested index 5 is >= size (3). Method immediately creates and throws std::out_of_range object.', vars: { exceptionThrown: 'std::out_of_range', message: '"vector::_M_range_check: __n >= this->size()"' }, output: [] },
            { lineNum: 12, action: 'match_catch', detail: 'catch (const std::out_of_range& e)', explanation: 'Exception Dispatcher matches dynamic type std::out_of_range. Binds reference e.', vars: { handledBy: 'std::out_of_range', 'e.what()': 'vector range check error' }, output: [] },
            { lineNum: 14, action: 'print_error', detail: 'std::cout << "Caught out_of_range: ..."', explanation: 'Diagnostic string printed from e.what().', vars: { handled: true }, output: ['Caught out_of_range: vector::_M_range_check: __n >= this->size()'] },
            { lineNum: 20, action: 'resume', detail: 'Program resumes safely', explanation: 'Normal execution resumes immediately after try-catch block without crash.', vars: { status: 'NORMAL' }, output: ['Caught out_of_range: vector::_M_range_check: __n >= this->size()', 'Program resumes safely.', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 2,
        matchPattern: /implementing try and catch block/i,
        label: '9.2 Multi-Catch & Catch-All',
        code: `#include <iostream>
#include <stdexcept>

void validateAge(int age) {
    if (age < 0) throw std::invalid_argument("Negative age!");
    if (age > 150) throw std::runtime_error("Age exceeds biological limits!");
    if (age == 0) throw "Unspecified string exception";
}

int main() {
    try {
        validateAge(-5);
    }
    catch (const std::invalid_argument& e) {
        std::cout << "Invalid Argument caught: " << e.what() << std::endl;
    }
    catch (const std::runtime_error& e) {
        std::cout << "Runtime Error caught: " << e.what() << std::endl;
    }
    catch (...) { // Catch-All Default Handler
        std::cout << "Catch-all handler intercepted unknown exception!" << std::endl;
    }
    return 0;
}`,
        steps: [
            { lineNum: 12, action: 'call_fn', detail: 'validateAge(-5)', explanation: 'Function invoked inside guarded try block.', vars: { age: -5 }, output: [] },
            { lineNum: 5, action: 'check_and_throw', detail: 'throw std::invalid_argument', explanation: 'Condition age < 0 is true. Instantiates and throws std::invalid_argument.', vars: { thrownType: 'std::invalid_argument', errorMsg: '"Negative age!"' }, output: [] },
            { lineNum: 14, action: 'catch_match', detail: 'Matched: catch (const std::invalid_argument&)', explanation: 'First catch block matches the exact thrown type std::invalid_argument.', vars: { caughtBy: 'catch (const std::invalid_argument&)' }, output: [] },
            { lineNum: 15, action: 'handle_print', detail: 'Print caught diagnostic', explanation: 'Outputs error and safely terminates handler block.', vars: { handled: true }, output: ['Invalid Argument caught: Negative age!'] },
            { lineNum: 23, action: 'return', detail: 'return 0', explanation: 'Remaining catch blocks (runtime_error and ...) skipped. Clean exit.', vars: {}, output: ['Invalid Argument caught: Negative age!', '[Process completed with code 0]'] }
        ]
    },
    {
        topicId: 3,
        matchPattern: /use of throw keyword/i,
        label: '9.3 Throw & Stack Unwinding',
        code: `#include <iostream>
#include <stdexcept>

class DatabaseConnection {
public:
    DatabaseConnection() { std::cout << "1. DB Connected (Acquired)" << std::endl; }
    ~DatabaseConnection() { std::cout << "3. DB Closed (RAII Cleanup!)" << std::endl; }
};

void performTransaction() {
    DatabaseConnection db; // Local stack object
    std::cout << "2. Processing Query..." << std::endl;
    throw std::runtime_error("Network timeout during query!");
}

int main() {
    try {
        performTransaction();
    }
    catch (const std::runtime_error& e) {
        std::cout << "4. Caught Exception in main(): " << e.what() << std::endl;
    }
    return 0;
}`,
        steps: [
            { lineNum: 18, action: 'enter_main', detail: 'main() enters try block', explanation: 'Try block wraps call to performTransaction().', vars: { callStack: ['main()'] }, output: [] },
            { lineNum: 12, action: 'construct_raii', detail: 'DatabaseConnection db constructed', explanation: 'Stack object initialized. Resource acquired safely (RAII pattern).', vars: { callStack: ['main()', 'performTransaction()'], 'db.status': 'OPEN' }, output: ['1. DB Connected (Acquired)'] },
            { lineNum: 13, action: 'process_query', detail: 'Processing query...', explanation: 'Function performs work before encountering critical failure.', vars: { callStack: ['main()', 'performTransaction()'] }, output: ['1. DB Connected (Acquired)', '2. Processing Query...'] },
            { lineNum: 14, action: 'throw_runtime', detail: 'throw std::runtime_error(...)', explanation: 'Exception thrown! Stack Unwinding begins immediately: local variables in current frame will be destroyed.', vars: { activeException: 'std::runtime_error' }, output: ['1. DB Connected (Acquired)', '2. Processing Query...'] },
            { lineNum: 8, action: 'stack_unwind', detail: 'Stack Unwinding: ~DatabaseConnection() called', explanation: 'Before leaving performTransaction frame, C++ runtime calls destructor for local db object to prevent resource leaks!', vars: { 'db.status': 'DESTROYED', unwoundFrame: 'performTransaction()' }, output: ['1. DB Connected (Acquired)', '2. Processing Query...', '3. DB Closed (RAII Cleanup!)'] },
            { lineNum: 20, action: 'caught_in_main', detail: 'main() catch block intercepts exception', explanation: 'Stack unwinding lands safely at main\'s catch block. Destructors completed, leak prevented.', vars: { callStack: ['main()'], caught: true }, output: ['1. DB Connected (Acquired)', '2. Processing Query...', '3. DB Closed (RAII Cleanup!)', '4. Caught Exception in main(): Network timeout during query!', '[Process completed with code 0]'] }
        ]
    }
];

export default function CppExceptionHandlingVisualizer({ activeLesson, lessonOrder, lessonTitle }) {
    const getInitialPreset = () => {
        if (lessonOrder && lessonOrder >= 1 && lessonOrder <= TOPIC_PRESETS.length) {
            return TOPIC_PRESETS[lessonOrder - 1];
        }
        if (lessonTitle) {
            const found = TOPIC_PRESETS.find(p => p.matchPattern.test(lessonTitle));
            if (found) return found;
        }
        return TOPIC_PRESETS[2]; // Default to Stack Unwinding
    };

    const [selectedExample, setSelectedExample] = useState(getInitialPreset());
    const [code, setCode] = useState(getInitialPreset().code);
    const [stepIdx, setStepIdx] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState('normal');

    const getDelay = (s) => {
        if (s === 'slow') return 1800;
        if (s === 'fast') return 600;
        if (typeof s === 'number') {
            if (s === 2) return 600;
            if (s === 0.5) return 1800;
            return 1200;
        }
        return 1200;
    };

    useEffect(() => {
        let matched = null;
        if (lessonOrder && lessonOrder >= 1 && lessonOrder <= TOPIC_PRESETS.length) {
            matched = TOPIC_PRESETS[lessonOrder - 1];
        } else if (lessonTitle) {
            matched = TOPIC_PRESETS.find(p => p.matchPattern.test(lessonTitle));
        }
        if (matched && matched.topicId !== selectedExample.topicId) {
            setSelectedExample(matched);
            setCode(matched.code);
            setStepIdx(0);
            setIsRunning(false);
        }
    }, [lessonOrder, lessonTitle]);

    const simulationSteps = selectedExample.steps || TOPIC_PRESETS[2].steps;
    const currentStep = simulationSteps[stepIdx] || simulationSteps[0];
    const transitionInfo = getStepTransitionInfo(simulationSteps, stepIdx);

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setTimeout(() => {
                setStepIdx(prev => {
                    if (prev < simulationSteps.length - 1) {
                        return prev + 1;
                    } else {
                        setIsRunning(false);
                        return prev;
                    }
                });
            }, getDelay(speed));
        }
        return () => clearTimeout(timer);
    }, [isRunning, stepIdx, speed, simulationSteps.length]);

    const handleSelectExample = (ex) => {
        setSelectedExample(ex);
        setCode(ex.code);
        setStepIdx(0);
        setIsRunning(false);
    };

    return (
        <div className="space-y-4 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        C++ Exception Handling &amp; Stack Unwinding
                    </h2>
                    <span className="text-xs text-slate-500 font-medium">
                        &bull; {selectedExample.label}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80">
                    {TOPIC_PRESETS.map(ex => (
                        <button
                            key={ex.topicId}
                            onClick={() => handleSelectExample(ex)}
                            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                                selectedExample.topicId === ex.topicId
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                            }`}
                        >
                            {ex.label.split(' ')[0]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Split Screen Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left Column: Code Editor (6 Cols) */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                            <Code2 className="w-3.5 h-3.5 text-blue-600" />
                            Live C++ Code Execution
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {selectedExample.label}
                        </span>
                    </div>

                    <InteractiveEditorWithArrow
                        code={code}
                        setCode={setCode}
                        currentLineNum={currentStep.lineNum}
                        transitionInfo={transitionInfo}
                        isRunning={isRunning}
                        runCode={() => {
                            if (isRunning) {
                                setIsRunning(false);
                            } else {
                                if (stepIdx >= simulationSteps.length - 1) setStepIdx(0);
                                setIsRunning(true);
                            }
                        }}
                        stepForward={() => {
                            setIsRunning(false);
                            if (stepIdx < simulationSteps.length - 1) setStepIdx(prev => prev + 1);
                        }}
                        resetExecution={() => {
                            setStepIdx(0);
                            setIsRunning(false);
                        }}
                        speed={speed}
                        setSpeed={setSpeed}
                        statusText={isRunning ? `Executing line ${currentStep.lineNum}...` : (stepIdx >= simulationSteps.length - 1 ? '✓ Execution Complete' : `Line ${currentStep.lineNum} (${currentStep.action || 'ready'})`)}
                        stepCounterText={`Step ${stepIdx + 1} / ${simulationSteps.length}`}
                        badgeText="C++ Engine"
                        fileName="main.cpp"
                    />

                    {/* Terminal Output */}
                    <div className="bg-[#0f172a] rounded-xl border border-slate-800 p-3 font-mono text-xs shadow-inner">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
                            <span className="flex items-center gap-1.5 font-bold">
                                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                                Standard Output (stdout)
                            </span>
                            <span className="text-[10px] text-slate-500">g++ -std=c++20</span>
                        </div>
                        <div className="min-h-[44px] text-emerald-400 space-y-1">
                            {(currentStep.output || []).length === 0 ? (
                                <span className="text-slate-600 italic">No output yet. Click "Run" or "Step" to execute.</span>
                            ) : (
                                currentStep.output.map((out, idx) => (
                                    <div key={idx} className="leading-snug">{out}</div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Live Execution & Visual Exception Architecture (6 Cols) */}
                <div className="lg:col-span-6 space-y-4">
                    {/* Live Execution & State Mutation (Right-Top Aligned with Code) */}
                    <CppExecutionInspector
                        currentStep={currentStep}
                        stepIdx={stepIdx}
                        totalSteps={simulationSteps.length}
                        topicLabel={selectedExample.label}
                    />

                    {/* Visualizer Mode 1: std::exception Hierarchy Tree */}
                    {selectedExample.topicId === 1 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <Layers className="w-4 h-4 text-blue-600" />
                                    std::exception Class Hierarchy
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                                    Virtual Method: what()
                                </span>
                            </div>

                            {/* Tree Structure */}
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3 font-mono text-xs">
                                {/* Root */}
                                <div className="p-2 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-between shadow-xs">
                                    <span>std::exception</span>
                                    <span className="text-[10px] font-normal opacity-85">Base Polymorphic Class</span>
                                </div>

                                <div className="pl-4 border-l-2 border-blue-300 space-y-2">
                                    {/* Branch 1: logic_error */}
                                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                                        <div className="font-bold text-slate-800">├── std::logic_error</div>
                                        <div className="pl-4 mt-1 space-y-1">
                                            <div className={`p-1.5 rounded border text-[11px] flex items-center justify-between ${
                                                currentStep.vars.exceptionThrown === 'std::out_of_range'
                                                    ? 'bg-rose-50 border-rose-300 text-rose-800 font-bold ring-2 ring-rose-200'
                                                    : 'bg-slate-50 border-slate-200 text-slate-600'
                                            }`}>
                                                <span>std::out_of_range</span>
                                                {currentStep.vars.exceptionThrown === 'std::out_of_range' && (
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-600 text-white uppercase font-sans font-black">
                                                        Active Thrown
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-[11px] text-slate-500 pl-2">std::invalid_argument</div>
                                            <div className="text-[11px] text-slate-500 pl-2">std::length_error</div>
                                        </div>
                                    </div>

                                    {/* Branch 2: runtime_error */}
                                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                                        <div className="font-bold text-slate-800">├── std::runtime_error</div>
                                        <div className="pl-4 mt-1 text-[11px] text-slate-500 space-y-0.5">
                                            <div>std::overflow_error</div>
                                            <div>std::range_error</div>
                                        </div>
                                    </div>

                                    {/* Branch 3: bad_alloc */}
                                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold">
                                        └── std::bad_alloc (new failure)
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Visualizer Mode 2: Multi-Catch Dispatcher */}
                    {selectedExample.topicId === 2 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <ShieldAlert className="w-4 h-4 text-blue-600" />
                                    Exception Type-Matching Pipeline
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                                    Top-Down Dispatch
                                </span>
                            </div>

                            {/* Catch Blocks Evaluation Stack */}
                            <div className="space-y-2 text-xs">
                                {[
                                    { block: 'catch (const std::invalid_argument& e)', type: 'std::invalid_argument', matched: currentStep.vars.caughtBy?.includes('invalid_argument') },
                                    { block: 'catch (const std::runtime_error& e)', type: 'std::runtime_error', matched: false },
                                    { block: 'catch (...)', type: 'Catch-All (Any Type)', matched: false }
                                ].map((c, i) => (
                                    <div
                                        key={i}
                                        className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                                            c.matched
                                                ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200 text-emerald-900 font-bold'
                                                : 'bg-slate-50 border-slate-200 text-slate-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-slate-400">#{i + 1}</span>
                                            <span className="font-mono text-xs">{c.block}</span>
                                        </div>
                                        {c.matched ? (
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-600 text-white font-sans font-bold flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Matched &amp; Executed
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-slate-400 font-sans">
                                                {currentStep.vars.handled ? 'Bypassed' : 'Awaiting Match'}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Visualizer Mode 3: Stack Unwinding & RAII Cleanup */}
                    {selectedExample.topicId === 3 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <Trash2 className="w-4 h-4 text-rose-600" />
                                    Stack Unwinding (RAII Destructor Guarantee)
                                </span>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                                    currentStep.vars.unwoundFrame
                                        ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                                        : 'bg-blue-50 text-blue-700 border-blue-200'
                                }`}>
                                    {currentStep.vars.unwoundFrame ? 'UNWINDING IN PROGRESS' : 'FRAME ACTIVE'}
                                </span>
                            </div>

                            {/* Stack Frames */}
                            <div className="space-y-2 text-xs">
                                {/* Frame 2: performTransaction */}
                                <div className={`p-3 rounded-xl border transition-all space-y-2 ${
                                    currentStep.vars.unwoundFrame
                                        ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-200'
                                        : (currentStep.vars.callStack || []).includes('performTransaction()')
                                        ? 'bg-blue-50/70 border-blue-300'
                                        : 'bg-slate-50 border-slate-200 opacity-50'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold font-mono text-slate-800">Stack Frame: performTransaction()</span>
                                        {currentStep.vars.unwoundFrame && (
                                            <span className="text-[10px] font-bold text-rose-600 uppercase flex items-center gap-1">
                                                <Trash2 className="w-3 h-3" />
                                                Popping Frame
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-2 rounded bg-white border border-slate-200 text-[11px] flex items-center justify-between">
                                        <span className="font-mono text-slate-600">Local: DatabaseConnection db</span>
                                        <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                                            currentStep.vars['db.status'] === 'DESTROYED'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {currentStep.vars['db.status'] === 'DESTROYED' ? '~db() Invoked (Safe)' : 'db Alive'}
                                        </span>
                                    </div>
                                </div>

                                {/* Frame 1: main */}
                                <div className={`p-3 rounded-xl border transition-all space-y-1.5 ${
                                    currentStep.vars.caught
                                        ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
                                        : 'bg-white border-slate-200'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold font-mono text-slate-800">Stack Frame: main()</span>
                                        {currentStep.vars.caught && (
                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                                Exception Caught!
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-[11px] text-slate-500 font-mono">
                                        try &#123; performTransaction(); &#125; catch (const std::runtime_error&amp;)
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Memory Address & Token Architecture • Stack Footprint */}
            <CppStackFootprint
                vars={currentStep.vars}
                currentStep={currentStep}
                stackFrameName={currentStep.vars?.unwoundFrame ? 'unwinding: performTransaction()' : (currentStep.vars?.callStack?.[currentStep.vars.callStack.length - 1] || 'main()')}
                topicLabel={selectedExample.label}
            />
        </div>
    );
}

