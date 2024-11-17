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

} from "@mui/material";
import {  useNavigate, Outlet } from 'react-router-dom';
import { GradientButton } from '../../contexts/ThemeProvider';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import Edit from '@mui/icons-material/Edit';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../configs/firebaseDB'; 

export function EditTrainerProfile() {
    const [userData, setUserData] = useState({});
    const { user , setUser} = useUser();
    const uid = user?.uid;
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);  
    const [editProfileStatus, setEditProfileStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0); 
      }, []);
      
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`https://be-um-fitness.vercel.app/auth/getUserById/${uid}`);
                const data = response.data;
                setUserData(data);
                setUsername(data.username);
                setAge(data.age);
                setWeight(data.weight);
                setHeight(data.height);
                setProfileImage(data.photoURL);
                setPreviewUrl(data.photoURL);
            } catch (error) {
                console.error('There was an error fetching the user data!', error);
            }
        };

        if (uid) {
            fetchUserData();
        }
    }, [uid]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setProfileImage(file);
    
          const fileRef = ref(storage, `profileImages/${file.name}`);
          const uploadTask = uploadBytesResumable(fileRef, file);
      
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // You can handle progress here if you need to show upload status
            },
            (error) => {
              // Handle unsuccessful uploads
              console.error("Upload failed", error);
            },
            () => {
              // Handle successful uploads on complete
              getDownloadURL(uploadTask.snapshot.ref).then((photoURL) => {
              console.log("File available at", photoURL);
              setPreviewUrl(photoURL);
              setPhotoUrl(photoURL);
          });
        }
      );
      }
    };

    const handleSubmit = async (e) => { 
        e.preventDefault();
        try { 
            const responseUpdate = await axios.post(`https://be-um-fitness.vercel.app/profile/uploadProfileImage/${uid}`, {
                updates: {
                    photoUrl,
                    username,
                    age,
                    weight,
                    height
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
        navigate("/trainerProfile");
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
            {previewUrl && (
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
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{  mt: 2,width: '100%', justifyContent: 'center', alignItems: 'center' }}>
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
      <GradientButton
       type="submit"
               fullWidth
               variant="contained"
               color="primary"
               sx={{ mt: 3, mb: 2, mr: 1 }}
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
