import React from 'react';
import styles from '../Summary.module.scss';
import ModuleHeader from '@src/components/module-header';
import { Button, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as IconEditField } from '@src/assets/svg/edit-field.svg';
import DetailSegment from '@src/components/DetailSegment';
import { ORDER_STAGES } from '../../Constants';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils, { getAddress, getFullName } from '@src/util/CommonUtils';

export default function ProviderDetailsSegment({ provider, showControls, onEdit }) {
  const { t } = useTranslate();

  if (!provider) return null;

  const providerName = provider?.name ? getFullName(provider?.name) : '-';
  const providerAddress = provider?.address ? getAddress(provider?.address) : '-';
  const phone = provider?.phone ? CommonUtils.formatPhoneNumber(provider?.phone) : '-';
  const tin = provider?.tin ? CommonUtils.formatTIN(provider?.tin) : '-';
  const dea = provider?.dea ?? '-';
  const npi = provider?.npi ?? '-';

  return (
    <div className="MCP-CardContainer">
      <ModuleHeader
        className={styles.panelHeader}
        heading={<Heading as="h3">{t('labels.providerDetails')}</Heading>}
        controls={
          showControls && (
            <Button size="md" variant="tertiary" onClick={() => onEdit(ORDER_STAGES.PATIENT_DETAILS)} Icon={IconEditField}>
              {t('captions.btnEdit')}
            </Button>
          )
        }
      />
      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-6">
        <DetailSegment label={t('labels.name')} value={providerName} />
        <DetailSegment label={t('labels.address')} value={providerAddress} />
        <DetailSegment label={t('labels.phoneNumber')} value={phone} />
        <DetailSegment label={t('provider.tinNumber')} value={tin} />
        <DetailSegment label={t('labels.deaNumber')} value={dea} />
        <DetailSegment label={t('labels.npiNumber')} value={npi} />
      </div>
    </div>
  );
}
