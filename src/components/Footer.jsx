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
                <Grid container justifyContent="center" spacing={2} marginBottom={2}>
                    {/* Adjusting the grid items to be closer by using smaller spacing */}
                    <Grid item>
                        <Link href="/contactUs" color="inherit" sx={{ textDecoration: 'underline', mr: 2 }}>
                            Contact Us
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="/privacyPolicy" color="inherit" sx={{ textDecoration: 'underline', ml: 2 }}>
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
