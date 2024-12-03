import React, { useState, useCallback, useEffect } from 'react';
import { Stepper, AutoSuggestSearch, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import ModuleHeader from '@src/components/module-header';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import arrow_right from '@src/assets/image/arrow_right.svg';
import AccountsList from '@src/components/Accounts/AccountsList';
import AllAccountsData from '@src/mfe/org-management/mockData/AllAccounts';
import { RoutePaths } from '@src/routes/constants';
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';

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
          alert('Failed to update accounts');
          // setAlert({ type: "error", message: "Failed to update accounts" });
          // setIsAlertVisible(true);
        }
      }
    );
  };

  return (
    <div className="MCP-module-wrapper">
      <div className="back-navigation py2 capitalize" onClick={handleGoBack} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <MdOutlineKeyboardArrowLeft size="24px" />
        <p>Back to Manage Users</p>
      </div>

      <ModuleHeader heading={<p className="primaryHeading">{isEdit ? t('userManagement.button.add_accounts') : t('userManagement.create_user')}</p>} />

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

      <div class="MCP-panel-container line-height grid grid-gap-24 grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
        <div className="MCP-module-body">
          {!isEdit && <p className="secondaryHeading"> {t('userManagement.add_accounts.labelheader')}</p>}

          <div className="MCP-panel-container">
            <div className="toggle-box">
              <img src={arrow_right} className="icon-align" />
              <div className="autoSuggestSearch-container">
                <AutoSuggestSearch label=" " onChangeInput={handleSearchChange} outline={true} placeHolder={t('userManagement.searchFilter.addaccount_label')} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <div className="grid grid-gap-16">
          <AccountsList
            data={AllAccountsData}
            selectedRows={selectedAccounts}
            setSelectedRows={setSelectedAccounts}
            onRemoveAccount={onRemoveAccount}
            showSelectedAccounts
            omitColumns={['action', 'cgatIdentifier', 'address']}
            practiceId={practiceId}
            userId={userId}
            addNewAccounts={true}
          />
        </div>
      </div>
      <div className={'buttonGroup'}>
        <Button variant="secondary" type="button" onClick={handleGoBack} size={'md'}>
          {t('userManagement.button.back')}
        </Button>
        {!isEdit && (
          <Button variant="primary" type="button" onClick={handleSaveandContinue} size={'md'}>
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
