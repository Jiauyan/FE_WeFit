import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Typography,
    Grid,
    Pagination,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Button,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import { useNavigate } from "react-router-dom";

const RecommendedTrainingPrograms = () => {
    const [loading, setLoading] = useState(true);
    const [recommededTrainingPrograms, setRecommendedTrainingPrograms] = useState([]);
    const [bookedPrograms, setBookedPrograms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 6; // Number of programs to display per page
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0); 
      }, [page]);

    useEffect(() => {
        // Check if there's a saved page number and set it
        const savedPage = sessionStorage.getItem('lastPage');
        setPage(savedPage ? parseInt(savedPage, 10) : 1);
    }, []);

    // Handle program view navigation
    const handleView = (program) => {
        sessionStorage.setItem('lastPage', page.toString());
        navigate("/viewTrainingProgram", { state: { id: program.id , pathPrev: "/recommend"} });
    };

    const handleBack = () => {
        sessionStorage.removeItem('lastPage');
         navigate("/trainingPrograms");
    };

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const uid = user?.uid;
                if (!uid) return;
                setLoading(true);
                // Fetch booked programs
                const response = await axios.get(`https://be-um-fitness.vercel.app/trainingClassBooking/getAllTrainingClassBookingsByUID/${uid}`);
                const bookedProgramIds = response.data.map((booking) => booking.trainingClassID);
                setBookedPrograms(bookedProgramIds);
            } catch (error) {
                console.error('There was an error!', error);
            } finally {
                setLoading(false);
            };
        };

        fetchBookings();
    }, [user?.uid]);

    useEffect(() => {
            const fetchRecommendedTrainingPrograms = async () => {
                try {
                    const uid = user?.uid;
                    if (!uid) return;
                    setLoading(true);
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
                } finally {
                    setLoading(false);
                };
            };

            fetchRecommendedTrainingPrograms();
        }, [user?.uid, bookedPrograms]);


    // Filter programs based on search term
    const filteredPrograms = recommededTrainingPrograms.filter(program =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate the current programs to display based on the page
    const startIndex = (page - 1) * itemsPerPage;
    const currentPrograms = filteredPrograms.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Box padding={3}>
            <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                    Recommended For You
                </Typography>
                <Button
                    onClick={handleBack}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, mb: 2 }}
                >
                    Back
                </Button>
            </Box>
            <TextField
                fullWidth
                variant="outlined"
                label="Search Recommended Training Programs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginBottom: 5, marginTop: 2 }}
            />
             {currentPrograms.length === 0 || filteredPrograms.length === 0 ? ( // Check if there are no programs
                <Typography variant="body1" color="text.secondary" align="center">
                    No Recommended Training Programs Found.
                </Typography>
            ) : (
                <>
             <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="start" marginTop={3}>
                {currentPrograms.map((program) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={program.id}>
                        <Card
                            sx={{
                                width: '100%',
                                height: '100%',
                                boxShadow: 3,
                                transition: "0.3s",
                                "&:hover": { boxShadow: 10 },
                            }}
                            onClick={() => handleView(program)}
                        >
                            <CardActionArea
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={program.downloadUrl}
                                    alt={program.title}
                                    sx={{
                                        height: 220,
                                        width: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" align="center">
                                        {program.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        {program.fitnessLevel}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Pagination
                count={Math.ceil(filteredPrograms.length / itemsPerPage)}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                sx={{ marginTop: 3, display: 'flex', justifyContent: 'center' }}
            />
            </>
            )}
        </Box>
    );
};

export default RecommendedTrainingPrograms;
