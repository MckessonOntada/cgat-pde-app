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
      mutate();
    }
  }, [openCatalogDetails]);

  const { mutate, isLoading, isError, data } = useMutation(
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

  const { mutate: deleteConfiguration, isLoading: isDeleteLoading } = useMutation(
    async (payload) => {
      const apiUrl = `${ApiRoutes.GET_CATALOG_DATA()}/configuration?${serializeParams(requestParams())}`;
      const res = await HttpResourceService.callRest(apiUrl, httpVerb.DELETE, {});
      return res;
    },
    {
      onSuccess: (response) => {
        setOpenCatalogDetails(false);
        showAlert('success', t('ManageCatalog.configure.success'));
      },
      onError: (error) => {
        setOpenCatalogDetails(false);
        showSnackbar({ description: t('ManageCatalog.configure.error'), type: 'error' });
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
                  <Heading as="h4">{t(`ManageCatalog.${item.sectionHeading}`)}</Heading>
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
            </div>
          </div>
        </FloatingDrawer>
      )}
    </React.Fragment>
  );
}
export default CatalogDetails;
