import React, { useEffect } from 'react';
import styles from './assets/TherapyDetails.module.scss';
import { ReactComponent as IconClose } from '@src/assets/svg/closeIcon.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { useQuery } from 'react-query';
import { Loader, Heading, Button } from '@mckesson/mcp-component-library';
import OrderService from '@src/api/commonService/OrderService';
import UserService from '@src/api/commonService/UserService';
import useSnackbar from '@src/hooks/useSnackbar';

function TherapyDetails({ therapyId, onClose, onSelect, therapyData, showButton = true, useUserService = false }) {
  const { t } = useTranslate();
  const { showSnackbar } = useSnackbar();
  const { isLoading, data: therapyDetails = {}, error } = useQuery({
    queryKey: ['order', 'therapy', therapyId],
    queryFn: async () => (useUserService ? UserService.getTherapyById(therapyId) : OrderService.getTherapyDetailsById(therapyId)),
    enabled: Boolean(therapyId),
    refetchOnWindowFocus: false
  });
  
  useEffect(() => {
    if (error) {
      onClose();
      showSnackbar({description: 'Error fetching Therapy Details', type: 'error'});
    }
  }, [error]);

  const handleSelect = () => {
    if (onSelect && therapyDetails) {
      onSelect(therapyDetails);
      onClose();
    }
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Heading as="h2">{t('labels.therapyDetails')}</Heading>
        <button onClick={onClose}>
          <IconClose />
        </button>
      </div>
      {isLoading ? (
        <Loader variant="circular" />
      ) : (
        <div className={styles.body}>
          {therapyDetails && (
            <DetailsPanel
              details={therapyDetails}
              handleSelect={handleSelect}
              onClose={onClose}
              therapyData={therapyData}
              showButton={showButton}
            />
          )}
        </div>
      )}
    </div>
  );
}

function DetailsPanel({ details, handleSelect, onClose, therapyData, showButton }) {
  const { t } = useTranslate();
  const renderDetails = (fields, details) =>
    fields.map(({ label, value }) => <DetailItem key={label} label={t(label)} value={details[value] || '-'} />);

  const configurationDetails = [
    { label: 'labels.therapy.slotNumber', value: details.slotNumber },
    { label: 'labels.therapy.patientConsent', value: details.patientConsent }
  ];

  return (
    <div className={styles.detailsPanel}>
      {therapyData?.map((section, index) => (
        <div key={index}>
          <Heading as="h4">{t(section.sectionHeading)}</Heading>
          <div>{renderDetails(section.sectionData, details)}</div>
        </div>
      ))}
      {showButton && (
        <div className={styles.controls}>
          <Button label={t('captions.btnCancel')} onClick={onClose} variant="secondary" size="md" aria-label={t('captions.cancel')} />
          <Button
            label={t('captions.btnSelecttherapy')}
            onClick={handleSelect}
            variant="primary"
            size="md"
            aria-label={t('captions.selectAccount')}
          />
        </div>
      )}
      {/* <div>
        <div className="row-space-between-center">
          <Heading as="h4">{t('labels.therapy.configuration')}</Heading>
          <Link className="MCP-table-link">{t('labels.therapy.preview')}</Link>
        </div>
        <div>{renderDetails(configurationDetails)}</div>
      </div> */}
    </div>
  );
}

function DetailItem({ label, value }) {
  const { t } = useTranslate();
  return (
    <>
      <div className={styles.detailItem}>
        <p className="fieldName">{label}</p>
        <p className="fieldValue">{value}</p>
      </div>
    </>
  );
}

export default TherapyDetails;
