import React, { useState, useEffect } from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { Typography, Paper, Button, Grid, Box, IconButton, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, TextField } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import { GradientButton } from '../../contexts/ThemeProvider';
import { ArrowBackIos } from '@mui/icons-material';
import consentFormImage from "../../assets/consentForm.png";
import completeImage from "../../assets/completeImage.png"

export function ConsentForm() {
    const [consentFormData, setConsentFormData] = useState({});
    const [q1, setQ1] = useState('');
    const [q2, setQ2] = useState('');
    const [q2_details, setQ2_details] = useState('');
    const [q3, setQ3] = useState('');
    const [q3_details, setQ3_details] = useState('');
    const [addConsentFormStatus, setAddConsentFormStatus] = useState('');
    const { user, updateUser, setUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state;
    const userConsentForm = user.consentForm;
    
  useEffect(() => {
    const storedUid = localStorage.getItem('uid');
    if (storedUid) {
      setUser({ ...user, uid: storedUid });
    }
  }, []);

  const handleBack = async () => {
    navigate("/viewTrainingProgram", { state: { id } });
  };

  const handleBook = async () => {
    navigate("/bookingDetails", { state: { id } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uid = user.uid;
      const response = await axios.post('http://localhost:3000/consentForm/addConsentForm', {
          uid,
          q1,
          q2,
          q2_details,
          q3,
          q3_details
      });
      setAddConsentFormStatus(response.data.message);
      updateUser(({ ...user, consentForm: response.data }));
      navigate("/bookingDetails", { state: { id } });
  } catch (error) {
      if (axios.isAxiosError(error)) {
          if (error.response) {
            setAddConsentFormStatus(error.response.data.message);
          } else {
            setAddConsentFormStatus('An error occurred');
          }
      } else {
        setAddConsentFormStatus('An unexpected error occurred');
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
          padding: 4 
        }}>
            {userConsentForm && Object.keys(userConsentForm).length > 0 ? (
            <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            <IconButton onClick={handleBack}>
              <ArrowBackIos />
            </IconButton>
            <Typography>
              Step 1 of 2
            </Typography>
            </Box>
              <Typography variant="h6" component="h2" sx={{ mb: 5, fontWeight: 'bold' }}>
                Consent Form
              </Typography>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <img src={completeImage} alt="Completed" style={{ width: '100px', marginBottom: '16px' }} /> 
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1A237E', mb:3, mt :3 }}>
                  You had completed your consent form.
                </Typography>
                <Typography variant="body2" sx={{ color: '#757575' }}>
                  You can skip this step and proceed to the next step.
                </Typography>
            </Box>
            <GradientButton
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleBook} // Adjust this path as necessary
            >
              Next
            </GradientButton>
            </>
          ) : (
            <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
              <IconButton onClick={handleBack}>
                <ArrowBackIos />
              </IconButton>
              <Typography>
                Step 1 of 2
              </Typography>
            </Box>
              <Typography variant="h6" component="h2" sx={{ mb: 5, fontWeight: 'bold' }}>
                Consent Form
              </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <FormControl component="fieldset" sx={{ width: '100%', ml: 5 }}>
                <Typography> 1. Are you doing regular exercise in your life?</Typography>
                <Box>
                  <RadioGroup
                        noValidate
                        value={q1} 
                        onChange={(e) => setQ1(e.target.value)}
                        sx={{
                            '& .MuiSvgIcon-root': {
                              fontSize: 20,
                            },
                            margin:2}}
                  >
                <Box>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                </Box>
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Box>
              </FormControl>

              <FormControl component="fieldset" sx={{ width: '100%', mt: 2, ml:5 }}>
                <Typography >2. Do you know if you have any known NCD?</Typography>
                <Typography  sx={{ mt: 2, ml:2 , fontSize:15}}>
                  (NCD for example: Cardiovascular disease, Metabolic disease (diabetes), Renal disease,...)
                </Typography>
                <Box>
                  <RadioGroup
                        noValidate
                        value={q2} 
                        onChange={(e) => setQ2(e.target.value)}
                        sx={{
                            '& .MuiSvgIcon-root': {
                              fontSize: 20,
                            },
                            margin:2}}
                  >
                <Box>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  {q2 === 'yes' && (
                    <TextField label="If yes, please specify" variant="standard" onChange={(e) => setQ2_details(e.target.value)}/>
                  )}
                </Box>
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Box>
              </FormControl>

              <FormControl component="fieldset" sx={{ width: '100%', mt: 2, ml:5 }}>
                <Typography sx={{ mb: 2  }}>3. Do you have any signs or symptoms of NCD?</Typography>
                <Box><img src={consentFormImage} alt={"consent form"} /></Box>
                <Box>     
                  <RadioGroup
                        noValidate
                        value={q3} 
                        onChange={(e) => setQ3(e.target.value)}
                        sx={{
                            '& .MuiSvgIcon-root': {
                              fontSize: 20,
                            },
                            margin:2}}
                  >
                <Box>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  {q3 === 'yes' && (
                    <TextField label="If yes, please specify" variant="standard" onChange={(e) => setQ3_details(e.target.value)} />
                  )}
                </Box>
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                  </Box>
              </FormControl>

              <GradientButton
                type = "submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Next
              </GradientButton>
            </Box>
              </>
            )}
          </Paper>
        </Grid>
    </>
  );
}
