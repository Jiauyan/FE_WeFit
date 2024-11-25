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
const IntermediateTrainingPrograms = () => {
    const [loading, setLoading] = useState(true);
    const [intermediateTrainingPrograms, setIntermediateTrainingPrograms] = useState([]);
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
        navigate("/viewTrainingProgram", { state: { id: program.id , pathPrev: "/intermediate"} });
    };

    const handleBack = () => {
        sessionStorage.removeItem('lastPage');
        navigate("/trainingPrograms");
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.uid) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Fetch booked programs
                const bookingsResponse = await axios.get(`https://be-um-fitness.vercel.app/trainingClassBooking/getAllTrainingClassBookingsByUID/${user.uid}`);
                const bookedProgramIds = bookingsResponse.data.map(booking => booking.trainingClassID);
                
                // Fetch all training programs
                const programsResponse = await axios.get('https://be-um-fitness.vercel.app/trainingPrograms/getAllTrainingPrograms');
                const availablePrograms = programsResponse.data.filter(program => !bookedProgramIds.includes(program.id));
                
                // Filter for intermediate programs
                const intermediatePrograms = availablePrograms.filter(program => program.fitnessLevel === 'Intermediate');

                // Set states
                setBookedPrograms(bookedProgramIds);
                setIntermediateTrainingPrograms(intermediatePrograms);
            } catch (error) {
                console.error('There was an error!', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.uid]);

    // Filter programs based on search term
    const filteredPrograms = intermediateTrainingPrograms.filter(program =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate the current programs to display based on the page
    const startIndex = (page - 1) * itemsPerPage;
    const currentPrograms = filteredPrograms.slice(startIndex, startIndex + itemsPerPage);

    if (loading) {
        return (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
          </Box>
        );
    }

    return (
        <Box padding={3}>
            <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                Intermediate Training Programs
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
                label="Search Intermediate Training Programs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginBottom: 5, marginTop: 2 }}
            />
            {currentPrograms.length === 0 || filteredPrograms.length === 0 ? ( // Check if there are no programs
                <Typography variant="body1" color="text.secondary" align="center">
                    No Intermediate Training Programs Found.
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

export default IntermediateTrainingPrograms;
