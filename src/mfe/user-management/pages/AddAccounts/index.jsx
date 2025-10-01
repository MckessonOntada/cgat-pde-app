import { Button, Heading, Loader, StepperMui } from '@mckesson/mcp-component-library';
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
import React, { useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PATHS } from '../../routes';

const AddAccounts = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const [searchText, setSearchText] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [alertConfig, setAlertConfig] = React.useState(null);
  const { permissionsData, isEdit } = location.state || {};
  const practiceId = AuthUtils.getPracticeId() ?? 1;
  const selectedCount = selectedAccounts?.length || 0;
  const isSystemAdmin = AuthUtils.isSystemAdmin();

  const handleGoBack = () => {
    navigate(RoutePaths.pathUserManagement);
  };

  const handleBackButton = () => {
    navigate(isEdit ? `../${PATHS.userDetail.replace(':userId', userId)}` : `../${PATHS.userPermissions}/${userId}`, {
      state: { isBack: true, permissionsData: permissionsData }
    });
  };

  const handleSaveandContinue = () => {
    handleAddAccounts();
    if (selectedAccounts?.length > 0) {
      navigate(RoutePaths.pathUserManagement, { state: { isSuccess: true } });
    }
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
      setAlertConfig({
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
          navigate(`../${userId}`, { state: { isSuccess: true, recCount: selectedCount } });
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
          {t('userManagement.user.backmessage')}
        </Button>
      </div>
      <ModuleHeader heading={<Heading as="h1">{isEdit ? t('userManagement.button.add_accounts') : t('userManagement.create_user')}</Heading>} />
      {!isEdit && !isSystemAdmin && (
        <div className="stepper">
          <StepperMui
            activeIndex={3}
            dividerText="of"
            stepHeaders={[
              {
                label: t('userManagement.stepper.option.user_details')
              },
              {
                label: t('userManagement.stepper.option.roles_and_permissions')
              },
              {
                label: t('userManagement.stepper.option.associate_accounts')
              }
            ]}
          />
        </div>
      )}
      {alertConfig?.isVisible && <Alert type={alertConfig.type} description={alertConfig.description} onClose={() => setAlertConfig(null)} />}
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
      <div className={'buttonGroup'}>
        <Button variant="secondary" type="button" onClick={handleBackButton} size={'md'}>
          {t('userManagement.button.back')}
        </Button>
        {!isEdit && (
          <Button variant="primary" type="button" onClick={handleSaveandContinue} size={'md'}>
            {t('userManagement.button.adduser')}
          </Button>
        )}
        {isEdit && (
          <Button variant="primary" type="button" onClick={handleAddAccounts} size={'md'}>
            {t('userManagement.button.add_accounts')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddAccounts;
