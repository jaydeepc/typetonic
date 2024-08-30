import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Button, CircularProgress, Box, Typography, Select, MenuItem, FormControl, InputLabel, Chip, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { svgToPng } from '../utils/svgToPng';
import SVGRenderer from './SVGRenderer';
import ColorPicker from './ColorPicker';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const DesignGenerator = ({ selectedKeyboard, selectedColors, onDesignGenerated, selectedTheme, availableColors }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState('gradient');
  const [generatedDesign, setGeneratedDesign] = useState(null);
  const [colorPickerState, setColorPickerState] = useState(null);
  const [error, setError] = useState(null);
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  const patterns = useMemo(() => ({
    general: [
      { name: 'Gradient', value: 'gradient' },
      { name: 'Random', value: 'random' },
      { name: 'Horizontal Stripes', value: 'hstripes' },
      { name: 'Vertical Stripes', value: 'vstripes' },
      { name: 'Checkerboard', value: 'checkerboard' },
      { name: 'Waves', value: 'waves' },
      { name: 'Diagonal', value: 'diagonal' },
      { name: 'Radial', value: 'radial' },
      { name: 'Spiral', value: 'spiral' },
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
    const primaryColor = colors[0];
    const secondaryColor = colors[1] || getColor(1);
    
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
        const stripeHeight = 2; // Two adjacent keys for each stripe
        for (let i = 0; i < rows; i++) {
          const stripeIndex = Math.floor(i / stripeHeight);
          const stripeColor = getColor(stripeIndex % colors.length);
          keyColors.push(new Array(cols).fill(stripeColor));
        }
        break;
      
      case 'vstripes':
        const stripeWidth = 2; // Two adjacent keys for each stripe
        for (let i = 0; i < rows; i++) {
          const row = [];
          for (let j = 0; j < cols; j++) {
            const stripeIndex = Math.floor(j / stripeWidth);
            const stripeColor = getColor(stripeIndex % colors.length);
            row.push(stripeColor);
          }
          keyColors.push(row);
        }
        break;
      
      case 'checkerboard':
        const squareSize = Math.max(2, Math.floor(Math.min(rows, cols) / 4));
        for (let i = 0; i < rows; i++) {
          const row = [];
          for (let j = 0; j < cols; j++) {
            const squareIndex = (Math.floor(i / squareSize) + Math.floor(j / squareSize)) % 2;
            row.push(squareIndex === 0 ? primaryColor : secondaryColor);
          }
          keyColors.push(row);
        }
        break;
      
      case 'waves':
        const waveHeight = 2;
        const waveLength = cols;
        for (let i = 0; i < rows; i++) {
          const row = [];
          for (let j = 0; j < cols; j++) {
            const y = Math.floor(Math.sin((j / waveLength) * 2 * Math.PI) * waveHeight + waveHeight);
            row.push(i === y || i === y + 1 ? primaryColor : secondaryColor);
          }
          keyColors.push(row);
        }
        break;
      
      case 'diagonal':
        for (let i = 0; i < rows; i++) {
          const row = [];
          for (let j = 0; j < cols; j++) {
            row.push(i === j || i === j + 1 || i === j - 1 || i === j + 2 || i === j - 2 ? primaryColor : secondaryColor);
          }
          keyColors.push(row);
        }
        break;
      
      case 'spiral':
        const visited = Array(rows).fill().map(() => Array(cols).fill(false));
        let x = 0, y = 0;
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // right, down, left, up
        let dirIndex = 0;
        
        for (let i = 0; i < rows; i++) {
          keyColors.push(new Array(cols).fill(secondaryColor));
        }
        
        for (let i = 0; i < rows * cols; i++) {
          keyColors[y][x] = primaryColor;
          visited[y][x] = true;
          
          let nextX = x + directions[dirIndex][1];
          let nextY = y + directions[dirIndex][0];
          
          if (nextX >= 0 && nextX < cols && nextY >= 0 && nextY < rows && !visited[nextY][nextX]) {
            x = nextX;
            y = nextY;
          } else {
            dirIndex = (dirIndex + 1) % 4;
            x += directions[dirIndex][1];
            y += directions[dirIndex][0];
          }
          
          if (x < 0 || x >= cols || y < 0 || y >= rows) break;
        }
        break;
      
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
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      {pattern.name === 'Gradient' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                          <CheckCircleIcon sx={{ color: 'red', mr: 0.5, fontSize: '1rem' }} />
                          <Chip
                            label="Awesome"
                            color="primary"
                            size="small"
                            sx={{
                              bgcolor: '#FFD700',
                              color: '#000',
                              fontWeight: 'bold',
                              fontSize: '0.7rem',
                              height: '20px',
                              '&:hover': { bgcolor: '#FFA500' },
                            }}
                          />
                        </Box>
                      )}
                      <Typography variant="body1" sx={{ flexGrow: 1, textAlign: 'left' }}>
                        {pattern.name}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={generateDesign}
              disabled={isGenerating}
              fullWidth
            >
              {isGenerating ? 'Generating...' : 'Generate Design'}
            </Button>
          </Grid>
        </Grid>
        {generatedDesign && (
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleDownload}
            sx={{ mt: 2 }}
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