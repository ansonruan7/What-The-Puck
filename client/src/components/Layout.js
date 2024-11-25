import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Layout.css';
import { useUser } from './UserContext';

function Layout ({children}) {
    const navigate = useNavigate();
    const navigateHome = () => navigate('/');

    return (
        <div className="container">
            <h1>What The Puck?!</h1>
            <div className="nav-links">
                <a href="#" onClick={navigateHome}>Home</a>
            </div>
                <main className="main-content">
                {children}
            </main>
            </div>

        
    )
}

export default Layout;