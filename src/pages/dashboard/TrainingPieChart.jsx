import React, { useState , useEffect} from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Text } from 'recharts';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function TrainingPieChart() {

const [completedTrainingPrograms, setCompletedTrainingPrograms] = useState([]);
const [completedYogaPrograms, setCompletedYogaPrograms] = useState([]);
const [completedDancePrograms, setCompletedDancePrograms] = useState([]);
const [completedCardioPrograms, setCompletedCardioPrograms] = useState([]);
const [completedStrengthPrograms, setCompletedStrengthPrograms] = useState([]);
const [completedHIITPrograms, setCompletedHIITPrograms] = useState([]);
const [completedMeditationPrograms, setCompletedMeditationPrograms] = useState([]);
const [completedFitnessPlans, setCompletedFitnessPlans] = useState([]);
const { user , updateUser, setUser} = useUser();
const [selectedMonth, setSelectedMonth] = useState(new Date().getUTCMonth());
const [selectedYear, setSelectedYear] = useState(new Date().getUTCFullYear());
const [selectedDate, setSelectedDate] = useState(new Date());


const COLORS = ['#1FB2B2','#8676FE','#F56081', '#ff7043', '#ffcc43','#22D3EE']; // Color declarations

const data = [
  { name: 'Yoga', value: completedYogaPrograms },
  { name: 'Dance', value: completedDancePrograms},
  { name: 'Cardio', value: completedCardioPrograms},
  { name: 'Strength', value: completedStrengthPrograms},
  { name: 'HIIT', value: completedHIITPrograms},
  { name: 'Meditation', value: completedMeditationPrograms}
];

console.log(completedFitnessPlans);
console.log(completedTrainingPrograms);



useEffect(() => {
    const fetchCompletedBookings = async () => {
        try {
            const uid = user?.uid;
            if (!uid) return;

            const response = await axios.get(`http://localhost:3000/trainingClassBooking/getAllTrainingClassBookingsByUID/${uid}`);
            //setBookings(response.data);

            // Fetch training programs details for each booking
            const programPromises = response.data.map(async (booking) => {
                const programResponse = await axios.get(`http://localhost:3000/trainingPrograms/getTrainingProgramById/${booking.trainingClassID}`);
                return { 
                    ...booking, 
                    bookingId: booking.id, 
                    ...programResponse.data 
                };
            });

            const programs = await Promise.all(programPromises);
            
            const completedPrograms = getCompletedMonthPrograms(programs, selectedMonth, selectedYear);
            //console.log(completedMonthPrograms);
            // Filter programs based on booking status
            //const completedPrograms = completedMonthPrograms.filter(completedMonthProgram => completedMonthProgram.status === true); // Pending
            // Set state with filtered programs as needed
            console.log(completedPrograms);

            
            const completedYogaPrograms = completedPrograms.filter(completedProgram=> completedProgram.typeOfExercise === "Yoga");
            setCompletedYogaPrograms(completedYogaPrograms.length);

            const completedDancePrograms = completedPrograms.filter(completedProgram=> completedProgram.typeOfExercise === "Dance");
            setCompletedDancePrograms(completedDancePrograms.length);

            const completedCardioPrograms = completedPrograms.filter(completedProgram=> completedProgram.typeOfExercise === "Cardio");
            setCompletedCardioPrograms(completedCardioPrograms.length);

            const completedStrengthPrograms = completedPrograms.filter(completedProgram=> completedProgram.typeOfExercise === "Strength");
            setCompletedStrengthPrograms(completedStrengthPrograms.length);

            const completedHIITPrograms = completedPrograms.filter(completedProgram=> completedProgram.typeOfExercise === "HIIT");
            setCompletedHIITPrograms(completedHIITPrograms.length);

            const completedMeditationPrograms = completedPrograms.filter(completedProgram=> completedProgram.typeOfExercise === "Meditation");
            setCompletedMeditationPrograms(completedMeditationPrograms.length);

            setCompletedTrainingPrograms(completedPrograms.length); 
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    fetchCompletedBookings();
}, [user?.uid, selectedMonth, selectedYear]);

useEffect(() => {
    const fetchFitnessPlan = async () => {
        try {
            const uid = user?.uid;
            if (!uid) return;
            const response = await axios.get(`http://localhost:3000/fitnessPlan/getAllFitnessPlanByUid/${uid}`);
            const completedPlans = response.data.filter(plan => plan.totalCount === plan.completeCount);
            setCompletedFitnessPlans(completedPlans.length);
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    fetchFitnessPlan();
}, [user?.uid]);

const getCompletedMonthPrograms = (data, selectedMonth, selectedYear) => {
  console.log(data, selectedMonth, selectedYear);
  const filteredData = data.filter(entry => {
    const dateString = entry.slot.split(' - ')[0]; 
    const [month, day, year] = dateString.split('/');

    // Reformat the date string to ISO 8601 format "YYYY-MM-DD"
    const isoDateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const entryDate = new Date(isoDateString);

    console.log(`Reformatted date string: ${isoDateString}`);  
    console.log(`Parsed date: ${entryDate}`);  
    return entryDate.getMonth() === selectedMonth && entryDate.getFullYear() === selectedYear;
});

  console.log(filteredData)

  // Assuming status of 'true' means the program is completed
  const completedData = filteredData.filter(entry => entry.status === true);

  return completedData; // Returns only the completed programs
};

const handleMonthChange = (event) => {
  setSelectedMonth(event.target.value);
};

const handleDateChange = (newValue) => {
  console.log(newValue);
  setSelectedDate(newValue);
  setSelectedYear(newValue.getUTCFullYear());
  setSelectedMonth(newValue.getUTCMonth());
};

  return (
    <Box sx={{ 
        width: '100%', 
        maxHeight: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'left' 
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h2" sx={{ textAlign: 'left'}}>
          Workout Overview
        </Typography>
        <Box width={200}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            views={['year', 'month']}
            label="Month and Year"
            minDate={new Date('2020-01-01')}
            maxDate={new Date('2030-12-31')}
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} helperText={null} />}
            slotProps={{ textField: { size: 'small' } }}
          />
        </LocalizationProvider></Box>
        {/* <FormControl variant="outlined" size="small">
          <InputLabel id="month-select-label">Month</InputLabel>
          <Select
            labelId="month-select-label"
            id="month-select"
            value={selectedMonth}
            label="Month"
            onChange={handleMonthChange}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i} value={i}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
        </Box>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart padding={{ top: 0, right: 0, bottom: 0, left: 0 }} margin={{ top: -50, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"  // Adjusted to center the chart vertically better
              labelLine={false}
              innerRadius={90}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          alignItems: 'center', 
          mt: -7, // Adjust as necessary
          //p: 1, // Padding to ensure it doesn't touch the sides on smaller screens
          width: '100%'
        }}>
          {data.map((entry, index) => (
            <Box key={index} sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mb: 1, 
              width: '50%',  // 100% width on smaller screens
              sm: {
                width: '50%'  // 50% width on sm screens and above
              },
              justifyContent: 'flex-start'
            }}>
              <Box sx={{ 
                width: 14, 
                height: 14, 
                bgcolor: COLORS[index % COLORS.length], 
                borderRadius: '50%', 
                mr: 2,
                ml:7
              }} />
              <Typography variant="body1" sx={{
                color: '#666',
              }}>
                {`${entry.name}: ${entry.value}`}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
  );
}
