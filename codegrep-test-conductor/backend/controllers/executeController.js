const axios = require('axios');
const Question = require('../models/Question');

// ─────────────────────────────────────────────────────────────────
// Language ID map — Judge0 CE Community API (https://ce.judge0.com)
// Popular coding assessment languages only
// ─────────────────────────────────────────────────────────────────
const LANGUAGE_IDS = {
    python:     100,  // Python (3.12.5)         — most popular
    cpp:        105,  // C++ (GCC 14.1.0)        — competitive programming
    java:        91,  // Java (JDK 17.0.6)       — interviews
    javascript:  97,  // JavaScript (Node 20)    — web/frontend
    c:          103,  // C (GCC 14.1.0)          — systems/DS
    typescript: 101,  // TypeScript (5.6.2)      — modern JS
    go:         106,  // Go (1.22.0)             — backend/cloud
};

// ─────────────────────────────────────────────────────────────────
// Utility: call Judge0 for one submission
// ─────────────────────────────────────────────────────────────────
const executeOnJudge0 = async (source_code, language_id, stdin) => {
    if (!process.env.JUDGE0_URL) {
        // Mock simulation when no Judge0 configured
        const trimmedInput = (stdin || '').trim();
        const mockOutputs = { '2\n7': '[0,1]', '': 'Hello World' };
        const stdout = mockOutputs[trimmedInput] || `Mock Output for input: ${trimmedInput}`;
        return { stdout: stdout + '\n', time: '0.01', memory: 2048, status: { id: 3, description: 'Accepted' } };
    }

    const response = await axios.post(
        `${process.env.JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
        { source_code, language_id, stdin },
        { timeout: 15000 }
    );
    return response.data;
};

// ─────────────────────────────────────────────────────────────────
// GET /api/execute/health  — Judge0 connectivity check
// ─────────────────────────────────────────────────────────────────
exports.healthCheck = async (req, res) => {
    if (!process.env.JUDGE0_URL) {
        return res.status(200).json({
            success: true,
            mode: 'mock',
            message: 'Running in mock mode (no JUDGE0_URL set)'
        });
    }
    const start = Date.now();
    try {
        const langRes = await axios.get(`${process.env.JUDGE0_URL}/languages`, { timeout: 6000 });
        const latency = Date.now() - start;
        const languages = langRes.data?.slice(0, 10) ?? [];
        return res.status(200).json({
            success: true,
            mode: 'judge0',
            url: process.env.JUDGE0_URL,
            latencyMs: latency,
            totalLanguages: langRes.data?.length ?? 0,
            sampleLanguages: languages.map(l => ({ id: l.id, name: l.name }))
        });
    } catch (err) {
        return res.status(503).json({
            success: false,
            mode: 'judge0',
            url: process.env.JUDGE0_URL,
            error: err.message,
            hint: 'Judge0 may be down or unreachable. Check JUDGE0_URL in .env'
        });
    }
};

// ─────────────────────────────────────────────────────────────────
// POST /api/execute/run  — Ad-hoc single run against first test case
// ─────────────────────────────────────────────────────────────────
exports.runCode = async (req, res) => {
    try {
        const { source_code, language_id, stdin } = req.body;
        const result = await executeOnJudge0(source_code, language_id, stdin);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Execution engine failed to respond' });
    }
};

// ─────────────────────────────────────────────────────────────────
// POST /api/execute/submit  — Run against all test cases of a question
// Returns: per-case results + total passed + score awarded
// ─────────────────────────────────────────────────────────────────
exports.submitCode = async (req, res) => {
    try {
        const { source_code, language_id, questionId } = req.body;

        if (!source_code || !language_id || !questionId) {
            return res.status(400).json({ success: false, msg: 'source_code, language_id and questionId are required' });
        }

        const question = await Question.findById(questionId);
        if (!question) return res.status(404).json({ success: false, msg: 'Question not found' });
        if (question.type !== 'Coding') {
            return res.status(400).json({ success: false, msg: 'submitCode is only valid for Coding questions' });
        }

        const results = [];
        let passedCount = 0;

        for (const tc of question.testCases) {
            let executionResult;
            try {
                executionResult = await executeOnJudge0(source_code, language_id, tc.input);
            } catch (e) {
                executionResult = { stdout: '', status: { id: 13, description: 'Internal Error' } };
            }

            const statusId = executionResult.status?.id;
            const statusDesc = executionResult.status?.description || 'Unknown';
            const actualOutput = (executionResult.stdout || '').trim();
            const expectedOutput = tc.output.trim();
            // Only Judge0 status 3 = 'Accepted' can pass
            const passed = statusId === 3 && actualOutput === expectedOutput;
            if (passed) passedCount++;

            results.push({
                input: tc.isHidden ? '(hidden)' : tc.input,
                expectedOutput: tc.isHidden ? '(hidden)' : expectedOutput,
                actualOutput,
                passed,
                isHidden: tc.isHidden,
                time: executionResult.time,
                memory: executionResult.memory,
                statusId,
                statusDescription: statusDesc,
                compileOutput: executionResult.compile_output || null,
                stderr: executionResult.stderr || null,
            });
        }

        const totalCases = question.testCases.length;
        const scoreAwarded = totalCases > 0
            ? Math.round((passedCount / totalCases) * question.marks)
            : 0;

        res.status(200).json({
            success: true,
            data: { questionId, totalCases, passedCount, failedCount: totalCases - passedCount, scoreAwarded, maxMarks: question.marks, results }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: err.message });
    }
};
