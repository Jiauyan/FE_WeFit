import React, { useState , useEffect} from 'react';
import axios from 'axios';
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
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    const [completedGoals, setCompletedGoals] = useState({});

    const handleComplete = (id) => {
        setCompletedGoals(prevState => ({
            ...prevState,
            [id]: !prevState[id]  // Toggle completion status
        }));
    };

    const Demo = styled('div')(({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
      }));

    // Fetch goals when component mounts
    useEffect(() => {
        axios.get('http://localhost:3000/goals/getAllGoals')
            .then(response => {
                setGoals(response.data); // Set fetched goals to state
            })
            .catch(error => console.error('There was an error!', error));
    }, []); // Empty dependency array means this effect runs only once after initial render

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
                                    <Paper key={index} sx={{ width: 737, height: 100, m: 10 }}>
                                        <ListItem
                                            secondaryAction={
                                                <>
                                                    <IconButton edge="end" 
                                                        aria-label="complete" 
                                                        onClick={() => handleComplete(goal.id)}
                                                        disabled={completedGoals[goal.id]}
                                                    >
                                                        <CheckCircle style={{ color: completedGoals[goal.id] ? 'green' : 'default' }} />
                                                    </IconButton>
                                                    <EditGoal id={goal.id} oldTitle={goal.title} disabled={completedGoals[goal.id]} />
                                                    <DeleteGoal id={goal.id} disabled={completedGoals[goal.id]} />
                                                </>
                                            }
                                        >
                                            <ListItemText
                                                primary={goal.title} // Display the goal title
                                                secondary={secondary ? 'Secondary text' : null}
                                            />
                                        </ListItem>
                                    </Paper>
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