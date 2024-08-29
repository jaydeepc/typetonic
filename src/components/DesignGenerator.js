import React, { useState, useCallback } from 'react';
import { Button, CircularProgress, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const DesignGenerator = ({ selectedKeyboard, selectedColors, onDesignGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRandomPattern = useCallback(() => {
    const patterns = ['gradient', 'alternating', 'random', 'grouped', 'centered'];
    return patterns[Math.floor(Math.random() * patterns.length)];
  }, []);

  const generateKeyColors = useCallback((pattern, colors) => {
    const keyColors = [];
    const rows = 6; // Assume a standard keyboard layout
    const keysPerRow = 15;

    switch (pattern) {
      case 'gradient':
        for (let i = 0; i < rows; i++) {
          keyColors.push(new Array(keysPerRow).fill(null).map((_, j) => {
            const index = Math.floor((i * keysPerRow + j) / (rows * keysPerRow) * colors.length);
            return colors[index];
          }));
        }
        break;
      case 'alternating':
        for (let i = 0; i < rows; i++) {
          keyColors.push(new Array(keysPerRow).fill(null).map((_, j) => {
            return colors[(i + j) % colors.length];
          }));
        }
        break;
      case 'random':
        for (let i = 0; i < rows; i++) {
          keyColors.push(new Array(keysPerRow).fill(null).map(() => {
            return colors[Math.floor(Math.random() * colors.length)];
          }));
        }
        break;
      case 'grouped':
        const groupSize = Math.floor(keysPerRow / colors.length);
        for (let i = 0; i < rows; i++) {
          const rowColors = [];
          for (let j = 0; j < colors.length; j++) {
            rowColors.push(...new Array(groupSize).fill(colors[j]));
          }
          keyColors.push(rowColors.slice(0, keysPerRow));
        }
        break;
      case 'centered':
        const centerColor = colors[0];
        const outerColor = colors[colors.length - 1];
        for (let i = 0; i < rows; i++) {
          keyColors.push(new Array(keysPerRow).fill(null).map((_, j) => {
            const distanceFromCenter = Math.abs(j - Math.floor(keysPerRow / 2)) + Math.abs(i - Math.floor(rows / 2));
            return distanceFromCenter < 3 ? centerColor : outerColor;
          }));
        }
        break;
      default:
        // Default to random if pattern is not recognized
        for (let i = 0; i < rows; i++) {
          keyColors.push(new Array(keysPerRow).fill(null).map(() => {
            return colors[Math.floor(Math.random() * colors.length)];
          }));
        }
    }

    return keyColors;
  }, []);

  const simulateClaudeAPI = useCallback(async (keyboardType, colors) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const pattern = generateRandomPattern();
        const keyColors = generateKeyColors(pattern, colors);
        const design = {
          keyboardType,
          colors,
          keyColors,
          pattern,
        };
        resolve(design);
      }, 2000); // Simulate a 2-second delay
    });
  }, [generateRandomPattern, generateKeyColors]);

  const generateDesign = useCallback(async () => {
    if (isGenerating || !selectedKeyboard || selectedColors.length === 0) {
      return;
    }

    setIsGenerating(true);

    try {
      const design = await simulateClaudeAPI(selectedKeyboard, selectedColors);
      onDesignGenerated(design);
    } catch (error) {
      console.error("Error generating design:", error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, selectedKeyboard, selectedColors, simulateClaudeAPI, onDesignGenerated]);

  return (
    <Box sx={{ textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h6" gutterBottom>
          Generate Your Keychron Keyboard Design
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={generateDesign}
          disabled={!selectedKeyboard || selectedColors.length === 0 || isGenerating}
          startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ mt: 2 }}
        >
          {isGenerating ? 'Generating...' : 'Generate Design'}
        </Button>
      </motion.div>
      {(selectedKeyboard || selectedColors.length > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography variant="body2" sx={{ mt: 2 }}>
            Selected Keyboard: {selectedKeyboard || 'None'}
          </Typography>
          <Typography variant="body2">
            Selected Colors: {selectedColors.length > 0 ? selectedColors.join(', ') : 'None'}
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};

export default DesignGenerator;