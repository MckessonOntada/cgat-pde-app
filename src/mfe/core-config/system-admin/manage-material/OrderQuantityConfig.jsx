import React from 'react';
import styles from '@src/mfe/core-config/system-admin/manage-material/assets/styles/ConfigureMaterials.module.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { Button, Loader } from '@mckesson/mcp-component-library';
import { useMutation, useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import FloatingDrawer from '@src/components/floating-drawer';
import { useManageMaterial } from '@src/mfe/core-config/system-admin/manage-material/context/ManageMaterialContext';
import { Field, Form, Formik } from 'formik';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';
import * as Yup from 'yup';
import Components from '@src/components/form/Components';
import OrderService from '@src/api/commonService/OrderService';
import Alert from '@src/components/cgat-alert/Alert';
import { useSPMaterial } from '../manage-sp-material/context/SPMaterialContext';

function OrderQuantityConfig({ channelType = CHANNEL_TYPE.BUY_AND_BILL, onClose, onSuccess, onError }) {
  const { t } = useTranslate();
  const [alert, setAlert] = React.useState(null);
  const { selectedMaterials, setSelectedMaterials, refetch } = useManageMaterial();
  const { selectedSPMaterial, setSelectedSPMaterial, refreshData } = useSPMaterial();
  const [initialValues, setInitialValues] = React.useState({
    minQuantity: '',
    maxQuantity: ''
  });

  const validationSchemaForOrderQuantity = (t) =>
    Yup.object({
      minQuantity: Yup.string()
        .required(t('manageMaterial.drawer.details.configuration.body.minQuantityRequired'))
        .matches(/^\d+$/, `${t('material.minQuantity')} ${t('manageMaterial.drawer.details.configuration.body.numericValidation')}`)
        .test(
          'min-quantity-range',
          `${t('material.minQuantity')} ${t('manageMaterial.drawer.details.configuration.body.rangeValidation', { min: 1, max: 99 })}`,
          (val) => {
            const num = parseInt(val, 10);
            return num >= 1 && num <= 99;
          }
        ),

      maxQuantity: Yup.string()
        .required(t('manageMaterial.drawer.details.configuration.body.maxQuantityRequired'))
        .matches(/^\d+$/, `${t('material.maxQuantity')} ${t('manageMaterial.drawer.details.configuration.body.numericValidation')}`)
        .test(
          'max-quantity-range',
          `${t('material.maxQuantity')} ${t('manageMaterial.drawer.details.configuration.body.rangeValidation', { min: 1, max: 99 })}`,
          (val) => {
            const num = parseInt(val, 10);
            return num >= 1 && num <= 99;
          }
        )
    });

  const { data: MaterialData, isLoading: isMaterialDataLoading } = useQuery({
    queryKey: ['therapyDetailsByTrade'],
    queryFn: async () => {
      const selectedMaterial = selectedMaterials[0];
      if (!selectedMaterial.tradeName) return;
      const result = await OrderService.getTherapyDetailsByTradeName2(selectedMaterial.tradeName);
      return result;
    },
    enabled:
      (channelType === CHANNEL_TYPE.BUY_AND_BILL && selectedMaterials?.length === 1) ||
      (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA && selectedSPMaterial?.length === 1),
    refetchOnWindowFocus: false
  });

  React.useEffect(() => {
    if (channelType === CHANNEL_TYPE.BUY_AND_BILL && selectedMaterials?.length === 1 && Array.isArray(MaterialData)) {
      const selectedNDC = selectedMaterials[0].ndc;
      const matchedMaterial = MaterialData.find((item) => item.materialConfig?.ndcNumber === selectedNDC);

      if (matchedMaterial) {
        const config = matchedMaterial.materialConfig;

        setInitialValues({
          minQuantity: config.minQuantity || '',
          maxQuantity: config.maxQuantity || ''
        });
      }
    } else if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA && selectedSPMaterial?.length === 1 && Array.isArray(MaterialData)) {
      const selectedNDC = selectedSPMaterial[0].ndcNumber;
      const matchedMaterial = MaterialData.find((item) => item.therapy?.ndcNumber === selectedNDC);

      if (matchedMaterial) {
        const config = matchedMaterial.spTherapyConfig;

        setInitialValues({
          minQuantity: config.minQuantity || '',
          maxQuantity: config.maxQuantity || ''
        });
      }
    }
  }, [MaterialData, selectedMaterials, selectedSPMaterial]);

  const { mutate: applyBnBConfiguration, isLoading: isApplyConfigurationLoading } = useMutation(
    async (configValues) => {
      return await HttpResourceService.callRest(`${ApiRoutes.CONFIGURE_SP_MATERIALS_UPDATE_QUANTITY()}`, httpVerb.POST, configValues);
    },
    {
      onSuccess: () => {
        onSuccess();
        onClose();
        if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
          refetch();
          setSelectedMaterials([]);
        } else {
          refreshData();
          setSelectedSPMaterial([]);
        }
      },
      onError: () => {
        onError();
        onClose();
      }
    }
  );

  const formFields = [
    {
      label: t('material.minQuantity'),
      type: 'input',
      name: 'minQuantity',
      isRequired: true,
      maxLength: 3
    },
    {
      label: t('material.maxQuantity'),
      type: 'input',
      name: 'maxQuantity',
      isRequired: true,
      maxLength: 3
    }
  ];

  const { mutate: applySPConfiguration } = useMutation(
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

  const handleApplyConfiguration = (values) => {
    if (parseInt(values.minQuantity, 10) > parseInt(values.maxQuantity, 10)) {
      setAlert({
        description: t('manageMaterial.drawer.details.configuration.body.minMaxQuantity'),
        type: 'error'
      });
      return;
    }
    if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
      const configValues = {
        ndcNumbers: selectedMaterials.map((material) => material.ndc),
        minQuantity: values.minQuantity,
        maxQuantity: values.maxQuantity,
        channelType: CHANNEL_TYPE.BUY_AND_BILL,
        minLessThanOrEqualToMax: values.minQuantity <= values.maxQuantity ? 'yes' : 'no'
      };
      applyBnBConfiguration(configValues);
    } else if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
      const configValues = {
        spProductIds: selectedSPMaterial.map((material) => material.materialNumber),
        minQuantity: values.minQuantity,
        maxQuantity: values.maxQuantity
      };
      applySPConfiguration(configValues);
    }
  };

  if (isMaterialDataLoading || isApplyConfigurationLoading) {
    return <Loader type={'circular'} />;
  }

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchemaForOrderQuantity(t)} enableReinitialize onSubmit={handleApplyConfiguration}>
      {() => (
        <Form>
          <FloatingDrawer
            open={true}
            anchor="right"
            onClose={onClose}
            heading={t('manageMaterial.drawer.configuration.heading')}
            controls={
              <div className="controls">
                <Button label={t('manageMaterial.drawer.controls.cancel')} onClick={onClose} variant="secondary" size="md" />
                <Button label={t('manageMaterial.drawer.controls.apply')} type="submit" variant="primary" size="md" />
              </div>
            }>
            <div className={styles.wrapper}>
              <div className={styles.body}>
                {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
                <div className={`${styles.formControls} ${styles.removeBorder}`}>
                  {formFields.map((field, index) => (
                    <div className={styles.formField} key={index}>
                      <Field
                        id={field.name}
                        name={field.name}
                        maxLength={field.maxLength}
                        label={field.label}
                        placeholder=" "
                        isRequired={field.isRequired}
                        component={Components[field.type]}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FloatingDrawer>
        </Form>
      )}
    </Formik>
  );
}

export default OrderQuantityConfig;
