import { ComponentType } from 'react';

import { IPaginationProps, IArrowProps } from '../types';

import { IWithMode } from './modes';

export type ISliderConstructorProps = {
    className?: string;
    sliderContainerClassName?: string;
    sliderScrollableClassName?: string;
    pagination?: ComponentType<IPaginationProps>;
    arrows?: ComponentType<IArrowProps>;
} & IWithMode;
