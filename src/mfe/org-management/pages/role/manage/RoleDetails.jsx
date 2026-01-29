import { Button, Heading, Loader, Alert } from '@mckesson/mcp-component-library';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import Components from '@src/components/form/Components';
import ModuleHeader from '@src/components/module-header';
import PageHeader from '@src/components/pageHeader';
import { useRole } from '@src/mfe/org-management/context/RoleContext';
import { useTranslate } from '@src/translations/useTranslation';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useMutation } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import DiscardChangesModal from './DiscardChangesModel';

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

const moduleBasePath = '/admin/organization/roles';

const RoleDetails = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { roleId } = useParams();
  const { refreshData } = useRole();
  const [alert, setAlert] = React.useState(null);
  const [isDirty, setIsDirty] = React.useState(false);
  const location = useLocation();
  const row = location.state ?? {};
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const isEdit = !!roleId;

  const [initialFormValues, setInitialFormValues] = React.useState({
    roleName: '',
    roleDescription: ''
  });

  React.useEffect(() => {
    if (roleId && row) {
      const { name, description } = row;
      setInitialFormValues({
        roleName: name,
        roleDescription: description
      });
    }
  }, [roleId]);

  const handleOnBackButtonClick = () => {
    if (isDirty) {
      setModalSuccessCallback('list');
    } else {
      navigate(isEdit ? `${moduleBasePath}/${roleId}` : moduleBasePath);
    }
  };

  const handleGoBack = () => {
    navigate(moduleBasePath);
  };

  const roleValidationSchema = getRoleValidationSchema(t);

  const { mutate: saveRoleDetails, isLoading } = useMutation(
    async (data) => {
      let apiUrl = ApiRoutes.GET_ROLES();
      let actionSpecificHttpVerb = httpVerb.POST;

      if (roleId) {
        apiUrl += `/${roleId}`;
        actionSpecificHttpVerb = httpVerb.PATCH;
      }
      const res = await HttpResourceService.callRest(apiUrl, actionSpecificHttpVerb, data);
      return res;
    },
    {
      onSuccess: (res) => {
        const { data } = res;
        if (isEdit) {
          navigate(`${moduleBasePath}/${data.id}`, {
            state: {
              alert: {
                type: 'success',
                description: 'Role details updated successfully.'
              }
            }
          });
        } else {
          navigate(`${moduleBasePath}/${data.id}/permissions`, {
            state: { data: data }
          });
        }
      },
      onError: (error) => {
        setAlert({
          type: 'error',
          description: error.message
        });
      }
    }
  );

  const handleOnSubmit = (values, _action) => {
    const payload = {
      name: values.roleName,
      description: values.roleDescription
    };
    if (roleId) {
      payload.id = roleId;
    }
    saveRoleDetails(payload);
  };

  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      navigate(moduleBasePath);
    }
  };

  if (isLoading) {
    return <Loader type={'screen'} />;
  }
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
                <Form>
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
                            maxCharHelperText={t('ManageCatalog.input.validation.text')}
                            maxCharLimit={5000}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="controls">
                      <Button size="md" variant="secondary" onClick={handleOnBackButtonClick}>
                        {t('orgManagement.button.cancel')}
                      </Button>
                      <Button disabled={!isDirty} size="md" variant="primary" type="submit">
                        {t('orgManagement.role.captionsBtnSaveAndCancel')}
                      </Button>
                    </div>
                  </div>
                </Form>
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
