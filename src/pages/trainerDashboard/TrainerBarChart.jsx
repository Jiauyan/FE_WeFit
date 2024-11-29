import { Box, Typography, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { useUser } from "../../contexts/UseContext";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


export default function TrainerBarChart() {
  const [trainingProgramData, setTrainingProgramData] = useState([]);
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const { user , updateUser, setUser} = useUser();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getUTCMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getUTCFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState([]);  // State to store fetched data

  useEffect(() => {
    const fetchTrainingProgram = async () => {
      try {
        const uid = user?.uid;
        if (!uid) return;
  
        const response = await axios.get(`https://be-um-fitness.vercel.app/trainingPrograms/getAllUserTrainingPrograms/${uid}`);
        const trainingPrograms = response.data;
        let countsByDay = trainingPrograms.reduce((acc, trainingProgram) => {
          const date = new Date(trainingProgram.createdAt).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        let data = Object.keys(countsByDay).map(key => ({
          date: key,
          count: countsByDay[key]
        })).sort((a, b) => new Date(a.date) - new Date(b.date));

        const completedData = getCurrentMonthData(data, selectedMonth, selectedYear);
        // Find index for the current day
        const todayIndex = completedData.findIndex(d => d.date === new Date().toISOString().split('T')[0]);
        const startIndex = Math.max(todayIndex - 3, 0); // Adjust as needed to center the view or to show previous days
  
        setTrainingProgramData(completedData);
        setCurrentStartIndex(startIndex);
      } catch (error) {
        console.error('Error fetching steps data:', error);
      }
    };
    fetchTrainingProgram();
  }, [user?.uid,selectedMonth, selectedYear]);

  const getCurrentMonthData = (data, selectedMonth, selectedYear) => {
    const filteredData = data.filter(entry => {
      const entryDate = new Date(entry.date + 'T00:00:00Z'); // Ensure the date is treated as UTC
      return entryDate.getUTCMonth() === selectedMonth && entryDate.getUTCFullYear() === selectedYear;
    });
    setData(filteredData);
    const startDate = new Date(Date.UTC(selectedYear, selectedMonth, 1));
    const endOfMonth = new Date(Date.UTC(selectedYear, selectedMonth + 1, 0));
    const result = [];
  
    for (let date = new Date(startDate); date <= endOfMonth; date.setUTCDate(date.getUTCDate() + 1)) {
      const dateString = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`;
      const existingEntry = filteredData.find(entry => entry.date === dateString);
      result.push({
        date: dateString,
        count: existingEntry ? existingEntry.count : 0,
      });
    }
  
    return result;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const handlePreviousWeek = () => {
    setCurrentStartIndex(prev => Math.max(prev - 7, 0));
  };
  
  const handleNextWeek = () => {
    setCurrentStartIndex(prev => Math.min(prev + 7, trainingProgramData.length - 7));
  };

  const last7DaysData = trainingProgramData.slice(currentStartIndex, currentStartIndex + 7); // Adjust the range as needed

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    setSelectedYear(newValue.getUTCFullYear());
    setSelectedMonth(newValue.getUTCMonth());
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Typography variant="h6" component="h2">
          Training Programs Overview
        </Typography>
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
        </LocalizationProvider>
      </Box>
      {data.length === 0 ? (
          <Box height={540} display="flex" alignItems="center" justifyContent="center">
          <Typography>No Training Program Found for the Selected Period.</Typography>
          </Box>
            ) : (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <IconButton onClick={handlePreviousWeek} disabled={currentStartIndex <= 0}>
        <ArrowBackIos />
      </IconButton>
      <Box sx={{ flexGrow: 1, maxWidth: '90vw', marginBottom: 4}}>

        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={last7DaysData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis />
            <Tooltip
                wrapperStyle={{
                  backgroundColor: 'transparent',  // Makes background transparent
                  border: 'none',  // Removes border
                  boxShadow: 'none'  // Removes shadow
                }}
                cursor={false}  // Optionally hide the cursor as well
              />
            <Bar type="monotone" dataKey="count" barSize={10} radius={[10, 10, 0, 0]}>
              {last7DaysData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.date === formatDate(new Date().toISOString()) ? '#FF851B' : '#22D3EE'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <IconButton onClick={handleNextWeek} disabled={currentStartIndex + 7 >= trainingProgramData.length}>
        <ArrowForwardIos />
      </IconButton>
    </Box>
  )}
    </Box>
  );
}
