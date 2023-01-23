import { ChangeHandler, ISliderModuleEntity, ISliderModuleOptions } from '../types';

import styles from './styles.module.css';
import { Controller } from '@react-spring/web';
import { IDragGestureRecognizer } from '../../libs/dragGestureRecognizer/types';
import {
    createDragGestureRecognizer,
    getCurrentSnapPointSlide,
    getSnapPointsAccordingScrollWidth,
    getSnapPointsToSlides,
    getInToRange,
} from '../../libs';

interface ISnapSliderModuleOptions {
    centered?: boolean;
}

interface ISnapPointSliderState {
    currentSlide: number;
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

    const ctx: ISnapPointSliderState = {
        currentSlide: options.currentSlide || 0,

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
            },
        }),

        gestureRecognizer: null,
    };

    const updateSlide = (index: number, onChange?: ChangeHandler) => {
        const prevIndex = ctx.currentSlide;
        ctx.currentSlide = getInToRange(index, 0, ctx.snapPoints.length);

        ctx.animation.start({
            x: ctx.transformPoints[ctx.currentSlide],
            onRest: () => {
                if (prevIndex === ctx.currentSlide) {
                    return;
                }

                ctx.hasAllowPrev = ctx.currentSlide > 0;
                ctx.hasAllowNext = ctx.currentSlide < ctx.snapPoints.length - 1;

                console.log('leng = ', ctx.snapPoints.length, ', curr = ', ctx.currentSlide);

                const changeEvent = {
                    currentSlide: ctx.currentSlide,
                    hasAllowPrev: ctx.hasAllowPrev,
                    hasAllowNext: ctx.hasAllowNext,
                };

                ctx.changeListeners.forEach((listener) => listener(changeEvent));
                options.onChange?.(changeEvent);
            },
            config: {
                friction: 50,
                tension: 400,
            },
        });
    };

    return {
        hasAllowPrev: ctx.hasAllowPrev,
        hasAllowNext: ctx.hasAllowNext,

        create: () => {
            const container = domRefs.container.current as HTMLDivElement;
            const wrapper = domRefs.wrapper.current as HTMLDivElement;
            const slidesTrack = domRefs.track.current as HTMLDivElement;
            const slides = domRefs.slides.current as HTMLDivElement[];

            if (options.centered) {
                ctx.snapPoints = getSnapPointsToSlides({
                    container,
                    slides,
                    centered: options.centered,
                });
            } else {
                ctx.snapPoints = getSnapPointsAccordingScrollWidth({
                    container,
                    wrapper,
                    slidesTrack,
                    slides,
                });
            }

            ctx.transformPoints = ctx.snapPoints.map((point) => -1 * point);

            ctx.gestureRecognizer = createDragGestureRecognizer({
                target: wrapper,
                onDrag: ({ delta }) => {
                    const updatedPosition = ctx.transformPoints[ctx.currentSlide] + delta.x;

                    ctx.animation.start({
                        x: updatedPosition,
                        config: {
                            friction: 50,
                            tension: 800,
                        },
                    });
                },
                onDragEnd: ({ delta, direction }) => {
                    const updatedPosition = ctx.transformPoints[ctx.currentSlide] + delta.x;

                    const targetSlide = getCurrentSnapPointSlide(
                        ctx.snapPoints,
                        -1 * updatedPosition,
                    );

                    const shouldChanged = targetSlide !== ctx.currentSlide;

                    const updatedSlide = shouldChanged
                        ? ctx.currentSlide - direction.x
                        : ctx.currentSlide;

                    updateSlide(updatedSlide);
                },
                onSwipe: ({ direction }) => {
                    updateSlide(ctx.currentSlide - direction.x);
                },
                options: {
                    boundaryTension: {
                        isStart: () => ctx.currentSlide === 0,
                        isEnd: () => ctx.currentSlide === ctx.snapPoints.length - 1,
                    },
                },
            });

            updateSlide(ctx.currentSlide);
        },

        destroy: () => {
            ctx.gestureRecognizer?.destroy();
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
            ctx.changeListeners.push(listener);
        },

        setSlide: (index, onChange) => {
            updateSlide(index, onChange);
        },

        toNext: (onChange) => {
            updateSlide(ctx.currentSlide + 1, onChange);
        },

        toPrev: (onChange) => {
            updateSlide(ctx.currentSlide - 1, onChange);
        },
    };
};

export { SnapSliderModule };
