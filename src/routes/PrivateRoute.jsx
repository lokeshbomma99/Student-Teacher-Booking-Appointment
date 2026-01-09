import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard if role doesn't match
    if (userRole === 'admin') return <Navigate to="/admin" />;
    if (userRole === 'teacher') return <Navigate to="/teacher" />;
    if (userRole === 'student') return <Navigate to="/student" />;
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
