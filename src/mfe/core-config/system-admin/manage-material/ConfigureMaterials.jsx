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
import { REQUIREMENT, REQUIREMENT_OPTIONS, YES_NO_OPTIONS } from './assets/constants/MaterialConstants';
import styles from './assets/styles/ConfigureMaterials.module.scss';

function ConfigureMaterials({ onClose, onSuccess, onError }) {
  const { t } = useTranslate();
  const [formValues, setFormValues] = useState({
    isPatientInformationRequired: '',
    pidRequirement: '',
    coiIdRequirement: '',
    mrnRequirement: '',
    doaRequirement: '',
    poRequirement: '',
    shipToPORequirement: '',
    dateOfApheresisRequirement: ''
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
          isPatientInformationRequired: config.isPatientInformationRequired ? 'yes' : 'no',
          pidRequirement: config.isPatientInformationRequired ? config.patientIdentifierRequirement : '',
          coiIdRequirement: config.coiIdRequirement,
          mrnRequirement: config.isPatientInformationRequired ? config.mrnRequirement : '',
          doaRequirement: config.dateOfAdministrationRequirement,
          poRequirement: config.poNumberRequirement,
          shipToPORequirement: config.shipToPORequirement,
          dateOfApheresisRequirement: config.dateOfApheresisRequirement
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
    const flag = formValues.isPatientInformationRequired === 'no';
    return [
      {
        key: 'isPatientInformationRequired',
        caption: 'manageMaterial.drawer.details.configuration.body.patientInfoRequired',
        options: YES_NO_OPTIONS,
        isDisabled: false,
        isRequired: true
      },
      {
        key: 'pidRequirement',
        caption: 'manageMaterial.drawer.details.configuration.body.pIdentifier',
        options: REQUIREMENT_OPTIONS,
        isDisabled: flag,
        isRequired: !flag
      },
      {
        key: 'mrnRequirement',
        caption: 'manageMaterial.drawer.details.configuration.body.mrn',
        options: REQUIREMENT_OPTIONS,
        isDisabled: flag,
        isRequired: !flag
      },
      {
        key: 'coiIdRequirement',
        caption: 'manageMaterial.drawer.details.configuration.body.coiId',
        options: REQUIREMENT_OPTIONS,
        isDisabled: false,
        isRequired: true
      },
      {
        key: 'poRequirement',
        caption: 'manageMaterial.drawer.details.configuration.body.poNumber',
        options: REQUIREMENT_OPTIONS,
        isDisabled: false,
        isRequired: true
      },
      {
        key: 'shipToPORequirement',
        caption: 'manageMaterial.drawer.details.configuration.body.shipToPORequirement',
        options: REQUIREMENT_OPTIONS,
        isDisabled: false,
        isRequired: true
      },
      {
        key: 'doaRequirement',
        caption: 'manageMaterial.drawer.details.configuration.body.doa',
        options: REQUIREMENT_OPTIONS,
        isDisabled: false,
        isRequired: true
      },
      {
        key: 'dateOfApheresisRequirement',
        caption: 'manageMaterial.drawer.details.configuration.body.dateOfApheresis',
        options: REQUIREMENT_OPTIONS,
        isDisabled: false,
        isRequired: true
      }
    ];
  }, [formValues]);

  const formFields = fieldConfigs.map(({ key, caption, options, isDisabled, isRequired }) => {
    return {
      caption: t(caption),
      id: key,
      items: options.map((option) => ({
        isDisabled,
        label: t(option.label),
        value: option.value
      })),
      value: formValues[key],
      required: isRequired,
      onChangeValue: (value) => {
        if (key === 'isPatientInformationRequired') {
          setFormValues((prev) => ({
            ...prev,
            [key]: value,
            ...(value === 'no' ? { pidRequirement: '', mrnRequirement: '' } : {})
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
    formValues.isPatientInformationRequired &&
    formValues.coiIdRequirement &&
    formValues.poRequirement &&
    formValues.doaRequirement &&
    formValues.dateOfApheresisRequirement &&
    formValues.shipToPORequirement &&
    (formValues.isPatientInformationRequired === 'yes' ? formValues.pidRequirement && formValues.mrnRequirement : true);

  const handleApplyConfiguration = () => {
    if (isApplyDisabled) {
      const isYes = formValues.isPatientInformationRequired === 'yes';
      const configValues = {
        ndcNumbers: selectedMaterials.map((material) => material.ndc),
        isPatientInformationRequired: isYes,
        pidRequirement: !isYes ? REQUIREMENT.OPTIONAL : formValues.pidRequirement,
        mrnRequirement: !isYes ? REQUIREMENT.OPTIONAL : formValues.mrnRequirement,
        coiIdRequirement: formValues.coiIdRequirement,
        doaRequirement: formValues.doaRequirement,
        poRequirement: formValues.poRequirement,
        shipToPORequirement: formValues.shipToPORequirement,
        dateOfApheresisRequirement: formValues.dateOfApheresisRequirement
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
