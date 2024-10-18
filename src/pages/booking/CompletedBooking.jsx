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
    IconButton
} from '@mui/material';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import { useNavigate } from "react-router-dom";
import { ArrowBackIos, Delete } from '@mui/icons-material';

const CompletedBooking = () => {
    const [bookings, setBookings] = useState('');
    const [completedTrainingPrograms, setCompletedTrainingPrograms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 9; // Number of programs to display per page
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
        const fetchCompletedBookings = async () => {
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
                const completedPrograms = programs.filter(program => program.status === true); // Pending
                // Set state with filtered programs as needed
                setCompletedTrainingPrograms(completedPrograms); 
            } catch (error) {
                console.error('There was an error!', error);
            }
        };

        fetchCompletedBookings();
    }, [user?.uid]);

   


    // Filter programs based on search term
    const filteredPrograms = completedTrainingPrograms.filter(program =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate the current programs to display based on the page
    const startIndex = (page - 1) * itemsPerPage;
    const currentPrograms = filteredPrograms.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Box padding={3}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleBack}>
              <ArrowBackIos />
            </IconButton>
                All Completed Bookings
            </Typography>
            <TextField
                fullWidth
                variant="outlined"
                label="Search Completed Bookings"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginBottom: 5, marginTop: 2 }}
            />
            {currentPrograms.length === 0 || filteredPrograms.length === 0 ? ( // Check if there are no programs
                <Typography variant="body1" color="text.secondary" align="center">
                    No Completed Booking Found.
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

export default CompletedBooking;
