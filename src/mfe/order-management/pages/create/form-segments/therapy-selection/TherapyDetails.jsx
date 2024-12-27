import React from 'react';
import styles from './TherapyDetails.module.scss';
import { ReactComponent as IconClose } from '@src/assets/svg/closeIcon.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { useQuery } from 'react-query';
import { Loader, Heading, Button } from '@mckesson/mcp-component-library';
import OrderService from '@src/api/commonService/OrderService';

function TherapyDetails({ therapyId, onClose, onSelect }) {
  const { t } = useTranslate();
  const { isLoading, data: therapyDetails = {} } = useQuery({
    queryKey: ['order', 'therapy', therapyId],
    queryFn: async () => OrderService.getTherapyDetailsById(therapyId),
    enabled: Boolean(therapyId),
    refetchOnWindowFocus: false
  });
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
          {therapyDetails && <DetailsPanel details={therapyDetails} handleSelect={handleSelect} onClose={onClose} />}
        </div>
      )}
    </div>
  );
}

function DetailsPanel({ details, handleSelect, onClose }) {
  const { t } = useTranslate();
  const renderDetails = (fields) => fields.map(({ label, value }) => <DetailItem key={label} label={t(label)} value={value} />);

  const generalDetails = [
    { label: 'labels.therapy.materialNumber', value: details.materialNumber },
    { label: 'labels.therapy.materialDescription', value: details.materialDescription },
    { label: 'labels.therapy.ndc', value: details.ndc },
    { label: 'labels.therapy.strength', value: details.strength },
    { label: 'labels.therapy.dosage', value: details.dosage },
    { label: 'labels.therapy.sellingUnitCode', value: details.sellingUnitCode },
    { label: 'labels.therapy.vendorName', value: details.vendorName },
    { label: 'labels.therapy.upcCode', value: details.upcCode },
    { label: 'labels.therapy.dropshipIndicator', value: details.dropshipIndicator },
    { label: 'labels.therapy.baseUnitOfMeasure', value: details.baseUnitOfMeasure },
    { label: 'labels.therapy.cgatIdentifier', value: details.cgatIdentifier },
    { label: 'labels.therapy.productLevelPricing', value: details.productLevelPricing },
    { label: 'labels.therapy.minimumOrderQuantity', value: details.minimumOrderQuantity }
  ];

  const configurationDetails = [
    { label: 'labels.therapy.slotNumber', value: details.slotNumber },
    { label: 'labels.therapy.patientConsent', value: details.patientConsent }
  ];

  return (
    <div className={styles.detailsPanel}>
      <div>
        <Heading as="h4">{t('labels.therapy.generalDetails')}</Heading>
        <div>{renderDetails(generalDetails)}</div>
      </div>
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
