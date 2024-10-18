import React, { useState, useEffect } from 'react';
import { Tooltip, IconButton, Box, Paper, Grid, TextField, List, ListItemAvatar, ListItemText, Avatar, CircularProgress, ListItemButton, Typography } from '@mui/material';
import axios from 'axios';
import { ArrowBackIos } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../contexts/UseContext";

export function UserChatList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser();
  const [ chatroom, setChatroom] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const senderUID = user.uid;
        const response = await axios.get(`http://localhost:3000/chat/getAllUsersWithoutMessagesFromOrToSender/${senderUID}`);
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user.uid]);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleBack = () => {
    navigate("/chatPage");
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleUserClick = async (otherUserData) => {
    try {
      // Assuming `user` is available in the current scope
      const senderUID = user.uid;
      const otherUserDetails = {
        username: otherUserData.username,
        photoURL: otherUserData.photoURL,
        uid: otherUserData.uid
      };
      // Send a POST request to create a new chatroom
      const response = await axios.post('http://localhost:3000/chat/createChatroom', {
        senderUID,
        receiverUID: otherUserData.uid
      });
  
      setChatroom(response.data);
      // Navigate to the chat page with receiver's details
      navigate('/chat', { 
        state: { 
          chatroomId : response.data.chatroomId,
          otherUserDetails
        } 
      });
  
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <Grid 
      container 
      component="main" 
      sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding:3
      }}
    >
      <Paper sx={{
          width: '737px', 
          minHeight: '100vh', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)', 
          borderRadius: 2,
          padding: 4 
        }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
          <IconButton onClick={handleBack}>
            <ArrowBackIos />
          </IconButton>
        </Box>
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
            All Users
          </Typography>
        </Box>
        <List sx={{ width: '100%' }}>
          {filteredUsers.map((user) => (
            <ListItemButton
              sx={{ borderBottom: '1px solid #e0e0e0' }}
              key={user.uid}
              onClick={() => handleUserClick(user)}
            >
              <ListItemAvatar>
                <Avatar src={user.photoURL || '/default-avatar.png'} />
              </ListItemAvatar>
              <ListItemText
                primary={user.username}
                secondary={"Click to start chat"}
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </Grid>
  );
};
