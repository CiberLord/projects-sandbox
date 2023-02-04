import { ISliderConstructorOptions, ISliderPaginationProps, IArrowProps } from '../types';
import { ComponentType } from 'react';

export interface ISliderConstructorProps extends ISliderConstructorOptions {
    className?: string;
    pagination?: ComponentType<ISliderPaginationProps>;
    arrows?: ComponentType<IArrowProps>;
}
