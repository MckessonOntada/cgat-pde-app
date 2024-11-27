import React from 'react';
import PrimaryHeader from './PrimaryHeader';
import SecondaryHeader from './SecondaryHeader';
import HeaderConfig from './__mock__';
import { debugIds, ID } from '../../constants/id';
import { OrganizationProvider } from '../../mfe/org-management/context/OrgContext';

const GlobalHeader = () => {
  return (
    <header id={debugIds(ID.HEADER, ID.CONTAINER)}>
      <OrganizationProvider>
        <PrimaryHeader />
      </OrganizationProvider>
      <SecondaryHeader navLinks={HeaderConfig.navLinks} />
    </header>
  );
};

export default GlobalHeader;
