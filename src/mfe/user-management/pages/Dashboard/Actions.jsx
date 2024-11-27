import { Button } from '@mckesson/mcp-component-library';
import React, { useState, useEffect } from 'react';
import './index.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as VerticalIcon } from '@src/assets/image/Vertical.svg';
import { ReactComponent as View } from '@src/assets/image/view.svg';
import { ReactComponent as Edit } from '@src/assets/image/edit_pencil.svg';
import { debugIds, ID } from '@src/constants/id';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/constants';

export default function Actions({ row, showEditButton, showViewButton }) {
  const { t } = useTranslate();
  const navigate = useNavigate();

  const handleEdit = (userId) => {
    navigate(`../${PATHS.editUser}/${userId}`,  { state: { isPending: true } })
    //navigate(`edit-user/${userId}`);
  };

  const handleView = (userId) => {
    const path = PATHS.userDetail.replace(':userId', userId);
    navigate(path);
  };

  const handleReject = () => {
    // alert('Handle Reject');
  };

  const handleOtherAction = () => {
    // alert('Handle Other Action');
  };

  return (
    <div className="actionsBox" id={debugIds(ID.ACTION_ICON, ID.CONTAINER)}>
      {/* <DropdownMenu
        anchorEl={<VerticalIcon />}
        handleSelect={(selectedItem) => {
          if (selectedItem.value === 'Edit') {
            handleEdit(row.id);
          }
          if (selectedItem.value === 'Reject') {
            handleReject();
          }

        }}
        options={[
          {
            label: t('userManagement.table.action.edit'),
            value: 'Edit'
          },
          {
            label: t('userManagement.table.action.reject'),
            value: 'Reject'
          }
        ]}
      /> */}
      {showViewButton && (
        <Button
          Icon={View}
          variant="tertiary"
          size="md"
          className="button-icon"
          onClick={() => handleView(row.id)}>
          {t('userManagement.table.action.view')}
        </Button>
      )}
      {showEditButton && (
        <Button 
          Icon={Edit}
          variant="tertiary"
          size="md"
          className="button-icon"
          onClick={() => handleEdit(row.id)}>
          {t('userManagement.table.action.edit')}
        </Button>
      )}
    </div>
  );
}