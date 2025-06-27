import { useTranslate } from '@src/translations/useTranslation';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import { Heading, Button, Loader } from '@mckesson/mcp-component-library';
import { LinkProviderProvider } from '../../context/LinkProviderContext';
import { ReactComponent as AddIcon } from '@src/assets/svg/add-icon.svg';
import LinkProviderService from '@src/api/commonService/LinkProviderService';
import { routeConstants } from '../../routes/constants';
import LinkProviderTable from './LinkProviderTable';
import { useMutation } from 'react-query';
import AuthUtils from '@src/util/AuthUtils';
import Alert from '@src/components/cgat-alert/Alert';

function LinkProviderListing() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { spAccountId } = useParams();
  const location = useLocation();
  const isCustomerCenter = AuthUtils.isCustomerCenter();
  const [notification, setNotification] = useState(null);
  const [searchParams] = useSearchParams();
  const selectedOrganization = searchParams.get('orgId');

  useEffect(() => {
    if (location.state?.type && location.state?.messages) {
      setNotification({
        type: location.state.type,
        description: location.state.messages
      });
      navigate(`${location.pathname}${location.search}`, {
        replace: true,
        state: null
      });
    }
  }, [location, navigate]);

  const { isLoading, mutate: handleUnlinkProvider } = useMutation(
    async (selectedProviders) => {
      const selectedProviderIds = selectedProviders.map((p) => Number(p.id));
      return await LinkProviderService.removeLinkProvider(selectedOrganization, spAccountId, selectedProviderIds);
    },
    {
      onSuccess: () => {
        setNotification({
          type: 'success',
          description: t('manageSPAccount.message.removelinkprovider.success')
        });
      },
      onError: () => {
        setNotification({
          type: 'error',
          description: t('errors.default')
        });
      }
    }
  );

  if (isLoading) return <Loader type="screen" />;
  return (
    <div>
      <LinkProviderProvider>
        <div className="MCP-module-body">
          <ModuleHeader
            heading={
              <div className="subheader-text">
                <Heading as="h2">{t('manageSPAccount.heading.providers')}</Heading>
              </div>
            }
            controls={
              !isCustomerCenter && (
                <Button
                  Icon={AddIcon}
                  variant="secondary"
                  className="button-icon"
                  size="md"
                  onClick={() => navigate(`../${routeConstants.ADD_LINK_PROVIDER}/${spAccountId}?orgId=${selectedOrganization}`)}>
                  {t('manageSPAccount.button.providers.linkProviders')}
                </Button>
              )
            }
          />
          {notification && <Alert description={notification.description} onClose={() => setNotification(null)} type={notification.type} />}
          <LinkProviderTable handleUnlinkProvider={handleUnlinkProvider} />
        </div>
      </LinkProviderProvider>
    </div>
  );
}
export default LinkProviderListing;
