import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Layout.css';
import { useUser } from './UserContext';

function Layout ({children}) {
    const navigate = useNavigate();
    const navigateHome = () => navigate('/');
    const navigateCreateAccount = () => navigate('/CreateAccount');
    const navigateLogin =() => navigate('/Login');
    const navigateUserPortal =() => navigate('/AuthUser');



    const handleLogout = async() => {

    }

    return (
        <div className="container">
            <h1>What The Puck?!</h1>
            <div className='log-out'>
                <button onClick={handleLogout}>Log Out</button>
                </div>
            <div className="nav-links">
                <a href="#" onClick={navigateHome}>Home</a>
                <a href="#" onClick={navigateUserPortal}>User Portal</a>
                <a href="#" onClick={navigateLogin}>Log in</a>
            </div>
            <div className="cartButtonStyle">
                    <a href="#" className="buttonTextStyle" onClick={navigateCreateAccount}>
                        Create Account
                    </a>
                </div>
                <main className="main-content">
                {children}
            </main>
            </div>

        
    )
}

export default Layout;