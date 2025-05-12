import ModuleHeader from '@src/components/module-header';
import React, { useEffect } from 'react';
import { Button, Heading, Alert } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';

import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import AuthUtils from '@src/util/AuthUtils';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { useLocation, useNavigate } from 'react-router-dom';

import SPCatalogService from '@src/api/commonService/SPCatalogService';
import CatalogList from './CatalogList';
import { TableProvider } from '@src/mfe/core-config/manage-providers/context/TableContext';

import OrgAccountsMultiSelect from '../orgAccountMultiSelect';
import { useOrgAccountsMultiSelectionContext } from '../context/OrgAccountMultiSelectContext';

const List = () => {
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const { items, add: addNotification, remove: removeNotification } = useTimedArray(10000);
  const { selectedAccount, selectedOrganization } = useOrgAccountsMultiSelectionContext();

  const breadcrumbItems = React.useMemo(() => {
    return [
      {
        label: t('breadcrumb.systemAdmin'),
        url: '/admin'
      },
      {
        label: t('breadcrumb.systemConfiguration'),
        url: '/orders/system-configuration'
      },
      {
        label: t('label.manageSpCatalog')
      }
    ];
  }, [isSystemAdminView]);

  useEffect(() => {
    const { state } = location;
    if (state?.items) {
      state.items.map((item) => {
        addNotification({ ...item });
      });
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, addNotification]);

  const _accNumber = selectedAccount?.filter((i) => i.isChecked).map((i) => i.accountNumber);

  const defaultFilters = React.useMemo(() => {
    return {
      search: '',
      status: '',
      sortBy: 'sap_material',
      channelType: 'SPECIALITY_PHARMA',
      accountNumbers: _accNumber
    };
  }, [_accNumber]);

  return (
    <div className="MCP-module-wrapper">
      <Breadcrumbs items={breadcrumbItems} />
      <ModuleHeader heading={<Heading as="h1">{t('label.manageSpCatalog')}</Heading>} />
      {items && items.length > 0 && (
        <div className="MCP-module-body">
          {items.map((item, index) => {
            return <Alert key={item.id} description={item.description} onClose={() => remove(item.id)} type={item.type} />;
          })}
        </div>
      )}

      <div className="MCP-CardContainer">
        <OrgAccountsMultiSelect />
        <TableProvider
          key={_accNumber}
          defaultFilters={defaultFilters}
          allowedSort={['sap_material', 'material_description_in_language_en', 'sold_to_customer']}
          fetchFn={_accNumber?.length > 0 ? SPCatalogService.getAllCatalog : null}>
          <CatalogList selectedAccount={selectedAccount} selectedOrganization={selectedOrganization} />
        </TableProvider>
      </div>
    </div>
  );
};

export default List;
