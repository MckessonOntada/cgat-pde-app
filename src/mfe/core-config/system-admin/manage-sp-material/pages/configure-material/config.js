export const fieldFormatRegexObj = {
  Text: {
    regex: "^[A-Za-z0-9'.,-_()#&+:]{1,200}$",
    errorMessage: 'Allowed: letters, numbers, and (. , - _ () # & + :). Maximum 200 characters.'
  },
  Alphabetic: {
    regex: '^[A-Za-z]{1,100}$',
    errorMessage: 'Only alphabetic characters (A-Z) are allowed, max 100 characters.'
  },
  Alphanumeric: {
    regex: '^[A-Za-z0-9]{1,40}$',
    errorMessage: 'Only letters and numbers are allowed, max 40 characters.'
  },
  'Uppercase Alphanumeric': {
    regex: '^[A-Z0-9]{3,20}$',
    errorMessage: 'Use only uppercase letters (A-Z) and numbers, 3-20 characters.'
  },
  Integer: {
    regex: '^-?\\d+$',
    errorMessage: 'Only numbers are allowed.'
  },
  Date_MM_DD_YYYY: {
    regex: '^(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/[0-9]{4}$',
    errorMessage: 'Enter a valid date in MM/DD/YYYY format.'
  },
  'UUID/Unique ID': {
    regex: '^[A-Za-z0-9-]{8,36}$',
    errorMessage: 'Enter a valid Unique ID (letters, numbers, hyphens), 8–36 characters long.'
  }
};
export const getFieldFormatOptions = (fieldName) => {
  if (['dateOfAdministration', 'dateOfApheresis'].includes(fieldName)) {
    return [{ label: 'Date_MM_DD_YYYY', value: 'Date_MM_DD_YYYY' }];
  }
  return [
    { label: 'Text', value: 'Text' },
    { label: 'Alphabetic', value: 'Alphabetic' },
    { label: 'Alphanumeric', value: 'Alphanumeric' },
    { label: 'Uppercase Alphanumeric', value: 'Uppercase Alphanumeric' },
    { label: 'Integer', value: 'Integer' },
    { label: 'UUID/Unique ID', value: 'UUID/Unique ID' }
  ];
};

export const defaultFieldFormatBnb = () => ({
  patientInformationRequired: null,
  manufacturerName: null,
  fields: [
    {
      fieldName: 'patientIdentifier',
      properties: {
        displayOnForm: false,
        mandatoryField: false,
        showHelpIcon: false,
        displayName: 'Manufacturer Patient Identifier',
        errorMessage: "Only letters, numbers, and allowed special characters (- _ . ' , ( ) # & + :) are allowed.",
        helpInfoMessage: '',
        fieldFormat: {
          formatType: 'Text',
          validationRegex: "^[A-Za-z0-9-_.',()#&+:]{1,200}$",
          validationFormat: '',
          get options() {
            return getFieldFormatOptions('patientIdentifier');
          }
        }
      }
    },
    {
      fieldName: 'medicalRecordNumber',
      properties: {
        displayOnForm: false,
        mandatoryField: false,
        showHelpIcon: false,
        displayName: 'MRN',
        errorMessage: "Only letters, numbers, and allowed special characters (- _ . ' , ( ) # & + :) are allowed.",
        helpInfoMessage: '',
        fieldFormat: {
          formatType: 'Text',
          validationRegex: "^[A-Za-z0-9-_.',()#&+:]{1,200}$",
          validationFormat: '',
          get options() {
            return getFieldFormatOptions('medicalRecordNumber');
          }
        }
      }
    },
    {
      fieldName: 'coiId',
      properties: {
        displayOnForm: false,
        mandatoryField: false,
        showHelpIcon: false,
        displayName: 'COI ID',
        errorMessage: "Only letters, numbers, and allowed special characters (- _ . ' , ( ) # & + :) are allowed.",
        helpInfoMessage: '',
        fieldFormat: {
          formatType: 'Text',
          validationRegex: "^[A-Za-z0-9-_.',()#&+:]{1,200}$",
          validationFormat: '',
          get options() {
            return getFieldFormatOptions('coiId');
          }
        }
      }
    },
    {
      fieldName: 'poNumber',
      properties: {
        displayOnForm: false,
        mandatoryField: false,
        showHelpIcon: false,
        displayName: 'PO Number',
        errorMessage: "Only letters, numbers, and allowed special characters (- _ . ' , ( ) # & + :) are allowed.",
        helpInfoMessage: '',
        fieldFormat: {
          formatType: 'Text',
          validationRegex: "^[A-Za-z0-9-_.',()#&+:]{1,200}$",
          validationFormat: '',
          get options() {
            return getFieldFormatOptions('poNumber');
          }
        }
      }
    },
    {
      fieldName: 'shipToPONumber',
      properties: {
        displayOnForm: false,
        mandatoryField: false,
        showHelpIcon: false,
        displayName: 'Ship to PO  Number',
        errorMessage: "Only letters, numbers, and allowed special characters (- _ . ' , ( ) # & + :) are allowed.",
        helpInfoMessage: '',
        fieldFormat: {
          formatType: 'Text',
          validationRegex: "^[A-Za-z0-9-_.',()#&+:]{1,200}$",
          validationFormat: '',
          get options() {
            return getFieldFormatOptions('shipToPONumber');
          }
        }
      }
    },
    {
      fieldName: 'dateOfAdministration',
      properties: {
        displayOnForm: false,
        mandatoryField: false,
        showHelpIcon: false,
        displayName: 'Date of Administration',
        errorMessage: 'Invalid date format. Use MM/DD/YYYY (e.g., 05/21/2024).',
        helpInfoMessage: '',
        fieldFormat: {
          formatType: 'Date_MM_DD_YYYY',
          validationRegex: '^(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/[0-9]{4}$',
          validationFormat: '',
          get options() {
            return getFieldFormatOptions('dateOfAdministration');
          }
        }
      }
    },
    {
      fieldName: 'dateOfApheresis',
      properties: {
        displayOnForm: false,
        mandatoryField: false,
        showHelpIcon: false,
        displayName: 'Date of Apheresis',
        errorMessage: 'Invalid date format. Use MM/DD/YYYY (e.g., 05/21/2024).',
        helpInfoMessage: '',
        fieldFormat: {
          formatType: 'Date_MM_DD_YYYY',
          validationRegex: '^(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/[0-9]{4}$',
          validationFormat: '',
          get options() {
            return getFieldFormatOptions('dateOfApheresis');
          }
        }
      }
    }
  ]
});
export const defaultFieldFormatSp = () => ({
  triageChannel: '',
  manufacturerName: null,
  fields: [
    {
      fieldName: 'patientIdentifier',
      properties: {
        displayOnForm: false,
        mandatoryField: false,
        showHelpIcon: false,
        displayName: 'Manufacturer Patient Identifier',
        errorMessage: "Only letters, numbers, and allowed special characters (- _ . ' , ( ) # & + :) are allowed.",
        helpInfoMessage: '',
        fieldFormat: {
          formatType: 'Text',
          validationRegex: "^[A-Za-z0-9-_.',()#&+:]{1,200}$",
          validationFormat: '',
          get options() {
            return fieldFormatOptions;
          }
        }
      }
    },
    {
      fieldName: 'coiId',
      properties: {
        displayOnForm: false,
        mandatoryField: false,
        showHelpIcon: false,
        displayName: 'COI ID',
        errorMessage: "Only letters, numbers, and allowed special characters (- _ . ' , ( ) # & + :) are allowed.",
        helpInfoMessage: '',
        fieldFormat: {
          formatType: 'Text',
          validationRegex: "^[A-Za-z0-9-_.',()#&+:]{1,200}$",
          validationFormat: '',
          get options() {
            return fieldFormatOptions;
          }
        }
      }
    },
    {
      fieldName: 'medicalRecordNumber',
      properties: {
        displayOnForm: false,
        mandatoryField: false,
        showHelpIcon: false,
        displayName: 'MRN',
        errorMessage: "Only letters, numbers, and allowed special characters (- _ . ' , ( ) # & + :) are allowed.",
        helpInfoMessage: '',
        fieldFormat: {
          formatType: 'Text',
          validationRegex: "^[A-Za-z0-9-_.',()#&+:]{1,200}$",
          validationFormat: '',
          get options() {
            return fieldFormatOptions;
          }
        }
      }
    }
  ]
});

export const regexAttributes = {
  Text: {
    attributes: {
      text: [
        { label: 'Prefix', key: 'prefix', helpText: 'manageSPMaterial.configuration.helpText.prefix' },
        { label: 'Suffix', key: 'suffix', helpText: 'manageSPMaterial.configuration.helpText.suffix' },
        { label: 'Minimum Length', key: 'minLength' },
        { label: 'Maximum Length', key: 'maxLength' },
        { label: 'Custom Characters', key: 'customChars', helpText: 'manageSPMaterial.configuration.helpText.customChar' }
      ],
      checkbox: [
        { isChecked: false, label: 'Uppercase (A-Z)', value: 'allowUpper' },
        { isChecked: false, label: 'Lowercase (a-z)', value: 'allowLower' },
        { isChecked: false, label: 'Numbers (0-9)', value: 'allowNumbers' },
        { isChecked: false, label: 'Space', value: 'allowSpace' },
        { isChecked: false, label: 'Hyphen (-)', value: 'allowHyphen' },
        { isChecked: false, label: 'Underscore (_)', value: 'allowUnderscore' },
        { isChecked: false, label: 'Dot (.)', value: 'allowDot' }
      ]
    }
  },

  Alphabetic: {
    attributes: {
      text: [
        { label: 'Prefix', key: 'prefix' },
        { label: 'Suffix', key: 'suffix' },
        { label: 'Minimum Length', key: 'minLength' },
        { label: 'Maximum Length', key: 'maxLength' }
      ],
      checkbox: [
        { isChecked: false, label: 'Uppercase (A-Z)', value: 'allowUpper' },
        { isChecked: false, label: 'Lowercase (a-z)', value: 'allowLower' }
      ]
    }
  },

  Alphanumeric: {
    attributes: {
      text: [
        { label: 'Prefix', key: 'prefix' },
        { label: 'Suffix', key: 'suffix' },
        { label: 'Minimum Length', key: 'minLength' },
        { label: 'Maximum Length', key: 'maxLength' }
      ],
      checkbox: [
        { isChecked: false, label: 'Uppercase (A-Z)', value: 'allowUpper' },
        { isChecked: false, label: 'Lowercase (a-z)', value: 'allowLower' },
        { isChecked: false, label: 'Numbers (0-9)', value: 'allowNumbers' },
        { isChecked: false, label: 'Space', value: 'allowSpace' },
        { isChecked: false, label: 'Hyphen (-)', value: 'allowHyphen' },
        { isChecked: false, label: 'Underscore (_)', value: 'allowUnderscore' },
        { isChecked: false, label: 'Dot (.)', value: 'allowDot' }
      ]
    }
  },

  'Uppercase Alphanumeric': {
    attributes: {
      text: [
        { label: 'Prefix', key: 'prefix' },
        { label: 'Suffix', key: 'suffix' },
        { label: 'Minimum Length', key: 'minLength' },
        { label: 'Maximum Length', key: 'maxLength' },
        { label: 'Custom Characters', key: 'customChars' }
      ],
      checkbox: [
        { isChecked: false, label: 'Space', value: 'allowSpace' },
        { isChecked: false, label: 'Hyphen (-)', value: 'allowHyphen' },
        { isChecked: false, label: 'Underscore (_)', value: 'allowUnderscore' },
        { isChecked: false, label: 'Dot (.)', value: 'allowDot' }
      ]
    }
  },

  Integer: {
    attributes: {
      text: [
        { label: 'Minimum Value', key: 'minValue' },
        { label: 'Maximum Value', key: 'maxValue' }
      ]
    }
  },

  Date_MM_DD_YYYY: {
    attributes: {
      date: [
        { name: 'Minimum Date', key: 'minDate', type: 'date' },
        { name: 'Maximum Date', key: 'maxDate', type: 'date' }
      ]
    }
  },

  'UUID/Unique ID': {
    attributes: {
      text: [
        { label: 'Prefix', key: 'prefix' },
        { label: 'Suffix', key: 'suffix' },
        { label: 'Minimum Length', key: 'minLength' },
        { label: 'Maximum Length', key: 'maxLength' },
        { label: 'Custom Characters', key: 'customChars' }
      ],
      checkbox: [
        { isChecked: false, label: 'Uppercase (A-Z)', value: 'allowUpper' },
        { isChecked: false, label: 'Lowercase (a-z)', value: 'allowLower' },
        { isChecked: false, label: 'Numbers (0-9)', value: 'allowNumbers' },
        { isChecked: false, label: 'Space', value: 'allowSpace' },
        { isChecked: false, label: 'Hyphen (-)', value: 'allowHyphen' },
        { isChecked: false, label: 'Underscore (_)', value: 'allowUnderscore' },
        { isChecked: false, label: 'Dot (.)', value: 'allowDot' }
      ]
    }
  }
};

export const FIELD_NAMES = Object.freeze({
  PATIENT_IDENTIFIER: 'patientIdentifier',
  MEDICAL_RECORD_NUMBER: 'medicalRecordNumber',
  COI_ID: 'coiId',
  PO_NUMBER: 'poNumber'
});
