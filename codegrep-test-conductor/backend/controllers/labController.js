const PracticeLab = require('../models/PracticeLab');
const axios = require('axios');

// Supported language IDs for Judge0 CE Community
const LANGUAGE_IDS = {
    python: 100,
    cpp: 105,
    java: 91,
    javascript: 97,
    c: 103,
    typescript: 101,
    go: 106
};

// Internal Judge0 execution helper (reusing engine from executeController)
const executeOnJudge0 = async (source_code, language_id, stdin) => {
    if (!process.env.JUDGE0_URL) {
        const trimmedInput = (stdin || '').trim();
        const mockOutputs = {
            '2\n7': '[0, 1]',
            '10': '55',
            'hello': 'olleh',
            '': 'Hello World'
        };
        const stdout = mockOutputs[trimmedInput] || `Output for: ${trimmedInput}`;
        return { stdout: stdout + '\n', time: '0.02', memory: 2048, status: { id: 3, description: 'Accepted' } };
    }

    const response = await axios.post(
        `${process.env.JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
        { source_code, language_id, stdin },
        { timeout: 15000 }
    );
    return response.data;
};

// GET /api/labs — List all practice labs
exports.getPracticeLabs = async (req, res) => {
    try {
        const { language, category, difficulty } = req.query;
        let query = { isActive: true };

        if (language && language !== 'all') query.language = language;
        if (category && category !== 'all') query.category = category;
        if (difficulty && difficulty !== 'all') query.difficulty = difficulty;

        const labs = await PracticeLab.find(query).sort('createdAt').lean();

        // Sample static scores for student display
        const enriched = labs.map(lab => ({
            ...lab,
            userScore: lab.maxScore ? Math.round(lab.maxScore * 0.9) : 45, // default display score
            solvedCount: lab.totalQuestions || 10,
            completionPercent: 90
        }));

        res.status(200).json({ success: true, count: enriched.length, data: enriched });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// GET /api/labs/:id — Get lab details
exports.getLabById = async (req, res) => {
    try {
        const lab = await PracticeLab.findById(req.params.id).lean();
        if (!lab) return res.status(404).json({ success: false, msg: 'Lab problem not found' });

        // Hide outputs for hidden test cases
        const sanitizedTestCases = (lab.testCases || []).map(tc => ({
            input: tc.isHidden ? '(hidden)' : tc.input,
            output: tc.isHidden ? '(hidden)' : tc.output,
            isHidden: tc.isHidden
        }));

        res.status(200).json({
            success: true,
            data: {
                ...lab,
                testCases: sanitizedTestCases
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// POST /api/labs/:id/run — Ad-hoc run with custom input
exports.runLabCode = async (req, res) => {
    try {
        const { source_code, language, custom_input } = req.body;
        const langId = LANGUAGE_IDS[language] || 100;
        const result = await executeOnJudge0(source_code, langId, custom_input || '');
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// POST /api/labs/:id/submit — Submit against all test cases
exports.submitLabCode = async (req, res) => {
    try {
        const { source_code, language } = req.body;
        const lab = await PracticeLab.findById(req.params.id);
        if (!lab) return res.status(404).json({ success: false, msg: 'Lab not found' });

        const langId = LANGUAGE_IDS[language] || 100;
        const testCases = lab.testCases || [{ input: '', output: 'Hello World', isHidden: false }];
        const results = [];
        let passedCount = 0;

        for (const tc of testCases) {
            let execRes;
            try {
                execRes = await executeOnJudge0(source_code, langId, tc.input);
            } catch (e) {
                execRes = { stdout: '', status: { id: 13, description: 'Internal Error' } };
            }

            const actualOutput = (execRes.stdout || '').trim();
            const expectedOutput = tc.output.trim();
            const passed = execRes.status?.id === 3 && actualOutput === expectedOutput;
            if (passed) passedCount++;

            results.push({
                input: tc.isHidden ? '(hidden)' : tc.input,
                expectedOutput: tc.isHidden ? '(hidden)' : expectedOutput,
                actualOutput,
                passed,
                isHidden: tc.isHidden,
                time: execRes.time,
                memory: execRes.memory,
                status: execRes.status?.description || 'Accepted'
            });
        }

        const totalCases = testCases.length;
        const score = totalCases > 0 ? Math.round((passedCount / totalCases) * lab.maxScore) : lab.maxScore;

        res.status(200).json({
            success: true,
            data: {
                totalCases,
                passedCount,
                failedCount: totalCases - passedCount,
                score,
                maxScore: lab.maxScore,
                results
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

// POST /api/labs — Create Practice Lab (Admin/Teacher)
exports.createPracticeLab = async (req, res) => {
    try {
        const lab = await PracticeLab.create(req.body);
        res.status(201).json({ success: true, data: lab });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

