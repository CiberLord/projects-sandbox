import uniq from 'lodash/uniq';
import { ISliderApi, ISliderOptionsBase } from '../../types';
import { SliderModeBase } from '../SliderModeBase';

import { StickyScroller } from '../../utils/stickyScroller';
import { calcSnapPoints } from '../../utils/helpers/calcSnapPoints';
import { EventTypes } from '../../types';
import styles from './styles.module.css';

class StickySliderMode extends SliderModeBase implements ISliderApi {
    scroller!: StickyScroller;
    snapPoints: number[] = [];

    constructor(props: ISliderOptionsBase) {
        super(props);
    }

    public onMount() {
        this.snapPoints = uniq(
            calcSnapPoints({
                containerElement: this.containerElement,
                draggableElement: this.scrollableElement,
                slideElements: this.slideElements,
                centered: this.options.centered,
            }),
        );

        this.scroller = new StickyScroller({
            containerElement: this.containerElement,
            draggableElement: this.scrollableElement,
            snapPoints: this.snapPoints,
        });

        this.initChangeSlidesEventDispatcher();
        this.initLeaveEdgesEventDispatchers();
        this.initEnterEdgesEventDispatchers();

        this.scroller.scrollTo(this.snapPoints[this.activeSlide]);

        this.dispatchEvent(EventTypes.MOUNT, {
            activeSlide: this.activeSlide,
        });
    }

    public onUpdate() {
        this.snapPoints = uniq(
            calcSnapPoints({
                containerElement: this.containerElement,
                draggableElement: this.scrollableElement,
                slideElements: this.slideElements,
                centered: this.options.centered,
            }),
        );

        this.scroller.setSnapPoints(this.snapPoints);

        this.dispatchEvent(EventTypes.UPDATE, {
            activeSlide: this.activeSlide,
        });
    }

    public onDestroy() {
        this.scroller.destroy();

        this.dispatchEvent(EventTypes.DESTROY, {
            activeSlide: this.activeSlide,
        });
    }

    public getSlides() {
        return this.snapPoints;
    }

    public getElementsAttributes(): ReturnType<ISliderApi['getElementsAttributes']> {
        return {
            container: {
                className: styles.container,
            },
            scrollable: {
                className: styles.scrollable,
            },
            slide: {
                className: styles.slide,
            },
        };
    }

    public setSlide(...[{ activeSlide }]: Parameters<ISliderApi['setSlide']>) {
        const updatedPosition = this.snapPoints[activeSlide];

        this.scroller.scrollTo(updatedPosition);
    }

    public toNext() {
        const nextPosition = this.snapPoints[this.activeSlide + 1];

        this.scroller.scrollTo(nextPosition);
    }

    public toPrev() {
        const prevPosition = this.snapPoints[this.activeSlide - 1];

        this.scroller.scrollTo(prevPosition);
    }

    private initChangeSlidesEventDispatcher = () => {
        this.scroller.addListener('SCROLL_END', (event) => {
            if (this.activeSlide !== event.currentSnapPointIndex) {
                this.activeSlide = event.currentSnapPointIndex;
                this.dispatchEvent(EventTypes.CHANGE, {
                    activeSlide: this.activeSlide,
                });
            }
        });
    };

    private initLeaveEdgesEventDispatchers = () => {
        this.scroller.addListener('SCROLL_START', (event) => {
            const startSlide = 0;
            const startSlidePosition = this.snapPoints[startSlide];
            const lastSlide = this.snapPoints.length - 1;
            const lastSlidePosition = this.snapPoints[lastSlide];

            if (this.activeSlide === startSlide && event.scrollValue > startSlidePosition) {
                this.dispatchEvent(EventTypes.LEAVE_FIRST, {
                    activeSlide: this.activeSlide,
                });
            }

            if (this.activeSlide === lastSlide && event.scrollValue < lastSlidePosition) {
                this.dispatchEvent(EventTypes.LEAVE_LAST, {
                    activeSlide: this.activeSlide,
                });
            }
        });
    };

    private initEnterEdgesEventDispatchers = () => {
        this.scroller.addListener('SCROLL_END', (event) => {
            const startSlide = 0;
            const lastSlide = this.snapPoints.length - 1;

            if (event.scrollValue <= this.snapPoints[startSlide]) {
                return this.dispatchEvent(EventTypes.ENTER_FIRST, {
                    activeSlide: this.activeSlide,
                });
            }

            if (event.scrollValue >= this.snapPoints[lastSlide]) {
                return this.dispatchEvent(EventTypes.ENTER_LAST, {
                    activeSlide: this.activeSlide,
                });
            }
        });
    };
}

export { StickySliderMode };
