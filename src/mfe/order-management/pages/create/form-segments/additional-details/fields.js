import Components from '@src/components/form/Components';
import CommonUtils from '@src/util/CommonUtils';
import { CHANNEL_TYPE } from '../Constants';
import { getCountries, US_STATES } from '@src/components/form/util';
import OrderService from '@src/api/commonService/OrderService';
import React from 'react';
import { ReactComponent as LoadingIcon } from '@src/assets/svg/button-loading.svg';
import { ReactComponent as SuccessTick } from '@src/assets/svg/tick-circle-success.svg';

const getBinaryOptions = (keyPrefix = '', readOnly) => {
  return ['Yes', 'No'].map((option, index) => ({
    key: `${keyPrefix}-option-${index}`,
    label: option,
    value: option.toLowerCase(),
    isDisabled: readOnly
  }));
};

export const getDefaultAdditionalDetailsFields = ({ translationFn, therapyConfig, spTherapyConfig, channelType, handleCoiIdValidation }) => {
  const dynamic_fields = [];
  if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
    therapyConfig?.config?.fields?.forEach((field) => {
      if (field.fieldName !== 'patientIdentifier' && field.fieldName !== 'medicalRecordNumber' && field?.properties?.displayOnForm) {
        const prefix = field?.properties?.fieldFormat?.validationFormat?.match(/prefix\('([^']*)'\)/)?.[1] ?? '';
        const suffix = field?.properties?.fieldFormat?.validationFormat?.match(/suffix\('([^']*)'\)/)?.[1] ?? '';
        const formatType = field?.properties?.fieldFormat?.formatType;
        dynamic_fields.push({
          name: field?.fieldName,
          label: field?.properties?.displayName,
          isRequired: field?.properties?.mandatoryField,
          component:
            Components[prefix || suffix ? 'inputText' : formatType === 'Date_MM_DD_YYYY' ? 'datePicker' : formatType === 'Time_HH_MM' ? 'time' : 'input'],
          prefix,
          suffix,
          ...(formatType === 'Date_MM_DD_YYYY' && { disablePast: true }),
          infoText: field?.properties.helpInfoMessage,
          ...(field.fieldName === 'coiId' && { onBlur: handleCoiIdValidation })
        });
      }
    });
    dynamic_fields.push({
      name: 'orderQuantity',
      label: translationFn('labels.orderQuantity'),
      placeholder: ' ',
      isRequired: true,
      // readOnly: therapyConfig?.maxQuantity === therapyConfig?.minQuantity,
      component: Components['input'],
      maxLength: 2
    });
  } else if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
    dynamic_fields.push({
      name: 'orderQuantity',
      label: translationFn('labels.orderQuantity'),
      placeholder: ' ',
      isRequired: true,
      // readOnly: spTherapyConfig?.maxQuantity === spTherapyConfig?.minQuantity,
      component: Components['input'],
      maxLength: 2
    });
  }
  return dynamic_fields;
};

export const getClinicalDetailFields = ({ translationFn, formValues, setFieldValue, onDiagnosisCodeSearch, diagnosisCode }) => {
  const fields = [];
  const normalizedDiagnosisCodes = (formValues.diagnosisCode || []).map((item) => {
    if (item.label && item.value) {
      return item;
    } else {
      return {
        label: `${item.code} ${item.description}`,
        value: item.code,
        code: item.code,
        description: item.description,
        isChecked: true // In edit mode, existing codes should be checked
      };
    }
  });

  fields.push(
    ...[
      {
        component: Components['multiSelectDropdown'],
        id: 'diagnosis-code',
        name: 'diagnosisCode',
        label: translationFn('labels.diagnosisCodes'),
        isRequired: true,
        isMultiSelect: true,
        placeholder: translationFn('dropdown.placeholder.search'),
        clearAllSelectedValues: () => {
          setFieldValue('diagnosisCode', []);
        },
        onChange: (value) => {
          const changedValues = value.filter((item) => item.isChecked);
          if (CommonUtils.isNonEmptyArray(changedValues) && !areArraysEqual(changedValues, formValues.diagnosisCode))
            setFieldValue(
              'diagnosisCode',
              value.filter((item) => item.isChecked)
            );
        },
        options: mergeLists(normalizedDiagnosisCodes, diagnosisCode),
        variant: 'async',
        onSearch: onDiagnosisCodeSearch,
        recordsCountToEnableSearch: 5,
        size: 'lg',
        asyncRecordsFound: normalizedDiagnosisCodes.length,
        noSelectedCountMessage: translationFn('dropdown.helperText'),
        layout: {
          classes: 'grid grid-gap-16 grid-cols-3 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-baseline'
        }
      }
    ]
  );

  return fields;
};

function areArraysEqual(arr1 = [], arr2 = []) {
  if (arr1.length !== arr2.length) return false;

  const codes1 = new Set(arr1.map((item) => item.code));
  const codes2 = new Set(arr2.map((item) => item.code));

  if (codes1.size !== codes2.size) return false;

  for (let code of codes1) {
    if (!codes2.has(code)) return false;
  }

  return true;
}

function mergeLists(values = [], list = []) {
  const finalMap = new Map();

  for (const item of list) {
    finalMap.set(item.code, {
      label: `${item.code} ${item.description}`,
      value: item.code,
      code: item.code,
      description: item.description,
      isChecked: false
    });
  }

  for (const item of values) {
    if (finalMap.has(item.code)) {
      finalMap.get(item.code).isChecked = true;
    } else {
      finalMap.set(item.code, {
        label: `${item.code} ${item.description}`,
        value: item.code,
        code: item.code,
        description: item.description,
        isChecked: true
      });
    }
  }

  return Array.from(finalMap.values());
}

export const getPrescriptionDetailsFields = ({ translationFn, formValues, setFieldValue, setFieldTouched, readOnly }) => {
  const fields = [];

  fields.push(
    ...[
      {
        name: 'hasAllergies',
        id: 'allergies-radio-option-group',
        caption: translationFn('labels.hasAllergiesCaption'),
        isRequired: true,
        placeholder: ' ',
        component: Components['radioGroup'],
        onChangeValue: (value) => {
          setFieldValue('hasAllergies', value);
          if (value !== 'yes') {
            setFieldValue('allergyDetails', '');
            setFieldTouched('allergyDetails', false);
          }
        },
        items: getBinaryOptions('allergies', readOnly),
        layout: {
          classes: 'grid grid-gap-16 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 align-items-baseline'
        }
      },
      {
        name: 'allergyDetails',
        label: translationFn('labels.specifyAllergies'),
        isRequired: formValues?.['hasAllergies'] === 'yes',
        placeholder: ' ',
        isDisabled: formValues && formValues['hasAllergies'] === 'yes' ? false : true,
        component: Components['input'],
        layout: {
          classes: 'grid grid-gap-16 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 align-items-baseline'
        }
      }
    ]
  );

  return fields;
};

export const getPrescriptionDetailsSummaryFieldsConfig = ({ translationFn, formValues }) => {
  return [
    {
      rows: [
        {
          grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start',
          controls: [
            {
              name: 'drugName',
              label: translationFn('label.drugName'),
              isReadOnly: true,
              type: 'input'
            },
            {
              name: 'strength',
              label: translationFn('labels.therapy.strength'),
              isReadOnly: true,
              type: 'input'
            },
            {
              name: 'quantity',
              label: translationFn('label.quantity'),
              isReadOnly: true,
              type: 'input'
            }
          ]
        },
        {
          grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start',
          controls: [
            {
              name: 'daysSupply',
              label: translationFn('label.daysSupply'),
              isReadOnly: true,
              type: 'input'
            },
            {
              name: 'refills',
              label: translationFn('label.refill'),
              isReadOnly: true,
              type: 'input'
            }
          ]
        },
        {
          grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 align-items-start',
          controls: [
            {
              name: 'instructions',
              fieldLabel: translationFn('label.instructions'),
              isReadOnly: true,
              type: 'textarea',
              maxCharHelperText: translationFn('forms.placeholder.max_5000_chars'),
              maxCharLimit: 5000
            }
          ]
        },
        {
          grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 align-items-start',
          controls: [
            {
              id: 'acknowledgement',
              name: 'acknowledgement',
              fieldLabel: translationFn('label.acknowledgementInformationIsCorrect'),
              isReadOnly: true,
              type: 'checkbox',
              isDisabled: false,
              isChecked: false,
              caption: translationFn('label.acknowledgementInformationIsCorrect'),
              size: 'md'
            }
          ]
        },
        {
          grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 align-items-start',
          controls: [
            {
              id: 'terms',
              name: 'terms',
              fieldLabel: translationFn('labels.terms'),
              isReadOnly: true,
              type: 'checkbox',
              isDisabled: false,
              isChecked: false,
              caption: formValues?.['consentPolicy'] || 'N/A',
              size: 'md'
            }
          ]
        }
      ]
    }
  ];
};

export const getShipmentInformationForm = ({
  translationFn,
  setFieldValue,
  isVerifyingTransactionId,
  setIsVerifyingTransactionId,
  isTransactionIdVerified,
  setIsTransactionIdVerified,
  setAlert
}) => {
  const fields = [];
  const row1 = [];
  row1.push({
    name: 'secondLegShipInfo.transactionId',
    label: translationFn('labels.uniqueTransactionId'),
    placeholder: ' ',
    component: Components['inputText'],
    endIcon: isVerifyingTransactionId ? <LoadingIcon /> : isTransactionIdVerified ? <SuccessTick /> : null,
    onBlur: function (e) {
      let value = e.target.value.trim();
      setAlert(null);
      setIsVerifyingTransactionId(true);
      if (value.indexOf('/') > -1) {
        setFieldValue('secondLegShipInfo.transactionId', '');
        setAlert({
          type: 'warning',
          description: translationFn('message.incorrectTransactionId')
        });
        setIsVerifyingTransactionId(false);
        return;
      }
      OrderService.verifyTransactionId(value)
        .then((response) => {
          if (!response) {
            setFieldValue('secondLegShipInfo.transactionId', '');
            setAlert({
              type: 'warning',
              description: translationFn('message.incorrectTransactionId')
            });
          } else {
            setFieldValue('secondLegShipInfo.transactionId', value);
          }
          setIsTransactionIdVerified(response);
        })
        .finally(() => {
          setIsVerifyingTransactionId(false);
        });
    },
    size: 'lg'
  });

  row1.push({
    name: 'secondLegShipInfo.name',
    label: translationFn('labels.name'),
    placeholder: ' ',
    isRequired: true,
    minLength: 2,
    maxLength: 100,
    component: Components['input'],
    size: 'lg'
  });

  row1.push({
    name: 'secondLegShipInfo.address.address1',
    label: translationFn('userManagement.create_user.inputLabel.address_1'),
    placeholder: ' ',
    isRequired: true,
    maxLength: 150,
    component: Components['input'],
    size: 'lg'
  });
  row1.push({
    name: 'secondLegShipInfo.address.address2',
    label: translationFn('userManagement.create_user.inputLabel.address_2'),
    placeholder: ' ',
    maxLength: 150,
    component: Components['input'],
    size: 'lg'
  });
  fields.push(row1);

  const row2 = [];
  row2.push({
    name: 'secondLegShipInfo.address.city',
    label: translationFn('labels.city'),
    placeholder: ' ',
    isRequired: true,
    maxLength: 50,
    component: Components['input'],
    size: 'lg'
  });
  row2.push({
    name: 'secondLegShipInfo.address.zip',
    label: translationFn('userManagement.create_user.inputLabel.zip'),
    placeholder: ' ',
    isRequired: true,
    component: Components['zipInput'],
    size: 'lg'
  });
  row2.push({
    name: 'secondLegShipInfo.address.state',
    label: translationFn('userManagement.create_user.inputLabel.state'),
    placeholder: 'Select State',
    isRequired: true,
    options: US_STATES().unshift({
      isDisabled: true,
      value: '',
      label: translationFn('orgManagement.create_org.option.please_select')
    }),
    isMultiSelect: false,
    component: Components['stateDropdown'],
    size: 'lg'
  });
  row2.push({
    name: 'secondLegShipInfo.address.country',
    label: translationFn('labels.country'),
    placeholder: 'Select Country',
    isRequired: true,
    options: getCountries(),
    isMultiSelect: false,
    component: Components['dropdown'],
    size: 'lg'
  });
  row2.push({
    name: 'secondLegShipInfo.phoneNumber',
    label: translationFn('labels.phoneNumber'),
    placeholder: ' ',
    isRequired: true,
    component: Components['phoneInput'],
    size: 'lg'
  });

  fields.push(row2);

  return fields;
};
