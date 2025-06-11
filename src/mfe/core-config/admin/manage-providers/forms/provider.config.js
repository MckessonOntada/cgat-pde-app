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
    title: 'provider.providerDetails',
    isRequired: true,
    rows: [
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
        controls: [
          {
            label: 'provider.firstName',
            type: 'input',
            name: 'firstName',
            isRequired: true,
            maxLength: 50
          },
          {
            label: 'provider.middleName',
            type: 'input',
            name: 'middleName',
            maxLength: 50
          },
          {
            label: 'provider.lastName',
            type: 'input',
            name: 'lastName',
            isRequired: true,
            maxLength: 50
          }
        ]
      },
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
        controls: [
          {
            label: 'provider.deaNumber',
            type: 'input',
            name: 'deaNumber',
            isRequired: true,
            maxLength: 9
          },
          {
            label: 'provider.npiNumber',
            type: 'input',
            name: 'npiNumber',
            isRequired: true,
            maxLength: 10
          },
          {
            label: 'provider.tinNumber',
            type: 'input',
            name: 'tinNumber',
            isRequired: true,
            maxLength: 9
          }
        ]
      },
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
        controls: [
          {
            label: 'provider.medicaidNumber',
            type: 'input',
            name: 'medicaidNumber',
            isRequired: true,
            maxLength: 6
          },
          {
            label: 'provider.licenseState',
            type: 'stateDropdown',
            name: 'licenseState',
            isRequired: false
          }
        ]
      }
    ]
  },
  {
    title: 'provider.contactDetails',
    rows: [
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 align-items-start',
        controls: [
          {
            label: 'provider.address1',
            type: 'input',
            name: 'address1',
            isRequired: true,
            maxLength: 100
          },
          {
            label: 'provider.address2',
            type: 'input',
            name: 'address2',
            maxLength: 100
          }
        ]
      },
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
        controls: [
          {
            label: 'provider.city',
            type: 'input',
            name: 'city',
            isRequired: true,
            maxLength: 50
          },
          {
            label: 'provider.zip',
            type: 'zipInput',
            name: 'zip',
            isRequired: true,
            maxLength: 10
          },
          {
            label: 'provider.state',
            type: 'dropdown',
            name: 'state',
            options: getStates(),
            isRequired: true
          }
        ]
      },
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
        controls: [
          {
            label: 'provider.emailId',
            type: 'input',
            name: 'emailId',
            isRequired: true,
            maxLength: 50
          },
          {
            label: 'provider.phoneNumber',
            type: 'phoneInput',
            name: 'phoneNumber',
            isRequired: true,
            maxLength: 10
          },
          {
            label: 'provider.fax',
            type: 'input',
            name: 'fax',
            isRequired: false,
            maxLength: 20
          }
        ]
      }
    ]
  }
];
