import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Button, Chip, Tooltip, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { motion } from 'framer-motion';

const ColorPalette = ({ onSelect, onCustomColorSelect, selectedColors }) => {
  const [availableColors, setAvailableColors] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('custom');
  
  const colorSchemes = useMemo(() => ({
    custom: { name: 'Custom', colors: [] },
    countryFlags: {
      name: 'Country Flags',
      schemes: [
        { name: 'USA', colors: ['#B22234', '#FFFFFF', '#3C3B6E'] },
        { name: 'UK', colors: ['#C8102E', '#FFFFFF', '#012169'] },
        { name: 'Germany', colors: ['#000000', '#DD0000', '#FFCE00'] },
        { name: 'France', colors: ['#002395', '#FFFFFF', '#ED2939'] },
        { name: 'Italy', colors: ['#009246', '#FFFFFF', '#CE2B37'] },
        { name: 'Japan', colors: ['#FFFFFF', '#BC002D'] },
        { name: 'Brazil', colors: ['#009c3b', '#FFDF00', '#002776', '#FFFFFF'] },
        { name: 'India', colors: ['#FF9933', '#FFFFFF', '#138808', '#000080'] },
      ]
    },
    nature: {
      name: 'Nature',
      schemes: [
        { name: 'Forest', colors: ['#228B22', '#006400', '#32CD32', '#90EE90', '#98FB98'] },
        { name: 'Ocean', colors: ['#000080', '#0000FF', '#1E90FF', '#00BFFF', '#87CEEB'] },
        { name: 'Sunset', colors: ['#FF4500', '#FF6347', '#FF7F50', '#FFA07A', '#FFD700'] },
      ]
    },
    mood: {
      name: 'Mood',
      schemes: [
        { name: 'Pastel', colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'] },
        { name: 'Neon', colors: ['#FF00FF', '#00FFFF', '#00FF00', '#FFFF00', '#FF0000'] },
        { name: 'Monochrome', colors: ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff'] },
      ]
    },
    horror: {
      name: 'Horror',
      schemes: [
        { name: 'Blood', colors: ['#8B0000', '#FF0000', '#DC143C', '#000000', '#8B4513'] },
        { name: 'Zombie', colors: ['#355E3B', '#4A0E4E', '#636B61', '#A3A847', '#000000'] },
        { name: 'Ghost', colors: ['#E0FFFF', '#F8F8FF', '#DCDCDC', '#D3D3D3', '#000000'] },
      ]
    },
    monster: {
      name: 'Monster',
      schemes: [
        { name: 'Dragon', colors: ['#B22222', '#FF4500', '#FFD700', '#000000', '#2F4F4F'] },
        { name: 'Alien', colors: ['#00FF00', '#32CD32', '#7CFC00', '#000000', '#4B0082'] },
        { name: 'Sea Monster', colors: ['#008080', '#20B2AA', '#00CED1', '#000000', '#4682B4'] },
      ]
    },
  }), []);

  const handleColorSelect = (color) => {
    if (!selectedColors.includes(color)) {
      const updatedColors = [...selectedColors, color];
      onSelect(updatedColors);
    }
  };

  const handleColorRemove = (color) => {
    const updatedColors = selectedColors.filter(c => c !== color);
    onSelect(updatedColors);
  };

  const handleSchemeSelect = (scheme) => {
    onSelect(scheme.colors);
  };

  const handleThemeChange = (event) => {
    setSelectedTheme(event.target.value);
  };

  useEffect(() => {
    const allColors = Object.values(colorSchemes)
      .flatMap(category => category.schemes ? category.schemes.flatMap(scheme => scheme.colors) : category.colors);
    const uniqueColors = [...new Set(allColors)];
    setAvailableColors(uniqueColors);
    onCustomColorSelect(uniqueColors);
  }, [colorSchemes, onCustomColorSelect]);

  return (
    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Color Schemes
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="theme-select-label">Theme</InputLabel>
        <Select
          labelId="theme-select-label"
          id="theme-select"
          value={selectedTheme}
          label="Theme"
          onChange={handleThemeChange}
        >
          {Object.entries(colorSchemes).map(([key, category]) => (
            <MenuItem key={key} value={key}>{category.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Grid container spacing={1} sx={{ mb: 3 }}>
        {colorSchemes[selectedTheme].schemes ? (
          colorSchemes[selectedTheme].schemes.map((scheme) => (
            <Grid item key={scheme.name}>
              <Button
                variant="contained"
                onClick={() => handleSchemeSelect(scheme)}
                sx={{
                  background: `linear-gradient(to right, ${scheme.colors.join(', ')})`,
                  color: '#fff',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              >
                {scheme.name}
              </Button>
            </Grid>
          ))
        ) : (
          <Grid item>
            <Typography>Select colors from the Custom Colors section below</Typography>
          </Grid>
        )}
      </Grid>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Custom Colors
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {availableColors.map((color) => (
          <Tooltip title={color} key={color}>
            <Chip
              label={color}
              sx={{
                bgcolor: color,
                color: color === '#ffffff' ? '#000000' : '#ffffff',
                border: selectedColors.includes(color) ? '2px solid #000000' : 'none',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
              onClick={() => handleColorSelect(color)}
            />
          </Tooltip>
        ))}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
        Selected Colors for Generation
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {selectedColors.map((color) => (
          <motion.div
            key={color}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          >
            <Tooltip title={`Remove ${color}`}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: color,
                  border: '2px solid #ffffff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onClick={() => handleColorRemove(color)}
              />
            </Tooltip>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default ColorPalette;