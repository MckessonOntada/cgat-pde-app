export const MaterialDetailsConstants = [
  {
    sectionHeading: 'manageMaterial.drawer.details.heading',
    sectionData: [
      { label: 'manageMaterial.drawer.details.body.materialNumber', value: 'materialNumber' },
      { label: 'manageMaterial.drawer.details.body.materialDescription', value: 'materialDescription' },
      { label: 'manageMaterial.drawer.details.body.ndc', value: 'ndcNumber' },
      { label: 'manageMaterial.drawer.details.body.strength', value: 'strength' },
      { label: 'manageMaterial.drawer.details.body.dosage', value: 'dosage' },
      { label: 'manageMaterial.drawer.details.body.sellingUnitCode', value: 'sellingUnitCode' },
      { label: 'manageMaterial.drawer.details.body.vendorName', value: 'vendorName' },
      { label: 'manageMaterial.drawer.details.body.upcCode', value: 'upcCode' },
      { label: 'manageMaterial.drawer.details.body.dropshipIndicator', value: 'dropshipIndicator' },
      { label: 'manageMaterial.drawer.details.body.baseUnitOfMeasure', value: 'baseUnitOfMeasure' },
      { label: 'manageMaterial.drawer.details.body.cgatIdentifier', value: 'cgatIdentifier' },
      { label: 'manageMaterial.drawer.details.body.productLevelPricing', value: 'productLevelPricing' }
    ]
  }
];

export const ConfigConstants = [
  {
    sectionHeading: 'manageMaterial.drawer.details.configuration.heading.questionnaire',
    actions: [{ label: 'manageMaterial.drawer.details.configuration.actions.preview', id: 'preview' }],
    sectionData: [],
    questionnaire: true
  },
  {
    sectionHeading: 'manageMaterial.drawer.details.configuration.heading.material',
    actions: [{ label: 'manageMaterial.drawer.details.configuration.actions.delete', id: 'delete-materialConfig', icon: 'delete' }],
    sectionData: [
      { label: 'manageMaterial.drawer.details.configuration.body.patientInfoRequired', value: 'isPatientInformationRequired' },
      { label: 'manageMaterial.drawer.details.configuration.body.coiIdRequired', value: 'isCoiIdRequired' }
    ],
    questionnaire: false
  }
];
