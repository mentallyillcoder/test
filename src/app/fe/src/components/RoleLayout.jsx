// src/app/fe/src/components/RoleLayout.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleLayout() {
  const { isAuthenticated, user, roles, login, logout, hasRole, mockLoginAs } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#1e293b', color: '#fff' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.25rem', textDecoration: 'none' }}>
            EduRecall
          </Link>

          {/* Menu cho Học viên (A1 - STUDENT) */}
          {hasRole('STUDENT') && (
            <>
              <Link to="/student/courses" style={{ color: '#cbd5e1', textDecoration: 'none' }}>My Learning</Link>
              <Link to="/student/flashcards" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Personal Flashcards</Link>
            </>
          )}

          {/* Menu cho Giáo viên (A2 - TEACHER) */}
          {hasRole('TEACHER') && (
            <>
              <Link to="/teacher/dashboard" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Manage Courses</Link>
              <Link to="/teacher/analytics" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Course Analytics</Link>
            </>
          )}

          {/* Menu cho Quản trị viên (A3 - ADMIN) */}
          {hasRole('ADMIN') && (
            <>
              <Link to="/admin/moderation" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Course Moderation</Link>
              <Link to="/admin/reports" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Violation Reports</Link>
              <Link to="/admin/users" style={{ color: '#cbd5e1', textDecoration: 'none' }}>User Management</Link>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Thanh chuyển nhanh vai trò khi dev local chưa bật Keycloak */}
          <div style={{ display: 'flex', gap: '0.25rem', marginRight: '1rem' }}>
            <button onClick={() => mockLoginAs('STUDENT')} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', cursor: 'pointer' }}>Dev: Student</button>
            <button onClick={() => mockLoginAs('TEACHER')} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', cursor: 'pointer' }}>Dev: Teacher</button>
            <button onClick={() => mockLoginAs('ADMIN')} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', cursor: 'pointer' }}>Dev: Admin</button>
          </div>

          {isAuthenticated ? (
            <>
              <span>{user?.displayName} ({roles.join(', ')})</span>
              <button onClick={logout} style={{ padding: '0.4rem 0.8rem', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <button onClick={login} style={{ padding: '0.4rem 0.8rem', cursor: 'pointer' }}>Login with Keycloak</button>
          )}
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.5rem 2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}