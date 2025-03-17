import { createContext, useContext, useState, useEffect } from 'react'; 

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        console.log("Loading user from localStorage..."); // Debugging
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setToken(storedToken);
                console.log("User Loaded:", parsedUser); // Debugging
            } catch (error) {
                console.error("Error parsing user from storage:", error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, [token]); // 🔹 Ensures update when token changes

    const loginUser = (userData, token) => {
        if (!token) {
            console.error("Auth Token is missing!"); // Debugging
            return;
        }
    
        console.log("Logging in user:", userData); // Debugging
        setUser(userData);
        setToken(token);
        localStorage.setItem('user', JSON.stringify(userData)); 
        localStorage.setItem('token', token); 
    };    

    const logoutUser = () => {
        console.log("Logging out..."); // Debugging
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
