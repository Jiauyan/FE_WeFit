// Profile.js
import React, { useState , useEffect} from 'react';
import { useUser } from "../../UseContext";
import axios from 'axios'; 
import { Typography, Paper, Avatar, Button } from "@mui/material";
import { Outlet } from 'react-router-dom';

export function Profile() {
    const [userData, setUserData] = useState([]);
    const { user , setUser} = useUser();
    const uid = user.uid;

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

    const handleEdit = () => {
        // Example edit action: Navigate or change state to edit mode
        // Update the user context as needed
        //updateUser({ ...user, name: "Edited Name" });
    };

  return (
    <>
    <Paper sx={{ width: 737, height: 788, m: 10 }}>
      <Avatar alt={userData.username} src="/static/images/avatar/1.jpg" />
      <Typography>{userData.username || "Loading..."}</Typography>
      <Typography>{userData.age || 0} years | {userData.height || 0} CM | {userData.weight || 0} KG</Typography>
      <Typography>Role: {userData.role || "Unknown"}</Typography>
      <Typography>Gender: {userData.gender || "Unknown"}</Typography>
      <Typography>Date of Birth: {userData.dateOfBirth || "Unknown"}</Typography>
      <Typography>Email: {userData.email || "Unknown"}</Typography>
      <Button onClick={handleEdit} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Edit
      </Button>
    </Paper>
    <Outlet/>
    </>
  );
}
