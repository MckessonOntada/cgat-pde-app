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

export const sections = [
  {
    title: 'orderManagement.patientDetails.patient_details',
    rows: [
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
        controls: [
          {
            id: 'patient-info-firstName',
            name: 'firstName',
            label: 'orderManagement.patientDetails.inputLabel.first_name',
            placeholder: ' ',
            type: 'input',
            maxLength: 50
          },
          {
            id: 'patient-info-middleName',
            name: 'middleName',
            label: 'orderManagement.patientDetails.inputLabel.middle_name',
            placeholder: ' ',
            type: 'input',
            maxLength: 50
          },
          {
            id: 'patient-info-lastName',
            name: 'lastName',
            label: 'orderManagement.patientDetails.inputLabel.last_name',
            placeholder: ' ',
            type: 'input',
            maxLength: 50
          }
        ]
      },
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
        controls: [
          {
            id: 'patient-info-gender',
            name: 'gender',
            label: 'orderManagement.patientDetails.inputLabel.gender',
            placeholder: ' ',
            type: 'dropdown',
            options: [
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' }
            ]
          },
          {
            id: 'patient-info-dateOfBirth',
            name: 'dateOfBirth',
            label: 'orderManagement.patientDetails.inputLabel.date_of_birth',
            placeholder: ' ',
            type: 'datePicker',
            maxLength: 50,
            disableFuture: true
          },
          {
            id: 'patient-info-identifier',
            name: 'patientIdentifier',
            label:
              'orderManagement.patientDetails.inputLabel.patientIdentifier',
            placeholder: ' ',
            isRequired: true,
            type: 'input',
            maxLength: 20
          }
        ]
      },
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 align-items-start',
        controls: [
          {
            id: 'patient-info-addressLine1',
            name: 'addressLine1',
            label: 'orderManagement.patientDetails.inputLabel.address_1',
            placeholder: ' ',
            type: 'input',
            maxLength: 100
          },
          {
            id: 'patient-info-addressLine2',
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
            id: 'patient-info-city',
            name: 'city',
            label: 'orderManagement.patientDetails.inputLabel.city',
            placeholder: ' ',
            type: 'input',
            maxLength: 15
          },
          {
            id: 'patient-info-zip-code',
            name: 'zipCode',
            label: 'orderManagement.patientDetails.inputLabel.zip',
            placeholder: ' ',
            type: 'zipInput',
            maxLength: 8
          },
          {
            id: 'patient-info-state',
            name: 'state',
            label: 'orderManagement.patientDetails.inputLabel.state',
            placeholder: ' ',
            type: 'dropdown',
            options: getStates()
          }
        ]
      },
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
        controls: [
          {
            id: 'patient-info-home-phone',
            name: 'formControl.phone',
            label: 'orderManagement.patientDetails.inputLabel.phone_no',
            placeholder: ' ',
            type: 'phoneInput',
            maxLength: 15,
            if: (channelType) => channelType !== 'SP'
          },
          {
            id: 'patient-info-home-phone',
            name: 'formControl.homePhone',
            label: 'orderManagement.patientDetails.inputLabel.phone_no',
            placeholder: ' ',
            type: 'phoneInput',
            maxLength: 15,
            if: (channelType) => channelType === 'SP'
          },
          {
            id: 'patient-info-mobile-number',
            label: 'formControl.mobileNumber',
            type: 'phoneInput',
            name: 'phoneNumber',
            maxLength: 10,
            if: (channelType) => channelType === 'SP'
          },
          {
            id: 'patient-info-work-phone',
            label: 'formControl.workPhone',
            type: 'phoneInput',
            name: 'phoneNumber',
            maxLength: 10,
            if: (channelType) => channelType === 'SP'
          },
          {
            id: 'patient-info-email-address',
            name: 'emailAddress',
            label: 'orderManagement.patientDetails.inputLabel.email',
            placeholder: ' ',
            type: 'input',
            maxLength: 100
          },
          {
            id: 'patient-info-preferred-method-of-contact',
            label: 'formControl.preferredMethodOfContact',
            type: 'dropdown',
            options: ['Mobile', 'Fax'].map((item) => ({
              label: item,
              value: item
            })),
            name: 'preferredContactMethod',
            maxLength: 10,
            if: (channelType) => channelType === 'SP'
          }
        ]
      }
    ]
  }
];
