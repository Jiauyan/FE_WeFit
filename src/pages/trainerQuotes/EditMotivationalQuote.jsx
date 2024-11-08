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
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
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
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editMotivationalQuoteStatus, setEditMotivationalQuoteStatus] = useState('');
  const { user } = useUser();
  const uid = user.uid;

  const [motivationalQuote, setMotivationalQuote] = useState(oldMotivationalQuote);
  const [wordCount, setWordCount] = useState(oldMotivationalQuote.split(/\s+/).filter(Boolean).length);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`http://localhost:3000/motivationalQuotes/updateMotivationalQuote/${id}`, {
        uid,
        motivationalQuote
      });
      setEditMotivationalQuoteStatus(response.data.message);
      onEditMotivationalQuote(response.data);
      handleClose();
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
    }
  };

  const handleChange = (event) => {
    const text = event.target.value;
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length <= 25) {
      setMotivationalQuote(text);
      setWordCount(words.length);
    }
  };

  return (
    <div>
      <IconButton onClick={handleOpen} edge="end" aria-label="edit">
        <EditIcon />
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
            multiline
            rows={5}
            margin="normal"
            fullWidth
            name="motivationalQuote"
            label="Motivational Quote"
            id="motivationalQuote"
            value={motivationalQuote}
            onChange={handleChange}
            helperText={`${wordCount}/25 words`}
            FormHelperTextProps={{
              style: { textAlign: 'right' }
            }}
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
    </div>
  );
}
