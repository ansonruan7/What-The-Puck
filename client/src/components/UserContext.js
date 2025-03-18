import { createContext, useContext, useState, useEffect } from 'react'; 

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setToken(storedToken);
            } catch (error) {
                console.error("Error parsing user from storage:", error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, [token]); // 🔹 Ensures update when token changes

    const loginUser = (userData, token) => {
        if (!token) {
            return;
        }
    
        setUser(userData);
        setToken(token);
        localStorage.setItem('user', JSON.stringify(userData)); 
        localStorage.setItem('token', token); 
    };    

    const logoutUser = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <UserContext.Provider value={{ user, token, loginUser, logoutUser, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
