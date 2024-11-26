import React, { useState, useEffect } from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { Typography, Paper, Button, Grid, Box, IconButton, Radio, 
  CircularProgress,RadioGroup, FormControlLabel, FormControl, FormLabel, TextField } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import { GradientButton } from '../../contexts/ThemeProvider';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';

export function ScreeningForm() {
    const [screeningFormData, setScreeningFormData] = useState({});
    const [addScreeningFormStatus, setAddScreeningFormStatus] = useState('');
    const { user, updateUser, setUser } = useUser();
    const location = useLocation();
    const { id, pathPrev } = location.state;
    const [loading, setLoading] = useState(false);
    const questions = [
      { id: 'q1', text: "Has your doctor ever said that you have a heart condition and that you should only do physical activity recommended by a doctor?" },
      { id: 'q2', text: "Do you feel pain in your chest when you do physical activity?" },
      { id: 'q3', text: "In the past month, have you had chest pain when you were not doing physical activity?" },
      { id: 'q4', text: "Do you lose your balance because of dizziness or do you ever lose consciousness?" },
      { id: 'q5', text: "Do you have a bone or joint problem (for example, back, knee or hip) that could be made worse by a change in your physical activity?" },
      { id: 'q6', text: "Is your doctor currently prescribing drugs (for example, water pills) for your blood pressure or heart condition?" },
      { id: 'q7', text: "Do you know of any other reason why you should not do physical activity?" }
    ];
    const [answers, setAnswers] = useState(questions.reduce((acc, question) => ({ ...acc, [question.id]: '' }), {}));
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
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
    const newErrors = {};
    Object.keys(answers).forEach(key => {
      if (!answers[key]) {
        newErrors[key] = "This question is required.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
          q1 : answers.q1,
          q2 : answers.q2,
          q3 : answers.q3,
          q4 : answers.q4,
          q5 : answers.q5,
          q6 : answers.q6,
          q7 : answers.q7
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

  const handleChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: '' }));
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
            {questions.map((question) => (
            <FormControl key={question.id} component="fieldset" required error={!!errors[question.id]} sx={{ mb: 2 }}>
              <FormLabel sx={{ 
                color: 'black', // Ensures the text is always black
                '&.Mui-error': {
                  color: 'black' // Prevents color change on error
                }
              }}>
                {question.text}
              </FormLabel>
              <RadioGroup value={answers[question.id]} onChange={(e) => handleChange(question.id, e.target.value)}>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
              {errors[question.id] && <Typography color="error" sx={{ mt: 1 }}>{errors[question.id]}</Typography>}
            </FormControl>
          ))}
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
