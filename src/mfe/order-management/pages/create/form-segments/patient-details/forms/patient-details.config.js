import { US_STATES } from '@src/components/form/util';
import { CHANNEL_TYPE } from '../../Constants';

const getStates = () => {
  const options = US_STATES();
  options.unshift({
    isDisabled: true,
    value: '',
    label: 'Select'
  });
  return options;
};

export const sections = (channelType) => {
  return [
    {
      title: 'orderManagement.patientDetails.patient_details',
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
              isRequired: channelType ? true : false
            },
            {
              id: 'patient-info-middleName',
              name: 'patient.patientInfo.middleName',
              label: 'orderManagement.patientDetails.inputLabel.middle_name',
              placeholder: ' ',
              type: 'input',
              maxLength: 50
            },
            {
              id: 'patient-info-lastName',
              name: 'patient.patientInfo.lastName',
              label: 'orderManagement.patientDetails.inputLabel.last_name',
              placeholder: ' ',
              type: 'input',
              maxLength: 50,
              isRequired: channelType ? true : false
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
              isRequired: channelType ? true : false
            },
            {
              id: 'patient-info-dateOfBirth',
              name: 'patient.patientInfo.dateOfBirth',
              label: 'orderManagement.patientDetails.inputLabel.date_of_birth',
              placeholder: ' ',
              type: 'datePicker',
              maxLength: 50,
              disableFuture: true,
              isRequired: channelType ? true : false
            },
            {
              id: 'patient-info-identifier',
              name: 'patient.patientIdentifier',
              label:
                'orderManagement.patientDetails.inputLabel.patientIdentifier',
              placeholder: ' ',
              isRequired: true,
              type: 'input',
              maxLength: 20
            },
            {
              id: 'patient-info-medicalRecordNumber',
              name: 'patient.medicalRecordNumber',
              label: 'orderManagement.patientDetails.inputLabel.mrn',
              placeholder: ' ',
              isRequired: false,
              type: 'input',
              maxLength: 20
            }
          ]
        }
      ]
    }
  ];
};
