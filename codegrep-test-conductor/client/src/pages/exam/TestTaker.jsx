import React, { useState, useEffect, useCallback, useRef } from 'react';
import Split from 'react-split';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import CodeEditor from '../../components/CodeEditor';
import { detectVirtualMachine } from '../../utils/vmDetection';

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

    // When language changes, load that language's stub if student hasn't typed anything yet
    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        if (currentQuestion && currentQuestion.type?.toUpperCase() !== 'MCQ') {
            const saved = answers[currentQuestion._id];
            const savedCode = saved?.code ?? (typeof saved === 'string' ? saved : null);
            const isDefault = !savedCode || savedCode === '// Write your code here\n';
            if (isDefault) {
                // No meaningful edits yet — load the stub for new language
                const stub = currentQuestion?.starterCode?.[newLang] || '';
                const newCode = stub || '// Write your code here\n';
                setCode(newCode);
                setAnswers(prev => ({ ...prev, [currentQuestion._id]: { language: newLang, code: newCode } }));
            } else {
                // Keep their code but update the language tag
                setAnswers(prev => ({ ...prev, [currentQuestion._id]: { language: newLang, code: savedCode } }));
            }
        }
    };
    // ── Execution results state ──────────────────────────────────────────────
    const [runResult, setRunResult] = useState(null);       // single run vs sample
    const [submitResult, setSubmitResult] = useState(null); // all test cases scored
    const [outputTab, setOutputTab] = useState('result');   // 'result' | 'submission'
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmittingCode, setIsSubmittingCode] = useState(false);
    const [expandedCase, setExpandedCase] = useState(null); // index of expanded row

    // ── Timer state ─────────────────────────────────────────────────────────
    const [timeLeft, setTimeLeft] = useState(null);
    const timerRef = useRef(null);

    // ── Submission state ──────────────────────────────────────────────────────
    const [submissionId, setSubmissionId] = useState(null);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    // ── Security state ──────────────────────────────────────────────────────
    const [securityLog, setSecurityLog] = useState([]);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isEditorMaximized, setIsEditorMaximized] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [isFocused, setIsFocused] = useState(true);
    const [mediaStream, setMediaStream] = useState(null);
    const videoRef = useRef(null);

    // ── VM detection state ───────────────────────────────────────────────────
    // 'checking' | 'vm_blocked' | 'clear'
    const [vmCheckStatus, setVmCheckStatus] = useState('checking');
    const [vmInfo, setVmInfo] = useState(null);

    // ── Fetch test + start submission ────────────────────────────────────────
    useEffect(() => {
        if (!id || id === 'mock') {
            setVmCheckStatus('clear');
            setTestLoading(false);
            return;
        }

        // ── VM check runs FIRST — before creating any submission record ──
        const vmResult = detectVirtualMachine();
        if (vmResult.isVirtualMachine) {
            setVmInfo(vmResult);
            setVmCheckStatus('vm_blocked');
            setTestLoading(false);
            // Log to backend silently (non-blocking — no submissionId yet, best-effort)
            api.post('/proctoring/vm-detection', {
                submissionId: null,
                ...vmResult,
                detectedAt: new Date().toISOString()
            }).catch(() => { });
            return;
        }
        setVmCheckStatus('clear');

        api.get(`/tests/${id}`)
            .then(async res => {
                if (res.data.success) {
                    const testData = res.data.data;
                    setTest(testData);
                    setTimeLeft(testData.duration * 60);
                    // Pre-fill editor with first question's starter stub (default language = javascript)
                    const firstQ = testData.questions?.[0];
                    if (firstQ && firstQ.type?.toUpperCase() !== 'MCQ') {
                        const stub = firstQ?.starterCode?.javascript || firstQ?.starterCode?.get?.('javascript') || '';
                        if (stub) setCode(stub);
                    }
                    // Start a submission record on backend
                    try {
                        const subRes = await api.post(`/submissions/${id}/start`);
                        if (subRes.data.success) {
                            setSubmissionId(subRes.data.data._id);
                        }
                    } catch (subErr) {
                        const msg = subErr?.response?.data?.msg || 'Could not start exam session.';
                        setTestError(msg);
                        setTest(null);
                        return;
                    }
                } else {
                    setTestError('Test not found.');
                }
            })
            .catch(err => {
                const status = err?.response?.status;
                const msg = err?.response?.data?.msg;
                if (status === 403) {
                    if (msg?.includes('Maximum attempt limit')) {
                        setTestError(`🚫 Max Attempts Reached: You have already completed this test the maximum allowed ${err.response?.data?.maxAttempts || 1} time(s).`);
                    } else {
                        setTestError('⚠️ This test is not published yet. Ask your teacher to publish it before you can take it.');
                    }
                } else if (status === 404) {
                    setTestError('Test not found. The link may be invalid.');
                } else {
                    setTestError(msg || 'Failed to load test. Please check your connection and try again.');
                }
            })
            .finally(() => setTestLoading(false));
    }, [id]);

    // ── Countdown timer ──────────────────────────────────────────────────────
    useEffect(() => {
        if (timeLeft === null) return;
        if (timeLeft <= 0) {
            handleAutoSubmit();
            return;
        }
        timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearTimeout(timerRef.current);
    }, [timeLeft]);

    const formatTime = (secs) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const timerColor = timeLeft !== null && timeLeft < 300 ? 'text-red-400' : 'text-cyan-300';

    // ── Answer tracking ──────────────────────────────────────────────────────
    const currentQuestion = test?.questions?.[currentQIndex];

    const handleCodeChange = (val) => {
        setCode(val);
        if (currentQuestion && currentQuestion.type?.toUpperCase() !== 'MCQ') {
            // Store as { language, code } so teacher/admin can see which language was used
            setAnswers(prev => ({ ...prev, [currentQuestion._id]: { language, code: val } }));
        }
    };

    const handleMCQAnswer = (option) => {
        if (currentQuestion) {
            setAnswers(prev => ({ ...prev, [currentQuestion._id]: option }));
        }
    };

    // Helper: get the starter stub for a question+language (fallback to blank)
    const getStub = (question, lang) => {
        if (!question?.starterCode) return '';
        // starterCode is a Map on backend, comes as plain object in JSON
        const sc = question.starterCode;
        return (typeof sc.get === 'function' ? sc.get(lang) : sc[lang]) || '';
    };

    const switchQuestion = (idx) => {
        // Save current code answer before switching (for coding questions)
        if (currentQuestion && currentQuestion.type?.toUpperCase() !== 'MCQ') {
            setAnswers(prev => ({ ...prev, [currentQuestion._id]: { language, code } }));
        }
        setCurrentQIndex(idx);
        const next = test?.questions?.[idx];
        if (next && next.type?.toUpperCase() !== 'MCQ') {
            // Use saved answer → else use starter stub → else blank
            const saved = answers[next._id];
            // saved may be { language, code } object or a plain string (legacy)
            const savedCode = saved?.code ?? (typeof saved === 'string' ? saved : null);
            const stub = getStub(next, language);
            setCode(savedCode || stub || '// Write your code here\n');
        }
        setRunResult(null);
        setSubmitResult(null);
        setOutputTab('result');
        setExpandedCase(null);
    };

    const toggleMarkForReview = () => {
        if (currentQuestion) {
            setMarkedForReview(prev => ({
                ...prev,
                [currentQuestion._id]: !prev[currentQuestion._id]
            }));
        }
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const doSubmit = async (isAuto = false) => {
        clearTimeout(timerRef.current);
        setSubmitLoading(true);
        try {
            if (submissionId) {
                // Package answers: coding = { language, code }, MCQ = raw string
                const answersArr = Object.entries(answers).map(([questionId, answerData]) => ({
                    questionId,
                    answerData: typeof answerData === 'object' && answerData !== null
                        ? answerData  // already { language, code }
                        : answerData  // MCQ string
                }));
                const res = await api.post(`/submissions/${id}/submit/${submissionId}`, {
                    answers: answersArr,
                    isAutoSubmitted: isAuto
                });
                if (res.data.success) setSubmissionResult(res.data.data);
            }
        } catch (_) { /* show submitted screen anyway */ }
        finally {
            setSubmitLoading(false);
            setSubmitted(true);
            submittedRef.current = true;
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
            if (document.fullscreenElement) {
                if (document.exitFullscreen) document.exitFullscreen();
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            }
        }
    };

    const handleAutoSubmit = () => doSubmit(true);
    const handleSubmit = () => {
        setShowSubmitModal(true);
    };

    // ── Security hooks ───────────────────────────────────────────────────────
    const submissionIdRef = useRef(null);
    useEffect(() => { submissionIdRef.current = submissionId; }, [submissionId]);
    const submittedRef = useRef(false);
    useEffect(() => { submittedRef.current = submitted; }, [submitted]);

    const logViolation = useCallback((type, message) => {
        if (submittedRef.current) return;

        const entry = { type, message, timestamp: new Date().toISOString() };
        setSecurityLog(prev => [...prev, entry]);
        setWarningMessage(message);
        setShowWarningModal(true);
        // ── Real-time backend logging ────────────────────────────────────────
        const sid = submissionIdRef.current;
        if (sid && id && id !== 'mock') {
            api.patch(`/submissions/${sid}/proctor-event`, { type, message, timestamp: entry.timestamp })
                .catch(() => { }); // silently ignore network errors
        }
    }, [id]);

    // Clean up media stream on unmount
    useEffect(() => {
        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [mediaStream]);

    const enterFullscreen = async () => {
        if (!isMock) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setMediaStream(stream);
            } catch (err) {
                alert('Camera and microphone permission is required to start the exam. Please allow access in your browser settings and try again.');
                return;
            }
        }

        const el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        setIsFullscreen(true);
    };

    useEffect(() => {
        const onFC = () => {
            const isFull = !!document.fullscreenElement;
            setIsFullscreen(isFull);
            if (!isFull) logViolation('FULLSCREEN_EXIT', '⚠️ You exited fullscreen mode. Please return immediately.');
        };
        document.addEventListener('fullscreenchange', onFC);
        return () => document.removeEventListener('fullscreenchange', onFC);
    }, [logViolation]);

    useEffect(() => {
        const handle = () => { 
            setIsFocused(!document.hidden);
            if (document.hidden) logViolation('TAB_SWITCH', '⚠️ Tab switch detected. Please stay on the exam tab.'); 
        };
        document.addEventListener('visibilitychange', handle);
        return () => document.removeEventListener('visibilitychange', handle);
    }, [logViolation]);

    useEffect(() => {
        const p = (e) => e.preventDefault();
        document.addEventListener('contextmenu', p);
        return () => document.removeEventListener('contextmenu', p);
    }, []);

    useEffect(() => {
        const handle = (e) => {
            const { ctrlKey, metaKey, shiftKey, key } = e;
            const isCtrl = ctrlKey || metaKey;
            if (key === 'F12') { e.preventDefault(); logViolation('DEV_TOOLS', '🚫 Developer tools are disabled.'); return; }
            if (isCtrl && shiftKey && ['I', 'J', 'C'].includes(key)) { e.preventDefault(); logViolation('DEV_TOOLS', '🚫 Developer tools are disabled.'); return; }
            if (isCtrl && key === 'c' && !e.target.closest('.monaco-editor')) { e.preventDefault(); logViolation('COPY_ATTEMPT', '🚫 Copying is prohibited.'); return; }
            if (isCtrl && key === 'v' && !e.target.closest('.monaco-editor')) { e.preventDefault(); logViolation('PASTE_ATTEMPT', '🚫 Pasting is prohibited.'); return; }
            if (isCtrl && (key === 'u' || key === 's')) e.preventDefault();
        };
        document.addEventListener('keydown', handle);
        return () => document.removeEventListener('keydown', handle);
    }, [logViolation]);

    useEffect(() => {
        const handleBlur = () => {
            setIsFocused(false);
            if (document.hidden) return; // already handled by visibilitychange
            logViolation('FOCUS_LOST', '⚠️ Window lost focus. Close all other applications and notifications.');
        };
        const handleFocus = () => setIsFocused(true);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        return () => {
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
        };
    }, [logViolation]);

    useEffect(() => {
        const handleKeyUp = (e) => {
            if (e.key === 'PrintScreen') {
                logViolation('SCREENSHOT', '⚠️ Screenshots are strictly prohibited during the exam.');
                navigator.clipboard.writeText('Screenshots disabled').catch(() => { });
            }
            if (e.metaKey && e.shiftKey && (e.key === 's' || e.key === 'S')) {
                logViolation('SCREENSHOT', '⚠️ Screenshots are strictly prohibited during the exam.');
                navigator.clipboard.writeText('Screenshots disabled').catch(() => { });
            }
        };
        window.addEventListener('keyup', handleKeyUp);
        return () => window.removeEventListener('keyup', handleKeyUp);
    }, [logViolation]);

    const handleEditorDidMount = (editor, monaco) => {
        editor.onKeyDown((e) => {
            if ((e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyV) {
                e.preventDefault(); e.stopPropagation();
                logViolation('PASTE_ATTEMPT', '🚫 Pasting code is prohibited during the exam.');
            }
        });
    };

    // Judge0 CE — 7 most popular coding assessment languages
    const langMap = {
        python:     100,  // Python 3.12.5
        cpp:        105,  // C++ GCC 14.1.0
        java:        91,  // Java JDK 17.0.6
        javascript:  97,  // Node.js 20.17.0
        c:          103,  // C GCC 14.1.0
        typescript: 101,  // TypeScript 5.6.2
        go:         106,  // Go 1.22.0
    };

    // ▶ Run against the first visible sample test case (fast feedback)
    const handleRun = async () => {
        if (isMock) {
            setRunResult({ mock: true, stdout: 'Hello World!', status: { id: 3, description: 'Accepted' }, time: '0.10', memory: 1024, expectedOutput: '', input: '' });
            setOutputTab('result');
            return;
        }
        if (!currentQuestion || currentQuestion.type?.toUpperCase() === 'MCQ') return;
        setIsRunning(true);
        setOutputTab('result');
        const sampleTc = (currentQuestion.testCases || []).find(tc => !tc.isHidden);
        const stdin = sampleTc?.input || '';
        try {
            const res = await api.post('/execute/run', {
                source_code: code,
                language_id: langMap[language] || 63,
                stdin
            });
            if (res.data.success) {
                const d = res.data.data;
                const actualOutput = (d.stdout || '').trim();
                const expectedOutput = (sampleTc?.output || '').trim();
                const passed = expectedOutput ? actualOutput === expectedOutput : null;
                setRunResult({ input: stdin, expectedOutput, actualOutput, passed, time: d.time, memory: d.memory, status: d.status, stderr: d.stderr, compile_output: d.compile_output });
            }
        } catch (err) {
            setRunResult({ error: err.response?.data?.msg || err.message });
        } finally {
            setIsRunning(false);
        }
    };

    // ✅ Submit against ALL test cases (scored)
    const handleSubmitCode = async () => {
        if (isMock) {
            setSubmitResult({ mock: true, passedCount: 1, totalCases: 2, scoreAwarded: 5, maxMarks: 10, results: [{ passed: true, input: 'hello', expectedOutput: 'olleh', actualOutput: 'olleh', time: '0.05', memory: 512, statusDescription: 'Accepted', isHidden: false }, { passed: false, input: '', expectedOutput: '', actualOutput: '', time: '0.00', memory: 0, statusDescription: 'Wrong Answer', isHidden: true }] });
            setOutputTab('submission');
            return;
        }
        if (!currentQuestion || currentQuestion.type?.toUpperCase() === 'MCQ') return;
        setIsSubmittingCode(true);
        setOutputTab('submission');
        try {
            const res = await api.post('/execute/submit', {
                source_code: code,
                language_id: langMap[language] || 63,
                questionId: currentQuestion._id
            });
            if (res.data.success) setSubmitResult(res.data.data);
        } catch (err) {
            setSubmitResult({ error: err.response?.data?.msg || err.message });
        } finally {
            setIsSubmittingCode(false);
        }
    };

    // ── VM Blocked screen ────────────────────────────────────────────────────
    if (vmCheckStatus === 'vm_blocked') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,6,23,0.8)', fontFamily: 'system-ui, sans-serif' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 24, padding: '48px 40px', textAlign: 'center', maxWidth: 520, width: '90%', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
                    {/* Shield icon */}
                    <div style={{ width: 88, height: 88, background: 'rgba(239,68,68,0.12)', border: '2px solid rgba(239,68,68,0.35)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <svg style={{ width: 44, height: 44, color: '#ef4444' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8'
                                d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                        </svg>
                    </div>

                    <h1 style={{ color: '#ef4444', fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.5px' }}>Virtual Machine Detected</h1>
                    <p style={{ color: '#fca5a5', fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
                        This exam cannot be taken inside a virtual machine or emulated environment.
                        Please use a physical device to continue.
                    </p>

                    {/* Technical details */}
                    <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 28, textAlign: 'left' }}>
                        <p style={{ color: '#f87171', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Detection Details</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {[['GPU Renderer', vmInfo?.renderer || '—'], ['Vendor', vmInfo?.vendor || '—'], ['Matched Signal', vmInfo?.matchedIndicator || '—']].map(([label, val]) => (
                                <div key={label} style={{ gridColumn: label === 'Matched Signal' ? 'span 2' : 'span 1' }}>
                                    <span style={{ color: '#9ca3af', fontSize: 11, display: 'block', marginBottom: 2 }}>{label}</span>
                                    <span style={{ color: '#f1f5f9', fontSize: 12, fontFamily: 'monospace', wordBreak: 'break-all' }}>{val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p style={{ color: '#6b7280', fontSize: 12, marginBottom: 24, lineHeight: 1.6 }}>
                        This violation has been automatically reported to your examiner.
                        If you believe this is a mistake, please contact your exam administrator.
                    </p>

                    <button
                        onClick={() => navigate('/student/exams')}
                        style={{ width: '100%', padding: '14px 0', background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em' }}
                    >
                        Return to Exam List
                    </button>
                </div>
            </div>
        );
    }

    // ── Submitted screen ─────────────────────────────────────────────────────
    if (submitted) {
        const score = submissionResult?.totalMarks ?? null;
        const pct = submissionResult?.percentile ?? null;
        const rank = submissionResult?.rank ?? null;
        return (
            <div className="h-screen flex items-center justify-center" style={{ background: 'transparent' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 48, textAlign: 'center', maxWidth: 480, width: '90%', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>
                    {submitLoading ? (
                        <>
                            <div style={{ width: 56, height: 56, border: '4px solid rgba(139,113,255,0.3)', borderTopColor: '#8B71FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                            <p style={{ color: '#a0a0b0' }}>Submitting your exam...</p>
                            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                        </>
                    ) : (
                        <>
                            <div style={{ width: 80, height: 80, background: 'rgba(74,222,128,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '2px solid rgba(74,222,128,0.3)' }}>
                                <svg style={{ width: 40, height: 40, color: '#4ade80' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 style={{ color: '#fff', fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Exam Submitted! 🎉</h2>
                            <p style={{ color: '#a0a0b0', marginBottom: 24 }}>Your response has been recorded.</p>

                            {score !== null && (
                                <div style={{ display: 'grid', gridTemplateColumns: pct !== null ? '1fr 1fr 1fr' : '1fr', gap: 12, marginBottom: 28 }}>
                                    {[['Score', score, '#8B71FF'], ...(pct !== null ? [['Percentile', `${pct}%`, '#4ade80'], ['Rank', `#${rank}`, '#ffaa00']] : [])].map(([label, val, color]) => (
                                        <div key={label} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: 16 }}>
                                            <div style={{ color, fontSize: 26, fontWeight: 800 }}>{val}</div>
                                            <div style={{ color: '#a0a0b0', fontSize: 12, marginTop: 4 }}>{label}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>You answered {Object.keys(answers).length} of {test?.questions?.length ?? 0} questions.</p>
                            <button onClick={() => navigate('/student')} style={{ width: '100%', padding: '14px 0', background: 'linear-gradient(135deg, #8B71FF, #6c4fe8)', color: '#fff', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                                Return to Dashboard
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // ── Loading / error ──────────────────────────────────────────────────────
    if (testLoading) {
        return (
            <div className="h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
                <div className="text-center">
                    <div className="hl-spinner mx-auto mb-5" style={{ width: '40px', height: '40px' }} />
                    <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Initializing Secure Exam...</p>
                    <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>HiGen Labs Assessment Platform</p>
                </div>
            </div>
        );
    }

    if (testError) {
        return (
            <div className="h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
                <div className="rounded-2xl p-10 text-center max-w-md w-full" style={{ background: 'var(--bg-card)', border: '1px solid rgba(239,68,68,0.25)', boxShadow: '0 0 40px rgba(239,68,68,0.08)' }}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--accent-red)' }}>
                        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Unable to Load Exam</h2>
                    <p className="text-sm mb-8" style={{ color: 'var(--accent-red)' }}>{testError}</p>
                    <button onClick={() => navigate('/student/exams')} className="hl-btn-secondary w-full" style={{ justifyContent: 'center' }}>
                        ← Back to Exam Selection
                    </button>
                </div>
            </div>
        );
    }

    const warningCount = securityLog.length;
    const isMock = !id || id === 'mock';
    const questions = test?.questions ?? [];


    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden select-none" style={{ background: '#0d1117', color: '#e8eaf6', fontFamily: 'Inter, system-ui, sans-serif' }}>
            
            {/* Submit Confirmation Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-800 border border-slate-600 rounded-lg shadow-xl p-8 max-w-sm w-full mx-4 text-center">
                        <div className="w-16 h-16 bg-slate-700 text-green-400 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 mb-2">Submit Exam?</h3>
                        <p className="text-slate-400 text-sm mb-8">Are you sure you want to submit the exam? This action cannot be undone.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowSubmitModal(false)} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-sm transition-colors">Cancel</button>
                            <button onClick={() => { setShowSubmitModal(false); doSubmit(false); }} className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-white font-medium rounded text-sm transition-colors">Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mandatory Fullscreen Gate */}
            {!isMock && !isFullscreen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-lg w-full flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-8 text-center border-b border-slate-700 bg-slate-800/50">
                            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            </div>
                            <h2 className="text-white text-2xl font-bold">{test?.title || 'Exam'}</h2>
                            <p className="text-slate-400 text-sm mt-2">{test?.duration} min &nbsp;·&nbsp; {questions.length} questions</p>
                        </div>
                        <div className="p-8 bg-slate-900/50">
                            <h3 className="text-slate-300 font-semibold text-xs uppercase tracking-wider mb-4">⚠️ Rules</h3>
                            <ul className="space-y-4">
                                {[
                                    ['🖥️', 'Fullscreen is locked throughout the exam'],
                                    ['🎥', 'Camera and microphone monitoring is active'],
                                    ['🔀', 'Tab switching gets recorded as a violation'],
                                    ['📸', 'Screenshots and screen recording are prohibited'],
                                    ['📋', 'Copy/paste outside the editor is disabled'],
                                ].map(([icon, rule]) => (
                                    <li key={rule} className="flex items-start gap-3 text-sm text-slate-300">
                                        <span className="text-base shrink-0">{icon}</span>
                                        <span className="leading-snug">{rule}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-6 bg-slate-800">
                            <button onClick={enterFullscreen} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">
                                Enter Fullscreen &amp; Start
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Privacy Mask */}
            {(!isFocused || isFullscreen === false) && !isMock && (
                <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isFullscreen === false ? 'Fullscreen Required' : 'Privacy Lock Active'}
                    </h2>
                    <p className="text-slate-300 max-w-md text-center">
                        {isFullscreen === false 
                            ? 'You must remain in fullscreen mode.'
                            : 'Screen content hidden because window lost focus.'}
                    </p>
                    {isFullscreen === false && (
                        <button onClick={enterFullscreen} className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded font-medium transition-colors">
                            Re-enter Fullscreen
                        </button>
                    )}
                </div>
            )}

            {/* Proctoring Video Feed */}
            {mediaStream && (
                <div className="fixed bottom-6 right-6 z-[80] w-48 h-36 bg-black border border-slate-700 rounded-lg shadow-lg overflow-hidden">
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Live</span>
                    </div>
                    <video 
                        autoPlay muted playsInline 
                        ref={(video) => { if (video) video.srcObject = mediaStream; }} 
                        className="w-full h-full object-cover scale-x-[-1]"
                    />
                </div>
            )}

            {/* Header */}
            <header className="h-14 px-5 flex justify-between items-center z-10 shrink-0" style={{ background: '#161d35', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.2)' }}>
                        <img src="/company-logo.png" alt="HiGen Labs" className="w-5 h-5 object-contain" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-sm font-semibold" style={{ color: '#e8eaf6' }}>{isMock ? 'Sandbox Environment' : (test?.title || 'Exam Session')}</span>
                        <span className="text-xs" style={{ color: '#4a5578' }}>HiGen Labs Assessment</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {timeLeft !== null && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold"
                            style={{
                                fontFamily: 'JetBrains Mono, monospace',
                                background: timeLeft < 300 ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.06)',
                                color: timeLeft < 300 ? '#ef4444' : '#e8eaf6',
                                border: `1px solid ${timeLeft < 300 ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}`,
                            }}>
                            ⏱ {formatTime(timeLeft)}
                        </div>
                    )}
                    <div className="hidden sm:flex items-center text-xs">
                        <span className="px-2.5 py-1 rounded-lg font-medium" style={{ background: warningCount > 0 ? 'rgba(239,68,68,0.12)' : 'rgba(0,212,170,0.1)', color: warningCount > 0 ? '#ef4444' : '#00d4aa', border: `1px solid ${warningCount > 0 ? 'rgba(239,68,68,0.25)' : 'rgba(0,212,170,0.2)'}` }}>
                            {warningCount > 0 ? `⚠ ${warningCount} violations` : '✓ Secure'}
                        </span>
                    </div>
                    <button onClick={handleSubmit} className="px-5 py-2 rounded-lg text-sm font-semibold transition-all" style={{ background: 'var(--accent-green)', color: '#0a0e1a', border: 'none', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#00f0c0'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-green)'}
                    >
                        Submit Exam
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="flex-1 overflow-hidden">
                {currentQuestion?.type?.toUpperCase() === 'MCQ' ? (
                    /* Centered Single-Column Layout for MCQ Questions */
                    <div className="h-full w-full bg-slate-900 flex flex-col overflow-hidden">
                        {/* Question Navigator */}
                        {!isMock && questions.length > 1 && (
                            <div className="p-3 border-b border-slate-800 bg-slate-800/30 shrink-0 flex justify-center">
                                <div className="flex flex-wrap gap-1.5 max-w-3xl w-full">
                                    {questions.map((q, i) => (
                                        <button
                                            key={q._id}
                                            onClick={() => switchQuestion(i)}
                                            className={`w-9 h-9 rounded text-xs font-semibold transition-all flex items-center justify-center relative ${i === currentQIndex
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                : answers[q._id]
                                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                                                }`}
                                        >
                                            {i + 1}
                                            {markedForReview[q._id] && (
                                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border border-slate-900"></span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Centered MCQ Content Area (Scrollable) */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin scrollbar-thumb-slate-700 flex justify-center">
                            <div className="max-w-3xl w-full">
                                {currentQuestion ? (
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-100 flex gap-2">
                                                    <span className="text-slate-400">{currentQIndex + 1}.</span>
                                                    {currentQuestion.title}
                                                </h2>
                                                <div className="flex gap-2 mt-3">
                                                    {currentQuestion.difficulty && (
                                                        <span className={`text-xs px-2.5 py-0.5 rounded font-semibold uppercase ${
                                                            currentQuestion.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                            currentQuestion.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                            'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                                        }`}>
                                                            {currentQuestion.difficulty}
                                                        </span>
                                                    )}
                                                    {currentQuestion.marks && (
                                                        <span className="text-xs text-slate-400 px-2.5 py-0.5 bg-slate-800 rounded font-semibold border border-slate-700">{currentQuestion.marks} marks</span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={toggleMarkForReview}
                                                className={`text-xs px-3.5 py-2 rounded-lg font-medium transition-all ${markedForReview[currentQuestion._id] ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'}`}
                                            >
                                                {markedForReview[currentQuestion._id] ? '★ Marked' : '☆ Mark'}
                                            </button>
                                        </div>

                                        <div className="prose prose-invert prose-base text-slate-300 max-w-none whitespace-pre-wrap mb-8">
                                            {currentQuestion.description}
                                        </div>

                                        {/* MCQ Options */}
                                        {currentQuestion.options?.length > 0 && (
                                            <div className="space-y-3.5 mt-6">
                                                {currentQuestion.options.map((opt, oi) => {
                                                    const isSelected = answers[currentQuestion._id] === opt;
                                                    return (
                                                        <label key={oi} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-blue-600/15 border-blue-500 text-slate-100 shadow-md shadow-blue-500/10' : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-500 text-slate-300 hover:bg-slate-800'}`}>
                                                            <input type="radio" name={`mcq_${currentQuestion._id}`} checked={isSelected} onChange={() => handleMCQAnswer(opt)} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-600" />
                                                            <span className={`ml-3.5 text-base font-medium ${isSelected ? 'text-white' : 'text-slate-200'}`}>{opt}</span>
                                                        </label>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center text-slate-500 py-10">No question selected</div>
                                )}
                            </div>
                        </div>

                        {/* Centered Question Nav Buttons */}
                        <div className="p-4 border-t border-slate-800 flex justify-center bg-slate-900 shrink-0">
                            <div className="max-w-3xl w-full flex justify-between">
                                <button
                                    onClick={() => switchQuestion(Math.max(0, currentQIndex - 1))}
                                    disabled={currentQIndex === 0}
                                    className="px-5 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg disabled:opacity-40 transition-colors border border-slate-700"
                                >
                                    ← Previous
                                </button>
                                <button
                                    onClick={() => switchQuestion(Math.min(questions.length - 1, currentQIndex + 1))}
                                    disabled={currentQIndex === questions.length - 1}
                                    className="px-5 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg disabled:opacity-40 transition-colors border border-slate-700"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* 2-Column Split Layout for Coding Questions */
                    <Split
                        sizes={[45, 55]}
                        minSize={[300, 400]}
                        gutterSize={8}
                        className="flex h-full"
                    >
                        {/* Left Pane: Problem Description (Scrollable) */}
                        <div className="h-full bg-slate-900 flex flex-col overflow-hidden">
                            {/* Question Navigator */}
                            {!isMock && questions.length > 1 && (
                                <div className="p-3 border-b border-slate-800 bg-slate-800/30 shrink-0">
                                    <div className="flex flex-wrap gap-1.5">
                                        {questions.map((q, i) => (
                                            <button
                                                key={q._id}
                                                onClick={() => switchQuestion(i)}
                                                className={`w-8 h-8 rounded text-xs font-medium transition-colors flex items-center justify-center relative ${i === currentQIndex
                                                    ? 'bg-blue-600 text-white'
                                                    : answers[q._id]
                                                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                    }`}
                                            >
                                                {i + 1}
                                                {markedForReview[q._id] && (
                                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border border-slate-900"></span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Content Area (Scrollable) */}
                            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700">
                                {isMock ? (
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-100 mb-4">1. Two Sum</h2>
                                        <div className="prose prose-invert prose-sm text-slate-300 max-w-none">
                                            <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
                                            <h3 className="text-slate-200 mt-6 mb-2">Example:</h3>
                                            <pre className="bg-slate-800 p-4 rounded text-sm font-mono text-slate-300">
                                                {"Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]"}
                                            </pre>
                                        </div>
                                    </div>
                                ) : currentQuestion ? (
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-100 flex gap-2">
                                                    <span className="text-slate-400">{currentQIndex + 1}.</span>
                                                    {currentQuestion.title}
                                                </h2>
                                                <div className="flex gap-2 mt-2">
                                                    {currentQuestion.difficulty && (
                                                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium uppercase ${
                                                            currentQuestion.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                                                            currentQuestion.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400' :
                                                            'bg-orange-500/10 text-orange-400'
                                                        }`}>
                                                            {currentQuestion.difficulty}
                                                        </span>
                                                    )}
                                                    {currentQuestion.marks && (
                                                        <span className="text-[10px] text-slate-400 px-2 py-0.5 bg-slate-800 rounded font-medium">{currentQuestion.marks} marks</span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={toggleMarkForReview}
                                                className={`text-xs px-3 py-1.5 rounded transition-colors ${markedForReview[currentQuestion._id] ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                            >
                                                {markedForReview[currentQuestion._id] ? '★ Marked' : '☆ Mark'}
                                            </button>
                                        </div>

                                        <div className="prose prose-invert prose-sm text-slate-300 max-w-none whitespace-pre-wrap">
                                            {currentQuestion.description}
                                        </div>

                                        {/* Sample Test Cases */}
                                        <div className="mt-10">
                                            <h4 className="font-semibold text-slate-200 text-sm mb-4">Sample Test Cases</h4>
                                            <div className="space-y-4">
                                                {(currentQuestion.testCases || []).filter(tc => !tc.isHidden).map((tc, i) => (
                                                    <div key={i} className="bg-slate-800/50 rounded p-4 text-sm font-mono text-slate-300 border border-slate-800">
                                                        <div className="mb-2">
                                                            <div className="text-[10px] text-slate-500 uppercase font-sans font-bold mb-1">Input</div>
                                                            <div className="bg-slate-900 p-2 rounded max-h-40 overflow-y-auto whitespace-pre-wrap">{tc.input}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] text-slate-500 uppercase font-sans font-bold mb-1">Output</div>
                                                            <div className="bg-slate-900 p-2 rounded max-h-40 overflow-y-auto whitespace-pre-wrap">{tc.output}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-slate-500 py-10">No question selected</div>
                                )}
                            </div>

                            {/* Question Nav Buttons (Bottom Left) */}
                            <div className="p-4 border-t border-slate-800 flex justify-between bg-slate-900 shrink-0">
                                <button
                                    onClick={() => switchQuestion(Math.max(0, currentQIndex - 1))}
                                    disabled={currentQIndex === 0}
                                    className="px-4 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded disabled:opacity-50 transition-colors"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => switchQuestion(Math.min(questions.length - 1, currentQIndex + 1))}
                                    disabled={currentQIndex === questions.length - 1}
                                    className="px-4 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded disabled:opacity-50 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                        {/* Right Pane: Code Editor + Console */}
                        <div className="h-full w-full flex flex-col min-w-0 min-h-0 overflow-hidden">
                            <Split
                                sizes={[65, 35]}
                                minSize={[150, 100]}
                                direction="vertical"
                                gutterSize={8}
                                className="flex-1 flex flex-col w-full h-full min-w-0 min-h-0 overflow-hidden"
                            >
                                {/* Top: Editor */}
                                <div className="flex flex-col min-h-0 min-w-0 w-full bg-slate-900 overflow-hidden">
                                    <div className="h-10 border-b border-slate-800 bg-slate-900 flex justify-between items-center px-4 shrink-0">
                                        <div className="flex gap-2">
                                            <select 
                                                className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded border border-slate-700 outline-none" 
                                                value={language} 
                                                onChange={e => handleLanguageChange(e.target.value)}
                                            >
                                                <option value="python">Python (3.12)</option>
                                                <option value="cpp">C++ (GCC 14)</option>
                                                <option value="java">Java (JDK 17)</option>
                                                <option value="javascript">JavaScript (Node 20)</option>
                                                <option value="c">C (GCC 14)</option>
                                                <option value="typescript">TypeScript (5.6)</option>
                                                <option value="go">Go (1.22)</option>
                                            </select>
                                            <select 
                                                className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded border border-slate-700 outline-none" 
                                                value={theme} 
                                                onChange={e => setTheme(e.target.value)}
                                            >
                                                <option value="vs-dark">Dark</option>
                                                <option value="light">Light</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full h-full min-h-0 min-w-0 relative">
                                        <CodeEditor code={code} setCode={handleCodeChange} language={language} theme={theme} onMount={handleEditorDidMount} />
                                    </div>
                                </div>

                                {/* Bottom: Console (Scrollable) */}
                                <div className="flex flex-col min-h-0 min-w-0 w-full bg-slate-900 border-t border-slate-800 overflow-hidden">
                                    <div className="h-10 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center px-4 shrink-0">
                                        <div className="flex gap-4 h-full">
                                            <button 
                                                onClick={() => setOutputTab('result')} 
                                                className={`text-xs font-medium h-full border-b-2 px-1 ${outputTab === 'result' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
                                            >
                                                Test Result
                                            </button>
                                            <button 
                                                onClick={() => setOutputTab('submission')} 
                                                className={`text-xs font-medium h-full border-b-2 px-1 ${outputTab === 'submission' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
                                            >
                                                Submission
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleRun}
                                                disabled={isRunning || isSubmittingCode}
                                                className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs px-3 py-1 rounded transition-colors"
                                            >
                                                {isRunning ? 'Running...' : 'Run Code'}
                                            </button>
                                            <button
                                                onClick={handleSubmitCode}
                                                disabled={isRunning || isSubmittingCode}
                                                className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1 rounded transition-colors"
                                            >
                                                {isSubmittingCode ? 'Judging...' : 'Submit Code'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 text-sm font-mono max-h-full">
                                        {/* Console Content */}
                                        {outputTab === 'result' && (
                                            <>
                                                {!runResult && !isRunning && <div className="text-slate-500">Run code to see test results here.</div>}
                                                {isRunning && <div className="text-blue-400 flex items-center gap-2"><div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>Executing code...</div>}
                                                {runResult && !isRunning && (
                                                    runResult.error ? (
                                                        <div className="text-red-400">{runResult.error}</div>
                                                    ) : runResult.compile_output ? (
                                                        <div className="text-red-400 whitespace-pre-wrap">{runResult.compile_output}</div>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            <div className={`font-bold ${runResult.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                                                                {runResult.passed ? 'Accepted' : 'Wrong Answer'}
                                                            </div>
                                                            <div><span className="text-slate-500">Input:</span><br/><span className="text-slate-300">{runResult.input}</span></div>
                                                            <div><span className="text-slate-500">Expected:</span><br/><span className="text-slate-300">{runResult.expectedOutput}</span></div>
                                                            <div><span className="text-slate-500">Output:</span><br/><span className="text-slate-300">{runResult.actualOutput}</span></div>
                                                        </div>
                                                    )
                                                )}
                                            </>
                                        )}
                                        {outputTab === 'submission' && (
                                            <>
                                                {!submitResult && !isSubmittingCode && <div className="text-slate-500">Submit code to see evaluation against all test cases.</div>}
                                                {isSubmittingCode && <div className="text-emerald-400 flex items-center gap-2"><div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>Evaluating submission...</div>}
                                                {submitResult && !isSubmittingCode && (
                                                    submitResult.error ? (
                                                        <div className="text-red-400">{submitResult.error}</div>
                                                    ) : (
                                                        <div>
                                                            <div className="text-emerald-400 font-bold mb-2">Score: {submitResult.scoreAwarded} / {submitResult.maxMarks}</div>
                                                            <div className="text-slate-300 mb-4">{submitResult.passedCount} / {submitResult.totalCases} cases passed</div>
                                                            <div className="space-y-1">
                                                                {(submitResult.results || []).map((r, i) => (
                                                                    <div key={i} className={`flex items-center gap-2 p-2 rounded ${r.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                                        <span>{r.passed ? '✓' : '✗'} Test Case {i+1}</span>
                                                                        {r.isHidden && <span className="text-xs text-slate-500">(Hidden)</span>}
                                                                        <span className="ml-auto text-xs text-slate-500">{r.time}s • {r.memory}KB</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Split>
                        </div>
                    </Split>
                )}
            </main>
        </div>
    );
};

export default TestTaker;
