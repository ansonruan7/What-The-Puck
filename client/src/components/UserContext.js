import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null); // Track the token

    // Load user and token from localStorage on initialization
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken'); // Get token from localStorage

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser)); // Set user data
            setToken(storedToken); // Set token
        }
    }, []);

    // Login user with both user data and token
    const loginUser = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('user', JSON.stringify(userData)); // Save user to localStorage
        localStorage.setItem('authToken', authToken); // Save token to localStorage
    };

    // Logout user and remove user and token from localStorage
    const logoutUser = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user'); // Remove user from localStorage
        localStorage.removeItem('authToken'); // Remove token from localStorage
    };

    return (
        <UserContext.Provider value={{ user, token, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
