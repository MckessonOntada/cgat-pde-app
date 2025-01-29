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
    error,
    refetch
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

  const handleDeleteConfig = async (actionId) => {
    if (actionId === 'delete-materialConfig') {
      try {
        await MaterialService.deleteMaterialConfig(therapyId);
        showSnackbar({ description: t('manageMaterial.drawer.controls.apply.success'), type: 'success' });
        refetch();
      } catch (error) {
        showSnackbar({ description: t('manageMaterial.drawer.controls.apply.error'), type: 'error' });
      }
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
              isMaterialConfiguration={isMaterialConfiguration}
              onDeleteConfig={handleDeleteConfig}
            />
          )}
        </div>
      )}
    </div>
  );
}

function DetailsPanel({ details, handleSelect, onClose, therapyData, configurationData, showFooter, isMaterialConfiguration, onDeleteConfig }) {
  const { t } = useTranslate();

  const renderDetails = (fields, details) =>
    fields.map(({ label, value }) => (
      <DetailItem key={label} label={t(label)} value={isMaterialConfiguration ? details.therapy[value] : details[value] || '-'} />
    ));

  const renderConfiguration = (fields, details) =>
    fields.map(({ label, value, display = true, translation = true }) => {
      const configValue = details?.materialConfig?.[value];
      const displayValue = typeof configValue === 'boolean' ? (configValue ? 'YES' : 'NO') : configValue ?? '-';
      return (
        <ConfigItem
          key={label}
          label={translation ? t(label) : label}
          value={isMaterialConfiguration ? displayValue : details[value] || '-'}
          display={display}
        />
      );
    });

  return (
    <div className={styles.detailsPanel}>
      <div className={styles.drawerBodyContent}>
        {therapyData?.map((section, index) => (
          <div key={index}>
            <Heading as="h3">{t(section.sectionHeading)}</Heading>
            <div>{renderDetails(section.sectionData, details)}</div>
          </div>
        ))}
        {isMaterialConfiguration &&
          configurationData?.map((section, index) => (
            <div key={index}>
              <div className={styles.configurationHeader}>
                <Heading as="h3">{t(section.sectionHeading)}</Heading>
                <div className={styles.actions}>
                  {section.actions?.map((action) =>
                    action.icon === 'delete' ? (
                      <IconBinRed key={action.id} role="button" onClick={() => onDeleteConfig(action.id)} />
                    ) : (
                      <Button key={action.id} textButton onClick={() => console.log(`${action.id} Clicked`)}>
                        {t(action.label)}
                      </Button>
                    )
                  )}
                </div>
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

function ConfigItem({ label, value, display = true }) {
  const { t } = useTranslate();
  if (!display) return null;

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
          ) : value}
        </div>
      </div>
    </>
  );
}

export default TherapyDetails;
