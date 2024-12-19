import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SnackBar } from '@mckesson/mcp-component-library';
import { closeSnackbar } from '@src/store/reducer/snackbarReducer';

function Snackbar() {
  const dispatch = useDispatch();
  const { isOpen, description, type } = useSelector((state) => state.snackbarState);

  const handleClose = () => {
    dispatch(closeSnackbar());
  };
  return <>{isOpen && <SnackBar description={description} type={type} duration={15000} position="top-center" onClose={handleClose} />}</>;
}

export default Snackbar;
