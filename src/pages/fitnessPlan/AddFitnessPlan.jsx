import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Modal,
    TextField,
    Paper,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    Snackbar,
    CircularProgress
}from "@mui/material";
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import { GradientButton } from '../../contexts/ThemeProvider';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import MuiAlert from '@mui/material/Alert';

export function AddFitnessPlan() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  const [title, setTitle] = useState('');
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState('');
  const [fitnessPlanID, setFitnessPlanID] = useState('');
  const [date, setDate] = useState(null);
  const [fitnessActivities, setFitnessActivities] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [completeCount, setCompleteCount] = useState(0);
  const [addFitnessPlanStatus, setAddFitnessPlanStatus] = useState('');
  const [addNewFitnessActivityStatus, setAddNewFitnessActivityStatus] = useState('');
  const [currentActivity, setCurrentActivity] = useState(null);
  const { user } = useUser();
  const uid = user.uid;
  const [fitnessPlanError, setFitnessPlanError] = useState('');
  const [fitnessActivityError, setFitnessActivityError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' }); // Notification state
  const [titleError, setTitleError] = useState('');
  const [dateError, setDateError] = useState('');
  const [activitiesError, setActivitiesError] = useState('');
  const handleCloseNotification = () => setNotification({ ...notification, open: false });

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: '90%', // full width on extra small devices
      sm: '80%', // slightly smaller on small devices
      md: '70%', // and even smaller on medium devices
      lg: 500,   // fixed size on large devices and up
    },
    height: 'auto', // makes height dynamic
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 20,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowY: 'auto', // add scroll on Y-axis if content is too long
  };

  const validateFitnessPlan = () => {
    let isValid = true;
  
    if (!title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    } else {
      setTitleError('');
    }
  
    if (!date.trim()) {
      setDateError('Date is required');
      isValid = false;
    } else {
      setDateError('');
    }
  
    if (fitnessActivities.length === 0) {
      setActivitiesError('At least one fitness activity is required');
      isValid = false;
    } else {
      setActivitiesError('');
    }
  
    return isValid;
  };
  
  const validateFitnessActivity = () => {
    const newErrors = {};
    if (!task.trim()) newErrors.task = 'Fitness Activity is required';
    if (!duration.trim()) newErrors.duration = 'Duration is required';
    setFitnessActivityError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    if (!validateFitnessPlan()) {
        return;
    }
    setLoading(true);
    try {
        const formattedDate = format(date, 'dd/MM/yyyy');
        const response = await axios.post('https://be-um-fitness.vercel.app/fitnessPlan/addFitnessPlan',{
           uid,
           title,
           date : formattedDate,
           completeCount : 0,
           totalCount
        });
        const fitnessPlanID = response.data.id;
        setFitnessPlanID(fitnessPlanID);
        await Promise.all(fitnessActivities.map(activity =>
          axios.patch(`https://be-um-fitness.vercel.app/fitnessActivity/updateFitnessActivity/${activity.id}`, {
            uid,
            ...activity,
            fitnessPlanID,
          })
        ));
        setAddFitnessPlanStatus(response.data.message);
        setNotification({ open: true, message: 'Fitness plan added successfully!', severity: 'success' });
            setTimeout(() => {
                navigate("/fitnessPlan");
        }, 1000);
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
    } finally {
        setLoading(false)
      }
  };
      
  const handleAddFitnessActivity = async (e) => {
    e.preventDefault();
    if (!validateFitnessActivity()) {
        return;
    }
    setLoading(true);
    try {
        const timestamp = new Date().toISOString();
        const response = await axios.post('https://be-um-fitness.vercel.app/fitnessActivity/addFitnessActivity', {
            uid,
            task,
            duration,
            status: false,
            fitnessPlanID,
            createdAt: timestamp
        });

        const newActivity = response.data;
        setFitnessActivities(prev => [...prev, newActivity]);
        setTotalCount(prevCount => prevCount + 1);
        handleClose();
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setAddNewFitnessActivityStatus(error.response.data.message);
            } else {
                setAddNewFitnessActivityStatus('An error occurred');
            }
        } else {
            setAddNewFitnessActivityStatus('An unexpected error occurred');
        }
    } finally {
        setLoading(false)
      }
};

const handleRemoveFitnessActivity = async (index) => {
    const activityId = fitnessActivities[index].id;

    try {
        await axios.delete(`https://be-um-fitness.vercel.app/fitnessActivity/deleteFitnessActivity/${activityId}`);
        setFitnessActivities(prev => prev.filter((_, i) => i !== index));
        setTotalCount(prevCount => prevCount - 1);
        setCompleteCount(prev => fitnessActivities.filter(activity => activity.status).length);
    } catch (error) {
        console.error('There was an error deleting the fitness activity!', error);
    }
};

const handleEditFitnessActivity = (index) => {
    const activity = fitnessActivities[index];
    setCurrentActivity({ ...activity, index }); // Add the index to currentActivity
    setTask(activity.task);
    setDuration(activity.duration);
    setOpenEdit(true);
};

const handleUpdateFitnessActivity = async (e) => {
    e.preventDefault();
    if (!validateFitnessActivity()) {
        return;
    }
    setLoading(true);
    try {
        const updatedActivity = {
            ...currentActivity,
            task,
            duration
        };

        await axios.patch(`https://be-um-fitness.vercel.app/fitnessActivity/updateFitnessActivity/${currentActivity.id}`, updatedActivity);

        setFitnessActivities(prev =>
            prev.map(activity => (activity.id === currentActivity.id ? updatedActivity : activity))
        );
        handleCloseEdit();
    } catch (error) {
        console.error('There was an error updating the fitness activity!', error);
    } finally {
        setLoading(false)
      }
};

  const handleBack = async () => {
          navigate("/fitnessPlan");
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
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2 }} margin={1} >
                Add Your Fitness Plan
        </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{  mt: 1,width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <TextField
            required
            margin="normal"
            fullWidth
            name="fitnessPlanTitle"
            label="Title"
            id="fitnessPlanTitle"
            onChange={(e) => setTitle(e.target.value)}
            error={!!titleError}
            helperText={titleError}
            />
            <DatePicker
            required
            label="Date"
            format="dd/MM/yyyy"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            slots={{ textField: TextField }}
            sx={{ marginBottom: 2, width: "100%" }}
            minDate={new Date()}
            onError={!!dateError}
            slotProps={{
                textField: {
                helperText: dateError,
                },
            }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 2, 
                border: activitiesError ? '0.5px solid red' : 'none', // Optional: Visual indicator for error
                borderRadius: 1, // Optional for styling
                padding: activitiesError ? 1 : 0,
            }}>
              <Typography variant="subtitle1">
                Fitness Activities
              </Typography>
              <IconButton onClick={handleOpen}>
                <Add />
              </IconButton>
            </Box>
            {activitiesError && (
            <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
                {activitiesError}
            </Typography>
            )}
            <List>
                {fitnessActivities && fitnessActivities.map((fitnessActivity, index) => (
                    <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Checkbox
                            disabled
                        />
                    <ListItemText
                        primary={fitnessActivity.task}
                        secondary={`${fitnessActivity.duration}`}
                    />
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditFitnessActivity(index)}>
                        <Edit />
                    </IconButton>
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
                   {loading ? <CircularProgress size={24} color="inherit" /> : 'Add'}
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

              <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2, mt:5}} >
                Add Your Fitness Activity
              </Typography>
              <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="fitnessActivity"
                    label="Fitness Activity"
                    id="fitnessActivity"
                    onChange={(e) => setTask(e.target.value)}
                    error={!!fitnessActivityError.task}
                    helperText={fitnessActivityError.task}
              />
              <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="duration"
                    label="Duration"
                    id="duration"
                    onChange={(e) => setDuration(e.target.value)}
                    error={!!fitnessActivityError.duration}
                    helperText={fitnessActivityError.duration}
              />
              <GradientButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Add'}
              </GradientButton>
              </Box>
            </Modal>
            <Modal
            open={openEdit}
            onClose={handleCloseEdit}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style} component="form" noValidate onSubmit={handleUpdateFitnessActivity}>
                <IconButton
                    onClick={handleCloseEdit}
                    sx={{ position: 'absolute', top: 10, right: 10 }}
                >
                    X
                </IconButton>

                <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 2, mt: 5 }} margin={1}>
                    Edit Fitness Activity
                </Typography>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="editFitnessActivity"
                    label="Fitness Activity"
                    id="editFitnessActivity"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    error={!!fitnessActivityError.task}
                    helperText={fitnessActivityError.task}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="editDuration"
                    label="Duration"
                    id="editDuration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    error={!!fitnessActivityError.duration}
                    helperText={fitnessActivityError.duration}
                />
                <GradientButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                   {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                </GradientButton>
            </Box>
        </Modal>
        <Snackbar
        open={notification.open}
        autoHideDuration={2000}
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