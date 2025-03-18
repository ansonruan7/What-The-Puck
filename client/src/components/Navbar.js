import React from 'react'; 
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useUser } from './UserContext';

function Navbar() {
    const navigate = useNavigate();
    const { user, logoutUser } = useUser();

    const handleLogout = () => {
        logoutUser();
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="w-full bg-[#343434] p-4 text-white flex items-center justify-between shadow-md">
            {/* Logo and Home Button */}
            <div className="flex items-center gap-4">
                <img src={logo} alt="Logo" className="w-12 h-12" />
                <button onClick={() => navigate('/')} className="text-lg font-semibold hover:text-gray-300">
                    Home
                </button>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-6">
                {user ? (
                    user.role_verified ? (
                        <>
                            <button onClick={() => navigate('/AuthUser')} className="hover:text-gray-300">
                                User Portal
                            </button>
                            <button onClick={() => navigate('/PlayerComp')} className="hover:text-gray-300">
                                Player Comparisons
                            </button>
                            <button onClick={() => navigate('/TeamComp')} className="hover:text-gray-300">
                                Team Comparisons
                            </button>
                            <button onClick={() => navigate('/Top')} className="hover:text-gray-300">
                                Top Players/Teams
                            </button>
                            <button onClick={() => navigate('/PlayerDashboard')} className="hover:text-gray-300">
                                Player Dashboard
                            </button>
                            <button onClick={() => navigate('/Averages')} className="hover:text-gray-300">
                                Averages
                            </button>

                            {(user.role === 'Coach/Manager' || user.role === 'Admin') && (
                                <>
                                    <button onClick={() => navigate('/CoachDashboard')} className="hover:text-gray-300">
                                        Coach Dashboard
                                    </button>
                                    <button onClick={() => navigate('/Averages')} className="hover:text-gray-300">
                                        Averages
                                    </button>
                                </>
                            )}

                            {user.role === 'Admin' && (
                                <button onClick={() => navigate('/AdminDashboard')} className="hover:text-gray-300">
                                    Admin Dashboard
                                </button>
                            )}
                        </>
                    ) : (
                        <p className="text-red-500 font-semibold">Access limited until role is verified</p>
                    )
                ) : null}

                {/* Login/Logout Section */}
                <div className="ml-6">
                    {user ? (
                        <button 
                            onClick={handleLogout} 
                            className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <button onClick={() => navigate('/Login')} className="hover:text-gray-300">
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
