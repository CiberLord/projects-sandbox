import { ChangeHandler, ISliderModuleEntity, ISliderModuleOptions } from '../types';

import styles from './styles.module.css';
import { Controller } from '@react-spring/web';
import { IDragGestureRecognizer } from '../../libs/dragGestureRecognizer/types';
import {
    createDragGestureRecognizer,
    getCurrentSnapPointSlide,
    IDirection,
    getUpdatedPositionByArrowDirection,
    getSnapPointsAccordingScrollWidth,
    getSnapPointsToSlides,
    getInToRange,
} from '../../libs';

interface ISnapSliderModuleOptions {
    centered?: boolean;
}

interface ISnapPointSliderState {
    currentSlide: number;
    scrollPosition: number;
    hasAllowPrev: boolean;
    hasAllowNext: boolean;
    snapPoints: number[];
    transformPoints: number[];
    animation: Controller<{ x: number }>;
    gestureRecognizer: IDragGestureRecognizer | null;
    changeListeners: ChangeHandler[];
}

interface IOptions extends ISnapSliderModuleOptions, ISliderModuleOptions {}

const SnapSliderModule = (options: IOptions): ISliderModuleEntity => {
    const { domRefs } = options;

    const context: ISnapPointSliderState = {
        currentSlide: options.currentSlide || 0,
        scrollPosition: 0,
        changeListeners: options.onChange ? [options.onChange] : [],
        hasAllowPrev: false,
        hasAllowNext: true,

        snapPoints: [],
        transformPoints: [],

        animation: new Controller<{ x: number }>({
            x: 0,
            onChange: (event) => {
                (
                    domRefs.track.current as HTMLDivElement
                ).style.transform = `translate3d(${event.value.x}px, 0px, 0px)`;
                context.scrollPosition = event.value.x;
            },
        }),

        gestureRecognizer: null,
    };

    const updateSlide = (index: number, onChange?: ChangeHandler) => {
        const prevIndex = context.currentSlide;
        context.currentSlide = getInToRange(index, 0, context.snapPoints.length);

        context.animation.start({
            x: context.transformPoints[context.currentSlide],
            onRest: () => {
                if (prevIndex === context.currentSlide) {
                    return;
                }

                context.hasAllowPrev = context.currentSlide > 0;
                context.hasAllowNext = context.currentSlide < context.snapPoints.length - 1;

                const changeEvent = {
                    currentSlide: context.currentSlide,
                    hasAllowPrev: context.hasAllowPrev,
                    hasAllowNext: context.hasAllowNext,
                };

                context.changeListeners.forEach((listener) => listener(changeEvent));
                options.onChange?.(changeEvent);
            },
            config: {
                friction: 50,
                tension: 400,
            },
        });
    };

    return {
        hasAllowPrev: context.hasAllowPrev,
        hasAllowNext: context.hasAllowNext,

        create: () => {
            const container = domRefs.container.current as HTMLDivElement;
            const wrapper = domRefs.wrapper.current as HTMLDivElement;
            const slidesTrack = domRefs.track.current as HTMLDivElement;
            const slides = domRefs.slides.current as HTMLDivElement[];

            if (options.centered) {
                context.snapPoints = getSnapPointsToSlides({
                    container,
                    slides,
                    centered: options.centered,
                });
            } else {
                context.snapPoints = getSnapPointsAccordingScrollWidth({
                    container,
                    slidesTrack,
                    slides,
                });
            }

            context.transformPoints = context.snapPoints.map((point) => -1 * point);

            context.gestureRecognizer = createDragGestureRecognizer({
                target: wrapper,
                onDrag: ({ delta }) => {
                    const updatedPosition = context.transformPoints[context.currentSlide] + delta.x;

                    context.animation.start({
                        x: updatedPosition,
                        config: {
                            friction: 50,
                            tension: 800,
                        },
                    });
                },
                onDragEnd: ({ delta, direction }) => {
                    const updatedPosition = context.transformPoints[context.currentSlide] + delta.x;

                    const targetSlide = getCurrentSnapPointSlide(
                        context.snapPoints,
                        -1 * updatedPosition,
                    );

                    const shouldChanged = targetSlide !== context.currentSlide;

                    const updatedSlide = shouldChanged
                        ? context.currentSlide - direction.x
                        : context.currentSlide;

                    updateSlide(updatedSlide);
                },
                onSwipe: ({ direction }) => {
                    updateSlide(context.currentSlide - direction.x);
                },
                options: {
                    boundaryTension: {
                        isStart: () => context.currentSlide === 0,
                        isEnd: () => context.currentSlide === context.snapPoints.length - 1,
                    },
                },
            });

            updateSlide(context.currentSlide);
        },

        destroy: () => {
            context.gestureRecognizer?.destroy();
        },

        getClassNames: () => {
            return {
                container: styles.container,
                wrapper: styles.slidesList,
                track: styles.slidesTrack,
                item: styles.slide,
            };
        },

        useChange: (listener) => {
            context.changeListeners.push(listener);
        },

        setSlide: (index, onChange) => {
            updateSlide(index, onChange);
        },

        toNext: (onChange) => {
            updateSlide(
                getUpdatedPositionByArrowDirection({
                    container: domRefs.container.current as HTMLDivElement,
                    slidesTrack: domRefs.track.current as HTMLDivElement,
                    snapPoints: context.snapPoints,
                    currentScrollPosition: context.scrollPosition,
                    direction: IDirection.RIGHT,
                }),
                onChange,
            );
        },

        toPrev: (onChange) => {
            updateSlide(
                getUpdatedPositionByArrowDirection({
                    container: domRefs.container.current as HTMLDivElement,
                    slidesTrack: domRefs.track.current as HTMLDivElement,
                    snapPoints: context.snapPoints,
                    currentScrollPosition: 9,
                    direction: IDirection.LEFT,
                }),
                onChange,
            );
        },
    };
};

export { SnapSliderModule };
