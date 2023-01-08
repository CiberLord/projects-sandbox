import {} from '../types';
import { RefObject } from 'react';

export interface ISwiperPluginChangeEvent {
    currentIndex: number;
}

export interface ISwiperPluginTransitionEvent {
    updatedIndex: number;
}

export interface ISwiperPluginClassnames {
    containerClassName?: string;
    slidesListClassName?: string;
    slidesTrackClassName?: string;
    slideClassName?: string;
}

export interface ISwiperPluginHTMLNodes {
    container: RefObject<HTMLDivElement>;
    slidesList: RefObject<HTMLDivElement>;
    slidesTrack: RefObject<HTMLDivElement>;
    slides: RefObject<HTMLDivElement[]>;
}

export interface ISwiperPluginInput {
    onChange?: (event: ISwiperPluginChangeEvent) => void;
    currentIndex?: number;
}

export interface ISwiperPluginBaseConfig extends ISwiperPluginHTMLNodes, ISwiperPluginInput {
    currentIndex: number;
    updateIndex: (index: number) => void;
}

export class RootSwiperPlugin<Config extends ISwiperPluginBaseConfig> {
    container: RefObject<HTMLDivElement>;
    slidesList: RefObject<HTMLDivElement>;
    slidesTrack: RefObject<HTMLDivElement>;
    slides: RefObject<HTMLDivElement[]>;
    currentIndex: number;

    updateIndex: (index: number) => void;
    onChange?: (event: ISwiperPluginChangeEvent) => void;

    constructor(config: Config) {
        const {
            container,
            slidesList,
            slidesTrack,
            slides,

            currentIndex,
            updateIndex,
            onChange,
        } = config;

        this.container = container;
        this.slidesList = slidesList;
        this.slidesTrack = slidesTrack;
        this.slides = slides;
        this.currentIndex = currentIndex;

        this.updateIndex = updateIndex;
        this.onChange = onChange;
    }

    // Возвращает базовые css-классы для правильной конфигурации слайдера для конкретного плагина.
    public getCSS(): ISwiperPluginClassnames {
        return {};
    }

    public setCurrentIndex(index: number): void {
        this.currentIndex = index;
    }

    // Метод выполняющий переход на слайд по указанному индексу
    public setSlide(event: ISwiperPluginTransitionEvent): void {
        // TODO:
    }

    public toNext(): void {
        // TODO:
    }

    public toPrevious(): void {
        // TODO:
    }

    // Здесь нужно добавить всякие хендлеры и данные которые зависят от html-элементов
    // Должен вызваться один раз, при монтировании компонента в DOM.
    public onMounted(): void {
        // TODO:
    }

    // Для удаления хэндлеров с dom
    public onWillUnmounted(): void {
        // TODO:
    }
}
