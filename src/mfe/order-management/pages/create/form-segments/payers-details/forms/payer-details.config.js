import { US_STATES } from '@src/components/form/util';

const getStates = () => {
  const options = US_STATES();
  options.unshift({
    isDisabled: true,
    value: '',
    label: 'Select'
  });
  return options;
};

const payerPersonalDetailsTemplate = () => {
  return [
    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
      controls: [
        {
          id: 'payer-info-firstName',
          name: 'firstName',
          label: 'orderManagement.patientDetails.inputLabel.first_name',
          placeholder: ' ',
          type: 'input',
          maxLength: 50
        },
        {
          id: 'payer-info-middleName',
          name: 'middleName',
          label: 'orderManagement.patientDetails.inputLabel.middle_name',
          placeholder: ' ',
          type: 'input',
          maxLength: 50
        },
        {
          id: 'payer-info-lastName',
          name: 'lastName',
          label: 'orderManagement.patientDetails.inputLabel.last_name',
          placeholder: ' ',
          type: 'input',
          maxLength: 50
        }
      ]
    },
    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 align-items-start',
      controls: [
        {
          id: 'payer-info-addressLine1',
          name: 'addressLine1',
          label: 'orderManagement.patientDetails.inputLabel.address_1',
          placeholder: ' ',
          type: 'input',
          maxLength: 100
        },
        {
          id: 'payer-info-addressLine2',
          name: 'addressLine2',
          label: 'orderManagement.patientDetails.inputLabel.address_2',
          placeholder: ' ',
          maxLength: 100,
          type: 'input'
        }
      ]
    },
    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
      controls: [
        {
          id: 'payer-info-zip-code',
          name: 'zipCode',
          label: 'orderManagement.patientDetails.inputLabel.zip',
          placeholder: ' ',
          type: 'zipInput',
          maxLength: 8
        },
        {
          id: 'payer-info-city',
          name: 'city',
          label: 'orderManagement.patientDetails.inputLabel.city',
          placeholder: ' ',
          type: 'input',
          maxLength: 15
        },
        {
          id: 'payer-info-state',
          name: 'state',
          label: 'orderManagement.patientDetails.inputLabel.state',
          placeholder: ' ',
          type: 'dropdown',
          options: getStates()
        }
      ]
    }
  ];
};

const insuranceCoverageDetailsTemplate = () => {
  return [
    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
      controls: [
        {
          id: 'insurance-coverage-patient-relationship-to-subscriber',
          name: 'insuranceCoverageSubscriber',
          label: 'formControl.insuranceCoverageSubscriber',
          placeholder: ' ',
          type: 'dropdown',
          options: [],
          isRequired: true,
          maxLength: 50
        },
        {
          id: 'policy-number',
          name: 'policyNumber',
          label: 'formControl.insurancePolicyNumber',
          placeholder: ' ',
          type: 'input',
          isRequired: true,
          maxLength: 50
        },
        {
          id: 'group-number',
          name: 'groupNumber',
          label: 'formControl.insuranceGroupNumber',
          placeholder: ' ',
          type: 'input',
          maxLength: 50
        }
      ]
    },
    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 align-items-start',
      controls: [
        {
          id: 'insurance-plan-type',
          name: 'insurancePlanType',
          label: 'formControl.insurancePlanType',
          placeholder: ' ',
          type: 'input',
          maxLength: 100
        },
        {
          id: 'insurance-effective-date',
          name: 'insuranceEffectiveDate',
          label: 'formControl.insuranceEffectiveDate',
          placeholder: ' ',
          maxLength: 100,
          type: 'datePicker'
        },
        {
          id: 'insurance-rx-pcn-number',
          name: 'insuranceRxPcnNumber',
          label: 'formControl.insuranceRxPcnNumber',
          placeholder: ' ',
          maxLength: 100,
          type: 'input'
        }
      ]
    },
    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
      controls: [
        {
          id: 'insurance-grp-pcn-number',
          name: 'insuranceGrpPcnNumber',
          label: 'formControl.insuranceGrpPcnNumber',
          placeholder: ' ',
          maxLength: 100,
          type: 'input'
        },
        {
          id: 'insurance-rx-id-number',
          name: 'insuranceRxIdNumber',
          label: 'formControl.insuranceRxIdNumber',
          placeholder: ' ',
          maxLength: 100,
          type: 'input'
        },
        {
          id: 'insurance-rx-bin-number',
          name: 'insuranceRxBinNumber',
          label: 'formControl.insuranceRxBinNumber',
          placeholder: ' ',
          maxLength: 100,
          type: 'input'
        }
      ]
    }
  ];
};

export const sections = [
  {
    title: 'provider.providerDetails',
    subTitle: 'Primary Insurance Company',
    isRequired: true,
    rows: payerPersonalDetailsTemplate()
  },
  {
    subTitle: 'Primary Insurance Coverage',
    rows: insuranceCoverageDetailsTemplate()
  }
];
