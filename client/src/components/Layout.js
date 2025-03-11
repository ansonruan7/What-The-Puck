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
    const navigateAverages = () => navigate('/Averages');

    const { user, logoutUser } = useUser();

    const handleLogout = () => {
        logoutUser();
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <>
            <div className="h-screen w-[80%] bg-[#fdffff] drop-shadow-2xl m-auto">
                <h1 className='text-7xl font-orbitron font-bold text-center py-7 text-[#6bd4f8]'>
                    What The Puck?!
                </h1>

                <div className="nav-links">
                    <a href="#" onClick={navigateUserPortal}>User Portal</a>
                    <a href="#" onClick={navigateCoachDashboard}>Coach Dashboard</a>
                    <a href="#" onClick={navigatePlayerDashboard}>Player Dashboard</a> {/* Added Player Dashboard link */}
                    <a href="#" onClick={navigateAdminDashboard}>Admin Dashboard</a>
                    <a href='#' onClick={navigateAverages}>Averages</a>
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
        </>
    );
}

export default Layout;
