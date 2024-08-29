import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Button, CircularProgress, Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { motion } from 'framer-motion';
import { svgToPng } from '../utils/svgToPng';
import SVGRenderer from './SVGRenderer';

const DesignGenerator = ({ selectedKeyboard, selectedColors, onDesignGenerated, selectedTheme }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState('random');
  const [generatedDesign, setGeneratedDesign] = useState(null);
  const svgRef = useRef(null);

  const patterns = useMemo(() => ({
    general: [
      { name: 'Random', value: 'random' },
      { name: 'Gradient', value: 'gradient' },
      { name: 'Horizontal Stripes', value: 'hstripes' },
      { name: 'Vertical Stripes', value: 'vstripes' },
      { name: 'Checkerboard', value: 'checkerboard' },
      { name: 'Waves', value: 'waves' },
      { name: 'Triangles', value: 'triangles' },
      { name: 'Diagonal', value: 'diagonal' },
      { name: 'Radial', value: 'radial' },
      { name: 'Spiral', value: 'spiral' },
      { name: 'Diamond', value: 'diamond' },
      { name: 'Mosaic', value: 'mosaic' },
      { name: 'Zigzag', value: 'zigzag' },
      { name: 'Concentric', value: 'concentric' },
    ],
    countryFlags: [
      { name: 'Stripes', value: 'hstripes' },
      { name: 'Blocks', value: 'blocks' },
    ],
    nature: [
      { name: 'Waves', value: 'waves' },
      { name: 'Gradient', value: 'gradient' },
      { name: 'Radial', value: 'radial' },
    ],
    horror: [
      { name: 'Blood Splatter', value: 'splatter' },
      { name: 'Cracked', value: 'cracked' },
      { name: 'Fog', value: 'fog' },
    ],
    monster: [
      { name: 'Scales', value: 'scales' },
      { name: 'Slime', value: 'slime' },
      { name: 'Fur', value: 'fur' },
    ],
  }), []);

  const generateKeyColors = (pattern, colors, rows, cols) => {
    const keyColors = [];
    
    const getColor = (index) => colors[Math.abs(index) % colors.length];
    
    switch (pattern) {
      case 'gradient':
        for (let i = 0; i < rows; i++) {
          const row = [];
          for (let j = 0; j < cols; j++) {
            const index = Math.floor(((i * cols + j) / (rows * cols)) * colors.length);
            row.push(getColor(index));
          }
          keyColors.push(row);
        }
        break;
      
      case 'hstripes':
        for (let i = 0; i < rows; i++) {
          keyColors.push(new Array(cols).fill(getColor(i)));
        }
        break;
      
      case 'vstripes':
        for (let i = 0; i < rows; i++) {
          const row = [];
          for (let j = 0; j < cols; j++) {
            row.push(getColor(j));
          }
          keyColors.push(row);
        }
        break;
      
      case 'checkerboard':
        for (let i = 0; i < rows; i++) {
          const row = [];
          for (let j = 0; j < cols; j++) {
            row.push(getColor(i + j));
          }
          keyColors.push(row);
        }
        break;
      
      case 'waves':
        for (let i = 0; i < rows; i++) {
          const row = [];
          for (let j = 0; j < cols; j++) {
            const index = Math.floor(Math.sin((i + j) * 0.5) * colors.length);
            row.push(getColor(index));
          }
          keyColors.push(row);
        }
        break;
      
      // ... (include other pattern cases)
      
      case 'random':
      default:
        for (let i = 0; i < rows; i++) {
          const row = [];
          for (let j = 0; j < cols; j++) {
            row.push(getColor(Math.floor(Math.random() * colors.length)));
          }
          keyColors.push(row);
        }
        break;
    }
    
    return keyColors;
  };

  const generateDesign = async () => {
    setIsGenerating(true);
    
    // Simulated API call to Claude
    const simulateClaudeAPI = async (keyboardType, colors, pattern) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const rows = 6; // Assume a standard keyboard layout
          const cols = 15;
          const keyColors = generateKeyColors(pattern, colors, rows, cols);
          const design = {
            keyboardType,
            colors,
            keyColors,
            pattern,
          };
          resolve(design);
        }, 2000); // Simulate a 2-second delay
      });
    };

    try {
      const design = await simulateClaudeAPI(selectedKeyboard, selectedColors, selectedPattern);
      setGeneratedDesign(design);
      onDesignGenerated(design);
    } catch (error) {
      console.error("Error generating design:", error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePatternChange = (event) => {
    setSelectedPattern(event.target.value);
  };

  useEffect(() => {
    if (selectedKeyboard && selectedColors.length > 0 && selectedPattern) {
      generateDesign();
    }
  }, [selectedKeyboard, selectedColors, selectedPattern]);

  const handleDownload = async () => {
    if (!generatedDesign || !svgRef.current) return;

    try {
      const svgElement = svgRef.current;
      const pngDataUrl = await svgToPng(svgElement, svgElement.width.baseVal.value, svgElement.height.baseVal.value);
      const link = document.createElement('a');
      link.href = pngDataUrl;
      link.download = 'keyboard_design.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PNG:', error);
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
        <FormControl sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="pattern-select-label">Design Pattern</InputLabel>
          <Select
            labelId="pattern-select-label"
            id="pattern-select"
            value={selectedPattern}
            label="Design Pattern"
            onChange={handlePatternChange}
          >
            {(patterns[selectedTheme] || patterns.general).map((pattern) => (
              <MenuItem key={pattern.value} value={pattern.value}>
                {pattern.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {generatedDesign && (
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleDownload}
            sx={{ mt: 2, ml: 2 }}
          >
            Download PNG
          </Button>
        )}
      </motion.div>
      {isGenerating && (
        <Box mt={4}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Generating design...
          </Typography>
        </Box>
      )}
      {generatedDesign && !isGenerating && (
        <Box mt={4}>
          <SVGRenderer design={generatedDesign} onKeyClick={() => {}} ref={svgRef} />
        </Box>
      )}
    </Box>
  );
};

export default DesignGenerator;