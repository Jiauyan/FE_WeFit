import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import { useNavigate, Outlet } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Paper,
    Grid,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    Modal,
    InputAdornment,
    Input,
} from "@mui/material";
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import Upload from '@mui/icons-material/Upload';
import Delete from '@mui/icons-material/Delete';
import Add from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import CloudUpload from '@mui/icons-material/CloudUpload';
import { GradientButton } from '../../contexts/ThemeProvider';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../configs/firebaseDB'; 
import { isToday, setHours, setMinutes, addMinutes } from 'date-fns';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

export function AddTrainingProgram() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    // Reset all slot input fields when opening the modal
    setCurrentDate(null);
    setCurrentStartTime(null);
    setCurrentEndTime(null);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [title, setTitle] = useState('');
  const [typeOfTrainingProgram, setTypeOfTrainingProgram] = useState('');
  const [capacity, setCapacity] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [typeOfExercise, setTypeOfExercise] = useState('');
  const [desc, setDesc] = useState('');
  const [feeType, setFeeType] = useState(''); 
  const [feeAmount, setFeeAmount] = useState('');
  const [venueType, setVenueType] = useState(''); 
  const [venue, setVenue] = useState('');
  const [slots, setSlots] = useState([]);
  const [currentSlots, setCurrentSlots] = useState([]);
  const [currentDate, setCurrentDate] = useState(null);
  const [currentStartTime, setCurrentStartTime] = useState(null);
  const [currentEndTime, setCurrentEndTime] = useState(null);
  const [trainingProgramImage, setTrainingProgramImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [downloadUrl, setDownloadUrl] = useState(null); 
  const [contactNum, setContactNum] = useState('');
  const [addTrainingProgramStatus, setAddTrainingProgramStatus] = useState('');
  const { user } = useUser();
  const uid = user?.uid;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTrainingProgramImage(file);

    const fileRef = ref(storage, `trainingProgramImages/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // You can handle progress here if you need to show upload status
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("Upload failed", error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
        setPreviewUrl(downloadURL);
        setDownloadUrl(downloadURL);
    });
  }
);
}
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (currentDate && currentStartTime && currentEndTime) {
      const start = new Date(currentDate);
      start.setHours(currentStartTime.getHours(), currentStartTime.getMinutes());

      const end = new Date(currentDate);
      end.setHours(currentEndTime.getHours(), currentEndTime.getMinutes());

      const slotString = `${start.toLocaleDateString()} - ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      const newSlot = { time: slotString, enrolled: 0, capacity: capacity };

      setCurrentSlots(prevCurrentSlots => [...prevCurrentSlots, newSlot]);

      if (isSlotClashing(newSlot, currentSlots)) {
        alert("This slot has already been added. Please choose a different time.");
        return;
      }

      // Fetch existing programs and their slots
      const existingPrograms = await fetchExistingPrograms();
      const existingSlots = existingPrograms.flatMap(program => program.slots);
  
      // Check for slot clash
      if (isSlotClashing(newSlot, existingSlots)) {
        alert("This slot overlaps with an existing one. Please choose a different time.");
        return;
      }
      setCurrentSlots(prevCurrentSlots => {
        // Add the new slot and then sort all slots
        const updatedSlots = sortSlots([...prevCurrentSlots, newSlot]);
        return updatedSlots;
      });
  
      setSlots(prevSlots => {
        // Add the new slot and then sort all slots
        const updatedSlots = sortSlots([...prevSlots, newSlot]);
        return updatedSlots;
      });
      setCurrentDate(null);
      setCurrentStartTime(null);
      setCurrentEndTime(null);
      handleClose();
    }
  };

  const parseDateTime = (slot) => {
    const [datePart, timePart] = slot.time.split(' - ');
    const startTime = timePart.split(' to ')[0];
    const dateTime = new Date(`${datePart} ${startTime}`);
    return dateTime.getTime();  // Use getTime for a straightforward numeric comparison
  };
  
  const sortSlots = (slots) => {
    return slots.sort((a, b) => parseDateTime(a) - parseDateTime(b));
  };

  const fetchExistingPrograms = async () => {
    try {
        const uid = user?.uid;
        if (!uid) return;
        const response = await axios.get(`https://be-um-fitness.vercel.app/trainingPrograms/getAllUserTrainingPrograms/${uid}`);
        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
    }
  };

  const isSlotClashing = (newSlot, existingSlots) => {
    const [newStart, newEnd] = parseSlotString(newSlot);
  
    return existingSlots.some((slotString) => {
      const [existingStart, existingEnd] = parseSlotString(slotString);
  
      // Check if the new slot overlaps with any existing slots
      return (newStart < existingEnd && newEnd > existingStart);
    });
  };
  
  const parseSlotString = (slotString) => {
    const slotTime = typeof slotString === 'string' ? slotString : slotString.time;
    const [datePart, timePart] = slotTime.split(" - ");
    const [startTime, endTime] = timePart.split(" to ");
  
    // Parse the date and times into Date objects
    const [month, day, year] = datePart.split("/");
  
    // Combine date with start and end times
    const startDate = new Date(`${year}-${month}-${day} ${startTime}`);
    const endDate = new Date(`${year}-${month}-${day} ${endTime}`);
  
    return [startDate, endDate];
  };

  const handleRemoveSlot = (index) => {
    const newSlots = [...slots];
    newSlots.splice(index, 1);
    setSlots(newSlots);
    setCurrentSlots(newSlots);  // Keep currentSlots in sync with slots
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
        const response = await axios.post('https://be-um-fitness.vercel.app/trainingPrograms/addTrainingProgram', {
          uid : uid,
          contactNum : contactNum,
          title : title,
          typeOfTrainingProgram : typeOfTrainingProgram,
          capacity : Number(capacity),
          feeType : feeType,
          feeAmount : parseFloat(feeAmount),
          venueType : venueType,
          venue : venue,
          fitnessLevel : fitnessLevel,
          fitnessGoal : fitnessGoal,
          typeOfExercise : typeOfExercise,
          desc : desc,
          slots : slots,
          downloadUrl : downloadUrl
        });
        setAddTrainingProgramStatus(response.data.message);
        navigate("/trainerTrainingPrograms");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setAddTrainingProgramStatus(error.response.data.message);
            } else {
                setAddTrainingProgramStatus('An error occurred');
            }
        } else {
            setAddTrainingProgramStatus('An unexpected error occurred');
        }
    }
  };
  
  const handleFeeChange = (feeAmount) => {
    let value = parseFloat(feeAmount);
    if (!isNaN(value)) {
      value = value.toFixed(2); 
      setFeeAmount(value);
    } else {
      setFeeAmount('0.00'); // Reset or handle invalid numbers
    }
  };

  const handleBack = async () => {
    navigate(-1);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
          margin: 'auto' 
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            <IconButton onClick={handleBack}>
              <ArrowBackIos />
            </IconButton>
          </Box>
        
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            Add Your Training Program
          </Typography>
          {!previewUrl && (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  border: '1px solid #c4c4c4',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', // Ensuring it's visually noticeable
                }}
              >
                <label htmlFor="icon-button-file" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Input id="icon-button-file" type="file" onChange={handleFileChange} sx={{ display: 'none' }}/>
                  <IconButton
                    color="gray"
                    aria-label="upload picture"
                    component="span"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                  >
                    <CloudUpload sx={{fontSize: 70}}/>
                  </IconButton>
                  <Typography
                    variant="body1"
                    sx={{
                      mt: 1,
                      color: '#686868',
                      textAlign: 'center',
                      width: '100%' // Ensure it spans the full width to center text properly
                    }}
                  >
                    Upload Training Program Image
                  </Typography>
                </label>
              </Box>
            )}
          {previewUrl && (
            <Box sx={{
              position: 'relative',  // Ensures the positioning context for the IconButton
              width: '100%',
                  height: '350px',
                  objectFit: 'cover',
                  borderRadius: 8     // Fixed height for consistency
            }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '350px',
                  objectFit: 'cover',
                  borderRadius: 8
                }}
              />
              <label htmlFor="icon-button-file">
              <Input id="icon-button-file" type="file" onChange={handleFileChange} sx={{display: 'none'}}/>
              <IconButton
                color="primary"
                aria-label="edit picture"
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: 8,             // Adjust top position here
                  right: 8,           // Adjust right position here
                  backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                <Edit />
              </IconButton>
            </label>
            </Box>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <TextField
              required
              margin="normal"
              fullWidth
              name="trainingProgramTitle"
              label="Training Program Title"
              id="trainingProgramTitle"
              onChange={(e) => setTitle(e.target.value)}
            />
           <FormControl margin="normal" fullWidth>
              <InputLabel id="type-of-training-program-label">Training Program Type</InputLabel>
              <Select
                  labelId="type-of-training-program-label"
                  id="type-of-training-program-select"
                  value={typeOfTrainingProgram}
                  onChange={(e) => {
                    setTypeOfTrainingProgram(e.target.value);
                    if (e.target.value === 'Personal Training') {
                      setCapacity(1); // Set capacity to 1 for Personal Training
                    } else {
                      setCapacity(0); // Clear capacity for Group Classes to allow user input
                    }
                  }}
                  fullWidth
                  label="Type of Training Program"
                >
                <MenuItem value="Personal Training">Personal Training</MenuItem>
                <MenuItem value="Group Classes">Group Classes</MenuItem>
              </Select>
            </FormControl>

            {typeOfTrainingProgram === 'Group Classes' && (
              <TextField
                margin="normal"
                fullWidth
                id="class-capacity"
                label="Enter Class Capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                InputProps={{
                  inputProps: { 
                    min: 1  // Ensures no zero or negative values, assuming at least one person must be in a class
                  }
                }}
              />
            )}
            <FormControl margin="normal" fullWidth>
              <InputLabel id="training-fee-label">Training Program Fee</InputLabel>
              <Select
                labelId="training-fee-label"
                id="training-fee-select"
                value={feeType}
                onChange={(e) => {
                  setFeeType(e.target.value);
                  if (e.target.value === 'Free') {
                    handleFeeChange(0.00); 
                  } else {
                    handleFeeChange(e.target.value); 
                  }
                }}
                fullWidth
                label="Training Program Fee"
              >
                <MenuItem value="Free">Free</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
              </Select>
            </FormControl>

            {feeType === 'Paid' && (
                <TextField
                margin="normal"
                fullWidth
                id="training-fee"
                label="Enter Fee Amount"
                type="text" // Change to text to avoid automatic number handling
                value={feeAmount}
                onChange={(e) => handleFeeChange(e.target.value)}
                InputProps={{
                  inputProps: { min: 0 }, // Ensures no negative values
                  startAdornment: <InputAdornment position="start">RM</InputAdornment>,
                }}
           />
            )}
             <FormControl margin="normal" fullWidth>
                <InputLabel id="venue-type-label">Venue</InputLabel>
                <Select
                  labelId="venue-type-label"
                  id="venue-type-select"
                  value={venueType}
                  onChange={(e) => {
                    setVenueType(e.target.value);
                    if (e.target.value === 'Online') {
                      setVenue("Online"); 
                    }
                  }}
                  fullWidth
                  label="Venue"
                >
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="Physical">Physical</MenuItem>
                </Select>
              </FormControl>

              {venueType === 'Physical' && (
                <TextField
                  margin="normal"
                  fullWidth
                  id="venue"
                  label="Enter Venue"
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                />
              )}

            <FormControl margin="normal" fullWidth>
              <InputLabel id="demo-simple-select-autowidth-label">Fitness Level</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={fitnessLevel}
                onChange={(e) => setFitnessLevel(e.target.value)}
                fullWidth
                label="Fitness Level"
              >
                <MenuItem value={"Beginner"}>Beginner</MenuItem>
                <MenuItem value={"Intermediate"}>Intermediate</MenuItem>
                <MenuItem value={"Advanced"}>Advanced</MenuItem>
              </Select>
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <InputLabel id="demo-simple-select-autowidth-label">Fitness Goal</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
                fullWidth
                label="Fitness Goal"
              >
                <MenuItem value={"Lose weight"}>Lose weight</MenuItem>
                <MenuItem value={"Be more active"}>Be more active</MenuItem>
                <MenuItem value={"Stay toned"}>Stay toned</MenuItem>
                <MenuItem value={"Reduce stress"}>Reduce stress</MenuItem>
                <MenuItem value={"Build muscle"}>Build muscle</MenuItem>
              </Select>
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <InputLabel id="demo-simple-select-autowidth-label">Type of Exercise</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={typeOfExercise}
                onChange={(e) => setTypeOfExercise(e.target.value)}
                fullWidth
                label="Type of Exercise"
              >
                <MenuItem value={"Yoga"}>Yoga</MenuItem>
                <MenuItem value={"Dance"}>Dance</MenuItem>
                <MenuItem value={"Cardio"}>Cardio</MenuItem>
                <MenuItem value={"Strength"}>Strength</MenuItem>
                <MenuItem value={"HIIT"}>HIIT</MenuItem>
                <MenuItem value={"Meditation"}>Meditation</MenuItem>
              </Select>
            </FormControl>
            <TextField
              required
              margin="normal"
              fullWidth
              name="trainingProgramDesc"
              label="Training Program Description"
              id="trainingProgramDesc"
              onChange={(e) => setDesc(e.target.value)}
              multiline
              rows={5}
              variant="outlined"
            />
            <TextField
              required
              //type="tel"
              margin="normal"
              fullWidth
              name="trainerContactNum"
              label="Trainer Contact Number"
              id="trainerContactNum"
              //pattern="[+]?[0-9]{1,4}?[-.s]?[(]?[0-9]{1,3}[)]?[-.s]?[0-9]{3,4}[-.s]?[0-9]{4}"
              onChange={(e) => setContactNum(e.target.value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mt:2, mb:2, ml:1 }}>
              <Typography variant="subtitle1">
                Slots available
              </Typography>
              <IconButton onClick={handleOpen}>
                <Add />
              </IconButton>
            </Box>
            <List>
              {slots.map((slot, index) => (
                <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <ListItemText primary={slot.time} />
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveSlot(index)}>
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <GradientButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: '#007bff', color: 'white' }}
            >
              Add
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
        <Box sx={style} component="form" noValidate onSubmit={handleAddSlot}>
          <IconButton 
            onClick={handleClose}
            sx={{ position: 'absolute', top: 10, right: 10 }}
          >
            X
          </IconButton>

          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2, mt:5}} margin={1} >
            Add the Slot
          </Typography>
          <DatePicker
            label="Select Date"
            value={currentDate}
            onChange={(newValue) => {
              setCurrentDate(newValue);
              setCurrentStartTime(null); // Reset start time when date changes
              setCurrentEndTime(null);   // Reset end time when start time changes
            }}
            sx={{ marginBottom: 2, width: "100%" }} 
            minDate={new Date()}
          />

          <TimePicker
            label="Select Start Time"
            value={currentStartTime}
            onChange={(newValue) => setCurrentStartTime(newValue)}
            sx={{ marginBottom: 2, width: "100%" }}
            minTime={isToday(currentDate) ? new Date() : undefined}
          />

          <TimePicker
            label="Select End Time"
            value={currentEndTime}
            onChange={(newValue) => setCurrentEndTime(newValue)}
            sx={{ marginBottom: 2, width: "100%" }}
            minTime={currentStartTime ? addMinutes(new Date(currentStartTime), 1) : undefined}
          />
          <GradientButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
            >
                Add
          </GradientButton>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
}
