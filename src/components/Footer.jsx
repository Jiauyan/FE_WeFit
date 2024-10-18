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
      <Container  maxWidth="lg" sx={{ mx: 'auto' }}>
        {/* <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2">
              We provide innovative solutions for your needs.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Link href="mailto:info@example.com" color="inherit" underline="hover">
              info@example.com
            </Link>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Link href="#" color="inherit" underline="hover">
              Facebook
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Twitter
            </Link>
          </Grid>
        </Grid> */}

        <Box mt={1} textAlign="center">
          <Typography variant="body2">
            © {new Date().getFullYear()} UMFitness. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
