import {
    BaseSlider,
    IBaseSlideEvent,
    IBaseSliderOptions,
    ISetSlideOptions,
    ISliderClassNames,
} from '../BaseSlider';
import { SnapScrollableViewInitializer } from '../../libs/SnapScrollableViewInitializer';
import { getSnapPointsAccordingScrollWidth } from '../../libs';

import styles from './styles.module.css';
import { IScrollEvent } from '../../libs/SnapScrollableViewInitializer/types';

export interface IStickySliderModuleOptions extends IBaseSliderOptions {
    centered?: boolean;
}

class StickySliderModule extends BaseSlider<IStickySliderModuleOptions> {
    snapPoints: number[];

    private FIRST_SLIDE: number;

    private LAST_SLIDE: number;

    scroller: SnapScrollableViewInitializer;

    constructor(options: IStickySliderModuleOptions) {
        super(options);
    }

    private getEvent(event: IScrollEvent): IBaseSlideEvent {
        return {
            currentSlide: event.currentSnapPoint,
        };
    }

    public create() {
        this.snapPoints = getSnapPointsAccordingScrollWidth({
            container: this.nodes.container,
            slidesTrack: this.nodes.list,
            slides: this.nodes.slides,
        });

        this.FIRST_SLIDE = 0;
        this.LAST_SLIDE = this.snapPoints.length - 1;

        this.scroller = new SnapScrollableViewInitializer({
            containerNode: this.nodes.container,
            scrollableNode: this.nodes.list,
            snapPoints: this.snapPoints,
        });

        this.scroller
            .addHandler('SCROLL_START', () => {
                this.resetEventsDispatched();
            })
            .addHandler('SCROLL_END', (event) => {
                this.currentSlide = event.currentSnapPoint;

                this.handlersController.dispatchHandlers('CHANGE', this.getEvent(event));
            })
            .addHandler('SCROLL', (event) => {
                const scrollStart = this.scroller.getScrollXStart();
                const maxScroll = this.scroller.getMaxScrollWidth();

                if (event.scrollX >= scrollStart && this.currentSlide === this.FIRST_SLIDE) {
                    this.dispatchHandlers('LEAVE_FIRST', this.getEvent(event));
                }

                if (event.scrollX <= scrollStart) {
                    this.dispatchHandlers('ENTER_FIRST', this.getEvent(event));
                }

                if (event.scrollX <= maxScroll && this.currentSlide === this.LAST_SLIDE) {
                    this.dispatchHandlers('LEAVE_END', this.getEvent(event));
                }

                if (event.scrollX >= maxScroll) {
                    this.dispatchHandlers('ENTER_END', this.getEvent(event));
                }
            });

        this.scroller.scrollTo({
            x: this.snapPoints[this.currentSlide],
        });
    }

    public destroy() {
        super.destroy();

        this.scroller.destroy();
    }

    public getClassNames(): ISliderClassNames {
        return {
            container: styles.container,
            wrapper: styles.slidesList,
            list: styles.slidesTrack,
            slide: styles.slide,
        };
    }

    public setSlide(options: ISetSlideOptions) {
        super.setSlide(options);
    }

    public toNext() {
        const viewport = this.nodes.container.getBoundingClientRect().width;

        this.scroller.scrollTo({
            x: this.snapPoints[this.currentSlide] + viewport,
            sticky: 'bottom',
        });
    }

    public toPrev() {
        const viewport = this.nodes.container.getBoundingClientRect().width;

        this.scroller.scrollTo({
            x: this.snapPoints[this.currentSlide] - viewport,
            sticky: 'bottom',
        });
    }
}

export { StickySliderModule };
