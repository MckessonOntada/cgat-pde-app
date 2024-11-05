import React from 'react';

import Chip from '@mui/material/Chip';

function ChipComponent({ label, onChipDelete, data }) {
  return (
    <Chip
      label={label}
      sx={{
        height: '26px',
        padding: '5px 14px',
        color: 'var(--brand-color-primary)',
        border: '2px solid var(--brand-color-primary)',
        '& .MuiChip-deleteIcon': {
          fontSize: '12px',
          marginRight: '0',
          marginLeft: '0',
          color: 'var(--brand-color-primary)',
          '&:hover': {
            color: 'var(--brand-color-primary)'
          }
        },
        '& .MuiChip-label': {
          fontSize: '12px',
          paddingLeft: '0',
          paddingRight: '0',
          marginRight: '5px',
          lineHeight: '16px',
          fontWeight: '600'
        }
      }}
      variant="outlined"
      size="small"
      onDelete={() => {
        onChipDelete(data);
      }}
    />
  );
}

export default ChipComponent;
