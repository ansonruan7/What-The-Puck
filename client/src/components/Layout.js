import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Layout.css';
import { useUser } from './UserContext';

function Layout({ children }) {
    const navigate = useNavigate();
    const navigateUserPortal = () => navigate('/AuthUser');

    const navigateCoachDashboard = () => navigate('/CoachDashboard');
    const navigatePlayerDashboard = () => navigate('/PlayerDashboard');
    const navigateAdminDashboard = () => navigate('/AdminDashboard');
    const navigateAverages = () => navigate('/Averages');
    const navigatePlayerComp = () => navigate('/PlayerComp');
    const navigateTeamComp = () => navigate('/TeamComp');
    const navigateTop = () => navigate('/Top');

    const { user } = useUser();

    return (
        <>
            <div className="h-screen w-[80%] bg-[#fdffff] drop-shadow-2xl m-auto">
                <h1 className='text-7xl font-orbitron font-bold text-center py-7 text-[#6bd4f8]'>
                    What The Puck?!
                </h1>

                <div className="nav-links">
                    {user && <a href="#" onClick={navigateUserPortal}>User Portal</a>}

                    {user?.role != null && (
                        <>
                            <a href="/profile">Profile</a>
                            <a href="#" onClick={navigatePlayerComp}>Player Comparisons</a>
                            <a href="#" onClick={navigateTeamComp}>Team Comparisons</a>
                            <a href="#" onClick={navigateTop}>Top Players/Teams</a>
                            <a href="#" onClick={navigatePlayerDashboard}>Player Dashboard</a>
                            <a href="#" onClick={navigateAverages}>Averages</a>
                        </>
                    )}

                    {(user?.role === 'Coach/Manager' || user?.role === 'Admin') && (
                        <>
                            <a href="#" onClick={navigateCoachDashboard}>Coach Dashboard</a>
                            <a href="#" onClick={navigateAverages}>Averages</a>
                        </>
                    )}

                    {user?.role === 'Admin' && (
                        <a href="#" onClick={navigateAdminDashboard}>Admin Dashboard</a>
                    )}
                </div>

                {!user && (
                    <div className="cartButtonStyle">
                        <a href="#" className="buttonTextStyle" onClick={() => navigate('/CreateAccount')}>
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
