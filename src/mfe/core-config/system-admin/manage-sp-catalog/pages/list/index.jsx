import ModuleHeader from '@src/components/module-header';
import React, { useEffect, useState } from 'react';
import { Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import AuthUtils from '@src/util/AuthUtils';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { useLocation, useNavigate } from 'react-router-dom';
import SPCatalogService from '@src/api/commonService/SPCatalogService';
import CatalogList from './CatalogList';
import { TableProvider } from '@src/context/TableContext';
import OrgAccountsMultiSelect from '../orgAccountMultiSelect';
import { useOrgAccountsMultiSelectionContext } from '../context/OrgAccountMultiSelectContext';
import Alert from '@src/components/cgat-alert/Alert';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';

const List = () => {
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState(null);
  const { selectedAccount = [], selectedOrganization = [] } = useOrgAccountsMultiSelectionContext();

  const breadcrumbItems = React.useMemo(() => {
    return [
      {
        label: t('breadcrumb.systemAdmin'),
        url: '/admin'
      },
      {
        label: t('breadcrumb.systemConfiguration'),
        url: '/system-admin/config'
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
        setNotification({ ...item });
      });
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, setNotification]);

  const buildFilters = (selectedAccount = [], selectedOrganization = []) => {
    let _practiceId;
    let _accNumber;

    if (selectedOrganization && selectedOrganization.length > 0) {
      _practiceId = selectedOrganization.filter((org) => org.isChecked).map((org) => org.value);
    }
    if (selectedAccount && selectedAccount.length > 0) {
      _accNumber = selectedAccount?.filter((i) => i.isChecked).map((i) => i.accountNumber);
    }

    return {
      search: '',
      status: '',
      sortBy: 'sap_material',
      channelType: CHANNEL_TYPE.SPECIALTY_PHARMA,
      ...(_practiceId && { practiceIdList: _practiceId }),
      ...(_accNumber && _accNumber.length > 0 && { accountNumbers: _accNumber })
    };
  };

  const defaultFilters = React.useMemo(() => {
    return buildFilters(selectedAccount, selectedOrganization);
  }, [selectedAccount, selectedOrganization?.length > 0]);

  const handleNotification = (notification) => {
    setNotification(notification);
  };

  return (
    <div className="MCP-module-wrapper">
      <Breadcrumbs items={breadcrumbItems} />
      <ModuleHeader heading={<Heading as="h1">{t('label.manageSpCatalog')}</Heading>} />
      {notification && <Alert description={notification.description} onClose={() => setNotification(null)} type={notification.type} />}

      <div className="MCP-CardContainer">
        <OrgAccountsMultiSelect />
        <TableProvider
          key={JSON.stringify(defaultFilters)}
          defaultFilters={defaultFilters}
          allowedSort={['sap_material', 'material_description_in_language_en', 'sold_to_customer']}
          fetchFn={SPCatalogService.getAllCatalog}>
          <CatalogList selectedAccount={selectedAccount} selectedOrganization={selectedOrganization} sendNotification={handleNotification} />
        </TableProvider>
      </div>
    </div>
  );
};

export default List;
