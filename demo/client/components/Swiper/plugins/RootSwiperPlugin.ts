import {} from '../types';
import { EmptyObject } from '../../../../../core/types/utils';
import { RefObject } from 'react';

export interface ISwiperPluginChangeEvent {
    currentIndex: number;
}

export interface ISwiperPluginData {
    currentIndex: number;
    slidesCount: number;
}

export interface ISwiperPluginTransitionEvent {
    updateIndex: number;
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

export interface ISwiperPluginBaseConfig extends ISwiperPluginHTMLNodes, ISwiperPluginData {
    updateIndex: (index: number) => void;
    onChange?: (event: ISwiperPluginChangeEvent) => void;
}

export class RootSwiperPlugin<P extends EmptyObject> {
    container: RefObject<HTMLDivElement>;
    slidesList: RefObject<HTMLDivElement>;
    slidesTrack: RefObject<HTMLDivElement>;
    slides: RefObject<HTMLDivElement[]>;

    slidesCount: number;
    currentIndex: number;

    updateIndex: (index: number) => void;
    onChange?: (event: ISwiperPluginChangeEvent) => void;

    constructor(config: ISwiperPluginBaseConfig & P) {
        const {
            container,
            slidesList,
            slidesTrack,
            slides,
            slidesCount,
            currentIndex,
            updateIndex,
            onChange,
        } = config;

        this.container = container;
        this.slidesList = slidesList;
        this.slidesTrack = slidesTrack;
        this.slides = slides;

        this.slidesCount = slidesCount;
        this.currentIndex = currentIndex;

        this.updateIndex = updateIndex;
        this.onChange = onChange;
    }

    // Возвращает базовые css-классы для правильной конфигурации слайдера.
    // Можно было бы обойтись без него, но у нас есть ssr
    public getCSS(): ISwiperPluginClassnames {
        return {};
    }

    public setSlidesCount(count: number): void {
        this.slidesCount = count;
    }

    public setCurrentIndex(index: number): void {
        this.currentIndex = index;
    }

    // Метод выполняющий переход на слайд по указанному индексу
    // Здесь прописывается способ анимации
    public transition(event: ISwiperPluginTransitionEvent): boolean {
        return false;
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
