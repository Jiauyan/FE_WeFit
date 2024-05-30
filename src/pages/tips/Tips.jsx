import React, { useState , useEffect} from 'react';
import axios from 'axios';
import {
    Typography,
    Card,
    CardHeader,
    Avatar,
    IconButton,
    Button,
    CardMedia,
    CardContent,
    CardActionArea,
    Grid,
    Box
} from "@mui/material";

import gym from "../../assets/gym.png";
import { useNavigate, Outlet } from 'react-router-dom';
import { useUser } from "../../contexts/UseContext";

export function Tips(){
  const navigate = useNavigate();
  const { user , setUser} = useUser();
  const uid = user.uid;
  const [tips, setTips] = useState([]);

      useEffect(() => {
        const fetchTips = async () => {
            try {
                const uid = user?.uid;
                if (!uid) return;
                const response = await axios.get('http://localhost:3000/tips/getAllTips');
                setTips(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('There was an error!', error);
            }
        };

        fetchTips();
    }, [user?.uid]);

    const handleView = async (tip) => {
      const tipId = tip.id;
      navigate("/viewTipStudent", { state: { id: tipId } });
    }; 

    
    return(
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="center">
  {tips.map((tip, index) => (
     <Grid item xs={2} sm={4} md={4} key={index}>
       <Card
                sx={{
                  width: '100%',
                  height: '100%',
                  boxShadow: 3,
                  transition: "0.3s",
                  '&:hover': { boxShadow: 10 },
              }}
        onClick={() => handleView(tip)}
      >
         <CardActionArea sx={{ display: 'flex', flexDirection: 'column' }}>
         <CardMedia
         component="img"
         image={tip.downloadUrl}
         alt={tip.title}
         sx={{
             height: 220,// Fixed height or adjust as needed
             weight : '100%', 
             objectFit: 'cover'
         }}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="div">
              {tip.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tip.createdAt}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  ))}
</Grid>
    );

}