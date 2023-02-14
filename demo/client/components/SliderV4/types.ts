export interface ISliderApi {
    activeSlide: SlideId;
    slidesCount: number;
    hasNext: boolean;
    hasPrev: boolean;
    getSlides: () => HTMLDivElement[];
    setSlide: (activeSlide: SlideId) => void;
    toPrev: () => void;
    toNext: () => void;
    styles: ISliderStyles;
    addListener: (type: SliderEvents, listener: Listener) => void;
    removeListener: (type: SliderEvents, listener: Listener) => void;
    setContainerElement: (el: HTMLDivElement | null) => void;
    setScrollableElement: (el: HTMLDivElement | null) => void;
    addSlideElement: (el: HTMLDivElement | null) => void;
    removeSlideElement: (el: HTMLDivElement | null) => void;
}

// Индекс слайда в массиве
export type SlideId = number;

export enum SliderEvents {
    change = 'change',
    enterFirst = 'enterFirst',
    leaveFirst = 'leaveFirst',
    enterLast = 'enterLast',
    leaveLast = 'leaveLast',
}

export interface ISliderEvent {
    activeSlide: SlideId;
}

export type Listener<CustomEvent extends ISliderEvent = ISliderEvent> = (
    event: CustomEvent,
) => void;

export interface ISliderStyles {
    container?: string;
    scrollable?: string;
    slide?: string;
}

export interface ISliderBuilderContext {
    containerElement: HTMLDivElement;
    scrollableElement: HTMLDivElement;
    slideElements: HTMLDivElement[];
    dispatchEvent: (type: SliderEvents, event: ISliderEvent) => void;
}

export interface ISliderOptions {
    activeSlide?: SlideId;
    onChange?: Listener;
    isUpdateOnResize?: boolean;
}

export interface ISliderBuilder {
    getSlideMovesCount: () => number;
    setSlide: (activeSlide: SlideId) => void;
    toPrev: () => void;
    toNext: () => void;
    update: () => void;
    destroy: () => void;
}

export interface ISliderModule<Options extends ISliderOptions = ISliderOptions> {
    builder: new (context: ISliderBuilderContext, options: Options) => ISliderBuilder;
    styles: ISliderStyles;
}
export interface IArrowProps {
    className?: string;
    activePrevButton: boolean;
    activeNextButton: boolean;
    toNext: () => void;
    toPrev: () => void;
}

export interface IPaginationProps {
    className?: string;
    slider: ISliderApi;
}
