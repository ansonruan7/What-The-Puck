import React from 'react'
import logo from '../assets/logo.png'

import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext'

function Navbar() {
    const navigate = useNavigate();
        const navigateHome = () => navigate('/');
        const navigateCreateAccount = () => navigate('/CreateAccount');
        const navigateLogin = () => navigate('/Login');
        const navigateUserPortal = () => navigate('/AuthUser');

        const { user, logoutUser } = useUser();
        
        const handleLogout = () => {
            logoutUser();
            localStorage.removeItem('token');
            navigate('/login');
        };

        return (
            <div className='w-full bg-[#343434] p-2 text-white flex items-center justify-between'>
                <img src={logo} className='w-12 h-12'/>
                <ul className='flex justify-end gap-4'>
                    
                    <a className='hover:bg-[#3c3b3b]' href='#' onClick={navigateHome}><li>Home</li></a>         
                    <a className='hover:bg-[#3c3b3b]' href='#' onClick={()=>{}}><li>About</li></a> 
                    <a className='hover:bg-[#3c3b3b]' href='#' onClick={()=>{}}><li>Dashboard</li></a> 
                    <li>{user ? (
                        <a href="#" onClick={handleLogout}>Logout</a>
                    ) : (
                        <a href="#" onClick={navigateLogin}>Login</a>
                    )}</li>          
                </ul>
            </div>
        )
}

export default Navbar