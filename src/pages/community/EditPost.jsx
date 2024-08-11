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


export function EditPost({id, oldDesc, onEditPost}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editPostStatus, setEditPostStatus] = useState('');
  const [postDetails, setPostDetails] = useState(oldDesc);
  const { user } = useUser();
  const uid = user.uid;

  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
        const response = await axios.patch(`http://localhost:3000/posts/updatePost/${id}`, {
            uid,
            postDetails
        });
        console.log(response.data);
        setEditPostStatus(response.data.message);
        onEditPost(response.data);
        handleClose();
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setEditPostStatus(error.response.data.message);
            } else {
                setEditPostStatus('An error occurred');
            }
        } else {
            setEditPostStatus('An unexpected error occurred');
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

            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2, mt:5}} margin={1} >
                Edit Your Post
            </Typography>
            <TextField
            multiline
            rows={5}
                    margin="normal"
                    //required
                    fullWidth
                    name="post"
                    label="Post Description"
                    id="post"
                    value ={postDetails}
                    onChange={(e) => setPostDetails(e.target.value)}
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