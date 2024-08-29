import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { keyboardLayouts } from '../utils/keyboardLayouts';

const KeyboardSelector = ({ onSelect }) => {
  const keyboardTypes = Object.keys(keyboardLayouts);

  return (
    <FormControl fullWidth>
      <InputLabel id="keyboard-select-label">Keyboard Model</InputLabel>
      <Select
        labelId="keyboard-select-label"
        id="keyboard-select"
        label="Keyboard Model"
        onChange={(e) => onSelect(e.target.value)}
        defaultValue=""
      >
        <MenuItem value="">
          <em>Select a Keychron keyboard</em>
        </MenuItem>
        {keyboardTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default KeyboardSelector;