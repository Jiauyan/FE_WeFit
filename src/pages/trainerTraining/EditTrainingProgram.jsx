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
    Modal,
    InputAdornment,
    Input,
    Snackbar,
    CircularProgress,
    FormHelperText
} from "@mui/material";
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import Upload from '@mui/icons-material/Upload';
import Delete from '@mui/icons-material/Delete';
import Add from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import { GradientButton } from '../../contexts/ThemeProvider';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../configs/firebaseDB'; 
import { isToday, setHours, setMinutes, addMinutes,format,compareAsc, parse} from 'date-fns';
import MuiAlert from '@mui/material/Alert';

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
  const [storedSlots, setStoredSlots] = useState([]);
  const [currentDate, setCurrentDate] = useState(null);
  const [currentStartTime, setCurrentStartTime] = useState(null);
  const [currentEndTime, setCurrentEndTime] = useState(null);
  const [isStartTimeValid, setIsStartTimeValid] = useState(true);
  const [isEndTimeValid, setIsEndTimeValid] = useState(true);
  const [trainingProgramImage, setTrainingProgramImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [downloadUrl, setDownloadUrl] = useState(null); 
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

  const [loading, setLoading] = useState(false);
  const [trainingProgramError, setTrainingProgramError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' }); // Notification state
  
  const handleCloseNotification = () => setNotification({ ...notification, open: false });

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
            const response = await axios.get(`https://be-um-fitness.vercel.app/trainingPrograms/getTrainingProgramById/${id}`);
            const data = response.data;
            setTrainingProgramData(data);
            setTitle(data.title);
            setContactNum(data.contactNum);
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
            setStoredSlots(data.slots);
            setDesc(data.desc);
            setCurrentDate(data.currentDate);
            setCurrentStartTime(data.currentStartTime);
            setCurrentEndTime(data.currentEndTime);
            setTrainingProgramImage(data.downloadUrl);
            setPreviewUrl(data.downloadUrl);
            setDownloadUrl(data.downloadUrl);
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
      setTrainingProgramError(prev => ({ ...prev, trainingProgramImage: 'Failed to upload image' }));
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setPreviewUrl(downloadURL);
        setDownloadUrl(downloadURL);
        setTrainingProgramError(prev => ({ ...prev, trainingProgramImage: '' }));
    });
}
);
}
};

const handleAddSlot = async (e) => {
  e.preventDefault();
  // Initial checks for completeness of input
  if (!currentDate || !currentStartTime || !currentEndTime) {
      alert("Please complete all date and time fields.");
      return;
  }

  // Checks for validity of the start and end times
  if (!isStartTimeValid || !isEndTimeValid) {
      const message = !isStartTimeValid && !isEndTimeValid
          ? "Invalid start time and end time."
          : !isStartTimeValid
          ? "Invalid start time."
          : "Invalid end time.";
      alert(message);
      return;
  }

  // Format and prepare the new slot
  const formattedDate = format(currentDate, 'dd/MM/yyyy');
  const start = new Date(currentDate.setHours(currentStartTime.getHours(), currentStartTime.getMinutes()));
  const end = new Date(currentDate.setHours(currentEndTime.getHours(), currentEndTime.getMinutes()));

  const slotString = `${formattedDate} - ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  const newSlot = { time: slotString, enrolled: 0, capacity: capacity };

  // Ensure the new slot does not clash with already entered slots
  if (isSlotClashing(newSlot, currentSlots)) {
      alert("This slot has already been added or overlaps with another slot. Please choose a different time.");
      return;
  }

  // Check for clashes with existing program slots
  const existingPrograms = await fetchExistingPrograms();
  const existingSlots = existingPrograms.flatMap(program => program.slots);
  if (isSlotClashing(newSlot, existingSlots)) {
      alert("This slot overlaps with an existing program's slot. Please choose a different time.");
      return;
  }

  // Update the slots state
  const updatedSlots = sortSlots([...currentSlots, newSlot]);
  setCurrentSlots(updatedSlots);
  setSlots(updatedSlots);
  setTrainingProgramError({ ...trainingProgramError, slots: '' });
  // Reset fields and close modal
  setCurrentDate(null);
  setCurrentStartTime(null);
  setCurrentEndTime(null);
  handleClose();
};

const parseDateTime = (slot) => {
  const [datePart, timePart] = slot.time.split(' - ');
  const startTime = timePart.split(' to ')[0];
  const dateTime = parse(`${datePart} ${startTime}`, 'dd/MM/yyyy hh:mm a', new Date());
  console.log(`Parsing date: ${datePart} ${startTime} to timestamp: ${dateTime.getTime()}`);
  return dateTime.getTime();
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
    console.log(slotString);
    const slotTime = typeof slotString === 'string' ? slotString : slotString.time;
    const [datePart, timePart] = slotTime.split(" - ");
    const [startTime, endTime] = timePart.split(" to ");
  
    // Parse the date and times into Date objects
    const [month, day, year] = datePart.split("/");
  
    // Combine date with start and end times
    const startDate = parse(`${datePart} ${startTime}`, 'dd/MM/yyyy hh:mm a', new Date());
    const endDate = parse(`${datePart} ${endTime}`, 'dd/MM/yyyy hh:mm a', new Date());

    return [startDate, endDate];
  };

  const handleRemoveSlot = async () => {
    if (indexToDelete === null) return;

    const trainingProgramID = trainingProgramData.id;
     // Check if the slot to delete exists in the current slots from the fetched data
     if (storedSlots.includes(slotToDelete)) {
      // Slot exists in the backend, proceed to delete from the backend
      try {
          const response = await axios.post('https://be-um-fitness.vercel.app/trainingPrograms/deleteSlot', {
            id: trainingProgramID,
            slotToDelete: slotToDelete  // Assuming slotToDelete contains sufficient information for deletion
          });

          if (response.data.success) {
            // Update the local state to reflect this deletion
            const filteredSlots = [...slots];
            filteredSlots.splice(indexToDelete, 1);
            setCurrentSlots(filteredSlots);
            setSlots(filteredSlots);
            handleCloseDeleteSlot();
          } else {
            alert(`Cannot delete slot: ${response.data.reason}`);
          }
      } catch (error) {
          console.error('There was an error deleting the slot!', error);
      }
    } else {
      const newSlots = [...slots];
      newSlots.splice(indexToDelete, 1);
      setSlots(newSlots);
      setCurrentSlots(newSlots);
      handleCloseDeleteSlot();
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
  
  const handleSubmit = async (e) => { 
    e.preventDefault();
    if (!validateTrainingProgram()) {
      return;
    }
    setLoading(true);
    try {
        const response = await axios.patch(`https://be-um-fitness.vercel.app/trainingPrograms/updateTrainingProgram/${id}`, {
           updates: {
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
            downloadUrl : previewUrl
           }
        });
        setUpdateTrainingProgramStatus(response.data.message);
        setNotification({ open: true, message: 'Training program updated successfully!', severity: 'success' });
            setTimeout(() => {
              navigate("/viewTrainerTrainingProgram", { state: { id: id } });
        }, 2000);
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
    } finally {
      setLoading(false)
    }
  };

  const handleBack = async () => {
    navigate("/viewTrainerTrainingProgram", { state: { id: id } });
  };

  const validateTrainingProgram = () => {
    const errors = {};

    if (!trainingProgramImage) errors.trainingProgramImage = 'Training program image is required';
    if (!title.trim()) errors.title = 'Training program title is required';
    if (!typeOfTrainingProgram.trim()) errors.typeOfTrainingProgram = 'Training program type is required';

    if (typeOfTrainingProgram === 'Group Classes' && !capacity) {
      errors.capacity = 'Training program capacity is required';
    }

    if (!feeType) errors.feeType = 'Training program fee type is required';
    // Fee amount validation based on fee type
    if (feeType === 'Paid' && !feeAmount) {
        errors.feeAmount = 'Training program fee amount is required';
    }

    if (!venueType) errors.venueType = 'Training program venue type is required';
    // Venue validation based on venue type
    if (venueType === 'Physical' && !venue) {
        errors.venue = 'Training program venue is required';
    }

    if (!fitnessLevel) errors.fitnessLevel = 'Fitness level is required';
    if (!fitnessGoal) errors.fitnessGoal = 'Fitness goal is required';
    if (!typeOfExercise) errors.typeOfExercise = 'Type of exercise is required';
    if (!desc) errors.desc = 'Training program description is required';
    if (!contactNum) errors.contactNum = 'Trainer contact number is required';
    if (slots.length === 0) errors.slots = 'At least one slot is required';

    setTrainingProgramError(errors);
    return Object.keys(errors).length === 0;
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
              border: `1px solid ${trainingProgramError.trainingProgramImage ? 'red' : '#c4c4c4'}`,
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
            {trainingProgramError.trainingProgramImage && (
                                <FormHelperText error>{trainingProgramError.trainingProgramImage}</FormHelperText>
                )}
            </Box>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
           <TextField
              required
              margin="normal"
              fullWidth
              value= {title}
              name="trainingProgramTitle"
              label="Training Program Title"
              id="trainingProgramTitle"
              onChange={(e) => {
                 setTitle(e.target.value);
                 setTrainingProgramError({ ...trainingProgramError, title: '' });
              }}
              variant="outlined"
              error={!!trainingProgramError.title}
              helperText={trainingProgramError.title}
            />
           <FormControl 
                  required
                  margin="normal" 
                  fullWidth 
                  error={!!trainingProgramError.typeOfTrainingProgram}>
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
                    setTrainingProgramError({ ...trainingProgramError, typeOfTrainingProgram: '' });
                  }}
                  fullWidth
                  label="Type of Training Program"
                >
                <MenuItem value="Personal Training">Personal Training</MenuItem>
                <MenuItem value="Group Classes">Group Classes</MenuItem>
              </Select>
              {trainingProgramError.typeOfTrainingProgram && (
                <FormHelperText>{trainingProgramError.typeOfTrainingProgram}</FormHelperText>
              )}
            </FormControl>

            {typeOfTrainingProgram === 'Group Classes' && (
               <TextField
               margin="normal"
               fullWidth
               id="class-capacity"
               label="Enter Class Capacity"
               type="number"
               value={capacity}
               onChange={(e) => {
                 setCapacity(e.target.value);
                 setTrainingProgramError({ ...trainingProgramError, capacity: '' });
               }}
               error={!!trainingProgramError.capacity}
               helperText={trainingProgramError.capacity}
               InputProps={{
                 inputProps: { 
                   min: 1  // Ensures no zero or negative values, assuming at least one person must be in a class
                 }
               }}
             />
            )}
            <FormControl 
                  required
                  margin="normal" 
                  fullWidth 
                  error={!!trainingProgramError.feeType}>
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
                  setTrainingProgramError({ ...trainingProgramError, feeType: '' });
                }}
                fullWidth
                label="Training Program Fee"
              >
                <MenuItem value="Free">Free</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
              </Select>
              {trainingProgramError.feeType && (
                <FormHelperText>{trainingProgramError.feeType}</FormHelperText>
              )}
            </FormControl>

            {feeType === 'Paid' && (
                <TextField
                margin="normal"
                fullWidth
                id="training-fee"
                label="Enter Fee Amount"
                type="text" // Change to text to avoid automatic number handling
                value={feeAmount}
                onChange={(e) => {
                  handleFeeChange(e.target.value);
                  setTrainingProgramError({ ...trainingProgramError, feeAmount: '' });
                }}
                error={!!trainingProgramError.feeAmount}
                helperText={trainingProgramError.feeAmount}
                InputProps={{
                  inputProps: { min: 0 }, // Ensures no negative values
                  startAdornment: <InputAdornment position="start">RM</InputAdornment>,
                }}
           />
            )}
              <FormControl 
                required
                margin="normal" 
                fullWidth 
                error={!!trainingProgramError.venueType}
                >
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
                    setTrainingProgramError({ ...trainingProgramError, venueType: '' });
                  }}
                  fullWidth
                  label="Venue"
                >
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="Physical">Physical</MenuItem>
                </Select>
                {trainingProgramError.venueType && (
                <FormHelperText>{trainingProgramError.venueType}</FormHelperText>
              )}
              </FormControl>

              {venueType === 'Physical' && (
                <TextField
                  margin="normal"
                  fullWidth
                  id="venue"
                  label="Enter Venue"
                  type="text"
                  value={venue}
                  onChange={(e) => {
                    setVenue(e.target.value);
                    setTrainingProgramError({ ...trainingProgramError, venue: '' });
                  }}
                error={!!trainingProgramError.venue}
                helperText={trainingProgramError.venue}
                />
              )}

<FormControl 
                margin="normal" 
                fullWidth 
                error={!!trainingProgramError.fitnessLevel}
                >
              <InputLabel id="demo-simple-select-autowidth-label">Fitness Level</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={fitnessLevel}
                onChange={(e) => {
                  setFitnessLevel(e.target.value);
                  setTrainingProgramError({ ...trainingProgramError, fitnessLevel: '' });
                }}
                fullWidth
                label="Fitness Level"
              >
                <MenuItem value={"Beginner"}>Beginner</MenuItem>
                <MenuItem value={"Intermediate"}>Intermediate</MenuItem>
                <MenuItem value={"Advanced"}>Advanced</MenuItem>
              </Select>
              {trainingProgramError.fitnessLevel && (
                <FormHelperText>{trainingProgramError.fitnessLevel}</FormHelperText>
              )}
            </FormControl>
            <FormControl 
                required
                margin="normal" 
                fullWidth 
                error={!!trainingProgramError.fitnessGoal}
                >
              <InputLabel id="demo-simple-select-autowidth-label">Fitness Goal</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={fitnessGoal}
                onChange={(e) => {
                  setFitnessGoal(e.target.value);
                  setTrainingProgramError({ ...trainingProgramError, fitnessGoal: '' });
                }}
                fullWidth
                label="Fitness Goal"
              >
                <MenuItem value={"Lose weight"}>Lose weight</MenuItem>
                <MenuItem value={"Be more active"}>Be more active</MenuItem>
                <MenuItem value={"Stay toned"}>Stay toned</MenuItem>
                <MenuItem value={"Reduce stress"}>Reduce stress</MenuItem>
                <MenuItem value={"Build muscle"}>Build muscle</MenuItem>
              </Select>
              {trainingProgramError.fitnessGoal && (
                <FormHelperText>{trainingProgramError.fitnessGoal}</FormHelperText>
              )}
            </FormControl>
            <FormControl 
                required
                margin="normal" 
                fullWidth 
                error={!!trainingProgramError.typeOfExercise}
                >
              <InputLabel id="demo-simple-select-autowidth-label">Type of Exercise</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={typeOfExercise}
                onChange={(e) => {
                  setTypeOfExercise(e.target.value);
                  setTrainingProgramError({ ...trainingProgramError, typeOfExercise: '' });
                }}
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
              {trainingProgramError.typeOfExercise && (
                <FormHelperText>{trainingProgramError.typeOfExercise}</FormHelperText>
              )}
            </FormControl>
            <TextField
              required
              margin="normal"
              fullWidth
              name="trainingProgramDesc"
              label="Training Program Description"
              id="trainingProgramDesc"
              onChange={(e) => {
                setDesc(e.target.value);
                setTrainingProgramError({ ...trainingProgramError, desc: '' });
              }}
              multiline
              rows={5}
              variant="outlined"
              value={desc}
              error={!!trainingProgramError.desc}
              helperText={trainingProgramError.desc}
            />
            <TextField
              required
              margin="normal"
              fullWidth
              name="trainerContactNum"
              label="Trainer Contact Number"
              id="trainerContactNum"
              value={contactNum}
              onChange={(e) => {
                setContactNum(e.target.value);
                setTrainingProgramError({ ...trainingProgramError, contactNum: '' });
              }}
              error={!!trainingProgramError.contactNum}
              helperText={trainingProgramError.contactNum}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 2 }}>
              <Typography variant="subtitle1">
                Slots available
              </Typography>
              <IconButton onClick={handleOpen}>
                <Add />
              </IconButton>
            </Box>
            {trainingProgramError.slots && (
            <Typography color="error" variant="body2" sx={{ fontSize: '0.875rem', mb:2, ml:2 }}>
                {trainingProgramError.slots}
            </Typography>
            )}
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
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
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
            required
            label="Select Date"
            format="dd/MM/yyyy"
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
            required
            label="Select Start Time"
            value={currentStartTime}
            onChange={(newValue) => {
              setCurrentStartTime(newValue)
              setIsStartTimeValid(newValue && (!isToday(currentDate) || newValue > new Date()));
            }}
            sx={{ marginBottom: 2, width: "100%" }}
            minTime={isToday(currentDate) ? new Date() : undefined}
          />

          <TimePicker
            required
            label="Select End Time"
            value={currentEndTime}
            onChange={(newValue) => {
              setCurrentEndTime(newValue)
              setIsEndTimeValid(newValue && newValue > currentStartTime);
            }}
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
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </MuiAlert>
      </Snackbar>
    </LocalizationProvider>
  );
}
