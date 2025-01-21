import React, { useState } from 'react';
import { QUESTION_TEMPLATE_CONFIG } from './constants.js';
import { Heading, Button, CheckboxGroup } from '@mckesson/mcp-component-library';
import { Field, Form, Formik } from 'formik';
import Components from '@src/components/form/Components.js';

const QuestionTemplate = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({});
  const [options, setOptions] = useState({
    radioButton: ['Option 1', 'Option 2'],
    dropdown: ['Option 1']
  });

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOption = (type) => {
    setOptions((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), `Option ${prev[type]?.length + 1}`]
    }));
  };

  const handleOptionChange = (type, index, value) => {
    setOptions((prev) => ({
      ...prev,
      [type]: prev[type].map((opt, i) => (i === index ? value : opt))
    }));
  };

  const handleRemoveOption = (type, index) => {
    setOptions((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };
  console.log(QUESTION_TEMPLATE_CONFIG[selectedType]);
  const renderControl = (control) => {
    switch (control.type) {
      case 'textarea':
        return (
          <div key={control.name}>
            <Field
              name={control.name}
              required={control.required}
              fieldlabel={control.label}
              placeholder=" "
              value={selectedType || ''}
              component={Components['textarea']}
            />
          </div>
        );
      case 'checkbox':
        return (
          <div key={control.name}>
            <Field
              name={control.name}
              required={control.required}
              fieldlabel={control.label}
              placeholder=" "
              value={selectedType || ''}
              component={CheckboxGroup}
            />
          </div>
        );
      case 'text':
        return (
          <div key={control.name}>
            <Field
              name={control.name}
              required={control.required}
              fieldlabel={control.label}
              placeholder=" "
              value={selectedType || ''}
              component={Components['input']}
            />
          </div>
        );
      case 'button':
        return (
          <div key={control.action}>
            <Button variant="tertiary" type="button" onClick={() => handleAddOption(control.name)}>
              {control.label}
            </Button>
          </div>
        );
      case 'recursive':
        return (
          <div key={control.name}>
            <label>{control.label}**</label>
            {(options[control.name] || []).map((opt, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Field
                  name={control.name}
                  required={control.required}
                  fieldlabel={control.label}
                  value={opt}
                  placeholder={`${control.itemLabel} ${index + 1}`}
                  component={Components['input']}
                />
                {(control.name === 'radioButton' && options.radioButton.length > 2) ||
                (control.name === 'dropdown' && options.dropdown.length > 1) ? (
                  <Button onClick={() => handleRemoveOption(control.name, index)}>Delete</Button>
                ) : null}
              </div>
            ))}
            <Button onClick={() => handleAddOption(control.name)}>Add {control.itemLabel}</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Formik initialValues={{ 'question-type': null }}>
      <Form>
        <div className="MCP-module-wrapper">
          <Heading as="h2">Add Questionnaire</Heading>
          <div className="MCP-CardContainer">
            <Heading as="h2">Template Details</Heading>
            <div>
              <Field
                name="question-type"
                fieldlabel={'Type'}
                placeholder=" "
                onChange={(value) => setSelectedType(value)}
                value={selectedType || ''}
                component={Components['dropdown']}
                options={Object.keys(QUESTION_TEMPLATE_CONFIG).map((type) => ({
                  value: type,
                  label: QUESTION_TEMPLATE_CONFIG[type].label
                }))}
              />
            </div>

            {selectedType && QUESTION_TEMPLATE_CONFIG[selectedType].controls.map((control) => renderControl(control))}
          </div>
        </div>
      </Form>
    </Formik>
  );
};

export default QuestionTemplate;
