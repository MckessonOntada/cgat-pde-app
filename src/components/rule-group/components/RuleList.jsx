import React from 'react';
import RuleRow from './RuleRow';
import { Heading } from '@mckesson/mcp-component-library';
import Button from '@src/components/button';
import { ReactComponent as PlusIcon } from '@src/assets/svg/plus.svg';
import style from './style.module.scss';
import { useFormikContext } from 'formik';

export default function RuleList({ title, attributes }) {
  const { values, setFieldValue } = useFormikContext();

  const rules = values.rules;

  const addRule = (event) => {
    event.preventDefault();
    const newRules = [...rules, { attribute: '', value: undefined }];
    setFieldValue('rules', newRules);
  };

  return (
    <div className={style.section}>
      <Heading as="h3">{title}</Heading>

      <div className={style.ruleList}>
        {rules.map((rule, index) => (
          <React.Fragment>
            <RuleRow key={index} index={index} rule={rule} attributes={attributes} />
            {index < rules.length - 1 && (
              <div className={style.ruleSeparator}>
                <label className={style.ruleKeyword}>AND</label>
                <hr />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="styled-icon-button">
        <Button
          style={{ padding: 0 }}
          disabled={rules.length === attributes.length}
          variant="text"
          size="medium"
          startIcon={<PlusIcon width="10" height="10" />}
          onClick={addRule}>
          Add Attribute
        </Button>
      </div>
    </div>
  );
}
