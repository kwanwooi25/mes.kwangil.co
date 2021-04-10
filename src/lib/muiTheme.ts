import { unstable_createMuiStrictModeTheme as createMuiTheme, fade } from '@material-ui/core';

import deepOrange from '@material-ui/core/colors/deepOrange';

export const theme = createMuiTheme({
  typography: {
    fontFamily: ['Noto Sans KR', 'sans-serif'].join(','),
  },
  palette: {
    primary: { main: '#203f97' },
    secondary: { main: '#4da167' },
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
