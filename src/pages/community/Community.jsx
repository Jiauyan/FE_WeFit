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
import { AddPost } from '../community/AddPost';

export function Community() {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [posts, setPosts] = useState([]);

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

    return (
        <Container>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
                margin: 4,
            }}>
                <Button
                    onClick={handleChat}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2, mr: 2 }}
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

            <Typography variant="h4" gutterBottom>
                All Posts
            </Typography>
            <Grid container padding={4} spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="center" marginTop={2}>
                {posts.map((post, index) => (
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
                                    <Typography variant="body1" color="textSecondary">
                                        {post.postDetails}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Outlet />
        </Container>
    );
}
