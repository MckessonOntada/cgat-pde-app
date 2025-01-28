import React, { useState } from 'react';
import FloatingDrawer from '@src/components/floating-drawer';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import Components from '@src/components/form/Components';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import { ReactComponent as IconClose } from '@src/assets/svg/closeIcon.svg';
import { Loader, Heading, Button } from '@mckesson/mcp-component-library';
import '../manageCatalog.scss';
import { useMutation } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import * as Yup from 'yup';
import useSnackbar from '@src/hooks/useSnackbar';

const validationSchema = Yup.object().shape({
  steps: Yup.array().of(
    Yup.object().shape({
      stepName: Yup.string().required('Step name is required'),
      description: Yup.string()
    })
  )
});

function ConfigureCatalog({ openConfigurationDraw, setOpenConfigurationDraw, selectedCatalogs, setSelectedCatalogs }) {
  const [initialValues, setInitialValues] = useState({
    steps: [
      {
        stepName: '',
        description: ''
      }
    ]
  });
  const { showSnackbar } = useSnackbar();

  const { mutate, isLoading, isError, data } = useMutation(
    async (payload) => {
      const apiUrl = `${ApiRoutes.GET_CATALOG_DATA()}/configure`;
      const res = await HttpResourceService.callRest(apiUrl, httpVerb.POST, payload);
      // console.log('response..', res);
      return res;
    },
    {
      onSuccess: (response) => {
        setOpenConfigurationDraw(false);
        setSelectedCatalogs([]);
        showSnackbar({ description: 'Catalog configured successfully', type: 'success' });
      },
      onError: (error) => {
        setOpenConfigurationDraw(true);
        showSnackbar({ description: 'Error while configuring catalog', type: 'error' });
      }
    }
  );

  const handleCloseDrawer = () => {
    setOpenConfigurationDraw((state) => !state);
    setInitialValues({
      steps: [
        {
          stepName: '',
          description: ''
        }
      ]
    });
  };

  const onSubmitHandler = (values) => {
    let payload = {
      catalogConfigurationAttributes: selectedCatalogs.map((catalog) => ({
        sapMaterial: catalog.sapMaterial,
        soldToCustomer: catalog.soldToCustomer,
        shipToCustomer: catalog.shipToCustomer,
        variant: catalog.variant
      })),
      ...values
    };
    console.log(payload);
    mutate(payload);
  };

  return (
    <React.Fragment>
      {openConfigurationDraw && (
        <FloatingDrawer open={openConfigurationDraw} anchor="right" onClose={handleCloseDrawer}>
          <div>
            <div className="header">
              <Heading as="h2">{'Configure'}</Heading>
              <button onClick={handleCloseDrawer}>
                <IconClose />
              </button>
            </div>
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values) => onSubmitHandler(values)}>
              {({ values }) => (
                <Form className="configure-form">
                  <FieldArray name="steps">
                    {({ insert, remove, push }) => (
                      <div className="step-main-container">
                        <Heading as="h4">What to expect next ?</Heading>
                        {values.steps.length > 0 &&
                          values.steps.map((step, index) => (
                            <div className="step-container" key={index}>
                              <div className="stepName-container">
                                <div className="stepName">
                                  <Field
                                    name={`steps.${index}.stepName`}
                                    label={`Step ${index + 1}`}
                                    placeholder=" "
                                    isRequired
                                    component={Components['input']}
                                    maxLength={100}
                                  />
                                </div>
                                <div className="remove-icon">
                                  <DeleteIcon />
                                </div>
                              </div>

                              <div>
                                <Field
                                  name={`steps.${index}.description`}
                                  fieldlabel={`Description`}
                                  placeholder=" "
                                  isRequired={false}
                                  component={Components['textarea']}
                                  maxLength={100}
                                />
                              </div>
                            </div>
                          ))}
                        <div>
                          <Button label="Tertiary" onClick={() => push({ stepName: '', description: '' })} variant="tertiary">
                            + ADD STEP
                          </Button>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                  <div className="configure-footer">
                    <Button label="secondary" variant="secondary" onClick={handleCloseDrawer}>
                      CANCEL
                    </Button>
                    <Button label="Primary" type="submit">
                      SAVE CHANGES
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </FloatingDrawer>
      )}
    </React.Fragment>
  );
}
export default ConfigureCatalog;
