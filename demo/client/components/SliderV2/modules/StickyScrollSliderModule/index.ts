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
import styles from './styles.module.css';
import { calcSnapPointsSafeEdges } from '../../utils/helpers/calcSnapPointsSafeEdges';

class StickyScrollSliderModule extends SliderModule<ISliderOptionsBase> {
    private snapPoints: number[];
    private stickyScrollExecutor: StickyScrollExecutor;

    constructor(options: ISliderOptionsBase) {
        super(options);
    }

    onMount = (elements: Required<ISliderElements>) => {
        this.elements = elements;

        if (this.options.centered) {
            this.snapPoints = calcSnapPointsSafeEdges({
                container: this.elements.wrapper,
                slides: this.elements.slides,
                centered: true,
            });
        } else {
            this.snapPoints = calcSnapPointsBlockEdges({
                container: this.elements.wrapper,
                list: this.elements.list,
                slides: this.elements.slides,
            });
        }

        this.stickyScrollExecutor = new StickyScrollExecutor({
            containerNode: this.elements.wrapper,
            scrollableNode: this.elements.list,
            snapPoints: this.snapPoints,
            safeEdges: true,
        });

        this.initChangeSlidesEventDispatcher();
        this.initLeaveEdgesEventDispatchers();
        this.initEnterEdgesEventDispatchers();

        this.stickyScrollExecutor.scrollTo(this.snapPoints[this.activeSlide]);
    };

    onDestroy = () => {
        this.stickyScrollExecutor.destroy();
    };

    setSlide = ({ activeSlide }: ISetSlideOptions) => {
        const updatedPosition = this.getSnapPointPositionByIndex(activeSlide);
        this.stickyScrollExecutor.scrollTo(updatedPosition);
    };

    toNext = () => {
        const nextPosition = this.getSnapPointPositionByIndex(this.activeSlide + 1);

        this.stickyScrollExecutor.scrollTo(nextPosition);
    };

    toPrev = () => {
        const prevPosition = this.getSnapPointPositionByIndex(this.activeSlide - 1);

        this.stickyScrollExecutor.scrollTo(prevPosition);
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

    private getSnapPointPositionByIndex = (index: number) => {
        if (index < 0) {
            return this.snapPoints[0];
        }

        if (index >= this.snapPoints.length) {
            return this.snapPoints[this.snapPoints.length - 1];
        }

        return this.snapPoints[index];
    };
}

export { StickyScrollSliderModule };
