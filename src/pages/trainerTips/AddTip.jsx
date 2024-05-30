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
    Paper
}from "@mui/material";


export function AddTip() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [tipImage, setTipImage] = useState(null);
  const [addTipStatus, setAddTipStatus] = useState('');
  const { user } = useUser();
  const uid = user.uid;
 

  const handleSubmit = async (e) => { 
    e.preventDefault();
    const formData = new FormData();
    formData.append('tipImage', tipImage); 
    formData.append('uid', uid);
    formData.append('title', title);
    formData.append('desc', desc);

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
        <Box component="form" noValidate onSubmit={handleSubmit}>
            <Button 
                onClick={handleBack}
                sx={{ position: 'absolute', top: 10, right: 10 }}
            >
                Back
            </Button>

            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                Add Your Sharing Tip
            </Typography>
                    <input
                        type="file"
                        onChange={(e) => setTipImage(e.target.files[0])}
                    />
            <TextField
                    margin="normal"
                    //required
                    fullWidth
                    name="tip"
                    label="Sharing Tip Title"
                    id="tip"
                    onChange={(e) => setTitle(e.target.value)}
            />
             <TextField
                margin="normal"
                fullWidth
                name="tip"
                label="Sharing Tip Description"
                id="tip"
                onChange={(e) => setDesc(e.target.value)}
                multiline
                rows={20} // This sets the initial number of visible rows
                variant="outlined" // Optional: add variant for better appearance
                />
            <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
            >
                Add
            </Button>
        </Box>
        </Paper>
  );
}