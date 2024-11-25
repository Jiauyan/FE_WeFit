import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import {
    Typography,
    Box,
    Button,
    Grid,
    TextField,
    Card,
    CardContent,
    Pagination,
    CircularProgress
} from "@mui/material";
import { useNavigate, Outlet } from 'react-router-dom';


export function FitnessPlan(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [fitnessPlan, setFitnessPlan] = useState([]);
    const [dense, setDense] = React.useState(false);
    const [userData, setUserData] = useState([]);
    const { user , setUser} = useUser();
    const uid = user.uid;
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage =6;

    useEffect(() => {
      window.scrollTo(0, 0); 
    }, [page]);

  useEffect(() => {
      // Check if there's a saved page number and set it
      const savedPage = sessionStorage.getItem('lastPage');
      setPage(savedPage ? parseInt(savedPage, 10) : 1);
  }, []);

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
                setLoading(true);
                const response = await axios.get(`https://be-um-fitness.vercel.app/fitnessPlan/getAllFitnessPlanByUid/${uid}`);
                const sortedFitnessPlans = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setFitnessPlan(sortedFitnessPlans);
            } catch (error) {
                console.error('There was an error!', error);
            } finally {
              setLoading(false);
          }
        };
    
        fetchFitnessPlan();
    }, [user?.uid]);

    const handleAdd = async () => {
        navigate("/addFitnessPlan");
      }; 

    const handleView = async (fitnessPlan) => {
        sessionStorage.setItem('lastPage', page.toString());
        const fitnessPlanId = fitnessPlan.id;
        navigate("/viewFitnessPlan", { state: { id: fitnessPlanId } });
    }; 

    const handleBack = async () => {
      sessionStorage.removeItem('lastPage');
      navigate("/training");
    };

    const filteredFitnessPlans = fitnessPlan.filter(fitnessPlan =>
      fitnessPlan.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate the current programs to display based on the page
    const startIndex = (page - 1) * itemsPerPage;
    const currentFitnessPlans = filteredFitnessPlans.slice(startIndex, startIndex + itemsPerPage);

    if (loading) {
      return (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
              <CircularProgress />
          </Box>
      );
    }

    return(
        <>
            <Box padding={3}>
            <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}> 
            <Typography variant="h5" sx={{display: 'flex', alignItems: 'center' }}>  
              My Fitness Plans
            </Typography>
                <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'end'
                }}>
                
                <Button
                      onClick={handleBack}
                      variant="contained"
                      color="primary"
                      sx={{ mt: 3, mb:2 ,mr:2}}
                      >
                      Back
                    </Button>
                    <Button
                        onClick={handleAdd}
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2}}
                        >
                        Add New
                    </Button>
                    </Box>
            </Box>
            <TextField
                fullWidth
                variant="outlined"
                label="Search Fitness Plans"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginBottom: 5, marginTop: 2 }}
            />
             {currentFitnessPlans.length === 0 || filteredFitnessPlans.length === 0 ? ( // Check if there are no programs
                <Typography variant="body1" color="text.secondary" align="center">
                    No Fitness Plans Found.
                </Typography>
            ) : (
                <>
                   <Grid container spacing={2} sx={{  }}>
                    {currentFitnessPlans.map((fitnessPlan) => (
                        <Grid item xs={12} key={fitnessPlan.id} sx={{ width: '100%',}}>
                        <Card sx={{ width: '100%' }}>
                            <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Grid container item xs={12} >
                            <Grid item xs={11}>
                                  <Typography variant="h6" component="div" sx={{ml: 2, mb:2, mt:2}}>
                                    {fitnessPlan.title}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary" sx={{ml: 2}}>
                                    {fitnessPlan.date}
                                  </Typography>
                              </Grid>
                              <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Button
                                      onClick={() => handleView(fitnessPlan)}
                                      color="primary"
                                  >
                                    View More
                                  </Button>
                                </Grid>
                                </Grid>
                                <Typography variant="body2" color="textSecondary" sx={{ alignSelf: 'flex-end', mr:1}}>
                                  {fitnessPlan.completeCount}/{fitnessPlan.totalCount}
                                </Typography>
                            </CardContent>
                        </Card>
                        </Grid>
                    ))}
                    </Grid>
                    <Pagination
                      count={Math.ceil(filteredFitnessPlans.length / itemsPerPage)}
                      page={page}
                      onChange={(event, value) => setPage(value)}
                      color="primary"
                      sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
                    />
                  </>
                )}
                </Box>
            <Outlet />
        </>
    );

}