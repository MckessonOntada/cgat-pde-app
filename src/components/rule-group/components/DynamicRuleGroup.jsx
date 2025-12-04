import React from 'react';
import MetaSection from './MetaSection';
import RuleList from './RuleList';
import ParticipantSelector from './ParticipantSelector';
import ModuleHeader from '@src/components/module-header';
import { Heading } from '@mckesson/mcp-component-library';
import { useFormikContext } from 'formik';
import style from './style.module.scss';

export default function DynamicRuleEngine({ config, onCancel }) {
  const { moduleTitle, metaSection, ruleSection, participantsSection } = config;
  const { values, setFieldValue } = useFormikContext();

  React.useEffect(() => {
    if (!values.rules || values.rules.length === 0) {
      const mandatoryRules = ruleSection.attributes.filter((attribute) => attribute.isMandatory);
      if (mandatoryRules && mandatoryRules.length > 0) {
        setFieldValue(
          'rules',
          mandatoryRules.map((rule) => {
            let initialValue = '';
            if (rule.targetField?.type === 'search' && rule.targetField?.isMultiSelect) {
              initialValue = [];
            }
            return { attribute: rule.name, value: initialValue };
          })
        );
      } else {
        const defaultAttribute = ruleSection.attributes[0];
        setFieldValue('rules', [{ attribute: defaultAttribute.name, value: '' }]);
      }
    }
  }, []);

  return (
    <div className="MCP-panel-container">
      <div className={style.sections}>
        <MetaSection {...metaSection} />
        <RuleList {...ruleSection} />
        <ParticipantSelector {...participantsSection} />
      </div>
    </div>
  );
}
