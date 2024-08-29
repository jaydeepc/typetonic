import React, { useState, useMemo } from 'react';
import { Button, CircularProgress, Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { motion } from 'framer-motion';

const DesignGenerator = ({ selectedKeyboard, selectedColors, onDesignGenerated, selectedTheme }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState('random');

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

  const generateDesign = async () => {
    setIsGenerating(true);
    
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
        
        case 'triangles':
          for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
              const index = Math.floor((i + j) / 2);
              row.push(getColor(index));
            }
            keyColors.push(row);
          }
          break;
        
        case 'diagonal':
          for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
              row.push(getColor(i - j));
            }
            keyColors.push(row);
          }
          break;
        
        case 'radial':
          const centerX = cols / 2;
          const centerY = rows / 2;
          for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
              const distance = Math.sqrt(Math.pow(i - centerY, 2) + Math.pow(j - centerX, 2));
              row.push(getColor(Math.floor(distance)));
            }
            keyColors.push(row);
          }
          break;
        
        case 'spiral':
          const spiral = [];
          let x = 0, y = 0, dx = 1, dy = 0;
          for (let i = 0; i < rows * cols; i++) {
            spiral.push([y, x]);
            if ((x + dx === cols || x + dx < 0 || y + dy === rows || y + dy < 0) ||
                (keyColors[y + dy] && keyColors[y + dy][x + dx])) {
              [dx, dy] = [-dy, dx];
            }
            x += dx;
            y += dy;
          }
          for (let i = 0; i < rows; i++) {
            keyColors.push(new Array(cols));
          }
          spiral.forEach(([y, x], i) => {
            keyColors[y][x] = getColor(i);
          });
          break;
        
        case 'diamond':
          for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
              const index = Math.abs(i - rows / 2) + Math.abs(j - cols / 2);
              row.push(getColor(index));
            }
            keyColors.push(row);
          }
          break;
        
        case 'mosaic':
          const tileSize = 2;
          for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
              const tileIndex = Math.floor(i / tileSize) + Math.floor(j / tileSize);
              row.push(getColor(tileIndex));
            }
            keyColors.push(row);
          }
          break;
        
        case 'zigzag':
          for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
              const index = (i % 2 === 0) ? j : cols - j - 1;
              row.push(getColor(i + index));
            }
            keyColors.push(row);
          }
          break;
        
        case 'concentric':
          const maxDistance = Math.max(rows, cols);
          for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
              const distance = Math.min(
                Math.min(i, rows - 1 - i),
                Math.min(j, cols - 1 - j)
              );
              row.push(getColor(maxDistance - distance));
            }
            keyColors.push(row);
          }
          break;
        
        case 'blocks':
          const blockSize = 3;
          for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
              const blockIndex = Math.floor(i / blockSize) * 2 + Math.floor(j / blockSize);
              row.push(getColor(blockIndex));
            }
            keyColors.push(row);
          }
          break;
        
        case 'splatter':
          for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
              const random = Math.random();
              if (random < 0.7) {
                row.push(colors[0]); // Background color
              } else {
                row.push(colors[Math.floor(random * (colors.length - 1)) + 1]); // Splatter colors
              }
            }
            keyColors.push(row);
          }
          break;
        
        case 'cracked':
          for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
              const crackFactor = Math.sin(i * 0.5) * Math.cos(j * 0.5);
              row.push(getColor(Math.floor(Math.abs(crackFactor * colors.length))));
            }
            keyColors.push(row);
          }
          break;
        
        case 'fog':
          for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
              const fogFactor = (Math.sin(i * 0.2) + Math.cos(j * 0.2) + 2) / 4;
              const colorIndex = Math.floor(fogFactor * (colors.length - 1));
              row.push(colors[colorIndex]);
            }
            keyColors.push(row);
          }
          break;
        
        case 'scales':
          for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
              const scaleIndex = Math.floor(Math.sin(i * 0.5) * Math.cos(j * 0.5) * colors.length);
              row.push(getColor(Math.abs(scaleIndex)));
            }
            keyColors.push(row);
          }
          break;
        
        case 'slime':
          for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
              const slimeFactor = (Math.sin(i * 0.3) * Math.cos(j * 0.3) + 1) / 2;
              const colorIndex = Math.floor(slimeFactor * (colors.length - 1));
              row.push(colors[colorIndex]);
            }
            keyColors.push(row);
          }
          break;
        
        case 'fur':
          for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
              const furFactor = Math.random() * 0.3 + (Math.sin(i * 0.2) * Math.cos(j * 0.2) + 1) / 2;
              const colorIndex = Math.floor(furFactor * (colors.length - 1));
              row.push(colors[colorIndex]);
            }
            keyColors.push(row);
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
    };

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
        <FormControl sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="pattern-select-label">Design Pattern</InputLabel>
          <Select
            labelId="pattern-select-label"
            id="pattern-select"
            value={selectedPattern}
            label="Design Pattern"
            onChange={(e) => setSelectedPattern(e.target.value)}
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
          disabled={!selectedKeyboard || selectedColors.length === 0 || isGenerating}
          startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ mt: 2, ml: 2 }}
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