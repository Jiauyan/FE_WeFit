import React, { useState , useEffect} from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Text } from 'recharts';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function TrainingPieChart() {

  const [completedTrainingPrograms, setCompletedTrainingPrograms] = useState(0);
  const [completedYogaPrograms, setCompletedYogaPrograms] = useState(0);
  const [completedDancePrograms, setCompletedDancePrograms] = useState(0);
  const [completedCardioPrograms, setCompletedCardioPrograms] = useState(0);
  const [completedStrengthPrograms, setCompletedStrengthPrograms] = useState(0);
  const [completedHIITPrograms, setCompletedHIITPrograms] = useState(0);
  const [completedMeditationPrograms, setCompletedMeditationPrograms] = useState(0);
  const { user } = useUser();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getUTCMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getUTCFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);

const COLORS = ['#1FB2B2','#8676FE','#F56081', '#ff7043', '#ffcc43','#22D3EE']; // Color declarations

const data = [
  { name: 'Yoga', value: completedYogaPrograms },
  { name: 'Dance', value: completedDancePrograms},
  { name: 'Cardio', value: completedCardioPrograms},
  { name: 'Strength', value: completedStrengthPrograms},
  { name: 'HIIT', value: completedHIITPrograms},
  { name: 'Meditation', value: completedMeditationPrograms}
];

const totalCompleted = data.reduce((acc, cur) => acc + cur.value, 0);

useEffect(() => {
    const fetchCompletedBookings = async () => {
        try {
            const uid = user?.uid;
            if (!uid) return;

            const response = await axios.get(`https://be-um-fitness.vercel.app/trainingClassBooking/getAllTrainingClassBookingsByUID/${uid}`);
            setBookings(response.data);

            // Fetch training programs details for each booking
            const programPromises = response.data.map(async (booking) => {
                const programResponse = await axios.get(`https://be-um-fitness.vercel.app/trainingPrograms/getTrainingProgramById/${booking.trainingClassID}`);
                return { 
                    ...booking, 
                    bookingId: booking.id, 
                    ...programResponse.data 
                };
            });
            
            const programs = await Promise.all(programPromises);
            
            const completedPrograms = getCompletedMonthPrograms(programs, selectedMonth, selectedYear);

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


const getCompletedMonthPrograms = (data, selectedMonth, selectedYear) => {
  const filteredData = data.filter(entry => {
    const dateString = entry.slot.time.split(' - ')[0]; 
    const [day, month, year] = dateString.split('/');

    // Format the date string as "YYYY-MM-DD"
    const isoDateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const entryDate = new Date(isoDateString);
    return entryDate.getMonth() === selectedMonth && entryDate.getFullYear() === selectedYear;
});

  // Assuming status of 'true' means the program is completed
  const completedData = filteredData.filter(entry => entry.status === true);

  return completedData; // Returns only the completed programs
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
        </Box>
        {totalCompleted === 0 ? (
          <Box height={335} display="flex" alignItems="center" justifyContent="center">
          <Typography>No Completed Program Found for the Selected Period.</Typography>
          </Box>
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={400}>
                    <PieChart padding={{ top: 0, right: 0, bottom: 0, left: 0 }} margin={{ top: -160, right: 0, bottom: 0, left: 0 }}>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
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
                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', mt: -20, width: '100%' }}>
                        {data.map((entry, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '50%', justifyContent: 'flex-start' }}>
                                <Box sx={{ width: 14, height: 14, bgcolor: COLORS[index % COLORS.length], borderRadius: '50%', mr: 2, ml: 7 }} />
                                <Typography variant="body1" sx={{ color: '#666' }}>
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
