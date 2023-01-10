//ssh -i .ssh/id_yandex_cloud yuldash@62.84.121.167

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
import { isReadable } from 'stream';

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
    };

    private transform = (x: number) => {
        (this.slidesTrack.current as HTMLDivElement).style.transform = `translateX(${x}px)`;
    };

    private update = (index: number) => {
        this.currentIndex = getInToRange(index, 0, this.snapPoints.length);

        (this.slidesTrack.current as HTMLDivElement).style.transitionDuration = '400ms';

        this.slidesTrack.current?.addEventListener(
            'transitionend',
            this.onUpdateTransitionEndListener,
            {
                once: true,
            },
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

        const anim = {
            counter: 0,
            startTime: 0,
            currentTime: 0,
            isRun: false,
        };

        this.gestureRecognizer = createDragGestureRecognizer({
            target: slidesTrack,
            dragStartHandler: ({ deltaX }) => {
                anim.startTime = performance.now();
                anim.isRun = true;
            },
            dragHandler: ({ deltaX }) => {
                const updatedPosition = this.snapPoints[this.currentIndex] + deltaX;

                this.transform(updatedPosition);
            },
            dragEndHandler: ({ deltaX, directionX }) => {
                const updatedPosition = this.snapPoints[this.currentIndex] + deltaX;
                const thresholdIndex = calcSnapPointIndex(this.snapPoints, updatedPosition);

                this.update(
                    Math.abs(this.currentIndex - thresholdIndex) > 1
                        ? this.currentIndex + directionX
                        : thresholdIndex,
                );
            },
            swipeHandler: ({ directionX }) => {
                this.update(this.currentIndex - directionX);
            },
        });

        const tick = () => {
            if (!anim.isRun) {
                return requestAnimationFrame(tick);
            }

            anim.currentTime = performance.now() - anim.startTime;
            anim.counter = anim.counter + 1;

            if (anim.currentTime > 1000) {
                console.log('fps = ', anim.counter, ' time = ', anim.currentTime);
                return;
            }

            requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
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
