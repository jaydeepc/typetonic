import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Button, Chip, Tooltip, Grid, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';

const ColorPalette = ({ onSelect, onCustomColorSelect, selectedColors }) => {
  const [availableColors, setAvailableColors] = useState([]);
  
  const colorSchemes = useMemo(() => [
    {
      name: 'Monochrome',
      colors: ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff'],
    },
    {
      name: 'Pastel',
      colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'],
    },
    {
      name: 'Neon',
      colors: ['#FF00FF', '#00FFFF', '#00FF00', '#FFFF00', '#FF0000'],
    },
    {
      name: 'Earth Tones',
      colors: ['#8B4513', '#A0522D', '#D2691E', '#DEB887', '#F4A460'],
    },
    {
      name: 'Ocean',
      colors: ['#000080', '#0000FF', '#1E90FF', '#00BFFF', '#87CEEB'],
    },
    {
      name: 'Sunset',
      colors: ['#FF4500', '#FF6347', '#FF7F50', '#FFA07A', '#FFD700'],
    },
    {
      name: 'Forest',
      colors: ['#006400', '#228B22', '#32CD32', '#90EE90', '#98FB98'],
    },
    {
      name: 'Cyberpunk',
      colors: ['#FF00FF', '#00FFFF', '#FF1493', '#FFFF00', '#1E90FF'],
    },
    {
      name: 'Retro',
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FAD02E', '#FF9900'],
    },
    {
      name: 'Minimalist',
      colors: ['#FFFFFF', '#EEEEEE', '#DDDDDD', '#CCCCCC', '#000000'],
    },
    // National Flag Color Schemes
    {
      name: 'USA Flag',
      colors: ['#B22234', '#FFFFFF', '#3C3B6E'],
    },
    {
      name: 'UK Flag',
      colors: ['#C8102E', '#FFFFFF', '#012169'],
    },
    {
      name: 'German Flag',
      colors: ['#000000', '#DD0000', '#FFCE00'],
    },
    {
      name: 'French Flag',
      colors: ['#002395', '#FFFFFF', '#ED2939'],
    },
    {
      name: 'Italian Flag',
      colors: ['#009246', '#FFFFFF', '#CE2B37'],
    },
    {
      name: 'Japanese Flag',
      colors: ['#FFFFFF', '#BC002D'],
    },
    {
      name: 'Brazilian Flag',
      colors: ['#009c3b', '#FFDF00', '#002776', '#FFFFFF'],
    },
    {
      name: 'Indian Flag',
      colors: ['#FF9933', '#FFFFFF', '#138808', '#000080'],
    },
  ], []);

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

  useEffect(() => {
    const allColors = colorSchemes.flatMap(scheme => scheme.colors);
    const uniqueColors = [...new Set(allColors)];
    setAvailableColors(uniqueColors);
    onCustomColorSelect(uniqueColors);
  }, [colorSchemes, onCustomColorSelect]);

  return (
    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Color Schemes
      </Typography>
      <Grid container spacing={1} sx={{ mb: 3 }}>
        {colorSchemes.map((scheme) => (
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
        ))}
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
              >
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    bgcolor: 'white',
                    '&:hover': { bgcolor: 'white' },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Tooltip>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default ColorPalette;