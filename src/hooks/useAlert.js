import { showSnackbar as _showSnackbar } from '@src/store/reducer/snackbarReducer';
import { useDispatch } from 'react-redux';

const useAlert = () => {
  const dispatch = useDispatch();

  const showAlert = (props) => {
    const _props = typeof props === 'string' ? { description: props, type: 'success', anchorEl: null } : props;

    dispatch(_showSnackbar(_props));
  };

  return { showAlert };
};

export default useAlert;
