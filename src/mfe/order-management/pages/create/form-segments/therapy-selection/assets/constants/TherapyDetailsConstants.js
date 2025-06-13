export const TherapyDetailsConstantsForBB = (isInvoice = false, isDetailsByNDC = false) => [
  {
    sectionHeading: isInvoice ? 'paymentInvoices.table.therapyInfo' : 'labels.therapy.generalDetails',
    sectionData: [
      { label: isDetailsByNDC ? 'labels.therapyNumber' : 'labels.therapy.materialNumber', value: 'materialNumber' },
      {
        label: isDetailsByNDC ? 'labels.therapy' : 'labels.therapy.materialDescription',
        value: 'materialDescription'
      },
      { label: 'labels.therapy.ndc', value: 'ndcNumber' },
      { label: 'labels.therapy.strength', value: 'strength' },
      { label: 'labels.therapy.dosage', value: 'dosage' },
      { label: 'labels.therapy.sellingUnitCode', value: 'sellingUnitCode' },
      { label: isDetailsByNDC ? 'labels.manufacturer' : 'labels.therapy.manufacturerName', value: 'vendorName' },
      ...(!isDetailsByNDC ? [{ label: 'labels.therapy.upcCode', value: 'upcCode' }] : []),
      { label: 'labels.therapy.dropshipIndicator', value: 'dropshipIndicator' },
      { label: 'labels.therapy.baseUnitOfMeasure', value: 'baseUnitOfMeasure' }
    ]
  }
];

export const TherapyDetailsConstantsForSP = [
  {
    sectionHeading: 'labels.therapy.generalDetails',
    sectionData: [
      { label: 'labels.therapy.id', value: 'materialNumber' },
      { label: 'labels.therapy.productName', value: 'materialDescription' },
      { label: 'labels.therapy.siteName', value: 'siteName' },
      { label: 'labels.therapy.ndc', value: 'ndcNumber' }
    ]
  }
];
