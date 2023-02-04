import { SliderModule } from '../SliderModule';
import {
    EventTypes,
    ISetSlideOptions,
    ISliderClassNames,
    ISliderElements,
    ISliderOptionsBase,
} from '../../types';
import { calcSnapPointsBlockEdges } from '../../utils/helpers/calcSnapPointsBlockEdges';
import { StickyScrollExecutor } from '../../utils/stickyScrollExecutor';
import { Sticky } from '../../utils/stickyScrollExecutor/types';
import styles from './styles.module.css';

class StickyScrollSliderModule extends SliderModule<ISliderOptionsBase> {
    private snapPoints: number[];
    private stickyScrollExecutor: StickyScrollExecutor;

    constructor(options: ISliderOptionsBase) {
        super(options);
    }

    onMount = (elements: Required<ISliderElements>) => {
        this.elements = elements;

        this.snapPoints = calcSnapPointsBlockEdges({
            container: this.elements.wrapper,
            list: this.elements.list,
            slides: this.elements.slides,
        });

        this.stickyScrollExecutor = new StickyScrollExecutor({
            containerNode: this.elements.wrapper,
            scrollableNode: this.elements.list,
            snapPoints: this.snapPoints,
        });

        this.initChangeSlidesEventDispatcher();
        this.initLeaveEdgesEventDispatchers();
        this.initEnterEdgesEventDispatchers();

        this.stickyScrollExecutor.scrollTo(this.snapPoints[this.activeSlide], Sticky.NEAREST);
    };

    onDestroy = () => {
        this.stickyScrollExecutor.destroy();
    };

    setSlide = ({ activeSlide }: ISetSlideOptions) => {
        this.stickyScrollExecutor.scrollTo(this.snapPoints[activeSlide]);
    };

    toNext = () => {
        const containerWidth = this.elements.container.getBoundingClientRect().width;
        const nextScrollPosition = this.snapPoints[this.activeSlide] + containerWidth;
        this.stickyScrollExecutor.scrollTo(nextScrollPosition, Sticky.LOW);
    };

    toPrev = () => {
        const containerWidth = this.elements.container.getBoundingClientRect().width;
        const nextScrollPosition = this.snapPoints[this.activeSlide] - containerWidth;

        this.stickyScrollExecutor.scrollTo(nextScrollPosition, Sticky.NEAREST);
    };

    getClassNames = (): ISliderClassNames => {
        return {
            container: styles.container,
            wrapper: styles.wrapper,
            list: styles.track,
            slide: styles.slide,
        };
    };

    private initChangeSlidesEventDispatcher = () => {
        this.stickyScrollExecutor.addListener('SCROLL_END', (event) => {
            if (this.activeSlide !== event.currentSnapPoint) {
                this.activeSlide = event.currentSnapPoint;
                this.dispatchEvents(EventTypes.CHANGE, this.getEvent(event));
            }
        });
    };

    private initLeaveEdgesEventDispatchers = () => {
        this.stickyScrollExecutor.addListener('SCROLL_START', (event) => {
            const startSlide = 0;
            const startSlidePosition = this.snapPoints[startSlide];
            const lastSlide = this.snapPoints.length - 1;
            const lastSlidePosition = this.snapPoints[lastSlide];

            if (this.activeSlide === startSlide && event.scrollValue > startSlidePosition) {
                this.dispatchEvents(EventTypes.LEAVE_FIRST, this.getEvent(event));
            }

            if (this.activeSlide === lastSlide && event.scrollValue < lastSlidePosition) {
                this.dispatchEvents(EventTypes.LEAVE_LAST, this.getEvent(event));
            }
        });
    };

    private initEnterEdgesEventDispatchers = () => {
        this.stickyScrollExecutor.addListener('SCROLL_END', (event) => {
            const startSlide = 0;
            const lastSlide = this.snapPoints.length - 1;

            if (event.scrollValue <= this.snapPoints[startSlide]) {
                return this.dispatchEvents(EventTypes.ENTER_FIRST, this.getEvent(event));
            }

            if (event.scrollValue >= this.snapPoints[lastSlide]) {
                return this.dispatchEvents(EventTypes.ENTER_LAST, this.getEvent(event));
            }
        });
    };
}

export { StickyScrollSliderModule };
