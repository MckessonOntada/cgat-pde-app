import React from 'react';
import PrimaryHeader from './PrimaryHeader';
import SecondaryHeader from './SecondaryHeader';
import { debugIds, ID } from '../../constants/id';

const GlobalHeader = ({ onNotificationClick }) => {
  return (
    <header id={debugIds(ID.HEADER, ID.CONTAINER)}>
      <PrimaryHeader onNotificationClick={onNotificationClick} />
      <SecondaryHeader />
    </header>
  );
};

export default GlobalHeader;
