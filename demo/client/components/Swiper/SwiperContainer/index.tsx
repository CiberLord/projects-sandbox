import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import cn from 'classnames';
import { animated } from '@react-spring/web';

import { ISwiperConfig, ISwiperContainerProps } from '../types';
import { SwiperSlidesDataContext, SwiperMethodsContext } from '../context';
import { useSwiper } from '../hooks';
import { ISwiperPluginInput } from '../plugins';

export function SwiperContainer<Input extends ISwiperPluginInput>({
    children,
    className,
    paginator: Paginator,
    arrows: Arrows,
    ...config
}: PropsWithChildren<ISwiperContainerProps<Input>>) {
    const { plugin, nodes, data, slidesData, methods, classNames } = useSwiper<Input>(
        config as unknown as ISwiperConfig<Input>,
    );

    return (
        <SwiperMethodsContext.Provider value={methods}>
            <SwiperSlidesDataContext.Provider value={slidesData}>
                <div
                    ref={nodes.container}
                    className={cn(className, classNames.containerClassName)}>
                    <div
                        ref={nodes.slidesList}
                        className={classNames.slidesListClassName}>
                        <animated.div
                            ref={nodes.slidesTrack}
                            className={classNames.slidesTrackClassName}
                            style={plugin.getStyle().slidesTrack}>
                            {children}
                        </animated.div>
                    </div>
                    {Arrows && (
                        <Arrows
                            plugin={plugin}
                            currentIndex={data.currentIndex}
                            slidesCount={data.slidesCount}
                            toNext={methods.toNext}
                            toPrevious={methods.toPrevious}
                        />
                    )}
                    {Paginator && (
                        <Paginator
                            plugin={plugin}
                            currentIndex={data.currentIndex}
                            slidesCount={data.slidesCount}
                            setSlide={methods.setSlide}
                        />
                    )}
                </div>
            </SwiperSlidesDataContext.Provider>
        </SwiperMethodsContext.Provider>
    );
}
