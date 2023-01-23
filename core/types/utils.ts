// eslint-disable-next-line @typescript-eslint/ban-types
export type EmptyObject = {};

export type AnyObject = { [key in string]: unknown };

export type Any = any;

export type TFunction<P extends any[], R> = (...args: P) => R;
