import React, { useRef, useState, useEffect } from 'react';

// import { Tooltip } from '../../components/tooltip/Tooltip';
import { Tooltip } from '@mckesson/mcp-component-library';

const TooltipText = (props) => {
  let { tooltipProps = {}, children, ...rest } = props;
  let {
    placement = 'top',
    alignText = 'left',
    size = 'standard',
    maxWidth = '280px',
    openDelay
  } = tooltipProps;

  const [isOverflowed, setIsOverflow] = useState(false);
  const textElementRef = useRef();

  const checkOverflow = () => {
    if (textElementRef.current) {
      let scrollWidth = textElementRef.current.scrollWidth;
      let offsetWidth = textElementRef.current.offsetWidth;
      let scrollHeight = textElementRef.current.scrollHeight;
      let offsetHeight = textElementRef.current.offsetHeight;

      let overflow = false;

      if (scrollWidth > offsetWidth) {
        overflow = true;
      } else if (offsetHeight + 1 === scrollHeight || offsetHeight === scrollHeight) {
        overflow = false;
      } else if (scrollHeight > offsetHeight) {
        overflow = true;
      }
      setIsOverflow(overflow);
    }
  };

  useEffect(() => {
    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    if (textElementRef.current) {
      resizeObserver.observe(textElementRef.current);
    }

    return () => {
      if (textElementRef.current) {
        resizeObserver.unobserve(textElementRef.current);
      }
    };
  }, []);

  return (
    <Tooltip
      body={children}
      isDisabled={!isOverflowed}
      placement={placement}
      alignText={alignText}
      size={size}
      maxW={maxWidth}
      openDelay={openDelay}>
      <div ref={textElementRef} {...rest}>
        {children}
      </div>
    </Tooltip>
  );
};

export default TooltipText;
