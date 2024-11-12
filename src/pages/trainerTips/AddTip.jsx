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
    IconButton,
    Input,
}from "@mui/material";
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import Edit from '@mui/icons-material/Edit';
import CloudUpload from '@mui/icons-material/CloudUpload';
import { GradientButton } from '../../contexts/ThemeProvider';

export function AddTip() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [tipImage, setTipImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [addTipStatus, setAddTipStatus] = useState('');
  const { user } = useUser();
  const uid = user.uid;
  const userImageUrl = user?.data?.photoURL;
  const username = user?.data?.username;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTipImage(file);

      // Read the file and set the preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            <IconButton onClick={handleBack}>
              <ArrowBackIos />
            </IconButton>
          </Box>
        
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            Add Your Sharing Tip
          </Typography>
          {!previewUrl && (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  border: '1px solid #c4c4c4',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', // Ensuring it's visually noticeable
                }}
              >
                <label htmlFor="icon-button-file" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Input id="icon-button-file" type="file" onChange={handleFileChange} sx={{ display: 'none' }}/>
                  <IconButton
                    color="gray"
                    aria-label="upload picture"
                    component="span"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                  >
                    <CloudUpload sx={{fontSize: 70}}/>
                  </IconButton>
                  <Typography
                    variant="body1"
                    sx={{
                      mt: 1,
                      color: '#686868',
                      textAlign: 'center',
                      width: '100%' // Ensure it spans the full width to center text properly
                    }}
                  >
                    Upload Sharing Tip Image
                  </Typography>
                </label>
              </Box>
            )}
          {previewUrl && (
            <Box sx={{
              position: 'relative',  // Ensures the positioning context for the IconButton
              width: '100%',
                  height: '350px',
                  objectFit: 'cover',
                  borderRadius: 8     // Fixed height for consistency
            }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '350px',
                  objectFit: 'cover',
                  borderRadius: 8
                }}
              />
              <label htmlFor="icon-button-file">
              <Input id="icon-button-file" type="file" onChange={handleFileChange} sx={{display: 'none'}}/>
              <IconButton
                color="primary"
                aria-label="edit picture"
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: 8,             // Adjust top position here
                  right: 8,           // Adjust right position here
                  backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                <Edit />
              </IconButton>
            </label>
            </Box>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{  mt: 1,width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <TextField
                    required
                    margin="normal"
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