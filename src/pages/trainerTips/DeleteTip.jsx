import React, { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Button,
    Typography,
    Modal,
    MenuItem,
    Snackbar,
    CircularProgress,
}from "@mui/material";
import { GradientButton } from '../../contexts/ThemeProvider';
import MuiAlert from '@mui/material/Alert';

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

export function DeleteTip({id}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [deleteTipStatus, setDeleteTipStatus] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' }); // Notification state
  
  const handleCloseNotification = () => setNotification({ ...notification, open: false });

  const handleSubmit = async (e) => { 
    e.preventDefault();
    setLoading(true);
    try {
        const response = await axios.delete(`https://be-um-fitness.vercel.app/tips/deleteTip/${id}`);
        setDeleteTipStatus(response.data.message);
        setNotification({ open: true, message: 'Sharing tip deleted successfully!', severity: 'success' });
        setTimeout(() => {
          handleClose();
          navigate("/trainerTips");
    }, 2000);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setDeleteTipStatus(error.response.data.message);
                setNotification({
                  open: true,
                  message: error.response.data.message,
                  severity: 'error',
                });
            } else {
                setDeleteTipStatus('An error occurred');
                setNotification({
                  open: true,
                  message: 'An error occurred',
                  severity: 'error',
                });
            }
        } else {
            setDeleteTipStatus('An unexpected error occurred');
            setNotification({
              open: true,
              message: 'An unexpected error occurred',
              severity: 'error',
            });
        }
    } finally {
      setLoading(false)
    }
};

  return (
    <div>
      <MenuItem
      onClick={handleOpen} 
      aria-label="delete">
        Delete
     </MenuItem>
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

            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2, mt:5 }}>
                Confirm
            </Typography>
            <Typography component="h6" variant="h6" sx={{ fontWeight: 300 , textAlign: 'center'}}>
                Are you sure you wish to delete this sharing tip?
            </Typography>
            <GradientButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
            >
                 {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
            </GradientButton>
        </Box>
      </Modal>
      <Snackbar
      open={notification.open}
      autoHideDuration={2000}
      onClose={handleCloseNotification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <MuiAlert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
        {notification.message}
      </MuiAlert>
    </Snackbar>
    </div>
  );
}