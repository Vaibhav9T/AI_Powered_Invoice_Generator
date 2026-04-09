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
  const [loading, setLoading] = useState(true);
  const[isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    
    try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
        }
      }
        catch (error) {
        console.error('Error checking auth status:', error);
        logout();
        }
        finally {
        setLoading(false);
        }
      
    };

 const login= (userData, tocken) => {
   localStorage.setItem('token', tocken);
   localStorage.setItem('user', JSON.stringify(userData));
   setUser(userData);
   setIsAuthenticated(true);
 };

 const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
 };


 const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    localStorage.setItem('user', JSON.stringify(newUserData));
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

  return(
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;