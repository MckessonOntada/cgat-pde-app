import React, { useEffect } from 'react';
import styles from './assets/TherapyDetails.module.scss';
import { ReactComponent as IconClose } from '@src/assets/svg/closeIcon.svg';
import { ReactComponent as IconBinRed } from '@src/assets/svg/bin-red.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { useQuery } from 'react-query';
import { Loader, Heading, Button } from '@mckesson/mcp-component-library';
import OrderService from '@src/api/commonService/OrderService';
import UserService from '@src/api/commonService/UserService';
import useSnackbar from '@src/hooks/useSnackbar';
import MaterialService from '@src/api/commonService/MaterialService';
import CommonUtils from '@src/util/CommonUtils';

function TherapyDetails({
  therapyId,
  onClose,
  onSelect,
  therapyData,
  configurationData,
  showFooter = true,
  useUserService = false,
  useMaterialService = false,
  isMaterialConfiguration = false
}) {
  const { t } = useTranslate();
  const { showSnackbar } = useSnackbar();
  const {
    isLoading,
    data: therapyDetails = {},
    error
  } = useQuery({
    queryKey: ['order', 'therapy', 'material', therapyId],
    queryFn: async () =>
      useMaterialService
        ? MaterialService.getMaterialConfigById(therapyId)
        : useUserService
        ? UserService.getTherapyById(therapyId)
        : OrderService.getTherapyDetailsById(therapyId),
    enabled: Boolean(therapyId),
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (error) {
      onClose();
      showSnackbar({ description: 'Error fetching Therapy Details', type: 'error' });
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
        <Heading as="h2">{!isMaterialConfiguration ? t('labels.therapyDetails') : t('manageMaterial.drawer.heading')}</Heading>
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
              configurationData={configurationData}
              showFooter={showFooter}
              isMaterialConfiguration
            />
          )}
        </div>
      )}
    </div>
  );
}

function DetailsPanel({ details, handleSelect, onClose, therapyData, configurationData, showFooter, isMaterialConfiguration }) {
  const { t } = useTranslate();

  const renderDetails = (fields, details) =>
    fields.map(({ label, value }) => (
      <DetailItem key={label} label={t(label)} value={isMaterialConfiguration ? details.therapy[value] : details[value] || '-'} />
    ));

  const renderConfiguration = (fields, details) =>
    fields.map(({ label, value }) => (
      <ConfigItem key={label} label={t(label)} value={isMaterialConfiguration ? details.materialConfig[value] : details[value] || '-'} />
    ));

  return (
    <div className={styles.detailsPanel}>
      <div className={styles.drawerBodyContent}>
        {therapyData?.map((section, index) => (
          <div key={index}>
            <Heading as="h4">{t(section.sectionHeading)}</Heading>
            <div>{renderDetails(section.sectionData, details)}</div>
          </div>
        ))}
        {isMaterialConfiguration &&
          configurationData?.map((section, index) => (
            <div key={index}>
              <div className={styles.configurationHeader}>
                <Heading as="h4">{t(section.sectionHeading)}</Heading>{' '}
                <Button textButton onClick={() => console.log('Preview Clicked')}>
                  {t('manageMaterial.drawer.configuration.preview')}
                </Button>
              </div>
              <div>{renderConfiguration(section.sectionData, details)}</div>
            </div>
          ))}
      </div>
      {showFooter && (
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
    </div>
  );
}

function DetailItem({ label, value }) {
  const { t } = useTranslate();
  return (
    <>
      <div className={styles.detailItem}>
        <p className={styles.leftContent}>{label}</p>
        <p className={styles.rightContent}>{value}</p>
      </div>
    </>
  );
}

function ConfigItem({ label, value, isAction = false }) {
  const { t } = useTranslate();
  return (
    <>
      <div className={styles.detailItem}>
        <div className={styles.leftContentBold}>{label}</div>
        <div className={styles.rightContentAction}>
          {typeof value === 'boolean' ? (
            value ? (
              'YES'
            ) : (
              'NO'
            )
          ) : CommonUtils.isNonEmptyString(value) ? (
            value
          ) : (
            <IconBinRed role={'button'} onClick={() => console.log('Delete Clicked')} />
          )}
        </div>
      </div>
    </>
  );
}

export default TherapyDetails;
