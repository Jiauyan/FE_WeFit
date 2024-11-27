import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import {
    Box,
    Button,
    Typography,
    Modal,
    TextField,
    IconButton,
    Snackbar,
    CircularProgress,
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

export function EditMotivationalQuote({ id, oldMotivationalQuote, onEditMotivationalQuote }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editMotivationalQuoteStatus, setEditMotivationalQuoteStatus] = useState('');
  const { user } = useUser();
  const uid = user.uid;
  const [motivationalQuote, setMotivationalQuote] = useState(oldMotivationalQuote);
  const [wordCount, setWordCount] = useState(oldMotivationalQuote.split(/\s+/).filter(Boolean).length);
  const [motivationalQuoteError, setMotivationalQuoteError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' }); // Notification state
 
  const handleCloseNotification = () => setNotification({ ...notification, open: false });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!validateMotivationalQuote()) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.patch(`https://be-um-fitness.vercel.app/motivationalQuotes/updateMotivationalQuote/${id}`, {
        uid,
        motivationalQuote
      });
      setEditMotivationalQuoteStatus(response.data.message);
      setNotification({ open: true, message: 'Motivational quote updated successfully!', severity: 'success' });
            setTimeout(() => {
              onEditMotivationalQuote(response.data);
              handleClose();
        }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setEditMotivationalQuoteStatus(error.response.data.message);
        } else {
          setEditMotivationalQuoteStatus('An error occurred');
        }
      } else {
        setEditMotivationalQuoteStatus('An unexpected error occurred');
      }
    } finally {
      setLoading(false)
    }
  };

  const handleChange = (event) => {
    const inputWords = event.target.value.split(/\s+/).filter(Boolean);
    if (inputWords.length <= 25) {
        setMotivationalQuote(event.target.value);
        setWordCount(inputWords.length);
        setMotivationalQuoteError(''); // Clears the error if input is corrected
    } else {
      setMotivationalQuoteError('Motivational Quote must not exceed 25 words');
    }
  };
  
  const validateMotivationalQuote = () => {
    if (!motivationalQuote.trim()) {
      setMotivationalQuoteError('Motivational Quote is required');
      return false;
    } else if (wordCount > 25) {
      setMotivationalQuoteError('Motivational Quote must not exceed 25 words');
      return false;
    }
    setMotivationalQuoteError('');
    return true;
  };

  return (
    <div>
      <IconButton onClick={handleOpen} edge="end" aria-label="edit">
        <Edit />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-motivationalQuote"
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
            Edit Your Motivational Quote
          </Typography>
          <TextField
                required
                multiline
                rows={5}
                margin="normal"
                fullWidth
                name="motivationalQuote"
                label="Motivational Quote"
                id="motivationalQuote"
                value={motivationalQuote}
                onChange={handleChange}
                error={!!motivationalQuoteError}
                helperText={motivationalQuoteError || `${wordCount}/25 words`}
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
