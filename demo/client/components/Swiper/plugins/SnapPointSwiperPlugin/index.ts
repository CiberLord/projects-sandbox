import { Controller } from '@react-spring/web';

import {
    ISwiperPluginBaseConfig,
    ISwiperPluginClassnames,
    ISwiperPluginTransitionEvent,
    RootSwiperPlugin,
} from '../RootSwiperPlugin';

import { getInToRange } from '../../utils/getInToRange';
import { getSnapPoints } from '../../utils/getSnapPoints';
import { calcSnapPointIndex } from '../../utils/calcSnapPointIndex';
import { createDragGestureRecognizer } from '../../utils/dragGestureRecognizer';
import { IDragGestureRecognizer } from '../../utils/dragGestureRecognizer/types';

import styles from './styles.module.css';

export interface ISnapPointSwiperPluginProps extends ISwiperPluginBaseConfig {
    centered?: boolean;
}

interface ISpringValue {
    x: number;
}

export class SnapPointSwiperPlugin extends RootSwiperPlugin<ISnapPointSwiperPluginProps> {
    centered?: boolean;
    snapPoints: number[];
    animateController: Controller<ISpringValue>;

    gestureRecognizer: IDragGestureRecognizer;

    constructor(configs: ISnapPointSwiperPluginProps) {
        super(configs);

        this.centered = configs.centered;

        this.snapPoints = [];

        this.animateController = new Controller<ISpringValue>({
            x: 0,
            onChange: (event) => {
                (
                    this.slidesTrack.current as HTMLDivElement
                ).style.transform = `translate3d(${event.value.x}px, 0px, 0px)`;
            },
        });
    }

    private update = (index: number) => {
        const prevIndex = this.currentIndex;
        this.currentIndex = getInToRange(index, 0, this.snapPoints.length);

        this.animateController.start({
            x: this.snapPoints[this.currentIndex],
            onRest: () => {
                if (prevIndex === this.currentIndex) {
                    return;
                }

                this.onChange?.({ currentIndex: this.currentIndex });
                this.updateIndex(this.currentIndex);
            },
            config: {
                friction: 50,
                tension: 400,
            },
        });
    };

    public onMounted() {
        const slidesTrack = this.slidesTrack.current as HTMLDivElement;

        this.snapPoints = getSnapPoints({
            swiper: this.slidesList.current as HTMLDivElement,
            slidesContainer: slidesTrack,
            slides: this.slides.current as HTMLDivElement[],
            centered: this.centered,
        });

        this.gestureRecognizer = createDragGestureRecognizer({
            target: this.slidesList.current as HTMLDivElement,
            onDrag: ({ delta }) => {
                const updatedPosition = this.snapPoints[this.currentIndex] + delta.x;

                this.animateController.start({
                    x: updatedPosition,
                    config: {
                        friction: 50,
                        tension: 800,
                    },
                });
            },
            onDragEnd: ({ delta, direction }) => {
                const updatedPosition = this.snapPoints[this.currentIndex] + delta.x;
                const thresholdIndex = calcSnapPointIndex(this.snapPoints, updatedPosition);
                this.update(
                    Math.abs(this.currentIndex - thresholdIndex) > 1
                        ? this.currentIndex + direction.x
                        : thresholdIndex,
                );
            },
            onSwipe: ({ direction }) => {
                this.update(this.currentIndex - direction.x);
            },
            options: {
                boundaryTension: {
                    isStart: () => this.currentIndex === 0,
                    isEnd: () => this.currentIndex === this.snapPoints.length - 1,
                },
            },
        });
    }

    public onWillUnmounted() {
        this.gestureRecognizer.destroy();
    }

    public getCSS(): ISwiperPluginClassnames {
        return {
            containerClassName: styles.container,
            slidesListClassName: styles.slidesList,
            slidesTrackClassName: styles.slidesTrack,
            slideClassName: styles.slide,
        };
    }

    public setSlide(event: ISwiperPluginTransitionEvent): void {
        this.update(event.updatedIndex);
    }

    public toNext(): void {
        this.update(this.currentIndex + 1);
    }

    public toPrevious(): void {
        this.update(this.currentIndex - 1);
    }
}
