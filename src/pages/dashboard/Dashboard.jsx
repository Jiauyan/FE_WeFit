import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import DirectionsWalk from '@mui/icons-material/DirectionsWalk';
import WaterDrop from '@mui/icons-material/WaterDrop';
import TrackChanges from '@mui/icons-material/TrackChanges';
import FitnessCenter from '@mui/icons-material/FitnessCenter';
import { GetRandomMotivationalQuote } from '../trainerQuotes/GetRandomMotivationalQuote';
import { useUser } from "../../contexts/UseContext";
import StepsBarChart from './StepsBarChart';
import WaterLineChart from './WaterLineChart';
import TrainingPieChart from './TrainingPieChart';
import SleepBarChart from './SleepBarChart';
import { ApiTemplate } from './../../api/index';

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
  const [currentMotivationalQuote, setCurrentMotivationalQuote] = useState("");
  const [sleep, setSleep] = useState("");

  useEffect(() => {
    if (!user?.uid) {
        setLoading(false);
        return;
    }
    
    setLoading(true);
    Promise.all([
        fetchUserDetails(user.uid),
        fetchSteps(user.uid),
        fetchGoals(user.uid)
    ]).then(([userDetails, userSteps, userGoals]) => {
        setUserData(userDetails);
        setSteps(userSteps);
        setGoals(userGoals);
    }).catch(error => {
        console.error('Error fetching data:', error);
    }).finally(() => {
        setLoading(false);
    });
}, [user?.uid]);

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const uid = user?.uid;
            if (!uid) return;
            const response = await ApiTemplate(`GET`, `auth/getUserById/${uid}`)
            setUserData(response.data);
            setHeight(response.data.height);
            setWeight(response.data.weight);
            setUsername(response.data.username);
            setFitnessLevel(response.data.fitnessLevel);
            setFitnessGoal(response.data.fitnessGoal);
            setCurentHydration(response.data.todayWater);
            setCurrentMotivationalQuote(response.data.currentMotivationalQuote);
            setSleep(response.data.sleepbyDay);

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
                  const response = await axios.get(`https://be-um-fitness.vercel.app/steps/getStepCountByUid/${uid}`);
                   // Check if stepCount exists, otherwise set to 0
                  const fetchedSteps = response.data.steps?.stepsToday ?? 0;
                  setSteps(fetchedSteps);
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
        const response = await axios.get(`https://be-um-fitness.vercel.app/goals/getAllUserGoals/${uid}`);
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
    setCurrentMotivationalQuote(randomMotivationalQuote);
    setRandomMotivationalQuote(randomMotivationalQuote);
    //updateUser(({ ...user, randomMotivationalQuote: randomMotivationalQuote }));
  };
  
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

    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          {/* <CircularProgress /> */}
          Loading...
        </Box>
      );
    }
    
  return (
    <Box padding={3}>
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
            <Typography variant="h6">Welcome, Student {username}!</Typography>
                {currentMotivationalQuote && (
                            <Typography  variant="subtitle1">
                                {currentMotivationalQuote}
                            </Typography>
                        )}
            </Box>
              <GetRandomMotivationalQuote id={randomMotivationalQuote.id} onGetRandomMotivationalQuote={getRandomMotivationalQuoteCallback} ></GetRandomMotivationalQuote>
        </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ padding: 2 , backgroundColor: '#1FB2B2'}}>
            <DirectionsWalk sx={{ color: 'white' }} />
            <Typography variant="h6" sx={{ color: 'white' }}>{steps || 0}</Typography>
            <Typography variant="subtitle1" sx={{ color: 'white' }}>Steps taken</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ padding: 2, backgroundColor: '#8676FE'}}>
            <WaterDrop sx={{ color: 'white' }} />
            <Typography variant="h6" sx={{ color: 'white' }}>{currentHydration || 0} </Typography>
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

        <Grid item xs={12} md={7}>
          <Card sx={{ padding: 2 }}>
            <CardContent>
                <StepsBarChart/>
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
          <Card sx={{ padding: 2 ,  mt: 3 }}>
            <CardContent>
                <TrainingPieChart/>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 2 }}>
            <CardContent>
                <WaterLineChart/>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 2 }}>
            <CardContent>
              <SleepBarChart/>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
