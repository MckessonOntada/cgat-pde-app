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

export const getFormFields = (t, config, setFieldValue) => {
  const fields = [];
  const { isCoiIdRequired, channelType } = config;

  if (isCoiIdRequired && channelType === CHANNEL_TYPE.BUY_AND_BILL) {
    fields.push({
      name: 'coiId',
      label: t('labels.coiId'),
      placeholder: ' ',
      isRequired: config.isCoiIdRequired,
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
          maxLength: 50
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
          label: t('labels.provideDateOfAdministration'),
          placeholder: ' ',
          component: Components['datePicker'],
          disableDateTill: new Date(),
          disablePast: true
        }
      ]
    );
  }

  fields.push(
    ...[
      {
        name: 'poNumber',
        label: t('labels.providePONumber'),
        placeholder: ' ',
        isRequired: true,
        component: Components['input'],
        maxLength: 35
      }
    ]
  );

  if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
    fields.push(
      ...[
        {
          name: 'diagnosisCode',
          label: t('labels.diagnosisCodes'), //t('labels.diagnosisCode'),
          placeholder: ' ',
          isRequired: true,
          component: Components['input'],
          maxLength: 50
        }
      ]
    );
  }

  return fields;
};

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
          console.log('form', form);
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
      },
      {
        name: 'hasDiseases',
        id: 'diseases-radio-option-group',
        caption: t('labels.hasDiseasesCaption'),
        isRequired: true,
        placeholder: ' ',
        component: Components['radioGroup'],
        items: getBinaryOptions('diseases'),
        layout: {
          classes: 'grid grid-gap-16 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 align-items-baseline'
        }
      },
      {
        name: 'dateOfAdministration',
        label: t('labels.provideDateOfAdministration'),
        placeholder: ' ',
        component: Components['datePicker'],
        disableDateTill: new Date(),
        disablePast: true,
        layout: {
          classes: 'grid grid-gap-16 grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-baseline'
        }
      }
    ]
  );

  return fields;
};
