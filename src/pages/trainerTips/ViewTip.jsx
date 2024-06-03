import React, { useState , useEffect} from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios'; 
import { Typography, Paper, Avatar, Button, Grid, Box, IconButton } from "@mui/material";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { DeleteTip } from './DeleteTip';
import { GradientButton } from '../../contexts/ThemeProvider';
import { ArrowBackIos } from '@mui/icons-material';

export function ViewTip() {
    const [tipData, setTipData] = useState([]);
    const [tipUserID, setTipUserID] = useState(null);
    const [tipUser, setTipUser] = useState({});
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
        axios.get(`http://localhost:3000/tips/getTipById/${id}`)
            .then(response => {
                setTipData(response.data); 
                setTipUserID(response.data.uid);
            })
            .catch(error => console.error('There was an error!', error));
    }, [user?.uid]); 
 
    useEffect(() => {
      const uid = tipUserID;
      if (!uid) return;
      axios.get(`http://localhost:3000/auth/getUserById/${uid}`)
          .then(response => {
              setTipUser(response.data); 
          })
          .catch(error => console.error('There was an error!', error));
  }, [tipUserID]); 

    const handleEdit = async (id) => {
      navigate("/editTip", { state: { id: id } });
    }; 

    const handleBack = async () => {
      navigate("/trainerTips");
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
        alignItems: 'center'
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
    <Typography
      variant="h5" 
      component="h2"  // Semantically correct header tag
      sx={{ mb: 3, textAlign: 'center' }}  // Centered text for the title
    >
      {tipData.title}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 3 }}>
  <Avatar
    alt={tipUser.username}
    src={tipUser.downloadUrl}
    sx={{ width: 40, height: 40, mr: 2 }} // Added margin-right to separate Avatar from text
  />
  <Typography
    variant="body2"
    color="textSecondary"
    sx={{ mr: 2 }}
  >
    {tipUser.username}
  </Typography>
  <Typography
    variant="body2"
    color="textSecondary"
  >
    {tipData.createdAt}
  </Typography>
</Box>
  {tipData.downloadUrl && (
    <img
      src={tipData.downloadUrl}
      alt={tipData.title}
      style={{
        width: '100%',  // Full width of the container
        maxHeight: '500px',  // Max height to control large images
        objectFit: 'contain',  // Ensures the image is contained within the element without stretching
        marginBottom: '20px'
      }}
    />
  )}
  <Typography
  variant="body1"  // More appropriate for body text
  sx={{  textAlign: 'justify', whiteSpace: 'pre-wrap' }}  // Preserves formatting
  >
  {tipData.desc}
</Typography>
    <GradientButton
         fullWidth
         variant="contained"
         color="primary"  
         sx={{ mt: 3, mb: 2 }}
        onClick={() => handleEdit(id)}
    >
        Edit
    </GradientButton>
    <DeleteTip id={id} />
</Paper>
</Grid>
<Outlet/>
    </>
  );
}
