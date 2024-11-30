import React from 'react';
import { Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as DeleteIcon } from '@src/assets/image/delete.svg';
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import AuthUtils from '@src/util/AuthUtils';
import { serializeParams } from '@src/util/ApiUtils';

export default function Actions({ row, userId, practiceId, refetch }) {
  const { t } = useTranslate();
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const requestParams = {
    userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
  };

  const handleUnlinkAccount = (accid) => {
    mutate({ accid }); // Pass accid as an object
  };

  const { mutate, isLoading, isError, data } = useMutation(
    async ({ accid }) => {
      const apiUrl = userId ? `${ApiRoutes.USERS()}/${userId}/accounts/${accid}?${serializeParams(requestParams)}` : `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${practiceId}/accounts/${accid}`;

      const res = await HttpResourceService.callRest(apiUrl, httpVerb.DELETE, {});
      return res;
    },
    {
      onSuccess: (response) => {
        console.log('Account Unlinked successfully:', response);
        if (refetch) {
          refetch(); // Reload the account list
        }
      },
      onError: (error) => {
        console.error('Failed to unlink account:', error);
      }
    }
  );

  return (
    <Button Icon={DeleteIcon} variant="tertiary" size="md" onClick={() => handleUnlinkAccount(row.id)}>
      {t('account.btn.unlink')}
    </Button>
  );
}
