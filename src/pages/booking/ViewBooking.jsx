import React, { useState, useEffect } from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { Typography, Paper, Avatar, Button, Grid, Box, IconButton, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { GradientButton } from '../../contexts/ThemeProvider';
import { ArrowBackIos, Delete } from '@mui/icons-material';
import { DeleteBooking } from './DeleteBooking';

export function ViewBooking() {
  const [bookingData, setBookingData] = useState([]);
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
    axios.get(`http://localhost:3000/trainingPrograms/getTrainingProgramById/${id}`)
      .then(response => {
        setBookingData(response.data);
        setTrainerID(response.data.uid);
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
          {bookingData.downloadUrl && (
            <img
              src={bookingData.downloadUrl}
              alt={bookingData.title}
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
            {bookingData.title}
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
            Fitness Level
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {bookingData.fitnessLevel}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Type of Exercise
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {bookingData.typeOfExercise}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Goal
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {bookingData.fitnessGoal}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Description
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, textAlign: 'justify', whiteSpace: 'pre-wrap' }}>
            {bookingData.desc}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Slot
          </Typography>
          {/* <List>
              {slots.map((slot, index) => (
                <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <ListItemText primary={slot} />
                </ListItem>
              ))}
            </List> */}
            {slot}
            <DeleteBooking id={bookingId} />
        </Paper>
      </Grid>
      <Outlet />
    </>
  );
}
