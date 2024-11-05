import { Box } from '@mui/material';
import React, { Fragment, useRef, useState, useEffect } from 'react';

const HtmlElement = ({
  content,
  url,
  heightPx,
  widthPx,
  zoomFactor,
  rotateFactor,
  type,
  isHorizontalView,
  maxWidthPx
}) => {
  const containerSx = {
    backgroundColor: 'white',
    transform: `scale(${zoomFactor || 1})`,
    transformOrigin: 'top left',
    transition: 'transform .4s linear',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: isHorizontalView ? maxWidthPx : heightPx,
    width: widthPx
  };

  const outerContainer = {
    transform: `rotate(${rotateFactor})`,
    transformOrigin: 'center',
    transition: 'transform .4s linear',
    height: isHorizontalView ? maxWidthPx : heightPx,
    width: widthPx
  };

  // forcefully converting xml doc to display in text format
  if (type.indexOf('xml') > -1) {
    type = 'text/plain; charset=utf-8';
  }

  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [rotateFactor, heightPx]);

  if (!!content) {
    return (
      <Box ref={containerRef} style={{ ...outerContainer }}>
        <Box style={{ ...containerSx }}>
          <iframe
            id="htmlIFrame"
            width={isHorizontalView ? dimensions.height : dimensions.width}
            height={isHorizontalView ? dimensions.width : dimensions.height}
            src={`data:${type};base64,${content}`}
          />
        </Box>
      </Box>
    );
  } else if (!!url) {
    return (
      <Box ref={containerRef} sx={{ ...outerContainer }}>
        <Box sx={{ ...containerSx }}>
          <iframe
            id="htmlIFrame"
            width={isHorizontalView ? dimensions.height : dimensions.width}
            height={isHorizontalView ? dimensions.width : dimensions.height}
            src={url}
          />
        </Box>
      </Box>
    );
  }

  //<embed type="text/html" src="snippet.html" width="500" height="200">

  return <Fragment />;
};

export default HtmlElement;
