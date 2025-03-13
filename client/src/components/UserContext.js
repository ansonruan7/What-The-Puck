import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(undefined); // Default to `undefined` while loading
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
                setUser(null);
            }
        } else {
            setUser(null); // Ensure `user` is `null` if nothing is found
        }
    }, []);

    // ✅ Login Function
    const loginUser = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('user', JSON.stringify(userData)); // ✅ Save user
        localStorage.setItem('authToken', authToken); // ✅ Save token
    };

    // ✅ Logout Function
    const logoutUser = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user'); // ✅ Remove user
        localStorage.removeItem('authToken'); // ✅ Remove token
    };

    return (
        <UserContext.Provider value={{ user, token, loginUser, logoutUser, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// ✅ Ensure only ONE context export
export const useUser = () => useContext(UserContext);
