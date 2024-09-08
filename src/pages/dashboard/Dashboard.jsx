import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, Box, Button, CircularProgress } from '@mui/material';
import { DirectionsWalk, WaterDrop, TrackChanges, FitnessCenter } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { GetRandomMotivationalQuote } from '../trainerQuotes/GetRandomMotivationalQuote';
import { useUser } from "../../contexts/UseContext";
import { CustomCircularProgress } from "../../components/CustomCircularProgress";

export function Dashboard() {
  
  const [randomMotivationalQuote, setRandomMotivationalQuote] = useState("");
  const { user , updateUser, setUser} = useUser();
  const [BMIValue, setBMIValue] = useState(null);
  const [steps, setSteps] = useState('');
  const [completedGoals, setCompletedGoals] = useState({});
  const [goals, setGoals] = useState([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [username, setUsername] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [currentHydration, setCurentHydration] = useState('');

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
            setFitnessLevel(response.data.fitnessLevel);
            setFitnessGoal(response.data.fitnessGoal);
            setCurentHydration(response.data.currentHydration);

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
          const fetchSteps = async () => {
              try {
                  const uid = user?.uid;
                  if (!uid) return;
                  const response = await axios.get(`http://localhost:3000/steps/getStepCountByUid/${uid}`);
                  setSteps(response.data.steps.stepCount);
                  console.log(response.data.steps.stepCount);
              } catch (error) {
                  console.error('There was an error!', error);
              }
          };
          fetchSteps();
      }, [user?.uid]);

  useEffect(() => {
      const storedUid = localStorage.getItem('uid');
      if (storedUid) {
          setUser({ ...user, uid: storedUid });
      }

      const storedRandomMotivationalQuote = user.randomMotivationalQuote;
      if (storedRandomMotivationalQuote) {
          setRandomMotivationalQuote(storedRandomMotivationalQuote);
      }
  }, [setUser, user]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const uid = user?.uid;
        if (!uid) return;
        const response = await axios.get(`http://localhost:3000/goals/getAllUserGoals/${uid}`);
        setGoals(response.data);
        
        let completedCount = 0;
        response.data.forEach(goal => {
          if (goal.status) completedCount++; // Increment if goal is completed
        });
        // Calculate percentage
        const percentage = response.data.length > 0 ? (completedCount / response.data.length) * 100 : 0;
        setCompletionPercentage(percentage.toFixed(2)); // Store percentage, rounded to 2 decimal places
      } catch (error) {
        console.error('There was an error!', error);
      }
    };

    fetchGoals();
  }, [user?.uid]);

  const getRandomMotivationalQuoteCallback = (randomMotivationalQuote) => {
    setRandomMotivationalQuote(randomMotivationalQuote);
    updateUser(({ ...user, randomMotivationalQuote: randomMotivationalQuote }));
  };

  const data = [
    { name: 'Mon', workout: 30, water: 50, steps: 400 },
    { name: 'Tue', workout: 45, water: 60, steps: 50 },
    { name: 'Wed', workout: 60, water: 70, steps: 600 },
    { name: 'Thu', workout: 70, water: 80, steps: 700 },
    { name: 'Fri', workout: 50, water: 60, steps: 500 },
    { name: 'Sat', workout: 40, water: 55, steps: 450 },
    { name: 'Sun', workout: 30, water: 50, steps: 400 },
  ];
  
  
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
    <Container maxWidth="lg">
      <Typography variant="h6" gutterBottom>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
        <Card sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 2,
            backgroundColor: '#5D8BEA',
            color: 'white',
        }}>
            <Box>
                <Typography variant="h6">Hello {username},</Typography>
                {randomMotivationalQuote && (
                            <Typography  variant="subtitle1">
                                {randomMotivationalQuote.motivationalQuote}
                            </Typography>
                        )}
            </Box>
              <GetRandomMotivationalQuote id={randomMotivationalQuote.id} onGetRandomMotivationalQuote={getRandomMotivationalQuoteCallback} ></GetRandomMotivationalQuote>
        </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ padding: 2 , backgroundColor: '#1FB2B2'}}>
            <DirectionsWalk sx={{ color: 'white' }} />
            <Typography variant="h6" sx={{ color: 'white' }}>{steps}</Typography>
            <Typography variant="subtitle1" sx={{ color: 'white' }}>Steps taken</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ padding: 2, backgroundColor: '#8676FE'}}>
            <WaterDrop sx={{ color: 'white' }} />
            <Typography variant="h6" sx={{ color: 'white' }}>{currentHydration}</Typography>
            <Typography variant="subtitle1" sx={{ color: 'white' }}>Water taken</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ padding: 2 , backgroundColor: '#F56081'}}>
            <TrackChanges sx={{ color: 'white' }} />
            <Typography variant="h6" sx={{ color: 'white' }}>{fitnessGoal}</Typography>
            <Typography variant="subtitle1" sx={{ color: 'white' }}>Fitness Goal</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ padding: 2 , backgroundColor: '#F77A4D'}}>
            <FitnessCenter sx={{ color: 'white' }}/>
            <Typography variant="h6" sx={{ color: 'white' }}>{fitnessLevel}</Typography>
            <Typography variant="subtitle1" sx={{ color: 'white' }}>Fitness level</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Card sx={{ padding: 3 }}>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend /> 
                  <Bar type="monotone" dataKey="steps" fill="#22D3EE" barSize={10} radius={[10, 10, 0, 0]}/>
                  <Bar type="monotone" dataKey="water" fill="#A78BFA" barSize={10} radius={[10, 10, 0, 0]}/>
                  <Bar type="monotone" dataKey="workout" fill="#FB923C" barSize={10} radius={[10, 10, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
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
            <Typography variant="h6">Goals Achievement</Typography>
            <Box
            align = "center"
            marginTop={2}>
            <CustomCircularProgress value={completionPercentage} />
            </Box>
            <Typography align = "center" variant="subtitle1">You have completed {completionPercentage}% of your goals.</Typography>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
