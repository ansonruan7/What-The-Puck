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
            const token = localStorage.getItem('token'); 
            if (!token) {
                setMessage('Not authenticated.');
                return;
            }
    
            const response = await fetch('http://localhost:5000/api/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email, username, password }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setMessage('Profile updated successfully.');
                const updatedUser = { ...user, email, username };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            } else {
                setMessage(data.message || 'Error updating profile.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Failed to update profile.');
        }
    };                    

    return (
        <Layout>
            <div className="profile-container p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
                {/* Info Section */}
                <div className="info-section bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-3">Info</h2>
                    <p><strong>Role:</strong> {user?.role}</p>
                    <p><strong>Team:</strong> {user?.team}</p>
                    <p><strong>Games Played:</strong> {user?.games}</p>
                    <p><strong>Goals:</strong> {user?.goals}</p>
                    <p><strong>Assists:</strong> {user?.assists}</p>
                    <p><strong>Faceoff Wins:</strong> {user?.faceoff_wins}</p>
                </div>

                {/* Account Section */}
                <div className="account-section bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-3">Account</h2>

                    <div className="form-group">
                        <label className="block font-medium">Email:</label>
                        <input 
                            type="email" 
                            className="w-full p-2 border rounded"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>

                    <div className="form-group mt-3">
                        <label className="block font-medium">Username:</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border rounded"
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </div>

                    <div className="form-group mt-3">
                        <label className="block font-medium">New Password (optional):</label>
                        <input 
                            type="password" 
                            className="w-full p-2 border rounded"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    <div className="form-group mt-3">
                        <label className="block font-medium">Confirm Password:</label>
                        <input 
                            type="password" 
                            className="w-full p-2 border rounded"
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                        />
                    </div>

                    {/* Update Button */}
                    <button 
                        className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        onClick={handleUpdateProfile}
                    >
                        Update Profile
                    </button>

                    {message && <p className="text-center mt-2 text-red-500">{message}</p>}
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
