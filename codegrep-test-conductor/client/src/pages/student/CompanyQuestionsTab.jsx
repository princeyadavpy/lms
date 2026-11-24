import React, { useState, useMemo, useEffect } from 'react';
import {
    Briefcase,
    Building2,
    Calendar,
    ChevronDown,
    ChevronUp,
    Search,
    Filter,
    CheckCircle2,
    Code2,
    Sparkles,
    Terminal,
    ArrowUpRight,
    BookOpen,
    Layers
} from 'lucide-react';

const COMPANY_COLORS = {
    Google: 'bg-red-50 text-red-700 border-red-200',
    Microsoft: 'bg-blue-50 text-blue-700 border-blue-200',
    Amazon: 'bg-amber-50 text-amber-700 border-amber-200',
    Apple: 'bg-slate-100 text-slate-800 border-slate-300',
    Meta: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Qualcomm: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    NVIDIA: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Bloomberg: 'bg-purple-50 text-purple-700 border-purple-200',
    'Goldman Sachs': 'bg-sky-50 text-sky-700 border-sky-200',
    Uber: 'bg-neutral-100 text-neutral-800 border-neutral-300',
    Netflix: 'bg-rose-50 text-rose-700 border-rose-200',
    Adobe: 'bg-red-50 text-red-800 border-red-200',
    Cisco: 'bg-teal-50 text-teal-700 border-teal-200',
    TCS: 'bg-blue-50 text-blue-800 border-blue-200',
    Infosys: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    Intel: 'bg-blue-50 text-blue-700 border-blue-200',
    Samsung: 'bg-sky-50 text-sky-800 border-sky-200',
    Wipro: 'bg-violet-50 text-violet-700 border-violet-200',
    Broadcom: 'bg-orange-50 text-orange-700 border-orange-200',
    'Texas Instruments': 'bg-red-50 text-red-700 border-red-200',
    IBM: 'bg-blue-50 text-blue-900 border-blue-300'
};

const DIFFICULTY_COLORS = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Hard: 'bg-rose-50 text-rose-700 border-rose-200'
};

export default function CompanyQuestionsTab({
    questionsData,
    activeTopicTitle = '',
    onOpenPlayground
}) {
    const { courseName, moduleIndex, moduleTitle, questions = [] } = questionsData || {};

    // Extract unique topics
    const availableTopics = useMemo(() => {
        const set = new Set();
        questions.forEach(q => { if (q.topic) set.add(q.topic); });
        return Array.from(set);
    }, [questions]);

    const [selectedTopic, setSelectedTopic] = useState('All');
    const [selectedCompany, setSelectedCompany] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [selectedType, setSelectedType] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedIds, setExpandedIds] = useState({});

    // Sync selected topic with active topic from syllabus
    useEffect(() => {
        if (!activeTopicTitle || availableTopics.length === 0) return;
        const cleanActive = activeTopicTitle.toLowerCase().trim();
        const matched = availableTopics.find(t => {
            const cleanT = t.toLowerCase();
            return cleanT.includes(cleanActive) || cleanActive.includes(cleanT) || cleanT.split(' ')[0] === cleanActive.split(' ')[0];
        });
        if (matched) {
            setSelectedTopic(matched);
        }
    }, [activeTopicTitle, availableTopics]);

    // Toggle single question
    const toggleExpand = (id) => {
        setExpandedIds(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Expand / Collapse all
    const toggleAll = (expand) => {
        if (!expand) {
            setExpandedIds({});
        } else {
            const all = {};
            questions.forEach(q => { all[q.id] = true; });
            setExpandedIds(all);
        }
    };

    // Extract unique companies
    const companies = useMemo(() => {
        const set = new Set();
        questions.forEach(q => { if (q.company) set.add(q.company); });
        return ['All', ...Array.from(set)];
    }, [questions]);

    // Filter questions
    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            if (selectedTopic !== 'All' && q.topic && q.topic !== selectedTopic) return false;
            if (selectedCompany !== 'All' && q.company !== selectedCompany) return false;
            if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;
            if (selectedType !== 'All' && q.type !== selectedType) return false;
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchQ = q.question?.toLowerCase().includes(query);
                const matchE = q.explanation?.toLowerCase().includes(query);
                const matchC = q.company?.toLowerCase().includes(query);
                const matchT = q.topic?.toLowerCase().includes(query);
                if (!matchQ && !matchE && !matchC && !matchT) return false;
            }
            return true;
        });
    }, [questions, selectedTopic, selectedCompany, selectedDifficulty, selectedType, searchQuery]);

    return (
        <div className="space-y-6 animate-fadeInUp">
            {/* Header Hero Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                                {courseName} Interview Question Bank
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-xs">
                                Module {moduleIndex}
                            </span>
                            {selectedTopic !== 'All' && (
                                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 font-bold text-xs truncate max-w-xs">
                                    {selectedTopic}
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                            {selectedTopic !== 'All' ? selectedTopic : (moduleTitle || 'Company Interview Questions')}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-medium">
                            {selectedTopic !== 'All'
                                ? `20 authentic technical interview questions asked at top tech companies for ${selectedTopic} with company name, year, and detailed solutions.`
                                : 'Authentic technical interview questions asked at top tech and product companies with detailed solutions, code examples, and year of occurrence.'
                            }
                        </p>
                    </div>

                    <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-2 shrink-0">
                        <div className="text-right">
                            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                                {questions.length}+
                            </div>
                            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                Curated Questions
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search questions by keyword, topic, or company..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>

                    {/* Expand/Collapse All Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => toggleAll(true)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            Expand All
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                            onClick={() => toggleAll(false)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            Collapse All
                        </button>
                    </div>
                </div>

                {/* Topic Filter Pills (When multiple topics exist in module) */}
                {availableTopics.length > 1 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-slate-400" />
                            Topic:
                        </span>
                        <button
                            onClick={() => setSelectedTopic('All')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                selectedTopic === 'All'
                                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                            }`}
                        >
                            All Topics ({questions.length})
                        </button>
                        {availableTopics.map(t => {
                            const topicQCount = questions.filter(q => q.topic === t).length;
                            const isSel = selectedTopic === t;
                            return (
                                <button
                                    key={t}
                                    onClick={() => setSelectedTopic(t)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                        isSel
                                            ? 'bg-slate-900 text-white font-bold shadow-xs'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                                    }`}
                                >
                                    {t} ({topicQCount})
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Company Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        Company:
                    </span>
                    {companies.map(c => (
                        <button
                            key={c}
                            onClick={() => setSelectedCompany(c)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                selectedCompany === c
                                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {/* Difficulty & Type Dropdowns */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Difficulty:</span>
                        {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                            <button
                                key={d}
                                onClick={() => setSelectedDifficulty(d)}
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                                    selectedDifficulty === d
                                        ? 'bg-blue-600 text-white font-bold'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>

                    <span className="text-slate-300 hidden sm:inline">|</span>

                    <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Type:</span>
                        {['All', 'Conceptual', 'Coding', 'Output Prediction'].map(t => (
                            <button
                                key={t}
                                onClick={() => setSelectedType(t)}
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                                    selectedType === t
                                        ? 'bg-indigo-600 text-white font-bold'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="ml-auto text-xs text-slate-500 font-medium">
                        Showing <strong className="text-slate-900">{filteredQuestions.length}</strong> of {questions.length} questions
                    </div>
                </div>
            </div>

            {/* Questions List */}
            {filteredQuestions.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="text-base font-bold text-slate-700">No questions match your filter criteria</h3>
                    <p className="text-xs text-slate-500">Try resetting the company or difficulty filters above.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredQuestions.map((q, idx) => {
                        const isExpanded = expandedIds[q.id];
                        const companyColor = COMPANY_COLORS[q.company] || 'bg-slate-100 text-slate-700 border-slate-200';
                        const diffColor = DIFFICULTY_COLORS[q.difficulty] || 'bg-slate-100 text-slate-700 border-slate-200';

                        return (
                            <div
                                key={q.id || idx}
                                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all overflow-hidden"
                            >
                                {/* Question Header & Summary */}
                                <div
                                    onClick={() => toggleExpand(q.id)}
                                    className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none hover:bg-slate-50/50 transition-colors"
                                >
                                    <div className="space-y-2.5 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {/* Question Number */}
                                            <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                                                #{idx + 1}
                                            </span>

                                            {/* Company Badge */}
                                            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border flex items-center gap-1 shadow-2xs ${companyColor}`}>
                                                <Building2 className="w-3 h-3" />
                                                {q.company}
                                            </span>

                                            {/* Year Badge */}
                                            <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-slate-400" />
                                                Asked in {q.year}
                                            </span>

                                            {/* Difficulty Tag */}
                                            <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold border ${diffColor}`}>
                                                {q.difficulty}
                                            </span>

                                            {/* Question Type */}
                                            <span className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
                                                {q.type || 'Conceptual'}
                                            </span>

                                            {/* Topic Badge */}
                                            {q.topic && (
                                                <span className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                                    {q.topic}
                                                </span>
                                            )}
                                        </div>

                                        {/* Question Text */}
                                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                                            {q.question}
                                        </h3>
                                    </div>

                                    {/* Expand Arrow Button */}
                                    <div className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors shrink-0">
                                        {isExpanded ? (
                                            <ChevronUp className="w-4 h-4" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4" />
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Solution Section */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/70 space-y-3">
                                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                            <span className="flex items-center gap-1.5 text-blue-700">
                                                <Sparkles className="w-3.5 h-3.5" />
                                                Detailed Solution &amp; Interview Explanation
                                            </span>

                                            {onOpenPlayground && q.type === 'Coding' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onOpenPlayground(q);
                                                    }}
                                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                                                >
                                                    <Code2 className="w-3 h-3" />
                                                    Try in Code Playground
                                                    <ArrowUpRight className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Solution Content */}
                                        <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-sans leading-relaxed whitespace-pre-wrap shadow-2xs">
                                            {q.explanation}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

