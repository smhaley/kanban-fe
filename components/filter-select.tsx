import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(
  name: string,
  selectedValues: readonly string[],
  theme: Theme
) {
  return {
    fontWeight:
      selectedValues.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

interface FilterSelectProps {
  values: string[];
  label: string;
  selectedValues: string[];
  handleValueSelect: (users: string[]) => void;
}

export default function FilterSelect({
  values,
  label,
  selectedValues,
  handleValueSelect,
}: FilterSelectProps) {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof selectedValues>) => {
    const {
      target: { value },
    } = event;

    handleValueSelect(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl sx={{ m: 1, width: 275 }}>
      <InputLabel id={`${label}-multiple-chip-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-multiple-chip-label`}
        id={`${label}-multiple-chip`}
        multiple
        color="secondary"
        value={selectedValues}
        onChange={handleChange}
        input={
          <OutlinedInput id={`select-multiple-chip-${label}`} label="Chip" />
        }
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} size="small" label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {values.map((value) => (
          <MenuItem
            key={value}
            value={value}
            style={getStyles(value, selectedValues, theme)}
          >
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
