import { WorkOrderStatus } from 'const';

import {
    fade, lighten, unstable_createMuiStrictModeTheme as createMuiTheme
} from '@material-ui/core';
import { grey, lightGreen, orange, red, yellow } from '@material-ui/core/colors';
import deepOrange from '@material-ui/core/colors/deepOrange';

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    [WorkOrderStatus.NOT_STARTED]: Palette['primary'];
    [WorkOrderStatus.EXTRUDING]: Palette['primary'];
    [WorkOrderStatus.PRINTING]: Palette['primary'];
    [WorkOrderStatus.CUTTING]: Palette['primary'];
    [WorkOrderStatus.COMPLETED]: Palette['primary'];
  }
  interface PaletteOptions {
    [WorkOrderStatus.NOT_STARTED]: PaletteOptions['primary'];
    [WorkOrderStatus.EXTRUDING]: PaletteOptions['primary'];
    [WorkOrderStatus.PRINTING]: PaletteOptions['primary'];
    [WorkOrderStatus.CUTTING]: PaletteOptions['primary'];
    [WorkOrderStatus.COMPLETED]: PaletteOptions['primary'];
  }
}

export const theme = createMuiTheme({
  typography: {
    // fontFamily: ['Noto Sans KR', 'sans-serif'].join(','),
    fontFamily: ['Godo', 'sans-serif'].join(','),
  },
  palette: {
    primary: { main: '#213f97' },
    secondary: { main: '#4da167' },
    [WorkOrderStatus.NOT_STARTED]: { light: lighten(red[50], 0.3), main: red[500], dark: red[700] },
    [WorkOrderStatus.EXTRUDING]: { light: lighten(orange[50], 0.3), main: orange[500], dark: orange[700] },
    [WorkOrderStatus.PRINTING]: { light: lighten(yellow[50], 0.3), main: yellow[500], dark: yellow[700] },
    [WorkOrderStatus.CUTTING]: { light: lighten(lightGreen[50], 0.3), main: lightGreen[500], dark: lightGreen[700] },
    [WorkOrderStatus.COMPLETED]: { light: grey[100], main: grey[500], dark: grey[700] },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '.highlight': {
          position: 'relative',
          '&::after': {
            content: '""',
            background: fade(deepOrange[500], 0.5),
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '35%',
            paddingBottom: '3%',
          },
        },
      },
    },
  },
});
