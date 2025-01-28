import React, { useEffect, useState } from 'react';
import styles from './assets/styles/ConfigureMaterials.module.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { Loader, Heading, Button, RadioGroup, Label, Required } from '@mckesson/mcp-component-library';
import { ReactComponent as IconClose } from '@src/assets/svg/closeIcon.svg';
import useSnackbar from '@src/hooks/useSnackbar';
import { useManageMaterial } from '@src/mfe/order-management/context/ManageMaterialContext';
import CommonUtils from '@src/util/CommonUtils';
import MaterialService from '@src/api/commonService/MaterialService';
import { useQuery } from 'react-query';

function ConfigureMaterials({ onClose }) {
  const { t } = useTranslate();
  const { showSnackbar } = useSnackbar();
  const [formValues, setFormValues] = useState({
    patientInfoRequired: '',
    coiIdRequired: ''
  });

  const { selectedMaterials, applyConfiguration, configureSuccess } = useManageMaterial();
  console.log('selectedMaterials', selectedMaterials);

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
      onChangeValue: (value) => setFormValues(prev => ({ ...prev, patientInfoRequired: value }))
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
      onChangeValue: (value) => setFormValues(prev => ({ ...prev, coiIdRequired: value }))
    }
  ];

  const handleApplyConfiguration = () => {
    const configValues = {
      materialNumbers: selectedMaterials.map(material => material.materialNumber),
      isPatientInformationRequired: formValues.patientInfoRequired === 'yes',
      isCoiIdRequired: formValues.coiIdRequired === 'yes'
    };
    applyConfiguration(configValues);
    console.log('configValues', configValues);
  };

  useEffect(() => {
    if (configureSuccess) {
      onClose();
    }
  }, [configureSuccess]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Heading as="h2">{t('manageMaterial.drawer.configuration.heading')}</Heading>
        <button onClick={onClose}>
          <IconClose />
        </button>
      </div>
      <div className={styles.body}>
        <div className={styles.formControls}>
          {formFields.map((field, index) => (
            <div className={styles.formField} key={index}>
              <div className={styles.caption}>
                <Label className={styles.label}>{field.caption}</Label>
                <Required />
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
        <div className={styles.controls}>
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
      </div>
      {/* )} */}
    </div>
  );
}

export default ConfigureMaterials;
