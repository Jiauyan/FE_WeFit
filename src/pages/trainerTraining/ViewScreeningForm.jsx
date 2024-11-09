import React, { useState, useEffect } from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { Typography, Paper, Grid, Box, IconButton } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowBackIos } from '@mui/icons-material';

export function ViewScreeningForm() {
    const [screeningFormData, setScreeningFormData] = useState({});
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const { id, uid , studentData, slot} = location.state;
    const [q1, setQ1] = useState('');
    const [q2, setQ2] = useState('');
    const [q3, setQ3] = useState('');
    const [q4, setQ4] = useState('');
    const [q5, setQ5] = useState('');
    const [q6, setQ6] = useState('');
    const [q7, setQ7] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page when the component loads
      }, []);
      
    useEffect(() => {
        const storedUid = localStorage.getItem('uid');
        if (storedUid) {
            setUser({ ...user, uid: storedUid });
        }
    }, [user, setUser]);

    const handleBack = () => {
        navigate("/viewStudentDetails", { state: { id: id , uid: uid, studentData, slot} });
    };

    useEffect(() => {
        if (!uid) return;
        axios.get(`http://localhost:3000/screeningForm/getScreeningFormByUID/${uid}`)
            .then(response => {
                setScreeningFormData(response.data);
            })
            .catch(error => console.error('There was an error!', error));
    }, [uid]);

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
                <Grid container item xs={12}>  
                 <IconButton onClick={handleBack}>
                        <ArrowBackIos />
                    </IconButton>
                </Grid>
                <Grid container item xs={12} justifyContent="center"> 
                <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold', textAlign:'center' }}>
                Pre-Participation Screening Form                
                </Typography>
                </Grid>
                <Box sx={{ width: '100%', px: 3 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>1. Has your doctor ever said that you have a heart condition and that you should only do physical activity recommended by a doctor?</Typography>
                    <Typography variant="body1" sx={{ mb: 3 , ml:2}}>{screeningFormData?.q1}</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>2. Do you feel pain in your chest when you do physical activity?</Typography>
                    <Typography variant="body2" sx={{ mb: 3, ml :2 }}>{screeningFormData?.q2}</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>3. In the past month, have you had chest pain when you were not doing physical actiivty?</Typography>
                    <Typography variant="body2" sx={{ mb: 3, ml :2 }}>{screeningFormData?.q3}</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>4. Do you lose your balance because of dizziness or do you ever lose consciousness?</Typography>
                    <Typography variant="body2" sx={{ mb: 3, ml :2 }}>{screeningFormData?.q4}</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>5. Do you have a bone or joint problem (for example, back, knee or hip) that could be made worse by a change in your physical activity?</Typography>
                    <Typography variant="body2" sx={{ mb: 3, ml :2 }}>{screeningFormData?.q5}</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>6. Is your doctor currently prescribing drugs (for example, water pills) for your blood pressure or heart condition?</Typography>
                    <Typography variant="body2" sx={{ mb: 3, ml :2 }}>{screeningFormData?.q6}</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>7. Do you know of any other reason why you should not do physical activity?</Typography>
                    <Typography variant="body2" sx={{ mb: 3, ml :2 }}>{screeningFormData?.q7}</Typography>
                </Box>
            </Paper>
        </Grid>
    );
}
