import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Typography,
    Card,
    Button,
    CardMedia,
    CardContent,
    CardActionArea,
    Grid,
    Box,
    IconButton,
    Container
} from "@mui/material";
import { useNavigate, Outlet } from 'react-router-dom';
import { useUser } from "../../contexts/UseContext";
import { ArrowBackIos } from '@mui/icons-material';

export function TrainingPrograms() {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [trainingPrograms, setTrainingPrograms] = useState([]);
    const [recommendedTrainingPrograms, setRecommendedTrainingPrograms] = useState([]);
    
    useEffect(() => {
            const fetchRecommendedTrainingPrograms = async () => {
                try {
                    const uid = user?.uid;
                    if (!uid) return;
                    const fitnessLevel = user.data.fitnessLevel;
                    const fitnessGoal = user.data.fitnessGoal;
                    const favClass = user.data.favClass;
                    const response = await axios.post('http://localhost:3000/trainingPrograms/getRecommendedTrainingPrograms',{
                      fitnessLevel,
                      fitnessGoal,
                      favClass
                    });
                    setRecommendedTrainingPrograms(response.data);
                } catch (error) {
                    console.error('There was an error!', error);
                }
            };

            fetchRecommendedTrainingPrograms();
        }, [user?.uid]);

    useEffect(() => {
        const fetchTrainingPrograms = async () => {
            try {
                const uid = user?.uid;
                if (!uid) return;
                const response = await axios.get('http://localhost:3000/trainingPrograms/getAllTrainingPrograms');
                setTrainingPrograms(response.data);
            } catch (error) {
                console.error('There was an error!', error);
            }
        };

        fetchTrainingPrograms();
    }, [user?.uid]);

   
    const handleView = async (trainingProgram) => {
        const trainingProgramId = trainingProgram.id;
        navigate("/viewTrainingProgram", { state: { id: trainingProgramId } });
    };

    const handleBack = async () => {
        navigate("/training");
    };

    const handleViewMyBooking = async () => {
        navigate("/myBooking");
    };

    return (
        <Container>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
                margin: 4,
            }}>
                <Button
                    onClick={handleBack}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2, mr: 2 }}
                >
                    Back
                </Button>
                <Button
                    //onClick={handleAdd}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2, mr: 2 }}
                >
                    Recommended
                </Button>
                <Button
                    onClick={handleViewMyBooking}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                >
                    My Booking
                </Button>
            </Box>

            <Typography variant="h4" gutterBottom>
                Recommended Training Programs
            </Typography>
            <Grid container padding={4} spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="center" marginTop={2}>
                {recommendedTrainingPrograms.map((trainingProgram, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                width: '100%',
                                height: '100%',
                                boxShadow: 3,
                                transition: "0.3s",
                                '&:hover': { boxShadow: 10 },
                            }}
                            onClick={() => handleView(trainingProgram)}
                        >
                            <CardActionArea sx={{ display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    image={trainingProgram.downloadUrl}
                                    alt={trainingProgram.title}
                                    sx={{
                                        height: 220,
                                        width: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5">
                                        {trainingProgram.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {trainingProgram.fitnessLevel}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h4" gutterBottom marginTop={4}>
                All Training Programs
            </Typography>
            <Grid container padding={4} spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="center" marginTop={2}>
                {trainingPrograms.map((trainingProgram, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                width: '100%',
                                height: '100%',
                                boxShadow: 3,
                                transition: "0.3s",
                                '&:hover': { boxShadow: 10 },
                            }}
                            onClick={() => handleView(trainingProgram)}
                        >
                            <CardActionArea sx={{ display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    image={trainingProgram.downloadUrl}
                                    alt={trainingProgram.title}
                                    sx={{
                                        height: 220,
                                        width: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5">
                                        {trainingProgram.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {trainingProgram.fitnessLevel}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Outlet />
        </Container>
    );
}
