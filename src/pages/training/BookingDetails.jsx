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
import completeImage from "../../assets/completeImage.png"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height : "auto",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 20,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

export function BookingDetails() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [name, setName] = useState('');
    const [contactNum, setContactNum] = useState('');
    const [slot, setSlot] = useState('');
    const [trainingProgramSlot, setTrainingProgramSlot] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [trainingClassID, setTrainingClassID] = useState('');
    const [addBookingDetailsStatus, setAddBookingDetailsStatus] = useState('');
    const { user, updateUser, setUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state;
    const [bookedProgramsSlot, setBookedProgramsSlot] = useState([]);

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
console.log(bookedProgramsSlot);
  const handleBack = async () => {
    navigate("/consentForm", { state: { id } });
  };

  const handleView = async () => {
    navigate("/trainingPrograms", { state: { id } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the selected slot clashes with existing bookings
    const slotClash = bookedProgramsSlot.some(booking => booking.slot === slot);
    console.log(slotClash);
    if (slotClash) {
        alert('Slot clash with an existing booking. Please choose a different slot.');
        return; // Exit the function if there is a clash
    }

    try {
      const uid = user.uid;
      const status = false;
      const response = await axios.post('http://localhost:3000/trainingClassBooking/addTrainingClassBooking', {
        uid,
        name,
        contactNum,
        slot,
        trainingClassID,
        status
      });
      setAddBookingDetailsStatus(response.data.message);
      handleOpen();
  } catch (error) {
      if (axios.isAxiosError(error)) {
          if (error.response) {
            setAddBookingDetailsStatus(error.response.data.message);
          } else {
            setAddBookingDetailsStatus('An error occurred');
          }
      } else {
        setAddBookingDetailsStatus('An unexpected error occurred');
      }
  }
  };


  return (
    <>
      <Grid
        container
        component="main"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 4
        }}
      >
        <Paper sx={{
          width: '100%',
          maxWidth: '800px', 
          height: 'auto', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)', 
          borderRadius: 2,
          padding: 4 
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            
            <IconButton onClick={handleBack}>
              <ArrowBackIos />
            </IconButton>
            <Typography>
              Step 2 of 2
            </Typography>
            </Box>
              <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                Training Class Booking
              </Typography>
             <Box component="form" onSubmit={handleSubmit} noValidate sx={{  width: '100%', justifyContent: 'center', alignItems: 'center' }}>
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
                    <MenuItem key={index} value={slot}>  
                        {slot}  
                    </MenuItem>
                    ))}
                </Select>
                </FormControl>
            <GradientButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
            >
              Confirm
            </GradientButton>
            </Box>
          </Paper>
        </Grid>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        
        <Box sx={style}>

            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <img src={completeImage} alt="Completed" style={{ width: '100px', marginBottom: '16px' }} /> 
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1A237E', mb:3, mt :3 }}>
                    Your Training Program Successfully Booked.
                </Typography>
                <Typography variant="body2" sx={{ color: '#757575' }}>
                    You can check your booking in the Training Page. Thank You.
                </Typography>
            </Box>

            <GradientButton
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3 }}
                    onClick={() => handleView()}
            >
                Continue
            </GradientButton>
        </Box>
      </Modal>
    </>
  );
}
