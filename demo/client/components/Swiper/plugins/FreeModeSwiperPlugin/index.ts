import uniq from 'lodash/uniq';

import { getInToRange, getSnapPoints, calcSnapPointIndex } from '../../utils';

import {
    ISwiperPluginClassnames,
    ISwiperPluginBaseConfig,
    ISwiperPluginTransitionEvent,
    RootSwiperPlugin,
} from '../RootSwiperPlugin';

import styles from './styles.module.css';

export interface IFreeModeSwiperPluginProps extends ISwiperPluginBaseConfig {
    loop?: boolean;
}

export class FreeModeSwiperPlugin extends RootSwiperPlugin<IFreeModeSwiperPluginProps> {
    loop?: boolean;
    snapPoints: number[];

    constructor(configs: IFreeModeSwiperPluginProps) {
        super(configs);

        this.loop = configs.loop;
        this.snapPoints = [];
    }

    private handleScroll(event: Event) {
        const index = calcSnapPointIndex(
            this.snapPoints,
            -1 * (event.target as HTMLDivElement).scrollLeft,
        );

        if (index !== this.currentIndex) {
            this.updateIndex(index);
        }
    }

    public onMounted() {
        this.snapPoints = getSnapPoints({
            swiper: this.slidesList.current as HTMLDivElement,
            slidesContainer: this.slidesTrack.current as HTMLDivElement,
            slides: this.slides.current as HTMLDivElement[],
        });

        this.slidesList.current?.addEventListener('scroll', this.handleScroll);

        this.setSlide({
            updatedIndex: this.currentIndex,
        });
    }

    public onWillUnmounted() {
        this.slidesList.current?.removeEventListener('scroll', this.handleScroll);
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

        this.slidesList.current?.scrollTo({
            left: -this.snapPoints[updatedIndex],
            top: 0,
            behavior: 'smooth',
        });
    }

    public toPrevious() {
        const prevIndex = this.currentIndex - 1;

        let updatedIndex = -1;

        for (let i = prevIndex; i > -1; i--) {
            if (this.snapPoints[i] !== this.snapPoints[this.currentIndex]) {
                updatedIndex = i;

                break;
            }
        }

        this.setSlide({
            updatedIndex,
        });
    }

    public toNext(): void {
        const prevIndex = this.currentIndex + 1;

        let updatedIndex = -1;

        for (let i = prevIndex; i < this.snapPoints.length; i++) {
            if (this.snapPoints[i] !== this.snapPoints[this.currentIndex]) {
                updatedIndex = i;

                break;
            }
        }

        if (!this.loop && updatedIndex === -1) {
            updatedIndex = this.snapPoints.length - 1;
        }

        this.setSlide({
            updatedIndex,
        });
    }
}
