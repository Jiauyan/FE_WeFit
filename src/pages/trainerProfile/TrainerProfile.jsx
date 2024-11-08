import React, { useState , useEffect} from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios'; 
import { Typography, Paper, Avatar, Button, Grid, Box } from "@mui/material";
import { useNavigate, Outlet } from 'react-router-dom';
import { DeleteTrainerAccount } from './DeleteTrainerAccount';
import { GradientButton } from '../../contexts/ThemeProvider';

export function TrainerProfile() {
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
      navigate("/editTrainerProfile");
    }; 

  return (
    <>
    <Grid
      container
      component="main"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
        width: '100%'
      }}
    >
      <Paper sx={{
          width: { xs: '100%', sm: '90%', md: '80%', lg: '737px' }, // Responsive width
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          padding: 2,
          margin: 'auto' 
        }}>
        <Avatar
        alt={userData.username}
        src={userData.photoURL}
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
      <GradientButton
        onClick={handleEdit}
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3, mb: 3 }}
      >
        Edit
      </GradientButton>
      <DeleteTrainerAccount />
      </Paper>
    </Grid>
    <Outlet/>
    </>
  );
}
