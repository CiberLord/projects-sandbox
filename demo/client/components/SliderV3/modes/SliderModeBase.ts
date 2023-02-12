import { EventTypes, ISliderApi, ISliderEvent, ISliderOptionsBase, Slide } from '../types';
import { EventsObserver } from '../utils/eventsObserver';

class SliderModeBase
    implements
        Pick<
            ISliderApi,
            | 'addListener'
            | 'removeListener'
            | 'setScrollableElement'
            | 'setContainerElement'
            | 'addSlideElement'
            | 'getActiveSlide'
            | 'removeSlideElement'
        >
{
    protected activeSlide: Slide;
    protected options: ISliderOptionsBase;
    protected eventObserver: EventsObserver<typeof EventTypes, ISliderEvent>;
    protected containerElement: HTMLDivElement;
    protected scrollableElement: HTMLDivElement;
    protected slideElements: HTMLDivElement[];

    constructor(options: ISliderOptionsBase) {
        this.options = options;
        this.activeSlide = options.activeSlide || 0;
        this.slideElements = [];
        this.eventObserver = new EventsObserver<typeof EventTypes, ISliderEvent>({
            types: EventTypes,
        });

        if (options.onChange) {
            this.eventObserver.addListener(EventTypes.CHANGE, options.onChange);
        }
    }

    public getActiveSlide() {
        return this.activeSlide;
    }

    public setContainerElement = (el: HTMLDivElement | null) => {
        if (el) {
            this.containerElement = el;
        }
    };

    public setScrollableElement = (el: HTMLDivElement | null) => {
        if (el) {
            this.scrollableElement = el;
        }
    };

    public addSlideElement = (el: HTMLDivElement | null) => {
        if (el) {
            this.slideElements.push(el);
            this.dispatchEvent(EventTypes.ADD_SLIDE, {
                activeSlide: this.activeSlide,
            });
        }
    };

    public removeSlideElement = (el: HTMLDivElement | null) => {
        const targetIndex = this.slideElements.findIndex((elem) => elem === el);

        if (targetIndex > -1) {
            this.slideElements.splice(targetIndex, 1);
            this.dispatchEvent(EventTypes.REMOVE_SLIDE, {
                activeSlide: this.activeSlide,
            });
        }
    };

    public addListener(...args: Parameters<typeof this.eventObserver.addListener>) {
        this.eventObserver.addListener(...args);
    }

    public removeListener(...args: Parameters<typeof this.eventObserver.removeListener>) {
        this.eventObserver.removeListener(...args);
    }

    protected dispatchEvent(...args: Parameters<typeof this.eventObserver.dispatchEvent>) {
        this.eventObserver.dispatchEvent(...args);
    }
}

export { SliderModeBase };
