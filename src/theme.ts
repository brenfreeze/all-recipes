import { createTheme } from '@mui/material/styles';
import { red, yellow } from '@mui/material/colors';

import { Inter } from "next/font/google";

export const inter = Inter({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    warning: {
      main: yellow[500]
    }
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
});

export default theme;