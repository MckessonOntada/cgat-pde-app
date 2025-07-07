export const TherapyDetailsConstantsForBB = (isInvoice = false) => [
  {
    sectionHeading: isInvoice ? 'paymentInvoices.table.therapyInfo' : 'labels.therapy.generalDetails',
    sectionData: [
      { label: 'labels.therapyNumber', value: 'displayMaterialNumber' },
      { label: 'labels.therapy', value: 'materialDescription' },
      { label: 'labels.therapy.ndc', value: 'ndcNumber' },
      { label: 'labels.therapy.strength', value: 'strength' },
      { label: 'labels.therapy.dosage', value: 'dosage' },
      { label: 'labels.therapy.sellingUnitCode', value: 'sellingUnitCode' },
      { label: 'labels.manufacturer', value: 'manufacturerName' },
      { label: 'labels.therapy.dropshipIndicator', value: 'dropshipIndicator' },
      { label: 'labels.therapy.baseUnitOfMeasure', value: 'baseUnitOfMeasure' }
    ]
  }
];

export const TherapyDetailsConstantsForSP = [
  {
    sectionHeading: 'labels.therapy.generalDetails',
    sectionData: [
      { label: 'labels.therapy.id', value: 'displayMaterialNumber' },
      { label: 'labels.therapy.productName', value: 'materialDescription' },
      { label: 'labels.therapy.siteName', value: 'siteName' },
      { label: 'labels.therapy.ndc', value: 'ndcNumber' }
    ]
  }
];
