import { showAlert as _showAlert, closeAlert as _closeAlert } from '@src/store/reducer/alertReducer';
import { useDispatch } from 'react-redux';

const useAlert = () => {
  const dispatch = useDispatch();

  const showAlert = (props) => {
    const _props = typeof props === 'string' ? { description: props, type: 'success', anchorEl: null } : props;

    dispatch(_showAlert(_props));
  };

  const closeAlert = () => {
    dispatch(_closeAlert());
  };

  return { showAlert, closeAlert };
};

export default useAlert;
