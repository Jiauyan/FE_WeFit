import React, { useState , useEffect} from 'react';
import { useUser } from "../../UseContext";
import axios from 'axios'; 
import { 
    Typography, 
    Paper, 
    Avatar, 
    Button, 
    Box,
    TextField,
} from "@mui/material";
import {  useNavigate, Outlet } from 'react-router-dom';

export function EditProfile() {
    const [userData, setUserData] = useState({});
    const { user , setUser} = useUser();
    const uid = user?.uid;
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [dateOfBirth, setDate] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [editProfileStatus, setEditProfileStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/auth/getUserById/${uid}`);
                const data = response.data;
                setUserData(data);
                setUsername(data.username);
                setAge(data.age);
                setDate(data.dateOfBirth);
                setWeight(data.weight);
                setHeight(data.height);
            } catch (error) {
                console.error('There was an error fetching the user data!', error);
            }
        };

        if (uid) {
            fetchUserData();
        }
    }, [uid]);

    const handleSubmit = async (e) => { 
        e.preventDefault();
        try {
            const response = await axios.patch(`http://localhost:3000/profile/updateProfile/${uid}`, {
                username,
                age,
                dateOfBirth,
                weight,
                height
            });
            setEditProfileStatus(response.data.message);
            navigate("/profile");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setEditProfileStatus(error.response.data.message);
                } else {
                    setEditProfileStatus('An error occurred');
                }
            } else {
                setEditProfileStatus('An unexpected error occurred');
            }
        }
    };

    const handleBack = async () => {
        navigate("/profile");
    }; 

  return (
    <>
    <Paper sx={{ width: 737, height: 788, m: 10 }}>
    <Box component="form" noValidate onSubmit={handleSubmit}>
            <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleBack}
              >
                Back
            </Button>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Edit Your Profile
            </Typography>
            <TextField
                    margin="normal"
                    //required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    value ={username}
                    onChange={(e) => setUsername(e.target.value)}
            />
             <TextField
                    margin="normal"
                    //required
                    fullWidth
                    id="age"
                    label="Age"
                    name="age"
                    value ={age}
                    type="number"
                    onChange={(e) => setAge(parseFloat(e.target.value) || null)}
            />
            <TextField
                    margin="normal"
                    //required
                    fullWidth
                    id="dateOfBirth"
                    label="Date of Birth"
                    name="dateOfBirth"
                    value ={dateOfBirth}
                    onChange={(e) => setDate(e.target.value)}
            />
            <TextField
                    margin="normal"
                    //required
                    fullWidth
                    name="weight"
                    label="Weight"
                    id="weight"
                    type="number"
                    value ={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || null)}
            />
            <TextField
                    margin="normal"
                    //required
                    fullWidth
                    name="height"
                    label="Height"
                    id="height"
                    type="number"
                    value ={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || null)}
            />
            <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
            >
                Save
            </Button>
        </Box>
    </Paper>
    <Outlet/>
    </>
  );
}
