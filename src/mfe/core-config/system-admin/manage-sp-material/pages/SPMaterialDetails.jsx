import React, { useEffect } from 'react';
import FloatingDrawer from '@src/components/floating-drawer';
import { Loader, Tooltip } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import '../manageSPMaterial.scss';
import { useMutation, useQuery } from 'react-query';
import MaterialService from '@src/api/commonService/MaterialService';
import AuthUtils from '@src/util/AuthUtils';
import QuestionnaireService from '@src/api/commonService/QuestionnaireService';
import SPCatalogService from '@src/api/commonService/SPCatalogService';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import { useNavigate } from 'react-router-dom';
import { renderModal } from '@src/util/ModalUtil';
import { PREVIEW_URL } from '../../manage-questionnaire/constants';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';
import CommonUtils from '@src/util/CommonUtils';
import { SPMaterialConfigConstants } from '../../manage-material/assets/constants/MaterialConstants';

export const SPMaterialDetailsConstants = [
  {
    sectionHeading: 'Details',
    sectionData: [
      { label: 'labels.therapyId', value: 'displayMaterialNumber' },
      { label: 'labels.therapy', value: 'tradeName' },
      { label: 'labels.therapyDescription', value: 'materialDescription' },
      { label: 'labels.genericName', value: 'genericName' },
      { label: 'labels.therapy.ndc', value: 'ndcNumber' },
      { label: 'labels.manufacturer', value: 'manufacturerName' },
      { label: 'labels.therapy.Formulation', value: 'Formulation' },
      { label: 'labels.therapy.dosage', value: 'dosage' },
      { label: 'labels.therapy.baseUnitOfMeasure', value: 'baseUnitOfMeasure' }
    ]
  }
];

export const SPCatalogDetailsConstants = [
  {
    sectionHeading: 'Details',
    sectionData: [
      { label: 'manageSPMaterial.drawer.details.body.id', value: 'sapMaterial' },
      { label: 'manageSPMaterial.drawer.details.body.productName', value: 'materialDescriptionInLanguageEn' },
      { label: 'manageSPMaterial.drawer.details.body.siteName', value: 'siteName' },
      { label: 'manageSPMaterial.drawer.details.body.NDC', value: 'ndc' }
    ]
  }
];

function SPMaterialDetails({ openSPMaterialDetails, setOpenSPMaterialDetails, viewSPMaterial, isSPCatalog = false, sendNotification, isCrosswalk = false }) {
  const { t } = useTranslate();
  const isEnableDelete = !AuthUtils.isCustomerCenter() && !AuthUtils.isTreatmentCentreExecutive();
  const navigate = useNavigate();
  const requestParams = {
    channelType: 'SPECIALITY_PHARMA'
  };
  const {
    isLoading,
    isError,
    data: MaterialData,
    refetch
  } = useQuery({
    queryKey: ['SPMaterial', viewSPMaterial?.sapMaterial || viewSPMaterial?.spProductId || viewSPMaterial?.materialNumber, openSPMaterialDetails],
    queryFn: async () => {
      const result = await MaterialService.getSPMaterialById(
        viewSPMaterial?.sapMaterial || viewSPMaterial?.spProductId || viewSPMaterial?.materialNumber,
        requestParams
      );
      return result;
    },
    enabled: !!viewSPMaterial && viewSPMaterial?.id && !isSPCatalog ? true : false,
    select: (result) => {
      const { therapy, ...rest } = result;
      if (therapy.materialNumber) {
        therapy.displayMaterialNumber = CommonUtils.removeLeadingZeros(therapy.materialNumber);
      }
      return {
        ...rest,
        therapy
      };
    },
    refetchOnWindowFocus: false
  });

  const requestSPCatalogParams = () => {
    return {
      materialId: viewSPMaterial.sapMaterial,
      variant: viewSPMaterial.variant || '',
      shipToAccount: viewSPMaterial.shipToCustomer,
      soldToAccount: viewSPMaterial.soldToCustomer,
      channelType: 'SPECIALITY_PHARMA'
    };
  };
  const {
    isLoading: isSPCatalogDataLoading,
    isError: isSPCatalogError,
    data: SPCatalogData,
    refetch: refetchSPCatalogData
  } = useQuery({
    queryKey: ['SPMaterial', viewSPMaterial],
    queryFn: async () => {
      const result = await SPCatalogService.getSPProductDetailsByMN(requestSPCatalogParams);
      return result;
    },
    enabled: !!viewSPMaterial && viewSPMaterial?.id && isSPCatalog ? true : false,

    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (openSPMaterialDetails && isSPCatalog) {
      refetchSPCatalogData();
    }
  }, [openSPMaterialDetails]);

  const handleCloseDrawer = () => {
    setOpenSPMaterialDetails((state) => !state);
  };

  const OnDeleteClick = (id, actionId) => {
    const payload = {
      questionnaireId: id,
      materialOrNdcNumber: viewSPMaterial.materialNumber,
      channelType: CHANNEL_TYPE.SPECIALTY_PHARMA
    };
    const catalogPayload = {
      questionnaireId: id,
      catalogId: {
        sapMaterial: viewSPMaterial.sapMaterial,
        soldToCustomer: viewSPMaterial.soldToCustomer,
        shipToCustomer: viewSPMaterial.shipToCustomer,
        variant: viewSPMaterial.variant || ''
      },
      channelType: CHANNEL_TYPE.SPECIALTY_PHARMA
    };
    renderModal({
      title: t('messages.header.confirmation'),
      bodyContent: (
        <div className="MCP-modal-body">
          <p>{t(actionId === 'questionnaire' ? 'messages.confirmation.delink' : 'messages.confirmation.deleteConfiguration')}</p>
        </div>
      ),
      footerActions: {
        cancel: {
          label: t('label.no')
        },
        confirm: {
          label: t('label.yes'),
          action: () => {
            if (actionId === 'questionnaire') {
              delinkQuestionnaire(isSPCatalog ? catalogPayload : payload);
            } else if (actionId === 'config') {
              deleteConfiguration(requestSPCatalogParams);
            } else if (actionId === 'materialConfig') {
              deleteMaterialConfiguration(id);
            }
          }
        }
      }
    });
  };

  const { mutate: delinkQuestionnaire, isLoading: isDelinkLoading } = useMutation(
    async (payload) => {
      await QuestionnaireService.deLinkConfigureQuestionnaire(isSPCatalog ? 'Catalog' : 'Material', payload);
    },
    {
      onSuccess: (response) => {
        isSPCatalog ? refetchSPCatalogData() : refetch();
        sendNotification({
          type: 'success',
          description: t('ManageCatalog.delink.success')
        });
      },
      onError: (error) => {
        sendNotification({
          type: 'error',
          description: t('errors.default')
        });
      }
    }
  );

  const { mutate: deleteConfiguration, isLoading: isDeleteLoading } = useMutation(
    async (payload) => {
      await SPCatalogService.deleteConfigurationsForSPCatalogs(payload);
    },
    {
      onSuccess: (response) => {
        setOpenSPMaterialDetails(false);
        isSPCatalog ? refetchSPCatalogData() : refetch();
        sendNotification({
          type: 'success',
          description: t('ManageCatalog.configure.success')
        });
      },
      onError: (error) => {
        setOpenSPMaterialDetails(false);
        sendNotification({
          type: 'error',
          description: t('errors.default')
        });
      }
    }
  );

  const { mutate: deleteMaterialConfiguration, isLoading: isDeleteMaterialConfigurationLoading } = useMutation(
    async (id) => {
      await MaterialService.deleteSPMaterialConfig(id);
    },
    {
      onSuccess: (response) => {
        setOpenSPMaterialDetails(false);
        refetch();
        sendNotification({
          type: 'success',
          description: t('ManageCatalog.configure.success')
        });
      },
      onError: (error) => {
        setOpenSPMaterialDetails(true);
        sendNotification({
          type: 'error',
          description: t('errors.default')
        });
      }
    }
  );

  if (isLoading) {
    return <Loader type={'screen'} />;
  }
  const data = isSPCatalog ? SPCatalogData : MaterialData;
  const renderDetails = (constants, dataSource, isCrosswalk) => {
    return constants.map((item, index) => (
      <React.Fragment key={index}>
        <div className="details-ul">
          {item.sectionData.map((subItem, subIndex) => {
            let value;
            if (subItem.value === 'siteName') {
              value = (isSPCatalog ? data?.siteName : data?.[dataSource]?.siteName) || '-';
            } else if (isCrosswalk && (subItem.value === 'dropshipIndicator' || subItem.value === 'sellingUnitCode')) {
              value = 'NA';
            } else if (subItem.value === 'dosage') {
              value = `${data.therapy.strength || ''} ${data.therapy.dosage || ''}`.trim();
            } else if (subItem.value === 'genericName') {
              value = data.therapy.genericName ? data.therapy.genericName.toUpperCase() : '-';
            } else {
              const __value = data?.[dataSource]?.[subItem.value];
              value = data?.[dataSource]?.[subItem.value] ?? (isCrosswalk ? '-' : 'NA');
            }
            return (
              <div className="details-li" key={subIndex}>
                <div className="details-key">{t(`${subItem.label}`)}</div>
                <div className="details-value">{value}</div>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    ));
  };

  const renderConfiguration = (constants, dataSource) =>
    constants.map(({ label, value, display = true }) => {
      const configValue = dataSource?.[value];
      const displayValue = typeof configValue === 'boolean' ? (configValue ? 'YES' : 'NO') : configValue ?? '-';
      return <ConfigItem key={label} label={t(label)} value={displayValue || '-'} display={display} />;
    });

  function ConfigItem({ label, value, display = true }) {
    const { t } = useTranslate();
    if (!display) return null;
    return (
      <div className="details-li">
        <div className="leftContentBold">{label}</div>
        <div>{typeof value === 'boolean' ? (value ? 'YES' : 'NO') : value}</div>
      </div>
    );
  }

  const isCrosswalked = data && data?.therapy?.isCrosswalked;
  const questionnaires = data?.questionnaires;
  return (
    <React.Fragment>
      {data && (
        <FloatingDrawer open={openSPMaterialDetails} anchor="right" onClose={handleCloseDrawer} heading={t('manageMaterial.drawer.details.heading')}>
          <div className="details-main-wrapper">
            <div className={'details-body'}>
              {!isSPCatalog
                ? renderDetails(SPMaterialDetailsConstants, 'therapy', isCrosswalk)
                : renderDetails(SPCatalogDetailsConstants, 'catalogPrice', false)}
              {data?.spTherapyConfig && (
                <>
                  <div className="configure-li">
                    {SPMaterialConfigConstants?.filter((section) => !section.questionnaire).map((section, index) => (
                      <React.Fragment key={section.sectionHeading}>
                        <div className="details-key">{t(section.sectionHeading)}</div>
                        <div className="details-value">
                          {section.actions?.map(
                            (action) =>
                              isEnableDelete && (
                                <div onClick={() => OnDeleteClick(data?.therapy.materialNumber, 'materialConfig')}>
                                  <DeleteIcon />
                                </div>
                              )
                          )}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="details-ul">
                    {renderConfiguration(SPMaterialConfigConstants.find((section) => section.questionnaire === false)?.sectionData, data?.spTherapyConfig)}
                  </div>
                </>
              )}
              {data?.catalogConfiguration && (
                <div className="configure-li">
                  <div className="details-key">{t('ManageCatalog.Configurations')}</div>
                  <div className="details-value">
                    <div onClick={() => navigate('../sp-catalog/view-sp-catalog', { state: { configSteps: data?.catalogConfiguration } })}>PREVIEW</div>
                    {isEnableDelete && (
                      <div onClick={() => OnDeleteClick(data?.catalogConfiguration.id, 'config')}>
                        <DeleteIcon />
                      </div>
                    )}
                  </div>
                </div>
              )}
              {questionnaires?.length > 0 && (
                <>
                  <div className="Questionnaire-li">
                    <div className="Questionnaire-key">{t('ManageAccount.questionnaireConfiguration')}</div>
                    <div className="Questionnaire-value">
                      <div
                        onClick={() =>
                          isSPCatalog
                            ? navigate('../sp-catalog/questionnaire', { state: { questionnaire: data?.questionnaires, isSPCatalog } })
                            : navigate(PREVIEW_URL, {
                                state: {
                                  isSPCatalog: isSPCatalog ? true : false,
                                  isSPMaterial: !isSPCatalog,
                                  questionnaire: data?.questionnaires
                                }
                              })
                        }>
                        {t('ManageCatalog.Preview')}
                      </div>
                    </div>
                  </div>

                  <div className="Questionnairedetails-ul">
                    {questionnaires.map((item, index) => {
                      return (
                        <div key={index} className="Questionnairedetails-li">
                          <div className="Questionnairedetails-key">{item.templateName}</div>
                          {isEnableDelete &&
                            (!isCrosswalked ? (
                              <div className="delete-button" onClick={() => OnDeleteClick(item.id, 'questionnaire')}>
                                <DeleteIcon />
                              </div>
                            ) : (
                              <Tooltip body={t('unlink.tooltip.disabledtext')}>
                                <div className="delete-button" style={{ opacity: 0.5 }}>
                                  <DeleteIcon />
                                </div>
                              </Tooltip>
                            ))}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {!isCrosswalk && !isSPCatalog && (
                <div className="associated-li" onClick={() => navigate('associted-accounts', { state: { sapID: MaterialData.therapy } })}>
                  {t('manageSPAccount.seeAssociatedAccounts')}
                </div>
              )}
            </div>
          </div>
        </FloatingDrawer>
      )}
    </React.Fragment>
  );
}
export default SPMaterialDetails;
