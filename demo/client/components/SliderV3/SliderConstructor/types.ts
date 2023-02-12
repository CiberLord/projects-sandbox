import { IPaginationProps, IArrowProps, SliderApiFactory, ISliderOptionsBase } from '../types';
import { ComponentType } from 'react';

export interface ISliderConstructorProps extends ISliderOptionsBase {
    mode: SliderApiFactory;
    className?: string;
    sliderContainerClassName?: string;
    sliderScrollableClassName?: string;
    pagination?: ComponentType<IPaginationProps>;
    arrows?: ComponentType<IArrowProps>;
}
