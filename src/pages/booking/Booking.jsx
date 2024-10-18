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
    IconButton
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

    return (
        <Container>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start',
            }}>
               
            <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', marginTop:5 }}>
            <IconButton onClick={handleBack}>
              <ArrowBackIos />
            </IconButton> 
                My Booking
            </Typography>
            </Box>

            <SectionBooking
                title="Pending Booking"
                programs={pendingTrainingPrograms}
                onSeeAll={() => navigate("/pendingBooking")}
            />
            
            <SectionBooking
                title="Completed Booking"
                programs={completedTrainingPrograms}
                onSeeAll={() => navigate("/completedBooking")}
            />
            <Outlet />
        </Container>
    );
}
