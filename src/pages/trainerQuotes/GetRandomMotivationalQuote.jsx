import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import {
    Box,
    Button,
    Typography,
    Modal,
    TextField
}from "@mui/material";
import { GradientButton } from '../../contexts/ThemeProvider';
import Doll from "../../assets/Doll.png";

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

export function GetRandomMotivationalQuote({id, onGetRandomMotivationalQuote}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [showDialog, setShowDialog] = useState(true);
  const [randomMotivationalQuote, setRandomMotivationalQuote] = useState('');
  const [getRandomMotivationalQuoteStatus, setGetRandomMotivationalQuoteStatus] = useState('');
  const { user } = useUser();
  const uid = user.uid;

const handleRandom = async (e) => { 
    e.preventDefault(); 
    handleOpen();
    try {
        const response = await axios.get(`http://localhost:3000/motivationalQuotes/getRandomMotivationalQuote/${id}`);
        //console.log(response.data);
        setRandomMotivationalQuote(response.data);
        setGetRandomMotivationalQuoteStatus(response.data.message);
        //onGetRandomMotivationalQuote(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setGetRandomMotivationalQuoteStatus(error.response.data.message);
            } else {
                setGetRandomMotivationalQuoteStatus('An error occurred');
            }
        } else {
            setGetRandomMotivationalQuoteStatus('An unexpected error occurred');
        }
    }
};

const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
        onGetRandomMotivationalQuote(randomMotivationalQuote);
        handleClose();
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setGetRandomMotivationalQuoteStatus(error.response.data.message);
            } else {
                setGetRandomMotivationalQuoteStatus('An error occurred');
            }
        } else {
            setGetRandomMotivationalQuoteStatus('An unexpected error occurred');
        }
    }
};

  return (
    <div>
      <img 
        onClick={handleRandom} 
        src={Doll} 
        alt="Doll" 
        width="200" 
        height="170"
        style={{
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          transform: 'translateZ(0)',
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      />
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
                Get Your Motivational Quote
            </Typography>
            <Typography variant="h6" component="div">
                    {randomMotivationalQuote.motivationalQuote}
            </Typography>
            <GradientButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
            >
                Get
            </GradientButton>
        </Box>
      </Modal>
    </div>
  );
}