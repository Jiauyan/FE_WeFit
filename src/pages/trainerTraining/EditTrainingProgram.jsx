import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import { useNavigate, Outlet,useLocation } from 'react-router-dom';
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
    Input
} from "@mui/material";
import { ArrowBackIos, Upload, Delete, Add, Edit } from '@mui/icons-material';
import { GradientButton } from '../../contexts/ThemeProvider';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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

export function EditTrainingProgram() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [title, setTitle] = useState('');
  const [typeOfTrainingProgram, setTypeOfTrainingProgram] = useState('');
  const [capacity, setCapacity] = useState('');
  const [feeType, setFeeType] = useState(''); 
  const [feeAmount, setFeeAmount] = useState('');
  const [venueType, setVenueType] = useState(''); 
  const [venue, setVenue] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [typeOfExercise, setTypeOfExercise] = useState('');
  const [desc, setDesc] = useState('');
  const [slots, setSlots] = useState([]);
  const [currentSlots, setCurrentSlots] = useState([]);
  const [currentDate, setCurrentDate] = useState(null);
  const [currentStartTime, setCurrentStartTime] = useState(null);
  const [currentEndTime, setCurrentEndTime] = useState(null);
  const [trainingProgramImage, setTrainingProgramImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [contactNum, setContactNum] = useState('');
  const [updateTrainingProgramStatus, setUpdateTrainingProgramStatus] = useState('');
  const { user } = useUser();
  const uid = user.uid;
  const location = useLocation();
  const { id } = location.state;
  const [trainingProgramData, setTrainingProgramData] = useState({});
  const [openDeleteSlot, setOpenDeleteSlot] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState(null);
  const [slotToDelete, setSlotToDelete] = useState(null);

  const handleOpenDeleteSlot = (index, slot) => {
      setIndexToDelete(index);
      setSlotToDelete(slot);
      setOpenDeleteSlot(true);  // Corrected the state function name
  };

  const handleCloseDeleteSlot = () => {
      setOpenDeleteSlot(false);  // Corrected the state function name
      setIndexToDelete(null);
      setSlotToDelete(null);
  };  

  useEffect(() => {
    const fetchTrainingProgramData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/trainingPrograms/getTrainingProgramById/${id}`);
            const data = response.data;
            setTrainingProgramData(data);
            setTitle(data.title);
            setTypeOfTrainingProgram(data.typeOfTrainingProgram);
            setCapacity(data.capacity);
            setFeeType(data.feeType);
            setFeeAmount(Number(data.feeAmount));
            setVenueType(data.venueType);
            setVenue(data.venue);
            setFitnessLevel(data.fitnessLevel);
            setFitnessGoal(data.fitnessGoal);
            setTypeOfExercise(data.typeOfExercise);
            setSlots(data.slots);
            setCurrentSlots(data.slots);
            setDesc(data.desc);
            setCurrentDate(data.currentDate);
            setCurrentStartTime(data.currentStartTime);
            setCurrentEndTime(data.currentEndTime);
            setTrainingProgramImage(data.downloadUrl);
            setPreviewUrl(data.downloadUrl);
            setContactNum(data.contactNum);
        } catch (error) {
            console.error('There was an error fetching the training program data!', error);
        }
    };

    if (id) {
        fetchTrainingProgramData();
    }
}, []);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTrainingProgramImage(file);

      // Read the file and set the preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
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
      // // Check for duplicate slot in the current session
      // if (currentSlots.some(slot => slot.time === newSlot.time)) {
      //   alert("This slot has already been added. Please choose a different time.");
      //   return;
      // }

      // Fetch existing programs and their slots
      const existingPrograms = await fetchExistingPrograms();
      const existingSlots = existingPrograms.flatMap(program => program.slots);
  
      // Check for slot clash
      if (isSlotClashing(newSlot, existingSlots)) {
        alert("This slot overlaps with an existing one. Please choose a different time.");
        return;
      }
      
      setCurrentSlots(prevCurrentSlots => [...prevCurrentSlots, newSlot]);
      setSlots(prevSlots => [...prevSlots, newSlot]);
      setCurrentDate(null);
      setCurrentStartTime(null);
      setCurrentEndTime(null);
      handleClose();
      console.log(slots);
    }
  };

  const fetchExistingPrograms = async () => {
    try {
        const uid = user?.uid;
        if (!uid) return;
        const response = await axios.get(`http://localhost:3000/trainingPrograms/getAllUserTrainingPrograms/${uid}`);
        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
    }
  };

  const parseSlotString = (slotString) => {
    if (!slotString || typeof slotString !== 'string' && !slotString.time) {
        console.error("Invalid slot data:", slotString);
        return [new Date(), new Date()]; // Return default or current dates to prevent further errors
    }

    const slotTime = typeof slotString === 'string' ? slotString : slotString.time;
    console.log("Parsing slot time:", slotTime);
    
    const [datePart, timePart] = slotTime.split(" - ");
    if (!datePart || !timePart) {
        console.error("Slot time format error:", slotTime);
        return [new Date(), new Date()];
    }

    const [startTime, endTime] = timePart.split(" to ");
    if (!startTime || !endTime) {
        console.error("Start/End time format error:", timePart);
        return [new Date(), new Date()];
    }

    // Parse the date and times into Date objects
    const [month, day, year] = datePart.split("/");
    const startDate = new Date(`${year}-${month}-${day} ${startTime}`);
    const endDate = new Date(`${year}-${month}-${day} ${endTime}`);

    return [startDate, endDate];
};

const isSlotClashing = (newSlot, existingSlots) => {
    const [newStart, newEnd] = parseSlotString(newSlot);

    return existingSlots.some((slot) => {
        const [existingStart, existingEnd] = parseSlotString(slot);

        // Check if the new slot overlaps with any existing slots
        return (newStart < existingEnd && newEnd > existingStart);
    });
};
  const handleRemoveSlot = async () => {
    if (indexToDelete === null) return;

    const trainingProgramID = trainingProgramData.id;
    try {
        // If your backend requires, send a request to delete the slot
        const response = await axios.post('http://localhost:3000/trainingPrograms/deleteSlot', {
          id : trainingProgramID,
          slotToDelete : slotToDelete
        });

        if (response.data.success) {
          // Update the local state to reflect this deletion
          setCurrentSlots(prev => prev.filter((_, index) => index !== indexToDelete));
          setSlots(prev => prev.filter((_, index) => index !== indexToDelete));
    
          // Close the delete confirmation modal
          handleCloseDeleteSlot();
        } else {
          alert(`Cannot delete slot: ${response.data.reason}`);
        }
    } catch (error) {
        console.error('There was an error deleting the slot!', error);
    }
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    const formData = new FormData();
    formData.append('trainingProgramImage', trainingProgramImage); 
    formData.append('uid', uid);
    formData.append('contactNum', contactNum);
    formData.append('title', title);
    formData.append('typeOfTrainingProgram', typeOfTrainingProgram);
    formData.append('capacity', capacity);
    formData.append('feeType', feeType);
    formData.append('feeAmount', Number(feeAmount));
    formData.append('venueType', venueType);
    formData.append('venue', venue);
    formData.append('fitnessLevel', fitnessLevel);
    formData.append('fitnessGoal', fitnessGoal);
    formData.append('typeOfExercise', typeOfExercise);
    formData.append('desc', desc);
    slots.forEach((slot, index) => {
    formData.append(`slots[${index}]`, JSON.stringify(slot));
    });
    try {
        const response = await axios.patch(`http://localhost:3000/trainingPrograms/updateTrainingProgram/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log(response.data);
        
        setUpdateTrainingProgramStatus(response.data.message);
        navigate("/viewTrainerTrainingProgram", { state: { id: id } });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setUpdateTrainingProgramStatus(error.response.data.message);
            } else {
                setUpdateTrainingProgramStatus('An error occurred');
            }
        } else {
            setUpdateTrainingProgramStatus('An unexpected error occurred');
        }
    }
  };

  const handleBack = async () => {
    navigate("/viewTrainerTrainingProgram", { state: { id: id } });
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
            Edit Your Training Program
          </Typography>
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
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <TextField
              required
              margin="normal"
              fullWidth
              name="trainingProgramTitle"
              label="Training Program Title"
              id="trainingProgramTitle"
              value= {title}
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
                      setCapacity(''); // Clear capacity for Group Classes to allow user input
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
                    setFeeAmount('0'); 
                  } else {
                    setFeeAmount(''); 
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
                type="number"
                value={feeAmount}
                onChange={(e) => setFeeAmount(e.target.value)}
                InputProps={{
                  inputProps: { min: 0 },  // Ensures no negative values
                  startAdornment: <InputAdornment position="start">RM</InputAdornment>,  // RM symbol
                }}
              />
            )}
             <FormControl margin="normal" fullWidth>
                <InputLabel id="venue-type-label">Venue</InputLabel>
                <Select
                  labelId="venue-type-label"
                  id="venue-type-select"
                  value={venueType}
                  onChange={(e) => setVenueType(e.target.value)}
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
              value={desc}
            />
            <TextField
              required
              margin="normal"
              fullWidth
              name="trainerContactNum"
              label="Trainer Contact Number"
              id="trainerContactNum"
              value={contactNum}
              onChange={(e) => setContactNum(e.target.value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 2 }}>
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
                  <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteSlot(index, slot)}>
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
              Save
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
            value={currentDate || null}
            onChange={(newValue) => setCurrentDate(newValue)}
            slots={{ textField: TextField }}
            sx={{ marginBottom: 2, width:"100%"}} 
          />
          <TimePicker
            label="Select Start Time"
            value={currentStartTime || null}
            onChange={(newValue) => setCurrentStartTime(newValue)}
            slots={{ textField: TextField }}
            sx={{ marginBottom: 2, width:"100%"}} 
          />
          <TimePicker
            label="Select End Time"
            value={currentEndTime || null}
            onChange={(newValue) => setCurrentEndTime(newValue)}
            slots={{ textField: TextField }}
            sx={{ marginBottom: 2, width:"100%"}} 
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
      <Modal
          open={openDeleteSlot}
          onClose={handleCloseDeleteSlot}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
          <Box sx={style}>
              <Button 
                  onClick={handleCloseDeleteSlot}
                  sx={{ position: 'absolute', top: 10, right: 10 }}
              >
                  X
              </Button>

              <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2, mt:10 }} margin={1}>
                  Confirm Deletion
              </Typography>
              <Typography component="h6" variant="h6" sx={{ fontWeight: 300 }} margin={1}>
                  Are you sure you wish to delete this slot?
              </Typography>
              <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleRemoveSlot}
              >
                  Confirm
              </Button>
          </Box>
      </Modal>
    </LocalizationProvider>
  );
}
