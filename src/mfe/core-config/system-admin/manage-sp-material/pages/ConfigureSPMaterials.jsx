import React, { useState } from 'react';
import styles from '@src/mfe/core-config/system-admin/manage-material/assets/styles/ConfigureMaterials.module.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { Button, RadioGroup, Label } from '@mckesson/mcp-component-library';
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import FloatingDrawer from '@src/components/floating-drawer';
import Alert from '@src/components/cgat-alert/Alert';
import { useSPMaterial } from '../context/SPMaterialContext';

function ConfigureSPMaterials({ onClose, onSuccess, onError }) {
  const { t } = useTranslate();
  const [formValues, setFormValues] = useState({
    patientIdentifierRequired: 'yes',
    coiIdRequired: 'yes',
    mrnRequired: 'yes'
  });
  const [error, setError] = useState(false);

  const { selectedSPMaterial, refetch } = useSPMaterial();

  const { mutate: applyConfiguration } = useMutation(
    async (configValues) => {
      return await HttpResourceService.callRest(ApiRoutes.CONFIGURE_SP_MATERIALS(), httpVerb.POST, configValues);
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
      caption: t('manageMaterial.drawer.configuration.body.patientIdentifierRequired'),
      id: 'patientIdentifierRequired',
      items: [
        {
          label: t('manageMaterial.drawer.configuration.body.patientIdentifierRequired.yes'),
          value: 'yes'
        },
        {
          label: t('manageMaterial.drawer.configuration.body.patientIdentifierRequired.no'),
          value: 'no'
        }
      ],
      value: formValues.patientIdentifierRequired,
      required: true,
      onChangeValue: (value) => setFormValues((prev) => ({ ...prev, patientIdentifierRequired: value }))
    },
    {
      caption: t('manageMaterial.drawer.configuration.body.coiIdRequired'),
      id: 'coiIdRequired',
      items: [
        {
          label: t('manageMaterial.drawer.configuration.body.coiIdRequired.yes'),
          value: 'yes'
        },
        {
          label: t('manageMaterial.drawer.configuration.body.coiIdRequired.no'),
          value: 'no'
        }
      ],
      value: formValues.coiIdRequired,
      required: true,
      onChangeValue: (value) => setFormValues((prev) => ({ ...prev, coiIdRequired: value }))
    },
    {
      caption: t('manageMaterial.drawer.configuration.body.mrnRequired'),
      id: 'mrnRequired',
      items: [
        {
          label: t('manageMaterial.drawer.configuration.body.mrnRequired.yes'),
          value: 'yes'
        },
        {
          label: t('manageMaterial.drawer.configuration.body.mrnRequired.no'),
          value: 'no'
        }
      ],
      value: formValues.mrnRequired,
      required: true,
      onChangeValue: (value) => setFormValues((prev) => ({ ...prev, mrnRequired: value }))
    }
  ];
  const isApplyDisabled = formValues.patientIdentifierRequired && formValues.coiIdRequired && formValues.mrnRequired;

  const handleApplyConfiguration = () => {
    if (isApplyDisabled) {
      const configValues = {
        spProductIds: selectedSPMaterial.map((material) => material.materialNumber),
        patientIdentifierRequired: formValues.patientIdentifierRequired === 'yes',
        coiIdRequired: formValues.coiIdRequired === 'yes',
        mrnRequired: formValues.mrnRequired === 'yes'
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
                  <span className="required"> *</span>
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

export default ConfigureSPMaterials;
