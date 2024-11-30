import { IconButton, Switch } from '@mckesson/mcp-component-library';
import React from 'react';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as View } from '@src/assets/image/view.svg';
import { useTranslate } from '@src/translations/useTranslation';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/constants';

export default function Actions({ row }) {
  const { t } = useTranslate();
  const navigate = useNavigate();

  const handleClick = (id) => {
    const path = PATHS.viewOrg.replace(':orgId', id);
    navigate(path, { state: { isView: true } });
  };

  return (
    <Button Icon={View} variant="tertiary" size="md" className="button-icon" onClick={() => handleClick(row.id)}>
      {t('orgManagement.table.action.view')}
    </Button>
  );
}
