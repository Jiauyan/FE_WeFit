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
    LinearProgress,
    TextField,
    Card,
    CardActionArea,
    CardContent,
    Pagination
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
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        window.scrollTo(0, 0); 
      }, [page]);

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
    
     // Filter programs based on search term
     const filteredGoals = goals.filter(goal=>
        goal.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
      // Calculate the current programs to display based on the page
      const startIndex = (page - 1) * itemsPerPage;
      const currentGoals = filteredGoals.slice(startIndex, startIndex + itemsPerPage);
      

    return(
        <Box sx={{ p: 3, width: '100%', boxSizing: 'border-box' }}>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%'
        }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
            My Goals
          </Typography> 
          <AddGoal onAddGoal={addGoalCallback} />
            </Box>
            <TextField
            fullWidth
            variant="outlined"
            label="Search Goals"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 5, mt: 2 }}
            />
            {currentGoals.length === 0 || filteredGoals.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center">
                No Goals Found.
            </Typography>
            ) : (
          <>
            <Grid container spacing={2} sx={{  }}>
            {currentGoals.map((goal) => (
                <Grid item xs={12} key={goal.id} sx={{ width: '100%',}}>
                <Card sx={{ width: '100%' }}>
                    <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Grid container item xs={12} >
                    <Grid item xs={11}>
                        <Typography 
                            variant="body1" 
                            align="left" 
                            sx={{
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word'
                            }}
                        >
                            {goal.title}
                        </Typography>
                        </Grid>
                        <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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
                        </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                </Grid>
            ))}
            </Grid>
            <Pagination
              count={Math.ceil(filteredGoals.length / itemsPerPage)}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
              sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
            />
          </>
        )}
        <Outlet/>
      </Box>
            );

}