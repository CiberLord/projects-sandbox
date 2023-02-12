import uniq from 'lodash/uniq';
import debounce from 'lodash/debounce';
import { SliderModeBase } from '../SliderModeBase';
import { EventTypes, ISliderApi, ISliderOptionsBase } from '../../types';
import { calcSnapPoints } from '../../utils/helpers/calcSnapPoints';
import styles from './styles.module.css';
import { getLowIndexBySnapPoints } from '../../utils/helpers/getLowIndexBySnapPoints';
import { getMaxScrollValue } from '../../utils/helpers/getMaxScrollValue';
import { getNearestIndexBySnapPoints } from '../../utils/helpers/getNearestIndexBySnapPoints';

class FreeScrollSliderMode extends SliderModeBase implements ISliderApi {
    private isFirstSlideEntered = true;
    private isLastSlideEntered = false;
    private maxScroll = 0;
    private snapPoints: number[] = [];

    constructor(options: ISliderOptionsBase) {
        super(options);
    }

    public onMount() {
        this.maxScroll = getMaxScrollValue(this.containerElement, this.scrollableElement);
        this.snapPoints = calcSnapPoints({
            containerElement: this.containerElement,
            draggableElement: this.scrollableElement,
            slideElements: this.slideElements,
        });

        this.containerElement.addEventListener('scroll', this.dispatchChangeSlidesEvent);
        this.containerElement.addEventListener('scroll', this.dispatchEnterFirstSlideEvent);
        this.containerElement.addEventListener('scroll', this.dispatchLeaveFirstSlideEvent);
        this.containerElement.addEventListener('scroll', this.dispatchEnterLastSlideEvent);
        this.containerElement.addEventListener('scroll', this.dispatchLeaveLastSlideEvent);

        this.scrollTo(this.snapPoints[this.activeSlide]);

        this.dispatchEvent(EventTypes.MOUNT, {
            activeSlide: this.activeSlide,
        });
    }

    public onUpdate() {
        this.maxScroll = getMaxScrollValue(this.containerElement, this.scrollableElement);
        this.snapPoints = calcSnapPoints({
            containerElement: this.containerElement,
            draggableElement: this.scrollableElement,
            slideElements: this.slideElements,
        });

        this.dispatchEvent(EventTypes.UPDATE, {
            activeSlide: this.activeSlide,
        });
    }

    public onDestroy() {
        this.containerElement.removeEventListener('scroll', this.dispatchChangeSlidesEvent);
        this.containerElement.removeEventListener('scroll', this.dispatchEnterFirstSlideEvent);
        this.containerElement.removeEventListener('scroll', this.dispatchLeaveFirstSlideEvent);
        this.containerElement.removeEventListener('scroll', this.dispatchEnterLastSlideEvent);
        this.containerElement.removeEventListener('scroll', this.dispatchLeaveLastSlideEvent);
    }

    public getSlides() {
        return uniq(this.snapPoints);
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
        this.containerElement.scrollTo({
            left: this.snapPoints[activeSlide],
            behavior: 'smooth',
        });
    }

    public toPrev() {
        const containerEdge = this.getContainerScrollOffset() + this.getContainerSize();
        const offset = containerEdge - this.slideElements[this.activeSlide].offsetLeft;

        this.scrollTo(this.getContainerScrollOffset() - offset);
    }

    public toNext() {
        const containerWidth = this.containerElement.getBoundingClientRect().width;
        const scrollPosition = this.getContainerScrollOffset() + containerWidth;

        let updatedIndex = getLowIndexBySnapPoints(this.snapPoints, scrollPosition + 1);

        // Принудительно ставим следующий слайд, если получили текущую позицию прокрутки
        if (this.snapPoints[updatedIndex] === this.getContainerScrollOffset()) {
            updatedIndex++;
        }

        this.scrollTo(this.snapPoints[updatedIndex]);
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

            this.dispatchEvent(EventTypes.CHANGE, {
                activeSlide: this.activeSlide,
            });
        }
    }, 150);

    private dispatchEnterFirstSlideEvent = (event: Event) => {
        if (this.getContainerScrollOffset() === 0 && !this.isFirstSlideEntered) {
            this.isFirstSlideEntered = true;

            this.dispatchEvent(EventTypes.ENTER_FIRST, {
                activeSlide: this.activeSlide,
            });
        }
    };

    private dispatchLeaveFirstSlideEvent = (event: Event) => {
        if (this.getContainerScrollOffset() > 0 && this.isFirstSlideEntered) {
            this.isFirstSlideEntered = false;

            this.dispatchEvent(EventTypes.LEAVE_FIRST, {
                activeSlide: this.activeSlide,
            });
        }
    };

    private dispatchEnterLastSlideEvent = (event: Event) => {
        if (this.getContainerScrollOffset() >= this.maxScroll && !this.isLastSlideEntered) {
            this.isLastSlideEntered = true;

            this.dispatchEvent(EventTypes.ENTER_LAST, {
                activeSlide: this.activeSlide,
            });
        }
    };

    private dispatchLeaveLastSlideEvent = (event: Event) => {
        if (this.getContainerScrollOffset() < this.maxScroll && this.isLastSlideEntered) {
            this.isLastSlideEntered = false;

            this.dispatchEvent(EventTypes.LEAVE_LAST, {
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

export { FreeScrollSliderMode };
