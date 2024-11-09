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
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editGoalStatus, setEditGoalStatus] = useState('');
  const { user } = useUser();
  const uid = user.uid;
  const [title, setTitle] = useState(oldTitle);
  const [wordCount, setWordCount] = useState(oldTitle.split(/\s+/).filter(Boolean).length);

  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
        const response = await axios.patch(`http://localhost:3000/goals/updateGoal/${id}`, {
            uid,
            title,
            status: false
        });
        setEditGoalStatus(response.data.message);
        onEditGoal(response.data);
        handleClose();
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
    }
};

const handleChange = (event) => {
  const text = event.target.value;
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 25) {
    setTitle(text);
    setWordCount(words.length);
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
                multiline
                rows={5}
                margin="normal"
                fullWidth
                name="goalTitle"
                label=" Goal Description"
                id="goalTitle"
                value={title}
                onChange={handleChange}
                helperText={`${wordCount}/20 words`}
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
                Save
            </GradientButton>
        </Box>
      </Modal>
    </div>
  );
}