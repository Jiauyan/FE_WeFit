import React, { useState, useEffect } from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Grid, IconButton, CircularProgress, Box } from '@mui/material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { GradientButton } from '../../contexts/ThemeProvider';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import AttachMoney from '@mui/icons-material/AttachMoney';
import { parse, isPast } from 'date-fns';

export function ViewTrainingProgram() {
  const [loading, setLoading] = useState(true);
  const [trainingProgramData, setTrainingProgramData] = useState([]);
  const [trainerID, setTrainerID] = useState(null);
  const [trainer, setTrainer] = useState({});
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { id, pathName, pathPrev, page } = location.state;
  // Derived state to check if all slots are full
  const allSlotsFull = trainingProgramData.slots?.every(slot => slot.status);

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  useEffect(() => {
    const storedUid = localStorage.getItem('uid');
    if (storedUid) {
      setUser({ ...user, uid: storedUid });
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const programResponse = await axios.get(`https://be-um-fitness.vercel.app/trainingPrograms/getTrainingProgramById/${id}`);
        const slotsWithStatus = programResponse.data.slots.map(slot => {
          const startTimeStr = slot.time.split(' to ')[0]; // "15/12/2024 - 04:00 PM"
          const startTime = parse(startTimeStr, 'dd/MM/yyyy - hh:mm a', new Date()); // Convert string to Date object
          return {
            ...slot,
            status: isPast(startTime) ? 'Expired' : slot.status ? 'Full' : 'Available' // Update status based on current time
          };
        });
        setTrainingProgramData({...programResponse.data, slots: slotsWithStatus});
      } catch (error) {
        console.error('There was an error!', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
}, [user?.uid, id]);

  const handleBack = () => {
    if (pathPrev === "/recommend" && pathName === "/screeningForm") {
      navigate("/recommededTrainingPrograms");
    } else if (pathPrev === "/beginner" && pathName === "/screeningForm") {
      navigate("/beginnerTrainingPrograms");
    }
    else if (pathPrev === "/intermediate" && pathName === "/screeningForm") {
      navigate("/intermediateTrainingPrograms");
    }
    else if (pathPrev === "/advanced" && pathName === "/screeningForm") {
      navigate("/advancedTrainingPrograms");
    }
    else if (pathName === "/screeningForm") {
      navigate("/trainingPrograms", { state: { id } });
    } else {
      navigate(-1);
    }
  };

  const handleBook = async (id) => {
    navigate("/screeningForm",{ state: { id, pathPrev } });
  };

  const slots = Array.isArray(trainingProgramData.slots) ? trainingProgramData.slots : [];
  const detailItems = [
      { label: 'Type', value: trainingProgramData.typeOfTrainingProgram },
      { label: 'Capacity', value: trainingProgramData.capacity },
      { label: 'Fitness Level', value: trainingProgramData.fitnessLevel },
      { label: 'Type of Exercise', value: trainingProgramData.typeOfExercise },
      { label: 'Goal', value: trainingProgramData.fitnessGoal },
      { label: 'Venue', value: trainingProgramData.venue },
      { label: 'Trainer', value: trainer.username },
      { label: 'Slots', value: slots.map(slot => `${slot.time} - ${slot.status ? 'Full' : 'Available'}`).join(', ') },
    ];

    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      );
  }

  return (
    <>
      <Grid
      container
      component="main"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
        width: '100%' // Ensures the grid takes full width
      }}
    >
      <Paper sx={{
          width: { xs: '100%', sm: '90%', md: '80%', lg: '737px' }, // Responsive width
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          padding: 2,
          margin: 'auto' // Centers the paper in the viewport
        }}>
          <Grid container item xs={12}> 
            <IconButton onClick={handleBack}>
              <ArrowBackIos />
            </IconButton>
          </Grid>
          <Grid container item xs={12}> 
          {trainingProgramData.downloadUrl && (
          <img
            src={trainingProgramData.downloadUrl}
            alt={trainingProgramData.title}
            style={{
              width: '100%',
              height: '350px',
              objectFit: 'cover',
              borderRadius: 8
            }}
          />
        )}
        </Grid>
        <Grid container item xs={12}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', fontSize: '1.8rem', mt: 4, mb: 2 }}>
              {trainingProgramData.title}
            </Typography>
          </Grid>
          <Grid container item xs={12}>
            <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '2.0rem', color: trainingProgramData.feeAmount == 0 ? '#112F91' : '#112F91', mt: 2, mb: 2, mr: 2, textAlign: 'end' }}>
              <AttachMoney />
              { trainingProgramData.feeAmount == 0 ? 'FREE' : `RM${trainingProgramData.feeAmount}`}
            </Typography>
        </Grid>
          <Grid container item xs={12}>
          <Typography variant="body1" sx={{ mb: 2, textAlign: 'justify', whiteSpace: 'pre-wrap' , mr:2}}>
                  {trainingProgramData.desc}
                </Typography>
            </Grid>
            <Grid container item xs={12} >
            <TableContainer 
            component={Paper} 
            sx={{ 
              borderRadius: 2, 
              overflow: 'hidden', 
              boxShadow: 'none', 
              width: '100%',
              border: '1px solid #e0e0e0',
              mt: 1, 
              mb:2
            }}
          >
       <Table sx={{ width: '100%' }} size="small" aria-label="a dense table">
          <TableBody>
            {detailItems.map((item, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, mb: 1 }}
              >
                <TableCell component="th" scope="row" sx={{ textAlign: 'left', py: 1, pl:4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {item.label}
                  </Typography>
                </TableCell>
                <TableCell align="left" sx={{ py: 1 }}>
                  {item.label === 'Slots' ? (
                    slots.map((slot, idx) => (
                      <Typography key={idx} variant="subtitle1" sx={{ display: 'block' }}>
                        {slot.time} - {slot.status ? 'Full' : 'Available'}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="subtitle1">
                      {item.value}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
    <Grid container xs={12}> 
    <Typography variant="body1" sx={{ mb: 3, mt: 2, ml:1, textAlign: 'justify', whiteSpace: 'pre-wrap' }}>
    For questions or to contact the trainer, call {trainingProgramData.contactNum}.
            </Typography>
            
    </Grid>
                <Grid container xs={12}> 
                        <GradientButton
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, mb: 2}}
                    onClick={() => handleBook(id)}
                    disabled={allSlotsFull}
                  >
                    Book
                  </GradientButton>
                  </Grid>
          
        </Paper>
      </Grid>
      <Outlet />
    </>
  );
}
