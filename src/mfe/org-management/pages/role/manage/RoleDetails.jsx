import { Button, Heading, Alert } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import Components from '@src/components/form/Components';
import ModuleHeader from '@src/components/module-header';
import PageHeader from '@src/components/pageHeader';
import { useTranslate } from '@src/translations/useTranslation';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import DiscardChangesModal from './DiscardChangesModel';
import { useWidgetContext } from '@src/context/WidgetContext';
import useRouteMode from '@src/mfe/user-management/routes/useRouteMode';
import RoleService from '@src/api/commonService/RoleService';
import { ReactComponent as ButtonLoadingIcon } from '@src/assets/svg/button-loading.svg';
import FormikFormWrapper from '@src/components/form/FormikFormWrapper';

const getRoleValidationSchema = (t) =>
  Yup.object({
    roleName: Yup.string()
      .required(t('orgManagement.form.errors.roleNameRequired'))
      .min(2, t('orgManagement.form.errors.roleNameMinLength'))
      .max(50, t('orgManagement.form.errors.roleNameMaxLength'))
      .matches(/^[A-Za-z\s]+$/, t('orgManagement.form.errors.roleNamevalidation')),
    roleDescription: Yup.string()
      .min(10, t('orgManagement.form.errors.roleDescriptionMinLength'))
      .max(100, t('orgManagement.form.errors.roleDescriptionMaxLength'))
  });

const getSubmitButtonCaption = ({ isEdit, isSaving }) => {
  if (isSaving && isEdit) return 'Updating';
  if (isSaving && !isEdit) return 'Saving';
  if (!isSaving && isEdit) return 'Update Details';
  return 'Save and Continue';
};

const INITIAL_STATE = {
  roleName: '',
  roleDescription: ''
};
const moduleBasePath = '/admin/organization/roles';

const RoleDetails = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { state, setValue } = useWidgetContext();
  const [alert, setAlert] = React.useState(null);
  const [isDirty, setIsDirty] = React.useState(false);
  const { roleDetails, createWizardSteps } = state;
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const { isEdit, id, params } = useRouteMode({ editSegment: 'edit', paramKey: 'roleId' });

  const [initialFormValues, setInitialFormValues] = React.useState(INITIAL_STATE);

  React.useEffect(() => {
    if ((isEdit && roleDetails) || createWizardSteps.details) {
      const { name, description } = roleDetails;
      setInitialFormValues({
        roleName: name,
        roleDescription: description
      });
    }
  }, [roleDetails]);

  const handleOnBackButtonClick = () => {
    if (isDirty) {
      setModalSuccessCallback('list');
    } else {
      navigate(isEdit ? `${moduleBasePath}/${id}` : moduleBasePath);
    }
  };

  const handleGoBack = () => {
    navigate(moduleBasePath);
  };

  const roleValidationSchema = getRoleValidationSchema(t);

  const { mutate: saveRoleDetails, isLoading: isSaving } = useMutation({
    mutationFn: async (data) => {
      if ((isEdit && id) || (!isEdit && createWizardSteps.details)) {
        return RoleService.updateRole(id, data);
      } else {
        return RoleService.createRole(data);
      }
    },
    onSuccess: (data) => {
      setValue('roleDetails', data);
      setValue('createWizardSteps', {
        ...state.createWizardSteps,
        details: true
      });
      if (isEdit) {
        navigate(`${moduleBasePath}/${data.id}`, {
          state: {
            alert: {
              pinPoint: 'details',
              type: 'success',
              description: 'Role details updated successfully.'
            }
          }
        });
      } else {
        navigate(`../${data.id}/permissions`);
      }
    },
    onError: (error) => {
      setAlert({
        type: 'error',
        description: error.message
      });
    }
  });

  const handleOnSubmit = (values, _action) => {
    if (createWizardSteps.details && !isDirty) {
      navigate(`./../permissions`);
      return;
    }

    const payload = {
      name: values.roleName,
      description: values.roleDescription
    };
    if (id) {
      payload.id = id;
    }
    saveRoleDetails(payload);
  };

  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      navigate(moduleBasePath);
    }
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
          {t('orgManagement.role.captionsBtnBackToManageRoles')}
        </Button>
      </div>

      <ModuleHeader heading={<PageHeader heading={t(isEdit ? 'orgManagement.role.labelEditRole' : 'orgManagement.role.labelAddRole')} />} />
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <div className="MCP-module-body">
        <div>
          <Formik initialValues={initialFormValues} validationSchema={roleValidationSchema} onSubmit={handleOnSubmit} enableReinitialize>
            {({ dirty }) => {
              React.useEffect(() => {
                setIsDirty(dirty);
              }, [dirty]);

              return (
                <FormikFormWrapper disabled={isSaving}>
                  <div className="MCP-module-wrapper">
                    <div className="MCP-panel-container">
                      <ModuleHeader
                        heading={<Heading as="h2">{t('orgManagement.role.headingPermissionDetails')}</Heading>}
                        controls={
                          <p>
                            <span className="required">*</span> {t('orgManagement.create_org.required')}
                          </p>
                        }
                      />

                      <div className="MCP-module-body">
                        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                          <Field name="roleName" label={t('orgManagement.role.labelRoleName')} placeholder=" " isRequired component={Components['input']} />
                        </div>
                        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
                          <Field
                            name="roleDescription"
                            placeholder=" "
                            component={Components['textarea']}
                            fieldlabel={t('orgManagement.role.labelRoleDescription')}
                            maxCharHelperText={t('input.helpers.maxCharLimit', { count: '100' })}
                            maxCharLimit={100}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="controls">
                      <Button size="md" variant="secondary" onClick={handleOnBackButtonClick}>
                        {t('orgManagement.button.cancel')}
                      </Button>
                      <Button
                        disabled={!(isDirty || (!isEdit && createWizardSteps.details))}
                        size="md"
                        variant="primary"
                        type="submit"
                        isLoadingState={isSaving}
                        Icon={isSaving && ButtonLoadingIcon}
                        iconPosition="left">
                        {getSubmitButtonCaption({ isEdit, isSaving })}
                      </Button>
                    </div>
                  </div>
                </FormikFormWrapper>
              );
            }}
          </Formik>
        </div>
      </div>
      <DiscardChangesModal
        heading="Discard Changes"
        description="You have changed role details. Do you still want to go back? Your changes will be discarded!"
        isOpen={Boolean(modalSuccessCallback)}
        onClose={() => setModalSuccessCallback(null)}
        onConfirm={handleNavigate}
      />
    </div>
  );
};

export default RoleDetails;
