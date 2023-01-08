import uniq from 'lodash/uniq';
import { AnimationResult, Controller, SpringValue } from '@react-spring/web';

import {
    ISwiperPluginBaseConfig,
    ISwiperPluginClassnames,
    ISwiperPluginCSS,
    ISwiperPluginTransitionEvent,
    RootSwiperPlugin,
} from '../RootSwiperPlugin';

import {
    calcSnapPointIndex,
    createDragGestureRecognizer,
    getInToRange,
    getSnapPoints,
    IGestureRecognizer,
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

        this.animateController = new Controller<ISpringValue>();
    }

    private animate = (index: number, friction: number, tension: number) => {
        this.currentIndex = getInToRange(index, 0, this.snapPoints.length);

        this.animateController.start({
            x: this.snapPoints[this.currentIndex],
            onRest: () => {
                this.updateIndex(this.currentIndex);
                this.onChange?.({ currentIndex: this.currentIndex });
            },
            delay: undefined,
            config: {
                friction,
                tension,
            },
        });
    };

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
                    delay: undefined,
                    config: {
                        friction: 50,
                        tension: 800,
                    },
                });
            },
            dragEndHandler: ({ deltaX }) => {
                const updatedPosition = this.snapPoints[this.currentIndex] + deltaX;
                const thresholdIndex = calcSnapPointIndex(this.snapPoints, updatedPosition);

                this.animate(thresholdIndex, 50, 500);
            },
            swipeHandler: ({ directionX }) => {
                this.animate(this.currentIndex - directionX, 50, 300);
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

    public getStyle(): ISwiperPluginCSS {
        return {
            slidesTrack: this.animateController.springs,
        };
    }

    public getSwipesCount(): number {
        return uniq(this.snapPoints).length;
    }

    public setSlide(event: ISwiperPluginTransitionEvent): void {
        this.animate(event.updatedIndex, 50, 500);
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
