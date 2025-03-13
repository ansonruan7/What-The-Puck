import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(undefined); // ⬅️ Default to `undefined` while loading
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');

        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (error) {
                console.error("Error parsing stored user:", error);
                localStorage.removeItem('user'); // Clear invalid data
            }
        } else {
            setUser(null); // Ensure that if nothing is found, we don't stay `undefined`
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, token, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
