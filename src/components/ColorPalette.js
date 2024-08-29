import React, { useState } from 'react';
import { Box, Typography, Button, Chip, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';

const ColorPalette = ({ onSelect }) => {
  const [selectedColors, setSelectedColors] = useState([]);
  const colorSchemes = [
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
  ];

  const handleColorSelect = (color) => {
    const updatedColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    setSelectedColors(updatedColors);
    onSelect(updatedColors);
  };

  const handleSchemeSelect = (scheme) => {
    setSelectedColors(scheme.colors);
    onSelect(scheme.colors);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Color Schemes
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {colorSchemes.map((scheme) => (
          <Button
            key={scheme.name}
            variant="outlined"
            onClick={() => handleSchemeSelect(scheme)}
          >
            {scheme.name}
          </Button>
        ))}
      </Box>
      <Typography variant="h6" gutterBottom>
        Custom Colors
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {colorSchemes.flatMap((scheme) =>
          scheme.colors.map((color) => (
            <Tooltip title={color} key={color}>
              <Chip
                label={color}
                sx={{
                  bgcolor: color,
                  color: color === '#ffffff' ? '#000000' : '#ffffff',
                  border: selectedColors.includes(color) ? '2px solid #ffffff' : 'none',
                }}
                onClick={() => handleColorSelect(color)}
              />
            </Tooltip>
          ))
        )}
      </Box>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Selected Colors:
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
            <Tooltip title={color}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: color,
                  border: '1px solid #ffffff',
                  cursor: 'pointer',
                }}
                onClick={() => handleColorSelect(color)}
              />
            </Tooltip>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default ColorPalette;