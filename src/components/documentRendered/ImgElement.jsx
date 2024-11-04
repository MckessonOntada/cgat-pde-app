import { Box } from '@mui/material';
import React, { Fragment } from 'react';

const ImgElement = ({ content, url, heightPx, widthPx, type, zoomFactor, rotateFactor }) => {
  const styleObj = {
    transform: `scale(${zoomFactor || 1})`,
    transformOrigin: 'top left',
    minWidth: '100%',
    transition: 'transform .4s'
  };

  const outerContainer = {
    transform: `rotate(${rotateFactor})`,
    transformOrigin: 'center',
    transition: 'transform .4s linear'
  };

  if (!!content) {
    return (
      <Box sx={{ ...outerContainer }}>
        <img alt="item" style={{ ...styleObj }} src={`data:${type};base64,${content}`} />
      </Box>
    );
  } else if (!!url) {
    return (
      <Box sx={{ ...outerContainer }}>
        <img alt="item" style={{ ...styleObj }} src={url} />
      </Box>
    );
  }

  return <Fragment />;
};

export default ImgElement;
