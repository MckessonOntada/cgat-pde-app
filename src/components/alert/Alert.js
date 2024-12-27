import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactDOM from 'react-dom';
import { Alert as MCPAlert } from '@mckesson/mcp-component-library';
import { closeAlert } from '@src/store/reducer/alertReducer';

function Alert() {
  const dispatch = useDispatch();
  const { isOpen, description, type, title, anchorEl } = useSelector((state) => state.alertState);

  const handleClose = () => {
    dispatch(closeAlert());
  };

  const renderAlert = () => {
    if (anchorEl && anchorEl.current) {
      return ReactDOM.createPortal(
        <div style={{ marginTop: '8px' }}>
          <MCPAlert title={title} showTitle={!!title} description={description} type={type} duration={15000} onClose={handleClose} />
        </div>,
        anchorEl.current
      );
    }
    return null;
  };

  return <>{isOpen && renderAlert()}</>;
}

export default Alert;
