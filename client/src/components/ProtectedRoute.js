import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useUser();

    // 1️⃣ Wait for `user` to load before making a decision
    if (user === undefined) {
        return null; // Don't render anything yet
    }

    // 2️⃣ If no user is found, redirect to homepage
    if (!user) {
        console.warn("User not found. Redirecting...");
        return <Navigate to="/" replace />;
    }

    // 3️⃣ If user is not in the allowed roles, redirect
    if (!allowedRoles.includes(user.role)) {
        console.warn(`User role (${user.role}) not allowed. Redirecting...`);
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
