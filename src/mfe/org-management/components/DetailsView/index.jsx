import React from 'react';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as edit_pencil } from '@src/assets/image/edit_pencil.svg';
import { useTranslate } from '@src/translations/useTranslation';
import './styles.scss';

const DetailsView = ({ data, onEditClick }) => {
  const { t } = useTranslate();

  const fileUrl = data.file ? URL.createObjectURL(data.file) : null;

  return (
    <div className="view-container">
      <div className="org-box">
        <div className="org-logo-box">
          {fileUrl ? (
            <img src={fileUrl} alt="Organization Logo" className="logo-img" />
          ) : (
            <p>No logo uploaded</p>
          )}
          <h2 className="org-label">{data.org_name}</h2>
        </div>
        <Button Icon={edit_pencil} variant="tertiary" onClick={onEditClick} size={'md'}>
          Edit
        </Button>
      </div>
      <h2 className="contact-label">{t('orgManagement.org_detail.contact')}</h2>
      <div className="grid grid-gap-24 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <div>
          <p className="contact-heading">{t('orgManagement.org_detail.person_name')}</p>
          <p className="contact-details">
            {`${data.first_name} ${data.middle_name} ${data.last_name}`.trim() || 'N/A'}
          </p>
        </div>
        <div>
          <p className="contact-heading">{t('orgManagement.create_org.inputLabel.email')}</p>
          <p className="contact-details">{data.email || 'N/A'}</p>
        </div>
        <div>
          <p className="contact-heading">{t('orgManagement.create_org.inputLabel.phone_no')}</p>
          <p className="contact-details">{data.phoneInput || 'N/A'}</p>
        </div>
        <div>
          <p className="contact-heading">{t('orgManagement.create_org.inputLabel.fax')}</p>
          <p className="contact-details">{data.fax || 'N/A'}</p>
        </div>
      </div>

      <div>
        <p className="contact-heading">{t('orgManagement.org_detail.address')}</p>
        <p className="contact-details">{`${data.address_1}, ${data.address_2}` || 'N/A'}</p>
      </div>
    </div>
  );
};

export default DetailsView;
