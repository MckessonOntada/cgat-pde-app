import React from 'react';
import * as Yup from "yup";
import { Stepper, Button, Modal } from '@mckesson/mcp-component-library';
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

function arePermissionsEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();

    return sortedArr1.every((value, index) => value === sortedArr2[index]);
}

const RolePermissions = () => {
    const { t } = useTranslate();
    const navigate = useNavigate();
    const { roleId } = useParams();
    const location = useLocation();
    const row = location.state || null;
    const { showModuleMessage } = useRole();
    const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
    const [enabledPermissions, setEnabledPermissions] = React.useState(row?.permissions ? [...row.permissions] : []);
    const [inheritedRole, setInheritedRole] = React.useState(null);
    const { refreshData } = useRole();



    const handleOnCancelButtonClick = () => {
        if (!arePermissionsEqual(row.permissions, enabledPermissions)) {
            setModalSuccessCallback("list");
        }
        else
            navigate(`/organization/${PATHS.roles}`);
    };

    const mutation = useMutation(
        async (data) => {
            const res = await HttpResourceService.callRest(
                `${ApiRoutes.GET_ROLE_PERMISSIONS(roleId)}`,
                httpVerb.PATCH,
                data
            );

            return res;
        },
        {
            onSuccess: (res) => {
                const data = res?.data;
                if (data) {
                    if (row?.permissions) {
                        showModuleMessage({
                            text: t('orgManagement.messages.roleUpdate'),
                            kind: 'success'
                        }, 10000);
                    } else {
                        showModuleMessage({
                            text: t('orgManagement.messages.newRoleCreation'),
                            kind: 'success'
                        }, 10000);
                    }
                    refreshData();
                    navigate(`/organization/${PATHS.roles}`);
                }
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

        if (!arePermissionsEqual(row?.permissions, enabledPermissions)) {
            setModalSuccessCallback("back");
        }
        else
            navigate(`../${roleId}/edit-role`, { state: row });
    }

    const handleNavigate = () => {
        if (modalSuccessCallback === "back")
            navigate(`../${roleId}/edit-role`, { state: row });
        else if (modalSuccessCallback === "list") {
            navigate('/organization/roles');
        }
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
                    onClick={handleGoBack}
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
                                    handleRoleSelect={() => { }}
                                />

                                <div className={'buttonGroup'}>
                                    <Button variant="secondary" type="button" onClick={handleOnCancelButtonClick} size={'md'}>
                                        {t('orgManagement.button.cancel')}
                                    </Button>
                                    <Button variant="primary" type="submit" size={'md'}>{t('orgManagement.role.captionsBtnSaveAndCancel')}</Button>
                                </div>
                            </Form>
                        )}</Formik>
                </div>
            </div>
            <Modal {...{
                id: "discard-role-permissions-modal",
                isOpen: Boolean(modalSuccessCallback),
                onClose: () => setModalSuccessCallback(null),
                modalTitle: "Discard Changes?",
                modalBody: <div className='tertiaryHeading'>You have changed role permissions, still you want to return to go back? Your changes will be discarded!</div>,
                modalFooter: <div style={{ display: 'flex', gap: '16px' }} className='controls'>
                    <Button size="md" variant="secondary" onClick={() => setModalSuccessCallback(null)}>
                        Cancel
                    </Button>
                    <Button size="md" variant="primary" onClick={handleNavigate}>
                        Okay
                    </Button>
                </div>,
                modalSize: "md"
            }}
            />
        </div>
    );
};

export default RolePermissions;