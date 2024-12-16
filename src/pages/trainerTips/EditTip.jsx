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
    Input,
    Snackbar,
    CircularProgress,
    FormHelperText
} from "@mui/material";
import {  useNavigate, Outlet, useLocation} from 'react-router-dom';
import { GradientButton } from '../../contexts/ThemeProvider';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import Edit from '@mui/icons-material/Edit';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../configs/firebaseDB'; 
import MuiAlert from '@mui/material/Alert';
import CloudUpload from '@mui/icons-material/CloudUpload';

export function EditTip() {
    const [tipData, setTipData] = useState({});
    const { user , setUser} = useUser();
    const uid = user?.uid;
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [shortDesc, setShortDesc] = useState('');
    const [tipImage, setTipImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); 
    const [downloadUrl, setDownloadUrl] = useState(null); 
    const [editTipStatus, setEditTipStatus] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state;
    const [loading, setLoading] = useState(false);
    const [tipError, setTipError] = useState('');
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' }); // Notification state
    
    const handleCloseNotification = () => setNotification({ ...notification, open: false });
  
    useEffect(() => {
        const fetchTipData = async () => {
            try {
                const response = await axios.get(`https://be-um-fitness.vercel.app/tips/getTipById/${id}`);
                const data = response.data;
                setTipData(data);
                setTitle(data.title);
                setDesc(data.desc);
                setShortDesc(data.shortDesc);
                setTipImage(data.downloadUrl);
                setPreviewUrl(data.downloadUrl);
                setDownloadUrl(data.downloadUrl);
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
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];  // Add more types as needed
  
      if (file && allowedTypes.includes(file.type)) {
        setTipImage(file);
        const fileRef = ref(storage, `tipImages/${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);
    
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // You can handle progress here if you need to show upload status
          },
          (error) => {
            console.error("Upload failed", error);
            setTipError(prev => ({ ...prev, tipImage: 'Failed to upload image' }));
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setPreviewUrl(downloadURL);
              setDownloadUrl(downloadURL);
              setTipError(prev => ({ ...prev, tipImage: '' }));
          });
      }
    );
    } else {
    setTipError(prev => ({ ...prev, tipImage: 'Invalid file type.' }));
    setPreviewUrl(null);
    setDownloadUrl(null);
  }
    };

    const handleSubmit = async (e) => { 
        e.preventDefault();
        if (!validateTip()) {
          return;
        }
        setLoading(true);
        try {
            const response = await axios.patch(`https://be-um-fitness.vercel.app/tips/updateTip/${id}`, {
              updates: {
                downloadUrl,
                uid,
                title,
                desc,
                shortDesc
              }
            });
            setNotification({ open: true, message: 'Sharing tip updated successfully!', severity: 'success' });
            setTimeout(() => {
              navigate("/viewTip", { state: { id: id } });
        }, 2000);
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
        } finally {
          setLoading(false)
        }
    };

    const handleBack = async () => {
        navigate("/viewTip", { state: { id: id } });
    }; 

    const validateTip = () => {
      const errors = {};
      if (!title.trim()) errors.title = 'Sharing tip title is required';
      if (!shortDesc.trim()) errors.shortDesc = 'Sharing tip short description is required';
      if (!desc) errors.desc = 'Sharing tip full description is required';
      if (!tipImage) errors.tipImage = 'Sharing tip image is required';
      if (tipError.tipImage) errors.tipImage = tipError.tipImage;

      setTipError(errors);
      return Object.keys(errors).length === 0;
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
            Edit Your Sharing Tip
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
                  border: `1px solid ${tipError.tipImage ? 'red' : '#c4c4c4'}`,
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
                {tipError.tipImage && (
                                <FormHelperText error>{tipError.tipImage}</FormHelperText>
                )}
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
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{  mt: 2,width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <TextField
                    value={title}
                    required
                    margin="normal"
                    fullWidth
                    name="tipTitle"
                    label="Sharing Tip Title"
                    id="tipTitle"
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setTipError({ ...tipError, title: '' });
                    }}
                    variant="outlined"
                    error={!!tipError.title}
                    helperText={tipError.title}
            />
            <TextField
                value={shortDesc}
                required
                margin="normal"
                fullWidth
                name="tipShortDesc"
                label="Sharing Tip Short Description"
                id="tipShortDesc"
                onChange={(e) => {
                  setShortDesc(e.target.value);
                  setTipError({ ...tipError, shortDesc: '' });
                }}
                variant="outlined"  
                error={!!tipError.shortDesc}
                helperText={tipError.shortDesc}
                />
             <TextField
                value={desc}
                required
                margin="normal"
                fullWidth
                name="tipFullDesc"
                label="Sharing Tip Full Description"
                id="tipFullDesc"
                onChange={(e) => {
                  setDesc(e.target.value);
                  setTipError({ ...tipError, desc: '' });
                }}
                multiline
                rows={20} 
                variant="outlined"
                error={!!tipError.desc}
                helperText={tipError.desc}  
                />
        <GradientButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 3 }}
        >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
        </GradientButton>
    </Box>
</Paper>
<Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </MuiAlert>
      </Snackbar>
</Grid>
  );
}
