import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Typography,
    Modal,
    TextField,
    IconButton,
}from "@mui/material";
import {Delete, Edit} from '@mui/icons-material';
import { GradientButton } from '../../contexts/ThemeProvider';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height : 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 20,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

export function DeleteMotivationalQuote({id, onDeleteMotivationalQuote}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [deleteMotivationalQuoteStatus, setDeleteMotivationalQuoteStatus] = useState('');
    
  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
        const response = await axios.delete(`http://localhost:3000/motivationalQuotes/deleteMotivationalQuote/${id}`);
        console.log(response.data);
        setDeleteMotivationalQuoteStatus(response.data.message);
        onDeleteMotivationalQuote(response.data)
        handleClose();
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setDeleteMotivationalQuoteStatus(error.response.data.message);
            } else {
                setDeleteMotivationalQuoteStatus('An error occurred');
            }
        } else {
            setDeleteMotivationalQuoteStatus('An unexpected error occurred');
        }
    }
};

  return (
    <div>
      <IconButton onClick={handleOpen} edge="end" aria-label="delete">
        <Delete/>
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

            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2, mt:10}} margin={1} >
                Confirm
            </Typography>
            <Typography component="h6" variant="h6" sx={{ fontWeight: 300 }} margin={1}>
                Are you sure you wish to delete the motivational quote?
            </Typography>
            <GradientButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
            >
                Confirm
            </GradientButton>
        </Box>
      </Modal>
    </div>
  );
}