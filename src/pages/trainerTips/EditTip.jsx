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
    IconButton
} from "@mui/material";
import {  useNavigate, Outlet, useLocation} from 'react-router-dom';
import { GradientButton } from '../../contexts/ThemeProvider';
import { ArrowBackIos } from '@mui/icons-material';

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
        //height: '100vh', 
        // width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding:3
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
    <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2 }}  >
            Edit Your Sharing Tip
        </Typography>
        {previewUrl && (
                          <img src={previewUrl} alt={title} style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', marginBottom: '20px' }} />
                      )}
                      <input
                          type="file"
                          onChange={handleFileChange}
                          style={{ marginBottom: '20px' }}
        />
        <Box component="form" onSubmit={handleSubmit} sx={{  mt: 1,width: '100%', justifyContent: 'center', alignItems: 'center' }}>
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
