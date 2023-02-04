export type Slide = number;

export interface ISliderElements {
    wrapper?: HTMLDivElement;
    container?: HTMLDivElement;
    list?: HTMLDivElement;
    slides: HTMLDivElement[];
}

export interface ISliderClassNames {
    wrapper?: string;
    container?: string;
    list?: string;
    slide?: string;
}

export interface ISliderEvent {
    activeSlide: Slide;
}

export enum EventTypes {
    // Событие которое должно выполниться при изменени текущего слайда
    CHANGE = 'CHANGE',
    // Событие которое должно выполниться при движении первого слайда
    LEAVE_FIRST = 'LEAVE_FIRST',
    // Событие которое должно выполниться, когда первый слайд виден
    ENTER_FIRST = 'ENTER_FIRST',
    // Событие которое должно выполниться при движении последнего слайда
    LEAVE_LAST = 'LEAVE_LAST',
    // Событие которое должно выполниться, когда последний слайд виден
    ENTER_LAST = 'ENTER_LAST',
}

export type SliderListener = (event: ISliderEvent) => void;

export interface ISliderOptionsBase {
    activeSlide?: Slide;
    onChange?: SliderListener;
}

export interface ISetSlideOptions {
    activeSlide: Slide;
}

export interface ISliderModule {
    onMount: (elements: ISliderElements) => void;
    onUpdate: (elements: ISliderElements) => void;
    onDestroy: () => void;
    getClassNames: () => ISliderClassNames;
    addListener: (type: EventTypes, handler: SliderListener) => void;
    toPrev: () => void;
    toNext: () => void;
    setSlide: (options: ISetSlideOptions) => void;
}

export interface ISliderInjectedOptions {
    slider: ISliderModule;
}

export interface ISliderConstructorOptions extends ISliderOptionsBase {
    module: new (options: ISliderOptionsBase) => ISliderModule;
}

export interface IArrowProps {
    activePrevButton: boolean;
    activeNextButton: boolean;
    setNext: () => void;
    setPrev: () => void;
}

export interface ISliderPaginationProps extends ISliderInjectedOptions {
    activeSlide: Slide;
    slidesCount: number;
}
