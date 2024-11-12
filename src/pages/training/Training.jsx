import { Typography, Box, Card, CardContent, CardActionArea, CardMedia } from "@mui/material";
import FitnessCenter from "@mui/icons-material/FitnessCenter";
import Assignment from "@mui/icons-material/Assignment";
import { useNavigate } from 'react-router-dom';
import joinImage from '../../assets/trainingImage.png';
import customiseImage from '../../assets/customiseImage.png';

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
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80vh',
                width: '100%',
                boxSizing: 'border-box',
                gap: 3, // Space between cards
                padding: 2,
                flexWrap: 'wrap', // Wrap cards on smaller screens
            }}
        >
            <Card sx={{
                width: { xs: '100%', sm: 500 }, // Full width on extra-small devices, 500px on small and above
                margin: 2,
                boxShadow: 3, 
                '&:hover': {
                    boxShadow: 6},
                flex: '1 0 auto', // Allows flexbox to manage width automatically
                }}>
                <CardActionArea onClick={handleCustomiseFitnessPlan}>
                    <CardMedia
                        component="img"
                        height="200"
                        image={customiseImage} // Path to your image
                        alt="Customise Fitness Plan"
                    />
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, minHeight: 150 }}>
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

            <Card sx={{
                width: { xs: '100%', sm: 500 }, // Full width on extra-small devices, 500px on small and above
                margin: 2, 
                boxShadow: 3, 
                '&:hover': {
                    boxShadow: 6},
                flex: '1 0 auto', // Allows flexbox to manage width automatically
                }}>
                <CardActionArea onClick={handleJoinTrainingProgram}>
                    <CardMedia
                        component="img"
                        height="210"
                        image={joinImage} // Path to your image
                        alt="Join Training Program"
                    />
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, minHeight: 150 }}>
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
