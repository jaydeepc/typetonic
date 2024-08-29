import React, { useEffect, useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ColorPicker = ({ color, onChange, onClose, position, customColors }) => {
  const pickerRef = useRef(null);

  useEffect(() => {
    if (pickerRef.current) {
      const rect = pickerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let { x, y } = position;

      // Adjust horizontal position if it's going out of the viewport
      if (x + rect.width > viewportWidth) {
        x = viewportWidth - rect.width - 10;
      }

      // Adjust vertical position if it's going out of the viewport
      if (y + rect.height > viewportHeight) {
        y = viewportHeight - rect.height - 10;
      }

      pickerRef.current.style.left = `${x}px`;
      pickerRef.current.style.top = `${y}px`;
    }
  }, [position]);

  return (
    <Box
      ref={pickerRef}
      sx={{
        position: 'fixed',
        zIndex: 2000,
        background: 'white',
        padding: 2,
        boxShadow: 3,
        borderRadius: 1,
        minWidth: 200,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            backgroundColor: color,
            border: '1px solid #ccc',
          }}
        />
        <IconButton size="small" onClick={onClose} sx={{ color: 'black' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
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