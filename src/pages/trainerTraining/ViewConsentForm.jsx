import React, { useState, useEffect } from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { Typography, Paper, Grid, Box, IconButton } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowBackIos } from '@mui/icons-material';
import consentFormImage from "../../assets/consentForm.png";

export function ViewConsentForm() {
    const [consentFormData, setConsentFormData] = useState({});
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const { id, uid , studentData, slot} = location.state;
    const [q1, setQ1] = useState('');
    const [q2, setQ2] = useState('');
    const [q2_details, setQ2_details] = useState('');
    const [q3, setQ3] = useState('');
    const [q3_details, setQ3_details] = useState('');

    useEffect(() => {
        const storedUid = localStorage.getItem('uid');
        if (storedUid) {
            setUser({ ...user, uid: storedUid });
        }
    }, [user, setUser]);

    const handleBack = () => {
        navigate("/viewStudentDetails", { state: { id , studentData, slot} });
    };

    useEffect(() => {
        if (!uid) return;
        axios.get(`http://localhost:3000/consentForm/getConsentFormByUID/${uid}`)
            .then(response => {
                setConsentFormData(response.data);
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
                padding: 4,
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                    <IconButton onClick={handleBack}>
                        <ArrowBackIos />
                    </IconButton>
                </Box>
                <Typography variant="h6" component="h2" sx={{ mb: 5, fontWeight: 'bold' }}>
                    Consent Form
                </Typography>

                <Box sx={{ width: '100%', ml: 2 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>1. Are you doing regular exercise in your life?</Typography>
                    <Typography variant="body1" sx={{ mb: 3 , ml:2}}>{consentFormData?.q1}</Typography>

                    <Typography variant="body1" sx={{ mb: 1 }}>2. Do you know if you have any known NCD?</Typography>
                    <Typography variant="body2" sx={{ mb: 1, ml:2 }}>
                        (NCD for example: Cardiovascular disease, Metabolic disease (diabetes), Renal disease,...)
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, ml:2 }}>{consentFormData?.q2}</Typography>
                    {consentFormData?.q2 === 'yes' && (
                        <Typography variant="body2" sx={{ mb: 3, ml :2 }}>{consentFormData?.q2_details}</Typography>
                    )}

                    <Typography variant="body1" sx={{ mb: 1 }}>3. Do you have any signs or symptoms of NCD?</Typography>
                    <Box>
                        <img src={consentFormImage} alt={"Consent Form"} />
                    </Box>
                    <Typography variant="body1" sx={{ mb: 3}}>{consentFormData?.q3}</Typography>
                    {consentFormData?.q3 === 'yes' && (
                        <Typography variant="body2">{consentFormData?.q3_details}</Typography>
                    )}
                </Box>
            </Paper>
        </Grid>
    );
}
