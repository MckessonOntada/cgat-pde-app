import React, { useEffect, useRef, useState } from 'react';
import './index.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { useFormikContext } from 'formik';
import { CONTROL_OPTIONS } from '../ApproverGroupDetail/RulesConfig';
import AttributeFieldRenderer from './AttributeFieldRenderer';
import CommonUtils from '@src/util/CommonUtils';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';

function RenderControls({ attributeType = CONTROL_OPTIONS.Price, name }) {
  const { t } = useTranslate();
  const { values, setFieldValue } = useFormikContext();
  const [localData, setLocalData] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const endPointUrl = {
    Material: `${ApiRoutes.USERS()}/current/therapies`,
    Account: `${ApiRoutes.CURRENT_USER()}/accounts`,
    'User Role': `${ApiRoutes.GET_ROLES()}`,
    'User Name': `${ApiRoutes.USERS()}`
  };
  const params = {
    Material: {},
    Account: {
      status: 'active',
      partnerFunction: 'SOLD_TO'
    },
    'User Role': {
      status: 'active'
    },
    'User Name': {
      userType: 'GENERAL',
      status: 'active'
    }
  };
  const dataTransformers = {
    Material: (item) => ({
      label: item.tradeName,
      value: item.tradeName,
      channelType: item.channelType
    }),
    Account: (item) => ({
      label: item.accountName,
      value: item.accountNumber,
      channelType: item.channelType,
      name: item.accountName
    }),
    'User Role': (item) => ({
      label: item.name,
      value: item.id,
      name: item.name
    }),
    'User Name': (item) => ({
      label: CommonUtils.getFullName(item.name),
      value: item.id,
      name: CommonUtils.getFullName(item.name)
    })
  };

  const { refetch } = useQuery({
    queryKey: ['dynamicQuery', attributeType, searchQuery],
    queryFn: () => {
      const url = endPointUrl[attributeType];
      const param = params[attributeType];
      if (searchQuery) {
        param.query = searchQuery;
      }
      if (url) {
        return HttpResourceService.callRest(`${url}?${serializeParams(param)}`, httpVerb.GET, {});
      }
    },
    select: (res) => {
      const transform = dataTransformers[attributeType];
      return transform ? res?.data?.content?.map(transform) || [] : [];
    },
    onSuccess: (result) => {
      setLocalData(result);
    },
    refetchOnWindowFocus: false,
    enabled: false
  });

  React.useEffect(() => {
    refetch();
  }, [searchQuery, attributeType]);

  const onChange = (value) => {
    const index = values.rules.findIndex((rule) => rule.attributeType === attributeType);
    if (attributeType === 'Price') {
      if (index !== -1) {
        setFieldValue(`rules[${index}].value`, value);
      }
    } else {
      if (index !== -1) {
        const filteredItems = value.filter((item) => item.isChecked);
        setFieldValue(`rules[${index}].value`, filteredItems);
      }
    }
  };

  const onRemoveClick = (itemId) => {
    const updatedValues = values.rules.find((rule) => rule.attributeType === attributeType)?.value.filter((item) => item.value !== itemId);

    const updatedRules = values.rules.map((rule) => {
      if (rule.attributeType === attributeType) {
        return {
          ...rule,
          value: updatedValues
        };
      }
      return rule;
    });

    setFieldValue('rules', updatedRules);

    const updatedOptions = localData.map((option) => {
      if (option.value === itemToRemove) {
        return { ...option, isChecked: false };
      }
      return option;
    });
    setLocalData(updatedOptions);
  };
  const controlIdentifier = attributeType.replace(' ', '_').toLowerCase();
  return (
    <AttributeFieldRenderer
      caption={t(`rules.value.${controlIdentifier}.caption`)}
      helperText={t(`rules.value.${controlIdentifier}.helperText`)}
      attributeType={attributeType}
      name={name}
      localData={localData}
      setLocalData={setLocalData}
      onSearch={setSearchQuery}
      onRemoveClick={onRemoveClick}
      handleOnChange={onChange}
      setFieldValue={setFieldValue}
      t={t}
      values={values}
    />
  );
}

export default RenderControls;
