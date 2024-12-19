import Components from '@src/components/form/Components';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pills } from '@mckesson/mcp-component-library';
import './index.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { Field, useFormikContext } from 'formik';
import { useAccountData, useCatalogData, useUserData, useUserRoleData } from './apiService';
import { useFormContext } from '../../context/FormContext';
import { RuleKeys, RuleLabels } from '../ApproverGroupDetail/RulesConfig';
import AttributeFieldRenderer from './AttributeFieldRenderer';

function RenderControls({ attributeType, name }) {
  const { t } = useTranslate();

  const { values, setFieldValue } = useFormikContext();
  const { initialValues, isEditMode } = useFormContext();
  const [localData, setLocalData] = useState([]);
  const isDataBinded = useRef(false);

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
      isDataBinded.current = false;
      return values.attributeuseroption === 'user_role' ? userRoleQuery : userDataQuery;
    }

    return { isLoading: false, data: [] };
  }, [attributeType, values.attributeuseroption, catalogQuery, accountQuery, userRoleQuery, userDataQuery]);

  useEffect(() => {
    if (!isDataBinded.current) {
      let fetchData = [];

      // Check if data is available and attributeType is USERS or other
      if (attributeType === RuleLabels[RuleKeys.USERS] && queryResult.data?.length > 0) {
        fetchData = values.attributeuseroption === 'user_role' ? userRoleQuery.data || [] : userDataQuery.data || [];
      } else if (queryResult.data?.length > 0) {
        fetchData = queryResult.data || [];
      }

      // Process and transform data if available
      if (fetchData.length > 0) {
        const currentRule = initialValues?.rules?.find((rule) => rule.attributeType === attributeType);

        const transformedData = fetchData.map((item) => ({
          value: item.value,
          label: item.label,
          isChecked: currentRule?.value?.map(String).includes(String(item.value)) || false
        }));

        setLocalData(transformedData);
        isDataBinded.current = true;
      }
    }
  }, [
    attributeType,
    queryResult.data,
    values.attributeuseroption,
    userRoleQuery.data,
    userDataQuery.data,
    initialValues.rules,
    isEditMode
  ]);

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

  return (
    <AttributeFieldRenderer
      attributeType={attributeType}
      name={name}
      localData={localData}
      setLocalData={setLocalData}
      onRemoveClick={onRemoveClick}
      t={t}
      values={values}
    />
  );
}

export default RenderControls;
