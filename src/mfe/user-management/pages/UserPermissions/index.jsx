import React, { useState } from 'react'
import { Stepper, SearchableDropdown, Switch, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import ModuleHeader from '@src/components/module-header';
import './index.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { USER_DATA } from '../../mockData/UsersData';
import { PATHS } from '../../routes/constants';
import { Form, Formik } from 'formik';
import PermissionForm from './PermissionForm';

const UserPermissions = () => {
    const { t } = useTranslate();
    const navigate = useNavigate();
    const [enabledPermissions, setEnabledPermissions] = useState([]);

    const { userId } = useParams();
    const location = useLocation();
    const { isEdit } = location.state || {};
    // Fetch user data based on userId 
    const userData = userId ? USER_DATA.find(user => user.id === parseInt(userId)) : {};

    const handleGoBack = () => {
        navigate(-1);
    };



    const handleSaveAndContinue = () => {
        const selectedPermissions = {};
        Object.keys(enabledPermissions).forEach(category => {
            if (enabledPermissions[category]?.length > 0) {
                selectedPermissions[category] = enabledPermissions[category];
            }
        });
        const updatedUserData = {
            ...userData, // To Spread existing user data
            permissions: selectedPermissions, // Update the top-level permissions
            role: {
                ...userData.role, // To Spread existing role data
                permissions: selectedPermissions // Add permissions to role.permissions
            }
        };

        console.log('updatedUserData: ', JSON.stringify(updatedUserData, null, 2));
        alert(JSON.stringify(updatedUserData, null, 2));
        if (userId) {
            navigate(isEdit ? -1 : `../${PATHS.addAccounts}/${userId}`);
        } else {
            navigate(isEdit ? -1 : `../${PATHS.addAccounts}/7`); // Need to Replace `7` with appropriate User id when Creating a user
        }
    }; 
    return (
        <div className="MCP-module-wrapper">
            <div
                className="back-navigation py2 capitalize"
                onClick={handleGoBack}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
                <MdOutlineKeyboardArrowLeft size="24px" />
                <p>Back to Manage Users</p>
            </div>
            <ModuleHeader
                heading={<p className='primaryHeading'>{t('userManagement.create_user')}</p>}
            />
            <div className="stepper">
                <Stepper
                    activeIndex={2}
                    dividerText="of"
                    stepHeaders={[
                        {
                            label: t('userManagement.stepper.option.user_details'),
                        },
                        {
                            label: t('userManagement.stepper.option.roles_and_permissions'),
                        },
                        {
                            label: t('userManagement.stepper.option.associate_accounts'),
                        },
                    ]}
                />
            </div>
            <Formik
                initialValues={{}}
                onSubmit={(values, actions) => {
                }}
                validateOnChange={false}
                validateOnBlur={true}>
                {({ values }) => (
                    <Form>
                        <PermissionForm enabledPermissions={enabledPermissions} setEnabledPermissions={setEnabledPermissions} />

                        <div className={'buttonGroup'}>
                            <Button variant="secondary" type="button" onClick={handleGoBack} size={'md'}>
                                {t('userManagement.button.back')}
                            </Button>
                            <Button variant="primary" type="button" onClick={handleSaveAndContinue} size={'md'}>{t('userManagement.button.savencontinue')}</Button>
                        </div>
                    </Form>
                )}</Formik>

        </div>

    )
}

export default UserPermissions;