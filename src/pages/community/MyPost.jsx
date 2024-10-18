import React, { useState, useEffect } from 'react';
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
import { ArrowBackIos } from '@mui/icons-material';
import { DeletePost } from './DeletePost';
import { EditPost } from './EditPost';

export function MyPost() {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [myPosts, setMyPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 12;
  
    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                const uid = user?.uid;
                if (!uid) return;
                const response = await axios.get(`http://localhost:3000/posts/getAllPostsByUid/${uid}`);
                const sortedPosts = response.data.sort((a, b) => new Date(b.time) - new Date(a.time));
                setMyPosts(sortedPosts);
            } catch (error) {
                console.error('There was an error!', error);
            }
        };

        fetchMyPosts();
    }, [user?.uid]);
        
    // Callback for editing a post
    const editPostCallback = (updatedMyPost) => {
        setMyPosts(prevMyPosts => prevMyPosts.map(myPost => {
            if (myPost.id === updatedMyPost.id) {
                return updatedMyPost;
            }
            return myPost;
        }));
    };

    // Callback for deleting a post
    const deletePostCallback = (myPostId) => {
        setMyPosts(prevMyPosts => prevMyPosts.filter(myPost => myPost.id !== myPostId));
    };
   
    const handleView = async (myPost) => {
        navigate("/viewPost", { state: { id: myPost.id} });
    };

    const handleChat = async () => {
        navigate("/chat");
    };

    const handleBack = async () => {
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
        const sentences = post.postDetails.split('. ');
    
        return (
            <Box sx={{ 
                minHeight: 70,
                maxHeight:70,
                marginLeft: 2
                }}>
            <Typography variant="body1" color="textSecondary" display="inline">
                {sentences.slice(0, 3).join('. ') + (sentences.length > 3 ? '...' : '')}
            </Typography>
            {sentences.length > 3 && (
                <Link
                    component="button"
                    variant="body2"
                    onClick={handleView}
                    sx={{ textDecoration: 'underline', ml: 0.5 }}
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
                    sx={{ mt: 3, mb: 2 }}
                >
                    Chat
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
             {currentMyPosts.length === 0 || filteredMyPosts.length === 0 ? ( // Check if there are no programs
                <Typography variant="body1" color="text.secondary" align="center">
                    No Post Found.
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
                        //onClick={() => handleView(myPost)}
                    >
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                                <EditPost id={myPost.id} oldDesc={myPost.postDetails} onEditPost={editPostCallback} />
                                <DeletePost id={myPost.id} onDeletePost={deletePostCallback} />
                            </Box>
                        </CardContent>
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
