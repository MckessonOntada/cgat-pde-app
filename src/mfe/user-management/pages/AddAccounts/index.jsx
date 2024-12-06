import React, { useState, useCallback, useEffect } from 'react';
import { Stepper, Heading, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import ModuleHeader from '@src/components/module-header';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import arrow_right from '@src/assets/image/arrow_right.svg';
import AccountsList from '@src/components/Accounts/AccountsList';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import AllAccountsData from '@src/mfe/org-management/mockData/AllAccounts';
import { RoutePaths } from '@src/routes/constants';
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import { UserAccountsProvider } from '../../context/UserAccountsContext';
import UserAccounts from '../UserDetail/UserAccounts';
import { PATHS } from '../../routes';

const AddAccounts = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const [searchText, setSearchText] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const { isEdit } = location.state || {};
  const isSuccess = location.state?.isSuccess || false;
  const practiceId = AuthUtils.getPracticeId() ?? 1;
  const selectedCount = selectedAccounts?.length || 0;
  const isSystemAdminView = AuthUtils.isSystemAdminView();

  const handleGoBack = () => {
    navigate(RoutePaths.pathUserManagement);
  };

  const handleBackButton = () => {
    navigate(isEdit ? `../${PATHS.userDetail.replace(':userId', userId)}` : `../${PATHS.userPermissions}/${userId}`);
  };

  const handleSearchChange = (inputValue) => {
    setSearchText(inputValue);
  };
  const onRemoveAccount = useCallback(
    (item) => {
      setSelectedAccounts(selectedAccounts.filter((account) => account.id !== item.id));
    },
    [selectedAccounts, setSelectedAccounts]
  );

  const handleSaveandContinue = () => {
    handleAddAccounts();
    navigate(RoutePaths.pathUserManagement, { state: { isSuccess: true } });
  };

  const requestParams = {
    userType: AuthUtils.isSystemAdminView() ? 'ADMIN' : 'GENERAL'
  };

  const { mutate, isLoading, isError, data } = useMutation(async ({ payload }) => {
    const url = `${ApiRoutes.USERS()}/${userId}/accounts?${serializeParams(requestParams)}`;
    const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);
    return res.data;
  });

  const handleAddAccounts = () => {
    const payload = selectedAccounts?.map((account) => account.id);
    mutate(
      {
        payload
      },
      {
        onSuccess: (response) => {
          console.log('User created/updated successfully:', response);
          navigate(`../${userId}`, { state: { isSuccess: true, recCount: selectedCount } });
        },
        onError: (error) => {
          console.log('Failed to add accounts:', error);
        }
      }
    );
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <ModuleHeader heading={<Heading as="h1">{isEdit ? t('userManagement.button.add_accounts') : t('userManagement.create_user')}</Heading>} />

      {!isEdit && (
        <div className="stepper">
          <Stepper
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

      <UserAccountsProvider addNewAccounts={true} practiceId={practiceId} userId={userId}>
        <UserAccounts
          data={AllAccountsData}
          selectedRows={selectedAccounts}
          setSelectedRows={setSelectedAccounts}
          onRemoveAccount={onRemoveAccount}
          showSelectedAccounts
          omitColumns={['action', 'cgatIdentifier', 'address']}
          practiceId={practiceId}
          userId={userId}
          addNewAccounts={true}
          selectableRows={true}
        />
      </UserAccountsProvider>

      <div className={'buttonGroup'}>
        <Button variant="secondary" type="button" onClick={handleBackButton} size={'md'}>
          {t('userManagement.button.back')}
        </Button>
        {!isEdit && (
          <Button variant="primary" type="button" onClick={handleSaveandContinue} size={'md'} disabled={selectedAccounts?.length <= 0}>
            {t('userManagement.button.adduser')}
          </Button>
        )}
        {isEdit && (
          <Button variant="primary" type="button" onClick={handleAddAccounts} size={'md'} disabled={selectedAccounts?.length <= 0}>
            {t('userManagement.button.add_accounts')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddAccounts;
