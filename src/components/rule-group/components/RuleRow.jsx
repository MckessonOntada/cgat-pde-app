import React from 'react';
import DynamicValueInput from './DynamicValueInput';
import { Field, useFormikContext } from 'formik';
import IconButton from '@src/components/IconButton';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/delete-icon.svg';
import Components from '@src/components/form/Components';
import style from './style.module.scss';

export default function RuleRow({ index, rule, attributes }) {
  const [ruleOptions, setRuleOptions] = React.useState([]);
  const selectedAttribute = attributes.find((a) => a.name === rule.attribute);
  const targetField = selectedAttribute?.targetField;
  const { values, setFieldValue } = useFormikContext();
  React.useEffect(() => {
    const usedAttributes = values.rules.map((r) => rule.attribute !== r.attribute && r.attribute);

    const unUsedAttributes = attributes
      .filter((attribute) => {
        return !usedAttributes.includes(attribute.name);
      })
      .map((a) => ({
        label: a.label,
        value: a.name
      }));
    setRuleOptions(unUsedAttributes);
  }, [values.rules]);

  React.useEffect(() => {
    if (rule.attribute) {
      setFieldValue(`rules[${index}].value`, rule.value);
    }
  }, [rule.attribute]);

  const onRemove = () => {
    debugger;
    const newRules = values.rules.filter((_, i) => i !== index);
    setFieldValue('rules', newRules);
  };
  return (
    <div className={style.ruleWrapper}>
      <div className={style.rule} key={index}>
        <div className={style.ruleKeyword}>IF</div>
        <div className="attribute">
          <Field
            id={`rules[${index}].attribute`}
            name={`rules[${index}].attribute`}
            label={`Attribute ${index + 1}`}
            options={ruleOptions}
            fieldlabel={'approvergroup.attribute' + ' ' + (index + 1)}
            placeholder=" "
            component={Components['dropdown']}
            isRequired={selectedAttribute && (selectedAttribute.isRequired || selectedAttribute.isMandatory)}
            isDisabled={selectedAttribute && selectedAttribute.isMandatory}
          />
          <div className="control-helper-text">
            {(selectedAttribute && selectedAttribute.helperText) || 'Please select a criteria to apply the approval rules on.'}
          </div>
        </div>
        <div className={`${style.ruleKeyword} ${style.joinKeyword}`}>{rule.attribute && selectedAttribute.joinBy}</div>
        <div className={style.inputControls}>
          <div className={style.control}>{rule.attribute && targetField && <DynamicValueInput index={index} {...targetField} />}</div>
          {values.rules.length > 1 && <IconButton icon={<DeleteIcon />} variant="tertiary" size="md" className="btnRemove" onClick={onRemove} />}
        </div>
      </div>
    </div>
  );
}
