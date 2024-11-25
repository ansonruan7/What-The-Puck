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

    }

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
                <div className="role-buttons">
                    <label>Please Select One Role:</label>
                    <button onClick={() => setRole('Coach/Manager')}>Coach/Manager</button>
                    <button onClick={() => setRole('Player')}>Player</button>
                    <button onClick={() => setRole('Admin')}>Admin</button>
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

