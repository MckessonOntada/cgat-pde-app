import React from 'react';
import ModuleHeader from '@src/components/module-header';
import { Required, Button } from '@mckesson/mcp-component-library';
import Components from '@src/components/form/Components';
import { Field, Formik, Form } from 'formik';
import { useTranslate } from '@src/translations/useTranslation';

const RoleDetailsForm = () => {
    const { t } = useTranslate();
    return (
        <div className='MCP-module-wrapper'>
            <div className="MCP-panel-container">
                <ModuleHeader
                    heading={<p className="secondaryHeading">{t('orgManagement.role.headingPermissionDetails')}</p>}
                    controls={
                        <p>
                            <Required /> {t('orgManagement.create_org.required')}
                        </p>
                    }
                >

                </ModuleHeader>

                <div>
                    <Formik
                        initialValues={{}}
                        onSubmit={(values, actions) => {
                        }}
                        validateOnChange={false}
                        validateOnBlur={true}>
                        {({ values }) => (
                            <Form>
                                <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                                    <Field
                                        name="name"
                                        label={t('orgManagement.role.labelRoleName')}
                                        placeholder=" "
                                        isRequired
                                        component={Components['input']}
                                    />
                                </div>
                                <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
                                    <Field
                                        name="description"
                                        label={t('orgManagement.role.labelRoleDescription')}
                                        placeholder=" "
                                        isRequired
                                        maxCharHelperText={t('orgManagement.role.labelMaxChar1000')}
                                        component={Components['textarea']}
                                    />
                                </div>
                            </Form>)}
                    </Formik>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
                <Button size="md" variant="secondary">{t('orgManagement.button.cancel')}</Button>
                <Button size="md" variant="primary">{t('orgManagement.role.captionsBtnSaveAndCancel')}</Button>
            </div>
        </div>
    )
}

export default RoleDetailsForm;