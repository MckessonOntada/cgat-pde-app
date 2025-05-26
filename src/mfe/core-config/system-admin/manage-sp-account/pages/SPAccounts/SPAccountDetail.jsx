import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import { Button, Heading, Alert, Loader } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import ModuleHeader from '@src/components/module-header';
import { useQuery } from 'react-query';
import AuthUtils from '@src/util/AuthUtils';
import CommonUtils, { getFullName } from '@src/util/CommonUtils.js';
import { routeConstants } from '../../routes/constants';
import DetailSegment from '@src/components/DetailSegment';
import { useOrgAccountSelectionContext } from '@src/mfe/core-config/system-admin/manage-questionnaire/components/orgAccountSelection/context/OrgAccountSelectionContext';
import ShippingLocationsDataTable from '../ShippingLocations/ShippingLocationsDataTable';
import { ShippingLocationProvider } from '../../context/ShippingLocationContext';
import { LinkProviderProvider } from '../../context/LinkProviderContext';
import AccountService from '@src/api/commonService/AccountService';
import SPAccountConfigurations from './SPAccountConfigurations';
import LinkProviderListing from '../LinkProvider/LinkProviderListing';
import { getAddress } from '../../../manage-questionnaire/util';

const SPAccountDetail = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { spAccountId } = useParams();

  const location = useLocation();
  const [alert, setAlert] = useState(null);
  const { isUpdate, isCreate } = location.state || {};
  const isCustomerCenter = AuthUtils.isCustomerCenter();
  const { setSelectedOrganization, selectedOrganization, organizationOptions } = useOrgAccountSelectionContext();

  const practiceId = AuthUtils.getPracticeId() || null;
  const organizationId = selectedOrganization?.id || practiceId;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orgId = queryParams.get('orgId');

    if (orgId && organizationOptions.length > 0 && (!selectedOrganization || selectedOrganization.id !== orgId)) {
      const matchedOrg = organizationOptions.find((org) => org.id === Number(orgId));
      if (matchedOrg) {
        setSelectedOrganization(matchedOrg);
      }
    }
  }, [location.search, organizationOptions]);

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['Account', spAccountId],
    queryFn: async () => AccountService.getAccountListConfigurationById(spAccountId, organizationId),
    enabled: !!spAccountId ? true : false,
    refetchOnWindowFocus: false,
    onError: (error) => {}
  });

  useEffect(() => {
    if (isUpdate) {
      setAlert({
        type: 'success',
        message: t('manageSPAccount.message.updatesuccess')
      });
      navigate(`${location.pathname}${location.search}`, {
        replace: true,
        state: {}
      });
    }
    if (isCreate) {
      setAlert({
        type: 'success',
        message: t('manageSPAccount.message.addsuccess')
      });
      navigate(`${location.pathname}${location.search}`, {
        replace: true,
        state: {}
      });
    }
  }, [location.state, location.pathname, navigate]);

  const handleAlertClose = () => {
    setAlert({ type: null, message: null });
  };

  const goBack = () => {
    navigate(!practiceId ? '/system-admin/config/manage-sp-account' : '/admin/linked-accounts', {
      state: { isSuccess: true }
    });
  };

  if (isLoading) {
    return <Loader type={'screen'} />;
  }

  const { accountName = '', accountNumber = '', name = {}, address = {} } = data.account || data;

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={goBack} size="md">
          {!practiceId ? t('manageSPAccount.BacktoPage') : t('Back to Manage Linked Accounts')}
        </Button>
      </div>
      {alert && alert.type && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} duration={10000} />}
      <div className="MCP-module-body">
        <ModuleHeader heading={<Heading as="h1">{t('manageSPAccount.heading.spAccountDetails')}</Heading>} />
        <ModuleHeader
          heading={
            <div className="subheader-text">
              <Heading as="h2">{t('manageSPAccount.heading.AccountDetails')}</Heading>
            </div>
          }
          controls={
            !isCustomerCenter &&
            !practiceId && (
              <Button
                Icon={EditPencil}
                variant="secondary"
                className="button-icon"
                size="md"
                onClick={() =>
                  navigate(`../${routeConstants.EDIT_SPACCOUNT}/${spAccountId}?orgId=${organizationId}`, {
                    state: { isEdit: true }
                  })
                }>
                {t('manageSPAccount.heading.editSPAccountdetails')}
              </Button>
            )
          }
        />

        <div className="MCP-CardContainer">
          <div className={`grid grid-gap-24 grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4`}>
            <DetailSegment label={t('manageSPAccount.labels.accountNumber')} value={accountNumber || '-'} />
            <DetailSegment label={t('manageSPAccount.labels.accountName')} value={accountName || '-'} />
            <DetailSegment label={t('manageSPAccount.labels.accountAddress')} value={getAddress(address) || '-'} />
            <DetailSegment label={t('manageSPAccount.labels.contactPerson')} value={getFullName(name) || '-'} />
            <DetailSegment label={t('manageSPAccount.labels.emaild')} value={address.email || '-'} />
            <DetailSegment label={t('manageSPAccount.labels.phoneNumber')} value={CommonUtils.formatPhoneNumber(address.telephone) || '-'} />
            <DetailSegment label={t('manageSPAccount.labels.fax')} value={address.fax || '-'} />
          </div>
        </div>
      </div>
      <div className="MCP-module-body">
        <ShippingLocationProvider accountId={spAccountId}>
          <ShippingLocationsDataTable />
        </ShippingLocationProvider>
      </div>
      <div className="MCP-module-body">
        <LinkProviderProvider>
          <LinkProviderListing />
        </LinkProviderProvider>
      </div>
      {data?.questionnaireList?.length > 0 && (
        <div className="MCP-module-body">
          <SPAccountConfigurations data={data} refetch={refetch} orgAdmin={!!practiceId} />
        </div>
      )}
    </div>
  );
};

export default SPAccountDetail;
