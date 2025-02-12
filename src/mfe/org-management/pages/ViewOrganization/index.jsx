import React, { useCallback, useState, useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import DetailsView from '../../components/DetailsView';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import './ViewOrg.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { RoutePaths } from '@src/routes/constants';
import { Button, Heading, Loader, Alert } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { PATHS as InternalPaths } from '../../routes/constants';
import ModuleHeader from '@src/components/module-header';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { scrollToTopUtil } from '@src/components/scrollToTop/scrollUtils';
import OrganizationAccounts from '@src/components/Accounts/Accounts';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import usePermission from '@src/hooks/usePermissions';

export default function ViewOrganization() {
  // Call api to get linked accounts => /practice/{practiceId}/accounts
  const location = useLocation();
  const isView = location.state?.isView || false;
  const { orgId } = useParams();

  const navigate = useNavigate();
  const { t } = useTranslate();
  const [alertConfig, setAlertConfig] = React.useState(null);
  const [updateState, setUpdateState] = useState({ isSuccess: false });
  const [addNewAccounts, setAddNewAccounts] = useState(!isView);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const selectedCount = selectedAccounts?.length || 0;
  const { hasPermission } = usePermission();
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
      setAlertConfig({
        isVisible: true,
        description: `${updateState.recCount} ${t('orgManagement.messages.accountlinkSuccess')}`,
        type: 'success'
      });
      const timer = setTimeout(() => {
        handleAlertClose;
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [updateState.isSuccess, location.pathname, location.state]);

  const handleAlertClose = () => {
    setAlertConfig(null);
  };

  const { mutate } = useMutation(async ({ payload }) => {
    const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${orgId}/accounts`;
    const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);
    return res.data;
  });

  const addNewAccountsClick = () => {
    if (selectedAccounts?.length <= 0) {
      setAlertConfig({
        isVisible: true,
        description: `Select at least on account`,
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
          if (!isView) {
            navigate(RoutePaths.pathOrgManagement, { state: { isSuccess: true } });
          } else {
            setUpdateState({ isSuccess: isView ? true : false, recCount: selectedCount });
            handleCancel();
          }
        },
        onError: (error) => {
          setAlertConfig({
            isVisible: true,
            description: `Failed to add accounts: ${error.message}`,
            type: 'error'
          });
        }
      }
    );
  };

  const handleCancel = () => {
    if (isView) {
      setSelectedAccounts([]);
      setAddNewAccounts(false);
      scrollToTopUtil();
    } else {
      navigate(`../${InternalPaths.editOrg}/${orgId}`, { state: data }, true);
    }
  };

  const onRemoveAccount = useCallback(
    (item) => {
      setSelectedAccounts(selectedAccounts.filter((account) => account.id !== item.id));
    },
    [selectedAccounts, setSelectedAccounts]
  );

  const onEditAccounts = () => {
    setAddNewAccounts(true);
    scrollToTopUtil();
  };
  return (
    <div className="viewOrg-container">
      {isLoading && <Loader type={'screen'} />}

      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={goBack} size="md">
          {t('orgManagement.back.organization')}
        </Button>
      </div>
      {/* {!isView && (
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
      )} */}
      {!addNewAccounts && (
        <ModuleHeader heading={<Heading as="h1">{t('orgManagement.create_org.org-details')}</Heading>} style={{ marginBottom: '16px' }} />
      )}

      {isView && !addNewAccounts && data && (
        <div className="details-view-container">
          <DetailsView
            data={data}
            onEditClick={() => navigate(`../${InternalPaths.editOrg}/${orgId}`, { state: { ...data, isEdit: true } }, true)}
          />
        </div>
      )}
      <ModuleHeader
        heading={<Heading as="h1">{addNewAccounts ? t('orgManagement.select_account') : t('orgManagement.link')}</Heading>}
        controls={
          !addNewAccounts && (
            <div className="controls">
              {hasPermission(PERMISSIONS_ENUM.ORGANIZATION_MANAGEMENT.EDIT_ORGANIZATION) && (
                <Button Icon={EditPencil} variant="secondary" className="button-icon" onClick={onEditAccounts} size={'md'}>
                  {t(isView ? 'orgManagement.table.action.edit' : 'orgManagement.add.account')}
                </Button>
              )}
            </div>
          )
        }
        style={{ marginBottom: '16px' }}
      />
      {(updateState.isSuccess || alertConfig?.isVisible) && (
        <Alert type={alertConfig.type} description={alertConfig.description} onClose={handleAlertClose} duration={10000} />
      )}
      <OrganizationAccounts
        showSelectedAccounts={addNewAccounts}
        omitColumns={addNewAccounts ? ['action'] : ['distributionChannel']}
        selectedRows={selectedAccounts}
        setSelectedRows={(newAccounts) => setSelectedAccounts(newAccounts)}
        practiceId={addNewAccounts ? null : orgId}
      />

      {addNewAccounts && (
        <div className="btn-box">
          <Button size="md" variant="secondary" onClick={handleCancel}>
            {t('orgManagement.button.back')}
          </Button>
          <Button size="md" onClick={addNewAccountsClick}>
            {t(isView ? 'orgManagement.add.account' : 'orgManagement.create_org')}
          </Button>
        </div>
      )}
    </div>
  );
}
