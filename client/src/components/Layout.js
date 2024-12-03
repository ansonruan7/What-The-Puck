import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Layout.css';
import { useUser } from './UserContext';

function Layout({ children }) {
    const navigate = useNavigate();
    const navigateHome = () => navigate('/');
    const navigateCreateAccount = () => navigate('/CreateAccount');
    const navigateLogin = () => navigate('/Login');
    const navigateUserPortal = () => navigate('/AuthUser');

    // Temporary code for navigation
    const navigateCoachDashboard = () => navigate('/CoachDashboard');
    const navigatePlayerDashboard = () => navigate('/PlayerDashboard');  // Added Player Dashboard navigation
    const navigateAdminDashboard = () => navigate('/AdminDashboard');

    const { user, logoutUser } = useUser();

    const handleLogout = () => {
        logoutUser();
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="container">
            <h1>What The Puck?!</h1>

            <div className="nav-links">
                <a href="#" onClick={navigateHome}>Home</a>
                <a href="#" onClick={navigateUserPortal}>User Portal</a>
                {user ? (
                    <a href="#" onClick={handleLogout}>Logout</a>
                ) : (
                    <a href="#" onClick={navigateLogin}>Login</a>
                )}
                <a href="#" onClick={navigateCoachDashboard}>Coach Dashboard</a>
                <a href="#" onClick={navigatePlayerDashboard}>Player Dashboard</a> {/* Added Player Dashboard link */}
                <a href="#" onClick={navigateAdminDashboard}>Admin Dashboard</a>
            </div>

            {!user && (
                <div className="cartButtonStyle">
                    <a href="#" className="buttonTextStyle" onClick={navigateCreateAccount}>
                        Create Account
                    </a>
                </div>
            )}

            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

export default Layout;
