import React, { useState , useEffect} from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios'; 
import { Typography, Paper, Avatar, Button, Grid, Box, IconButton, Menu, MenuItem, CircularProgress } from "@mui/material";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { DeleteTip } from './DeleteTip';
import { GradientButton } from '../../contexts/ThemeProvider';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import MoreVert from '@mui/icons-material/MoreVert';

export function ViewTip() {
    const [loading, setLoading] = useState(true);
    const [tipData, setTipData] = useState([]);
    const [tipUserID, setTipUserID] = useState(null);
    const [tipUser, setTipUser] = useState({});
    const { user , setUser} = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    useEffect(() => {
      window.scrollTo(0, 0); 
    }, []);

    useEffect(() => {
      // Load user ID from local storage or other persistent storage
      const storedUid = localStorage.getItem('uid');
      if (storedUid) {
          setUser({ ...user, uid: storedUid });
      }
    }, []);

    useEffect(() => {
      const fetchData = async () => {
          setLoading(true);
          try {
              // Fetch the tip details
              const tipResponse = await axios.get(`https://be-um-fitness.vercel.app/tips/getTipById/${id}`);
              setTipData(tipResponse.data);
              const tipUserID = tipResponse.data.uid;
  
              if (!tipUserID) {
                  throw new Error('User ID not found in tip data');
              }
  
              // Using the tip's user ID to fetch the user details
              const userResponse = await axios.get(`https://be-um-fitness.vercel.app/auth/getUserById/${tipUserID}`);
              setTipUser(userResponse.data);
          } catch (error) {
              console.error('There was an error!', error);
          } finally {
              setLoading(false);
          }
      };
  
      fetchData();
    }, [id]);

    const handleEdit = async (id) => {
      navigate("/editTip", { state: { id: id } });
    }; 

    const handleBack = async () => {
      navigate("/trainerTips");
    }; 

    if (loading) {
      return (
        <Grid container justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
          <CircularProgress />
        </Grid>
      );
    }
    
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
      <Grid container item xs={12} justifyContent="space-between" marginBottom={2}>
          <IconButton onClick={() => handleBack()}>
            <ArrowBackIos />
          </IconButton>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem  onClick={() => handleEdit(id)}>Edit</MenuItem>
            <DeleteTip id={id} />
          </Menu>
        </Grid>
        <Grid container item xs={12} justifyContent="center" > 
          <Typography
            variant="h5" 
            component="h2"  // Semantically correct header tag
            sx={{ mb: 3, textAlign: 'center' }}  // Centered text for the title
          >
            {tipData.title}
          </Typography>
        </Grid>
        <Grid container item xs={12} justifyContent="center" > 
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 3 }}>
        <Avatar
          alt={tipUser.username}
          src={tipUser.photoURL}
          sx={{ width: 40, height: 40, mr: 2 }} // Added margin-right to separate Avatar from text
        />
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mr: 2 }}
        >
          {tipUser.username}
        </Typography>
        <Typography variant="body2" color="textSecondary">
        {new Date(tipData.createdAt).toLocaleString('en-US', {
          month: 'long',
          day: '2-digit',
          year: 'numeric',
        })}
      </Typography>
      </Box>
      </Grid>
      <Grid container item xs={12}>
          {tipData.downloadUrl && (
          <img
            src={tipData.downloadUrl}
            alt={tipData.title}
            style={{
              width: '100%',
              height: '350px',
              objectFit: 'cover',
              borderRadius: 8
            }}
          />
        )}
      </Grid>
      <Grid container item xs={12} marginTop={3} marginBottom={2}>
        <Typography
          variant="body1"  // More appropriate for body text
          sx={{  textAlign: 'justify', whiteSpace: 'pre-wrap' }}  // Preserves formatting
          >
          {tipData.desc}
        </Typography>
      </Grid>
</Paper>
</Grid>
<Outlet/>
    </>
  );
}
