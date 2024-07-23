import { Typography, styled, Paper, Box } from "@mui/material";
import { useNavigate, Outlet } from 'react-router-dom';

export function Training() {
    const navigate = useNavigate();

    const TrainingCard = styled(Paper)(({ theme }) => ({
        width: '100%', // Set width to 100% to use the full container space
        maxWidth: '737px', // Maximum width of the card to maintain layout integrity
        margin: theme.spacing(2), // Add spacing between cards
        height: 'auto', // Height is automatically adjusted to content
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column', // Use column layout to stack content
        alignItems: 'flex-start', // Align items to the start of the flex container
        justifyContent: 'space-between',
        transition: "0.3s",
        borderRadius: 16,
        boxShadow: theme.shadows[3],
        '&:hover': {
            boxShadow: theme.shadows[6],
        },
    }));

    const handleCustomiseFitnessPlan = async () => {
        navigate("/fitnessPlan");
    }

    const handleJoinTrainingProgram = async () => {
        navigate("/trainingPrograms");
    }

    return (
        <Box 
        sx= {{
            display: 'flex',
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            width: '100%' 
            }}>
            <TrainingCard 
                onClick={() => handleCustomiseFitnessPlan()}
            >
                <Box>
                    <Typography variant="h5" component="div" marginBottom={2}>
                        Customise Fitness Plan
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Craft a workout routine that fits seamlessly into your life. 
                        Our customisable plans adapt to your schedule, location, and fitness level. 
                        Whether you're at home or on the go, keep your fitness on track by setting the pace 
                        and exercises that align with your goals. Start shaping your personal fitness story today.
                    </Typography>
                </Box>
            </TrainingCard>
            <TrainingCard
                onClick={() => handleJoinTrainingProgram()}
            >
                <Box>
                    <Typography variant="h5" component="div" marginBottom={2}>
                        Join Training Program
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        If customization isn't your preference, choose from our range of training programs 
                        designed for various fitness levels and goals. Our expert training plans provide structured 
                        workouts with clear guidance, ensuring you can focus on achieving results. Sign up, show up, 
                        and shape up—it's that simple.
                    </Typography>
                </Box>
            </TrainingCard>
        </Box>
    );
}
