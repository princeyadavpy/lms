import React from 'react';
import { 
    Activity, 
    Cpu, 
    ArrowRight, 
    Sparkles, 
    CheckCircle2, 
    Layers, 
    Zap, 
    Database, 
    Terminal,
    Code2,
    ShieldAlert,
    HelpCircle
} from 'lucide-react';

/**
 * CppExecutionInspector
 * Side-by-side Live Execution Inspector placed in the Right Column directly beside the Code Editor.
 * Gives students immediate simultaneous view of Code (Left) and Live Execution State (Right).
 */
export default function CppExecutionInspector({
    currentStep = {},
    stepIdx = 0,
    totalSteps = 1,
    topicLabel = '',
    customEssence = null
}) {
    const vars = currentStep.vars || {};
    const varEntries = Object.entries(vars);
    const lineNum = currentStep.lineNum || 1;
    const action = currentStep.action || 'execute';
    const detail = currentStep.detail || 'Instruction executed';
    const explanation = currentStep.explanation || 'Current CPU instruction processed successfully.';

    // Infer C++ code essence based on action and detail
    const getCodeEssence = () => {
        if (customEssence) return customEssence;

        const actionLower = action.toLowerCase();
        const detailLower = detail.toLowerCase();

        if (actionLower.includes('ref') || detailLower.includes('reference') || detailLower.includes('alias')) {
            return {
                title: 'Reference Binding (Zero-Cost Alias)',
                mechanics: 'C++ creates an lvalue alias to an existing memory address. No new memory is reserved on the stack frame; the identifier resolves directly to the target memory cell in compiler symbol tables.',
                takeaway: 'Pass-by-reference avoids copying large objects, yielding instant performance gains with cleaner syntax than pointers.'
            };
        }
        if (actionLower.includes('construct') || detailLower.includes('construct') || actionLower.includes('init_obj')) {
            return {
                title: 'Object Lifecycle & Constructor Dispatch',
                mechanics: 'Memory is carved out on the current stack frame, then the constructor initializes member variables in the exact order they are declared in the class definition.',
                takeaway: 'C++ guarantees deterministic object initialization before any member function or operation can be performed.'
            };
        }
        if (actionLower.includes('destruct') || detailLower.includes('destruct') || detailLower.includes('clean') || actionLower.includes('unwind')) {
            return {
                title: 'RAII Stack Unwinding & Automatic Destruction',
                mechanics: 'When execution leaves scope (via normal return or thrown exception), the runtime executes destructors in exact reverse order of construction.',
                takeaway: 'Resource Acquisition Is Initialization (RAII) eliminates memory leaks and dangling resources without needing garbage collection.'
            };
        }
        if (actionLower.includes('heap') || actionLower.includes('alloc') || detailLower.includes('new') || detailLower.includes('delete')) {
            return {
                title: 'Dynamic Heap Allocation (new / delete)',
                mechanics: 'The "new" operator requests dynamic bytes from OS memory pools via the heap allocator, runs constructors in-place, and returns a 64-bit virtual memory pointer stored on the stack.',
                takeaway: 'Heap memory lives until explicitly released with "delete". Unfreed heap pointers cause memory leaks.'
            };
        }
        if (actionLower.includes('overload') || detailLower.includes('operator')) {
            return {
                title: 'Operator Polymorphism & Synthetic Member Call',
                mechanics: 'C++ compiler translates syntactic operators (like +, -, <<) into explicit method invocations such as obj.operator+(rhs) or operator<<(cout, obj).',
                takeaway: 'User-defined types achieve first-class syntax parity with primitive hardware data types.'
            };
        }
        if (actionLower.includes('virtual') || detailLower.includes('vtable') || detailLower.includes('vptr')) {
            return {
                title: 'Dynamic Dispatch via VPTR & VTable',
                mechanics: 'The compiler inserts an invisible 8-byte pointer (__vptr) at offset 0 of the object pointing to the class virtual method table (VTable). Resolves virtual calls at runtime.',
                takeaway: 'Runtime polymorphism enables extensible object hierarchies without modifying existing client code.'
            };
        }
        if (actionLower.includes('file') || actionLower.includes('stream') || detailLower.includes('seek') || detailLower.includes('stream')) {
            return {
                title: 'Buffered File Stream Pipeline',
                mechanics: 'The std::fstream object manages an in-memory buffer synced with the OS kernel file descriptor. File pointers (get/put) control exact byte cursor offsets.',
                takeaway: 'Streams separate formatted high-level abstraction (<<, >>) from low-level physical block disk I/O.'
            };
        }
        if (actionLower.includes('throw') || actionLower.includes('catch') || detailLower.includes('exception')) {
            return {
                title: 'Exception Trapping & Control Flow Redirection',
                mechanics: 'The throw statement creates an exception object in a dedicated runtime area, stops current execution, and walks up the call stack to find a matching catch block.',
                takeaway: 'Guarantees that errors cannot be silently ignored while preserving RAII cleanup across intermediate frames.'
            };
        }

        return {
            title: 'Sequential Instruction Execution',
            mechanics: `Instruction at Line ${lineNum} executes on the CPU ALU/FPU registers, updating local variable state and committing changes to the stack memory frame.`,
            takeaway: 'C++ compiles directly to native machine code with zero runtime overhead or VM interpretation.'
        };
    };

    const essence = getCodeEssence();

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 font-sans">
            {/* Header with Step Progress & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                        Live Execution &amp; State Mutation
                    </h3>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                        Line {lineNum}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 font-semibold">
                        Step {stepIdx + 1} / {totalSteps}
                    </span>
                </div>
            </div>

            {/* 1. CPU Instruction Pipeline Diagram */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center justify-between">
                    <span>CPU Instruction Cycle:</span>
                    <span className="text-blue-600 font-semibold">Native Pipeline</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-mono">
                    {/* Stage 1: Fetch */}
                    <div className="p-2 rounded-lg border bg-white border-slate-200 shadow-2xs space-y-0.5">
                        <div className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            1. Fetch
                        </div>
                        <div className="font-bold text-slate-800 text-[10px]">Line {lineNum}</div>
                    </div>

                    {/* Stage 2: Decode */}
                    <div className="p-2 rounded-lg border bg-white border-slate-200 shadow-2xs space-y-0.5">
                        <div className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            2. Decode
                        </div>
                        <div className="font-bold text-purple-700 text-[10px] truncate">{action}</div>
                    </div>

                    {/* Stage 3: Execute */}
                    <div className="p-2 rounded-lg border bg-blue-50/70 border-blue-200 shadow-2xs space-y-0.5 ring-1 ring-blue-300">
                        <div className="text-[9px] uppercase font-bold text-blue-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                            3. Execute
                        </div>
                        <div className="font-bold text-blue-900 text-[10px] truncate">{detail}</div>
                    </div>

                    {/* Stage 4: Commit */}
                    <div className="p-2 rounded-lg border bg-white border-slate-200 shadow-2xs space-y-0.5">
                        <div className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            4. Commit
                        </div>
                        <div className="font-bold text-emerald-700 text-[10px]">{varEntries.length} Slots</div>
                    </div>
                </div>
            </div>

            {/* 2. Visual Variable State Cards */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                    <span className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-blue-600" />
                        In-Scope Identifiers &amp; Registers
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                        {varEntries.length} Variables
                    </span>
                </div>

                {varEntries.length === 0 ? (
                    <div className="p-3 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                        No active local variables initialized at this step.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {varEntries.map(([vKey, vVal], i) => {
                            const isRef = vKey.includes('&') || String(vVal).includes('alias');
                            const isPtr = vKey.includes('*') || vKey.startsWith('ptr') || String(vVal).startsWith('0x');
                            
                            return (
                                <div 
                                    key={vKey + i}
                                    className={`p-2 rounded-xl border transition-all text-xs space-y-1 ${
                                        isRef
                                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 ring-1 ring-emerald-200'
                                            : isPtr
                                            ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                                            : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-blue-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono font-bold text-slate-900 truncate max-w-[120px]">
                                            {vKey}
                                        </span>
                                        <span className={`text-[8px] px-1.5 py-0.2 rounded font-sans font-bold uppercase ${
                                            isRef 
                                                ? 'bg-emerald-600 text-white' 
                                                : isPtr 
                                                ? 'bg-amber-600 text-white' 
                                                : 'bg-slate-200 text-slate-600'
                                        }`}>
                                            {isRef ? 'Alias' : isPtr ? 'Pointer' : 'Var'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 font-mono">
                                        <span className="text-[9px] text-slate-400 font-sans">Value:</span>
                                        <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-bold text-blue-700 truncate max-w-[130px] shadow-2xs text-[11px]">
                                            {String(vVal)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Step Action Banner */}
                <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 space-y-0.5">
                    <div className="font-bold flex items-center gap-1.5 text-blue-800 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        <span>Operation: {detail}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                        {explanation}
                    </p>
                </div>
            </div>

            {/* 3. C++ Code Essence & Under-the-Hood Architectural Mechanics */}
            <div className="p-3 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/40 space-y-2 text-xs">
                <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-blue-600" />
                        {essence.title}
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                        {essence.mechanics}
                    </p>
                </div>

                <div className="p-2 rounded-lg bg-white border border-blue-100 shadow-2xs space-y-0.5">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        Key Engineering Takeaway
                    </div>
                    <p className="text-[10px] text-slate-700 font-medium leading-relaxed">
                        {essence.takeaway}
                    </p>
                </div>
            </div>
        </div>
    );
}
