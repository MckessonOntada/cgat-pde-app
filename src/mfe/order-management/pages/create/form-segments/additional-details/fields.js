import Components from '@src/components/form/Components';
import { CHANNEL_TYPE } from '../Constants';

const getBinaryOptions = (keyPrefix = '') => {
  return ['Yes', 'No'].map((option, index) => ({
    key: `${keyPrefix}-option-${index}`,
    label: option,
    value: option.toLowerCase(),
    isDisabled: false
  }));
};

export const getFormFields = (t, config, setFieldValue, values, onDiagnosisCodeSearch, diagnosisCode) => {
  const fields = [];
  const { therapyConfig, channelType } = config;

  if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
    fields.push({
      name: 'coiId',
      label: t('labels.coiId'),
      placeholder: ' ',
      isRequired: therapyConfig.isCoiIdRequired,
      component: Components['input'],
      maxLength: 10
    });
  }

  if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
    fields.push(
      ...[
        {
          name: 'orderQuantity',
          label: t('labels.orderQuantity'),
          placeholder: ' ',
          isRequired: true,
          component: Components['input'],
          maxLength: 2
        },
        {
          name: 'slotNumber',
          label: t('labels.provideSlotNumber'),
          placeholder: ' ',
          isRequired: true,
          component: Components['input'],
          maxLength: 20
        },
        {
          name: 'dateOfAdministration',
          label: t('orderManagement.patientDetails.inputLabel.doa'),
          placeholder: ' ',
          isRequired: therapyConfig.isDOARequired,
          component: Components['datePicker'],
          disableDateTill: new Date(),
          disablePast: true
        },
        {
          name: 'poNumber',
          label: t('labels.providePONumber'),
          placeholder: ' ',
          isRequired: therapyConfig.isPORequired,
          component: Components['input'],
          maxLength: 35
        },
        {
          name: 'medicalRecordNumber',
          label: t('orderManagement.patientDetails.inputLabel.mrn'),
          placeholder: ' ',
          isRequired: therapyConfig.isMRNRequired,
          component: Components['input'],
          maxLength: 11
        }
      ]
    );
  }

  if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
    fields.push(
      ...[
        {
          component: Components['multiSelectDropdown'],
          id: 'diagnosis-code',
          name: 'diagnosis-code',
          label: t('labels.diagnosisCodes'),
          isRequired: true,
          isMultiSelect: true,
          placeholder: 'Search',
          onChange: (value) => {
            const changedValues = value.filter((item) => item.isChecked).map((item) => item.value);
            if (!areArraysEqual(changedValues, values.diagnosisCode))
              setFieldValue(
                'diagnosisCode',
                value.filter((item) => item.isChecked).map((item) => item.value)
              );
          },
          options: mergeLists(values.diagnosisCode, diagnosisCode),
          variant: 'async',
          onSearch: onDiagnosisCodeSearch,
          recordsCountToEnableSearch: 5,
          size: 'lg',
          asyncRecordsFound: values.diagnosisCode.length,
          noSelectedCountMessage: 'Select an option'
        }
      ]
    );
  }

  return fields;
};

function areArraysEqual(arr1 = [], arr2 = []) {
  if (arr1.length !== arr2.length) return false;

  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  if (set1.size !== set2.size) return false;

  for (let item of set1) {
    if (!set2.has(item)) return false;
  }

  return true;
}

function mergeLists(values, list) {
  const valueSet = new Set(values);
  const mergedSet = new Set([...values, ...list]);

  return Array.from(mergedSet).map((item) => ({
    label: item.toUpperCase(),
    value: item,
    isChecked: valueSet.has(item)
  }));
}

export const getClinicalDetailFields = (t, config, setFieldValue, setFieldTouched) => {
  const fields = [];
  const { values } = config;

  fields.push(
    ...[
      {
        name: 'hasAllergies',
        id: 'allergies-radio-option-group',
        caption: t('labels.hasAllergiesCaption'),
        isRequired: true,
        placeholder: ' ',
        component: Components['radioGroup'],
        onChangeValue: (value, form) => {
          setFieldValue('hasAllergies', value);
          if (value !== 'yes') {
            setFieldValue('allergyDetails', '');
            setFieldTouched('allergyDetails', false);
          }
        },
        items: getBinaryOptions('allergies'),
        layout: {
          classes: 'grid grid-gap-16 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 align-items-baseline'
        }
      },
      {
        name: 'allergyDetails',
        label: t('labels.specifyAllergies'),
        isRequired: values?.['hasAllergies'] === 'yes',
        placeholder: ' ',
        isDisabled: values && values['hasAllergies'] === 'yes' ? false : true,
        component: Components['input'],
        layout: {
          classes: 'grid grid-gap-16 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 align-items-baseline'
        }
      }
    ]
  );

  return fields;
};
