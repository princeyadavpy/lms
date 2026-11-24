const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
const Course = require('./models/Course');

async function check() {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(uri);

    const courses = await Course.find({}, 'code title modules.title modules.quiz modules.lessons').lean();
    courses.forEach(c => {
        console.log(`\n=== [${c.code}] ${c.title} (Modules: ${c.modules?.length || 0}) ===`);
        c.modules?.forEach((m, i) => {
            const qCount = m.quiz?.questions?.length || 0;
            console.log(`  Module ${i + 1}: "${m.title}" -> Lessons: ${m.lessons?.length || 0} | Quiz Qs: ${qCount} | Quiz title: "${m.quiz?.title || 'None'}"`);
        });
    });
    await mongoose.disconnect();
}

check().catch(console.error);
