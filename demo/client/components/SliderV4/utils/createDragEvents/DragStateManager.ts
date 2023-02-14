import { Axis, IDragEvent, Normal, NormalizeVector, IVector2 } from './types';

interface IDragState {
    startPosition: IVector2;
    delta: IVector2;
    direction: NormalizeVector;
    initialDirection: NormalizeVector;
    startTime: number;
    isFirst: boolean;
    isSwipe: boolean;
}

interface IInput {
    clientX: number;
    clientY: number;
}

interface IDragStateManagerOptions {
    axis: Axis;
}

const INITIAL_SWIPE_DISTANCE = 30;
const INITIAL_SWIPE_THRESHOLD = 250;

class DragStateManager {
    public state: IDragState;

    private moveCallsCount = 0;
    private axis: Axis;

    constructor(options: IDragStateManagerOptions) {
        this.axis = options.axis;
        this.state = this.getInitialState();
    }

    public onStart = (input: IInput) => {
        this.moveCallsCount = 0;
        this.state = this.getInitialState();
        this.state.startPosition.x = input.clientX;
        this.state.startPosition.y = input.clientY;
        this.state.startTime = new Date().getTime();
    };

    public onMove = (input: IInput) => {
        this.calcDelta(input);
        this.detectFirstMove();
        this.setDirection(this.state.delta, this.state.direction);

        if (this.state.isFirst) {
            this.setVector(this.state.direction, this.state.initialDirection);
        }
    };

    public onEnd = (input: IInput) => {
        this.calcDelta(input);
        this.setDirection(this.state.delta, this.state.direction);
        this.detectSwipe();
    };

    public getDragEvent = (): IDragEvent => {
        return {
            isFirst: this.state.isFirst,
            delta: this.state.delta,
            initialDirection: this.state.initialDirection,
            direction: this.state.direction,
        };
    };

    public isPreventScroll = () => {
        return this.state.initialDirection[this.axis] !== 0;
    };

    private getVector2 = () => {
        return { x: 0, y: 0 };
    };

    private getNormal = (value: number): Normal => {
        return (value / Math.abs(value)) as Normal;
    };

    private setVector = (source: IVector2, target: IVector2) => {
        target.x = source.x;
        target.y = source.y;
    };

    private setDirection = (source: IVector2, direction: IVector2) => {
        if (Math.abs(source.x) > Math.abs(source.y)) {
            direction.x = this.getNormal(source.x);
            direction.y = 0;
        } else {
            direction.x = 0;
            direction.y = this.getNormal(source.y);
        }

        return direction;
    };

    private detectFirstMove = () => {
        if (this.state.isFirst) {
            this.moveCallsCount += 1;
        }

        if (this.moveCallsCount > 1) {
            this.state.isFirst = false;
        }
    };

    private detectSwipe = () => {
        const deltaTime = new Date().getTime() - this.state.startTime;
        const allowThreshold = deltaTime < INITIAL_SWIPE_THRESHOLD;
        const allowDistance = Math.abs(this.state.delta[this.axis]) > INITIAL_SWIPE_DISTANCE;

        this.state.isSwipe = allowThreshold && allowDistance;
    };

    private calcDelta = (input: IInput) => {
        this.state.delta.x = input.clientX - this.state.startPosition.x;
        this.state.delta.y = input.clientY - this.state.startPosition.y;
    };

    private getInitialState = (): IDragState => {
        return {
            startPosition: this.getVector2(),
            delta: this.getVector2(),
            direction: this.getVector2() as NormalizeVector,
            initialDirection: this.getVector2() as NormalizeVector,
            startTime: 0,
            isFirst: true,
            isSwipe: false,
        };
    };
}

export { DragStateManager };
