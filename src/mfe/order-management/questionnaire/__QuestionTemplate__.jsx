import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { Button, CheckboxGroup, InputField, Dropdown, TextareaInput } from '@mckesson/mcp-component-library';
import { ReactComponent as PlusIcon } from '@src/assets/svg/plus.svg';
import { ReactComponent as BinRedIcon } from '@src/assets/svg/bin-red.svg';

const QuestionTemplate = ({ id, formData, onDataChange, onDelete }) => {
  const { type } = formData;
  const { t } = useTranslate();
  const [options, setOptions] = useState({
    radioButton: ['Option 1', 'Option 2'],
    dropdown: ['Option 1']
  });

  const handleAddOption = (type) => {
    if (!type) return;
    // setOptions((prev) => ({
    //   ...prev,
    //   [type]: prev[type] ? [...prev[type], `Option ${prev[type].length + 1}`] : [`Option 1`]
    // }));
  };

  const handleRemoveOption = (type, index) => {
    // setOptions((prev) => ({
    //   ...prev,
    //   [type]: prev[type].filter((_, i) => i !== index)
    // }));
    onDataChange({ ...formData, options });
  };

  const handleOptionChange = (type, index, value) => {
    console.log(type, index, value);
    onDataChange({ ...formData, options });
  };

  const handleOnQuestionTitleChange = (e) => {
    const { value } = e.target;
    formData.questionTitle = value;
    onDataChange({ ...formData });
  };

  const handleCheckboxChange = (key) => {
    formData[key].isChecked = !formData[key].isChecked;
    onDataChange({ ...formData });
  };

  const handleOnQuestionTypeChange = (value) => {
    onDataChange({ ...formData, type: value });
  };

  const renderControls = () => {
    const questionTitleField = (
      <TextareaInput
        name="questionTitle"
        fieldlabel={t('Question')}
        placeholder=" "
        isRequired
        maxCharHelperText="Maximum 1,000 Characters"
        maxCharLimit={1000}
        maxCharWarningLimit={900}
        maxLimitReachedHelpertext="Character limit reached"
        onBlurFn={handleOnQuestionTitleChange}
        displayType={'outline'}
      />
    );
    const questionCheckOptions = (
      <div className="stacked-checkbox">
        <CheckboxGroup
          id={`question-checks-${id}`}
          name="question-checks"
          items={[
            { ...formData.isMandatory, onChange: () => handleCheckboxChange('isMandatory') },
            { ...formData.requiresDocument, onChange: () => handleCheckboxChange('requiresDocument') }
          ]}
          size="md"
        />
      </div>
    );
    switch (type) {
      case 'inputField':
        return (
          <div className="MCP-module-body">
            {questionTitleField}
            {questionCheckOptions}
          </div>
        );
      case 'radioButton':
        return (
          <div className="MCP-module-body">
            {questionTitleField}
            {options.radioButton.map((opt, index) => (
              <div className="grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
                <InputField
                  name={`radio-option-index`}
                  label={`Option ${index + 1}`}
                  placeholder={`Option ${index + 1}`}
                  register={() => ({
                    onBlur: (e) => handleOptionChange('radioButton', index, e.target.value),
                    onChange: () => {}
                  })}
                  value={'opt'}
                />
                {options.radioButton.length > 2 && (
                  <div className="styled-icon-button error-button">
                    <Button
                      Icon={BinRedIcon}
                      size="md"
                      variant="tertiary"
                      color="error"
                      type="button"
                      onClick={() => handleRemoveOption('radioButton', index)}>
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <div>
              <div className="styled-icon-button">
                <Button Icon={PlusIcon} size="md" variant="tertiary" type="button" onClick={() => handleAddOption('radioButton')}>
                  Add Option
                </Button>
              </div>
            </div>
            {questionCheckOptions}
          </div>
        );
      case 'checkbox':
        return (
          <div className="MCP-module-body">
            {questionTitleField}
            {questionCheckOptions}
          </div>
        );
      case 'dropdown':
        return (
          <div className="MCP-module-body">
            {questionTitleField}
            {options.dropdown.map((opt, index) => (
              <div className="grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
                <InputField
                  name={`radio-option-index`}
                  fieldlabel={`Option ${index + 1}`}
                  placeholder={`Option ${index + 1}`}
                  value={'opt'}
                  onChange={() => {}}
                  onBlur={() => {}}
                  register={() => {}}
                  size={'lg'}
                />
                {options.dropdown.length > 1 && (
                  <div className="styled-icon-button error-button">
                    <Button
                      Icon={BinRedIcon}
                      size="md"
                      variant="tertiary"
                      color="error"
                      type="button"
                      onClick={() => handleRemoveOption('dropdown', index)}>
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <div>
              <div className="styled-icon-button">
                <Button Icon={PlusIcon} size="md" variant="tertiary" type="button" onClick={() => handleAddOption('dropdown')}>
                  Add Option
                </Button>
              </div>
            </div>
            {questionCheckOptions}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="MCP-module-wrapper">
      <div className="grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        <Dropdown
          id={`dynamic-question-template-type`}
          name={`dynamic-question-template-type`}
          fieldlabel={'Type'}
          placeholder=" "
          isRequired
          size="lg"
          options={[
            { label: 'Input Field', value: 'inputField' },
            { label: 'Radio Button', value: 'radioButton' },
            { label: 'Checkbox', value: 'checkbox' },
            { label: 'Dropdown', value: 'dropdown' }
          ]}
          value={formData.type}
          onChange={handleOnQuestionTypeChange}
        />
        <div className="styled-icon-button error-button">
          <Button onClick={onDelete} Icon={BinRedIcon} size="md" variant="tertiary" type="button">
            Delete
          </Button>
        </div>
      </div>
      {renderControls()}
      <hr />
    </div>
  );
};

export default QuestionTemplate;
