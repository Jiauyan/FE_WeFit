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
//import { AddFitnessPlan } from "../fitnessPlan/AddFitnessPlan";
//import { DeleteFitnessPlan } from "../fitnessPlan/DeleteFitnessPlan"
//import { EditFitnessPlan } from "../fitnessPlan/EditFitnessPlan"


export function FitnessPlan(){
    const navigate = useNavigate();
    const [fitnessPlan, setFitnessPlan] = useState([]);
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    const [completedFitnessPlan, setCompletedFitnessPlan] = useState({});
    const [completedFitnessPlanStatus, setCompletedFitnessPlanStatus] = useState("");
    const [userData, setUserData] = useState([]);
    const { user , setUser} = useUser();
    const uid = user.uid;

    const FitnessPlanCard = styled(Paper)(({ theme }) => ({
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

      useEffect(() => {
        // Load user ID from local storage or other persistent storage
        const storedUid = localStorage.getItem('uid');
        if (storedUid) {
            setUser({ ...user, uid: storedUid });
        }
    }, []);

      useEffect(() => {
        const fetchFitnessPlan = async () => {
            try {
                const uid = user?.uid;
                if (!uid) return;
                const response = await axios.get(`http://localhost:3000/fitnessPlan/getAllFitnessPlanByUid/${uid}`);
                setFitnessPlan(response.data);
            } catch (error) {
                console.error('There was an error!', error);
            }
        };
    
        fetchFitnessPlan();
    }, [user?.uid]);

    const handleAdd = async () => {
        navigate("/addFitnessPlan");
      }; 

    const handleView = async (fitnessPlan) => {
        const fitnessPlanId = fitnessPlan.id;
        navigate("/viewFitnessPlan", { state: { id: fitnessPlanId } });
    };  

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
                    //minHeight: '100vh',
                    padding: 4,
                    marginTop: 2
                }}
            >
                <Box sx={{ flexGrow: 1, maxWidth: 737 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb:2 }}>
                    <Typography variant="h6" align="left">
                        My Fitness Plan
                    </Typography>
                    <Button
                        onClick={handleAdd}
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Add Fitness Plan
                    </Button>
                    </Box>
                    <List dense={dense}>
                        {fitnessPlan.map((fitnessPlan, index) => (
                            <Box key={index} sx={{ marginBottom: 5 }}>
                                <FitnessPlanCard>
                                    <Box>
                                        <Typography variant="h6" component="div" sx={{m: 2}}>
                                            {fitnessPlan.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{m: 2}}>
                                            {fitnessPlan.date}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        onClick={() => handleView(fitnessPlan)}
                                        //variant="contained"
                                        color="primary"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        View More
                                    </Button>
                                    </Box>
                                    <Typography variant="body2" color="textSecondary">
                                        {fitnessPlan.completeCount}/{fitnessPlan.totalCount}
                                    </Typography>
                                </FitnessPlanCard>
                            </Box>
                        ))}
                    </List>
                </Box>
            </Grid>
            <Outlet />
        </>
    );

}