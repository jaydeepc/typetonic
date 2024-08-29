import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Button, CircularProgress, Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { motion } from 'framer-motion';
import { svgToPng } from '../utils/svgToPng';
import SVGRenderer from './SVGRenderer';
import ColorPicker from './ColorPicker';

const DesignGenerator = ({ selectedKeyboard, selectedColors, onDesignGenerated, selectedTheme, availableColors }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState('random');
  const [generatedDesign, setGeneratedDesign] = useState(null);
  const [colorPickerState, setColorPickerState] = useState(null);
  const [error, setError] = useState(null);
  const svgRef = useRef(null);
  const containerRef = useRef(null);

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

  const generateKeyColors = useCallback((pattern, colors, rows, cols) => {
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
  }, []);

  const generateDesign = useCallback(async () => {
    console.log('Generating design...');
    console.log('Selected keyboard:', selectedKeyboard);
    console.log('Selected colors:', selectedColors);
    console.log('Selected pattern:', selectedPattern);

    if (!selectedKeyboard || selectedColors.length === 0) {
      setError("Please select a keyboard and colors before generating a design.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    
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
      console.log('Design generated:', design);
      setGeneratedDesign(design);
      onDesignGenerated(design);
    } catch (error) {
      console.error("Error generating design:", error);
      setError("Failed to generate design. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [selectedKeyboard, selectedColors, selectedPattern, generateKeyColors, onDesignGenerated]);

  const handlePatternChange = (event) => {
    setSelectedPattern(event.target.value);
  };

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
      setError("Failed to download PNG. Please try again.");
    }
  };

  const handleKeyClick = (rowIndex, keyIndex, event) => {
    if (generatedDesign && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - containerRect.left;
      const y = event.clientY - containerRect.top;
      setColorPickerState({
        rowIndex,
        keyIndex,
        color: generatedDesign.keyColors[rowIndex][keyIndex],
        position: { x, y },
      });
    }
  };

  const handleColorChange = (color) => {
    if (colorPickerState && generatedDesign) {
      const { rowIndex, keyIndex } = colorPickerState;
      const newKeyColors = [...generatedDesign.keyColors];
      newKeyColors[rowIndex][keyIndex] = color;
      setGeneratedDesign({ ...generatedDesign, keyColors: newKeyColors });
    }
  };

  const handleColorPickerClose = () => {
    setColorPickerState(null);
  };

  return (
    <Box sx={{ textAlign: 'center' }} ref={containerRef}>
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
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={generateDesign}
          disabled={isGenerating}
          sx={{ mt: 2, ml: 2 }}
        >
          {isGenerating ? 'Generating...' : 'Generate Design'}
        </Button>
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
      {error && (
        <Box mt={4}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Box>
      )}
      {generatedDesign && !isGenerating && (
        <Box mt={4} sx={{ position: 'relative' }}>
          <SVGRenderer design={generatedDesign} onKeyClick={handleKeyClick} ref={svgRef} />
          {colorPickerState && (
            <ColorPicker
              color={colorPickerState.color}
              onChange={handleColorChange}
              onClose={handleColorPickerClose}
              position={colorPickerState.position}
              customColors={availableColors}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default DesignGenerator;