import React, { useState } from 'react';
import styles from './assets/styles/ConfigureMaterials.module.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading, Button, RadioGroup, Label, Alert } from '@mckesson/mcp-component-library';
import { ReactComponent as IconClose } from '@src/assets/svg/cross.svg';
import { useManageMaterial } from '@src/mfe/order-management/context/ManageMaterialContext';
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import FloatingDrawer from '@src/components/floating-drawer';

function ConfigureMaterials({ onClose, onSuccess, onError }) {
  const { t } = useTranslate();
  const [formValues, setFormValues] = useState({
    patientInfoRequired: '',
    coiIdRequired: ''
  });
  const [error, setError] = useState(false)

  const { selectedMaterials, refetch } = useManageMaterial();

  const { mutate: applyConfiguration } = useMutation(
    async (configValues) => {
      return await HttpResourceService.callRest(ApiRoutes.CONFIGURE_MATERIALS(), httpVerb.POST, configValues);
    },
    {
      onSuccess: () => {
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

  const formFields = [
    {
      caption: t('manageMaterial.drawer.configuration.body.patientInfoRequired'),
      id: 'patientInfoRequired',
      items: [
        { isDisabled: false, label: t('manageMaterial.drawer.configuration.body.patientInfoRequired.yes'), value: 'yes' },
        { isDisabled: false, label: t('manageMaterial.drawer.configuration.body.patientInfoRequired.no'), value: 'no' }
      ],
      value: formValues.patientInfoRequired,
      required: true,
      onChangeValue: (value) => setFormValues((prev) => ({ ...prev, patientInfoRequired: value }))
    },
    {
      caption: t('manageMaterial.drawer.configuration.body.coiIdRequired'),
      id: 'coiIdRequired',
      items: [
        { isDisabled: false, label: t('manageMaterial.drawer.configuration.body.coiIdRequired.yes'), value: 'yes' },
        { isDisabled: false, label: t('manageMaterial.drawer.configuration.body.coiIdRequired.no'), value: 'no' }
      ],
      value: formValues.coiIdRequired,
      required: true,
      onChangeValue: (value) => setFormValues((prev) => ({ ...prev, coiIdRequired: value }))
    }
  ];
  const isApplyDisabled = formValues.patientInfoRequired && formValues.coiIdRequired;

  const handleApplyConfiguration = () => {
    if(isApplyDisabled){
      const configValues = {
        materialNumbers: selectedMaterials.map((material) => material.materialNumber),
        isPatientInformationRequired: formValues.patientInfoRequired === 'yes',
        isCoiIdRequired: formValues.coiIdRequired === 'yes'
      };
      applyConfiguration(configValues);
    }else{
      setError(true);
    }
    
  };
  const handleAlertClose=()=>{
    setError(false)
  }

  

  return (
    <FloatingDrawer 
      open={true} 
      anchor="right" 
      onClose={onClose} 
      heading={t('manageMaterial.drawer.configuration.heading')}
      controls={
        <div className='controls'>
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
      }
    >
      <div className={styles.wrapper}>
        <div className={styles.body}>
          {error && !isApplyDisabled && (
            <Alert description={t('manageMaterial.drawer.configuration.alert.error')} onClose={handleAlertClose} type={'error'} duration={10000} />
          )}
          <div className={styles.formControls}>
            {formFields.map((field, index) => (
              <div className={styles.formField} key={index}>
                <div className={styles.caption}>
                  <Label className={styles.label}>{field.caption}</Label>
                  <span className='required'> *</span>
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
