import { ComponentType } from 'react';

import { EmptyObject } from '../../../../core/types/utils';

import {
    ISwiperPluginClassnames,
    ISwiperPluginChangeEvent,
    ISwiperPluginHTMLNodes,
    ISwiperPluginData,
    ISwiperPluginBaseConfig,
    RootSwiperPlugin,
} from './plugins';

export interface IPaginator {
    currentIndex: number;
    slidesCount: number;
    setSlide: (index: number) => void;
}

export interface IArrows {
    toNext: () => void;
    toPrevious: () => void;
}

export interface ISwiperSlidesDataContext {
    slideClassName?: string;
}

export interface ISwiperMethods {
    toNext: () => void;
    toPrevious: () => void;
    addSlide: (element: HTMLDivElement | null) => void;
    setSlide: (index: number) => void;
}

export type ISwiperMethodsContext = ISwiperMethods;

export type ISwiperConfig<P extends EmptyObject> = {
    plugin: new (config: ISwiperPluginBaseConfig) => RootSwiperPlugin<P>;
    currentIndex?: number;
    slidesCount?: number;
    onChange?: (event: ISwiperPluginChangeEvent) => void;
} & P;

export type ISwiperContainerProps<P extends EmptyObject> = {
    className?: string;
    paginator?: ComponentType<IPaginator>;
    arrows?: ComponentType<IArrows>;
} & ISwiperConfig<P>;

export interface ISwiper {
    nodes: ISwiperPluginHTMLNodes;
    data: ISwiperPluginData;
    slidesData: ISwiperSlidesDataContext;
    classNames: ISwiperPluginClassnames;
    methods: ISwiperMethods;
}
