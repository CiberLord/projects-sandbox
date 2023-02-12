import { CSSProperties } from 'react';

export type Slide = number; // индекс слайда в массиве

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
    // Когда добавился новый слайд
    ADD_SLIDE = 'ADD_SLIDE',
    // Когда удалился слайд
    REMOVE_SLIDE = 'REMOVE_SLIDE',

    MOUNT = 'MOUNT',
    UPDATE = 'UPDATE',
    DESTROY = 'DESTROY',
}

export type SliderListener = (event: ISliderEvent) => void;

// Базовые параметры по которым будет создан слайдер
export interface ISliderOptionsBase {
    // индекс начального слайда, после первого рендера, слайдер плавно перейдет в данному слайду
    activeSlide?: Slide;
    // начальное количество слайдов в слайдере, можно использовать чтобы избегать лишьних дерганий анимации, при первом рендере пагинации
    slidesCount?: number;
    // колбэк который будет отрабывать на каждое изменения текущего слайда
    onChange?: SliderListener;
    //центрирование слайдов внутри контейнера, не все типы слайдеров могут поддерживать
    centered?: boolean;
    // обновляет конфигурацию слайдера при ресайзе
    isUpdateOnResize?: boolean;
}

export interface ISlideElementAttr {
    className?: string;
    style?: CSSProperties;
}

export interface ISetSlideOptions {
    activeSlide: Slide;
}

export interface ISliderApi {
    // инициализация слайдера
    onMount: () => void;
    // Апдейт конфигурации слайдера, если изменилось количество слайдов или ширина, не обьязательно
    onUpdate?: () => void;
    // Очистка всяких хэндлэров при размонтировании компонента слайдера
    onDestroy: () => void;

    // Получить текущий активный слайд
    getActiveSlide: () => Slide;
    // Получить список всех слайдов, каждый тип слайдера, сам решает что тут возвращать
    getSlides: () => Slide[];
    // Возвращает все нужные атрибуты элементов слайдера, для корректной инициализации
    getElementsAttributes: () => {
        container?: ISlideElementAttr;
        scrollable?: ISlideElementAttr;
        slide?: ISlideElementAttr;
    };

    // refSetter
    setContainerElement: (el: HTMLDivElement | null) => void;
    // refSetter
    setScrollableElement: (el: HTMLDivElement | null) => void;
    // refSetter
    addSlideElement: (el: HTMLDivElement | null) => void;
    removeSlideElement: (el: HTMLDivElement | null) => void;

    // Добавляет слушателей для слайдера, каждый слайдер сам реализует логику, обработки событий
    addListener: (type: EventTypes, handler: SliderListener) => void;
    // Удаления слушателя из стека
    removeListener: (type: EventTypes, handler: SliderListener) => void;
    // Вернуться к предыдущему слайду, у каждого типа слайдера может быть своя реализация
    toPrev: () => void;
    // Сдвиг к следующему слайду, у каждого типа слайдера может быть своя реализация
    toNext: () => void;
    // Установить текущий активный слайд по индексу в массиве, у каждого типа слайдера может быть своя реализация
    setSlide: (options: ISetSlideOptions) => void;
}

export type SliderApiFactory = new (options: ISliderOptionsBase) => ISliderApi;

export interface ISliderInjectedOptions {
    slider: ISliderApi;
}

export interface IArrowProps {
    className?: string;
    activePrevButton: boolean;
    activeNextButton: boolean;
    setNext: () => void;
    setPrev: () => void;
}

export interface IPaginationProps extends ISliderInjectedOptions {
    className?: string;
    activeSlide: Slide;
    slidesCount: number;
}
