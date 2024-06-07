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
    LinearProgress
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

    const GoalCard = styled(Paper)(({ theme }) => ({
        width: 737,
        height: 'auto',
        padding: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: "0.3s",
        borderRadius: 16,
        boxShadow: theme.shadows[3],
        '&:hover': {
            boxShadow: theme.shadows[6],
        },
    }));

    const calculateProgress = () => {
        const totalGoals = goals.length;
        const completedGoalsCount = goals.filter(goal => goal.status).length;
        return (completedGoalsCount / totalGoals) * 100;
    };
    
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
            <Grid
                container
                component="main"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f0f4f8',
                    minHeight: '100vh',
                    padding: 4
                }}
            >
                <Box sx={{ flexGrow: 1, maxWidth: 737 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Your Goals
                    </Typography>
                    <Typography variant="h6" align="center" gutterBottom>
                        "Setting goals is the first step in turning the invisible into the visible." - Tony Robbins
                    </Typography>
                    <LinearProgress variant="determinate" value={calculateProgress()} sx={{ height: 10, borderRadius: 5, my: 2 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', mb: 2 }}>
                        <AddGoal onAddGoal={addGoalCallback} />
                    </Box>
                    <List dense={dense}>
                        {goals.map((goal, index) => (
                            <Box key={index} sx={{ marginBottom: 5 }}>
                                <GoalCard>
                                    <Box>
                                        <Typography variant="h6" component="div">
                                            {goal.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {secondary ? 'Secondary text' : null}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton
                                            edge="end"
                                            aria-label="complete"
                                            onClick={() => handleComplete(goal.id, goal.title)}
                                            disabled={completedGoals[goal.id]}
                                        >
                                            <CheckCircle style={{ color: completedGoals[goal.id] ? 'green' : 'grey' }} />
                                        </IconButton>
                                        {!completedGoals[goal.id] && (
                                            <>
                                                <EditGoal id={goal.id} oldTitle={goal.title} disabled={completedGoals[goal.id]} onEditGoal={editGoalCallback} />
                                            </>
                                        )}
                                        <DeleteGoal id={goal.id} onDeleteGoal={deleteGoalCallback} />
                                    </Box>
                                </GoalCard>
                            </Box>
                        ))}
                    </List>
                </Box>
            </Grid>
            <Outlet />
        </>
    );

}