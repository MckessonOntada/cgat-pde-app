import React, { useCallback, useState, useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import DetailsView from '../../components/DetailsView';
import AccountsList from '@src/components/Accounts/AccountsList';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import './ViewOrg.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { RoutePaths } from '@src/routes/constants';
import { Button, Loader, Alert, Stepper } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import { PATHS as InternalPaths } from '../../routes/constants';
import ModuleHeader from '@src/components/module-header';

export default function ViewOrganization() {
  // Call api to get linked accounts => /practice/{practiceId}/accounts
  const location = useLocation();
  const isView = location.state?.isView || false;
  const [isRemoveClicked, setIsRemoveClicked] = useState();
  const { orgId } = useParams();

  const navigate = useNavigate();
  const { t } = useTranslate();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [updateState, setUpdateState] = useState({ isSuccess: false });
  const [alertDescription, setAlertDescription] = useState('');
  const [addNewAccounts, setAddNewAccounts] = useState(!isView);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const selectedCount = selectedAccounts?.length || 0;
  // Fetch practice details
  const { isLoading, data, isError } = useQuery({
    queryKey: [`practices/${orgId}`],
    queryFn: async () => {
      const res = await HttpResourceService.callRest(
        `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${orgId}`, // Use practice id from organization
        httpVerb.GET,
        {}
      );

      return res.data;
    },
    refetchOnWindowFocus: false
  });

  const goBack = () => {
    navigate(RoutePaths.pathOrgManagement);
  };

  useEffect(() => {
    if (updateState.isSuccess) {
      setIsAlertVisible(true);
      setAlertDescription(`${updateState.recCount} new acounts has been successfully added to the organziation`);
      const timer = setTimeout(() => {
        handleAlertClose;
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [updateState.isSuccess, location.pathname, location.state]);

  const handleAlertClose = () => {
    setIsAlertVisible(false);
    setUpdateState({ isSuccess: false });
  };

  const {
    mutate,
    isLoading: isAddAccountsLoading,
    isError: isAddAccountsError,
    data: isAddAccountsData
  } = useMutation(async ({ payload }) => {
    const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${orgId}/accounts`;
    const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);
    return res.data;
  });

  const addNewAccountsClick = () => {
    const payload = selectedAccounts?.map((account) => account.id);
    mutate(
      {
        payload
      },
      {
        onSuccess: (response) => {
          console.log('Accounts updated successfully:', response);
          if (!isView) {
            navigate(RoutePaths.pathOrgManagement, { state: { isSuccess: true } });
          } else {
            setUpdateState({ isSuccess: isView ? true : false, recCount: selectedCount });
            handleCancel();
          }
        },
        onError: (error) => {
          console.log('Failed to add accounts:', error);
          alert('Failed to update accounts');
        }
      }
    );
  };

  const handleCancel = () => {
    setSelectedAccounts([]);
    setAddNewAccounts(false);
  };

  const onRemoveAccount = useCallback(
    (item) => {
      setSelectedAccounts(selectedAccounts.filter((account) => account.id !== item.id));
    },
    [selectedAccounts, setSelectedAccounts]
  );

  console.log('selectedAccounts', selectedAccounts);
  return (
    <div className="viewOrg-container">
      {isLoading && <Loader type={'screen'} />}
      <div className="back-navigation py2 capitalize" onClick={goBack} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <MdOutlineKeyboardArrowLeft size="24px" />
        <p>{t('orgManagement.back.organization')}</p>
      </div>
      {!addNewAccounts && <ModuleHeader heading={<p className="primaryHeading">{t('orgManagement.create_org.org-details')}</p>} />}
      {!isView && (
        <div className="stepper">
          <Stepper
            activeIndex={2}
            dividerText="of"
            stepHeaders={[
              {
                label: t('orgManagement.stepper.option.org_details')
              },
              {
                label: t('orgManagement.stepper.option.acct_details')
              }
            ]}
          />
        </div>
      )}
      {isView && !addNewAccounts && data && (
        <div className="details-view-container">
          <DetailsView data={data} onEditClick={() => navigate(`../${InternalPaths.editOrg}/${orgId}`, { state: data }, true)} />
        </div>
      )}
      <ModuleHeader
        heading={<p className="primaryHeading">{addNewAccounts ? t('orgManagement.select_account') : t('orgManagement.link')}</p>}
        controls={
          !addNewAccounts && (
            <div className="controls">
              <Button Icon={EditPencil} variant="tertiary" className="button-icon" onClick={() => setAddNewAccounts(true)} size={'md'}>
                {t(isView ? 'orgManagement.table.action.edit' : 'orgManagement.add.account')}
              </Button>
            </div>
          )
        }
      />
      {updateState.isSuccess && isAlertVisible && <Alert description={alertDescription} onClose={handleAlertClose} type="success" duration={10000} />}
      <AccountsList
        showSelectedAccounts={addNewAccounts}
        omitColumns={addNewAccounts ? ['action'] : ['distributionChannel']}
        selectableRows={addNewAccounts}
        selectedRows={selectedAccounts}
        setSelectedRows={(newAccounts) => setSelectedAccounts(newAccounts)}
        practiceId={orgId}
        onRemoveAccount={onRemoveAccount}
        addNewAccounts={addNewAccounts}
      />
      {addNewAccounts && (
        <div className="btn-box">
          <Button variant="secondary" onClick={handleCancel}>
            {t('orgManagement.button.cancel')}
          </Button>
          <Button onClick={addNewAccountsClick}>{t(isView ? 'orgManagement.add.account' : selectedCount > 0 ? 'orgManagement.create_org' : 'orgManagement.add.viewsummary')}</Button>
        </div>
      )}
    </div>
  );
}
