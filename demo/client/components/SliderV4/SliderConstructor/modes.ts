import { IFreeScrollSliderOptions, module as FreeMode } from '../modules/FreeScrollSliderModule';
import { IStickySliderOptions, module as StickyMode } from '../modules/StickySliderModule';
import { ISliderModule } from '../types';

export enum Modes {
    FREE = 'FREE',
    STICKY = 'STICKY',
}

export const modesMap: Record<Modes, ISliderModule> = {
    [Modes.FREE]: FreeMode,
    [Modes.STICKY]: StickyMode,
};

type IModeConfig<K extends Modes, Options> = {
    mode: K;
} & Options;

export type IWithMode =
    | IModeConfig<Modes.FREE, IFreeScrollSliderOptions>
    | IModeConfig<Modes.STICKY, IStickySliderOptions>;
