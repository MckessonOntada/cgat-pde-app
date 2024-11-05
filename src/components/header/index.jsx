import React from 'react';
import { Stack } from '@mui/material';
import PrimaryHeader from "./PrimaryHeader"
import SecondaryHeader from './SecondaryHeader';
import  HeaderConfig from './__mock__';

const GlobalHeader = () => {
    return (
        <Stack>
            <PrimaryHeader />
            <SecondaryHeader navLinks={HeaderConfig.navLinks} />
        </Stack>
    )
}

export default GlobalHeader;