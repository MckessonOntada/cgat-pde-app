import React, { useState, useEffect, Fragment } from 'react';
import { RadioGroup, Switch, Button, Heading, Required, TextError } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import './PermissionForm.scss';
import { useQuery } from 'react-query';
import { Field, useFormikContext } from 'formik';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import AuthUtils from '@src/util/AuthUtils';
import { serializeParams } from '@src/util/ApiUtils';
import MultiSelectDropdown from '@src/components/form/MultiSelectDropdown';
import { CUSTOMER_CENTRE, CUSTOMER_SERVICE } from '@src/api/commonService/CommonService';
import { useWidgetContext } from '@src/context/WidgetContext';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';

const PermissionForm = ({ permissions, isRolePage }) => {
  const { t } = useTranslate();
  const { setFieldValue, values } = useFormikContext();
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const [searchKey, setSearchKey] = useState('');
  const { setValue } = useWidgetContext();

  const getParams = () => {
    let payload = { status: 'active', isPhysicianRequired: false, query: searchKey };
    return payload;
  };

  const channelList = [
    { label: t('labels.BUY_AND_BILL'), value: CHANNEL_TYPE.BUY_AND_BILL },
    {
      label: t('labels.SPECIALITY_PHARMACY'),
      value: CHANNEL_TYPE.SPECIALTY_PHARMA
    }
  ];

  const {
    isLoading,
    isError,
    data: roleData = [],
    refetch
  } = useQuery({
    queryKey: [`roles/getAll}`],
    queryFn: async () => {
      const res = await HttpResourceService.callRest(`${ApiRoutes.GET_ROLES()}?${serializeParams(getParams())}`, httpVerb.GET, {});

      if (res.data?.content) {
        const roles = res.data?.content?.map((role) => ({
          ...role,
          label: role.name === CUSTOMER_CENTRE ? CUSTOMER_SERVICE : role.name,
          value: role.id
        }));
        return roles;
      }
      return [];
    },
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    refetch();
  }, [searchKey]);

  const filteredPermissionsEnum = isSystemAdminView
    ? permissions || {}
    : Object.fromEntries(Object.entries(permissions || {}).filter(([key]) => key !== 'ORGANIZATION_MANAGEMENT'));

  const enableAllPermissions = () => {
    const newPermissions = Object.fromEntries(Object.keys(values.permissions).map((k) => [k, true]));
    setFieldValue('permissions', newPermissions);
  };

  const resetPermissions = () => {
    const newPermissions = Object.fromEntries(Object.keys(values.permissions).map((k) => [k, false]));
    setFieldValue('permissions', newPermissions);
  };

  const handleOnChange = (value) => {
    const selectedRoleDetails = roleData.find((x) => x.id === value);
    if (selectedRoleDetails) {
      const newRolePermissions = selectedRoleDetails.permissions || [];
      const _permissions = Object.fromEntries(Object.keys(values.permissions).map((key) => [key, newRolePermissions.includes(key)]));

      setFieldValue('permissions', _permissions);
      setFieldValue('role', selectedRoleDetails);
      setValue('selectedRole', selectedRoleDetails.name);
    }
  };

  return (
    <div className="MCP-module-wrapper">
      {
        <Fragment>
          <ModuleHeader heading={<Heading as="h2">{t('userManagement.user_permissions.select_role')}</Heading>} />

          <div className="MCP-panel-container">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
              <Field name={`role`}>
                {({ field, form, meta }) => {
                  return (
                    <React.Fragment>
                      <div>
                        <MultiSelectDropdown
                          id={'select-role-search'}
                          label={t('userManagement.user_permissions.select_role')}
                          isMultiSelect={false}
                          placeholder={'Select Role'}
                          onChange={handleOnChange}
                          options={roleData}
                          variant={'async'}
                          onSearch={(event) => setSearchKey(event)}
                          recordsCountToEnableSearch={5}
                          isRequired={!isRolePage}
                          size="lg"
                          isSortEnable={false}
                          value={field.value && field.value?.id}
                          defaultSelectedLabel={field.value?.label}
                        />

                        {meta.error && <TextError errorMessage={meta.error} />}
                      </div>
                    </React.Fragment>
                  );
                }}
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
              {values.role?.name === 'Customer Centre' && (
                <div className="radio-group">
                  <Field name={`channelType`}>
                    {({ field, form, meta }) => {
                      const { setFieldValue } = form;
                      return (
                        <React.Fragment>
                          <RadioGroup
                            direction="row"
                            id="order-channel-options"
                            caption={'Which channel is this user associated with?'}
                            isRequired={true}
                            items={channelList}
                            onChangeValue={(value) => setFieldValue(field.name, value)}
                            value={field.value}
                            radioBtnWidth="auto"
                            size="lg"
                          />
                          {meta.error && <TextError errorMessage={meta.error} />}
                        </React.Fragment>
                      );
                    }}
                  </Field>
                </div>
              )}
            </div>
          </div>
        </Fragment>
      }
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h2">{t('userManagement.user_permissions.managePermissions')}</Heading>}
          controls={
            !isSystemAdminView && (
              <div className="controls">
                <Button size="md" variant="secondary" onClick={resetPermissions}>
                  {t('userManagement.user_permissions.button.reset')}
                </Button>
                <Button size="md" variant="secondary" onClick={enableAllPermissions}>
                  {t('userManagement.user_permissions.button.applyall')}
                </Button>
              </div>
            )
          }
        />
        <div className="MCP-panel-container grid grid-gap-16">
          {filteredPermissionsEnum &&
            Object.entries(filteredPermissionsEnum).map(([category, permissions]) => (
              <div key={category} className="MCP-module-body permission-category">
                <Heading as="h3">{t(category)}</Heading>
                <div className="permission-category">
                  <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 permission-list">
                    {Object.entries(permissions).map(([key, permission], idx) => (
                      <React.Fragment key={idx}>
                        <div key={key} className="flex items-center justify-between permission-item">
                          <div className="permission-info">
                            <div className="permission-info-header">{t(`${category}.${key}`)}</div>
                            <p>{t(`${category}.${key}.DESCRIPTION`)}</p>
                          </div>
                          <div className="permission-toggle">
                            <Field name={`permissions.${key}`}>
                              {({ field, form }) => {
                                return (
                                  <div>
                                    <Switch
                                      id={`toggle-${category}-${key}`}
                                      label={!isSystemAdminView && field.value ? 'Enabled' : 'Disabled'}
                                      disabled={isSystemAdminView}
                                      labelPosition="right"
                                      size="lg"
                                      checked={field.value}
                                      onChange={() => {
                                        form.setFieldValue(field.name, !field.value);
                                        form.setFieldTouched(field.name, true, false);
                                      }}
                                    />
                                  </div>
                                );
                              }}
                            </Field>
                          </div>
                        </div>
                        {idx % 2 === 0 && idx !== Object.keys(filteredPermissionsEnum[category]).length - 1 && <div className="divider"></div>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PermissionForm;
