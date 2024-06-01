import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import { useNavigate, Outlet } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Modal,
    TextField,
    Paper,
    Grid,
    IconButton
}from "@mui/material";
import { ArrowBackIos } from '@mui/icons-material';
import { GradientButton } from '../../contexts/ThemeProvider';

export function AddTip() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [tipImage, setTipImage] = useState(null);
  const [addTipStatus, setAddTipStatus] = useState('');
  const { user } = useUser();
  const uid = user.uid;
  const userImageUrl = user.data.downloadUrl;
  const username = user.data.username;

  const handleSubmit = async (e) => { 
    e.preventDefault();
    const formData = new FormData();
    formData.append('tipImage', tipImage); 
    formData.append('uid', uid);
    formData.append('title', title);
    formData.append('desc', desc);
    formData.append('shortDesc', shortDesc);
    formData.append('username', username);
    formData.append('userImageUrl', userImageUrl);

    try {
        const response = await axios.post('http://localhost:3000/tips/addTip', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log(response.data);
        
        setAddTipStatus(response.data.message);
        navigate("/trainerTips");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setAddTipStatus(error.response.data.message);
            } else {
                setAddTipStatus('An error occurred');
            }
        } else {
            setAddTipStatus('An unexpected error occurred');
        }
    }
};

    const handleBack = async () => {
        navigate(-1);
    }; 

  return (
    <Grid 
      container 
      component="main" 
      sx={{ 
        //height: '100vh', 
        // width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
    <Paper sx={{
        width: '737px', 
        height: 'auto', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)', 
        borderRadius: 2,
        padding: 4 
      }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
      <IconButton
        onClick={handleBack}
      >
        <ArrowBackIos />
      </IconButton>
    </Box>
    
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2 }} margin={1} >
                Add Your Sharing Tip
        </Typography>
                    <input
                        type="file"
                        onChange={(e) => setTipImage(e.target.files[0])}
                    />
                    <Box component="form" onSubmit={handleSubmit} sx={{  mt: 1,width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <TextField
                    required
                    margin="normal"
                    requiredrequired
                    fullWidth
                    name="tipTitle"
                    label="Sharing Tip Title"
                    id="tipTitle"
                    onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
                required
                margin="normal"
                fullWidth
                name="tipShortDesc"
                label="Sharing Tip Short Description"
                id="tipShortDesc"
                onChange={(e) => setShortDesc(e.target.value)}
                variant="outlined"  
                />
             <TextField
                required
                margin="normal"
                fullWidth
                name="tipFullDesc"
                label="Sharing Tip Full Description"
                id="tipFullDesc"
                onChange={(e) => setDesc(e.target.value)}
                multiline
                rows={20} 
                variant="outlined"  
                />
            <GradientButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
            >
                Add
            </GradientButton>
        </Box>
        </Paper>
        </Grid>
  );
}