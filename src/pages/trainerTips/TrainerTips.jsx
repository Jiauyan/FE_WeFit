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
    CardActionArea,
    Grid,
    Box,
    TextField,
    Pagination
} from "@mui/material";

import gym from "../../assets/gym.png";
import { useNavigate, Outlet } from 'react-router-dom';
import { useUser } from "../../contexts/UseContext";

export function TrainerTips(){
  const navigate = useNavigate();
  const { user , setUser} = useUser();
  const uid = user.uid;
  const [tips, setTips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

      useEffect(() => {
        const fetchTips = async () => {
            try {
                const uid = user?.uid;
                if (!uid) return;
                const response = await axios.get(`http://localhost:3000/tips/getAllUserTips/${uid}`);
                setTips(response.data);
            } catch (error) {
                console.error('There was an error!', error);
            }
        };

        fetchTips();
    }, [user?.uid]);

    const handleAdd = async () => {
      navigate("/addTip");
    }; 

    const handleView = async (tip) => {
      const tipId = tip.id;
      navigate("/viewTip", { state: { id: tipId } });
    }; 

    // Filter programs based on search term
    const filteredTips = tips.filter(tip=>
      tip.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

    // Calculate the current programs to display based on the page
    const startIndex = (page - 1) * itemsPerPage;
    const currentTips = filteredTips.slice(startIndex, startIndex + itemsPerPage);
    
    return(
       <Box padding={3}>
            <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                    My Sharing Tips
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
                label="Search Sharing Tips"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginBottom: 5, marginTop: 2 }}
            />
             {currentTips.length === 0 || filteredTips.length === 0 ? ( // Check if there are no programs
                <Typography variant="body1" color="text.secondary" align="center">
                    No Sharing Tip Found.
                </Typography>
            ) : (
                <>
      <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="start" marginTop={3}>
      {currentTips.map((tip, index) => (
         <Grid item xs={12} sm={6} md={4} lg={3} key={tip.id}>
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
             height: 220,
             weight : '100%', 
             objectFit: 'cover'
         }}
          />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" align="center">
              {tip.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {tip.shortDesc}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  ))}
</Grid>
<Pagination
                count={Math.ceil(filteredTips.length / itemsPerPage)}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                sx={{ marginTop: 3, display: 'flex', justifyContent: 'center' }}
            />
            </>
            )}
<Outlet/>
</Box>
    );

}