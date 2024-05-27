import React, { useState , useEffect} from 'react';
import { useUser } from "../../UseContext";
import axios from 'axios'; 
import { Typography, Paper, Avatar, Button } from "@mui/material";
import { useNavigate, Outlet } from 'react-router-dom';
import { DeleteAccount } from './DeleteAccount';

export function Profile() {
    const [userData, setUserData] = useState([]);
    const { user , setUser} = useUser();
    const uid = user.uid;
    const navigate = useNavigate();

    useEffect(() => {
      // Load user ID from local storage or other persistent storage
      const storedUid = localStorage.getItem('uid');
      if (storedUid) {
          setUser({ ...user, uid: storedUid });
      }
  }, []);

    useEffect(() => {
        const uid = user?.uid;
        if (!uid) return;
        axios.get(`http://localhost:3000/auth/getUserById/${uid}`)
            .then(response => {
                setUserData(response.data); 
            })
            .catch(error => console.error('There was an error!', error));
    }, [user?.uid]); 

    const handleEdit = async () => {
      navigate("/editProfile");
    }; 

  return (
    <>
    <Paper sx={{
    width: 737,
    height: 'auto', // Adjust height based on content
    m: 10,
    p: 3, // Consistent padding
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    borderRadius: 2 // Soft rounded corners
    }}>
    <Avatar
        alt={userData.username}
        src={userData.downloadUrl}
        sx={{ width: 200, height: 200, mb: 3 }} 
    />
    <Typography
        variant="h5" 
        sx={{ mb: 3 }}
    >
        {userData.username}
    </Typography>
    <Typography
        sx={{ mb: 3, color: 'text.secondary' }} 
    >
        {userData.age} years | {userData.height} CM | {userData.weight} KG
    </Typography>
    <Typography
        sx={{ mb: 2 }}
    >
        Role: {userData.role}
    </Typography>
    <Typography
        sx={{ mb: 2 }}
    >
        Gender: {userData.gender}
    </Typography>
    <Typography
        sx={{ mb: 2 }}
    >
        Email: {userData.email}
    </Typography>
    <Button
        onClick={handleEdit}
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3, mb: 3 }}
    >
        Edit
    </Button>
    <DeleteAccount />
    </Paper>
    <Outlet/>
    </>
  );
}
