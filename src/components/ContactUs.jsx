import React, { useState } from 'react';
import { Typography, Paper, Grid, Box, IconButton} from "@mui/material";
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import UMFitnessLogo from "../assets/umFitnessLogo.png";

export function ContactUs() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
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
            </Box>
            <Grid container item xs={12} justifyContent="center">
                    <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Contact Us
                    </Typography>
                </Grid>

                <Box sx={{
                    width: '80%', 
                    my: 2, 
                    display: 'flex', // Ensures the content inside box is flexibly managed
                    justifyContent: "center" // Horizontally centers the content
                }}>
                    <img
                        src={UMFitnessLogo} // Make sure UMFitnessLogo is correctly imported or defined
                        alt="UMFitness Logo"
                        style={{ width: '50%', height: 'auto' }} // Adjusts the size of the image
                    />
                </Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Location Address </strong>
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Universiti Malaya, 50603 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur
                </Typography>
                <Typography variant="body1" sx={{ mb: 1}}>
                    <strong>Phone</strong>
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                      03 79673210
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Hours Open</strong>
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    Mon - Wed: 10 am - 5 pm
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    Thurs & Fri: 11 am - 5:30 pm
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    Sat & Sun: 10 am - 4 pm
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    Public Holiday OFF!
                </Typography>
            </Paper>
        </Grid>
    );
}
