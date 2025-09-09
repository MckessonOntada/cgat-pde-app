import { Button, Label, RadioGroup } from '@mckesson/mcp-component-library';
import ApiRoutes from '@src/api/ApiRoutes';
import OrderService from '@src/api/commonService/OrderService';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import Alert from '@src/components/cgat-alert/Alert';
import FloatingDrawer from '@src/components/floating-drawer';
import { useManageMaterial } from '@src/mfe/core-config/system-admin/manage-material/context/ManageMaterialContext';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';
import { useTranslate } from '@src/translations/useTranslation';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import styles from './assets/styles/ConfigureMaterials.module.scss';

function ConfigureMaterials({ onClose, onSuccess, onError }) {
  const { t } = useTranslate();
  const [formValues, setFormValues] = useState({
    patientInfoRequired: '',
    patientIdentifierRequired: '',
    coiIdRequired: '',
    mrnRequired: '',
    doaRequired: '',
    poNumberRequired: '',
    dateOfApheresisRequired: ''
  });
  const [error, setError] = useState(false);

  const { selectedMaterials, setSelectedMaterials, refetch } = useManageMaterial();
  const { data: MaterialData } = useQuery({
    queryKey: ['therapyDetailsByTrade'],
    queryFn: async () => {
      const result = await OrderService.getTherapyDetailsByTradeName2(
        selectedMaterials.map((material) => material.tradeName),
        CHANNEL_TYPE.BUY_AND_BILL
      );
      return result;
    },
    enabled: !!selectedMaterials && selectedMaterials?.length === 1 ? true : false,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (selectedMaterials?.length === 1 && Array.isArray(MaterialData)) {
      const selectedNDC = selectedMaterials[0].ndc;
      const matchedMaterial = MaterialData.find((item) => item.materialConfig?.ndcNumber === selectedNDC);

      if (matchedMaterial) {
        const config = matchedMaterial.materialConfig;

        setFormValues({
          patientInfoRequired: config.isPatientInformationRequired ? 'yes' : 'no',
          patientIdentifierRequired: config.isPatientInformationRequired ? (config.isPIDRequired ? 'yes' : 'no') : '',
          coiIdRequired: config.isCoiIdRequired ? 'yes' : 'no',
          mrnRequired: config.isPatientInformationRequired ? (config.isMRNRequired ? 'yes' : 'no') : '',
          doaRequired: config.isDOARequired ? 'yes' : 'no',
          poNumberRequired: config.isPORequired ? 'yes' : 'no',
          dateOfApheresisRequired: config.isDateOfApheresisRequired ? 'yes' : 'no'
        });
      }
    }
  }, [MaterialData, selectedMaterials]);

  const { mutate: applyConfiguration } = useMutation(
    async (configValues) => {
      return await HttpResourceService.callRest(ApiRoutes.CONFIGURE_MATERIALS(), httpVerb.POST, configValues);
    },
    {
      onSuccess: () => {
        setSelectedMaterials([]);
        onSuccess();
        onClose();
        refetch();
      },
      onError: () => {
        onError();
        onClose();
      }
    }
  );

  const fieldConfigs = React.useMemo(() => {
    const flag = formValues.patientInfoRequired === 'no';
    return [
      {
        key: 'patientInfoRequired',
        caption: 'manageMaterial.drawer.configuration.body.patientInfoRequired',
        isDisabled: false,
        isRequired: true
      },
      {
        key: 'patientIdentifierRequired',
        caption: 'manageMaterial.drawer.configuration.body.patientIdentifier',
        isDisabled: flag,
        isRequired: !flag
      },
      {
        key: 'mrnRequired',
        caption: 'manageMaterial.drawer.configuration.body.mrnRequired',
        isDisabled: flag,
        isRequired: true
      },
      {
        key: 'coiIdRequired',
        caption: 'manageMaterial.drawer.configuration.body.coiIdRequired',
        isDisabled: false,
        isRequired: true
      },
      {
        key: 'poNumberRequired',
        caption: 'manageMaterial.drawer.configuration.body.poNumberRequired',
        isDisabled: false,
        isRequired: true
      },

      {
        key: 'doaRequired',
        caption: 'manageMaterial.drawer.configuration.body.doaRequired',
        isDisabled: false,
        isRequired: true
      },
      {
        key: 'dateOfApheresisRequired',
        caption: 'manageMaterial.drawer.configuration.body.dateOfApheresisRequired',
        isDisabled: false,
        isRequired: true
      }
    ];
  }, [formValues]);

  const formFields = fieldConfigs.map(({ key, caption, isDisabled, isRequired }) => {
    return {
      caption: t(caption),
      id: key,
      items: [
        { isDisabled, label: t('label.yes'), value: 'yes' },
        { isDisabled, label: t('label.no'), value: 'no' }
      ],
      value: formValues[key],
      required: isRequired,
      onChangeValue: (value) => {
        if (key === 'patientInfoRequired') {
          setFormValues((prev) => ({
            ...prev,
            [key]: value,
            ...(value === 'no' ? { patientIdentifierRequired: '', mrnRequired: '' } : {})
          }));
        } else {
          setFormValues((prev) => ({
            ...prev,
            [key]: value
          }));
        }
      }
    };
  });

  const isApplyDisabled =
    formValues.patientInfoRequired &&
    formValues.coiIdRequired &&
    formValues.poNumberRequired &&
    formValues.doaRequired &&
    formValues.dateOfApheresisRequired &&
    (formValues.patientInfoRequired === 'yes' ? formValues.patientIdentifierRequired && formValues.mrnRequired : true);

  const handleApplyConfiguration = () => {
    if (isApplyDisabled) {
      const configValues = {
        ndcNumbers: selectedMaterials.map((material) => material.ndc),
        isPatientInformationRequired: formValues.patientInfoRequired === 'yes',
        isCoiIdRequired: formValues.coiIdRequired === 'yes',
        isDOARequired: formValues.doaRequired === 'yes',
        isMRNRequired: formValues.mrnRequired === 'yes',
        isPORequired: formValues.poNumberRequired === 'yes',
        isPIDRequired: formValues.patientIdentifierRequired === 'yes',
        isDateOfApheresisRequired: formValues.dateOfApheresisRequired === 'yes'
      };
      applyConfiguration(configValues);
    } else {
      setError(true);
    }
  };
  const handleAlertClose = () => {
    setError(false);
  };

  return (
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
            onClick={() => handleApplyConfiguration()}
            variant="primary"
            size="md"
            aria-label={t('manageMaterial.drawer.controls.apply')}
          />
        </div>
      }>
      <div className={styles.wrapper}>
        <div className={styles.body}>
          {error && !isApplyDisabled && <Alert description={t('manageMaterial.drawer.configuration.alert.error')} onClose={handleAlertClose} type={'error'} />}
          <div className={styles.formControls}>
            {formFields.map((field, index) => (
              <div className={styles.formField} key={index}>
                <div className={styles.caption}>
                  <Label className={styles.label}>{field.caption}</Label>
                  {field.required && <span className="required"> *</span>}
                </div>
                <RadioGroup
                  direction="row"
                  id={field.id}
                  items={field.items}
                  onChangeValue={field.onChangeValue}
                  radioBtnWidth="auto"
                  value={field.value}
                  size="lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </FloatingDrawer>
  );
}

export default ConfigureMaterials;
