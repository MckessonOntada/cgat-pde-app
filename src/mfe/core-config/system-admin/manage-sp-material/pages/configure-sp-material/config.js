export const fieldFormatRegexObj = {
  Text: "^[A-Za-z0-9s'.,-_/()#&+:]{1,200}$",
  Alphabetic: '^[A-Za-zs]{1,100}$',
  Alphanumeric: '^[A-Za-z0-9]{1,40}$',
  'Uppercase Alphanumeric': '^[A-Z0-9]{3,20}$',
  Integer: '^d+$',
  Date_MM_DD_YYYY: '^(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/d{4}$',
  'UUID/Unique ID': '^[A-Za-z0-9-]{8,36}$'
};
export const fieldFormatOptions = [
  { label: 'Text', value: 'Text' },
  { label: 'Alphabetic', value: 'Alphabetic' },
  { label: 'Alphanumeric', value: 'Alphanumeric' },
  { label: 'Uppercase Alphanumeric', value: 'Uppercase Alphanumeric' },
  { label: 'Integer', value: 'Integer' },
  { label: 'Date_MM_DD_YYYY', value: 'Date_MM_DD_YYYY' },
  { label: 'UUID/Unique ID', value: 'UUID/Unique ID' }
];

function getDefaultFieldProperties(fieldName) {
  return {
    fieldName,
    format: '',
    properties: {
      displayOnForm: false,
      mandatoryField: false,
      showHelpIcon: false,
      displayName: '',
      errorMessage: '',
      helpInfoMessage: '',
      fieldFormat: {
        formatType: '',
        validationRegex: '',
        customValidationRegex: '',

        get options() {
          return fieldFormatOptions;
        }
      }
    }
  };
}

const spMaterialFiles = ['Manufacturer Patient Identifier', 'COI ID', 'MRN'];

export const config = {
  triageChannel: '',
  fields: spMaterialFiles.map((fieldName) => getDefaultFieldProperties(fieldName))
};

export const regexAttributes = {
  Text: {
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
      ],
      checkbox: [{ isChecked: false, label: 'Allow Negative (-)', value: 'allowNegative' }]
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
      checkbox: [
        { isChecked: true, label: 'Allow Dashes (-)', value: 'allowDashes' },
        { isChecked: true, label: 'Uppercase Hex (A-F)', value: 'allowUpperHex' },
        { isChecked: true, label: 'Lowercase Hex (a-f)', value: 'allowLowerHex' }
      ]
    }
  }
};
