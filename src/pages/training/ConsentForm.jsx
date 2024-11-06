import React, { useState, useEffect } from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { Typography, Paper, Button, Grid, Box, IconButton, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, TextField } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import { GradientButton } from '../../contexts/ThemeProvider';
import { ArrowBackIos } from '@mui/icons-material';

export function ConsentForm() {
  const [trainingProgramData, setTrainingProgramData] = useState([]);
    const [consentFormData, setConsentFormData] = useState({});
    const [trainerID, setTrainerID] = useState(null);
    const [addConsentFormStatus, setAddConsentFormStatus] = useState('');
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

  const handleBack = async () => {
    console.log(pathPrev);
    navigate("/screeningForm", { state: { id, pathName:"/screeningForm" , pathPrev} });
  };


  const handleSubmit = async () => {
      navigate("/liabilityForm", { state: { id , pathPrev} });
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
              <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
               UMFitness Training Program Consent Form
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Typography variant="body1" gutterBottom sx={{ width: '90%', ml: 5, mb:2 }}>
                    You are participating in a UMFitness training program. Your participation in this program is entirely voluntary. 
                    Please read the following information carefully. If you have any questions, feel free to approach the trainers or staff.
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ width: '90%', ml: 5, mb:2 }}>
                    <strong>Program Overview:</strong> This training program is designed to help participants achieve their fitness goals through tailored training sessions that enhance overall health and wellness. Each participant or group will be assigned a qualified trainer, specified in the training program details, who will ensure correct techniques and safety practices throughout. Trainers are assigned specifically to each program and will supervise participants for the duration of their sessions.
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ width: '90%', ml: 5, mb:2 }}>
                    <strong>Potential Risks and Discomforts:</strong> While this program is generally low-risk, some physical discomfort, such as muscle soreness, may occur. Participants confirm that they are physically fit for the program based on the Physical Activity Readiness Questionnaire (PAR-Q) or clearance by a medical professional. All relevant medical conditions or impairments have been disclosed before starting the program. The University of Malaya, its staff, and students are not liable for any injuries or accidents that may occur during the program.
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ width: '90%', ml: 5, mb:2 }}>
                    <strong>Benefits:</strong> Regular exercise offers various health benefits, such as improved cardiovascular fitness, enhanced immune and digestive functioning, balanced blood pressure, and better bone density. It can also reduce the risk of diabetes, obesity, heart disease, osteoporosis, and certain cancers while improving posture, mobility, and general well-being.
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ width: '90%', ml: 5, mb:2 }}>
                    <strong>Confidentiality:</strong> All information collected as part of this program that can identify participants will remain confidential. Participants are not obligated to disclose any information they are uncomfortable sharing.
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ width: '90%', ml: 5, mb:2 }}>
                    <strong>Enquiries:</strong> For any questions or concerns, please contact the trainer via {trainingProgramData.contactNum}. 
                </Typography>
                <GradientButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Next
                </GradientButton>
            </Box>
          </Paper>
        </Grid>
    </>
  );
}
