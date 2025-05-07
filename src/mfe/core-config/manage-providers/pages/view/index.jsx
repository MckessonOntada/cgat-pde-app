import React from 'react';
import { Button, Heading, Alert } from '@mckesson/mcp-component-library';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as SpinnerIcon } from '@src/assets/svg/spinner.svg';
import { ReactComponent as EditIcon } from '@src/assets/image/edit_pencil.svg';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle.svg';
import ProviderService from '@src/api/commonService/ProviderService';
import CommonUtils from '@src/util/CommonUtils';
import DetailSegment from '@src/components/DetailSegment';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PermittedComponent from '@src/components/permitted-component';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import usePermission from '@src/hooks/usePermissions';

const ProviderDetails = () => {
  const { id } = useParams();
  const { t } = useTranslate();
  const navigate = useNavigate();
  const {
    data,
    isLoading: isProviderDetailsLoading,
    isFetching: isProviderDetailsFetching,
    isError: isProviderDetailsError,
    error: providerDetailsError
  } = useQuery({
    queryKey: ['provider', 'details', id],
    queryFn: ProviderService.getProviderDetailsById.bind(null, id),
    enabled: Boolean(id)
  });

  const {
    data: linkedSpAccounts,
    isLoading: isLinkedAccountsLoading,
    isFetching: isLinkedAccountsFetching,
    isError: isLinkedAccountsError,
    error: linkedAccountError
  } = useQuery({
    queryKey: ['providers', 'sp-linked-accounts', id],
    queryFn: async () => {
      throw new Error('No data found');
    },
    enabled: Boolean(id)
  });
  const { hasPermission } = usePermission();

  const canEditDetails = hasPermission(
    PERMISSIONS_ENUM.MANAGE_PROVIDERS.EDIT_PROVIDER
  );

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={() => navigate(`/admin/providers`)}
          size="md">
          {t('provider.btnBackToProviders')}
        </Button>
      </div>
      <Heading as="h1">{t('provider.providerDetails')}</Heading>
      <div className="MCP-module-body">
        <div className="MCP-module-body">
          <ModuleHeader
            heading={
              <Heading as="h2">{t('provider.providerInformation')}</Heading>
            }
            controls={
              <Button
                variant="secondary"
                size="md"
                Icon={EditIcon}
                onClick={() => navigate(`../${id}/edit`)}
                disabled={
                  isProviderDetailsLoading ||
                  isProviderDetailsFetching ||
                  isProviderDetailsError ||
                  !canEditDetails
                }>
                {t('provider.btnEditProviderDetails')}
              </Button>
            }
          />
          {isProviderDetailsError && providerDetailsError ? (
            <Alert
              description={providerDetailsError.message}
              type={'error'}
              duration={0}
              showCloseIcon={false}
            />
          ) : (
            <div className="MCP-CardContainer">
              {isProviderDetailsLoading || isProviderDetailsFetching ? (
                <div className="spinner-wrapper md">
                  <SpinnerIcon />
                </div>
              ) : (
                <DetailsPanel details={data} />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h2">{t('provider.linkedSpAccounts')}</Heading>}
          controls={
            <Button
              variant="secondary"
              size="md"
              Icon={AddCircleFilled}
              disabled={
                isLinkedAccountsLoading ||
                isLinkedAccountsFetching ||
                isLinkedAccountsError
              }>
              {t('provider.btnLinkSpAccounts')}
            </Button>
          }
        />
        {isLinkedAccountsError && linkedAccountError ? (
          <Alert
            description={linkedAccountError.message}
            type={'error'}
            duration={0}
            showCloseIcon={false}
          />
        ) : (
          <div className="MCP-CardContainer">
            {isLinkedAccountsLoading || isLinkedAccountsFetching ? (
              <div className="spinner-wrapper md">
                <SpinnerIcon />
              </div>
            ) : (
              <div>Linked Accounts</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDetails;

const DetailsPanel = ({ details }) => {
  const { t } = useTranslate();

  const providerDetails = {
    name: CommonUtils.getFullName({
      firstName: details.firstName,
      middleName: details.middleName,
      lastName: details.lastName
    }),
    deaNumber: details.deaNumber,
    npiNumber: details.npiNumber,
    address: CommonUtils.getAddress({
      address1: details.address1,
      address2: details.address2,
      city: details.city,
      state: details.state,
      zipCode: details.zipCode
    }),
    phoneNumber: details.phoneNumber
  };

  return (
    <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start">
      {Object.entries(providerDetails).map(([key, value], index) => {
        return (
          <DetailSegment
            key={index}
            label={t(`provider.${key}`)}
            value={value || '-'}
          />
        );
      })}
    </div>
  );
};
