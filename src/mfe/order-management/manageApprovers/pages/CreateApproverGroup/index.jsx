import React, { useState, useEffect, useRef } from 'react';
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
import { useApprover } from '../../context/ApproverContext';
import { createLabelData, getValidationSchema, transformAttributesToRules } from './formUtils';
import './index.scss';
import { useFormContext } from '../../context/FormContext';
import { handleApiError } from '@src/util/ApiUtils';
import usePermission from '@src/hooks/usePermissions';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';

const CreateApproverGroup = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const { grpId } = useParams();
  const { initialValues, isEditMode, setIsEditMode, initializeFormFromLocation } = useFormContext();
  const { usersData } = useApprover();
  const [alert, setAlert] = useState(null);
  const [localUserData, setLocalUsersData] = useState([]);
  const practiceId = AuthUtils.getPracticeId();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const dataBinded = useRef(false);
  const [isDirty, setIsDirty] = React.useState(false);
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const userPermissions = AuthUtils.getUserPermissions();
  const { hasPermission } = usePermission();

  const {
    isLoading: isLoadingapproverGroup,
    data: groupData,
    isError: isErrorapproverGroup,
    refetch
  } = useQuery({
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

  useEffect(() => {
    if (!dataBinded.current) {
      if (groupData && usersData && initialValues.id) {
        const selectedUserData = usersData.map((user) => ({
          value: user.value,
          label: user.label,
          isChecked: initialValues.approverUsers.map(String).includes(String(user.value))
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

  const handleGoBack = () => {
    if (isDirty) {
      setModalSuccessCallback('list');
    } else {
      navigate(RoutePaths.pathApproverManagement);
    }
  };

  const handleAlertClose = () => {
    setIsAlertVisible(false);
  };

  useEffect(() => {
    if (groupData && grpId) {
      setIsEditMode(true);
      initializeFormFromLocation(grpId, groupData);
    }
  }, [location.state, grpId, isEditMode]);

  const validationSchema = getValidationSchema(t);

  const { mutate, isLoading, isError, data } = useMutation(async ({ payload }) => {
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

    mutate(
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

  const onRemoveUser = (itemToRemove, approverUsers, approverUsers_augmented, setFieldValue) => {
    const updatedUsers = approverUsers.filter((userId) => userId !== itemToRemove);
    const updatedAugmentedUsers = approverUsers_augmented.filter((user) => user.value !== itemToRemove);
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
  {
    isLoading && <Loader type={'screen'} />;
  }
  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
          {t('approvergroup.header.backmessage')}
        </Button>
      </div>

      <ModuleHeader
        heading={<Heading as="h1">{t(isEditMode ? 'approvergroup.edit.label' : 'approvergroup.create_approvergroup')}</Heading>}
      />

      {isAlertVisible && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} duration={10000} />}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values, actions) => {
          handleSubmit(values);
          actions.setSubmitting(false);
        }}>
        {({ values, setFieldValue, handleChange, errors, touched }) => {
          useEffect(() => {
            setIsDirty(Object.keys(touched).length > 0);
          }, [touched]);

          const onRemoveUserClick = (itemToRemove) => {
            onRemoveUser(itemToRemove, values.approverUsers, values.approverUsers_augmented, setFieldValue);
          };

          return (
            <Form>
              <div className="MCP-CardContainer">
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
                        <Attributes values={values} setFieldValue={setFieldValue} />
                      </div>
                    </div>

                    <div>
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
                          options={localUserData || []}
                          getUpdatedOptions={(values) => {
                            if (values.length > 0) {
                              setLocalUsersData(values);
                            }
                          }}
                          onRemoveClick={onRemoveUserClick}
                          noSelectedCountMessage={t('approvergroup.create.option.please_select')}
                          pillsLabels={createLabelData(values.approverUsers_augmented)}
                          pillsCount={5}
                          ispillsVisible={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={'buttonGroup'}>
                <Button variant="secondary" type="button" onClick={handleCancel} size={'md'}>
                  {t('approvergroup.button.cancel')}
                </Button>
                {hasPermission(
                  isEditMode ? PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_APPROVER_GROUP : PERMISSIONS_ENUM.ORDER_MANAGEMENT.ADD_APPROVER_GROUP
                ) && (
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
