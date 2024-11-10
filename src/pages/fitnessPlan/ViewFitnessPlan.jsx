import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Menu,
  MenuItem
} from "@mui/material";
import { ArrowBackIos, MoreVert } from '@mui/icons-material';
import { GradientButton } from '../../contexts/ThemeProvider';
import { DeleteFitnessPlan } from './DeleteFitnessPlan';

export function ViewFitnessPlan() {
  const navigate = useNavigate();
  const [fitnessPlanData, setFitnessPlanData] = useState('');
  const [fitnessActivityData, setFitnessActivityData] = useState([]);
  const { user, setUser } = useUser();
  const uid = user.uid;
  const location = useLocation();
  const { id } = location.state;
  const fitnessPlanID = id;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  useEffect(() => {
    const storedUid = localStorage.getItem('uid');
    if (storedUid) {
      setUser({ ...user, uid: storedUid });
    }
  }, []);

  useEffect(() => {
    const uid = user?.uid;
    if (!uid) return;
    axios.get(`http://localhost:3000/fitnessPlan/getFitnessPlanById/${id}`)
      .then(response => {
        setFitnessPlanData(response.data);
      })
      .catch(error => console.error('There was an error!', error));
  }, [user?.uid]);

  useEffect(() => {
    const uid = user?.uid;
    if (!uid) return;

    axios.get(`http://localhost:3000/fitnessActivity/getAllFitnessActivitiesByUidAndPlanID/${uid}/${fitnessPlanID}`)
      .then(response => {
        setFitnessActivityData(response.data);
      })
      .catch(error => console.error('There was an error!', error));
  }, [user?.uid, fitnessPlanID]);

  const handleEdit = async (id) => {
    navigate("/editFitnessPlan", { state: { id: id } });
  };

  const handleBack = async () => {
    navigate("/fitnessPlan");
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
          margin: 'auto' 
        }}>
      <Grid container item xs={12} justifyContent="space-between" marginBottom={2}>
          <IconButton onClick={() => handleBack()}>
            <ArrowBackIos />
          </IconButton>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem  onClick={() => handleEdit(id)}>Edit</MenuItem>
            <DeleteFitnessPlan id={id} />
          </Menu>
        </Grid>
        <Grid container item xs={12} justifyContent="center" > 
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2}}>
        View Your Fitness Plan
        </Typography>
        </Grid>
        <Box component="form" sx={{ mt: 1, width: '90%', justifyContent: 'center', alignItems: 'center' }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Title
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {fitnessPlanData.title}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Date
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {fitnessPlanData.date}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Fitness Activities
          </Typography>
          <List>
            {fitnessActivityData.map((fitnessActivity, index) => (
              <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Checkbox
                  checked={fitnessActivity.status === true} 
                  disabled
                />
                <ListItemText
                  primary={fitnessActivity.task}
                  secondary={`${fitnessActivity.duration}`}
                />
              </ListItem>
            ))}
          </List>
          </Box>
      </Paper>
    </Grid>
  );
}
