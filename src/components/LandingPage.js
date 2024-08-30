import React from 'react';
import { Button, Typography, Box, Grid, useTheme } from '@mui/material';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import './LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
  const theme = useTheme();

  return (
    <div className="landing-page" style={{ backgroundColor: theme.palette.background.default, position: 'relative', minHeight: '100vh' }}>
      <Grid container className="full-height">
        <Grid item xs={12} md={6} className="content-container">
          <Box className="content" sx={{ color: theme.palette.text.primary }}>
            <Typography variant="h1" component="h1" className="title" sx={{ color: theme.palette.primary.main }}>
              Type Tonic
            </Typography>
            <Typography variant="h2" component="h2" className="subtitle" sx={{ color: theme.palette.secondary.main }}>
              Design Your Perfect Keyboard
            </Typography>
            <Typography variant="body1" className="description">
              Unleash your creativity and craft the keyboard of your dreams with our intuitive design tool. Customize colors, layouts, and more!
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<KeyboardIcon />}
              onClick={onGetStarted}
              className="get-started-btn"
            >
              Get Started
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} className="image-container">
          <div className="background-image"></div>
        </Grid>
      </Grid>
      <Typography 
        variant="caption" 
        component="p" 
        sx={{ 
          fontSize: '0.7rem', 
          position: 'absolute', 
          bottom: 10, 
          right: 20, 
          textAlign: 'right',
          color: 'white'
        }}
      >
        All rights reserved 2024 ©Jaydeep chakrabarty
      </Typography>
    </div>
  );
};

export default LandingPage;