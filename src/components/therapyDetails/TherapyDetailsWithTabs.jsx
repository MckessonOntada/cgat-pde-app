import React, { useEffect, useState } from 'react';
import styles from './assets/TherapyDetails.module.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { useQuery } from 'react-query';
import { Loader, Heading, Button, TabList, IconButton, Tooltip } from '@mckesson/mcp-component-library';
import { ReactComponent as IconBinRed } from '@src/assets/svg/bin-red.svg';
import OrderService from '@src/api/commonService/OrderService';
import FloatingDrawer from '@src/components/floating-drawer';
import CommonUtils from '@src/util/CommonUtils';
import Alert from '../cgat-alert/Alert';
import {
  TherapyDetailsConstantsForBB,
  TherapyDetailsConstantsForSP
} from '@src/mfe/order-management/pages/create/form-segments/therapy-selection/assets/constants/TherapyDetailsConstants';
import { ConfigConstants } from '@src/mfe/core-config/system-admin/manage-material/assets/constants/MaterialConstants';
import AuthUtils from '@src/util/AuthUtils';
import MaterialService from '@src/api/commonService/MaterialService';
import { renderModal } from '@src/util/ModalUtil';
import QuestionnaireService from '@src/api/commonService/QuestionnaireService';
import { useNavigate } from 'react-router-dom';
import { PREVIEW_URL } from '@src/mfe/core-config/system-admin/manage-questionnaire/constants';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';

export const THERAPY_TABS = {
  BUY_AND_BILL: 'BUY_AND_BILL',
  SP: 'SPECIALITY_PHARMA'
};

function TherapyDetailsWithTabs({
  trade,
  channelType: _channelType,
  therapyId,
  therapy,
  onClose,
  onSelect,
  isDetailsByNdc = false,
  buyAndBillTherapyConstants = TherapyDetailsConstantsForBB(false),
  spTherapyConstants = TherapyDetailsConstantsForSP,
  showFooter = true,
  heading,
  isMaterialListing = false
}) {
  const channelType = _channelType ?? CHANNEL_TYPE.BUY_AND_BILL;
  const { t } = useTranslate();
  const hasDeleteConfigAccess = !AuthUtils.isCustomerCenter();
  const [therapyTabs, setTherapyTabs] = useState(() => {
    if (!therapyId) return [];

    const therapyTabs = therapyId.split(',').map((id, index) => {
      return {
        id: `details-by-therapy-id-${id}`,
        configName: id,
        isActiveTab: index === 0,
        sequence: index,
        labelForMobile: 'labels.tabs.submittedBuyAndBill'
      };
    });

    return therapyTabs;
  });
  const [selectedTab, setSelectedTab] = useState(null);
  const [isCardExpanded, setIsCardExpanded] = useState(true);
  const [therapyDetails, setTherapyDetails] = useState(null);
  const [configureDetails, setConfigureDetails] = useState(null);
  const [questionnaires, setQuestionnaires] = useState(null);
  const [alert, setAlert] = React.useState(null);

  const {
    data: details,
    isLoading,
    refetch,
    error
  } = useQuery({
    queryKey: ['therapyDetailsByTrade', trade],
    queryFn: async () => {
      if (isMaterialListing) {
        return OrderService.getTherapyDetailsByTradeName2(trade, channelType);
      } else if (isDetailsByNdc) {
        return OrderService.getTherapyDetailsByNDC(trade, channelType);
      } else {
        return OrderService.getTherapyDetailsByTradeName(trade, channelType);
      }
    },
    select: (data) => data.map(({ ndcNumber, ...rest }) => ({ ndc: ndcNumber, ndcNumber, ...rest })),
    onSuccess: (data) => {
      if (data && CommonUtils.isNonEmptyArray(data)) {
        let filteredData = data;
        if (therapy && therapy != trade) {
          filteredData = data.filter((item) => String(item.id) === String(therapy));
        }
        const therapyTabs = filteredData
          .sort((a, b) => a.id - b.id)
          .map((item, index) => ({
            id: `details-by-therapy-id-${item.id}`,
            key: item.id,
            therapyId: item.id,
            configName: item.materialDescription,
            isActiveTab: selectedTab ? selectedTab.therapyId === item.id : index === 0,
            sequence: item.id,
            labelForMobile: 'labels.tabs.submittedBuyAndBill'
          }));
        setTherapyTabs(therapyTabs);
        if (!selectedTab || !selectedTab.therapyId) {
          setSelectedTab(therapyTabs[0]);
        }

        const __therapyDetails = filteredData.find((d) => d.id === (!selectedTab ? therapyTabs[0].therapyId : selectedTab.therapyId));
        setTherapyDetails({ ...__therapyDetails });
      } else {
        setAlert({
          kind: 'info',
          description: 'No therapy details found for the selected trade.',
          showTitle: false,
          showCloseIcon: false
        });
      }
    },
    select: (data) => {
      if (isMaterialListing) {
        data = data.map(({ therapy, ...rest }) => ({ ...therapy, ...rest }));
      }
      return data;
    },
    onError: (err) => {
      setAlert({
        type: 'error',
        description: t('errors.default'),
        showTitle: false
      });
    },
    enabled: Boolean(trade),
    refetchOnWindowFocus: false
  });

  React.useEffect(() => {
    if (selectedTab && selectedTab.therapyId) {
      const currentTherapyDetails = details?.find((item) => item.id === selectedTab.therapyId);
      setTherapyDetails(currentTherapyDetails);
    }
  }, [selectedTab]);

  const handleExpandCard = (id) => {
    setIsCardExpanded((prevId) => (prevId === id ? null : id));
  };

  const handleSelect = () => {
    if (onSelect && therapyDetails) {
      therapyDetails.ndc = therapyDetails.ndcNumber;
      onSelect(therapyDetails);
      onClose();
    }
  };

  const handleOnTabChange = (selectedTab) => {
    const newTabs = therapyTabs.map((tab) => ({
      ...tab,
      isActiveTab: tab.therapyId === selectedTab.therapyId
    }));
    setTherapyTabs(newTabs);
    setSelectedTab(selectedTab);
  };

  const OnDelinkQuestionnaireClick = async (id, ndcNumber, channelType) => {
    const payload = {
      channelType: channelType,
      questionnaireId: id,
      materialOrNdcNumber: ndcNumber
    };
    renderModal({
      title: t('messages.header.confirmation'),
      bodyContent: (
        <div className="MCP-modal-body">
          <p>{t('messages.confirmation.delink')}</p>
        </div>
      ),
      footerActions: {
        cancel: {
          label: t('label.no')
        },
        confirm: {
          label: t('label.yes'),
          action: async () => {
            try {
              await QuestionnaireService.deLinkConfigureQuestionnaire('Material', payload);
              refetch();
            } catch (error) {
              setAlert({
                type: 'error',
                description: t('errors.default'),
                showTitle: false
              });
            }
          }
        }
      }
    });
  };

  const renderQuestionnaire = (details, section, hasDeleteConfigAccess) => {
    let showHeader = true;
    const isCrosswalked = details.isCrosswalked && details.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA;
    return details.questionnaires.map((questionnaire, index) => {
      const item = (
        <QuestionnaireItem
          key={`${questionnaire.id}-${index}`}
          section={section}
          templateName={questionnaire.templateName}
          onDelete={() =>
            OnDelinkQuestionnaireClick(
              questionnaire.id,
              details.channelType === CHANNEL_TYPE.BUY_AND_BILL ? details.ndcNumber : details.materialNumber,
              details.channelType
            )
          }
          showHeader={showHeader}
          questionnaire={details.questionnaires}
          hasDeleteConfigAccess={hasDeleteConfigAccess}
          isCrosswalked={isCrosswalked}
        />
      );
      showHeader = false;
      return item;
    });
  };

  const renderConfiguration = (fields, details) =>
    fields.map(({ label, value, display = true, translation = true }) => {
      const configValue = details?.materialConfig?.[value] || details?.[value];
      const displayValue = typeof configValue === 'boolean' ? (configValue ? 'YES' : 'NO') : configValue ?? '-';
      return <ConfigItem key={label} label={translation ? t(label) : label} value={displayValue || '-'} display={display} />;
    });

  const onDeleteConfig = async (actionId) => {
    if (actionId === 'delete-materialConfig') {
      renderModal({
        title: t('messages.header.confirmation'),
        bodyContent: (
          <div className="MCP-modal-body">
            <p>{t('messages.confirmation.deleteConfiguration')}</p>
          </div>
        ),
        footerActions: {
          cancel: {
            label: t('label.no')
          },
          confirm: {
            label: t('label.yes'),
            action: async () => {
              try {
                await MaterialService.deleteMaterialConfig(therapyDetails.materialConfig.ndcNumber);
                setAlert({
                  type: 'success',
                  description: t('manageMaterial.drawer.controls.apply.success'),
                  showTitle: false
                });

                refetch();
              } catch (error) {
                setAlert({
                  type: 'error',
                  description: t('errors.default'),
                  showTitle: false
                });
              }
            }
          }
        }
      });
    }
  };

  return (
    <FloatingDrawer
      open={true}
      anchor="right"
      onClose={onClose}
      heading={heading}
      bodyPadding="var(--spacing-03) 0px var(--spacing-16)"
      controls={
        showFooter && (
          <div className="controls">
            <Button label={t('captions.btnCancel')} onClick={onClose} variant="secondary" size="md" aria-label={t('captions.cancel')} />
            <Button label={t('captions.btnSelecttherapy')} onClick={handleSelect} variant="primary" size="md" aria-label={t('captions.selectAccount')} />
          </div>
        )
      }>
      <div className={styles.wrapper}>
        <div className="customTab" style={{ padding: '0px 16px' }}>
          {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className="customTab" style={{ padding: '0px 16px' }}>
          {((!isDetailsByNdc && channelType === CHANNEL_TYPE.BUY_AND_BILL) ||
            (isDetailsByNdc && therapyTabs.length > 1) ||
            (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA && therapyTabs.length > 1)) && (
            <TabList
              options={therapyTabs}
              alignment="left"
              onTabClick={handleOnTabChange}
              showShadow={false}
              variant={'text'}
              useAsButton={true}
              aria-label={t('controls.ariaLabels.orderTabList')}
            />
          )}
        </div>
        {isLoading ? (
          <Loader variant="circular" />
        ) : (
          <div className={`${styles.body}`}>
            {therapyDetails && (
              <DetailsPanel
                details={therapyDetails}
                handleSelect={handleSelect}
                onClose={onClose}
                therapyData={buyAndBillTherapyConstants}
                isDetailsByNdc={isDetailsByNdc}
                therapyTabs={therapyTabs}
              />
            )}
            <div className={styles.detailsPanel}>
              <div className={`${styles.drawerBodyContent} ${styles.bodyPadding} ${styles.cardToggleWrapper}`}>
                {ConfigConstants?.map((section, index) => (
                  <React.Fragment key={section.sectionHeading}>
                    {!section.questionnaire ? (
                      therapyDetails?.materialConfig ? (
                        <div key={section.sectionHeading}>
                          <div className={styles.configurationHeader}>
                            <div className={styles.sectionHeadingkey}>{t(section.sectionHeading)}</div>
                            <div className={styles.actions}>
                              {section.actions?.map(
                                (action) => hasDeleteConfigAccess && <IconBinRed key={action.id} role="button" onClick={() => onDeleteConfig(action.id)} />
                              )}
                            </div>
                          </div>
                          <div>{renderConfiguration(section.sectionData, therapyDetails.materialConfig)}</div>
                        </div>
                      ) : null
                    ) : therapyDetails?.questionnaires?.length > 0 ? (
                      <div> {renderQuestionnaire(therapyDetails, section, hasDeleteConfigAccess)}</div>
                    ) : null}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </FloatingDrawer>
  );
}

function DetailsPanel({ details, therapyData, isDetailsByNdc, therapyTabs }) {
  const { t } = useTranslate();
  const renderDetails = (fields, details) =>
    fields.map(({ label, value }) => (
      <DetailItem
        key={label}
        label={t(label)}
        value={
          details.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA && (value === 'dropshipIndicator' || value === 'sellingUnitCode') ? 'NA' : details[value] || '-'
        }
      />
    ));
  return (
    <div className={styles.detailsPanel}>
      <div className={`${styles.drawerBodyContent} ${styles.bodyPadding}`}>
        {therapyData?.map((section, index) => (
          <div key={index}>
            {((!isDetailsByNdc && details.channelType === CHANNEL_TYPE.BUY_AND_BILL) ||
              (isDetailsByNdc && therapyTabs.length > 1) ||
              (details.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA && therapyTabs.length > 1)) && (
              <Heading as="h3" className={styles.details}>
                {t(section.sectionHeading)}
              </Heading>
            )}
            <div>{renderDetails(section.sectionData, details)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  const { t } = useTranslate();
  return (
    <>
      <div className={styles.detailItem}>
        <p className={styles.leftContent}>{label}</p>
        <p className={styles.rightContent}>{value || '-'}</p>
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
        <div className={styles.rightContentAction}>{typeof value === 'boolean' ? (value ? 'YES' : 'NO') : value}</div>
      </div>
    </>
  );
}

function QuestionnaireItem({ templateName, section, onDelete, showHeader, questionnaire, hasDeleteConfigAccess = true, isCrosswalked }) {
  const navigate = useNavigate();
  const { t } = useTranslate();

  return (
    <>
      {showHeader && (
        <div className={styles.configurationHeader}>
          <div className={styles.sectionHeadingkey}>{t(section.sectionHeading)}</div>
          <div className={styles.actions}>
            {section.actions?.map((action) => (
              <Button key={action.id} size="md" textButton onClick={() => navigate(PREVIEW_URL, { state: { isMaterial: true, questionnaire: questionnaire } })}>
                {t(action.label)}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.detailItem}>
        <div className={styles.leftContentBold}>{templateName}</div>
        {hasDeleteConfigAccess &&
          (!isCrosswalked ? (
            <div className={styles.rightContentAction} onClick={onDelete}>
              <IconBinRed className={styles.deleteIcon} />
            </div>
          ) : (
            <Tooltip body={t('unlink.tooltip.disabledtext')}>
              <div className={styles.rightContentAction} style={{ opacity: 0.5 }}>
                <IconBinRed className={styles.deleteIcon} />
              </div>
            </Tooltip>
          ))}
      </div>
    </>
  );
}

export default TherapyDetailsWithTabs;
