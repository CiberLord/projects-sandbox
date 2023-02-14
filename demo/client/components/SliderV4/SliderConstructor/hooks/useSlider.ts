import { IWithMode, modesMap } from '../modes';
import { useSliderModule } from '../../hooks/useSliderModule';

export const useSlider = (options: IWithMode) => {
    const { mode, ...sliderParams } = options;
    const module = modesMap[mode];

    return useSliderModule(module, sliderParams);
};
