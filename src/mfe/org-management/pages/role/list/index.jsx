import React from 'react';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle.svg';
import ModuleHeader from "@src/components/module-header";
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import FilterPanel from './FilterPanel';
import { RoleProvider } from '../../../context/RoleContext';
import RolesDataTable from './RolesDataTable';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';

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
    const handleOnAddRoleClick = () => {
        navigate('create-role');
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
                        <RoleProvider>
                            <RolesDataTable />
                        </RoleProvider>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RolesList;