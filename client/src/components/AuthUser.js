import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext'; // Import useUser hook
import Layout from './Layout';
import { Link } from 'react-router-dom';



const AuthUser = () => {
    const { user } = useUser(); // Get user data from context
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      if (user) {
        setLoading(false);
      }
    }, [user]);
  
    
  
    if (!user) {
      return (
        <div>
          <p>You must be logged in to view this page.</p>
          <Link to="/">Go back to Home</Link>
          {/* Optionally, you could redirect the user to the login page */}
        </div>
      );
    }
  
    return (
      <Layout>
        <h2>Welcome, {user.email}!</h2> {/* Display user info */}
      </Layout>
    );
  };
  
  export default AuthUser;