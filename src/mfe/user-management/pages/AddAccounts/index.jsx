import { Button } from '@mckesson/mcp-component-library';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import UserAccounts from '@src/components/Accounts/Accounts';
import Alert from '@src/components/cgat-alert/Alert';
import { RoutePaths } from '@src/routes/constants';
import { useTranslate } from '@src/translations/useTranslation';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes';
import useRouteMode from '../../routes/useRouteMode';

const AddAccounts = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { isEdit, id } = useRouteMode({ editSegment: 'edit', paramKey: 'userId' });
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [alert, setAlert] = React.useState(null);
  const practiceId = AuthUtils.getPracticeId() ?? 1;
  const selectedCount = selectedAccounts?.length || 0;
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const requestParams = {
    userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
  };

  const handleGoBack = () => {
    navigate(isEdit ? -1 : RoutePaths.pathUserManagement);
  };

  const handleBackButton = () => {
    navigate(isEdit ? `../${id}` : `../${id}/${PATHS.PERMISSIONS}`, {
      state: { isBack: true }
    });
  };

  const { mutate, isLoading: isSavingAccounts } = useMutation(async ({ payload }) => {
    const url = `${ApiRoutes.USERS()}/${id}/accounts?${serializeParams(requestParams)}`;
    const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);
    return res.data;
  });

  const handleAddAccounts = () => {
    if (selectedAccounts?.length <= 0) {
      setAlert({
        isVisible: true,
        description: `Select at least one account`,
        type: 'error'
      });
      return;
    }
    const payload = selectedAccounts?.map((account) => account.id);
    mutate(
      {
        payload
      },
      {
        onSuccess: (response) => {
          if (isEdit) {
            navigate(`../${id}`, {
              state: {
                alert: {
                  pinPoint: 'linked_accounts',
                  type: 'success',
                  description: `${selectedCount} ${t('messages.accountlinkSuccess')}.`
                }
              }
            });
          } else {
            navigate(`../${id}/materials`, { state: { isCreate: true } });
          }
        },
        onError: (error) => {}
      }
    );
  };
  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-body">
        {alert?.isVisible && <Alert type={alert.type} description={alert.description} onClose={() => setAlert(null)} />}
        <UserAccounts
          autoFocus={true}
          selectedRows={selectedAccounts}
          setSelectedRows={setSelectedAccounts}
          showSelectedAccounts={true}
          omitColumns={['action', 'cgatIdentifier', 'address']}
          practiceId={practiceId}
          selectableRows={true}
          allowSelectAll={true}
        />
        <div className={'controls'}>
          <Button variant="secondary" type="button" onClick={handleBackButton} size={'md'}>
            {t('userManagement.button.back')}
          </Button>
          {!isEdit && (
            <Button variant="primary" type="button" onClick={handleAddAccounts} size={'md'}>
              {t('userManagement.button.savencontinue')}
            </Button>
          )}
          {isEdit && (
            <Button variant="primary" type="button" onClick={handleAddAccounts} size={'md'}>
              {t('userManagement.button.add_accounts')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAccounts;
