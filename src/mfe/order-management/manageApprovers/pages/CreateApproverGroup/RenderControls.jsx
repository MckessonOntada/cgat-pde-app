import Components from '@src/components/form/Components';
import React, { useEffect, useMemo, useState } from 'react';
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

function RenderControls({ attributeType, index, name }) {
  const { t } = useTranslate();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { values, setFieldValue } = useFormikContext();
  const [selectedData, setSelectedData] = useState([]);
  const attrOptions = [
    { label: t('orgManagement.create_org.option.please_select'), value: '' },
    {
      label: 'Catalog',
      value: 'Catalog'
    },
    {
      label: 'Account',
      value: 'Account'
    },
    {
      label: 'Price',
      value: 'Price'
    },
    {
      label: 'User',
      value: 'User'
    }
  ];

  const catalogQuery = useCatalogData();
  const accountQuery = useAccountData();
  const userRoleQuery = useUserRoleData();
  const userQuery = useUserData();

  const { isLoading, data, isError } = (() => {
    switch (attributeType) {
      case 'Catalog':
        return catalogQuery;
      case 'Account':
        return accountQuery;
      case 'User':
        return userRoleQuery;
      default:
        return { isLoading: false, data: [], isError: false }; // Default empty state
    }
  })();

  const [localData, setLocalData] = useState(data || []);

  useEffect(() => {
    if (data?.length > 0) {
      setLocalData(data);
    }
  }, [data]);

  useEffect(() => {
    if (attributeType == 'User') {
      const rule = values.rules.find((rule) => rule.attributeType === 'User'); // Find the User rule
      const selectedOption = rule?.value || []; // Get the value (user_role or user_name)

      if (selectedOption.length == 0) {
        setFieldValue('attributeuseroption', 'user_role');
      }

      // Update the dropdown options based on selected value
      if (selectedOption === 'user_role' && userRoleQuery.data) {
        // setSelectedData(userRoleQuery.data);
        setLocalData(userRoleQuery.data);
      } else if (selectedOption === 'user_name' && userQuery.data) {
        // setSelectedData(userQuery.data);
        setLocalData(userQuery.data);
      }
    }
  }, [values, userRoleQuery.data, userQuery.data]);

  // useEffect(() => {
  //   if (attributeType == 'User') {
  //     if (!values.attributeuseroption) {
  //       setFieldValue('attributeuseroption', 'user_role');
  //     }
  //     if (values.attributeuseroption === 'user_role') {
  //       if (userRoleQuery.data) {
  //         setSelectedData(userRoleQuery.data);
  //         setLocalData(userRoleQuery.data);
  //       }
  //     } else if (values.attributeuseroption === 'user_name') {
  //       if (userQuery.data) {
  //         setSelectedData(userQuery.data);
  //         setLocalData(userQuery.data);
  //       }
  //     }
  //   }
  // }, [values.attributeuseroption, userRoleQuery.data, userQuery.data, setFieldValue, attributeType]);

  const getAugmentedValues = (rules, attributeType) => {
    return rules.filter((rule) => rule.attributeType === attributeType).flatMap((rule) => rule.value_augmented || []);
  };

  const onRemoveClick = (itemToRemove, attributeType) => {
    const updatedValues = values.rules
      .find((rule) => rule.attributeType === attributeType)
      ?.value.filter((id) => id !== itemToRemove.value);

    const updatedAugmented = values.rules
      .find((rule) => rule.attributeType === attributeType)
      ?.value_augmented.filter((item) => item.value !== itemToRemove.value);
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
      if (option.value === itemToRemove.value) {
        return { ...option, isChecked: false };
      }
      return option;
    });
    setLocalData(() => updatedOptions);
  };

  const createLabelData = (item) => [
    {
      id: item.value,
      labelText: item.name
    }
  ];

  const renderswitch = () => {
    const pillsData = getAugmentedValues(values.rules, attributeType);
    switch (attributeType) {
      case 'Price':
        return (
          <div>
            <Field
              id="price"
              name={name}
              label={t('approvergroup.price')}
              placeholder=" "
              isRequired
              component={Components['input']}
              maxLength={50}
            />
          </div>
        );
      case 'Catalog':
        return (
          <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            <Field
              id="catalog"
              name={name}
              fieldlabel={t('approvergroup.selecttherapy')}
              placeholder=" "
              component={Components['multiSelectDropdown']}
              isRequired
              options={localData || []}
              getUpdatedOptions={(values) => {
                setLocalData(() => values);
              }}
            />
            <div className="pills-container">
              {pillsData.length > 0 &&
                pillsData.map((item) => (
                  <Pills
                    id="Catalog"
                    key={item.id}
                    labels={createLabelData(item)}
                    variant="secondary"
                    hasDeleteIcon={true}
                    onDelete={() => onRemoveClick(item, attributeType)}
                  />
                ))}
            </div>
          </div>
        );
      case 'Account':
        return (
          <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            <Field
              id="Account"
              name={name}
              fieldlabel={t('approvergroup.selectaccount')}
              placeholder=" "
              component={Components['multiSelectDropdown']}
              isRequired
              options={localData || []}
              getUpdatedOptions={(values) => {
                setLocalData(() => values);
              }}
            />
            <div className="pills-container">
              {pillsData.length > 0 &&
                pillsData.map((item) => (
                  <Pills
                    id="Account"
                    key={item.id}
                    labels={createLabelData(item)}
                    variant="secondary"
                    hasDeleteIcon={true}
                    onDelete={() => onRemoveClick(item, attributeType)}
                  />
                ))}
            </div>
          </div>
        );

      case 'User':
        return (
          <div className="grid grid-gap-24">
            <div>
              <Field
                id="User"
                name={name}
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
            </div>
            <div>
              <Field
                name={name}
                fieldlabel={t('approvergroup.selectuser')}
                placeholder=" "
                component={Components['multiSelectDropdown']}
                isRequired
                options={localData || []}
                getUpdatedOptions={(values) => {
                  setLocalData(() => values);
                }}
              />
            </div>
            <div className="pills-container">
              {pillsData.length > 0 &&
                pillsData.map((item) => (
                  <Pills
                    id="user"
                    key={item.id}
                    labels={createLabelData(item)}
                    variant="secondary"
                    hasDeleteIcon={true}
                    onDelete={() => onRemoveClick(item, attributeType)}
                  />
                ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  return <>{renderswitch()}</>;
}

export default RenderControls;
