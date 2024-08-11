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
    Avatar
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
        const myPostId = myPost.id;
        navigate("/viewPost", { state: { id: myPostId } });
    };

    const handleChat = async () => {
        navigate("/chat");
    };

    const handleBack = async () => {
        navigate("/community");
    };

    return (
        <Container>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
                margin: 4,
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

            <Typography variant="h4" gutterBottom>
                My Posts
            </Typography>
            <Grid container padding={4} spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="center" marginTop={2}>
                {myPosts.map((myPost, index) => (
                    <Grid item xs={12} sm={6} md={6} key={index}>
                        <Card
                            sx={{
                                width: '100%',
                                height: '100%',
                                boxShadow: 3,
                                transition: "0.3s",
                                '&:hover': { boxShadow: 10 },
                            }}
                        >
                             <CardActionArea sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', margin: 2 }}>
                                    <Avatar
                                        src={myPost.userPhotoUrl}
                                        alt={myPost.userName}
                                        sx={{
                                            height: 50,
                                            width: 50,
                                            objectFit: 'cover',
                                            marginRight: 2,
                                        }}
                                    />
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="h6" component="div">
                                            {myPost.userName}
                                        </Typography>
                                        <Typography variant="body3" color="textSecondary" >
                                            {myPost.formattedTime}
                                        </Typography>
                                    </Box>
                                </Box>
                                <CardContent>
                                <Typography variant="body1" color="textSecondary">
                                    {myPost.postDetails}
                                </Typography>
                                </CardContent>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                    <EditPost id={myPost.id} oldDesc={myPost.postDetails} onEditPost={editPostCallback} />
                                    <DeletePost id={myPost.id} onDeletePost={deletePostCallback} />
                                </Box>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Outlet />
        </Container>
    );
}
