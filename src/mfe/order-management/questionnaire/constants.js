export const QUESTION_TEMPLATE_CONFIG = {
  inputField: {
    label: 'Input Field',
    controls: [
      { type: 'textarea', name: 'title', label: 'Question Title', required: true },
      { type: 'checkbox', name: 'isMandatory', label: 'Is Mandatory?' },
      { type: 'checkbox', name: 'requiresDocumentUpload', label: 'Requires Document Upload?' }
    ]
  },
  radioButton: {
    label: 'Radio Button',
    controls: [
      { type: 'textarea', name: 'title', label: 'Question Title', required: true },
      { type: 'text', name: 'option1', label: 'Option 1' },
      { type: 'text', name: 'option2', label: 'Option 2' },
      {
        type: 'button',
        action: 'addOption',
        label: 'Add Option',
        description: 'Add more radio button options'
      },
      { type: 'checkbox', name: 'isMandatory', label: 'Is Mandatory?' },
      { type: 'checkbox', name: 'requiresDocumentUpload', label: 'Requires Document Upload?' }
    ]
  },
  checkbox: {
    label: 'Checkbox',
    controls: [
      { type: 'textarea', name: 'title', label: 'Question Title', required: true },
      { type: 'checkbox', name: 'isMandatory', label: 'Is Mandatory?' },
      { type: 'checkbox', name: 'requiresDocumentUpload', label: 'Requires Document Upload?' }
    ]
  },
  dropdown: {
    label: 'Dropdown',
    controls: [
      { type: 'textarea', name: 'title', label: 'Question Title', required: true },
      {
        type: 'recursive',
        name: 'dropdownOptions',
        label: 'Dropdown Options',
        itemLabel: 'Option'
      },
      { type: 'checkbox', name: 'isMandatory', label: 'Is Mandatory?' },
      { type: 'checkbox', name: 'requiresDocumentUpload', label: 'Requires Document Upload?' }
    ]
  }
};
