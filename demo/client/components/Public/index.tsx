import React, { PropsWithChildren } from 'react';

import styles from './styles.module.css';

export const Public: React.FC<PropsWithChildren> = () => {
    return <div className={styles.container}>Hello world</div>;
};
