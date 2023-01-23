import {
    ChangeHandler,
    ISliderModuleBaseOptions,
    ISliderModuleOptions,
    ISliderModuleEntity,
    ISliderDomRefs,
} from './factories/types';

import { ComponentType } from 'react';
import { ISlideDataContext, ISliderSlidesCollectorContext } from './contexts/types';

export interface IArrowsProps {
    toPrev: () => void;
    toNext: () => void;
    showPrevButton: boolean;
    showNextButton: boolean;
    className?: string;
}

export interface ISliderBaseEntity {
    sliderEntity: ISliderModuleEntity;
}

export interface ISliderPaginationProps extends ISliderBaseEntity {
    currentSlide: number;
    slidesCount: number;
}

export type ISliderOptions<Config extends ISliderModuleBaseOptions> = {
    module: (config: Config) => ISliderModuleEntity;
    currentSlide?: number;
    onChange?: ChangeHandler;
} & Omit<Config, keyof ISliderModuleBaseOptions>;

export type ISliderViewFactoryProps<Config extends ISliderModuleBaseOptions> = {
    module: (config: Config) => ISliderModuleEntity;
    arrows?: ComponentType<IArrowsProps>;
    pagination?: ComponentType<ISliderPaginationProps>;
    className?: string;
    wrapperClassName?: string;
    trackClassName?: string;
    currentSlide?: number;
    onChange?: ChangeHandler;
} & Omit<Config, keyof ISliderModuleOptions>;

export interface ISliderEntity extends ISliderBaseEntity {
    domRefs: ISliderDomRefs;
    currentSlide: number;
    slidesCount: number;
    slideData: ISlideDataContext;
    slidesCollector: ISliderSlidesCollectorContext;
}
