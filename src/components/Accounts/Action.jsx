import React, { useState } from 'react';
import { Button, Modal } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as DeleteIcon } from '@src/assets/image/delete.svg';
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import { useAccounts } from './AccountsContext';

export default function Actions({ row, userId, practiceId, refetch }) {
  const { t } = useTranslate();
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const { setPageNumber } = useAccounts();
  const requestParams = {
    userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
  };

  const { mutate, isLoading, isError, data } = useMutation(
    async ({ accid }) => {
      const apiUrl = userId
        ? `${ApiRoutes.USERS()}/${userId}/accounts/${accid}?${serializeParams(requestParams)}`
        : `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${practiceId}/accounts/${accid}?${serializeParams(requestParams)}`;

      const res = await HttpResourceService.callRest(apiUrl, httpVerb.DELETE, {});
      return res;
    },
    {
      onSuccess: (response) => {
        console.log('Account Unlinked successfully:', response);
        setIsOpen(false);
        if (refetch) {
          setPageNumber(1);
        }
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
      mutate({ accid: selectedAccountId });
    }
  };

  return (
    <>
      <Button Icon={DeleteIcon} variant="tertiary" size="md" onClick={() => handleOpenPopup(row.id)}>
        {t('account.btn.unlink')}
      </Button>
      <Modal
        {...{
          id: 'xxxs-modal',
          isOpen,
          onClose: () => setIsOpen(false),
          modalTitle: 'Confirmation message',
          modalBody: <h3>Are you sure you wish to unlink this account ?</h3>,
          modalFooter: (
            <React.Fragment>
              <Button onClick={handleClosePopup} variant="secondary">
                {t('userManagement.label.cancel')}
              </Button>
              <Button onClick={handleConfirmUnlink}>{t('userManagement.button.unlink')}</Button>
            </React.Fragment>
          ),
          modalSize: 'xxxs'
        }}
      />
    </>
  );
}
