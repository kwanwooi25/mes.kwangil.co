import { useMediaQuery, useTheme } from '@material-ui/core';

export const useScreenSize = () => {
  const theme = useTheme();
  const isMobileLayout = useMediaQuery(theme.breakpoints.down('sm'));
  const isTabletLayout = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktopLayout = useMediaQuery(theme.breakpoints.up('xl'));
  const windowHeight = window.innerHeight;

  return {
    windowHeight,
    isMobileLayout,
    isTabletLayout,
    isDesktopLayout,
  };
};
