import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, Box, Button, CircularProgress } from '@mui/material';
import { Whatshot, School, EventAvailable, FitnessCenter, FormatQuote, TipsAndUpdates } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { GetRandomMotivationalQuote } from '../trainerQuotes/GetRandomMotivationalQuote';
import { useUser } from "../../contexts/UseContext";
import { CustomCircularProgress } from "../../components/CustomCircularProgress";
import TrainerLineChart from './TrainerLineChart';
import TrainerMotivationalLineChart from './TrainerMotivationalLineChart';
import TrainerBarChart from './TrainerBarChart';
import TrainerPieChart from './TrainerPieChart';

export function TrainerDashboard() {
  
  
  const { user , updateUser, setUser} = useUser();
  const [BMIValue, setBMIValue] = useState(null);
  const [steps, setSteps] = useState('');
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [username, setUsername] = useState('');
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const [motivationalQuoteCount, setMotivationalQuoteCount] = useState(0);
  const [sharingTip, setSharingTip] = useState("");
  const [sharingTipCount, setSharingTipCount] = useState(0);
  const [trainingProgram, setTrainingProgram] = useState("");
  const [trainingProgramCount, setTrainingProgramCount] = useState(0);
  
  useEffect(() => {
    const fetchUser = async () => {
        try {
            const uid = user?.uid;
            if (!uid) return;
            const response = await axios.get(`http://localhost:3000/auth/getUserById/${uid}`);
            setUserData(response.data);
            setHeight(response.data.height);
            setWeight(response.data.weight);
            setUsername(response.data.username);

            const heightInMeters = response.data.height / 100;
            const weight = response.data.weight;
            const bmiValue = weight / (heightInMeters * heightInMeters);
            const roundedBmi = bmiValue.toFixed(2);

            setBMIValue(roundedBmi);
            } catch (error) {
            console.error('There was an error!', error);
        }
    };

    fetchUser();
}, [user?.uid]);

 useEffect(() => {
      const storedUid = localStorage.getItem('uid');
      if (storedUid) {
          setUser({ ...user, uid: storedUid });
      }
  }, [setUser, user]);

    useEffect(() => {
      const fetchMotivationalQuote = async () => {
          try {
              const uid = user?.uid;
              if (!uid) return;
              const response = await axios.get(`http://localhost:3000/motivationalQuotes/getAllUserMotivationalQuotes/${uid}`);
              // Check if stepCount exists, otherwise set to 0
              const fetchedMotivationalQuote = response.data;
              const fetchedMotivationalQuoteCount = response.data.length;
              setMotivationalQuote(fetchedMotivationalQuote);
              setMotivationalQuoteCount(fetchedMotivationalQuoteCount);

          } catch (error) {
              console.error('There was an error!', error);
          }
      };
      fetchMotivationalQuote();
    }, [user?.uid]);

 useEffect(() => {
      const fetchSharingTip = async () => {
          try {
              const uid = user?.uid;
              if (!uid) return;
              const response = await axios.get(`http://localhost:3000/tips/getAllUserTips/${uid}`);
              // Check if stepCount exists, otherwise set to 0
              const fetchedSharingTip = response.data;
              const fetchedSharingTipCount = response.data.length;
              setSharingTip(fetchedSharingTip);
              setSharingTipCount(fetchedSharingTipCount);

              console.log(fetchedSharingTip)
          } catch (error) {
              console.error('There was an error!', error);
          }
      };
      fetchSharingTip();
    }, [user?.uid]);

    useEffect(() => {
      const fetchTrainingProgram = async () => {
          try {
              const uid = user?.uid;
              if (!uid) return;
              const response = await axios.get(`http://localhost:3000/trainingPrograms/getAllUserTrainingPrograms/${uid}`);
              // Check if stepCount exists, otherwise set to 0
              const fetchedTrainingProgram = response.data;
              const fetchedTrainingProgramCount = response.data.length;
              setTrainingProgram(fetchedTrainingProgram);
              setTrainingProgramCount(fetchedTrainingProgramCount);

              console.log(fetchedTrainingProgram)
          } catch (error) {
              console.error('There was an error!', error);
          }
      };
      fetchTrainingProgram();
    }, [user?.uid]);

  let bmiCategoryColor;
  let bmiCategoryLabel;
  
  if (BMIValue < 18.5) {
    bmiCategoryColor = 'lightblue';
    bmiCategoryLabel = "Underweight";
  } else if (BMIValue >= 18.5 && BMIValue < 25) {
    bmiCategoryColor = 'lightgreen';
    bmiCategoryLabel = "Healthy Weight";
  } else if (BMIValue >= 25 && BMIValue < 30) {
    bmiCategoryColor = 'yellow';
    bmiCategoryLabel = "Overweight";
  } else if (BMIValue >= 30 && BMIValue < 35) {
    bmiCategoryColor = 'orange';
    bmiCategoryLabel = "Obese";
  } else if (BMIValue >= 35 && BMIValue < 40) {
    bmiCategoryColor = 'red';
    bmiCategoryLabel = "Moderately Obese";
  }
  
  const calculateExactPosition = () => {
      // Define key positions on the scale
      const scaleMarks = {
        15: 0,     // Start of the scale
        18.5:25,  // Percentage of the scale width where 18.5 is located
        25: 50,    // Midpoint of normal weight
        30: 70,    // Start of overweight
        40: 100    // End of the scale
      };
    
      // Linear interpolation for values between known marks
      const interpolatePosition = (value) => {
        const knownPoints = Object.keys(scaleMarks).map(parseFloat).sort((a, b) => a - b);
        for (let i = 0; i < knownPoints.length - 1; i++) {
          const low = knownPoints[i];
          const high = knownPoints[i + 1];
          if (value >= low && value <= high) {
            const range = high - low;
            const offset = value - low;
            const percentageOfRange = (offset / range);
            const lowPosition = scaleMarks[low];
            const highPosition = scaleMarks[high];
            return lowPosition + percentageOfRange * (highPosition - lowPosition);
          }
        }
        return 0;  // Default to 0 if something goes wrong
      };
    
      return `calc(${interpolatePosition(BMIValue)}% - 5px)`;  // Adjust by half the marker's width
    };

  return (
    <Box padding={3}>
      <Typography variant="h6" gutterBottom>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
        <Card sx={{
            minHeight: 100,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 2,
            backgroundColor: '#5D8BEA',
            color: 'white',
        }}>
           <Box>
           <Typography variant="h6">Welcome, Trainer {username}!</Typography>
            </Box>
        </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ padding: 2 , backgroundColor: '#1FB2B2'}}>
            <FitnessCenter  sx={{ color: 'white' }} />
            <Typography variant="h6" sx={{ color: 'white' }}>{trainingProgramCount}</Typography>
            <Typography variant="subtitle1" sx={{ color: 'white' }}>Training Programs</Typography>
          </Card>
        </Grid>
        {/* <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ padding: 2, backgroundColor: '#8676FE'}}>
            <School sx={{ color: 'white' }} />
            <Typography variant="h6" sx={{ color: 'white' }}>{} </Typography>
            <Typography variant="subtitle1" sx={{ color: 'white' }}></Typography>
          </Card>
        </Grid> */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ padding: 2 , backgroundColor: '#F56081'}}>
            <TipsAndUpdates  sx={{ color: 'white' }} />
            <Typography variant="h6" sx={{ color: 'white' }}>{sharingTipCount}</Typography>
            <Typography variant="subtitle1" sx={{ color: 'white' }}>Sharing Tips</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ padding: 2 , backgroundColor: '#F77A4D'}}>
            <FormatQuote sx={{ color: 'white' }}/>
            <Typography variant="h6" sx={{ color: 'white' }}>{motivationalQuoteCount}</Typography>
            <Typography variant="subtitle1" sx={{ color: 'white' }}>Motivational Quotes</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ padding: 2 }}>
            <CardContent>
                <TrainerBarChart/>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
        <Card sx={{ padding: 3 }}>
            <Typography sx={{  mb: 2 }} variant="h6" align="center" >Body Mass Index (BMI)</Typography>
            <Typography sx={{  mb: 2 }} variant="h4" align="right">{BMIValue}</Typography>
            <Box sx={{ textAlign: 'right', mb:3 }}>
            <Typography
                variant="subtitle1"
                sx={{
                backgroundColor: bmiCategoryColor,
                borderRadius: 1,
                display: 'inline-block',
                padding: '2px 8px',
                }}
            >
                {bmiCategoryLabel}
            </Typography>
            </Box>
            <Box sx={{ position: 'relative', mt: 2, height: 20, mb: 2 }}>
            <Box sx={{
                    background: 'linear-gradient(to right, lightblue 25%, lightgreen 24%, lightgreen 50%, yellow 51%, yellow 70%, orange 61%, orange 85%, red 85%)',
                    height: '100%',
                    position: 'absolute',
                    width: '100%'
                }} />
              <Box sx={{
                position: 'absolute',
                left: calculateExactPosition(), 
                top: -5,
                zIndex: 1
                }}>
                <Typography variant="body2" sx={{
                  backgroundColor: 'black',
                  borderRadius: '50%',
                  color: 'white',
                  display: 'inline-block',
                  height: 10,
                  width: 10,
                  textAlign: 'center'
                }}>
                  &nbsp;
                </Typography>
              </Box>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 1,
                position: 'absolute',
                top: 20,
                width: '100%'
              }}>
                <Typography variant="body2">15</Typography>
                <Typography variant="body2">18.5</Typography>
                <Typography variant="body2">25</Typography>
                <Typography variant="body2">30</Typography>
                <Typography variant="body2">40</Typography>
              </Box>
            </Box>
          </Card>
          <Card sx={{ padding: 3, mt: 3 }}>
            <Box
            align = "center"
            marginTop={2}>
            <TrainerPieChart />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 2 }}>
            <CardContent>
                <TrainerLineChart/>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 2 }}>
            <CardContent>
                <TrainerMotivationalLineChart/>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
