import React, { useState } from 'react';
import { Typography, Paper, Grid, Box, IconButton, Pagination } from "@mui/material";
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';

export function PrivacyPolicy() {
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

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
          margin: 'auto' // Centers the paper in the viewport
      }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                    <IconButton onClick={handleBack}>
                        <ArrowBackIos />
                    </IconButton>
                    <Typography variant="h5" sx={{ ml: 2 }}>
                        Privacy Policy
                    </Typography>
                </Box>

                <Box sx={{ width: '100%', px: 3, py: 2 }}>
                    {page === 1 ? (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Information We Collect
                            </Typography>
                            <Typography paragraph>
                                <strong>Personal Information:</strong> We collect personal information such as your name, email address, date of birth, gender, height, weight, and fitness goals. This information is collected when you sign up for an account or update your profile within the App.
                            </Typography>
                            <Typography paragraph>
                                <strong>Usage Data:</strong> We also collect information about how you interact with the App, including the features you use, the actions you take, and the frequency and duration of your usage.
                            </Typography>
                            <Typography paragraph>
                                <strong>Device Information:</strong> We collect information about the device you use to access the App, including the device type, operating system, unique device identifiers, and mobile network information.
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                How We Use Your Information
                            </Typography>
                            <Typography paragraph>
                                We use the information to maintain the App, personalize your experience, analyze trends, communicate updates, and respond to inquiries.
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Data Security
                            </Typography>
                            <Typography paragraph>
                                We implement measures to protect your personal information from unauthorized access, use, or disclosure.
                            </Typography>
                            <Typography paragraph>
                                <strong>Data Sharing and Disclosure:</strong> We may share your data with third-party service providers to help us improve our services.
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                        count={2}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        sx={{ mb: 3 }}
                    />
                </Box>
            </Paper>
        </Grid>
    );
}
