import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { purple } from '@mui/material/colors';
const theme = createTheme({
  palette: {
    primary: { main: purple[500] }, // Purple and green play nicely together.
    secondary: {
      main: green[500],
    },
  },
});

export default theme;