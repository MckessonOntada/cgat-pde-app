import React, { useEffect, useState } from 'react';
import styles from '@src/mfe/core-config/system-admin/manage-material/assets/styles/ConfigureMaterials.module.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { Button, RadioGroup, Label } from '@mckesson/mcp-component-library';
import { useMutation, useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import FloatingDrawer from '@src/components/floating-drawer';
import Alert from '@src/components/cgat-alert/Alert';
import { useSPMaterial } from '../context/SPMaterialContext';
import MaterialService from '@src/api/commonService/MaterialService';
import { REQUIREMENT_OPTIONS, TRIAGE_CHANNEL } from '../../manage-material/assets/constants/MaterialConstants';

function ConfigureSPMaterials({ onClose, onSuccess, onError }) {
  const { t } = useTranslate();
  const [formValues, setFormValues] = useState({
    pidRequirement: '',
    coiIdRequirement: '',
    mrnRequirement: '',
    triageChannel: ''
  });
  const [error, setError] = useState(false);

  const { selectedSPMaterial, refreshData, setSelectedSPMaterial } = useSPMaterial();
  const requestParams = {
    channelType: 'SPECIALITY_PHARMA'
  };
  const {
    isLoading,
    isError,
    data: spConfig
  } = useQuery({
    queryKey: ['SPMaterialdetails', selectedSPMaterial?.[0]?.materialNumber],
    queryFn: async () => {
      const result = await MaterialService.getSPMaterialById(selectedSPMaterial?.[0]?.materialNumber, requestParams);
      return result?.spTherapyConfig;
    },
    enabled: Array.isArray(selectedSPMaterial) && selectedSPMaterial.length === 1 && !!selectedSPMaterial[0]?.materialNumber ? true : false,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (spConfig) {
      if (selectedSPMaterial.length === 1) {
        setFormValues({
          pidRequirement: spConfig.patientIdentifierRequirement,
          coiIdRequirement: spConfig.coiIdRequirement,
          mrnRequirement: spConfig.mrnRequirement,
          triageChannel: spConfig.triageChannel || ''
        });
      } else {
        setFormValues({
          pidRequirement: '',
          coiIdRequirement: '',
          mrnRequirement: '',
          triageChannel: ''
        });
      }
    }
  }, [spConfig]);

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

  const formFields = [
    {
      caption: t('manageMaterial.drawer.details.configuration.body.sp.patientIdentifier'),
      id: 'pidRequirement',
      options: REQUIREMENT_OPTIONS,
      value: formValues.pidRequirement,
      required: true,
      onChangeValue: (value) => setFormValues((prev) => ({ ...prev, pidRequirement: value }))
    },
    {
      caption: t('manageMaterial.drawer.details.configuration.body.coiId'),
      id: 'coiIdRequirement',
      options: REQUIREMENT_OPTIONS,
      value: formValues.coiIdRequirement,
      required: true,
      onChangeValue: (value) => setFormValues((prev) => ({ ...prev, coiIdRequirement: value }))
    },
    {
      caption: t('manageMaterial.drawer.details.configuration.body.mrn'),
      id: 'mrnRequirement',
      options: REQUIREMENT_OPTIONS,
      value: formValues.mrnRequirement,
      required: true,
      onChangeValue: (value) => setFormValues((prev) => ({ ...prev, mrnRequirement: value }))
    },
    {
      caption: t('manageMaterial.drawer.details.configuration.body.triageChannel'),
      id: 'triageChannel',
      options: TRIAGE_CHANNEL,
      value: formValues.triageChannel,
      required: true,
      onChangeValue: (value) => setFormValues((prev) => ({ ...prev, triageChannel: value }))
    }
  ];
  const isApplyDisabled = formValues.pidRequirement && formValues.coiIdRequirement && formValues.mrnRequirement && formValues.triageChannel;

  const handleApplyConfiguration = () => {
    if (isApplyDisabled) {
      const configValues = {
        spProductIds: selectedSPMaterial.map((material) => material.materialNumber),
        pidRequirement: formValues.pidRequirement,
        coiIdRequirement: formValues.coiIdRequirement,
        mrnRequirement: formValues.mrnRequirement,
        triageChannel: formValues.triageChannel
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
                  items={field.options.map((option) => ({
                    label: t(option.label),
                    value: option.value
                  }))}
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
