import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from "../../UseContext";
import {
    Box,
    Button,
    Typography,
    Modal,
    TextField
}from "@mui/material";

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

export function AddGoal({onAddGoal}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [title, setTitle] = useState('');
  const [addGoalStatus, setAddGoalStatus] = useState('');
  const { user } = useUser();
  const uid = user.uid;

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    try {
        const response = await axios.post('http://localhost:3000/goals/addGoal', {
            uid,
            title,
            status: false
        });
        console.log(response.data);
        setAddGoalStatus(response.data.message);
        onAddGoal(response.data);
        handleClose();
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setAddGoalStatus(error.response.data.message);
            } else {
                setAddGoalStatus('An error occurred');
            }
        } else {
            setAddGoalStatus('An unexpected error occurred');
        }
    }
};



  return (
    <div>
      <Button onClick={handleOpen}>Add New</Button>
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
                Add A New Goal
            </Typography>
            <TextField
                    margin="normal"
                    //required
                    fullWidth
                    name="goal"
                    label="Goal Description"
                    id="goal"
                    onChange={(e) => setTitle(e.target.value)}
            />
            <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
            >
                Add
            </Button>
        </Box>
      </Modal>
    </div>
  );
}