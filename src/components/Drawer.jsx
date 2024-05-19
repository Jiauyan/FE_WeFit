import React from 'react';
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

    const drawerWidth = 240;

    const handleProfile = async () => {
      navigate("/profile")
    };

    const handleDashboard = async () => {
      navigate("/dashboard")
    };

    const handleTraining = async () => {
      navigate("/training")
    };

    const handleTracking = async () => {
      navigate("/tracking")
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
    
  return (
     <Box sx={{ display: 'flex' }}>
      <CssBaseline />
  
      <AppBar
        position="fixed"
        //elevation={1}
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`  }}
      >
       <Toolbar>
      {/* Add your top navigation items here */}
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
      </Typography>
      {/* Example navigation items */}
      <Button color="inherit">Logout</Button>
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
         
            <ListItem key="My Profile" disablePadding>
              <ListItemButton onClick={handleProfile}>
                <ListItemIcon>
                <Inbox />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </ListItemButton>
            </ListItem>

            <ListItem key="dashboard" disablePadding>
              <ListItemButton onClick={handleDashboard}>
                <ListItemIcon>
                <Inbox />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>

            <ListItem key="training" disablePadding>
              <ListItemButton onClick={handleTraining}>
                <ListItemIcon>
                <Inbox />
                </ListItemIcon>
                <ListItemText primary="Training" />
              </ListItemButton>
            </ListItem>

            <ListItem key="tracking" disablePadding>
              <ListItemButton onClick={handleTracking}>
                <ListItemIcon>
                <Inbox />
                </ListItemIcon>
                <ListItemText primary="Tracking" />
              </ListItemButton>
            </ListItem>

            <ListItem key="goals" disablePadding>
              <ListItemButton onClick={handleGoals}>
                <ListItemIcon>
                <Inbox />
                </ListItemIcon>
                <ListItemText primary="Goals" />
              </ListItemButton>
            </ListItem>

            <ListItem key="community" disablePadding>
              <ListItemButton onClick={handleCommunity}>
                <ListItemIcon>
                <Inbox />
                </ListItemIcon>
                <ListItemText primary="Community" />
              </ListItemButton>
            </ListItem>

            <ListItem key="tips" disablePadding>
              <ListItemButton onClick={handleTips}>
                <ListItemIcon>
                <Inbox />
                </ListItemIcon>
                <ListItemText primary="Tips" />
              </ListItemButton>
            </ListItem>

        </List>
      </Drawer>
      <Outlet/>
    </Box>
  );
}
