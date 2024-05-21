import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from "../../UseContext";
import {
    Box,
    Button,
    Typography,
    Modal,
    TextField,
    IconButton,
}from "@mui/material";
import { Edit } from '@mui/icons-material';
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

export function EditGoal({id, oldTitle, disabled}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editGoalStatus, setEditGoalStatus] = useState('');
  const [title, setTitle] = useState(oldTitle);
  const { user } = useUser();
  const uid = user.uid;

  const handleSubmit = async (e) => { 
    e.preventDefault();
    const status = false;
    try {
        const response = await axios.patch(`http://localhost:3000/goals/updateGoal/${id}`, {
            uid,
            title,
            status
        });

        setEditGoalStatus(response.data.message);
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

            <Typography id="modal-modal-title" variant="h6" component="h2">
                Edit Your Goal
            </Typography>
            <TextField
                    margin="normal"
                    //required
                    fullWidth
                    name="goal"
                    label="Goal Description"
                    id="goal"
                    value ={title}
                    onChange={(e) => setTitle(e.target.value)}
            />
            <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
            >
                Save
            </Button>
        </Box>
      </Modal>
    </div>
  );
}