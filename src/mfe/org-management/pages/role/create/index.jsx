import React from 'react';
import { Stepper } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useNavigate } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import RoleDetailsForm from './form-segments/details-form';
import PermissionListForm from './form-segments/permissons-list';
import PageHeader from '../../../../../components/pageHeader';
import { useTranslate } from '@src/translations/useTranslation';

const RoleCreate = () => {
    const { t } = useTranslate();
    const forms = [
        {
            name: 'roleDetails',
            label: t('orgManagement.role.labelRolesDetails'),
            form: <RoleDetailsForm />
        },
        {
            name: 'addPermissions',
            label: t('orgManagement.role.labelAddPermissions'),
            form: <PermissionListForm />
        },
    ];
    const navigate = useNavigate();
    const [activeForm, setActiveForm] = React.useState(1);

    const FormToRender = forms[activeForm]?.form;
    const handleOnBackButtonClick = () => {
        navigate('../')
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

            <ModuleHeader heading={<PageHeader heading={t('orgManagement.role.labelAddRole')}/>} />

            <div className='MCP-module-body'>
                <Stepper
                    activeIndex={activeForm}
                    dividerText="of"
                    mobileLabel={t('orgManagement.role.labelStep')}
                    stepHeaders={forms.map(f => ({ label: f.label }))}
                />
                <div>{FormToRender}</div>
            </div>
        </div>
    )
}

export default RoleCreate;