import React from 'react';
import { Popover as MuiPopover, Box } from '@mui/material';

const Popover = ({ open, anchorEl, handleClose, content }) => {
  return (
    <MuiPopover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      sx={{
        '& .MuiPaper-root': {
          borderRadius: '6px',
          border: '1px solid #BAC5CC',
          boxShadow: '0px 4px 8px 0px #262C3666'
        }
      }}>
      <Box
        sx={{
          padding: '16px 24px',
          width: '24vw'
        }}>
        {content}
      </Box>
    </MuiPopover>
  );
};

export default Popover;
