import React from 'react';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import { useTranslate } from '@src/translations/useTranslation';
import './styles.scss';

const DetailsView = ({ data, onEditClick }) => {
  const { t } = useTranslate();

  console.log(data);
  return (
    <div className="view-container">
      <div className="org-box">
        <div className="org-logo-box">
          <img src={data?.logoUrl} alt="Logo" className="logo-img" />
          <h2 className="org-label">{data.name}</h2>
        </div>
        <Button Icon={EditPencil} variant="tertiary" onClick={onEditClick} size="md">
          Edit
        </Button>
      </div>

      <h2 className="contact-label">{t('orgManagement.org_detail.contact')}</h2>
      <div className="grid grid-gap-24 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <div>
          <p className="contact-heading">{t('orgManagement.org_detail.person_name')}</p>
          <p className="contact-details">
            {`${data.contactPerson.firstName || ''} ${data.contactPerson.middleName || ''} ${
              data.contactPerson.lastName || ''
            }`.trim() || 'N/A'}
          </p>
        </div>
        <div>
          <p className="contact-heading">{t('orgManagement.create_org.inputLabel.email')}</p>
          <p className="contact-details">{data.contact.email || 'N/A'}</p>
        </div>
        <div>
          <p className="contact-heading">{t('orgManagement.create_org.inputLabel.phone_no')}</p>
          <p className="contact-details">{data.contact.phone || 'N/A'}</p>
        </div>
        <div>
          <p className="contact-heading">{t('orgManagement.create_org.inputLabel.fax')}</p>
          <p className="contact-details">{data.contact.fax || 'N/A'}</p>
        </div>
      </div>

      <div>
        <p className="contact-heading">{t('orgManagement.org_detail.address')}</p>
        <p className="contact-details">
          {[data.address.address1, data.address.address2].filter(Boolean).join(', ') || 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default DetailsView;
