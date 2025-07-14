import React, { useState } from 'react';
import FloatingDrawer from '@src/components/floating-drawer';
import { Field, FieldArray, Form, Formik } from 'formik';
import Components from '@src/components/form/Components';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/delete-icon.svg';
import { Loader, Heading, Button } from '@mckesson/mcp-component-library';
import '../manageCatalog.scss';
import { useMutation } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import * as Yup from 'yup';
import { useTranslate } from '@src/translations/useTranslation';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';

const validationSchema = Yup.object().shape({
  steps: Yup.array().of(
    Yup.object().shape({
      stepName: Yup.string().required('Step name is required'),
      description: Yup.string()
    })
  )
});

function ConfigureCatalog({
  openConfigurationDraw,
  setOpenConfigurationDraw,
  selectedCatalogs,
  setSelectedCatalogs,
  showAlert,
  isSPCatalog,
  clearTableSelection
}) {
  const [initialValues, setInitialValues] = useState({
    steps: [
      {
        stepName: '',
        description: ''
      }
    ]
  });

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
        if (!isSPCatalog) {
          setSelectedCatalogs([]);
          showAlert('success', t('manageMaterial.drawer.controls.apply.success'));
        } else {
          clearTableSelection();
          showAlert({
            type: 'success',
            description: t('manageMaterial.drawer.controls.apply.success')
          });
        }
      },
      onError: (error) => {
        setOpenConfigurationDraw(true);
        showAlert({
          type: 'success',
          description: t('manageMaterial.drawer.controls.apply.error')
        });
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
    const catalogList = Array.isArray(selectedCatalogs) ? selectedCatalogs : Array.from(selectedCatalogs || []);
    let payload = {
      catalogConfigurationAttributes: Array.from(catalogList).map((catalog) => ({
        sapMaterial: catalog.catalogPrice.sapMaterial,
        soldToCustomer: catalog.catalogPrice.soldToCustomer,
        shipToCustomer: catalog.catalogPrice.shipToCustomer,
        variant: catalog.catalogPrice.variant
      })),
      ...values,
      channelType: catalogList?.[0]?.catalogPrice.channelType || CHANNEL_TYPE.BUY_AND_BILL
    };

    mutate(payload);
  };

  return (
    <React.Fragment>
      {openConfigurationDraw && (
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => onSubmitHandler(values)}>
          {({ values }) => (
            <Form className="configure-form">
              <FloatingDrawer
                open={openConfigurationDraw}
                anchor="right"
                onClose={handleCloseDrawer}
                heading={t('ManageCatalog.Configurations')}
                controls={
                  <div className="controls">
                    <Button label="secondary" variant="secondary" size="md" onClick={handleCloseDrawer}>
                      {t('ManageCatalog.Button.Cancel')}
                    </Button>
                    <Button label="Primary" size="md" type="submit">
                      {t('ManageCatalog.Button.save')}
                    </Button>
                  </div>
                }>
                <div>
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
                                <div className="styled-icon-button error-button remove-icon">
                                  <Button
                                    Icon={DeleteIcon}
                                    iconButton
                                    textButton
                                    size="lg"
                                    variant="tertiary"
                                    color="error"
                                    type="button"
                                    disabled={values.steps.length === 1}
                                    onClick={() => remove(index)}
                                  />
                                </div>
                              </div>

                              <div>
                                <Field
                                  name={`steps.${index}.description`}
                                  fieldlabel={`Description`}
                                  placeholder=" "
                                  isRequired={false}
                                  component={Components['textarea']}
                                  maxCharHelperText={t('ManageCatalog.input.validation.text')}
                                  maxCharLimit={5000}
                                  maxCharWarningLimit={4900}
                                />
                              </div>
                            </div>
                          ))}
                        <div className="add-step">
                          <Button label="Tertiary" onClick={() => push({ stepName: '', description: '' })} variant="tertiary">
                            {t('ManageCatalog.ADDSTEP')}
                          </Button>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </FloatingDrawer>
            </Form>
          )}
        </Formik>
      )}
    </React.Fragment>
  );
}
export default ConfigureCatalog;
