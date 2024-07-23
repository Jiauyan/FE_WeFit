import React, { useState , useEffect} from 'react';
import axios from 'axios';
import {
    Typography,
    Card,
    Button,
    CardMedia,
    CardContent,
    CardActionArea,
    Grid,
    Box
} from "@mui/material";

import { useNavigate, Outlet } from 'react-router-dom';
import { useUser } from "../../contexts/UseContext";

export function TrainerTrainingPrograms(){
  const navigate = useNavigate();
  const { user , setUser} = useUser();
  const [trainingPrograms, setTrainingPrograms] = useState([]);

      useEffect(() => {
        const fetchTrainingPrograms = async () => {
            try {
                const uid = user?.uid;
                if (!uid) return;
                const response = await axios.get(`http://localhost:3000/trainingPrograms/getAllUserTrainingPrograms/${uid}`);
                setTrainingPrograms(response.data);
            } catch (error) {
                console.error('There was an error!', error);
            }
        };

        fetchTrainingPrograms();
    }, [user?.uid]);

    const handleAdd = async () => {
      navigate("/addTrainingProgram");
    }; 

    const handleView = async (trainingProgram) => {
      const trainingProgramId = trainingProgram.id;
      navigate("/viewTrainerTrainingProgram", { state: { id: trainingProgramId } });
    }; 

    
    return(
        <>
        <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent:'center',
            margin:4,
        }}>
        <Button
            onClick={handleAdd}
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
        >
            Add Training Program
        </Button>
        </Box>
    <Grid container padding={4} spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="center" marginTop={2}>
      {trainingPrograms.map((trainingProgram, index) => (
        <Grid item xs={2} sm={4} md={4} key={index}>
       <Card
                sx={{
                  width: '100%',
                  height: '100%',
                  boxShadow: 3,
                  transition: "0.3s",
                  '&:hover': { boxShadow: 10 },
              }}
        onClick={() => handleView(trainingProgram)}
      >
         <CardActionArea sx={{ display: 'flex', flexDirection: 'column' }}>
         <CardMedia
         component="img"
         image={trainingProgram.downloadUrl}
         alt={trainingProgram.title}
         sx={{
             height: 220,
             weight : '100%', 
             objectFit: 'cover'
         }}
          />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" >
              {trainingProgram.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" >
              {trainingProgram.fitnessLevel}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  ))}
</Grid>
<Outlet/>
</>
    );

}