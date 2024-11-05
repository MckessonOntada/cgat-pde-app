import { DropdownMenu } from '@mckesson/mcp-component-library';
import React, { useState, useEffect } from 'react';
import './index.scss';
import { useTranslate  } from '../../../../translations/useTranslation';

export default function Actions({ status, row, onToggleChange }) {
  const { t } = useTranslate();
  const [isChecked, setIsChecked] = useState(status === 'ACTIVE');

  useEffect(() => {
    setIsChecked(status === 'ACTIVE');
  }, [status]);

  const handleToggle = event => {
    const checked = event.target.checked;
    setIsChecked(checked);

    if (onToggleChange) {
      onToggleChange(row.id, checked);
    }

    alert(checked ? 'The switch is ON!' : 'The switch is OFF!');
  };

  const handleEdit = () => {
    alert('Handle Edit');
  };
  const handleDelete = () => {
    alert('Handle Delete');
  };
  const handleOtherAction = () => {
    alert('Handle Other Action');
  };

  return (
    <div className="actionsBox icon-align">
      <DropdownMenu
        // anchorEl={<VerticalIcon />}
        handleSelect={selectedItem => {
          if (selectedItem.value === 'Edit') {
            handleEdit();
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
            value: 'Edit',
          },
          {
            label: t('userManagement.table.action.delete'),
            value: 'Delete',
          },
          {
            label: t('userManagement.table.action.edit'),
            value: 'Inactivate',
          },
        ]}
      />
      {/* <FaPen className="actionEditIcon" />
      <Switch checked={isChecked} size="md" onChange={handleToggle} /> */}
    </div>
  );
}
