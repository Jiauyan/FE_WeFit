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
};

export function DeleteGoal({id, disabled, onDeleteGoal}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [deleteGoalStatus, setDeleteGoalStatus] = useState('');
    
  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
        const response = await axios.delete(`http://localhost:3000/goals/deleteGoal/${id}`);
        console.log(response.data);
        setDeleteGoalStatus(response.data.message);
        onDeleteGoal(response.data)
        handleClose();
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setDeleteGoalStatus(error.response.data.message);
            } else {
                setDeleteGoalStatus('An error occurred');
            }
        } else {
            setDeleteGoalStatus('An unexpected error occurred');
        }
    }
};



  return (
    <div>
      <IconButton disabled={disabled} onClick={handleOpen} edge="end" aria-label="delete">
        <Delete/>
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

            <Typography id="modal-modal-title" variant="h6" component="h2">
                Confirm
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you wish to delete the goal?
            </Typography>
            <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
            >
                Confirm
            </Button>
        </Box>
      </Modal>
    </div>
  );
}