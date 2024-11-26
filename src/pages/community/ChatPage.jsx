import React, { useState, useEffect } from 'react';
import { Tooltip, IconButton, Box, Paper, Grid, TextField, List, 
  ListItemAvatar, ListItemText, Avatar,
  ListItemButton, Typography, ListItemSecondaryAction,
  Pagination, CircularProgress
} from '@mui/material';
import axios from 'axios';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import Add from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../contexts/UseContext";
import { format, isToday, isYesterday, parseISO } from 'date-fns';

export function ChatPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [chatrooms, setChatrooms] = useState([]);
  const [filteredChatrooms, setFilteredChatrooms] = useState([])
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  useEffect(() => {
    const fetchAndProcessChatrooms = async () => {
      const uid = user?.uid;
        if (!uid) return;
        setLoading(true);
        try {
          const response = await axios.get(`https://be-um-fitness.vercel.app/chat/getChatroomsByUser/${uid}`);
          const newChatrooms = response.data;
          setChatrooms(newChatrooms);

          // Process chatrooms: sort and filter
          const sortedChatrooms = newChatrooms
            .map(chatroom => ({
              ...chatroom,
              lastMessage: Object.values(chatroom.chatroomDetails.messages || {}).slice(-1)[0]
            }))
            .sort((a, b) => {
              const timestampA = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0;
              const timestampB = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0;
              return timestampB - timestampA;  // Sort by descending order of timestamps
            });

          // Filter sorted chatrooms by the search term (username)
          const filtered = sortedChatrooms.filter(chatroom =>
            chatroom.otherUserDetails.username.toLowerCase().includes(searchTerm.toLowerCase())
          );

          setFilteredChatrooms(filtered);
        } catch (error) {
          console.error('Error fetching chatrooms:', error);
        } finally {
          setLoading(false);
        }
    };

    fetchAndProcessChatrooms();
  }, [user.uid, searchTerm]);

  
    const formatDateOrTime = (timestamp) => {
      const date = parseISO(timestamp);
      
      if (isToday(date)) {
        return format(date, 'h:mm aa'); // Time for today
      }
      if (isYesterday(date)) {
        return 'Yesterday'; // "Yesterday" for yesterday's date
      }
      return format(date, 'dd/MM/yyyy'); // Date in the format: 31/8/2024 for any other day
    };
    
  const handleBack = () => {
    navigate("/community");
  };

  const handleAdd = async () => {
    navigate("/userChatList");
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChatroomClick = (chatroomId, chatroomDetails,  otherUserDetails) => {
    // Navigate to the chat room with the selected user
    navigate('/chat', { state: {chatroomId, chatroomDetails, otherUserDetails } });
  };

  if (loading) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
        </Box>
    );
}

  return (
    <Grid
      container
      component="main"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
        width: '100%'
      }}
    >
      <Paper sx={{
          width: { xs: '100%', sm: '90%', md: '80%', lg: '737px' }, // Responsive width
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          padding: 2,
          margin: 'auto' 
        }}>
      <Grid container item xs={12}>
      <IconButton onClick={handleBack}>
            <ArrowBackIos />
          </IconButton>
        </Grid>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ marginBottom: 2, marginTop: 2 }}
        />
      <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '100%', 
          padding: 1
        }}>
          <Typography 
            variant="body1" 
            sx={{ 
              color: "textSecondary", 
            }}
          >
            All Chats
          </Typography>
          <Tooltip title="New Chat" placement="top">
            <IconButton onClick={handleAdd}>
              <Add />
            </IconButton>
          </Tooltip>
        </Box>
        {chatrooms.length === 0 || filteredChatrooms.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center">
                No Chats Found.
            </Typography>
            ) : (
          <>
        <Grid container item xs={12}>
        <List sx={{ width: '100%' }}>
          {filteredChatrooms.map((chatroom) => {
          const lastMessage = Object.values(chatroom.chatroomDetails.messages).slice(-1)[0];
          const formattedDateOrTime = lastMessage ? formatDateOrTime(lastMessage.timestamp) : '';
          const lastMessageText = lastMessage?.text || 'No messages yet';

          return (
          <ListItemButton
            sx={{ borderBottom: '1px solid #e0e0e0' }}
            key={chatroom.chatroomId}
            onClick={() => handleChatroomClick(chatroom.chatroomId, chatroom.chatroomDetails, chatroom.otherUserDetails)}
          >
            <ListItemAvatar>
              <Avatar src={chatroom.otherUserDetails.photoURL} />
            </ListItemAvatar>
            <ListItemText
              primary={chatroom.otherUserDetails.username}
              secondary={lastMessageText}
              primaryTypographyProps={{ fontWeight: 'bold' }}
              secondaryTypographyProps={{
                noWrap: true, // Prevent wrapping, display in a single line
                style: { 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  maxWidth: '80%', // Adjust this value based on your layout
                }
              }}
            />
            <ListItemSecondaryAction>
              <Typography variant="body2" color="textSecondary">
                {formattedDateOrTime}
              </Typography>
            </ListItemSecondaryAction>
          </ListItemButton>
        );
      })}
</List>
</Grid>
        <Pagination
              count={Math.ceil(filteredChatrooms.length / itemsPerPage)}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
              sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
            />
          </>
        )}
      </Paper>
    </Grid>
  );
};
