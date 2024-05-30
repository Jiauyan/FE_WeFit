import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
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
    const [completedGoalsStatus, setCompletedGoalsStatus] = useState("");
    const [userData, setUserData] = useState([]);
    const { user , setUser} = useUser();
    const uid = user.uid;

    // Callback for adding a goal
    const addGoalCallback = (newGoal) => {
        setGoals(prevGoals => [...prevGoals, newGoal]);
    };

    // Callback for editing a goal
    const editGoalCallback = (updatedGoal) => {
        setGoals(prevGoals => prevGoals.map(goal => {
            if (goal.id === updatedGoal.id) {
                return updatedGoal;
            }
            return goal;
        }));
    };

    // Callback for deleting a goal
    const deleteGoalCallback = (goalId) => {
        setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
    };


    const handleComplete = async (id, title) => {
        console.log(id);
        try {
            const response = await axios.patch(`http://localhost:3000/goals/updateGoal/${id}`, {
                uid,
                title,
                status: true
            });

            setCompletedGoalsStatus(response.data.message);

            // Update the `goals` state directly
            setGoals(prevGoals => prevGoals.map(goal => {
                if (goal.id === id) {
                    return { ...goal, status: true };
                }
                return goal;
            }));

            setCompletedGoals(prevState => ({
                ...prevState,
                [id]: !prevState[id] 
                    }));

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
        // Load user ID from local storage or other persistent storage
        const storedUid = localStorage.getItem('uid');
        if (storedUid) {
            setUser({ ...user, uid: storedUid });
        }
    }, []);

      useEffect(() => {
        const fetchGoals = async () => {
            try {
                const uid = user?.uid;
                if (!uid) return;
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
    }, [user?.uid]);
    return(
        <>
       
        <Box sx={{ flexGrow: 1, maxWidth: 737 }}> 
        
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                   
                <Demo>
                    <Box sx={{ width: 737, height: 100, mt:10}}>
                        <AddGoal onAddGoal={addGoalCallback} ></AddGoal>
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
                                    <EditGoal id={goal.id} oldTitle={goal.title} disabled={completedGoals[goal.id]} onEditGoal={editGoalCallback} />
                                    <DeleteGoal id={goal.id} disabled={completedGoals[goal.id]} onDeleteGoal={deleteGoalCallback} />
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