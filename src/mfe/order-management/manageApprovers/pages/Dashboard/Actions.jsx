import React from 'react';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as View } from '@src/assets/image/view.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/constants';

export default function Actions({ row }) {
  const { t } = useTranslate();
  const navigate = useNavigate();

  const handleViewClick = (id) => {
    const path = PATHS.approvergroupDetail.replace(':grpId', id);
    navigate(path, { state: { isView: true } });
  };

  return (
    <React.Fragment>
      <Button Icon={View} variant="tertiary" size="md" className="button-icon" onClick={() => handleViewClick(row.id)}>
        {t('approvergroup.table.action.view')}
      </Button>
    </React.Fragment>
  );
}
