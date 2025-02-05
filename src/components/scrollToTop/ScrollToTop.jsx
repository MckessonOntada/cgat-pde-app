import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTopUtil } from './scrollUtils';
import { PATHS as financeRoutes } from '@src/mfe/finance-management/routes';
import { useDispatch } from 'react-redux';
import { closeSnackbar } from '@src/store/reducer/snackbarReducer';

export default function ScrollToTop({ containerId }) {
  const location = useLocation();
  const ignorablePaths = [...Object.values(financeRoutes)];
  const dispatch = useDispatch();

  const isValid = useMemo(() => {
    let _isValid = ignorablePaths.some((item) => location.pathname.includes(item));
    return !_isValid;
  }, [location.pathname, containerId]);

  useEffect(() => {
    if (isValid) {
      scrollToTopUtil(containerId);
    }
    dispatch(closeSnackbar());
  }, [location.pathname, containerId]);

  return null;
}
