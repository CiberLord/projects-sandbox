import { EmptyObject } from '../../../../../core/types/utils';
import { RefObject } from 'react';

export interface ISliderDomRefs {
    container: RefObject<HTMLDivElement>;
    wrapper: RefObject<HTMLDivElement>;
    track: RefObject<HTMLDivElement>;
    slides: RefObject<HTMLDivElement[]>;
}

export interface ISliderModuleBaseContext {
    hasAllowPrev: boolean;
    hasAllowNext: boolean;
    currentSlide: number;
    snapPoints: number[];
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

export type IGetClassNamesAction = () => IClassNames;

export type ChangeHandler = (event: ISliderModuleChangeEvent) => void;

export interface ISliderModuleBaseOptions {
    currentSlide?: number;
    onChange?: ChangeHandler;
}

export type ISetSlideAction = (currentSlide: number, onChange?: ChangeHandler) => void;

export type IUpdateSlideAction = (onChange?: ChangeHandler) => void;

export type IUseChangeListener = (onChange: ChangeHandler) => void;

export interface ISliderModuleOptions extends ISliderModuleBaseOptions {
    domRefs: ISliderDomRefs;
}

export interface ISliderModuleEntity {
    getClassNames: IGetClassNamesAction;

    create: () => void;
    destroy: () => void;

    hasAllowPrev: boolean;
    hasAllowNext: boolean;

    useChange: IUseChangeListener;

    setSlide: ISetSlideAction;
    toPrev: IUpdateSlideAction;
    toNext: IUpdateSlideAction;
}

export type ISliderModule<Options = EmptyObject, Entity = EmptyObject> = (
    options: ISliderModuleOptions & Options,
) => ISliderModuleEntity & Entity;
