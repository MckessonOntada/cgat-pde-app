import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTopUtil } from './scrollUtils';

export default function ScrollToTop({ containerId }) {
  const location = useLocation();
  useEffect(() => {
    scrollToTopUtil(containerId);
  }, [location.pathname, containerId]);

  return null;
}
