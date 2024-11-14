import React, { useState, useEffect } from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { Typography, Paper, Grid, Box, IconButton, Pagination } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import  ArrowBackIos from '@mui/icons-material/ArrowBackIos';

export function ViewConsentForm() {
    const [trainingProgramData, setTrainingProgramData] = useState([]);
    const [consentFormData, setConsentFormData] = useState({});
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const { id, uid, studentData, slot } = location.state;
    const [page, setPage] = useState(1); // Track current page

    const handleBack = () => {
        if (page === 1) {
            navigate("/viewStudentDetails", { state: { id: id, studentData: studentData, slot: slot, uid: uid } });
        } else {
            setPage(page - 1); // Go back to previous page
        }
    };

    useEffect(() => {
        const uid = user?.uid;
        if (!uid) return;
        axios.get(`https://be-um-fitness.vercel.app/trainingPrograms/getTrainingProgramById/${id}`)
          .then(response => {
            setTrainingProgramData(response.data);
            setTrainerID(response.data.uid);
          })
          .catch(error => console.error('There was an error!', error));
      }, [user?.uid]);

    useEffect(() => {
        window.scrollTo(0, 0); 
      }, [page]);

    useEffect(() => {
        if (!uid) return;
        axios.get(`https://be-um-fitness.vercel.app/consentForm/getConsentFormByUID/${uid}`)
            .then(response => {
                setConsentFormData(response.data);
            })
            .catch(error => console.error('There was an error!', error));
    }, [uid]);

    const handlePageChange = (event, value) => {
        setPage(value); // Update page number when pagination changes
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
                <Grid container item xs={12}>
                    <IconButton onClick={handleBack}>
                        <ArrowBackIos />
                    </IconButton>
                </Grid>
                <Grid container item xs={12} justifyContent="center">
                    <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                        {page === 1 ? "UMFitness Training Program Consent Form" : "Liability Waiver"}
                    </Typography>
                </Grid>

                <Box sx={{ width: '100%', px: 3 }}>
                    {page === 1 ? (
                        <>
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
                                    <strong>Enquiries:</strong> For any questions or concerns, please contact the trainer via {trainingProgramData?.contactNum} 
                                </Typography>
                        </>
                    ) : (
                        <>
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
                            <Box
                                sx={{ 
                                    mt: 1, 
                                    width: '100%', 
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'flex-start', // Align text to the start
                                    paddingLeft: { xs: 1, sm: 4, md: 5 }, // Responsive padding
                                }}
                            >
                                <Box sx={{ width: '100%', mt: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                            Name:
                                        </Typography>
                                        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{consentFormData.name}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                            Date:
                                        </Typography>
                                        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{consentFormData.date}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                            Emergency Contact Phone Number:
                                        </Typography>
                                        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{consentFormData.emergencyContactPhoneNumber}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                            Emergency Contact Name:
                                        </Typography>
                                        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{consentFormData.emergencyContactName}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination
                            count={2}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            sx={{ mb: 3 }}
                        />
                    </Box>
                </Box>
            </Paper>
        </Grid>
    );
}
