import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from "../UseContext";
import {
    Box,
    Drawer,
    CssBaseline,
    AppBar,
    Toolbar,
    List,
    Typography,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Button
} from "@mui/material";
import {
    Inbox,
    Mail,
} from "@mui/icons-material";
import { useNavigate, Outlet } from 'react-router-dom';


export function SideBar() {

    const navigate = useNavigate();
    const { user , setUser} = useUser();
    const uid = user.uid;
    const role = user.role;
    const[logoutStatus, setLogoutStatus] = useState('');
    const drawerWidth = 240;


    const handleProfile = async () => {
      navigate('/profile')
    };

    const handleDashboard = async () => {
      navigate("/dashboard")
    };

    const handleTraining = async () => {
      navigate("/training")
    };

    const handleGoals = async () => {
      navigate("/goals")
    };

    const handleCommunity = async () => {
      navigate("/community")
    };

    const handleTips = async () => {
      navigate("/tips")
    };

    const handleTrainerProfile = async () => {
      navigate("/trainerProfile")
    };

    const handleTrainerTraining = async () => {
      navigate("/trainerTraining")
    };

    const handleTrainerTips = async () => {
      navigate("/trainerTips")
    };

    const handleTrainerQuotes = async () => {
      navigate("/trainerQuotes")
    };

    const handleLogout = async (e) => { 
      e.preventDefault(); 

      try {
          const response = await axios.post('http://localhost:3000/auth/logoutAccount', {
          });

          setLogoutStatus(response.data.message);
          navigate('/login');
      } catch (error) {
          if (axios.isAxiosError(error)) {
              if (error.response) {
                  setLogoutStatus(error.response.data.message);
              } else {
                  setLogoutStatus('An error occurred');
              }
          } else {
              setLogoutStatus('An unexpected error occurred');
          }
      }
  };

  // Conditional rendering based on role
  const studentItems = [
    { key: "My Profile", action: handleProfile },
    { key: "Dashboard", action: handleDashboard },
    { key: "Training", action: handleTraining },
    { key: "Goals", action: handleGoals },
    { key: "Community", action: handleCommunity },
    { key: "Tips", action: handleTips },
];

const trainerItems = [
    { key: "My Profile", action: handleTrainerProfile },
    { key: "Training", action: handleTrainerTraining },
    { key: "Tips", action: handleTrainerTips },
    { key: "Quotes", action: handleTrainerQuotes },  // Assume you have a /quotes route
];

// Choose items based on role
const itemsToShow = role === "Student" ? studentItems : trainerItems;

return (
    <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
                <Button variant="contained" onClick={handleLogout}>Logout</Button>
            </Toolbar>
        </AppBar>

        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar>
                <Typography variant="h6" sx={{ my: 2 }}>
                    UMFitness
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {itemsToShow.map(item => (
                    <ListItem key={item.key} disablePadding>
                        <ListItemButton onClick={item.action}>
                            <ListItemIcon><Inbox /></ListItemIcon>
                            <ListItemText primary={item.key} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
        <Outlet/>
    </Box>
);
}




  // return (
  //    <Box sx={{ display: 'flex' }}>
  //     <CssBaseline />
  
  //     <AppBar
  //       position="fixed"
  //       //elevation={1}
  //       sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`  }}
  //     >
  //      <Toolbar>
  //     {/* Add your top navigation items here */}
  //     <Typography variant="h6" sx={{ flexGrow: 1 }}>
  //     </Typography>
  //     {/* Example navigation items */}
  //     <Button
  //               //fullWidth
  //               variant="contained"
  //               //sx={{ mt: 3, mb: 2 }}
  //               onClick={handleLogout}
  //             >
  //               Logout
  //           </Button>
  //   </Toolbar>
        
  //     </AppBar>


  //     <Drawer
  //       sx={{
  //         width: drawerWidth,
  //         flexShrink: 0,
  //         '& .MuiDrawer-paper': {
  //           width: drawerWidth,
  //           boxSizing: 'border-box',
  //         },
  //       }}
  //       variant="permanent"
  //       anchor="left"
  //     >
  //       <Toolbar>
  //         <Typography variant="h6" sx={{ my: 2 }}>
  //           UMFitness
  //         </Typography>
  //       </Toolbar>
  //       <Divider />
  //       <List>
         
  //           <ListItem key="My Profile" disablePadding>
  //             <ListItemButton onClick={handleProfile}>
  //               <ListItemIcon>
  //               <Inbox />
  //               </ListItemIcon>
  //               <ListItemText primary="My Profile" />
  //             </ListItemButton>
  //           </ListItem>

  //           <ListItem key="dashboard" disablePadding>
  //             <ListItemButton onClick={handleDashboard}>
  //               <ListItemIcon>
  //               <Inbox />
  //               </ListItemIcon>
  //               <ListItemText primary="Dashboard" />
  //             </ListItemButton>
  //           </ListItem>

  //           <ListItem key="training" disablePadding>
  //             <ListItemButton onClick={handleTraining}>
  //               <ListItemIcon>
  //               <Inbox />
  //               </ListItemIcon>
  //               <ListItemText primary="Training" />
  //             </ListItemButton>
  //           </ListItem>

  //           {/* <ListItem key="tracking" disablePadding>
  //             <ListItemButton onClick={handleTracking}>
  //               <ListItemIcon>
  //               <Inbox />
  //               </ListItemIcon>
  //               <ListItemText primary="Tracking" />
  //             </ListItemButton>
  //           </ListItem> */}

  //           <ListItem key="goals" disablePadding>
  //             <ListItemButton onClick={handleGoals}>
  //               <ListItemIcon>
  //               <Inbox />
  //               </ListItemIcon>
  //               <ListItemText primary="Goals" />
  //             </ListItemButton>
  //           </ListItem>

  //           <ListItem key="community" disablePadding>
  //             <ListItemButton onClick={handleCommunity}>
  //               <ListItemIcon>
  //               <Inbox />
  //               </ListItemIcon>
  //               <ListItemText primary="Community" />
  //             </ListItemButton>
  //           </ListItem>

  //           <ListItem key="tips" disablePadding>
  //             <ListItemButton onClick={handleTips}>
  //               <ListItemIcon>
  //               <Inbox />
  //               </ListItemIcon>
  //               <ListItemText primary="Tips" />
  //             </ListItemButton>
  //           </ListItem>

  //       </List>
  //     </Drawer>
  //     <Outlet/>
  //   </Box>
  // );
//}
