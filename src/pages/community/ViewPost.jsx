import React, { useState , useEffect} from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios'; 
import { Typography, Paper, Button, Grid, IconButton, Box, Avatar } from "@mui/material";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { GradientButton } from '../../contexts/ThemeProvider';
import  ArrowBackIos  from '@mui/icons-material/ArrowBackIos';

export function ViewPost() {
  const [postData, setPostData] = useState([]);
  const [postUserID, setPostUserID] = useState(null);
  const [postUser, setPostUser] = useState({});
  const { user , setUser} = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state;

    useEffect(() => {
      // Load user ID from local storage or other persistent storage
      const storedUid = localStorage.getItem('uid');
      if (storedUid) {
          setUser({ ...user, uid: storedUid });
      }
  }, []);

    useEffect(() => {
        const uid = user?.uid;
        if (!uid) return;
        axios.get(`https://be-um-fitness.vercel.app/posts/getPostById/${id}`)
            .then(response => {
              console.log(response.data)
                setPostData(response.data); 
                setPostUserID(response.data.uid);
            })
            .catch(error => console.error('There was an error!', error));
    }, [user?.uid]); 

    useEffect(() => {
      const uid = postUserID;
      if (!uid) return;
      axios.get(`https://be-um-fitness.vercel.app/auth/getUserById/${uid}`)
          .then(response => {
              setPostUser(response.data); 
          })
          .catch(error => console.error('There was an error!', error));
  }, [postUserID]); 

    const handleBack = async () => {
      navigate(-1);
    }; 

  return (
    <Grid 
    container 
    component="main" 
    sx={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding:3
    }}
  >
    <Paper
      sx={{
        width: '737px',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        padding: 4,
        marginTop: 5
      }}
    >
      {/* Header with Back Button and User Info */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'left', // Align left and right content
          width: '100%',
          marginBottom: 2,
        }}
      >
        {/* Back Button on the Left */}
        <IconButton onClick={handleBack}>
          <ArrowBackIos />
        </IconButton>
  
        {/* User Info on the Right */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2, // Add space between avatar and user details
          }}
        >
          <Avatar
            src={postData.userPhotoUrl}
            alt={postData.userName}
            sx={{
              height: 50,
              width: 50,
              objectFit: 'cover',
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {postData.userName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {postData.formattedTime}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Typography 
      variant="body1" 
      color="textSecondary" 
      sx={{ 
        marginTop: 2,
        marginLeft: 2,
        textAlign: 'left', // Ensure the text aligns to the left 
        width: '90%' // Makes sure it spans the full width
      }}
    >
      {postData.postDetails}
    </Typography>
    </Paper>
  </Grid>
  );
}
