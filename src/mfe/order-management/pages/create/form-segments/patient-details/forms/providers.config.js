import ProviderService from '@src/api/commonService/ProviderService';

export const providerSections = ({ providers = [] }) => {
  return [
    {
      rows: [
        {
          grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
          controls: [
            {
              id: 'patient-info-provider',
              name: 'provider',
              label: '',
              placeholder: ' ',
              type: 'dropdown',
              option: providers,
              maxLength: 50
            }
          ]
        }
      ]
    }
  ];
};
