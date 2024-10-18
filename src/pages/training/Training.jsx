import { Typography, Box, Card, CardContent, CardActionArea } from "@mui/material";
import { FitnessCenter, Assignment } from "@mui/icons-material"; // Icons
import { useNavigate } from 'react-router-dom';

export function Training() {
    const navigate = useNavigate();

    const handleCustomiseFitnessPlan = () => {
        navigate("/fitnessPlan");
    };

    const handleJoinTrainingProgram = () => {
        navigate("/trainingPrograms");
    };


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80vh',
                width: '100%',
                boxSizing: 'border-box',
                gap: 5, // Space between cards
            }}
        >
            <Card sx={{
                width: '100%',
                maxWidth: 600, 
                margin: 2,
                boxShadow: 3, 
                '&:hover': {
                    boxShadow: 6}}}>
                <CardActionArea onClick={handleCustomiseFitnessPlan}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Assignment fontSize="large" color="primary" />
                        <Box>
                            <Typography variant="h5" component="div" gutterBottom>
                                Customise Fitness Plan
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Craft a workout routine tailored to your schedule, location, and fitness level. 
                                Take control of your fitness journey by setting your own pace and goals.
                            </Typography>
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Card>

            <Card  sx={{
                width: '100%',
                maxWidth: 600, 
                margin: 2, 
                boxShadow: 3, 
                '&:hover': {
                    boxShadow: 6}}}>
                <CardActionArea onClick={handleJoinTrainingProgram}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FitnessCenter fontSize="large" color="primary" />
                        <Box>
                            <Typography variant="h5" component="div" gutterBottom>
                                Join Training Program
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Choose from our range of expert-designed training programs. 
                                Stay motivated and achieve your goals with structured guidance.
                            </Typography>
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
    );
}
