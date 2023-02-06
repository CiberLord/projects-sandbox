import {
    ISliderOptionsBase,
    ISliderClassNames,
    ISliderElements,
    EventTypes,
    ISliderEvent,
    ISliderModule,
    SliderListener,
    ISetSlideOptions,
} from '../types';
import { EventsObserver } from '../utils/eventsObserver';
import { IScrollEvent } from '../utils/stickyScrollExecutor/types';

class SliderModule<Options extends ISliderOptionsBase> implements ISliderModule {
    activeSlide: number;

    options: Options;

    elements: Required<ISliderElements>;

    eventsObserver: EventsObserver<typeof EventTypes, ISliderEvent>;

    constructor(options: Options) {
        this.options = options;
        this.activeSlide = options.activeSlide || 0;

        this.eventsObserver = new EventsObserver<typeof EventTypes, ISliderEvent>({
            types: EventTypes,
        });

        if (options.onChange) {
            this.eventsObserver.addListener('CHANGE', options.onChange);
        }
    }

    public onMount = (elements: Required<ISliderElements>) => {
        this.elements = elements;
    };

    public onUpdate = (elements: Required<ISliderElements>) => {
        this.elements = elements;
    };

    public onDestroy = () => {
        // TODO:
    };

    public getClassNames = (): ISliderClassNames => {
        return {};
    };

    public setSlide = (options: ISetSlideOptions) => {
        // TODO:
    };

    public toNext = () => {
        // TODO:
    };

    public toPrev = () => {
        // TODO:
    };

    public addListener = (type: EventTypes, listener: SliderListener) => {
        this.eventsObserver.addListener(type, listener);
    };

    protected getEvent = (scrollEvent: IScrollEvent): ISliderEvent => {
        return {
            activeSlide: scrollEvent.currentSnapPoint,
        };
    };

    protected dispatchEvents = (type: EventTypes, event: ISliderEvent) => {
        this.eventsObserver.dispatchEvent(type, event);
    };
}

export { SliderModule };
