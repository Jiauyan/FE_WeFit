import React, { useState , useEffect} from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Text } from 'recharts';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function TrainerPieChart() {

const [createdTrainingPrograms, setCreatedTrainingPrograms] = useState(0);
const [createdYogaPrograms, setCreatedYogaPrograms] = useState(0);
const [createdDancePrograms, setCreatedDancePrograms] = useState(0);
const [createdCardioPrograms, setCreatedCardioPrograms] = useState(0);
const [createdStrengthPrograms, setCreatedStrengthPrograms] = useState(0);
const [createdHIITPrograms, setCreatedHIITPrograms] = useState(0);
const [createdMeditationPrograms, setCreatedMeditationPrograms] = useState(0);
const { user , updateUser, setUser} = useUser();
const [selectedMonth, setSelectedMonth] = useState(new Date().getUTCMonth());
const [selectedYear, setSelectedYear] = useState(new Date().getUTCFullYear());
const [selectedDate, setSelectedDate] = useState(new Date());


const COLORS = ['#1FB2B2','#8676FE','#F56081', '#ff7043', '#ffcc43','#22D3EE']; // Color declarations

const data = [
  { name: 'Yoga', value: createdYogaPrograms },
  { name: 'Dance', value: createdDancePrograms},
  { name: 'Cardio', value: createdCardioPrograms},
  { name: 'Strength', value: createdStrengthPrograms},
  { name: 'HIIT', value: createdHIITPrograms},
  { name: 'Meditation', value: createdMeditationPrograms}
];

const totalCompleted = data.reduce((acc, cur) => acc + cur.value, 0);




useEffect(() => {
    const fetchCreatedBookings = async () => {
        try {
            const uid = user?.uid;
            if (!uid) return;

            const response = await axios.get(`https://be-um-fitness.vercel.app/trainingPrograms/getAllUserTrainingPrograms/${uid}`);
            const trainingPrograms = response.data;
    
            // const createdPrograms = getCurrentMonthData(data, selectedMonth, selectedYear);
            // 
            const createdPrograms = getCurrentMonthData(trainingPrograms, selectedMonth, selectedYear);
            const createdYogaPrograms = createdPrograms.filter(createdProgram=> createdProgram.typeOfExercise === "Yoga");
            setCreatedYogaPrograms(createdYogaPrograms.length);

            const createdDancePrograms = createdPrograms.filter(createdProgram=> createdProgram.typeOfExercise === "Dance");
            setCreatedDancePrograms(createdDancePrograms.length);

            const createdCardioPrograms = createdPrograms.filter(createdProgram=> createdProgram.typeOfExercise === "Cardio");
            setCreatedCardioPrograms(createdCardioPrograms.length);

            const createdStrengthPrograms = createdPrograms.filter(createdProgram=> createdProgram.typeOfExercise === "Strength");
            setCreatedStrengthPrograms(createdStrengthPrograms.length);

            const createdHIITPrograms = createdPrograms.filter(createdProgram=> createdProgram.typeOfExercise === "HIIT");
            setCreatedHIITPrograms(createdHIITPrograms.length);

            const createdMeditationPrograms = createdPrograms.filter(createdProgram=> createdProgram.typeOfExercise === "Meditation");
            setCreatedMeditationPrograms(createdMeditationPrograms.length);

            setCreatedTrainingPrograms(createdPrograms.length); 
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    fetchCreatedBookings();
}, [user?.uid, selectedMonth, selectedYear]);


const getCurrentMonthData = (data, selectedMonth, selectedYear) => {
 // Define the start and end dates of the selected month
 const startDate = new Date(Date.UTC(selectedYear, selectedMonth, 1));
 const endDate = new Date(Date.UTC(selectedYear, selectedMonth + 1, 0));

 // Filter the data to get entries within the specified month and year
 const filteredData = data.filter(entry => {
   const entryDate = new Date(entry.createdAt); // Parse the date from each entry
   return entryDate >= startDate && entryDate <= endDate;
 });

 return filteredData;
};

const handleDateChange = (newValue) => {
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
          Training Program Types 
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
        </Box>
        {totalCompleted === 0 ? (
          <Box height={335} display="flex" alignItems="center" justifyContent="center">
          <Typography>No Training Program Found for the Selected Period.</Typography>
          </Box>
            ) : (
                <>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart padding={{ top: 0, right: 0, bottom: 0, left: 0 }} margin={{ top: -160, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"  // Adjusted to center the chart vertically better
              labelLine={false}
              innerRadius={60}
              outerRadius={90}
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
          mt: -20, // Adjust as necessary
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
        </>
            )}
      </Box>
  );
}
