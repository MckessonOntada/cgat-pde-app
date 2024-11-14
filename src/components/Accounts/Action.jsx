import { IconButton, Switch } from '@mckesson/mcp-component-library';
import React from 'react';
import { Label, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as DeleteIcon } from '@src/assets/image/delete.svg';

export default function Actions({ row }) {
  const { t } = useTranslate();

  const handleClick = (id) => {
    console.log('accountId:', id);
  };

  return (
    <Button Icon={DeleteIcon} variant="tertiary" size="md" onClick={() => handleClick(row.id)}>
      UNLINK
    </Button>
  );
}
