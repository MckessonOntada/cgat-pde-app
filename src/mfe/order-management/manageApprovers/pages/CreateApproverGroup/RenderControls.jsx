import Components from '@src/components/form/Components';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pills } from '@mckesson/mcp-component-library';
import './index.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { Field, useFormikContext } from 'formik';
import { useAccountData, useCatalogData, useUserData, useUserRoleData } from './apiService';
import { useFormContext } from '../../context/FormContext';
import { RuleKeys, RuleLabels } from '../ApproverGroupDetail/RulesConfig';

function RenderControls({ attributeType, index, name }) {
  const { t } = useTranslate();

  const { values, setFieldValue } = useFormikContext();
  const { initialValues, isEditMode } = useFormContext();
  const [localData, setLocalData] = useState([]);
  const isDataBinded = useRef(false);
  const isUserDataBinded = useRef(false);

  const shouldFetchCatalog = attributeType === RuleLabels[RuleKeys.THERAPIES];
  const shouldFetchAccounts = attributeType === RuleLabels[RuleKeys.ACCOUNTS];
  const shouldFetchUsers = attributeType === RuleLabels[RuleKeys.USERS];

  // API hooks with enabled option
  const catalogQuery = useCatalogData(shouldFetchCatalog);
  const accountQuery = useAccountData(shouldFetchAccounts);
  const userRoleQuery = useUserRoleData(shouldFetchUsers && values.attributeuseroption === 'user_role');
  const userDataQuery = useUserData(shouldFetchUsers && values.attributeuseroption === 'user_name');

  // Memoize the query result
  const queryResult = useMemo(() => {
    if (shouldFetchCatalog) return catalogQuery;
    if (shouldFetchAccounts) return accountQuery;
    if (shouldFetchUsers) {
      isUserDataBinded.current = false;
      return values.attributeuseroption === 'user_role' ? userRoleQuery : userDataQuery;
    }

    return { isLoading: false, data: [] };
  }, [attributeType, values.attributeuseroption, catalogQuery, accountQuery, userRoleQuery, userDataQuery]);

  useEffect(() => {
    if (!isDataBinded.current) {
      if (queryResult.data?.length > 0 && attributeType && initialValues?.rules && attributeType !== RuleLabels[RuleKeys.USERS]) {
        const currentRule = initialValues.rules.find((rule) => rule.attributeType === attributeType);

        const transformedData = queryResult.data.map((item) => ({
          value: item.value,
          label: item.label,
          isChecked: currentRule?.value?.map(String).includes(String(item.value)) || false
        }));

        setLocalData(transformedData);
        isDataBinded.current = true;
      } else if (!isEditMode && queryResult.data?.length > 0) {
        setLocalData(queryResult.data);
        isDataBinded.current = true;
      }
    }
  }, [queryResult.data, attributeType, initialValues.rules, isEditMode]);

  useEffect(() => {
    if (!isUserDataBinded.current && queryResult.data?.length > 0 && attributeType === RuleLabels[RuleKeys.USERS]) {
      let fetchData = [];
      if (attributeType === RuleLabels[RuleKeys.USERS]) {
        fetchData = values.attributeuseroption === 'user_role' ? userRoleQuery.data || [] : userDataQuery.data || [];
      } else {
        fetchData = queryResult.data || [];
      }
      const currentRule = initialValues?.rules?.find((rule) => rule.attributeType === attributeType);

      const transformedData = fetchData.map((item) => ({
        value: item.value,
        label: item.label,
        isChecked: currentRule?.value?.includes(item.value) || false
      }));
      setLocalData(transformedData);
      isUserDataBinded.current = true;
    }
  }, [attributeType, values.attributeuseroption, userRoleQuery.data, userDataQuery.data, queryResult.data, initialValues.rules]);

  const getAugmentedValues = (rules, attributeType) => {
    return rules.filter((rule) => rule.attributeType === attributeType).flatMap((rule) => rule.value_augmented || []);
  };

  const onRemoveClick = (itemToRemove) => {
    const updatedValues = values.rules.find((rule) => rule.attributeType === attributeType)?.value.filter((id) => id !== itemToRemove);

    const updatedAugmented = values.rules
      .find((rule) => rule.attributeType === attributeType)
      ?.value_augmented.filter((item) => item.value !== itemToRemove);

    const updatedRules = values.rules.map((rule) => {
      if (rule.attributeType === attributeType) {
        return {
          ...rule,
          value: updatedValues,
          value_augmented: updatedAugmented
        };
      }
      return rule;
    });

    // Set the updated rules back to the form state
    setFieldValue('rules', updatedRules);
    const updatedOptions = localData.map((option) => {
      if (option.value === itemToRemove) {
        return { ...option, isChecked: false };
      }
      return option;
    });
    setLocalData(() => updatedOptions);
  };

  const createLabelData = (values) => {
    let val = values.map(({ name, value }) => ({
      labelText: name,
      id: value
    }));
    return val;
  };

  const renderFieldWithPills = (fieldId, fieldLabel, pillsCount) => (
    <div>
      <Field
        id={fieldId}
        name={name}
        fieldlabel={t(fieldLabel)}
        placeholder=" "
        component={Components['multiSelectDropdown']}
        isRequired
        options={localData}
        noSelectedCountMessage={t('approvergroup.create.option.please_select')}
        getUpdatedOptions={setLocalData}
      />
      <div className="pills-container">
        <Pills
          id={fieldId}
          labels={createLabelData(getAugmentedValues(values.rules, attributeType))}
          variant="secondary"
          hasDeleteIcon
          onDelete={onRemoveClick}
          showPillsCount={pillsCount}
        />
      </div>
    </div>
  );

  const renderswitch = () => {
    switch (attributeType) {
      case RuleLabels[RuleKeys.PRICE]:
        return (
          <div>
            <Field
              id="price"
              name={name}
              label={t('approvergroup.price')}
              placeholder=" "
              isRequired
              component={Components['input']}
              maxLength={8}
            />
          </div>
        );
      case RuleLabels[RuleKeys.THERAPIES]:
        return (
          <div className="grid grid-gap-16 grid-cols-1">
            {renderFieldWithPills(RuleLabels[RuleKeys.THERAPIES], 'approvergroup.selecttherapy', 5)}
          </div>
        );
      case RuleLabels[RuleKeys.ACCOUNTS]:
        return (
          <div className="grid grid-gap-16 grid-cols-1">
            {renderFieldWithPills(RuleLabels[RuleKeys.ACCOUNTS], 'approvergroup.selectaccount', 5)}
          </div>
        );

      case RuleLabels[RuleKeys.USERS]:
        return (
          <div className="grid grid-gap-24">
            <Field
              id="User"
              name="attributeuseroption"
              caption={t('approvergroup.selectuserradio')}
              placeholder=" "
              component={Components['radioGroup']}
              isRequired
              items={[
                {
                  isDisabled: false,
                  label: 'User Role',
                  value: 'user_role'
                },
                {
                  isDisabled: false,
                  label: 'User Name',
                  value: 'user_name'
                }
              ]}
              breakItemLabel={false}
              itemCustomStyles={{ fontSize: '16px', marginRight: '24px' }}
              labelCustomStyles={{ marginBottom: '8px', fontSize: '16px' }}
              value={values.attributeuseroption}
            />

            {renderFieldWithPills('user', 'approvergroup.selectuser', 7)}
          </div>
        );

      default:
        return null;
    }
  };
  return <>{renderswitch()}</>;
}

export default RenderControls;
