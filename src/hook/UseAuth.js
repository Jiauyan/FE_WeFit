import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../UseContext';  // Adjust the path as necessary

export const useAuth = () => {
  const { token, logout, updateToken } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

    //   try {
    //     // Optionally, validate the token with the backend
    //     const response = await axios.post('http://localhost:3000/auth/validateToken', { token });
    //     if (response.data.valid) {
    //       // If the token is valid, optionally update it if needed
    //       // updateToken(response.data.newToken); // Example if your backend returns a new token
    //     } else {
    //       throw new Error('Invalid token');
    //     }
    //   } catch (error) {
    //     console.error('Token validation failed:', error);
    //     logout();
    //     navigate('/login');
    //   }
    };

    checkToken();
  }, [token, logout, navigate, updateToken]);

  return { token, logout, updateToken };
};
