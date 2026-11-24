const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const Course = require('./models/Course');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const course = await Course.findOne({ code: 'SHU-PY-101' }).lean();
    console.log('Course Title:', course.title);
    console.log('Total Modules:', course.modules.length);
    course.modules.forEach((m, idx) => {
        const qCount = m.quiz?.questions?.length || 0;
        console.log(`Module ${idx + 1}: ${m.title} | ${m.lessons.length} Lessons | Quiz: ${m.quiz?.title} (${qCount} questions)`);
    });
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});

