import React, { useState , useEffect} from 'react';
import { useUser } from "../../UseContext";
import axios from 'axios'; 
import { Typography, Paper, Button } from "@mui/material";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

export function ViewTipStudent() {
    const [tipData, setTipData] = useState([]);
    const { user , setUser} = useUser();
    const uid = user.uid;
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state;

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
        axios.get(`http://localhost:3000/tips/getTipById/${id}`)
            .then(response => {
                setTipData(response.data); 
            })
            .catch(error => console.error('There was an error!', error));
    }, [user?.uid]); 


    const handleBack = async () => {
      navigate("/tips");
    }; 

  return (
    <>
    <Paper
      sx={{
        width: 737,
        height: 788,
        m: 10,
        p: 5, 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: 3, 
        borderRadius: 2, 
      }}
    >
      <Button
          fullWidth
          variant="contained"
          x={{ mt: 3, mb: 2 }}
          onClick={handleBack}
      >
        Back
      </Button>
      <Typography
        variant="h5" 
        sx={{ mb: 3 }}
      >
        {tipData.title}
      </Typography>
      {tipData.downloadUrl && (
        <img src={tipData.downloadUrl} alt={tipData.title} style={{ width: '100%', marginBottom: '20px' }} />
      )}
      <Typography
        sx={{ mb: 2 }}
      >
      {tipData.desc}
      </Typography>
    </Paper>
    <Outlet/>
    </>
  );
}
