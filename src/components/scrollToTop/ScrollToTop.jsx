import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTopUtil } from './scrollUtils';
import { PATHS as financeRoutes } from '@src/mfe/finance-management/routes';

export default function ScrollToTop({ containerId }) {
  const location = useLocation();
  const ignorablePaths = [...Object.values(financeRoutes)];

  const isValid = useMemo(() => {
    let _isValid = ignorablePaths.some((item) => location.pathname.includes(item));
    return !_isValid;
  }, [location.pathname, containerId]);

  useEffect(() => {
    if (isValid) {
      scrollToTopUtil(containerId);
    }
  }, [location.pathname, containerId]);

  return null;
}
