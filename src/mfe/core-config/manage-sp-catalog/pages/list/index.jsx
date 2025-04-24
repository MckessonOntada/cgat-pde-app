import ModuleHeader from '@src/components/module-header';
import React from 'react';
import { Button, Heading, Alert } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';

import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import AuthUtils from '@src/util/AuthUtils';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { useNavigate } from 'react-router-dom';

import MultiSelectDropdown from '@src/components/form/MultiSelectDropdown';
import SPCatalogService from '@src/api/commonService/SPCatalogService';
import CatalogList from './CatalogList';
import { TableProvider } from '@src/mfe/core-config/manage-providers/context/TableContext';

const List = () => {
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { items, add, remove } = useTimedArray(10000);

  const breadcrumbItems = React.useMemo(() => {
    return [
      {
        label: t('breadcrumb.systemAdmin'),
        url: '/admin'
      },
      {
        label: t('breadcrumb.systemConfiguration'),
        url: '/admin/system-configuration'
      },
      {
        label: t('label.manageSpCatalog')
      }
    ];
  }, [isSystemAdminView]);

  const [organizationList, setOrganizationList] = React.useState([]);
  const [organizationQuery, setOrganizationQuery] = React.useState('');
  const [accountList, setAccountList] = React.useState([]);
  const [accountQuery, setAccountQuery] = React.useState('');
  const [selectedOrganizations, setSelectedOrganization] = React.useState([]);
  const [selectedAccounts, setSelectedAccount] = React.useState([]);

  React.useEffect(() => {
    const payload = {
      query: organizationQuery
    };
    SPCatalogService.getOrganizations(payload).then((response) => {
      debugger;

      setOrganizationList([
        ...selectedOrganizations,
        ...response.content.filter(
          (item) => !selectedOrganizations.some((org) => org.id === item.id)
        )
      ]);
    });
  }, [organizationQuery]);

  React.useEffect(() => {
    const practiceIds = selectedOrganizations.map((item) => item.value);
    if (!practiceIds || practiceIds.length === 0) return;
    const payload = {
      query: accountQuery,
      partnerFunction: 'SOLD_TO',
      practiceIdList: practiceIds
    };
    SPCatalogService.getAccountList(payload).then((response) => {
      const accounts = response.content.map((item) => ({
        value: item.id,
        label: item.accountName
      }));
      setAccountList([
        ...selectedAccounts,
        ...accounts.filter(
          (item) => !selectedAccounts.some((acc) => acc.value === item.value)
        )
      ]);
    });
  }, [accountQuery]);

  const handleOnOrganizationSelectionChange = (changedOrgList) => {
    const selectedOrganizations = changedOrgList.filter(
      (item) => item.isChecked
    );

    setSelectedOrganization(selectedOrganizations);
    const practiceIds = selectedOrganizations.map((item) => item.value);

    if (practiceIds.length > 0) {
      const payload = {
        query: accountQuery,
        partnerFunction: 'SOLD_TO',
        practiceIdList: practiceIds
      };
      SPCatalogService.getAccountList(payload).then((response) => {
        const accounts = response.content.map((item) => ({
          value: item.id,
          label: item.accountName,
          isChecked: false
        }));
        setAccountList(accounts);
      });
    } else {
      setAccountList([...selectedAccounts]);
    }
  };

  const handleOnAccountSelectionChange = (changedAccounts) => {
    const selectedAccounts = changedAccounts.filter((item) => item.isChecked);
    setSelectedAccount(selectedAccounts);
  };

  const defaultFilters = React.useMemo(() => {
    return {
      search: '',
      status: '',
      sortBy: 'sap_material',
      channelType: 'SPECIALITY_PHARMA',
      accountNumbers: selectedAccounts.map((item) => item.value)
    };
  }, [selectedAccounts]);

  return (
    <div className="MCP-module-wrapper">
      <Breadcrumbs items={breadcrumbItems} />
      <ModuleHeader
        heading={<Heading as="h1">{t('label.manageSpCatalog')}</Heading>}
      />
      {items && items.length > 0 && (
        <div className="MCP-module-body">
          {items.map((item, index) => {
            return (
              <Alert
                key={item.id}
                description={item.description}
                onClose={() => remove(item.id)}
                type={item.type}
              />
            );
          })}
        </div>
      )}

      <div className="MCP-CardContainer">
        <div className="MCP-CardContainer">
          <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-2">
            <div className="org-select">
              <MultiSelectDropdown
                id={'organization-list'}
                label={t('ManageCatalog.SelectOrganization')}
                isMultiSelect={true}
                placeholder={t('ManageCatalog.SelectOrganization')}
                onChange={handleOnOrganizationSelectionChange}
                options={organizationList}
                variant={'async'}
                onSearch={setOrganizationQuery}
                recordsCountToEnableSearch={2}
                size="md"
                isSortEnable={false}
                value={''}
              />
            </div>
            <div className="account-select">
              <MultiSelectDropdown
                id={'account-list'}
                label={t('ManageCatalog.SelectAccount')}
                isMultiSelect={true}
                placeholder={t('ManageCatalog.SelectAccount')}
                onChange={handleOnAccountSelectionChange}
                options={accountList}
                variant={'async'}
                onSearch={setAccountQuery}
                recordsCountToEnableSearch={5}
                size="md"
              />
            </div>
          </div>
        </div>

        <TableProvider
          key={selectedAccounts.join('-') || 1}
          defaultFilters={defaultFilters}
          allowedSort={[
            'sap_material',
            'material_description_in_language_en',
            'sold_to_customer'
          ]}
          fetchFn={
            selectedAccounts?.length > 0 ? SPCatalogService.getAllCatalog : null
          }>
          <CatalogList />
        </TableProvider>
      </div>
    </div>
  );
};

export default List;
