import React from 'react';
import FloatingDrawer from '@src/components/floating-drawer';
import { Loader, Heading, Tooltip } from '@mckesson/mcp-component-library';
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

export const SPMaterialDetailsConstants = [
  {
    sectionHeading: 'Details',
    sectionData: [
      { label: 'id', value: 'materialNumber' },
      { label: 'productName', value: 'materialDescription' },
      { label: 'siteName', value: 'siteName' },
      { label: 'NDC', value: 'ndcNumber' }
    ]
  }
];

export const SPCatalogDetailsConstants = [
  {
    sectionHeading: 'Details',
    sectionData: [
      { label: 'id', value: 'sapMaterial' },
      { label: 'productName', value: 'materialDescriptionInLanguageEn' },
      { label: 'siteName', value: 'siteName' },
      { label: 'NDC', value: 'ndc' }
    ]
  }
];

function SPMaterialDetails({ openSPMaterialDetails, setOpenSPMaterialDetails, viewSPMaterial, isSPCatalog = false }) {
  const { t } = useTranslate();
  const isCustomerCenter = AuthUtils.isCustomerCenter();
  const navigate = useNavigate();
  const requestParams = {
    channelType: 'SPECIALITY_PHARMA'
  };
  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ['SPMaterial', viewSPMaterial?.sapMaterial || viewSPMaterial?.spProductId || viewSPMaterial?.materialNumber],
    queryFn: async () => {
      const result = await MaterialService.getSPMaterialById(
        viewSPMaterial?.sapMaterial || viewSPMaterial?.spProductId || viewSPMaterial?.materialNumber,
        requestParams
      );
      return result;
    },
    enabled: !!viewSPMaterial && viewSPMaterial?.id && !isSPCatalog ? true : false,
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
    queryKey: ['SPMaterial', viewSPMaterial?.sapMaterial || viewSPMaterial?.spProductId || viewSPMaterial?.materialNumber],
    queryFn: async () => {
      const result = await SPCatalogService.getSPProductDetailsByMN(requestSPCatalogParams);
      return result;
    },
    enabled: !!viewSPMaterial && viewSPMaterial?.id && isSPCatalog ? true : false,
    refetchOnWindowFocus: false
  });

  const handleCloseDrawer = () => {
    setOpenSPMaterialDetails((state) => !state);
  };
  const OnDeleteClick = (id) => {
    const payload = {
      questionnaireId: id,
      materialNumber: viewSPMaterial.materialNumber,
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
          <p>{t('messages.confirmation.delink')}</p>
        </div>
      ),
      footerActions: {
        cancel: {
          label: t('label.no')
        },
        confirm: {
          label: t('label.yes'),
          action: () => {
            delinkQuestionnaire(isSPCatalog ? catalogPayload : payload);
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
      },
      onError: (error) => {
        showSnackbar({
          description: t('manageMaterial.delink.error'),
          type: 'error'
        });
      }
    }
  );

  if (isLoading) {
    return <Loader type={'screen'} />;
  }

  const renderDetails = (constants, dataSource) => {
    return constants.map((item, index) => (
      <React.Fragment key={index}>
        <div className="styled-heading">
          <Heading as="h4">{t(`manageSPMaterial.drawer.${item.sectionHeading}`)}</Heading>
        </div>
        <div className="details-ul">
          {item.sectionData.map((subItem, subIndex) => {
            const value = subItem.value === 'siteName' ? data?.siteName || '-' : data?.[dataSource]?.[subItem.value] || '-';
            return (
              <div className="details-li" key={subIndex}>
                <div className="details-key">{t(`manageSPMaterial.drawer.details.body.${subItem.label}`)}</div>
                <div className="details-value">{value}</div>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    ));
  };
  const isCrosswalked = data?.therapy?.isCrosswalked;

  return (
    <React.Fragment>
      {data && (
        <FloatingDrawer open={openSPMaterialDetails} anchor="right" onClose={handleCloseDrawer} heading={t('manageSPMaterial.drawer.heading')}>
          <div className="details-main-wrapper">
            <div className={'details-body'}>
              {!isSPCatalog ? renderDetails(SPMaterialDetailsConstants, 'therapy') : renderDetails(SPCatalogDetailsConstants, 'catalogPrice')}
              {data?.questionnaires?.length > 0 && (
                <>
                  <div className="Questionnaire-li">
                    <div className="Questionnaire-key">{t('ManageAccount.questionnaireConfiguration')}</div>
                    <div className="Questionnaire-value">
                      <div
                        onClick={() =>
                          navigate(PREVIEW_URL, {
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
                    {data?.questionnaires.map((item, index) => {
                      return (
                        <div key={index} className="Questionnairedetails-li">
                          <div className="Questionnairedetails-key">{item.templateName}</div>
                          {!isCustomerCenter &&
                            (!isCrosswalked ? (
                              <div className="delete-button" onClick={() => OnDeleteClick(item.id)}>
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
            </div>
          </div>
        </FloatingDrawer>
      )}
    </React.Fragment>
  );
}
export default SPMaterialDetails;
