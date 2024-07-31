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
    Container
} from "@mui/material";
import { useNavigate, Outlet } from 'react-router-dom';
import { useUser } from "../../contexts/UseContext";
import { id } from 'date-fns/locale';

export function Booking() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [bookings, setBookings] = useState('');
    const [trainingPrograms, setTrainingPrograms] = useState([]);
    console.log()

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
            } catch (error) {
                console.error('There was an error!', error);
            }
        };

        fetchBookings();
    }, [user?.uid]);

    const handleView = (trainingProgram) => {
        navigate("/viewBooking", { state: { id: trainingProgram.id, slot: trainingProgram.slot, bookingId : trainingProgram.bookingId} });
    };

    const handleBack = () => {
        navigate("/trainingPrograms");
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
            </Box>

            <Typography variant="h4" gutterBottom>
                My Booking
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
