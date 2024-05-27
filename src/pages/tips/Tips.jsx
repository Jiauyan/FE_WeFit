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
    CardActions,
    Grid,
    Box
} from "@mui/material";

import gym from "../../assets/gym.png";
import { useNavigate, Outlet } from 'react-router-dom';
import { useUser } from "../../UseContext";

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
      <Grid container spacing={3} justifyContent="center">
      {tips.map((tip, index) => (
        <Grid item key={index}>
          <Card onClick={() => handleView(tip)} sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ p: 2 }}
              component="img"
              height="194"
              image={tip.downloadUrl}
              alt="Gym"
            />
            <CardHeader
              title={tip.title}
              subheader={tip.desc} 
            />
          </Card>
        </Grid>
      ))}
    </Grid>
    );

}