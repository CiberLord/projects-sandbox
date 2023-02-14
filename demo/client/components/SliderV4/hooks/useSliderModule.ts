import debounce from 'lodash/debounce';

import {
    ISliderApi,
    ISliderBuilder,
    ISliderEvent,
    ISliderModule,
    ISliderOptions,
    Listener,
    SlideId,
    SliderEvents,
} from '../types';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { EventsEmitter } from '../utils/eventsEmitter';
import { DomEvents, SliderDom } from '../utils/sliderDom';

export const useSliderModule = <Options extends ISliderOptions = ISliderOptions>(
    module: ISliderModule<Options>,
    options: Options,
) => {
    const { builder: SliderBuilder } = module;
    const { onChange, isUpdateOnResize } = options;
    const [isSliderMounted, setSliderMounted] = useState(false);
    const [activeSlide, setActiveSlide] = useState(options.activeSlide || 0);
    const [slidesCount, setSlidesCount] = useState(0);
    const [hasPrev, updateHasPrev] = useState(false);
    const [hasNext, updateHasNext] = useState(false);

    const emitter = useMemo(
        () => new EventsEmitter<typeof SliderEvents, ISliderEvent>({ types: SliderEvents }),
        [],
    );
    const sliderDom = useMemo(() => new SliderDom(), []);
    const sliderRef = useRef<ISliderBuilder | null>(null);

    const handleUpdate = useCallback(
        debounce(() => {
            if (!sliderRef.current) {
                return;
            }

            sliderRef.current.update();

            setSlidesCount(sliderRef.current?.getSlideMovesCount());
        }, 200),
        [],
    );

    const attachInitialEvents = () => {
        emitter.addListener(SliderEvents.change, (event) => {
            setActiveSlide(event.activeSlide);
        });
        emitter.addListener(SliderEvents.enterFirst, () => {
            updateHasPrev(false);
        });
        emitter.addListener(SliderEvents.leaveFirst, () => {
            updateHasPrev(true);
        });
        emitter.addListener(SliderEvents.enterLast, () => {
            updateHasNext(false);
        });
        emitter.addListener(SliderEvents.leaveLast, () => {
            updateHasNext(true);
        });
    };

    const sliderEntity = useMemo<ISliderApi>(
        () => ({
            hasPrev,
            hasNext,
            activeSlide,
            slidesCount,

            styles: module.styles,
            instance: sliderRef.current,
            setContainerElement: sliderDom.setContainerElement,
            setScrollableElement: sliderDom.setScrollableElement,
            addSlideElement: sliderDom.addSlideElement,
            removeSlideElement: sliderDom.removeSlideElement,
            getSlides: sliderDom.getSlideElements,

            toNext: () => sliderRef.current?.toNext?.(),
            toPrev: () => sliderRef.current?.toPrev?.(),
            setSlide: (activeSlide: SlideId) => sliderRef.current?.setSlide?.(activeSlide),
            addListener: (type: SliderEvents, listener: Listener) =>
                emitter.addListener(type, listener),
            removeListener: (type: SliderEvents, listener: Listener) =>
                emitter.removeListener(type, listener),
        }),
        [hasPrev, hasNext, activeSlide, slidesCount],
    );

    // Привязка слушателя перед созданием слайдера
    useLayoutEffect(() => {
        if (onChange) {
            emitter.addListener(SliderEvents.change, onChange);
        }

        return () => {
            emitter.removeListener(SliderEvents.change, onChange);
        };
    }, [onChange]);

    // Создание слайдера
    useLayoutEffect(() => {
        // Нужно привязать все события перед созданием слайдера
        attachInitialEvents();

        sliderRef.current = new SliderBuilder(
            {
                containerElement: sliderDom.getContainerElement(),
                scrollableElement: sliderDom.getScrollableElement(),
                slideElements: sliderDom.getSlideElements(),
                dispatchEvent: emitter.dispatchEvent,
            },
            options,
        );

        setSliderMounted(true);
        setSlidesCount(sliderRef.current?.getSlideMovesCount());
        updateHasNext(activeSlide < sliderRef.current?.getSlideMovesCount());
        updateHasPrev(activeSlide !== 0);

        return () => {
            sliderRef.current?.destroy?.();
        };
    }, []);

    // Обновление конфигурации слайдера, в случаи изменения размеров экрана
    useEffect(() => {
        if (!isSliderMounted || !isUpdateOnResize) {
            return;
        }

        window.addEventListener('resize', handleUpdate);

        return () => {
            window.removeEventListener('resize', handleUpdate);
        };
    }, [isSliderMounted]);

    // Обновление конфигурации слайдера, в случаи изменения количества элементов
    useEffect(() => {
        if (!isSliderMounted) {
            return;
        }

        sliderDom.addListener(SliderDom.events.addSlide, handleUpdate);
        sliderDom.addListener(SliderDom.events.removeSlide, handleUpdate);
    }, [isSliderMounted]);

    return sliderEntity;
};
