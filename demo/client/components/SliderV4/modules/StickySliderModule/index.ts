import styles from './styles.module.css';
import { ISliderOptions, SliderEvents, ISliderBuilder, ISliderBuilderContext } from '../../types';
import { StickyScroller } from '../../utils/stickyScroller';
import { calcSnapPoints } from '../../utils/helpers/calcSnapPoints';
import { SliderBuilder } from '../SliderBuilder';

export interface IStickySliderOptions extends ISliderOptions {
    centered?: boolean;
}

class StickySliderBuilder extends SliderBuilder<IStickySliderOptions> implements ISliderBuilder {
    snapPoints: number[];
    scroller: StickyScroller;

    constructor(context: ISliderBuilderContext, options: IStickySliderOptions) {
        super(context, options);

        this.snapPoints = this.getSnapPoints();
        this.scroller = new StickyScroller({
            containerElement: this.containerElement,
            draggableElement: this.scrollableElement,
            snapPoints: this.snapPoints,
        });

        this.initChangeSlidesEventDispatcher();
        this.initLeaveEdgesEventDispatchers();
        this.initEnterEdgesEventDispatchers();
        this.scrollToActiveSlide();
    }

    update() {
        this.snapPoints = this.getSnapPoints();
        this.scroller.setSnapPoints(this.snapPoints);
    }

    destroy() {
        this.scroller.destroy();
    }

    getSlideMovesCount() {
        return this.snapPoints.length;
    }

    toPrev() {
        this.scrollToSlide(this.activeSlide - 1);
    }

    toNext() {
        this.scrollToSlide(this.activeSlide + 1);
    }

    setSlide(activeSlide: number) {
        this.scrollToSlide(activeSlide);
    }

    private getSnapPoints() {
        return calcSnapPoints({
            containerElement: this.containerElement,
            scrollableElement: this.scrollableElement,
            slideElements: this.slideElements,
            centered: this.options.centered,
        });
    }

    private initChangeSlidesEventDispatcher = () => {
        this.scroller.addListener('scrollEnd', (event) => {
            if (this.activeSlide !== event.currentSnapPointIndex) {
                this.activeSlide = event.currentSnapPointIndex;
                this.dispatchEvent(SliderEvents.change, {
                    activeSlide: this.activeSlide,
                });
            }
        });
    };

    private initLeaveEdgesEventDispatchers = () => {
        this.scroller.addListener('scrollStart', (event) => {
            const startSlide = 0;
            const startSlidePosition = this.snapPoints[startSlide];
            const lastSlide = this.snapPoints.length - 1;
            const lastSlidePosition = this.snapPoints[lastSlide];

            if (this.activeSlide === startSlide && event.scrollValue > startSlidePosition) {
                this.dispatchEvent(SliderEvents.leaveFirst, {
                    activeSlide: this.activeSlide,
                });
            }

            if (this.activeSlide === lastSlide && event.scrollValue < lastSlidePosition) {
                this.dispatchEvent(SliderEvents.leaveLast, {
                    activeSlide: this.activeSlide,
                });
            }
        });
    };

    private initEnterEdgesEventDispatchers = () => {
        this.scroller.addListener('scrollEnd', (event) => {
            const startSlide = 0;
            const lastSlide = this.snapPoints.length - 1;

            if (event.scrollValue <= this.snapPoints[startSlide]) {
                return this.dispatchEvent(SliderEvents.enterFirst, {
                    activeSlide: this.activeSlide,
                });
            }

            if (event.scrollValue >= this.snapPoints[lastSlide]) {
                return this.dispatchEvent(SliderEvents.enterLast, {
                    activeSlide: this.activeSlide,
                });
            }
        });
    };

    private scrollToActiveSlide() {
        this.scrollToSlide(this.activeSlide);
    }

    private scrollToSlide(index: number) {
        this.scroller.scrollTo(this.snapPoints[index]);
    }
}

export const module = {
    builder: StickySliderBuilder,
    styles,
};
