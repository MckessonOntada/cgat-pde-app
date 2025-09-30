import React from 'react';
import { LANGUAGE, QUESTION_TYPE } from './AddQuestionnaire';
import { Field, useFormikContext } from 'formik';
import Components from '@src/components/form/Components';
import { Heading } from '@mckesson/mcp-component-library';
import CheckBox from '@src/components/form/CheckBox';
import CommonUtils from '@src/util/CommonUtils';
import { useTranslate } from '@src/translations/useTranslation';
import { validateFile } from '@src/components/uploadFile/uploadUtils';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';
import { ALLOWED_FILE_TYPE, ALLOWED_FILE_TYPE_TEXT } from '@src/mfe/order-management/pages/create/form-segments/additional-details/constants';

function QuestionnaireTemplate({ onDocumentChange, config, isPreview, readOnly, channelType }) {
  const activeLanguage = LANGUAGE.ENGLISH;
  const { t } = useTranslate();
  const allowedFileTypes = channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? ALLOWED_FILE_TYPE.filter((type) => type === 'application/pdf') : ALLOWED_FILE_TYPE;
  const allowedFileTypeText = channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? 'PDF' : ALLOWED_FILE_TYPE_TEXT;
  const { values: formValues = {}, setFieldValue } = useFormikContext();

  if (
    !config ||
    (typeof config === 'object' && !Array.isArray(config) && !config.hasOwnProperty('questions')) ||
    (typeof config !== 'object' && !Array.isArray(config))
  ) {
    return null;
  }

  const getControl = (controlConfig, id, differentiator) => {
    const { text, type, additionalAttributes, isDocumentRequired, isMandatory } = controlConfig;
    const questionLabel = text[LANGUAGE.ENGLISH]?.trim();
    const fieldName = CommonUtils.generateUniqueCode(`${id}#${questionLabel}`);
    const attributes = {};
    if (isMandatory) {
      attributes.isRequired = true;
    }

    let wrapperClass = ['styled-form-field'];
    const _components = {
      [QUESTION_TYPE.INPUT]: Components['input'],
      [QUESTION_TYPE.RADIO_BUTTON]: Components['radioGroup'],
      [QUESTION_TYPE.DROPDOWN]: Components['dropdown'],
      [QUESTION_TYPE.CHECKBOX]: CheckBox,
      [QUESTION_TYPE.DATE_PICKER]: Components['datePicker']
    };

    attributes.component = _components[type.toUpperCase()];

    if (![QUESTION_TYPE.INPUT, QUESTION_TYPE.DATE_PICKER].includes(type)) {
      const options =
        additionalAttributes?.options.map((option, index) => ({
          key: `questionnaire-${id}-language-option-${index}`,
          isDisabled: false,
          label: option[activeLanguage] || option[LANGUAGE.ENGLISH],
          value: option[LANGUAGE.ENGLISH].replace(/ /g, '_')
        })) || [];

      if (type === QUESTION_TYPE.DROPDOWN) attributes.options = options;
      else attributes.items = options;
    }

    if (type === QUESTION_TYPE.RADIO_BUTTON) {
      attributes.caption = questionLabel;
      attributes.id = `radio-button-${id}-${differentiator}`;
      attributes.htmlFor = attributes.id;
      attributes.direction = additionalAttributes?.options?.length > 2 ? 'column' : 'row';
      attributes.itemCustomStyles = { fontSize: '14px', marginRight: '24px', fontWeight: '400', display: 'inline-block' };
      attributes.labelCustomStyles = { marginBottom: '0px', fontSize: '14px' };
      attributes.items.forEach((item) => {
        item.isDisabled = readOnly || false;
      });
    }

    if (type === QUESTION_TYPE.CHECKBOX) {
      wrapperClass.push('stacked-checkbox');
      attributes.shouldSplitField = true;
      attributes.id = `checkbox-${id}-${differentiator}`;
      attributes.direction = additionalAttributes?.options?.length > 2 ? 'column' : 'row';
      attributes.itemCustomStyles = { fontSize: '14px', marginRight: '24px', fontWeight: '400' };
      attributes.labelCustomStyles = { marginBottom: '8px', fontSize: '14px' };
    }

    const { document: attachmentValue } = formValues[fieldName] || {};
    const field = (
      <div key={`questionnaire-control-section-${differentiator}`} className={wrapperClass.join(' ')}>
        <div className="styled-control-wrapper">
          <div
            className={`grid grid-gap-16 ${
              [QUESTION_TYPE.CHECKBOX, QUESTION_TYPE.RADIO_BUTTON].includes(type)
                ? 'grid-cols-1'
                : 'sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'
            }`}>
            <Field name={`${fieldName}.value`} label={questionLabel} placeholder=" " {...attributes} isReadOnly={readOnly} isDisabled={readOnly} />
          </div>

          {isDocumentRequired && (
            <div className={`fileUploadControl ${isPreview ? 'readonly' : ''}`}>
              <Field
                name={`${fieldName}.document`}
                validateOnChange={(file) => validateFile(t, file, allowedFileTypes)}
                onFileChange={(file) => onDocumentChange(fieldName, file, setFieldValue)}
                component={Components['inputFile']}
                attachmentValue={attachmentValue}
                setFieldValue={setFieldValue}
                fileTypeText={allowedFileTypeText}
              />
            </div>
          )}
        </div>
      </div>
    );

    return field;
  };

  let templateList = [];
  if (typeof config === 'object' && !Array.isArray(config)) {
    templateList.push(<div className="section">{config.questions.map((question, questionIndex) => getControl(question, 1, questionIndex))}</div>);
  } else if (Array.isArray(config)) {
    {
      config.map((template) => {
        templateList.push(
          template.sectionsDetails.map((section, sectionIndex) => {
            return (
              <div className="section">
                <div className="styledHeading">
                  <Heading as="h3">{section.sectionName}</Heading>
                </div>
                <div className="questions">
                  {section.questions.map((question, questionIndex) => (
                    <div className="question">{getControl(question, `${template.id}-${sectionIndex}`, questionIndex)}</div>
                  ))}
                </div>
              </div>
            );
          })
        );
      });
    }
  }
  return (
    <div className="questionnaire-form">
      <div className="sections">{templateList}</div>
    </div>
  );
}

export default QuestionnaireTemplate;
