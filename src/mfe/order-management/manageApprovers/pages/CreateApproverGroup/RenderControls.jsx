import Components from '@src/components/form/Components';
import React, { useEffect, useMemo, useState } from 'react';
import { RadioGroup } from '@mckesson/mcp-component-library';
import './index.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { Field, useFormikContext } from 'formik';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { useQuery } from 'react-query';
import AuthUtils from '@src/util/AuthUtils';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import { useAccountData, useCatalogData, useUserData, useUserRoleData } from './apiService';

function RenderControls({ attributeType, index }) {
  const { t } = useTranslate();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { values, setFieldValue } = useFormikContext();
  const [selectedData, setSelectedData] = useState([]);
  // const practiceId = AuthUtils.getPracticeId();
  // const userId = AuthUtils.getUserId();
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

  useEffect(() => {
    if (!values.attributeuseroption) {
      setFieldValue('attributeuseroption', 'user_role'); // Set default value to 'user_role'
    }
    if (values.attributeuseroption === 'user_role') {
      if (userRoleQuery.data) {
        setSelectedData(userRoleQuery.data); // Populate dropdown with user roles
      }
    } else if (values.attributeuseroption === 'user_name') {
      if (userQuery.data) {
        setSelectedData(userQuery.data); // Populate dropdown with user names
      }
    }
  }, [values.attributeuseroption, userRoleQuery.data, userQuery.data]);

  const renderswitch = () => {
    switch (attributeType) {
      case 'Price':
        return (
          <div>
            <Field
              id="price"
              name="price"
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
          <div>
            <Field
              id="catalog"
              name="catalog"
              fieldlabel={t('approvergroup.selecttherapy')}
              placeholder=" "
              component={Components['multiSelectDropdown']}
              isRequired
              options={data || []}
            />
          </div>
        );
      case 'Account':
        return (
          <div>
            <Field
              id="Account"
              name="Account"
              fieldlabel={t('approvergroup.selectaccount')}
              placeholder=" "
              component={Components['multiSelectDropdown']}
              isRequired
              options={data || []}
            />
          </div>
        );

      case 'User':
        return (
          <div className="grid grid-gap-24">
            <div>
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
            </div>
            <div>
              <Field
                name="attributeuser"
                fieldlabel={t('approvergroup.selectuser')}
                placeholder=" "
                component={Components['multiSelectDropdown']}
                isRequired
                options={selectedData || []}
              />
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
