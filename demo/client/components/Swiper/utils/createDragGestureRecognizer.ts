import { createGesture, dragAction } from '@use-gesture/vanilla';
import Hammer from 'hammerjs';

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
    dragStartHandler?: (event: IDragEvent) => void;
    dragHandler?: (event: IDragEvent) => void;
    dragEndHandler?: (event: IDragEvent) => void;
    swipeHandler?: (event: IDragEvent) => void;
}

export interface IGestureRecognizer {
    destroy: () => void;
}

interface IAxisVector {
    x: number;
    y: number;
}

const getDirectionAxis = (direction: number): IAxisVector => {
    switch (direction) {
        case Hammer.DIRECTION_DOWN: {
            return {
                x: 0,
                y: 1,
            };
        }
        case Hammer.DIRECTION_UP: {
            return {
                x: 0,
                y: -1,
            };
        }
        case Hammer.DIRECTION_LEFT: {
            return {
                x: -1,
                y: 0,
            };
        }
        case Hammer.DIRECTION_RIGHT: {
            return {
                x: 1,
                y: 0,
            };
        }
        default: {
            return {
                x: 0,
                y: 0,
            };
        }
    }
};

export const createDragGestureRecognizer = (config: IInitDragConfig): IGestureRecognizer => {
    const gestureManager = new Hammer(config.target, {
        touchAction: 'compute',
    });

    const preventDrag = false;

    gestureManager.on('panstart', (event) => {
        const directionAxis = getDirectionAxis(event.direction);

        if (directionAxis.y) {
            gestureManager.stop(true);
            return;
        }

        config?.dragStartHandler?.({
            deltaX: event.deltaX,
            deltaY: event.deltaY,
            directionX: directionAxis.x,
            directionY: directionAxis.y,
            velocityX: event.velocityX,
            velocityY: event.velocityY,
        });
    });

    gestureManager.on('panmove', (event) => {
        if (preventDrag) {
            return;
        }

        const directionAxis = getDirectionAxis(event.direction);

        config.dragHandler?.({
            deltaX: event.deltaX,
            deltaY: event.deltaY,
            directionX: directionAxis.x,
            directionY: directionAxis.y,
            velocityX: event.velocityX,
            velocityY: event.velocityY,
        });
    });

    gestureManager.on('panend', (event) => {
        if (preventDrag) {
            return;
        }

        const directionAxis = getDirectionAxis(event.direction);

        config.dragEndHandler?.({
            deltaX: event.deltaX,
            deltaY: event.deltaY,
            directionX: directionAxis.x,
            directionY: directionAxis.y,
            velocityX: event.velocityX,
            velocityY: event.velocityY,
        });
    });

    gestureManager.on('swipe', (event) => {
        if (preventDrag) {
            return;
        }

        const directionAxis = getDirectionAxis(event.direction);

        return config.swipeHandler?.({
            deltaX: event.deltaX,
            deltaY: event.deltaY,
            directionX: directionAxis.x,
            directionY: directionAxis.y,
            velocityX: event.velocityX,
            velocityY: event.velocityY,
        });
    });

    gestureManager.get('swipe').set({
        direction: Hammer.DIRECTION_ALL,
        threshold: 15,
    });

    gestureManager.get('pan').set({
        direction: Hammer.DIRECTION_ALL,
    });

    return gestureManager;

    // return gestureFactory(
    //     config.target,
    //     {
    //         onDrag: ({ movement, direction, velocity }) => {
    //             config.dragHandler({
    //                 deltaX: movement[0],
    //                 deltaY: movement[1],
    //                 directionX: direction[0],
    //                 directionY: direction[1],
    //                 velocityX: velocity[0],
    //                 velocityY: velocity[1],
    //             });
    //         },
    //         onDragEnd: ({ movement, swipe: [swipeX], direction, velocity }) => {
    //             const event = {
    //                 deltaX: movement[0],
    //                 deltaY: movement[1],
    //                 directionX: direction[0],
    //                 directionY: direction[1],
    //                 velocityX: velocity[0],
    //                 velocityY: velocity[1],
    //             };
    //
    //             if (swipeX !== 0) {
    //                 event.directionX = swipeX;
    //
    //                 return config.swipeHandler(event);
    //             }
    //
    //             config.dragEndHandler(event);
    //         },
    //     },
    //     {
    //         drag: {
    //             axis: 'lock',
    //             swipe: {
    //                 velocity: [0.3, 0.3],
    //                 distance: [20, 20],
    //                 duration: 260,
    //             },
    //         },
    //     },
    // );
};
