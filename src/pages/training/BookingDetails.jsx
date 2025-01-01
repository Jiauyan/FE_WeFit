import React, { useState, useEffect } from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { 
    Typography, 
    Paper, 
    Grid, 
    Box, 
    IconButton, 
    FormControl, 
    TextField, 
    InputLabel, 
    Select, 
    MenuItem,
    CircularProgress,
    FormHelperText
} from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import { GradientButton } from '../../contexts/ThemeProvider';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';

export function BookingDetails() {
    const [loading, setLoading] = useState(false);
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
    const [errors, setErrors] = useState({});

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
    axios.get(`https://be-um-fitness.vercel.app/trainingPrograms/getTrainingProgramById/${id}`)
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
            const response = await axios.get(`https://be-um-fitness.vercel.app/trainingClassBooking/getAllTrainingClassBookingsByUID/${uid}`);
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
    if (!validateForm()) return;

    setLoading(true); // Start loading indicator

    try {
        const slotClash = bookedProgramsSlot.some(booking => booking.slot === slot.time);
        if (slotClash) {
            alert('Slot clash with an existing booking. Please choose a different slot.');
            return; // Exit the function if there is a clash
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
          navigate('/checkout', { 
            state: {  
                id,
                pathPrev,
                name,
                contactNum,
                slot,
                trainingClassID,
                trainingProgram,
                feeAmount,
                status
            } 
        });
       
    } catch (error) {
        console.error('Error during confirmation:', error);
    } finally {
        setLoading(false); // Ensure loading is stopped regardless of the outcome
    }
};

    const validateForm = () => {
      const newErrors = {};
  
      if (!name.trim()) newErrors.name = 'Name is required';
      if (!contactNum.trim()) newErrors.contactNum = 'Contact Number is required';
      if (!slot) newErrors.slot = 'Slot is required';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('/');
      return new Date(year, month - 1, day); // JavaScript's Date month is 0-indexed
    };
  
    const parseTime = (dateStr, timeStr) => {
        const [hours, minutes] = timeStr.match(/\d{2}/g);
        const period = timeStr.match(/[AM|PM]+/i)[0];
        const [day, month, year] = dateStr.split('/');
        const date = new Date(year, month - 1, day, hours % 12 + (period.toLowerCase() === 'pm' ? 12 : 0), minutes);
        return date;
    };

    const slots = Array.isArray(trainingProgramSlot)
    ? trainingProgramSlot.map(slot => {
        const now = new Date();
  
        // Extract the date and time parts
        const [datePart, timeRange] = slot.time.split(" - ");
        const [startTime, endTime] = timeRange.split(" to ");
  
        const slotDate = parseDate(datePart);
        const slotStartTime = parseTime(datePart, startTime);
        const slotEndTime = parseTime(datePart, endTime);
  
        console.log(slotEndTime);
        console.log(slotStartTime);
        console.log(now);
        // Determine the slot status
        let status;
        if (slotEndTime < now) {
          status = "Expired";
        } else if (slot.status) {
          status = "Full";
        } else {
          status = "Available";
        }
  
        return { ...slot, displayStatus: status };
      })
    : [];
  
    console.log(slots);
  return (
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
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: '' });
              }}
              error={!!errors.name}
              helperText={errors.name}
              />
            <TextField
              required
              margin="normal"
              fullWidth
              name="contactNum"
              label="Contact Number"
              id="contactNum"
              onChange={(e) => {
                setContactNum(e.target.value);
                setErrors({ ...errors, contactNum: '' });
              }}
              value={contactNum}
              error={!!errors.contactNum}
              helperText={errors.contactNum}
            />
            <FormControl margin="normal" fullWidth required error={!!errors.slot}>
                <InputLabel id="demo-simple-select-autowidth-label">Slot</InputLabel>
                <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={slot.time}
                    onChange={(e) => {
                      const selectedTime = e.target.value;
                      const slot = slots.find(s => s.time === selectedTime);
                      setSlot(slot || {});
                      setErrors({ ...errors, slot: '' });
                    }}
                    fullWidth
                    label="Slot"
                >
                    {slots.map((slot, index) => (
                      <MenuItem 
                          key={index} 
                          value={slot.time}
                          disabled={slot.displayStatus !== "Available"}
                      >
                          {slot.time}
                      </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.slot}</FormHelperText>
            </FormControl>
            <GradientButton
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleConfirm}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
            </GradientButton>
            </Box>
          </Paper>
        </Grid>
  );
}
