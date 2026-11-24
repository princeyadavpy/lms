import React from 'react';
import { Database, Layers, Cpu, ArrowDown, ShieldCheck, Box, Tag, Link2 } from 'lucide-react';

/**
 * CppStackFootprint
 * Memory Address & Token Architecture • Stack Footprint
 * Renders the real-time C++ Virtual Memory Addresses (0x7ffe...), 
 * Reference Aliases, Activation Stack Frame, SP offsets, and Hardware Scales.
 */
export default function CppStackFootprint({
    vars = {},
    currentStep = {},
    stackFrameName = 'main()',
    heapBlocks = [],
    activeObject = null,
    topicLabel = ''
}) {
    const varEntries = Object.entries(vars || {});
    
    // Base memory address for stack frame
    const baseAddr = 0x7ffd10;
    const memorySlots = varEntries.map(([name, val], idx) => {
        const addrHex = '0x' + (baseAddr - idx * 8).toString(16);
        let typeName = 'int';
        let byteSize = 4;
        let isReference = false;
        let isPointer = false;
        let isHeapPtr = false;

        if (name.includes('&') || String(val).includes('alias') || String(val).includes('&')) {
            isReference = true;
            typeName = 'reference & (alias)';
            byteSize = 0; // References bind to existing lvalue slot
        } else if (name.includes('*') || name.startsWith('ptr') || String(val).startsWith('0x') || String(val).includes('0x')) {
            isPointer = true;
            typeName = 'pointer (8B)';
            byteSize = 8;
        } else if (typeof val === 'number') {
            if (Number.isInteger(val)) {
                typeName = 'int (4B)';
                byteSize = 4;
            } else {
                typeName = 'double (8B)';
                byteSize = 8;
            }
        } else if (typeof val === 'string') {
            if (val.startsWith('"') || val.length > 8) {
                typeName = 'std::string';
                byteSize = 24; // SSO string overhead
            } else if (val.startsWith("'")) {
                typeName = 'char (1B)';
                byteSize = 1;
            } else if (val === 'true' || val === 'false') {
                typeName = 'bool (1B)';
                byteSize = 1;
            } else {
                typeName = 'auto / object';
                byteSize = 4;
            }
        }

        if (String(val).includes('heap') || String(val).includes('new') || String(val).includes('0x10')) {
            isHeapPtr = true;
        }

        return {
            name,
            val,
            addr: isReference ? '0x' + (baseAddr).toString(16) : addrHex,
            typeName,
            byteSize,
            isReference,
            isPointer,
            isHeapPtr,
            offset: isReference ? '[same slot as target]' : `[rbp - ${idx * 8 + 4}]`
        };
    });

    const hasReference = memorySlots.some(s => s.isReference);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 font-sans mt-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        Memory Address &amp; Token Architecture &bull; Stack Footprint
                    </h3>
                    {topicLabel && (
                        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                            &bull; {topicLabel}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                        SP: 0x{(baseAddr - memorySlots.length * 8).toString(16)}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {memorySlots.length} Active Slots
                    </span>
                </div>
            </div>

            {/* Reference Alias Banner when references exist */}
            {hasReference && (
                <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                        <span className="flex items-center gap-1.5">
                            <Link2 className="w-4 h-4 text-emerald-600" />
                            Reference Variable Memory Alias Binding
                        </span>
                        <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-700">
                            Shared Address: 0x{baseAddr.toString(16)}
                        </span>
                    </div>
                    <div className="p-2.5 bg-white border border-dashed border-emerald-300 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-mono text-xs font-bold shadow-2xs">
                                original
                            </span>
                            <span className="text-slate-400 font-bold">&harr;</span>
                            <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-mono text-xs font-bold shadow-2xs">
                                &amp;ref (Alias)
                            </span>
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium hidden sm:block">
                            Points directly to the same physical memory slot. No additional memory allocated.
                        </div>
                    </div>
                </div>
            )}

            {/* Hardware Type Size Gauge */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center justify-between">
                    <span>C++ Hardware Architecture &amp; Type Allocation Gauge:</span>
                    <span className="text-blue-600 font-semibold">x86_64 ABI</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-center text-xs">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                        <div className="font-bold text-slate-800">bool / char</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">1 Byte (8-bit)</div>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                        <div className="font-bold text-slate-800">short</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">2 Bytes (16-bit)</div>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                        <div className="font-bold text-blue-700">int / float</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">4 Bytes (32-bit)</div>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                        <div className="font-bold text-emerald-700">double / ptr*</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">8 Bytes (64-bit)</div>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                        <div className="font-bold text-purple-700">Class Object</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">&Sigma;(Members) + Pad</div>
                    </div>
                </div>
            </div>

            {/* Main Footprint Grid: Stack Frame vs Virtual Memory Space */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Stack Activation Record (8 cols) */}
                <div className="lg:col-span-8 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                        <span className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-blue-600" />
                            Stack Activation Frame: <code className="text-blue-700">{stackFrameName}</code>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">High &rarr; Low Memory Address</span>
                    </div>

                    <div className="space-y-1.5 font-mono text-xs">
                        {/* Frame Header: Saved Return Address & RBP */}
                        <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between opacity-80 text-slate-500">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-bold text-slate-600">0x7ffd20</span>
                                <span className="font-semibold text-slate-700">[Saved RIP / Ret Address]</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-sans">Return to Caller / OS</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between opacity-80 text-slate-500">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-bold text-slate-600">0x7ffd18</span>
                                <span className="font-semibold text-slate-700">[Saved RBP Base Pointer]</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-sans">Previous Frame Pointer</span>
                        </div>

                        {/* Local Variable Slots in Current Frame */}
                        {memorySlots.length === 0 ? (
                            <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-slate-400 text-xs">
                                Frame initial state &bull; No local variables allocated yet
                            </div>
                        ) : (
                            memorySlots.map((slot, idx) => (
                                <div
                                    key={slot.name + idx}
                                    className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                                        slot.isReference
                                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 ring-1 ring-emerald-200'
                                            : slot.isHeapPtr
                                            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                                            : 'bg-white border-slate-200 text-slate-800 shadow-2xs hover:border-blue-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                                {slot.addr}
                                            </span>
                                            <span className="text-[9px] text-slate-400 mt-0.5 font-sans">{slot.offset}</span>
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5 font-bold text-xs">
                                                <span className="text-slate-900">{slot.name}</span>
                                                <span className="text-[10px] font-normal text-slate-400">({slot.typeName})</span>
                                                {slot.isReference && (
                                                    <span className="text-[9px] font-sans font-bold uppercase bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                                                        Memory Alias
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-slate-500 font-sans">
                                                {slot.isReference ? 'Binds to target lvalue slot' : `${slot.byteSize} Bytes contiguous memory`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-auto">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold font-sans">Val:</span>
                                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-emerald-400 font-bold text-xs shadow-2xs">
                                            {String(slot.val)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Top of Stack Pointer */}
                        <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-blue-900 font-semibold text-xs">
                            <span className="flex items-center gap-1.5">
                                <ArrowDown className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
                                Stack Pointer (SP / $rsp) &larr; Top of Stack
                            </span>
                            <span className="text-[10px] text-blue-600 font-mono">Grows Downward</span>
                        </div>
                    </div>
                </div>

                {/* Right Summary / Virtual Process Regions (4 cols) */}
                <div className="lg:col-span-4 space-y-3">
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5 text-blue-600" />
                            Virtual Memory Segment Map
                        </div>
                        <div className="space-y-1 font-mono text-[11px]">
                            <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                                <span className="font-bold text-blue-700">Stack (Frames)</span>
                                <span className="text-[10px] text-slate-500">Auto Storage (LIFO)</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                                <span className="font-bold text-amber-700">Heap (new/malloc)</span>
                                <span className="text-[10px] text-slate-500">Dynamic Storage</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                                <span className="font-bold text-purple-700">Data &amp; BSS Segment</span>
                                <span className="text-[10px] text-slate-500">Globals / Static</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                                <span className="font-bold text-slate-700">Text Segment</span>
                                <span className="text-[10px] text-slate-400">Machine Code</span>
                            </div>
                        </div>
                    </div>

                    {/* Step Action Detail */}
                    <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-blue-900">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                            Hardware Execution State
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                            {currentStep.explanation || 'Instruction executed on current stack frame.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
