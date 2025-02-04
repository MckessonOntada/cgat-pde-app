import Components from '@src/components/form/Components';

export const getFormFields = (t, config) => [
  {
    name: 'coiId',
    label: t('labels.coiId'),
    placeholder: ' ',
    isRequired: config.isCoiIdRequired,
    component: Components['input'],
    maxLength: 50
  },
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
    maxLength: 50
  },
  {
    name: 'poNumber',
    label: t('labels.providePONumber'),
    placeholder: ' ',
    isRequired: true,
    component: Components['input'],
    maxLength: 40
  },
  {
    name: 'dateOfAdministration',
    label: t('labels.provideDateOfAdministration'),
    placeholder: ' ',
    isRequired: true,
    component: Components['datePicker'],
    disableDateTill: new Date(),
    disablePast: true
  }
];
