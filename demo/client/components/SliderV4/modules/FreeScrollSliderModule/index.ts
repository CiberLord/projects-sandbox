import debounce from 'lodash/debounce';
import { SliderBuilder } from '../SliderBuilder';
import { ISliderOptions, SliderEvents, ISliderBuilder, ISliderBuilderContext } from '../../types';
import { calcSnapPoints } from '../../utils/helpers/calcSnapPoints';
import { getNearestIndexBySnapPoints } from '../../utils/helpers/getNearestIndexBySnapPoints';

import styles from './styles.module.css';
import { getMaxScrollValue } from '../../utils/helpers/getMaxScrollValue';
import { getLowIndexBySnapPoints } from '../../../SliderV3/utils/helpers/getLowIndexBySnapPoints';

export type IFreeScrollSliderOptions = ISliderOptions;

class FreeScrollSliderBuilder
    extends SliderBuilder<IFreeScrollSliderOptions>
    implements ISliderBuilder
{
    private isFirstSlideEntered = true;
    private isLastSlideEntered = false;
    private maxScroll = 0;
    private snapPoints: number[] = [];

    constructor(context: ISliderBuilderContext, options: IFreeScrollSliderOptions) {
        super(context, options);

        this.maxScroll = getMaxScrollValue(this.containerElement, this.scrollableElement);
        this.snapPoints = this.getSnapPoints();

        this.containerElement.addEventListener('scroll', this.dispatchChangeSlidesEvent);
        this.containerElement.addEventListener('scroll', this.dispatchEnterFirstSlideEvent);
        this.containerElement.addEventListener('scroll', this.dispatchLeaveFirstSlideEvent);
        this.containerElement.addEventListener('scroll', this.dispatchEnterLastSlideEvent);
        this.containerElement.addEventListener('scroll', this.dispatchLeaveLastSlideEvent);

        this.scrollTo(this.snapPoints[this.activeSlide]);
    }

    update() {
        this.maxScroll = getMaxScrollValue(this.containerElement, this.scrollableElement);
        this.snapPoints = this.getSnapPoints();
    }

    destroy() {
        this.containerElement.removeEventListener('scroll', this.dispatchChangeSlidesEvent);
        this.containerElement.removeEventListener('scroll', this.dispatchEnterFirstSlideEvent);
        this.containerElement.removeEventListener('scroll', this.dispatchLeaveFirstSlideEvent);
        this.containerElement.removeEventListener('scroll', this.dispatchEnterLastSlideEvent);
        this.containerElement.removeEventListener('scroll', this.dispatchLeaveLastSlideEvent);
    }

    getSlideMovesCount() {
        return this.snapPoints.length;
    }

    toNext() {
        const containerWidth = this.containerElement.getBoundingClientRect().width;
        const scrollPosition = this.getContainerScrollOffset() + containerWidth;

        let updatedIndex = getLowIndexBySnapPoints(this.snapPoints, scrollPosition + 1);

        // Принудительно ставить следующий слайд, если получили текущую позицию прокрутки
        if (this.snapPoints[updatedIndex] === this.getContainerScrollOffset()) {
            updatedIndex++;
        }

        this.scrollTo(this.snapPoints[updatedIndex]);
    }

    toPrev() {
        const containerEdge = this.getContainerScrollOffset() + this.getContainerSize();
        const offset = containerEdge - this.slideElements[this.activeSlide].offsetLeft;

        this.scrollTo(this.getContainerScrollOffset() - offset);
    }

    setSlide(activeSlide: number) {
        this.scrollTo(this.snapPoints[activeSlide]);
    }

    private getSnapPoints() {
        return calcSnapPoints({
            containerElement: this.containerElement,
            scrollableElement: this.scrollableElement,
            slideElements: this.slideElements,
        });
    }

    private dispatchChangeSlidesEvent = debounce((event: Event) => {
        let updatedActiveSlide = getNearestIndexBySnapPoints(
            this.snapPoints,
            this.getContainerScrollOffset(),
        );

        if (this.snapPoints[updatedActiveSlide] < this.getContainerScrollOffset()) {
            updatedActiveSlide++;
        }

        if (updatedActiveSlide !== this.activeSlide) {
            this.activeSlide = updatedActiveSlide;

            this.dispatchEvent(SliderEvents.change, {
                activeSlide: this.activeSlide,
            });
        }
    }, 150);

    private dispatchEnterFirstSlideEvent = (event: Event) => {
        if (this.getContainerScrollOffset() === 0 && !this.isFirstSlideEntered) {
            this.isFirstSlideEntered = true;

            this.dispatchEvent(SliderEvents.enterFirst, {
                activeSlide: this.activeSlide,
            });
        }
    };

    private dispatchLeaveFirstSlideEvent = (event: Event) => {
        if (this.getContainerScrollOffset() > 0 && this.isFirstSlideEntered) {
            this.isFirstSlideEntered = false;

            this.dispatchEvent(SliderEvents.leaveFirst, {
                activeSlide: this.activeSlide,
            });
        }
    };

    private dispatchEnterLastSlideEvent = (event: Event) => {
        if (this.getContainerScrollOffset() >= this.maxScroll && !this.isLastSlideEntered) {
            this.isLastSlideEntered = true;

            this.dispatchEvent(SliderEvents.enterLast, {
                activeSlide: this.activeSlide,
            });
        }
    };

    private dispatchLeaveLastSlideEvent = (event: Event) => {
        if (this.getContainerScrollOffset() < this.maxScroll && this.isLastSlideEntered) {
            this.isLastSlideEntered = false;

            this.dispatchEvent(SliderEvents.leaveLast, {
                activeSlide: this.activeSlide,
            });
        }
    };

    private scrollTo(value: number) {
        this.containerElement.scrollTo({
            left: value,
            behavior: 'smooth',
        });
    }

    private getContainerScrollOffset = () => {
        return this.containerElement.scrollLeft;
    };

    private getContainerSize = () => {
        return this.containerElement.getBoundingClientRect().width;
    };
}

export const module = {
    builder: FreeScrollSliderBuilder,
    styles,
};
