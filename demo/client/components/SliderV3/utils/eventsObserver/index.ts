class EventsObserver<EventTypes extends { [key in string]: string }, IEvent> {
    private types: EventTypes;

    private events: Record<keyof EventTypes, Array<(event: IEvent) => void>>;

    constructor(options: { types: EventTypes }) {
        this.types = options.types;

        this.events = this.getInitialEvents();
    }

    public addListener = (type: keyof EventTypes, listener: (event: IEvent) => void) => {
        this.events[type].push(listener);
    };

    public removeListener = (type: keyof EventTypes, listener: (event: IEvent) => void) => {
        const index = this.events[type].findIndex((item) => item === listener);

        if (index < 0) {
            return;
        }

        this.events[type].splice(index, 1);
    };

    public dispatchEvent = (type: keyof EventTypes, event: IEvent) => {
        this.events[type].forEach((listener) => listener(event));
    };

    public clean = () => {
        this.events = this.getInitialEvents();
    };

    private getInitialEvents = () => {
        return (Object.keys(this.types) as Array<keyof EventTypes>).reduce((acc, type) => {
            acc[type] = [];

            return acc;
        }, {} as Record<keyof EventTypes, Array<(event: IEvent) => void>>);
    };
}

export { EventsObserver };
