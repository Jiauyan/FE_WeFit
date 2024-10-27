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
} from "@mui/material";
import { ArrowBackIos } from '@mui/icons-material';
import { GradientButton } from '../../contexts/ThemeProvider';

export function ViewStudentDetails() {
  const navigate = useNavigate();
  const [studentDetailsData, setStudentDetailsData] = useState('');
  const { user, setUser } = useUser();
  const uid = user.uid;
  const location = useLocation();
  const { studentData, id, slot} = location.state;
  const [status , setStatus] = useState(location.state.studentData.status);

  useEffect(() => {
    const storedUid = localStorage.getItem('uid');
    if (storedUid) {
      setUser({ ...user, uid: storedUid });
    }
  }, []);

  const handleBack = async () => {
    console.log(id);
    navigate("/studentList", { state: { id: id , slot} });
  };

  const handleViewConsentForm = async () => {
    navigate("/viewConsentForm", { state: { id, uid: studentData.uid, studentData, slot} });
  };

  const handleAttendance = async (bookingID) => {
    try {
      // Making the API request to update the booking status to true
      const response = await axios.post(`http://localhost:3000/trainingClassBooking/updateBooking/${bookingID}`, {
        uid: studentData.uid,
        name: studentData.name,
        contactNum: studentData.contactNum,
        slot: studentData.slot,
        trainingClassID: studentData.trainingClassID,
        status: true,
      });
      setStatus(true);
      console.log("Booking status updated successfully:", response.data);
    } catch (error) {
      console.error("Failed to update booking status:", error);
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
        padding: 3
      }}
    >
      <Paper sx={{
        width: '100%',
        maxWidth: '800px',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        padding: 4
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
          <IconButton onClick={handleBack}>
            <ArrowBackIos />
          </IconButton>
        </Box>

        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 5 }} margin={1}>
          Student Information
        </Typography>
        
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
        <GradientButton
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 5, mb: 2 }}
            onClick={() => handleViewConsentForm(studentData.uid)}
          >
            View Consent Form
          </GradientButton>
          {status === false ? (
          <GradientButton
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => handleAttendance(studentData.bookingID)}
          >
            Mark as Done
          </GradientButton>
        ) : (
          <Typography
            variant="h6"
            sx={{
              mt: 3,
              mb: 2,
              color: 'green',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            Completed
          </Typography>
        )}
      </Paper>
    </Grid>
  );
}
