import React, { useState } from 'react';
import { useUser } from './UserContext'; // Import useUser hook
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Layout from './Layout';



const Login = () => {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [info, setInfo] = useState('');
    const { loginUser } = useUser(); // Access loginUser from context
    const navigate = useNavigate();


    const handleLogin = async(e) => {
        
    }



    return (
        <Layout>
        <div>
          <form onSubmit={handleLogin}>
          <label>Log In:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button type="submit">Login</button>
          </form>
          {info && <p>{info}</p>}
        </div>
        </Layout>
      );
};



export default Login;