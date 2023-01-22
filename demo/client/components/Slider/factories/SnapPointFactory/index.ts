import { ChangeHandler, ISliderModule } from '../types';

import styles from './styles.module.css';
import { Controller } from '@react-spring/web';
import { IDragGestureRecognizer } from '../../libs/dragGestureRecognizer/types';
import {
    createDragGestureRecognizer,
    calcSnapPointIndex,
    getSnapPoints,
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
    animation: Controller<{ x: number }>;
    gestureRecognizer: IDragGestureRecognizer | null;
}

const SnapSliderModule: ISliderModule<ISnapSliderModuleOptions> = (options) => {
    const { domRefs } = options;

    const state: ISnapPointSliderState = {
        currentSlide: options.currentSlide || 0,

        hasAllowPrev: false,
        hasAllowNext: true,

        snapPoints: [],

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
        const prevIndex = state.currentSlide;
        state.currentSlide = getInToRange(index, 0, state.snapPoints.length);

        state.animation.start({
            x: state.snapPoints[state.currentSlide],
            onRest: () => {
                if (prevIndex === state.currentSlide) {
                    return;
                }

                state.hasAllowPrev = state.currentSlide > 0;
                state.hasAllowNext = state.currentSlide < state.snapPoints.length - 1;

                const changeEvent = {
                    currentSlide: state.currentSlide,
                    hasAllowPrev: state.hasAllowPrev,
                    hasAllowNext: state.hasAllowNext,
                };

                options.onChange?.(changeEvent);
                onChange?.(changeEvent);
            },
            config: {
                friction: 50,
                tension: 400,
            },
        });
    };

    return {
        hasAllowPrev: state.hasAllowPrev,
        hasAllowNext: state.hasAllowNext,

        create: () => {
            const slidesWrapper = domRefs.wrapper.current as HTMLDivElement;
            const slidesTrack = domRefs.track.current as HTMLDivElement;
            const slides = domRefs.slides.current as HTMLDivElement[];

            state.snapPoints = getSnapPoints({
                slidesContainer: slidesTrack,
                swiper: slidesWrapper,
                slides: slides,
                centered: options.centered,
            });

            state.gestureRecognizer = createDragGestureRecognizer({
                target: slidesWrapper,
                onDrag: ({ delta }) => {
                    const updatedPosition = state.snapPoints[state.currentSlide] + delta.x;

                    state.animation.start({
                        x: updatedPosition,
                        config: {
                            friction: 50,
                            tension: 800,
                        },
                    });
                },
                onDragEnd: ({ delta, direction }) => {
                    const updatedPosition = state.snapPoints[state.currentSlide] + delta.x;
                    const thresholdIndex = calcSnapPointIndex(state.snapPoints, updatedPosition);
                    updateSlide(
                        Math.abs(state.currentSlide - thresholdIndex) > 1
                            ? state.currentSlide + direction.x
                            : thresholdIndex,
                    );
                },
                onSwipe: ({ direction }) => {
                    updateSlide(state.currentSlide - direction.x);
                },
                options: {
                    boundaryTension: {
                        isStart: () => state.currentSlide === 0,
                        isEnd: () => state.currentSlide === state.snapPoints.length - 1,
                    },
                },
            });

            updateSlide(state.currentSlide);
        },

        destroy: () => {
            state.gestureRecognizer?.destroy();
        },

        getClassNames: () => {
            return {
                container: styles.container,
                wrapper: styles.slidesList,
                track: styles.slidesTrack,
                item: styles.slide,
            };
        },

        setSlide: (index, onChange) => {
            updateSlide(index, onChange);
        },

        toNext: (onChange) => {
            const container = domRefs.container.current as HTMLDivElement;
            const containerWidth = container.clientWidth;

            console.log('containerWidth', containerWidth);

            updateSlide(state.currentSlide + 1, onChange);
        },

        toPrev: (onChange) => {
            updateSlide(state.currentSlide - 1, onChange);
        },
    };
};

export { SnapSliderModule };
