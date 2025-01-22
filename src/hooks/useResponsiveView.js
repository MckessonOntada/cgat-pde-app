import { useState, useEffect } from 'react';

function useResponsiveView(breakpoint = 768) {
  const [isResponsiveView, setIsResponsiveView] = useState(window.innerWidth <= breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsResponsiveView(window.innerWidth <= breakpoint);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]);

  return isResponsiveView;
}

export default useResponsiveView;
