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
            isRequired: true
          },
          {
            label: 'provider.middleName',
            type: 'input',
            name: 'middleName'
          },
          {
            label: 'provider.lastName',
            type: 'input',
            name: 'lastName',
            isRequired: true
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
            isRequired: true
          },
          {
            label: 'provider.npiNumber',
            type: 'input',
            name: 'npiNumber',
            isRequired: true
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
            isRequired: true
          },
          {
            label: 'provider.address2',
            type: 'input',
            name: 'address2'
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
            isRequired: true
          },
          {
            label: 'provider.zip',
            type: 'input',
            name: 'zip',
            isRequired: true
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
            label: 'provider.phoneNumber',
            type: 'input',
            name: 'phoneNumber',
            isRequired: true
          }
        ]
      }
    ]
  }
];
