import React, { useState , useEffect} from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios'; 
import { 
    Typography, 
    Paper, 
    Avatar, 
    Button, 
    Box,
    TextField,
    Grid,
    IconButton,
    Input
} from "@mui/material";
import {  useNavigate, Outlet, useLocation} from 'react-router-dom';
import { GradientButton } from '../../contexts/ThemeProvider';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import Edit from '@mui/icons-material/Edit';

export function EditTip() {
    const [tipData, setTipData] = useState({});
    const { user , setUser} = useUser();
    const uid = user?.uid;
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [shortDesc, setShortDesc] = useState('');
    const [tipImage, setTipImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); 
    const [editTipStatus, setEditTipStatus] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state;
    
    useEffect(() => {
        const fetchTipData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/tips/getTipById/${id}`);
                const data = response.data;
                setTipData(data);
                setTitle(data.title);
                setDesc(data.desc);
                setShortDesc(data.shortDesc);
                setTipImage(data.downloadUrl);
                setPreviewUrl(data.downloadUrl);
            } catch (error) {
                console.error('There was an error fetching the tip data!', error);
            }
        };

        if (id) {
            fetchTipData();
        }
    }, []);

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
        try {
            const response = await axios.patch(`http://localhost:3000/tips/updateTip/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            //setEditTipStatus(response.data);
            navigate("/viewTip", { state: { id: id } });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setEditTipStatus(error.response.data.message);
                } else {
                    setEditTipStatus('An error occurred');
                }
            } else {
                setEditTipStatus('An unexpected error occurred');
            }
        }
    };

    const handleBack = async () => {
        navigate("/viewTip", { state: { id: id } });
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            <IconButton onClick={handleBack}>
              <ArrowBackIos />
            </IconButton>
          </Box>
        
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            Edit Your Sharing Tip
          </Typography>
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
        <Box component="form" onSubmit={handleSubmit} sx={{  mt: 2,width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Sharing Tip Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 1 }}
        />
        <TextField
            margin="normal"
            required
            fullWidth
            id="desc"
            label="Sharing Tip Short Description"
            name="desc"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            sx={{ mb: 1 }}

        />
        <TextField
            margin="normal"
            required
            fullWidth
            id="desc"
            label="Sharing Tip Full Description"
            name="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            sx={{ mb: 1 }}
            multiline
            rows={20}

        />
        <GradientButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 3 }}
        >
            Save
        </GradientButton>
    </Box>
</Paper>
</Grid>
    <Outlet/>
    </>
  );
}
