import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useUser, UserContext } from "../contexts/UseContext";
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
    Button,
    IconButton,
    
} from "@mui/material";
import FitnessCenter from "@mui/icons-material/FitnessCenter";
import Dashboard from "@mui/icons-material/Dashboard";
import TrackChanges from "@mui/icons-material/TrackChanges";
import Group from "@mui/icons-material/Group";
import TipsAndUpdates from "@mui/icons-material/TipsAndUpdates";
import Logout from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/icons-material/Menu";
import FormatQuote from "@mui/icons-material/FormatQuote";

import { useNavigate, Outlet } from 'react-router-dom';
import Footer from './Footer';


export function SideBar(props) {

    const navigate = useNavigate();
    const { user , setUser} = useUser();
    const { window, children } = props;
    const { logout } = useContext(UserContext);
    const uid = user.uid;
    const role = user.role;
    const[logoutStatus, setLogoutStatus] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const drawerWidth = 240;
    const [open, setOpen] = useState(true); 

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };
    
    const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
    };

    const handleProfile = async () => {
      sessionStorage.removeItem('lastPage');
      navigate('/profile')
    };

    const handleDashboard = async () => {
      sessionStorage.removeItem('lastPage');
      navigate("/dashboard")
    };

    const handleTraining = async () => {
      sessionStorage.removeItem('lastPage');
      navigate("/training")
    };

    const handleGoals = async () => {
      sessionStorage.removeItem('lastPage');
      navigate("/goals")
    };

    const handleCommunity = async () => {
      sessionStorage.removeItem('lastPage');
      navigate("/community")
    };

    const handleTips = async () => {
      sessionStorage.removeItem('lastPage');
      navigate("/tips")
    };

    const handleTrainerProfile = async () => {
      sessionStorage.removeItem('lastPage');
      navigate("/trainerProfile")
    };
    
    const handleTrainerDashboard = async () => {
      sessionStorage.removeItem('lastPage');
      navigate("/trainerDashboard")
    };

    const handleTrainerTraining = async () => {
      sessionStorage.removeItem('lastPage');
      navigate("/trainerTrainingPrograms")
    };

    const handleTrainerTips = async () => {
      sessionStorage.removeItem('lastPage');
      navigate("/trainerTips")
    };

    const handleTrainerQuotes = async () => {
      sessionStorage.removeItem('lastPage');
      navigate("/motivationalQuotes")
    };

    const handleLogout = async (e) => { 
      e.preventDefault();   

      try {
          const response = logout()
          setLogoutStatus(response.data);
          navigate('/logout');
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
    { key: "My Profile", icon: <AccountCircle />, action: handleProfile },
    { key: "Dashboard", icon: <Dashboard />, action: handleDashboard },
    { key: "Training", icon: <FitnessCenter />, action: handleTraining },
    { key: "Goals", icon: <TrackChanges /> , action: handleGoals },
    { key: "Community", icon: <Group />,action: handleCommunity },
    { key: "Tips", icon: <TipsAndUpdates />, action: handleTips },
];

const trainerItems = [
    { key: "My Profile", icon: <AccountCircle />, action: handleTrainerProfile },
    { key: "Dashboard", icon: <Dashboard />, action: handleTrainerDashboard },
    { key: "Training", icon: <FitnessCenter />, action: handleTrainerTraining },
    { key: "Tips", icon: <TipsAndUpdates />, action: handleTrainerTips },
    { key: "Quotes", icon: <FormatQuote />, action: handleTrainerQuotes },  // Assume you have a /quotes route
];

// Choose items based on role
const itemsToShow = role === "Student" ? studentItems : trainerItems;

const toggleDrawer = () => {
    if (!isClosing) {
        setMobileOpen(!mobileOpen);
      }
};

const drawer = (
    <div>
        <Toolbar />
        <Divider />
        <List>
            {itemsToShow.map((item) => (
                <ListItem key={item.key} disablePadding>
                    <ListItemButton onClick={item.action} sx={{ 
                        '&:hover': {
                            bgcolor: '#112F91',
                            color: '#FFFFFF',
                            '& .MuiListItemIcon-root': {
                                color: '#FFFFFF',
                            }
                        }
                    }}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.key} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    </div>
  );

return (
    <Box sx={{ display: 'flex' }}>
    <AppBar position="fixed" sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#112F91',
        //width: `calc(100% - ${drawerWidth}px)`, 
        ml: `${drawerWidth}px`
    }}>
        <Toolbar sx={{ display:'flex', justifyContent:'space-between' }}>
            <Box sx={{ display:'flex', justifyContent:'flex-start', alignItems:'center' }}>
                <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawer}
                sx={{ mr: 2, display: { sm: "none" } }}
                >
                    <Menu />
                </IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    UMFitness
                </Typography>
            </Box>
            <Box sx={{ display:'flex', justifyContent:'flex-end', alignItems:'center' }}>
                <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
                    Logout
                </Button>
            </Box>
        </Toolbar>
    </AppBar>
    <Box
          component="nav"
          sx={{
            width: { sm: drawerWidth },
            flexShrink: { sm: 0 },
          }}
        >
         <Drawer
  variant="temporary"
  open={mobileOpen}
  onTransitionEnd={handleDrawerTransitionEnd}
  onClose={handleDrawerClose}
  ModalProps={{
    keepMounted: true, 
  }}
  sx={{
    display: { xs: "block", sm: "none" },
    zIndex: 1400,
  }}
  PaperProps={{
    style: {
      boxSizing: 'border-box',
      width: drawerWidth,
      //backgroundColor: '#acbdf5',
    },
  }}
>
  {drawer}
</Drawer>
<Drawer
  variant="permanent"
  sx={{
    display: { xs: "none", sm: "block" },
  }}
  PaperProps={{
    style: {
      boxSizing: 'border-box',
      width: drawerWidth,
      //backgroundColor: '#acbdf5', 
    },
  }}
  open
>
  {drawer}
</Drawer>
        </Box>
    
    <Box
        component="main"
        sx={{
          backgroundColor: '#f2f5fd',
          flexGrow: 1,
          p: 0,
          m: 0,
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Outlet />
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            weight:'100%',
            mt: 'auto', 
            p: 0,  // No padding
            m: 0,  // No margin
          }}>
          <Footer/>
        </Box>
    </Box>
</Box>
);
}

