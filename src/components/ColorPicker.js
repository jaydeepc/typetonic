import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ColorPicker = ({ color, onChange, onClose, position, customColors }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 2,
        background: 'white',
        padding: 2,
        boxShadow: 3,
        borderRadius: 1,
        left: position.x,
        top: position.y,
        minWidth: 200,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="subtitle1">Selected Color</Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: 'black' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: 40,
          backgroundColor: color,
          marginBottom: 2,
          border: '1px solid #ccc',
        }}
      />
      <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>Custom Colors</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {customColors.map((c) => (
          <Box
            key={c}
            sx={{
              width: 30,
              height: 30,
              backgroundColor: c,
              cursor: 'pointer',
              border: c === color ? '2px solid black' : '1px solid #ccc',
              '&:hover': {
                opacity: 0.8,
              },
            }}
            onClick={() => onChange(c)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ColorPicker;