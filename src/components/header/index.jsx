import React from 'react';
import PrimaryHeader from './PrimaryHeader';
import SecondaryHeader from './SecondaryHeader';
import { debugIds, ID } from '../../constants/id';
import HeaderConfig from './constants';

const GlobalHeader = () => {
  return (
    <header id={debugIds(ID.HEADER, ID.CONTAINER)}>
      <PrimaryHeader />
      <SecondaryHeader navLinks={HeaderConfig.navLinks} />
    </header>
  );
};

export default GlobalHeader;
