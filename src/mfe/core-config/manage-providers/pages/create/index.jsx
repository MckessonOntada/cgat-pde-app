import React from 'react';
import { Formik, Form } from 'formik';
import { Button, Heading, Alert } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import ProviderService from '@src/api/commonService/ProviderService';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import { useNavigate, useParams } from 'react-router-dom';
import { providerSchema } from '../../forms/provider.schema';
import FormRenderer from '../../forms/FormRenderer';
import { sections } from '../../forms/provider.config';

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
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { items, add, remove } = useTimedArray(10000);
  const { id } = useParams();
  const [initialValues, setInitialValues] = React.useState(INITIAL_VALUES);
  React.useEffect(() => {
    if (id) {
      ProviderService.getProviderDetailsById(id)
        .then((result) => {
          setInitialValues(result);
        })
        .catch((error) => {});
    }
  }, []);
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
        .catch((error) => {
          add({
            description: error.message,
            type: 'error'
          });
        });
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
        .catch((error) => {
          add({
            description: error.message,
            type: 'error'
          });
        });
    }
  };

  return (
    <div>
      <Formik
        validationSchema={providerSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize={true}>
        <Form>
          <div className="MCP-module-wrapper">
            <div className="MCP-module-body">
              <Heading as="h1">
                {isEditOperation ? 'Edit Provider' : 'Add Provider'}
              </Heading>
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
                <FormRenderer sections={sections} />
              </div>
              <div className="controls">
                <Button
                  type="submit"
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    navigate(-1);
                  }}>
                  Cancel
                </Button>
                <Button type="submit" size="md">
                  {isEditOperation ? 'Update Provider' : 'Create Provider'}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default ProviderForm;
