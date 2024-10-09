import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Avatar, Box, Button, IconButton, List, ListItem, ListItemText, Paper, TextField, Typography } from '@mui/material';
import { ArrowBackIos, FiberManualRecord } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from "../../contexts/UseContext";
import { format, isToday, isYesterday, parseISO } from 'date-fns';

export function ChatRoom() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [prevMessageCount, setPrevMessageCount] = useState(0);
  const { user, setUser } = useUser();
  const senderUID = user?.uid;
  const navigate = useNavigate();
  const location = useLocation();
  const { chatroomId, chatroomDetails, otherUserDetails} = location.state;
  const messagesEndRef = useRef(null);
  const [isInitialScroll, setIsInitialScroll] = useState(true); // Track the initial scroll
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/chat/getMessages/${chatroomId}`);
        if (response.data.length !== messages.length) {
          setMessages(response.data);
          setPrevMessageCount(messages.length); // Set previous count to current messages length before update
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 3000); // Fetch messages every 3 seconds
    return () => clearInterval(intervalId); // Clear the interval when the component unmounts
  }, [chatroomId, messages.length]);

  useEffect(() => {
    if (messages.length > 0 && isInitialScroll) {
      scrollToBottom();
      setIsInitialScroll(false);
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > prevMessageCount) { // Check if new messages have been added
      scrollToBottom();
    }
  }, [messages.length, prevMessageCount]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        const receiverUID = otherUserDetails.uid;
  
        // Send the message to the backend
        const response = await axios.post(`http://localhost:3000/chat/sendMessage/${chatroomId}`, {
          text: message,
          senderUID: senderUID,
          receiverUID: receiverUID,
        });
  
        // Update the local messages state to immediately show the new message
        setMessages((prevMessages) => [
          ...prevMessages,
          response.data, // The new message returned from the backend
        ]);
        setIsUpdated(true);
        // Clear the message input field
        setMessage(''); 
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.log('Message is empty or only contains whitespace.');
    }
  };

  const handleBack = () => {
    navigate("/chatPage");
  };

  const formatDate = (date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, d MMMM');
  };

  const formatTime = (date) => {
    return format(date, 'h:mm aa');
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    const date = formatDate(parseISO(msg.timestamp));
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  const isOnline = true;

  return (
    <Box component="main" sx={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',  // Prevent scrolling outside the paper
    }}>
      <Paper sx={{
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: 2,
      width: '737px',
      height: '85vh',  // Maximum height set to 100vh
      overflowY: 'hidden',  // Enable scroll inside Paper if content overflows
    }}>
    {/* Header Section */}
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      p: 2, 
      borderBottom: '1px solid #e0e0e0' 
    }}>
      <IconButton onClick={handleBack} sx={{ mr: 2 }}>
        <ArrowBackIos />
      </IconButton>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        flexGrow: 1, 
        justifyContent: 'center' 
      }}>
        <Avatar
          src={otherUserDetails.photoURL}
          alt={otherUserDetails.username}
          sx={{
            height: 50,
            width: 50,
            objectFit: 'cover',
            marginRight: 2,
          }}
        />
        <Typography variant="h6" noWrap component="div">
          {otherUserDetails.username}
        </Typography>
        <FiberManualRecord
          sx={{
            color: isOnline ? 'green' : 'gray',
            fontSize: 14,
            ml: 1,
          }}
        />
      </Box>
    </Box>

    {/* Scrollable Message List */}
    <List 
      sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        bgcolor: 'background.paper',
        padding: 2, // Add padding for the list content
      }}
    >
      {Object.entries(groupedMessages).map(([date, msgs], index) => (
            <React.Fragment key={index}>
              <Typography variant="subtitle2" sx={{ textAlign: 'center', margin: '10px 0' }}>
                {date}
              </Typography>
              {msgs.map((msg, idx) => (
                <ListItem
                  key={idx}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.senderUID === senderUID ? 'flex-end' : 'flex-start',
                    padding: 0,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: msg.senderUID === senderUID ? '#E8EAF6' : '#C8E6C9',
                      borderRadius: '15px',
                      p: 1,
                      m: 1,
                      maxWidth: '60%',
                    }}
                  >
                    <ListItemText
                      primary={
                        <pre 
                          style={{ 
                            margin: 0, 
                            whiteSpace: 'pre-wrap', 
                            fontFamily: 'inherit', // Use the inherited font family
                            fontSize: 'inherit',   // Use the inherited font size
                            color: 'inherit',      // Use the inherited font color
                          }}
                        >
                          {msg.text}
                        </pre>
                      }
                      secondary={formatTime(parseISO(msg.timestamp))}
                      sx={{
                        '& span': {
                          padding: '8px 12px',
                          color: 'text.primary',
                        },
                        '& p': {
                          textAlign: 'right',
                          fontSize: '0.75rem',
                          color: '#888',
                        },
                      }}
                    />
                  </Box>
                </ListItem>
              ))}
            </React.Fragment>
          ))}
      <div ref={messagesEndRef} /> {/* Scroll anchor */}
    </List>

  {/* Fixed Message Input Area */}
  <Box 
    sx={{ 
      display: 'flex', 
      padding: 2, 
      borderTop: '1px solid #e0e0e0',
      position: 'sticky', 
      bottom: 0,
      backgroundColor: 'white', // Ensure the input area is clearly visible
    }}
  >
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Type message here..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault(); // Prevent default action which is inserting a newline
          sendMessage(); // Send the message when only Enter is pressed
        }
      }}
      multiline
      maxRows={4} // Limit to 4 visible lines before scrolling
      sx={{ overflow: 'auto' }} // Enable scrolling within the input
    />
    <Button variant="contained" color="primary" onClick={sendMessage} sx={{ ml: 1 }}>
      Send
    </Button>
  </Box>
  </Paper>
</Box>
  );
};
