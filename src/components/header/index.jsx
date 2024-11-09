import React from 'react';
import PrimaryHeader from "./PrimaryHeader"
import SecondaryHeader from './SecondaryHeader';
import  HeaderConfig from './__mock__';
import { debugIds, ID } from '@src/common/constants/id';

const GlobalHeader = () => {
    return (
        <header id={debugIds(ID.HEADER, ID.CONTAINER)}>
            <PrimaryHeader />
            <SecondaryHeader navLinks={HeaderConfig.navLinks} />
        </header>
    )
}

export default GlobalHeader;