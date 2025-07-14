export const TherapyDetailsConstantsForBB = (isInvoice = false) => [
  {
    sectionHeading: isInvoice ? 'paymentInvoices.table.therapyInfo' : 'labels.therapy.generalDetails',
    sectionData: [
      { label: 'labels.therapyId', value: 'displayMaterialNumber' },
      { label: 'labels.tradeName', value: 'tradeName' },
      { label: 'labels.therapyDescription', value: 'materialDescription' },
      { label: 'labels.genericName', value: 'genericName' },
      { label: 'labels.therapy.ndc', value: 'ndcNumber' },
      { label: 'labels.manufacturer', value: 'manufacturerName' },
      { label: 'labels.therapy.Formulation', value: 'Formulation' },
      { label: 'labels.therapy.dosage', value: 'dosage' },
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
