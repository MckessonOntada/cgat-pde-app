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
    title: 'Provider Details',
    isRequired: true,
    rows: [
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
        controls: [
          {
            label: 'First Name',
            type: 'input',
            name: 'firstName',
            isRequired: true
          },
          {
            label: 'Middle Name',
            type: 'input',
            name: 'middleName'
          },
          {
            label: 'Last Name',
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
            label: 'DEA Number',
            type: 'input',
            name: 'deaNumber',
            isRequired: true
          },
          {
            label: 'NPI Number',
            type: 'input',
            name: 'npiNumber',
            isRequired: true
          }
        ]
      }
    ]
  },
  {
    title: 'Contact Details',
    rows: [
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 align-items-start',
        controls: [
          {
            label: 'Address 1',
            type: 'input',
            name: 'address1',
            isRequired: true
          },
          {
            label: 'Address 2',
            type: 'input',
            name: 'address2'
          }
        ]
      },
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
        controls: [
          { label: 'City', type: 'input', name: 'city', isRequired: true },
          { label: 'Zip', type: 'input', name: 'zip', isRequired: true },
          {
            label: 'State',
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
            label: 'Phone Number',
            type: 'input',
            name: 'phoneNumber',
            isRequired: true
          }
        ]
      }
    ]
  }
];
