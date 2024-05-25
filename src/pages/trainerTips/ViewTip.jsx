import React, { useState , useEffect} from 'react';
import { useUser } from "../../UseContext";
import axios from 'axios'; 
import { Typography, Paper, Avatar, Button } from "@mui/material";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { DeleteTip } from './DeleteTip';

export function ViewTip() {
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

    const handleEdit = async (id) => {
      navigate("/editTip", { state: { id: id } });
    }; 

    const handleBack = async () => {
      navigate("/trainerTips");
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
      <Button
        onClick={() => handleEdit(id)}
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 3 }}
      >
        Edit
      </Button>
      <DeleteTip id={id}/>
    </Paper>
    <Outlet/>
    </>
  );
}
