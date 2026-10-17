// src/app/fe/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RoleLayout from './components/RoleLayout';
import RoleGuard from './components/RoleGuard';
import { LearningPage } from './pages/LearningPage';
import './App.css';

function HomePage() {
  return (
    <div>
      <h1>Welcome to EduRecall E-Learning Platform</h1>
      <p>Master sequential lessons with mandatory Flashcard tests (80% pass threshold).</p>
    </div>
  );
}

function ForbiddenPage() {
  return (
    <div>
      <h2>403 - Access Denied</h2>
      <p>You do not have permission to access this resource.</p>
    </div>
  );
}

function UnauthorizedPage() {
  return (
    <div>
      <h2>401 - Authentication Required</h2>
      <p>Please log in with your account to continue.</p>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RoleLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />

            {/* Student Routes (A1) */}
            <Route element={<RoleGuard allowedRoles={['STUDENT']} />}>
              <Route path="/student/courses" element={<LearningPage />} />
              <Route path="/student/flashcards" element={<div><h2>Personal Flashcard Sets</h2></div>} />
            </Route>

            {/* Teacher Routes (A2) */}
            <Route element={<RoleGuard allowedRoles={['TEACHER']} />}>
              <Route path="/teacher/dashboard" element={<div><h2>Teacher Course Management (Draft / Pending / Published)</h2></div>} />
              <Route path="/teacher/analytics" element={<div><h2>Course Enrollment & Completion Analytics</h2></div>} />
            </Route>

            {/* Admin Routes (A3) */}
            <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
              <Route path="/admin/moderation" element={<div><h2>Pending Course Moderation</h2></div>} />
              <Route path="/admin/reports" element={<div><h2>Student Violation Reports</h2></div>} />
              <Route path="/admin/users" element={<div><h2>User Account Management</h2></div>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;