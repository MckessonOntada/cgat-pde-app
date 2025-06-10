export const PATIENT_RELATIONSHIP = [
  'Self',
  'Spouse',
  'Child',
  'Parent',
  'Sibling',
  'Grandparent',
  'Grandchild',
  'Stepchild',
  'Stepparent',
  'Foster Child',
  'Guardian',
  'Ward',
  'Niece/Nephew',
  'Aunt/Uncle',
  'Cousin',
  'Partner',
  'Other'
];

export const medicalInsuranceTemplate = (parentKey) => {
  return [
    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start',
      controls: [
        {
          id: `${parentKey}-insurance-company`,
          name: `${parentKey}.insuranceCompany`,
          label: 'form.label.insuranceCompany',
          placeholder: '',
          type: 'input',
          isRequired: true,
          maxLength: 50
        },
        {
          id: `${parentKey}-member-number`,
          name: `${parentKey}.memberNumber`,
          label: 'form.label.memberNumber',
          placeholder: '',
          type: 'input',
          isRequired: true,
          maxLength: 50
        },
        {
          id: `${parentKey}-group-number`,
          name: `${parentKey}.groupNumber`,
          label: 'form.label.groupNumber',
          placeholder: '',
          type: 'input',
          isRequired: false,
          maxLength: 50
        }
      ]
    },

    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start',
      controls: [
        {
          id: `${parentKey}-insurance-company-phone-number`,
          name: `${parentKey}.phoneNumber`,
          label: 'form.label.phoneNumber',
          placeholder: '',
          type: 'input',
          isRequired: true,
          maxLength: 50
        },
        {
          id: `${parentKey}-policy-holder-first-name`,
          name: `${parentKey}.policyHolderFirstName`,
          label: 'form.label.policyHolderFirstName',
          placeholder: '',
          type: 'input',
          isRequired: true,
          maxLength: 50
        },
        {
          id: `${parentKey}-policy-holder-last-name`,
          name: `${parentKey}.policyHolderLastName`,
          label: 'form.label.policyHolderLastName',
          placeholder: '',
          type: 'input',
          isRequired: true,
          maxLength: 50
        }
      ]
    },

    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start',
      controls: [
        {
          id: `${parentKey}-dob`,
          name: `${parentKey}.dob`,
          label: 'form.label.dob',
          placeholder: '',
          type: 'datePicker',
          isRequired: true,
          maxLength: 50
        },
        {
          id: `${parentKey}-relationship-to-patient`,
          name: `${parentKey}.relationshipToPatient`,
          label: 'form.label.relationshipToPatient',
          placeholder: '',
          type: 'dropdown',
          options: PATIENT_RELATIONSHIP.map((item) => ({
            label: item,
            value: item.toUpperCase()
          })),
          isRequired: true,
          maxLength: 50
        }
      ]
    }
  ];
};

export const insuranceCardTemplate = (parentKey) => {
  return [
    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 align-items-start',
      controls: [
        {
          id: `${parentKey}-insurance-card-front`,
          name: `${parentKey}.insuranceCard.front`,
          label: 'form.label.front',
          placeholder: '',
          type: 'inputFile',
          isRequired: false,
          maxLength: 50
        },
        {
          id: `${parentKey}-insurance-card-back`,
          name: `${parentKey}.insuranceCard.back`,
          label: 'form.label.back',
          placeholder: '',
          type: 'inputFile',
          isRequired: false,
          maxLength: 50
        }
      ]
    }
  ];
};

export const pharmacyInsuranceTemplate = (parentKey) => {
  return [
    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start',
      controls: [
        {
          id: `${parentKey}-pharmacy-benefit-manager-name`,
          name: `${parentKey}.pharmacyBenefitManagerName`,
          label: 'form.label.pharmacyBenefitManagerName',
          placeholder: '',
          type: 'input',
          isRequired: true,
          maxLength: 50
        },
        {
          id: `${parentKey}-rx-group-number`,
          name: `${parentKey}.rxGroupNumber`,
          label: 'form.label.rxGroupNumber',
          placeholder: '',
          type: 'input',
          isRequired: false,
          maxLength: 50
        },
        {
          id: `${parentKey}-rx-member-id`,
          name: `${parentKey}.rxMemberId`,
          label: 'form.label.rxMemberId',
          placeholder: '',
          type: 'input',
          isRequired: true,
          maxLength: 50
        }
      ]
    },

    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start',
      controls: [
        {
          id: `${parentKey}-rx-pcn`,
          name: `${parentKey}.rxPcn`,
          label: 'form.label.rxPcn',
          placeholder: '',
          type: 'input',
          isRequired: true,
          maxLength: 50
        },
        {
          id: `${parentKey}-rx-bin`,
          name: `${parentKey}.rxBin`,
          label: 'form.label.rxBin',
          placeholder: '',
          type: 'input',
          isRequired: true,
          maxLength: 50
        }
      ]
    }
  ];
};

export const getMedicalInsuranceUiTemplate = (parentKey, mainSectionTitle) => [
  {
    subTitle: mainSectionTitle,
    rows: medicalInsuranceTemplate(parentKey)
  },
  {
    subTitle: 'Upload Medical Insurance Card',
    rows: insuranceCardTemplate(parentKey)
  }
];

export const getPharmacyInsuranceUiTemplate = (parentKey, mainSectionTitle) => [
  {
    subTitle: mainSectionTitle,
    rows: pharmacyInsuranceTemplate(parentKey)
  },
  {
    subTitle: 'Upload Medical Insurance Card',
    rows: insuranceCardTemplate(parentKey)
  }
];
