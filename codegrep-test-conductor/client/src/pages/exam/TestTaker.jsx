import React, { useState, useEffect, useCallback, useRef } from 'react';
import Split from 'react-split';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import CodeEditor from '../../components/CodeEditor';
import { detectVirtualMachine } from '../../utils/vmDetection';
import companyLogo from '../../assets/company-logo.png';
import { Clock, Shield, AlertTriangle, ArrowLeft, ArrowRight, Play, CheckCircle2, Award, Check, Laptop } from 'lucide-react';

const TestTaker = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // ── Test state ──────────────────────────────────────────────────────────
    const [test, setTest] = useState(null);
    const [testLoading, setTestLoading] = useState(true);
    const [testError, setTestError] = useState(null);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: code | selectedOption }
    const [markedForReview, setMarkedForReview] = useState({}); // { questionId: boolean }

    // ── Editor state ────────────────────────────────────────────────────────
    const [code, setCode] = useState('// Write your code here\n');
    const [language, setLanguage] = useState('javascript');
    const [theme, setTheme] = useState('vs-dark');
    const [isDesktop, setIsDesktop] = useState(() => {
        if (typeof window === 'undefined') return true;
        const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '');
        return !isMobileUA && window.innerWidth >= 1024;
    });
    const [mobileCodingTab, setMobileCodingTab] = useState('problem');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const checkDesktop = () => {
            const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '');
            setIsDesktop(!isMobileUA && window.innerWidth >= 1024);
        };
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    // When language changes, load that language's stub if student hasn't typed anything yet
    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        if (currentQuestion && currentQuestion.type?.toUpperCase() !== 'MCQ') {
            const saved = answers[currentQuestion._id];
            const savedCode = saved?.code ?? (typeof saved === 'string' ? saved : null);
            const isDefault = !savedCode || savedCode === '// Write your code here\n';
            if (isDefault) {
                const stub = currentQuestion?.starterCode?.[newLang] || '';
                const newCode = stub || '// Write your code here\n';
                setCode(newCode);
                setAnswers(prev => ({ ...prev, [currentQuestion._id]: { language: newLang, code: newCode } }));
            } else {
                setAnswers(prev => ({ ...prev, [currentQuestion._id]: { language: newLang, code: savedCode } }));
            }
        }
    };

    // ── Execution results state ──────────────────────────────────────────────
    const [runResult, setRunResult] = useState(null);
    const [submitResult, setSubmitResult] = useState(null);
    const [outputTab, setOutputTab] = useState('result');
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmittingCode, setIsSubmittingCode] = useState(false);
    const [expandedCase, setExpandedCase] = useState(null);

    // ── Timer state ─────────────────────────────────────────────────────────
    const [timeLeft, setTimeLeft] = useState(null);
    const timerRef = useRef(null);

    // ── Submission state ──────────────────────────────────────────────────────
    const [submissionId, setSubmissionId] = useState(null);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    // ── Security & Proctoring state ──────────────────────────────────────────
    const [hasAgreedConsent, setHasAgreedConsent] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isFocused, setIsFocused] = useState(true);
    const [securityLog, setSecurityLog] = useState([]);
    const [activeViolationToast, setActiveViolationToast] = useState(null);
    const toastTimeoutRef = useRef(null);
    const [mediaStream, setMediaStream] = useState(null);

    const showViolationAlert = useCallback((msg) => {
        setActiveViolationToast(msg);
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = setTimeout(() => {
            setActiveViolationToast(null);
        }, 3500);
    }, []);

    // Monitored security logger
    const logViolation = useCallback((type, message) => {
        setSecurityLog(prev => [
            ...prev,
            { type, message, timestamp: new Date().toISOString() }
        ]);
        showViolationAlert(message);
    }, [showViolationAlert]);

    // Load Exam Data
    useEffect(() => {
        const fetchTest = async () => {
            if (!id || id === 'mock') {
                // Mock test
                setTest({
                    _id: 'mock',
                    title: 'Practice Coding Examination',
                    duration: 45,
                    questions: [
                        {
                            _id: 'q1',
                            title: 'Two Sum Problem',
                            type: 'CODING',
                            difficulty: 'Easy',
                            marks: 20,
                            description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
                            starterCode: {
                                python: 'def twoSum(nums, target):\n    # Write your solution here\n    pass\n',
                                javascript: 'function twoSum(nums, target) {\n    // Write your solution here\n}\n',
                                cpp: '#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution here\n}\n'
                            },
                            testCases: [
                                { input: '[2,7,11,15]\n9', output: '[0,1]', isHidden: false },
                                { input: '[3,2,4]\n6', output: '[1,2]', isHidden: false },
                                { input: '[3,3]\n6', output: '[0,1]', isHidden: true }
                            ]
                        },
                        {
                            _id: 'q2',
                            title: 'Python Memory Management MCQ',
                            type: 'MCQ',
                            difficulty: 'Medium',
                            marks: 10,
                            description: 'Which module in Python is used for manual garbage collection cycle invocations and inspection?',
                            options: ['sys', 'gc', 'memory', 'tracemalloc'],
                            correctAnswer: 'gc'
                        }
                    ]
                });
                setTimeLeft(45 * 60);
                setTestLoading(false);
                return;
            }

            try {
                const res = await api.get(`/tests/${id}`);
                if (res.data.success) {
                    const testData = res.data.data;
                    setTest(testData);
                    setTimeLeft((testData.duration || 60) * 60);

                    // Set initial code for first question
                    const firstQ = testData.questions?.[0];
                    if (firstQ && firstQ.type?.toUpperCase() !== 'MCQ') {
                        const stub = firstQ.starterCode?.[language] || '// Write your code here\n';
                        setCode(stub);
                    }
                }
            } catch (err) {
                setTestError(err.response?.data?.msg || 'Failed to load test details.');
            } finally {
                setTestLoading(false);
            }
        };

        fetchTest();
    }, [id]);

    // Timer Interval (active only once consent accepted)
    useEffect(() => {
        if (!hasAgreedConsent || timeLeft === null || timeLeft <= 0) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    doSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [hasAgreedConsent, timeLeft]);

    // Active Proctoring & Anti-Cheat Listeners
    useEffect(() => {
        if (!hasAgreedConsent) return;

        // 1. Fullscreen changes
        const handleFullscreenChange = () => {
            const isFull = !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement
            );
            setIsFullscreen(isFull);
            if (!isFull) {
                logViolation('FULLSCREEN_EXIT', 'Fullscreen exited! Please return to fullscreen immediately.');
            }
        };

        // 2. Visibility / Tab switch
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsFocused(false);
                logViolation('TAB_SWITCH', 'Switched browser tab or window minimized.');
            } else {
                setIsFocused(true);
            }
        };

        // 3. Window blur / focus
        const handleWindowBlur = () => {
            setIsFocused(false);
            logViolation('WINDOW_BLUR', 'Window focus lost.');
        };
        const handleWindowFocus = () => {
            setIsFocused(true);
        };

        // 4. Copy attempt
        const handleCopy = (e) => {
            e.preventDefault();
            logViolation('COPY_ATTEMPT', 'Copying text or content is strictly prohibited.');
        };

        // 5. Cut attempt
        const handleCut = (e) => {
            e.preventDefault();
            logViolation('CUT_ATTEMPT', 'Cut operations are disabled during the exam.');
        };

        // 6. Paste attempt
        const handlePaste = (e) => {
            e.preventDefault();
            logViolation('PASTE_ATTEMPT', 'Pasting external content into the exam is blocked.');
        };

        // 7. Right-click context menu
        const handleContextMenu = (e) => {
            e.preventDefault();
            logViolation('RIGHT_CLICK', 'Right-click context menu is disabled.');
        };

        // 8. Keydown: PrintScreen, Win+Shift+S, F12, DevTools
        const handleKeyDown = (e) => {
            // Block PrintScreen
            if (e.key === 'PrintScreen') {
                e.preventDefault();
                try { navigator.clipboard?.writeText?.(''); } catch (_) {}
                logViolation('SCREENSHOT_ATTEMPT', 'PrintScreen key pressed! Screenshots are strictly forbidden.');
                return;
            }

            // Block Windows Snipping Tool (Win/Cmd + Shift + S / 3 / 4)
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'S' || e.key === 's' || e.key === '4' || e.key === '3')) {
                e.preventDefault();
                logViolation('SCREENSHOT_ATTEMPT', 'Screen capture key combination detected.');
                return;
            }

            // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
                (e.ctrlKey && (e.key === 'u' || e.key === 'U'))
            ) {
                e.preventDefault();
                logViolation('DEVTOOLS_ATTEMPT', 'Developer tools and source inspection are prohibited.');
                return;
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleWindowBlur);
        window.addEventListener('focus', handleWindowFocus);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('cut', handleCut);
        document.addEventListener('paste', handlePaste);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleWindowBlur);
            window.removeEventListener('focus', handleWindowFocus);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('cut', handleCut);
            document.removeEventListener('paste', handlePaste);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [hasAgreedConsent, logViolation]);

    // Format seconds to mm:ss
    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const currentQuestion = test?.questions?.[currentQIndex];

    const enterFullscreen = () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
        setIsFullscreen(true);
    };

    const switchQuestion = (index) => {
        if (!test?.questions || !test.questions[index]) return;
        setCurrentQIndex(index);
        const nextQ = test.questions[index];
        if (nextQ.type?.toUpperCase() !== 'MCQ') {
            const saved = answers[nextQ._id];
            const savedCode = saved?.code ?? (typeof saved === 'string' ? saved : null);
            const defaultCode = nextQ.starterCode?.[language] || '// Write your code here\n';
            setCode(savedCode || defaultCode);
        }
    };

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        if (currentQuestion) {
            setAnswers(prev => ({
                ...prev,
                [currentQuestion._id]: { language, code: newCode }
            }));
        }
    };

    const handleMCQAnswer = (selectedOpt) => {
        if (!currentQuestion) return;
        setAnswers(prev => ({
            ...prev,
            [currentQuestion._id]: selectedOpt
        }));
    };

    const toggleMarkForReview = () => {
        if (!currentQuestion) return;
        setMarkedForReview(prev => ({
            ...prev,
            [currentQuestion._id]: !prev[currentQuestion._id]
        }));
    };

    // Run Code against Sample Test Cases
    const handleRun = async () => {
        if (!currentQuestion) return;
        setIsRunning(true);
        setRunResult(null);
        setOutputTab('result');

        try {
            const sampleCases = (currentQuestion.testCases || []).filter(tc => !tc.isHidden);
            const inputData = sampleCases[0]?.input || '';
            const res = await api.post('/execute/run', {
                source_code: code,
                language_id: 100, // Python / C++ default mapping
                stdin: inputData
            });

            if (res.data.success) {
                setRunResult({
                    passed: true,
                    stdout: res.data.data.stdout,
                    stderr: res.data.data.stderr
                });
            } else {
                setRunResult({ error: res.data.msg || 'Runtime error' });
            }
        } catch (err) {
            setRunResult({ error: err.response?.data?.msg || err.message });
        } finally {
            setIsRunning(false);
        }
    };

    // Submit Code for Evaluation
    const handleSubmitCode = async () => {
        if (!currentQuestion) return;
        setIsSubmittingCode(true);
        setSubmitResult(null);
        setOutputTab('submission');

        try {
            const res = await api.post('/execute/testcases', {
                source_code: code,
                language_id: 100,
                test_cases: currentQuestion.testCases || []
            });

            if (res.data.success) {
                setSubmitResult(res.data.data);
            }
        } catch (err) {
            console.error('Testcase submission error:', err);
        } finally {
            setIsSubmittingCode(false);
        }
    };

    // Final Exam Submission
    const doSubmit = async (auto = false) => {
        setSubmitLoading(true);
        try {
            if (id && id !== 'mock') {
                const res = await api.post(`/submissions`, {
                    testId: id,
                    answers,
                    securityLog
                });
                if (res.data.success) {
                    setSubmissionResult(res.data.data);
                }
            } else {
                setSubmissionResult({ totalMarks: 30, percentile: 95, rank: 2 });
            }
        } catch (err) {
            console.error('Final submission error:', err);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEditorDidMount = () => {};

    // ── Mobile / Tablet Exam Restriction ─────────────────────────────────────
    if (!isDesktop) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#f8fafc' }}>
                <div className="max-w-md w-full bg-white rounded-3xl p-7 sm:p-8 border border-slate-200 shadow-xl text-center space-y-5">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto">
                        <Laptop size={30} />
                    </div>
                    <div className="space-y-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold uppercase tracking-wider">
                            Laptop / Desktop Required
                        </span>
                        <h2 className="text-xl font-black text-slate-900">Exams Only Open on Laptop</h2>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Proctored examinations are not allowed on mobile phones or tablets. Please switch to a laptop or desktop computer to take this exam.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/student')}
                        className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md hover:bg-slate-800 transition-all cursor-pointer"
                    >
                        Back to Student Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // ── Submission Complete View ──────────────────────────────────────────────
    if (submissionResult) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#f8fafc' }}>
                <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                        <CheckCircle2 size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">Exam Submitted! 🎉</h2>
                        <p className="text-sm text-slate-500 mt-1">Your responses have been recorded and evaluated.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 block uppercase">Score</span>
                            <span className="text-xl font-black text-blue-600 mt-0.5 block">{submissionResult.totalMarks || 30} pts</span>
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 block uppercase">Percentile</span>
                            <span className="text-xl font-black text-emerald-600 mt-0.5 block">{submissionResult.percentile || 95}%</span>
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 block uppercase">Rank</span>
                            <span className="text-xl font-black text-amber-500 mt-0.5 block">#{submissionResult.rank || 1}</span>
                        </div>
                    </div>

                    <p className="text-xs text-slate-400">
                        You answered {Object.keys(answers).length} of {test?.questions?.length || 0} questions.
                    </p>

                    <button
                        onClick={() => navigate('/student')}
                        className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 transition-all"
                    >
                        Return to Student Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (testLoading) {
        return (
            <div className="h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Initializing Exam Session...</p>
                </div>
            </div>
        );
    }

    if (testError) {
        return (
            <div className="h-screen flex items-center justify-center p-4" style={{ background: '#f8fafc' }}>
                <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-200 text-center space-y-4 shadow-lg">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
                        <AlertTriangle size={28} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900">Unable to Load Exam</h2>
                    <p className="text-xs text-slate-500">{testError}</p>
                    <button
                        onClick={() => navigate('/student/exams')}
                        className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all"
                    >
                        ← Back to Exam Selection
                    </button>
                </div>
            </div>
        );
    }

    const warningCount = securityLog.length;
    const isMock = !id || id === 'mock';
    const questions = test?.questions || [];

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden select-none" style={{ background: '#f8fafc', color: '#0f172a' }}>

            {/* Pre-Exam Consent & Proctoring Setup Modal */}
            {!hasAgreedConsent && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-lg w-full space-y-5 animate-fadeInUp">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-900 tracking-tight">Proctored Examination Mode</h2>
                                <p className="text-xs text-slate-500">Security monitoring and academic integrity protocols</p>
                            </div>
                        </div>

                        <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            <div className="flex items-start gap-2.5">
                                <span className="text-blue-600 font-bold shrink-0">🖥️</span>
                                <span><strong>Fullscreen Enforcement:</strong> Fullscreen mode is required. Exiting fullscreen halts testing and logs an infraction.</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <span className="text-blue-600 font-bold shrink-0">📋</span>
                                <span><strong>Clipboard Blocked:</strong> Copy, cut, and paste operations are intercepted and disabled.</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <span className="text-blue-600 font-bold shrink-0">📸</span>
                                <span><strong>Screenshot Protection:</strong> PrintScreen and screen capture hotkeys are blocked.</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <span className="text-blue-600 font-bold shrink-0">🖱️</span>
                                <span><strong>Context Menu Disabled:</strong> Right-click is blocked inside the exam window.</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <span className="text-blue-600 font-bold shrink-0">🔗</span>
                                <span><strong>Tab & Focus Tracking:</strong> Switching tabs or backgrounding this window is recorded.</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <button
                                onClick={() => navigate('/student/exams')}
                                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                            >
                                Cancel & Exit
                            </button>
                            <button
                                onClick={() => {
                                    setHasAgreedConsent(true);
                                    enterFullscreen();
                                }}
                                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                            >
                                <Play className="w-3.5 h-3.5 fill-white" />
                                <span>Enter Fullscreen & Start Exam</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fullscreen Violation Lock Barrier */}
            {hasAgreedConsent && !isFullscreen && !submissionResult && (
                <div className="fixed inset-0 z-[105] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-6 text-center">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-red-200 space-y-5 animate-fadeInUp">
                        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Fullscreen Exited</h3>
                            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                Security violation recorded. Examination rules require you to remain in full-screen mode at all times.
                            </p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 font-bold">
                            Total Security Warnings: {warningCount}
                        </div>
                        <button
                            onClick={enterFullscreen}
                            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                            <span>Re-Enter Fullscreen to Resume Exam</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Window Focus Loss Barrier */}
            {hasAgreedConsent && isFullscreen && !isFocused && !submissionResult && (
                <div className="fixed inset-0 z-[104] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 text-center">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-amber-200 space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
                            <Shield className="w-7 h-7" />
                        </div>
                        <h3 className="text-base font-black text-slate-900">Exam Window Lost Focus</h3>
                        <p className="text-xs text-slate-500">
                            Tab switch or window blur detected. Click anywhere to return to the active exam session.
                        </p>
                    </div>
                </div>
            )}

            {/* Real-time Floating Violation Alert Toast */}
            {activeViolationToast && (
                <div className="fixed top-20 right-6 z-[130] bg-red-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-red-500 animate-fadeInUp max-w-md">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <div className="text-xs font-semibold leading-tight">
                        <strong className="block text-red-100 font-bold uppercase text-[10px]">Proctoring Security Alert</strong>
                        {activeViolationToast}
                    </div>
                </div>
            )}

            {/* Submit Confirmation Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center space-y-4">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
                            <Award size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">Submit Exam?</h3>
                        <p className="text-slate-500 text-xs">Are you sure you want to finalize your exam submission? This action cannot be reversed.</p>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setShowSubmitModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors">
                                Review Answers
                            </button>
                            <button onClick={() => { setShowSubmitModal(false); doSubmit(false); }} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md">
                                Confirm Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="h-16 px-3 sm:px-6 flex justify-between items-center gap-2 z-10 shrink-0 bg-white border-b border-slate-200 shadow-sm">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center p-1 bg-slate-50 border border-slate-200 shrink-0">
                        <img src={companyLogo} alt="HiGen Labs" className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight truncate">{isMock ? 'Sandbox Environment' : (test?.title || 'Exam Session')}</h1>
                        <span className="hidden sm:block text-[11px] font-semibold text-blue-600">HiGen Labs Exam Engine</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    {timeLeft !== null && (
                        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-bold"
                            style={{
                                background: timeLeft < 300 ? '#fef2f2' : '#eff6ff',
                                color: timeLeft < 300 ? '#dc2626' : '#2563eb',
                                border: `1px solid ${timeLeft < 300 ? '#fecdd3' : '#bfdbfe'}`
                            }}>
                            <Clock size={14} />
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                    )}

                    <div className="hidden sm:flex items-center text-xs">
                        <span className="px-3 py-1 rounded-xl font-bold flex items-center gap-1.5"
                            style={{
                                background: warningCount > 0 ? '#fef2f2' : '#f0fdf4',
                                color: warningCount > 0 ? '#dc2626' : '#16a34a',
                                border: `1px solid ${warningCount > 0 ? '#fecdd3' : '#bbf7d0'}`
                            }}>
                            <Shield size={13} />
                            {warningCount > 0 ? `${warningCount} Warning(s)` : 'Proctored Secure'}
                        </span>
                    </div>

                    <button
                        onClick={() => setShowSubmitModal(true)}
                        className="px-3 sm:px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all cursor-pointer whitespace-nowrap"
                    >
                        Submit Exam
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="flex-1 overflow-hidden">
                {currentQuestion?.type?.toUpperCase() === 'MCQ' ? (
                    /* Centered Single-Column Layout for MCQ Questions */
                    <div className="h-full w-full bg-slate-50 flex flex-col overflow-hidden">
                        {/* Question Navigator */}
                        {questions.length > 1 && (
                            <div className="p-3 border-b border-slate-200 bg-white shrink-0 flex justify-center">
                                <div className="flex flex-wrap gap-2 max-w-3xl w-full">
                                    {questions.map((q, i) => (
                                        <button
                                            key={q._id}
                                            onClick={() => switchQuestion(i)}
                                            className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center relative cursor-pointer ${
                                                i === currentQIndex
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : answers[q._id]
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                                                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            {i + 1}
                                            {markedForReview[q._id] && (
                                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-10 flex justify-center">
                            <div className="max-w-3xl w-full bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                                {currentQuestion ? (
                                    <>
                                        <div className="flex flex-wrap justify-between items-start gap-3 sm:gap-4 pb-4 border-b border-slate-100">
                                            <div>
                                                <h2 className="text-xl font-black text-slate-900 flex gap-2">
                                                    <span className="text-blue-600">{currentQIndex + 1}.</span>
                                                    {currentQuestion.title}
                                                </h2>
                                                <div className="flex gap-2 mt-2">
                                                    {currentQuestion.difficulty && (
                                                        <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                                                            {currentQuestion.difficulty}
                                                        </span>
                                                    )}
                                                    {currentQuestion.marks && (
                                                        <span className="text-[11px] text-blue-700 px-2.5 py-0.5 bg-blue-50 rounded-full font-bold border border-blue-200">
                                                            {currentQuestion.marks} Marks
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={toggleMarkForReview}
                                                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                                                    markedForReview[currentQuestion._id]
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-300'
                                                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                {markedForReview[currentQuestion._id] ? '★ Marked' : '☆ Mark for Review'}
                                            </button>
                                        </div>

                                        <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                            {currentQuestion.description}
                                        </div>

                                        {/* Options */}
                                        {currentQuestion.options?.length > 0 && (
                                            <div className="space-y-3 pt-2">
                                                {currentQuestion.options.map((opt, oi) => {
                                                    const isSelected = answers[currentQuestion._id] === opt;
                                                    return (
                                                        <label
                                                            key={oi}
                                                            className={`flex items-center p-4 rounded-2xl border cursor-pointer transition-all ${
                                                                isSelected
                                                                    ? 'bg-blue-50 border-blue-500 shadow-sm text-blue-900 font-bold'
                                                                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                                                            }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={`mcq_${currentQuestion._id}`}
                                                                checked={isSelected}
                                                                onChange={() => handleMCQAnswer(opt)}
                                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <span className="ml-3 text-sm">{opt}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center text-slate-400 py-10">No question selected</div>
                                )}
                            </div>
                        </div>

                        {/* Nav Buttons */}
                        <div className="p-4 border-t border-slate-200 bg-white flex justify-center shrink-0">
                            <div className="max-w-3xl w-full flex justify-between">
                                <button
                                    onClick={() => switchQuestion(Math.max(0, currentQIndex - 1))}
                                    disabled={currentQIndex === 0}
                                    className="px-5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl disabled:opacity-40 transition-colors border border-slate-200 cursor-pointer"
                                >
                                    ← Previous
                                </button>
                                <button
                                    onClick={() => switchQuestion(Math.min(questions.length - 1, currentQIndex + 1))}
                                    disabled={currentQIndex === questions.length - 1}
                                    className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
                                >
                                    Next Question →
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (() => {
                    const problemPane = (
                        <div className="h-full bg-slate-50 flex flex-col overflow-hidden lg:border-r border-slate-200">
                            {/* Question Navigator */}
                            {questions.length > 1 && (
                                <div className="p-3 border-b border-slate-200 bg-white shrink-0">
                                    <div className="flex flex-wrap gap-1.5">
                                        {questions.map((q, i) => (
                                            <button
                                                key={q._id}
                                                onClick={() => switchQuestion(i)}
                                                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center relative cursor-pointer ${
                                                    i === currentQIndex
                                                        ? 'bg-blue-600 text-white shadow-sm'
                                                        : answers[q._id]
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                                                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                {i + 1}
                                                {markedForReview[q._id] && (
                                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-white">
                                {currentQuestion ? (
                                    <>
                                        <div className="flex flex-wrap justify-between items-start gap-3 pb-3 border-b border-slate-100">
                                            <div>
                                                <h2 className="text-base sm:text-lg font-black text-slate-900 flex gap-2">
                                                    <span className="text-blue-600">{currentQIndex + 1}.</span>
                                                    {currentQuestion.title}
                                                </h2>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {currentQuestion.difficulty && (
                                                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                                                            {currentQuestion.difficulty}
                                                        </span>
                                                    )}
                                                    {currentQuestion.marks && (
                                                        <span className="text-[10px] text-blue-700 px-2.5 py-0.5 bg-blue-50 rounded-full font-bold border border-blue-200">
                                                            {currentQuestion.marks} Marks
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={toggleMarkForReview}
                                                className={`text-xs px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                                                    markedForReview[currentQuestion._id]
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-300'
                                                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                {markedForReview[currentQuestion._id] ? '★ Marked' : '☆ Mark'}
                                            </button>
                                        </div>

                                        <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                            {currentQuestion.description}
                                        </div>

                                        {/* Sample Cases */}
                                        <div className="pt-4 border-t border-slate-100">
                                            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">Sample Test Cases</h4>
                                            <div className="space-y-3">
                                                {(currentQuestion.testCases || []).filter(tc => !tc.isHidden).map((tc, i) => (
                                                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs">
                                                        <div className="mb-2">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Input</span>
                                                            <div className="p-2 rounded bg-white border border-slate-200 text-slate-800 overflow-x-auto">{tc.input}</div>
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Expected Output</span>
                                                            <div className="p-2 rounded bg-white border border-slate-200 text-slate-800 overflow-x-auto">{tc.output}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center text-slate-400 py-10">No question selected</div>
                                )}
                            </div>

                            {/* Nav Buttons */}
                            <div className="p-3 sm:p-4 border-t border-slate-200 bg-white flex justify-between shrink-0">
                                <button
                                    onClick={() => switchQuestion(Math.max(0, currentQIndex - 1))}
                                    disabled={currentQIndex === 0}
                                    className="px-4 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl disabled:opacity-40 transition-colors border border-slate-200 cursor-pointer"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => switchQuestion(Math.min(questions.length - 1, currentQIndex + 1))}
                                    disabled={currentQIndex === questions.length - 1}
                                    className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
                                >
                                    Next Question
                                </button>
                            </div>
                        </div>
                    );

                    const editorPane = (
                        <div className="h-full w-full flex flex-col min-w-0 min-h-0 overflow-hidden bg-white">
                            <Split
                                sizes={[65, 35]}
                                minSize={[150, 100]}
                                direction="vertical"
                                gutterSize={8}
                                className="flex-1 flex flex-col w-full h-full min-w-0 min-h-0 overflow-hidden"
                            >
                                {/* Editor */}
                                <div className="flex flex-col min-h-0 min-w-0 w-full bg-white overflow-hidden">
                                    <div className="h-11 border-b border-slate-200 bg-slate-50 flex justify-between items-center px-3 sm:px-4 shrink-0 overflow-x-auto">
                                        <div className="flex gap-2">
                                            <select
                                                className="bg-white text-slate-800 text-xs px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-300 font-semibold outline-none shadow-sm cursor-pointer"
                                                value={language}
                                                onChange={e => handleLanguageChange(e.target.value)}
                                            >
                                                <option value="python">Python (3.12)</option>
                                                <option value="cpp">C++ (GCC 14)</option>
                                                <option value="java">Java (JDK 17)</option>
                                                <option value="javascript">JavaScript (Node 20)</option>
                                                <option value="c">C (GCC 14)</option>
                                            </select>
                                            <select
                                                className="bg-white text-slate-800 text-xs px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-300 font-semibold outline-none shadow-sm cursor-pointer"
                                                value={theme}
                                                onChange={e => setTheme(e.target.value)}
                                            >
                                                <option value="vs-dark">Dark Editor</option>
                                                <option value="light">Light Editor</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full h-full min-h-0 min-w-0 relative">
                                        <CodeEditor code={code} setCode={handleCodeChange} language={language} theme={theme} onMount={handleEditorDidMount} />
                                    </div>
                                </div>

                                {/* Console */}
                                <div className="flex flex-col min-h-0 min-w-0 w-full bg-slate-50 border-t border-slate-200 overflow-hidden">
                                    <div className="min-h-10 bg-white border-b border-slate-200 flex flex-wrap justify-between items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-0 shrink-0">
                                        <div className="flex gap-3 sm:gap-4 h-full items-center">
                                            <button
                                                onClick={() => setOutputTab('result')}
                                                className={`text-xs font-bold h-8 sm:h-10 border-b-2 px-1 cursor-pointer ${outputTab === 'result' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                            >
                                                Test Result
                                            </button>
                                            <button
                                                onClick={() => setOutputTab('submission')}
                                                className={`text-xs font-bold h-8 sm:h-10 border-b-2 px-1 cursor-pointer ${outputTab === 'submission' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                            >
                                                Submission
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleRun}
                                                disabled={isRunning || isSubmittingCode}
                                                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-300 transition-colors cursor-pointer"
                                            >
                                                {isRunning ? 'Running...' : 'Run Code'}
                                            </button>
                                            <button
                                                onClick={handleSubmitCode}
                                                disabled={isRunning || isSubmittingCode}
                                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 sm:px-4 py-1.5 rounded-lg transition-colors shadow-sm cursor-pointer"
                                            >
                                                {isSubmittingCode ? 'Judging...' : 'Submit Code'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 text-xs font-mono bg-slate-900 text-slate-100">
                                        {outputTab === 'result' && (
                                            <>
                                                {!runResult && !isRunning && <div className="text-slate-400">Run code to see test execution output here.</div>}
                                                {isRunning && <div className="text-blue-400">Executing code against test cases...</div>}
                                                {runResult && !isRunning && (
                                                    runResult.error ? (
                                                        <div className="text-red-400">{runResult.error}</div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            <div className="text-emerald-400 font-bold">Standard Output:</div>
                                                            <pre className="text-slate-300 whitespace-pre-wrap">{runResult.stdout || 'Execution complete (no output).'}</pre>
                                                            {runResult.stderr && <pre className="text-red-400 whitespace-pre-wrap">{runResult.stderr}</pre>}
                                                        </div>
                                                    )
                                                )}
                                            </>
                                        )}
                                        {outputTab === 'submission' && (
                                            <>
                                                {!submitResult && !isSubmittingCode && <div className="text-slate-400">Click "Submit Code" to test against hidden judge cases.</div>}
                                                {isSubmittingCode && <div className="text-blue-400">Evaluating against all test cases...</div>}
                                                {submitResult && !isSubmittingCode && (
                                                    <div className="space-y-2">
                                                        <div className="font-bold text-emerald-400">
                                                            Cases Passed: {submitResult.passedCount || 0} / {submitResult.totalCount || 0}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Split>
                        </div>
                    );

                    if (isDesktop) {
                        return (
                            <Split
                                sizes={[45, 55]}
                                minSize={[300, 400]}
                                gutterSize={8}
                                className="flex h-full"
                            >
                                {problemPane}
                                {editorPane}
                            </Split>
                        );
                    }

                    return (
                        <div className="flex flex-col h-full overflow-hidden">
                            <div className="flex border-b border-slate-200 bg-white px-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setMobileCodingTab('problem')}
                                    className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${mobileCodingTab === 'problem' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}
                                >
                                    Problem
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMobileCodingTab('code')}
                                    className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${mobileCodingTab === 'code' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}
                                >
                                    Code & Console
                                </button>
                            </div>
                            <div className="flex-1 min-h-0 overflow-hidden">
                                {mobileCodingTab === 'problem' ? problemPane : editorPane}
                            </div>
                        </div>
                    );
                })()}
            </main>
        </div>
    );
};

export default TestTaker;
