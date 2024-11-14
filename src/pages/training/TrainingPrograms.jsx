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
    TextField,
    Pagination
} from "@mui/material";
import { useNavigate, Outlet } from 'react-router-dom';
import { useUser } from "../../contexts/UseContext";
import Section from './Section';


export function TrainingPrograms() {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [trainingPrograms, setTrainingPrograms] = useState([]);
    const [recommendedTrainingPrograms, setRecommendedTrainingPrograms] = useState([]);
    const [bookedPrograms, setBookedPrograms] = useState([]);
    const [beginnerPrograms, setBeginnerPrograms] = useState([]);
    const [intermediatePrograms, setIntermediatePrograms] = useState([]);
    const [advancedPrograms, setAdvancedPrograms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const uid = user?.uid;
                if (!uid) return;

                // Fetch booked programs
                const response = await axios.get(`https://be-um-fitness.vercel.app/trainingClassBooking/getAllTrainingClassBookingsByUID/${uid}`);
                const bookedProgramIds = response.data.map((booking) => booking.trainingClassID);
                setBookedPrograms(bookedProgramIds);
            } catch (error) {
                console.error('There was an error!', error);
            }
        };

        fetchBookings();
    }, [user?.uid]);

    useEffect(() => {
            const fetchRecommendedTrainingPrograms = async () => {
                try {
                    const uid = user?.uid;
                    if (!uid) return;
                    const fitnessLevel = user.data.fitnessLevel;
                    const fitnessGoal = user.data.fitnessGoal;
                    const favClass = user.data.favClass;
                    const response = await axios.post('https://be-um-fitness.vercel.app/trainingPrograms/getRecommendedTrainingPrograms',{
                      fitnessLevel,
                      fitnessGoal,
                      favClass
                    });
                     const availableRecommendedPrograms = response.data.filter((program) => !bookedPrograms.includes(program.id));
                setRecommendedTrainingPrograms(availableRecommendedPrograms);
                } catch (error) {
                    console.error('There was an error!', error);
                }
            };

            fetchRecommendedTrainingPrograms();
        }, [user?.uid, bookedPrograms]);

    useEffect(() => {
    const fetchTrainingPrograms = async () => {
        try {
            const uid = user?.uid;
            if (!uid) return;

            // Fetch all training programs
            const response = await axios.get('https://be-um-fitness.vercel.app/trainingPrograms/getAllTrainingPrograms');

            // Filter out booked programs
            const availablePrograms = response.data.filter(
                (program) => !bookedPrograms.includes(program.id)
            );

            // Categorize by fitness level
            const beginner = availablePrograms.filter((program) => program.fitnessLevel === 'Beginner');
            const intermediate = availablePrograms.filter((program) => program.fitnessLevel === 'Intermediate');
            const advanced = availablePrograms.filter((program) => program.fitnessLevel === 'Advanced');

            // Set state
            setTrainingPrograms(availablePrograms);
            setBeginnerPrograms(beginner);
            setIntermediatePrograms(intermediate);
            setAdvancedPrograms(advanced);
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    fetchTrainingPrograms();
    }, [user?.uid, bookedPrograms]);

   
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

    const filteredTrainingPrograms = trainingPrograms.filter(trainingProgram =>
        trainingProgram.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Calculate the current programs to display based on the page
    const startIndex = (page - 1) * itemsPerPage;
    const currentTrainingPrograms = filteredTrainingPrograms.slice(startIndex, startIndex + itemsPerPage);


    return (
            <Box padding={3}>
            <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}> 
            <Typography variant="h5" sx={{display: 'flex', alignItems: 'center' }}>  
              Training Programs
            </Typography>
                <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'end'
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
                    onClick={handleViewMyBooking}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                >
                    My Bookings
                </Button>
                </Box>
            </Box>
            <TextField
                fullWidth
                variant="outlined"
                label="Search Training Programs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginTop: 2}}
            />
            {searchTerm && filteredTrainingPrograms.length && currentTrainingPrograms.length > 0 ? (
                <>
                    <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="start" marginTop={3}>
                        {currentTrainingPrograms.map((program) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={program.id} marginTop={5}>
                                <Card
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        boxShadow: 3,
                                        transition: "0.3s",
                                        '&:hover': { boxShadow: 10 },
                                    }}
                                    onClick={() => handleView(program)}
                                >
                                    <CardActionArea sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <CardMedia
                                            component="img"
                                            image={program.downloadUrl}
                                            alt={program.title}
                                            sx={{ height: 220, objectFit: 'cover' }}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography gutterBottom variant="h6" align="center">{program.title}</Typography>
                                            <Typography variant="body2" color="text.secondary" align="center">{program.fitnessLevel}</Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Pagination
                    count={Math.ceil(filteredTrainingPrograms.length / itemsPerPage)}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                    sx={{ marginTop: 3, display: 'flex', justifyContent: 'center' }}
                /></>
                ) : searchTerm && filteredTrainingPrograms.length === 0 ? (
                    <Typography variant="body1" color="text.secondary" align="center" marginTop={5}>
                        No Training Programs Found.
                    </Typography>
                ) : (
                    <>
                        <Section
                            title="Recommended for You"
                            programs={recommendedTrainingPrograms}
                            onSeeAll={() => navigate("/recommededTrainingPrograms")}
                        />
                        <Section
                            title="Beginner Training Programs"
                            programs={beginnerPrograms}
                            onSeeAll={() => navigate("/beginnerTrainingPrograms")}
                        />
                        <Section
                            title="Intermediate Training Programs"
                            programs={intermediatePrograms}
                            onSeeAll={() => navigate("/intermediateTrainingPrograms")}
                        />
                        <Section
                            title="Advanced Training Programs"
                            programs={advancedPrograms}
                            onSeeAll={() => navigate("/advancedTrainingPrograms")}
                        />
                        </>

                )}
            </Box>
    );
}
