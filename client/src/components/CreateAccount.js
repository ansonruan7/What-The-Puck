import React, {useState} from 'react';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';



const CreateAccount = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [info, setInfo] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();


    const handleSignup = async() => {
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, username: nickname, role }),
            });

            if (response.ok) {
                const responseData = await response.json();
                setInfo(responseData.message);
                console.log('Account Created Successfully:', responseData.message);

                
                
            } else {
                const errorData = await response.json();
                setInfo(errorData.message || 'An error occurred.');
                console.error('Error creating account:', errorData.message);
            }
        } catch (error) {
            console.error('Creation of Account Has Failed:', error);
            setInfo('Creation of Account Has Failed.');
        }
    };

    return (
        <Layout>
        <div className='auth-container'>
            <form>
                <h2>Create Account</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
                <div className="role-dropdown">
                    <label htmlFor="role-select">Please Select One Role:</label>
                    <select 
                        id="role-select" 
                        onChange={(e) => setRole(e.target.value)} 
                        defaultValue="" // Ensures no role is selected by default
                    >
                        <option value="" disabled>Select a role</option>
                        <option value="Coach/Manager">Coach/Manager</option>
                        <option value="Player">Player</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <br></br>
                <br></br>
                
                <button onClick={handleSignup}>Sign Up</button>
            </form>
        </div>
        <p>{info}</p>
    </Layout>
    
    )

}

export default CreateAccount;