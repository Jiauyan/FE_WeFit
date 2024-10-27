import React, { useState, useEffect } from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { Typography, Paper, Avatar, Button, Grid, Box, IconButton, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { GradientButton } from '../../contexts/ThemeProvider';
import { ArrowBackIos, Delete, Cancel, CheckCircle} from '@mui/icons-material';

export function ViewTrainingProgram() {
  const [trainingProgramData, setTrainingProgramData] = useState([]);
  const [trainerID, setTrainerID] = useState(null);
  const [trainer, setTrainer] = useState({});
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { id, pathName, pathPrev } = location.state;

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

  const handleBack = () => {
    console.log(pathPrev);
    console.log(pathName);
    if (pathPrev === "/recommend" && pathName === "/consentForm") {
      navigate("/recommededTrainingPrograms");
    } else if (pathName === "/consentForm") {
      navigate("/trainingPrograms", { state: { id } });
    } else {
      navigate(-1);
    }
  };

  const handleBook = async (id) => {
    console.log(pathPrev);
    navigate("/consentForm",{ state: { id, pathPrev } });
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
            {trainingProgramData.typeOfTrainingProgram}
          </Typography>
          {trainingProgramData.typeOfTrainingProgram === 'Group Classes' && (
            <Box>
            <Typography
              variant="h6"
              type= "number"
              component="h2"
              sx={{ mb: 2, fontWeight: 'bold' }}
            >
              Capacity
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
              {trainingProgramData.capacity}
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
            {trainingProgramData.feeType}
          </Typography>
          {trainingProgramData.feeType === 'Paid' && (
            <Box>
            <Typography
              variant="h6"
              component="h2"
              sx={{ mb: 2, fontWeight: 'bold' }}
            >
              Fee Amount
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
              RM {trainingProgramData.feeAmount}
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
            {trainingProgramData.venueType}
          </Typography>
          {trainingProgramData.venueType === 'Physical' && (
            <Box>
            <Typography
              variant="h6"
              component="h2"
              sx={{ mb: 2, fontWeight: 'bold',textAlign: 'center' }}
            >
              Venue
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
              {trainingProgramData.venue}
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
              <ListItem 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  //backgroundColor: slot.status ? '#ffebee' : '#e8f5e9', // Light red for full, light green for available
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center'}}>
                      <Typography variant="body1" component="span" sx={{ marginRight: 1 }}>
                        {slot.time}
                      </Typography>
                      {slot.status ? (
                        <Cancel sx={{ fontSize: '1rem', marginRight: 1, color: slot.status ? 'red' : 'green'  }}/>
                      ) : (
                        <CheckCircle sx={{ fontSize: '1rem', marginRight: 1, color: slot.status ? 'red' : 'green'  }}/>
                      )}
                      <Typography variant="body1" component="span" sx={{ fontWeight: slot.status ? 'bold' : 'normal' , color: slot.status ? 'red' : 'green' }}>
                        {slot.status ? "Full" : "Available"}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
          <GradientButton
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => handleBook(id)}
          >
            Book
          </GradientButton>
        </Paper>
      </Grid>
      <Outlet />
    </>
  );
}
