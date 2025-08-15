import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, Heading, Alert, Loader } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { PATHS } from '../../routes/constants';
import ModuleHeader from '@src/components/module-header';
import { useMutation, useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import AuthUtils from '@src/util/AuthUtils';
import { RoutePaths } from '@src/routes/constants';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import Components from '@src/components/form/Components';
import Attributes from './Attribute';
import { getValidationSchema, transformAttributesToRules } from './formUtils';
import './index.scss';
import { useFormContext } from '../../context/FormContext';
import { handleApiError, serializeParams } from '@src/util/ApiUtils';
import usePermission from '@src/hooks/usePermissions';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import CommonUtils, { getFullName } from '@src/util/CommonUtils';

function mergeLists(values = [], list = []) {
  const finalMap = new Map();

  for (const item of list) {
    finalMap.set(item.value, {
      label: item.label,
      value: item.value,
      email: item.email,
      isChecked: false
    });
  }

  for (const item of values) {
    if (finalMap.has(item.value)) {
      finalMap.get(item.value).isChecked = true;
    } else {
      finalMap.set(item.value, {
        label: item.label,
        value: item.value,
        email: item.email,
        isChecked: true
      });
    }
  }

  return Array.from(finalMap.values());
}

const CreateApproverGroup = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const { grpId } = useParams();
  const { initialValues, isEditMode, setIsEditMode, initializeFormFromLocation } = useFormContext();
  const [alert, setAlert] = useState(null);
  const practiceId = AuthUtils.getPracticeId();
  const [approverData, setApproverData] = React.useState([]);
  const [approverUserQuery, setApproverUserQuery] = React.useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isDirty, setIsDirty] = React.useState(false);
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const { hasPermission } = usePermission();

  const { refetch } = useQuery({
    queryKey: ['approver-group', 'user', grpId],
    queryFn: async () => {
      let userParams = {
        userType: 'GENERAL',
        status: 'active'
      };
      if (approverUserQuery) {
        userParams.query = approverUserQuery;
      }
      return await HttpResourceService.callRest(`${ApiRoutes.USERS()}?${serializeParams(userParams)}`, httpVerb.GET, {});
    },
    select: (response) => {
      if (response.data.content) {
        return response.data.content.map((item) => ({
          label: getFullName(item.name),
          value: item.id.toString(),
          email: item.contact.email
        }));
      }
      return [];
    },
    onSuccess: (result) => {
      setApproverData(result);
    }
  });

  React.useEffect(() => {
    refetch();
  }, [approverUserQuery, grpId]);

  const { data: groupData } = useQuery({
    queryKey: [`approver-group/${grpId}`],
    queryFn: async () => {
      const res = await HttpResourceService.callRest(`${ApiRoutes.APPROVER_GROUP()}/${grpId}`, httpVerb.GET, {});
      if (res.data) {
        return res.data;
      }
    },
    onSuccess: (result) => {
      initializeFormFromLocation(grpId, result);
    },
    enabled: !!grpId,
    refetchOnWindowFocus: false
  });

  const handleGoBack = () => {
    if (isDirty) {
      setModalSuccessCallback('list');
    } else {
      navigate(RoutePaths.pathApproverManagement);
    }
  };

  useEffect(() => {
    if (groupData && grpId) {
      setIsEditMode(true);
      initializeFormFromLocation(grpId, groupData);
    }
  }, [location.state, grpId, isEditMode]);

  const validationSchema = getValidationSchema(t);

  const { mutate: saveApproverGroup, isLoading } = useMutation(async ({ payload }) => {
    if (isEditMode) {
      const updateUser = await HttpResourceService.callRest(`${ApiRoutes.APPROVER_GROUP()}/${grpId}`, httpVerb.PUT, payload);
      setIsEditMode(false);
      return updateUser.data;
    } else {
      const createResponse = await HttpResourceService.callRest(`${ApiRoutes.APPROVER_GROUP()}`, httpVerb.POST, payload);
      return {
        createUser: createResponse.data
      };
    }
  });

  const handleSubmit = (values) => {
    const payload = transformAttributesToRules(values, practiceId);

    saveApproverGroup(
      { payload },
      {
        onSuccess: (response) => {
          if (!isEditMode) {
            navigate(RoutePaths.pathApproverManagement, { state: { isSuccess: true } });
          } else {
            navigate(`../${PATHS.approvergroupDetail.replace(':grpId', grpId)}`);
          }
        },
        onError: (error) => {
          const errorKey = handleApiError(error);
          setAlert({ type: 'error', message: t(errorKey) });
          setIsAlertVisible(true);
        }
      }
    );
  };

  const handleCancel = () => {
    if (isDirty) {
      setModalSuccessCallback(isEditMode ? 'details' : 'list');
    } else {
      const targetPath = isEditMode ? `../${PATHS.approvergroupDetail.replace(':grpId', grpId)}` : RoutePaths.pathApproverManagement;
      navigate(targetPath);
    }
  };

  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      navigate(RoutePaths.pathApproverManagement);
    } else if (modalSuccessCallback === 'details') {
      navigate(`../${PATHS.approvergroupDetail.replace(':grpId', grpId)}`);
    }
  };

  if (isLoading) return <Loader type={'screen'} />;

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
          {t('approvergroup.header.backmessage')}
        </Button>
      </div>

      <ModuleHeader heading={<Heading as="h1">{t(isEditMode ? 'approvergroup.edit.label' : 'approvergroup.create_addapprovergroup')}</Heading>} />

      {isAlertVisible && <Alert description={alert.message} onClose={() => setIsAlertVisible(false)} type={alert.type} />}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values, actions) => {
          handleSubmit(values);
          actions.setSubmitting(false);
        }}>
        {({ values, setFieldValue, touched }) => {
          useEffect(() => {
            setIsDirty(Object.keys(touched).length > 0);
          }, [touched]);
          const onRemoveApproverUser = (itemToRemove) => {
            const updatedUsers = values.approverUsers.filter((user) => user.value !== itemToRemove);
            setFieldValue('approverUsers', updatedUsers);
          };

          return (
            <Form>
              <div className="MCP-CardContainer">
                <Heading as="h2">{t('approvergroup.approvergroupdetails')}</Heading>
                <div className="MCP-module-wrapper">
                  <div className="MCP-module-body form-container">
                    <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                      <div>
                        <Field
                          id="name"
                          name="name"
                          label={t('approvergroup.approvergroupname')}
                          placeholder=" "
                          isRequired
                          component={Components['input']}
                          maxLength={50}
                        />
                        <div className="control-helper-text">Please enter a unique name to identify the approver group.</div>
                      </div>
                    </div>

                    <div>
                      <div className="headingBox">
                        <Heading as="h2">{t('approverGroup.view.subheader.rules')}</Heading>
                      </div>
                      <div>
                        <Attributes values={values} setFieldValue={setFieldValue} />
                      </div>
                    </div>

                    <div className="headingBox">
                      <Heading as="h2">{t('approvergroup.approveuserlist')}</Heading>
                    </div>

                    <div className="grid grid-gap-24 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
                      <Field
                        id="approverUsers"
                        name="approverUsers"
                        label={t('approvergroup.selectuser')}
                        placeholder=" "
                        isRequired
                        component={Components['multiSelectDropdown']}
                        onRemoveClick={onRemoveApproverUser}
                        noSelectedCountMessage={t('approvergroup.create.option.please_select')}
                        pillsLabels={values.approverUsers.map((item) => ({ ...item, id: item.value, labelText: item.label }))}
                        pillsCount={5}
                        ispillsVisible={true}
                        onChange={(value) => {
                          const changedValues = value.filter((item) => item.isChecked);
                          if (CommonUtils.isNonEmptyArray(changedValues) && !CommonUtils.areArraysUnique(changedValues, values.approverUsers))
                            setFieldValue(
                              `approverUsers`,
                              value.filter((item) => item.isChecked)
                            );
                        }}
                        options={mergeLists(values.approverUsers, approverData)}
                        onSearch={setApproverUserQuery}
                        variant="async"
                        recordsCountToEnableSearch={5}
                        size="lg"
                        asyncRecordsFound={approverData.length}
                        isMultiSelect={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={'buttonGroup'}>
                <Button variant="secondary" type="button" onClick={handleCancel} size={'md'}>
                  {t('approvergroup.button.cancel')}
                </Button>
                {hasPermission(isEditMode ? PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_APPROVER_GROUP : PERMISSIONS_ENUM.ORDER_MANAGEMENT.ADD_APPROVER_GROUP) && (
                  <Button type="submit" size="md">
                    {t(isEditMode ? 'approvergroup.button.updategroup' : 'approvergroup.button.creategroup')}
                  </Button>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
      <DiscardChangesModal
        heading="Discard Changes"
        description="You have changed Approve Group details. Do you still want to go back? Your changes will be discarded!"
        isOpen={Boolean(modalSuccessCallback)}
        onClose={() => setModalSuccessCallback(null)}
        onConfirm={handleNavigate}
      />
    </div>
  );
};

export default CreateApproverGroup;
