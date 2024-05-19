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
} from "@mui/material";

export function CompleteProfile() {
    
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDate] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [role, setRole] = React.useState('');
    const [completeProfileStatus, setCompleteProfileStatus] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const uid = location.state?.uid; // Access the ID from the state
    const handleGender = async (event) => {
        setGender(event.target.value);
      };

    const handleRole = async (event) => {
        setRole(event.target.value);
    };

    const handleBack = async () => {
        navigate("/register");
    }; 

    const handleSubmit = async (e) => { 
        e.preventDefault(); 

        try {
            const response = await axios.post(`http://localhost:3000/auth/completeProfile/${uid}`, {
                role,
                username,
                age,
                gender,
                dateOfBirth,
                weight,
                height,
            });
            setCompleteProfileStatus(response.data.message);
            if (role === 'Student') {
                navigate('/fitnessLevel', { state: { uid } });
            } else {
                navigate('/login');
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
       <Grid>
        <Grid></Grid>
        <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleBack}
              >
                Back
            </Button>
            <Typography component="h1" variant="h5">
                Let's complete your profile 
            </Typography>
            <Typography component="h6" variant="h6">
                It will help us to know more about you!
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
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
                    //required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    onChange={(e) => setUsername(e.target.value)}
            />
             <TextField
                    margin="normal"
                    //required
                    fullWidth
                    id="age"
                    label="Age"
                    name="age"
                    autoComplete="age"
                    autoFocus
                    onChange={(e) => setAge(e.target.value)}
            />
            <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                    <Select
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
                    //required
                    fullWidth
                    id="dateOfBirth"
                    label="Date of Birth"
                    name="dateOfBirth"
                    autoFocus
                    onChange={(e) => setDate(e.target.value)}
            />
            <TextField
                    margin="normal"
                    //required
                    fullWidth
                    name="weight"
                    label="Weight"
                    type="integer"
                    id="weight"
                    onChange={(e) => setWeight(e.target.value)}
            />
            <TextField
                    margin="normal"
                    //required
                    fullWidth
                    name="height"
                    label="Height"
                    type="integer"
                    id="height"
                    onChange={(e) => setHeight(e.target.value)}
            />
            <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    {role === 'Student' ? 'Next' : 'Confirm'}
            </Button>
        </Box>
       </Grid>
    );
};