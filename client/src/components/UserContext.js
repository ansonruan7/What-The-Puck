import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load user from localStorage on initialization
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const loginUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Save user to localStorage
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('user'); // Remove user from localStorage
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
