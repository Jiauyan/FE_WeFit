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
            height: '100vh', 
            width: 'auto',
            backgroundImage: `url(${backGround})`,
            backgroundPosition: 'center', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
      }}
    >
      <Paper sx={{
        width: 737,
        height: 'auto', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)', 
        borderRadius: 2,
        padding: 4,
        margin: 4  
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
                    onChange={(e) => setAge(parseFloat(e.target.value) || null)}
            />
            <FormControl fullWidth>
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
                    onChange={(e) => setWeight(parseFloat(e.target.value) || null)}
            />
            <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="height"
                    label="Height"
                    id="height"
                    type="number"
                    onChange={(e) => setHeight(parseFloat(e.target.value) || null)}
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