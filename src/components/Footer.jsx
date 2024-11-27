// Footer.js
import React from 'react';
import { Box, Typography, Link, Container, Grid } from '@mui/material';

export default function Footer() {
  return (
    <Box
    component="footer"
    sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 3,
        mt: 'auto',
    }}
>
    <Container maxWidth="lg" sx={{ mx: 'auto' }}>
        <Grid container justifyContent="center">
            <Grid item xs={6} sm={3} textAlign="center">
                <Link href="/contactUs" color="inherit" underline="hover">
                    Contact Us
                </Link>
            </Grid>
            <Grid item xs={6} sm={3} textAlign="center">
                <Link href="/privacyPolicy" color="inherit" underline="hover">
                    Privacy Policy
                </Link>
            </Grid>
        </Grid>
        <Box mt={1} textAlign="center">
            <Typography variant="body2">
                © {new Date().getFullYear()} UMFitness. All Rights Reserved.
            </Typography>
        </Box>
    </Container>
</Box>
  );
};
