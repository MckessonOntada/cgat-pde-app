import { useTranslate } from '@src/translations/useTranslation';
import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import { LinkProviderProvider } from '../../context/LinkProviderContext';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import LinkProviderService from '@src/api/commonService/LinkProviderService';
import { routeConstants } from '../../routes/constants';
import LinkProviderTable from './LinkProviderTable';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';


function LinkProviderListing() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { spAccountId } = useParams();
  const location = useLocation();
  const { items: notifications, add: addNotification, remove: removeNotification } = useTimedArray(10000);

  useEffect(() => {
    if (location.state?.type && location.state?.messages) {
      addNotification({
        type: location.state.type,
        description: location.state.messages
      });
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  const handleRemoveLinkProvider = (row) => {
    LinkProviderService.removeLinkProvider(spAccountId, row.id);
    addNotification({
      type: 'success',
      description: t('manageSPAccount.message.removelinkprovider.success')
    });
  };

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
              <Button
                Icon={EditPencil}
                variant="secondary"
                className="button-icon"
                size="md"
                onClick={() => navigate(`../${routeConstants.ADD_LINK_PROVIDER}/${spAccountId}`)}
              >
                {t('manageSPAccount.button.providers.linkProviders')}
              </Button>
            }
          />
          {notifications?.length > 0 && (
            <div className="alert-container">
              <div className="MCP-module-body">
                {notifications.map((item, index) => (
                  <Alert key={item.id} description={item.description} onClose={() => removeNotification(item.id)} type={item.type} />
                ))}
              </div>
            </div>
          )}
          <LinkProviderTable 
            handleRemoveLinkProvider={handleRemoveLinkProvider}
          />
        </div>
      </LinkProviderProvider>
    </div>
  );
}
export default LinkProviderListing;
