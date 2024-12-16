import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, Heading, Alert, Pills } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { PATHS } from '../../routes/constants';
import ModuleHeader from '@src/components/module-header';
import { useQuery, useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { handleApiError, serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import { RoutePaths } from '@src/routes/constants';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import Components from '@src/components/form/Components';
import Attributes from './Attribute';
import { useApprover } from '../../context/ApproverContext';
import { getValidationSchema, transformAttributesToRules } from './formUtils';
import './index.scss';
import { useFormContext } from '../../context/FormContext';

const CreateApproverGroup = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const { grpId } = useParams();
  const { initialValues, setInitialValues, isEditMode, setIsEditMode, setLocationState } = useFormContext();
  const { refreshData, usersData } = useApprover();
  const [alert, setAlert] = useState(null);
  const [localUserData, setLocalUsersData] = useState([]);
  const practiceId = AuthUtils.getPracticeId();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const dataBinded = useRef(false);

  useEffect(() => {
    if (!dataBinded.current) {
      if (location.state?.data && usersData && initialValues.id) {
        const selectedUserData = usersData.map((user) => ({
          value: user.value,
          label: user.label,
          isChecked: initialValues.approverUsers.includes(user.value)
        }));
        setLocalUsersData(selectedUserData);
        dataBinded.current = true;
      } else if (!location.state && usersData) {
        setLocalUsersData(usersData);
        setIsEditMode(false);
        dataBinded.current = true;
      }
    }
  }, [usersData, initialValues, isEditMode, location.state]);

  //console.log('initialvlaues1', initialValues, location.state?.data);
  const handleGoBack = () => {
    navigate(RoutePaths.pathApproverManagement);
  };

  const handleAlertClose = () => {
    setIsAlertVisible(false);
  };

  useEffect(() => {
    if (location.state && location.state?.data) {
      setIsEditMode(true);
      setLocationState(location.state);

      const { name, rules, approverUsers } = location.state.data;
      const transformedRules = Object.entries(rules).map(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return null;
        }
        if (key === 'price') {
          return { attributeType: 'Price', value };
        }
        if (key === 'accounts') {
          return {
            attributeType: 'Account',
            value: value.map((item) => item.accountId)
          };
        }
        if (key === 'therapies') {
          return {
            attributeType: 'Catalog',
            value: value.map((item) => item.therapyId)
          };
        }
        if (key === 'users') {
          if (!rules.roles || rules.roles.length === 0) {
            return {
              attributeType: 'User',
              value: value.map((item) => item.userId)
            };
          }
          return null;
        }
        if (key === 'roles') {
          if (!rules.users || rules.users.length === 0) {
            return {
              attributeType: 'User',
              value: value.map((item) => item.roleId)
            };
          }
          return null;
        }
        // return {
        //   attributeType: key.charAt(0).toUpperCase() + key.slice(1),
        //   value: Array.isArray(value)
        //     ? value.map((item) => ({
        //         id: item[`${key.slice(0, -1)}Id`],
        //         name: item[`${key.slice(0, -1)}Name`]
        //       }))
        //     : []
        // };
      });
      const hasRoles = rules.roles && rules.roles.length > 0;
      const hasUsers = rules.users && rules.users.length > 0;

      const dynamicAttributeUserOption = hasRoles ? 'user_role' : hasUsers ? 'user_name' : 'user_role';
      const transformedApproverUsers = approverUsers.map((user) => user.userId);

      setInitialValues({
        id: grpId,
        name: name || '',
        rules: (transformedRules || []).filter((transformedRules) => transformedRules && transformedRules.attributeType),
        approverUsers: transformedApproverUsers,
        attributeuseroption: dynamicAttributeUserOption
      });
    }
  }, [location.state, setInitialValues, setIsEditMode, setLocationState]);

  const validationSchema = getValidationSchema(t);

  const { mutate, isLoading, isError, data } = useMutation(async ({ payload }) => {
    if (isEditMode) {
      const updateUser = await HttpResourceService.callRest(`${ApiRoutes.APPROVER_GROUP()}/${grpId}`, httpVerb.PUT, payload);
      return updateUser.data;
    } else {
      const createResponse = await HttpResourceService.callRest(`${ApiRoutes.APPROVER_GROUP()}`, httpVerb.POST, payload);
      return {
        createUser: createResponse.data
      };
    }
  });

  const handleSubmit = (values) => {
    // console.log('Practice ID before submission: ', practiceId);
    //console.log(JSON.stringify(transformAttributesToRules(values, practiceId), null, 2));
    // alert(JSON.stringify(transformAttributesToRules(values, practiceId), null, 2));
    // navigate(RoutePaths.pathApproverManagement, { state: { isSuccess: true } });

    const payload = transformAttributesToRules(values, practiceId);

    mutate(
      { payload },
      {
        onSuccess: (response) => {
          console.log('  created/updated successfully:', response);
          navigate(RoutePaths.pathApproverManagement, { state: { isSuccess: true } });
        },
        onError: (error) => {
          // const errorKey = handleApiError(error);
          setAlert({ type: 'error', message: t('errors.default') });
          setIsAlertVisible(true);
        }
      }
    );
  };

  const createLabelData = (values) => {
    let val = values.approverUsers_augmented?.map(({ name, value }) => ({
      labelText: name,
      id: value
    }));
    return val;
  };
  const handleCancel = () => {
    if (isEditMode) {
      navigate(`../${PATHS.approvergroupDetail.replace(':grpId', grpId)}`);
    } else {
      navigate(RoutePaths.pathApproverManagement);
    }
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
          {t('approvergroup.header.backmessage')}
        </Button>
      </div>

      <ModuleHeader heading={<Heading as="h1">{t('approvergroup.create_approvergroup')}</Heading>} />

      {isAlertVisible && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} duration={10000} />}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values, actions) => {
          handleSubmit(values);
          actions.setSubmitting(false);
        }}>
        {({ values, setFieldValue, isValid, handleChange, errors, touched }) => {
          console.log('values,', values);
          const onRemoveUser = (itemToRemove) => {
            const updatedUsers = values.approverUsers.filter((userId) => userId !== itemToRemove);
            const updatedAugmentedUsers = values.approverUsers_augmented.filter((user) => user.value !== itemToRemove);
            setFieldValue('approverUsers', updatedUsers);
            setFieldValue('approverUsers_augmented', updatedAugmentedUsers);

            const updatedOptions = localUserData.map((option) => {
              if (option.value === itemToRemove) {
                return { ...option, isChecked: false };
              }
              return option;
            });

            setLocalUsersData(() => updatedOptions);
          };

          return (
            <Form>
              <div className="MCP-panel-container">
                <Heading as="h2">{t('approvergroup.approvergroupdetails')}</Heading>
                <div className="MCP-module-wrapper">
                  <div className="MCP-module-body form-container">
                    <div>
                      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                        <Field
                          id="name"
                          name="name"
                          label={t('approvergroup.approvergroupname')}
                          placeholder=" "
                          isRequired
                          component={Components['input']}
                          maxLength={50}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="headingBox">
                        <Heading as="h2">{t('approvergroup.attributes')}</Heading>
                      </div>
                      <div>
                        <Attributes values={values} errors={errors} touched={touched} handleChange={handleChange} />
                      </div>
                    </div>

                    <div>
                      <div className="headingBox">
                        <Heading as="h2">{t('approvergroup.approveuserlist')}</Heading>
                      </div>
                      <div className="pills-container">
                        <Pills
                          id={'pill-id'}
                          key={'pills'}
                          labels={createLabelData(values)}
                          variant="secondary"
                          hasDeleteIcon={true}
                          onDelete={(item) => onRemoveUser(item)}
                        />
                      </div>
                      <div className="grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                        <Field
                          id="approverUsers"
                          name="approverUsers"
                          fieldlabel={t('approvergroup.selectuser')}
                          placeholder=" "
                          component={Components['multiSelectDropdown']}
                          isRequired
                          options={localUserData || []}
                          value={values.approverUsers}
                          getUpdatedOptions={(values) => {
                            setLocalUsersData(() => values);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={'buttonGroup'}>
                <Button variant="secondary" type="button" onClick={handleCancel} size={'md'}>
                  {t(isEditMode ? 'approvergroup.button.back' : 'approvergroup.button.cancel')}
                </Button>

                <Button type="submit" size={'md'}>
                  {t(isEditMode ? 'approvergroup.button.updategroup' : 'approvergroup.button.creategroup')}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CreateApproverGroup;
