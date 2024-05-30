// UserContext.js
import React, { createContext, useContext, useState, useEffect  } from 'react';
import { ApiTemplate } from '../api';
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

  const login = async (formData) => {
    const method = 'post'
    const route = `auth/loginAcc`

    const response = await ApiTemplate(method, route, formData)

    const uid = response.data.user.uid;
    const role = response.data.userRole;
    const token = {
      accessToken : response.data.user.stsTokenManager.accessToken,
      refreshToken : response.data.user.stsTokenManager.refreshToken,
    }
    localStorage.setItem('accessToken', token.accessToken);
    localStorage.setItem('refreshToken', token.refreshToken);
    updateUser({ uid, role }); 
  };

  const logout = async () => {
    const method = 'post'
    const route = `auth/logoutAccount`

    const response = await ApiTemplate(method, route)
    localStorage.removeItem('userData');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser({});
    setToken(null);
    return response
  };

  return (
    <UserContext.Provider value={{ user, token, updateUser, updateToken, logout, login }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user context
const useUser = () => useContext(UserContext);

export { UserContext, useUser }
