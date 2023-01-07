import { AnimationResult, Controller, SpringValue } from '@react-spring/web';
import {
    createGesture,
    dragAction,
    GestureHandlers,
    UserGestureConfig,
} from '@use-gesture/vanilla';

import {
    ISwiperPluginClassnames,
    ISwiperPluginBaseConfig,
    ISwiperPluginTransitionEvent,
    RootSwiperPlugin,
} from '../RootSwiperPlugin';

import styles from './styles.module.css';
import { calcSnapPointIndex, getInToRange, getSnapPoints } from '../../utils';

export interface ISnapPointSwiperPluginProps {
    centered?: boolean;
}

interface ISpringValue {
    x: number;
}

export class SnapPointSwiperPlugin extends RootSwiperPlugin<ISnapPointSwiperPluginProps> {
    centered?: boolean;
    snapPoints: number[];
    animateController: Controller<ISpringValue>;
    renderCallback: (event: AnimationResult<SpringValue<ISpringValue>>) => void;

    gesture: (
        element: HTMLDivElement,
        _handler?: GestureHandlers,
        config?: UserGestureConfig,
    ) => void;

    constructor(configs: ISwiperPluginBaseConfig & ISnapPointSwiperPluginProps) {
        super(configs);

        this.centered = configs.centered;

        this.snapPoints = [];

        this.renderCallback = (event) => {
            (
                this.slidesTrack.current as HTMLDivElement
            ).style.transform = `translate3d(${event.value.x}px, 0px, 0px)`;
        };

        this.animateController = new Controller<ISpringValue>({
            x: 0,
            onChange: this.renderCallback,
        });

        this.gesture = createGesture([dragAction]);
    }

    getCSS(): ISwiperPluginClassnames {
        return {
            containerClassName: styles.container,
            slidesListClassName: styles.slidesList,
            slidesTrackClassName: styles.slidesTrack,
            slideClassName: styles.slide,
        };
    }

    onMounted() {
        this.snapPoints = getSnapPoints({
            swiper: this.slidesList.current as HTMLDivElement,
            slidesContainer: this.slidesTrack.current as HTMLDivElement,
            slides: this.slides.current as HTMLDivElement[],
            centered: this.centered,
        });

        let updatedPosition = this.snapPoints[this.currentIndex];

        this.gesture(
            this.slidesTrack.current as HTMLDivElement,
            {
                onDrag: ({ movement, swipe, direction, velocity }) => {
                    updatedPosition = this.snapPoints[this.currentIndex] + movement[0];

                    this.animateController.start({
                        x: updatedPosition,
                        config: {
                            duration: 10,
                        },
                    });
                },
                onDragEnd: ({ swipe: [swipeX] }) => {
                    if (swipeX !== 0) {
                        this.transition({
                            updateIndex: this.currentIndex - swipeX,
                            duration: 130,
                        });

                        return;
                    }

                    const thresholdIndex = calcSnapPointIndex(this.snapPoints, updatedPosition);

                    this.transition({
                        updateIndex: thresholdIndex,
                    });
                },
            },
            {
                drag: {
                    axis: 'x',
                    swipe: {
                        velocity: [0.4, 0.4],
                        distance: [20, 20],
                        duration: 270,
                    },
                },
            },
        );
    }

    onWillUnmounted() {
        super.onWillUnmounted();
    }

    transition(event: ISwiperPluginTransitionEvent): boolean {
        const updatedIndex = getInToRange(event.updateIndex, 0, this.slidesCount);

        this.animateController.start({
            x: this.snapPoints[updatedIndex],
            onRest: () => this.onChange?.({ currentIndex: event.updateIndex }),
            config: {
                duration: event.duration || 150,
            },
        });

        this.updateIndex(updatedIndex);

        return true;
    }
}
