import React, { useState, useEffect } from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { Typography, Paper, Grid, IconButton, TableContainer, Table, TableBody, TableRow, TableCell, CircularProgress, Box} from "@mui/material";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import AttachMoney from '@mui/icons-material/AttachMoney';
import { DeleteBooking } from './DeleteBooking';
import { parseISO, differenceInCalendarDays } from 'date-fns';

export function ViewBooking() {
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState('');
  const [trainingProgramData, setTrainingProgramData] = useState('');
  const [trainerID, setTrainerID] = useState(null);
  const [trainer, setTrainer] = useState({});
  const [transactionId, setTransactionId] = useState('');
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { id, slot, bookingId } = location.state;
  const detailItems = [
    { label: 'Type', value: trainingProgramData?.typeOfTrainingProgram },
    { label: 'Capacity', value: trainingProgramData?.capacity },
    { label: 'Fitness Level', value: trainingProgramData?.fitnessLevel },
    { label: 'Type of Exercise', value: trainingProgramData?.typeOfExercise },
    { label: 'Goal', value: trainingProgramData?.fitnessGoal },
    { label: 'Venue', value: trainingProgramData?.venue },
    { label: 'Trainer', value: trainer?.username },
    { label: 'Slot', value: bookingData?.slot?.time },
  ];
  
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
    const uid = user?.uid;
    if (!uid) return;

    const fetchData = async () => {
        try {
          setLoading(true);
            // Fetch the booking details
            const response = await axios.get(`https://be-um-fitness.vercel.app/trainingClassBooking/getBookingById/${bookingId}`);
            setBookingData(response.data.booking);
            setTrainingProgramData(response.data.trainingProgram);
            setTransactionId(response.data.booking.transactionId);

            // Check for trainer ID in the training program data
            const trainerID = response.data.trainingProgram.uid;
            if (!trainerID) {
                throw new Error('Trainer ID not found in training program data');
            }

            // Fetch trainer details using the trainer ID
            const trainerResponse = await axios.get(`https://be-um-fitness.vercel.app/auth/getUserById/${trainerID}`);
            setTrainer(trainerResponse.data);
        } catch (error) {
            console.error('There was an error!', error);
        } finally {
          setLoading(false);
      }
    };

    fetchData();
}, [user?.uid, bookingId]);

  const handleBack = async () => {
    navigate(-1);
  };

  const parseDate = (dateStr) => {
    const [month, day, year] = dateStr.split('/');
    return new Date(year, month - 1, day); // JavaScript's Date month is 0-indexed
};

const canCancelBooking = () => {
  console.log(bookingData);
  if (bookingData?.status === true) {
      console.log("Booking already completed");
      return { canCancel: false, message: 'Booking already completed' };
  }
  if (!bookingData?.slot || !bookingData?.slot?.time) {
      console.log("Slot or slot time missing!");
      return { canCancel: false, message: '' };
  }
  const dateString = bookingData.slot.time.split(' - ')[0]; // Extracting date assuming format "DD/MM/YYYY - HH:mm AM to HH:mm AM"
  const today = new Date();
  const slotDate = parseDate(dateString); // Ensuring we use a custom function to handle date parsing correctly
  const daysDifference = differenceInCalendarDays(slotDate, today);

  console.log(`Days Difference: ${daysDifference}`, `Date String: ${dateString}`); // Debugging output
  console.log(bookingData.slot.status);
  
  // Check if the booking is expired
  if (daysDifference <= 0) {
      console.log("Expired condition hit");
      return { canCancel: false, message: 'Expired' }; // Slot date has passed or is today
  }

  // Check cancellation window
  if (daysDifference < -3) {
      console.log("Cancellation window closed condition hit");
      return { canCancel: false, message: 'Cancellation window has closed' }; // Within 3 days of the slot date
  }

  // Eligible for cancellation
  console.log("Eligible for cancellation");
  return { canCancel: true, message: '' };
};

  const cancellationCheck = canCancelBooking();

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
                    <Typography variant="subtitle1">
                      {item.value}
                    </Typography>
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
    <Grid container sx={{ width: '100%', justifyContent: 'center' }}>
    {cancellationCheck.message && (
        <Typography variant="subtitle1" color="error" sx={{ mb: 2 }}>
            {cancellationCheck.message}
        </Typography>
    )}
          {cancellationCheck.canCancel && (
              <Grid item xs={12}>
                  <DeleteBooking id={bookingId} transactionId={transactionId} feeAmount={trainingProgramData.feeAmount} />
              </Grid>
          )}
      </Grid>
        </Paper>
      </Grid>
      <Outlet />
    </>
  );
}