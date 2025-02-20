import React, { useEffect, useMemo, useRef, useState } from 'react';
import './index.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { useFormikContext } from 'formik';
import { useAccountData, useCatalogData, useUserData, useUserRoleData } from './apiService';
import { useFormContext } from '../../context/FormContext';
import { CONTROL_OPTIONS } from '../ApproverGroupDetail/RulesConfig';
import AttributeFieldRenderer from './AttributeFieldRenderer';

const fieldAttributes = {
  Price: {
    helperText: 'Please select a criteria to apply the approval rules on.',
    inputControl: {
      caption: 'Amount',
      searchable: false,
      helperText: 'Please enter the amount greater than for the approver group.'
    }
  },
  Catalog: {
    helperText: 'Please select a criteria to apply the approval rules on.',
    inputControl: {
      caption: 'Select Therapy',
      searchable: true,
      helperText: 'Please select the therapy(s) for the approver group.'
    }
  },
  Account: {
    helperText: 'Please select a criteria to apply the approval rules on.',
    inputControl: {
      caption: 'Select Account',
      searchable: true,
      helperText: 'Please select the account(s) for the approver group.'
    }
  },
  Roles: {
    helperText: 'Please select a criteria to apply the approval rules on.',
    inputControl: {
      caption: 'Select Role',
      searchable: true,
      helperText: 'Please select the role(s) for the approver group.'
    }
  },
  Users: {
    helperText: 'Please select a criteria to apply the approval rules on.',
    inputControl: {
      caption: 'Select User',
      searchable: true,
      helperText: 'Please select the user(s) for the approver group.'
    }
  }
};

function RenderControls({ attributeType = CONTROL_OPTIONS.Price, name, isAttributeRemoved }) {
  const { t } = useTranslate();
  const { values, setFieldValue } = useFormikContext();
  const { initialValues, isEditMode } = useFormContext();
  const [localData, setLocalData] = useState([]);
  const isDataBinded = useRef(false);
  const useInitialValues = useRef(true);

  React.useEffect(() => {}, [attributeType]);

  const shouldFetchCatalog = attributeType === CONTROL_OPTIONS.Catalog;
  const shouldFetchAccounts = attributeType === CONTROL_OPTIONS.Account;
  const shouldFetchUserRole = attributeType === CONTROL_OPTIONS.Roles;
  const shouldFetchUserNames = attributeType === CONTROL_OPTIONS.Users;
  const shouldFetchPrice = attributeType === CONTROL_OPTIONS.Price;

  const catalogQuery = useCatalogData(shouldFetchCatalog);
  const accountQuery = useAccountData(shouldFetchAccounts);
  const userRoleQuery = useUserRoleData(shouldFetchUserRole);
  const userDataQuery = useUserData(shouldFetchUserNames);

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
    if (shouldFetchUserRole) {
      isDataBinded.current = false;
      return userRoleQuery;
    }
    if (shouldFetchUserNames) {
      isDataBinded.current = false;
      return userDataQuery;
    }

    return { isLoading: false, data: [] };
  }, [
    shouldFetchCatalog,
    shouldFetchAccounts,
    shouldFetchUserRole,
    shouldFetchUserNames,
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
      if (!queryResult?.data) return;

      let sourceData = useInitialValues.current ? initialValues : values;
      sourceData.rules = sourceData.rules.map((item) => {
        if (item.attributeType !== CONTROL_OPTIONS.Price && item.value === '') {
          return {
            ...item,
            value: []
          };
        }
        return item;
      });

      // Transform fetched data
      const fetchData = queryResult?.data?.map((item) => ({
        value: item.value,
        label: item.label,
        isChecked:
          sourceData?.rules
            ?.find((rule) => rule.attributeType === attributeType)
            ?.value?.map(String)
            .includes(String(item.value)) || false
      }));

      // Update selectedData based on the attribute type
      setSelectedData((prevState) => {
        const updatedState = { ...prevState };
        if (shouldFetchPrice) updatedState.price = '';
        if (shouldFetchAccounts) updatedState.accounts = fetchData;
        if (shouldFetchUserRole) updatedState.roles = fetchData;
        if (shouldFetchUserNames) updatedState.users = fetchData;
        if (shouldFetchCatalog) updatedState.categories = fetchData;
        return updatedState;
      });

      useInitialValues.current = false;
      isDataBinded.current = true;
    }
  }, [
    queryResult.data,
    shouldFetchAccounts,
    shouldFetchUserRole,
    shouldFetchUserNames,
    shouldFetchCatalog,
    shouldFetchPrice,
    attributeType,
    isEditMode
  ]);

  useEffect(() => {
    if (!isDataBinded.current) {
      const updatedLocalData = (() => {
        if (shouldFetchAccounts) return selectedData.accounts;
        if (shouldFetchUserRole) return selectedData.roles;
        if (shouldFetchUserNames) return selectedData.users;
        if (shouldFetchCatalog) return selectedData.categories;
        if (shouldFetchPrice) return [];
        return [];
      })();
      isDataBinded.current = true;
      setLocalData(updatedLocalData);
    }
  }, [selectedData, shouldFetchAccounts, shouldFetchUserRole, shouldFetchUserNames, shouldFetchCatalog, shouldFetchPrice]);

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

  const attributes = fieldAttributes[attributeType]?.inputControl || {};
  return (
    <AttributeFieldRenderer
      caption={attributes.caption}
      helperText={attributes.helperText}
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
