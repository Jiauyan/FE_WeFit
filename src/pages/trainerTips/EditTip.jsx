import React, { useState , useEffect} from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios'; 
import { 
    Typography, 
    Paper, 
    Avatar, 
    Button, 
    Box,
    TextField,
} from "@mui/material";
import {  useNavigate, Outlet, useLocation} from 'react-router-dom';

export function EditTip() {
    const [userData, setTipData] = useState({});
    const { user , setUser} = useUser();
    const uid = user?.uid;
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [tipImage, setTipImage] = useState(null);
    const [editTipStatus, setEditTipStatus] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state;
    
    useEffect(() => {
        const fetchTipData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/tips/getTipById/${id}`);
                const data = response.data;
                setTipData(data);
                setTitle(data.title);
                setDesc(data.desc);
                setTipImage(data.downloadUrl);
            } catch (error) {
                console.error('There was an error fetching the tip data!', error);
            }
        };

        if (id) {
            fetchTipData();
        }
    }, []);

    const handleSubmit = async (e) => { 
        e.preventDefault();
        const formData = new FormData();
        formData.append('tipImage', tipImage); 
        formData.append('uid', uid);
        formData.append('title', title);
        formData.append('desc', desc);
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        try {
            const response = await axios.patch(`http://localhost:3000/tips/updateTip/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setEditTipStatus(response.data.message);
            navigate("/viewTip", { state: { id: id } });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setEditTipStatus(error.response.data.message);
                } else {
                    setEditTipStatus('An error occurred');
                }
            } else {
                setEditTipStatus('An unexpected error occurred');
            }
        }
    };

    const handleBack = async () => {
        navigate("/viewTip", { state: { id: id } });
    }; 

  return (
    <>
    <Paper sx={{
    width: 737,
    height: 'auto',  // Automatically adjust height based on content
    m: 10,
    p: 3,  // Consistent padding
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)',  // Subtle shadow for depth
    borderRadius: 2  // Soft rounded corners
}}>
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleBack}
        >
            Back
        </Button>
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Edit Your Sharing Tip
        </Typography>
        <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Sharing Tip Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
        />
        {tipImage && (
            <img src={tipImage} alt={title} style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', marginBottom: '20px' }} />
        )}
        <input
            type="file"
            onChange={(e) => setTipImage(e.target.files[0])}
            style={{ marginBottom: '20px' }}
        />
        <TextField
            margin="normal"
            required
            fullWidth
            id="desc"
            label="Sharing Tip Description"
            name="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            sx={{ mb: 2 }}
        />
        <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 3 }}
        >
            Save
        </Button>
    </Box>
</Paper>
    <Outlet/>
    </>
  );
}
