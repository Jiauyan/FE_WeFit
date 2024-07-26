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
    const [exercise, setExercise] = useState('');
    const [ncd, setNcd] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const { user, setUser } = useUser();
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

  const handleBack = () => {
    navigate("/viewTrainingProgram", { state: { id } });
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
            {userConsentForm ? (
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
                onClick={() => navigate('/nextStep')} // Adjust this path as necessary
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

          <FormControl component="fieldset" sx={{ width: '100%', ml: 10 }}>
            <Typography >1. Are you doing regular exercise in your life?</Typography>
            <Box>
              <RadioGroup
                    value={exercise} 
                    onChange={(e) => setExercise(e.target.value)}
                    sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: 20,
                        },
                        margin:2}}
                >
                <Box>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                {exercise === 'yes' && (
                  <TextField label="If yes, please specify" variant="standard" />
                )}
                </Box>
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>
          </FormControl>

          <FormControl component="fieldset" sx={{ width: '100%', mt: 2, ml:10 }}>
            <Typography >2. Do you know if you have any known NCD?</Typography>
            <Typography  sx={{ mt: 2, ml:2 , fontSize:15}}>
              (NCD for example: Cardiovascular disease, Metabolic disease (diabetes), Renal disease,...)
            </Typography>
            <Box>
              <RadioGroup
                    value={ncd} 
                    onChange={(e) => setNcd(e.target.value)}
                    sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: 20,
                        },
                        margin:2}}
                >
                <Box>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                {ncd === 'yes' && (
                  <TextField label="If yes, please specify" variant="standard" />
                )}
                </Box>
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>
          </FormControl>

          <Box sx={{ width: '100%', mt: 2, ml:10  }}>
            <Typography sx={{ mb: 2  }}>3. Do you have any signs or symptoms of NCD?</Typography>
            <img src={consentFormImage} alt={"consent form"} />
            </Box>
            <FormControl component="fieldset" sx={{ width: '100%', mt: 2, ml:10  }}>      
            <RadioGroup
                    value={symptoms} 
                    onChange={(e) => setSymptoms(e.target.value)}
                    sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: 20,
                        },
                        margin:2}}
                >
                <Box>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                {symptoms === 'yes' && (
                  <TextField label="If yes, please specify" variant="standard" />
                )}
                </Box>
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
          </FormControl>

          <GradientButton
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Next
          </GradientButton>
            </>
          )}
        </Paper>
      </Grid>
    </>
  );
}
