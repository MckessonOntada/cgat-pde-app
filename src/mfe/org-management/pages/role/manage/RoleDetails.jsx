import React from 'react';
import * as Yup from 'yup';
import { Stepper, Required, Button, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import PageHeader from '@src/components/pageHeader';
import { useTranslate } from '@src/translations/useTranslation';
import { Field, Formik, Form } from 'formik';
import { useMutation } from 'react-query';
import Components from '@src/components/form/Components';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import DiscardChangesModal from './DiscardChangesModel';
import { useRole } from '@src/mfe/org-management/context/RoleContext';

const getRoleValidationSchema = (t) =>
  Yup.object({
    roleName: Yup.string()
      .required(t('orgManagement.form.errors.roleNameRequired'))
      .min(2, t('orgManagement.form.errors.roleNameMinLength'))
      .max(50, t('orgManagement.form.errors.roleNameMaxLength'))
      .matches(/^[A-Za-z\s]+$/, t('orgManagement.form.errors.roleNamevalidation')),
    roleDescription: Yup.string().min(10, 'orgManagement.form.errors.roleDescriptionMinLength').max(100, 'orgManagement.form.errors.roleDescriptionMaxLength')
  });

const RoleDetails = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { roleId } = useParams();
  const { refreshData } = useRole();

  const location = useLocation();
  const row = location.state ?? {};
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const isEdit = !!roleId;

  const [initialData, setInitialData] = React.useState({
    roleName: '',
    roleDescription: ''
  });

  const [formData, setFormData] = React.useState({ ...initialData });

  React.useEffect(() => {
    if (roleId && row) {
      const { name, description } = row;
      setFormData({
        roleName: name,
        roleDescription: description
      });
      setInitialData({
        roleName: name,
        roleDescription: description
      });
    }
  }, [roleId]);

  const handleOnBackButtonClick = () => {
    if (JSON.stringify(formData) !== JSON.stringify(initialData)) {
      setModalSuccessCallback('list');
    } else {
      navigate(isEdit ? `/organization/roles/${roleId}` : '/organization/roles');
    }
  };

  const handleGoBack = () => {
    navigate('/organization/roles');
  };

  const roleValidationSchema = getRoleValidationSchema(t);

  const mutation = useMutation(
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
        const data = res?.data;
        if (data) {
          const id = (data && data.id) || roleId;
          console.log(data);
          const { name, description } = data;
          
          refreshData();
          navigate(isEdit ? `/organization/roles/${roleId}` : `/organization/roles/${id}/permissions`, { state: { ...row, name, description } });
        }
      },
      onError: (error) => {
        console.error('Error posting data:', error);
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
    mutation.mutate(payload);
  };

  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      navigate('/organization/roles');
    }
  };

  const forms = React.useMemo(
    () => [
      {
        name: 'roleDetails',
        label: t('orgManagement.role.labelRolesDetails')
      },
      {
        name: 'addPermissions',
        label: t('orgManagement.role.labelAddPermissions')
      }
    ],
    [t]
  );

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
            {t('orgManagement.role.captionsBtnBackToManageRoles')}
        </Button>
      </div>

      <ModuleHeader heading={<PageHeader heading={t('orgManagement.role.labelAddRole')} />} />

      <div className="MCP-module-body">
        {!isEdit && <Stepper activeIndex={1} dividerText="of" mobileLabel={t('orgManagement.role.labelStep')} stepHeaders={forms.map((f) => ({ label: f.label }))} />}

        <div>
          <Formik initialValues={formData} validationSchema={roleValidationSchema} onSubmit={handleOnSubmit} enableReinitialize>
            {({ values, isValid }) => {
              React.useEffect(() => {
                setFormData({ ...values });
              }, [values]);

              return (
                <Form>
                  <div className="MCP-module-wrapper">
                    <div className="MCP-panel-container">
                      <ModuleHeader
                        heading={<Heading as="h2">{t('orgManagement.role.headingPermissionDetails')}</Heading>}
                        controls={
                          <p>
                            <Required /> {t('orgManagement.create_org.required')}
                          </p>
                        }
                      />

                      <div className="MCP-module-body">
                        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                          <Field name="roleName" label={t('orgManagement.role.labelRoleName')} placeholder=" " isRequired component={Components['input']} />
                        </div>
                        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
                          <Field name="roleDescription" placeholder=" " component={Components['textarea']} fieldlabel={t('orgManagement.role.labelRoleDescription')} maxCharLimit="100" />
                        </div>
                      </div>
                    </div>
                    <ModuleHeader
                      controls={
                        <div className="controls">
                          <Button size="md" variant="secondary" onClick={handleOnBackButtonClick}>
                            {t('orgManagement.button.cancel')}
                          </Button>
                          <Button size="md" variant="primary" type="submit">
                            {t('orgManagement.role.captionsBtnSaveAndCancel')}
                          </Button>
                        </div>
                      }
                    />
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
      <DiscardChangesModal 
        heading="Discard Changes"
        description='You have changed role details. Do you still want to go back? Your changes will be discarded!'
        isOpen={Boolean(modalSuccessCallback)} 
        onClose={() => setModalSuccessCallback(null)} 
        onConfirm={handleNavigate} 
      />
    </div>
  );
};

export default RoleDetails;
