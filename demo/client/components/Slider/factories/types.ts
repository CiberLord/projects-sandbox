import { EmptyObject } from '../../../../../core/types/utils';
import { RefObject } from 'react';

export interface ISliderDomRefs {
    container: RefObject<HTMLDivElement>;
    wrapper: RefObject<HTMLDivElement>;
    track: RefObject<HTMLDivElement>;
    slides: RefObject<HTMLDivElement[]>;
}

export interface IClassNames {
    container?: string;
    wrapper?: string;
    track?: string;
    item?: string;
}

export interface ISliderModuleChangeEvent {
    hasAllowPrev: boolean;
    hasAllowNext: boolean;
    currentSlide: number;
}

export type ChangeHandler = (event: ISliderModuleChangeEvent) => void;

export interface ISliderModuleBaseOptions {
    currentSlide?: number;
    onChange?: ChangeHandler;
}

export interface ISliderModuleConfig extends ISliderModuleBaseOptions {
    domRefs: ISliderDomRefs;
}

export interface ISliderModuleEntity {
    getClassNames: () => IClassNames;

    create: () => void;
    destroy: () => void;

    hasAllowPrev: boolean;
    hasAllowNext: boolean;

    setSlide: (currentSlide: number, onChange?: ChangeHandler) => void;
    toPrev: (onChange?: ChangeHandler) => void;
    toNext: (onChange?: ChangeHandler) => void;
}

export type ISliderModule<Config = EmptyObject, Entity = EmptyObject> = (
    config: ISliderModuleConfig & Config,
) => ISliderModuleEntity & Entity;
