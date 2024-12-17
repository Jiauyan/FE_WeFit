import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import {
    Box,
    Button,
    Typography,
    Modal,
    TextField,
    Snackbar,
    CircularProgress,
    IconButton
} from "@mui/material";
import Edit from '@mui/icons-material/Edit';
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

export function EditPost({id, oldDesc, onEditPost}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editPostStatus, setEditPostStatus] = useState('');
  const [postDetails, setPostDetails] = useState(oldDesc);
  const [postError, setPostError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' }); // Notification state
  const { user } = useUser();
  const uid = user.uid;

  const handleCloseNotification = () => setNotification({ ...notification, open: false });

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    if (!validatePost()) {
      return;
    }
    setLoading(true);
    try {
        const response = await axios.patch(`https://be-um-fitness.vercel.app/posts/updatePost/${id}`, {
            uid,
            postDetails
        });
        setEditPostStatus(response.data.message);
        setNotification({ open: true, message: 'Post updated successfully!', severity: 'success' });
        setTimeout(() => {
          onEditPost(response.data);
          handleClose();
    }, 2000);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setEditPostStatus(error.response.data.message);
                setNotification({
                  open: true,
                  message: error.response.data.message,
                  severity: 'error',
                });
            } else {
                setEditPostStatus('An error occurred');
                setNotification({
                  open: true,
                  message: 'An error occurred',
                  severity: 'error',
                });
            }
        } else {
            setEditPostStatus('An unexpected error occurred');
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

const validatePost = () => {
  const cleanPost = postDetails.trim();
  const normalizedPost = cleanPost.normalize("NFKC");

  if (!cleanPost) {
    setPostError('Post description is required');
    return false;
  }

  // Check for potentially harmful scripts or HTML tags
  if (/<\/?[a-z][^>]*>/i.test(normalizedPost)) {
    setPostError('Invalid input: HTML tags are not allowed');
    return false;
  }

  if (/[\u0080-\u00FF]/.test(normalizedPost)) {
    setPostError('Invalid input: contains non-ASCII or control characters');
    return false;
}

  setPostError('');
  return true;
};


  return (
    <div>
      <IconButton onClick={handleOpen} edge="end" aria-label="edit">
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

            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2, mt:2}} margin={1} >
                Edit Your Post
            </Typography>
            <TextField
            multiline
            rows={5}
                    margin="normal"
                    required
                    fullWidth
                    name="post"
                    label="Post Description"
                    id="post"
                    value ={postDetails}
                    onChange={(e) => {
                      setPostDetails(e.target.value);
                      setPostError('');
                    }}
                    error={!!postError}
                    helperText={postError}
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
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
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