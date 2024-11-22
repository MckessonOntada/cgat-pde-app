import React from 'react';
import * as Yup from "yup";
import ModuleHeader from '@src/components/module-header';
import { Required, Button } from '@mckesson/mcp-component-library';
import Components from '@src/components/form/Components';
import { Field, Formik, Form } from 'formik';
import { useTranslate } from '@src/translations/useTranslation';

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

const RoleDetailsForm = ({onSubmit}) => {
    const { t } = useTranslate();
    const roleValidationSchema = getRoleValidationSchema(t);
    return (
        <Formik
            initialValues={{
                roleName: '',
                roleDescription: '',
            }}
            validationSchema={roleValidationSchema}
            onSubmit={(values) => {
                onSubmit(values);
            }}
        >
            <Form>
                <div className='MCP-module-wrapper'>
                    <div className="MCP-panel-container">
                        <ModuleHeader
                            heading={<p className="secondaryHeading">{t('orgManagement.role.headingPermissionDetails')}</p>}
                            controls={<p><Required /> {t('orgManagement.create_org.required')}</p>}
                        />

                        <div>
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
                                    label={t('orgManagement.role.labelRoleDescription')}
                                    placeholder=" "
                                    isRequired
                                    maxCharHelperText={t('orgManagement.role.labelMaxChar1000')}
                                    component={Components['textarea']}
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
    );
}

export default RoleDetailsForm;
