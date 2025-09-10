import Components from '@src/components/form/Components';
import CommonUtils from '@src/util/CommonUtils';
import { CHANNEL_TYPE } from '../Constants';

const getBinaryOptions = (keyPrefix = '', readOnly) => {
  return ['Yes', 'No'].map((option, index) => ({
    key: `${keyPrefix}-option-${index}`,
    label: option,
    value: option.toLowerCase(),
    isDisabled: readOnly
  }));
};

export const getDefaultAdditionalDetailsFields = ({ translationFn, therapyConfig, channelType }) => {
  const fields = [];

  if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
    fields.push(
      {
        name: 'coiId',
        label: translationFn('labels.coiId'),
        placeholder: ' ',
        isRequired: therapyConfig.isCoiIdRequired,
        component: Components['input'],
        maxLength: 10
      },
      {
        name: 'orderQuantity',
        label: translationFn('labels.orderQuantity'),
        placeholder: ' ',
        isRequired: true,
        component: Components['input'],
        maxLength: 2
      },
      {
        name: 'slotNumber',
        label: translationFn('labels.provideSlotNumber'),
        placeholder: ' ',
        isRequired: true,
        component: Components['input'],
        maxLength: 20
      },
      {
        name: 'dateOfAdministration',
        label: translationFn('orderManagement.patientDetails.inputLabel.doa'),
        placeholder: ' ',
        isRequired: therapyConfig.isDOARequired,
        component: Components['datePicker'],
        disableDateTill: new Date(),
        disablePast: true
      },
      {
        name: 'dateOfApheresis',
        label: translationFn('orderManagement.patientDetails.inputLabel.dateOfApheresis'),
        placeholder: ' ',
        isRequired: therapyConfig.isDateOfApheresisRequired,
        component: Components['datePicker'],
        disableDateTill: new Date(),
        disablePast: true
      },
      {
        name: 'poNumber',
        label: translationFn('labels.providePONumber'),
        placeholder: ' ',
        isRequired: therapyConfig.isPORequired,
        component: Components['input'],
        maxLength: 35
      }
    );
  } else if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
  }

  return fields;
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
