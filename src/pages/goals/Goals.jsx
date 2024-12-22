import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import {
    Typography,
    Box,
    IconButton,
    Grid,
    TextField,
    Card,
    CardContent,
    Pagination,
    CircularProgress,
    LinearProgress 
} from "@mui/material";
import CheckCircle  from '@mui/icons-material/CheckCircle';
import { useNavigate, Outlet } from 'react-router-dom';
import { AddGoal } from "../goals/AddGoal";
import { DeleteGoal } from "../goals/DeleteGoal"
import { EditGoal } from "../goals/EditGoal"


export function Goals(){
    const [loading, setLoading] = useState(true);
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
    
    const progress = calculateProgress();
    
    // Callback for adding a goal
    const addGoalCallback = (newGoal) => {
        setGoals(prevGoals => [ newGoal, ...prevGoals]);
        setPage(1);
    };

    // Callback for editing a goal
    const editGoalCallback = (updatedGoal) => {
        setGoals(prevGoals => {
            // Remove the updated quote from its current position
            const filteredGoals = prevGoals.filter(goal => goal.id !== updatedGoal.id);
            // Insert the updated quote at the beginning
            return [updatedGoal, ...filteredGoals];
        });
        setPage(1);
    };

    // Callback for deleting a goal
    const deleteGoalCallback = (goalId) => {
        setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
    };


    const handleComplete = async (id, title) => {
        try {
            const response = await axios.patch(`https://be-um-fitness.vercel.app/goals/updateGoal/${id}`, {
                uid,
                title,
                status: true
            });

            setCompletedGoalsStatus(response.data.message);

            setGoals(prevGoals => {
                // Update the status of the goal and reorder it to the top
                const updatedGoals = prevGoals.map(goal => 
                    goal.id === id ? { ...goal, status: true } : goal
                );
    
                // Find the completed goal and move it to the top
                const completedGoal = updatedGoals.find(goal => goal.id === id);
                const otherGoals = updatedGoals.filter(goal => goal.id !== id);
    
                // Return the updated list with the completed goal at the top
                return [completedGoal, ...otherGoals];
            });

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
                setLoading(true);
                const response = await axios.get(`https://be-um-fitness.vercel.app/goals/getAllUserGoals/${uid}`);
                const sortedGoal = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setGoals(sortedGoal);
                // Initialize completedGoals based on fetched data
                const initialCompletedGoals = {};
                response.data.forEach(goal => {
                    initialCompletedGoals[goal.id] = goal.status; // Assuming 'status' is a boolean indicating completion
                });
                setCompletedGoals(initialCompletedGoals);
            } catch (error) {
                console.error('There was an error!', error);
            } finally {
                setLoading(false);
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
    
      if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return(
        <Box padding={3}>
            <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
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
             {/* Displaying the progress bar */}
             <Box sx={{ width: '100%', mb: 2 }}>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="body2" color="text.secondary">
                    {`Completion: ${progress.toFixed(0)}%`}
                </Typography>
            </Box>
            {currentGoals.length === 0 || filteredGoals.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center">
                No Goal Found.
            </Typography>
            ) : (
          <>
           <Grid container spacing={2}>
    {currentGoals.map((goal) => (
        <Grid item xs={12} key={goal.id}>
            <Card sx={{ width: '100%' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                    <Grid container item xs={12}>
                        <Grid item xs={10}>
                            <Typography
                                variant="body1"
                                align="left"
                                sx={{
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    whiteSpace: 'normal',  // Allows text to wrap
                                }}
                            >
                                {goal.title}
                            </Typography>
                        </Grid>
                        <Grid 
                            item 
                            xs={2} 
                            sx={{ 
                                display: 'flex', 
                                justifyContent: 'flex-end', 
                                alignItems: 'center', 
                                flexWrap: 'wrap'  // Allows icons to wrap to the next line
                            }}
                        >
                            <IconButton
                                edge="end"
                                aria-label="complete"
                                onClick={() => handleComplete(goal.id, goal.title)}
                                disabled={completedGoals[goal.id]}
                               // size="small"  // Reduces icon size for smaller screens
                            >
                                <CheckCircle style={{ color: completedGoals[goal.id] ? 'green' : 'grey' }} />
                            </IconButton>
                            {!completedGoals[goal.id] && (
                                <EditGoal id={goal.id} oldTitle={goal.title} disabled={completedGoals[goal.id]} onEditGoal={editGoalCallback} />
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