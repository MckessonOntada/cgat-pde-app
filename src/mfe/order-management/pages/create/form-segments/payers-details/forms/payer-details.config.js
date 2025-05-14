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

export const payerPersonalDetailsTemplate = (parentKey) => {
  return [
    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start',
      controls: [
        {
          id: 'payer-info-firstName',
          name: `${parentKey}.name.firstName`,
          value: `${parentKey}.name.firstName`,
          label: 'orderManagement.patientDetails.inputLabel.first_name',
          placeholder: ' ',
          type: 'input',
          isRequired: true,
          maxLength: 50
        },
        {
          id: 'payer-info-lastName',
          name: `${parentKey}.name.lastName`,
          label: 'orderManagement.patientDetails.inputLabel.last_name',
          placeholder: ' ',
          type: 'input',
          isRequired: true,
          maxLength: 50
        },
        {
          id: 'payer-info-phone-number',
          name: `${parentKey}.phone`,
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
          name: `${parentKey}.address.address1`,
          label: 'orderManagement.patientDetails.inputLabel.address_1',
          placeholder: ' ',
          type: 'input',
          maxLength: 100
        },
        {
          id: 'payer-info-addressLine2',
          name: `${parentKey}.address.address2`,
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
          name: `${parentKey}.address.zip`,
          label: 'orderManagement.patientDetails.inputLabel.zip',
          placeholder: ' ',
          type: 'zipInput',
          maxLength: 8
        },
        {
          id: 'payer-info-city',
          name: `${parentKey}.address.city`,
          label: 'orderManagement.patientDetails.inputLabel.city',
          placeholder: ' ',
          type: 'input',
          maxLength: 15
        },
        {
          id: 'payer-info-state',
          name: `${parentKey}.address.state`,
          label: 'orderManagement.patientDetails.inputLabel.state',
          placeholder: ' ',
          type: 'dropdown',
          options: getStates()
        }
      ]
    }
  ];
};

export const insuranceCoverageDetailsTemplate = () => {
  return [
    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start',
      controls: [
        {
          id: 'insurance-coverage-patient-relationship-to-subscriber',
          name: 'primaryInsuranceCoverage.patientSubscriberRelationship',
          label: 'formControl.patientRelationship',
          placeholder: ' ',
          type: 'dropdown',
          options: PATIENT_RELATIONSHIP.map((item) => ({
            label: item,
            value: item.toUpperCase()
          })),
          isRequired: true,
          maxLength: 50
        },
        {
          id: 'policy-number',
          name: 'primaryInsuranceCoverage.policyNumber',
          label: 'formControl.policyNumber',
          placeholder: ' ',
          type: 'input',
          isRequired: true,
          maxLength: 50
        },
        {
          id: 'group-number',
          name: 'primaryInsuranceCoverage.groupNumber',
          label: 'formControl.groupNumber',
          isRequired: true,
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
          name: 'primaryInsuranceCoverage.planType',
          label: 'formControl.planType',
          placeholder: ' ',
          type: 'dropdown',
          options: PLAN_TYPES.map((item) => ({
            label: item,
            value: item
          })),
          maxLength: 100,
          isRequired: true,
        },
        {
          id: 'insurance-effective-date',
          name: 'primaryInsuranceCoverage.effectiveDate',
          label: 'formControl.effectiveDate',
          placeholder: ' ',
          maxLength: 100,
          type: 'datePicker',
          isRequired: true,
        },
        {
          id: 'insurance-rx-pcn-number',
          name: 'primaryInsuranceCoverage.pcnNumber',
          label: 'formControl.rxPCNNumber',
          placeholder: ' ',
          maxLength: 100,
          type: 'input',
          isRequired: true,
        }
      ]
    },
    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start',
      controls: [
        {
          id: 'insurance-grp-pcn-number',
          name: 'primaryInsuranceCoverage.grpNumber',
          label: 'formControl.rxGRPNumber',
          placeholder: ' ',
          maxLength: 100,
          type: 'input',
          isRequired: true,
        },
        {
          id: 'insurance-rx-id-number',
          name: 'primaryInsuranceCoverage.idNumber',
          label: 'formControl.rxIDNumber',
          placeholder: ' ',
          maxLength: 100,
          type: 'input',
          isRequired: true,
        },
        {
          id: 'insurance-rx-bin-number',
          name: 'primaryInsuranceCoverage.binNumber',
          label: 'formControl.rxBINNumber',
          placeholder: ' ',
          maxLength: 100,
          type: 'input',
          isRequired: true,
        }
      ]
    }
  ];
};

export const sections = [
  {
    title: 'provider.payerDetails',
    subTitle: 'Primary Insurance Company',
    isRequired: true,
    rows: payerPersonalDetailsTemplate('primaryInsuranceCompany')
  },
  {
    subTitle: 'Primary Insurance Coverage',
    rows: insuranceCoverageDetailsTemplate()
  }
];

export const insuranceCompanySections = () => ({
  subTitle: 'Drug Benefit Insurance Company',
  rows: payerPersonalDetailsTemplate('drugBenefitInsuranceCompany')
});
