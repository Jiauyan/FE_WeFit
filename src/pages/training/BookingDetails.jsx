import React, { useState, useEffect } from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { 
    Typography, 
    Paper, 
    Button, 
    Grid, 
    Box, 
    IconButton, 
    Radio, 
    RadioGroup, 
    FormControlLabel, 
    FormControl, 
    FormLabel, 
    TextField, 
    InputLabel, 
    Select, 
    MenuItem,
    Modal,
} from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import { GradientButton } from '../../contexts/ThemeProvider';
import { ArrowBackIos } from '@mui/icons-material';

export function BookingDetails() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [name, setName] = useState('');
    const [contactNum, setContactNum] = useState('');
    const [slot, setSlot] = useState('');
    const [trainingProgramSlot, setTrainingProgramSlot] = useState([]);
    const [status, setStatus] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [trainingClassID, setTrainingClassID] = useState('');
    const [addBookingDetailsStatus, setAddBookingDetailsStatus] = useState('');
    const { user, updateUser, setUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const { id , pathPrev} = location.state;
    const [bookedProgramsSlot, setBookedProgramsSlot] = useState([]);
    const [feeAmount, setFeeAmount] = useState(0);
    const [trainingProgram, setTrainingProgram] = useState('');
    
  useEffect(() => {
      window.scrollTo(0, 0); // Scroll to the top of the page when the component loads
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
    axios.get(`http://localhost:3000/trainingPrograms/getTrainingProgramById/${id}`)
      .then(response => {
        setTrainingProgramSlot(response.data.slots);
        setTrainingClassID(response.data.id);
        setFeeAmount(response.data.feeAmount);
        setTrainingProgram(response.data.title);
      })
      .catch(error => console.error('There was an error!', error));
  }, [user?.uid]);

  useEffect(() => {
    const fetchBookings = async () => {
        try {
            const uid = user?.uid;
            if (!uid) return;

            // Fetch booked programs
            const response = await axios.get(`http://localhost:3000/trainingClassBooking/getAllTrainingClassBookingsByUID/${uid}`);
            console.log(response.data);
           // const bookedProgramSlot = response.data.map((booking) => booking.slot);
            setBookedProgramsSlot(response.data);
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    fetchBookings();
}, [user?.uid]);

  const handleBack = async () => {
    navigate("/consentForm", { state: { id , pathName:"/screeningForm", pathPrev} });
  };

  const handleConfirm = async () => {
    // Check if the selected slot clashes with existing bookings
    const slotClash = bookedProgramsSlot.some(booking => booking.slot === slot.time);
    if (slotClash) {
        alert('Slot clash with an existing booking. Please choose a different slot.');
        return; // Exit the function if there is a clash
    }

    navigate('/checkout',  { state: {  
      id,
      pathPrev,
      name,
      contactNum,
      slot,
      trainingClassID,
      trainingProgram,
      feeAmount,
      status
      } })
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
                width: '100%' 
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            
            <IconButton onClick={handleBack}>
              <ArrowBackIos />
            </IconButton>
            <Typography>
              Step 3 of 4
            </Typography>
            </Box>
            <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                Training Class Booking
              </Typography>
             <Box sx={{  width: '100%', justifyContent: 'center', alignItems: 'center' }}>
             <TextField
              required
              margin="normal"
              fullWidth
              name="name"
              label="Name"
              id="name"
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              required
              margin="normal"
              fullWidth
              name="contactNum"
              label="Contact Number"
              id="contactNum"
              onChange={(e) => setContactNum(e.target.value)}
            />
            <FormControl margin="normal" fullWidth>
                <InputLabel id="demo-simple-select-autowidth-label">Slot</InputLabel>
                <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    fullWidth
                    label="Slot"
                >
                    {trainingProgramSlot.map((slot, index) => (
                        <MenuItem 
                            key={index} 
                            value={slot} 
                            disabled={slot.status} // Disables the MenuItem if slot.status is true
                        >
                            {/* {`${slot.time} - ${slot.status ? 'Full' : 'Available'}`}   */}
                            {slot.time}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <GradientButton
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleConfirm}
            >
              Confirm
            </GradientButton>
            </Box>
          </Paper>
        </Grid>
        </>
  );
}
