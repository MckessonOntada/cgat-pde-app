import React from 'react';
import { Stepper } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useNavigate } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import RoleDetailsForm from './form-segments/details-form';
import PermissionListForm from './form-segments/permissons-list';
import PageHeader from '@src/components/pageHeader';
import { useTranslate } from '@src/translations/useTranslation';
import AssociateAccountForm from './form-segments/associate-accounts';

const RoleCreate = () => {
    const { t } = useTranslate();
    const navigate = useNavigate();

    const [formData, setFormData] = React.useState({
        roleName: '',
        roleDescription: '',
        permissionList: [],
    });

    const [activeForm, setActiveForm] = React.useState(0);

    const handleOnSavePermissionDetails = ({ roleName, roleDescription }) => {
        setFormData({
            ...formData,
            roleName,
            roleDescription,
        });
        setActiveForm(1);
    };

    const handleOnSavePermissionList = (permissionList) => {
        setFormData({
            ...formData,
            permissionList,
        });
    };

    const handleOnAssociateAccount = () => {
        
    }

    const handleOnBackButtonClick = () => {
        navigate('/organization/manage-roles');
    };

    const forms = React.useMemo(() => [
        {
            name: 'roleDetails',
            label: t('orgManagement.role.labelRolesDetails'),
            form: <RoleDetailsForm onSubmit={handleOnSavePermissionDetails} />,
        },
        {
            name: 'addPermissions',
            label: t('orgManagement.role.labelAddPermissions'),
            form: <PermissionListForm onSubmit={handleOnSavePermissionList} />,
        },
        {
            name: 'associateAccount',
            label: t('orgManagement.label.associateAccount'),
            form: <AssociateAccountForm onSubmit={handleOnAssociateAccount} />,
        },
    ], [t]);

    const FormToRender = forms[activeForm]?.form || (
        <div>{t('common.messages.noFormAvailable')}</div>
    );

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
                    activeIndex={activeForm}
                    dividerText="of"
                    mobileLabel={t('orgManagement.role.labelStep')}
                    stepHeaders={forms.map((f) => ({ label: f.label }))}
                />
                <div>{FormToRender}</div>
            </div>
        </div>
    );
};

export default RoleCreate;