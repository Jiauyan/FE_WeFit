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
    Container,
    IconButton,
    TextField,
    Pagination
} from "@mui/material";
import { useNavigate, Outlet } from 'react-router-dom';
import { useUser } from "../../contexts/UseContext";
import { id } from 'date-fns/locale';
import SectionBooking from './SectionBooking';
import { ArrowBackIos, Delete } from '@mui/icons-material';

export function Booking() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [bookings, setBookings] = useState('');
    const [trainingPrograms, setTrainingPrograms] = useState([]);
    const [pendingTrainingPrograms, setPendingTrainingPrograms] = useState([]);
    const [completedTrainingPrograms, setCompletedTrainingPrograms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchBookings = async () => {
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
                setTrainingPrograms(programs);
                // Filter programs based on booking status
                const pendingPrograms = programs.filter(program => program.status === false); // Pending
                const completedPrograms = programs.filter(program => program.status === true); // Completed
                // Set state with filtered programs as needed
                setPendingTrainingPrograms(pendingPrograms); // If you want to store pending separately
                setCompletedTrainingPrograms(completedPrograms); // If you want to store completed separately
            } catch (error) {
                console.error('There was an error!', error);
            }
        };
    
        fetchBookings();
    }, [user?.uid]);

    const handleBack = () => {
        navigate("/trainingPrograms");
    };

    const handleView = (trainingProgram) => {
        navigate("/viewBooking", { state: { id: trainingProgram.id, slot: trainingProgram.slot, bookingId : trainingProgram.bookingId} });
    };

    // Filter programs based on search term
    const filteredBookings = trainingPrograms.filter(booking =>
        booking.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate the current programs to display based on the page
    const startIndex = (page - 1) * itemsPerPage;
    const currentBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);


    return (
        <Box padding={3}>
            <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                    My Bookings
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
                label="Search Bookings"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginTop: 2}}
            />
            {searchTerm && filteredBookings.length && currentBookings.length > 0 ? (
                <>
                    <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="start" marginTop={3}>
                        {currentBookings.map((program) => (
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
                    count={Math.ceil(filteredBookings.length / itemsPerPage)}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                    sx={{ marginTop: 3, display: 'flex', justifyContent: 'center' }}
                /></>
                ) : searchTerm && filteredBookings.length === 0 ? (
                    <Typography variant="body1" color="text.secondary" align="center" marginTop={5}>
                        No Booking Found.
                    </Typography>
                ) : (
                    <>
                        <SectionBooking
                            title="Pending Bookings"
                            programs={pendingTrainingPrograms}
                            onSeeAll={() => navigate("/pendingBooking")}
                        />
                        
                        <SectionBooking
                            title="Completed Bookings"
                            programs={completedTrainingPrograms}
                            onSeeAll={() => navigate("/completedBooking")}
                        />
                        </>
                )}
            </Box>
    );
}
