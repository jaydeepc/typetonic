import React from 'react';
import { Button, CircularProgress, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const DesignGenerator = ({ selectedKeyboard, selectedColors, onDesignGenerated }) => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const generateDesign = async () => {
    setIsGenerating(true);
    // Simulated API call to Claude
    const simulateClaudeAPI = async (keyboardType, colors) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const design = {
            keyboardType,
            colors,
            // Add more design details here
          };
          resolve(design);
        }, 2000); // Simulate a 2-second delay
      });
    };

    try {
      const design = await simulateClaudeAPI(selectedKeyboard, selectedColors);
      onDesignGenerated(design);
    } catch (error) {
      console.error("Error generating design:", error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsGenerating(false);
    }
  };

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
            Selected Colors: {selectedColors.length > 0 ? selectedColors.length : 'None'}
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};

export default DesignGenerator;