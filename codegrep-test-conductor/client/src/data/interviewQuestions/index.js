import { cInterviewQuestions } from './cInterviewQuestions';
import { cppInterviewQuestions } from './cppInterviewQuestions';
import { pythonInterviewQuestions } from './pythonInterviewQuestions';
import { dsaInterviewQuestions } from './dsaInterviewQuestions';

export { cInterviewQuestions, cppInterviewQuestions, pythonInterviewQuestions, dsaInterviewQuestions };

export function getQuestionsForCourseAndModule({
    courseCode = '',
    courseTitle = '',
    courseCategory = '',
    moduleIndex = 1
}) {
    const code = (courseCode || '').toUpperCase();
    const title = (courseTitle || '').toLowerCase();
    const cat = (courseCategory || '').toUpperCase();

    const isDsa = cat === 'DSA' || code.includes('DSA') || title.includes('dsa') || title.includes('data structure') || title.includes('algorithm');
    const isCpp = !isDsa && (cat === 'C++' || code.includes('CPP') || title.includes('c++'));
    const isC = !isDsa && !isCpp && (
        cat === 'C' ||
        (code.startsWith('C-') && !code.startsWith('CPP-')) ||
        title.includes('c systems') ||
        title.includes('programming in c') ||
        code === 'C-SYS-101'
    );
    const isPython = !isDsa && (code.includes('PY') || title.includes('python') || cat === 'PYTHON');

    let courseName = 'Python';
    let questionBank = pythonInterviewQuestions;
    let maxModules = 12;

    if (isDsa) {
        courseName = 'Data Structures & Algorithms';
        questionBank = dsaInterviewQuestions;
        maxModules = 9;
    } else if (isCpp) {
        courseName = 'C++';
        questionBank = cppInterviewQuestions;
        maxModules = 9;
    } else if (isC) {
        courseName = 'C';
        questionBank = cInterviewQuestions;
        maxModules = 11;
    } else if (isPython) {
        courseName = 'Python';
        questionBank = pythonInterviewQuestions;
        maxModules = 12;
    }

    const safeIndex = Math.min(Math.max(1, Number(moduleIndex) || 1), maxModules);
    const moduleData = questionBank[safeIndex] || questionBank[1] || { moduleTitle: `Module ${safeIndex}`, questions: [], topics: [] };

    return {
        courseName,
        moduleIndex: safeIndex,
        moduleTitle: moduleData.moduleTitle,
        topics: moduleData.topics || [],
        questions: moduleData.questions || [],
        totalQuestions: (moduleData.questions || []).length
    };
}

