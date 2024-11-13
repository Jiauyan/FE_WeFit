import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import {
    Typography,
    Box,
    Paper,
    styled,
    List,
    IconButton,
    Grid,
    TextField,
    Card,
    CardActionArea,
    CardContent,
    Pagination
} from "@mui/material";
import { useNavigate, Outlet } from 'react-router-dom';
import { AddMotivationalQuote } from "../trainerQuotes/AddMotivationalQuote";
import { DeleteMotivationalQuote } from "../trainerQuotes/DeleteMotivationalQuote"
import { EditMotivationalQuote } from "../trainerQuotes/EditMotivationalQuote"
import { GetRandomMotivationalQuote } from "../trainerQuotes/GetRandomMotivationalQuote"

export function MotivationalQuotes(){
    const [motivationalQuotes, setMotivationalQuotes] = useState([]);
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    const [completedMotivationalQuotes, setCompletedMotivationalQuotes] = useState({});
    const [completedMotivationalQuotesStatus, setCompletedMotivationalQuotesStatus] = useState("");
    const [userData, setUserData] = useState([]);
    const { user , setUser} = useUser();
    const uid = user.uid;
    const [randomMotivationalQuote, setRandomMotivationalQuote] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        window.scrollTo(0, 0); 
      }, [page]);

    // Callback for adding a motivationalQuote
    const addMotivationalQuoteCallback = (newMotivationalQuote) => {
        setMotivationalQuotes(prevMotivationalQuotes => [newMotivationalQuote, ...prevMotivationalQuotes]);
        setPage(1);
    };

    // Callback for editing a motivationalQuote
    const editMotivationalQuoteCallback = (updatedMotivationalQuote) => {
        setMotivationalQuotes(prevMotivationalQuotes => {
            // Remove the updated quote from its current position
            const filteredQuotes = prevMotivationalQuotes.filter(motivationalQuote => motivationalQuote.id !== updatedMotivationalQuote.id);
            // Insert the updated quote at the beginning
            return [updatedMotivationalQuote, ...filteredQuotes];
        });
    setPage(1);
    };

    // Callback for deleting a motivationalQuote
    const deleteMotivationalQuoteCallback = (motivationalQuoteId) => {
        setMotivationalQuotes(prevMotivationalQuotes => prevMotivationalQuotes.filter(motivationalQuote => motivationalQuote.id !== motivationalQuoteId));
    };

      useEffect(() => {
        const fetchMotivationalQuotes = async () => {
            try {
                const uid = user?.uid;
                if (!uid) return;
                const response = await axios.get(`http://localhost:3000/motivationalQuotes/getAllUserMotivationalQuotes/${uid}`);
                const sortedMotivationalQuote = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setMotivationalQuotes(sortedMotivationalQuote);
            } catch (error) {
                console.error('There was an error!', error);
            }
        };
        fetchMotivationalQuotes();
    }, [user?.uid]);

    // Filter programs based on search term
    const filteredMotivationalQuotes = motivationalQuotes.filter(motivationalQuote=>
        motivationalQuote.motivationalQuote.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
      // Calculate the current programs to display based on the page
      const startIndex = (page - 1) * itemsPerPage;
      const currentMotivationalQuotes = filteredMotivationalQuotes.slice(startIndex, startIndex + itemsPerPage);
      

    return(
        <Box sx={{ p: 3, width: '100%', boxSizing: 'border-box' }}>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%'
        }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
            My Motivational Quotes
          </Typography>
          <AddMotivationalQuote onAddMotivationalQuote={addMotivationalQuoteCallback} />
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          label="Search Motivational Quotes"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 5, mt: 2 }}
        />
        {currentMotivationalQuotes.length === 0 || filteredMotivationalQuotes.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            No Motivational Quotes Found.
          </Typography>
        ) : (
          <>
            <Grid container spacing={2} sx={{  }}>
            {currentMotivationalQuotes.map((quote) => (
                <Grid item xs={12} key={quote.id} sx={{ width: '100%',}}>
                <Card sx={{ width: '100%' }}>
                    <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Grid container item xs={12} >
                    <Grid item xs={11}>
                        <Typography 
                            variant="body1" 
                            align="left" 
                            sx={{
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word'
                            }}
                        >
                            {quote.motivationalQuote}
                        </Typography>
                        </Grid>
                        <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <EditMotivationalQuote id={quote.id} oldMotivationalQuote={quote.motivationalQuote} onEditMotivationalQuote={editMotivationalQuoteCallback} />
                        <DeleteMotivationalQuote id={quote.id} onDeleteMotivationalQuote={deleteMotivationalQuoteCallback} />
                        </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                </Grid>
            ))}
            </Grid>
            <Pagination
              count={Math.ceil(filteredMotivationalQuotes.length / itemsPerPage)}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
              sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
            />
          </>
        )}
        <Outlet/>
      </Box>
            );

}