import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import { useNavigate, useLocation } from 'react-router-dom';
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
    ListItemText,
    Checkbox
} from "@mui/material";
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import { GradientButton } from '../../contexts/ThemeProvider';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parse, format } from 'date-fns';

export function EditFitnessPlan() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false); // State for delete modal
    const [activityToDelete, setActivityToDelete] = useState(null); // State for the index of the activity to be deleted

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);
    const handleOpenDelete = (index) => {
        setActivityToDelete(index);
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setActivityToDelete(null);
        setOpenDelete(false);
    };
    const [title, setTitle] = useState('');
    const [task, setTask] = useState('');
    const [duration, setDuration] = useState('');
    const [fitnessPlanData, setFitnessPlanData] = useState(null);
    const [fitnessActivityData, setFitnessActivityData] = useState([]);
    const [date, setDate] = useState(null);
    const [createdAt, setCreatedAt] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [completeCount, setCompleteCount] = useState(0);
    const [updateFitnessPlanStatus, setUpdateFitnessPlanStatus] = useState('');
    const [addNewFitnessActivityStatus, setAddNewFitnessActivityStatus] = useState('');
    const [currentActivity, setCurrentActivity] = useState(null);
    const { user } = useUser();
    const uid = user.uid;
    const location = useLocation();
    const { id } = location.state;
    const fitnessPlanID = id;

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
    
    useEffect(() => {
        const fetchFitnessPlanData = async () => {
            try {
                const response = await axios.get(`https://be-um-fitness.vercel.app/fitnessPlan/getFitnessPlanById/${id}`);
                const data = response.data;
                const fetchedDate = data.date;
                const parsedDate = parse(fetchedDate, 'dd/MM/yyyy', new Date());
                setFitnessPlanData(data);
                setTitle(data.title);
                setDate(parsedDate);
                setCreatedAt(data.createdAt);
                setCompleteCount(data.completeCount);
                setTotalCount(data.totalCount);
            } catch (error) {
                console.error('There was an error fetching the fitness plan data!', error);
            }
        };

        if (id) {
            fetchFitnessPlanData();
        }
    }, [id]);

    useEffect(() => {
        const fetchFitnessActivityData = async () => {
            try {
                const response = await axios.get(`https://be-um-fitness.vercel.app/fitnessActivity/getAllFitnessActivitiesByUidAndPlanID/${uid}/${fitnessPlanID}`);
                const data = response.data;
                setFitnessActivityData(data);
                setTotalCount(data.length);
                const completedActivities = data.filter(activity => activity.status).length;
                setCompleteCount(completedActivities);
            } catch (error) {
                console.error('There was an error fetching the fitness activities!', error);
            }
        };

        fetchFitnessActivityData();
    }, [uid, fitnessPlanID]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedDate = format(date, 'dd/MM/yyyy');
            await axios.patch(`https://be-um-fitness.vercel.app/fitnessPlan/updateFitnessPlan/${id}`, {
                uid,
                title,
                date: formattedDate,
                completeCount,
                totalCount,
                createdAt
            });

            await Promise.all(fitnessActivityData.map(activity =>
                axios.patch(`https://be-um-fitness.vercel.app/fitnessActivity/updateFitnessActivity/${activity.id}`, activity)
            ));

            setUpdateFitnessPlanStatus('Fitness Plan updated successfully!');
            navigate("/viewFitnessPlan", { state: { id: id } });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setUpdateFitnessPlanStatus(error.response.data.message);
                } else {
                    setUpdateFitnessPlanStatus('An error occurred');
                }
            } else {
                setUpdateFitnessPlanStatus('An unexpected error occurred');
            }
        }
    };

    const handleAddFitnessActivity = async (e) => {
        e.preventDefault();

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
            setFitnessActivityData(prev => [...prev, newActivity]);
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
        }
    };

    const handleRemoveFitnessActivity = async () => {
        if (activityToDelete === null) return;
        console.log(activityToDelete); 
        const activityId = fitnessActivityData[activityToDelete].id;
        try {
            await axios.delete(`https://be-um-fitness.vercel.app/fitnessActivity/deleteFitnessActivity/${activityId}`);
            setFitnessActivityData(prev => prev.filter((_, i) => i !== activityToDelete));
            setTotalCount(prevCount => prevCount - 1);
            setCompleteCount(prev => fitnessActivityData.filter(activity => activity.status).length);
            handleCloseDelete();
        } catch (error) {
            console.error('There was an error deleting the fitness activity!', error);
        }
    };

    const handleEditFitnessActivity = (index) => {
        const activity = fitnessActivityData[index];
        setCurrentActivity({ ...activity, index }); // Add the index to currentActivity
        setTask(activity.task);
        setDuration(activity.duration);
        setOpenEdit(true);
    };

    const handleUpdateFitnessActivity = async (e) => {
        e.preventDefault();

        try {
            const updatedActivity = {
                ...currentActivity,
                task,
                duration
            };

            await axios.patch(`https://be-um-fitness.vercel.app/fitnessActivity/updateFitnessActivity/${currentActivity.id}`, updatedActivity);

            setFitnessActivityData(prev =>
                prev.map(activity => (activity.id === currentActivity.id ? updatedActivity : activity))
            );
            handleCloseEdit();
        } catch (error) {
            console.error('There was an error updating the fitness activity!', error);
        }
    };

    const handleToggleActivityStatus = async (index) => {
        const updatedActivities = fitnessActivityData.map((activity, idx) => {
            if (idx === index) {
                return { ...activity, status: !activity.status };
            }
            return activity;
        });

        const totalComplete = updatedActivities.reduce((count, activity) => count + (activity.status ? 1 : 0), 0);

        try {
            await axios.patch(`https://be-um-fitness.vercel.app/fitnessActivity/updateFitnessActivity/${fitnessActivityData[index].id}`, {
                ...updatedActivities[index],
                status: updatedActivities[index].status
            });

            setFitnessActivityData(updatedActivities);
            setCompleteCount(totalComplete);
        } catch (error) {
            console.error('There was an error updating the activity status!', error);
        }
    };

    const handleBack = () => {
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

                    <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 2 }} margin={1}>
                        Edit Your Fitness Plan
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <TextField
                            required
                            margin="normal"
                            fullWidth
                            name="fitnessPlanTitle"
                            label="Title"
                            id="fitnessPlanTitle"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <DatePicker
                            required
                            label="Date"
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                            slots={{ textField: TextField }}
                            sx={{ marginBottom: 2, width: "100%" }}
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
                            {fitnessActivityData && fitnessActivityData.map((fitnessActivity, index) => (
                                <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Checkbox
                                        checked={fitnessActivity.status}
                                        onChange={() => handleToggleActivityStatus(index)}
                                    />
                                    <ListItemText
                                        primary={fitnessActivity.task}
                                        secondary={`${fitnessActivity.duration}`}
                                    />
                                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditFitnessActivity(index)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDelete(index)}>
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
                <Box sx={style} component="form" noValidate onSubmit={handleAddFitnessActivity}>
                    <IconButton
                        onClick={handleClose}
                        sx={{ position: 'absolute', top: 10, right: 10 }}
                    >
                        X
                    </IconButton>

                    <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 2, mt: 5 }}>
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

                <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 2, mt: 5 }}>
                    Edit Your Fitness Activity
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
                />
                <GradientButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Save
                </GradientButton>
            </Box>
        </Modal>
        <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Button 
                onClick={handleCloseDelete}
                sx={{ position: 'absolute', top: 10, right: 10 }}
            >
                X
            </Button>

            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2, mt:5 }}>
                Confirm
            </Typography>
            <Typography component="h6" variant="h6" sx={{ fontWeight: 300 , textAlign: 'center'}}>
                Are you sure you wish to delete this fitness activity?
            </Typography>
            <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleRemoveFitnessActivity}
            >
                Confirm
            </Button>
        </Box>
      </Modal>
        </LocalizationProvider>
    );
}
