import uniq from 'lodash/uniq';
import { AnimationResult, Controller, SpringValue } from '@react-spring/web';

import {
    ISwiperPluginBaseConfig,
    ISwiperPluginClassnames,
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

    private onUpdateTransitionEndListener = () => {
        this.updateIndex(this.currentIndex);

        (this.slidesTrack.current as HTMLDivElement).style.transitionDuration = '0ms';

        this.slidesTrack.current?.removeEventListener('transitionend', this.onSwipeEndListener);
    };

    private transform = (x: number) => {
        (
            this.slidesTrack.current as HTMLDivElement
        ).style.transform = `translate3d(${x}px, 0px, 0px)`;
    };

    private update = (index: number) => {
        this.currentIndex = getInToRange(index, 0, this.snapPoints.length);

        (this.slidesTrack.current as HTMLDivElement).style.transitionDuration = '300ms';

        this.slidesTrack.current?.addEventListener(
            'transitionend',
            this.onUpdateTransitionEndListener,
        );

        this.transform(this.snapPoints[this.currentIndex]);
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
            target: slidesTrack,
            dragHandler: ({ deltaX }) => {
                const updatedPosition = this.snapPoints[this.currentIndex] + deltaX;

                this.transform(updatedPosition);
            },
            dragEndHandler: ({ deltaX, directionX }) => {
                const updatedPosition = this.snapPoints[this.currentIndex] + deltaX;
                const thresholdIndex = calcSnapPointIndex(this.snapPoints, updatedPosition);

                console.log('drag end nextIndex = ', thresholdIndex);
                console.log('cuurent index = ', this.currentIndex);

                this.update(
                    Math.abs(this.currentIndex - thresholdIndex) > 1
                        ? this.currentIndex + directionX
                        : thresholdIndex,
                );
            },
            swipeHandler: ({ directionX }) => {
                console.log('swipeee end nextIndex = ', this.currentIndex - directionX);
                console.log('cuurent index = ', this.currentIndex);

                this.update(this.currentIndex - directionX);
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
        this.update(event.updatedIndex);
    }

    public toNext(): void {
        this.update(this.currentIndex + 1);
    }

    public toPrevious(): void {
        this.update(this.currentIndex - 1);
    }
}
