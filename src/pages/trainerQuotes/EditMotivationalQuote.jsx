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
}from "@mui/material";
import { Edit } from '@mui/icons-material';
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


export function EditMotivationalQuote({id, oldMotivationalQuote, onEditMotivationalQuote}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editMotivationalQuoteStatus, setEditMotivationalQuoteStatus] = useState('');
  const [motivationalQuote, setMotivationalQuote] = useState(oldMotivationalQuote);
  const { user } = useUser();
  const uid = user.uid;

  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
        const response = await axios.patch(`http://localhost:3000/motivationalQuotes/updateMotivationalQuote/${id}`, {
            uid,
            motivationalQuote
        });
        console.log(response.data);
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

  return (
    <div>
      <IconButton onClick={handleOpen} edge="end" aria-label="edit">
        <Edit/>
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

            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2, mt:5}} margin={1} >
                Edit Your Motivational Quote
            </Typography>
            <TextField
            multiline
            rows={5}
                    margin="normal"
                    //required
                    fullWidth
                    name="motivationalQuote"
                    label="Motivational Quote"
                    id="motivationalQuote"
                    value ={motivationalQuote}
                    onChange={(e) => setMotivationalQuote(e.target.value)}
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