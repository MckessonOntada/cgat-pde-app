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
import { useWidgetContext } from '@src/context/WidgetContext';
import { ReactComponent as ButtonLoadingIcon } from '@src/assets/svg/button-loading.svg';

const getSubmitCaption = ({ isEdit, isSaving }) => {
  if (isSaving && isEdit) return 'Updating';
  if (isSaving && !isEdit) return 'Saving';
  if (!isSaving && isEdit) return 'Update';
  return 'Save and Continue';
};

const AddAccounts = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { isEdit, id } = useRouteMode({ editSegment: 'edit', paramKey: 'userId' });
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [alert, setAlert] = React.useState(null);
  const practiceId = AuthUtils.getPracticeId() ?? 1;
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const requestParams = {
    userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
  };
  const { setValue } = useWidgetContext();

  const handleBackButton = () => {
    navigate(isEdit ? -1 : `../${id}/${PATHS.PERMISSIONS}`, {
      state: { isBack: true }
    });
  };

  const { mutate: addAccounts, isLoading: isSaving } = useMutation({
    mutationFn: async (payload) => {
      const url = `${ApiRoutes.USERS()}/${id}/accounts?${serializeParams(requestParams)}`;
      const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);
      return res.data;
    },
    onSuccess: (response) => {
      setValue('userDetails', response);
      if (isEdit) {
        navigate(`./../..`, {
          state: {
            alert: {
              pinPoint: 'accounts',
              type: 'success',
              description: `${selectedAccounts.length} ${t('messages.accountlinkSuccess')}.`
            }
          }
        });
      } else {
        navigate(`./../materials`);
      }
    },
    onError: (error) => {}
  });

  const handleOnSubmit = () => {
    const payload = selectedAccounts?.map((account) => account.id);
    addAccounts(payload);
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
          <Button
            variant="primary"
            disabled={selectedAccounts.length <= 0}
            onClick={handleOnSubmit}
            isLoadingState={isSaving}
            Icon={isSaving && ButtonLoadingIcon}
            iconPosition="left"
            type="button"
            size="md">
            {getSubmitCaption({ isEdit, isSaving })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddAccounts;
