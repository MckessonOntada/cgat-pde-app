import React from 'react';
import FloatingDrawer from '@src/components/floating-drawer';
import { Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { getAddress } from '@src/mfe/core-config/system-admin/manage-questionnaire/util';
import { getFullName } from '@src/util/CommonUtils';

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

export const SpAccountDetailsConstants = [
  {
    sectionHeading: 'AccountDetails',
    sectionData: [
      { label: 'organization', value: 'organization' },
      { label: 'accountName', value: 'accountName' },
      { label: 'accountNumber', value: 'accountNumber' }
    ]
  },
  {
    sectionHeading: 'contactDetails',
    sectionData: [
      { label: 'contactPerson', value: 'name' },
      { label: 'emaild', value: 'address.email' },
      { label: 'phoneNumber', value: 'address.telephone' },
      { label: 'fax', value: 'address.fax' }
    ]
  }
];

function AccountDetails({ openDetails, setOpenDetails, selectedDetails }) {
  const { t } = useTranslate();
  const organization = sessionStorage.getItem('selectedOrganization');
  const account = selectedDetails || {};
  const isSPAccount = selectedDetails?.channelType === 'SPECIALITY_PHARMA';

  return (
    <FloatingDrawer
      open={openDetails}
      anchor="right"
      onClose={() => setOpenDetails(false)}
      heading={t(`${isSPAccount ? 'manageSPAccount.heading.spAccountDetails' : 'ManageAccount.accountDetails'}`)}>
      <div className="details-main-wrapper">
        <div className="details-body">
          {(isSPAccount ? SpAccountDetailsConstants : AccountDetailsConstants).map((section) => (
            <React.Fragment key={section.sectionHeading}>
              <div className="details-ul">
                <div className="styled-heading">
                  <Heading as="h4">{t(`ManageCatalog.${section.sectionHeading}`)}</Heading>
                </div>
                {section.sectionData.map((field) => {
                  let value = account[field.value] ?? '-';
                  if (field.value.startsWith('address')) {
                    value = isSPAccount ? account.address[field.value.split('.')[1]] || '-' : getAddress(account.address) || '-';
                  }
                  if (field.value === 'organization') {
                    value = JSON.parse(organization).name || '-';
                  }
                  if (field.value === 'name') {
                    value = getFullName(account.name || '-');
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
