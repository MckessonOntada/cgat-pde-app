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
          name: `${parentKey}.insuranceCompanyName`,
          label: 'form.label.insuranceCarrier',
          placeholder: '',
          type: 'input',
          isRequired: true,
          maxLength: 100
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
          isRequired: true,
          maxLength: 50
        }
      ]
    },

    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start',
      controls: [
        {
          id: `${parentKey}-insurance-company-phone-number`,
          name: `${parentKey}.insuranceCompanyPhone`,
          label: 'form.label.insuranceCarrierPhoneNumber',
          placeholder: '',
          type: 'phoneInput',
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
          name: `${parentKey}.dateOfBirth`,
          label: 'form.label.dob',
          placeholder: '',
          type: 'datePicker',
          isRequired: true,
          maxLength: 50
        },
        {
          id: `${parentKey}-relationship-to-patient`,
          name: `${parentKey}.relationshipToPatient`,
          label: 'label.policyHolderRelationshipToPatient',
          placeholder: '',
          type: 'dropdown',
          options: PATIENT_RELATIONSHIP.map((item) => {
            const value = item.includes('/') ? item.split('/').join('_OR_') : item;
            return {
              label: item,
              value: value.toUpperCase()
            };
          }),
          isRequired: true,
          maxLength: 50
        },
        {
          id: `${parentKey}-other-relationship-to-patient`,
          key: `${parentKey}-other-relationship-to-patient`,
          name: `${parentKey}.relation`,
          label: 'form.label.relation',
          placeholder: '',
          type: 'input',
          isRequired: true,
          when: [
            `${parentKey}.relationshipToPatient`,
            (val) => {
              return val === 'OTHER';
            }
          ],
          maxLength: 20
        }
      ]
    }
  ];
};

export const insuranceCardTemplate = (parentKey, cardKey) => {
  return [
    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 align-items-start',
      controls: [
        {
          id: `${parentKey}-insurance-card-front`,
          name: `${parentKey}.${cardKey}Front`,
          label: 'form.label.front',
          placeholder: '',
          type: 'inputFile',
          isRequired: false,
          maxLength: 50
        },
        {
          id: `${parentKey}-insurance-card-back`,
          name: `${parentKey}.${cardKey}Back`,
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
          maxLength: 100
        },
        {
          id: `${parentKey}-contact`,
          name: `${parentKey}.contactNumber`,
          label: 'form.label.contact',
          placeholder: '',
          type: 'phoneInput',
          isRequired: true,
          maxLength: 15
        },
        {
          id: `${parentKey}-rx-member-id`,
          name: `${parentKey}.rxMemberId`,
          label: 'form.label.rxMemberId',
          placeholder: '',
          type: 'input',
          isRequired: false,
          maxLength: 20
        }
      ]
    },

    {
      grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start',
      controls: [
        {
          id: `${parentKey}-rx-group-number`,
          name: `${parentKey}.rxGroupNumber`,
          label: 'form.label.rxGroupNumber',
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
          maxLength: 30
        },
        {
          id: `${parentKey}-rx-pcn`,
          name: `${parentKey}.rxPcn`,
          label: 'form.label.rxPcn',
          placeholder: '',
          type: 'input',
          isRequired: true,
          maxLength: 100
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
    rows: insuranceCardTemplate(parentKey, 'medicalCard')
  }
];

export const getPharmacyInsuranceUiTemplate = (parentKey, mainSectionTitle) => [
  {
    subTitle: mainSectionTitle,
    rows: pharmacyInsuranceTemplate(parentKey)
  },
  {
    subTitle: 'Upload Pharmacy Insurance Card',
    rows: insuranceCardTemplate(parentKey, 'pharmacyCard')
  }
];
