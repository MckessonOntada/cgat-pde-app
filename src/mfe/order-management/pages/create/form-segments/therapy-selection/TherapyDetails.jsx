import React from 'react';
import styles from './TherapyDetails.module.scss';
import { ReactComponent as IconClose } from '@src/assets/svg/closeIcon.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { useQuery } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import { Loader, Heading } from '@mckesson/mcp-component-library';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import AuthUtils from '@src/util/AuthUtils';
import { Link } from 'react-router-dom';

function TherapyDetails({ therapyId, onClose }) {
  const { t } = useTranslate();
  const { isLoading, data: therapyDetails = {} } = useQuery({
    queryKey: ['order', 'therapy', therapyId],
    queryFn: async () => {
      const userId = AuthUtils.getUserId();
      const url = `${ApiRoutes.ORDER(userId)}/therapies/${therapyId}`;
      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      if (res.data) {
        return res.data;
      }
      return {};
    },
    refetchOnWindowFocus: false
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Heading as="h2">{t('labels.therapyDetails')}</Heading>
        <button onClick={onClose}>
          <IconClose />
        </button>
      </div>
      {isLoading ? <Loader variant="circular" /> : <div className={styles.body}>{therapyDetails && <DetailsPanel details={therapyDetails} />}</div>}
    </div>
  );
}

function DetailsPanel(props) {
  const { details } = props;
  const { t } = useTranslate();
  console.log(details);
  return (
    <div className={styles.detailsPanel}>
      <Heading as={'h4'}>Details</Heading>

      <div>
        <div className={styles.detailItem}>
          <p className={'fieldName'}>{t('labels.therapy.materialNumber')}</p>
          <p className={'fieldValue'}>{details.materialNumber}</p>
        </div>
        <div className={styles.detailItem}>
          <p className={'fieldName'}>{t('labels.therapy.materialDescription')}</p>
          <p className={'fieldValue'}>{details.materialDescription}</p>
        </div>
        <div className={styles.detailItem}>
          <p className={'fieldName'}>{t('labels.therapy.ndc')}</p>
          <p className={'fieldValue'}>{details.ndc}</p>
        </div>
        <div className={styles.detailItem}>
          <p className={'fieldName'}>{t('labels.therapy.strength')}</p>
          <p className={'fieldValue'}>{details.strength}</p>
        </div>
        <div className={styles.detailItem}>
          <p className={'fieldName'}>{t('labels.therapy.dosage')}</p>
          <p className={'fieldValue'}>{details.dosage}</p>
        </div>
        <div className={styles.detailItem}>
          <p className={'fieldName'}>{t('labels.therapy.sellingUnitCode')}</p>
          <p className={'fieldValue'}>{details.sellingUnitCode}</p>
        </div>
        <div className={styles.detailItem}>
          <p className={'fieldName'}>{t('labels.therapy.vendorName')}</p>
          <p className={'fieldValue'}>{details.vendorName}</p>
        </div>
        <div className={styles.detailItem}>
          <p className={'fieldName'}>{t('labels.therapy.upcCode')}</p>
          <p className={'fieldValue'}>{details.upcCode}</p>
        </div>
        <div className={styles.detailItem}>
          <p className={'fieldName'}>{t('labels.therapy.dropshipIndicator')}</p>
          <p className={'fieldValue'}>{details.dropshipIndicator}</p>
        </div>
        <div className={styles.detailItem}>
          <p className={'fieldName'}>{t('labels.therapy.baseUnitOfMeasure')}</p>
          <p className={'fieldValue'}>{details.baseUnitOfMeasure}</p>
        </div>
        <div className={styles.detailItem}>
          <p className={'fieldName'}>{t('labels.therapy.cgatIdentifier')}</p>
          <p className={'fieldValue'}>{details.cgatIdentifier}</p>
        </div>
        <div className={styles.detailItem}>
          <p className={'fieldName'}>{t('labels.therapy.productLevelPricing')}</p>
          <p className={'fieldValue'}>{details.productLevelPricing}</p>
        </div>
        <div className={styles.detailItem}>
          <p className={'fieldName'}>{t('labels.therapy.minimumOrderQuantity')}</p>
          <p className={'fieldValue'}>{details.minimumOrderQuantity}</p>
        </div>
      </div>

      <div>
        <div className="row-space-between-center">
          <Heading as={'h4'}>Configuraion</Heading>
          <Link className="MCP-table-link">Preview</Link>
        </div>
        <div className={styles.detailItem}>
          <p className={'fieldName'}>{t('labels.therapy.slotNumber')}</p>
          <p className={'fieldValue'}>{details.slotNumber}</p>
        </div>
        <div className={styles.detailItem}>
          <p className={'fieldName'}>{t('labels.therapy.patientConsent')}</p>
          <p className={'fieldValue'}>{details.patientConsent}</p>
        </div>
      </div>
    </div>
  );
}

export default TherapyDetails;
