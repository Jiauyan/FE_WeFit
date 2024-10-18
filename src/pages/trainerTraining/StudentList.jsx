import React, { useState, useEffect } from 'react';
import { Tooltip, IconButton, Box, Paper, Grid, TextField, List, ListItemAvatar, ListItemText, Avatar, CircularProgress, ListItemButton, Typography } from '@mui/material';
import axios from 'axios';
import { ArrowBackIos } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from "../../contexts/UseContext";

export function StudentList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser();
  const [ chatroom, setChatroom] = useState('');
  const location = useLocation();
  const { id, slot, title } = location.state;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.post(`http://localhost:3000/trainingPrograms/getStudentBySlot`, {
          id,
          slot
        });
        console.log(response.data.id);
        setStudents(response.data)
        setFilteredStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [user?.uid]);

  useEffect(() => {
    const filtered = students.filter(student => 
      student.name && (searchTerm === '' || student.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleBack = () => {
    navigate("/viewTrainerTrainingProgram", { state: { id: id } });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStudentClick = async (studentData) => {
    console.log(studentData);
    navigate("/viewStudentDetails", { state: { studentData: studentData, id:id , slot} });
  };

  return (
    <Grid 
      container 
      component="main" 
      sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding:3
      }}
    >
      <Paper sx={{
          width: '737px', 
          minHeight: '100vh', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)', 
          borderRadius: 2,
          padding: 4 
        }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
          <IconButton onClick={handleBack}>
            <ArrowBackIos />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ marginBottom: 2, marginTop: 2 }}
        />
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '100%', 
          padding: 1
        }}>
          <Typography 
            variant="body1" 
            sx={{ 
              color: "textSecondary", 
            }}
          >
            All Students ( {slot} )
          </Typography>
        </Box>
        {filteredStudents.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 2 }}>
            No students found
          </Typography>
        ) : (
          <List sx={{ width: '100%' }}>
            {filteredStudents.map((student) => (
              <ListItemButton
                sx={{ borderBottom: '1px solid #e0e0e0' }}
                key={student.uid}
                onClick={() => handleStudentClick(student)}
              >
                <ListItemAvatar>
                  <Avatar src={student.photoURL} />
                </ListItemAvatar>
                <ListItemText
                  primary={student.name}
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Paper>
    </Grid>
  );
};
