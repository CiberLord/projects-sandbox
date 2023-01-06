import React from 'react';
import cn from 'classnames';

import styles from './styles.module.css';

interface IAppProps {
    className?: string;
}

export const App: React.FC<React.PropsWithChildren<IAppProps>> = ({ className, children }) => {
    return <div className={cn(styles.container, className)}>{children}</div>;
};
