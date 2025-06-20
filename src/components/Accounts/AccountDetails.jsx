import React from 'react';
import FloatingDrawer from '@src/components/floating-drawer';
import { Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { getAddress } from '@src/mfe/core-config/system-admin/manage-questionnaire/util';

export const AccountDetailsConstants = [
  {
    sectionHeading: 'Details',
    sectionData: [
      { label: 'accountNumber', value: 'accountNumber' },
      { label: 'accountName', value: 'accountName' },
      { label: 'salesOrg', value: 'salesOrg' },
      { label: 'address', value: 'address' },
      { label: 'CGATIdentifier', value: 'cgatIdentifier' }
    ]
  }
];

function AccountDetails({ openDetails, setOpenDetails, selectedDetails }) {
  const { t } = useTranslate();

  const account = selectedDetails || {};

  return (
    <FloatingDrawer open={openDetails} anchor="right" onClose={() => setOpenDetails(false)} heading={t('ManageAccount.accountDetails')}>
      <div className="details-main-wrapper">
        <div className="details-body">
          {AccountDetailsConstants.map((section) => (
            <React.Fragment key={section.sectionHeading}>
              <Heading as="h3">{t(`ManageCatalog.${section.sectionHeading}`)}</Heading>
              <div className="details-ul">
                {section.sectionData.map((field) => {
                  let value = account[field.value] ?? '-';
                  if (field.value === 'address') {
                    value = getAddress(account.address) || '-';
                  }
                  return (
                    <div key={field.label} className="details-li">
                      <div className="details-key">{t(`ManageAccount.${field.label}`)}</div>
                      <div className="details-value">{value}</div>
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </FloatingDrawer>
  );
}

export default AccountDetails;
