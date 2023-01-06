export type AnyObject = Record<string, unknown>;

export type Any = any;

export type TFunction<P extends any[], R> = (...args: P) => R;
