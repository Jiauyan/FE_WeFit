import React, { useState , useEffect} from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios'; 
import { Typography, Paper, Avatar, Button } from "@mui/material";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { DeleteTip } from './DeleteTip';

export function ViewTip() {
    const [tipData, setTipData] = useState([]);
    const [tipUserID, setTipUserID] = useState(null);
    const [tipUser, setTipUser] = useState({});
    const { user , setUser} = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state;
    
    useEffect(() => {
      // Load user ID from local storage or other persistent storage
      const storedUid = localStorage.getItem('uid');
      if (storedUid) {
          setUser({ ...user, uid: storedUid });
      }
    }, []);

    useEffect(() => {
        const uid = user?.uid;
        if (!uid) return;
        axios.get(`http://localhost:3000/tips/getTipById/${id}`)
            .then(response => {
                setTipData(response.data); 
                setTipUserID(response.data.uid);
            })
            .catch(error => console.error('There was an error!', error));
    }, [user?.uid]); 

    useEffect(() => {
        const uid = tipUserID
        axios.get(`http://localhost:3000/auth/getUserById/${uid}`)
            .then(response => {
                setTipUser(response.data); 
            })
            .catch(error => console.error('There was an error!', error));
    }, [tipUserID]); 

    const handleEdit = async (id) => {
      navigate("/editTip", { state: { id: id } });
    }; 

    const handleBack = async () => {
      navigate("/trainerTips");
    }; 

  return (
    <>
   <Paper
  sx={{
    width: 737,  // Fixed width, consider making it responsive if needed
    height: 'auto',  // Height auto-adjusts to content
    m: 10,  // Margin for spacing from surrounding content
    p: 5,  // Padding for internal spacing
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: 3,  // Consistent shadow for depth
    borderRadius: 2,  // Rounded corners
    backgroundColor: 'background.paper',  // Ensures it uses the theme's background color for paper elements
  }}
>
<Button
    fullWidth
    variant="contained"
    color="primary"  // Use primary color to align with theme
    sx={{ mt: 3, mb: 2 }}
    onClick={handleBack}
  >
    Back
  </Button>
  <Typography
    variant="h5" 
    component="h2"  // Semantically correct header tag
    sx={{ mb: 3, textAlign: 'center' }}  // Centered text for the title
  >
    {tipData.title}
  </Typography>
    <Typography
        variant="body2"
        color="textSecondary"
        sx={{ mb: 3 }}
    >
        Created at: {tipData.createdAt}
    </Typography>
    {tipData.downloadUrl && (
    <img
      src={tipData.downloadUrl}
      alt={tipData.title}
      style={{
        width: '100%',  // Full width of the container
        maxHeight: '500px',  // Max height to control large images
        objectFit: 'contain',  // Ensures the image is contained within the element without stretching
        marginBottom: '30px'
      }}
    />
  )}
  <Typography
  variant="body1"  // More appropriate for body text
  sx={{  textAlign: 'justify', whiteSpace: 'pre-wrap' }}  // Preserves formatting
  >
  {tipData.desc}
</Typography>
    <Button
         fullWidth
         variant="contained"
         color="primary"  
         sx={{ mt: 3, mb: 2 }}
        onClick={() => handleEdit(id)}
    >
        Edit
    </Button>
    <DeleteTip id={id} />
</Paper>
    <Outlet/>
    </>
  );
}
