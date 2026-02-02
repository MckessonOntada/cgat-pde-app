import React, { useState } from 'react';
import { Modal, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as LinkIcon } from '@src/assets/svg/link.svg';
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import { useAccounts } from './AccountsContext';
import IconButton from '@src/components/button';

export default function Actions({ row, userId, practiceId, refetch }) {
  const { t } = useTranslate();
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const { setPageNumber } = useAccounts();
  const requestParams = {
    userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
  };

  const {
    mutate: unlinkAccounts,
    isLoading,
    isError,
    data
  } = useMutation(
    async ({ accountId }) => {
      const apiUrl = userId
        ? `${ApiRoutes.USERS()}/${userId}/accounts/${accountId}?${serializeParams(requestParams)}`
        : `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${practiceId}/accounts/${accountId}?${serializeParams(requestParams)}`;

      const res = await HttpResourceService.callRest(apiUrl, httpVerb.DELETE, {});
      return res;
    },
    {
      onSuccess: (response) => {
        console.log('Account Unlinked successfully:', response);
        setIsOpen(false);
        refetch();
        setPageNumber(1);
      },
      onError: (error) => {
        console.error('Failed to unlink account:', error);
        setIsOpen(false);
      }
    }
  );

  const handleOpenPopup = (accid) => {
    setSelectedAccountId(accid);
    setIsOpen(true);
  };

  const handleClosePopup = () => {
    setIsOpen(false);
  };

  const handleConfirmUnlink = () => {
    if (selectedAccountId) {
      unlinkAccounts({ accountId: selectedAccountId });
    }
  };

  return (
    <React.Fragment>
      <IconButton style={{ padding: 0 }} variant="text" size="small" startIcon={<LinkIcon width="14" height="14" />} onClick={() => handleOpenPopup(row.id)}>
        Unlink
      </IconButton>
      <Modal
        {...{
          id: 'xxxs-modal',
          isOpen,
          onClose: () => setIsOpen(false),
          modalTitle: t('orgManagement.confirmationmessage'),
          modalBody: <div className="MCP-modal-body">Are you sure you wish to unlink this account ?</div>,
          modalFooter: (
            <React.Fragment>
              <Button onClick={handleClosePopup} variant="secondary" size="md">
                {t('userManagement.label.cancel')}
              </Button>
              <Button onClick={handleConfirmUnlink} size="md">
                {t('userManagement.button.unlink')}
              </Button>
            </React.Fragment>
          ),
          modalSize: 'xxxs'
        }}
      />
    </React.Fragment>
  );
}
