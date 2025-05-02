import ProviderService from '@src/api/commonService/ProviderService';

export const providerSections = ({ providers = [] }) => {
  console.log(providers);
  return [
    {
      rows: [
        {
          grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 align-items-start',
          controls: [
            {
              id: 'patient-info-provider',
              name: 'provider',
              label: '',
              placeholder: 'Select Provider',
              type: 'dropdown',
              options: providers,
              maxLength: 50
            }
          ]
        }
      ]
    }
  ];
};
