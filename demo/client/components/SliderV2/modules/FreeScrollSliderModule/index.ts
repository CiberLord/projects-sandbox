import { SliderModule } from '../SliderModule';
import {
    EventTypes,
    ISetSlideOptions,
    ISliderClassNames,
    ISliderElements,
    ISliderOptionsBase,
} from '../../types';
import { calcSnapPointsBlockEdges } from '../../utils/helpers/calcSnapPointsBlockEdges';
import styles from './styles.module.css';
import { getBottomSnapSlideByScrollPosition } from '../../utils/helpers/getBottomSnapSlideByScrollPosition';

class FreeScrollSliderModule extends SliderModule<ISliderOptionsBase> {
    snapPoints: number[];
    maxScroll: number;

    isFirstSlideEntered = true;
    isLastSlideEntered = false;

    constructor(options: ISliderOptionsBase) {
        super(options);
    }

    onMount = (elements: Required<ISliderElements>) => {
        this.elements = elements;
        this.maxScroll = this.calcMaxScroll();
        this.snapPoints = calcSnapPointsBlockEdges({
            container: elements.wrapper,
            list: elements.list,
            slides: elements.slides,
        });

        console.log('snapPoints = ', this.snapPoints);

        this.elements.wrapper.addEventListener('scroll', this.dispatchChangeSlidesEvent);
        this.elements.wrapper.addEventListener('scroll', this.dispatchEnterFirstSlideEvent);
        this.elements.wrapper.addEventListener('scroll', this.dispatchLeaveFirstSlideEvent);
        this.elements.wrapper.addEventListener('scroll', this.dispatchEnterLastSlideEvent);
        this.elements.wrapper.addEventListener('scroll', this.dispatchLeaveLastSlideEvent);

        this.elements.wrapper.scrollTo({
            left: this.snapPoints[this.activeSlide],
            behavior: 'smooth',
        });
    };

    onDestroy = () => {
        this.elements.wrapper.removeEventListener('scroll', this.dispatchChangeSlidesEvent);
        this.elements.wrapper.removeEventListener('scroll', this.dispatchEnterFirstSlideEvent);
        this.elements.wrapper.removeEventListener('scroll', this.dispatchLeaveFirstSlideEvent);
        this.elements.wrapper.removeEventListener('scroll', this.dispatchEnterLastSlideEvent);
        this.elements.wrapper.removeEventListener('scroll', this.dispatchLeaveLastSlideEvent);
    };

    getClassNames = (): ISliderClassNames => {
        return {
            container: styles.container,
            wrapper: styles.wrapper,
            list: styles.track,
            slide: styles.slide,
        };
    };

    setSlide = (options: ISetSlideOptions) => {
        this.elements.wrapper.scrollTo({
            left: this.snapPoints[options.activeSlide],
            behavior: 'smooth',
        });
    };

    toPrev = () => {
        const hiddenIndex = getBottomSnapSlideByScrollPosition(
            this.snapPoints,
            this.elements.wrapper.scrollLeft,
        );

        const updatedIndex = Math.max(hiddenIndex - 1, 0);

        this.elements.wrapper.scrollTo({
            left: this.snapPoints[updatedIndex],
            behavior: 'smooth',
        });
    };

    toNext = () => {
        const containerWidth = this.elements.wrapper.getBoundingClientRect().width;
        const scrollPosition = this.elements.wrapper.scrollLeft + containerWidth;

        const updatedIndex = getBottomSnapSlideByScrollPosition(this.snapPoints, scrollPosition);

        this.elements.wrapper.scrollTo({
            left: this.snapPoints[updatedIndex],
            behavior: 'smooth',
        });
    };

    private dispatchChangeSlidesEvent = (event: Event) => {
        // const scrollPosition = (event.target as HTMLDivElement).scrollLeft;
        // const updatedActiveSlide = getCurrentSnapPointSlide(this.snapPoints, scrollPosition);
        //
        // if (updatedActiveSlide !== this.activeSlide) {
        //     this.activeSlide = updatedActiveSlide;
        //
        //     this.dispatchEvents(EventTypes.CHANGE, {
        //         activeSlide: this.activeSlide,
        //     });
        // }
    };

    private dispatchEnterFirstSlideEvent = (event: Event) => {
        const scrollPosition = (event.target as HTMLDivElement).scrollLeft;

        if (scrollPosition === 0 && !this.isFirstSlideEntered) {
            this.isFirstSlideEntered = true;

            this.dispatchEvents(EventTypes.ENTER_FIRST, {
                activeSlide: this.activeSlide,
            });
        }
    };

    private dispatchLeaveFirstSlideEvent = (event: Event) => {
        const scrollPosition = (event.target as HTMLDivElement).scrollLeft;

        if (scrollPosition > 0 && this.isFirstSlideEntered) {
            this.isFirstSlideEntered = false;

            this.dispatchEvents(EventTypes.LEAVE_FIRST, {
                activeSlide: this.activeSlide,
            });
        }
    };

    private dispatchEnterLastSlideEvent = (event: Event) => {
        const scrollPosition = (event.target as HTMLDivElement).scrollLeft;

        if (scrollPosition >= this.maxScroll && !this.isLastSlideEntered) {
            this.isLastSlideEntered = true;

            this.dispatchEvents(EventTypes.ENTER_LAST, {
                activeSlide: this.activeSlide,
            });
        }
    };

    private dispatchLeaveLastSlideEvent = (event: Event) => {
        const scrollPosition = (event.target as HTMLDivElement).scrollLeft;

        if (scrollPosition < this.maxScroll && this.isLastSlideEntered) {
            this.isLastSlideEntered = false;

            this.dispatchEvents(EventTypes.LEAVE_LAST, {
                activeSlide: this.activeSlide,
            });
        }
    };

    private calcMaxScroll = () => {
        const scrollWidth = this.elements.wrapper.scrollWidth;
        const containerWidth = this.elements.wrapper.getBoundingClientRect().width;

        return scrollWidth - containerWidth;
    };
}

export { FreeScrollSliderModule };
