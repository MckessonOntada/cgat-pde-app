import { useEffect, useMemo, useState } from 'react';

export const useCalculatedHeight = (topOffset, bottomOffset) => {
  const [calculatedHeight, setCalculatedHeight] = useState(calculateHeight);

  useEffect(() => {
    const handleResize = () => {
      setCalculatedHeight(calculateHeight());
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function calculateHeight() {
    const windowHeight = window.innerHeight;
    return `${windowHeight - topOffset - bottomOffset}px`;
  }

  return useMemo(() => calculatedHeight, [calculatedHeight]);
};
