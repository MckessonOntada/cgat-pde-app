import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import { Badge, Button, Heading, Switch, Alert, Modal, CheckboxGroup, IconButton, Loader } from '@mckesson/mcp-component-library';

import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import ModuleHeader from '@src/components/module-header';
import { useQuery, useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import CommonUtils from '@src/util/CommonUtils.js';
import { RoutePaths } from '@src/routes/constants';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import UserAccounts from '@src/components/Accounts/Accounts';
import PermittedComponent from '@src/components/permitted-component';
import { routeConstants } from '../routes/constants';
import DetailSegment from '@src/components/DetailSegment';
import { useOrgAccountSelectionContext } from '@src/mfe/order-management/components/orgAccountSelection/context/OrgAccountSelectionContext';
import SPAccountService from '@src/api/commonService/SPAccountService';
import ShippingLocationsDataTable from './ShippingLocationsDataTable';
import { ShippingLocationProvider } from '../context/ShippingLocationContext';

const SPAccountDetail = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { spAccountId } = useParams();
  const { selectedOrganization } = useOrgAccountSelectionContext();
  const practiceId = selectedOrganization?.id;
  const location = useLocation();

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['Account', spAccountId],
    queryFn: async () => SPAccountService.getSPAccountListById(spAccountId, selectedOrganization?.id),
    enabled: !!spAccountId ? true : false,
    refetchOnWindowFocus: false,
    onError: (error) => {}
  });

  const goBack = () => {
    navigate('/orders/system-configuration/manage-spaccount');
  };

  if (isLoading) {
    return <Loader type={'screen'} />;
  }
  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={goBack} size="md">
          {t('manageSPAccount.BacktoPage')}
        </Button>
      </div>

      <div className="MCP-module-body">
        <ModuleHeader heading={<Heading as="h1">{t('manageSPAccount.heading.spAccountDetails')}</Heading>} />
        <ModuleHeader
          heading={
            <div className="subheader-text">
              <Heading as="h2">{t('manageSPAccount.heading.AccountDetails')}</Heading>
            </div>
          }
          controls={
            <Button
              Icon={EditPencil}
              variant="secondary"
              className="button-icon"
              size="md"
              onClick={() => navigate(`../${routeConstants.EDIT_SPACCOUNT}/${spAccountId}`, { state: { isEdit: true } })}>
              {t('manageSPAccount.heading.editSPAccountdetails')}
            </Button>
          }
        />

        <div className="MCP-CardContainer">
          <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-3`}>
            <DetailSegment label={t('manageSPAccount.labels.accountNumber')} value={data.accountNumber || '-'} />
            <DetailSegment label={t('manageSPAccount.labels.accountName')} value={data.accountName || '-'} />
            <DetailSegment label={t('manageSPAccount.labels.accountAddress')} value={data.accountName || '-'} />
            <DetailSegment label={t('manageSPAccount.labels.contactPerson')} value={data.accountName || '-'} />
            <DetailSegment label={t('manageSPAccount.labels.emaild')} value={data?.emailId || '-'} />
            <DetailSegment label={t('manageSPAccount.labels.phoneNumber')} value={data?.PhoneNo || '-'} />
            <DetailSegment label={t('manageSPAccount.labels.fax')} value={data?.Fax || '-'} />
          </div>
        </div>
      </div>
      <div className="MCP-module-body">
        <ShippingLocationProvider>
          <ShippingLocationsDataTable />
        </ShippingLocationProvider>
        <div className="MCP-CardContainer"></div>
      </div>
    </div>
  );
};

export default SPAccountDetail;
