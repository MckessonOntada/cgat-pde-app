import React from 'react';
import { Badge } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import './Configure.scss';

function ConfigurationHeader({ fieldName, format, properties = {} }) {
  const { t } = useTranslate();

  const displayed = properties.displayOnForm;
  const mandatory = properties.mandatoryField;

  return (
    <div>
      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 header-section">
        <div className="header-item">
          <p>{t('manageSPMaterial.configuration.header.fieldName')}</p>
          <span>{fieldName}</span>
        </div>

        <div className="header-item">
          <p>{t('manageSPMaterial.configuration.header.status')}</p>
          <span>
            {displayed ? (
              <Badge size="md" text={t('manageSPMaterial.configuration.header.badge.displayed')} type="success" />
            ) : (
              <Badge size="md" text={t('manageSPMaterial.configuration.header.badge.hidden')} type="info" />
            )}
            {mandatory && <Badge size="md" text={t('manageSPMaterial.configuration.header.badge.mandatory')} type="warning" />}
          </span>
        </div>

        <div className="header-item">
          <p>{t('manageSPMaterial.configuration.header.format')}</p>
          <span>{format || '-'}</span>
        </div>
      </div>
    </div>
  );
}

export default ConfigurationHeader;
