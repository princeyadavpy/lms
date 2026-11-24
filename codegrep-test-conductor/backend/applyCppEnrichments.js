const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
const Course = require('./models/Course');

const part1 = require('./enrichedCppContentDataPart1');
const part2 = require('./enrichedCppContentDataPart2');
const part3 = require('./enrichedCppContentDataPart3');

const allCppEnrichments = { ...part1, ...part2, ...part3 };
console.log(`Loaded ${Object.keys(allCppEnrichments).length} C++ topic enrichment packages.`);

const MONGODB_URI = process.env.LOCAL_MONGO_URI || 'mongodb://localhost:27017/higenlabs';

async function runCppEnrichment() {
    try {
        console.log('Connecting to MongoDB...', MONGODB_URI);
        try {
            await mongoose.connect(MONGODB_URI);
        } catch (e) {
            console.warn('Local connection attempt failed, trying Atlas URI...', e.message);
            const atlasUri = process.env.MONGO_URI || process.env.MONGODB_URI;
            await mongoose.connect(atlasUri);
        }
        console.log('MongoDB Connected successfully!');

        const course = await Course.findOne({ code: 'CPP-OOP-201' });
        if (!course) {
            console.error("Course with code 'CPP-OOP-201' not found!");
            process.exit(1);
        }

        console.log(`Found C++ Course: "${course.title}" with ${course.modules.length} modules.`);
        let enrichedCount = 0;

        course.modules.forEach((mod) => {
            mod.lessons.forEach((les) => {
                const key = `${mod.orderIndex}-${les.orderIndex}`;
                const enrichment = allCppEnrichments[key];
                if (enrichment) {
                    if (enrichment.content) {
                        les.content = enrichment.content;
                    }
                    if (enrichment.codeSnippets) {
                        les.codeSnippets = enrichment.codeSnippets;
                    }
                    if (enrichment.aiSummary) {
                        les.aiSummary = enrichment.aiSummary;
                    }
                    enrichedCount++;
                } else {
                    console.warn(`No enrichment found for key: ${key} (${les.title})`);
                }
            });
        });

        course.markModified('modules');
        await course.save();

        console.log(`Successfully enriched ${enrichedCount} of 40 C++ lessons in MongoDB!`);
        process.exit(0);
    } catch (err) {
        console.error('Error applying C++ enrichments:', err);
        process.exit(1);
    }
}

runCppEnrichment();

