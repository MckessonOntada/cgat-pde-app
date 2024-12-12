import Components from '@src/components/form/Components';
import React, { useEffect, useMemo, useState } from 'react';
import { RadioGroup } from '@mckesson/mcp-component-library';
import './index.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { Field } from 'formik';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { useQuery } from 'react-query';
import AuthUtils from '@src/util/AuthUtils';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';

function RenderControls({ attributeType, index }) {
  const { t } = useTranslate();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const practiceId = AuthUtils.getPracticeId();
  const userId = AuthUtils.getUserId();
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

  const apiUrl = useMemo(() => {
    let params = {
      status: 'active'
    };

    switch (attributeType) {
      case 'Catalog':
        return `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${practiceId}/users/${userId}/accounts?${serializeParams(params)}`; // Todo Therapy url
      case 'Account':
        return `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${practiceId}/users/${userId}/accounts?${serializeParams(params)}`;
      case 'User':
        return `${ApiRoutes.GET_ROLES()}?${serializeParams(params)}`;
      default:
        return null;
    }
  }, [attributeType, practiceId, userId]);

  const { isLoading, data, isError, refetch } = useQuery({
    queryKey: ['data', attributeType, apiUrl],
    queryFn: async () => {
      const res = await HttpResourceService.callRest(`${apiUrl}`, httpVerb.GET, {});
      if (res.data?.content) {
        return res.data?.content?.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }
    },
    refetchOnWindowFocus: false,
    keepPreviousData: true
  });

  useEffect(() => {
    if (apiUrl) {
      refetch();
    }
  }, [attributeType, apiUrl, refetch]);

  const renderswitch = () => {
    switch (attributeType) {
      case 'Price':
        return (
          <div>
            <Field id="price" name="price" label={t('approvergroup.price')} placeholder=" " isRequired component={Components['input']} maxLength={50} />
          </div>
        );
      case 'Catalog':
        return (
          <div>
            <Field name="attribute1" fieldlabel={t('approvergroup.selecttherapy')} placeholder=" " component={Components['multiSelectDropdown']} isRequired options={[]} />
          </div>
        );
      case 'Account':
        return (
          <div>
            <Field name="attribute1" fieldlabel={t('approvergroup.selectaccount')} placeholder=" " component={Components['multiSelectDropdown']} isRequired options={[]} />
          </div>
        );

      case 'User':
        return (
          <div>
            <label htmlFor={`attributes[${index}].value`} style={{ display: 'block', marginBottom: '0.5rem' }}>
              {t('approvergroup.user')} *
            </label>
            <div>
              <RadioGroup
                caption="Please select one option"
                direction="row"
                id="radioGroup"
                items={[
                  {
                    isDisabled: false,
                    label: 'User Role',
                    value: 'User Role'
                  },
                  {
                    isDisabled: false,
                    label: 'User Name',
                    value: 'User Name'
                  }
                ]}
                onChangeValue={() => {}}
                onOtherTextChange={() => {}}
                onSubRadioFieldChange={() => {}}
                radioBtnWidth="auto"
                value="User Role"
              />
            </div>
            <div>
              <Field name="attributeuser" fieldlabel={t('approvergroup.selectuser')} placeholder=" " component={Components['multiSelectDropdown']} isRequired options={data || []} />
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
