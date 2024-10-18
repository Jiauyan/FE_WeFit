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

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const uid = user?.uid;
                if (!uid) return;

                // Fetch booked programs
                const response = await axios.get(`http://localhost:3000/trainingClassBooking/getAllTrainingClassBookingsByUID/${uid}`);
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
                    const response = await axios.post('http://localhost:3000/trainingPrograms/getRecommendedTrainingPrograms',{
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
            const response = await axios.get('http://localhost:3000/trainingPrograms/getAllTrainingPrograms');

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

    return (
        <Container>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
                //margin: 4,
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
                    My Booking
                </Button>
            </Box>
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
            <Outlet />
        </Container>
    );
}
