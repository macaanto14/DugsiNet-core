import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/Students/StudentList';
import StaffList from './pages/Staff/StaffList';
import AttendanceView from './pages/Attendance/AttendanceView';
import CurriculumList from './pages/Curriculum/CurriculumList';
import CourseForm from './pages/Curriculum/CourseForm';
import CourseDetail from './pages/Curriculum/CourseDetail';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Navigate to="/dashboard" />} />
      <Route path="/" element={<MainLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<StudentList />} />
        <Route path="staff" element={<StaffList />} />
        <Route path="attendance" element={<AttendanceView />} />
        <Route path="curriculum" element={<CurriculumList />} />
        <Route path="curriculum/courses/new" element={<CourseForm />} />
        <Route path="curriculum/courses/:id" element={<CourseDetail />} />
        <Route path="curriculum/courses/:id/edit" element={<CourseForm />} />
        <Route path="students/onboarding" element={<div className="p-8">Student Onboarding - Coming Soon</div>} />
        <Route path="students/profiles" element={<div className="p-8">Student Profiles - Coming Soon</div>} />
        <Route path="students/admissions" element={<div className="p-8">Student Admissions - Coming Soon</div>} />
        <Route path="staff/new" element={<div className="p-8">Add Staff - Coming Soon</div>} />
        <Route path="staff/schedule" element={<div className="p-8">Staff Schedule - Coming Soon</div>} />
        <Route path="attendance/reports" element={<div className="p-8">Attendance Reports - Coming Soon</div>} />
        <Route path="attendance/records" element={<div className="p-8">Attendance Records - Coming Soon</div>} />
        <Route path="curriculum/subjects" element={<div className="p-8">Subjects - Coming Soon</div>} />
        <Route path="curriculum/lessons" element={<div className="p-8">Lessons - Coming Soon</div>} />
        <Route path="results" element={<div className="p-8">Results - Coming Soon</div>} />
        <Route path="payments" element={<div className="p-8">Payments - Coming Soon</div>} />
        <Route path="finance/reports" element={<div className="p-8">Financial Reports - Coming Soon</div>} />
        <Route path="documents/id-cards" element={<div className="p-8">ID Cards - Coming Soon</div>} />
        <Route path="documents/certificates" element={<div className="p-8">Certificates - Coming Soon</div>} />
        <Route path="documents/reports" element={<div className="p-8">Document Reports - Coming Soon</div>} />
        <Route path="timetable" element={<div className="p-8">Timetable - Coming Soon</div>} />
        <Route path="exams" element={<div className="p-8">Exams - Coming Soon</div>} />
        <Route path="library" element={<div className="p-8">Library - Coming Soon</div>} />
        <Route path="fees" element={<div className="p-8">Fees - Coming Soon</div>} />
        <Route path="hostel" element={<div className="p-8">Hostel - Coming Soon</div>} />
        <Route path="transport" element={<div className="p-8">Transport - Coming Soon</div>} />
        <Route path="inventory" element={<div className="p-8">Inventory - Coming Soon</div>} />
        <Route path="payroll" element={<div className="p-8">Payroll - Coming Soon</div>} />
        <Route path="activities" element={<div className="p-8">Activities - Coming Soon</div>} />
        <Route path="settings" element={<div className="p-8">Settings - Coming Soon</div>} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;