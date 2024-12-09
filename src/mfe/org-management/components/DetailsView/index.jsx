import React from 'react';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import './styles.scss';
import usePermission from '@src/hooks/usePermissions';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';

const DetailsView = ({ data, onEditClick }) => {
  const { t } = useTranslate();
  const { hasPermission } = usePermission();

  return (
    <div className="view-container">
      <div className="org-box">
        <div className="org-logo-box">
          {data?.logoUrl && <img src={data?.logoUrl} alt="Logo" className="logo-img" />}
          <h2 className="org-label">{data.name}</h2>
        </div>
        {hasPermission(PERMISSIONS_ENUM.ORGANIZATION_MANAGEMENT.EDIT_ORGANIZATION) && (
          <Button Icon={EditPencil} variant="secondary" onClick={onEditClick} size="md">
            Edit
          </Button>
        )}
      </div>

      <h2 className="contact-label">{t('orgManagement.org_detail.contact')}</h2>

      <div className="view-container grid grid-gap-24 grid-cols-1 md:grid-cols-4">
        <div>
          <p className="contact-heading">{t('orgManagement.org_detail.person_name')}</p>
          <p className="contact-details">{`${data.contactPerson.firstName || ''} ${data.contactPerson.middleName || ''} ${data.contactPerson.lastName || ''}`.trim() || 'N/A'}</p>
        </div>
        <div>
          <p className="contact-heading">{t('orgManagement.create_org.inputLabel.email')}</p>
          <p className="contact-details">{data.contact.email || 'N/A'}</p>
        </div>
        <div>
          <p className="contact-heading">{t('orgManagement.create_org.inputLabel.phone_no')}</p>
          <p className="contact-details">{data?.contact.phone ? CommonUtils.formatPhoneNumber(data.contact.phone) : 'N/A'}</p>
        </div>
        <div>
          <p className="contact-heading">{t('orgManagement.create_org.inputLabel.fax')}</p>
          <p className="contact-details">{data.contact.fax || 'N/A'}</p>
        </div>
        <div>
          <p className="contact-heading">{t('orgManagement.org_detail.address')}</p>
          <p className="contact-details">{[data.address.address1, data.address.address2, data.address.city, data.address.state, data.address.zip].filter(Boolean).join(', ') || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailsView;
