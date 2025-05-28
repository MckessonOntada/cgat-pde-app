import React, { useEffect } from 'react';
import { Button, Heading, Loader } from '@mckesson/mcp-component-library';
import { useMutation, useQuery } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import { LinkSpAccountProvider } from '../../context/LinkSpAccountContext';
import SpAccountTable from '../link/SpAccountTable';
import LinkProviderService from '@src/api/commonService/LinkProviderService';
import AuthUtils from '@src/util/AuthUtils';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import Alert from '@src/components/cgat-alert/Alert';

const ProviderDetails = () => {
  const { id } = useParams();
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const practiceId = AuthUtils.getPracticeId();
  const {
    items: notifications,
    add: addNotification,
    remove: removeNotification
  } = useTimedArray(10000);
  useEffect(() => {
    if (location.state?.type && location.state?.messages) {
      addNotification({
        type: location.state.type,
        description: location.state.messages
      });
      navigate(`${location.pathname}${location.search}`, {
        replace: true,
        state: null
      });
    }
  }, [location, navigate]);
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

  const { hasPermission } = usePermission();

  const canEditDetails = hasPermission(
    PERMISSIONS_ENUM.MANAGE_PROVIDERS.EDIT_PROVIDER
  );

  const { isLoading: unlinkLoading, mutate: handleUnlinkSpAccount } =
    useMutation(
      async (spAccountId) => {
        return await LinkProviderService.removeLinkProvider(
          practiceId,
          spAccountId[0].accountNumber,
          [id]
        );
      },
      {
        onSuccess: () => {
          addNotification({
            type: 'success',
            description: t('provider.sp.account.unlinkSuccessfully')
          });
        },
        onError: () => {
          addNotification({
            type: 'error',
            description: t('provider.sp.account.unabletounlink')
          });
        }
      }
    );
  if (unlinkLoading) {
    return <Loader type={'screen'} />;
  }
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
              onClick={() =>
                navigate(`../link-sp-accounts?accounts=${id}&isEdit=true`)
              }
              Icon={AddCircleFilled}>
              {t('provider.btnLinkSpAccounts')}
            </Button>
          }
        />
        {notifications?.length > 0 && (
          <div className="alert-container">
            <div className="MCP-module-body">
              {notifications.map((item, index) => (
                <Alert
                  key={item.id}
                  description={item.description}
                  onClose={() => removeNotification(item.id)}
                  type={item.type}
                />
              ))}
            </div>
          </div>
        )}
        <LinkSpAccountProvider>
          <SpAccountTable
            isAddSpAccount={false}
            handleUnlinkSpAccount={handleUnlinkSpAccount}
          />
        </LinkSpAccountProvider>
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
