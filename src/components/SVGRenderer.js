import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { Box, Typography } from '@mui/material';
import { keyboardLayouts } from '../utils/keyboardLayouts';
import { motion } from 'framer-motion';

const SVGRenderer = forwardRef(({ design, onKeyClick }, ref) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current && svgRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const svgWidth = svgRef.current.getBoundingClientRect().width;
        const newScale = containerWidth / svgWidth;
        setScale(Math.min(newScale, 1));
      }
    };

    if (design) {
      updateScale();
      window.addEventListener('resize', updateScale);
      return () => window.removeEventListener('resize', updateScale);
    }
  }, [design]);

  if (!design || !design.keyboardType) {
    return (
      <Box ref={containerRef}>
        <Typography variant="body1">No design to display</Typography>
      </Box>
    );
  }

  const layout = keyboardLayouts[design.keyboardType];
  const keySize = 54;
  const spacing = 4;
  const cornerRadius = 5;

  // Calculate SVG dimensions based on the layout
  const svgWidth = Math.max(...layout.layout.map(row => 
    row.reduce((sum, key) => sum + key.width * keySize + spacing, 0)
  )) + spacing;
  const svgHeight = layout.layout.length * (keySize + spacing) + spacing;

  const getContrastColor = (hexColor) => {
    const rgb = parseInt(hexColor.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 128 ? '#ffffff' : '#000000';
  };

  const renderKey = (keyData, color, x, y, rowIndex, keyIndex) => {
    const keyWidth = keyData.width * keySize + (keyData.width - 1) * spacing;
    const textColor = getContrastColor(color);

    return (
      <motion.g
        key={`${x}-${y}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(event) => onKeyClick(rowIndex, keyIndex, event)}
      >
        <motion.rect
          x={x}
          y={y}
          width={keyWidth}
          height={keySize}
          fill={keyData.key === '' ? '#2a2a2a' : color}
          stroke="#000000"
          strokeWidth="1"
          rx={cornerRadius}
          ry={cornerRadius}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        />
        {keyData.key !== '' && (
          <text
            x={x + keyWidth / 2}
            y={y + keySize / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill={textColor}
            fontSize="12"
            fontFamily="Arial, sans-serif"
          >
            {keyData.key}
          </text>
        )}
      </motion.g>
    );
  };

  const renderRow = (row, rowIndex) => {
    let xOffset = 0;
    return row.map((keyData, keyIndex) => {
      const x = xOffset * (keySize + spacing);
      const y = rowIndex * (keySize + spacing);
      const color = design.keyColors && design.keyColors[rowIndex] && design.keyColors[rowIndex][keyIndex]
        ? design.keyColors[rowIndex][keyIndex]
        : design.colors[keyIndex % design.colors.length]; // Use a consistent color for each key
      const key = renderKey(keyData, color, x, y, rowIndex, keyIndex);
      xOffset += keyData.width;
      return key;
    });
  };

  return (
    <Box ref={containerRef}>
      <Typography variant="h6" gutterBottom>
        Keyboard Design: {design.keyboardType}
      </Typography>
      <Box sx={{ overflowX: 'auto', overflowY: 'hidden', pb: 2 }}>
        <svg
          ref={(el) => {
            svgRef.current = el;
            if (typeof ref === 'function') ref(el);
            else if (ref) ref.current = el;
          }}
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          <rect
            x="0"
            y="0"
            width={svgWidth}
            height={svgHeight}
            fill="#1a1a1a"
            rx="10"
            ry="10"
          />
          <g transform={`translate(${spacing}, ${spacing})`}>
            {layout.layout.map((row, rowIndex) => (
              <g key={rowIndex}>{renderRow(row, rowIndex)}</g>
            ))}
          </g>
        </svg>
      </Box>
    </Box>
  );
});

export default SVGRenderer;