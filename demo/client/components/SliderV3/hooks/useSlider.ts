import { useActiveSlide } from './handlers/useActiveSlide';
import { SliderApiFactory, ISliderOptionsBase } from '../types';
import { useSliderApiFactory } from './useSliderApiFactory';
import { useSlidesCount } from './handlers/useSlidesCount';
import { useUpdateOnResize } from './handlers/useUpdateOnResize';

interface IUseSliderOptions extends ISliderOptionsBase {
    mode: SliderApiFactory;
}

export const useSlider = (options: IUseSliderOptions) => {
    const { mode, ...apiOptions } = options;

    const slider = useSliderApiFactory(mode, apiOptions);
    const { activeSlide } = useActiveSlide({ slider });
    const { slidesCount } = useSlidesCount({ slider });

    if (apiOptions.isUpdateOnResize) {
        useUpdateOnResize({ slider });
    }

    return {
        slider,
        activeSlide,
        slidesCount,
    };
};
