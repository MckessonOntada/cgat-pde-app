import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import { LinkProviderProvider } from '../../context/LinkProviderContext';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import { getLinkProviderColumns } from './LinkProviderColumn';
import LinkProviderService from '@src/api/commonService/LinkProviderService';
import { renderModal } from '@src/util/ModalUtil';
import { routeConstants } from '../../routes/constants';
import LinkProviderTable from './LinkProviderTable';

function LinkProviderListing() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { spAccountId } = useParams();
  const [alert, setAlert] = useState(null);

  const unLinkProvider = (row) => {
    renderModal({
      title: t('messages.header.confirmation'),
      bodyContent: (
        <div className="MCP-modal-body">
          <p>{t('manageSPAccount.message.remove.linkprovider')}</p>
        </div>
      ),
      footerActions: {
        cancel: {
          label: t('manageSPAccount.button.cancel'),
        },
        confirm: {
          label: t('manageSPAccount.button.confirm'),
          action: () => {
            handleRemoveLinkProvider(row);
          }
        }
      }
    });
  };
  const handleRemoveLinkProvider = async (row) => {
    LinkProviderService.removeLinkProvider(row);
    showAlert('success', t('manageSPAccount.message.removelinkprovider.success'));
  };

  const showAlert = (type, message) => {
    setAlert({ type: type, message: message });
  };

  const handleAlertClose = () => {
    setAlert({ type: null, message: null });
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
          {alert && alert.type && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} duration={10000} />}
          <LinkProviderTable 
            unLinkProvider={unLinkProvider}
          />
        </div>
      </LinkProviderProvider>
    </div>
  );
}
export default LinkProviderListing;
