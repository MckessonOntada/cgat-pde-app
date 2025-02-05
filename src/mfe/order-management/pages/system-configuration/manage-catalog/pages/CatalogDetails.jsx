import React, { useEffect, useState } from 'react';
import FloatingDrawer from '@src/components/floating-drawer';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import { ReactComponent as IconClose } from '@src/assets/svg/closeIcon.svg';
import { Loader, Heading, Button } from '@mckesson/mcp-component-library';
import '../manageCatalog.scss';
import { useMutation } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { CatalogDetailsConstants } from '../constants/constants';
import { useNavigate } from 'react-router-dom';
import useSnackbar from '@src/hooks/useSnackbar';
import { useTranslate } from '@src/translations/useTranslation';
import { PREVIEW_URL, ROUTE_CONFIG } from '@src/mfe/order-management/questionnaire/constants';
import QuestionnaireService from '@src/api/commonService/QuestionnaireService';

function CatalogDetails({ openCatalogDetails, setOpenCatalogDetails, viewCatalog, setViewCatalog, showAlert }) {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { showSnackbar } = useSnackbar();
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
        showSnackbar({ description: 'Error while fetching Catalog Details', type: 'error' });
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
        showAlert('success', t('ManageCatalog.delink.success'));
      },
      onError: (error) => {
        setOpenCatalogDetails(false);
        showSnackbar({ description: t('ManageCatalog.delink.error'), type: 'error' });
      }
    }
  );
  const OnDeleteClick = (id) => {
    const payload = {
      questionnaireId: id,
      catalogId: {
        sapMaterial: viewCatalog.sapMaterial,
        soldToCustomer: viewCatalog.soldToCustomer,
        shipToCustomer: viewCatalog.shipToCustomer,
        variant: viewCatalog.variant || ''
      }
    };
    delinkQuestionnaire(payload);
  };

  const { mutate: delinkQuestionnaire, isLoading: isDelinkLoading } = useMutation(
    async (payload) => {
      await QuestionnaireService.deLinkConfigureQuestionnaire('Catalog', payload);
    },
    {
      onSuccess: (response) => {
        refetch();
      },
      onError: (error) => {
        showSnackbar({ description: t('ManageCatalog.delink.error'), type: 'error' });
      }
    }
  );

  return (
    <React.Fragment>
      {data && (
        <FloatingDrawer open={openCatalogDetails} anchor="right" onClose={handleCloseDrawer}>
          <div className="details-main-wrapper">
            <div className="header">
              <Heading as="h2">{t('ManageCatalog.Catalogdetails')}</Heading>
              <button onClick={handleCloseDrawer}>
                <IconClose />
              </button>
            </div>
            <div className={'details-body'}>
              {CatalogDetailsConstants.map((item, index) => (
                <React.Fragment>
                  <Heading as="h3">{t(`ManageCatalog.${item.sectionHeading}`)}</Heading>
                  <div className="details-ul">
                    {item.sectionData.map((item, index) => (
                      <div className="details-li">
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
                    <div onClick={() => navigate('view-catalog', { state: { configSteps: data?.catalogConfiguration } })}>PREVIEW </div>
                    <div onClick={() => deleteConfiguration()}>
                      <DeleteIcon />
                    </div>
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
                        <div key={index} className="Questionnairedetails-li">
                          <div className="Questionnairedetails-key">{item.templateName}</div>
                          <div className="delete-button" onClick={() => OnDeleteClick(item.id)}>
                            <DeleteIcon />
                          </div>
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
