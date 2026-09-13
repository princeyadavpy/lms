import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OAuthCallback from './pages/auth/OAuthCallback';
import Landing from './pages/Landing';
import TestTaker from './pages/exam/TestTaker';

import StudentLayout from './pages/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentExams from './pages/student/StudentExams';
import StudentProfile from './pages/student/StudentProfile';
import MySubmissions from './pages/student/MySubmissions';

import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/Overview';
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

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return (
    <div className="flex h-screen items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <div className="hl-spinner mx-auto mb-3" style={{ width: '32px', height: '32px' }} />
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>HiGen Labs</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const rawBase = import.meta.env.BASE_URL || '/lms';
const basename = rawBase.endsWith('/') && rawBase !== '/' ? rawBase.slice(0, -1) : rawBase;

const App = () => {
  return (
    <AuthProvider>
      <Router basename={basename}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/oauth-callback" element={<OAuthCallback />} />

          <Route path="/exam/mock" element={<TestTaker />} />
          <Route path="/exam/:id" element={
            <PrivateRoute allowedRoles={['Student']}>
              <TestTaker />
            </PrivateRoute>
          } />

          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['Admin']}>
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route index element={<AdminOverview />} />
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
            <PrivateRoute allowedRoles={['Student']}>
              <StudentLayout />
            </PrivateRoute>
          }>
            <Route index element={<StudentDashboard />} />
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
