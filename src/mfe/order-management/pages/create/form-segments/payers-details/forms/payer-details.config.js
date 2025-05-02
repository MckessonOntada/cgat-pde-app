import { US_STATES } from '@src/components/form/util';

export const PATIENT_RELATIONSHIP = ['Self', 'Spouse', 'Father', 'Mother'];
export const PLAN_TYPES = ['HMO', 'PPO', 'EPO', 'POS', 'HDHP'];

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
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start',
      controls: [
        {
          id: 'payer-info-firstName',
          name: 'first-name',
          label: 'orderManagement.patientDetails.inputLabel.first_name',
          placeholder: ' ',
          type: 'input',
          isRequired: true,
          maxLength: 50
        },
        {
          id: 'payer-info-lastName',
          name: 'last-name',
          label: 'orderManagement.patientDetails.inputLabel.last_name',
          placeholder: ' ',
          type: 'input',
          maxLength: 50
        },
        {
          id: 'payer-info-phone-number',
          name: 'phone-number',
          label: 'orderManagement.patientDetails.inputLabel.phone_number',
          placeholder: ' ',
          type: 'phoneInput',
          maxLength: 50
        }
      ]
    },
    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 align-items-start',
      controls: [
        {
          id: 'payer-info-addressLine1',
          name: 'address-line-1',
          label: 'orderManagement.patientDetails.inputLabel.address_1',
          placeholder: ' ',
          type: 'input',
          maxLength: 100
        },
        {
          id: 'payer-info-addressLine2',
          name: 'address-line-2',
          label: 'orderManagement.patientDetails.inputLabel.address_2',
          placeholder: ' ',
          maxLength: 100,
          type: 'input'
        }
      ]
    },
    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start',
      controls: [
        {
          id: 'payer-info-zip-code',
          name: 'zip',
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
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start',
      controls: [
        {
          id: 'insurance-coverage-patient-relationship-to-subscriber',
          name: 'patient-relationship',
          label: 'formControl.patientRelationship',
          placeholder: ' ',
          type: 'dropdown',
          options: PATIENT_RELATIONSHIP.map((item) => ({
            label: item,
            value: item
          })),
          isRequired: true,
          maxLength: 50
        },
        {
          id: 'policy-number',
          name: 'policy-number',
          label: 'formControl.policyNumber',
          placeholder: ' ',
          type: 'input',
          isRequired: true,
          maxLength: 50
        },
        {
          id: 'group-number',
          name: 'group-number',
          label: 'formControl.groupNumber',
          placeholder: ' ',
          type: 'input',
          maxLength: 50
        }
      ]
    },
    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start',
      controls: [
        {
          id: 'insurance-plan-type',
          name: 'plan-type',
          label: 'formControl.planType',
          placeholder: ' ',
          type: 'dropdown',
          options: PLAN_TYPES.map((item) => ({
            label: item,
            value: item
          })),
          maxLength: 100
        },
        {
          id: 'insurance-effective-date',
          name: 'effective-date',
          label: 'formControl.effectiveDate',
          placeholder: ' ',
          maxLength: 100,
          type: 'datePicker',
          isRequired: true
        },
        {
          id: 'insurance-rx-pcn-number',
          name: 'rx-pcn-number',
          label: 'formControl.rxPCNNumber',
          placeholder: ' ',
          maxLength: 100,
          type: 'input'
        }
      ]
    },
    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start',
      controls: [
        {
          id: 'insurance-grp-pcn-number',
          name: 'rx-grp-number',
          label: 'formControl.rxGRPNumber',
          placeholder: ' ',
          maxLength: 100,
          type: 'input'
        },
        {
          id: 'insurance-rx-id-number',
          name: 'rx-id-number',
          label: 'formControl.rxIDNumber',
          placeholder: ' ',
          maxLength: 100,
          type: 'input'
        },
        {
          id: 'insurance-rx-bin-number',
          name: 'rx-bin-number',
          label: 'formControl.rxBINNumber',
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

export const insuranceCompanySections = [
  {
    subTitle: 'Drug Benefit Insurance Company',
    rows: payerPersonalDetailsTemplate()
  }
];
