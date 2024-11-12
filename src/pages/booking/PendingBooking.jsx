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
} from '@mui/material';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import { useNavigate } from "react-router-dom";

const PendingBooking = () => {
    const [bookings, setBookings] = useState('');
    const [pendingTrainingPrograms, setPendingTrainingPrograms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 6; // Number of programs to display per page
    const { user } = useUser();
    const navigate = useNavigate();

    // Handle program view navigation
    const handleView = (trainingProgram) => {
        navigate("/viewBooking", { state: { id: trainingProgram.id, slot: trainingProgram.slot, bookingId : trainingProgram.bookingId} });
    };

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    useEffect(() => {
        const fetchPendingBookings = async () => {
            try {
                const uid = user?.uid;
                if (!uid) return;
    
                const response = await axios.get(`http://localhost:3000/trainingClassBooking/getAllTrainingClassBookingsByUID/${uid}`);
                setBookings(response.data);
    
                // Fetch training programs details for each booking
                const programPromises = response.data.map(async (booking) => {
                    const programResponse = await axios.get(`http://localhost:3000/trainingPrograms/getTrainingProgramById/${booking.trainingClassID}`);
                    return { 
                        ...booking, 
                        bookingId: booking.id, 
                        ...programResponse.data 
                    };
                });
    
                const programs = await Promise.all(programPromises);

                // Filter programs based on booking status
                const pendingPrograms = programs.filter(program => program.status === false); // Pending
                // Set state with filtered programs as needed
                setPendingTrainingPrograms(pendingPrograms); 
            } catch (error) {
                console.error('There was an error!', error);
            }
        };

        fetchPendingBookings();
    }, [user?.uid]);

   


    // Filter programs based on search term
    const filteredPrograms = pendingTrainingPrograms.filter(program =>
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
                    Pending Bookings
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
                label="Search Pending Bookings"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginBottom: 5, marginTop: 2 }}
            />
            {currentPrograms.length === 0 || filteredPrograms.length === 0 ? ( // Check if there are no programs
                <Typography variant="body1" color="text.secondary" align="center">
                    No Pending Booking Found.
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
                                    <Typography gutterBottom variant="h6">
                                        {program.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
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

export default PendingBooking;
