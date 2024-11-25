import React from 'react';
import { Button, Alert } from '@mckesson/mcp-component-library';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle.svg';
import ModuleHeader from "@src/components/module-header";
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import FilterPanel from './FilterPanel';
import { useRole } from '../../../context/RoleContext';
import RolesDataTable from './RolesDataTable';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { PATHS } from '../../../routes/constants';

const breadcrumbItems = [
    {
        label: 'Admin',
        url: '/'
    },
    {
        label: 'Manage Roles'
    }
];

function RolesList() {
    const { t } = useTranslate();
    const navigate = useNavigate();
    const { moduleMessage, clearModuleMessage } = useRole();

    const handleOnAddRoleClick = () => {
        navigate(PATHS.createRole);
    }

    return (
        <div className="MCP-module-wrapper">
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} />

            {/* module header */}
            <ModuleHeader
                heading={<p className="primaryHeading">{t('orgManagement.role.headingManageOrder')}</p>}
                controls={
                    <Button Icon={AddCircleFilled} size="md" onClick={handleOnAddRoleClick} >
                        {t('orgManagement.role.labelAddRole')}
                    </Button>
                }
            />

            {
                moduleMessage &&
                <Alert
                    onClose={clearModuleMessage}
                    showTitle
                    title={moduleMessage.text}
                    type={moduleMessage.kind}
                />
            }

            {/* module body */}
            <div className='MCP-module-body'>
                <div className="MCP-panel-container">
                    <div className='MCP-CardContainer'>
                        <FilterPanel />
                    </div>
                    <div className='MCP-table-wrapper'>
                        <ModuleHeader
                            heading={<p className='secondaryHeading'>{t('orgManagement.role.labelRolesListing')}</p>}
                        />
                            <RolesDataTable />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RolesList;