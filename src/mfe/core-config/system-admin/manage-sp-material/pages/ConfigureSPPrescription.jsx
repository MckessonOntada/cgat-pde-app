import React from 'react';
import styles from '@src/mfe/core-config/system-admin/manage-material/assets/styles/ConfigureMaterials.module.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { Button } from '@mckesson/mcp-component-library';
import { useMutation, useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import FloatingDrawer from '@src/components/floating-drawer';
import { useSPMaterial } from '../context/SPMaterialContext';
import { Field, Form, Formik } from 'formik';
import Components from '@src/components/form/Components';
import { initialValuesforPrescription, validationSchemaforPrescription } from './util';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';
import MaterialService from '@src/api/commonService/MaterialService';

function ConfigureSPPrescription({ onClose, onSuccess, onError }) {
  const { t } = useTranslate();
  const { selectedSPMaterial, refreshData, setSelectedSPMaterial } = useSPMaterial();
  const [selectedMaterial] = selectedSPMaterial || [];

  const requestParams = {
    channelType: CHANNEL_TYPE.SPECIALTY_PHARMA
  };
  const {
    isLoading,
    isError,
    data: prescriptionDetails
  } = useQuery({
    queryKey: ['SPMaterial', selectedMaterial.materialNumber],
    queryFn: async () => {
      const result = await MaterialService.getSPMaterialById(selectedMaterial.materialNumber, requestParams);
      return result?.spTherapyConfig;
    },
    enabled: !!selectedMaterial.materialNumber ? true : false,
    refetchOnWindowFocus: false
  });

  const mapPrescriptionDetailsToInitialValues = (data) => ({
    prescriptionDetailsRequired: data?.isPrescriptionDetailsRequired ? 'yes' : 'no',
    quantity: data?.quantity ?? '',
    daysSupply: data?.daysSupply ?? '',
    refills: data?.refills ?? '',
    instructions: data?.instructions ?? ''
  });

  const initialValues = React.useMemo(() => {
    return prescriptionDetails ? mapPrescriptionDetailsToInitialValues(prescriptionDetails) : initialValuesforPrescription;
  }, [prescriptionDetails]);

  const { mutate: applyConfiguration } = useMutation(
    async (configValues) => {
      return await HttpResourceService.callRest(`${ApiRoutes.CONFIGURE_SP_MATERIALS()}/update`, httpVerb.POST, configValues);
    },
    {
      onSuccess: () => {
        onSuccess();
        onClose();
        refreshData();
        setSelectedSPMaterial([]);
      },
      onError: () => {
        onError();
        onClose();
      }
    }
  );

  const getOptions = (keyPrefix = '') => {
    return ['Yes', 'No'].map((option, index) => ({
      key: `${keyPrefix}-option-${index}`,
      label: option,
      value: option.toLowerCase(),
      isDisabled: false
    }));
  };

  const formFields = [
    {
      label: t('labels.quantity'),
      type: 'input',
      name: 'quantity',
      isRequired: true,
      maxLength: 2
    },
    {
      label: t('labels.daysSupply'),
      type: 'input',
      name: 'daysSupply',
      isRequired: true,
      maxLength: 2
    },
    {
      label: t('labels.refills'),
      type: 'input',
      name: 'refills',
      isRequired: true,
      maxLength: 2
    },
    {
      label: t('labels.instructions'),
      name: 'instructions',
      type: 'textarea',
      isRequired: true,
      maxLength: 5000
    }
  ];

  const handleApplyConfiguration = (values) => {
    const configValues = {
      spProductIds: selectedSPMaterial.map((material) => material.materialNumber),
      isPrescriptionDetailsRequired: values.prescriptionDetailsRequired === 'yes',
      quantity: values.quantity,
      daysSupply: values.daysSupply,
      refills: values.refills,
      instructions: values.instructions
    };
    applyConfiguration(configValues);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchemaforPrescription(t)}
      enableReinitialize
      onSubmit={(values) => {
        handleApplyConfiguration(values);
      }}>
      {({ values, setFieldValue, setFieldTouched }) => {
        return (
          <Form>
            <FloatingDrawer
              open={true}
              anchor="right"
              onClose={onClose}
              heading={t('manageMaterial.drawer.configuration.heading')}
              controls={
                <div className="controls">
                  <Button
                    label={t('manageMaterial.drawer.controls.cancel')}
                    onClick={onClose}
                    variant="secondary"
                    size="md"
                    aria-label={t('manageMaterial.drawer.controls.cancel')}
                  />
                  <Button
                    label={t('manageMaterial.drawer.controls.apply')}
                    type="submit"
                    variant="primary"
                    size="md"
                    aria-label={t('manageMaterial.drawer.controls.apply')}
                  />
                </div>
              }>
              <div className={styles.wrapper}>
                <div className={styles.body}>
                  <div className={`${styles.formControls} ${styles.removeBorder}`}>
                    {formFields
                      .filter((field) => field.type === 'radioGroup')
                      .map((field, index) => (
                        <div className={styles.formField} key={index}>
                          <Field
                            id={field.name}
                            name={field.name}
                            caption={field.label}
                            isRequired={field.isRequired}
                            component={Components[field.type]}
                            items={getOptions(field.name)}
                            size="lg"
                            onChangeValue={(value, form) => {
                              setFieldValue(field.name, value);
                              if (value === 'no') {
                                formFields
                                  .filter((f) => f.type !== 'radioGroup')
                                  .forEach((f) => {
                                    setFieldValue(f.name, '');
                                    setFieldTouched(f.name, false);
                                  });
                              }
                            }}
                          />
                        </div>
                      ))}

                    {formFields
                      .filter((field) => field.type !== 'radioGroup')
                      .map((field, index) => (
                        <div className={styles.formField} key={index}>
                          <Field
                            id={field.name}
                            name={field.name}
                            maxLength={field.maxLength}
                            label={field.label}
                            placeholder=" "
                            isRequired={values.prescriptionDetailsRequired === 'yes' ? true : false}
                            isReadOnly={values.prescriptionDetailsRequired === 'no'}
                            component={Components[field.type]}
                            {...(field.type === 'textarea'
                              ? {
                                  fieldlabel: field.label,
                                  maxCharHelperText: t('forms.placeholder.max_5000_chars'),
                                  maxCharLimit: 5000,
                                  maxCharWarningLimit: 4900
                                }
                              : {})}
                          />
                        </div>
                      ))}
                  </div>
                  {/* )} */}
                </div>
              </div>
            </FloatingDrawer>
          </Form>
        );
      }}
    </Formik>
  );
}

export default ConfigureSPPrescription;
