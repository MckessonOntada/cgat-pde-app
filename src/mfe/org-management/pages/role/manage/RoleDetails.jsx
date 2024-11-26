import React from 'react';
import * as Yup from "yup";
import { Stepper, Required, Button } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useNavigate, useParams } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import PageHeader from '@src/components/pageHeader';
import { useTranslate } from '@src/translations/useTranslation';
import { Field, Formik, Form } from 'formik';
import { useMutation } from 'react-query';
import Components from '@src/components/form/Components';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';

const getRoleValidationSchema = (t) => Yup.object({
    roleName: Yup.string()
        .required(t('orgManagement.form.errors.roleNameRequired'))
        .min(3, t('orgManagement.form.errors.roleNameMinLength'))
        .max(50, t('orgManagement.form.errors.roleNameMaxLength')),
    roleDescription: Yup.string()
        .required('orgManagement.form.errors.roleDescriptionRequired')
        .min(10, 'orgManagement.form.errors.roleDescriptionMinLength')
        .max(200, 'orgManagement.form.errors.roleDescriptionMaxLength'),
});

const RoleDetails = () => {
    const { t } = useTranslate();
    const navigate = useNavigate();
    const { roleId } = useParams();



    const [formData, setFormData] = React.useState({
        roleName: '',
        roleDescription: '',
        permissionList: [],
    });

    const [activeForm, setActiveForm] = React.useState(0);

    const handleOnSavePermissionList = (permissionList) => {
        setFormData({
            ...formData,
            permissionList,
        });
    };

    const handleOnBackButtonClick = () => {
        navigate('/organization/roles');
    };

    const roleValidationSchema = getRoleValidationSchema(t);

    const mutation = useMutation(
        (data) => {
            HttpResourceService.callRest(
                `${ApiRoutes.GET_ROLES()}`,
                httpVerb.POST,
                data
            );
        }, 
        {
            onSuccess: (data) => {
                debugger;
                const {id} = data;
                navigate(`../${PATHS.roles}/${id}/permissions`);
            },
            onError: (error) => {
                console.error('Error posting data:', error);
            },
        }
    );

    const handleOnSubmit = (values, _action) => {
        mutation.mutate({name: values.roleName, description: values.roleDescription});
    }

    const forms = React.useMemo(() => [
        {
            name: 'roleDetails',
            label: t('orgManagement.role.labelRolesDetails'),
        },
        {
            name: 'addPermissions',
            label: t('orgManagement.role.labelAddPermissions'),
        },
    ], [t]);

    return (
        <div className="MCP-module-wrapper">
            <div>
                <button
                    className="MCP-Icon-Button py2"
                    onClick={handleOnBackButtonClick}
                >
                    <IconArrowLeft />
                    <p>{t('orgManagement.role.captionsBtnBackToManageRoles')}</p>
                </button>
            </div>

            <ModuleHeader heading={<PageHeader heading={t('orgManagement.role.labelAddRole')} />} />

            <div className="MCP-module-body">
                <Stepper
                    activeIndex={1}
                    dividerText="of"
                    mobileLabel={t('orgManagement.role.labelStep')}
                    stepHeaders={forms.map((f) => ({ label: f.label }))}
                />
                <div>
                    <Formik
                        initialValues={{
                            roleName: '',
                            roleDescription: '',
                        }}
                        validationSchema={roleValidationSchema}
                        onSubmit={handleOnSubmit}
                    >
                        <Form>
                            <div className='MCP-module-wrapper'>
                                <div className="MCP-panel-container">
                                    <ModuleHeader
                                        heading={<p className="secondaryHeading">{t('orgManagement.role.headingPermissionDetails')}</p>}
                                        controls={<p><Required /> {t('orgManagement.create_org.required')}</p>}
                                    />

                                    <div className='MCP-module-body'>
                                        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                                            <Field
                                                name="roleName"
                                                label={t('orgManagement.role.labelRoleName')}
                                                placeholder=" "
                                                isRequired
                                                component={Components['input']}
                                            />
                                        </div>
                                        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
                                            <Field
                                                name="roleDescription"
                                                placeholder=" "
                                                isRequired
                                                maxCharHelperText={t('orgManagement.role.labelMaxChar1000')}
                                                component={Components['textarea']}
                                                fieldlabel={t("orgManagement.role.labelRoleDescription")}
                                                maxCharLimit={1000}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='controls'>
                                    <Button size="md" variant="secondary">{t('orgManagement.button.cancel')}</Button>
                                    <Button size="md" variant="primary" type="submit">{t('orgManagement.role.captionsBtnSaveAndCancel')}</Button>
                                </div>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default RoleDetails;