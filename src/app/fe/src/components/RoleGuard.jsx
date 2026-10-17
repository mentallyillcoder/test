// src/app/fe/src/components/RoleGuard.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleGuard({ allowedRoles = [] }) {
  const { isAuthenticated, roles, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/unauthorized" replace />;
  }

  const isAuthorized =
    allowedRoles.length === 0 ||
    allowedRoles.some((role) => roles.includes(role.toUpperCase()));

  if (!isAuthorized) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}