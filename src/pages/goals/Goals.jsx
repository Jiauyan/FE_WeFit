import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { useUser } from "../../UseContext";
import {
    Typography,
    Container,
    Box,
    Paper,
    Button,
    styled,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    IconButton,
    FormGroup,
    FormControlLabel,
    Grid,
} from "@mui/material";
import { CheckCircle } from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import { AddGoal } from "../goals/AddGoal";
import { DeleteGoal } from "../goals/DeleteGoal"
import { EditGoal } from "../goals/EditGoal"


export function Goals(){
    const [goals, setGoals] = useState([]);
    //const [status, setStatus] = useState(false);
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    const [completedGoals, setCompletedGoals] = useState({});
    const [completedGoalsStatus, setCompletedGoalsStatus] = useState("");
    const [userData, setUserData] = useState([]);
    const { user } = useUser();
    const uid = user.uid

    const handleComplete = async (id, title) => {
        
        try {
            const response = await axios.patch(`http://localhost:3000/goals/updateGoal/${id}`, {
                uid,
                title,
                status: true
            });

            setCompletedGoalsStatus(response.data.message);

            setCompletedGoals(prevState => ({
                ...prevState,
                [id]: !prevState[id] // Toggle completion status
                    }));


            //navigate('/login');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setCompletedGoalsStatus(error.response.data.message);
                } else {
                    setCompletedGoalsStatus('An error occurred');
                }
            } else {
                setCompletedGoalsStatus('An unexpected error occurred');
            }
        }


    };

    const Demo = styled('div')(({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
      }));

      useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/goals/getAllUserGoals/${uid}`);
                setGoals(response.data);
                // Initialize completedGoals based on fetched data
                const initialCompletedGoals = {};
                response.data.forEach(goal => {
                    initialCompletedGoals[goal.id] = goal.status; // Assuming 'status' is a boolean indicating completion
                });
                setCompletedGoals(initialCompletedGoals);
            } catch (error) {
                console.error('There was an error!', error);
            }
        };
    
        fetchGoals();
    }, []);
    return(
        <>
       
        <Box sx={{ flexGrow: 1, maxWidth: 752 }}> 
        
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                   
                <Demo>
                    <Box sx={{ width: 737, height: 100, mt:10}}>
                        <AddGoal></AddGoal>
                    </Box>
                    <List dense={dense}>
                    {goals.map((goal, index) => (
                        <Box key={index} sx={{ marginBottom: 2 }}> 
                            <Paper key={index} sx={{ width: 737, height: 100,p:10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box >
                                    <ListItemText
                                        primary={goal.title} // Display the goal title
                                        secondary={secondary ? 'Secondary text' : null}
                                    />
                                </Box>
                                <Box>
                                <IconButton edge="end" 
                                    aria-label="complete" 
                                    onClick={() => handleComplete(goal.id, goal.title)} // Pass title here
                                    disabled={completedGoals[goal.id]}
                                >
                                    <CheckCircle style={{ color: completedGoals[goal.id] ? 'green' : 'grey' }} />
                                </IconButton>
                                    <EditGoal id={goal.id} oldTitle={goal.title} disabled={completedGoals[goal.id]} />
                                    <DeleteGoal id={goal.id} disabled={completedGoals[goal.id]} />
                                </Box>
                            </Paper>
                            </Box>
                        ))}
                            </List>
                </Demo>
                </Grid>
            </Grid>
        </Box>
        <Outlet/>
        </>
    );

}