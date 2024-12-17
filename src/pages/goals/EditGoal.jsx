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
    CircularProgress,
    IconButton
} from "@mui/material";
import Edit from '@mui/icons-material/Edit';
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
  height: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 20,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflowY: 'auto',
};

export function EditGoal({id, oldTitle, disabled, onEditGoal}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setWordCount(0);
  }
  const [editGoalStatus, setEditGoalStatus] = useState('');
  const { user } = useUser();
  const uid = user.uid;
  const [title, setTitle] = useState(oldTitle);
  const [wordCount, setWordCount] = useState(oldTitle.split(/\s+/).filter(Boolean).length);
  const [titleError, setTitleError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' }); // Notification state
  
  const handleCloseNotification = () => setNotification({ ...notification, open: false });

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    if (!validateTitle()) {
      return;
    }
    setLoading(true);
    try {
        const response = await axios.patch(`https://be-um-fitness.vercel.app/goals/updateGoal/${id}`, {
            uid,
            title,
            status: false
        });
        setEditGoalStatus(response.data.message);
        setNotification({ open: true, message: 'Goal updated successfully!', severity: 'success' });
            setTimeout(() => {
              onEditGoal(response.data);
              handleClose();
        }, 2000);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setEditGoalStatus(error.response.data.message);
            } else {
                setEditGoalStatus('An error occurred');
            }
        } else {
            setEditGoalStatus('An unexpected error occurred');
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

const handleChange = (event) => {
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
      <IconButton disabled={disabled} onClick={handleOpen} edge="end" aria-label="edit">
        <Edit/>
     </IconButton>
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

            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 2, mt: 5 }}>
                Edit Your Goal
            </Typography>
            <TextField
                required
                multiline
                rows={5}
                margin="normal"
                fullWidth
                name="goalTitle"
                label=" Goal Description"
                id="goalTitle"
                value={title}
                onChange={handleChange}
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
    </div>
  );
}