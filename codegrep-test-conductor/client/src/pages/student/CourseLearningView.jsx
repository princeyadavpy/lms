
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../contexts/AuthContext';
import CodeEditor from '../../components/CodeEditor';
import companyLogo from '../../assets/company-logo.png';
import DecisionVisualizer from './python/DecisionVisualizer';
import WhileLoopVisualizer from './python/WhileLoopVisualizer';
import ForLoopVisualizer from './python/ForLoopVisualizer';
import LoopControlVisualizer from './python/LoopControlVisualizer';
import ListVisualizer from './python/ListVisualizer';
import CopyTrapVisualizer from './python/CopyTrapVisualizer';
import GeneratorVisualizer from './python/GeneratorVisualizer';
import TupleVisualizer from './python/TupleVisualizer';
import DictHashMapVisualizer from './python/DictHashMapVisualizer';
import DictMethodsVisualizer from './python/DictMethodsVisualizer';
import SetOperationsVisualizer from './python/SetOperationsVisualizer';
import SetTheoryVisualizer from './python/SetTheoryVisualizer';
import FileReadVisualizer from './python/FileReadVisualizer';
import FileWriteVisualizer from './python/FileWriteVisualizer';
import StructuredDataVisualizer from './python/StructuredDataVisualizer';
import PickleBinaryVisualizer from './python/PickleBinaryVisualizer';
import BuiltinFunctionsVisualizer from './python/BuiltinFunctionsVisualizer';
import ArgsKwargsVisualizer from './python/ArgsKwargsVisualizer';
import ScopeLambdaVisualizer from './python/ScopeLambdaVisualizer';
import RecursionDecoratorVisualizer from './python/RecursionDecoratorVisualizer';
import ModulesPackagesVisualizer from './python/ModulesPackagesVisualizer';
import OOPOverviewVisualizer from './python/OOPOverviewVisualizer';
import ConstructorSelfVisualizer from './python/ConstructorSelfVisualizer';
import ClassVsInstanceVarsVisualizer from './python/ClassVsInstanceVarsVisualizer';
import MethodTypesAccessVisualizer from './python/MethodTypesAccessVisualizer';
import InheritancePolymorphismVisualizer from './python/InheritancePolymorphismVisualizer';
import AbstractClassVisualizer from './python/AbstractClassVisualizer';
import ErrorClassificationVisualizer from './python/ErrorClassificationVisualizer';
import TryExceptElseFinallyVisualizer from './python/TryExceptElseFinallyVisualizer';
import StandardExceptionsVisualizer from './python/StandardExceptionsVisualizer';
import CustomExceptionsVisualizer from './python/CustomExceptionsVisualizer';
import RegexSymbolsVisualizer from './python/RegexSymbolsVisualizer';
import MatchSearchFullmatchVisualizer from './python/MatchSearchFullmatchVisualizer';
import FindallSubVisualizer from './python/FindallSubVisualizer';
import GreedyLazyValidationVisualizer from './python/GreedyLazyValidationVisualizer';
import ProcessesVsThreadsGILVisualizer from './python/ProcessesVsThreadsGILVisualizer';
import ThreadingModuleVisualizer from './python/ThreadingModuleVisualizer';
import ThreadSynchronizationVisualizer from './python/ThreadSynchronizationVisualizer';
import SemaphoresQueuesVisualizer from './python/SemaphoresQueuesVisualizer';
import DeadlocksDaemonVisualizer from './python/DeadlocksDaemonVisualizer';
import DatabaseDriversVisualizer from './python/DatabaseDriversVisualizer';
import DatabaseConnectionVisualizer from './python/DatabaseConnectionVisualizer';
import DDLOperationsVisualizer from './python/DDLOperationsVisualizer';
import DMLInsertSQLInjectionVisualizer from './python/DMLInsertSQLInjectionVisualizer';
import ReadQueriesVisualizer from './python/ReadQueriesVisualizer';
import DDLvsDMLSqlite3Visualizer from './python/DDLvsDMLSqlite3Visualizer';
import NumpyIntroArraysVisualizer from './python/NumpyIntroArraysVisualizer';
import NumpyIndexingUfuncsVisualizer from './python/NumpyIndexingUfuncsVisualizer';
import NumpyProcessingFileIOVisualizer from './python/NumpyProcessingFileIOVisualizer';
import PandasSeriesDataFramesVisualizer from './python/PandasSeriesDataFramesVisualizer';
import PandasLocIlocAlignmentVisualizer from './python/PandasLocIlocAlignmentVisualizer';
import PandasStatsGroupbyMissingVisualizer from './python/PandasStatsGroupbyMissingVisualizer';
import MatplotlibVisualAnalyticsVisualizer from './python/MatplotlibVisualAnalyticsVisualizer';
import StudentResultsProjectVisualizer from './python/StudentResultsProjectVisualizer';
import CTokensVisualizer from './c/CTokensVisualizer';
import CControlVisualizer from './c/CControlVisualizer';
import CLoopVisualizer from './c/CLoopVisualizer';
import CArraysStringsVisualizer from './c/CArraysStringsVisualizer';
import CFunctionsVisualizer from './c/CFunctionsVisualizer';
import CPointersVisualizer from './c/CPointersVisualizer';
import CStructUnionVisualizer from './c/CStructUnionVisualizer';
import CFileHandlingVisualizer from './c/CFileHandlingVisualizer';
import CDynamicMemoryVisualizer from './c/CDynamicMemoryVisualizer';
import CStoragePreprocessorVisualizer from './c/CStoragePreprocessorVisualizer';
import CppIntroOOPVisualizer from './cpp/CppIntroOOPVisualizer';
import CppTokensVisualizer from './cpp/CppTokensVisualizer';
import CppClassesObjectsVisualizer from './cpp/CppClassesObjectsVisualizer';
import CppFunctionsVisualizer from './cpp/CppFunctionsVisualizer';
import CppConstructorsVisualizer from './cpp/CppConstructorsVisualizer';
import CppOperatorOverloadingVisualizer from './cpp/CppOperatorOverloadingVisualizer';
import CppInheritanceVisualizer from './cpp/CppInheritanceVisualizer';
import CppFileHandlingVisualizer from './cpp/CppFileHandlingVisualizer';
import CppExceptionHandlingVisualizer from './cpp/CppExceptionHandlingVisualizer';
import CompanyQuestionsTab from './CompanyQuestionsTab';
import { getQuestionsForCourseAndModule } from '../../data/interviewQuestions';
import {
    DSAVisualizer,
    MachineLearningVisualizer,
    DeepLearningVisualizer,
    GenerativeAIVisualizer,
    AgenticAIVisualizer,
    CSystemsVisualizer,
    ModernCppVisualizer,
    JavaEnterpriseVisualizer
} from './courseWise/CourseWiseVisualizer';
import { getCourseWiseDefaultCurriculum } from './courseWise/courseWiseDefaults';
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    CheckCircle2,
    Lock,
    BookOpen,
    Sparkles,
    HelpCircle,
    Briefcase,
    Code2,
    Volume2,
    VolumeX,
    Play,
    PlayCircle,
    Check,
    AlertCircle,
    ArrowRight,
    Terminal,
    RefreshCw,
    Menu,
    Pin,
    X,
    Shield,
    ShieldAlert,
    Clock,
    Flag,
    Maximize2,
    Minimize2,
    RotateCcw,
    Award,
    Printer
} from 'lucide-react';

class VisualizerErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error("Visualizer Error caught by Boundary:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-white border border-rose-200 rounded-2xl shadow-xs text-center space-y-4 my-4 animate-fadeIn">
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-800">Visualizer Error</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto font-mono">
                            {this.state.error?.message || "An unexpected error occurred while rendering this interactive visualizer."}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reload Visualizer</span>
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// Comprehensive, robust markdown parser for lesson contents in light LMS theme
const renderMarkdownContent = (raw) => {
    if (!raw) return '<p class="text-slate-500 italic">Lesson contents are loading or not populated yet.</p>';

    const escapeHtml = (str) => {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    const formatMathExpr = (expr) => {
        let m = String(expr)
            // Recover control chars created by unescaped \f (\frac), \t (\times, \Theta, \text), \r (\rightarrow)
            .replace(/\x0crac/g, '\\frac')
            .replace(/\trac/g, '\\frac')
            .replace(/\t(?=[a-zA-Z])/g, '\\t')
            .replace(/\r(?=[a-zA-Z])/g, '\\r')
            // Fractions: \frac{a}{b} -> (a)/(b) or a/b
            .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, (_, num, den) => `${num}/${den}`)
            // Greek & math symbols
            .replace(/\\Theta/g, 'Θ')
            .replace(/\\Omega/g, 'Ω')
            .replace(/\\Sigma/g, 'Σ')
            .replace(/\\alpha/g, 'α')
            .replace(/\\beta/g, 'β')
            .replace(/\\theta/g, 'θ')
            .replace(/\\times/g, '×')
            .replace(/\\cdot/g, '·')
            .replace(/\\rightarrow|\\to/g, '→')
            .replace(/\\leftarrow/g, '←')
            .replace(/\\le(?:q)?/g, '≤')
            .replace(/\\ge(?:q)?/g, '≥')
            .replace(/\\ne(?:q)?/g, '≠')
            .replace(/\\approx/g, '≈')
            .replace(/\\infty/g, '∞')
            .replace(/\\sum/g, '∑')
            .replace(/\\log/g, 'log')
            .replace(/\\sqrt\{([^}]*)\}/g, '√($1)')
            .replace(/\\text\{([^}]*)\}/g, '$1')
            .replace(/\\mathrm\{([^}]*)\}/g, '$1')
            .replace(/\\mathbf\{([^}]*)\}/g, '$1')
            .replace(/\\,/g, ' ')
            // Superscripts and subscripts
            .replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
            .replace(/\^([0-9a-zA-Z]+)/g, '<sup>$1</sup>')
            .replace(/_\{([^}]+)\}/g, '<sub>$1</sub>')
            .replace(/_([0-9a-zA-Z]+)/g, '<sub>$1</sub>');
        return `<span class="font-mono text-[12px] font-semibold text-slate-900 bg-slate-100/80 px-1.5 py-0.5 rounded">${m}</span>`;
    };

    const formatInline = (text) => {
        let t = text;
        // Inline code (`code`) — protect first so $ inside code is untouched
        const codePlaceholders = [];
        t = t.replace(/`([^`]+)`/g, (_, code) => {
            const idx = codePlaceholders.length;
            codePlaceholders.push(`<code class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[11px] border border-blue-200/70 font-semibold">${code}</code>`);
            return `@@CODE_${idx}@@`;
        });
        // Display/Inline math ($...$ or $$...$$)
        t = t.replace(/\$\$([^$\n]+?)\$\$/g, (_, expr) => formatMathExpr(expr));
        t = t.replace(/\$([^$\n]+?)\$/g, (full, expr) => {
            // Skip currency like "$100" if somehow paired or single
            if (/^\d[\d,.]*\s/.test(expr)) return full;
            return formatMathExpr(expr);
        });
        // Bold (**text**)
        t = t.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>');
        // Italics (*text*)
        t = t.replace(/\*(.*?)\*/g, '<em class="text-slate-800 italic">$1</em>');
        // Restore protected inline code
        t = t.replace(/@@CODE_(\d+)@@/g, (_, idx) => codePlaceholders[Number(idx)] || '');
        return t;
    };

    const tokenizePythonLine = (line) => {
        const tokenRegex = /(#.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b(def|class|return|if|elif|else|while|for|in|import|from|as|try|except|finally|raise|yield|with|assert|break|continue|pass|lambda|True|False|None)\b|\b(print|len|range|int|str|float|list|dict|set|tuple|sum|max|min|round|abs|type|id|open|zip|enumerate|input|isinstance)\b|\b(\d+(?:\.\d+)?)\b/g;

        let lastIndex = 0;
        let out = '';
        let match;

        while ((match = tokenRegex.exec(line)) !== null) {
            if (match.index > lastIndex) {
                out += escapeHtml(line.slice(lastIndex, match.index));
            }

            const [full, comment, str, kw, builtin, num] = match;
            if (comment) {
                out += `<span class="text-slate-500 italic">${escapeHtml(comment)}</span>`;
            } else if (str) {
                out += `<span class="text-emerald-300 font-medium">${escapeHtml(str)}</span>`;
            } else if (kw) {
                out += `<span class="text-purple-400 font-bold">${kw}</span>`;
            } else if (builtin) {
                out += `<span class="text-sky-300 font-semibold">${builtin}</span>`;
            } else if (num) {
                out += `<span class="text-amber-300 font-medium">${num}</span>`;
            }
            lastIndex = tokenRegex.lastIndex;
        }

        if (lastIndex < line.length) {
            out += escapeHtml(line.slice(lastIndex));
        }

        return out;
    };

    const highlightCodeSyntax = (rawCode) => {
        const codeLines = rawCode.split('\n');
        return codeLines.map((line, idx) => {
            const lineNum = idx + 1;
            const tokenizedHtml = tokenizePythonLine(line);

            return `
                <div class="flex items-start font-mono text-xs leading-[1.7rem] hover:bg-slate-800/40 px-3">
                    <span class="w-8 shrink-0 text-right select-none text-slate-600 pr-3 font-mono text-[11px]">${lineNum}</span>
                    <span class="text-slate-200 flex-1 whitespace-pre">${tokenizedHtml || '&nbsp;'}</span>
                </div>
            `;
        }).join('');
    };

    const lines = raw.split('\n');
    const result = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();

        // 1. Fenced Code Block (```lang ... ```)
        if (trimmed.startsWith('```')) {
            const lang = trimmed.replace(/^```/, '').trim() || 'python';
            const codeLines = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            if (i < lines.length) i++; // consume closing ```

            const rawCode = codeLines.join('\n');
            const highlightedHtml = highlightCodeSyntax(rawCode);

            result.push(`
                <div class="my-5 rounded-xl overflow-hidden border border-slate-800 bg-[#0b101b] shadow-sm select-text">
                    <!-- IDE Window Header -->
                    <div class="px-4 py-2.5 bg-[#080d16] border-b border-slate-800/90 flex items-center justify-between text-xs font-mono">
                        <div class="flex items-center gap-2">
                            <!-- macOS Window Dots -->
                            <div class="flex items-center gap-1.5 mr-2">
                                <span class="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                                <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                            </div>
                            <span class="text-slate-400 font-medium text-[11px]">main.py</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-mono tracking-wider">${escapeHtml(lang)}</span>
                        </div>
                    </div>
                    <!-- Code Body with Gutter -->
                    <div class="py-3 overflow-x-auto select-text">
                        ${highlightedHtml}
                    </div>
                </div>
            `);
            continue;
        }

        // 2. Markdown Table (| col1 | col2 |)
        if (trimmed.startsWith('|') && trimmed.endsWith('|') && i + 1 < lines.length && lines[i + 1].trim().includes('---')) {
            const headerCells = trimmed.split('|').slice(1, -1).map(c => c.trim());
            i += 2; // skip header and separator row

            const rowCellsList = [];
            while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
                const cells = lines[i].trim().split('|').slice(1, -1).map(c => c.trim());
                rowCellsList.push(cells);
                i++;
            }

            const theadHtml = headerCells.map(h => `<th class="px-4 py-3 font-bold text-slate-900 text-xs uppercase tracking-wider bg-slate-100/80 border-b border-slate-200">${formatInline(h)}</th>`).join('');
            const tbodyHtml = rowCellsList.map((row, rIdx) => {
                const tds = row.map(cell => `<td class="px-4 py-3 text-xs text-slate-700 leading-relaxed font-normal">${formatInline(cell)}</td>`).join('');
                return `<tr class="border-b border-slate-100 transition-colors ${rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'} hover:bg-blue-50/30">${tds}</tr>`;
            }).join('');

            result.push(`
                <div class="my-5 overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs">
                    <table class="w-full text-left border-collapse bg-white">
                        <thead><tr>${theadHtml}</tr></thead>
                        <tbody class="divide-y divide-slate-100">${tbodyHtml}</tbody>
                    </table>
                </div>
            `);
            continue;
        }

        // 3. Blockquote / Alert (> note)
        if (trimmed.startsWith('>')) {
            const quoteLines = [];
            while (i < lines.length && lines[i].trim().startsWith('>')) {
                quoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
                i++;
            }
            const quoteText = quoteLines.map(ql => formatInline(ql)).join(' ');
            result.push(`
                <div class="my-3.5 p-3.5 rounded-xl bg-blue-50/70 border-l-4 border-blue-600 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-1">
                    <p class="font-normal">${quoteText}</p>
                </div>
            `);
            continue;
        }

        // 4. Headings
        if (trimmed.startsWith('### ')) {
            result.push(`<h3 class="text-base sm:text-lg font-bold text-slate-900 mt-6 mb-2 tracking-tight">${formatInline(trimmed.slice(4))}</h3>`);
            i++;
            continue;
        }
        if (trimmed.startsWith('#### ')) {
            result.push(`<h4 class="text-sm sm:text-base font-bold text-slate-800 mt-4 mb-1.5 tracking-tight">${formatInline(trimmed.slice(5))}</h4>`);
            i++;
            continue;
        }
        if (trimmed.startsWith('## ')) {
            result.push(`<h2 class="text-lg sm:text-xl font-extrabold text-slate-900 mt-7 mb-2.5 tracking-tight">${formatInline(trimmed.slice(3))}</h2>`);
            i++;
            continue;
        }
        if (trimmed.startsWith('# ')) {
            result.push(`<h1 class="text-xl sm:text-2xl font-black text-slate-900 mt-8 mb-3 tracking-tight">${formatInline(trimmed.slice(2))}</h1>`);
            i++;
            continue;
        }

        // 5. Unordered List (- or *)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const listItems = [];
            while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
                listItems.push(lines[i].trim().replace(/^[-*]\s+/, ''));
                i++;
            }
            const lis = listItems.map(item => `<li class="leading-relaxed pl-1">${formatInline(item)}</li>`).join('');
            result.push(`<ul class="space-y-1.5 my-2.5 ml-5 list-disc text-slate-700 text-xs sm:text-sm marker:text-blue-600">${lis}</ul>`);
            continue;
        }

        // 6. Ordered List (1. 2. 3.)
        if (/^\d+\.\s+/.test(trimmed)) {
            const listItems = [];
            while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
                listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
                i++;
            }
            const lis = listItems.map(item => `<li class="leading-relaxed pl-1">${formatInline(item)}</li>`).join('');
            result.push(`<ol class="space-y-1.5 my-2.5 ml-5 list-decimal text-slate-700 text-xs sm:text-sm font-medium">${lis}</ol>`);
            continue;
        }

        // 7. Empty line
        if (trimmed === '') {
            result.push('<div class="h-1.5"></div>');
            i++;
            continue;
        }

        // 8. Regular paragraph
        result.push(`<p class="text-slate-700 leading-relaxed text-xs sm:text-sm font-normal my-1.5">${formatInline(trimmed)}</p>`);
        i++;
    }

    return result.join('');
};

// Topic-aware ASCII architectural conceptual flow diagram
const getTopicDiagram = (lesson, activeMod) => {
    if (lesson?.aiSummary?.conceptualDiagram) {
        return lesson.aiSummary.conceptualDiagram;
    }
    const title = (lesson?.title || '').toLowerCase();
    const modTitle = (activeMod?.title || '').toLowerCase();

    if (modTitle.includes('control') || title.includes('if') || title.includes('loop') || title.includes('while') || title.includes('for') || title.includes('break')) {
        return `[ Start: Code Execution ]
       │
       ▼
 ┌───────────────┐        True
 │ Condition     │ ─────────────────► [ Execute Branch / Loop Body ]
 │ Evaluation    │                             │
 └───────────────┘                             ▼
       │ False                      [ Update State / Counter ]
       ▼                                       │
 [ Else / Next Statement ] <───────────────────┘`;
    }

    if (modTitle.includes('list') || modTitle.includes('tuple') || title.includes('list') || title.includes('tuple') || title.includes('range')) {
        return `[ Python List: Dynamic Array Buffer in Memory ]
  Index:     [ 0 ]       [ 1 ]       [ 2 ]       [ 3 ]
  Pointer:   0x10A       0x11B       0x12C       0x13D
               │           │           │           │
               ▼           ▼           ▼           ▼
  Object:  "Python"      42        3.14       True`;
    }

    if (modTitle.includes('dict') || modTitle.includes('set') || title.includes('dict') || title.includes('set')) {
        return `[ Dictionary Hash Table: O(1) Key-Value Mapping ]
  Key: "user" ───► hash("user") ───► [ Hash Bucket #4 ]
                                             │
                                             ▼
                                    ("user", "Asha")`;
    }

    if (modTitle.includes('io') || modTitle.includes('input') || title.includes('file') || title.includes('csv') || title.includes('json')) {
        return `[ File I/O with Context Manager (with open()) ]
  Python Runtime ──with open()──► [ OS File Descriptor ]
                                         │
                                         ▼ read() / write()
                                  [ Disk Storage ]
                                         │
  Auto __exit__() Cleanup <──────────────┘`;
    }

    if (modTitle.includes('function') || title.includes('function') || title.includes('lambda') || title.includes('scope')) {
        return `[ LEGB Scope Resolution Pipeline ]
  Local ──► Enclosing (Closure) ──► Global (__main__) ──► Built-in (len, print)
       │
       ▼ [ Activation Frame on Call Stack ]
         - Parameters & Local Variables
         - Return value pushed to caller`;
    }

    if (modTitle.includes('object') || modTitle.includes('class') || title.includes('oop') || title.includes('class')) {
        return `[ Class Blueprint: Person ]
       │
       ├─► __init__(self, name)
       └─► speak(self)
             │  instantiate
             ▼
[ Instance: p1 = Person("Alex") ]
  self.__dict__ = { "name": "Alex" }  ──► methods bound via MRO`;
    }

    if (modTitle.includes('exception') || title.includes('exception') || title.includes('try')) {
        return `[ try Block: Protected Execution ]
       │
       ├── Normal Flow ──────────────► [ else Block ]
       │                                     │
       └── Exception Raised ─────────► [ except Handler ]
                                             │
                                             ▼
                                     [ finally Block (Always Runs) ]`;
    }

    if (modTitle.includes('thread') || title.includes('thread') || title.includes('gil')) {
        return `[ CPython Multithreading & The Global Interpreter Lock (GIL) ]
  Thread 1: [ Bytecode Execution ] ───► Release GIL ───► Waiting
                                                            │
  Thread 2: Waiting ──────────────────► Acquire GIL ───► [ Bytecode Execution ]`;
    }

    if (modTitle.includes('database') || title.includes('sql') || title.includes('sqlite')) {
        return `[ Python DB-API 2.0 Connection Architecture ]
  Python App ──► connect() ──► [ Connection Pool ]
                                     │
                                     ▼ cursor()
                               [ Cursor Buffer ] ──► SQL Query ──► [ Database Server ]
                                     │
                                     ▼ fetchall()
                               Result Rows`;
    }

    if (modTitle.includes('data') || title.includes('numpy') || title.includes('pandas') || title.includes('matplotlib')) {
        return `[ Data Science Pipeline ]
  CSV / Raw Data ──► [ Pandas DataFrame ] ──Vectorized Ops──► [ NumPy ndarray ]
                                                                     │
                                                                     ▼ plot()
                                                            [ Visual Chart ]`;
    }

    return `[ Memory Model: Reference Pointer Binding ]
  Variable Name: "name" ──( Pointer Reference )──► Heap Object: "HiGen Labs"
  Variable Name: "count" ──( Pointer Reference )──► Heap Object: 100 (int)`;
};

const CourseLearningView = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [curriculum, setCurriculum] = useState(null);
    const [activeModule, setActiveModule] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [activeTab, setActiveTab] = useState('content'); // 'content' | 'visualizer' | 'summarize' | 'quiz' | 'assessment' | 'code'

    const [loading, setLoading] = useState(true);
    const [contentLoading, setContentLoading] = useState(false);
    const [lockedNotice, setLockedNotice] = useState(null);
    const [accessDenied, setAccessDenied] = useState(false);
    const [expandedModuleIds, setExpandedModuleIds] = useState(new Set());
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarPinned, setSidebarPinned] = useState(false);
    const hoverTimeoutRef = useRef(null);

    // Scroll & real-time topic completion refs
    const mainScrollRef = useRef(null);
    const triggeredLessons = useRef(new Set());
    const [completionToast, setCompletionToast] = useState(null);

    const handleOpenSidebar = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        setSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        if (!sidebarPinned) {
            hoverTimeoutRef.current = setTimeout(() => {
                setSidebarOpen(false);
            }, 250);
        }
    };

    const toggleModuleExpand = (modId) => {
        const idStr = modId.toString();
        setExpandedModuleIds(prev => {
            const next = new Set(prev);
            if (next.has(idStr)) next.delete(idStr);
            else next.add(idStr);
            return next;
        });
    };

    const toggleAllModules = () => {
        if (!curriculum?.modules) return;
        if (expandedModuleIds.size === curriculum.modules.length) {
            setExpandedModuleIds(new Set());
        } else {
            setExpandedModuleIds(new Set(curriculum.modules.map(m => m._id.toString())));
        }
    };

    // Audio TTS state
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Interactive Code Playground State (Tab 5)
    const [playgroundCode, setPlaygroundCode] = useState('# Write Python code to experiment with this lesson\nname = "Pranshu Pathak"\nage = 20\nprint(f"Hello, {name}! Age: {age}")\n');
    const [playgroundLang, setPlaygroundLang] = useState('python');
    const [executingCode, setExecutingCode] = useState(false);
    const [codeOutput, setCodeOutput] = useState('');

    // Quiz & Exam State (Tab 3)
    const [quizData, setQuizData] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [quizResult, setQuizResult] = useState(null);
    const [submittingQuiz, setSubmittingQuiz] = useState(false);
    const [examStage, setExamStage] = useState('briefing'); // 'briefing' | 'in_progress' | 'result'
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [markedForReview, setMarkedForReview] = useState({});
    const [examTimeLeft, setExamTimeLeft] = useState(null);
    const [examViolations, setExamViolations] = useState([]);
    const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
    const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
    const [isExamFullscreen, setIsExamFullscreen] = useState(false);

    // Helper: Determine if module lessons are 100% completed
    const getModuleLessonStatus = (mod) => {
        if (!mod) return { isCompleted: false, completedCount: 0, totalCount: 0, percent: 0, nextLesson: null };
        const lessons = mod.lessons || [];
        const completedCount = lessons.filter(l => l.isCompleted).length;
        const totalCount = lessons.length;
        const isCompleted = totalCount > 0 && completedCount === totalCount;
        const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        const nextLesson = lessons.find(l => !l.isCompleted) || lessons[0];
        return { isCompleted, completedCount, totalCount, percent, nextLesson };
    };

    // Visualizer availability: only modules with dedicated visualizers (Module 2, 3, 4 & 5)
    const currentLessonDoc = activeLesson?.lesson;
    const currentLessonId = currentLessonDoc?._id?.toString() || activeLesson?.lesson?._id?.toString();

    // Accurately locate the module that actually owns this lesson in curriculum
    const lessonOwningModule = (curriculum?.modules || []).find(m =>
        (m.lessons || []).some(l => l._id?.toString() === currentLessonId)
    );
    const currentModule = lessonOwningModule || activeModule;

    const courseCategory = (curriculum?.category || '').toUpperCase();
    const courseCode = (curriculum?.code || '').toUpperCase();
    const courseTitle = (curriculum?.title || '').toLowerCase();

    const isPythonCourse = Boolean(courseCode.includes('PY') || courseTitle.includes('python') || courseCategory === 'PYTHON');
    const isDsaCourse = Boolean(courseCategory === 'DSA' || courseCode.includes('DSA') || courseTitle.includes('data structure') || courseTitle.includes('algorithm'));
    const isMlCourse = Boolean(courseCategory === 'ML' || courseCode.includes('ML') || courseTitle.includes('machine learning'));
    const isDlCourse = Boolean(courseCategory === 'DL' || courseCode.includes('DL') || courseTitle.includes('deep learning') || courseTitle.includes('neural') || courseTitle.includes('pytorch'));
    const isGenAiCourse = Boolean(courseCategory === 'GEN AI' || courseCategory.includes('GEN') || courseCode.includes('GEN') || courseTitle.includes('generative ai') || courseTitle.includes('llm'));
    const isAgenticCourse = Boolean(courseCategory === 'AGENTIC AI' || courseCategory.includes('AGENTIC') || courseCode.includes('AGNT') || courseTitle.includes('agentic'));
    const isCCourse = Boolean(
        courseCategory === 'C' ||
        (courseCode.startsWith('C-') && !courseCode.startsWith('CPP-')) ||
        courseTitle.includes('c systems') ||
        courseTitle.includes("programming in 'c'") ||
        courseTitle.includes('programming in c') ||
        courseCode === 'C-SYS-101'
    );
    const isCppCourse = Boolean(courseCategory === 'C++' || courseCode.includes('CPP') || courseTitle.includes('c++'));
    const isJavaCourse = Boolean(courseCategory === 'JAVA' || courseCode.includes('JAVA') || courseTitle.includes('java'));

    const courseDomainName = isPythonCourse ? 'PYTHON'
        : isDsaCourse ? 'DSA'
        : isMlCourse ? 'MACHINE LEARNING'
        : isDlCourse ? 'DEEP LEARNING'
        : isGenAiCourse ? 'GENERATIVE AI'
        : isAgenticCourse ? 'AGENTIC AI'
        : isCCourse ? 'C SYSTEMS'
        : isCppCourse ? 'MODERN C++'
        : isJavaCourse ? 'JAVA ENTERPRISE'
        : (courseCategory || 'TECHNICAL TRACK');

    // Strictly extract the integer module number (1, 2, 3, 4, 5, etc.) to prevent false substring matches
    let moduleNumber = typeof currentModule?.orderIndex === 'number' ? currentModule.orderIndex : null;
    if (moduleNumber === null && currentModule?.title) {
        const titleMatch = currentModule.title.match(/^\s*Module\s*(\d+)\b/i);
        if (titleMatch) moduleNumber = parseInt(titleMatch[1], 10);
    }
    if (moduleNumber === null && currentModule?._id && curriculum?.modules) {
        const foundModIdx = curriculum.modules.findIndex(m => m._id?.toString() === currentModule._id?.toString());
        if (foundModIdx !== -1) moduleNumber = foundModIdx + 1;
    }

    // Dedicated interactive visualizers for Modules 1 to 12
    const isModule1 = moduleNumber === 1;
    const isModule2 = moduleNumber === 2;
    const isModule3 = moduleNumber === 3;
    const isModule4 = moduleNumber === 4;
    const isModule5 = moduleNumber === 5;
    const isModule6 = moduleNumber === 6;
    const isModule7 = moduleNumber === 7;
    const isModule8 = moduleNumber === 8;
    const isModule9 = moduleNumber === 9;
    const isModule10 = moduleNumber === 10;
    const isModule11 = moduleNumber === 11;
    const isModule12 = moduleNumber === 12;

    // Robust lesson order detection: use orderIndex, or fallback to index in currentModule.lessons
    const lessonIdxInModule = (currentModule?.lessons || []).findIndex(
        l => l._id?.toString() === currentLessonId
    );
    const lessonOrder = currentLessonDoc?.orderIndex ?? (lessonIdxInModule !== -1 ? lessonIdxInModule + 1 : undefined);

    // Determine which visualizer to show
    const getVisualizerType = () => {
        if (!isPythonCourse) {
            // Course-wise specialized visualizer workbench for other courses
            if (isDsaCourse) return 'course-dsa';
            if (isMlCourse) return 'course-ml';
            if (isDlCourse) return 'course-dl';
            if (isGenAiCourse) return 'course-genai';
            if (isAgenticCourse) return 'course-agentic';
            if (isCCourse) {
                // Modules 2 to 11 dedicated C visualizers
                if (isModule2) return 'c-tokens';
                if (isModule3) return 'c-control';
                if (isModule4) return 'c-loops';
                if (isModule5) return 'c-arrays-strings';
                if (isModule6) return 'c-functions';
                if (isModule7) return 'c-pointers';
                if (isModule8) return 'c-struct-union';
                if (isModule9) return 'c-file-handling';
                if (isModule10) return 'c-dynamic-memory';
                if (isModule11) return 'c-storage-preprocessor';
                return 'c-tokens';
            }
            if (isCppCourse) {
                // Modules 1 to 9 dedicated C++ visualizers
                if (isModule1) return 'cpp-intro-oop';
                if (isModule2) return 'cpp-tokens';
                if (isModule3) return 'cpp-classes-objects';
                if (isModule4) return 'cpp-functions';
                if (isModule5) return 'cpp-constructors';
                if (isModule6) return 'cpp-operator-overload';
                if (isModule7) return 'cpp-inheritance';
                if (isModule8) return 'cpp-files';
                if (isModule9) return 'cpp-exceptions';
                return 'cpp-intro-oop';
            }
            if (isJavaCourse) return 'course-java';
            return null;
        }

        // All 12 Python Masterclass modules (100% preserved)
        if (isModule2) {
            if (lessonOrder === 4 || (currentLessonDoc?.title && /break|continue|pass|control/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('break')) return 'loop-control';
            if (lessonOrder === 3 || (currentLessonDoc?.title && /\bfor\b.*loop/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('for-loop')) return 'for';
            if (lessonOrder === 2 || (currentLessonDoc?.title && /while/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('while')) return 'while';
            if (lessonOrder === 1 || (currentLessonDoc?.title && /decision|if-else|if-elif/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('decision')) return 'decision';
            return 'decision';
        }
        if (isModule3) {
            // Module 3: Specialized Visualizer per Topic
            if (lessonOrder === 4 || (currentLessonDoc?.title && /range|tuple/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('tuple')) return 'tuple';
            if (lessonOrder === 3 || (currentLessonDoc?.title && /generator|yield/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('generator')) return 'generator';
            if (lessonOrder === 2 || (currentLessonDoc?.title && /copy|iterator|enumerate/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('copy')) return 'copy-trap';
            if (lessonOrder === 1 || (currentLessonDoc?.title && /list.*core|core.*list/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('list')) return 'list';
            return 'list';
        }
        if (isModule4) {
            // Module 4: Dictionaries and Sets (Specialized Visualizer per Topic)
            // Priority check to avoid false matches on 'dict' or 'set' substrings
            if (lessonOrder === 4 || (currentLessonDoc?.title && /theory|frozen/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('theory') || currentLessonDoc?.slug?.includes('frozen')) {
                return 'set-theory';
            }
            if (lessonOrder === 3 || (currentLessonDoc?.title && /sets in python|core oper/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('core-oper')) {
                return 'set-ops';
            }
            if (lessonOrder === 2 || (currentLessonDoc?.title && /method|compreh/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('method') || currentLessonDoc?.slug?.includes('compreh')) {
                return 'dict-methods';
            }
            if (lessonOrder === 1 || (currentLessonDoc?.title && /intro|hash/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('intro') || currentLessonDoc?.slug?.includes('hashmap')) {
                return 'dict-hashmap';
            }
            return 'dict-hashmap';
        }
        if (isModule5) {
            // Module 5: Input and Output in Python (Specialized Visualizer per Topic)
            if (lessonOrder === 4 || (currentLessonDoc?.title && /binary|pickle/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('pickle') || currentLessonDoc?.slug?.includes('binary')) {
                return 'pickle-binary';
            }
            if (lessonOrder === 3 || (currentLessonDoc?.title && /csv|json|structured/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('csv') || currentLessonDoc?.slug?.includes('json')) {
                return 'structured-data';
            }
            if (lessonOrder === 2 || (currentLessonDoc?.title && /write|writing|append/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('write') || currentLessonDoc?.slug?.includes('append')) {
                return 'file-write';
            }
            if (lessonOrder === 1 || (currentLessonDoc?.title && /read|context|reading/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('read') || currentLessonDoc?.slug?.includes('context')) {
                return 'file-read';
            }
            return 'file-read';
        }
        if (isModule6) {
            // Module 6: Functions, Modules and Packages (Specialized Visualizer per Topic)
            if (lessonOrder === 5 || (currentLessonDoc?.title && /module|package|pip/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('package') || currentLessonDoc?.slug?.includes('pip')) {
                return 'modules-packages';
            }
            if (lessonOrder === 4 || (currentLessonDoc?.title && /recursion|closure|decorator/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('recursion') || currentLessonDoc?.slug?.includes('decorator')) {
                return 'recursion-decorator';
            }
            if (lessonOrder === 3 || (currentLessonDoc?.title && /scope|legb|lambda/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('scope') || currentLessonDoc?.slug?.includes('lambda')) {
                return 'scope-lambda';
            }
            if (lessonOrder === 2 || (currentLessonDoc?.title && /args|kwargs|default/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('args') || currentLessonDoc?.slug?.includes('kwargs')) {
                return 'args-kwargs';
            }
            if (lessonOrder === 1 || (currentLessonDoc?.title && /builtin|built-in|defining/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('builtin')) {
                return 'builtin-functions';
            }
            return 'builtin-functions';
        }
        if (isModule7) {
            // Module 7: Object-Oriented Python (6 specialized topics)
            if (lessonOrder === 6 || (currentLessonDoc?.title && /abstract|interface|abc/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('abstract')) {
                return 'abstract-class';
            }
            if (lessonOrder === 5 || (currentLessonDoc?.title && /inheritance|super|polymorphism/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('inheritance')) {
                return 'inheritance-polymorphism';
            }
            if (lessonOrder === 4 || (currentLessonDoc?.title && /method|access/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('method-types')) {
                return 'method-types-access';
            }
            if (lessonOrder === 3 || (currentLessonDoc?.title && /namespace|class var|instance var/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('variables-and-namespaces')) {
                return 'class-vs-instance-vars';
            }
            if (lessonOrder === 2 || (currentLessonDoc?.title && /self|constructor|__init__|__str__/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('self-constructors')) {
                return 'constructor-self';
            }
            if (lessonOrder === 1 || (currentLessonDoc?.title && /overview|class/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('overview-of-oop')) {
                return 'oop-overview';
            }
            return 'oop-overview';
        }
        if (isModule8) {
            // Module 8: Exceptions (4 specialized topics)
            if (lessonOrder === 4 || (currentLessonDoc?.title && /raising|custom|user-defined/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('raising')) {
                return 'custom-exceptions';
            }
            if (lessonOrder === 3 || (currentLessonDoc?.title && /standard|builtin/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('standard-builtin')) {
                return 'standard-exceptions';
            }
            if (lessonOrder === 2 || (currentLessonDoc?.title && /try|except|finally|else/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('try-except')) {
                return 'try-except-else-finally';
            }
            if (lessonOrder === 1 || (currentLessonDoc?.title && /classification|error/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('error-classification')) {
                return 'error-classification';
            }
            return 'error-classification';
        }
        if (isModule9) {
            // Module 9: Python Regular Expressions (4 specialized topics)
            if (lessonOrder === 4 || (currentLessonDoc?.title && /extended|greedy|validation/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('extended-patterns')) {
                return 'greedy-lazy-validation';
            }
            if (lessonOrder === 3 || (currentLessonDoc?.title && /findall|finditer|sub|substitution/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('findall-finditer')) {
                return 'findall-sub';
            }
            if (lessonOrder === 2 || (currentLessonDoc?.title && /match.*search|fullmatch/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('match-search')) {
                return 'match-search-fullmatch';
            }
            if (lessonOrder === 1 || (currentLessonDoc?.title && /regex|symbol|introduction/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('introduction-to-regex')) {
                return 'regex-symbols';
            }
            return 'regex-symbols';
        }
        if (isModule10) {
            // Module 10: Python Multithreaded Programming (5 specialized topics)
            if (lessonOrder === 5 || (currentLessonDoc?.title && /deadlock|daemon/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('deadlocks')) {
                return 'deadlocks-daemon';
            }
            if (lessonOrder === 4 || (currentLessonDoc?.title && /semaphore|queue|producer/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('semaphores-queues')) {
                return 'semaphores-queues';
            }
            if (lessonOrder === 3 || (currentLessonDoc?.title && /synchronization|race|lock/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('thread-synchronization')) {
                return 'thread-synchronization';
            }
            if (lessonOrder === 2 || (currentLessonDoc?.title && /starting|threading module/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('starting-threads')) {
                return 'threading-module';
            }
            if (lessonOrder === 1 || (currentLessonDoc?.title && /processes|gil/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('processes-vs-threads')) {
                return 'processes-threads-gil';
            }
            return 'processes-threads-gil';
        }
        if (isModule11) {
            // Module 11: Using Databases in Python (6 specialized topics)
            if (lessonOrder === 6 || (currentLessonDoc?.title && /sqlite|ddl vs dml/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('ddl-vs-dml')) {
                return 'ddl-dml-sqlite';
            }
            if (lessonOrder === 5 || (currentLessonDoc?.title && /read|select|fetchall/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('read-queries')) {
                return 'read-queries';
            }
            if (lessonOrder === 4 || (currentLessonDoc?.title && /dml|insert|injection/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('dml-insert')) {
                return 'dml-insert-injection';
            }
            if (lessonOrder === 3 || (currentLessonDoc?.title && /ddl|create.*database|create.*table/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('ddl-create')) {
                return 'ddl-operations';
            }
            if (lessonOrder === 2 || (currentLessonDoc?.title && /connection|connecting/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('creating-database-connections')) {
                return 'database-connection';
            }
            if (lessonOrder === 1 || (currentLessonDoc?.title && /basics|driver/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('database-basics')) {
                return 'database-drivers';
            }
            return 'database-drivers';
        }
        if (isModule12) {
            // Module 12: Data Science Using Python (8 specialized topics)
            if (lessonOrder === 8 || (currentLessonDoc?.title && /project|student.*result/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('student-results')) {
                return 'student-results-project';
            }
            if (lessonOrder === 7 || (currentLessonDoc?.title && /matplotlib|visual analytics/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('matplotlib-visual-analytics')) {
                return 'matplotlib-visual-analytics';
            }
            if (lessonOrder === 6 || (currentLessonDoc?.title && /statistics|groupby|missing/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('pandas-statistics')) {
                return 'pandas-stats-groupby-missing';
            }
            if (lessonOrder === 5 || (currentLessonDoc?.title && /loc vs iloc|alignment/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('pandas-loc-iloc')) {
                return 'pandas-loc-iloc-alignment';
            }
            if (lessonOrder === 4 || (currentLessonDoc?.title && /series.*dataframe|part b.*pandas/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('pandas-series')) {
                return 'pandas-series-dataframes';
            }
            if (lessonOrder === 3 || (currentLessonDoc?.title && /processing|file i\/o|file io/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('numpy-array-processing')) {
                return 'numpy-processing-file-io';
            }
            if (lessonOrder === 2 || (currentLessonDoc?.title && /indexing|transposition|ufunc/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('numpy-indexing')) {
                return 'numpy-indexing-ufuncs';
            }
            if (lessonOrder === 1 || (currentLessonDoc?.title && /numpy|creating arrays/i.test(currentLessonDoc.title)) || currentLessonDoc?.slug?.includes('numpy-introduction')) {
                return 'numpy-intro-arrays';
            }
            return 'numpy-intro-arrays';
        }
        return null;
    };
    const visualizerType = getVisualizerType();
    const hasVisualizer = Boolean(visualizerType);

    useEffect(() => {
        if (activeTab === 'visualizer' && !hasVisualizer) {
            setActiveTab('content');
        }
    }, [hasVisualizer, activeTab]);

    // Helper to mark a lesson completed, persist to localStorage, notify dashboard in real time & sync with backend
    const markLessonAsCompleted = async (targetModId, targetLessonId) => {
        if (!targetModId || !targetLessonId || !courseId) return;

        let calculatedOverall = 0;
        let lessonTitle = '';

        // Optimistically update curriculum state immediately for real-time reactivity
        setCurriculum(prev => {
            if (!prev || !prev.modules) return prev;
            let totalLessons = 0;
            let totalCompleted = 0;

            const updatedModules = prev.modules.map(mod => {
                const isTargetMod = mod._id?.toString() === targetModId?.toString();
                const lessons = (mod.lessons || []).map(l => {
                    const isTargetLes = l._id?.toString() === targetLessonId?.toString();
                    if (isTargetLes) lessonTitle = l.title;
                    const isCompleted = l.isCompleted || (isTargetMod && isTargetLes);
                    if (isCompleted) totalCompleted++;
                    totalLessons++;
                    return { ...l, isCompleted };
                });
                const modCompletedCount = lessons.filter(l => l.isCompleted).length;
                const modProgress = lessons.length > 0 ? Math.round((modCompletedCount / lessons.length) * 100) : 0;
                return {
                    ...mod,
                    lessons,
                    progressPercent: modProgress,
                    isCompleted: mod.isCompleted || (lessons.length > 0 && modCompletedCount === lessons.length)
                };
            });

            calculatedOverall = totalLessons > 0 ? Math.min(100, Math.round((totalCompleted / totalLessons) * 100)) : 100;

            return {
                ...prev,
                overallPercentage: calculatedOverall,
                modules: updatedModules
            };
        });

        // Save immediately into localStorage under 'higen_student_progress'
        try {
            const stored = JSON.parse(localStorage.getItem('higen_student_progress') || '{}');
            const cKey = courseId.toString();
            const courseProg = stored[cKey] || { completedLessons: [] };
            const lesStr = targetLessonId.toString();
            if (!courseProg.completedLessons) courseProg.completedLessons = [];
            if (!courseProg.completedLessons.includes(lesStr)) {
                courseProg.completedLessons.push(lesStr);
            }
            courseProg.overallPercentage = calculatedOverall;
            courseProg.lastUpdated = new Date().toISOString();
            stored[cKey] = courseProg;
            localStorage.setItem('higen_student_progress', JSON.stringify(stored));

            // Dispatch global event for real-time dashboard sync
            window.dispatchEvent(new CustomEvent('course-progress-updated', {
                detail: {
                    courseId: cKey,
                    overallPercentage: calculatedOverall,
                    moduleId: targetModId.toString(),
                    lessonId: lesStr
                }
            }));
        } catch (e) {
            console.error('LocalStorage progress save error:', e);
        }

        // Show subtle completion notification
        setCompletionToast({
            title: cleanLessonTitle(lessonTitle) || 'Topic Completed',
            show: true
        });
        setTimeout(() => {
            setCompletionToast(null);
        }, 3500);

        // Sync with backend API
        try {
            await api.post(`/courses/${courseId}/modules/${targetModId}/lessons/${targetLessonId}/complete`, {
                timeSpentSeconds: 60
            });
        } catch (err) {
            console.error('Backend sync error (saved locally):', err);
        }
    };

    // Scroll listener on main content area: auto-completes topic on scroll
    const handleScroll = (e) => {
        if (!activeModule?._id || !activeLesson?.lesson?._id) return;
        const lesId = activeLesson.lesson._id.toString();
        if (triggeredLessons.current.has(lesId)) return;

        // Check if lesson is already marked as completed
        const currentMod = curriculum?.modules?.find(m => m._id?.toString() === activeModule._id?.toString());
        const currentLes = currentMod?.lessons?.find(l => l._id?.toString() === lesId);
        if (currentLes?.isCompleted) return;

        const el = e.currentTarget;
        if (!el) return;

        const scrollHeight = el.scrollHeight;
        const scrollTop = el.scrollTop;
        const clientHeight = el.clientHeight;

        // Trigger when scrolled through 50% or within 220px of bottom
        const scrolledRatio = (scrollTop + clientHeight) / scrollHeight;
        const nearBottom = (scrollHeight - scrollTop - clientHeight) <= 220;

        if (scrolledRatio >= 0.5 || nearBottom) {
            triggeredLessons.current.add(lesId);
            markLessonAsCompleted(activeModule._id, activeLesson.lesson._id);
        }
    };

    // Auto-scroll to top and auto-mark short topics after reading
    useEffect(() => {
        if (mainScrollRef.current) {
            mainScrollRef.current.scrollTop = 0;
        }

        if (!activeModule?._id || !activeLesson?.lesson?._id) return;
        const lesId = activeLesson.lesson._id.toString();
        if (triggeredLessons.current.has(lesId)) return;

        const currentMod = curriculum?.modules?.find(m => m._id?.toString() === activeModule._id?.toString());
        const currentLes = currentMod?.lessons?.find(l => l._id?.toString() === lesId);
        if (currentLes?.isCompleted) return;

        // Auto-mark short topics (or visualizers that fit cleanly on screen) after 4 seconds of reading/interaction
        const timer = setTimeout(() => {
            if (mainScrollRef.current) {
                const { scrollHeight, clientHeight } = mainScrollRef.current;
                if (scrollHeight <= clientHeight + 160) {
                    triggeredLessons.current.add(lesId);
                    markLessonAsCompleted(activeModule._id, activeLesson.lesson._id);
                }
            }
        }, 4000);

        return () => clearTimeout(timer);
    }, [activeLesson?.lesson?._id, activeModule?._id, curriculum]);

    // Fetch Course Curriculum
    const fetchCurriculum = async (targetLessonId = null) => {
        try {
            setLoading(true);
            setAccessDenied(false);
            setLockedNotice(null);
            const res = await api.get(`/courses/${courseId}/curriculum`);
            if (res.data.success) {
                const data = res.data.data;

                // Seamlessly ensure full multi-module curriculum for C and C++ even if API cache or old DB had fewer modules
                const defaultCurr = getCourseWiseDefaultCurriculum(courseId, data.code, data.title, data.category);
                if (defaultCurr && defaultCurr.modules && (!data.modules || data.modules.length < defaultCurr.modules.length)) {
                    data.modules = defaultCurr.modules;
                    if (defaultCurr.title) data.title = defaultCurr.title;
                    if (defaultCurr.code) data.code = defaultCurr.code;
                }

                // Merge with localStorage cached progress for offline & instant persistence
                try {
                    const stored = JSON.parse(localStorage.getItem('higen_student_progress') || '{}');
                    const localProg = stored[courseId?.toString()];
                    if (localProg?.completedLessons?.length > 0 && data.modules) {
                        const localSet = new Set(localProg.completedLessons.map(String));
                        let totalLessons = 0;
                        let totalCompleted = 0;
                        data.modules = data.modules.map(mod => {
                            const lessons = (mod.lessons || []).map(l => {
                                const isCompleted = l.isCompleted || localSet.has(l._id?.toString());
                                if (isCompleted) totalCompleted++;
                                totalLessons++;
                                return { ...l, isCompleted };
                            });
                            const modCompletedCount = lessons.filter(l => l.isCompleted).length;
                            const modProgress = lessons.length > 0 ? Math.round((modCompletedCount / lessons.length) * 100) : 0;
                            return {
                                ...mod,
                                lessons,
                                progressPercent: modProgress,
                                isCompleted: mod.isCompleted || (lessons.length > 0 && modCompletedCount === lessons.length)
                            };
                        });
                        const calculatedOverall = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
                        if (calculatedOverall > (data.overallPercentage || 0)) {
                            data.overallPercentage = calculatedOverall;
                        }
                    }
                } catch (e) {
                    console.error('Error merging local progress:', e);
                }

                setCurriculum(data);

                // Determine active module and lesson
                let mod = data.modules?.[0];
                let les = mod?.lessons?.[0];

                if (targetLessonId) {
                    for (const m of data.modules) {
                        const foundL = m.lessons.find(l => l._id.toString() === targetLessonId);
                        if (foundL) {
                            mod = m;
                            les = foundL;
                            break;
                        }
                    }
                } else if (data.currentActiveLessonId) {
                    for (const m of data.modules) {
                        const foundL = m.lessons.find(l => l._id.toString() === data.currentActiveLessonId);
                        if (foundL) {
                            mod = m;
                            les = foundL;
                            break;
                        }
                    }
                }

                setActiveModule(mod);
                if (mod?._id) {
                    setExpandedModuleIds(prev => new Set([...prev, mod._id.toString()]));
                }
                if (les) {
                    loadLesson(mod._id, les._id, data);
                }
            }
        } catch (err) {
            console.warn('Backend curriculum query notice:', err);
            // Check course-wise fallback curriculum
            const fallback = getCourseWiseDefaultCurriculum(courseId);
            if (fallback) {
                setCurriculum(fallback);
                const mod = fallback.modules?.[0];
                const les = mod?.lessons?.[0];
                setActiveModule(mod);
                if (mod?._id) setExpandedModuleIds(new Set([mod._id.toString()]));
                if (les) {
                    setActiveLesson({
                        lesson: les,
                        nextLesson: mod?.lessons?.[1] ? { moduleId: mod._id, lessonId: mod.lessons[1]._id } : null
                    });
                }
                return;
            }
            if (err.response?.status === 403 || err.response?.data?.isLocked) {
                setAccessDenied(true);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurriculum();
    }, [courseId]);

    // Load specific lesson content with sequential lock verification
    const loadLesson = async (modId, lesId, curriculumOverride = null) => {
        const curr = curriculumOverride || curriculum;
        const resolveLocalLesson = () => {
            if (!curr?.modules) return false;
            const matchedMod = curr.modules.find(m => m._id.toString() === modId.toString());
            const matchedLes = matchedMod?.lessons?.find(l => l._id.toString() === lesId.toString());
            if (!matchedLes) return false;
            const nextLesIdx = (matchedMod.lessons || []).findIndex(l => l._id.toString() === lesId.toString()) + 1;
            const nextLes = matchedMod.lessons?.[nextLesIdx];
            setActiveModule(matchedMod);
            setActiveLesson({
                lesson: matchedLes,
                nextLesson: nextLes ? { moduleId: modId, lessonId: nextLes._id } : null
            });
            if (matchedLes.codeSnippets?.[0]?.code) {
                setPlaygroundCode(matchedLes.codeSnippets[0].code);
            }
            return true;
        };

        try {
            setContentLoading(true);
            setLockedNotice(null);
            setQuizResult(null);
            setSelectedAnswers({});
            if (modId) {
                setExpandedModuleIds(prev => new Set([...prev, modId.toString()]));
                if (curr?.modules) {
                    const matchedMod = curr.modules.find(m => m._id.toString() === modId.toString());
                    if (matchedMod) setActiveModule(matchedMod);
                }
            }

            const isObjectId = (val) => /^[a-f\d]{24}$/i.test(String(val || ''));
            if (!isObjectId(courseId) || !isObjectId(modId) || !isObjectId(lesId)) {
                if (resolveLocalLesson()) return;
            }

            const res = await api.get(`/courses/${courseId}/modules/${modId}/lessons/${lesId}`);
            if (res.data.success) {
                setActiveLesson(res.data.data);
                if (res.data.data.lesson?.codeSnippets?.[0]?.code) {
                    setPlaygroundCode(res.data.data.lesson.codeSnippets[0].code);
                }
            }
        } catch (err) {
            if (resolveLocalLesson()) return;
            if (err.response?.data?.code === 'CONTENT_LOCKED') {
                setLockedNotice(err.response.data.msg);
            } else {
                console.error('Failed to load lesson:', err);
            }
        } finally {
            setContentLoading(false);
        }
    };

    // Mark current lesson completed & proceed sequentially
    const handleMarkComplete = async () => {
        if (!activeModule || !activeLesson) return;
        const lesId = activeLesson.lesson._id;
        triggeredLessons.current.add(lesId.toString());
        await markLessonAsCompleted(activeModule._id, lesId);

        if (activeLesson.nextLesson?.lessonId) {
            loadLesson(activeLesson.nextLesson.moduleId, activeLesson.nextLesson.lessonId);
        }
    };

    // Text-to-speech toggle with decreased volume (35% default gentle reading volume)
    const [speechVolume, setSpeechVolume] = useState(0.35);
    const toggleSpeech = () => {
        if (!window.speechSynthesis) return;
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            const textToSpeak = activeLesson?.lesson?.content?.replace(/[`#*_]/g, '') || activeLesson?.lesson?.title;
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.volume = speechVolume; // Decreased soft volume
            utterance.rate = 0.95;           // Natural, comfortable pace
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

    // Execute playground code (Tab 5)
    const handleRunPlaygroundCode = async () => {
        setExecutingCode(true);
        setCodeOutput('');
        try {
            const langId = isCCourse ? 50 : isCppCourse ? 54 : isJavaCourse ? 62 : isDsaCourse ? 54 : 100;
            const res = await api.post('/execute/run', {
                source_code: playgroundCode,
                language_id: langId,
                stdin: ''
            });
            if (res.data.success) {
                const out = res.data.data.stdout || res.data.data.stderr || 'Program executed successfully (no output).';
                setCodeOutput(out);
            }
        } catch (err) {
            setCodeOutput('Execution error: ' + (err.response?.data?.msg || err.message));
        } finally {
            setExecutingCode(false);
        }
    };

    // ── Exam Environment Lifecycle & Handlers ────────────────────────────────
    // Exam Timer Countdown
    useEffect(() => {
        if (examStage !== 'in_progress' || examTimeLeft === null) return;
        if (examTimeLeft <= 0) {
            handleSubmitQuiz();
            return;
        }
        const timer = setInterval(() => {
            setExamTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [examStage, examTimeLeft]);

    // Fullscreen state listener for optional visual comfort toggle
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsExamFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const formatExamTime = (secs) => {
        if (secs === null || isNaN(secs) || secs < 0) return '00:00';
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const toggleExamFullscreen = () => {
        if (!document.fullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(() => {});
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
        }
    };

    const handleStartExam = () => {
        const timeLimit = activeModule?.quiz?.timeLimitMinutes || 15;
        setExamTimeLeft(timeLimit * 60);
        setExamStage('in_progress');
        setCurrentQIndex(0);
        setSelectedAnswers({});
        setMarkedForReview({});
        setExamViolations([]);
        setQuizResult(null);
        if (mainScrollRef.current) {
            mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleExitQuiz = () => {
        setShowExitConfirmModal(false);
        setShowSubmitConfirmModal(false);
        setExamStage('briefing');
        setActiveTab('content');
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
    };

    const handleRetakeExam = () => {
        setExamStage('briefing');
        setSelectedAnswers({});
        setMarkedForReview({});
        setExamViolations([]);
        setQuizResult(null);
        setCurrentQIndex(0);
    };

    // Submit Quiz / Exam (Tab 3)
    const handleSubmitQuiz = async () => {
        if (!activeModule) return;
        setSubmittingQuiz(true);
        try {
            const res = await api.post(`/courses/${courseId}/modules/${activeModule._id}/quiz/submit`, {
                answers: selectedAnswers,
                violationsCount: examViolations.length
            });
            if (res.data.success) {
                setQuizResult(res.data.data);
                setExamStage('result');
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch(() => {});
                }
                // Refresh curriculum if quiz passed to unlock next module
                if (res.data.data.passed) {
                    fetchCurriculum();
                }
            }
        } catch (err) {
            console.error('Error submitting quiz:', err);
        } finally {
            setSubmittingQuiz(false);
            setShowSubmitConfirmModal(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[460px] p-8">
                <div className="w-13 h-13 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3.5 shadow-2xs">
                    <BookOpen className="w-5 h-5 text-slate-700 animate-pulse" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-1">Loading Curriculum</h3>
                <p className="text-xs text-slate-500 max-w-xs text-center mb-5 leading-relaxed">Preparing interactive code visualizers and lessons...</p>
                <div className="w-40 h-1 bg-slate-200/80 rounded-full overflow-hidden relative">
                    <div className="absolute inset-y-0 w-16 bg-slate-900 rounded-full animate-loader-bar" />
                </div>
            </div>
        );
    }

    if (accessDenied) {
        return (
            <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-white border border-slate-200 text-center shadow-lg space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
                    <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-slate-900">Access Restricted: Course Allocation Required</h2>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    This course has not been allocated to your account or institution by an administrator yet. Please contact your college administrator to activate access to this curriculum track.
                </p>
                <div className="pt-2">
                    <Link
                        to="/student/courses"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-2xs"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back to Courses Catalog</span>
                    </Link>
                </div>
            </div>
        );
    }

    const lessonData = activeLesson?.lesson;
    const totalModulesCount = (curriculum?.modules || []).length;
    const completedModulesCount = (curriculum?.modules || []).filter(m => getModuleLessonStatus(m).isCompleted).length;
    const isCourseCertificateUnlocked = totalModulesCount > 0 && completedModulesCount === totalModulesCount;
    const cleanLessonTitle = (title) => {
        if (!title) return 'Lesson Overview';
        let t = String(title).trim();
        t = t.replace(/^Module\s+\d+:\s*/i, '');
        t = t.replace(/^Part\s+[A-Z]\s*[-:.]\s*/i, '');
        t = t.replace(/^Mini-Project\s*[-:.]\s*/i, '');
        t = t.replace(/^\d+(\.\d+)*\s*[-:.)]?\s*/, '');
        t = t.replace(/\s*\(Lab\s*\d+\)/gi, '');
        return t.trim() || 'Lesson Overview';
    };

    return (
        <div className="flex flex-col flex-1 w-full min-h-[calc(100vh-64px)] overflow-hidden font-sans" style={{ background: '#f6f8fa', color: '#0f172a' }}>

            {/* ── Sub-bar: Breadcrumbs & Navigation ── */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b bg-white border-slate-200/80 shadow-2xs">
                <div className="flex items-center gap-2 sm:gap-3 text-xs min-w-0">
                    {/* Hover & Click Sidebar Trigger Pill (Disabled during active exam) */}
                    {examStage !== 'in_progress' ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(prev => !prev)}
                                onMouseEnter={handleOpenSidebar}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer border border-slate-200/90 shadow-2xs shrink-0"
                                title="Curriculum Syllabus (Hover or click to toggle)"
                            >
                                <Menu className="w-3.5 h-3.5 text-slate-600" />
                                <span>Modules</span>
                            </button>
                            <span className="text-slate-300">|</span>
                            <Link
                                to="/student/courses"
                                className="font-bold flex items-center gap-1 transition-colors no-underline text-slate-800 hover:text-black shrink-0"
                            >
                                &lt; Courses
                            </Link>
                        </>
                    ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shrink-0 shadow-2xs">
                            <Shield className="w-3.5 h-3.5 text-blue-400" />
                            <span>Proctored Exam</span>
                        </div>
                    )}

                    <span className="text-slate-300 hidden sm:inline">|</span>
                    <div className="hidden sm:flex items-center gap-2 text-slate-500 font-medium text-[11px] truncate">
                        <span className="text-slate-400">Home</span>
                        <span className="text-slate-300">/</span>
                        <span className="truncate max-w-[140px] text-slate-500 font-medium">{curriculum?.title}</span>
                        <span className="text-slate-300">/</span>
                        {activeTab === 'quiz' ? (
                            <>
                                <span className="text-slate-600 font-semibold truncate max-w-[180px]">
                                    {activeModule?.title || 'Module'}
                                </span>
                                <span className="text-slate-300">/</span>
                                <span className="text-blue-600 font-bold truncate max-w-[220px]">
                                    {activeModule?.quiz?.title || 'Knowledge Examination'}
                                </span>
                            </>
                        ) : activeTab === 'assessment' ? (
                            <>
                                <span className="text-slate-600 font-semibold truncate max-w-[180px]">
                                    {activeModule?.title || 'Module'}
                                </span>
                                <span className="text-slate-300">/</span>
                                <span className="text-indigo-600 font-bold truncate max-w-[220px]">
                                    {lessonData?.assessment?.title || 'Practical Assessment'}
                                </span>
                            </>
                        ) : activeTab === 'certificate' ? (
                            <span className="text-emerald-700 font-bold truncate max-w-[260px]">
                                Course Certificate
                            </span>
                        ) : (
                            <span className="text-slate-900 font-bold truncate max-w-[260px]">
                                {cleanLessonTitle(lessonData?.title) || 'Lesson Overview'}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {activeTab === 'quiz' ? (
                        examStage === 'in_progress' ? (
                            <button
                                type="button"
                                onClick={() => setShowSubmitConfirmModal(true)}
                                className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 transition-all px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Finish Exam</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveTab('content');
                                    setExamStage('briefing');
                                }}
                                className="text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 flex items-center gap-1.5 transition-all px-3.5 py-1.5 rounded-xl shadow-2xs cursor-pointer"
                            >
                                <span>← Back to Lessons</span>
                            </button>
                        )
                    ) : (
                        activeLesson?.nextLesson && (
                            <button
                                onClick={() => loadLesson(activeLesson.nextLesson.moduleId, activeLesson.nextLesson.lessonId)}
                                className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center gap-1.5 transition-all px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer"
                            >
                                <span>Next Topic</span>
                                <span className="text-slate-300 font-bold">&gt;</span>
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* ── Main Layout: Full Width Space for Learning & Visualizers ─────────────── */}
            <div className="flex-1 flex flex-col overflow-hidden relative">

                {/* Floating Left Edge Trigger: unobtrusive slim tab that reveals syllabus on hover */}
                <div
                    onMouseEnter={handleOpenSidebar}
                    onClick={() => setSidebarOpen(true)}
                    className="fixed left-0 top-1/2 -translate-y-1/2 z-30 group cursor-pointer select-none opacity-30 hover:opacity-100 transition-opacity"
                    title="Hover or click to view Module Syllabus"
                >
                    <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md shadow-md border border-slate-200/90 border-l-0 px-1.5 py-3 rounded-r-xl text-xs font-bold text-slate-700 hover:text-blue-600 transition-all group-hover:px-2.5">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </div>

                {/* Backdrop overlay when sidebar is open and not pinned */}
                {sidebarOpen && !sidebarPinned && (
                    <div
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 top-16 bg-slate-950/20 backdrop-blur-[1px] z-40 transition-opacity animate-fadeIn"
                    />
                )}

                {/* Slide-out / Hover Curriculum Sidebar Drawer */}
                <aside
                    onMouseEnter={handleOpenSidebar}
                    onMouseLeave={handleCloseSidebar}
                    className={`fixed top-16 left-0 bottom-0 z-50 w-84 sm:w-92 max-w-[90vw] bg-white border-r border-slate-200 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    {/* Header info */}
                    <div className="p-4 border-b border-slate-100 bg-slate-50/80">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h2 className="text-sm font-black text-slate-900 leading-snug line-clamp-1">{curriculum?.title}</h2>
                            <div className="flex items-center gap-1 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setSidebarPinned(p => !p)}
                                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${sidebarPinned ? 'bg-blue-100 text-blue-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                        }`}
                                    title={sidebarPinned ? 'Unpin sidebar (auto-hides on mouse leave)' : 'Pin sidebar open'}
                                >
                                    <Pin className={`w-3.5 h-3.5 ${sidebarPinned ? 'rotate-45 text-blue-700' : ''}`} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSidebarPinned(false);
                                        setSidebarOpen(false);
                                    }}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                                    title="Close sidebar"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] mt-2 font-medium text-slate-500">
                            <span>Progress: <strong>{curriculum?.overallPercentage || 0}%</strong></span>
                            <span>{curriculum?.modules?.length || 0} Modules</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden mt-2 bg-slate-200">
                            <div
                                className="h-full rounded-full transition-all duration-300 bg-blue-600"
                                style={{ width: `${curriculum?.overallPercentage || 0}%` }}
                            />
                        </div>

                        {/* Expand / Collapse All Toggle */}
                        <div className="flex items-center justify-between text-[11px] pt-3 mt-1 border-t border-slate-200/60 text-slate-500 font-medium">
                            <span className="uppercase tracking-wider font-bold text-[10px] text-slate-400">Curriculum Syllabus</span>
                            <button
                                type="button"
                                onClick={toggleAllModules}
                                className="text-blue-600 hover:text-blue-700 font-bold text-[11px] cursor-pointer hover:underline"
                            >
                                {expandedModuleIds.size === (curriculum?.modules?.length || 0) ? 'Collapse All' : 'Expand All'}
                            </button>
                        </div>
                    </div>

                    {/* Expandable Module Accordion Tree */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                        {(curriculum?.modules || []).map((mod, modIdx) => {
                            const isExpanded = expandedModuleIds.has(mod._id.toString());
                            const isActiveMod = activeModule?._id?.toString() === mod._id.toString();
                            const cleanTitle = (mod.title || '').replace(/^Module\s*\d+:\s*/i, '');
                            const moduleNum = mod.orderIndex || (modIdx + 1);

                            return (
                                <div
                                    key={mod._id}
                                    className={`rounded-2xl border transition-all ${isActiveMod
                                            ? 'bg-blue-50/20 border-blue-200/90 shadow-xs'
                                            : 'bg-white border-slate-200/80 hover:border-slate-300'
                                        }`}
                                >
                                    {/* Clickable Module Dropdown Header */}
                                    <button
                                        type="button"
                                        onClick={() => toggleModuleExpand(mod._id)}
                                        className="w-full flex items-center justify-between p-3 text-left transition-colors rounded-2xl cursor-pointer hover:bg-slate-50/80"
                                    >
                                        <div className="flex items-start gap-2.5 min-w-0 pr-2">
                                            <span className={`p-0.5 rounded-md transition-transform shrink-0 mt-0.5 ${isExpanded ? 'text-blue-600' : 'text-slate-400'}`}>
                                                {isExpanded ? (
                                                    <ChevronDown className="w-4 h-4" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4" />
                                                )}
                                            </span>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                                                        Module {moduleNum}
                                                    </span>
                                                    {mod.isCompleted ? (
                                                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                                            Done
                                                        </span>
                                                    ) : mod.isLocked ? (
                                                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                                            Locked
                                                        </span>
                                                    ) : (
                                                        <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                                                            {mod.progressPercent || 0}%
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                                                    {cleanTitle}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="shrink-0 flex items-center pl-1">
                                            {mod.isCompleted ? (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            ) : mod.isLocked ? (
                                                <Lock className="w-3.5 h-3.5 text-slate-400" />
                                            ) : (
                                                <span className="text-[10px] font-medium text-slate-400">
                                                    {mod.lessons?.length || 0} topics
                                                </span>
                                            )}
                                        </div>
                                    </button>

                                    {/* Sub-topics list (collapsible) */}
                                    {isExpanded && (
                                        <div className="px-3 pb-3 pt-0">
                                            <div className="border-l-2 border-slate-200 pl-2.5 ml-2.5 space-y-1">
                                                {(mod.lessons || []).map((les, lIdx) => {
                                                    const isSelected = lessonData?._id?.toString() === les._id?.toString();
                                                    return (
                                                        <button
                                                            key={les._id}
                                                            type="button"
                                                            onClick={() => {
                                                                setActiveModule(mod);
                                                                loadLesson(mod._id, les._id);
                                                                if (!sidebarPinned) setSidebarOpen(false);
                                                            }}
                                                            className={`w-full flex items-center justify-between text-left px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${isSelected
                                                                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                                                                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-medium'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-2 min-w-0 pr-2">
                                                                <span className={`text-[10px] font-mono shrink-0 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                                                                    {(les.orderIndex || (lIdx + 1))}.
                                                                </span>
                                                                <span className="truncate leading-tight">{cleanLessonTitle(les.title)}</span>
                                                            </div>

                                                            <div className="shrink-0">
                                                                {les.isCompleted ? (
                                                                    <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                                                                ) : (
                                                                    <div className={`w-3 h-3 rounded-full border-2 ${isSelected ? 'border-white' : 'border-slate-300'}`} />
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}

                                                {/* Module Quiz Sub-topic if present */}
                                                {(mod.quiz || mod.hasQuiz) && (() => {
                                                    const modStatus = getModuleLessonStatus(mod);
                                                    const isQuizPassed = mod.quizPassed || (curriculum?.quizAttempts || []).some(qa => qa.moduleId?.toString() === mod._id?.toString() && qa.passed);
                                                    const isLocked = !modStatus.isCompleted;

                                                    return (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setActiveModule(mod);
                                                                setActiveTab('quiz');
                                                                setExamStage('briefing');
                                                                setSelectedAnswers({});
                                                                setQuizResult(null);
                                                                if (mainScrollRef.current) mainScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
                                                                if (!sidebarPinned) setSidebarOpen(false);
                                                            }}
                                                            className={`w-full flex items-center justify-between text-left px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                                                                activeTab === 'quiz' && isActiveMod
                                                                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                                                                    : isLocked
                                                                        ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 font-medium'
                                                                        : isQuizPassed
                                                                            ? 'text-emerald-700 hover:bg-emerald-50 font-semibold'
                                                                            : 'text-blue-700 hover:bg-blue-50 font-semibold'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                {isLocked ? (
                                                                    <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                                                                ) : isQuizPassed ? (
                                                                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                                                                ) : (
                                                                    <Award className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                                                                )}
                                                                <span className="truncate">{mod.quiz?.title || mod.quizTitle || 'Knowledge Exam'}</span>
                                                            </div>
                                                            <span className={`text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded ${
                                                                activeTab === 'quiz' && isActiveMod
                                                                    ? 'bg-white/20 text-white'
                                                                    : isLocked
                                                                        ? 'bg-slate-100 text-slate-500'
                                                                        : isQuizPassed
                                                                            ? 'bg-emerald-100 text-emerald-700'
                                                                            : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                                {isLocked ? `Locked ${modStatus.completedCount}/${modStatus.totalCount}` : isQuizPassed ? 'Passed' : 'Exam Ready'}
                                                            </span>
                                                        </button>
                                                    );
                                                })()}

                                                {/* Module Assessment Sub-topic if present */}
                                                {(mod.assessment || mod.hasAssessment) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveModule(mod);
                                                            setActiveTab('assessment');
                                                            if (!sidebarPinned) setSidebarOpen(false);
                                                        }}
                                                        className={`w-full flex items-center justify-between text-left px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${activeTab === 'assessment' && isActiveMod
                                                                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                                                                : 'text-indigo-700 hover:bg-indigo-50 font-semibold'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <Code2 className="w-3.5 h-3.5 shrink-0" />
                                                            <span className="truncate">{mod.assessment?.title || mod.assessmentTitle || 'Practical Assessment'}</span>
                                                        </div>
                                                        <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                                                            Test
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* ── Course Completion Certificate at end of modules ── */}
                        {totalModulesCount > 0 && (
                            <div className="pt-2 mt-2 border-t border-slate-200/80">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTab('certificate');
                                        if (mainScrollRef.current) mainScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
                                        if (!sidebarPinned) setSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between gap-2 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                                        activeTab === 'certificate'
                                            ? isCourseCertificateUnlocked
                                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                                                : 'bg-slate-900 border-slate-900 text-white shadow-sm'
                                            : isCourseCertificateUnlocked
                                                ? 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-50 text-slate-900'
                                                : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/80 text-slate-600'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                            activeTab === 'certificate'
                                                ? 'bg-white/20 text-white'
                                                : isCourseCertificateUnlocked
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-slate-200/80 text-slate-500'
                                        }`}>
                                            {isCourseCertificateUnlocked ? <Award className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className={`text-xs font-bold truncate ${activeTab === 'certificate' ? 'text-white' : 'text-slate-900'}`}>
                                                Course Certificate
                                            </div>
                                            <div className={`text-[10px] font-semibold mt-0.5 ${
                                                activeTab === 'certificate'
                                                    ? 'text-white/80'
                                                    : isCourseCertificateUnlocked
                                                        ? 'text-emerald-700'
                                                        : 'text-slate-500'
                                            }`}>
                                                {isCourseCertificateUnlocked
                                                    ? '100% Complete • Ready'
                                                    : `Locked • ${completedModulesCount}/${totalModulesCount} Modules`}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                                        activeTab === 'certificate'
                                            ? 'bg-white/20 text-white'
                                            : isCourseCertificateUnlocked
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-slate-200 text-slate-600'
                                    }`}>
                                        {isCourseCertificateUnlocked ? 'View' : 'Locked'}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </aside>

                {/* ── Main Full-Width Learning & Visualizer Area ── */}
                <main
                    ref={mainScrollRef}
                    onScroll={handleScroll}
                    className="flex-1 min-w-0 w-full flex flex-col overflow-y-auto max-h-[calc(100vh-112px)] p-4 sm:p-6 lg:p-8"
                    style={{ background: '#f6f8fa' }}
                >

                    {/* Content Locked Notification if applicable */}
                    {lockedNotice ? (
                        <div className="p-8 rounded-2xl bg-amber-50 border border-amber-200 text-center max-w-xl mx-auto my-12 space-y-4 shadow-xs">
                            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Sequential Content Locked</h3>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">{lockedNotice}</p>
                            <p className="text-xs text-slate-500">
                                HiGen Labs enforces sequential module progression. Complete preceding lessons and achieve the minimum quiz passing score to unlock this module.
                            </p>
                        </div>
                    ) : contentLoading ? (
                        <div className="flex flex-col h-64 items-center justify-center space-y-3">
                            <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-slate-800 animate-spin" />
                            <p className="text-xs text-slate-400 font-mono">Loading lesson...</p>
                        </div>
                    ) : (
                        <div className="w-full max-w-[1700px] mx-auto space-y-5">

                            {/* ── Modern Lesson Header (Hidden during quiz, assessment, and certificate mode) ── */}
                            {activeTab !== 'quiz' && activeTab !== 'assessment' && activeTab !== 'certificate' && (
                                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        {/* Module & Topic Context Eyebrow */}
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                            <span className="ref-label">
                                                {courseDomainName} • MODULE {activeModule?.orderIndex || 1} • TOPIC {currentLessonDoc?.orderIndex || 1}
                                            </span>
                                            {hasVisualizer && (
                                                <>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="ref-badge-green">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        Interactive Visualizer
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* Audio Narration Toggle & Soft Volume Control */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={toggleSpeech}
                                                className="ref-pill-btn"
                                                title={isSpeaking ? 'Stop reading aloud' : 'Read lesson aloud'}
                                            >
                                                {isSpeaking ? (
                                                    <>
                                                        <VolumeX className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                                                        <span className="font-bold text-rose-700">Stop Listening</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                                                        <span>Listen Aloud</span>
                                                    </>
                                                )}
                                            </button>

                                            {/* Soft Volume Controller (Decreased gentle volume) */}
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-slate-200 bg-white text-[11px] text-slate-500 shadow-2xs">
                                                <span className="text-[10px] uppercase font-bold text-slate-400">Vol:</span>
                                                <input
                                                    type="range"
                                                    min="0.1"
                                                    max="1.0"
                                                    step="0.05"
                                                    value={speechVolume}
                                                    onChange={(e) => {
                                                        const newVol = parseFloat(e.target.value);
                                                        setSpeechVolume(newVol);
                                                        if (window.speechSynthesis && isSpeaking) {
                                                            window.speechSynthesis.cancel();
                                                            setIsSpeaking(false);
                                                        }
                                                    }}
                                                    className="w-14 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                                                    title={`Volume: ${Math.round(speechVolume * 100)}%`}
                                                />
                                                <span className="font-mono text-[10px] font-bold text-slate-700 min-w-[24px]">
                                                    {Math.round(speechVolume * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Primary Heading */}
                                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                                        {cleanLessonTitle(lessonData?.title) || 'Lesson Overview'}
                                    </h1>
                                </div>
                            )}

                            {/* ── Modern Tab Navigation Bar (Hidden during active examination or certificate view) ── */}
                            {examStage !== 'in_progress' && activeTab !== 'certificate' && (
                                <div className="bg-white rounded-2xl border border-slate-200/80 p-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                    <nav className="flex items-center gap-1.5 min-w-max" aria-label="Lesson Tabs">
                                        {[
                                            { id: 'content', label: 'Lesson Content', icon: BookOpen },
                                            ...(hasVisualizer ? [{ id: 'visualizer', label: 'Interactive Visualizer', icon: PlayCircle, badge: 'Live' }] : []),
                                            { id: 'summarize', label: 'Summary & Notes', icon: Sparkles },
                                            { id: 'quiz', label: 'Knowledge Quiz', icon: HelpCircle },
                                            { id: 'assessment', label: 'Interview Questions', icon: Briefcase },
                                            { id: 'code', label: 'Code Playground', icon: Code2 },
                                        ].map((tab) => {
                                            const isCurrent = activeTab === tab.id;
                                            const TabIcon = tab.icon;
                                            return (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`group relative inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                                                        isCurrent
                                                            ? 'bg-slate-900 text-white shadow-xs font-bold'
                                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    <TabIcon className={`w-3.5 h-3.5 transition-colors ${isCurrent ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                                                        }`} />
                                                    <span>{tab.label}</span>
                                                    {tab.badge && (
                                                        <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full ${isCurrent
                                                                ? 'bg-slate-800 text-white'
                                                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                                            }`}>
                                                            {tab.badge}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </nav>
                                </div>
                            )}

                            {/* ── TAB 1: Content ─────── */}
                            {activeTab === 'content' && (
                                <div className="space-y-6 text-sm text-slate-700 leading-relaxed animate-fadeInUp">

                                    {/* Introduction & Prose wrapped in pure white card */}
                                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] lesson-markdown-body max-w-none space-y-4">
                                        <div dangerouslySetInnerHTML={{
                                            __html: renderMarkdownContent(lessonData?.content)
                                        }} />
                                    </div>

                                    {/* Dynamic Core Concepts & Quick Reference for this Topic */}
                                    {lessonData?.aiSummary?.keyConcepts?.length > 0 && (
                                        <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                                                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                                <span>Core Concepts & Quick Reference</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {lessonData.aiSummary.keyConcepts.map((concept, idx) => (
                                                    <div key={idx} className="p-3 rounded-lg bg-white border border-slate-200/70 shadow-2xs space-y-1">
                                                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Concept {idx + 1}</span>
                                                        <p className="text-xs text-slate-800 font-semibold leading-snug">{concept}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Code Snippets */}
                                    {lessonData?.codeSnippets?.length > 0 && (
                                        <div className="space-y-3 pt-2">
                                            <h3 className="text-base font-bold text-slate-900">Live Code Demonstration</h3>
                                            {lessonData.codeSnippets.map((cs, idx) => (
                                                <div key={idx} className="rounded-2xl overflow-hidden border border-slate-800 bg-[#0f172a] shadow-md">
                                                    <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                                                        <span className="text-xs font-bold text-blue-400">{cs.title || 'Example'}</span>
                                                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{cs.language}</span>
                                                    </div>
                                                    <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto">
                                                        <code>{cs.code}</code>
                                                    </pre>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Mark Lesson Complete & Continue Button */}
                                    <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">
                                            Finished reading this lesson?
                                        </span>
                                        <button
                                            onClick={handleMarkComplete}
                                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
                                        >
                                            <Check className="w-4 h-4" />
                                            <span>Mark as Completed & Continue</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── TAB: Interactive Code Visualizer (Modules 2, 3, 4, 5 & 6) ─────── */}
                            {activeTab === 'visualizer' && hasVisualizer && (
                                <VisualizerErrorBoundary key={visualizerType}>
                                    <div className="animate-fadeInUp">
                                        {visualizerType === 'decision' && <DecisionVisualizer />}
                                        {visualizerType === 'while' && <WhileLoopVisualizer />}
                                        {visualizerType === 'for' && <ForLoopVisualizer />}
                                        {visualizerType === 'loop-control' && <LoopControlVisualizer />}
                                        {visualizerType === 'list' && <ListVisualizer />}
                                        {visualizerType === 'copy-trap' && <CopyTrapVisualizer />}
                                        {visualizerType === 'generator' && <GeneratorVisualizer />}
                                        {visualizerType === 'tuple' && <TupleVisualizer />}
                                        {visualizerType === 'dict-hashmap' && <DictHashMapVisualizer />}
                                        {visualizerType === 'dict-methods' && <DictMethodsVisualizer />}
                                        {visualizerType === 'set-ops' && <SetOperationsVisualizer />}
                                        {visualizerType === 'set-theory' && <SetTheoryVisualizer />}
                                        {visualizerType === 'file-read' && <FileReadVisualizer />}
                                        {visualizerType === 'file-write' && <FileWriteVisualizer />}
                                        {visualizerType === 'structured-data' && <StructuredDataVisualizer />}
                                        {visualizerType === 'pickle-binary' && <PickleBinaryVisualizer />}
                                        {visualizerType === 'builtin-functions' && <BuiltinFunctionsVisualizer />}
                                        {visualizerType === 'args-kwargs' && <ArgsKwargsVisualizer />}
                                        {visualizerType === 'scope-lambda' && <ScopeLambdaVisualizer />}
                                        {visualizerType === 'recursion-decorator' && <RecursionDecoratorVisualizer />}
                                        {visualizerType === 'modules-packages' && <ModulesPackagesVisualizer />}
                                        {visualizerType === 'oop-overview' && <OOPOverviewVisualizer />}
                                        {visualizerType === 'constructor-self' && <ConstructorSelfVisualizer />}
                                        {visualizerType === 'class-vs-instance-vars' && <ClassVsInstanceVarsVisualizer />}
                                        {visualizerType === 'method-types-access' && <MethodTypesAccessVisualizer />}
                                        {visualizerType === 'inheritance-polymorphism' && <InheritancePolymorphismVisualizer />}
                                        {visualizerType === 'abstract-class' && <AbstractClassVisualizer />}
                                        {visualizerType === 'error-classification' && <ErrorClassificationVisualizer />}
                                        {visualizerType === 'try-except-else-finally' && <TryExceptElseFinallyVisualizer />}
                                        {visualizerType === 'standard-exceptions' && <StandardExceptionsVisualizer />}
                                        {visualizerType === 'custom-exceptions' && <CustomExceptionsVisualizer />}
                                        {visualizerType === 'regex-symbols' && <RegexSymbolsVisualizer />}
                                        {visualizerType === 'match-search-fullmatch' && <MatchSearchFullmatchVisualizer />}
                                        {visualizerType === 'findall-sub' && <FindallSubVisualizer />}
                                        {visualizerType === 'greedy-lazy-validation' && <GreedyLazyValidationVisualizer />}
                                        {visualizerType === 'processes-threads-gil' && <ProcessesVsThreadsGILVisualizer />}
                                        {visualizerType === 'threading-module' && <ThreadingModuleVisualizer />}
                                        {visualizerType === 'thread-synchronization' && <ThreadSynchronizationVisualizer />}
                                        {visualizerType === 'semaphores-queues' && <SemaphoresQueuesVisualizer />}
                                        {visualizerType === 'deadlocks-daemon' && <DeadlocksDaemonVisualizer />}
                                        {visualizerType === 'database-drivers' && <DatabaseDriversVisualizer />}
                                        {visualizerType === 'database-connection' && <DatabaseConnectionVisualizer />}
                                        {visualizerType === 'ddl-operations' && <DDLOperationsVisualizer />}
                                        {visualizerType === 'dml-insert-injection' && <DMLInsertSQLInjectionVisualizer />}
                                        {visualizerType === 'read-queries' && <ReadQueriesVisualizer />}
                                        {visualizerType === 'ddl-dml-sqlite' && <DDLvsDMLSqlite3Visualizer />}
                                        {visualizerType === 'numpy-intro-arrays' && <NumpyIntroArraysVisualizer />}
                                        {visualizerType === 'numpy-indexing-ufuncs' && <NumpyIndexingUfuncsVisualizer />}
                                        {visualizerType === 'numpy-processing-file-io' && <NumpyProcessingFileIOVisualizer />}
                                        {visualizerType === 'pandas-series-dataframes' && <PandasSeriesDataFramesVisualizer />}
                                        {visualizerType === 'pandas-loc-iloc-alignment' && <PandasLocIlocAlignmentVisualizer />}
                                        {visualizerType === 'pandas-stats-groupby-missing' && <PandasStatsGroupbyMissingVisualizer />}
                                        {visualizerType === 'matplotlib-visual-analytics' && <MatplotlibVisualAnalyticsVisualizer />}
                                        {visualizerType === 'student-results-project' && <StudentResultsProjectVisualizer />}

                                        {/* Course-Wise Specialized Visualizers for non-Python tracks */}
                                        {visualizerType === 'course-dsa' && (
                                            <DSAVisualizer
                                                activeLesson={activeLesson}
                                                currentLessonDoc={currentLessonDoc}
                                                currentModule={currentModule}
                                                moduleNumber={moduleNumber}
                                                lessonOrder={lessonOrder}
                                            />
                                        )}
                                        {visualizerType === 'course-ml' && <MachineLearningVisualizer />}
                                        {visualizerType === 'course-dl' && <DeepLearningVisualizer />}
                                        {visualizerType === 'course-genai' && <GenerativeAIVisualizer />}
                                        {visualizerType === 'course-agentic' && <AgenticAIVisualizer />}
                                        {/* Dedicated C Systems Visualizers (Modules 2 - 11) */}
                                        {visualizerType === 'c-tokens' && <CTokensVisualizer activeLesson={activeLesson} lessonOrder={lessonOrder} lessonTitle={currentLessonDoc?.title} />}
                                        {visualizerType === 'c-control' && <CControlVisualizer activeLesson={activeLesson} lessonOrder={lessonOrder} lessonTitle={currentLessonDoc?.title} />}
                                        {visualizerType === 'c-loops' && <CLoopVisualizer activeLesson={activeLesson} lessonOrder={lessonOrder} lessonTitle={currentLessonDoc?.title} />}
                                        {visualizerType === 'c-arrays-strings' && <CArraysStringsVisualizer activeLesson={activeLesson} lessonOrder={lessonOrder} lessonTitle={currentLessonDoc?.title} />}
                                        {visualizerType === 'c-functions' && <CFunctionsVisualizer activeLesson={activeLesson} lessonOrder={lessonOrder} lessonTitle={currentLessonDoc?.title} />}
                                        {visualizerType === 'c-pointers' && <CPointersVisualizer activeLesson={activeLesson} lessonOrder={lessonOrder} lessonTitle={currentLessonDoc?.title} />}
                                        {visualizerType === 'c-struct-union' && <CStructUnionVisualizer activeLesson={activeLesson} lessonOrder={lessonOrder} lessonTitle={currentLessonDoc?.title} />}
                                        {visualizerType === 'c-file-handling' && <CFileHandlingVisualizer activeLesson={activeLesson} lessonOrder={lessonOrder} lessonTitle={currentLessonDoc?.title} />}
                                        {visualizerType === 'c-dynamic-memory' && <CDynamicMemoryVisualizer activeLesson={activeLesson} lessonOrder={lessonOrder} lessonTitle={currentLessonDoc?.title} />}
                                        {visualizerType === 'c-storage-preprocessor' && <CStoragePreprocessorVisualizer activeLesson={activeLesson} lessonOrder={lessonOrder} lessonTitle={currentLessonDoc?.title} />}

                                        {/* Dedicated C++ Visualizers (Modules 1 - 9) */}
                                        {visualizerType === 'cpp-intro-oop' && <CppIntroOOPVisualizer activeLesson={activeLesson} lessonOrder={lessonOrder} lessonTitle={currentLessonDoc?.title} />}
                                        {visualizerType === 'cpp-tokens' && <CppTokensVisualizer activeLesson={activeLesson} lessonOrder={lessonOrder} lessonTitle={currentLessonDoc?.title} />}
                                        {visualizerType === 'cpp-classes-objects' && <CppClassesObjectsVisualizer activeLesson={activeLesson} lessonOrder={lessonOrder} lessonTitle={currentLessonDoc?.title} />}
                                        {visualizerType === 'cpp-functions' && <CppFunctionsVisualizer activeLesson={activeLesson} lessonOrder={lessonOrder} lessonTitle={currentLessonDoc?.title} />}
                                        {visualizerType === 'cpp-constructors' && <CppConstructorsVisualizer activeLesson={activeLesson} lessonOrder={lessonOrder} lessonTitle={currentLessonDoc?.title} />}
                                        {visualizerType === 'cpp-operator-overload' && <CppOperatorOverloadingVisualizer activeLesson={activeLesson} lessonOrder={lessonOrder} lessonTitle={currentLessonDoc?.title} />}
                                        {visualizerType === 'cpp-inheritance' && <CppInheritanceVisualizer activeLesson={activeLesson} lessonOrder={lessonOrder} lessonTitle={currentLessonDoc?.title} />}
                                        {visualizerType === 'cpp-files' && <CppFileHandlingVisualizer activeLesson={activeLesson} lessonOrder={lessonOrder} lessonTitle={currentLessonDoc?.title} />}
                                        {visualizerType === 'cpp-exceptions' && <CppExceptionHandlingVisualizer activeLesson={activeLesson} lessonOrder={lessonOrder} lessonTitle={currentLessonDoc?.title} />}

                                        {visualizerType === 'course-c' && <CSystemsVisualizer />}
                                        {visualizerType === 'course-cpp' && <ModernCppVisualizer />}
                                        {visualizerType === 'course-java' && <JavaEnterpriseVisualizer />}
                                    </div>
                                </VisualizerErrorBoundary>
                            )}

                            {/* ── TAB 2: Summarize & More (AI Summarize & Visual Concepts) ─────── */}
                            {activeTab === 'summarize' && (
                                <div className="space-y-6 animate-fadeInUp">
                                    <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-xs">
                                        <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-2">
                                            <Sparkles className="w-4 h-4" />
                                            <span>AI-Generated Lesson Summary</span>
                                        </div>
                                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                            {lessonData?.aiSummary?.summary || `${cleanLessonTitle(lessonData?.title)} covers fundamental patterns, syntactical rules, and idiomatic practices in Python.`}
                                        </p>
                                    </div>

                                    {/* Key Concepts */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Key Takeaways</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {(lessonData?.aiSummary?.keyConcepts || [
                                                'Sequential execution of logic statements with predictable scoping',
                                                'Dynamic typing and automatic memory reclamation via reference counts',
                                                'Standard library modules follow the "Batteries Included" philosophy',
                                                'PEP 8 formatting rules ensure clean, idiomatic codebases'
                                            ]).map((concept, idx) => (
                                                <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                                                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                                        {idx + 1}
                                                    </span>
                                                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{concept}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Dynamic Visual Diagram Box for Active Topic */}
                                    <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-md space-y-3">
                                        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                                            <span>Visual Conceptual Flow</span>
                                        </h3>
                                        <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-sky-300 border border-slate-800 overflow-x-auto whitespace-pre leading-relaxed">
                                            {getTopicDiagram(lessonData, activeModule)}
                                        </div>
                                    </div>

                                    {/* Revision Notes */}
                                    {lessonData?.aiSummary?.revisionNotes && (
                                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-xs">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">Quick Revision Note</h4>
                                            <p className="text-xs text-slate-700 leading-relaxed font-medium">{lessonData.aiSummary.revisionNotes}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── TAB 3: Proctored Examination / Module Quiz ────────────────────── */}
                            {activeTab === 'quiz' && (() => {
                                const activeModStatus = getModuleLessonStatus(activeModule);
                                const questions = activeModule?.quiz?.questions || [];
                                const totalQuestions = questions.length;
                                const currentQ = questions[currentQIndex];
                                const isCompleted = activeModStatus.isCompleted;

                                // CASE 1: MODULE NOT COMPLETED -> LOCKED BARRIER
                                if (!isCompleted) {
                                    return (
                                        <div className="space-y-6 animate-fadeInUp">
                                            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs text-center max-w-2xl mx-auto space-y-6">
                                                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
                                                    <ShieldAlert className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">
                                                        <Lock className="w-3.5 h-3.5" /> Examination Locked
                                                    </div>
                                                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                                        Complete All Module Topics to Unlock Exam
                                                    </h2>
                                                    <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
                                                        Academic regulations require students to complete and understand every lesson in <strong>{activeModule?.title}</strong> before taking the timed, proctored knowledge examination.
                                                    </p>
                                                </div>

                                                {/* Progress Breakdown */}
                                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-left space-y-2">
                                                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                                        <span>Module Completion Progress</span>
                                                        <span className="font-mono text-blue-600">{activeModStatus.completedCount} of {activeModStatus.totalCount} completed ({activeModStatus.percent}%)</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-blue-600 h-full rounded-full transition-all duration-500"
                                                            style={{ width: `${activeModStatus.percent}%` }}
                                                        />
                                                    </div>
                                                    {activeModStatus.nextLesson && (
                                                        <p className="text-[11px] text-slate-500 pt-1">
                                                            Next required topic: <span className="font-semibold text-slate-800">{cleanLessonTitle(activeModStatus.nextLesson.title)}</span>
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (activeModStatus.nextLesson) {
                                                                setActiveLesson({ lesson: activeModStatus.nextLesson });
                                                                setActiveTab('content');
                                                            }
                                                        }}
                                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                                                    >
                                                        <span>Continue Learning Next Topic</span>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                // CASE 2: NO QUIZ QUESTIONS AVAILABLE
                                if (!questions || questions.length === 0) {
                                    return (
                                        <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl space-y-2">
                                            <HelpCircle className="w-8 h-8 text-blue-500 mx-auto" />
                                            <h4 className="text-sm font-bold text-slate-800">No Examination Configured for this Module</h4>
                                            <p className="text-xs text-slate-500 font-medium">Continue studying lessons or project exercises in this module.</p>
                                        </div>
                                    );
                                }

                                // CASE 3: EXAM STAGE === 'result' (SCORECARD & COMPREHENSIVE REVIEW)
                                if (examStage === 'result' && quizResult) {
                                    return (
                                        <div className="space-y-6 animate-fadeInUp">
                                            {/* Result Header Hero Banner */}
                                            <div className={`p-6 sm:p-8 rounded-2xl border ${
                                                quizResult.passed
                                                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                                                    : 'bg-amber-50/70 border-amber-200 text-amber-950'
                                            } space-y-4`}>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                                                            quizResult.passed ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                                                        }`}>
                                                            {quizResult.passed ? <Award className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                                                        </div>
                                                        <div>
                                                            <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full ${
                                                                quizResult.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                            }`}>
                                                                {quizResult.passed ? 'PASSED & CERTIFIED' : 'ATTEMPT COMPLETED — NEEDS REVIEW'}
                                                            </span>
                                                            <h2 className="text-xl sm:text-2xl font-black mt-1">
                                                                {quizResult.passed ? 'Congratulations! Examination Cleared' : 'Passing Threshold Not Met'}
                                                            </h2>
                                                            <p className="text-xs sm:text-sm opacity-80 mt-0.5">
                                                                {quizResult.passed
                                                                    ? 'You demonstrated comprehensive mastery over this module. Next curriculum module has been unlocked!'
                                                                    : `Passing criteria is ${activeModule.quiz?.passingScorePercent || 60}%. Review explanations below and retry.`}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Score Metric Badges */}
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200 text-center shadow-2xs">
                                                            <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Score</span>
                                                            <span className="text-xl font-black text-slate-900">{quizResult.score} / {quizResult.maxScore}</span>
                                                        </div>
                                                        <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200 text-center shadow-2xs">
                                                            <span className="text-[10px] font-bold text-slate-500 uppercase block">Percentage</span>
                                                            <span className={`text-xl font-black ${quizResult.passed ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                                {quizResult.percentage}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Re-attempt and Flexibility Bar */}
                                                <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                                                        <RotateCcw className="w-4 h-4 text-emerald-600" />
                                                        <span><strong>Unlimited Attempts:</strong> Practice anytime to review missed questions and achieve full mastery.</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                                        <button
                                                            onClick={handleRetakeExam}
                                                            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                                                        >
                                                            <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz (Unlimited)
                                                        </button>
                                                        <button
                                                            onClick={() => setActiveTab('content')}
                                                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
                                                        >
                                                            Back to Lessons →
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Question by Question In-Depth Solutions */}
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4 text-blue-600" />
                                                    Comprehensive Question Solutions & Explanation
                                                </h3>

                                                {questions.map((q, idx) => {
                                                    const rev = quizResult.review?.[idx];
                                                    const isQCorrect = rev?.isCorrect;
                                                    return (
                                                        <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                                        isQCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                                                    }`}>
                                                                        {idx + 1}
                                                                    </span>
                                                                    <h4 className="text-sm font-bold text-slate-900">{q.questionText}</h4>
                                                                </div>
                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                                                    isQCorrect ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                                                                }`}>
                                                                    {isQCorrect ? `+${q.marks || 5} Marks` : '0 Marks'}
                                                                </span>
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                                                <div className={`p-2.5 rounded-lg border ${
                                                                    isQCorrect ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-red-50/70 border-red-200 text-red-900'
                                                                }`}>
                                                                    <span className="block font-bold text-[10px] uppercase opacity-75">Your Answer:</span>
                                                                    <span className="font-semibold">{rev?.studentAnswer || 'Not Attempted'}</span>
                                                                </div>
                                                                <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-900">
                                                                    <span className="block font-bold text-[10px] uppercase opacity-75">Correct Answer:</span>
                                                                    <span className="font-semibold">{rev?.correctAnswer || q.correctAnswer}</span>
                                                                </div>
                                                            </div>

                                                            {rev?.explanation && (
                                                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                                                                    <strong className="text-blue-700 block mb-0.5">Explanation:</strong>
                                                                    {rev.explanation}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                }

                                // CASE 4: EXAM STAGE === 'briefing' (PRE-QUIZ OVERVIEW & STUDY TIPS)
                                if (examStage === 'briefing') {
                                    const timeLimit = activeModule?.quiz?.timeLimitMinutes || 15;
                                    const passingScore = activeModule?.quiz?.passingScorePercent || 60;
                                    const totalMarks = totalQuestions * 5;

                                    return (
                                        <div className="space-y-6 animate-fadeInUp max-w-3xl mx-auto">
                                            {/* Hero Header */}
                                            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-800 space-y-4">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
                                                        <Award className="w-3.5 h-3.5" /> Module Knowledge Quiz
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                                        <RotateCcw className="w-3.5 h-3.5" /> Unlimited Attempts
                                                    </span>
                                                </div>
                                                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                                                    {activeModule?.quiz?.title || `${activeModule.title} Knowledge Quiz`}
                                                </h2>
                                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                                                    Test and reinforce your understanding of the concepts covered in this module. Take your time, learn from explanations, and re-attempt as many times as you like.
                                                </p>

                                                {/* KPI Badges */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                                                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Time Limit</span>
                                                        <span className="text-base font-black text-white flex items-center gap-1.5 mt-0.5">
                                                            <Clock className="w-4 h-4 text-blue-400" /> {timeLimit} Mins
                                                        </span>
                                                    </div>
                                                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Passing Score</span>
                                                        <span className="text-base font-black text-emerald-400 flex items-center gap-1.5 mt-0.5">
                                                            <Award className="w-4 h-4 text-emerald-400" /> {passingScore}%
                                                        </span>
                                                    </div>
                                                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Questions</span>
                                                        <span className="text-base font-black text-white flex items-center gap-1.5 mt-0.5">
                                                            <BookOpen className="w-4 h-4 text-blue-400" /> {totalQuestions} MCQs
                                                        </span>
                                                    </div>
                                                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Attempts Allowed</span>
                                                        <span className="text-base font-black text-emerald-400 flex items-center gap-1.5 mt-0.5">
                                                            <RotateCcw className="w-4 h-4 text-emerald-400" /> Unlimited
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quiz Instructions & Flexibility Notice */}
                                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-blue-600" /> Quiz Flexibility & Guidelines
                                                </h3>

                                                <div className="space-y-3 text-xs text-slate-600">
                                                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                                                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                                                        <div>
                                                            <strong className="text-slate-800 block">Unlimited Practice Attempts:</strong>
                                                            You can take this quiz as many times as you like to practice and achieve full mastery.
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                                                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                                                        <div>
                                                            <strong className="text-slate-800 block">Exit Anytime to Review Lessons:</strong>
                                                            You have full flexibility to exit the quiz at any time using the "Exit Quiz" button to revisit lesson notes.
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                                                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                                                        <div>
                                                            <strong className="text-slate-800 block">Comprehensive Solutions & Review:</strong>
                                                            After submitting your answers, you can review detailed step-by-step explanations for each question.
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-2 flex items-center justify-between">
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveTab('content')}
                                                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
                                                    >
                                                        ← Back to Lessons
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleStartExam}
                                                        className="px-8 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                                                    >
                                                        <Play className="w-4 h-4 fill-white" />
                                                        <span>Start Module Quiz</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                // CASE 5: EXAM STAGE === 'in_progress' (FULL-SCREEN DEDICATED QUIZ ENVIRONMENT)
                                const answeredCount = Object.keys(selectedAnswers).filter(k => selectedAnswers[k] !== undefined).length;
                                const markedCount = Object.keys(markedForReview).filter(k => markedForReview[k]).length;
                                const unansweredCount = totalQuestions - answeredCount;
                                const isCurrentMarked = Boolean(markedForReview[currentQIndex]);

                                return (
                                    <div className="fixed inset-0 z-[100] bg-[#f8fafc] flex flex-col overflow-hidden select-none font-sans" style={{ color: '#0f172a' }}>
                                        {/* Dedicated Quiz Header with Exit Button & Clean Layout */}
                                        <header className="h-16 px-4 sm:px-6 flex justify-between items-center z-10 shrink-0 bg-white border-b border-slate-200 shadow-2xs">
                                            <div className="flex items-center gap-3 min-w-0">
                                                {/* Exit Quiz Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => setShowExitConfirmModal(true)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer border border-slate-200 shrink-0"
                                                    title="Exit quiz and return to lessons"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                    <span>Exit Quiz</span>
                                                </button>

                                                <span className="text-slate-300">|</span>

                                                <div className="w-8 h-8 rounded-xl flex items-center justify-center p-1 bg-slate-50 border border-slate-200 shrink-0">
                                                    <img src={companyLogo} alt="HiGen Labs" className="w-full h-full object-contain" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h1 className="text-sm font-extrabold text-slate-900 leading-tight truncate">
                                                        {activeModule?.quiz?.title || 'Knowledge Quiz'}
                                                    </h1>
                                                    <span className="text-[11px] font-semibold text-blue-600 truncate block">
                                                        {curriculum?.title} • {activeModule?.title}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                                {/* Live Countdown Timer */}
                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold border ${
                                                    examTimeLeft !== null && examTimeLeft < 120
                                                        ? 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse'
                                                        : 'bg-blue-50 border-blue-200 text-blue-700'
                                                }`}>
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>{formatExamTime(examTimeLeft)}</span>
                                                </div>

                                                {/* Unlimited Attempts Badge */}
                                                <div className="hidden md:flex items-center text-xs">
                                                    <span className="px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border bg-emerald-50 border-emerald-200 text-emerald-700">
                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                        <span>Unlimited Attempts</span>
                                                    </span>
                                                </div>

                                                {/* Fullscreen Comfort Toggle */}
                                                <button
                                                    type="button"
                                                    onClick={toggleExamFullscreen}
                                                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                                                    title={isExamFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                                                >
                                                    {isExamFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                                </button>

                                                {/* Submit Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => setShowSubmitConfirmModal(true)}
                                                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                                                >
                                                    Finish & Submit
                                                </button>
                                            </div>
                                        </header>

                                        {/* Scrollable Question Content Area */}
                                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                                            <div className="max-w-4xl mx-auto space-y-5">
                                                {/* Question Palette & Navigator Bar */}
                                                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Question Palette:</span>
                                                            <span className="text-xs text-slate-500 font-medium">Click any number to jump</span>
                                                        </div>
                                                        {/* Legend */}
                                                        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
                                                            <span className="flex items-center gap-1">
                                                                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Answered ({answeredCount})
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Review ({markedCount})
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <span className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-300" /> Pending ({unansweredCount})
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Question Buttons */}
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        {questions.map((_, qIdx) => {
                                                            const isAns = selectedAnswers[qIdx] !== undefined;
                                                            const isRev = Boolean(markedForReview[qIdx]);
                                                            const isCur = currentQIndex === qIdx;

                                                            return (
                                                                <button
                                                                    key={qIdx}
                                                                    type="button"
                                                                    onClick={() => setCurrentQIndex(qIdx)}
                                                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center relative ${
                                                                        isCur
                                                                            ? 'ring-2 ring-blue-600 ring-offset-2'
                                                                            : ''
                                                                    } ${
                                                                        isRev
                                                                            ? 'bg-amber-100 text-amber-800 border border-amber-300 font-bold'
                                                                            : isAns
                                                                                ? 'bg-blue-600 text-white shadow-xs'
                                                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                                                                    }`}
                                                                >
                                                                    {qIdx + 1}
                                                                    {isRev && (
                                                                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                                                                    )}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Active Question Card */}
                                                {currentQ && (
                                                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                                                        {/* Question Header */}
                                                        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                                                            <div className="flex items-center gap-2">
                                                                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-black text-xs border border-blue-200">
                                                                    Question {currentQIndex + 1} of {totalQuestions}
                                                                </span>
                                                                <span className="text-xs font-bold text-slate-500">
                                                                    {currentQ.marks || 5} Marks
                                                                </span>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => setMarkedForReview(prev => ({ ...prev, [currentQIndex]: !prev[currentQIndex] }))}
                                                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
                                                                    isCurrentMarked
                                                                        ? 'bg-amber-100 border-amber-300 text-amber-800'
                                                                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                                                                }`}
                                                            >
                                                                <Flag className="w-3.5 h-3.5" />
                                                                <span>{isCurrentMarked ? 'Marked for Review' : 'Mark for Review'}</span>
                                                            </button>
                                                        </div>

                                                        {/* Question Text */}
                                                        <div className="text-base font-bold text-slate-900 leading-relaxed">
                                                            {currentQ.questionText}
                                                        </div>

                                                        {/* Options Grid */}
                                                        <div className="space-y-2.5">
                                                            {(currentQ.options || []).map((opt, optIdx) => {
                                                                const isSelected = selectedAnswers[currentQIndex] === opt;
                                                                const optionLetters = ['A', 'B', 'C', 'D'];
                                                                return (
                                                                    <button
                                                                        key={optIdx}
                                                                        type="button"
                                                                        onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQIndex]: opt }))}
                                                                        className={`w-full text-left p-4 rounded-xl text-xs font-medium transition-all flex items-center justify-between border cursor-pointer ${
                                                                            isSelected
                                                                                ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-xs'
                                                                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center gap-3 min-w-0">
                                                                            <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border ${
                                                                                isSelected
                                                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                                                            }`}>
                                                                                {optionLetters[optIdx] || optIdx + 1}
                                                                            </span>
                                                                            <span className="font-semibold text-slate-900">{opt}</span>
                                                                        </div>
                                                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                                                            isSelected ? 'border-blue-600' : 'border-slate-300'
                                                                        }`}>
                                                                            {isSelected && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>

                                                        {/* Footer Controls: Prev / Next / Submit */}
                                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                                            <button
                                                                type="button"
                                                                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                                                                disabled={currentQIndex === 0}
                                                                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                                                    currentQIndex === 0
                                                                        ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400'
                                                                        : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                                                                }`}
                                                            >
                                                                ← Previous
                                                            </button>

                                                            <div className="flex items-center gap-2">
                                                                {currentQIndex < totalQuestions - 1 ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setCurrentQIndex(prev => prev + 1)}
                                                                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer shadow-xs"
                                                                    >
                                                                        Next Question →
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setShowSubmitConfirmModal(true)}
                                                                        className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer shadow-xs"
                                                                    >
                                                                        Finish & Submit Exam
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Submit Confirmation Modal */}
                                        {showSubmitConfirmModal && (
                                            <div className="fixed inset-0 z-[120] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                                                <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-fadeInUp">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                                                            <Award className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-base font-bold text-slate-900">Submit Quiz?</h3>
                                                            <p className="text-xs text-slate-500">Please review your answers before submitting.</p>
                                                        </div>
                                                    </div>

                                                    {/* Summary breakdown table */}
                                                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center text-xs">
                                                        <div>
                                                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Answered</span>
                                                            <span className="text-base font-black text-blue-600">{answeredCount}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Pending</span>
                                                            <span className="text-base font-black text-amber-600">{unansweredCount}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Marked</span>
                                                            <span className="text-base font-black text-purple-600">{markedCount}</span>
                                                        </div>
                                                    </div>

                                                    {unansweredCount > 0 && (
                                                        <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
                                                            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                                                            <span>You have <strong>{unansweredCount} unanswered question(s)</strong>. Are you sure you want to submit?</span>
                                                        </p>
                                                    )}

                                                    <div className="flex items-center justify-end gap-2 pt-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowSubmitConfirmModal(false)}
                                                            disabled={submittingQuiz}
                                                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
                                                        >
                                                            Back to Questions
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={handleSubmitQuiz}
                                                            disabled={submittingQuiz}
                                                            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                                                        >
                                                            {submittingQuiz && <div className="hl-spinner w-3 h-3" />}
                                                            <span>Confirm & Submit</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Exit Quiz Confirmation Modal */}
                                        {showExitConfirmModal && (
                                            <div className="fixed inset-0 z-[120] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                                                <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-fadeInUp text-center">
                                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
                                                        <HelpCircle className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-base font-bold text-slate-900">Exit Module Quiz?</h3>
                                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                            You have unlimited attempts on course quizzes. You can come back and retry at any time! Unsubmitted progress for this session will be cleared.
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2 pt-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowExitConfirmModal(false)}
                                                            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
                                                        >
                                                            Continue Quiz
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={handleExitQuiz}
                                                            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
                                                        >
                                                            Exit to Lessons
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {/* ── TAB 4: Company Questions / Assessments ─────────────────────── */}
                            {activeTab === 'assessment' && (() => {
                                const currentModIndex = activeModule?.orderIndex || (activeModuleIndex + 1) || 1;
                                const questionsData = getQuestionsForCourseAndModule({
                                    courseCode,
                                    courseTitle,
                                    courseCategory,
                                    moduleIndex: currentModIndex
                                });

                                return (
                                    <CompanyQuestionsTab
                                        questionsData={questionsData}
                                        activeTopicTitle={cleanLessonTitle(lessonData?.title)}
                                        onOpenPlayground={(q) => {
                                            setActiveTab('code');
                                        }}
                                    />
                                );
                            })()}

                            {/* ── TAB 5: Code Ideas / Labs (Monaco Live Editor & Runner) ──────── */}
                            {activeTab === 'code' && (
                                <div className="space-y-4 animate-fadeInUp">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Terminal className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Interactive Playground</span>
                                        </div>
                                        <button
                                            onClick={handleRunPlaygroundCode}
                                            disabled={executingCode}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs cursor-pointer"
                                        >
                                            <Play className="w-3.5 h-3.5 fill-current" />
                                            <span>{executingCode ? 'Running...' : 'Run Code'}</span>
                                        </button>
                                    </div>

                                    {/* Monaco Editor Container */}
                                    <div className="h-96 rounded-2xl overflow-hidden border border-slate-300 shadow-sm">
                                        <CodeEditor
                                            code={playgroundCode}
                                            setCode={setPlaygroundCode}
                                            language={isCCourse ? 'c' : isCppCourse ? 'cpp' : isJavaCourse ? 'java' : isDsaCourse ? 'cpp' : 'python'}
                                            theme="vs-dark"
                                        />
                                    </div>

                                    {/* Console Output */}
                                    <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-2 shadow-inner">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Execution Output ({courseDomainName})</span>
                                        <pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap min-h-[40px]">
                                            {codeOutput || `Click "Run Code" to compile and execute against the ${courseDomainName} execution engine.`}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {/* ── TAB 6: Course Completion Certificate ──────────────────────── */}
                            {activeTab === 'certificate' && (
                                <div className="space-y-6 animate-fadeInUp max-w-4xl mx-auto">
                                    <div className="flex items-center justify-between gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('content')}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs cursor-pointer"
                                        >
                                            <span>← Back to Lessons</span>
                                        </button>
                                        {isCourseCertificateUnlocked && (
                                            <button
                                                type="button"
                                                onClick={() => window.print()}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xs cursor-pointer"
                                            >
                                                <Printer className="w-3.5 h-3.5" />
                                                <span>Print / Save Certificate</span>
                                            </button>
                                        )}
                                    </div>

                                    {!isCourseCertificateUnlocked ? (
                                        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 text-center space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_28px_rgba(0,0,0,0.04)]">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                                                <Lock className="w-7 h-7" />
                                            </div>
                                            <div className="space-y-2 max-w-lg mx-auto">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold uppercase tracking-wider">
                                                    Certificate Locked
                                                </span>
                                                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                                    Complete Every Module to Unlock
                                                </h2>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    Your official certificate for <strong className="text-slate-900">{curriculum?.title}</strong> will unlock automatically once every module reaches 100% completion.
                                                </p>
                                            </div>

                                            <div className="max-w-md mx-auto space-y-2">
                                                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                                    <span>Modules Completed</span>
                                                    <span>{completedModulesCount} / {totalModulesCount} ({totalModulesCount > 0 ? Math.round((completedModulesCount / totalModulesCount) * 100) : 0}%)</span>
                                                </div>
                                                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                                    <div
                                                        className="h-full bg-slate-900 rounded-full transition-all duration-500"
                                                        style={{ width: `${totalModulesCount > 0 ? Math.round((completedModulesCount / totalModulesCount) * 100) : 0}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="max-w-lg mx-auto text-left bg-slate-50 rounded-2xl border border-slate-200/80 p-4 space-y-2">
                                                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                                    Module Completion Checklist
                                                </div>
                                                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                                                    {(curriculum?.modules || []).map((m, idx) => {
                                                        const status = getModuleLessonStatus(m);
                                                        return (
                                                            <div key={m._id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white border border-slate-200/70 text-xs">
                                                                <span className="font-semibold text-slate-700 truncate">
                                                                    Module {m.orderIndex || idx + 1}: {m.title}
                                                                </span>
                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                                                    status.isCompleted
                                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                        : 'bg-slate-100 text-slate-600'
                                                                }`}>
                                                                    {status.isCompleted ? '100% Done' : `${status.progressPercent}%`}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            id="course-certificate-printable"
                                            className="relative bg-white rounded-3xl border-2 border-slate-900 p-8 sm:p-12 shadow-[0_12px_40px_rgba(15,23,42,0.08)] overflow-hidden"
                                        >
                                            <div className="absolute inset-3 rounded-2xl border border-slate-200 pointer-events-none" />
                                            <div className="relative z-10 text-center space-y-6">
                                                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-5">
                                                    <div className="flex items-center gap-3">
                                                        <img src={companyLogo} alt="HiGen Labs" className="h-9 w-auto object-contain" />
                                                        <div className="text-left">
                                                            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-900">HiGen Labs</div>
                                                            <div className="text-[11px] font-medium text-slate-500">
                                                                {user?.institutionId?.name || user?.orgId?.name || 'Shoolini University'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        Verified Completion
                                                    </span>
                                                </div>

                                                <div className="space-y-2 pt-2">
                                                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                                                        <Award className="w-7 h-7" />
                                                    </div>
                                                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                                                        Certificate of Completion
                                                    </p>
                                                    <p className="text-sm text-slate-500 font-medium">
                                                        This is to certify that
                                                    </p>
                                                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                                        {user?.name || 'Student'}
                                                    </h2>
                                                    <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed pt-1">
                                                        has successfully completed 100% of all {totalModulesCount} modules and curriculum requirements in
                                                    </p>
                                                    <h3 className="text-xl sm:text-2xl font-extrabold text-blue-700 pt-1">
                                                        {curriculum?.title}
                                                    </h3>
                                                    {curriculum?.code && (
                                                        <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                                                            Course Code: {curriculum.code}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 text-left">
                                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completion Status</div>
                                                        <div className="text-sm font-extrabold text-emerald-700 mt-0.5">100% ({totalModulesCount}/{totalModulesCount} Modules)</div>
                                                    </div>
                                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Issued On</div>
                                                        <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                                                            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </div>
                                                    </div>
                                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Certificate ID</div>
                                                        <div className="text-xs font-mono font-bold text-slate-800 mt-1">
                                                            HIGEN-{(curriculum?.code || 'COURSE').replace(/[^A-Z0-9]/gi, '').toUpperCase()}-{(user?._id || 'STUDENT').toString().slice(-6).toUpperCase()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    )}
                </main>
            </div>

            {/* ── Real-time Topic Completion Toast ────────────────────── */}
            {completionToast && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 animate-fadeIn">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                        <p className="font-bold text-white leading-tight">Topic Completed</p>
                        <p className="text-[11px] text-slate-300 mt-0.5 max-w-[240px] truncate">{completionToast.title}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseLearningView;

