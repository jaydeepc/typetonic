import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import KeyboardSelector from './components/KeyboardSelector';
import ColorPalette from './components/ColorPalette';
import SVGRenderer from './components/SVGRenderer';
import DesignGenerator from './components/DesignGenerator';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#bb86fc',
    },
    secondary: {
      main: '#03dac6',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

function App() {
  const [selectedKeyboard, setSelectedKeyboard] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [keyboardDesign, setKeyboardDesign] = useState(null);

  const handleKeyboardSelect = (keyboard) => {
    setSelectedKeyboard(keyboard);
    setKeyboardDesign(null);
  };

  const handleColorSelect = (colors) => {
    setSelectedColors(colors);
    setKeyboardDesign(null);
  };

  const handleDesignGenerated = (design) => {
    setKeyboardDesign(design);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom align="center">
            Welcome to Type Tonic
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <KeyboardSelector onSelect={handleKeyboardSelect} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <ColorPalette onSelect={handleColorSelect} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <DesignGenerator
                  selectedKeyboard={selectedKeyboard}
                  selectedColors={selectedColors}
                  onDesignGenerated={handleDesignGenerated}
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3, overflow: 'auto' }}>
                <SVGRenderer design={keyboardDesign} />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
