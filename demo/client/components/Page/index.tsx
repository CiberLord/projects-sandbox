import React, { PropsWithChildren } from 'react';
import { App } from '../App';

export const Page: React.FC<PropsWithChildren> = ({ children }) => {
    // implement common logics of pages...

    return <App>{children}</App>;
};
