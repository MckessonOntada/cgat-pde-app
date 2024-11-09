import { IconButton, Switch } from '@mckesson/mcp-component-library';
import React, { useState, useEffect } from 'react';
import { Label } from '@mckesson/mcp-component-library';
import view from '@src/assets/image/view.svg';
import { useTranslate } from '@src/translations/useTranslation';
import './index.scss';

export default function Actions() {
  const { t } = useTranslate();
  return (
    <div className="actionsBox">
      <img src={view} />
      <Label className="view-label">{t('orgManagement.table.action.view')}</Label>
    </div>
  );
}
