import { Button, Heading, Loader } from '@mckesson/mcp-component-library';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import UserAccounts from '@src/components/Accounts/Accounts';
import Alert from '@src/components/cgat-alert/Alert';
import ModuleHeader from '@src/components/module-header';
import { RoutePaths } from '@src/routes/constants';
import { useTranslate } from '@src/translations/useTranslation';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PATHS } from '../../routes';
import UserCreationStepper from '../UserCreationStepper';

const AddAccounts = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [alert, setAlert] = React.useState(null);
  const { permissionsData, isEdit } = location.state || {};
  const practiceId = AuthUtils.getPracticeId() ?? 1;
  const selectedCount = selectedAccounts?.length || 0;
  const isSystemAdmin = AuthUtils.isSystemAdmin();

  const handleGoBack = () => {
    navigate(isEdit ? -1 : RoutePaths.pathUserManagement);
  };

  const handleBackButton = () => {
    navigate(isEdit ? `../${PATHS.userDetail.replace(':userId', userId)}` : `../${PATHS.PERMISSIONS}/${userId}`, {
      state: { isBack: true, permissionsData: permissionsData }
    });
  };

  const requestParams = {
    userType: AuthUtils.isSystemAdminView() ? 'ADMIN' : 'GENERAL'
  };

  const { mutate, isLoading } = useMutation(async ({ payload }) => {
    const url = `${ApiRoutes.USERS()}/${userId}/accounts?${serializeParams(requestParams)}`;
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
            navigate(`../${userId}`, {
              state: {
                alert: {
                  pinPoint: 'linked_accounts',
                  type: 'success',
                  description: `${selectedCount} ${t('messages.accountlinkSuccess')}.`
                }
              }
            });
          } else {
            navigate(`../${userId}/materials`, { state: { isCreate: true } });
          }
        },
        onError: (error) => {}
      }
    );
  };
  if (isLoading) {
    return <Loader type={'screen'} />;
  }
  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
          {t(isEdit ? 'userManagement.back_to_user_details' : 'userManagement.user.backmessage')}
        </Button>
      </div>
      <div className="MCP-module-body">
        <ModuleHeader heading={<Heading as="h1">{isEdit ? t('userManagement.button.add_accounts') : t('userManagement.create_user')}</Heading>} />
        {!isEdit && !isSystemAdmin && (
          <div className="stepper">
            <UserCreationStepper activeIndex={3} />
          </div>
        )}
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
