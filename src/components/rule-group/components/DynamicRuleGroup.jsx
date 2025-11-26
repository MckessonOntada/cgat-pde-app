import React from 'react';
import MetaSection from './MetaSection';
import RuleList from './RuleList';
import ParticipantSelector from './ParticipantSelector';
import ModuleHeader from '@src/components/module-header';
import { Heading, Button } from '@mckesson/mcp-component-library';
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
          mandatoryRules.map((rule) => ({ attribute: rule.name, value: '' }))
        );
      } else {
        const defaultAttribute = ruleSection.attributes[0];
        setFieldValue('rules', [{ attribute: defaultAttribute.name, value: '' }]);
      }
    }
  }, []);

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-header">
        <ModuleHeader heading={<Heading as="h1">{moduleTitle}</Heading>} />
      </div>
      <div className="MCP-panel-container">
        <div className={style.sections}>
          <MetaSection {...metaSection} />
          <RuleList {...ruleSection} />
          <ParticipantSelector {...participantsSection} />
        </div>
      </div>
      <div className="controls">
        <Button variant="secondary" type="button" onClick={onCancel} size={'md'}>
          Cancel
        </Button>
        <Button type="submit" size="md">
          Create Group
        </Button>
      </div>
    </div>
  );
}
