import { ThemeProvider, createTheme, styled } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { Typography, Paper, Avatar, Button } from "@mui/material";
import Footer from "../components/Footer";
import { SideBar } from "../components/Drawer";

const theme = createTheme({
    // MuiDrawer:{
    //   styleOverrides:{
    //     paper:{
    //       backgroundColor:"#eaefff",
    //   },
    // },
    // },
    palette: {
      primary:{
        main : '#112F91',
      },
      gradient: {
        primary: 'linear-gradient(45deg, #9DCEFF 10%, #112F91 80% )', 
        secondary: 'linear-gradient(45deg, #1A73E8 30%, #112F91 90%)',
      },
    },
    typography: {
      fontFamily: 'Arial, sans-serif',
    },
  });
  
  // Create a custom styled button that uses the gradient
  const GradientButton = styled(Button)(({ theme }) => ({
    background: theme.palette.gradient.primary,
    color: 'white',
    '&:hover': {
      background: theme.palette.gradient.primary,
      filter: 'brightness(0.9)',
    },
  }));

export const ThemeColorProvider = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            { children }
            {/* <Footer/> */}
        </ThemeProvider>
    )

}

export {GradientButton};
