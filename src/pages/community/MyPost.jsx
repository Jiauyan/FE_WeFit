import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Typography,
    Card,
    Button,
    CardContent,
    Grid,
    Box,
    Avatar,
    TextField,
    Pagination,
    Link,
    CircularProgress
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../contexts/UseContext";
import { DeletePost } from './DeletePost';
import { EditPost } from './EditPost';
import { AddPost } from '../community/AddPost';

export function MyPost() {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [myPosts, setMyPosts] = useState([]);
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
        const fetchMyPosts = async () => {
            try {
                const uid = user?.uid;
                if (!uid) return;
                setLoading(true);
                const response = await axios.get(`https://be-um-fitness.vercel.app/posts/getAllPostsByUid/${uid}`);
                const sortedPosts = response.data.sort((a, b) => new Date(b.time) - new Date(a.time));
                setMyPosts(sortedPosts);
            } catch (error) {
                console.error('There was an error!', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyPosts();
    }, [user?.uid]);
        
    // Callback for editing a post
    const editPostCallback = (updatedMyPost) => {
        setMyPosts(prevMyPosts => {
            // Remove the updated quote from its current position
            const filteredMyPosts = prevMyPosts.filter(myPost => myPost.id !== updatedMyPost.id);
            // Insert the updated quote at the beginning
            return [updatedMyPost, ...filteredMyPosts];
        });
        setPage(1);
    };

    const addPostCallback = (newPost) => {
        setMyPosts(prevPosts => [newPost, ...prevPosts]);
        setPage(1);
    };

    // Callback for deleting a post
    const deletePostCallback = (myPostId) => {
        setMyPosts(prevMyPosts => prevMyPosts.filter(myPost => myPost.id !== myPostId));
    };
   
    const handleView = async (myPost) => {
        sessionStorage.setItem('lastPage', page.toString());
        navigate("/viewPost", { state: { id: myPost.id} });
    };

    const handleChat = async () => {
        sessionStorage.removeItem('lastPage');
        navigate("/chatPage");
    };

    const handleBack = async () => {
        sessionStorage.removeItem('lastPage');
        navigate("/community");
    };

    // Filter programs based on search term
    const filteredMyPosts = myPosts.filter(myPost =>
        myPost.postDetails.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    // Calculate the current programs to display based on the page
    const startIndex = (page - 1) * itemsPerPage;
    const currentMyPosts = filteredMyPosts.slice(startIndex, startIndex + itemsPerPage);

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
    
        if (loading) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            );
        }

        return (
            <Box
                sx={{
                    minHeight: 70,
                    marginLeft: 2,
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
                        onClick={() => handleView(post)}
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
              My Posts
            </Typography>
            <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'end'
                }}>
                <Button
                    onClick={handleBack}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2, mr: 2 }}
                >
                    Back
                </Button>
                <Button
                    onClick={handleChat}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2, mr:2 }}
                >
                    Chat
                </Button>
                <AddPost onAddPost={addPostCallback}></AddPost>
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
             {currentMyPosts.length === 0 || filteredMyPosts.length === 0 ? ( // Check if there are no programs
                <Typography variant="body1" color="text.secondary" align="center">
                    No Posts Found.
                </Typography>
            ) : (
                <>
           <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="start" marginTop={3}>
           {currentMyPosts.map((myPost) => (
                    <Grid item xs={12} sm={6} md={6} lg={6} key={myPost.id}>
                    <Card
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: 3,
                            transition: "0.3s",
                            '&:hover': { boxShadow: 10 },
                            minHeight: 230, 
                            maxHeight:230,
                           }}
                        
                    >
                        <CardContent onClick={() => handleView(myPost)}
                        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', margin: 2 }}>
                                    <Avatar
                                        src={myPost.userPhotoUrl}
                                        alt={myPost.userName}
                                        sx={{
                                            height: 50,
                                            width: 50,
                                            marginRight: 2,
                                        }}
                                    />
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="h6">{myPost.userName}</Typography>
                                        <Typography variant="body2" color="textSecondary">{myPost.formattedTime}</Typography>
                                    </Box>
                                </Box>
                                <PostDetails post={myPost} />
                            </Box>
                           
                        </CardContent> 
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 , mt: -2, mr:2}}>
                                <EditPost id={myPost.id} oldDesc={myPost.postDetails} onEditPost={editPostCallback} />
                                <DeletePost id={myPost.id} onDeletePost={deletePostCallback} />
                            </Box>
                    </Card>
                </Grid>
                ))}
                </Grid>
                 <Pagination
                 count={Math.ceil(filteredMyPosts.length / itemsPerPage)}
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
