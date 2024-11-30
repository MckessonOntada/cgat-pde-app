import React from 'react';
import { Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as DeleteIcon } from '@src/assets/image/delete.svg';
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import AuthUtils from '@src/util/AuthUtils';

export default function Actions({ row }) {
  const { t } = useTranslate();

  const practiceId = AuthUtils.getPracticeId() ?? 1;
  const handleUnlinkAccount = async (accid) => {
    const accid1 = String(accid).trim();
    console.log('accid', practiceId);
    const apiUrl = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${practiceId}/accounts/${accid1}`;
    const res = await HttpResourceService.callRest(apiUrl, httpVerb.DELETE, {});
    return res;
  };

  const { mutate } = useMutation({
    mutationFn: handleUnlinkAccount,
    onSuccess: (response) => {
      console.log('Account Unlinked successfully:', response);
      alert('Account Unlinked successfully:');
    },
    onError: (error) => {
      alert('Failed to Unlinked Account', error);
    }
  });

  return (
    <Button Icon={DeleteIcon} variant="tertiary" size="md" onClick={() => handleUnlinkAccount(row.id)}>
      {t('account.btn.unlink')}
    </Button>
  );
}
