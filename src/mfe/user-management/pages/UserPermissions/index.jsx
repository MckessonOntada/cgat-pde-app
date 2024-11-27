import React, { useState} from 'react'
import { Stepper, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import ModuleHeader from '@src/components/module-header';
import * as Yup from 'yup';
import './index.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PATHS } from '../../routes/constants';
import { Form, Formik } from 'formik';
import PermissionForm from './PermissionForm';
import { useMutation } from "react-query";
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';

const UserPermissions = () => {
    const { t } = useTranslate();
    const navigate = useNavigate();    
    const { userId } = useParams();
    const location = useLocation();
    const { isEdit,permissionsData } = location.state || {};
    const [enabledPermissions, setEnabledPermissions] = useState(permissionsData?.permissions || []);
    const [selectedValue, setSelectedValue] = useState(permissionsData?.role?.id || '');
    
    const requestParams = {
        userType: AuthUtils.isSystemAdminView() ? 'ADMIN' : 'GENERAL'
    };

    const handleRoleSelect = (value) => {
        setSelectedValue(value); 
    };

    const { mutate, isLoading: isSavingUserPermission, isError: isSaveUserPermissionError, data: saveUserPermissionResponse } = useMutation(async ({ payload }) => {
        const res = await HttpResourceService.callRest(
            `${ApiRoutes.USERS()}/${userId}/roles-permissions?${serializeParams(requestParams)}`,
            httpVerb.PATCH,
            payload
        );
        return res.data;
    });


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
        const payload = {
            roleId: selectedValue,
            permissions: Object.values(selectedPermissions).flat() // Add permissions to role.permissions

        };

        console.log('payload: ', JSON.stringify(payload, null, 2));

        mutate(
            {
                payload
            },
            {
                onSuccess: (response) => {
                    console.log('User created/updated successfully:', response);
                    navigate(isEdit ? -1 : `../${PATHS.addAccounts}/${userId}`);
                },
                onError: (error) => {
                    console.log('Failed to create/update user:', error);
                    // alert('An error occurred. Please try again.');
                },
            }
        );
    };
    const validationSchema = Yup.object({
        role: Yup.number()
            .required(t('userManagement.create_user.validation.state_required')),
    });
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
                validationSchema={validationSchema}
                onSubmit={(values, actions) => {
                    handleSaveAndContinue(values);
                }}
                validateOnChange={false}
                validateOnBlur={true}>
                {({ values }) => (
                    <Form>
                        <PermissionForm enabledPermissions={enabledPermissions} setEnabledPermissions={setEnabledPermissions} handleRoleSelect={handleRoleSelect}  editRoleId={selectedValue} />

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