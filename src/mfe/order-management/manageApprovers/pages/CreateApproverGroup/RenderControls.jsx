import Components from '@src/components/form/Components';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pills } from '@mckesson/mcp-component-library';
import './index.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { Field, useFormikContext } from 'formik';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { useQuery } from 'react-query';
import AuthUtils from '@src/util/AuthUtils';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import { useAccountData, useCatalogData, useUserData, useUserRoleData } from './apiService';
import { useFormContext } from '../../context/FormContext';
import { RuleKeys, RuleLabels } from '../ApproverGroupDetail/RulesConfig';

function RenderControls({ attributeType, index, name }) {
  const { t } = useTranslate();

  const { values, setFieldValue } = useFormikContext();
  const { initialValues, isEditMode, locationState } = useFormContext();

  const queryMap = {
    Catalog: useCatalogData(),
    Account: useAccountData(),
    UserRole: useUserRoleData(),
    UserData: useUserData()
  };

  const { isLoading, data, isError } = (() => {
    switch (attributeType) {
      case RuleLabels[RuleKeys.THERAPIES]:
        return queryMap.Catalog;
      case RuleLabels[RuleKeys.ACCOUNTS]:
        return queryMap.Account;
      case RuleLabels[RuleKeys.USERS]:
        if (!values.attributeuseroption || values.attributeuseroption === 'user_role') {
          return queryMap.UserRole;
        } else if (values.attributeuseroption === 'user_name') {
          return queryMap.UserData;
        }
        return { isLoading: false, data: [], isError: false }; // Fallback
      default:
        return { isLoading: false, data: [], isError: false }; // Default empty state
    }
  })();

  const [localData, setLocalData] = useState([]);
  const isDataBinded = useRef(false);

  useEffect(() => {
    if (data?.length > 0 && attributeType && initialValues?.rules && attributeType !== RuleLabels[RuleKeys.USERS]) {
      const currentRule = initialValues.rules.find((rule) => rule.attributeType === attributeType);

      const transformedData = data.map((item) => ({
        value: item.value,
        label: item.label,
        isChecked: currentRule?.value?.includes(item.value) || false
      }));

      setLocalData(transformedData);
      isDataBinded.current = true;
    } else if (!isEditMode && data?.length > 0) {
      setLocalData(data);
      isDataBinded.current = true;
    }
  }, [data, attributeType, initialValues.rules, isEditMode]);

  // Separate useEffect for User options, handles radio button changes dynamically
  useEffect(() => {
    if (attributeType === RuleLabels[RuleKeys.USERS]) {
      const fetchData = values.attributeuseroption === 'user_role' ? queryMap.UserRole?.data || [] : queryMap.UserData?.data || [];

      // Reset state and bind the new User Role/User Name values
      const currentRule = initialValues.rules.find((rule) => rule.attributeType === RuleLabels[RuleKeys.USERS]);
      const transformedUserData = fetchData.map((item) => ({
        value: item.value,
        label: item.label,
        isChecked: currentRule?.value?.includes(item.value) || false
      }));

      setLocalData(transformedUserData);
      isDataBinded.current = true;
    }
  }, [attributeType, values.attributeuseroption, queryMap.UserRole?.data, queryMap.UserData?.data, initialValues.rules]);

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

  const renderFieldWithPills = (fieldId, fieldLabel) => (
    <div>
      <Field
        id={fieldId}
        name={name}
        fieldlabel={t(fieldLabel)}
        placeholder=" "
        component={Components['multiSelectDropdown']}
        isRequired
        options={localData}
        getUpdatedOptions={setLocalData}
      />
      <div className="pills-container">
        <Pills
          id={fieldId}
          labels={createLabelData(getAugmentedValues(values.rules, attributeType))}
          variant="secondary"
          hasDeleteIcon
          onDelete={onRemoveClick}
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
            {renderFieldWithPills(RuleLabels[RuleKeys.THERAPIES], 'approvergroup.selecttherapy')}
          </div>
        );
      case RuleLabels[RuleKeys.ACCOUNTS]:
        return (
          <div className="grid grid-gap-16 grid-cols-1">
            {renderFieldWithPills(RuleLabels[RuleKeys.ACCOUNTS], 'approvergroup.selectaccount')}
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

            {renderFieldWithPills('user', 'approvergroup.selectuser')}
          </div>
        );

      default:
        return null;
    }
  };
  return <>{renderswitch()}</>;
}

export default RenderControls;
