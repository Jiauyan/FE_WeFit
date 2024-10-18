import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import {
    Box,
    Button,
    Typography,
    Modal,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
}from "@mui/material";
import { GradientButton } from '../../contexts/ThemeProvider';
import { useNavigate, useLocation} from 'react-router-dom';

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

export function SelectSlot({id}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [slot, setSlot] = useState('');
  const [selectSlotStatus, setSelectSlotStatus] = useState('');
  const [trainingProgramSlot, setTrainingProgramSlot] = useState([]);
  const [trainingProgramTitle, setTrainingProgramTitle] = useState('');
  const { user } = useUser();
  const uid = user.uid;
  const navigate = useNavigate();
  
  useEffect(() => {
    const uid = user?.uid;
    if (!uid) return;
    axios.get(`http://localhost:3000/trainingPrograms/getTrainingProgramById/${id}`)
      .then(response => {
        setTrainingProgramSlot(response.data.slots);
        setTrainingProgramTitle(response.data.title);
      })
      .catch(error => console.error('There was an error!', error));
  }, [user?.uid]);

  const handleView = () => { 
    navigate('/studentList', { state: { id: id ,slot } });
};



  return (
    <div>
      <GradientButton
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3, mb: 3 }}
        onClick={handleOpen}>View Students</GradientButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-slot"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} component="form" noValidate>
            <Button 
                onClick={handleClose}
                sx={{ position: 'absolute', top: 10, right: 10 }}
            >
                X
            </Button>

            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2, mt:5}} margin={1} >
                Select the slot
            </Typography>
            <FormControl margin="normal" fullWidth>
                <InputLabel id="demo-simple-select-autowidth-label">Slot</InputLabel>
                <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    fullWidth
                    label="Slot"
                >
                    {trainingProgramSlot.map((slot, index) => (
                    <MenuItem key={index} value={slot}>  
                        {slot}  
                    </MenuItem>
                    ))}
                </Select>
                </FormControl>
            <GradientButton
                    onClick={handleView}
                    fullWidth
                    variant="contained"
                    sx={{ mt: 22, mb: 2 }}
            >
                Confirm
            </GradientButton>
        </Box>
      </Modal>
    </div>
  );
}