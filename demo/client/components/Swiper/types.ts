import { ComponentType } from 'react';

import {
    ISwiperPluginClassnames,
    ISwiperPluginHTMLNodes,
    ISwiperPluginChangeEvent,
    ISwiperPluginBaseConfig,
    ISwiperPluginInput,
    RootSwiperPlugin,
} from './plugins';

export interface ISwiperData {
    currentIndex: number;
    slidesCount: number;
}

export interface ISwiperPagination extends ISwiperData {
    plugin: RootSwiperPlugin<ISwiperPluginBaseConfig>;
    setSlide: (index: number) => void;
}

export interface ISwiperArrows extends ISwiperData {
    plugin: RootSwiperPlugin<ISwiperPluginBaseConfig>;
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

export type ISwiperConfig<Input extends ISwiperPluginInput> = {
    plugin: new (config: ISwiperPluginBaseConfig) => RootSwiperPlugin<ISwiperPluginBaseConfig>;
    currentIndex?: number;
    slidesCount?: number;
    onChange?: (event: ISwiperPluginChangeEvent) => void;
} & Omit<Input, keyof ISwiperPluginBaseConfig>;

export type ISwiperContainerProps<Input extends ISwiperPluginInput> = {
    plugin: new (config: Input) => RootSwiperPlugin<ISwiperPluginBaseConfig>;
    className?: string;
    paginator?: ComponentType<ISwiperPagination>;
    arrows?: ComponentType<ISwiperArrows>;
    currentIndex?: number;
    slidesCount?: number;
} & ISwiperConfig<Input>;

export interface ISwiper {
    plugin: RootSwiperPlugin<ISwiperPluginBaseConfig>;
    nodes: ISwiperPluginHTMLNodes;
    data: ISwiperData;
    slidesData: ISwiperSlidesDataContext;
    classNames: ISwiperPluginClassnames;
    methods: ISwiperMethods;
}
