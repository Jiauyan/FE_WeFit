import React, { useState, useEffect } from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { Typography, Paper, Avatar, Button, Grid, Box, IconButton, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { GradientButton } from '../../contexts/ThemeProvider';
import { ArrowBackIos, Delete } from '@mui/icons-material';
import { DeleteBooking } from './DeleteBooking';

export function ViewBooking() {
  const [bookingData, setBookingData] = useState('');
  const [trainingProgram, setTrainingProgram] = useState('');
  const [trainerID, setTrainerID] = useState(null);
  const [trainer, setTrainer] = useState({});
  //const [slot , setSlot] = useState('');
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { id, slot, bookingId } = location.state;

  useEffect(() => {
    const storedUid = localStorage.getItem('uid');
    if (storedUid) {
      setUser({ ...user, uid: storedUid });
    }
  }, []);

  useEffect(() => {
    const uid = user?.uid;
    if (!uid) return;
    axios.get(`http://localhost:3000/trainingClassBooking/getBookingById/${bookingId}`)
      .then(response => {
        setBookingData(response.data.booking);
        setTrainingProgram(response.data.trainingProgram)
        setTrainerID(response.data.trainingProgram.uid);
      })
      .catch(error => console.error('There was an error!', error));
  }, [user?.uid]);

  useEffect(() => {
    const uid = trainerID;
    if (!uid) return;
    axios.get(`http://localhost:3000/auth/getUserById/${uid}`)
        .then(response => {
            setTrainer(response.data); 
        })
        .catch(error => console.error('There was an error!', error));
  }, [trainerID]); 

  const handleBack = async () => {
    navigate(-1);
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
          padding: 4
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
          {trainingProgram.downloadUrl && (
            <img
              src={trainingProgram.downloadUrl}
              alt={trainingProgram.title}
              style={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'contain',
                marginBottom: '20px'
              }}
            />
          )}
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Title
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {trainingProgram.title}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Trainer
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              alt={trainer.username}
              src={trainer.photoURL}
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Typography variant="body1">
              {trainer.username}
            </Typography>
          </Box>

          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Training Program Type
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {trainingProgram.typeOfTrainingProgram}
          </Typography>
          {trainingProgram.typeOfTrainingProgram === 'Group Classes' && (
            <Box>
            <Typography
              variant="h6"
              component="h2"
              sx={{ mb: 2, fontWeight: 'bold' }}
            >
              Capacity
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
              {trainingProgram.capacity}
            </Typography> 
            </Box>
          )}

          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Training Program Fee
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {trainingProgram.feeType}
          </Typography>
          {trainingProgram.feeType === 'Paid' && (
            <Box>
            <Typography
              variant="h6"
              component="h2"
              sx={{ mb: 2, fontWeight: 'bold' }}
            >
              Fee Amount
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
              RM {trainingProgram.feeAmount}
            </Typography> 
            </Box>
          )}

          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Venue Type
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {trainingProgram.venueType}
          </Typography>
          {trainingProgram.venueType === 'Physical' && (
            <Box>
            <Typography
              variant="h6"
              component="h2"
              sx={{ mb: 2, fontWeight: 'bold',textAlign: 'center' }}
            >
              Venue
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
              {trainingProgram.venue}
            </Typography> 
            </Box>
          )}

          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Fitness Level
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {trainingProgram.fitnessLevel}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Type of Exercise
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {trainingProgram.typeOfExercise}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Goal
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {trainingProgram.fitnessGoal}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Description
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, textAlign: 'justify', whiteSpace: 'pre-wrap' }}>
            {trainingProgram.desc}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Slot
          </Typography>
          {bookingData?.slot?.time}
            {bookingData?.status === false && <DeleteBooking id={bookingId} />}
            {/* <DeleteBooking id={bookingId} /> */}
        </Paper>
      </Grid>
      <Outlet />
    </>
  );
}
