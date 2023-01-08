import uniq from 'lodash/uniq';

import { AnimationResult, Controller, SpringValue } from '@react-spring/web';

import {
    ISwiperPluginClassnames,
    ISwiperPluginBaseConfig,
    ISwiperPluginTransitionEvent,
    RootSwiperPlugin,
} from '../RootSwiperPlugin';

import {
    IGestureRecognizer,
    createDragGestureRecognizer,
    calcSnapPointIndex,
    getInToRange,
    getSnapPoints,
} from '../../utils';

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
    renderCallback: (event: AnimationResult<SpringValue<ISpringValue>>) => void;

    gestureRecognizer: IGestureRecognizer;

    constructor(configs: ISnapPointSwiperPluginProps) {
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
    }

    public onMounted() {
        this.snapPoints = getSnapPoints({
            swiper: this.slidesList.current as HTMLDivElement,
            slidesContainer: this.slidesTrack.current as HTMLDivElement,
            slides: this.slides.current as HTMLDivElement[],
            centered: this.centered,
        });

        this.gestureRecognizer = createDragGestureRecognizer({
            target: this.slidesTrack.current as HTMLDivElement,
            dragHandler: ({ deltaX }) => {
                const updatedPosition = this.snapPoints[this.currentIndex] + deltaX;

                this.animateController.start({
                    x: updatedPosition,
                    config: {
                        friction: 50,
                        tension: 800,
                    },
                });
            },
            dragEndHandler: ({ deltaX }) => {
                const updatedPosition = this.snapPoints[this.currentIndex] + deltaX;
                const thresholdIndex = calcSnapPointIndex(this.snapPoints, updatedPosition);

                this.setSlide({
                    updatedIndex: thresholdIndex,
                });
            },
            swipeHandler: ({ directionX }) => {
                const updatedIndex = getInToRange(
                    this.currentIndex - directionX,
                    0,
                    this.snapPoints.length,
                );

                this.animateController.start({
                    x: this.snapPoints[updatedIndex],
                    config: {
                        friction: 50,
                        tension: 400,
                    },
                });

                this.updateIndex(updatedIndex);
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

    public getSwipesCount(): number {
        return uniq(this.snapPoints).length;
    }

    public setSlide(event: ISwiperPluginTransitionEvent): void {
        const updatedIndex = getInToRange(event.updatedIndex, 0, this.snapPoints.length);

        this.animateController.start({
            x: this.snapPoints[updatedIndex],
            onRest: () => this.onChange?.({ currentIndex: event.updatedIndex }),
            config: {
                friction: 50,
                tension: 500,
            },
        });

        this.updateIndex(updatedIndex);
    }

    public toNext(): void {
        this.setSlide({
            updatedIndex: this.currentIndex + 1,
        });
    }

    public toPrevious(): void {
        this.setSlide({
            updatedIndex: this.currentIndex - 1,
        });
    }
}
