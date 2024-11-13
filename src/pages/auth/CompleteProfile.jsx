import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate, useLocation} from 'react-router-dom';
import {
    Grid,
    CssBaseline,
    Box,
    Avatar,
    Typography,
    TextField,
    FormControlLabel,
    Button,
    Link,
    Paper,
    Container,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    Snackbar,
    Alert,
} from "@mui/material";

import { ApiTemplate } from '../../api';
import { GradientButton } from '../../contexts/ThemeProvider';
import backGround from "../../assets/backGround.png";

export function CompleteProfile() {
    
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [age, setAge] = useState(null);
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDate] = useState('');
    const [weight, setWeight] = useState(null);
    const [height, setHeight] = useState(null);
    const [role, setRole] = React.useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [completeProfileStatus, setCompleteProfileStatus] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const uid = location.state?.uid; 

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleGender = async (event) => {
        setGender(event.target.value);
      };

    const handleRole = async (event) => {
        setRole(event.target.value);
    };

    const handleSubmit = async (e) => { 
        e.preventDefault(); 

        try {
            const method = 'post'
            const route = `auth/completeProfile/${uid}`
            const formData = { role, name, username, age, gender, weight, height }

            const response = await ApiTemplate(method, route, formData)

            setCompleteProfileStatus(response.data.message);
            if (role === 'Student') {
                navigate('/fitnessLevel', { state: { uid } });
            } else {
                setOpenSnackbar(true);
                setTimeout(() => {
                    navigate('/login', { state: { uid } });
                }, 2000);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setCompleteProfileStatus(error.response.data.message);
                } else {
                    setCompleteProfileStatus('An error occurred');
                }
            } else {
                setCompleteProfileStatus('An unexpected error occurred');
            }
        }
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
        width: '100%', // Ensures the grid takes full width,
        backgroundImage: `url(${backGround})`,
        backgroundPosition: 'center', 
        backgroundSize: 'cover',
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
          margin: 'auto' // Centers the paper in the viewport
        }}>
         <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }} margin={1}>
                Let's complete your profile 
            </Typography>
            <Typography component="h6" variant="h6" sx={{ fontWeight: 300, fontSize: '0.875rem' }} margin={1}>
                It will help us to know more about you!
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                        required
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={role}
                        label="Role"
                        onChange={handleRole}
                    >
                        <MenuItem value="Trainer">Trainer</MenuItem>
                        <MenuItem value="Student">Student</MenuItem>
                    </Select>
            </FormControl>
            <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    onChange={(e) => setName(e.target.value)}
            />
            <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    onChange={(e) => setUsername(e.target.value)}
            />
             <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="age"
                    label="Age"
                    name="age"
                    type="number"
                    value={age || ''} // Make sure to bind the value
                    inputProps={{ min: 1, max: 100 }}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || parseFloat(value) >= 0) {
                            setAge(value === '' ? null : parseFloat(value));
                        }
                    }}
                />
            <FormControl margin="normal" fullWidth>
                    <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                    <Select
                        required
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={gender}
                        label="Role"
                        onChange={handleGender}
                    >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                    </Select>
            </FormControl>
            <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="weight"
                    label="Weight"
                    id="weight"
                    type="number"
                    inputProps={{ min: 0 }}
                    value={weight || ''} // Make sure to bind the value
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || parseFloat(value) >= 0) {
                            setWeight(value === '' ? null : parseFloat(value));
                        }
                    }}
            />
            <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="height"
                    label="Height"
                    id="height"
                    type="number"
                    inputProps={{ min: 0 }}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || parseFloat(value) >= 0) {
                            setHeight(value === '' ? null : parseFloat(value));
                        }
                    }}
            />
            <GradientButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    {role === 'Student' ? 'Next' : 'Confirm'}
            </GradientButton>
            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={2000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    top: '50%',
                    transform: 'translateY(-50%)',
                }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Registration successful! Redirecting to login page...
                </Alert>
            </Snackbar>
            </Box>
      </Paper>
    </Grid>
    );
};