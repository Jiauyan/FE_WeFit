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
            </Box>
            <Grid container item xs={12} justifyContent="center">
                    <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                      Privacy Policy
                    </Typography>
                </Grid>

                <Box sx={{ width: '100%', px: 3, py: 2 }}>
                    {page === 1 ? (
                        <Box>
                            <Typography variant="body1" gutterBottom paragraph>
                                  We operates the UMFitness web application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our web application and the choices you have associated with that data.
                            </Typography>
                            <Typography variant="body1">
                                    <strong>Information We Collect</strong> 
                            </Typography>
                            <Typography variant="body1" paragraph>
                                We may collect various types of information in order to provide and improve our services to you. This may include:   
                             </Typography>
                             <Typography variant="body1" paragraph>
                                - Personal Information: We may collect personal information such as your name, email address, date of birth, gender, height, weight, and fitness goals. This information is collected when you sign up for an account or update your profile within the application.                             
                              </Typography>
                              <Typography variant="body1" paragraph>
                                - Usage Data: We may also collect information about how you interact with the application, such as the features you use, the actions you take, and the frequency and duration of your usage.                             
                              </Typography>
                              <Typography variant="body1" gutterBottom paragraph>
                                - Device Information: We may collect information about the device you use to access the application, including the device type, operating system, unique device identifiers, and network information.                             
                              </Typography>

                              <Typography variant="body1">
                                    <strong>How We Use Your Information</strong> 
                            </Typography>
                            <Typography variant="body1" paragraph>
                              We may use the information we collect for various purposes, including:
                               </Typography>
                             <Typography variant="body1" paragraph>
                                - To provide and maintain the application.                              
                              </Typography>
                              <Typography variant="body1" paragraph>
                                - To personalize your experience and tailor content and recommendations to your interests and preferences.
                              </Typography>
                              <Typography variant="body1"  paragraph>
                                - To analyze usage trends and improve the functionality and performance of the application.                         
                              </Typography>
                              <Typography variant="body1"  paragraph>
                                - To communicate with you about your account, updates to the application, and promotional offers.
                              </Typography>
                              <Typography variant="body1" gutterBottom paragraph>
                                - To respond to your inquiries and provide customer support.
                              </Typography>
                        </Box>
                    ) : (
                        <Box>
                            <Typography variant="body1">
                                    <strong>Data Security</strong> 
                            </Typography>
                            <Typography variant="body1" paragraph>
                            We are committed to protecting the security of your personal information and have implemented appropriate technical and organizational measures to safeguard it against unauthorized access, disclosure, alteration, and destruction.
                            </Typography>

                            <Typography variant="body1">
                                    <strong>Data Sharing and Disclosure</strong> 
                            </Typography>
                            <Typography variant="body1" paragraph>
                            We may share your personal information with third-party service providers who assist us in providing and improving our services, such as hosting providers, analytics providers, and customer support providers. We may also disclose your information in response to a valid legal request, such as a court order or subpoena, or to protect our rights or the rights of others. 
                            </Typography>
                             
                            <Typography variant="body1">
                                    <strong>Your Choices and Rights</strong> 
                            </Typography>
                            <Typography variant="body1" paragraph>
                            You may update or delete your account information at any time by accessing your account settings within the application. You may also opt out of receiving promotional communications from us by following the instructions provided in those communications or by contacting us directly.
                           </Typography>

                           <Typography variant="body1">
                                    <strong>Children's Privacy</strong> 
                            </Typography>
                            <Typography variant="body1" paragraph>
                            Our application is not intended for use by children under the age of 18 (“Children”), and we do not knowingly collect personal information from children under this age. If you believe that we may have collected information from a child under 18, please contact us immediately so that we can take appropriate action.  
                            </Typography>

                            <Typography variant="body1">
                                    <strong>Changes to This Privacy Policy</strong> 
                            </Typography>
                            <Typography variant="body1" paragraph>
                            We may update our privacy policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new privacy policy on this page.
                            </Typography>

                            <Typography variant="body1">
                                    <strong>Contact Us</strong> 
                            </Typography>
                            <Typography variant="body1" paragraph>
                            If you have any questions or concerns about our privacy practices or this privacy policy, please contact us at umfitness@gmail.com.
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
