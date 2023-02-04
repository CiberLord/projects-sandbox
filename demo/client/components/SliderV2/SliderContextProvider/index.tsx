import React, { PropsWithChildren, useMemo } from 'react';

import { ISliderContext, ISliderContextProviderProps } from './types';
import { SliderContext } from './context';

export const SliderContextProvider = React.memo<PropsWithChildren<ISliderContextProviderProps>>(
    ({ slideClassName, children, removeSlideElement, addSlideElement }) => {
        const values = useMemo<ISliderContext>(() => {
            return {
                slideClassName,
                removeSlideElement,
                addSlideElement,
            };
        }, [slideClassName, removeSlideElement, addSlideElement]);

        return <SliderContext.Provider value={values}>{children}</SliderContext.Provider>;
    },
);
