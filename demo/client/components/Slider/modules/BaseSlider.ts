import { HandlersController } from '../libs/HandlersController';

export interface ISliderClassNames {
    container?: string;
    wrapper?: string;
    list?: string;
    slide?: string;
}

export interface IBaseSlideEvent {
    currentSlide: number;
}

export type ChangeHandler = (event: IBaseSlideEvent) => void;

export enum BaseSliderHandlerTypes {
    // Событие которое должно выполниться при изменени текущего слайда
    CHANGE = 'CHANGE',
    // Событие которое должно выполниться при движении первого слайда
    LEAVE_FIRST = 'LEAVE_FIRST',
    // Событие которое должно выполниться, когда первый слайд виден
    ENTER_FIRST = 'ENTER_FIRST',
    // Событие которое должно выполниться при движении последнего слайда
    LEAVE_END = 'LEAVE_END',
    // Событие которое должно выполноиться, когда последний слайд виден
    ENTER_END = 'ENTER_END',
}

export interface ISetSlideOptions {
    slide: number;
}

export interface IBaseSliderOptions {
    currentSlide?: number;

    nodes: {
        container: HTMLDivElement;
        wrapper: HTMLDivElement;
        list: HTMLDivElement;
        slides: HTMLDivElement[];
    };

    onChange?: ChangeHandler;
}

export interface IValues {
    dispatchedEvents: Record<BaseSliderHandlerTypes, boolean>;
}

class BaseSlider<Options extends IBaseSliderOptions> {
    currentSlide: number;

    protected nodes: {
        container: HTMLDivElement;
        wrapper: HTMLDivElement;
        list: HTMLDivElement;
        slides: HTMLDivElement[];
    };

    protected handlersController: HandlersController<
        typeof BaseSliderHandlerTypes,
        IBaseSlideEvent
    >;

    protected values: IValues;

    constructor(options: Options) {
        this.currentSlide = options.currentSlide || 0;

        this.handlersController = new HandlersController<
            typeof BaseSliderHandlerTypes,
            IBaseSlideEvent
        >({
            types: BaseSliderHandlerTypes,
        });

        if (options.onChange) {
            this.handlersController.addHandler('CHANGE', options.onChange);
        }

        this.getInitalValues();
    }

    protected dispatchHandlers(
        ...args: Parameters<typeof this.handlersController.dispatchHandlers>
    ) {
        const isDispatched = this.values.dispatchedEvents[args[0]];

        if (isDispatched) {
            return;
        }

        this.values.dispatchedEvents[args[0]] = true;
        this.dispatchHandlers(...args);
    }

    protected getInitalValues() {
        this.values = {
            dispatchedEvents: {
                [BaseSliderHandlerTypes.ENTER_FIRST]: false,
                [BaseSliderHandlerTypes.LEAVE_FIRST]: false,
                [BaseSliderHandlerTypes.ENTER_END]: false,
                [BaseSliderHandlerTypes.LEAVE_END]: false,
                [BaseSliderHandlerTypes.CHANGE]: false,
            },
        };
    }

    protected resetEventsDispatched() {
        (Object.keys(BaseSliderHandlerTypes) as BaseSliderHandlerTypes[]).forEach((eventType) => {
            this.values.dispatchedEvents[eventType] = false;
        });
    }

    public create() {
        // TODO:
    }

    public update() {
        // TODO
    }

    public destroy() {
        this.handlersController.destroy();
    }

    public getClassNames(): ISliderClassNames {
        return {};
    }

    public addHandler(
        ...args: Parameters<typeof this.handlersController.addHandler>
    ): HandlersController<typeof BaseSliderHandlerTypes, IBaseSlideEvent> {
        return this.handlersController.addHandler(...args);
    }

    public setContainerNode(el: HTMLDivElement) {
        this.nodes.container = el;
    }

    public setWrapperNode(el: HTMLDivElement) {
        this.nodes.wrapper = el;
    }

    public appendSlideNode(el: HTMLDivElement) {
        this.nodes.slides.push(el);
    }

    public removeSlideNode(el: HTMLDivElement) {
        const index = this.nodes.slides.findIndex((slide) => slide === el);

        if (index < 0) {
            return;
        }

        this.nodes.slides.splice(index, 1);
    }

    public setSlide(options: ISetSlideOptions) {
        // TODO:
    }

    public toNext() {
        // TODO:
    }

    public toPrev() {
        // TODO:
    }
}

export { BaseSlider };
