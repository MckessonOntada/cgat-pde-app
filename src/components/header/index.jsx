import React from 'react';
import { debugIds, ID } from '../../constants/id';
import PrimaryHeader from './PrimaryHeader';
import SecondaryHeader from './SecondaryHeader';

const GlobalHeader = ({ onNotificationClick }) => {
  return (
    <header id={debugIds(ID.HEADER, ID.CONTAINER)}>
      <PrimaryHeader onNotificationClick={onNotificationClick} />
      <SecondaryHeader />
    </header>
  );
};

export default GlobalHeader;
