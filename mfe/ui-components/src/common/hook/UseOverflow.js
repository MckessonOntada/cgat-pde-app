import { useLayoutEffect, useState } from 'react';

function useOverflow(elRef) {
  const [isOverflowed, setIsOverflow] = useState(false);
  useLayoutEffect(() => {
    const { current } = elRef;
    const trigger = () => {
      const hasOverflow = current?.scrollWidth > current?.clientWidth;
      setIsOverflow(hasOverflow);
    };
    if (elRef) {
      if ('ResizeObserver' in window) {
        new ResizeObserver(trigger).observe(current);
      }
    }
  }, [elRef]);

  return isOverflowed;
}

export default useOverflow;
