import Components from '@src/components/form/Components';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pills } from '@mckesson/mcp-component-library';
import './index.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { Field, useFormikContext } from 'formik';
import { useAccountData, useCatalogData, useUserData, useUserRoleData } from './apiService';
import { useFormContext } from '../../context/FormContext';
import { RuleKeys, RuleLabels, RuleValueKeys } from '../ApproverGroupDetail/RulesConfig';
import AttributeFieldRenderer from './AttributeFieldRenderer';
import { use } from 'react';

function RenderControls({ attributeType, name, isAttributeRemoved }) {
  const { t } = useTranslate();
  const { values, setFieldValue } = useFormikContext();
  const { initialValues, isEditMode } = useFormContext();
  const [localData, setLocalData] = useState([]);
  const isDataBinded = useRef(false);
  const useInitialValues = useRef(true);

  const shouldFetchCatalog = attributeType === RuleLabels[RuleKeys.THERAPIES];
  const shouldFetchAccounts = attributeType === RuleLabels[RuleKeys.ACCOUNTS];
  const shouldFetchUsers = attributeType === RuleLabels[RuleKeys.USERS];
  const shouldFetchPrice = attributeType === RuleLabels[RuleKeys.PRICE];

  const catalogQuery = useCatalogData(shouldFetchCatalog);
  const accountQuery = useAccountData(shouldFetchAccounts);
  const userRoleQuery = useUserRoleData(shouldFetchUsers && values.attributeuseroption === 'user_role');
  const userDataQuery = useUserData(shouldFetchUsers && values.attributeuseroption === 'user_name');

  const [selectedData, setSelectedData] = useState({
    price: '',
    accounts: [],
    users: [],
    categories: []
  });

  const queryResult = useMemo(() => {
    if (shouldFetchCatalog) {
      isDataBinded.current = false;
      return catalogQuery;
    }
    if (shouldFetchAccounts) {
      isDataBinded.current = false;
      return accountQuery;
    }
    if (shouldFetchUsers) {
      isDataBinded.current = false;
      return values.attributeuseroption === 'user_role' ? userRoleQuery : userDataQuery;
    }

    return { isLoading: false, data: [] };
  }, [
    shouldFetchCatalog,
    shouldFetchAccounts,
    shouldFetchUsers,
    values.attributeuseroption,
    catalogQuery,
    accountQuery,
    userRoleQuery,
    userDataQuery
  ]);

  useEffect(() => {
    if (isAttributeRemoved.current) {
      useInitialValues.current = false;
    }
  }, [isAttributeRemoved.current]);

  useEffect(() => {
    if (!isDataBinded.current) {
      if (!queryResult?.data || queryResult.data.length === 0) return;

      let sourceData = useInitialValues.current ? initialValues : values;
      sourceData.rules = sourceData.rules.map((item) => {
        if (item.attributeType !== 'Price' && item.value === '') {
          return {
            ...item,
            value: []
          };
        }
        return item;
      });

      // Transform fetched data
      const fetchData = queryResult.data.map((item) => ({
        value: item.value,
        label: item.label,
        isChecked: isEditMode
          ? sourceData?.rules
              ?.find((rule) => rule.attributeType === attributeType)
              ?.value?.map(String)
              .includes(String(item.value)) || false
          : false
      }));

      // Update selectedData based on the attribute type
      setSelectedData((prevState) => {
        const updatedState = { ...prevState };
        if (shouldFetchPrice) updatedState.price = '';
        if (shouldFetchAccounts) updatedState.accounts = fetchData;
        if (shouldFetchUsers) updatedState.users = fetchData;
        if (shouldFetchCatalog) updatedState.categories = fetchData;
        return updatedState;
      });

      useInitialValues.current = false;
      isDataBinded.current = true;
    }
  }, [queryResult.data, shouldFetchAccounts, shouldFetchUsers, shouldFetchCatalog, shouldFetchPrice, attributeType, isEditMode]);

  useEffect(() => {
    if (!isDataBinded.current) {
      const updatedLocalData = (() => {
        if (shouldFetchAccounts) return selectedData.accounts;
        if (shouldFetchUsers) return selectedData.users;
        if (shouldFetchCatalog) return selectedData.categories;
        if (shouldFetchPrice) return [];
        return [];
      })();
      isDataBinded.current = true;
      setLocalData(updatedLocalData);
    }
  }, [selectedData, shouldFetchAccounts, shouldFetchUsers, shouldFetchCatalog, shouldFetchPrice]);

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

    setFieldValue('rules', updatedRules);

    // Update localData to uncheck the removed item
    const updatedOptions = localData.map((option) => {
      if (option.value === itemToRemove) {
        return { ...option, isChecked: false };
      }
      return option;
    });
    setLocalData(updatedOptions);
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
