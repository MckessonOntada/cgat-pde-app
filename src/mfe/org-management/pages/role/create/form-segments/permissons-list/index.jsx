
import { Formik, Form } from 'formik';
import React from 'react';
import { Button } from '@mckesson/mcp-component-library';
import PermissionForm from '@src/mfe/user-management/pages/UserPermissions/PermissionForm';
import { useTranslate } from '@src/translations/useTranslation';

const PermissionListForm = () => {
    const { t } = useTranslate();
    const [enabledPermissions, setEnabledPermissions] = React.useState([]);
    const handleGoBack = () => { }
    const handleSaveAndContinue = () => { }
    return (
        <div>
            <Formik
                initialValues={{}}
                onSubmit={(values, actions) => {
                    alert(JSON.stringify(values));
                }}
                validateOnChange={false}
                validateOnBlur={true}

            >
                {({ values }) => (
                    <Form>
                        <PermissionForm enabledPermissions={enabledPermissions} setEnabledPermissions={setEnabledPermissions} />

                        <div className={'buttonGroup'}>
                            <Button variant="secondary" type="button" onClick={handleGoBack} size={'md'}>
                                {t('orgManagement.button.back')}
                            </Button>
                            <Button variant="primary" type="submit" size={'md'}>{t('orgManagement.role.captionsBtnSaveAndCancel')}</Button>
                        </div>
                    </Form>
                )}</Formik>
        </div>
    )
}

export default PermissionListForm;