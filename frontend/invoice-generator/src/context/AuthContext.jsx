import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const wipeAllStorage = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    };

    const checkAuthStatus = () => {
        try {
            // Look in BOTH places!
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');

            if (token && userStr && userStr !== "undefined" && userStr !== "null") {
                setUser(JSON.parse(userStr));
                setIsAuthenticated(true);
            } else {
                wipeAllStorage();
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Error reading auth storage:", error);
            wipeAllStorage();
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    // Receives rememberMe from Login.jsx
    const login = (userData, token, rememberMe) => {
        const storage = rememberMe ? localStorage : sessionStorage;
        
        // Clear everything first to prevent conflicts
        wipeAllStorage();

        storage.setItem('token', token);
        storage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        wipeAllStorage();
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/login';
    };

    const updateUser = (updatedData) => {
        const newUserData = { ...user, ...updatedData };
        // Figure out which storage they are currently using
        const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(newUserData));
        setUser(newUserData);
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;