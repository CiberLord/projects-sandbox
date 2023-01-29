class HandlersController<Handlers extends { [key in string]: string }, Event> {
    public types: Handlers;

    private handlersMap: Record<keyof Handlers, Array<(event: Event) => void>>;

    constructor(options: { types: Handlers }) {
        this.types = options.types;

        this.handlersMap = this.initHandlersState();
    }

    private initHandlersState = () => {
        return (Object.keys(this.types) as Array<keyof Handlers>).reduce((acc, key) => {
            acc[key] = [];
            return acc;
        }, {} as Record<keyof Handlers, Array<(event: Event) => void>>);
    };

    public addHandler = (type: keyof Handlers, listener: (event: Event) => void) => {
        this.handlersMap[type].push(listener);

        return this;
    };

    public dispatchHandlers = (type: keyof Handlers, event: Event) => {
        this.handlersMap[type].forEach((listener) => {
            listener(event);
        });
    };

    public destroy = () => {
        this.handlersMap = this.initHandlersState();
    };
}

export { HandlersController };
