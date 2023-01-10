//ssh -i .ssh/id_yandex_cloud yuldash@62.84.121.167

import { gsap } from 'gsap';
import Draggable from 'gsap/Draggable';
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

gsap.registerPlugin(Draggable);

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

    startTime = 0;

    public onMounted() {
        const slidesTrack = this.slidesTrack.current as HTMLDivElement;

        this.snapPoints = getSnapPoints({
            swiper: this.slidesList.current as HTMLDivElement,
            slidesContainer: slidesTrack,
            slides: this.slides.current as HTMLDivElement[],
            centered: this.centered,
        });

        Draggable.create(slidesTrack, {
            type: 'x',
            edgeResistance: 0.65,
            inertia: true,
        });

        // gsap.registerPlugin([Draggable]);

        // this.gestureRecognizer = createDragGestureRecognizer({
        //     target: slidesTrack,
        //     dragStartHandler: ({ deltaX }) => {
        //         this.startTime = performance.now();
        //         console.log('deltaX = ', deltaX);
        //     },
        //     dragHandler: ({ deltaX }) => {
        //         const updatedPosition = this.snapPoints[this.currentIndex] + deltaX;
        //
        //         const now = performance.now();
        //         // console.log('startTime = ', this.startTime, '  now = ', now);
        //         const deltaTime = now - this.startTime;
        //         this.startTime = now;
        //         console.log('move; deltaTime = ', deltaTime, '  moveX = ', deltaX);
        //
        //         this.transform(updatedPosition);
        //     },
        //     dragEndHandler: ({ deltaX, directionX }) => {
        //         const updatedPosition = this.snapPoints[this.currentIndex] + deltaX;
        //         const thresholdIndex = calcSnapPointIndex(this.snapPoints, updatedPosition);
        //
        //         const now = performance.now();
        //         const deltaTime = now - this.startTime;
        //         this.startTime = now;
        //         console.log('end drag; deltaTime = ', deltaTime, '  moveX = ', deltaX);
        //
        //         this.update(
        //             Math.abs(this.currentIndex - thresholdIndex) > 1
        //                 ? this.currentIndex + directionX
        //                 : thresholdIndex,
        //         );
        //     },
        //     swipeHandler: ({ directionX }) => {
        //         this.update(this.currentIndex - directionX);
        //     },
        // });
    }

    public onWillUnmounted() {
        // this.gestureRecognizer.destroy();
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
