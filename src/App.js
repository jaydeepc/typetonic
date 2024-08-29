import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import KeyboardSelector from './components/KeyboardSelector';
import ColorPalette from './components/ColorPalette';
import DesignGenerator from './components/DesignGenerator';
import LandingPage from './components/LandingPage';
import { SpeedInsights } from "@vercel/speed-insights/react";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01562em',
    },
    subtitle1: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [selectedKeyboard, setSelectedKeyboard] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [keyboardDesign, setKeyboardDesign] = useState(null);
  const resultRef = useRef(null);

  const handleGetStarted = () => {
    setShowLandingPage(false);
  };

  const handleKeyboardSelect = (keyboard) => {
    setSelectedKeyboard(keyboard);
    setKeyboardDesign(null);
  };

  const handleColorSelect = useCallback((colors) => {
    setSelectedColors(colors);
    setKeyboardDesign(null);
  }, []);

  const handleAvailableColorsUpdate = useCallback((colors) => {
    setAvailableColors(colors);
  }, []);

  const handleDesignGenerated = (design) => {
    setKeyboardDesign(design);
  };

  useEffect(() => {
    if (keyboardDesign && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [keyboardDesign]);

  if (showLandingPage) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LandingPage onGetStarted={handleGetStarted} />
        <SpeedInsights />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h1" component="h1" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                    Type Tonic
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.secondary.main }}>
                    Keyboard Designer Extraordinaire
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    Welcome to Type Tonic, where creativity meets functionality in the world of custom keyboard design. Our intuitive platform empowers you to bring your dream keyboard to life with just a few clicks. Choose from a variety of keyboard models, explore stunning color palettes, and fine-tune every key to match your unique style and preferences.
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    Whether you're a coding enthusiast, a gaming aficionado, or simply someone who appreciates the art of personalization, Type Tonic is your canvas for creating the perfect keyboard. Let your imagination run wild and design a keyboard that's as unique as you are!
                  </Typography>
                </Box>
                <KeyboardSelector onSelect={handleKeyboardSelect} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <ColorPalette
                  onSelect={handleColorSelect}
                  onCustomColorSelect={handleAvailableColorsUpdate}
                  selectedColors={selectedColors}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} ref={resultRef}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <DesignGenerator
                  selectedKeyboard={selectedKeyboard}
                  selectedColors={selectedColors}
                  onDesignGenerated={handleDesignGenerated}
                  availableColors={availableColors}
                />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <SpeedInsights />
    </ThemeProvider>
  );
}

export default App;
