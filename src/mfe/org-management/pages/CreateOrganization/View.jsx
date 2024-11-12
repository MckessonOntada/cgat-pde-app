import React from 'react';
import Upload from '@src/assets/image/upload.svg';
import { Button } from '@mckesson/mcp-component-library';
import './CreateOrg.scss';

const View = ({ data, onEditClick}) => {
  return (
    <div className="view-container">
      <div className="org-box">
        <div className="org-logo-box">
          <img src={Upload} alt="Upload Icon" />
          <h2>{data.org_name }</h2>
        </div>
        <Button onClick={onEditClick}>Edit</Button>
        </div>
        <h2>Contact</h2>
      <div style={{ display: 'flex' }}>
        <div>
          <p>Contact Person Name</p>
          <p>{`${data.first_name} ${data.middle_name} ${data.last_name}`.trim() || 'N/A'}</p>
        </div>
        <div>
          <p>Email Id</p>
          <p>{data.email || 'N/A'}</p>
        </div>
        <div>
          <p>Phone no</p>
          <p>{data.phoneInput || 'N/A'}</p>
        </div>
        <div>
          <p>Fax</p>
          <p>{data.fax || 'N/A'}</p>
        </div>
      </div>

      <div>
        <p>Organization Address</p>
        <p>{`${data.address_1}, ${data.address_2}` || 'N/A'}</p>
      </div>
    </div>
  );
};

export default View;
