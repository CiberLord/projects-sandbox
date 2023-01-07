import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { EmptyObject } from '../../../../../core/types/utils';

import { ISwiperConfig, ISwiper, ISwiperMethods, ISwiperSlidesDataContext } from '../types';
import { ISwiperPluginData } from '../plugins';

export const useSwiper = <P extends EmptyObject>(config: ISwiperConfig<P>): ISwiper => {
    const { plugin: Plugin, currentIndex, slidesCount, onChange, ...pluginProps } = config;

    const [data, setData] = useState<ISwiperPluginData>({
        currentIndex: currentIndex || 0,
        slidesCount: slidesCount || 0,
    });

    const container = useRef<HTMLDivElement>(null);
    const slidesList = useRef<HTMLDivElement>(null);
    const slidesTrack = useRef<HTMLDivElement>(null);
    const slides = useRef<HTMLDivElement[]>([]);

    const setSlideIndex = useCallback((index: number) => {
        setData((state) => ({
            ...state,
            currentIndex: index,
        }));
    }, []);

    const setSlidesCount = useCallback((count: number) => {
        setData((state) => ({
            ...state,
            slidesCount: count,
        }));
    }, []);

    const pluginInstance = useMemo(
        () =>
            new Plugin({
                container,
                slidesList,
                slidesTrack,
                slides,
                slidesCount: data.slidesCount,
                currentIndex: data.slidesCount,
                updateIndex: setSlideIndex,
                ...pluginProps,
            }),
        [],
    );

    const classNames = pluginInstance.getCSS();

    const methods = useMemo<ISwiperMethods>(
        () => ({
            toPrevious: () => {
                pluginInstance.transition({
                    updateIndex: data.currentIndex - 1,
                });
            },
            toNext: () => {
                pluginInstance.transition({
                    updateIndex: data.currentIndex + 1,
                });
            },
            addSlide: (element) => {
                element && slides.current.push(element);
            },
            setSlide: (index) => {
                pluginInstance.transition({
                    updateIndex: index,
                });
            },
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
    pluginInstance.setSlidesCount(data.slidesCount);

    useLayoutEffect(() => {
        pluginInstance.setSlidesCount(slides.current.length);
        pluginInstance.onMounted();
        pluginInstance.transition({ updateIndex: data.currentIndex });
        setSlidesCount(slides.current.length);

        return () => {
            pluginInstance.onWillUnmounted();
        };
    }, []);

    return {
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
