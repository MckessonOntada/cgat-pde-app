import React, { useEffect, useState } from 'react';
import FloatingDrawer from '@src/components/floating-drawer';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import { Heading } from '@mckesson/mcp-component-library';
import '../manageCatalog.scss';
import { useMutation } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { CatalogDetailsConstants } from '../constants/constants';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { PREVIEW_URL } from '@src/mfe/core-config/system-admin/manage-questionnaire/constants';
import QuestionnaireService from '@src/api/commonService/QuestionnaireService';
import { renderModal } from '@src/util/ModalUtil';
import usePermission from '@src/hooks/usePermissions';
import AuthUtils from '@src/util/AuthUtils';

function CatalogDetails({ openCatalogDetails, setOpenCatalogDetails, viewCatalog, setViewCatalog, showAlert }) {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { hasPermission } = usePermission();
  const isCustomerCenter = AuthUtils.isCustomerCenter();
  const handleCloseDrawer = () => {
    setOpenCatalogDetails((state) => !state);
  };

  const requestParams = () => {
    return {
      materialId: viewCatalog.sapMaterial,
      variant: viewCatalog.variant || '',
      shipToAccount: viewCatalog.shipToCustomer,
      soldToAccount: viewCatalog.soldToCustomer
    };
  };

  useEffect(() => {
    if (openCatalogDetails && viewCatalog) {
      fetchCatalog();
    }
  }, [openCatalogDetails]);

  const {
    mutate: fetchCatalog,
    isLoading,
    isError,
    data
  } = useMutation(
    async (payload) => {
      const apiUrl = `${ApiRoutes.GET_CATALOG_DATA()}/configuration?${serializeParams(requestParams())}`;
      const res = await HttpResourceService.callRest(apiUrl, httpVerb.GET, {});
      return res.data;
    },
    {
      onSuccess: (response) => {},
      onError: (error) => {
        showAlert('error', t('errors.default'));
        setOpenCatalogDetails(false);
      }
    }
  );

  const refetch = () => {
    fetchCatalog();
  };

  const { mutate: deleteConfiguration, isLoading: isDeleteLoading } = useMutation(
    async (payload) => {
      const apiUrl = `${ApiRoutes.GET_CATALOG_DATA()}/configuration?${serializeParams(requestParams())}`;
      const res = await HttpResourceService.callRest(apiUrl, httpVerb.DELETE, {});
      return res;
    },
    {
      onSuccess: (response) => {
        setOpenCatalogDetails(false);
        showAlert('success', t('manageMaterial.drawer.controls.apply.success'));
      },
      onError: (error) => {
        setOpenCatalogDetails(false);
        showAlert('error', t('errors.default'));
      }
    }
  );

  const OnDeleteClick = (id, actionId) => {
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
              delinkQuestionnaire(id);
            } else if (actionId === 'config') {
              deleteConfiguration();
            }
          }
        }
      }
    });
  };

  const { mutate: delinkQuestionnaire, isLoading: isDelinkLoading } = useMutation(
    async (id) => {
      const payload = {
        questionnaireId: id,
        catalogId: {
          sapMaterial: viewCatalog.sapMaterial,
          soldToCustomer: viewCatalog.soldToCustomer,
          shipToCustomer: viewCatalog.shipToCustomer,
          variant: viewCatalog.variant || ''
        }
      };
      await QuestionnaireService.deLinkConfigureQuestionnaire('Catalog', payload);
    },
    {
      onSuccess: (response) => {
        refetch();
      },
      onError: (error) => {
        showAlert('error', t('errors.default'));
      }
    }
  );

  return (
    <React.Fragment>
      {data && (
        <FloatingDrawer open={openCatalogDetails} anchor="right" onClose={handleCloseDrawer} heading={t('ManageCatalog.Catalogdetails')}>
          <div className="details-main-wrapper">
            <div className={'details-body'}>
              {CatalogDetailsConstants.map((item, index) => (
                <React.Fragment key={item.sectionHeading}>
                  <div className="styled-heading">
                    <Heading as="h4">{t(`ManageCatalog.${item.sectionHeading}`)}</Heading>
                  </div>
                  <div className="details-ul">
                    {item.sectionData.map((item, index) => (
                      <div className="details-li" key={`${item.sectionHeading}-${item.label || idx}`}>
                        <div className="details-key">{t(`ManageCatalog.Details.${item.label}`)}</div>
                        <div className="details-value">{data?.catalogPrice[item.value] || '-'}</div>
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              ))}
              {data?.catalogConfiguration && (
                <div className="configure-li">
                  <div className="details-key">{t('ManageCatalog.Configurations')}</div>
                  <div className="details-value">
                    <div onClick={() => navigate('../../manage-catalog/view-catalog', { state: { configSteps: data?.catalogConfiguration } })}>PREVIEW</div>
                    {!isCustomerCenter && (
                      <div onClick={() => OnDeleteClick(data?.catalogConfiguration.id, 'config')}>
                        <DeleteIcon />
                      </div>
                    )}
                  </div>
                </div>
              )}
              {data?.questionnaires?.length > 0 && (
                <>
                  <div className="Questionnaire-li">
                    <div className="Questionnaire-key">{t('ManageCatalog.questionnaireConfiguration')}</div>
                    <div className="Questionnaire-value">
                      <div onClick={() => navigate(PREVIEW_URL, { state: { isCatalog: true, questionnaire: data?.questionnaires } })}>
                        {t('ManageCatalog.Preview')}
                      </div>
                    </div>
                  </div>
                  <div className="Questionnairedetails-ul">
                    {data?.questionnaires.map((item, index) => {
                      return (
                        <div key={item.templateName} className="Questionnairedetails-li">
                          <div className="Questionnairedetails-key">{item.templateName}</div>
                          {!isCustomerCenter && (
                            <div className="delete-button" onClick={() => OnDeleteClick(item.id, 'questionnaire')}>
                              <DeleteIcon />
                            </div>
                          )}
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
export default CatalogDetails;
