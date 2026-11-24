import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OAuthCallback from './pages/auth/OAuthCallback';
import Landing from './pages/Landing';
import TestTaker from './pages/exam/TestTaker';
import companyLogo from './assets/company-logo.png';

import StudentLayout from './pages/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import CoursesPortal from './pages/student/CoursesPortal';
import CourseLearningView from './pages/student/CourseLearningView';
import LabsPortal from './pages/student/LabsPortal';
import QuizzesPortal from './pages/student/QuizzesPortal';
import AssessmentsPortal from './pages/student/AssessmentsPortal';
import MyProgress from './pages/student/MyProgress';
import StudentExams from './pages/student/StudentExams';
import StudentProfile from './pages/student/StudentProfile';
import MySubmissions from './pages/student/MySubmissions';

import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/Overview';
import AdminInstitutions from './pages/admin/AdminInstitutions';
import AdminBatches from './pages/admin/AdminBatches';
import AdminCourses from './pages/admin/AdminCourses';
import AdminUsers from './pages/admin/Users';
import AdminTests from './pages/admin/Tests';
import AdminSubmissions from './pages/admin/Submissions';
import AdminSettings from './pages/admin/Settings';

import TeacherLayout from './pages/teacher/TeacherLayout';
import TeacherOverview from './pages/teacher/TeacherOverview';
import CreateTest from './pages/teacher/CreateTest';
import MyTests from './pages/teacher/MyTests';
import LiveMonitor from './pages/teacher/LiveMonitor';
import AddQuestion from './pages/teacher/AddQuestion';
import TestQuestions from './pages/teacher/TestQuestions';

const LoadingScreen = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-[#070b14] relative overflow-hidden select-none">
    {/* Subtle ambient lighting */}
    <div className="absolute w-[450px] h-[450px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none -top-20 -left-20" />
    <div className="absolute w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none -bottom-20 -right-20" />

    <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-sm">
      {/* Branded Logo with soft ambient glow */}
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500/25 to-indigo-500/25 blur-md animate-pulse" />
        <div className="relative w-14 h-14 rounded-2xl bg-[#0b1222] border border-slate-800/80 p-2.5 shadow-xl flex items-center justify-center">
          <img src={companyLogo} alt="HiGen Labs" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Brand title */}
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-base font-black tracking-tight text-white">HiGen</span>
        <span className="text-base font-bold tracking-tight text-blue-400">Labs</span>
      </div>

      <p className="text-[12px] text-slate-400 font-medium mb-5">Learning & Examination Portal</p>

      {/* Sleek animated progress line */}
      <div className="w-44 h-1 bg-slate-800 rounded-full overflow-hidden relative">
        <div className="absolute inset-y-0 w-20 bg-slate-300 rounded-full animate-loader-bar" />
      </div>

      <p className="text-[11px] text-slate-500 mt-3 font-mono">Initializing workspace...</p>
    </div>
  </div>
);

const RootRedirect = () => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'Admin' || user.role === 'SuperAdmin' || user.role === 'InstitutionAdmin') {
    return <Navigate to="/admin" replace />;
  }
  if (user.role === 'Teacher' || user.role === 'Instructor' || user.role === 'Mentor') {
    return <Navigate to="/teacher" replace />;
  }
  return <Navigate to="/student" replace />;
};

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'Admin' || user.role === 'SuperAdmin' || user.role === 'InstitutionAdmin') {
      return <Navigate to="/admin" replace />;
    }
    if (user.role === 'Teacher' || user.role === 'Instructor' || user.role === 'Mentor') {
      return <Navigate to="/teacher" replace />;
    }
    return <Navigate to="/student" replace />;
  }
  return children;
};

const rawBase = import.meta.env.BASE_URL || '/lms';
const basename = rawBase.endsWith('/') && rawBase !== '/' ? rawBase.slice(0, -1) : rawBase;

const App = () => {
  return (
    <AuthProvider>
      <Router basename={basename}>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/oauth-callback" element={<OAuthCallback />} />

          <Route path="/exam/mock" element={<TestTaker />} />
          <Route path="/exam/:id" element={
            <PrivateRoute>
              <TestTaker />
            </PrivateRoute>
          } />

          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['Admin']}>
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route index element={<AdminOverview />} />
            <Route path="institutions" element={<AdminInstitutions />} />
            <Route path="batches" element={<AdminBatches />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="tests" element={<AdminTests />} />
            <Route path="submissions" element={<AdminSubmissions />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="/teacher" element={
            <PrivateRoute allowedRoles={['Teacher', 'Admin', 'Recruiter']}>
              <TeacherLayout />
            </PrivateRoute>
          }>
            <Route index element={<TeacherOverview />} />
            <Route path="create-test" element={<CreateTest />} />
            <Route path="my-tests" element={<MyTests />} />
            <Route path="tests/:testId/questions" element={<TestQuestions />} />
            <Route path="add-question" element={<AddQuestion />} />
            <Route path="monitor" element={<LiveMonitor />} />
            <Route path="submissions" element={<AdminSubmissions />} />
          </Route>

          <Route path="/student" element={
            <PrivateRoute allowedRoles={['Student', 'Admin', 'Teacher']}>
              <StudentLayout />
            </PrivateRoute>
          }>
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<CoursesPortal />} />
            <Route path="courses/:courseId/learn" element={<CourseLearningView />} />
            <Route path="labs" element={<LabsPortal />} />
            <Route path="labs/:labId" element={<LabsPortal />} />
            <Route path="quizzes" element={<QuizzesPortal />} />
            <Route path="assessments" element={<AssessmentsPortal />} />
            <Route path="progress" element={<MyProgress />} />
            <Route path="exams" element={<StudentExams />} />
            <Route path="submissions" element={<MySubmissions />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
