// eslint-disable-next-line @typescript-eslint/ban-types
export type EmptyObject = {};

export type Any = any;

export type TFunction<P extends any[], R> = (...args: P) => R;
