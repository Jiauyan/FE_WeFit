import React, { useState, useEffect } from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { Typography, Paper, Button, Grid, Box, IconButton, Radio, 
  CircularProgress,RadioGroup, FormControlLabel, FormControl, FormLabel, TextField } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import { GradientButton } from '../../contexts/ThemeProvider';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';

export function ScreeningForm() {
  const [loading, setLoading] = useState(false);
    const [screeningFormData, setScreeningFormData] = useState({});
    const [q1, setQ1] = useState('');
    const [q2, setQ2] = useState('');
    const [q3, setQ3] = useState('');
    const [q4, setQ4] = useState('');
    const [q5, setQ5] = useState('');
    const [q6, setQ6] = useState('');
    const [q7, setQ7] = useState('');
    const [addScreeningFormStatus, setAddScreeningFormStatus] = useState('');
    const { user, updateUser, setUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const { id, pathPrev } = location.state;
    //const userScreeningForm = user.screeningForm;

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
    navigate("/viewTrainingProgram", { state: { id, pathName:"/screeningForm" , pathPrev} });
  };

  const validateForm = () => {
    if (!q1) {
        setAddPlanError("Title is required.");
        return false;
    }
    if (!q2) {
        setAddPlanError("Date is required.");
        return false;
    }
     if (!q3) {
        setAddActivityError("Fitness acitvity is required.");
        return false;
    }
    return true
    };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const uid = user.uid;
      const response = await axios.post('https://be-um-fitness.vercel.app/screeningForm/upsertScreeningForm', {
          uid,
          q1,
          q2,
          q3,
          q4,
          q5,
          q6,
          q7
      });
      setAddScreeningFormStatus(response.data.message);
      navigate("/consentForm", { state: { id, pathPrev} });
  } catch (error) {
      if (axios.isAxiosError(error)) {
          if (error.response) {
            setAddScreeningFormStatus(error.response.data.message);
          } else {
            setAddScreeningFormStatus('An error occurred');
          }
      } else {
        setAddScreeningFormStatus('An unexpected error occurred');
      }
  } finally {
    setLoading(false)
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
              <IconButton onClick={handleBack}>
                <ArrowBackIos />
              </IconButton>
              <Typography>
                Step 1 of 4
              </Typography>
            </Box>
            <Grid container item xs={12} justifyContent="center"> 
                <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold', textAlign:'center' }}>
                Pre-Participation Screening Form                
                </Typography>
                </Grid>
            <Box component="form" onSubmit={handleSubmit} noValidate  sx={{ width: '100%', px: 3 }}>
              <FormControl component="fieldset" required>
                <Typography> 1. Has your doctor ever said that you have a heart condition and that you should only do physical activity recommended by a doctor?</Typography>
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

              <FormControl component="fieldset" required>
                <Typography> 2. Do you feel pain in your chest when you do physical activity?</Typography>
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
                </Box>
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Box>
              </FormControl>

              <FormControl component="fieldset" required >
                <Typography> 3. In the past month, have you had chest pain when you were not doing physical actiivty?</Typography>
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
                </Box>
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Box>
              </FormControl>

              <FormControl component="fieldset" required>
                <Typography> 4. Do you lose your balance because of dizziness or do you ever lose consciousness?</Typography>
                <Box>
                  <RadioGroup
                        noValidate
                        value={q4} 
                        onChange={(e) => setQ4(e.target.value)}
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

              <FormControl component="fieldset" required>
                <Typography sx={{overflowWrap: 'break-word'}}> 
                  5. Do you have a bone or joint problem (for example, back, knee or hip) that could be made worse by a change in your physical activity?</Typography>
                <Box>
                  <RadioGroup
                        noValidate
                        value={q5} 
                        onChange={(e) => setQ5(e.target.value)}
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

              <FormControl component="fieldset" required>
                <Typography> 6. Is your doctor currently prescribing drugs (for example, water pills) for your blood pressure or heart condition?</Typography>
                <Box>
                  <RadioGroup
                        noValidate
                        value={q6} 
                        onChange={(e) => setQ6(e.target.value)}
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

              <FormControl component="fieldset" required>
                <Typography> 7. Do you know of any other reason why you should not do physical activity?</Typography>
                <Box>
                  <RadioGroup
                        noValidate
                        value={q7} 
                        onChange={(e) => setQ7(e.target.value)}
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

              <GradientButton
                type = "submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                 {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
              </GradientButton>
            </Box>
          </Paper>
        </Grid>
  );
}
