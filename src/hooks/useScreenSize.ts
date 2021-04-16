import { useMediaQuery, useTheme } from '@material-ui/core';

export const useScreenSize = () => {
  const theme = useTheme();
  const isMobileLayout = useMediaQuery(theme.breakpoints.down('sm'));
  const isPadLayout = useMediaQuery(theme.breakpoints.only('md'));
  const isDesktopLayout = useMediaQuery(theme.breakpoints.up('lg'));
  const windowHeight = window.innerHeight;

  return {
    windowHeight,
    isMobileLayout,
    isPadLayout,
    isDesktopLayout,
  };
};
