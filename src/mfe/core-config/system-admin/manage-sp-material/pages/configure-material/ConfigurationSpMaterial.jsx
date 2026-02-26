import React from 'react';
import { Button, Heading, RadioGroup, Loader } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import Alert from '@src/components/cgat-alert/Alert';
import ModuleHeader from '@src/components/module-header';
import Accordion, { AccordionHeader, AccordionItem, AccordionPanel } from '@src/components/Accordion/Accordion';
import ConfigurationHeader from './ConfigurationHeader';
import ConfigurationForm from './ConfigurationForm';
import { Formik, Form, Field } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { defaultFieldFormatBnb, defaultFieldFormatSp, FIELD_NAMES } from './config';
import { getConfigurationSchema } from './ConfigurationSchema';
import MaterialService from '@src/api/commonService/MaterialService';
import { useMutation, useQuery } from 'react-query';
import { ChannelType } from '../../../manage-sp-account/util';
import Components from '@src/components/form/Components';
import styles from './Configure.module.scss';
import { CHANNEL_TYPE, MANUFACTURER } from '@src/mfe/order-management/pages/create/form-segments/Constants';
import { useManageMaterial } from '../../../manage-material/context/ManageMaterialContext';
export default function ConfigurationSpMaterial() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslate();
  const [alert, setAlert] = React.useState(null);
  const { therapy, materialType } = location.state || {};
  const isBnbMaterial = materialType === ChannelType.BUY_AND_BILL;
  const [manufacturer, setManufacturer] = React.useState([]);
  const [openTabs, setOpenTabs] = React.useState([]);
  const { setSelectedMaterials } = useManageMaterial();

  React.useEffect(() => {
    MaterialService.getManufacturers(materialType).then((manufacturer) => {
      setManufacturer([
        { label: 'Select Manufacturer', value: '' },
        ...manufacturer.map((item) => ({
          label: item,
          value: item
        }))
      ]);
    });
  }, [materialType]);

  const fieldNameForChannel = isBnbMaterial ? 'patientInformationRequired' : 'triageChannel';

  const channelOptions = isBnbMaterial
    ? [
        { isDisabled: false, label: t('manageSPMaterial.configuration.radio.yes'), value: true },
        { isDisabled: false, label: t('manageSPMaterial.configuration.radio.no'), value: false }
      ]
    : [
        { isDisabled: false, label: t('manageSPMaterial.configuration.radio.sp'), value: 'SP' },
        { isDisabled: false, label: t('manageSPMaterial.configuration.radio.hub'), value: 'HUB' }
      ];

  const { data: materialDetails, isLoading } = useQuery({
    queryKey: ['MaterialDetails'],
    queryFn: async () => {
      const result = await (isBnbMaterial
        ? MaterialService.getMaterialConfigByNdc(ChannelType.BUY_AND_BILL, therapy?.[0]?.ndc)
        : MaterialService.getSpMaterialConfigByMaterialNumber(ChannelType.SPECIALITY_PHARMA, therapy?.[0]?.materialNumber));
      return isBnbMaterial ? result?.materialConfig?.config : result?.spTherapyConfig?.config;
    },

    enabled: Array.isArray(therapy) && therapy.length === 1,
    refetchOnWindowFocus: false
  });

  const ndcDetails = React.useMemo(() => {
    if (therapy?.length > 1) {
      return materialType === CHANNEL_TYPE.BUY_AND_BILL ? defaultFieldFormatBnb() : defaultFieldFormatSp();
    }

    return materialDetails?.fields ? materialDetails : materialType === CHANNEL_TYPE.BUY_AND_BILL ? defaultFieldFormatBnb() : defaultFieldFormatSp();
  }, [materialDetails, materialType, therapy]);

  const initialManufacturer = ndcDetails?.manufacturerName || null;

  const initialValues = {
    manufacturerName: ndcDetails?.manufacturerName || null,
    ...(isBnbMaterial && { secondLegShipInfoRequired: ndcDetails?.secondLegShipInfoRequired }),
    ...(isBnbMaterial && { partnerNumber: ndcDetails?.partnerNumber || '' }),
    [fieldNameForChannel]: isBnbMaterial ? ndcDetails?.patientInformationRequired : ndcDetails?.triageChannel,
    fields: ndcDetails?.fields?.map((field) => ({
      fieldName: field?.fieldName,
      properties: {
        displayOnForm: !!field?.properties?.displayOnForm,
        mandatoryField: !!field?.properties?.mandatoryField,
        showHelpIcon: !!field?.properties?.showHelpIcon,
        displayName: field?.properties?.displayName || '',
        errorMessage: field?.properties?.errorMessage || '',
        helpInfoMessage: field?.properties?.helpInfoMessage || '',
        fieldFormat: {
          formatType: field?.properties?.fieldFormat?.formatType || '',
          validationRegex: field?.properties?.fieldFormat?.validationRegex || '',
          validationFormat: field?.properties?.fieldFormat?.validationFormat || ''
        }
      }
    }))
  };

  const validationSchema = getConfigurationSchema(t, channelOptions, fieldNameForChannel, isBnbMaterial);

  const { mutate: updateMaterial, isLoading: isUpdating } = useMutation({
    mutationFn: (payload) => {
      return isBnbMaterial ? MaterialService.updateMaterialConfigBnb(payload) : MaterialService.updateSPMaterialConfig(payload);
    },
    onSuccess: () => {
      navigate('../', {
        state: {
          alert: {
            type: 'success',
            description: t('manageMaterial.drawer.controls.apply.success')
          }
        }
      });
    },
    onError: (error) => {
      const statusCode = error?.response?.status;
      let description = t('error.default');

      if (!(statusCode >= 400 && statusCode < 600)) {
        description = CommonUtils.getAxiosErrorMessage(error);
      }

      setAlert({
        description,
        type: 'error'
      });
    }
  });

  const handleSubmit = (values) => {
    const therapyList = Array.isArray(therapy) ? therapy : [therapy];

    const payload = {
      [isBnbMaterial ? 'ndcNumbers' : 'spProductIds']: therapyList.map((item) => (isBnbMaterial ? item.ndc : item.materialNumber)),
      ...(isBnbMaterial && { channelType: ChannelType.BUY_AND_BILL }),
      config: {
        ...values,
        manufacturerName: values.manufacturerName || null
      }
    };
    updateMaterial(payload);
  };

  const labelTranslation = React.useMemo(() => {
    const _translations = {};
    if (isBnbMaterial) {
      _translations.backButton = 'button.caption.backToMaterialMaster';
      _translations.channelOptionsLabel = 'manageSPMaterial.configuration.label.patientInformationRequired';
    } else {
      _translations.backButton = 'button.caption.backToSpMaterial';
      _translations.channelOptionsLabel = 'manageSPMaterial.configuration.label.triageChannel';
    }
    return _translations;
  }, [isBnbMaterial]);

  const applyManufacturerRules = (manufacturerName, fields) => {
    let openTabs = [];
    const updatedFields = fields.map((field, idx) => {
      let updatedField = { ...field };

      if (manufacturerName === MANUFACTURER.ORCA) {
        if ([FIELD_NAMES.PATIENT_IDENTIFIER, FIELD_NAMES.MEDICAL_RECORD_NUMBER].includes(field.fieldName)) {
          updatedField = {
            ...field,
            properties: {
              ...field.properties,
              displayOnForm: true,
              mandatoryField: true
            }
          };
          openTabs.push(`field-${idx}`);
        }
      }

      if (manufacturerName === MANUFACTURER.REGENERON) {
        if ([FIELD_NAMES.COI_ID, FIELD_NAMES.PATIENT_IDENTIFIER].includes(field.fieldName)) {
          updatedField = {
            ...field,
            properties: {
              ...field.properties,
              displayOnForm: true,
              mandatoryField: true
            }
          };
          openTabs.push(`field-${idx}`);
        }
      }

      if (manufacturerName === MANUFACTURER.KITE) {
        if ([FIELD_NAMES.PATIENT_IDENTIFIER].includes(field.fieldName)) {
          updatedField = {
            ...field,
            properties: {
              ...field.properties,
              displayOnForm: true,
              mandatoryField: true
            }
          };
          openTabs.push(`field-${idx}`);
        }
      }

      return updatedField;
    });
    setOpenTabs(openTabs);
    return updatedFields;
  };

  const handleOnCancel = () => {
    setSelectedMaterials([]);
    navigate('../');
  };

  if (isLoading || isUpdating) {
    return <Loader type={'screen'} />;
  }

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={() => navigate('../')} size="md">
          {t(labelTranslation.backButton)}
        </Button>
      </div>

      <div className="MCP-module-body">
        <ModuleHeader heading={<Heading as="h1">{t('manageSPMaterial.configuration.heading.materialConfiguration')}</Heading>} />
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

        <div className="MCP-panel-container">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
            enableReinitialize={true}>
            {({ values, setFieldValue, errors, touched, setFieldError, resetForm, setFieldTouched }) => {
              return (
                <Form>
                  <div className="MCP-module-body">
                    <React.Fragment>
                      <ModuleHeader heading={<Heading as="h2">{t('manageSPMaterial.configuration.heading.manufacturerConfiguration')}</Heading>} />

                      <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3`}>
                        <Field
                          component={Components['dropdown']}
                          name={'manufacturerName'}
                          fieldlabel={t('label.selectManufacturer')}
                          placeholder="Select Manufacturer"
                          size="lg"
                          options={manufacturer}
                          onChange={(selectedManufacturer) => {
                            if (initialManufacturer === selectedManufacturer) {
                              resetForm();
                              setOpenTabs([]);
                              return;
                            }
                            if (selectedManufacturer === '') {
                              setFieldValue(fieldNameForChannel, '');
                            }
                            setFieldValue('manufacturerName', selectedManufacturer);
                            const updatedFields = applyManufacturerRules(
                              selectedManufacturer,
                              materialType === CHANNEL_TYPE.BUY_AND_BILL ? defaultFieldFormatBnb()?.fields : defaultFieldFormatSp()?.fields
                            );
                            setFieldValue('fields', updatedFields);
                            if (isBnbMaterial && [MANUFACTURER.ORCA, MANUFACTURER.REGENERON, MANUFACTURER.KITE].includes(selectedManufacturer)) {
                              setFieldValue('patientInformationRequired', true);
                            }
                          }}
                        />
                      </div>
                    </React.Fragment>
                    <React.Fragment>
                      <ModuleHeader
                        heading={
                          <Heading as="h2">
                            {t(
                              isBnbMaterial
                                ? 'manageSPMaterial.configuration.heading.fieldConfiguration'
                                : 'manageSPMaterial.configuration.heading.channelConfiguration'
                            )}
                          </Heading>
                        }
                        controls={
                          <p className="form-instruction">
                            <span className="required">* </span> {t('userManagement.create_user.required')}
                          </p>
                        }
                      />
                      {isBnbMaterial && (
                        <>
                          <div className={styles.radioGroupSelection}>
                            <RadioGroup
                              caption={t('manageSPMaterial.configuration.label.second-LegShipmentInformationRequired')}
                              direction="row"
                              id={'secondLegShipInfoRequired'}
                              items={[
                                { isDisabled: false, label: t('manageSPMaterial.configuration.radio.yes'), value: true },
                                { isDisabled: false, label: t('manageSPMaterial.configuration.radio.no'), value: false }
                              ]}
                              onChangeValue={(value) => {
                                const finalValue = value === 'true' ? true : value === 'false' ? false : value;
                                setFieldError('secondLegShipInfoRequired', '');
                                setFieldValue('secondLegShipInfoRequired', finalValue);
                              }}
                              radioBtnWidth="auto"
                              value={values.secondLegShipInfoRequired}
                              isRequired
                              error={touched['secondLegShipInfoRequired'] && Boolean(errors['secondLegShipInfoRequired'])}
                              errorMessage={touched['secondLegShipInfoRequired'] && errors['secondLegShipInfoRequired']}
                            />
                          </div>
                          {values.secondLegShipInfoRequired === true && (
                            <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3`}>
                              <Field
                                name="partnerNumber"
                                label={t('manageSPMaterial.configuration.label.partnerNumber')}
                                isRequired={true}
                                component={Components['input']}
                              />
                            </div>
                          )}
                        </>
                      )}
                      <div className={styles.radioGroupSelection}>
                        <RadioGroup
                          caption={t(labelTranslation.channelOptionsLabel)}
                          direction="row"
                          id={fieldNameForChannel}
                          items={channelOptions.map((option) => ({
                            ...option,
                            isDisabled: isBnbMaterial && [MANUFACTURER.ORCA, MANUFACTURER.REGENERON, MANUFACTURER.KITE].includes(values.manufacturerName)
                          }))}
                          onChangeValue={(value) => {
                            const finalValue = value === 'true' ? true : value === 'false' ? false : value;
                            setFieldError(fieldNameForChannel, '');
                            setFieldValue(fieldNameForChannel, finalValue);
                            if (isBnbMaterial && finalValue === false) {
                              const updatedFields = values.fields.map((field) => {
                                if ([FIELD_NAMES.PATIENT_IDENTIFIER, FIELD_NAMES.MEDICAL_RECORD_NUMBER].includes(field.fieldName)) {
                                  return {
                                    ...field,
                                    properties: {
                                      ...field.properties,
                                      displayOnForm: false,
                                      mandatoryField: false,
                                      showHelpIcon: false
                                    }
                                  };
                                }
                                return field;
                              });
                              setFieldValue('fields', updatedFields);
                            }
                          }}
                          radioBtnWidth="auto"
                          value={values[fieldNameForChannel]}
                          isRequired
                          error={touched[fieldNameForChannel] && Boolean(errors[fieldNameForChannel])}
                          errorMessage={touched[fieldNameForChannel] && errors[fieldNameForChannel]}
                        />
                      </div>
                    </React.Fragment>
                    {!isBnbMaterial && (
                      <ModuleHeader
                        heading={<Heading as="h2">{t('manageSPMaterial.configuration.heading.fieldConfiguration')}</Heading>}
                        controls={
                          <p className="form-instruction">
                            <span className="required">* </span> {t('userManagement.create_user.required')}
                          </p>
                        }
                      />
                    )}
                    <Accordion multiple value={openTabs} onChange={setOpenTabs}>
                      {values?.fields?.map((field, idx) => {
                        if (
                          values[fieldNameForChannel] === false &&
                          [FIELD_NAMES.PATIENT_IDENTIFIER, FIELD_NAMES.MEDICAL_RECORD_NUMBER].includes(field.fieldName)
                        ) {
                          return null;
                        }
                        return (
                          <AccordionItem key={field.fieldName || idx} itemKey={`field-${idx}`}>
                            <AccordionHeader>
                              <ConfigurationHeader fieldName={field.fieldName} format={field.properties.fieldFormat.formatType} properties={field.properties} />
                            </AccordionHeader>
                            <AccordionPanel>
                              <ConfigurationForm field={field} index={idx} setFieldError={setFieldError} setFieldTouched={setFieldTouched} />
                            </AccordionPanel>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>

                    <div className="controls">
                      <Button variant="secondary" size="md" onClick={handleOnCancel}>
                        {t('manageSPMaterial.configuration.button.cancel')}
                      </Button>

                      <Button variant="primary" size="md" type="submit">
                        {t('manageSPMaterial.configuration.button.save')}
                      </Button>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}
