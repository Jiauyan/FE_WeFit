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

export function AddMotivationalQuote({onAddMotivationalQuote}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setMotivationalQuote('');
    setWordCount(0);
  }
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [addMotivationalQuoteStatus, setAddMotivationalQuoteStatus] = useState('');
  const [motivationalQuoteError, setMotivationalQuoteError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' }); // Notification state
  const { user } = useUser();
  const uid = user.uid;

  const handleCloseNotification = () => setNotification({ ...notification, open: false });

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    if (!validateMotivationalQuote()) {
      return;
    }
    setLoading(true);
    try {
        const response = await axios.post('https://be-um-fitness.vercel.app/motivationalQuotes/addMotivationalQuote', {
            uid,
            motivationalQuote
        });
        setAddMotivationalQuoteStatus(response.data.message);
        setMotivationalQuote('');
        setWordCount(0);
        setNotification({ open: true, message: 'Motivational quote added successfully!', severity: 'success' });
            setTimeout(() => {
              onAddMotivationalQuote(response.data);
              handleClose();
        }, 2000);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setAddMotivationalQuoteStatus(error.response.data.message);
            } else {
                setAddMotivationalQuoteStatus('An error occurred');
            }
        } else {
            setAddMotivationalQuoteStatus('An unexpected error occurred');
        }
    } finally {
      setLoading(false)
    }
  };

  const handleWordLimit = (event) => {
    const inputWords = event.target.value.split(/\s+/).filter(Boolean);
    if (inputWords.length <= 25) {
        setMotivationalQuote(event.target.value);
        setWordCount(inputWords.length);
        setMotivationalQuoteError(''); // Clears the error if input is corrected
    } else {
      setMotivationalQuoteError('Motivational quote must not exceed 25 words');
    }
  };
  

  const validateMotivationalQuote = () => {
    if (!motivationalQuote.trim()) {
      setMotivationalQuoteError('Motivational quote is required');
      return false;
    } else if (wordCount > 25) {
      setMotivationalQuoteError('Motivational quote must not exceed 25 words');
      return false;
    }
    setMotivationalQuoteError('');
    return true;
  };

  return (
    <div>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3, mb: 3 }}
        onClick={handleOpen}
      >
        Add New
      </Button>
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

            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2, mt:5 }}>
                Add Your Motivational Quote
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
                onChange={handleWordLimit}
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
                disabled={wordCount > 25}
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
