import { US_STATES } from '@src/components/form/util';
import { CHANNEL_TYPE, MANUFACTURER } from '../../Constants';

const getStates = () => {
  const options = US_STATES();
  options.unshift({
    isDisabled: true,
    value: '',
    label: 'Select'
  });
  return options;
};
export const PatientSections = (channelType, therapyConfig, validateOnBlur, manufacturerVerified = false, manufacturer) => [
  {
    rows: [
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start',
        controls: [
          {
            id: 'patient-info-firstName',
            name: 'patient.patientInfo.firstName',
            label: 'orderManagement.patientDetails.inputLabel.first_name',
            placeholder: ' ',
            type: 'input',
            maxLength: 50,
            isReadOnly: [MANUFACTURER.ORCA].includes(manufacturer),
            isRequired: channelType === CHANNEL_TYPE.SPECIALTY_PHARMA
          },
          {
            id: 'patient-info-middleName',
            name: 'patient.patientInfo.middleName',
            label: 'orderManagement.patientDetails.inputLabel.middle_name',
            placeholder: ' ',
            type: 'input',
            maxLength: 50,
            isReadOnly: [MANUFACTURER.ORCA].includes(manufacturer)
          },
          {
            id: 'patient-info-lastName',
            name: 'patient.patientInfo.lastName',
            label: 'orderManagement.patientDetails.inputLabel.last_name',
            placeholder: ' ',
            type: 'input',
            maxLength: 50,
            isReadOnly: [MANUFACTURER.ORCA].includes(manufacturer),
            isRequired: channelType === CHANNEL_TYPE.SPECIALTY_PHARMA
          }
        ]
      },
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start',
        controls: [
          {
            id: 'patient-info-gender',
            name: 'patient.patientInfo.gender',
            label: 'orderManagement.patientDetails.inputLabel.gender',
            placeholder: ' ',
            type: 'dropdown',
            options: ['Male', 'Female', 'Other'].map((item) => ({
              label: item,
              value: item
            })),
            isReadOnly: [MANUFACTURER.ORCA].includes(manufacturer),
            isRequired: channelType === CHANNEL_TYPE.SPECIALTY_PHARMA
          },
          {
            id: 'patient-info-dateOfBirth',
            name: 'patient.patientInfo.dateOfBirth',
            label: 'orderManagement.patientDetails.inputLabel.date_of_birth',
            placeholder: ' ',
            type: 'datePicker',
            disableFuture: true,
            isReadOnly: [MANUFACTURER.ORCA].includes(manufacturer),
            isRequired: channelType === CHANNEL_TYPE.SPECIALTY_PHARMA
          },
          ...(channelType === CHANNEL_TYPE.BUY_AND_BILL
            ? therapyConfig?.config?.fields
                ?.filter((field) => ['patientIdentifier', 'medicalRecordNumber'].includes(field.fieldName) && field?.properties?.displayOnForm)
                ?.map((field) => {
                  const prefix = field?.properties?.fieldFormat?.validationFormat?.match(/prefix\('([^']*)'\)/)?.[1] ?? '';
                  const suffix = field?.properties?.fieldFormat?.validationFormat?.match(/suffix\('([^']*)'\)/)?.[1] ?? '';
                  return {
                    id: `patient-info-${field.fieldName}`,
                    name: `patient.${field.fieldName}`,
                    label: field.properties.displayName,
                    type: prefix || suffix ? 'inputText' : field?.properties.fieldFormat.formatType === 'Date_MM_DD_YYYY' ? 'datePicker' : 'input',
                    prefix,
                    suffix,
                    isRequired: field.properties.mandatoryField,
                    infoText: field?.properties.helpInfoMessage,
                    onBlur: validateOnBlur
                  };
                }) || []
            : [])
        ]
      }
    ]
  }
];

export const AddressSections = (channelType) => [
  {
    rows: [
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-2 align-items-start',
        controls: [
          {
            id: 'patient-info-addressLine1',
            name: 'patient.patientAddress.addressLine1',
            label: 'orderManagement.patientDetails.inputLabel.address_1',
            placeholder: ' ',
            type: 'input',
            maxLength: 100,
            isRequired: true
          },
          {
            id: 'patient-info-addressLine2',
            name: 'patient.patientAddress.addressLine2',
            label: 'orderManagement.patientDetails.inputLabel.address_2',
            placeholder: ' ',
            type: 'input',
            maxLength: 100
          }
        ]
      },
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
        controls: [
          {
            id: 'patient-info-city',
            name: 'patient.patientAddress.city',
            label: 'orderManagement.patientDetails.inputLabel.city',
            placeholder: ' ',
            type: 'input',
            maxLength: 15,
            isRequired: channelType === CHANNEL_TYPE.SPECIALTY_PHARMA
          },
          {
            id: 'patient-info-zip-code',
            name: 'patient.patientAddress.zipCode',
            label: 'orderManagement.patientDetails.inputLabel.zip',
            placeholder: ' ',
            type: 'zipInput',
            maxLength: 8,
            isRequired: channelType === CHANNEL_TYPE.SPECIALTY_PHARMA
          },
          {
            id: 'patient-info-state',
            name: 'patient.patientAddress.state',
            label: 'orderManagement.patientDetails.inputLabel.state',
            placeholder: ' ',
            type: 'stateDropdown',
            options: getStates(),
            isRequired: channelType === CHANNEL_TYPE.SPECIALTY_PHARMA
          }
        ]
      },
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
        controls: [
          {
            id: 'patient-info-home-phone',
            name: 'patient.contact.homePhone',
            label: 'orderManagement.patientDetails.inputLabel.homePhone',
            placeholder: ' ',
            type: 'phoneInput',
            maxLength: 15
          },
          {
            id: 'patient-info-mobile-number',
            name: 'patient.contact.phoneNumber',
            label: 'orderManagement.patientDetails.inputLabel.mobileNumber',
            type: 'phoneInput',
            maxLength: 10,
            isRequired: channelType === CHANNEL_TYPE.SPECIALTY_PHARMA
          },
          {
            id: 'patient-info-work-phone',
            name: 'patient.contact.workPhone',
            label: 'orderManagement.patientDetails.inputLabel.workPhone',
            type: 'phoneInput',
            maxLength: 10
          },
          {
            id: 'patient-info-email-address',
            name: 'patient.contact.emailId',
            label: 'orderManagement.patientDetails.inputLabel.email',
            placeholder: ' ',
            type: 'input',
            maxLength: 100
          },
          {
            id: 'patient-info-preferred-method-of-contact',
            name: 'patient.contact.preferedMethodOfContact',
            label: 'orderManagement.patientDetails.inputLabel.preferredMethodOfContact',
            type: 'dropdown',
            options: ['Mobile', 'Fax'].map((item) => ({
              label: item,
              value: item
            })),
            maxLength: 10
          }
        ]
      }
    ]
  }
];

export const IdentifierSections = (spTherapyConfig, validateOnBlur) => {
  const controls = [];
  spTherapyConfig?.config?.fields?.forEach((field) => {
    if (field?.properties?.displayOnForm) {
      const prefix = field?.properties?.fieldFormat?.validationFormat?.match(/prefix\('([^']*)'\)/)?.[1] ?? '';
      const suffix = field?.properties?.fieldFormat?.validationFormat?.match(/suffix\('([^']*)'\)/)?.[1] ?? '';
      controls.push({
        id: `patient-info-${field.fieldName}`,
        name: `patient.${field.fieldName}`,
        label: field.properties.displayName,
        isRequired: field.properties.mandatoryField,
        infoText: field?.properties.helpInfoMessage,
        type: prefix || suffix ? 'inputText' : field?.properties.fieldFormat.formatType === 'Date_MM_DD_YYYY' ? 'datePicker' : 'input',
        prefix,
        suffix,
        ...(['patientIdentifier', 'coiId'].includes(field.fieldName) && { onBlur: validateOnBlur })
      });
    }
  });

  if (controls.length === 0) {
    return [];
  }

  return [
    {
      rows: [
        {
          grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
          controls: controls
        }
      ]
    }
  ];
};
