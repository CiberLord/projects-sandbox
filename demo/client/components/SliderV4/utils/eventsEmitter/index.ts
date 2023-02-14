class EventsEmitter<EventTypes extends { [key in string]: string }, IEvent> {
    private types: EventTypes;

    private events: Record<keyof EventTypes, Set<(event: IEvent) => void>>;

    constructor(options: { types: EventTypes }) {
        this.types = options.types;

        this.events = this.getInitialEvents();
    }

    public addListener = (type: keyof EventTypes, listener: (event: IEvent) => void) => {
        this.events[type].add(listener);
    };

    public removeListener = (type: keyof EventTypes, listener?: (event: IEvent) => void) => {
        listener && this.events[type].delete(listener);
    };

    public dispatchEvent = (type: keyof EventTypes, event: IEvent) => {
        this.events[type].forEach((listener) => listener(event));
    };

    public clean = () => {
        this.events = this.getInitialEvents();
    };

    private getInitialEvents = () => {
        return (Object.keys(this.types) as Array<keyof EventTypes>).reduce((acc, type) => {
            acc[type] = new Set();

            return acc;
        }, {} as Record<keyof EventTypes, Set<(event: IEvent) => void>>);
    };
}

export { EventsEmitter };
