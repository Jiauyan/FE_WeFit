import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import {
    Box,
    Button,
    Typography,
    Modal,
    TextField
} from "@mui/material";
import { GradientButton } from '../../contexts/ThemeProvider';

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
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [addMotivationalQuoteStatus, setAddMotivationalQuoteStatus] = useState('');
  const { user } = useUser();
  const uid = user.uid;

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    try {
        const response = await axios.post('https://be-um-fitness.vercel.app/motivationalQuotes/addMotivationalQuote', {
            uid,
            motivationalQuote
        });
        setAddMotivationalQuoteStatus(response.data.message);
        onAddMotivationalQuote(response.data);
        setMotivationalQuote('');
        setWordCount(0);
        handleClose();
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
    }
  };

  const handleWordLimit = (event) => {
    const inputWords = event.target.value.split(/\s+/).filter(Boolean);
    if (inputWords.length <= 25) {
        setMotivationalQuote(event.target.value);
        setWordCount(inputWords.length);
    }
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
                multiline
                rows={5}
                margin="normal"
                fullWidth
                name="motivationalQuote"
                label="Motivational Quote"
                id="motivationalQuote"
                value={motivationalQuote}
                onChange={handleWordLimit}
                helperText={`${wordCount}/25 words`}
                FormHelperTextProps={{
                    style: { textAlign: 'right' }  // Aligns text to the right
                }}
            />
            <GradientButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={wordCount > 20}
            >
                Add
            </GradientButton>
        </Box>
      </Modal>
    </div>
  );
}
