import {
    ChangeHandler,
    ISliderModuleBaseOptions,
    ISliderModuleConfig,
    ISliderModuleEntity,
    ISliderDomRefs,
} from './factories/types';

import { ComponentType, PropsWithChildren } from 'react';
import { ISlideDataContext, ISliderSlidesCollectorContext } from './contexts/types';

export interface IArrowsProps {
    toPrev: () => void;
    toNext: () => void;
    showPrevButton: boolean;
    showNextButton: boolean;
    className?: string;
}

export interface ISliderBaseEntity {
    sliderInstance: ISliderModuleEntity;
}

export interface ISliderViewItemProps extends ISliderBaseEntity {
    currentSlide: number;
    slidesCount: number;
}

export type ISliderOptions<Config extends ISliderModuleBaseOptions> = {
    module: (config: ISliderModuleConfig) => ISliderModuleEntity;
    currentSlide?: number;
    onChange?: ChangeHandler;
} & Omit<Config, keyof ISliderModuleBaseOptions>;

export type ISliderViewFactoryProps<Config extends ISliderModuleBaseOptions> = {
    module: (config: ISliderModuleConfig & Config) => ISliderModuleEntity;
    arrows?: ComponentType<IArrowsProps>;
    views?: ComponentType<ISliderViewItemProps>[];
    className?: string;
    wrapperClassName?: string;
    trackClassName?: string;
    currentSlide?: number;
    onChange?: ChangeHandler;
} & Omit<Config, keyof ISliderModuleBaseOptions>;

export interface ISliderEntity extends ISliderBaseEntity {
    domRefs: ISliderDomRefs;
    currentSlide: number;
    slidesCount: number;
    slideData: ISlideDataContext;
    slidesCollector: ISliderSlidesCollectorContext;
}
