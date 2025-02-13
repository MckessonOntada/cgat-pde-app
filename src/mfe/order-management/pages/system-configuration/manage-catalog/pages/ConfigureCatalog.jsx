import React, { useState } from 'react';
import FloatingDrawer from '@src/components/floating-drawer';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import Components from '@src/components/form/Components';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/delete-icon.svg';
import { ReactComponent as IconClose } from '@src/assets/svg/cross.svg';
import { Loader, Heading, Button } from '@mckesson/mcp-component-library';
import '../manageCatalog.scss';
import { useMutation } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import * as Yup from 'yup';
import useSnackbar from '@src/hooks/useSnackbar';
import { useTranslate } from '@src/translations/useTranslation';

const validationSchema = Yup.object().shape({
  steps: Yup.array().of(
    Yup.object().shape({
      stepName: Yup.string().required('Step name is required'),
      description: Yup.string()
    })
  )
});

function ConfigureCatalog({ openConfigurationDraw, setOpenConfigurationDraw, selectedCatalogs, setSelectedCatalogs, showAlert }) {
  const [initialValues, setInitialValues] = useState({
    steps: [
      {
        stepName: '',
        description: ''
      }
    ]
  });
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const { mutate, isLoading, isError, data } = useMutation(
    async (payload) => {
      const apiUrl = `${ApiRoutes.GET_CATALOG_DATA()}/configure`;
      const res = await HttpResourceService.callRest(apiUrl, httpVerb.POST, payload);
      return res;
    },
    {
      onSuccess: (response) => {
        setOpenConfigurationDraw(false);
        setSelectedCatalogs([]);
        // showSnackbar({ description: 'Catalog configured successfully', type: 'success' });
        showAlert('success', 'Catalog configured successfully');
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
    mutate(payload);
  };

  return (
    <React.Fragment>
      {openConfigurationDraw && (
        <FloatingDrawer open={openConfigurationDraw} anchor="right" onClose={handleCloseDrawer}>
          <div>
            <div className="header">
              <div className='styled-heading'>
                <Heading as="h3">{t('ManageCatalog.Configurations')}</Heading>
              </div>
              <Button textButton onClick={handleCloseDrawer}>
                <IconClose />
              </Button>
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
                        <div className="styled-heading">
                          <Heading as="h4">{t('ManageCatalog.WhatToExpectNext')}</Heading>
                        </div>
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
                                <p className='inputTextDesc'>{t('ManageCatalog.input.validation.text')}</p>
                              </div>
                            </div>
                          ))}
                        <div className='add-step'>
                          <Button label="Tertiary" onClick={() => push({ stepName: '', description: '' })} variant="tertiary">
                            {t('ManageCatalog.ADDSTEP')}
                          </Button>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                  <div className="configure-footer">
                    <Button label="secondary" variant="secondary" onClick={handleCloseDrawer}>
                      {t('ManageCatalog.Button.Cancel')}
                    </Button>
                    <Button label="Primary" type="submit">
                      {t('ManageCatalog.Button.save')}
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
