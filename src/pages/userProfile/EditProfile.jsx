import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import {
    Typography, 
    Paper, 
    Avatar, 
    Button, 
    Box,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Input,
    FormHelperText,
    Snackbar,
    CircularProgress
} from "@mui/material";
import { useNavigate, Outlet } from 'react-router-dom';
import { useUser } from "../../contexts/UseContext";
import { GradientButton } from '../../contexts/ThemeProvider';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import Edit from '@mui/icons-material/Edit';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../configs/firebaseDB'; 
import MuiAlert from '@mui/material/Alert';
import DefaultProfileImg from "../../assets/defaultProfileImg.png";

export function EditProfile() {
  const [formValues, setFormValues] = useState({
    username: '', gender: '', age: '', weight: '', height: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); 

  const { user } = useUser();
  const uid = user?.uid;
  const navigate = useNavigate();
  
  const handleCloseNotification = () => setNotification({ ...notification, open: false });

  useEffect(() => {
      window.scrollTo(0, 0); 
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`https://be-um-fitness.vercel.app/auth/getUserById/${uid}`);
            const data = response.data;
            setFormValues(prev => ({ ...prev, ...data }));
            setProfileImage(data.photoURL);
            setPreviewUrl(data.photoURL);
        } catch (error) {
            console.error('There was an error fetching the user data!', error);
            setNotification({ open: true, message: 'Failed to fetch user data', severity: 'error' });
        }
    };

    if (uid) {
        fetchUserData();
    }
  }, [uid]);

  const validateForm = () => {
    const errors = {};
    if (!formValues.username.trim()) errors.username = 'Username is required';
    if (!formValues.gender) errors.gender = 'Gender is required';
    if (formValues.age <= 0) errors.age = 'Age must be a positive number';
    if (formValues.weight <= 0) errors.weight = 'Weight must be a positive number';
    if (formValues.height <= 0) errors.height = 'Height must be a positive number';
    if (!profileImage) errors.profileImage = 'Profile image is required';
    if (formErrors.profileImage) errors.profileImage = formErrors.profileImage;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
};

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];  // Add more types as needed

      if (file && allowedTypes.includes(file.type)) {
          setProfileImage(file);

          const fileRef = ref(storage, `profileImages/${file.name}`);
          const uploadTask = uploadBytesResumable(fileRef, file);

          uploadTask.on(
              "state_changed",
              (snapshot) => {
                  // Optional: update progress to the user
              },
              (error) => {
                  console.error("Upload failed", error);
                  setFormErrors(prev => ({ ...prev, profileImage: 'Failed to upload image. Try again.' }));
              },
              () => {
                  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                      setPreviewUrl(downloadURL);
                      setFormErrors(prev => ({ ...prev, profileImage: '' }));
                  });
              }
          );
      } else {
          // Handle the error for wrong file type
        setFormErrors(prev => ({ ...prev, profileImage: 'Invalid file type.' }));
        setPreviewUrl(null);
      }
    };

    const handleChange = (field, value) => {
      setFormValues((prevValues) => ({
        ...prevValues,
        [field]: ['age', 'weight', 'height'].includes(field) ? Number(value) : value,
      }));
      if (formErrors[field]) setFormErrors({ ...formErrors, [field]: '' });
    };

    const handleSubmit = async (e) => { 
      e.preventDefault();
      if (!validateForm()) return;
  
      setLoading(true);
        try { 
             const responseUpdate = await axios.post(`https://be-um-fitness.vercel.app/profile/uploadProfileImage/${uid}`, {
              updates: {
                ...formValues,
                photoURL: previewUrl
              }
            });
            setNotification({ open: true, message: 'Profile updated successfully!', severity: 'success' });
            setTimeout(() => {
              navigate("/profile", { state: { uid: uid } });
            }, 1000);
        } catch (error) {
          setNotification({
              open: true,
              message: 'Failed to update profile. Please try again.',
              severity: 'error'
          });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = async () => {
        navigate("/profile");
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
            Edit Your Profile
          </Typography>
          {previewUrl ? (
    <Box sx={{ position: 'relative', mb: 1, display: 'inline-block' }}>
        <Avatar
            alt="Preview Image"
            src={previewUrl}
            sx={{ width: 200, height: 200 }}
        />
        <label htmlFor="icon-button-file">
            <Input id="icon-button-file" type="file" onChange={handleFileChange} sx={{ display: 'none' }} />
            <IconButton
                color="primary"
                aria-label="edit picture"
                component="span"
                sx={{
                    position: 'absolute',
                    bottom: 0, // Position at the bottom of the container
                    right: 0, // Position at the right of the container
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
) : (
    <Box sx={{ position: 'relative', mb: 1, display: 'inline-block' }}>
        <Avatar
            alt="Invalid Image"
            src={DefaultProfileImg} // Path to your placeholder image
            sx={{ width: 200, height: 200 }}
        />
        <label htmlFor="icon-button-file">
            <Input id="icon-button-file" type="file" onChange={handleFileChange} sx={{ display: 'none' }} />
            <IconButton
                color="primary"
                aria-label="edit picture"
                component="span"
                sx={{
                    position: 'absolute',
                    bottom: 0, // Position at the bottom of the container
                    right: 0, // Position at the right of the container
                    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                }}
            >
                <Edit />
            </IconButton>
        </label>
        {formErrors.profileImage && (
            <FormHelperText style={{ textAlign: 'center' }} error>{formErrors.profileImage}</FormHelperText>
        )}
    </Box>
)}
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{  mt: 2, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <TextField
            required
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={formValues.username}
            onChange={(e) => handleChange('username', e.target.value)}
            variant="outlined"
            error={!!formErrors.username}
            helperText={formErrors.username}
            sx={{ mb: 1 }}
        />
        <FormControl margin="normal" fullWidth error={!!formErrors.gender}>
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
            <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formValues.gender}
                  label="Gender"
                  onChange={(e) => handleChange('gender', e.target.value)}
            >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
            </Select>
            <FormHelperText>{formErrors.gender}</FormHelperText>
        </FormControl>
        <TextField
                            required
                            margin="normal"
                            fullWidth
                            id="age"
                            label="Age"
                            name="age"
                            value={formValues.age}
                            type="number"
                            onChange={(e) => handleChange('age', e.target.value)}
                            variant="outlined"
                            error={!!formErrors.age}
                            helperText={formErrors.age}
                            sx={{ mb: 1 }}
                        />
                        <TextField
                            required
                            margin="normal"
                            fullWidth
                            name="weight"
                            label="Weight"
                            id="weight"
                            type="number"
                            value={formValues.weight}
                            onChange={(e) => handleChange('weight', e.target.value)}
                            variant="outlined"
                            error={!!formErrors.weight}
                            helperText={formErrors.weight}
                            sx={{ mb: 1 }}
                        />
                        <TextField
                            required
                            margin="normal"
                            fullWidth
                            name="height"
                            label="Height"
                            id="height"
                            type="number"
                            value={formValues.height}
                            onChange={(e) => handleChange('height', e.target.value)}
                            variant="outlined"
                            error={!!formErrors.height}
                            helperText={formErrors.height}
                            sx={{ mb :1 }}
                        />
                        <GradientButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb :2, mr:1}}
                            disabled={loading}
                        >
                             {loading ? <CircularProgress size={24} color="inherit" /> : 'SAVE'}
                        </GradientButton>
      </Box>
      </Paper>
    </Grid>
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
    <Outlet/>
    </>
  );
}
