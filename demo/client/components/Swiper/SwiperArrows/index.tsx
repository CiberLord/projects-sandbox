import React, { PropsWithChildren } from 'react';
import cn from 'classnames/bind';

import { ISwiperArrows } from '../types';

import styles from './styles.module.css';

export interface ISwiperArrowsProps extends ISwiperArrows {
    prevButtonClassName?: string;
    nextButtonClassName?: string;
    className?: string;
}

const cx = cn.bind(styles);

export const SwiperArrows: React.FC<PropsWithChildren<ISwiperArrowsProps>> = React.memo(
    ({
        children,
        prevButtonClassName,
        nextButtonClassName,
        toNext,
        toPrevious,
        currentIndex,
        slidesCount,
    }) => {
        return (
            <div className={cx(prevButtonClassName, styles.container)}>
                <div
                    onClick={toPrevious}
                    className={cx(prevButtonClassName, styles.button, styles.prevButton)}>
                    <div>{'<'}</div>
                </div>
                <div
                    onClick={toNext}
                    className={cx(nextButtonClassName, styles.button, styles.nextButton)}>
                    <div>{'>'}</div>
                </div>
            </div>
        );
    },
);
