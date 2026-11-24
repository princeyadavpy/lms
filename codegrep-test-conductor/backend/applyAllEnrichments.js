const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env') });
const Course = require('./models/Course');

const part1 = require('./enrichedContentData');
const part2 = require('./enrichedContentDataPart2');
const part3 = require('./enrichedContentDataPart3');
const allEnrichments = { ...part1, ...part2, ...part3 };

// Extract raw modules from seedFullPythonSyllabus.js
let code = fs.readFileSync(path.join(__dirname, 'seedFullPythonSyllabus.js'), 'utf8');
code = code.replace('async function seedFullCurriculum()', 'async function dummy()');
code = code.replace('seedFullCurriculum();', '');
code += '\nmodule.exports = fullPythonModules;';
fs.writeFileSync(path.join(__dirname, 'tempFullModules.js'), code);

const rawModules = require('./tempFullModules.js');
try { fs.unlinkSync(path.join(__dirname, 'tempFullModules.js')); } catch(e){}

console.log(`Loaded ${rawModules.length} modules from seedFullPythonSyllabus.js`);
console.log(`Loaded ${Object.keys(allEnrichments).length} enrichment packages.`);

let updatedLessonsCount = 0;

rawModules.forEach((m) => {
    m.lessons.forEach((l) => {
        const key = `${m.orderIndex}-${l.orderIndex}`;
        const enrichment = allEnrichments[key];
        if (enrichment) {
            if (enrichment.content) {
                l.content = enrichment.content;
            }
            if (enrichment.codeSnippets) {
                l.codeSnippets = enrichment.codeSnippets;
            }
            if (enrichment.aiSummary) {
                l.aiSummary = enrichment.aiSummary;
            }
            updatedLessonsCount++;
        }
    });
});

console.log(`Successfully mapped and enriched ${updatedLessonsCount} lessons across all modules.`);

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function runUpdate() {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected successfully!');

        const updated = await Course.findOneAndUpdate(
            { code: 'SHU-PY-101' },
            {
                title: 'Python Programming Masterclass',
                code: 'SHU-PY-101',
                category: 'PYTHON',
                level: 'Beginner',
                description: 'Comprehensive 12-module Python curriculum covering foundational syntax, control flow, data structures, OOP, multithreading, database access, and data science with NumPy, Pandas, and Matplotlib.',
                estimatedTotalHours: 54,
                modules: rawModules
            },
            { new: true, upsert: true }
        );

        console.log(`\n========================================`);
        console.log(`COURSE UPDATED SUCCESSFULLY IN DATABASE!`);
        console.log(`Title: ${updated.title}`);
        console.log(`Modules: ${updated.modules.length}`);
        
        // Audit after update
        let missingAi = 0;
        let missingSnip = 0;
        let totalL = 0;
        updated.modules.forEach(m => {
            m.lessons.forEach(l => {
                totalL++;
                if (!l.aiSummary || !l.aiSummary.summary) missingAi++;
                if (!l.codeSnippets || l.codeSnippets.length === 0) missingSnip++;
            });
        });

        console.log(`Total Lessons: ${totalL}`);
        console.log(`Missing AI Summaries: ${missingAi}`);
        console.log(`Missing Code Snippets: ${missingSnip}`);
        console.log(`========================================\n`);

        process.exit(0);
    } catch (err) {
        console.error('Error applying enrichments to MongoDB:', err);
        process.exit(1);
    }
}

runUpdate();

