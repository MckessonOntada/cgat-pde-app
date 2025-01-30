import React, { useEffect } from 'react';
import styles from './assets/TherapyDetails.module.scss';
import { ReactComponent as IconClose } from '@src/assets/svg/closeIcon.svg';
import { ReactComponent as IconBinRed } from '@src/assets/svg/bin-red.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { useMutation, useQuery } from 'react-query';
import { Loader, Heading, Button } from '@mckesson/mcp-component-library';
import OrderService from '@src/api/commonService/OrderService';
import UserService from '@src/api/commonService/UserService';
import useSnackbar from '@src/hooks/useSnackbar';
import MaterialService from '@src/api/commonService/MaterialService';
import CommonUtils from '@src/util/CommonUtils';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { useNavigate } from 'react-router-dom';
import { PREVIEW_URL, ROUTE_CONFIG } from '@src/mfe/order-management/questionnaire/constants';

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
              refetch={refetch}
            />
          )}
        </div>
      )}
    </div>
  );
}

function DetailsPanel({
  details,
  handleSelect,
  onClose,
  therapyData,
  configurationData,
  showFooter,
  isMaterialConfiguration,
  refetch = { refetch }
}) {
  const { t } = useTranslate();
  const { showSnackbar } = useSnackbar();

  const OnDelinkQuestionnaireClick = (id) => {
    const payload = {
      questionnaireId: id,
      materialNumber: details.therapy.materialNumber
    };
    delinkQuestionnaire(payload);
  };

  const { mutate: delinkQuestionnaire, isLoading: isDelinkLoading } = useMutation(
    async (payload) => {
      const apiUrl = `${ApiRoutes.QUESTIONNAIRE()}/configure/deLink?type=Material`;
      const res = await HttpResourceService.callRest(apiUrl, httpVerb.DELETE, payload);
      return res;
    },
    {
      onSuccess: (response) => {
        showSnackbar({ description: t('manageMaterial.drawer.delink.success'), type: 'success' });
        if (details?.questionnaires?.length === 1) {
          refetch();
        } else {
          details.questionnaires = details.questionnaires.filter((item) => item.id !== response.data.questionnaireId);
        }
      },
      onError: (error) => {
        showSnackbar({ description: t('manageMaterial.drawer.delink.error'), type: 'error' });
      }
    }
  );

  const renderDetails = (fields, details) =>
    fields.map(({ label, value }) => (
      <DetailItem key={label} label={t(label)} value={isMaterialConfiguration ? details.therapy[value] : details[value] || '-'} />
    ));

  const renderQuestionnaire = (details, section) =>
    details.questionnaires.map((questionnaire) => (
      <QuestionnaireItem
        key={questionnaire.id}
        section={section}
        templateName={questionnaire.templateName}
        onDelete={() => OnDelinkQuestionnaireClick(questionnaire.id)}
      />
    ));

  const renderConfiguration = (fields, details) =>
    fields.map(({ label, value, display = true, translation = true }) => (
      <ConfigItem
        key={label}
        label={translation ? t(label) : label}
        value={isMaterialConfiguration ? details.materialConfig[value] : details[value] || '-'}
        display={display}
      />
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
              {!section.questionnaire && (
                <>
                  <div className={styles.configurationHeader}>
                    <Heading as="h4">{t(section.sectionHeading)}</Heading>
                    <div className={styles.actions}>
                      {section.actions?.map((action) =>
                        action.icon === 'delete' ? (
                          <IconBinRed key={action.id} role="button" onClick={() => console.log('Delete Clicked')} />
                        ) : (
                          <Button key={action.id} textButton onClick={() => console.log(`${action.id} Clicked`)}>
                            {t(action.label)}
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                  <div>{renderConfiguration(section.sectionData, details)}</div>
                </>
              )}
              {section.questionnaire && <div> {renderQuestionnaire(details, section)}</div>}
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
        <div className={styles.rightContentAction}>{typeof value === 'boolean' ? (value ? 'YES' : 'NO') : value}</div>
      </div>
    </>
  );
}

function QuestionnaireItem({ templateName, section, onDelete }) {
  
  const navigate = useNavigate();
  const { t } = useTranslate();
  return (
    <>
      <div className={styles.configurationHeader}>
        <Heading as="h4">{t(section.sectionHeading)}</Heading>
        <div className={styles.actions}>
          {section.actions?.map((action) => (
            <Button key={action.id} textButton onClick={() => navigate(PREVIEW_URL, { state: { isMaterial: true } })}>
              {t(action.label)}
            </Button>
          ))}
        </div>
      </div>
      <div className={styles.detailItem}>
        <div className={styles.leftContentBold}>{templateName}</div>
        <div className={styles.rightContentAction} onClick={onDelete}>
          <IconBinRed className={styles.deleteIcon} />
        </div>
      </div>
    </>
  );
}

export default TherapyDetails;
