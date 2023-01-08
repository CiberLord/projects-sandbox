import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import {
    ISwiperConfig,
    ISwiperData,
    ISwiper,
    ISwiperMethods,
    ISwiperSlidesDataContext,
} from '../types';
import { ISwiperPluginInput } from '../plugins';

export const useSwiper = <Input extends ISwiperPluginInput>(
    config: ISwiperConfig<Input>,
): ISwiper => {
    const {
        plugin: Plugin,
        currentIndex: defaultCurrentIndex = 0,
        slidesCount: defaultSlidesCount = 0,
        onChange,
        ...pluginProps
    } = config;

    const [currentIndex, updateIndex] = useState(defaultCurrentIndex);
    const [slidesCount, setSlidesCount] = useState(defaultSlidesCount);

    const container = useRef<HTMLDivElement>(null);
    const slidesList = useRef<HTMLDivElement>(null);
    const slidesTrack = useRef<HTMLDivElement>(null);
    const slides = useRef<HTMLDivElement[]>([]);

    const pluginInstance = useMemo(
        () =>
            new Plugin({
                ...pluginProps,
                container,
                slidesList,
                slidesTrack,
                slides,
                currentIndex,
                updateIndex,
            }),
        [],
    );

    const classNames = pluginInstance.getCSS();

    const data = useMemo<ISwiperData>(
        () => ({
            currentIndex,
            slidesCount,
        }),
        [currentIndex, slidesCount],
    );

    const methods = useMemo<ISwiperMethods>(
        () => ({
            toPrevious: () => pluginInstance.toPrevious(),
            toNext: () => pluginInstance.toNext(),
            setSlide: (index) =>
                pluginInstance.setSlide({
                    updatedIndex: index,
                }),
            addSlide: (element) => element && slides.current.push(element),
        }),
        [],
    );

    const slidesData = useMemo<ISwiperSlidesDataContext>(
        () => ({
            slideClassName: pluginInstance.getCSS().slideClassName,
        }),
        [],
    );

    pluginInstance.setCurrentIndex(data.currentIndex);

    useLayoutEffect(() => {
        pluginInstance.onMounted();
        pluginInstance.setSlide({ updatedIndex: data.currentIndex });
        setSlidesCount(slides.current.length);

        return () => {
            pluginInstance.onWillUnmounted();
        };
    }, []);

    return {
        plugin: pluginInstance,
        nodes: {
            container,
            slidesList,
            slidesTrack,
            slides,
        },
        classNames,
        methods,
        data,
        slidesData,
    };
};
