export const prescriptionAndSignatureSection = [
  {
    title: 'labels.prescriptionDetails',
    isRequired: true,
    rows: [
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
        controls: [
          {
            id: 'drugName',
            name: 'drugName',
            label: 'labels.drugName',
            type: 'input',
            readOnly: true
          },
          {
            id: 'drugForm',
            name: 'drugForm',
            label: 'labels.drugForm',
            type: 'input',
            readOnly: true
          },
          {
            id: 'strength',
            name: 'strength',
            label: 'labels.therapy.strength',
            type: 'input',
            readOnly: true
          }
        ]
      },
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start',
        controls: [
          {
            id: 'quantity',
            name: 'quantity',
            label: 'labels.quantity',
            type: 'input',
            placeholder: ' ',
            isRequired: true,
            maxLength: 2
          },
          {
            id: 'day-supply',
            name: 'daysSupply',
            label: 'labels.daySupply',
            type: 'input',
            placeholder: ' ',
            isRequired: true,
            maxLength: 2
          },
          {
            id: 'refills',
            name: 'refills',
            label: 'labels.refills',
            type: 'input',
            placeholder: ' ',
            isRequired: true,
            maxLength: 2
          }
        ]
      },
      {
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 align-items-start',
        controls: [
          {
            id: 'instructions',
            name: 'instructions',
            label: 'labels.instructions',
            type: 'textarea',
            isRequired: true,
            maxLength: 5000
          }
        ]
      }
    ]
  }
];
