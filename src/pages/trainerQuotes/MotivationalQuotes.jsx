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

    const MotivationalQuoteCard = styled(Paper)(({ theme }) => ({
        width: 737,
        height: 'auto',
        padding: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: "0.3s",
        borderRadius: 16,
        boxShadow: theme.shadows[3],
        '&:hover': {
            boxShadow: theme.shadows[6],
        },
    }));


    // Callback for adding a motivationalQuote
    const addMotivationalQuoteCallback = (newMotivationalQuote) => {
        setMotivationalQuotes(prevMotivationalQuotes => [newMotivationalQuote, ...prevMotivationalQuotes]);
    };

    // Callback for editing a motivationalQuote
    const editMotivationalQuoteCallback = (updatedMotivationalQuote) => {
        setMotivationalQuotes(prevMotivationalQuotes => {
            // Remove the updated quote from its current position
            const filteredQuotes = prevMotivationalQuotes.filter(motivationalQuote => motivationalQuote.id !== updatedMotivationalQuote.id);
            // Insert the updated quote at the beginning
            return [updatedMotivationalQuote, ...filteredQuotes];
        });
    };

    // Callback for deleting a motivationalQuote
    const deleteMotivationalQuoteCallback = (motivationalQuoteId) => {
        setMotivationalQuotes(prevMotivationalQuotes => prevMotivationalQuotes.filter(motivationalQuote => motivationalQuote.id !== motivationalQuoteId));
    };

    //  // Callback for randoming a motivationalQuote
    //  const getRandomMotivationalQuoteCallback = (randomMotivationalQuote) => {
    //     setRandomMotivationalQuote(randomMotivationalQuote);
    //     localStorage.setItem('randomMotivationalQuote', JSON.stringify(randomMotivationalQuote));
    // };

    // useEffect(() => {
    //     const storedUid = localStorage.getItem('uid');
    //     if (storedUid) {
    //         setUser({ ...user, uid: storedUid });
    //     }

    //     const storedRandomMotivationalQuote = localStorage.getItem('randomMotivationalQuote');
    //     if (storedRandomMotivationalQuote) {
    //         setRandomMotivationalQuote(JSON.parse(storedRandomMotivationalQuote));
    //     }
    // }, [setUser, user]);


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

    return(
        <>
            <Grid
                container
                component="main"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f0f4f8',
                    minHeight: '100vh',
                    padding: 4
                }}
            >
                <Box sx={{ flexGrow: 1, maxWidth: 737 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Your Motivational Quotes
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', mb: 2 }}>
                        <AddMotivationalQuote onAddMotivationalQuote={addMotivationalQuoteCallback} />
                    </Box>
                    <List dense={dense}>
                        {motivationalQuotes.map((motivationalQuote, index) => (
                            <Box key={index} sx={{ marginBottom: 5 }}>
                                <MotivationalQuoteCard>
                                    <Box>
                                        <Typography variant="h6" component="div">
                                            {motivationalQuote.motivationalQuote}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <>
                                        <EditMotivationalQuote id={motivationalQuote.id} oldMotivationalQuote={motivationalQuote.motivationalQuote} onEditMotivationalQuote={editMotivationalQuoteCallback} />
                                        </>
                                        <DeleteMotivationalQuote id={motivationalQuote.id} onDeleteMotivationalQuote={deleteMotivationalQuoteCallback} />
                                    </Box>
                                </MotivationalQuoteCard>
                            </Box>
                        ))}
                    </List>
                </Box>
            </Grid>
            <Outlet />
        </>
    );

}