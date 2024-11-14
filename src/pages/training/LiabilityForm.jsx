import React, { useState, useEffect } from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { Typography, Paper, Button, Grid, Box, IconButton, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, TextField } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import { GradientButton } from '../../contexts/ThemeProvider';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';

export function LiabilityForm() {
    const [liabilityFormData, setLiabilityFormData] = useState({});
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [emergencyContactName, setEmergencyContactName] = useState('');
    const [emergencyContactPhoneNumber, setEmergencyContactPhoneNumber] = useState('');
    const [addLiabilityFormStatus, setAddLiabilityFormStatus] = useState('');
    const { user, updateUser, setUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const { id, pathPrev } = location.state;

  useEffect(() => {
      window.scrollTo(0, 0); // Scroll to the top of the page when the component loads
  }, []);

  useEffect(() => {
    const storedUid = localStorage.getItem('uid');
    if (storedUid) {
      setUser({ ...user, uid: storedUid });
    }
  }, []);

  const handleBack = async () => {
    navigate("/consentForm", { state: { id, pathName:"/screeningForm" , pathPrev} });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uid = user.uid;
      const response = await axios.post('https://be-um-fitness.vercel.app/consentForm/upsertConsentForm', {
        uid,
        name,
        date,
        emergencyContactName,
        emergencyContactPhoneNumber
      });
      setAddLiabilityFormStatus(response.data.message);
      navigate("/bookingDetails", { state: { id , pathPrev} });
  } catch (error) {
      if (axios.isAxiosError(error)) {
          if (error.response) {
            setAddLiabilityFormStatus(error.response.data.message);
          } else {
            setAddLiabilityFormStatus('An error occurred');
          }
      } else {
        setAddLiabilityFormStatus('An unexpected error occurred');
      }
  }
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
          padding: '32px'
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
              <IconButton onClick={handleBack}>
                <ArrowBackIos />
              </IconButton>
              <Typography>
                Step 2 of 4
              </Typography>
            </Box>
              <Typography variant="h6" component="h2" sx={{ mb: 5, fontWeight: 'bold' }}>
              Liability Waiver
              </Typography>
            <Box>
            <Typography variant="body1" gutterBottom sx={{ width: '90%', ml: 5, mb:2 }}>
                I, the undersigned, acknowledge that I am aware of my own health and physical condition and understand that participating in the training program may 
                pose certain risks to my health. Recognizing these potential risks, 
                I voluntarily choose to participate in this training program, which may be conducted by different trainers depending on the program type.
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ width: '90%', ml: 5, mb:2 }}>
                I hereby release and hold harmless the University of Malaya (UM), UM4S, program organizers, trainers, agents, and successors from any and 
                all liability for injuries, illnesses, or death that may result from my participation in this program. 
                I consent to participate in this training program and accept full responsibility for disclosing any physical limitations, 
                disabilities, ailments, or impairments that may affect my ability to engage in the activities involved.
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ width: '90%', ml: 5, mb:2 }}>
                I confirm that I understand the statements above and am aware of the potential risks involved. I have no further questions, 
                and I willingly agree to participate in this training program. 
                I understand that I am free to withdraw from the program at any time without consequence.
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                required
                margin="normal"
                fullWidth
                name="name"
                label="Name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ width: '90%', ml: 5, mb:2 }}
                />
                <TextField
                required
                margin="normal"
                fullWidth
                name="date"
                label="Date"
                id="date"
                //type="date"
                //value={date}
                onChange={(e) => setDate(e.target.value)}
                sx={{ width: '90%', ml: 5, mb:2 }}
                />
                <TextField
                required
                margin="normal"
                fullWidth
                name="emergencyContactPhoneNumber"
                label="Emergency Contact Phone Number"
                id="emergencyContactPhoneNumber"
                value={emergencyContactPhoneNumber}
                onChange={(e) => setEmergencyContactPhoneNumber(e.target.value)}
                sx={{ width: '90%', ml: 5, mb:2 }}
                />
                <TextField
                required
                margin="normal"
                fullWidth
                name="emergencyContactName"
                label="Emergency Contact Name"
                id="emergencyContactName"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                sx={{ width: '90%', ml: 5, mb:2 }}
                />
                <GradientButton
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
                >
               Confirm
                </GradientButton>
            </Box>
            </Box>
          </Paper>
        </Grid>
    </>
  );
}
