import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { useUser } from './UserContext';

const Profile = () => {
    const { user, setUser } = useUser();
    const [email, setEmail] = useState(user?.email || '');
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setEmail(user.email);
            setUsername(user.username);
        }
    }, [user]);

    const handleUpdateProfile = async () => {
        if (password && password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('/api/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Ensure correct token key
                },
                body: JSON.stringify({ email, username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Profile updated successfully.');
                setUser((prev) => ({ ...prev, email, username })); // Update local user data
            } else {
                setMessage(data.message || 'Error updating profile.');
            }
        } catch (error) {
            setMessage('Failed to update profile.');
        }
    };

    return (
        <Layout>
            <div className="profile-container">
                <h2>Profile</h2>
                <p><strong>Role:</strong> {user?.role}</p>
                <p><strong>Team:</strong> {user?.team}</p>
                <p><strong>Games Played:</strong> {user?.games}</p>
                <p><strong>Goals:</strong> {user?.goals}</p>
                <p><strong>Assists:</strong> {user?.assists}</p>
                <p><strong>Faceoff Wins:</strong> {user?.faceoff_wins}</p>

                {/* Editable Fields */}
                <div className="form-group">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>

                <div className="form-group">
                    <label>Username:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>

                <div className="form-group">
                    <label>New Password (optional):</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>

                <div className="form-group">
                    <label>Confirm Password:</label>
                    <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                </div>

                <button onClick={handleUpdateProfile}>Update Profile</button>

                {message && <p>{message}</p>}
            </div>
        </Layout>
    );
};

export default Profile;
