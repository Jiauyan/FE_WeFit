import React, { useState, useEffect } from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { Typography, Paper, Grid, IconButton, TableContainer, Table, TableBody, TableRow, TableCell, Menu, MenuItem, CircularProgress} from "@mui/material";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { DeleteTrainingProgram } from './DeleteTrainingProgram';
import { GradientButton } from '../../contexts/ThemeProvider';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import Delete from '@mui/icons-material/Delete';
import AttachMoney from '@mui/icons-material/AttachMoney';
import MoreVert from '@mui/icons-material/MoreVert';
import { SelectSlot } from './SelectSlot';

export function ViewTrainerTrainingProgram() {
  const [loading, setLoading] = useState(false);
  const [trainingProgramData, setTrainingProgramData] = useState([]);
  const [trainingProgramUserID, setTrainingProgramUserID] = useState(null);
  const [trainingProgramUser, setTrainingProgramUser] = useState({});
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { id, page } = location.state;
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
  
    setLoading(true);
  
    axios.get(`https://be-um-fitness.vercel.app/trainingPrograms/getTrainingProgramById/${id}`)
      .then(response => {
        setTrainingProgramData(response.data);
        setTrainingProgramUserID(response.data.uid); // Set this to fetch the user details in the next step
        return axios.get(`https://be-um-fitness.vercel.app/auth/getUserById/${response.data.uid}`);
      })
      .then(response => {
        setTrainingProgramUser(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.uid, id]);

  const handleEdit = async (id) => {
    navigate("/editTrainingProgram", { state: { id: id } });
  };

  const handleBack = async () => {
    navigate("/trainerTrainingPrograms", {state: {currentPage: page}});
  };

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day); // JavaScript's Date month is 0-indexed
};

const parseTime = (dateStr, timeStr) => {
  const [hours, minutes] = timeStr.match(/\d{2}/g);
  const period = timeStr.match(/[AM|PM]+/i)[0];
  const [day, month, year] = dateStr.split('/');
  const date = new Date(year, month - 1, day, hours % 12 + (period.toLowerCase() === 'pm' ? 12 : 0), minutes);
  return date;
};

  const slots = Array.isArray(trainingProgramData.slots)
  ? trainingProgramData.slots.map(slot => {
      const now = new Date();

      // Extract the date and time parts
      const [datePart, timeRange] = slot.time.split(" - ");
      const [startTime, endTime] = timeRange.split(" to ");

      const slotDate = parseDate(datePart);
      const slotStartTime = parseTime(datePart, startTime);
      const slotEndTime = parseTime(datePart, endTime);

      let status;
      if (slotStartTime <= now) {
        status = "Expired";
      } else if (slot.status) {
        status = "Full";
      } else {
        status = "Available";
      }

      return { ...slot, displayStatus: status };
    })
  : [];
  
  const detailItems = [
    { label: 'Type', value: trainingProgramData.typeOfTrainingProgram },
    { label: 'Capacity', value: trainingProgramData.capacity },
    { label: 'Fitness Level', value: trainingProgramData.fitnessLevel },
    { label: 'Type of Exercise', value: trainingProgramData.typeOfExercise },
    { label: 'Goal', value: trainingProgramData.fitnessGoal },
    { label: 'Venue', value: trainingProgramData.venue },
    { 
      label: 'Slots', 
      value: slots.map(slot => `${slot.time} - ${slot.displayStatus}`).join(', ') 
    },
  ];

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
        <CircularProgress />
      </Grid>
    );
  }
  
  return (
    <>
    <Grid
      container
      component="main"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
        width: '100%' // Ensures the grid takes full width
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
            <SelectSlot id={id}></SelectSlot>
            <MenuItem  onClick={() => handleEdit(id)}>Edit</MenuItem>
            <DeleteTrainingProgram id={id} />
          </Menu>
        </Grid>
        <Grid container item xs={12}> 
          {trainingProgramData.downloadUrl && (
          <img
            src={trainingProgramData.downloadUrl}
            alt={trainingProgramData.title}
            style={{
              width: '100%',
              height: '350px',
              objectFit: 'cover',
              borderRadius: 8
            }}
          />
        )}
        </Grid>
        <Grid container item xs={12}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', fontSize: '1.8rem', mt: 4, mb: 2 }}>
              {trainingProgramData.title}
            </Typography>
          </Grid>
          <Grid container item xs={12}>
            <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '2.0rem', color: trainingProgramData.feeAmount == 0 ? '#112F91' : '#112F91', mt: 2, mb: 2, mr: 2, textAlign: 'end' }}>
              <AttachMoney />
              {trainingProgramData.feeAmount == 0 ? 'FREE' : `RM${trainingProgramData.feeAmount}`}
            </Typography>
        </Grid>
        <Grid container item xs={12}>
        <Typography variant="body1" sx={{ mb: 2, textAlign: 'justify', whiteSpace: 'pre-wrap', mr:2 }}>
                {trainingProgramData.desc}
              </Typography>
          </Grid>
  <Grid container item xs={12} >
        <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2, 
          overflow: 'hidden', 
          boxShadow: 'none', 
          width: '100%',
          border: '1px solid #e0e0e0',
          mt: 1, 
          mb:2
        }}
      >
        <Table sx={{ width: '100%' }} size="small" aria-label="a dense table">
          <TableBody>
            {detailItems.map((item, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, mb: 1 }}
              >
                <TableCell component="th" scope="row" sx={{ textAlign: 'left', py: 1, pl:4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {item.label}
                  </Typography>
                </TableCell>
                <TableCell align="left" sx={{ py: 1 }}>
                  {item.label === 'Slots' ? (
                    slots.map((slot, idx) => (
                      <Typography key={idx} variant="subtitle1" sx={{ display: 'block' }}>
                        {slot.time} - {slot.displayStatus} ({slot.enrolled}/{slot.capacity} Enrolled)
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="subtitle1">
                      {item.value}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Grid>
      </Paper>
    </Grid>
    <Outlet />
  </>
);
}