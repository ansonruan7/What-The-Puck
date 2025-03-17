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
