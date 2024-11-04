import { useDispatch } from 'react-redux';
import { showSnackbar as _showSnackbar } from '../../store/reducer/snackbarReducer';

const useSnackbar = () => {
  const dispatch = useDispatch();

  const showSnackbar = (props) => {
    const _props = typeof props === 'string' ? { description: props, type: 'success' } : props;

    dispatch(_showSnackbar(_props));
  };

  return { showSnackbar };
};

export default useSnackbar;
