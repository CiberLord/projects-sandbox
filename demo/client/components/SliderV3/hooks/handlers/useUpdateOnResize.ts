import debounce from 'lodash/debounce';

import { useCallback, useLayoutEffect } from 'react';
import { ISliderInjectedOptions } from '../../types';

export const useUpdateOnResize = ({ slider }: ISliderInjectedOptions) => {
    const onResize = useCallback(
        debounce((event: UIEvent) => {
            slider.onUpdate?.();
        }, 200),
        [],
    );

    useLayoutEffect(() => {
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, [onResize]);
};
