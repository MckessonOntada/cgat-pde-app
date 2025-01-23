import React from 'react';
import { Button, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as ArrowLeftIcon } from '@src/assets/svg/arrow-left.svg';
import { Field, Formik, Form } from 'formik';
import Components from '@src/components/form/Components';
import { ReactComponent as PlusIcon } from '@src/assets/svg/plus.svg';
import QuestionTemplate from './QuestionTemplate';

const INITIAL_TEMPLATE_DATA = () => {
  return {
    questionTitle: '',
    type: null,
    isMandatory: { isChecked: false, label: 'Mark this question as mandatory', value: false },
    requiresDocument: { isChecked: false, label: 'Document upload required?', value: false }
  };
};

function AddQuestionnaire() {
  const [templateName, setTemplateName] = React.useState('');
  const [templates, setTemplates] = React.useState([{ id: Date.now(), formData: { ...INITIAL_TEMPLATE_DATA() } }]);
  const handleOnAddQuestion = () => {
    setTemplates([...templates, { id: Date.now(), formData: { ...INITIAL_TEMPLATE_DATA() } }]);
  };
  const handleTemplateDataChange = (id, data) => {
    setTemplates((prev) => prev.map((template) => (template.id === id ? { ...template, formData: { ...data } } : template)));
  };
  const handleOnSubmit = () => {
    const data = {
      templateName,
      questions: templates.map((template) => template.formData)
    };
    console.log(data);
  };
  const handleOnDeleteQuestion = (id) => {
    setTemplates((prev) => prev.filter((template) => template.id !== id));
  };
  return (
    <Formik>
      <Form>
        <div className="MCP-module-wrapper">
          <div className="MCP-module-header">
            <div className="styled-icon-button">
              <Button variant="tertiary" size="md" Icon={ArrowLeftIcon}>
                Back to Questionnaire Builder
              </Button>
            </div>
          </div>
          <div className="MCP-module-body">
            <div className="styled-heading">
              <Heading as="h1">Add Questionnaire</Heading>
            </div>

            <div className="MCP-CardContainer">
              <div className="template">
                <div className="styledHeading">
                  <Heading as="h2">Template Details</Heading>
                </div>
                <div class="grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                  <Field
                    name={`questionnaire-template-name`}
                    label={`Template Name`}
                    placeholder={` `}
                    component={Components['input']}
                    onChange={(e) => setTemplateName(e.target.value)}
                    value={templateName}
                  />
                </div>
                <div className="styledHeading">
                  <Heading as="h2">Questions</Heading>
                </div>
                <div>
                  {templates.map((template) => (
                    <QuestionTemplate
                      key={template.id}
                      {...template}
                      onDelete={() => handleOnDeleteQuestion(template.id)}
                      onDataChange={(data) => handleTemplateDataChange(template.id, data)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="styled-icon-button">
                  <Button onClick={handleOnAddQuestion} variant="tertiary" size="md" Icon={PlusIcon}>
                    Add Question
                  </Button>
                </div>
              </div>
            </div>
            <div className="controls">
              <Button size="md" variant="secondary">
                Cancel
              </Button>
              <Button size="md" variant="primary" onClick={handleOnSubmit}>
                Create Questionnaire
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </Formik>
  );
}

export default AddQuestionnaire;
