
import { Formik, Form } from 'formik';
import React from 'react';
import {Button} from '@mckesson/mcp-component-library';
import PermissionForm from '../../../../../../user-management/pages/UserPermissions/PermissionForm';

const PermissionListForm = () => {
    const [enabledPermissions, setEnabledPermissions] = React.useState([]);
    const handleGoBack = () => {}
    const handleSaveAndContinue = () => {}
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
                                {'Back'}
                            </Button>
                            <Button variant="primary" type="submit" size={'md'}>Save and Continue</Button>
                        </div>
                    </Form>
                )}</Formik>
        </div>
    )
}

export default PermissionListForm;