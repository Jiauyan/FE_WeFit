import { Box, Typography, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useUser } from "../../contexts/UseContext";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


export default function StepsBarChart() {
  const [stepsData, setStepsData] = useState([]);  // State to store fetched data
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const { user , updateUser, setUser} = useUser();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getUTCMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getUTCFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const uid = user?.uid;
        if (!uid) return;
  
        const response = await axios.get(`http://localhost:3000/steps/getStepCountByUid/${uid}`);
        const stepsData = response.data.steps.stepsByDay;
  
        let fetchedData = Object.entries(stepsData).map(([date, steps]) => ({
          date,
          steps,
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
  
        const completedData = getCurrentMonthData(fetchedData, selectedMonth, selectedYear);
  
        // Find index for the current day
        const todayIndex = completedData.findIndex(d => d.date === new Date().toISOString().split('T')[0]);
        const startIndex = Math.max(todayIndex - 3, 0); // Adjust as needed to center the view or to show previous days
  
        setStepsData(completedData);
        setCurrentStartIndex(startIndex);
      } catch (error) {
        console.error('Error fetching steps data:', error);
      }
    };
    fetchSteps();
  }, [user?.uid,selectedMonth, selectedYear]);

  const getCurrentMonthData = (data, selectedMonth, selectedYear) => {
    const filteredData = data.filter(entry => {
      const entryDate = new Date(entry.date + 'T00:00:00Z'); // Ensure the date is treated as UTC
      return entryDate.getUTCMonth() === selectedMonth && entryDate.getUTCFullYear() === selectedYear;
    });
  
    const startDate = new Date(Date.UTC(selectedYear, selectedMonth, 1));
    const endOfMonth = new Date(Date.UTC(selectedYear, selectedMonth + 1, 0));
    const result = [];
  
    for (let date = new Date(startDate); date <= endOfMonth; date.setUTCDate(date.getUTCDate() + 1)) {
      const dateString = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`;
      const existingEntry = filteredData.find(entry => entry.date === dateString);
      result.push({
        date: dateString,
        steps: existingEntry ? existingEntry.steps : 0,
      });
    }
  
    return result;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  // const getLast7DaysData = () => {
  //   const startIndex = Math.max(currentStartIndex, 0);
  //   const endIndex = Math.min(startIndex + 7, stepsData.length);
  //   return stepsData.slice(startIndex, endIndex);
  // };

  const handlePreviousWeek = () => {
    setCurrentStartIndex(prev => Math.max(prev - 7, 0));
  };
  
  const handleNextWeek = () => {
    setCurrentStartIndex(prev => Math.min(prev + 7, stepsData.length - 7));
  };

  const last7DaysData = stepsData.slice(currentStartIndex, currentStartIndex + 7); // Adjust the range as needed

  // const handleMonthChange = (event) => {
  //   setSelectedMonth(event.target.value);
  // };

  // const handleYearChange = (event) => {
  //   setSelectedYear(event.target.value);
  // };

  const handleDateChange = (newValue) => {
    console.log(newValue);
    setSelectedDate(newValue);
    setSelectedYear(newValue.getUTCFullYear());
    setSelectedMonth(newValue.getUTCMonth());
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <Typography variant="h6" component="h2">
          Steps Overview
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
        </FormControl>
        <FormControl variant="outlined" size="small">
      <InputLabel id="year-select-label">Year</InputLabel>
      <Select
        labelId="year-select-label"
        id="year-select"
        value={selectedYear}
        label="Year"
        onChange={handleYearChange} // Handler for year change
      >
        {Array.from({ length: 10 }, (_, i) => (
          <MenuItem key={i} value={new Date().getUTCFullYear() - i}>
            {new Date().getUTCFullYear() - i}
          </MenuItem>
        ))}
      </Select>
    </FormControl> */}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <IconButton onClick={handlePreviousWeek} disabled={currentStartIndex <= 0}>
        <ArrowBackIos />
      </IconButton>
      <Box sx={{ flexGrow: 1, maxWidth: '90vw' }}>

        <ResponsiveContainer width="100%" height={400}>
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
            <Bar type="monotone" dataKey="steps" barSize={10} radius={[10, 10, 0, 0]}>
              {last7DaysData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.date === formatDate(new Date().toISOString()) ? '#FF851B' : '#22D3EE'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <IconButton onClick={handleNextWeek} disabled={currentStartIndex + 7 >= stepsData.length}>
        <ArrowForwardIos />
      </IconButton>
    </Box></Box>
  );
}
