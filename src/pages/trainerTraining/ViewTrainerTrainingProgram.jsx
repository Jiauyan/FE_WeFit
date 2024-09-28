import React, { useState, useEffect } from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { Typography, Paper, Avatar, Button, Grid, Box, IconButton, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { DeleteTrainingProgram } from './DeleteTrainingProgram';
import { GradientButton } from '../../contexts/ThemeProvider';
import { ArrowBackIos, Delete } from '@mui/icons-material';
import { SelectSlot } from './SelectSlot';

export function ViewTrainerTrainingProgram() {
  const [trainingProgramData, setTrainingProgramData] = useState([]);
  const [trainingProgramUserID, setTrainingProgramUserID] = useState(null);
  const [trainingProgramUser, setTrainingProgramUser] = useState({});
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state;

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
        setTrainingProgramData(response.data);
        setTrainingProgramUserID(response.data.uid);
      })
      .catch(error => console.error('There was an error!', error));
  }, [user?.uid]);

  useEffect(() => {
    const uid = trainingProgramUserID;
    if (!uid) return;
    axios.get(`http://localhost:3000/auth/getUserById/${uid}`)
      .then(response => {
        setTrainingProgramUser(response.data);
      })
      .catch(error => console.error('There was an error!', error));
  }, [trainingProgramUserID]);

  const handleEdit = async (id) => {
    navigate("/editTrainingProgram", { state: { id: id } });
  };

  const handleBack = async () => {
    navigate("/trainerTrainingPrograms");
  };

  const slots = Array.isArray(trainingProgramData.slots) ? trainingProgramData.slots : [];

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
          {trainingProgramData.downloadUrl && (
            <img
              src={trainingProgramData.downloadUrl}
              alt={trainingProgramData.title}
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
            {trainingProgramData.title}
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
              alt={trainingProgramUser.username}
              src={trainingProgramUser.photoURL}
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Typography variant="body1">
              {trainingProgramUser.username}
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
            {trainingProgramData.fitnessLevel}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Type of Exercise
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {trainingProgramData.typeOfExercise}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Goal
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {trainingProgramData.fitnessGoal}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Description
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, textAlign: 'justify', whiteSpace: 'pre-wrap' }}>
            {trainingProgramData.desc}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Available Slots
          </Typography>
          <List>
              {slots.map((slot, index) => (
                <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <ListItemText primary={slot} />
                </ListItem>
              ))}
            </List>
          <SelectSlot id={id}></SelectSlot>
          <GradientButton
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => handleEdit(id)}
          >
            Edit
          </GradientButton>
          <DeleteTrainingProgram id={id} />
        </Paper>
      </Grid>
      <Outlet />
    </>
  );
}
