import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext'; // Import useUser hook
import Layout from './Layout';
import { Link, useNavigate } from 'react-router-dom';

const AuthUser = () => {
  const { user } = useUser(); // Get user data from context
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setLoading(false); // User is logged in, stop loading
    } else {
      setLoading(false); // No user found, stop loading
      navigate('/login'); // Optionally redirect to login if no user is found
    }
  }, [user, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Show loading message until we know if the user is logged in or not
  }

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
