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
} from "@mui/material";
import {  useNavigate, Outlet } from 'react-router-dom';

export function EditTrainerProfile() {
    const [userData, setUserData] = useState({});
    const { user , setUser} = useUser();
    const uid = user?.uid;
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [profileImage, setProfileImage] = useState(null);
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
                setWeight(data.weight);
                setHeight(data.height);
                setProfileImage(data.downloadUrl);
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
        const formData = new FormData();
        formData.append('profileImage', profileImage);
        formData.append('username', username);
        formData.append('age', age);
        formData.append('weight', weight);
        formData.append('height', height);
        try { 
            const responseUpdate = await axios.post(`http://localhost:3000/profile/uploadProfileImage/${uid}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUserData(responseUpdate.data);
            setEditProfileStatus(responseUpdate.data.message);
            navigate("/trainerProfile",{ state: { uid: uid } } );
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
    <Paper sx={{ 
    width: 737, 
    height: 'auto', 
    m: 10,
    p: 3, 
    boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)' 
    }}>
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Edit Your Profile
        </Typography>
        {profileImage && (
           <Avatar
            alt={userData.username}
            src={userData.downloadUrl}
            sx={{ width: 200, height: 200, mb: 3 }} 
            />
        )}
        <input
        type="file"
        //={{ display: 'none' }} 
        onChange={(e) => setProfileImage(e.target.files[0])}
        />
        <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            sx={{ mb: 1 }}
        />
        <TextField
            margin="normal"
            fullWidth
            id="age"
            label="Age"
            name="age"
            value={age}
            type="number"
            onChange={(e) => setAge(parseFloat(e.target.value) || null)}
            variant="outlined"
            sx={{ mb: 1 }}
        />
        <TextField
            margin="normal"
            fullWidth
            name="weight"
            label="Weight"
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value) || null)}
            variant="outlined"
            sx={{ mb: 1 }}
        />
        <TextField
            margin="normal"
            fullWidth
            name="height"
            label="Height"
            id="height"
            type="number"
            value={height}
            onChange={(e) => setHeight(parseFloat(e.target.value) || null)}
            variant="outlined"
            sx={{ mb: 1 }}
        />
        <Button
            onClick={handleBack}
            fullWidth
            variant="outlined"
            sx={{ mt: 3, mb: 2, mr: 1 }}
        >
            Back
        </Button>
        <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, mr: 1 }}
        >
            Save
        </Button>
    </Box>
    </Paper>
    <Outlet/>
    </>
  );
}
