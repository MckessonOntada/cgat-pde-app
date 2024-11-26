import React from 'react';
import * as Yup from "yup";
import { Stepper, Button } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import PageHeader from '@src/components/pageHeader';
import { useTranslate } from '@src/translations/useTranslation';
import { Field, Formik, Form } from 'formik';
import { useMutation } from 'react-query';
import PermissionForm from '../../../../user-management/pages/UserPermissions/PermissionForm';
import HttpResourceService, { httpVerb } from '../../../../../api/HttpResourceService';
import ApiRoutes from '../../../../../api/ApiRoutes';
import { PATHS } from '../../../routes/constants';
import { useRole } from '../../../context/RoleContext';


const RolePermissions = () => {
    const { t } = useTranslate();
    const navigate = useNavigate();
    const {roleId} = useParams();
    const location = useLocation();
    const permissions = location.state?.permissions || null;
    const { showModuleMessage } = useRole();
    
    const [enabledPermissions, setEnabledPermissions] = React.useState(permissions || []);
    const [inheritedRole, setInheritedRole] = React.useState(null);
    const { refreshData } = useRole();

    const handleOnBackButtonClick = () => {
        navigate(`/organization/${PATHS.roles}`);
    };

    const mutation = useMutation(
        (data) => {
            HttpResourceService.callRest(
                `${ApiRoutes.GET_ROLE_PERMISSIONS(roleId)}`,
                httpVerb.PATCH,
                data
            );
        }, 
        {
            onSuccess: (data) => {
                if(permissions){
                    showModuleMessage({
                        text: t('orgManagement.messages.roleUpdate'),
                        kind: 'success'
                    }, 10000);
                }else{
                    showModuleMessage({
                        text: t('orgManagement.messages.newRoleCreation'),
                        kind: 'success'
                    }, 10000);
                }
                refreshData();
                navigate(`/organization/${PATHS.roles}`);
            },
            onError: (error) => {
                console.error('Error posting data:', error);
            },
        }
    );

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

    const handleGoBack = () => {
        navigate(`../${roleId}/edit-role`);
    }
    const handleSaveAndContinue = (values) => { 
        const permissions = Object.values(enabledPermissions).flat();
        mutation.mutate(permissions);
    }

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
                    activeIndex={2}
                    dividerText="of"
                    mobileLabel={t('orgManagement.role.labelStep')}
                    stepHeaders={forms.map((f) => ({ label: f.label }))}
                />
                <div>
                <Formik
                initialValues={{}}
                onSubmit={(values, actions) => {
                    handleSaveAndContinue(values);
                }}
                validateOnChange={false}
                validateOnBlur={true}

            >
                {({ values }) => (
                    <Form>
                        <PermissionForm 
                            enabledPermissions={enabledPermissions} 
                            setEnabledPermissions={setEnabledPermissions} 
                            onRoleChange={setInheritedRole}
                            handleRoleSelect={() => {}}
                        />

                        <div className={'buttonGroup'}>
                            <Button variant="secondary" type="button" onClick={handleGoBack} size={'md'}>
                                {t('orgManagement.button.back')}
                            </Button>
                            <Button variant="primary" type="submit" size={'md'}>{t('orgManagement.role.captionsBtnSaveAndCancel')}</Button>
                        </div>
                    </Form>
                )}</Formik>
                </div>
            </div>
        </div>
    );
};

export default RolePermissions;