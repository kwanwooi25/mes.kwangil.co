import { useEffect, useState } from 'react';

export const useScreenSize = () => {
  const [height, setHeight] = useState<number>(window.innerHeight);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const isMobileLayout = width < 640;
  const isTabletLayout = width >= 640 && width < 1024;
  const isLaptopLayout = width >= 1024 && width < 1280;
  const isDesktopLayout = width >= 1280;
  const isLargerDesktopLayout = width >= 1600;

  const handleWindowResize = () => {
    setHeight(window.innerHeight);
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return {
    windowHeight: height,
    windowWidth: width,
    isMobileLayout,
    isTabletLayout,
    isLaptopLayout,
    isDesktopLayout,
    isLargerDesktopLayout,
  };
};
