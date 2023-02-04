class EventsObserver<EventTypes extends { [key in string]: string }, Event> {
    private types: EventTypes;

    private listeners: Record<keyof EventTypes, Array<(event: Event) => void>>;

    constructor(options: { types: EventTypes }) {
        this.types = options.types;
        this.initListeners();
    }

    public addListener = (type: keyof EventTypes, listener: (event: Event) => void) => {
        this.listeners[type].push(listener);
    };

    removeListener = (type: keyof EventTypes, listener: (event: Event) => void) => {
        const index = this.listeners[type].findIndex((item) => item === listener);

        if (index < 0) {
            return;
        }

        this.listeners[type].splice(index, 1);
    };

    public dispatchEvent = (type: keyof EventTypes, event: Event) => {
        this.listeners[type].forEach((listener) => listener(event));
    };

    public clean = () => {
        this.initListeners();
    };

    private initListeners = () => {
        this.listeners = (Object.keys(this.types) as Array<keyof EventTypes>).reduce(
            (acc, type) => {
                acc[type] = [];

                return acc;
            },
            {} as Record<keyof EventTypes, Array<(event: Event) => void>>,
        );
    };
}

export { EventsObserver };
