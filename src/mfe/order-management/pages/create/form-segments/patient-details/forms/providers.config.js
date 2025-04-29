export const providerSections = [
  {
    title: 'formSections.provider-details',
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
            option: [],
            maxLength: 50
          }
        ]
      }
    ]
  }
];
