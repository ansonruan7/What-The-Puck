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


    const handleLogin = async (e) => {
      e.preventDefault();
  
      if (!email || !password) {
          setInfo('Please enter both email and password.');
          return;
      }
  
      try {
          const response = await fetch('api/login', {  // Ensure full URL is used
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
          });
  
          const data = await response.json();
  
          if (response.ok && data.token) {
              localStorage.setItem('token', data.token);  // Store token
              loginUser(data.user, data.token);  // Store user data in context
              navigate('/AuthUser');  // Navigate to protected page
          } else {
              console.error("Login failed. No token received.");
              setInfo(data.message || 'Login failed, please try again.');
          }
      } catch (error) {
          console.error('Login request failed:', error);
          setInfo('Login failed. Please try again later.');
      }
  };

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
