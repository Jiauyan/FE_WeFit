import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Avatar, Box, Button, IconButton, List, ListItem, ListItemText, Paper, TextField, Typography,Snackbar } from '@mui/material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import FiberManualRecord from '@mui/icons-material/FiberManualRecord';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from "../../contexts/UseContext";
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import MuiAlert from '@mui/material/Alert';

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
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' }); // Notification state
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`https://be-um-fitness.vercel.app/chat/getMessages/${chatroomId}`);
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
        const response = await axios.post(`https://be-um-fitness.vercel.app/chat/sendMessage/${chatroomId}`, {
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
        setNotification({
          open: true,
          message: 'Error sending message.',
          severity: 'error',
        });
      }
    } else {
      setNotification({
        open: true,
        message: 'Message is empty or only contains whitespace.',
        severity: 'error',
      });
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


  return (
    <Box component="main" sx={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: "80vh"
    }}>
      <Paper sx={{
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: 2,
      width: { xs: '100%', sm: '90%', md: '80%', lg: '737px' }, // Responsive width
      height: { xs: '100%', sm: '90%', md: '73vh' },  // Responsive height
      overflowY: 'auto',  // Enable scroll inside Paper if content overflows
      margin: 'auto'
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
            height: { xs: 25, sm: 35 },  // Responsive avatar size
            width: { xs: 25, sm: 35 },
            objectFit: 'cover',
            marginRight: 2,
          }}
        />
        <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} noWrap>
          {otherUserDetails.username}
        </Typography>
      </Box>
    </Box>

    {/* Scrollable Message List */}
    <List 
      sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        bgcolor: 'background.paper',
        padding: 2,  // Add padding for the list content
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
      backgroundColor: 'white',  // Ensure the input area is clearly visible
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
      maxRows={4}  // Limit to 4 visible lines before scrolling
      sx={{ overflow: 'auto' }}  // Enable scrolling within the input
    />
    <Button variant="contained" color="primary" onClick={sendMessage} sx={{ ml: { xs: 0.5, sm: 1 } }}>
      Send
    </Button>
  </Box>
  </Paper>
  <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <MuiAlert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </MuiAlert>
        </Snackbar>
  </Box>
  );
};
