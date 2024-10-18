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
    Modal
} from "@mui/material";
import { ArrowBackIos, Upload, Delete, Add } from '@mui/icons-material';
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

export function AddTrainingProgram() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [title, setTitle] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [typeOfExercise, setTypeOfExercise] = useState('');
  const [desc, setDesc] = useState('');
  const [slots, setSlots] = useState([]);
  const [currentDate, setCurrentDate] = useState(null);
  const [currentStartTime, setCurrentStartTime] = useState(null);
  const [currentEndTime, setCurrentEndTime] = useState(null);
  const [trainingProgramImage, setTrainingProgramImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [addTrainingProgramStatus, setAddTrainingProgramStatus] = useState('');
  const { user } = useUser();
  const uid = user.uid;

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

      const newSlot = slotString;

      if (slots.includes(slotString)) {
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
      
      setSlots(prevSlots => [...prevSlots, slotString]);
      setCurrentDate(null);
      setCurrentStartTime(null);
      setCurrentEndTime(null);
      handleClose();
    }
  };

  const fetchExistingPrograms = async () => {
    try {
        const uid = user?.uid;
        if (!uid) return;
        const response = await axios.get(`http://localhost:3000/trainingPrograms/getAllUserTrainingPrograms/${uid}`);
        console.log(response.data);
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
    const [datePart, timePart] = slotString.split(" - ");
    const [startTime, endTime] = timePart.split(" to ");
  
    // Parse the date and times into Date objects
    const [month, day, year] = datePart.split("/");
  
    // Combine date with start and end times
    const startDate = new Date(`${year}-${month}-${day} ${startTime}`);
    const endDate = new Date(`${year}-${month}-${day} ${endTime}`);
  
    return [startDate, endDate];
  };
  // const handleRemoveSlot = (index) => {
  //   const newSlots = slots.filter((_, i) => i !== index);
  //   setSlots(newSlots);
  // };
  const handleRemoveSlot = (index) => {
    setSlots(prevSlots => prevSlots.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    const formData = new FormData();
    formData.append('trainingProgramImage', trainingProgramImage); 
    formData.append('uid', uid);
    formData.append('title', title);
    formData.append('fitnessLevel', fitnessLevel);
    formData.append('fitnessGoal', fitnessGoal);
    formData.append('typeOfExercise', typeOfExercise);
    formData.append('desc', desc);
    slots.forEach((slot, index) => {
      formData.append(`slots[${index}]`, slot);
    });
    try {
        const response = await axios.post('http://localhost:3000/trainingPrograms/addTrainingProgram', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log(response.data);
        
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
          </Box>
        
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            Add Your Training Program
          </Typography>
          {previewUrl && (
            <Box
              sx={{
                width: '100%',
                maxHeight: '300px',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '20px',
                border: '1px solid #ccc',
                borderRadius: 1
              }}
            >
              <img src={previewUrl} alt={title} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
            </Box>
          )}
          <Button
            variant="contained"
            component="label"
            sx={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}
          >
            <Upload sx={{ marginRight: 1 }} />
            Upload Training Program Image
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
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
                  <ListItemText primary={slot} />
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
            onChange={(newValue) => setCurrentDate(newValue)}
            slots={{ textField: TextField }}
            sx={{ marginBottom: 2, width:"100%"}} 
          />
          <TimePicker
            label="Select Start Time"
            value={currentStartTime}
            onChange={(newValue) => setCurrentStartTime(newValue)}
            slots={{ textField: TextField }}
            sx={{ marginBottom: 2, width:"100%"}} 
          />
          <TimePicker
            label="Select End Time"
            value={currentEndTime}
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
    </LocalizationProvider>
  );
}
