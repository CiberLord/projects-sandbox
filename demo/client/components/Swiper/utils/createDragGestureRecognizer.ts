import { createGesture, dragAction } from '@use-gesture/vanilla';

export interface IDragEvent {
    deltaX: number;
    deltaY: number;
    directionX: number;
    directionY: number;
    velocityX: number;
    velocityY: number;
}

export interface IInitDragConfig {
    target: HTMLDivElement;
    dragHandler: (event: IDragEvent) => void;
    dragEndHandler: (event: IDragEvent) => void;
    swipeHandler: (event: IDragEvent) => void;
}

export interface IGestureRecognizer {
    destroy: () => void;
}

export const createDragGestureRecognizer = (config: IInitDragConfig): IGestureRecognizer => {
    const gestureFactory = createGesture([dragAction]);

    return gestureFactory(
        config.target,
        {
            onDrag: ({ movement, direction, velocity }) => {
                config.dragHandler({
                    deltaX: movement[0],
                    deltaY: movement[1],
                    directionX: direction[0],
                    directionY: direction[1],
                    velocityX: velocity[0],
                    velocityY: velocity[1],
                });
            },
            onDragEnd: ({ movement, swipe: [swipeX], direction, velocity }) => {
                const event = {
                    deltaX: movement[0],
                    deltaY: movement[1],
                    directionX: direction[0],
                    directionY: direction[1],
                    velocityX: velocity[0],
                    velocityY: velocity[1],
                };

                if (swipeX !== 0) {
                    event.directionX = swipeX;

                    return config.swipeHandler(event);
                }

                config.dragEndHandler(event);
            },
        },
        {
            drag: {
                axis: 'x',
                swipe: {
                    velocity: [0.4, 0.4],
                    distance: [20, 20],
                    duration: 260,
                },
            },
        },
    );
};