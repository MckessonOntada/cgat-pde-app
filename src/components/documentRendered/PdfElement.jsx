import React, { Fragment, useEffect, useRef, useState } from 'react';
import CommonUtils from '../../common/util/CommonUtils';

const PdfElement = ({ url, heightPx, widthPx, zoomFactor, isHorizontalView, rotateFactor }) => {
  if (!url) return <Fragment />;

  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({ width: offsetWidth - 4, height: offsetHeight - 4 });
    }
  }, [rotateFactor, heightPx]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: heightPx,
        width: widthPx
      }}>
      {CommonUtils.isFirefox && (
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            height: '32px',
            width: '100%',
            backgroundColor: 'rgb(229, 232, 234)',
            zIndex: 999
          }}>
          &nbsp;
        </div>
      )}

      <iframe
        style={{
          transform: `rotate(${rotateFactor}deg)`,
          transformOrigin: 'center'
        }}
        id="documentPdf"
        src={`${url}#fitToWidth=1&toolbar=0&page=1&${
          !zoomFactor && 'view=fitH'
        }&zoom=${zoomFactor}`}
        width={isHorizontalView ? dimensions.height : dimensions.width}
        height={isHorizontalView ? dimensions.width : dimensions.height}
      />
    </div>
  );
};

export default PdfElement;
