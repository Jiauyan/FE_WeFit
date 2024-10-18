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
    Box,
    TextField,
    Pagination
} from "@mui/material";

import { useNavigate, Outlet } from 'react-router-dom';
import { useUser } from "../../contexts/UseContext";

export function TrainerTrainingPrograms(){
  const navigate = useNavigate();
  const { user , setUser} = useUser();
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

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

    // Filter programs based on search term
    const filteredPrograms = trainingPrograms.filter(program =>
      program.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate the current programs to display based on the page
    const startIndex = (page - 1) * itemsPerPage;
    const currentPrograms = filteredPrograms.slice(startIndex, startIndex + itemsPerPage);

    
    return(
        <>
        <Box padding={3}>
            <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                    My Training Programs
                </Typography>
                <Button
                    onClick={handleAdd}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, mb: 2 }}
                >
                    Add New
                </Button>
            </Box>
            <TextField
                fullWidth
                variant="outlined"
                label="Search Training Programs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginBottom: 5, marginTop: 2 }}
            />
             {currentPrograms.length === 0 || filteredPrograms.length === 0 ? ( // Check if there are no programs
                <Typography variant="body1" color="text.secondary" align="center">
                    No Training Programs Found.
                </Typography>
            ) : (
                <>
      <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="start" marginTop={3}>
        {currentPrograms.map((program) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={program.id}>
            <Card
                sx={{
                  width: '100%',
                  height: '100%',
                  boxShadow: 3,
                  transition: "0.3s",
                  '&:hover': { boxShadow: 10 },
              }}
              onClick={() => handleView(program)}
            >
         <CardActionArea sx={{ display: 'flex', flexDirection: 'column' }}>
         <CardMedia
         component="img"
         image={program.downloadUrl}
         alt={program.title}
         sx={{
             height: 220,
             weight : '100%', 
             objectFit: 'cover'
         }}
          />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" align="center">
              {program.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" >
              {program.fitnessLevel}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  ))}
</Grid>
<Pagination
                count={Math.ceil(filteredPrograms.length / itemsPerPage)}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                sx={{ marginTop: 3, display: 'flex', justifyContent: 'center' }}
            />
</>
)}
</Box>
<Outlet/>
</>
    );

}