import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import {
  Badge,
  Button,
  Heading,
  Alert,
  Loader
} from '@mckesson/mcp-component-library';
import { Formik, Form } from 'formik';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import ModuleHeader from '@src/components/module-header';
import { useOrgAccountSelectionContext } from '@src/mfe/order-management/components/orgAccountSelection/context/OrgAccountSelectionContext';
import {
  initialValuesforSPAccount,
  validationSchemaforSPAccount
} from '../../util';
import SPAccountFormSegment from './SPAccountFormSegment';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import { routeConstants } from '../../routes/constants';
import AccountService from '@src/api/commonService/AccountService';
import { handleApiError } from '@src/util/ApiUtils';
import { useMutation, useQuery } from 'react-query';

const AddSPAccount = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { spAccountId } = useParams();
  const location = useLocation();
  const [isDirty, setIsDirty] = React.useState(false);
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const [alert, setAlert] = useState(null);
  const { setSelectedOrganization, selectedOrganization, organizationOptions } =
    useOrgAccountSelectionContext();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orgId = queryParams.get('orgId');

    if (
      orgId &&
      organizationOptions.length > 0 &&
      (!selectedOrganization || selectedOrganization.id !== orgId)
    ) {
      const matchedOrg = organizationOptions.find(
        (org) => org.id === Number(orgId)
      );
      if (matchedOrg) {
        setSelectedOrganization(matchedOrg);
      }
    }
  }, [location.search, organizationOptions]);

  const {
    isLoading,
    data: selectedAccount,
    refetch
  } = useQuery({
    queryKey: ['Account', spAccountId],
    queryFn: async () =>
      AccountService.getAccountListById(spAccountId, selectedOrganization?.id),
    enabled: !!spAccountId ? true : false,
    refetchOnWindowFocus: false,
    onError: (error) => {}
  });

  const goBack = () => {
    navigate('/orders/system-configuration/manage-spaccount', {
      state: { isSuccess: true }
    });
  };

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      practiceId: selectedOrganization?.id
    };

    saveOrUpdateSPAccount({
      payload,
      isEdit: !!spAccountId,
      spAccountId
    });
  };
  const handleError = (err) => {
    const errorKey = handleApiError(err);
    setAlert({ type: 'error', message: t(errorKey) });
  };

  const { isLoading: isSavingOrUpdating, mutate: saveOrUpdateSPAccount } =
    useMutation(
      async ({ payload, isEdit, spAccountId }) => {
        if (isEdit) {
          return await AccountService.updateSPAccount(payload, spAccountId);
        } else {
          return await AccountService.saveSPAccountDetails(payload);
        }
      },
      {
        onSuccess: (result, variables) => {
          const { isEdit, spAccountId } = variables;
          const idToRedirect = isEdit ? spAccountId : result?.id;
          const redirectPath = `../${routeConstants.VIEW_SPACCOUNT.replace(
            ':spAccountId',
            idToRedirect
          )}?orgId=${selectedOrganization?.id}`;
          const state = isEdit ? { isUpdate: true } : { isCreate: true };
          navigate(redirectPath, { state });
        },
        onError: handleError
      }
    );

  const handleCancel = () => {
    if (!!spAccountId) {
      isDirty
        ? setModalSuccessCallback('details')
        : navigate(
            `../${routeConstants.VIEW_SPACCOUNT.replace(
              ':spAccountId',
              spAccountId
            )}?orgId=${selectedOrganization?.id}`
          );
    } else {
      isDirty
        ? setModalSuccessCallback('list')
        : navigate('/orders/system-configuration/manage-spaccount');
    }
  };

  const handleAlertClose = () => {
    setAlert({ type: null, message: null });
    navigate(location.pathname, {
      replace: true,
      state: { ...location.state, isSuccess: false }
    });
  };

  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      navigate('/orders/system-configuration/manage-spaccount');
    } else if (modalSuccessCallback === 'details') {
      const redirectPath = `../${routeConstants.VIEW_SPACCOUNT.replace(
        ':spAccountId',
        idToRedirect
      )}?orgId=${selectedOrganization?.id}`;
      navigate(redirectPath);
    }
  };

  if (isLoading) {
    <Loader type="screen" />;
  }

  return (
    <>
      {isSavingOrUpdating && <Loader type="screen" />}
      <div className="MCP-module-wrapper">
        <div>
          <Button
            className="back-button-control"
            variant="tertiary"
            Icon={() => <IconArrowLeft />}
            onClick={goBack}
            size="md">
            {t('manageSPAccount.BacktoPage')}
          </Button>
        </div>

        <div className="MCP-module-body">
          <ModuleHeader
            heading={
              <Heading as="h1">
                {t(
                  spAccountId
                    ? 'manageSPAccount.heading.editSPAccount'
                    : 'manageSPAccount.heading.addSPAccount'
                )}
              </Heading>
            }
            controls={
              <Heading as="h2">{`${t(
                'manageSPAccount.heading.organization'
              )} - ${selectedOrganization?.name}`}</Heading>
            }
          />
          {alert && alert.type && (
            <Alert
              description={alert.message}
              onClose={handleAlertClose}
              type={alert.type}
              duration={10000}
            />
          )}
          <Formik
            initialValues={initialValuesforSPAccount(selectedAccount)}
            validationSchema={validationSchemaforSPAccount(t)}
            enableReinitialize
            onSubmit={(values, actions) => {
              handleSubmit(values);
            }}>
            {({ values, isValid, dirty }) => {
              useEffect(() => {
                setIsDirty(dirty);
              }, [dirty]);
              return (
                <Form>
                  <div className="MCP-panel-container">
                    <SPAccountFormSegment spAccountId={spAccountId} />
                  </div>
                  <div className={'buttonGroup'}>
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={handleCancel}
                      size={'md'}>
                      {t('manageSPAccount.button.cancel')}
                    </Button>

                    <Button type="submit" size={'md'}>
                      {t(
                        spAccountId
                          ? 'manageSPAccount.button.save'
                          : 'manageSPAccount.button.create'
                      )}
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
          <DiscardChangesModal
            heading={t('messages.confirmation.discard')}
            description={t('messages.confirmation.cancel')}
            isOpen={Boolean(modalSuccessCallback)}
            onClose={() => setModalSuccessCallback(null)}
            onConfirm={handleNavigate}
          />
        </div>
      </div>
    </>
  );
};

export default AddSPAccount;
