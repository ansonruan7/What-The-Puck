import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useUser();

    // Wait for `user` to load before making a decision
    if (user === undefined) {
        return null; // Don't render anything yet
    }

    // If no user is found, redirect to homepage
    if (!user) {
        console.warn("User not found. Redirecting...");
        return <Navigate to="/" replace />;
    }

    // Ensure user has a verified role
    if (!user.role_verified) {
        console.warn("User role is not verified. Redirecting...");
        return <Navigate to="/" replace />;
    }

    // Check if the user has the required role
    if (!allowedRoles.includes(user.role)) {
        console.warn(`User role (${user.role}) not allowed. Redirecting...`);
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
