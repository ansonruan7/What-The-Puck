import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useUser();

    // If the user is not logged in, redirect to the homepage
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // If the user's role is not in the allowedRoles, redirect to the homepage
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
