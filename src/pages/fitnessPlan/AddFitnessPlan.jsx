import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import { useNavigate, Outlet } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Modal,
    TextField,
    Paper,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText
}from "@mui/material";
import { ArrowBackIos, Add, Delete } from '@mui/icons-material';
import { GradientButton } from '../../contexts/ThemeProvider';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

export function AddFitnessPlan() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [title, setTitle] = useState('');
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState('');
  const [fitnessPlanID, setFitnessPlanID] = useState('');
  const [fitnessActivity, setFitnessActivity] = useState('');
  const [date, setDate] = useState(null);
  const [listFitnessActivity, setListFitnessActivity] = useState([]);
  const [fitnessActivities, setFitnessActivities] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [addFitnessPlanStatus, setAddFitnessPlanStatus] = useState('');
  const [addFitnessActivityStatus, setAddFitnessActivityStatus] = useState('');
  const { user } = useUser();
  const uid = user.uid;

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

  const handleSubmit = async (e) => { 
    e.preventDefault();

    try {
        const formattedDate = format(date, 'dd/MM/yyyy');
        console.log(formattedDate);
        const response = await axios.post('http://localhost:3000/fitnessPlan/addFitnessPlan',{
           uid,
           title,
           date : formattedDate,
           completeCount : 0,
           totalCount
        });
        const fitnessPlanID = response.data.id;
        await Promise.all(fitnessActivities.map(activity =>
          axios.post('http://localhost:3000/fitnessActivity/addFitnessActivity', {
            uid,
            ...activity,
            fitnessPlanID,
            
          })
        ));
        setAddFitnessPlanStatus(response.data.message);
        navigate("/fitnessPlan");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setAddFitnessPlanStatus(error.response.data.message);
            } else {
                setAddFitnessPlanStatus('An error occurred');
            }
        } else {
            setAddFitnessPlanStatus('An unexpected error occurred');
        }
    }
  };

  const handleAddFitnessActivity = async (e) => {
          e.preventDefault();
          const listOfFitnessActivity = `${task} - ${duration}`;
          setListFitnessActivity(prevListFitnessActivity => [...prevListFitnessActivity, listOfFitnessActivity]);
          setFitnessActivities(prev => [...prev, { task, duration }]);
          setTotalCount(prevCount => prevCount + 1);
          handleClose();
  };

  const handleRemoveFitnessActivity = (index) => {
    setListFitnessActivity(prevListFitnessActivity => prevListFitnessActivity.filter((_, i) => i !== index));
    setFitnessActivities(prev => prev.filter((_, i) => i !== index));
    setTotalCount(prevCount => prevCount - 1);
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
      <IconButton
        onClick={handleBack}
      >
        <ArrowBackIos />
      </IconButton>
    </Box>
    
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2 }} margin={1} >
                Add Your Fitness Plan
        </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{  mt: 1,width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <TextField
                    required
                    margin="normal"
                    fullWidth
                    name="fitnessPlanTitle"
                    label="Title"
                    id="fitnessPlanTitle"
                    onChange={(e) => setTitle(e.target.value)}
            />
            <DatePicker
            required
            label="Date"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            slots={{ textField: TextField }}
            sx={{ marginBottom: 2, width:"100%"}} 
          />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 2 }}>
              <Typography variant="subtitle1">
                Fitness Activities
              </Typography>
              <IconButton onClick={handleOpen}>
                <Add />
              </IconButton>
            </Box>
            <List>
              {listFitnessActivity.map((fitnessActivity, index) => (
                <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <ListItemText primary={fitnessActivity} />
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFitnessActivity(index)}>
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <GradientButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
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
            <Box sx={style} component="form" noValidate onSubmit={handleAddFitnessActivity}>
              <IconButton 
                onClick={handleClose}
                sx={{ position: 'absolute', top: 10, right: 10 }}
              >
                X
              </IconButton>

              <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2, mt:5}} margin={1} >
                Add the Fitness Activity
              </Typography>
              <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="fitnessActivity"
                    label="Fitness Activity"
                    id="fitnessActivity"
                    onChange={(e) => setTask(e.target.value)}
              />
              <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="duration"
                    label="Duration"
                    id="duration"
                    onChange={(e) => setDuration(e.target.value)}
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