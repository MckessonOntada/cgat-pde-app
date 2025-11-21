import { Button } from '@mckesson/mcp-component-library';
import React from 'react';
import './index.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as View } from '@src/assets/image/view.svg';
import { ReactComponent as Edit } from '@src/assets/image/edit_pencil.svg';
import { debugIds, ID } from '@src/constants/id';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/constants';

export default function Actions({ row, showEditButton, showViewButton }) {
  const { t } = useTranslate();
  const navigate = useNavigate();

  const handleEdit = (userId) => {
    navigate(`../${PATHS.EDIT}/${userId}`, { state: { isPending: true } });
  };

  const handleView = (userId) => {
    const path = PATHS.userDetail.replace(':userId', userId);
    navigate(path);
  };

  return (
    <div className="actionsBox" id={debugIds(ID.ACTION_ICON, ID.CONTAINER)}>
      {showViewButton && (
        <Button Icon={View} variant="tertiary" size="md" className="button-icon" onClick={() => handleView(row.id)}>
          {t('userManagement.table.action.view')}
        </Button>
      )}
      {showEditButton && (
        <Button Icon={Edit} variant="tertiary" size="md" className="button-icon" onClick={() => handleEdit(row.id)}>
          {t('userManagement.table.action.edit')}
        </Button>
      )}
    </div>
  );
}
