// UserContext.js
import React, { createContext, useContext, useState, useEffect  } from 'react';

// Create the context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ uid: null });
  const [token, setToken] = useState(localStorage.getItem('accessToken') || null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    const storedToken = localStorage.getItem('accessToken');
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
    if (storedToken) {''
      setToken(storedToken);
    }
  }, []);

  const updateUser = (userData) => {
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
  };

  const updateToken = (accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser({});
    setToken(null);
  };

  return (
    <UserContext.Provider value={{ user, token, updateUser, updateToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user context
const useUser = () => useContext(UserContext);

export { UserContext, useUser }
