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
    Box,
    TextField,
    Pagination,
    CircularProgress
} from "@mui/material";
import { useNavigate, Outlet } from 'react-router-dom';
import { useUser } from "../../contexts/UseContext";

export function Tips(){
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user , setUser} = useUser();
  const [tips, setTips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, [page]);

useEffect(() => {
    // Check if there's a saved page number and set it
    const savedPage = sessionStorage.getItem('lastPage');
    setPage(savedPage ? parseInt(savedPage, 10) : 1);
}, []);

      useEffect(() => {
        const fetchTips = async () => {
            try {
                const uid = user?.uid;
                if (!uid) return;
                setLoading(true);
                const response = await axios.get('https://be-um-fitness.vercel.app/tips/getAllTips');
                setTips(response.data);
            } catch (error) {
                console.error('There was an error!', error);
            } finally {
              setLoading(false);
          }
        };

        fetchTips();
    }, [user?.uid]);

    const handleView = async (tip) => {
      sessionStorage.setItem('lastPage', page.toString());
      const tipId = tip.id;
      navigate("/viewTipStudent", { state: { id: tipId } });
    }; 

    // Filter programs based on search term
    const filteredTips = tips.filter(tip=>
      tip.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

    // Calculate the current programs to display based on the page
    const startIndex = (page - 1) * itemsPerPage;
    const currentTips = filteredTips.slice(startIndex, startIndex + itemsPerPage);

    if (loading) {
      return (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
              <CircularProgress />
          </Box>
      );
  }
    
    return(
      <Box sx={{ padding: 3, mt:2}}>
      <Typography variant="h5" sx={{display: 'flex', alignItems: 'center' }}>  
              Sharing Tips From Experts
      </Typography>
      <TextField
                fullWidth
                variant="outlined"
                label="Search Sharing Tips"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginBottom: 5, marginTop: 2 }}
            />
             {currentTips.length === 0 || filteredTips.length === 0 ? ( // Check if there are no tips
                <Typography variant="body1" color="text.secondary" align="center">
                    No Sharing Tips Found.
                </Typography>
            ) : (
                <>
      <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="start" marginTop={3}>
      {currentTips.map((tip) => (
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
          <Typography gutterBottom variant="h6" align="center">
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
</Box>
    );

}