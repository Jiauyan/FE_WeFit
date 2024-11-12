import React, { useState, useEffect, useRef } from 'react';
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
    IconButton,
    Container,
    Avatar,
    TextField,
    Pagination,
    Link
} from "@mui/material";
import { useNavigate, Outlet } from 'react-router-dom';
import { useUser } from "../../contexts/UseContext";
import { AddPost } from '../community/AddPost';

export function Community() {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 12;
  
    useEffect(() => {
        // Load user ID from local storage or other persistent storage
        const storedUid = localStorage.getItem('uid');
        if (storedUid) {
            setUser({ ...user, uid: storedUid });
        }
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const uid = user?.uid;
                if (!uid) return;
                const response = await axios.get('http://localhost:3000/posts/getAllPosts');
                const sortedPosts = response.data.sort((a, b) => new Date(b.time) - new Date(a.time));
                setPosts(sortedPosts);
            } catch (error) {
                console.error('There was an error!', error);
            }
        };

        fetchPosts();
    }, [user?.uid]);

    const addPostCallback = (newPost) => {
        setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    const handleChat = async () => {
        navigate("/chatPage");
    };

    const handleMyPost = async () => {
        navigate("/myPost");
    };

    // Filter programs based on search term
    const filteredPosts = posts.filter(post =>
        post.postDetails.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      // Calculate the current programs to display based on the page
      const startIndex = (page - 1) * itemsPerPage;
      const currentPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

    const handleView = (post) => {
        navigate('/viewPost', { state: { id: post.id } });
    };

    const PostDetails = ({ post }) => {
        const textRef = useRef(null); // Reference to the text element
        const [isOverflowing, setIsOverflowing] = useState(false); // Track overflow state
    
        // Function to check for text overflow
        const checkOverflow = () => {
            if (textRef.current) {
                // Check if the content height exceeds 3 lines height (1.5em line height)
                const hasOverflow = textRef.current.scrollHeight > (1.5 * parseInt(window.getComputedStyle(textRef.current).fontSize) * 3);
                setIsOverflowing(hasOverflow);
            }
        };
    
        // Check overflow on mount and post updates
        useEffect(() => {
            checkOverflow();
            // Adding a resize listener to handle responsive changes
            window.addEventListener('resize', checkOverflow);
            return () => window.removeEventListener('resize', checkOverflow);
        }, [post]);
    
        return (
            <Box
                sx={{
                    minHeight: 70,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Typography
                    ref={textRef}
                    variant="body1"
                    color="textSecondary"
                    component="span"
                    sx={{
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2, // Limit to 3 lines
                        textOverflow: 'ellipsis',
                        lineHeight: '1.5em',
                    }}
                >
                    {post.postDetails}
                </Typography>
    
                {/* Conditionally render "See more" only if content overflows */}
                {isOverflowing && (
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => console.log('See more clicked')}
                        sx={{ textDecoration: 'underline' }}
                    >
                        See more
                    </Link>
                )}
            </Box>
        );
    };
    

    return (
        <Box padding={3}>
            <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}> 
            <Typography variant="h5" sx={{display: 'flex', alignItems: 'center' }}>  
              All Posts
            </Typography>
                <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'end'
                }}>
                <Button
                    onClick={handleChat}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2, mr: 2}}
                >
                    Chat
                </Button>
                <AddPost onAddPost={addPostCallback}></AddPost>
                <Button
                    onClick={handleMyPost}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2, ml: 2 }}
                >
                    My Post
                </Button>
                </Box>
            </Box>
            <TextField
                fullWidth
                variant="outlined"
                label="Search Posts"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginBottom: 5, marginTop: 2 }}
            />
             {currentPosts.length === 0 || filteredPosts.length === 0 ? ( // Check if there are no programs
                <Typography variant="body1" color="text.secondary" align="center">
                    No Post Found.
                </Typography>
            ) : (
                <>
           
           <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="start" marginTop={3}>
           {currentPosts.map((post) => (
 <Grid item xs={12} sm={6} md={6} lg={6} key={post.id}>
                            <Card
                            sx={{
                                width: '100%',
                                minHeight: 230,
                                maxHeight:230,
                                boxShadow: 3,
                                transition: "0.3s",
                                '&:hover': { boxShadow: 10 },
                            }}
                            onClick={() => handleView(post)}
                        >
                            <CardContent  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', margin: 2 }}>
                                    <Avatar
                                        src={post.userPhotoUrl}
                                        alt={post.userName}
                                        sx={{
                                            height: 50,
                                            width: 50,
                                            objectFit: 'cover',
                                            marginRight: 2,
                                        }}
                                    />
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="h6" component="div">
                                            {post.userName}
                                        </Typography>
                                        <Typography variant="body3" color="textSecondary" >
                                            {post.formattedTime}
                                        </Typography>
                                    </Box>
                                </Box>
                                <CardContent >
                                <PostDetails post={post} />
                                </CardContent>
                            </CardContent >
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Pagination
                count={Math.ceil(filteredPosts.length / itemsPerPage)}
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
