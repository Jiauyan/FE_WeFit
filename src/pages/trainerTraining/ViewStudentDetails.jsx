import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress
} from "@mui/material";
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import MoreVert from '@mui/icons-material/MoreVert';
import { GradientButton } from '../../contexts/ThemeProvider';

export function ViewStudentDetails() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [studentDetailsData, setStudentDetailsData] = useState('');
  const { user, setUser } = useUser();
  const uid = user.uid;
  const location = useLocation();
  const { studentData, id, slot} = location.state;
  const [status , setStatus] = useState(location.state.studentData.status);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const storedUid = localStorage.getItem('uid');
    if (storedUid) {
      setUser({ ...user, uid: storedUid });
    }
  }, []);

  const handleBack = async () => {
    navigate("/studentList", { state: { id: id , slot} });
  };

  const handleViewScreeningForm = async () => {
    navigate("/viewScreeningForm", { state: { id, uid: studentData.uid, studentData, slot} });
  };

  const handleViewConsentForm = async () => {
    navigate("/viewConsentForm", { state: { id, uid: studentData.uid, studentData, slot} });
  };

  const handleAttendance = async (bookingID) => {
    setLoading(true);
    try {
      // Making the API request to update the booking status to true
      const response = await axios.post(`https://be-um-fitness.vercel.app/trainingClassBooking/updateBooking/${bookingID}`, {
        uid: studentData.uid,
        name: studentData.name,
        contactNum: studentData.contactNum,
        slot: studentData.slot,
        trainingClassID: studentData.trainingClassID,
        status: true,
      });
      setStatus(true);
    } catch (error) {
      console.error("Failed to update booking status:", error);
    } finally {
      setLoading(false);
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
        width: '100%' // Ensures the grid takes full width
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
          <MenuItem onClick={() => handleViewScreeningForm()}>View Pre-Participation Screening Form</MenuItem>
          <MenuItem onClick={() => handleViewConsentForm()}>View Consent Form</MenuItem>
          </Menu>
        </Grid>
        <Grid container item xs={12} justifyContent="center"> 
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 5 }} >
          Student Information
        </Typography>
        </Grid>
        <Box
          component="form"
          sx={{ 
            mt: 1, 
            width: '100%', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center', // Center align horizontally
          }}
        >
          <Box sx={{ width: '80%' }}>
            {/* Row layout using flex for field name and answer */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                Name:
              </Typography>
              <Typography variant="body1">
                {studentData.name}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                Contact Number:
              </Typography>
              <Typography variant="body1">
                {studentData.contactNum}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                Training Program:
              </Typography>
              <Typography variant="body1">
                {studentData.trainingProgramName}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                Slot:
              </Typography>
              <Typography variant="body1">
                {studentData.slot.time}
              </Typography>
            </Box>
          </Box>
        </Box>
          {status === false ? (
          <GradientButton
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => handleAttendance(studentData.bookingID)}
          >
             {loading ? <CircularProgress size={24} color="inherit" /> : 'Mark as Done'}
          </GradientButton>
        ) : (
          <Box
          component="form"
          sx={{ 
            mt: 1, 
            width: '100%', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center', // Center align horizontally
          }}
        >
          <Box sx={{ width: '80%' }}>
           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
           <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                Status:
              </Typography>
           <Typography variant="body1">
           Completed
           </Typography>
         </Box>
         </Box>
         </Box>
        )}
      </Paper>
    </Grid>
  );
}
