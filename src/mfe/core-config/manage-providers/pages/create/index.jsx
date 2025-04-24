import React from 'react';
import { Formik, Form } from 'formik';
import { Button, Heading, Alert } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import ProviderService from '@src/api/commonService/ProviderService';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import { useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as SpinnerIcon } from '@src/assets/svg/spinner.svg';
import { getProviderSchema } from '../../forms/provider.schema';
import FormRenderer from '../../forms/FormRenderer';
import { sections } from '../../forms/provider.config';
import { useQuery } from 'react-query';
import AuthUtils from '@src/util/AuthUtils';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';

const INITIAL_VALUES = {
  firstName: '',
  middleName: '',
  lastName: '',
  deaNumber: '',
  npiNumber: '',
  address1: '',
  address2: '',
  city: '',
  zip: '',
  state: '',
  phoneNumber: ''
};

const ProviderForm = (props) => {
  const { values, isEditOperation } = props;
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { items, add, remove, removeAll } = useTimedArray(10000);
  const { id } = useParams();
  const [initialValues, setInitialValues] = React.useState(INITIAL_VALUES);
  const breadcrumbItems = React.useMemo(() => {
    return [
      {
        label: t('breadcrumb.admin'),
        url: isSystemAdminView ? '/' : '/admin'
      },
      {
        label: t('label.providers'),
        url: isSystemAdminView ? '/' : '/admin/providers'
      },
      {
        label: t(
          isEditOperation ? `provider.editProvider` : `provider.addProvider`
        )
      }
    ];
  }, [isSystemAdminView]);
  const {
    isFetching: isProviderDetailsFetching,
    isLoading: isProviderDetailsLoading,
    isError: isProviderDetailsError,
    error: providerDetailsError
  } = useQuery({
    queryKey: ['provider', 'provider-details', id],
    queryFn: ProviderService.getProviderDetailsById.bind(null, id),
    onSuccess: setInitialValues,
    enabled: isEditOperation
  });

  const handleSubmit = (values) => {
    const {
      firstName,
      middleName,
      lastName,
      deaNumber,
      npiNumber,
      phoneNumber,
      address1,
      address2,
      city,
      zip,
      state
    } = values;
    const payload = {
      name: {
        firstName,
        middleName,
        lastName
      },
      dea: deaNumber,
      npi: npiNumber,
      phone: phoneNumber,
      address: {
        address1,
        address2,
        city,
        state,
        zip
      }
    };
    removeAll();
    if (isEditOperation) {
      ProviderService.updateProvider(id, payload)
        .then((response) => {
          navigate('../', {
            state: {
              items: [
                {
                  description: 'Provider has been updated successfully.',
                  type: 'success'
                }
              ]
            }
          });
        })
        .catch(handleServerError);
    } else {
      ProviderService.addProvider(payload)
        .then((response) => {
          navigate('../', {
            state: {
              items: [
                {
                  description: 'Provider has been added successfully.',
                  type: 'success'
                }
              ]
            }
          });
        })
        .catch(handleServerError);
    }
  };

  const handleServerError = (error) => {
    const { response = {} } = error;
    const errorFromServer = response.data?.errorCodes;
    if (
      errorFromServer &&
      Array.isArray(errorFromServer) &&
      errorFromServer.length > 0
    ) {
      add({
        description: t(`serverResponse.${errorFromServer.sort().join('.')}`),
        type: 'error',
        isSticky: true
      });
    }
  };

  const isLoading = isProviderDetailsLoading || isProviderDetailsFetching;

  return (
    <div>
      <Formik
        validationSchema={getProviderSchema(t)}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize={true}>
        <Form>
          <div className="MCP-module-wrapper">
            <Breadcrumbs items={breadcrumbItems} />
            <Heading as="h1">
              {t(
                isEditOperation
                  ? `provider.editProvider`
                  : `provider.addProvider`
              )}
            </Heading>
            <div className="MCP-module-body">
              {isEditOperation && isProviderDetailsError ? (
                <Alert
                  description={providerDetailsError.message}
                  type={'error'}
                  duration={0}
                  showCloseIcon={false}
                />
              ) : (
                <React.Fragment>
                  {items && items.length > 0 && (
                    <div className="MCP-module-body">
                      {items.map(({ id, description, type }) => {
                        return (
                          <Alert
                            key={id}
                            description={description}
                            type={type}
                            onClose={() => remove(id)}
                          />
                        );
                      })}
                    </div>
                  )}
                  <div className="MCP-CardContainer">
                    {isEditOperation && isLoading ? (
                      <div className="spinner-wrapper md">
                        <SpinnerIcon />
                      </div>
                    ) : (
                      <FormRenderer sections={sections} />
                    )}
                  </div>
                  {(!isEditOperation || !isLoading) && (
                    <div className="controls">
                      <Button
                        type="submit"
                        variant="secondary"
                        size="md"
                        onClick={() => {
                          navigate(-1);
                        }}>
                        {t('provider.btnCancel')}
                      </Button>
                      <Button type="submit" size="md">
                        {t(
                          isEditOperation
                            ? 'provider.btnUpdateProvider'
                            : 'provider.btnCreateProvider'
                        )}
                      </Button>
                    </div>
                  )}
                </React.Fragment>
              )}
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default ProviderForm;
