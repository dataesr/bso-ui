import { useEffect, useState } from 'react';

const mediumBreakpoint = 767;
const largeBreakpoint = 992;

const useViewport = () => {
  // TODO refacto
  const [size, setSize] = useState({
    mobile: window ? window.innerWidth <= mediumBreakpoint : null,
    tablet: window
      ? window.innerWidth <= largeBreakpoint
        && window.innerWidth > mediumBreakpoint
      : null,
    desktop: window ? window.innerWidth > largeBreakpoint : null,
  });

  useEffect(() => {
    const handleWindowResize = () => {
      setSize({
        mobile: window ? window.innerWidth <= mediumBreakpoint : null,
        tablet: window
          ? window.innerWidth <= largeBreakpoint
            && window.innerWidth > mediumBreakpoint
          : null,
        desktop: window ? window.innerWidth > largeBreakpoint : null,
      });
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return size;
};

export default useViewport;
