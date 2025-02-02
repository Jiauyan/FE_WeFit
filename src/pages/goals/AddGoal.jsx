import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import {
    Box,
    Button,
    Typography,
    Modal,
    TextField,
    Snackbar,
    CircularProgress
} from "@mui/material";
import { GradientButton } from '../../contexts/ThemeProvider';
import MuiAlert from '@mui/material/Alert';

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

export function AddGoal({onAddGoal}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setWordCount(0);
  }
  const [title, setTitle] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [addGoalStatus, setAddGoalStatus] = useState('');
  const [titleError, setTitleError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' }); // Notification state
  const { user } = useUser();
  const uid = user.uid;

  const handleCloseNotification = () => setNotification({ ...notification, open: false });

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    if (!validateTitle()) {
      return;
    }
    setLoading(true);
    try {
        const response = await axios.post('https://be-um-fitness.vercel.app/goals/addGoal', {
            uid,
            title,
            status: false
        });
        setAddGoalStatus(response.data.message);
        setTitle('');
        setWordCount(0);
        setNotification({ open: true, message: 'Goal added successfully!', severity: 'success' });
            setTimeout(() => {
              onAddGoal(response.data);
              handleClose();
        }, 2000);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setAddGoalStatus(error.response.data.message);
                setNotification({
                  open: true,
                  message: error.response.data.message,
                  severity: 'error',
                });
            } else {
                setAddGoalStatus('An error occurred');
                setNotification({
                  open: true,
                  message: 'An error occurred',
                  severity: 'error',
                });
            }
        } else {
            setAddGoalStatus('An unexpected error occurred');
            setNotification({
              open: true,
              message: 'An unexpected error occurred',
              severity: 'error',
            });
        }
    } finally {
      setLoading(false)
    }
};

const validateTitle = () => {
  if (!title.trim()) {
    setTitleError('Goal description is required');
    return false;
  } else if (wordCount > 20) {
    setTitleError('Goal description must not exceed 20 words');
    return false;
  }
  setTitleError('');
  return true;
};

const handleWordLimit = (event) => {
  const inputWords = event.target.value.split(/\s+/).filter(Boolean);
  if (inputWords.length <= 20) {
      setTitle(event.target.value);
      setWordCount(inputWords.length);
      setTitleError(''); // Clears the error if input is corrected
  } else {
      setTitleError('Goal description must not exceed 20 words');
  }
};

  return (
    <div>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3, mb: 3 }}
        onClick={handleOpen}>Add New</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        
        <Box sx={style} component="form" noValidate onSubmit={handleSubmit}>
            <Button 
                onClick={handleClose}
                sx={{ position: 'absolute', top: 10, right: 10 }}
            >
                X
            </Button>

            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2, mt:5 }}>
               Add Your Goal
            </Typography>
            <TextField
                required
                multiline
                rows={5}
                margin="normal"
                fullWidth
                name="goalTitle"
                label="Goal Description"
                id="goalTitle"
                value={title}
                onChange={handleWordLimit}
                error={!!titleError}
                helperText={titleError || `${wordCount}/20 words`}
                FormHelperTextProps={{
                    style: { textAlign: 'right' }  // Aligns text to the right
                }}
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
    </div>
    
  );
}