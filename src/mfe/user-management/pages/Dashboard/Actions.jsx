import { DropdownMenu } from '@mckesson/mcp-component-library';
import React, { useState, useEffect } from 'react';
import './index.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as VerticalIcon } from '@src/assets/image/Vertical.svg';
import { debugIds, ID } from '@src/common/constants/id';
import { useNavigate } from 'react-router-dom';

export default function Actions({ status, row }) {
  const { t } = useTranslate();
  const [isChecked, setIsChecked] = useState(status === 'ACTIVE');
  const navigate = useNavigate();

  useEffect(() => {
    setIsChecked(status === 'ACTIVE');
  }, [status]);

 

  const handleEdit = (userId) => {
    navigate(`edit-user/${userId}`);
  };
  const handleDelete = () => {
    alert('Handle Delete');
  };
  const handleOtherAction = () => {
    alert('Handle Other Action');
  };

  return (
    <div className="actionsBox icon-align " id={debugIds(ID.ACTION_ICON, ID.CONTAINER)}>
      <DropdownMenu
        anchorEl={<VerticalIcon />}
        handleSelect={(selectedItem) => {
          if (selectedItem.value === 'Edit') {
            handleEdit(row.id);
          }
          if (selectedItem.value === 'Delete') {
            handleDelete();
          }
          if (selectedItem.value === 'Inactivate') {
            handleOtherAction();
          }
        }}
        options={[
          {
            label: t('userManagement.table.action.edit'),
            value: 'Edit'
          },
          {
            label: t('userManagement.table.action.delete'),
            value: 'Delete'
          },
          {
            label: t('userManagement.table.action.edit'),
            value: 'Inactivate'
          }
        ]}
      />
 
    </div>
  );
}
